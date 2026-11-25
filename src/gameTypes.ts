import type { EnemyType, PathKind, Point, SpawnGroup, TowerType } from './types';

export interface PathData {
  tiles: number[][];
  points: Point[];
  length: number;
}

export interface Tower {
  id: number;
  type: TowerType;
  level: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  damage: number;
  range: number;
  fireRate: number;
  cooldown: number;
  totalCost: number;
  angle: number;
  initialized?: boolean;
  refillAll?: boolean;
  recoil?: number;
}

export interface Enemy {
  id: number;
  type: EnemyType;
  kind: PathKind;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  armor: number;
  speed: number;
  bounty: number;
  damage: number;
  size: number;
  footprint: number;
  color: string;
  boss: boolean;
  ability?: 'dash' | 'regen';
  dashTimer?: number;
  dashActive?: number;
  path: PathData;
  index: number;
  traveled: number;
  angle: number;
  dead: boolean;
  lastFloat?: number;
}

export interface Projectile {
  x: number;
  y: number;
  target: Enemy | null;
  lastX: number;
  lastY: number;
  vx: number;
  vy: number;
  distance: number;
  maxDistance: number;
  speed: number;
  damage: number;
  splash: number;
  pierceArmor: boolean;
  chain: number;
  color: string;
  alive: boolean;
  type: TowerType;
  originX: number;
  originY: number;
}

export interface NavalMine {
  id: number;
  ownerId: number;
  x: number;
  y: number;
  damage: number;
  splash: number;
  color: string;
}

export type EffectKind = 'ring' | 'beam' | 'arc' | 'flash';

export interface Effect {
  x: number;
  y: number;
  z: number;
  r: number;
  maxR: number;
  life: number;
  maxLife: number;
  color: string;
  kind: EffectKind;
  color2?: string;
  points?: Point[];
  width?: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  smoke?: boolean;
}

export interface SpawnTask {
  time: number;
  group: SpawnGroup;
}
