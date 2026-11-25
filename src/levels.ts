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

const LANES_PER_LEVEL: Record<number, { ground: number; water: number }> = {
  1: { ground: 1, water: 0 }, 2: { ground: 1, water: 0 }, 3: { ground: 1, water: 1 },
  4: { ground: 1, water: 1 }, 5: { ground: 1, water: 1 }, 6: { ground: 1, water: 1 },
  7: { ground: 2, water: 1 }, 8: { ground: 1, water: 1 }, 9: { ground: 1, water: 1 },
  10: { ground: 2, water: 1 }, 11: { ground: 2, water: 0 }, 12: { ground: 2, water: 1 },
  13: { ground: 2, water: 2 }, 14: { ground: 1, water: 3 }, 15: { ground: 2, water: 1 },
  16: { ground: 3, water: 1 }, 17: { ground: 2, water: 2 }, 18: { ground: 3, water: 2 },
  19: { ground: 2, water: 2 }, 20: { ground: 3, water: 3 },
};

// 波次生成器：保证两条递进曲线
//   1. 跨关卡：波次数量、兵种池、兵力预算随 level 增长，再叠加 difficultyScale 的生命放大
//   2. 关卡内：威胁上限随波次逐级放开，首波只有最弱兵种，压轴波覆盖本关全部兵种并附带首领
function wavesFor(level: number): Wave[] {
  const waveCount = Math.min(12, 4 + Math.floor(level / 2));
  const pool = unlockedTypes(level);
  const laneInfo = LANES_PER_LEVEL[level] ?? { ground: 1, water: 0 };
  const byKind = (kind: 'ground' | 'air' | 'water') =>
    pool.filter((t) => ENEMY_CONFIG[t].kind === kind)
      .sort((a, b) => THREAT[a] - THREAT[b] || INTRO[a] - INTRO[b]);
  const ground = byKind('ground');
  const air = byKind('air');
  const water = byKind('water');
  const lanes = [ground, air, water].filter((list) => list.length > 0);
  const sortedThreats = pool.map((t) => THREAT[t]).sort((a, b) => a - b);
  const maxThreat = sortedThreats[sortedThreats.length - 1];
  const seen = new Set<EnemyType>();
  const waves: Wave[] = [];

  for (let i = 0; i < waveCount; i++) {
    const boss = i === waveCount - 1;
    const progress = waveCount > 1 ? i / (waveCount - 1) : 1;
    // 本波威胁上限：从全池最弱逐级放开到最强（系数 1.3 让中段过渡更平缓）
    const capIdx = boss
      ? sortedThreats.length - 1
      : Math.min(sortedThreats.length - 1, Math.floor(progress * sortedThreats.length * 1.3));
    const threatCap = sortedThreats[capIdx];

    const selected: EnemyType[] = [];
    const add = (type?: EnemyType) => { if (type && !selected.includes(type)) selected.push(type); };

    // 每条通路的主力兵种：随波次从弱到强推进
    lanes.forEach((list, laneIdx) => {
      const candidates = list.filter((t) => THREAT[t] <= threatCap);
      if (candidates.length === 0) return;
      const pick = Math.min(candidates.length - 1, Math.floor(progress * candidates.length * 1.25 + laneIdx * 0.2));
      add(candidates[pick]);
    });

    // 第 3 波起补充低威胁步兵系护卫，维持兵力密度（首领波让位给首领）
    if (i >= 2 && !boss) {
      const escorts = ground.filter((t) => THREAT[t] <= 2.5);
      if (escorts.length) add(escorts[(i + Math.floor(level / 2)) % escorts.length]);
    }

    // 本关解锁的每种敌人都至少登场一次（不超过当前威胁上限）
    for (const type of pool) {
      if (selected.length >= 4) break;
      if (!seen.has(type) && THREAT[type] <= threatCap) add(type);
    }
    selected.forEach((type) => seen.add(type));

    const groups = selected.map((type, idx) => {
      const threat = THREAT[type];
      // 兵力预算随关卡与波次双重递增；威胁越高的兵种数量越少
      let count = threat <= 2.5
        ? 6 + Math.floor(level / 5) + Math.floor(i * 0.8)
        : threat <= 6
          ? 3 + Math.floor(level / 6) + Math.floor(i / 2)
          : 2 + Math.floor(level / 8) + Math.floor(i / 3);
      count = Math.min(20, count);
      const interval = type === 'ship' || type === 'hovercraft' || type === 'destroyer' ? 1.5
        : type === 'submarine' ? 1.2
        : type === 'strider' || type === 'mech' || type === 'bomber' ? 2.1
        : type === 'tank' ? 1.8
        : type === 'drone' ? 0.7 : 0.85;
      // 关卡内生命微调：首波 0.92 起步，逐波爬升，首领单独另算
      const hpScale = 0.92 + i * 0.015;
      const lanesFor = ENEMY_CONFIG[type].kind === 'ground'
        ? laneInfo.ground
        : ENEMY_CONFIG[type].kind === 'water' ? laneInfo.water : 1;
      return g(type, count, interval, idx * 0.9, idx % Math.max(1, lanesFor), hpScale);
    });

    if (boss) {
      // 首领：本关最强兵种的巨型强化版，压轴登场
      const bossType = [...pool].sort((a, b) => THREAT[b] - THREAT[a])[0];
      const lastSpawn = Math.max(...groups.map((item) => item.delay + (item.count - 1) * item.interval), 0);
      groups.push(g(bossType, 1, 1, lastSpawn + 1.4, 0, 1.2 + level * 0.05, true));
    }
    waves.push(w(...groups));
  }
  return waves;
}

const theme = (t: LevelTheme) => t;

export const LEVELS: LevelDef[] = [
  {
    id: 1, name: '前线哨所', desc: '草原前哨，S 形路线适合熟悉炮台射程。', gold: 260, lives: 20,
    theme: theme({ ground: '#36472d', path: '#756746', water: '#235d78', sky: '#1b2619', fog: '#1b2619', deco: 'trees', ambient: 1.05, sun: 1.15 }),
    ground: [[[0,7],[10,7],[10,6],[22,6],[22,7]]],
    water: [], waves: wavesFor(1),
  },
  {
    id: 2, name: '山谷回廊', desc: '岩壁山谷，长折线拉长敌人暴露时间。', gold: 280, lives: 20,
    theme: theme({ ground: '#424137', path: '#847352', water: '#22576f', sky: '#22231d', fog: '#22231d', deco: 'rocks', ambient: 1.0, sun: 1.2 }),
    ground: [[[0,7],[6,7],[6,3],[14,3],[14,11],[22,11],[22,7]]],
    water: [], waves: wavesFor(2),
  },
  {
    id: 3, name: '河畔防线', desc: '河网地带，地面与水路首次并行推进。', gold: 300, lives: 20,
    theme: theme({ ground: '#344c36', path: '#726346', water: '#1e6c8a', sky: '#182821', fog: '#182821', deco: 'reeds', ambient: 1.05, sun: 1.1 }),
    ground: [[[0,6],[6,6],[6,10],[13,10],[13,4],[20,4],[20,7],[22,7]]],
    water: [[[0,13],[22,13]]],
    waves: wavesFor(3),
  },
  {
    id: 4, name: '丛林绕行', desc: '密林回环，多层弯道与坦克威胁并存。', gold: 320, lives: 22,
    theme: theme({ ground: '#29452e', path: '#5f5339', water: '#1d6479', sky: '#14231a', fog: '#14231a', deco: 'forest', ambient: 1.15, sun: 0.95 }),
    ground: [[[0,7],[4,7],[4,3],[9,3],[9,12],[15,12],[15,5],[20,5],[20,10],[22,10],[22,7]]],
    water: [[[0,13],[8,13],[8,11],[16,11],[16,13],[22,13]]],
    waves: wavesFor(4),
  },
  {
    id: 5, name: '港口城市', desc: '港区街区，地面、水路、空中三线交汇。', gold: 340, lives: 22,
    theme: theme({ ground: '#414038', path: '#786d56', water: '#1c607c', sky: '#22262b', fog: '#22262b', deco: 'crates', ambient: 0.95, sun: 1.05 }),
    ground: [[[0,5],[5,5],[5,11],[10,11],[10,3],[15,3],[15,10],[20,10],[20,6],[22,6],[22,7]]],
    water: [[[0,13],[9,13],[9,10],[17,10],[17,13],[22,13]]],
    waves: wavesFor(5),
  },
  {
    id: 6, name: '铁路枢纽', desc: '交错轨道，高速折线考验火力覆盖。', gold: 360, lives: 22,
    theme: theme({ ground: '#454137', path: '#7c6b49', water: '#235c74', sky: '#23241e', fog: '#23241e', deco: 'rails', ambient: 1.0, sun: 1.15 }),
    ground: [[[0,8],[4,8],[4,2],[9,2],[9,12],[14,12],[14,5],[19,5],[19,13],[22,13],[22,7]]],
    water: [[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]]],
    waves: wavesFor(6),
  },
  {
    id: 7, name: '分岔河口', desc: '双地面路线加水路，敌人从三个方向推进。', gold: 380, lives: 24,
    theme: theme({ ground: '#384e3a', path: '#746647', water: '#206a84', sky: '#1a2a25', fog: '#1a2a25', deco: 'reeds', ambient: 1.05, sun: 1.05 }),
    ground: [[[0,3],[5,3],[5,9],[10,9],[10,2],[15,2],[15,10],[20,10],[20,7],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,7],[22,7]]],
    water: [[[0,13],[8,13],[8,10],[14,10],[14,13],[22,13]]],
    waves: wavesFor(7),
  },
  {
    id: 8, name: '夜间突袭', desc: '夜色长蛇阵，视野与火力分配同样重要。', gold: 400, lives: 24,
    theme: theme({ ground: '#2b3a33', path: '#696349', water: '#20566e', sky: '#111a1f', fog: '#111a1f', deco: 'rocks', ambient: 0.72, sun: 0.68, night: true }),
    ground: [[[0,7],[3,7],[3,13],[8,13],[8,3],[13,3],[13,12],[18,12],[18,4],[21,4],[21,7],[22,7]]],
    water: [[[0,12],[6,12],[6,9],[12,9],[12,12],[18,12],[18,14],[22,14],[22,13]]],
    waves: wavesFor(8),
  },
  {
    id: 9, name: '要塞外围', desc: '石砌要塞迷宫，首领级单位压轴登场。', gold: 420, lives: 24,
    theme: theme({ ground: '#413b33', path: '#806e4c', water: '#1e5b72', sky: '#26221d', fog: '#26221d', deco: 'ruins', ambient: 0.95, sun: 1.1 }),
    ground: [[[0,6],[3,6],[3,2],[7,2],[7,11],[12,11],[12,3],[16,3],[16,12],[20,12],[20,5],[22,5],[22,7]]],
    water: [[[0,13],[9,13],[9,10],[15,10],[15,13],[20,13],[20,12],[22,12],[22,13]]],
    waves: wavesFor(9),
  },
  {
    id: 10, name: '最终防线', desc: '三线并行决战，全部兵种与首领混编。', gold: 450, lives: 26,
    theme: theme({ ground: '#46382f', path: '#8c6c47', water: '#225f7d', sky: '#2b1d19', fog: '#2b1d19', deco: 'ruins', ambient: 1.0, sun: 1.25 }),
    ground: [[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,9],[19,9],[19,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]]],
    waves: wavesFor(10),
  },
  {
    id: 11, name: '荒漠前线', desc: '沙海双线，机甲首次登场。', gold: 480, lives: 26,
    theme: theme({ ground: '#5a4a33', path: '#8c7348', water: '#2a6a80', sky: '#3a2a1c', fog: '#3a2a1c', deco: 'desert', ambient: 1.15, sun: 1.3 }),
    ground: [[[0,4],[5,4],[5,10],[10,10],[10,2],[15,2],[15,9],[20,9],[20,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[9,6],[9,13],[14,13],[14,8],[19,8],[19,12],[22,12],[22,7]]],
    water: [], waves: wavesFor(11),
  },
  {
    id: 12, name: '密林深处', desc: '密林与溪流，无人机群开始骚扰。', gold: 500, lives: 26,
    theme: theme({ ground: '#2e4a33', path: '#67583c', water: '#1f6a7e', sky: '#16271d', fog: '#16271d', deco: 'forest', ambient: 1.1, sun: 1.0 }),
    ground: [[[0,3],[4,3],[4,9],[9,9],[9,2],[14,2],[14,10],[19,10],[19,6],[22,6],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,8],[21,8],[21,11],[22,11],[22,7]]],
    water: [[[0,13],[7,13],[7,10],[13,10],[13,13],[19,13],[22,13]]],
    waves: wavesFor(12),
  },
  {
    id: 13, name: '滨海新城', desc: '城市街区，气垫船沿水道突进。', gold: 520, lives: 28,
    theme: theme({ ground: '#484947', path: '#7d7768', water: '#226884', sky: '#2b3138', fog: '#2b3138', deco: 'city', ambient: 1.0, sun: 1.05 }),
    ground: [[[0,4],[5,4],[5,10],[10,10],[10,2],[15,2],[15,9],[20,9],[20,6],[22,6],[22,7]],[[0,12],[4,12],[4,6],[8,6],[8,13],[13,13],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,11],[22,11],[22,13]]],
    waves: wavesFor(13),
  },
  {
    id: 14, name: '深水航道', desc: '三条水道并行，舰船与气垫船混合推进。', gold: 540, lives: 28,
    theme: theme({ ground: '#33505a', path: '#6d745f', water: '#1b78a0', sky: '#17303e', fog: '#17303e', deco: 'reeds', ambient: 1.05, sun: 1.1 }),
    ground: [[[0,7],[4,7],[4,13],[9,13],[9,4],[14,4],[14,12],[19,12],[19,7],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[4,12],[4,9],[9,9],[9,14],[14,14],[14,11],[22,11],[22,13]],[[0,11],[3,11],[3,8],[8,8],[8,12],[13,12],[13,10],[22,10],[22,13]]],
    waves: wavesFor(14),
  },
  {
    id: 15, name: '峡谷要塞', desc: '狭长峡谷，电磁轨道炮的理想战场。', gold: 560, lives: 28,
    theme: theme({ ground: '#514433', path: '#927449', water: '#215f73', sky: '#2e2018', fog: '#2e2018', deco: 'rocks', ambient: 1.0, sun: 1.25 }),
    ground: [[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,7],[19,7],[19,3],[22,3],[22,7]],[[0,12],[4,12],[4,5],[9,5],[9,14],[14,14],[14,8],[19,8],[19,12],[22,12],[22,7]]],
    water: [[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]]],
    waves: wavesFor(15),
  },
  {
    id: 16, name: '极寒边境', desc: '雪原三线，步行者踏雪而来。', gold: 580, lives: 28,
    theme: theme({ ground: '#6b7b7d', path: '#a39c86', water: '#3d7f96', sky: '#3b4a55', fog: '#3b4a55', deco: 'snow', ambient: 1.2, sun: 1.0 }),
    ground: [[[0,2],[4,2],[4,7],[9,7],[9,1],[14,1],[14,8],[19,8],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,6],[14,6],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]]],
    waves: wavesFor(16),
  },
  {
    id: 17, name: '陨石荒原', desc: '陨坑密布，机械与空中单位混编。', gold: 600, lives: 30,
    theme: theme({ ground: '#4a3f3a', path: '#8a6d50', water: '#2a6076', sky: '#30211d', fog: '#30211d', deco: 'space', ambient: 0.95, sun: 1.1 }),
    ground: [[[0,3],[5,3],[5,9],[10,9],[10,2],[15,2],[15,10],[20,10],[20,6],[22,6],[22,7]],[[0,11],[5,11],[5,5],[10,5],[10,13],[16,13],[16,8],[21,8],[21,12],[22,12],[22,7]]],
    water: [[[0,13],[6,13],[6,10],[11,10],[11,14],[17,14],[17,12],[22,12],[22,13]],[[0,12],[4,12],[4,8],[9,8],[9,13],[14,13],[14,10],[22,10],[22,13]]],
    waves: wavesFor(17),
  },
  {
    id: 18, name: '轨道空间站', desc: '未来战场，无人机与步行者高密度来袭。', gold: 620, lives: 30,
    theme: theme({ ground: '#3d4150', path: '#7b7f92', water: '#2c6f9a', sky: '#1c2133', fog: '#1c2133', deco: 'space', ambient: 0.95, sun: 1.05 }),
    ground: [[[0,2],[4,2],[4,7],[9,7],[9,1],[14,1],[14,8],[19,8],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,5],[14,5],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,11],[22,11],[22,13]]],
    waves: wavesFor(18),
  },
  {
    id: 19, name: '星门守卫', desc: '星门前哨，首领级步行者压轴。', gold: 640, lives: 30,
    theme: theme({ ground: '#423a4f', path: '#8b7896', water: '#356f9c', sky: '#241d33', fog: '#241d33', deco: 'space', ambient: 1.0, sun: 1.15 }),
    ground: [[[0,3],[4,3],[4,10],[9,10],[9,2],[14,2],[14,9],[19,9],[19,4],[22,4],[22,7]],[[0,12],[4,12],[4,5],[9,5],[9,14],[14,14],[14,7],[19,7],[19,12],[22,12],[22,7]]],
    water: [[[0,13],[6,13],[6,9],[12,9],[12,14],[18,14],[18,11],[22,11],[22,13]],[[0,14],[4,14],[4,10],[10,10],[10,13],[16,13],[16,12],[22,12],[22,13]]],
    waves: wavesFor(19),
  },
  {
    id: 20, name: '终极防线', desc: '三地面三水道、全兵种首领混编的最终决战。', gold: 680, lives: 32,
    theme: theme({ ground: '#4a2f3a', path: '#9a6f57', water: '#3a7ba6', sky: '#341824', fog: '#341824', deco: 'space', ambient: 1.05, sun: 1.3 }),
    ground: [[[0,2],[4,2],[4,8],[9,8],[9,1],[14,1],[14,9],[19,9],[19,5],[22,5],[22,7]],[[0,8],[4,8],[4,12],[9,12],[9,5],[14,5],[14,13],[19,13],[19,9],[22,9],[22,7]],[[0,13],[3,13],[3,6],[8,6],[8,14],[13,14],[13,7],[18,7],[18,11],[22,11],[22,7]]],
    water: [[[0,14],[6,14],[6,11],[12,11],[12,14],[18,14],[18,12],[22,12],[22,13]],[[0,12],[3,12],[3,9],[9,9],[9,13],[14,13],[14,10],[22,10],[22,13]],[[0,11],[5,11],[5,8],[11,8],[11,12],[17,12],[17,10],[22,10],[22,13]]],
    waves: wavesFor(20),
  },
];
