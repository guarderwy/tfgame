export type EnemyType = 'infantry' | 'truck' | 'tank' | 'plane' | 'ship' | 'mech' | 'drone' | 'hovercraft' | 'strider' | 'bomber' | 'helicopter' | 'destroyer' | 'submarine';
export type TowerType = 'machinegun' | 'howitzer' | 'aa' | 'coastal' | 'laser' | 'flak' | 'railgun' | 'tesla' | 'mine';
export type PathKind = 'ground' | 'water' | 'air';

export interface Point {
  x: number;
  y: number;
}

export interface EnemyConfig {
  name: string;
  hp: number;
  speed: number;
  armor: number;
  bounty: number;
  damage: number;
  color: string;
  kind: PathKind;
  size: number;
}

export interface TowerConfig {
  name: string;
  desc: string;
  cost: number;
  damage: number;
  range: number;
  fireRate: number;
  color: string;
  targets: PathKind[];
  splash: number;
  projectileSpeed: number;
  pierceArmor?: boolean;
  chain?: number;
  minelayer?: boolean;
}

export interface SpawnGroup {
  type: EnemyType;
  count: number;
  interval: number;
  delay: number;
  lane: number;
  hpScale: number;
  boss?: boolean;
}

export interface Wave {
  groups: SpawnGroup[];
}

export type DecoKind = 'trees' | 'rocks' | 'forest' | 'reeds' | 'crates' | 'rails' | 'ruins' | 'desert' | 'snow' | 'city' | 'space';

export interface LevelTheme {
  ground: string;
  path: string;
  water: string;
  sky: string;
  fog: string;
  deco: DecoKind;
  ambient: number;
  sun: number;
  night?: boolean;
}

export interface LevelDef {
  id: number;
  name: string;
  desc: string;
  theme: LevelTheme;
  ground: number[][][];
  water: number[][][];
  waves: Wave[];
  gold: number;
  lives: number;
}
