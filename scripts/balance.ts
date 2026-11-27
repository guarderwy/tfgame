import {
  BASE_TILE, COLS, difficultyScale, ENEMY_CONFIG, HEIGHT, MAX_LEVEL, ROWS, SELL_REFUND,
  TILE, TOWER_CONFIG, TOWER_UNLOCK, UPGRADE_FACTOR, WAVE_BREAK_BONUS,
  WAVE_CLEAR_BONUS_BASE, WAVE_CLEAR_BONUS_PER_LEVEL, WIDTH, tileToPixel,
} from '../src/config.ts';
import { LEVELS } from '../src/levels.ts';
import type { Enemy, NavalMine, PathData, Projectile, SpawnTask, Tower } from '../src/gameTypes.ts';
import type { EnemyType, LevelDef, PathKind, TowerType } from '../src/types.ts';

declare const process: { env: Record<string, string | undefined>; argv: string[]; exitCode?: number };

type PolicyName = 'average' | 'strong' | 'frugal';

interface Policy {
  topN: number;
  maxTowers: number;
  manualStart: boolean;
  reserveRatio: number;
}

const POLICIES: Record<PolicyName, Policy> = {
  average: { topN: 3, maxTowers: 18, manualStart: true, reserveRatio: 0 },
  strong: { topN: 3, maxTowers: 30, manualStart: true, reserveRatio: 0 },
  frugal: { topN: 5, maxTowers: 12, manualStart: false, reserveRatio: 0.2 },
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function key(x: number, y: number) { return `${x},${y}`; }

function expandTiles(raw: number[][]): number[][] {
  const out: number[][] = [];
  const push = (x: number, y: number) => {
    if (!out.some((p) => p[0] === x && p[1] === y)) out.push([x, y]);
  };
  push(raw[0][0], raw[0][1]);
  for (let i = 0; i < raw.length - 1; i++) {
    const [x1, y1] = raw[i];
    const [x2, y2] = raw[i + 1];
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let s = 1; s <= steps; s++) {
      push(Math.round(x1 + ((x2 - x1) * s) / steps), Math.round(y1 + ((y2 - y1) * s) / steps));
    }
  }
  return out;
}

function makePath(raw: number[][]): PathData {
  const tiles = expandTiles(raw);
  const points = tiles.map(([x, y]) => tileToPixel(x, y));
  let length = 0;
  for (let i = 1; i < points.length; i++) length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  return { tiles, points, length };
}

function makeAirPath(rng: () => number): PathData {
  const start = { x: -40, y: 70 + rng() * 320 };
  const end = tileToPixel(BASE_TILE[0], BASE_TILE[1]);
  return { tiles: [], points: [start, end], length: Math.hypot(end.x - start.x, end.y - start.y) };
}

class Sim {
  readonly level: LevelDef;
  readonly rng: () => number;
  readonly groundPaths: PathData[];
  readonly waterPaths: PathData[];
  readonly pathTiles: Set<string>;

  gold: number;
  lives: number;
  waveIndex = -1;
  status: 'ready' | 'wave' | 'cleared' | 'won' | 'lost' = 'ready';
  towers: Tower[] = [];
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  mines: NavalMine[] = [];
  schedule: SpawnTask[] = [];
  waveTime = 0;
  countdown = 0;
  private id = 0;

  income: number;
  spent = 0;
  kills = 0;
  spawned = 0;
  leaked = 0;
  peakPendingGold: number;

  constructor(level: LevelDef, seed: number) {
    this.level = level;
    this.rng = mulberry32(seed);
    this.groundPaths = level.ground.map(makePath);
    this.waterPaths = level.water.map(makePath);
    this.pathTiles = new Set<string>();
    [...this.groundPaths, ...this.waterPaths].forEach((p) => p.tiles.forEach(([x, y]) => this.pathTiles.add(key(x, y))));
    this.gold = level.gold;
    this.lives = level.lives;
    this.income = level.gold;
    this.peakPendingGold = level.gold;
  }

  recordPendingGold() {
    this.peakPendingGold = Math.max(this.peakPendingGold, this.gold);
  }

  canBuild(tx: number, ty: number) {
    return tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS && !this.pathTiles.has(key(tx, ty)) && !this.towers.some((t) => t.tx === tx && t.ty === ty);
  }

  build(tx: number, ty: number, type: TowerType) {
    const cfg = TOWER_CONFIG[type];
    if (this.gold < cfg.cost || !this.canBuild(tx, ty)) return false;
    this.gold -= cfg.cost;
    this.spent += cfg.cost;
    const pos = tileToPixel(tx, ty);
    const tower: Tower = {
      id: ++this.id, type, targetMode: 'weak', level: 1, tx, ty, x: pos.x, y: pos.y,
      damage: cfg.damage, range: cfg.range, fireRate: cfg.fireRate,
      cooldown: 0, totalCost: cfg.cost, angle: -Math.PI / 2,
    };
    this.towers.push(tower);
    if (cfg.minelayer) this.layMines(tower);
    return true;
  }

  upgradeCost(t: Tower) {
    return Math.round(TOWER_CONFIG[t.type].cost * (UPGRADE_FACTOR.cost + 0.6 * (t.level - 1)));
  }

  upgrade(t: Tower) {
    if (t.level >= MAX_LEVEL) return false;
    const cost = this.upgradeCost(t);
    if (this.gold < cost) return false;
    this.gold -= cost;
    this.spent += cost;
    t.totalCost += cost;
    t.level += 1;
    t.damage *= UPGRADE_FACTOR.damage;
    t.range *= UPGRADE_FACTOR.range;
    t.fireRate *= UPGRADE_FACTOR.fireRate;
    if (TOWER_CONFIG[t.type].minelayer) {
      t.refillAll = true;
      this.layMines(t);
    }
    return true;
  }

  startWave(manual: boolean) {
    if (this.status === 'wave' || this.status === 'won' || this.status === 'lost') return;
    if (manual && this.status === 'cleared') {
      this.gold += WAVE_BREAK_BONUS;
      this.income += WAVE_BREAK_BONUS;
    }
    if (this.waveIndex + 1 >= this.level.waves.length) return;
    this.waveIndex += 1;
    const wave = this.level.waves[this.waveIndex];
    if (!wave) return;
    const tasks: SpawnTask[] = [];
    wave.groups.forEach((group) => {
      for (let i = 0; i < group.count; i++) tasks.push({ time: group.delay + i * group.interval, group });
    });
    tasks.sort((a, b) => a.time - b.time);
    this.schedule = tasks;
    this.waveTime = 0;
    this.status = 'wave';
  }

  spawn(group: SpawnTask['group']) {
    const cfg = ENEMY_CONFIG[group.type];
    let path: PathData;
    if (cfg.kind === 'ground') path = this.groundPaths[group.lane % this.groundPaths.length];
    else if (cfg.kind === 'water') path = this.waterPaths[group.lane % this.waterPaths.length];
    else path = makeAirPath(this.rng);
    if (!path) return;
    const hp = cfg.hp * group.hpScale * difficultyScale(this.level.id);
    this.enemies.push({
      id: ++this.id, type: group.type, kind: cfg.kind, x: path.points[0].x, y: path.points[0].y,
      hp, maxHp: hp, armor: cfg.armor, speed: cfg.speed,
      bounty: Math.round(cfg.bounty * (0.7 + 0.28 * Math.sqrt(Math.max(0, group.hpScale * difficultyScale(this.level.id) - 1)))),
      damage: cfg.damage, size: cfg.size * (group.boss ? 1.5 : 1),
      footprint: (cfg.footprint ?? cfg.size * 2) * (group.boss ? 1.3 : 1),
      color: cfg.color, boss: !!group.boss, ability: cfg.ability,
      dashTimer: cfg.ability === 'dash' ? 2 + this.rng() * 2 : 0,
      dashActive: 0, path, index: 0, traveled: 0, angle: 0, dead: false,
    });
    this.spawned += 1;
  }

  placeOnPath(e: Enemy, traveled: number) {
    const pts = e.path.points;
    if (pts.length < 2) {
      if (pts[0]) { e.x = pts[0].x; e.y = pts[0].y; }
      e.index = 0;
      e.traveled = traveled;
      return;
    }
    if (traveled < 0) {
      const dx = pts[1].x - pts[0].x;
      const dy = pts[1].y - pts[0].y;
      const len = Math.hypot(dx, dy) || 1;
      e.x = pts[0].x + (dx / len) * traveled;
      e.y = pts[0].y + (dy / len) * traveled;
      e.index = 0;
      e.traveled = traveled;
      return;
    }
    let remain = traveled;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const seg = Math.hypot(b.x - a.x, b.y - a.y);
      if (remain <= seg) {
        const r = seg > 0 ? remain / seg : 0;
        e.x = a.x + (b.x - a.x) * r;
        e.y = a.y + (b.y - a.y) * r;
        e.index = i;
        e.traveled = traveled;
        return;
      }
      remain -= seg;
    }
    const last = pts[pts.length - 1];
    e.x = last.x;
    e.y = last.y;
    e.index = pts.length - 2;
    e.traveled = traveled;
  }

  enforceSpacing() {
    const lanes = new Map<PathData, Enemy[]>();
    for (const e of this.enemies) {
      if (e.dead || e.kind === 'air') continue;
      let list = lanes.get(e.path);
      if (!list) { list = []; lanes.set(e.path, list); }
      list.push(e);
    }
    for (const list of lanes.values()) {
      if (list.length < 2) continue;
      list.sort((a, b) => b.traveled - a.traveled);
      for (let i = 1; i < list.length; i++) {
        const leader = list[i - 1];
        const follower = list[i];
        const gap = (leader.footprint + follower.footprint) * 0.5 + 8;
        const limit = leader.traveled - gap;
        if (follower.traveled > limit) this.placeOnPath(follower, limit);
      }
    }
  }

  findTarget(t: Tower): Enemy | null {
    let best: Enemy | null = null;
    let bestScore = Infinity;
    let bestRemaining = Infinity;
    for (const e of this.enemies) {
      if (e.dead) continue;
      if (e.x < 0 || e.x > WIDTH || e.y < 0 || e.y > HEIGHT) continue;
      if (!TOWER_CONFIG[t.type].targets.includes(e.kind)) continue;
      const dist = Math.hypot(e.x - t.x, e.y - t.y);
      if (dist > t.range) continue;
      const remaining = e.path.length - e.traveled;
      const score = t.targetMode === 'weak' ? e.hp : remaining;
      if (score < bestScore || (score === bestScore && remaining < bestRemaining)) {
        bestScore = score;
        bestRemaining = remaining;
        best = e;
      }
    }
    return best;
  }

  fire(t: Tower, target: Enemy) {
    const cfg = TOWER_CONFIG[t.type];
    const dx = target.x - t.x;
    const dy = target.y - t.y;
    const d = Math.hypot(dx, dy) || 1;
    const edgeX = dx > 0 ? (WIDTH - t.x) * d / dx : dx < 0 ? -t.x * d / dx : Infinity;
    const edgeY = dy > 0 ? (HEIGHT - t.y) * d / dy : dy < 0 ? -t.y * d / dy : Infinity;
    this.projectiles.push({
      x: t.x, y: t.y, target, lastX: t.x, lastY: t.y,
      vx: dx / d, vy: dy / d, distance: 0, maxDistance: Math.min(d + 6, Math.min(edgeX, edgeY) + 2),
      speed: cfg.projectileSpeed, damage: t.damage, splash: cfg.splash,
      pierceArmor: !!cfg.pierceArmor, chain: cfg.chain || 0,
      color: cfg.color, alive: true, type: t.type, originX: t.x, originY: t.y,
    });
  }

  damageEnemy(e: Enemy, amount: number, pierce = false) {
    if (e.dead) return;
    const dealt = pierce ? amount : amount * (1 - e.armor / (e.armor + 50));
    e.hp -= dealt;
    if (e.hp <= 0) {
      e.dead = true;
      this.gold += e.bounty;
      this.income += e.bounty;
      this.kills += 1;
    }
  }

  segmentHitT(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, r: number): number | null {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    let t = len2 > 0 ? ((cx - x1) * dx + (cy - y1) * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    const px = x1 + dx * t;
    const py = y1 + dy * t;
    return (cx - px) * (cx - px) + (cy - py) * (cy - py) <= r * r ? t : null;
  }

  nearestWaterPoint(x: number, y: number, maxDist: number): { point: { x: number; y: number }; tangent: { x: number; y: number } } | null {
    let best: { point: { x: number; y: number }; tangent: { x: number; y: number }; dist: number } | null = null;
    for (const path of this.waterPaths) {
      for (let i = 0; i < path.points.length; i++) {
        const p = path.points[i];
        const d = Math.hypot(p.x - x, p.y - y);
        if (best && d >= best.dist) continue;
        const prev = path.points[Math.max(0, i - 1)];
        const next = path.points[Math.min(path.points.length - 1, i + 1)];
        const tx = next.x - prev.x;
        const ty = next.y - prev.y;
        const len = Math.hypot(tx, ty) || 1;
        best = { point: p, tangent: { x: tx / len, y: ty / len }, dist: d };
      }
    }
    return best && best.dist <= maxDist ? { point: best.point, tangent: best.tangent } : null;
  }

  placeMine(t: Tower, spot: { point: { x: number; y: number }; tangent: { x: number; y: number } }) {
    const cfg = TOWER_CONFIG[t.type];
    for (let slot = 0; slot < 5; slot++) {
      const offset = (slot - 2) * 26;
      const x = spot.point.x + spot.tangent.x * offset;
      const y = spot.point.y + spot.tangent.y * offset;
      if (this.mines.some((m) => Math.hypot(m.x - x, m.y - y) < 10)) continue;
      this.mines.push({ id: ++this.id, ownerId: t.id, x, y, damage: t.damage, splash: cfg.splash, color: cfg.color });
      return true;
    }
    return false;
  }

  layMines(t: Tower) {
    const cfg = TOWER_CONFIG[t.type];
    const existing = this.mines.filter((m) => m.ownerId === t.id).length;
    const capacity = t.level + 2;
    if (existing >= capacity) return;
    const full = !t.initialized || t.refillAll;
    const need = full ? capacity - existing : 1;
    t.initialized = true;
    t.refillAll = false;
    const spot = this.nearestWaterPoint(t.x, t.y, t.range);
    if (!spot) return;
    for (let i = 0; i < need; i++) if (!this.placeMine(t, spot)) break;
  }

  detonateMine(mine: NavalMine) {
    for (const e of this.enemies) {
      if (e.dead || e.kind !== 'water') continue;
      if (Math.hypot(e.x - mine.x, e.y - mine.y) <= mine.splash) this.damageEnemy(e, mine.damage);
    }
  }

  hit(p: Projectile) {
    p.alive = false;
    const px = p.lastX;
    const py = p.lastY;
    if (p.splash > 0) {
      for (const e of this.enemies) {
        if (!e.dead && Math.hypot(e.x - px, e.y - py) <= p.splash) this.damageEnemy(e, p.damage, p.pierceArmor);
      }
    } else {
      let hitAny = false;
      if (p.target && !p.target.dead && Math.hypot(p.target.x - px, p.target.y - py) <= 18) {
        this.damageEnemy(p.target, p.damage, p.pierceArmor);
        hitAny = true;
      }
      if (p.chain > 0) {
        const candidates = this.enemies
          .filter((e) => !e.dead && e !== p.target && Math.hypot(e.x - px, e.y - py) <= 95)
          .sort((a, b) => Math.hypot(a.x - px, a.y - py) - Math.hypot(b.x - px, b.y - py))
          .slice(0, p.chain);
        candidates.forEach((e) => this.damageEnemy(e, p.damage * 0.6, p.pierceArmor));
        hitAny = true;
      }
      void hitAny;
    }
  }

  reachBase(e: Enemy) {
    e.dead = true;
    this.lives -= e.damage;
    this.leaked += 1;
    if (this.lives <= 0) {
      this.lives = 0;
      this.status = 'lost';
    }
  }

  update(dt: number) {
    if (this.status === 'won' || this.status === 'lost') return;
    if (this.status === 'cleared') {
      this.countdown -= dt;
      if (this.countdown <= 0) this.startWave(false);
    }
    if (this.status !== 'wave') return;
    this.waveTime += dt;
    while (this.schedule.length && this.schedule[0].time <= this.waveTime) this.spawn(this.schedule.shift()!.group);

    for (const e of this.enemies) {
      if (e.dead) continue;
      const eCfg = ENEMY_CONFIG[e.type];
      if (eCfg.ability === 'regen' && e.hp < e.maxHp) e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.008 * dt);
      let moveSpeed = e.speed;
      if (eCfg.ability === 'dash') {
        e.dashTimer = (e.dashTimer ?? 0) - dt;
        if (e.dashTimer <= 0) { e.dashTimer = 4.5; e.dashActive = 1.1; }
        if ((e.dashActive ?? 0) > 0) {
          e.dashActive = Math.max(0, (e.dashActive ?? 0) - dt);
          moveSpeed *= 1.7;
        }
      }
      const next = e.path.points[e.index + 1];
      if (!next) { this.reachBase(e); continue; }
      const dx = next.x - e.x;
      const dy = next.y - e.y;
      const d = Math.hypot(dx, dy);
      const step = moveSpeed * dt;
      if (d <= step) {
        e.x = next.x; e.y = next.y;
        e.traveled += d;
        e.index += 1;
        if (e.index >= e.path.points.length - 1) this.reachBase(e);
      } else {
        e.x += (dx / d) * step;
        e.y += (dy / d) * step;
        e.traveled += step;
      }
      if ((this.status as string) === 'lost') return;
    }

    this.enforceSpacing();

    for (const t of this.towers) {
      t.cooldown -= dt;
      if (t.cooldown > 0) continue;
      const cfg = TOWER_CONFIG[t.type];
      if (cfg.minelayer) {
        this.layMines(t);
        t.cooldown = 1 / t.fireRate;
        continue;
      }
      const target = this.findTarget(t);
      if (target) { this.fire(t, target); t.cooldown = 1 / t.fireRate; }
    }

    const detonated = new Set<number>();
    for (const mine of this.mines) {
      for (const e of this.enemies) {
        if (e.dead || e.kind !== 'water') continue;
        if (Math.hypot(e.x - mine.x, e.y - mine.y) <= Math.max(12, e.size * 0.6)) {
          this.detonateMine(mine);
          detonated.add(mine.id);
          break;
        }
      }
    }
    if (detonated.size) this.mines = this.mines.filter((m) => !detonated.has(m.id));

    for (const p of this.projectiles) {
      if (!p.alive) continue;
      const step = p.speed * dt;
      const segX = p.x;
      const segY = p.y;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.distance += step;
      p.lastX = p.x;
      p.lastY = p.y;
      if (p.x < 0 || p.x > WIDTH || p.y < 0 || p.y > HEIGHT) { p.alive = false; continue; }
      let hitT: number | null = null;
      let hitEnemy: Enemy | null = null;
      for (const e of this.enemies) {
        if (e.dead) continue;
        const reach = Math.max(9, e.size * 0.6 + 3);
        const t = this.segmentHitT(segX, segY, p.x, p.y, e.x, e.y, reach);
        if (t !== null) { hitT = t; hitEnemy = e; break; }
      }
      if (hitT !== null) {
        p.x = segX + (p.x - segX) * hitT;
        p.y = segY + (p.y - segY) * hitT;
        p.lastX = p.x;
        p.lastY = p.y;
        if (hitEnemy) p.target = hitEnemy;
        this.hit(p);
        continue;
      }
      if (p.distance >= p.maxDistance) this.hit(p);
    }

    this.enemies = this.enemies.filter((e) => !e.dead);
    this.projectiles = this.projectiles.filter((p) => p.alive);

    if (this.status === 'wave' && this.schedule.length === 0 && this.enemies.length === 0) {
      if (this.waveIndex + 1 >= this.level.waves.length) {
        this.status = 'won';
      } else {
        this.status = 'cleared';
        this.countdown = 6;
        const bonus = WAVE_CLEAR_BONUS_BASE + this.level.id * WAVE_CLEAR_BONUS_PER_LEVEL;
        this.gold += bonus;
        this.income += bonus;
      }
    }
  }
}

interface Site {
  tx: number;
  ty: number;
  x: number;
  y: number;
  ground: number[];
  water: number[];
  air: number;
}

interface Threat {
  total: number;
  kindHp: Record<PathKind, number>;
  groundLaneHp: number[];
  waterLaneHp: number[];
  armor: Record<PathKind, number>;
}

function coverageOfPath(site: Site, path: PathData, range: number) {
  if (path.points.length < 2) return 0;
  let samples = 0;
  let hits = 0;
  for (let i = 0; i < path.points.length - 1; i++) {
    const a = path.points[i];
    const b = path.points[i + 1];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.ceil(seg / 18));
    for (let s = 0; s < steps; s++) {
      const r = s / steps;
      const x = a.x + (b.x - a.x) * r;
      const y = a.y + (b.y - a.y) * r;
      samples += 1;
      if (Math.hypot(x - site.x, y - site.y) <= range) hits += 1;
    }
  }
  return samples ? hits / samples : 0;
}

function buildSites(level: LevelDef): Site[] {
  const blocked = new Set<string>();
  [...makePathCache.values()].forEach((p) => p.tiles.forEach(([x, y]) => blocked.add(key(x, y))));
  const sites: Site[] = [];
  for (let ty = 0; ty < ROWS; ty++) {
    for (let tx = 0; tx < COLS; tx++) {
      if (blocked.has(key(tx, ty))) continue;
      const pos = tileToPixel(tx, ty);
      const site: Site = {
        tx, ty, x: pos.x, y: pos.y,
        ground: [], water: [], air: 0,
      };
      const range = 170;
      site.ground = level.ground.map((_, i) => coverageOfPath(site, makePathCache.get(`g${i}`)!, range));
      site.water = level.water.map((_, i) => coverageOfPath(site, makePathCache.get(`w${i}`)!, range));
      site.air = airPathCache.reduce((sum, p) => sum + coverageOfPath(site, p, range), 0) / airPathCache.length;
      if (site.ground.some((v) => v > 0) || site.water.some((v) => v > 0) || site.air > 0) sites.push(site);
    }
  }
  return sites;
}

function remainingThreat(level: LevelDef, fromWave: number): Threat {
  const kindHp: Record<PathKind, number> = { ground: 0, air: 0, water: 0 };
  const armorSum: Record<PathKind, number> = { ground: 0, air: 0, water: 0 };
  const groundLaneHp = level.ground.map(() => 0);
  const waterLaneHp = level.water.map(() => 0);
  for (let w = fromWave; w < level.waves.length; w++) {
    level.waves[w].groups.forEach((group, idx) => {
      const cfg = ENEMY_CONFIG[group.type];
      const hp = cfg.hp * group.hpScale * difficultyScale(level.id) * group.count;
      kindHp[cfg.kind] += hp;
      armorSum[cfg.kind] += cfg.armor * hp;
      if (cfg.kind === 'ground' && groundLaneHp.length) groundLaneHp[group.lane % groundLaneHp.length] += hp;
      if (cfg.kind === 'water' && waterLaneHp.length) waterLaneHp[group.lane % waterLaneHp.length] += hp;
      void idx;
    });
  }
  const armor = { ground: 0, air: 0, water: 0 } as Record<PathKind, number>;
  (['ground', 'air', 'water'] as PathKind[]).forEach((k) => {
    armor[k] = kindHp[k] > 0 ? armorSum[k] / kindHp[k] : 0;
  });
  const total = kindHp.ground + kindHp.air + kindHp.water;
  if (DEBUG_LEVEL === level.id && fromWave === 0) {
    console.log(`  [threat] 关${level.id} ground=${Math.round(kindHp.ground)} air=${Math.round(kindHp.air)} water=${Math.round(kindHp.water)}`);
  }
  return { total, kindHp, groundLaneHp, waterLaneHp, armor };
}

function towerDps(type: TowerType, towerLevel: number) {
  const cfg = TOWER_CONFIG[type];
  const damage = cfg.damage * UPGRADE_FACTOR.damage ** (towerLevel - 1);
  const rate = cfg.fireRate * UPGRADE_FACTOR.fireRate ** (towerLevel - 1);
  let multiplier = 1;
  if (cfg.chain) multiplier += 0.6 * cfg.chain;
  if (type === 'howitzer') multiplier = 1.35;
  if (type === 'flak') multiplier = 1.5;
  if (type === 'coastal') multiplier = 1.15;
  if (type === 'mine') multiplier = 2.4;
  if (cfg.pierceArmor) multiplier *= 1.12;
  return damage * rate * multiplier;
}

function contributions(type: TowerType, towerLevel: number, site: Site, threat: Threat): Record<PathKind, number> {
  const out: Record<PathKind, number> = { ground: 0, air: 0, water: 0 };
  const cfg = TOWER_CONFIG[type];
  if (cfg.minelayer && site.water.every((v) => v <= 0)) return out;
  const range = cfg.range * UPGRADE_FACTOR.range ** (towerLevel - 1);
  const groundCoverage = site.ground.map((_, i) => coverageOfPath(site, makePathCache.get(`g${i}`)!, range));
  const waterCoverage = site.water.map((_, i) => coverageOfPath(site, makePathCache.get(`w${i}`)!, range));
  const airCoverage = airPathCache.reduce((sum, p) => sum + coverageOfPath(site, p, range), 0) / airPathCache.length;
  const dps = towerDps(type, towerLevel);
  if (threat.kindHp.ground > 0 && cfg.targets.includes('ground')) {
    const armorFactor = cfg.pierceArmor ? 1 : 1 - threat.armor.ground / (threat.armor.ground + 50);
    threat.groundLaneHp.forEach((hp, i) => {
      out.ground += hp / threat.total * (groundCoverage[i] ?? 0) * dps * armorFactor;
    });
  }
  if (threat.kindHp.air > 0 && cfg.targets.includes('air')) {
    out.air += threat.kindHp.air / threat.total * airCoverage * dps;
  }
  if (threat.kindHp.water > 0 && cfg.targets.includes('water')) {
    const armorFactor = cfg.pierceArmor ? 1 : 1 - threat.armor.water / (threat.armor.water + 50);
    threat.waterLaneHp.forEach((hp, i) => {
      out.water += hp / threat.total * (waterCoverage[i] ?? 0) * dps * armorFactor;
    });
  }
  return out;
}

function utility(type: TowerType, towerLevel: number, site: Site, threat: Threat) {
  const c = contributions(type, towerLevel, site, threat);
  return c.ground + c.air + c.water;
}

let makePathCache = new Map<string, PathData>();
let airPathCache: PathData[] = [];

function prepareLevel(level: LevelDef) {
  makePathCache = new Map();
  level.ground.forEach((raw, i) => makePathCache.set(`g${i}`, makePath(raw)));
  level.water.forEach((raw, i) => makePathCache.set(`w${i}`, makePath(raw)));
  airPathCache = Array.from({ length: 5 }, (_, i) => makeAirPath(mulberry32(level.id * 1009 + i * 7919)));
}

const DEBUG_LEVEL = process.env.BALANCE_DEBUG_LEVEL ? Number(process.env.BALANCE_DEBUG_LEVEL) : 0;

function spendGold(sim: Sim, sites: Site[], policy: Policy, policyName: PolicyName, rng: () => number) {
  const threat = remainingThreat(sim.level, Math.max(0, sim.waveIndex + 1));
  const reserve = sim.income * policy.reserveRatio;
  if (DEBUG_LEVEL === sim.level.id) {
    console.log(`  [spend:${policyName}] wave=${sim.waveIndex + 1} gold=${sim.gold} income=${sim.income} towers=${sim.towers.length} sites=${sites.length} threat=${Math.round(threat.total)} reserve=${reserve}`);
  }
  for (let step = 0; step < 60; step++) {
    const usableGold = sim.gold - reserve;
    if (usableGold <= 0) break;
    const options: { utility: number; label: string; action: () => void }[] = [];
    const unlocked = (Object.keys(TOWER_CONFIG) as TowerType[]).filter((t) => TOWER_UNLOCK[t] <= sim.level.id);
    const current: Record<PathKind, number> = { ground: 0, air: 0, water: 0 };
    for (const t of sim.towers) {
      const site = sites.find((s) => s.tx === t.tx && s.ty === t.ty);
      if (!site) continue;
      const c = contributions(t.type, t.level, site, threat);
      current.ground += c.ground;
      current.air += c.air;
      current.water += c.water;
    }
    const currentTotal = current.ground + current.air + current.water;
    const addOption = (delta: Record<PathKind, number>, cost: number, label: string, action: () => void) => {
      const raw = delta.ground + delta.air + delta.water;
      if (raw <= 0) return;
      let primary: PathKind = 'ground';
      if (delta.air > delta[primary]) primary = 'air';
      if (delta.water > delta[primary]) primary = 'water';
      const targetShare = threat.kindHp[primary] / threat.total;
      const currentShare = currentTotal > 0 ? current[primary] / currentTotal : 0;
      const balance = Math.max(0.2, Math.min(3, targetShare / Math.max(targetShare * 0.25, currentShare)));
      options.push({ utility: raw * balance / cost, label, action });
    };

    for (const type of unlocked) {
      const cost = TOWER_CONFIG[type].cost;
      if (cost > usableGold) continue;
      if (sim.towers.length >= policy.maxTowers) break;
      for (const site of sites) {
        if (!sim.canBuild(site.tx, site.ty)) continue;
        const delta = contributions(type, 1, site, threat);
        addOption(delta, cost, `建 ${type}@${site.tx},${site.ty}`, () => { sim.build(site.tx, site.ty, type); });
      }
    }
    for (const t of sim.towers) {
      if (t.level >= MAX_LEVEL) continue;
      const cost = sim.upgradeCost(t);
      if (cost > usableGold) continue;
      const site = sites.find((s) => s.tx === t.tx && s.ty === t.ty);
      if (!site) continue;
      const before = contributions(t.type, t.level, site, threat);
      const after = contributions(t.type, t.level + 1, site, threat);
      const delta: Record<PathKind, number> = {
        ground: after.ground - before.ground,
        air: after.air - before.air,
        water: after.water - before.water,
      };
      addOption(delta, cost, `升 ${t.type}@${t.tx},${t.ty}`, () => { sim.upgrade(t); });
    }
    if (!options.length) {
      if (DEBUG_LEVEL === sim.level.id) {
        const byType = (Object.keys(TOWER_CONFIG) as TowerType[]).map((type) => {
          const count = sites.filter((s) => sim.canBuild(s.tx, s.ty) && utility(type, 1, s, threat) > 0).length;
          return `${type}:${count}`;
        }).join(' ');
        console.log(`  [spend] 无可购项，剩余 ${sim.gold}；可用点位 ${byType}`);
      }
      break;
    }
    options.sort((a, b) => b.utility - a.utility);
    if (DEBUG_LEVEL === sim.level.id && step === 0) {
      console.log(`  [spend] 候选 ${options.length} 项：${options.slice(0, 5).map((o) => `${o.label}=${o.utility.toFixed(3)}`).join(' | ')}`);
    }
    const pick = options[Math.min(options.length - 1, Math.floor(rng() * Math.min(policy.topN, options.length)))];
    pick.action();
  }
}

interface RunResult {
  win: boolean;
  lifeRatio: number;
  stars: number;
  towerCount: number;
  upgradeCount: number;
  peakGoldRatio: number;
  leaked: number;
  killed: number;
  spawned: number;
  secs: number;
}

function simulate(level: LevelDef, seed: number, policyName: PolicyName): RunResult {
  prepareLevel(level);
  const rng = mulberry32(seed * 104729 + level.id * 7919);
  const sites = buildSites(level);
  const sim = new Sim(level, seed);
  const policy = POLICIES[policyName];

  sim.recordPendingGold();
  spendGold(sim, sites, policy, policyName, rng);
  if (policy.manualStart) sim.startWave(true);
  else sim.startWave(false);

  let spentThisWave = false;
  let secs = 0;
  for (let step = 0; step < 240000 && sim.status !== 'won' && sim.status !== 'lost'; step++) {
    if (sim.status === 'cleared' && !spentThisWave) {
      sim.recordPendingGold();
      spendGold(sim, sites, policy, policyName, rng);
      spentThisWave = true;
      if (policy.manualStart) sim.startWave(true);
    }
    if (sim.status === 'wave') spentThisWave = false;
    sim.update(1 / 60);
    secs += 1 / 60;
  }
  const lifeRatio = sim.lives / level.lives;
  const stars = lifeRatio >= 0.8 ? 3 : lifeRatio >= 0.5 ? 2 : 1;
  return {
    win: sim.status === 'won', lifeRatio, stars,
    towerCount: sim.towers.length,
    upgradeCount: sim.towers.reduce((sum, t) => sum + t.level - 1, 0),
    peakGoldRatio: sim.peakPendingGold / Math.max(1, sim.income),
    leaked: sim.leaked, killed: sim.kills, spawned: sim.spawned, secs,
  };
}

const SEEDS = (process.env.BALANCE_SEEDS ?? '11,29,47,83,101').split(',').map(Number).filter(Number.isFinite);
const POLICY_NAMES: PolicyName[] = ['frugal', 'average', 'strong'];

function fmt(n: number, digits = 0) { return n.toFixed(digits); }

function main() {
  const only = process.argv[2] ? Number(process.argv[2]) : null;
  const from = Number(process.env.BALANCE_FROM ?? 1);
  const to = Number(process.env.BALANCE_TO ?? LEVELS.length);
  const levels = only ? LEVELS.filter((l) => l.id === only) : LEVELS.filter((l) => l.id >= from && l.id <= to);
  console.log(`关卡数=${LEVELS.length}  每种策略每关跑 ${SEEDS.length} 个随机种子`);
  console.log('策略  关卡 | 胜率  剩余生命  3星率  塔数 升级 漏怪  待花金占比');
  let failures = 0;

  for (const level of levels) {
    for (const policy of POLICY_NAMES) {
      const runs = SEEDS.map((seed) => simulate(level, seed, policy));
      const winRate = runs.filter((r) => r.win).length / runs.length;
      const avgLife = runs.reduce((s, r) => s + (r.win ? r.lifeRatio : 0), 0) / runs.length;
      const star3 = runs.filter((r) => r.win && r.stars === 3).length / runs.length;
      const avgTowers = runs.reduce((s, r) => s + r.towerCount, 0) / runs.length;
      const avgUpgrades = runs.reduce((s, r) => s + r.upgradeCount, 0) / runs.length;
      const avgLeaked = runs.reduce((s, r) => s + r.leaked, 0) / runs.length;
      const peakGold = runs.reduce((s, r) => s + r.peakGoldRatio, 0) / runs.length;
      console.log(
        `${policy.padEnd(7)} ${String(level.id).padStart(2)} | ${fmt(winRate * 100, 0).padStart(3)}%  ${fmt(avgLife * 100, 1).padStart(5)}%  ${fmt(star3 * 100, 0).padStart(4)}%  ${fmt(avgTowers).padStart(3)}  ${fmt(avgUpgrades).padStart(3)}  ${fmt(avgLeaked, 1).padStart(4)}  ${fmt(peakGold * 100, 1).padStart(5)}%`,
      );
      if (policy === 'average' && (winRate < 1 || avgLife < 0.3 || avgLife > 0.72 || star3 > 0.35)) failures += 1;
      if (policy === 'strong' && winRate < 1) failures += 1;
      void SELL_REFUND;
    }
  }
  if (failures) {
    console.error(`\n平衡校验未通过：${failures} 项指标超出目标区间`);
    process.exitCode = 1;
  } else {
    console.log('\n平衡校验通过：普通策略全胜且剩余生命处于适中偏上区间，高手策略稳定通关。');
  }
}

main();
