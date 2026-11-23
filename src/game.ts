import {
  BASE_TILE, COLS, difficultyScale, ENEMY_CONFIG, HEIGHT, MAX_LEVEL, ROWS, SELL_REFUND,
  TILE, TOWER_CONFIG, UPGRADE_FACTOR, WIDTH, tileToPixel,
} from './config';
import { LEVELS } from './levels';
import { Renderer3D } from './renderer3d';
import { AudioKit } from './audio';
import type { Enemy, Effect, NavalMine, Particle, PathData, Projectile, SpawnTask, Tower } from './gameTypes';
import type { EnemyType, Point, SpawnGroup, TowerType } from './types';

const $ = (id: string) => document.getElementById(id)!;

const icon = (body: string) => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const UNIT_ICONS: Record<string, string> = {
  machinegun: icon('<rect x="18" y="43" width="28" height="11" rx="3"/><path d="M26 43V32h10v11"/><rect x="35" y="25" width="21" height="5" rx="2"/><rect x="35" y="33" width="21" height="5" rx="2"/>'),
  howitzer: icon('<rect x="12" y="44" width="40" height="10" rx="3"/><circle cx="21" cy="49" r="3.5"/><circle cx="43" cy="49" r="3.5"/><path d="M28 44L45 20"/><rect x="41" y="14" width="11" height="9" rx="2" transform="rotate(-35 46.5 18.5)"/>'),
  aa: icon('<rect x="18" y="44" width="28" height="10" rx="3"/><path d="M32 44L45 16"/><rect x="41" y="10" width="10" height="9" rx="2" transform="rotate(-22 46 14.5)"/><path d="M22 44V34h9"/>'),
  coastal: icon('<rect x="10" y="44" width="44" height="10" rx="3"/><path d="M24 44L46 22"/><rect x="42" y="15" width="14" height="9" rx="2"/><path d="M14 44V30h11"/>'),
  laser: icon('<rect x="16" y="43" width="32" height="11" rx="3"/><rect x="28" y="29" width="11" height="14" rx="2"/><path d="M39 36h12"/><path d="M56 36l-7-4v8z" fill="currentColor" stroke="none"/>'),
  flak: icon('<rect x="16" y="44" width="32" height="10" rx="3"/><path d="M27 44l9-20M35 44l7-18"/><circle cx="47" cy="17" r="7" stroke-dasharray="3 3"/>'),
  railgun: icon('<rect x="12" y="44" width="36" height="10" rx="3"/><rect x="24" y="32" width="32" height="4" rx="1"/><rect x="24" y="40" width="32" height="4" rx="1"/><path d="M30 36v4M38 36v4M46 36v4"/><path d="M58 34l5 4-5 4"/>'),
  tesla: icon('<path d="M23 54h18l-4-24H27z"/><path d="M32 30V18"/><circle cx="32" cy="14" r="4"/><path d="M26 12l-6-6M38 12l6-6M32 10V3"/>'),
  mine: icon('<rect x="10" y="42" width="44" height="11" rx="3"/><rect x="20" y="30" width="24" height="12" rx="2"/><path d="M32 30V14h16"/><circle cx="50" cy="14" r="5"/><path d="M8 56c6-3 12-3 18 0s12 3 18 0 12-3 14 0"/><circle cx="50" cy="14" r="2" fill="currentColor" stroke="none"/>'),
  infantry: icon('<circle cx="32" cy="17" r="7"/><path d="M32 24v19M22 31l10 5 10-5M26 43l-4 12M38 43l4 12"/>'),
  truck: icon('<rect x="8" y="30" width="32" height="17" rx="3"/><path d="M40 35h9l7 8v4H40z"/><circle cx="19" cy="49" r="4.5"/><circle cx="45" cy="49" r="4.5"/><path d="M14 35h18"/>'),
  tank: icon('<rect x="7" y="38" width="50" height="12" rx="6"/><circle cx="18" cy="44" r="3"/><circle cx="32" cy="44" r="3"/><circle cx="46" cy="44" r="3"/><path d="M19 38l4-12h18l4 12"/><path d="M32 26V14h16"/>'),
  plane: icon('<path d="M32 7l4 20 22 8v5l-22-3-2 11 6 4v3l-8-2-8 2v-3l6-4-2-11-22 3v-5l22-8z"/>'),
  ship: icon('<path d="M7 37h50l-9 15H16z"/><path d="M20 37V23h24v14"/><path d="M28 23V15h8v8"/><path d="M12 55h40"/>'),
  mech: icon('<rect x="22" y="13" width="20" height="14" rx="3"/><path d="M18 27h28l4 16H40l-2-9H26l-2 9H14z"/><path d="M24 43l-4 12M40 43l4 12"/><path d="M28 20h2M34 20h2"/>'),
  drone: icon('<rect x="26" y="26" width="12" height="10" rx="3"/><path d="M26 30H13M38 30h13M32 26V14"/><circle cx="11" cy="30" r="5"/><circle cx="53" cy="30" r="5"/><circle cx="32" cy="12" r="4"/>'),
  hovercraft: icon('<path d="M9 33h46l-7 12H16z"/><path d="M22 33V21h20v12"/><path d="M12 50c8 4 32 4 40 0"/><path d="M20 17h24"/>'),
  strider: icon('<path d="M32 9l12 12-4 19H24l-4-19z"/><path d="M24 40l-10 15M40 40l10 15M32 40v15"/><circle cx="32" cy="22" r="4"/>'),
  bomber: icon('<path d="M32 6l3 18 24 10v5l-24-4-2 14 7 5v3l-8-2-8 2v-3l7-5-2-14-24 4v-5l24-10z"/><rect x="27" y="30" width="10" height="5"/><path d="M22 22h20"/>'),
  helicopter: icon('<path d="M8 18h48"/><path d="M32 18v8"/><circle cx="32" cy="32" r="10"/><path d="M22 32H12M42 32h10M32 42v8"/><path d="M26 48h12"/><circle cx="32" cy="32" r="3"/>'),
  destroyer: icon('<path d="M6 36h52l-8 14H14z"/><path d="M18 36V24h20v12"/><path d="M26 24v-8h6"/><path d="M40 36V28h8v8"/><path d="M12 55h40"/><path d="M30 20h8"/>'),
  submarine: icon('<path d="M10 34c8-9 36-9 44 0-8 9-36 9-44 0z"/><path d="M26 25v-6h10v6"/><path d="M30 19v-5h6"/><circle cx="22" cy="34" r="2"/><circle cx="32" cy="34" r="2"/><circle cx="42" cy="34" r="2"/><path d="M54 34h6"/>'),
  default: icon('<circle cx="32" cy="32" r="18"/><path d="M32 20v24M20 32h24"/>'),
};

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
      push(
        Math.round(x1 + ((x2 - x1) * s) / steps),
        Math.round(y1 + ((y2 - y1) * s) / steps),
      );
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

function makeAirPath(): PathData {
  const start: Point = { x: -40, y: 70 + Math.random() * 320 };
  const end = tileToPixel(BASE_TILE[0], BASE_TILE[1]);
  return { tiles: [], points: [start, end], length: Math.hypot(end.x - start.x, end.y - start.y) };
}

export class Game {
  private canvas: HTMLCanvasElement;
  private view: Renderer3D;
  private audio = new AudioKit();
  private levelIndex = 0;
  private gold = 0;
  private lives = 0;
  private waveIndex = -1;
  private status: 'ready' | 'wave' | 'cleared' | 'won' | 'lost' = 'ready';
  private towers: Tower[] = [];
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private mines: NavalMine[] = [];
  private effects: Effect[] = [];
  private particles: Particle[] = [];
  private schedule: SpawnTask[] = [];
  private waveTime = 0;
  private countdown = 0;
  private speed = 1;
  private paused = false;
  private buildType: TowerType | null = null;
  private selected: Tower | null = null;
  private hoverTile: [number, number] | null = null;
  private towerAt = new Map<string, Tower>();
  private groundPaths: PathData[] = [];
  private waterPaths: PathData[] = [];
  private pathTiles = new Set<string>();
  private id = 0;
  private lastTime = 0;
  private bannerTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.view = new Renderer3D(canvas);
    this.buildTowerList();
    this.buildEnemyCodex();
    this.fillLevelSelect();
    this.bindTabs();
    this.bindEvents();
    this.loadLevel(1);
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
    window.addEventListener('pagehide', this.destroy);
    window.addEventListener('beforeunload', this.destroy);
  }

  destroy = () => {
    this.audio.dispose();
  };

  private get level() { return LEVELS[this.levelIndex]; }

  private burst(x: number, y: number, z: number, count: number, color: string, speed = 70, size = 0.09, life = 0.5) {
    if (this.particles.length > 320) this.particles.splice(0, this.particles.length - 280);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.4 + Math.random() * 0.8);
      this.particles.push({
        id: ++this.id,
        x, y, z,
        vx: Math.cos(a) * s,
        vy: 40 + Math.random() * 90,
        vz: Math.sin(a) * s,
        life: life * (0.7 + Math.random() * 0.6),
        maxLife: life,
        color,
        size: size * (0.6 + Math.random() * 0.8),
      });
    }
  }

  private dust(x: number, y: number, color: string, count = 3) {
    if (this.particles.length > 320) this.particles.splice(0, this.particles.length - 280);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 6 + Math.random() * 16;
      this.particles.push({
        id: ++this.id,
        x, y, z: 0.1 + Math.random() * 0.08,
        vx: Math.cos(a) * s,
        vy: 4 + Math.random() * 10,
        vz: Math.sin(a) * s,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
        color,
        size: 0.08 + Math.random() * 0.08,
      });
    }
  }

  private fillLevelSelect() {
    const sel = $('level-select') as HTMLSelectElement;
    sel.innerHTML = LEVELS.map((l) => `<option value="${l.id}">第 ${l.id} 关 · ${l.name}</option>`).join('');
    sel.addEventListener('change', () => this.loadLevel(Number(sel.value)));
  }

  private buildTowerList() {
    const list = $('tower-list');
    const order: TowerType[] = ['machinegun', 'howitzer', 'aa', 'coastal', 'laser', 'flak', 'railgun', 'tesla', 'mine'];
    list.innerHTML = order.map((type, i) => {
      const c = TOWER_CONFIG[type];
      const targetText = c.targets.map((t) => t === 'ground' ? '地面' : t === 'air' ? '空中' : '水路').join('/');
      const features = [c.pierceArmor ? '穿甲' : '', c.splash ? `溅射${c.splash}` : '', c.chain ? `连锁${c.chain}` : '', c.minelayer ? '定时布雷' : ''].filter(Boolean).join('·');
      return `<button class="tower-card" data-type="${type}" style="--swatch:${c.color}">
        <span class="tower-swatch"></span>
        <span class="tower-main">
          <span class="tower-title"><strong>${c.name}</strong><span class="tower-cost">${c.cost}</span></span>
          <span class="tower-desc">${c.desc}</span>
          <span class="tower-stats">伤害 ${c.damage} · 射程 ${c.range} · ${c.fireRate.toFixed(1)}/秒</span>
          <span class="tower-tags"><span class="minitag">${targetText}</span>${features ? `<span class="minitag alt">${features}</span>` : ''}</span>
        </span>
        <span class="tower-key">${i + 1}</span>
      </button>`;
    }).join('');
    list.querySelectorAll<HTMLButtonElement>('.tower-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type as TowerType;
        this.buildType = this.buildType === type ? null : type;
        if (this.buildType) this.selected = null;
        this.syncTowerList();
        this.syncInfo();
      });
      btn.addEventListener('mouseenter', () => {
        if (!this.selected && !this.buildType) this.showWeaponPreview(btn.dataset.type as TowerType);
      });
    });
  }

  private showTab(name: 'build' | 'codex') {
    document.querySelectorAll<HTMLElement>('.build-panel .tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
    $('tab-build').classList.toggle('hidden', name !== 'build');
    $('tab-codex').classList.toggle('hidden', name !== 'codex');
  }

  private setInfoIcon(type: string, color: string, kind: string) {
    const gallery = $('info-gallery');
    gallery.style.setProperty('--icon-color', color);
    gallery.style.setProperty('--icon-glow', `${color}33`);
    $('info-icon').innerHTML = UNIT_ICONS[type] ?? UNIT_ICONS.default;
    $('info-kind').textContent = kind;
  }

  private showWeaponPreview(type: TowerType) {
    const c = TOWER_CONFIG[type];
    this.setInfoIcon(type, c.color, '武器图鉴');
    $('info-empty').classList.add('hidden');
    $('info-detail').classList.remove('hidden');
    const labels = c.minelayer ? ['等级', '伤害', '爆炸半径', '布雷周期', '探测范围'] : ['等级', '伤害', '射程', '射速', '目标'];
    labels.forEach((label, i) => { $(`info-k${i + 1}`).textContent = label; });
    $('info-desc').classList.remove('counter');
    $('info-name').textContent = c.name;
    $('info-tags').innerHTML = `<span class="tag">造价 ${c.cost}</span>${c.pierceArmor ? '<span class="tag alt">穿甲</span>' : ''}${c.chain ? `<span class="tag alt">连锁 ${c.chain}</span>` : ''}${c.minelayer ? '<span class="tag alt">定时布雷</span>' : ''}`;
    $('info-level').textContent = c.minelayer ? '3~5 颗' : '-';
    $('info-damage').textContent = String(c.damage);
    $('info-range').textContent = c.minelayer ? String(c.splash) : String(c.range);
    $('info-rate').textContent = c.minelayer ? `${(1 / c.fireRate).toFixed(1)} 秒` : `${c.fireRate.toFixed(1)} /秒`;
    $('info-target').textContent = c.minelayer ? String(c.range) : c.targets.map((x) => x === 'ground' ? '地面' : x === 'air' ? '空中' : '水路').join('/');
    $('info-desc').textContent = c.desc;
    $('info-actions').classList.add('hidden');
  }

  private bindTabs() {
    document.querySelectorAll<HTMLElement>('.build-panel .tab').forEach((tab) => {
      tab.addEventListener('click', () => this.showTab(tab.dataset.tab as 'build' | 'codex'));
    });
  }

  private buildEnemyCodex() {
    const box = $('enemy-codex');
    const order: EnemyType[] = [
      'infantry', 'truck', 'tank', 'mech', 'strider',
      'plane', 'drone', 'helicopter', 'bomber',
      'ship', 'hovercraft', 'submarine', 'destroyer',
    ];
    const kindText = (k: string) => k === 'ground' ? '地面' : k === 'air' ? '空中' : '水路';
    box.innerHTML = order.map((type, i) => {
      const c = ENEMY_CONFIG[type];
      const threat = c.bounty >= 60 ? '首领级' : c.bounty >= 30 ? '重装' : c.bounty >= 15 ? '进阶' : '基础';
      return `<button class="enemy-card" data-type="${type}" style="--swatch:${c.color}">
        <span class="enemy-swatch"></span>
        <span class="enemy-main">
          <span class="enemy-title"><strong>${c.name}</strong><span class="enemy-bounty">${c.bounty}</span></span>
          <span class="enemy-desc">${kindText(c.kind)}目标 · 对基地伤害 ${c.damage}</span>
          <span class="enemy-stats">生命 ${c.hp} · 速 ${c.speed} · 甲 ${c.armor}</span>
          <span class="enemy-tags"><span class="minitag">${kindText(c.kind)}</span><span class="minitag alt">${threat}</span></span>
        </span>
        <span class="enemy-key">${i + 1}</span>
      </button>`;
    }).join('');
    box.querySelectorAll<HTMLButtonElement>('.enemy-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type as EnemyType;
        box.querySelectorAll('.enemy-card').forEach((b) => b.classList.toggle('active', b === btn));
        this.showEnemyDetail(type);
      });
    });
  }

  private showEnemyDetail(type: EnemyType) {
    const c = ENEMY_CONFIG[type];
    const kindText = c.kind === 'ground' ? '地面' : c.kind === 'air' ? '空中' : '水路';
    const threat = c.bounty >= 60 ? '首领级' : c.bounty >= 30 ? '重装' : c.bounty >= 15 ? '进阶' : '基础';
    this.setInfoIcon(type, c.color, '敌军图鉴');
    $('info-empty').classList.add('hidden');
    $('info-detail').classList.remove('hidden');
    const labels = ['类型', '生命', '速度', '护甲', '对基地伤害'];
    const values = [kindText, String(c.hp), String(c.speed), String(c.armor), String(c.damage)];
    labels.forEach((label, i) => { $(`info-k${i + 1}`).textContent = label; });
    $('info-name').textContent = c.name;
    $('info-tags').innerHTML = `<span class="tag">赏金 ${c.bounty} 金</span><span class="tag alt">${threat}</span>`;
    ['info-level', 'info-damage', 'info-range', 'info-rate', 'info-target'].forEach((id, i) => { $(id).textContent = values[i]; });
    $('info-desc').textContent = this.enemyCounterNote(type);
    $('info-desc').classList.add('counter');
    $('info-actions').classList.add('hidden');
  }

  private enemyCounterNote(type: EnemyType): string {
    const notes: Partial<Record<EnemyType, string>> = {
      infantry: '轻甲或无甲，机枪炮台与激光炮可高效清理。',
      truck: '轻装甲，机枪可压制，榴弹炮群伤更省。',
      tank: '厚重装甲，优先电磁轨道炮穿甲或榴弹炮集火。',
      plane: '高速空中单位，需防空炮、防空爆破炮或激光炮拦截。',
      ship: '高生命水路单位，使用岸防炮或电磁轨道炮攻击。',
      mech: '重甲地面单位，电磁轨道炮无视护甲效果最佳。',
      drone: '极快空中目标，防空炮与激光炮的高射速更可靠。',
      hovercraft: '高速水路单位，岸防炮配合电磁轨道炮拦截。',
      strider: '超高生命的终极地面单位，集中穿甲与连锁火力。',
      bomber: '重装轰炸机，生命厚且伤害高，需多台防空炮与激光炮集火。',
      helicopter: '灵活直升机，速度较快，防空爆破炮的范围伤害尤为有效。',
      destroyer: '重型驱逐舰，装甲厚实，优先电磁轨道炮穿甲与岸防炮集火。',
      submarine: '高速潜艇，岸防炮射速与电磁轨道炮穿甲可有效拦截。',
    };
    return notes[type] || '根据类型选择合适的武器拦截。';
  }

  private syncTowerList() {
    document.querySelectorAll<HTMLButtonElement>('.tower-card').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.type === this.buildType);
      btn.classList.toggle('unaffordable', Number(TOWER_CONFIG[btn.dataset.type as TowerType].cost) > this.gold);
    });
  }

  private bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.hoverTile = this.view.getTileFromEvent(e);
    });
    this.canvas.addEventListener('mouseleave', () => { this.hoverTile = null; });
    this.canvas.addEventListener('click', (e) => {
      const tile = this.view.getTileFromEvent(e);
      if (!tile) return;
      const [tx, ty] = tile;
      if (this.buildType) {
        this.tryBuild(tx, ty, this.buildType);
        return;
      }
      const tower = this.towerAt.get(key(tx, ty));
      this.selected = tower ?? null;
      this.syncInfo();
    });
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.buildType = null;
      this.syncTowerList();
    });

    $('btn-start').addEventListener('click', () => this.startWave(true));
    $('btn-speed').addEventListener('click', () => {
      this.speed = this.speed === 1 ? 2 : 1;
      $('btn-speed').textContent = `速度 ${this.speed}x`;
    });
    $('btn-pause').addEventListener('click', () => {
      this.paused = !this.paused;
      $('btn-pause').textContent = this.paused ? '继续' : '暂停';
      $('btn-pause').classList.toggle('active', this.paused);
    });
    $('btn-rot-left').addEventListener('click', () => this.view.rotateBy(-Math.PI / 8));
    $('btn-rot-right').addEventListener('click', () => this.view.rotateBy(Math.PI / 8));
    $('btn-cam-reset').addEventListener('click', () => this.view.resetCamera());
    $('btn-music').addEventListener('click', () => {
      const muted = !this.audio.musicMuted;
      this.audio.setMusicMuted(muted);
      $('btn-music').textContent = muted ? '音乐 关' : '音乐 开';
      $('btn-music').classList.toggle('active', muted);
      if (!muted) this.audio.unlock();
    });
    $('btn-audio').addEventListener('click', () => {
      const muted = !this.audio.muted;
      this.audio.setMuted(muted);
      $('btn-audio').textContent = muted ? '音效 关' : '音效 开';
      $('btn-audio').classList.toggle('active', muted);
      if (!muted) this.audio.unlock();
    });
    document.addEventListener('click', () => this.audio.unlock(), { once: true });
    $('btn-upgrade').addEventListener('click', () => this.upgradeSelected());
    $('btn-sell').addEventListener('click', () => this.sellSelected());
    $('btn-retry').addEventListener('click', () => this.loadLevel(this.level.id));
    $('btn-next').addEventListener('click', () => this.loadLevel(Math.min(LEVELS.length, this.level.id + 1)));

    window.addEventListener('keydown', (e) => {
      const map: Record<string, TowerType> = {
        '1': 'machinegun', '2': 'howitzer', '3': 'aa', '4': 'coastal',
        '5': 'laser', '6': 'flak', '7': 'railgun', '8': 'tesla', '9': 'mine',
      };
      if (map[e.key]) { this.buildType = map[e.key]; this.showTab('build'); this.syncTowerList(); }
      if (e.key === 'Escape') { this.buildType = null; this.selected = null; this.syncTowerList(); this.syncInfo(); }
      if (e.key === 'q' || e.key === 'Q') this.view.rotateBy(-Math.PI / 8);
      if (e.key === 'e' || e.key === 'E') this.view.rotateBy(Math.PI / 8);
      if (e.code === 'Space') { e.preventDefault(); if (this.status !== 'wave') this.startWave(true); }
    });
  }

  private loadLevel(id: number) {
    this.levelIndex = Math.max(0, Math.min(LEVELS.length - 1, id - 1));
    const lv = this.level;
    this.groundPaths = lv.ground.map(makePath);
    this.waterPaths = lv.water.map(makePath);
    this.pathTiles = new Set<string>();
    [...this.groundPaths, ...this.waterPaths].forEach((p) => p.tiles.forEach(([x, y]) => this.pathTiles.add(key(x, y))));

    this.gold = lv.gold;
    this.lives = lv.lives;
    this.waveIndex = -1;
    this.status = 'ready';
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.mines = [];
    this.effects = [];
    this.particles = [];
    this.schedule = [];
    this.towerAt.clear();
    this.selected = null;
    this.buildType = null;
    this.countdown = 0;
    this.paused = false;
    $('btn-pause').textContent = '暂停';
    $('btn-pause').classList.remove('active');
    ($('level-select') as HTMLSelectElement).value = String(lv.id);
    $('result').classList.add('hidden');
    this.view.buildLevel(this.groundPaths, this.waterPaths, this.pathTiles, lv.theme);
    this.audio.playMusicForLevel(lv.id);
    this.showBanner(`第 ${lv.id} 关 · ${lv.name}`, lv.desc);
    this.syncAll();
  }

  private showBanner(title: string, sub: string) {
    const b = $('banner');
    b.innerHTML = `<strong>${title}</strong><span>${sub}</span>`;
    b.classList.remove('hidden');
    this.bannerTimer = 3.2;
  }

  private canBuild(tx: number, ty: number) {
    return tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS && !this.pathTiles.has(key(tx, ty)) && !this.towerAt.has(key(tx, ty));
  }

  private tryBuild(tx: number, ty: number, type: TowerType) {
    const cfg = TOWER_CONFIG[type];
    if (!this.canBuild(tx, ty)) { this.flash('此处无法建造'); return; }
    if (cfg.minelayer && this.waterPaths.length === 0) { this.flash('本关没有水路，无法布设水雷'); return; }
    if (this.gold < cfg.cost) { this.flash('金币不足'); return; }
    const pos = tileToPixel(tx, ty);
    const tower: Tower = {
      id: ++this.id, type, level: 1, tx, ty, x: pos.x, y: pos.y,
      damage: cfg.damage, range: cfg.range, fireRate: cfg.fireRate,
      cooldown: 0, totalCost: cfg.cost, angle: -Math.PI / 2,
    };
    this.towers.push(tower);
    this.towerAt.set(key(tx, ty), tower);
    this.gold -= cfg.cost;
    this.selected = tower;
    this.audio.build();
    this.burst(pos.x, pos.y, 0.3, 8, cfg.color, 45, 0.08, 0.45);
    this.syncAll();
  }

  private upgradeCost(t: Tower) {
    return Math.round(TOWER_CONFIG[t.type].cost * (UPGRADE_FACTOR.cost + 0.6 * (t.level - 1)));
  }

  private upgradeSelected() {
    const t = this.selected;
    if (!t || t.level >= MAX_LEVEL) return;
    const cost = this.upgradeCost(t);
    if (this.gold < cost) { this.flash('金币不足'); return; }
    this.gold -= cost;
    t.totalCost += cost;
    t.level += 1;
    t.damage *= UPGRADE_FACTOR.damage;
    t.range *= UPGRADE_FACTOR.range;
    t.fireRate *= UPGRADE_FACTOR.fireRate;
    this.audio.upgrade();
    this.burst(t.x, t.y, 0.6, 12, '#ffe9a8', 55, 0.08, 0.6);
    this.syncAll();
  }

  private sellSelected() {
    const t = this.selected;
    if (!t) return;
    this.gold += Math.round(t.totalCost * SELL_REFUND);
    this.towers = this.towers.filter((x) => x.id !== t.id);
    this.mines = this.mines.filter((m) => m.ownerId !== t.id);
    this.towerAt.delete(key(t.tx, t.ty));
    this.selected = null;
    this.syncAll();
  }

  private flash(msg: string) {
    const b = $('banner');
    b.innerHTML = `<strong>${msg}</strong>`;
    b.classList.remove('hidden');
    this.bannerTimer = 1.2;
  }

  private startWave(manual: boolean) {
    if (this.status === 'wave' || this.status === 'won' || this.status === 'lost') return;
    if (manual && this.status === 'cleared') { this.gold += 8; this.flash('提前出击 +8 金币'); }
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
    this.audio.wave();
    this.syncAll();
  }

  private spawn(group: SpawnGroup) {
    const cfg = ENEMY_CONFIG[group.type];
    let path: PathData;
    if (cfg.kind === 'ground') {
      path = this.groundPaths[group.lane % this.groundPaths.length];
    } else if (cfg.kind === 'water') {
      path = this.waterPaths[group.lane % this.waterPaths.length];
    } else {
      path = makeAirPath();
    }
    if (!path) return;
    const hp = cfg.hp * group.hpScale * difficultyScale(this.level.id);
    this.enemies.push({
      id: ++this.id, type: group.type, kind: cfg.kind, x: path.points[0].x, y: path.points[0].y,
      hp, maxHp: hp, armor: cfg.armor, speed: cfg.speed,
      bounty: Math.round(cfg.bounty * (0.55 + 0.22 * Math.sqrt(group.hpScale * difficultyScale(this.level.id) - 1))),
      damage: cfg.damage, size: cfg.size * (group.boss ? 1.5 : 1), color: cfg.color, boss: !!group.boss,
      path, index: 0, traveled: 0, angle: 0, dead: false,
    });
  }

  private findTarget(t: Tower): Enemy | null {
    let best: Enemy | null = null;
    let bestRemaining = Infinity;
    for (const e of this.enemies) {
      if (e.dead) continue;
      if (e.x < 0 || e.x > WIDTH || e.y < 0 || e.y > HEIGHT) continue;
      if (!TOWER_CONFIG[t.type].targets.includes(e.kind)) continue;
      if (Math.hypot(e.x - t.x, e.y - t.y) > t.range) continue;
      const remaining = e.path.length - e.traveled;
      if (remaining < bestRemaining) { bestRemaining = remaining; best = e; }
    }
    return best;
  }

  private fire(t: Tower, target: Enemy) {
    const cfg = TOWER_CONFIG[t.type];
    const dx = target.x - t.x;
    const dy = target.y - t.y;
    const d = Math.hypot(dx, dy) || 1;
    const speed = cfg.projectileSpeed;
    t.angle = Math.atan2(dy, dx);
    const edgeX = dx > 0 ? (WIDTH - t.x) * d / dx : dx < 0 ? -t.x * d / dx : Infinity;
    const edgeY = dy > 0 ? (HEIGHT - t.y) * d / dy : dy < 0 ? -t.y * d / dy : Infinity;
    const maxDistance = Math.min(d + 6, Math.min(edgeX, edgeY) + 2);
    this.projectiles.push({
      x: t.x, y: t.y, target, lastX: t.x, lastY: t.y,
      vx: dx / d, vy: dy / d, distance: 0, maxDistance,
      speed, damage: t.damage, splash: cfg.splash,
      pierceArmor: !!cfg.pierceArmor, chain: cfg.chain || 0,
      color: cfg.color, alive: true,
      type: t.type, originX: t.x, originY: t.y,
    });
    this.audio.fire(t.type);
    const mx = t.x + Math.cos(t.angle) * 16;
    const my = t.y + Math.sin(t.angle) * 16;
    this.burst(mx, my, 0.55, t.type === 'machinegun' || t.type === 'aa' ? 2 : 5, cfg.color, 40, 0.07, 0.22);
  }

  private damageEnemy(e: Enemy, amount: number, pierce = false) {
    if (e.dead) return;
    const armorConstant = 50;
    e.hp -= pierce ? amount : amount * (1 - e.armor / (e.armor + armorConstant));
    if (e.hp <= 0) {
      e.dead = true;
      this.gold += e.bounty;
      this.effects.push({ x: e.x, y: e.y, z: 0.5, r: 4, maxR: e.size * 2.4, life: 0.35, maxLife: 0.35, color: '#ffd08a', kind: 'ring' });
      this.burst(e.x, e.y, 0.35, e.size > 12 ? 12 : 5, '#ffcf82', 65, 0.1, 0.45);
      if (e.size > 12) this.audio.explode(true);
    }
  }

  private segmentHits(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, r: number) {
    const dx = x2 - x1, dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    let t = len2 > 0 ? ((cx - x1) * dx + (cy - y1) * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    const px = x1 + dx * t, py = y1 + dy * t;
    return (cx - px) * (cx - px) + (cy - py) * (cy - py) <= r * r;
  }

  private nearestWaterPoint(x: number, y: number, maxDist: number): Point | null {
    let best: Point | null = null;
    let bestDist = maxDist;
    for (const path of this.waterPaths) {
      for (const p of path.points) {
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < bestDist) { bestDist = d; best = p; }
      }
    }
    return best;
  }

  private layMines(t: Tower) {
    const cfg = TOWER_CONFIG[t.type];
    const existing = this.mines.filter((m) => m.ownerId === t.id).length;
    const capacity = t.level + 2;
    const deficit = capacity - existing;
    if (deficit <= 0) return;
    // 首次建好一次布满；之后每个周期只补 1 颗（炸一颗少一颗，逐颗补充）
    const need = t.initialized ? 1 : deficit;
    t.initialized = true;
    const point = this.nearestWaterPoint(t.x, t.y, t.range);
    if (!point) return;
    const dx = point.x - t.x;
    const dy = point.y - t.y;
    const d = Math.hypot(dx, dy) || 1;
    t.angle = Math.atan2(dy, dx);
    for (let i = 0; i < need; i++) {
      const spread = (i - (need - 1) / 2) * 22;
      this.mines.push({
        id: ++this.id, ownerId: t.id,
        x: point.x - (dy / d) * spread,
        y: point.y + (dx / d) * spread,
        damage: t.damage, splash: cfg.splash, color: cfg.color,
      });
    }
    this.burst(point.x, point.y, 0.3, 6, cfg.color, 55, 0.1, 0.4);
    this.audio.fire('coastal');
  }

  private detonateMine(mine: NavalMine) {
    let triggered = false;
    for (const e of this.enemies) {
      if (e.dead || e.kind !== 'water') continue;
      if (Math.hypot(e.x - mine.x, e.y - mine.y) <= mine.splash) {
        this.damageEnemy(e, mine.damage);
        triggered = true;
      }
    }
    if (!triggered) return;
    this.effects.push({
      x: mine.x, y: mine.y, z: 0.45, r: 6, maxR: mine.splash, life: 0.42, maxLife: 0.42,
      color: mine.color, kind: 'ring',
    });
    this.effects.push({
      x: mine.x, y: mine.y, z: 0.45, r: 2, maxR: Math.min(mine.splash * 0.5, 18), life: 0.2, maxLife: 0.2,
      color: '#fff0c8', kind: 'flash',
    });
    this.burst(mine.x, mine.y, 0.45, 16, mine.color, 95, 0.12, 0.5);
    this.audio.explode(false);
  }

  private hit(p: Projectile) {
    const px = p.lastX;
    const py = p.lastY;
    const hitZ = p.target?.kind === 'air' ? 1.3 : 0.5;

    if (p.type === 'laser') {
      this.effects.push({
        x: px, y: py, z: hitZ, r: 0, maxR: 0, life: 0.14, maxLife: 0.14,
        color: '#ffffff', color2: '#79e2d6', kind: 'beam',
        points: [{ x: p.originX, y: p.originY }, { x: px, y: py }], width: 0.1,
      });
    }

    const arcPoints: Point[] = p.type === 'tesla'
      ? [{ x: p.originX, y: p.originY }, { x: px, y: py }]
      : [];

    if (p.splash > 0) {
      for (const e of this.enemies) {
        if (!e.dead && Math.hypot(e.x - px, e.y - py) <= p.splash) this.damageEnemy(e, p.damage, p.pierceArmor);
      }
      this.effects.push({
        x: px, y: py, z: hitZ, r: 4, maxR: p.splash, life: 0.32, maxLife: 0.32,
        color: p.color, kind: 'ring',
      });
      this.effects.push({
        x: px, y: py, z: hitZ, r: 2, maxR: Math.min(p.splash * 0.45, 16), life: 0.16, maxLife: 0.16,
        color: '#fff3d6', kind: 'flash',
      });
      this.burst(px, py, hitZ, 10, p.color, 80, 0.1, 0.4);
      this.audio.explode(false);
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
        candidates.forEach((e) => {
          this.damageEnemy(e, p.damage * 0.7, p.pierceArmor);
          if (arcPoints.length) arcPoints.push({ x: e.x, y: e.y });
        });
        hitAny = true;
      }
      if (arcPoints.length > 1) {
        this.effects.push({
          x: px, y: py, z: hitZ, r: 0, maxR: 0, life: 0.3, maxLife: 0.3,
          color: '#f0e6ff', color2: p.color, kind: 'arc', points: arcPoints, width: 0.07,
        });
        this.burst(px, py, hitZ, 8, p.color, 60, 0.07, 0.3);
      } else if (hitAny) {
        const flashColor = p.type === 'railgun' ? '#dff0ff'
          : p.type === 'laser' ? '#ffffff'
          : p.type === 'machinegun' || p.type === 'aa' ? '#fff0b0' : '#ffffff';
        this.effects.push({
          x: px, y: py, z: hitZ, r: 2, maxR: p.type === 'railgun' ? 16 : 10,
          life: 0.16, maxLife: 0.16, color: flashColor, kind: 'flash',
        });
        this.burst(px, py, hitZ, p.type === 'railgun' ? 8 : 4, p.color, 55, 0.07, 0.24);
      }
    }
    p.alive = false;
  }

  private reachBase(e: Enemy) {
    e.dead = true;
    this.lives -= e.damage;
    this.effects.push({ x: e.x, y: e.y, z: 0.5, r: 6, maxR: 30, life: 0.5, maxLife: 0.5, color: '#e35d5d', kind: 'ring' });
    this.burst(e.x, e.y, 0.5, 10, '#e35d5d', 80, 0.12, 0.6);
    this.audio.leak();
    if (this.lives <= 0) {
      this.lives = 0;
      this.status = 'lost';
      this.showResult(false);
    }
  }

  private update(dt: number) {
    const sdt = dt * this.speed;
    if (this.bannerTimer > 0) {
      this.bannerTimer -= dt;
      if (this.bannerTimer <= 0) $('banner').classList.add('hidden');
    }
    if (this.paused) return;

    if (this.status === 'cleared') {
      this.countdown -= sdt;
      if (this.countdown <= 0) this.startWave(false);
    }

    if (this.status === 'wave') {
      this.waveTime += sdt;
      while (this.schedule.length && this.schedule[0].time <= this.waveTime) {
        this.spawn(this.schedule.shift()!.group);
      }

      const deco = this.level.theme.deco;
      const groundDust = deco === 'space' ? '#9fb6d8'
        : deco === 'city' || deco === 'rails' ? '#9a9a92'
        : deco === 'snow' ? '#e2edf0'
        : deco === 'desert' ? '#c6a878' : '#8c795c';

      for (const e of this.enemies) {
        if (e.dead) continue;
        const before = e.traveled;
        const next = e.path.points[e.index + 1];
        if (!next) { this.reachBase(e); continue; }
        const dx = next.x - e.x;
        const dy = next.y - e.y;
        const d = Math.hypot(dx, dy);
        const step = e.speed * sdt;
        e.angle = Math.atan2(dy, dx);
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
        if (e.kind === 'ground' && e.type !== 'infantry'
          && Math.floor(e.traveled / 11) !== Math.floor(before / 11)) {
          this.dust(e.x, e.y, groundDust, 3);
        } else if (e.kind === 'water'
          && Math.floor(e.traveled / 14) !== Math.floor(before / 14)) {
          this.dust(e.x, e.y, '#bfe6f2', 2);
        }
      }

      for (const t of this.towers) {
        t.cooldown -= sdt;
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
        const step = p.speed * sdt;
        const segX = p.x, segY = p.y;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.distance += step;
        p.lastX = p.x;
        p.lastY = p.y;
        if (p.x < 0 || p.x > WIDTH || p.y < 0 || p.y > HEIGHT) { p.alive = false; continue; }
        let collided = false;
        for (const e of this.enemies) {
          if (e.dead) continue;
          const reach = Math.max(9, e.size * 0.6 + 3);
          if (this.segmentHits(segX, segY, p.x, p.y, e.x, e.y, reach)) {
            p.target = e;
            collided = true;
            break;
          }
        }
        if (collided || p.distance >= p.maxDistance) this.hit(p);
      }

      this.enemies = this.enemies.filter((e) => !e.dead);
      this.projectiles = this.projectiles.filter((p) => p.alive);

      if (this.status === 'wave' && this.schedule.length === 0 && this.enemies.length === 0) {
        if (this.waveIndex + 1 >= this.level.waves.length) {
          this.status = 'won';
          this.showResult(true);
        } else {
          this.status = 'cleared';
          this.countdown = 6;
          this.gold += 15;
        }
      }
    }

    this.effects = this.effects.filter((ef) => {
      ef.life -= sdt;
      return ef.life > 0;
    });

    this.particles = this.particles.filter((p) => {
      p.life -= sdt;
      p.x += p.vx * sdt;
      p.y += p.vz * sdt;
      p.z += p.vy * sdt;
      p.vy -= 190 * sdt;
      p.vx *= 0.97;
      p.vz *= 0.97;
      if (p.z < 0) { p.z = 0; p.vy *= -0.25; }
      return p.life > 0;
    });
  }

  private loop = (now: number) => {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.update(dt);
    this.render();
    this.syncUI();
    requestAnimationFrame(this.loop);
  };

  private render() {
    this.view.render({
      towers: this.towers,
      enemies: this.enemies,
      projectiles: this.projectiles,
      effects: this.effects,
      particles: this.particles,
      selected: this.selected,
      buildType: this.buildType,
      hoverTile: this.hoverTile,
      pathTiles: this.pathTiles,
      mines: this.mines,
      gold: this.gold,
    });
  }

  private showResult(win: boolean) {
    $('result-title').textContent = win ? '防线守住了' : '基地失守';
    $('result-desc').textContent = win
      ? `第 ${this.level.id} 关「${this.level.name}」完成，剩余基地生命 ${this.lives}。`
      : `第 ${this.level.id} 关作战失败，调整部署后再试一次。`;
    ($('btn-next') as HTMLButtonElement).style.display = win && this.level.id < LEVELS.length ? '' : 'none';
    $('result').classList.remove('hidden');
    if (win) this.audio.win(); else this.audio.lose();
    this.syncAll();
  }

  private syncAll() {
    this.syncTowerList();
    this.syncInfo();
    this.syncUI();
  }

  private syncInfo() {
    const t = this.selected;
    if (!t) {
      if (this.buildType) {
        this.showWeaponPreview(this.buildType);
      } else {
        $('info-empty').classList.remove('hidden');
        $('info-detail').classList.add('hidden');
      }
      return;
    }
    $('info-empty').classList.add('hidden');
    $('info-detail').classList.remove('hidden');
    const cfg = TOWER_CONFIG[t.type];
    const labels = cfg.minelayer ? ['等级', '伤害', '爆炸半径', '布雷周期', '探测范围'] : ['等级', '伤害', '射程', '射速', '目标'];
    labels.forEach((label, i) => { $(`info-k${i + 1}`).textContent = label; });
    $('info-desc').classList.remove('counter');
    $('info-actions').classList.remove('hidden');
    this.setInfoIcon(t.type, cfg.color, '防御塔图鉴');
    $('info-name').textContent = `${cfg.name} Lv.${t.level}`;
    $('info-tags').innerHTML = `<span class="tag">造价 ${t.totalCost}</span>${cfg.minelayer ? `<span class="tag alt">每次布雷 ${t.level + 2} 颗</span>` : ''}${cfg.pierceArmor ? '<span class="tag alt">穿甲</span>' : ''}${cfg.chain ? `<span class="tag alt">连锁 ${cfg.chain}</span>` : ''}${cfg.splash && !cfg.minelayer ? `<span class="tag alt">溅射 ${cfg.splash}</span>` : ''}`;
    $('info-level').textContent = `${t.level} / ${MAX_LEVEL}`;
    $('info-damage').textContent = Math.round(t.damage).toString();
    $('info-range').textContent = cfg.minelayer ? Math.round(TOWER_CONFIG.mine.splash).toString() : Math.round(t.range).toString();
    $('info-rate').textContent = cfg.minelayer ? `${(1 / t.fireRate).toFixed(1)} 秒` : `${t.fireRate.toFixed(1)} /秒`;
    $('info-target').textContent = cfg.minelayer ? Math.round(t.range).toString() : cfg.targets.map((x) => x === 'ground' ? '地面' : x === 'air' ? '空中' : '水路').join('/');
    $('info-desc').textContent = cfg.desc;
    const up = $('btn-upgrade') as HTMLButtonElement;
    const cost = this.upgradeCost(t);
    up.textContent = t.level >= MAX_LEVEL ? '已满级' : `升级 ${cost}`;
    up.disabled = t.level >= MAX_LEVEL || this.gold < cost;
    ($('btn-sell') as HTMLButtonElement).textContent = `出售 +${Math.round(t.totalCost * SELL_REFUND)}`;
  }

  private syncUI() {
    $('stat-level').textContent = String(this.level.id);
    $('stat-gold').textContent = String(this.gold);
    $('stat-lives').textContent = String(this.lives);
    $('stat-wave').textContent = `${Math.max(0, this.waveIndex + 1)} / ${this.level.waves.length}`;

    const wave = this.level.waves[this.waveIndex];
    const totalEnemies = wave ? wave.groups.reduce((sum, g) => sum + g.count, 0) : 0;
    let progress = 0;
    if (this.status === 'wave' && totalEnemies > 0) {
      const remaining = this.enemies.length + this.schedule.length;
      progress = (this.waveIndex + 1 - remaining / totalEnemies) / this.level.waves.length;
    } else if (this.status === 'cleared' || this.status === 'won') {
      progress = (this.waveIndex + 1) / this.level.waves.length;
    } else if (this.status === 'lost') {
      progress = this.waveIndex / this.level.waves.length;
    }
    $('wave-progress-bar').style.width = `${Math.max(0, Math.min(100, progress * 100))}%`;

    const hudLabels: Record<string, string> = { ready: '待命', wave: '作战中', cleared: '整备', won: '胜利', lost: '失败' };
    $('stage-hud').setAttribute('data-state', this.status);
    $('hud-status').textContent = hudLabels[this.status];

    const info = $('wave-info');
    const start = $('btn-start') as HTMLButtonElement;
    if (this.status === 'wave') {
      info.textContent = `第 ${this.waveIndex + 1} 波进行中 · 剩余敌人 ${this.enemies.length + this.schedule.length}`;
      start.textContent = '作战中';
      start.disabled = true;
    } else if (this.status === 'cleared') {
      info.textContent = `本波清空 · ${Math.ceil(this.countdown)} 秒后自动开始下一波`;
      start.textContent = '提前开始 +8';
      start.disabled = false;
    } else if (this.status === 'won') {
      info.textContent = '全部波次完成，防线守住了';
      start.disabled = true;
    } else if (this.status === 'lost') {
      info.textContent = '基地失守，作战失败';
      start.disabled = true;
    } else {
      info.textContent = '准备部署，点击「开始波次」';
      start.textContent = '开始波次';
      start.disabled = false;
    }
    this.syncTowerList();
  }
}
