import type { EnemyConfig, EnemyType, TowerConfig, TowerType } from './types';

export const TILE = 40;
export const COLS = 24;
export const ROWS = 15;
export const WIDTH = COLS * TILE;
export const HEIGHT = ROWS * TILE;
export const BASE_TILE: [number, number] = [22, 7];

export const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  infantry: { name: '步兵', hp: 78, speed: 48, armor: 0, bounty: 10, damage: 2, color: '#d9c27a', kind: 'ground', size: 7, footprint: 28 },
  truck:    { name: '装甲车', hp: 190, speed: 62, armor: 5, bounty: 18, damage: 3, color: '#b58b4d', kind: 'ground', size: 10, footprint: 42 },
  tank:     { name: '坦克', hp: 620, speed: 30, armor: 16, bounty: 45, damage: 6, color: '#8f9a6a', kind: 'ground', size: 13, footprint: 54 },
  plane:    { name: '飞机', hp: 120, speed: 96, armor: 2, bounty: 24, damage: 3, color: '#9fc4d8', kind: 'air', size: 10, footprint: 44 },
  ship:     { name: '舰船', hp: 640, speed: 26, armor: 12, bounty: 50, damage: 7, color: '#7fa7b8', kind: 'water', size: 15, footprint: 66 },
  mech:     { name: '机甲', hp: 980, speed: 38, armor: 24, bounty: 75, damage: 8, color: '#a89a72', kind: 'ground', size: 16, footprint: 60, ability: 'regen' },
  drone:    { name: '无人机', hp: 105, speed: 112, armor: 3, bounty: 22, damage: 3, color: '#bcd8e8', kind: 'air', size: 8, footprint: 30, ability: 'dash' },
  hovercraft:{ name: '气垫船', hp: 460, speed: 54, armor: 9, bounty: 40, damage: 6, color: '#8fc9cf', kind: 'water', size: 14, footprint: 58 },
  strider:  { name: '步行者', hp: 1800, speed: 25, armor: 30, bounty: 110, damage: 12, color: '#c3aad9', kind: 'ground', size: 18, footprint: 72, ability: 'regen' },
  bomber:   { name: '轰炸机', hp: 430, speed: 58, armor: 12, bounty: 65, damage: 10, color: '#b9a6c8', kind: 'air', size: 14, footprint: 60, ability: 'regen' },
  helicopter:{ name: '武装直升机', hp: 300, speed: 74, armor: 8, bounty: 48, damage: 8, color: '#9dbf9a', kind: 'air', size: 12, footprint: 50, ability: 'dash' },
  destroyer:{ name: '驱逐舰', hp: 1000, speed: 32, armor: 20, bounty: 78, damage: 11, color: '#8fa8c0', kind: 'water', size: 18, footprint: 78, ability: 'regen' },
  submarine:{ name: '潜艇', hp: 600, speed: 42, armor: 14, bounty: 58, damage: 9, color: '#6e8fa8', kind: 'water', size: 13, footprint: 50, ability: 'dash' },
};

export const TOWER_CONFIG: Record<TowerType, TowerConfig> = {
  machinegun: {
    name: '机枪炮台', desc: '射速快，克制步兵与轻甲', cost: 65,
    damage: 11, range: 112, fireRate: 4.2, color: '#e0b34d',
    targets: ['ground'], splash: 0, projectileSpeed: 520,
  },
  howitzer: {
    name: '榴弹炮', desc: '范围爆炸，克制集群与坦克', cost: 95,
    damage: 46, range: 158, fireRate: 0.9, color: '#d9794a',
    targets: ['ground'], splash: 40, projectileSpeed: 300,
  },
  aa: {
    name: '防空炮', desc: '专门拦截空中单位', cost: 95,
    damage: 16, range: 138, fireRate: 3.6, color: '#69b6c9',
    targets: ['air'], splash: 0, projectileSpeed: 600,
  },
  coastal: {
    name: '岸防炮', desc: '重炮，专门攻击水路舰船', cost: 115,
    damage: 62, range: 176, fireRate: 1, color: '#8fa3c4',
    targets: ['water'], splash: 22, projectileSpeed: 340,
  },
  laser: {
    name: '激光炮', desc: '持续能量束，可打地面与空中', cost: 135,
    damage: 10, range: 146, fireRate: 4.5, color: '#79e2d6',
    targets: ['ground', 'air'], splash: 0, projectileSpeed: 760,
  },
  flak: {
    name: '防空爆破炮', desc: '空中范围爆炸，克制机群', cost: 140,
    damage: 44, range: 168, fireRate: 1.4, color: '#f0a95c',
    targets: ['air'], splash: 52, projectileSpeed: 460,
  },
  railgun: {
    name: '电磁轨道炮', desc: '超远射程，无视护甲', cost: 190,
    damage: 130, range: 235, fireRate: 0.6, color: '#c9d6f0',
    targets: ['ground', 'water'], splash: 0, projectileSpeed: 1200, pierceArmor: true,
  },
  tesla: {
    name: '电弧塔', desc: '闪电连锁，最多命中 3 个地面目标', cost: 165,
    damage: 36, range: 136, fireRate: 1.7, color: '#b48cf0',
    targets: ['ground'], splash: 0, projectileSpeed: 800, chain: 3,
  },
  mine: {
    name: '水雷布设器', desc: '建于水边陆地，定时向水路布雷；舰船触碰引爆，1级3颗起，满级5颗', cost: 95,
    damage: 42, range: 130, fireRate: 0.4, color: '#e4695d',
    targets: ['water'], splash: 52, projectileSpeed: 0, minelayer: true,
  },
};

export const UPGRADE_FACTOR = {
  damage: 1.4,
  range: 1.1,
  fireRate: 1.08,
  cost: 0.85,
};

export const SELL_REFUND = 0.6;
export const MAX_LEVEL = 3;

export function difficultyScale(levelId: number) {
  return 1 + (levelId - 1) * 0.038;
}

export function tileToPixel(tx: number, ty: number): { x: number; y: number } {
  return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
}

export function pixelToTile(x: number, y: number): [number, number] {
  return [Math.floor(x / TILE), Math.floor(y / TILE)];
}
