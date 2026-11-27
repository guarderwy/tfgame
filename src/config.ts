import type { EnemyConfig, EnemyType, TargetMode, TowerConfig, TowerType } from './types';

export const TILE = 40;
export const COLS = 24;
export const ROWS = 15;
export const WIDTH = COLS * TILE;
export const HEIGHT = ROWS * TILE;
export const BASE_TILE: [number, number] = [22, 7];

// 兵种数值按强度分六档，威胁权重见 levels.ts 的 THREAT：
//   基础(<15 金) → 进阶(15~29) → 重装(30~59) → 首领级(>=60)
// 护甲减伤公式：受伤 × 甲/(甲+50)，穿甲炮塔无视护甲
export const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  infantry: { name: '步兵', hp: 55, speed: 50, armor: 0, bounty: 8, damage: 1, color: '#d9c27a', kind: 'ground', size: 7, footprint: 28 },
  truck:    { name: '装甲车', hp: 130, speed: 62, armor: 4, bounty: 13, damage: 2, color: '#b58b4d', kind: 'ground', size: 10, footprint: 42 },
  plane:    { name: '飞机', hp: 90, speed: 92, armor: 2, bounty: 14, damage: 2, color: '#9fc4d8', kind: 'air', size: 10, footprint: 44 },
  drone:    { name: '无人机', hp: 80, speed: 108, armor: 2, bounty: 12, damage: 2, color: '#bcd8e8', kind: 'air', size: 8, footprint: 30, ability: 'dash' },
  helicopter:{ name: '武装直升机', hp: 220, speed: 72, armor: 6, bounty: 24, damage: 4, color: '#9dbf9a', kind: 'air', size: 12, footprint: 50, ability: 'dash' },
  hovercraft:{ name: '气垫船', hp: 340, speed: 52, armor: 8, bounty: 26, damage: 4, color: '#8fc9cf', kind: 'water', size: 14, footprint: 58 },
  submarine:{ name: '潜艇', hp: 440, speed: 40, armor: 13, bounty: 28, damage: 6, color: '#6e8fa8', kind: 'water', size: 13, footprint: 50, ability: 'dash' },
  tank:     { name: '坦克', hp: 430, speed: 30, armor: 15, bounty: 34, damage: 5, color: '#8f9a6a', kind: 'ground', size: 13, footprint: 54 },
  ship:     { name: '舰船', hp: 480, speed: 26, armor: 12, bounty: 38, damage: 5, color: '#7fa7b8', kind: 'water', size: 15, footprint: 66 },
  bomber:   { name: '轰炸机', hp: 320, speed: 56, armor: 10, bounty: 44, damage: 8, color: '#b9a6c8', kind: 'air', size: 14, footprint: 60, ability: 'regen' },
  mech:     { name: '机甲', hp: 700, speed: 36, armor: 22, bounty: 48, damage: 6, color: '#a89a72', kind: 'ground', size: 16, footprint: 60, ability: 'regen' },
  destroyer:{ name: '驱逐舰', hp: 760, speed: 30, armor: 18, bounty: 62, damage: 8, color: '#8fa8c0', kind: 'water', size: 18, footprint: 78, ability: 'regen' },
  strider:  { name: '步行者', hp: 1350, speed: 24, armor: 26, bounty: 95, damage: 10, color: '#c3aad9', kind: 'ground', size: 18, footprint: 72, ability: 'regen' },
};

// 炮塔性价比阶梯：约 0.4~0.7 DPS/金币，便宜炮塔效率高、单价低，
// 高级炮塔绝对火力强且有特性（溅射/穿甲/连锁），形成"攒钱升级"的正向循环
export const TOWER_CONFIG: Record<TowerType, TowerConfig> = {
  machinegun: {
    name: '机枪炮台', desc: '射速快，克制步兵与轻甲', cost: 60,
    damage: 10, range: 110, fireRate: 4, color: '#e0b34d', body: '#f2a72b', secondary: '#fff0c9', pattern: 'stripe',
    targets: ['ground'], splash: 0, projectileSpeed: 520,
  },
  howitzer: {
    name: '榴弹炮', desc: '范围爆炸，克制集群与坦克', cost: 90,
    damage: 42, range: 150, fireRate: 0.9, color: '#d9794a', body: '#ef5f2a', secondary: '#ffd9c2', pattern: 'chevron',
    targets: ['ground'], splash: 42, projectileSpeed: 300,
  },
  aa: {
    name: '防空炮', desc: '高速拦截空中单位，单体高射速', cost: 90,
    damage: 20, range: 150, fireRate: 4.2, color: '#69b6c9', body: '#00a6cf', secondary: '#d6f6ff', pattern: 'dot',
    targets: ['air'], splash: 0, projectileSpeed: 600,
  },
  coastal: {
    name: '岸防炮', desc: '重炮，专门攻击水路舰船', cost: 105,
    damage: 55, range: 170, fireRate: 1, color: '#8fa3c4', body: '#3f74d8', secondary: '#dbe7ff', pattern: 'grid',
    targets: ['water'], splash: 20, projectileSpeed: 340,
  },
  laser: {
    name: '激光炮', desc: '持续能量束，可打地面与空中', cost: 120,
    damage: 9, range: 140, fireRate: 4.5, color: '#79e2d6', body: '#00c9a7', secondary: '#d9fff5', pattern: 'circuit',
    targets: ['ground', 'air'], splash: 0, projectileSpeed: 760,
  },
  flak: {
    name: '防空爆破炮', desc: '空中范围爆炸，克制机群', cost: 130,
    damage: 38, range: 160, fireRate: 1.5, color: '#f0a95c', body: '#ff8a1f', secondary: '#ffe4bd', pattern: 'warning',
    targets: ['air'], splash: 50, projectileSpeed: 460,
  },
  railgun: {
    name: '电磁轨道炮', desc: '超远射程，无视护甲', cost: 180,
    damage: 120, range: 230, fireRate: 0.65, color: '#c9d6f0', body: '#5d8cf5', secondary: '#e3ecff', pattern: 'grid',
    targets: ['ground', 'water'], splash: 0, projectileSpeed: 1200, pierceArmor: true,
  },
  tesla: {
    name: '电弧塔', desc: '闪电连锁，最多命中 3 个地面目标', cost: 150,
    damage: 32, range: 132, fireRate: 1.8, color: '#b48cf0', body: '#9a4ff0', secondary: '#ead9ff', pattern: 'circuit',
    targets: ['ground'], splash: 0, projectileSpeed: 800, chain: 3,
  },
  mine: {
    name: '水雷布设器', desc: '建于水边陆地，定时向水路布雷；舰船触碰引爆，1级3颗起，满级5颗', cost: 90,
    damage: 45, range: 130, fireRate: 0.4, color: '#e4695d', body: '#e83737', secondary: '#ffd2cd', pattern: 'warning',
    targets: ['water'], splash: 52, projectileSpeed: 0, minelayer: true,
  },
};

// 侧栏展示与数字键顺序：按造价升序，同价保持配置顺序
export const TOWER_ORDER = (Object.keys(TOWER_CONFIG) as TowerType[])
  .sort((a, b) => TOWER_CONFIG[a].cost - TOWER_CONFIG[b].cost);

// 武器解锁：按当前选择的关卡判定
export const TOWER_UNLOCK: Record<TowerType, number> = {
  machinegun: 1, howitzer: 2, aa: 5, coastal: 3,
  laser: 7, flak: 9, railgun: 13, tesla: 11, mine: 3,
};
export function isTowerUnlocked(type: TowerType, unlockedLevel: number) {
  return unlockedLevel >= TOWER_UNLOCK[type];
}

export const UPGRADE_FACTOR = {
  damage: 1.4,
  range: 1.1,
  fireRate: 1.08,
  cost: 0.85,
};

export const SELL_REFUND = 0.6;
export const MAX_LEVEL = 3;

// 索敌优先级：每座炮塔独立设置，「最前」保持原有默认行为
export const TARGET_MODES: { id: TargetMode; label: string; desc: string }[] = [
  { id: 'first', label: '最前', desc: '优先攻击最接近基地的敌人（默认）' },
  { id: 'close', label: '最近', desc: '优先攻击离本炮塔最近的敌人' },
  { id: 'weak', label: '残血', desc: '优先补刀当前生命最低的敌人' },
  { id: 'strong', label: '高血', desc: '优先集火当前生命最高的敌人' },
  { id: 'bounty', label: '高赏金', desc: '优先击杀赏金最高的敌人' },
];
export const TARGET_MODE_LABEL: Record<TargetMode, string> = {
  first: '最前', close: '最近', weak: '残血', strong: '高血', bounty: '高赏金',
};

// 波次节奏与奖励：整备倒计时、提前出击奖励、清波奖励（随关卡成长）
export const WAVE_BREAK_SECONDS = 6;
export const WAVE_BREAK_BONUS = 8;
export const WAVE_CLEAR_BONUS_BASE = 16;
export const WAVE_CLEAR_BONUS_PER_LEVEL = 1;

// 星级评定：按通关时剩余基地生命比例换算（3 星 ≥80%，2 星 ≥50%，通关即 1 星）
export function starsFor(lives: number, maxLives: number): number {
  if (maxLives <= 0) return 1;
  if (lives >= maxLives * 0.8) return 3;
  if (lives >= maxLives * 0.5) return 2;
  return 1;
}

// 跨关难度曲线：敌人生命/赏金随关卡线性放大（第 20 关约 1.72 倍），
// 与压缩后的经济、波次数量和多路线分摊共同构成整体难度递进
export function difficultyScale(levelId: number) {
  return 1 + (levelId - 1) * 0.038;
}

export function tileToPixel(tx: number, ty: number): { x: number; y: number } {
  return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
}

export function pixelToTile(x: number, y: number): [number, number] {
  return [Math.floor(x / TILE), Math.floor(y / TILE)];
}
