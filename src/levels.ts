import { ENEMY_CONFIG } from './config';
import type { EnemyType, LevelDef, LevelTheme, SpawnGroup, Wave } from './types';

const g = (
  type: EnemyType,
  count: number,
  interval = 0.8,
  delay = 0,
  lane = 0,
  hpScale = 1,
  boss = false,
): SpawnGroup => ({ type, count, interval, delay, lane, hpScale, boss });

const w = (...groups: SpawnGroup[]): Wave => ({ groups });

function legacyWavesFor(level: number): Wave[] {
  switch (level) {
    case 1:
      return [
        w(g('infantry', 5, 0.9)),
        w(g('infantry', 7, 0.7)),
        w(g('infantry', 6, 0.6), g('truck', 2, 1.2, 2)),
        w(g('infantry', 8, 0.5), g('truck', 3, 1, 1)),
      ];
    case 2:
      return [
        w(g('infantry', 7, 0.8)),
        w(g('infantry', 8, 0.6), g('truck', 2, 1.2, 2)),
        w(g('infantry', 7, 0.5), g('truck', 4, 1, 1)),
        w(g('truck', 6, 0.9), g('infantry', 6, 0.5, 1)),
        w(g('infantry', 10, 0.45), g('truck', 5, 0.9, 2)),
      ];
    case 3:
      return [
        w(g('infantry', 8, 0.7)),
        w(g('infantry', 6, 0.6), g('ship', 2, 2.2, 1)),
        w(g('truck', 5, 0.9), g('infantry', 6, 0.5, 1)),
        w(g('ship', 3, 1.8), g('infantry', 6, 0.5, 1)),
        w(g('truck', 6, 0.8), g('ship', 3, 1.8, 2)),
        w(g('infantry', 10, 0.45), g('truck', 4, 0.9, 1), g('ship', 3, 1.6, 2)),
      ];
    case 4:
      return [
        w(g('infantry', 8, 0.6), g('truck', 3, 1, 1)),
        w(g('truck', 6, 0.85)),
        w(g('tank', 2, 2.4), g('infantry', 6, 0.5, 1)),
        w(g('ship', 3, 1.8), g('truck', 5, 0.8, 1)),
        w(g('tank', 3, 2), g('infantry', 8, 0.45, 1)),
        w(g('tank', 4, 1.8), g('truck', 6, 0.8, 1), g('ship', 3, 1.6, 2)),
      ];
    case 5:
      return [
        w(g('infantry', 8, 0.6), g('truck', 4, 0.9, 1)),
        w(g('plane', 4, 1.1), g('infantry', 6, 0.5, 1)),
        w(g('tank', 2, 2.2), g('plane', 4, 1.1, 1)),
        w(g('ship', 4, 1.7), g('truck', 5, 0.8, 1)),
        w(g('plane', 6, 0.9), g('infantry', 8, 0.45, 1)),
        w(g('tank', 3, 2), g('ship', 4, 1.6, 1)),
        w(g('tank', 4, 1.8), g('plane', 6, 0.9, 1), g('infantry', 8, 0.45, 2)),
      ];
    case 6:
      return [
        w(g('infantry', 10, 0.5), g('truck', 4, 0.9, 1)),
        w(g('truck', 8, 0.7), g('plane', 4, 1.1, 1)),
        w(g('tank', 3, 2), g('ship', 4, 1.7, 1)),
        w(g('plane', 7, 0.8), g('infantry', 8, 0.45, 1)),
        w(g('tank', 4, 1.8), g('truck', 6, 0.8, 1)),
        w(g('ship', 5, 1.5), g('plane', 6, 0.9, 1)),
        w(g('tank', 5, 1.6), g('truck', 7, 0.75, 1), g('plane', 6, 0.9, 2), g('ship', 4, 1.6, 2)),
      ];
    case 7:
      return [
        w(g('infantry', 7, 0.6, 0, 0), g('infantry', 7, 0.6, 0.5, 1)),
        w(g('truck', 5, 0.9, 0, 0), g('infantry', 8, 0.5, 0.5, 1)),
        w(g('plane', 5, 1), g('ship', 3, 1.8, 1)),
        w(g('tank', 2, 2.2, 0, 0), g('truck', 6, 0.8, 0.5, 1)),
        w(g('infantry', 10, 0.45, 0, 0), g('infantry', 10, 0.45, 0.5, 1)),
        w(g('tank', 3, 2, 0, 0), g('tank', 3, 2, 0.5, 1), g('ship', 4, 1.6, 1)),
        w(g('plane', 8, 0.8), g('truck', 8, 0.75, 0.5, 1)),
        w(g('tank', 5, 1.7, 0, 0), g('truck', 8, 0.7, 0.5, 1), g('ship', 4, 1.6, 1), g('plane', 6, 0.9, 2)),
      ];
    case 8:
      return [
        w(g('infantry', 10, 0.5), g('truck', 5, 0.85, 1)),
        w(g('plane', 6, 0.9), g('ship', 4, 1.7, 1)),
        w(g('tank', 3, 2, 0, 0, 1.4), g('infantry', 8, 0.45, 1)),
        w(g('truck', 9, 0.65), g('plane', 6, 0.9, 1)),
        w(g('tank', 4, 1.8, 0, 0, 1.4), g('ship', 5, 1.5, 1)),
        w(g('plane', 8, 0.75), g('tank', 3, 2, 0, 0, 1.4), g('truck', 6, 0.8, 1)),
        w(g('ship', 6, 1.4), g('tank', 5, 1.7, 0, 0, 1.4)),
        w(g('tank', 6, 1.5, 0, 0, 1.6), g('plane', 8, 0.75, 1), g('truck', 8, 0.7, 2), g('ship', 5, 1.5, 2)),
      ];
    case 9:
      return [
        w(g('infantry', 12, 0.45), g('truck', 6, 0.8, 1)),
        w(g('plane', 7, 0.85), g('ship', 5, 1.5, 1)),
        w(g('tank', 4, 1.9, 0, 0, 1.3), g('truck', 7, 0.75, 1)),
        w(g('tank', 5, 1.8, 0, 0, 1.3), g('plane', 7, 0.85, 1)),
        w(g('ship', 5, 1.5, 0, 0, 1.4), g('truck', 8, 0.7, 1)),
        w(g('plane', 9, 0.7), g('tank', 4, 1.9, 0, 0, 1.4)),
        w(g('tank', 6, 1.6, 0, 0, 1.5), g('ship', 5, 1.4, 0, 0, 1.4)),
        w(g('plane', 10, 0.65), g('truck', 10, 0.65, 1), g('ship', 5, 1.4, 0, 0, 1.4)),
        w(g('tank', 2, 2.6, 0, 0, 2.6), g('tank', 5, 1.6, 1, 0, 1.4), g('plane', 8, 0.75, 2), g('ship', 5, 1.4, 0, 0, 1.5)),
      ];
    case 10:
      return [
        w(g('infantry', 12, 0.45), g('truck', 6, 0.8, 1), g('plane', 5, 1, 2)),
        w(g('truck', 10, 0.65), g('ship', 5, 1.5, 1)),
        w(g('tank', 5, 1.8, 0, 0, 1.3), g('plane', 7, 0.85, 1)),
        w(g('infantry', 14, 0.4), g('truck', 8, 0.7, 1), g('ship', 5, 1.5, 2)),
        w(g('tank', 5, 1.7, 0, 0, 1.5), g('plane', 8, 0.75, 1), g('ship', 5, 1.4, 2)),
        w(g('tank', 6, 1.6, 0, 0, 1.5), g('truck', 10, 0.65, 1), g('plane', 8, 0.75, 2)),
        w(g('ship', 7, 1.3, 0, 0, 1.5), g('plane', 10, 0.65, 1)),
        w(g('tank', 6, 1.5, 0, 0, 1.8), g('truck', 10, 0.6, 1), g('ship', 6, 1.4, 0, 0, 1.5)),
        w(g('plane', 12, 0.6), g('tank', 7, 1.4, 0, 0, 1.8), g('ship', 6, 1.3, 0, 0, 1.6)),
        w(g('tank', 3, 2.2, 0, 0, 3), g('tank', 6, 1.4, 1, 0, 1.8), g('plane', 12, 0.6, 1), g('ship', 6, 1.3, 0, 0, 2), g('truck', 12, 0.55, 2)),
      ];
    case 11:
      return [
        w(g('infantry', 14, 0.5), g('truck', 6, 0.9, 1), g('drone', 4, 1, 2)),
        w(g('mech', 2, 2.4), g('infantry', 8, 0.5, 1)),
        w(g('truck', 8, 0.7), g('mech', 2, 2.2, 1)),
        w(g('mech', 3, 2), g('infantry', 10, 0.45, 1)),
        w(g('tank', 3, 2), g('mech', 3, 1.8, 1)),
        w(g('mech', 5, 1.6), g('truck', 8, 0.7, 1), g('infantry', 10, 0.45, 2)),
      ];
    case 12:
      return [
        w(g('infantry', 14, 0.5), g('truck', 7, 0.85, 1), g('drone', 6, 0.9, 2)),
        w(g('drone', 7, 0.8), g('truck', 6, 0.8, 1)),
        w(g('mech', 3, 2), g('drone', 6, 0.9, 1)),
        w(g('infantry', 12, 0.45), g('mech', 3, 2, 1)),
        w(g('drone', 10, 0.7), g('truck', 8, 0.7, 1)),
        w(g('mech', 5, 1.7), g('drone', 8, 0.75, 1)),
        w(g('mech', 6, 1.6), g('drone', 10, 0.7, 1), g('truck', 10, 0.65, 2)),
      ];
    case 13:
      return [
        w(g('truck', 10, 0.7), g('hovercraft', 6, 1.5, 1), g('drone', 7, 0.9, 2), g('mech', 2, 2.4, 1)),
        w(g('infantry', 12, 0.45), g('hovercraft', 3, 2)),
        w(g('drone', 8, 0.8), g('mech', 3, 2, 1)),
        w(g('hovercraft', 5, 1.6), g('truck', 8, 0.7, 1)),
        w(g('mech', 5, 1.7), g('drone', 8, 0.75, 1)),
        w(g('hovercraft', 6, 1.5), g('mech', 5, 1.7, 1), g('drone', 8, 0.75, 2)),
        w(g('mech', 7, 1.5), g('hovercraft', 6, 1.4, 1), g('drone', 10, 0.7, 2), g('truck', 10, 0.65, 2)),
      ];
    case 14:
      return [
        w(g('ship', 6, 1.6), g('hovercraft', 6, 1.4, 1), g('plane', 7, 0.9, 2), g('infantry', 8, 0.5, 1)),
        w(g('hovercraft', 5, 1.4), g('plane', 5, 1, 1)),
        w(g('ship', 6, 1.5), g('hovercraft', 4, 1.4, 1)),
        w(g('drone', 8, 0.8), g('ship', 5, 1.5, 1)),
        w(g('hovercraft', 7, 1.3), g('plane', 7, 0.85, 1)),
        w(g('ship', 7, 1.4), g('mech', 4, 1.9, 1)),
        w(g('hovercraft', 8, 1.2), g('drone', 10, 0.7, 1), g('ship', 6, 1.4, 2)),
        w(g('ship', 8, 1.3), g('hovercraft', 8, 1.2, 1), g('plane', 10, 0.7, 2), g('mech', 6, 1.6, 2)),
      ];
    case 15:
      return [
        w(g('tank', 6, 1.8), g('mech', 5, 1.9, 1), g('drone', 10, 0.7, 2), g('truck', 5, 0.9, 1)),
        w(g('mech', 4, 1.9), g('drone', 6, 0.9, 1)),
        w(g('tank', 6, 1.7), g('mech', 3, 1.9, 1)),
        w(g('drone', 10, 0.7), g('truck', 8, 0.7, 1)),
        w(g('tank', 7, 1.6), g('ship', 5, 1.5, 1)),
        w(g('mech', 6, 1.6), g('drone', 10, 0.7, 1)),
        w(g('tank', 8, 1.5), g('mech', 6, 1.6, 1), g('ship', 6, 1.4, 2)),
        w(g('tank', 8, 1.4), g('mech', 8, 1.5, 1), g('drone', 12, 0.65, 2), g('ship', 6, 1.3, 2)),
      ];
    case 16:
      return [
        w(g('strider', 3, 2.8), g('truck', 9, 0.75, 1), g('plane', 8, 0.8, 2), g('mech', 3, 2.2, 1)),
        w(g('strider', 3, 2.6), g('truck', 8, 0.7, 1)),
        w(g('plane', 8, 0.8), g('strider', 2, 2.8, 1)),
        w(g('mech', 5, 1.7), g('strider', 3, 2.6, 1)),
        w(g('drone', 10, 0.7), g('strider', 4, 2.4, 1)),
        w(g('strider', 5, 2.2), g('tank', 5, 1.7, 1)),
        w(g('strider', 6, 2), g('mech', 7, 1.5, 1), g('plane', 10, 0.7, 2)),
        w(g('strider', 7, 1.9), g('mech', 8, 1.5, 1), g('drone', 12, 0.65, 2), g('tank', 6, 1.6, 2)),
      ];
    case 17:
      return [
        w(g('strider', 4, 2.5), g('mech', 6, 1.7, 1), g('drone', 12, 0.65, 2), g('hovercraft', 5, 1.4, 1)),
        w(g('drone', 12, 0.65), g('hovercraft', 5, 1.4, 1)),
        w(g('strider', 4, 2.3), g('plane', 8, 0.8, 1)),
        w(g('mech', 7, 1.6), g('drone', 10, 0.7, 1)),
        w(g('hovercraft', 8, 1.2), g('strider', 4, 2.3, 1)),
        w(g('strider', 6, 2), g('mech', 7, 1.6, 1)),
        w(g('drone', 14, 0.6), g('hovercraft', 9, 1.2, 1), g('plane', 10, 0.7, 2)),
        w(g('strider', 7, 1.9), g('mech', 9, 1.5, 1), g('ship', 6, 1.4, 2)),
        w(g('strider', 8, 1.8), g('mech', 10, 1.5, 1), g('drone', 14, 0.6, 2), g('hovercraft', 10, 1.2, 2)),
      ];
    case 18:
      return [
        w(g('drone', 16, 0.6), g('plane', 10, 0.75, 1), g('strider', 4, 2.5, 2)),
        w(g('strider', 5, 2.2), g('drone', 12, 0.65, 1)),
        w(g('mech', 9, 1.5), g('drone', 14, 0.6, 1), g('strider', 6, 2, 2), g('ship', 5, 1.5, 1)),
        w(g('strider', 6, 2), g('hovercraft', 8, 1.2, 1)),
        w(g('drone', 16, 0.55), g('plane', 10, 0.7, 1)),
        w(g('strider', 7, 1.9), g('mech', 9, 1.5, 1)),
        w(g('hovercraft', 10, 1.2), g('drone', 16, 0.55, 1), g('ship', 6, 1.4, 2)),
        w(g('strider', 8, 1.8), g('mech', 10, 1.4, 1), g('drone', 16, 0.55, 2)),
        w(g('strider', 9, 1.7), g('mech', 12, 1.4, 1), g('drone', 18, 0.5, 2), g('plane', 12, 0.65, 2)),
      ];
    case 19:
      return [
        w(g('mech', 8, 1.5), g('drone', 12, 0.65, 1)),
        w(g('strider', 6, 2), g('hovercraft', 8, 1.2, 1)),
        w(g('strider', 5, 2, 0, 0, 1.4), g('mech', 8, 1.5, 1)),
        w(g('drone', 18, 0.5), g('plane', 10, 0.7, 1)),
        w(g('strider', 7, 1.9), g('ship', 7, 1.3, 1)),
        w(g('mech', 10, 1.4), g('strider', 6, 2, 1)),
        w(g('hovercraft', 10, 1.2), g('drone', 18, 0.5, 1), g('mech', 8, 1.5, 2)),
        w(g('strider', 6, 2, 0, 0, 1.5), g('mech', 10, 1.4, 1)),
        w(g('strider', 8, 1.8), g('drone', 20, 0.5, 1), g('plane', 12, 0.65, 2)),
        w(g('strider', 3, 2.6, 0, 0, 3), g('strider', 6, 1.9, 1, 0, 1.6), g('mech', 12, 1.3, 2), g('drone', 20, 0.5, 2), g('hovercraft', 10, 1.2, 2)),
      ];
    case 20:
    default:
      return [
        w(g('infantry', 16, 0.45), g('truck', 10, 0.7, 1), g('drone', 14, 0.6, 2), g('mech', 4, 1.8, 1)),
        w(g('mech', 8, 1.5), g('hovercraft', 6, 1.3, 1)),
        w(g('strider', 6, 2), g('plane', 10, 0.7, 1)),
        w(g('tank', 8, 1.5), g('drone', 14, 0.6, 1)),
        w(g('ship', 8, 1.3), g('mech', 8, 1.5, 1)),
        w(g('strider', 7, 1.9), g('hovercraft', 8, 1.2, 1)),
        w(g('mech', 10, 1.4), g('drone', 16, 0.55, 1), g('truck', 10, 0.65, 2)),
        w(g('strider', 7, 1.9, 0, 0, 1.5), g('ship', 8, 1.3, 1)),
        w(g('strider', 8, 1.8), g('mech', 12, 1.3, 1), g('plane', 12, 0.65, 2)),
        w(g('hovercraft', 12, 1.1), g('drone', 20, 0.5, 1), g('tank', 8, 1.5, 2)),
        w(g('strider', 8, 1.8, 0, 0, 1.8), g('mech', 14, 1.3, 1), g('ship', 8, 1.3, 2)),
        w(g('strider', 4, 2.4, 0, 0, 3), g('strider', 8, 1.8, 1, 0, 1.8), g('mech', 16, 1.2, 2), g('drone', 24, 0.45, 2), g('hovercraft', 12, 1.1, 2), g('plane', 14, 0.6, 2)),
      ];
  }
}

const WATER_LEVELS = new Set([3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

// 威胁权重：用于按强度分配每波兵种构成，避免高级兵种过早扎堆
const THREAT: Record<EnemyType, number> = {
  infantry: 1, truck: 2, tank: 5, ship: 4, plane: 2.5,
  mech: 7, drone: 2.5, hovercraft: 5, strider: 11,
  bomber: 8.5, helicopter: 6, destroyer: 10, submarine: 7,
};

// 兵种首次登场关卡，用于计算"成熟度"：新兵种先少量试探，再逐步成为主力
const INTRO: Record<EnemyType, number> = {
  infantry: 1, truck: 2, ship: 3, tank: 4, plane: 5,
  mech: 11, drone: 12, hovercraft: 13, strider: 16,
  bomber: 9, helicopter: 7, destroyer: 14, submarine: 10,
};

function unlockedTypes(level: number): EnemyType[] {
  const types: EnemyType[] = ['infantry'];
  if (level >= 2) types.push('truck');
  if (level >= 4) types.push('tank');
  if (level >= 3 && WATER_LEVELS.has(level)) types.push('ship');
  if (level >= 5) types.push('plane');
  if (level >= 7) types.push('helicopter');
  if (level >= 11) types.push('mech');
  if (level >= 12) types.push('drone');
  if (level >= 9) types.push('bomber');
  if (level >= 10 && WATER_LEVELS.has(level)) types.push('submarine');
  if (level >= 13 && WATER_LEVELS.has(level)) types.push('hovercraft');
  if (level >= 14 && WATER_LEVELS.has(level)) types.push('destroyer');
  if (level >= 16) types.push('strider');
  return types;
}

function wavesFor(level: number): Wave[] {
  const waveCount = Math.min(12, 4 + Math.floor(level / 2));
  const pool = unlockedTypes(level);
  const waves: Wave[] = [];

  for (let i = 0; i < waveCount; i++) {
    const boss = i === waveCount - 1;
    const total = Math.round((3 + level * 0.32) * (1 + i * 0.1) * (boss ? 1.25 : 1));

    // 按路线分组：地面 / 水路 / 空中。每条存在的路线都按自身难度档位选兵，
    // 确保有水的关卡必定编排水面敌人，空中单位也会随进度稳定登场。
    const groundPool = pool.filter((t) => ENEMY_CONFIG[t].kind === 'ground').sort((a, b) => INTRO[a] - INTRO[b]);
    const waterPool = pool.filter((t) => ENEMY_CONFIG[t].kind === 'water').sort((a, b) => INTRO[a] - INTRO[b]);
    const airPool = pool.filter((t) => ENEMY_CONFIG[t].kind === 'air').sort((a, b) => INTRO[a] - INTRO[b]);

    const tierFor = (list: EnemyType[]) =>
      Math.min(list.length, 1 + Math.floor(level / 6) + (i >= waveCount * 0.6 && !boss ? 1 : 0));
    const pickFrom = (list: EnemyType[]): EnemyType[] => {
      if (!list.length) return [];
      const available = list.slice(0, tierFor(list));
      // 前两波只放每条路线最基础的单位，之后按进度在中高档位间轮换
      if (i < 2) return [available[0]];
      const idx = (i + level) % available.length;
      return [available[idx]];
    };

    let selected: EnemyType[] = [
      ...pickFrom(groundPool),
      ...pickFrom(waterPool),
      ...pickFrom(airPool),
    ];
    // 后期地面波次追加第二种地面兵，丰富构成（复试关卡早期仍保持单一）
    if (i >= 4 && groundPool.length > 1 && !boss) {
      const extra = groundPool[(i + level + 1) % Math.max(1, tierFor(groundPool))];
      if (extra && !selected.includes(extra)) selected.push(extra);
    }

    // 按路线分配数量：每条路线至少 2 个单位形成编队，避免"一个人/一艘船"的稀疏感。
    // 地面作为主力至少 3 个，水军/空军编队规模随关卡缓慢扩大。
    const flankSize = Math.max(2, Math.min(4, 1 + Math.floor(level / 6)));
    const counts = selected.map((type) => {
      const kind = ENEMY_CONFIG[type].kind;
      if (kind === 'ground') return Math.max(3, Math.round(total * 0.5));
      return flankSize;
    });
    const groups = selected.map((type, idx) => {
      const count = counts[idx];
      const interval = type === 'ship' || type === 'hovercraft' || type === 'destroyer' ? 1.5
        : type === 'submarine' ? 1.2
        : type === 'strider' || type === 'mech' || type === 'bomber' ? 2.1
        : type === 'tank' ? 1.8
        : type === 'drone' ? 0.6 : 0.8;
      const hpScale = boss ? 1.3 + level * 0.015 : 1 + i * 0.015;
      return g(type, count, interval, idx * 1.1, idx % 2, hpScale);
    });

    if (boss) {
      const bossType = [...pool].sort((a, b) => THREAT[b] - THREAT[a])[0];
      const lastSpawn = Math.max(...groups.map((item) => item.delay + (item.count - 1) * item.interval));
      const bossHpScale = (1.15 + level * 0.05) * (1.3 + level * 0.015);
      groups.push(g(bossType, 1, 1, lastSpawn + 1.6, 0, bossHpScale, true));
    }
    waves.push(w(...groups));
  }
  return waves;
}

const theme = (t: LevelTheme) => t;

export const LEVELS: LevelDef[] = [
  {
    id: 1, name: '前线哨所', desc: '草原前哨，S 形路线适合熟悉炮台射程。', gold: 280, lives: 20,
    theme: theme({ ground: '#36472d', path: '#756746', water: '#235d78', sky: '#1b2619', fog: '#1b2619', deco: 'trees', ambient: 1.05, sun: 1.15 }),
    ground: [[[0,7],[10,7],[10,6],[22,6],[22,7]]],
    water: [], waves: wavesFor(1),
  },
  {
    id: 2, name: '山谷回廊', desc: '岩壁山谷，长折线拉长敌人暴露时间。', gold: 300, lives: 20,
    theme: theme({ ground: '#424137', path: '#847352', water: '#22576f', sky: '#22231d', fog: '#22231d', deco: 'rocks', ambient: 1.0, sun: 1.2 }),
    ground: [[[0,7],[6,7],[6,3],[14,3],[14,11],[22,11],[22,7]]],
    water: [], waves: wavesFor(2),
  },
  {
    id: 3, name: '河畔防线', desc: '河网地带，地面与水路首次并行推进。', gold: 320, lives: 20,
    theme: theme({ ground: '#344c36', path: '#726346', water: '#1e6c8a', sky: '#182821', fog: '#182821', deco: 'reeds', ambient: 1.05, sun: 1.1 }),
    ground: [[[0,6],[6,6],[6,10],[13,10],[13,4],[20,4],[20,7],[22,7]]],
    water: [[[0,13],[22,13]]],
    waves: wavesFor(3),
  },
  {
    id: 4, name: '丛林绕行', desc: '密林回环，多层弯道与坦克威胁并存。', gold: 345, lives: 22,
    theme: theme({ ground: '#29452e', path: '#5f5339', water: '#1d6479', sky: '#14231a', fog: '#14231a', deco: 'forest', ambient: 1.15, sun: 0.95 }),
    ground: [[[0,7],[4,7],[4,3],[9,3],[9,12],[15,12],[15,5],[20,5],[20,10],[22,10],[22,7]]],
    water: [[[0,13],[8,13],[8,11],[16,11],[16,13],[22,13]]],
    waves: wavesFor(4),
  },
  {
    id: 5, name: '港口城市', desc: '港区街区，地面、水路、空中三线交汇。', gold: 370, lives: 22,
    theme: theme({ ground: '#414038', path: '#786d56', water: '#1c607c', sky: '#22262b', fog: '#22262b', deco: 'crates', ambient: 0.95, sun: 1.05 }),
    ground: [[[0,5],[5,5],[5,11],[10,11],[10,3],[15,3],[15,10],[20,10],[20,6],[22,6],[22,7]]],
    water: [[[0,13],[9,13],[9,10],[17,10],[17,13],[22,13]]],
    waves: wavesFor(5),
  },
  {
    id: 6, name: '铁路枢纽', desc: '交错轨道，高速折线考验火力覆盖。', gold: 395, lives: 22,
    theme: theme({ ground: '#454137', path: '#7c6b49', water: '#235c74', sky: '#23241e', fog: '#23241e', deco: 'rails', ambient: 1.0, sun: 1.15 }),
    ground: [[[0,8],[4,8],[4,2],[9,2],[9,12],[14,12],[14,5],[19,5],[19,13],[22,13],[22,7]]],
    water: [[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]]],
    waves: wavesFor(6),
  },
  {
    id: 7, name: '分岔河口', desc: '双地面路线加水路，敌人从三个方向推进。', gold: 420, lives: 24,
    theme: theme({ ground: '#384e3a', path: '#746647', water: '#206a84', sky: '#1a2a25', fog: '#1a2a25', deco: 'reeds', ambient: 1.05, sun: 1.05 }),
    ground: [[[0,3],[5,3],[5,9],[10,9],[10,2],[15,2],[15,10],[20,10],[20,7],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,7],[22,7]]],
    water: [[[0,13],[8,13],[8,10],[14,10],[14,13],[22,13]]],
    waves: wavesFor(7),
  },
  {
    id: 8, name: '夜间突袭', desc: '夜色长蛇阵，视野与火力分配同样重要。', gold: 445, lives: 24,
    theme: theme({ ground: '#2b3a33', path: '#696349', water: '#20566e', sky: '#111a1f', fog: '#111a1f', deco: 'rocks', ambient: 0.72, sun: 0.68, night: true }),
    ground: [[[0,7],[3,7],[3,13],[8,13],[8,3],[13,3],[13,12],[18,12],[18,4],[21,4],[21,7],[22,7]]],
    water: [[[0,12],[6,12],[6,9],[12,9],[12,12],[18,12],[18,14],[22,14],[22,13]]],
    waves: wavesFor(8),
  },
  {
    id: 9, name: '要塞外围', desc: '石砌要塞迷宫，首领级单位压轴登场。', gold: 470, lives: 24,
    theme: theme({ ground: '#413b33', path: '#806e4c', water: '#1e5b72', sky: '#26221d', fog: '#26221d', deco: 'ruins', ambient: 0.95, sun: 1.1 }),
    ground: [[[0,6],[3,6],[3,2],[7,2],[7,11],[12,11],[12,3],[16,3],[16,12],[20,12],[20,5],[22,5],[22,7]]],
    water: [[[0,13],[9,13],[9,10],[15,10],[15,13],[20,13],[20,12],[22,12],[22,13]]],
    waves: wavesFor(9),
  },
  {
    id: 10, name: '最终防线', desc: '三线并行决战，全部兵种与首领混编。', gold: 500, lives: 26,
    theme: theme({ ground: '#46382f', path: '#8c6c47', water: '#225f7d', sky: '#2b1d19', fog: '#2b1d19', deco: 'ruins', ambient: 1.0, sun: 1.25 }),
    ground: [[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,9],[19,9],[19,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]]],
    waves: wavesFor(10),
  },
  {
    id: 11, name: '荒漠前线', desc: '沙海双线，机甲首次登场。', gold: 530, lives: 26,
    theme: theme({ ground: '#5a4a33', path: '#8c7348', water: '#2a6a80', sky: '#3a2a1c', fog: '#3a2a1c', deco: 'desert', ambient: 1.15, sun: 1.3 }),
    ground: [[[0,4],[5,4],[5,10],[10,10],[10,2],[15,2],[15,9],[20,9],[20,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[9,6],[9,13],[14,13],[14,8],[19,8],[19,12],[22,12],[22,7]]],
    water: [], waves: wavesFor(11),
  },
  {
    id: 12, name: '密林深处', desc: '密林与溪流，无人机群开始骚扰。', gold: 560, lives: 26,
    theme: theme({ ground: '#2e4a33', path: '#67583c', water: '#1f6a7e', sky: '#16271d', fog: '#16271d', deco: 'forest', ambient: 1.1, sun: 1.0 }),
    ground: [[[0,3],[4,3],[4,9],[9,9],[9,2],[14,2],[14,10],[19,10],[19,6],[22,6],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,8],[21,8],[21,11],[22,11],[22,7]]],
    water: [[[0,13],[7,13],[7,10],[13,10],[13,13],[19,13],[22,13]]],
    waves: wavesFor(12),
  },
  {
    id: 13, name: '滨海新城', desc: '城市街区，气垫船沿水道突进。', gold: 590, lives: 28,
    theme: theme({ ground: '#484947', path: '#7d7768', water: '#226884', sky: '#2b3138', fog: '#2b3138', deco: 'city', ambient: 1.0, sun: 1.05 }),
    ground: [[[0,4],[5,4],[5,10],[10,10],[10,2],[15,2],[15,9],[20,9],[20,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[8,6],[8,13],[13,13],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,11],[22,11],[22,13]]],
    waves: wavesFor(13),
  },
  {
    id: 14, name: '深水航道', desc: '三条水道并行，舰船与气垫船混合推进。', gold: 620, lives: 28,
    theme: theme({ ground: '#33505a', path: '#6d745f', water: '#1b78a0', sky: '#17303e', fog: '#17303e', deco: 'reeds', ambient: 1.05, sun: 1.1 }),
    ground: [[[0,7],[4,7],[4,13],[9,13],[9,4],[14,4],[14,12],[19,12],[19,7],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[4,12],[4,9],[9,9],[9,14],[14,14],[14,11],[22,11],[22,13]],[[0,11],[3,11],[3,8],[8,8],[8,12],[13,12],[13,10],[22,10],[22,13]]],
    waves: wavesFor(14),
  },
  {
    id: 15, name: '峡谷要塞', desc: '狭长峡谷，电磁轨道炮的理想战场。', gold: 650, lives: 28,
    theme: theme({ ground: '#514433', path: '#927449', water: '#215f73', sky: '#2e2018', fog: '#2e2018', deco: 'rocks', ambient: 1.0, sun: 1.25 }),
    ground: [[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,7],[19,7],[19,3],[22,3],[22,7]],[[0,12],[4,12],[4,5],[9,5],[9,14],[14,14],[14,8],[19,8],[19,12],[22,12],[22,7]]],
    water: [[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]]],
    waves: wavesFor(15),
  },
  {
    id: 16, name: '极寒边境', desc: '雪原三线，步行者踏雪而来。', gold: 680, lives: 28,
    theme: theme({ ground: '#6b7b7d', path: '#a39c86', water: '#3d7f96', sky: '#3b4a55', fog: '#3b4a55', deco: 'snow', ambient: 1.2, sun: 1.0 }),
    ground: [[[0,2],[4,2],[4,7],[9,7],[9,1],[14,1],[14,8],[19,8],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,6],[14,6],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]]],
    waves: wavesFor(16),
  },
  {
    id: 17, name: '陨石荒原', desc: '陨坑密布，机械与空中单位混编。', gold: 710, lives: 30,
    theme: theme({ ground: '#4a3f3a', path: '#8a6d50', water: '#2a6076', sky: '#30211d', fog: '#30211d', deco: 'space', ambient: 0.95, sun: 1.1 }),
    ground: [[[0,3],[5,3],[5,9],[10,9],[10,2],[15,2],[15,10],[20,10],[20,6],[22,6],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,8],[21,8],[21,12],[22,12],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[4,12],[4,8],[9,8],[9,13],[14,13],[14,10],[22,10],[22,13]]],
    waves: wavesFor(17),
  },
  {
    id: 18, name: '轨道空间站', desc: '未来战场，无人机与步行者高密度来袭。', gold: 740, lives: 30,
    theme: theme({ ground: '#3d4150', path: '#7b7f92', water: '#2c6f9a', sky: '#1c2133', fog: '#1c2133', deco: 'space', ambient: 0.95, sun: 1.05 }),
    ground: [[[0,2],[4,2],[4,7],[9,7],[9,1],[14,1],[14,8],[19,8],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,5],[14,5],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,11],[22,11],[22,13]]],
    waves: wavesFor(18),
  },
  {
    id: 19, name: '星门守卫', desc: '星门前哨，首领级步行者压轴。', gold: 770, lives: 30,
    theme: theme({ ground: '#423a4f', path: '#8b7896', water: '#356f9c', sky: '#241d33', fog: '#241d33', deco: 'space', ambient: 1.0, sun: 1.15 }),
    ground: [[[0,3],[4,3],[4,10],[9,10],[9,2],[14,2],[14,9],[19,9],[19,4],[22,4],[22,7]],[[0,12],[4,12],[4,5],[9,5],[9,14],[14,14],[14,7],[19,7],[19,12],[22,12],[22,7]]],
    water: [[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]],[[0,14],[4,14],[4,10],[10,10],[10,13],[16,13],[16,12],[22,12],[22,13]]],
    waves: wavesFor(19),
  },
  {
    id: 20, name: '终极防线', desc: '三地面三水道、全兵种首领混编的最终决战。', gold: 800, lives: 32,
    theme: theme({ ground: '#4a2f3a', path: '#9a6f57', water: '#3a7ba6', sky: '#341824', fog: '#341824', deco: 'space', ambient: 1.05, sun: 1.3 }),
    ground: [[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,9],[19,9],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,5],[14,5],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,10],[22,10],[22,13]],[[0,11],[5,11],[5,8],[11,8],[11,12],[17,12],[17,10],[22,10],[22,13]]],
    waves: wavesFor(20),
  },
];
