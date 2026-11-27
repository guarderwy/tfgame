import * as THREE from 'three';
import type { LevelTheme, WeatherKind } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// 动态环境系统：飘雪 / 细雨 / 风沙 / 雷暴 / 萤火虫 / 浓雾 / 冰雹 / 极光 / 火山灰 / 酸雨 / 陨石雨
// 设计要点：
//   1. 粒子系统常驻显存，按需切换可见性，场景切换零重建、零 GC 压力
//   2. 天气是随机事件而非常驻：进入关卡先保持原貌，随机延时后触发，
//      淡入 → 保持一个完整周期 → 淡出归零 → 再次随机延时，循环往复
//   3. 各阶段均为权重渐变（雾色/雾距/光照/粒子透明度同步插值），过渡自然流畅
//   4. 每帧仅数个 draw call（Points / LineSegments / 少量 Mesh），无阴影参与，性能平稳
//   5. 沙漠风沙 = 三档颗粒分层 + 随机阵风包络；雷暴复用雨系统加重雨势，闪电多脉冲
//   6. 萤火虫用顶点色逐粒明灭 + AdditiveBlending；浓雾用 10 个局部云团簇漂移呼吸
//   7. 新天气：冰雹为快速下落带弹跳的冰粒；极光为 360° 环形光幕；火山灰为灰烬+火种；
//      酸雨复用雨线染绿并叠加地面嘶溅；陨石雨为斜掠光迹+落地冲击波
//   8. 雨天地面涟漪与湿润反光、天气环境音、天气菜单、动态昼夜循环均由本系统驱动
// ─────────────────────────────────────────────────────────────────────────────

// 粒子活动范围（世界坐标，略大于战场，保证任意镜头角度都有粒子）
const FIELD = { x: 17, z: 13, h: 17 };

// 场景生命周期节奏（秒）：
//   进入关卡先无天气 → 随机延时触发 → 淡入 → 保持一个完整周期 → 淡出归零 → 再次随机延时
// 所有天气统一进入随机池，不再按关卡主题锁定；萤火虫/极光属于夜景天气，只在夜晚随机出现
const ALL_WEATHER: WeatherKind[] = [
  'snow', 'rain', 'thunderstorm', 'sandstorm', 'fog',
  'hail', 'ash', 'acidrain', 'meteor', 'fireflies', 'aurora',
];
const NIGHT_WEATHER = new Set<WeatherKind>(['fireflies', 'aurora']);
const SCENE_DURATION = 60;      // 场景保持时长基准（完整周期），天气有足够持续性
const FADE_TIME = 3;            // 淡入/淡出时长
const FIRST_DELAY_MIN = 6;      // 进入关卡后首次触发延时 6~16 秒
const FIRST_DELAY_RANGE = 10;
const IDLE_DELAY_MIN = 6;       // 两次场景之间的空闲间隔 6~18 秒（天气基本连绵不断）
const IDLE_DELAY_RANGE = 12;
const DAY_CYCLE_SECONDS = 150;  // 动态昼夜一轮时长（白昼→黄昏→夜晚→黎明）
const NIGHT_SKY = new THREE.Color('#0b1220');
const NIGHT_FOG = new THREE.Color('#101a26');

interface AtmospherePreset {
  fogColor: string;
  fogNear: number;
  fogFar: number;
  hemiMul: number;
  sunMul: number;
}

// 各场景氛围预设：雪地清冷明亮、雨林昏暗潮湿、风沙暖黄浑浊
const ATMOS: Record<WeatherKind, AtmospherePreset> = {
  snow:         { fogColor: '#a7b8c9', fogNear: 24, fogFar: 58, hemiMul: 1.12, sunMul: 0.82 },
  rain:         { fogColor: '#2e3c44', fogNear: 19, fogFar: 50, hemiMul: 0.8,  sunMul: 0.6 },
  thunderstorm: { fogColor: '#232c34', fogNear: 16, fogFar: 44, hemiMul: 0.7,  sunMul: 0.45 },
  sandstorm:    { fogColor: '#a8804a', fogNear: 12, fogFar: 46, hemiMul: 1.15, sunMul: 0.9 },
  fireflies:    { fogColor: '#0d141c', fogNear: 22, fogFar: 55, hemiMul: 0.85, sunMul: 0.65 },
  // 浓雾：全局雾只做轻度雾霾打底，真正的浓雾由局部云团簇承担（覆盖不均匀）
  fog:          { fogColor: '#59635d', fogNear: 13, fogFar: 46, hemiMul: 0.9,  sunMul: 0.8 },
  // 新增天气：冰雹冷白、极光深蓝夜色、火山灰暗红、酸雨毒绿、陨石雨幽蓝
  hail:         { fogColor: '#8394a1', fogNear: 17, fogFar: 48, hemiMul: 0.94, sunMul: 0.78 },
  aurora:       { fogColor: '#10242e', fogNear: 25, fogFar: 60, hemiMul: 0.72, sunMul: 0.32 },
  ash:          { fogColor: '#3b302b', fogNear: 12, fogFar: 38, hemiMul: 0.68, sunMul: 0.42 },
  acidrain:     { fogColor: '#354a35', fogNear: 16, fogFar: 43, hemiMul: 0.78, sunMul: 0.52 },
  meteor:       { fogColor: '#1b2338', fogNear: 22, fogFar: 56, hemiMul: 0.8,  sunMul: 0.48 },
};

// 闪电雾色（雷暴时雾被照亮）
const FLASH_FOG = '#c9d6e6';

// 风沙雾色演进：平静期干热土黄 → 阵风峰值浓重铁锈色（光线被沙尘吞噬）
const SAND_FOG_STORM = '#6e4a2a';
// 场景固有色浸染目标：风沙期环境光/阳光整体被暖沙色污染
const SAND_TINT_HEMI = '#c39a6b';
const SAND_TINT_SUN = '#e8b070';

/** 不规则云团纹理：多个随机位置/大小的柔和团块叠加，避免规则平滑的片状感 */
function cloudTexture(w: number, h: number, blobs: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  for (let i = 0; i < blobs; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.min(w, h) * (0.12 + Math.random() * 0.22);
    const g = ctx.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${0.16 + Math.random() * 0.16})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 层带状云纹：明暗交替但整幅铺满，避免漏斗表面出现透明缺口 */
function bandedCloudTexture(w: number, h: number, bands: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const bandH = h / bands;
  for (let yy = 0; yy < h; yy++) {
    const b = Math.min(bands - 1, Math.floor(yy / bandH));
    const rowInBand = (yy - b * bandH) / bandH;
    // 层带中央亮、交界略暗，只用连续变化做层次，不再留全透明缝隙
    const layer = 0.62 + 0.22 * Math.sin(rowInBand * Math.PI * 2) + 0.1 * Math.sin(b * 2.3);
    const alpha = Math.max(0.5, Math.min(0.95, layer + 0.06 * Math.sin(yy * 0.35 + b)));
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fillRect(0, yy, w, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function softSprite(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 极光帘幕纹理：参考实拍照片——细密竖直光柱 + 帘幕间暗隙 + 绿底红顶。
 * 用逐像素 alpha 保持星空可从帘幕间透出，避免整块均匀发光带。
 */
function auroraTexture(seed: number): THREE.CanvasTexture {
  const w = 512, h = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const v = 1 - y / (h - 1); // 0 底 / 1 顶
    const edge = Math.min(1, Math.max(0, (v - 0.04) / 0.2)) * Math.min(1, Math.max(0, (1.06 - v) / 0.42));
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const fold = Math.sin(u * 7 + seed) * 0.42 + Math.sin(u * 13 - seed * 2) * 0.2;
      const ray = Math.pow(0.5 + 0.5 * Math.sin((u + fold * 0.03) * 92 + Math.sin(v * 4 + seed) * 2), 4);
      const fine = Math.pow(0.5 + 0.5 * Math.sin((u + fold * 0.02) * 168 + seed * 3), 8);
      const curtain = 0.5 + 0.5 * Math.sin(u * 6 + seed + Math.sin(v * 3) * 0.7);
      const gap = Math.pow(curtain, 1.6);
      const intensity = (ray * 0.72 + fine * 0.28) * gap * edge;
      const red = Math.pow(v, 2.1) * 0.95;
      const green = 1 - v * 0.35;
      const idx = (y * w + x) * 4;
      img.data[idx] = Math.min(255, (0.12 * green + red) * intensity * 255);
      img.data[idx + 1] = Math.min(255, (0.9 * green + 0.18 * red) * intensity * 255);
      img.data[idx + 2] = Math.min(255, (0.42 * green + 0.65 * red) * intensity * 255);
      img.data[idx + 3] = Math.min(255, intensity * 235);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/** 火焰尾迹贴图：右端为靠近陨石的亮头，左端渐隐；软边 + 内部跳动纹路 */
function flameTrailTexture(): THREE.CanvasTexture {
  const w = 256, h = 64;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const v = (y / (h - 1)) * 2 - 1;
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1); // 0 尾 / 1 头
      const width = (0.15 + 0.5 * Math.pow(u, 0.55)) * (1 + 0.16 * Math.sin(u * 19));
      const edge = Math.max(0, 1 - Math.abs(v) / width);
      const alpha = Math.pow(edge, 1.4) * Math.pow(u, 1.25) * (0.7 + 0.3 * Math.sin(u * 34 + v * 9));
      const idx = (y * w + x) * 4;
      img.data[idx] = 255;
      img.data[idx + 1] = 90 + 150 * u;
      img.data[idx + 2] = 20 + 150 * Math.pow(u, 3);
      img.data[idx + 3] = Math.max(0, Math.min(255, alpha * 255));
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const wrap = (v: number, half: number) => {
  if (v > half) return v - half * 2;
  if (v < -half) return v + half * 2;
  return v;
};

interface SnowSystem {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  seed: Float32Array;
  speed: Float32Array;
  count: number;
}

interface RainSystem {
  lines: THREE.LineSegments;
  mat: THREE.LineBasicMaterial;
  pos: Float32Array;   // 每滴 6 项：头 xyz + 尾 xyz
  vel: Float32Array;   // 每滴 3 项速度
  tail: Float32Array;  // 拖尾长度系数
  count: number;
}

interface SandLayer {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  phase: Float32Array;
  freq: Float32Array;
  height: Float32Array;
  speedMul: Float32Array;
  baseBright: Float32Array; // 每粒基础亮度差异
  colors: Float32Array;     // 顶点色（亮度差异 + 阵风闪烁）
  yMin: number;
  restOpacity: number;      // 无风期基础浓度（沙霾帷幕）
  gustOpacity: number;      // 阵风附加浓度
  restSpeed: number;        // 无风期风速基数
  gustSpeed: number;        // 阵风附加风速
  sizeBase: number;
  colorCalm: string;        // 平静期颗粒色（干热浅土黄）
  colorStorm: string;       // 峰值颗粒色（浓重铁锈色）
  flicker: boolean;         // 是否逐帧更新闪烁（粗砂/飞沙）
  count: number;
}

interface SandSystem {
  layers: SandLayer[];
}

interface FireflySystem {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  colors: Float32Array; // 顶点色逐粒明灭
  phase: Float32Array;
  freq: Float32Array;
  count: number;
}

interface FogBlob {
  cluster: number;  // 所属雾团簇
  offX: number;     // 相对簇心的偏移
  offZ: number;
  baseY: number;
  seed: number;
  bright: number;   // 顶点色基础亮度
}

interface FogBankLayer {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  colors: Float32Array;
  blobs: FogBlob[];
  baseOpacity: number;
}

interface FogCluster {
  cx: number;
  cz: number;
  vx: number;      // 随风漂移速度
  vz: number;
  radius: number;
  phase: number;   // 呼吸相位（簇间错开）
}

interface FogBankSystem {
  layers: FogBankLayer[];
  clusters: FogCluster[];
}

interface SandCloudLayer {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  seed: Float32Array;
  baseY: Float32Array;
  speedMul: number;
  count: number;
}

// 沙暴墙：高大连续的沙尘帷幕，如 haboob 一般整体向前滚动
interface SandWall {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  trail: Float32Array;   // 相对墙前沿的后拖距离（前沿密、尾部疏）
  seed: Float32Array;
  height: Float32Array;  // 各点高度（低处密、高处稀，顶部翻卷）
  zBase: Float32Array;
  frontX: number;        // 墙前沿位置
  speedMul: number;
  count: number;
}

interface SandStormFxSystem {
  // 阵风云团：与浓雾同构的软雾点云（三层尺寸），沙色，随阵风缓缓横扫
  clouds: SandCloudLayer[];
  // 沙暴墙：两道错开的巨型沙尘墙，构成主视觉
  walls: SandWall[];
  // 龙卷风：偶发天气事件，顶点级螺旋变形的半透明漏斗 + 底部尘幕
  tornado: THREE.Group;
  funnel: THREE.Mesh;
  funnelMat: THREE.MeshBasicMaterial;
  patch: THREE.Mesh;
  patchMat: THREE.MeshBasicMaterial;
  mound: THREE.Mesh;
  moundMat: THREE.MeshBasicMaterial;
  active: boolean;
  nextIn: number;
  x: number;
  z: number;
}

interface HailSystem {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  vel: Float32Array;
  seed: Float32Array;
  count: number;
}

interface AshLayer {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  colors: Float32Array;
  seed: Float32Array;
  speed: Float32Array;
  rise: boolean;
  count: number;
}

interface AshSystem {
  layers: AshLayer[];
}

interface AuroraLayer {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  tex: THREE.CanvasTexture;
  distance: number;
  lift: number;
  baseOpacity: number;
  scroll: number;
}

interface AuroraSystem {
  layers: AuroraLayer[];
}

interface AcidFxSystem {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  life: Float32Array;
  maxLife: Float32Array;
  count: number;
}

interface MeteorImpact {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
  maxLife: number;
}

interface BurstParticles {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  vel: Float32Array;
  colors: Float32Array;
  base: Float32Array;
  life: Float32Array;
  maxLife: Float32Array;
  gravity: number;
  count: number;
}

interface MeteorSystem {
  rocks: THREE.InstancedMesh;
  rockMat: THREE.MeshLambertMaterial;
  heads: THREE.Points;
  headMat: THREE.PointsMaterial;
  headPos: Float32Array;
  headColors: Float32Array;
  flames: THREE.Sprite[];
  flameMats: THREE.SpriteMaterial[];
  flameTex: THREE.CanvasTexture;
  pos: Float32Array;   // 每颗陨石头部位置 xyz
  vel: Float32Array;
  seed: Float32Array;
  life: Float32Array;
  maxLife: Float32Array;
  tailLen: Float32Array;
  count: number;
  nextIn: number;
  impacts: MeteorImpact[];
  bursts: BurstParticles;
  smoke: BurstParticles;
  dummy: THREE.Object3D;
}

interface RippleRing {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
  maxLife: number;
}

interface RippleSystem {
  rings: RippleRing[];
  nextIn: number;
}

export class WeatherSystem {
  private readonly group = new THREE.Group();
  private readonly spriteTex = softSprite();

  private snow: SnowSystem;
  private rain: RainSystem;
  private sand: SandSystem;
  private fireflies: FireflySystem;
  private fogBanks: FogBankSystem;
  private sandFx: SandStormFxSystem;
  private hail: HailSystem;
  private ash: AshSystem;
  private aurora: AuroraSystem;
  private acidFx: AcidFxSystem;
  private meteors: MeteorSystem;
  private ripples: RippleSystem;

  // 场景生命周期：idle（无天气）→ in（淡入）→ hold（完整周期）→ out（淡出）→ idle
  private phase: 'idle' | 'in' | 'hold' | 'out' = 'idle';
  private phaseTimer = 0;                          // 当前阶段剩余时间
  private episode: WeatherKind | null = null;      // 进行中的场景
  private lastEpisode: WeatherKind | null = null;  // 上一个场景，随机时避免连续重复
  private holdDuration = SCENE_DURATION;           // 本次保持时长（完整周期，略带随机）
  private theme: LevelTheme | null = null;         // 当前关卡主题，用于判断夜间
  private enabled = true;                          // 总开关：关闭后还原主题原貌
  private forced: WeatherKind | null = null;       // 手动指定天气（null = 按主题/随机）

  // 风沙风力：缓慢趋向随机目标，不再骤起骤停
  private gust = 0;
  private gustTarget = 0.25;
  private nextGustIn = 8;

  // 雷暴闪电：脉冲序列 + 随机间隔，仅在雷暴场景激活期间触发
  private flashPulses: { start: number; dur: number; peak: number }[] = [];
  private nextFlashIn = 6;

  // 动态昼夜：0 = 白昼，0.5 = 午夜，1 = 回到黎明；由菜单开关
  private dayCycle = false;
  private dayPhase = 0;

  private time = 0;
  private lastNow = performance.now();
  private lastHailTick = -1;
  private lastMeteorSound = -1;

  // 关卡主题写入的基准氛围
  private baseSkyColor = new THREE.Color('#1a2418');
  private baseFogColor = new THREE.Color('#1a2418');
  private baseFogNear = 28;
  private baseFogFar = 68;
  private baseHemi = 1;
  private baseSun = 1;
  private baseHemiColor = new THREE.Color('#cfe0b8');
  private baseSunColor = new THREE.Color('#ffe9c4');
  private baseExposure: number;
  private highContrast = false;
  private tmpColor = new THREE.Color();
  private tmpColor2 = new THREE.Color();
  private tmpDir = new THREE.Vector3();
  private tmpUp = new THREE.Vector3();
  private tmpRight = new THREE.Vector3();
  private tmpScreenUp = new THREE.Vector3();

  // 龙卷风漏斗的基准顶点（用于逐帧螺旋变形）
  private tornadoBasePos: Float32Array | null = null;

  constructor(
    private scene: THREE.Scene,
    private hemi: THREE.HemisphereLight,
    private sun: THREE.DirectionalLight,
    private renderer: THREE.WebGLRenderer,
    private camera: THREE.Camera,
    private onThunder?: () => void,
    private onHailImpact?: () => void,
    private onMeteorImpact?: () => void,
  ) {
    this.baseExposure = renderer.toneMappingExposure;
    this.snow = this.buildSnow();
    this.rain = this.buildRain();
    this.sand = this.buildSand();
    this.fireflies = this.buildFireflies();
    this.fogBanks = this.buildFogBanks();
    this.sandFx = this.buildSandFx();
    this.hail = this.buildHail();
    this.ash = this.buildAsh();
    this.aurora = this.buildAurora();
    this.acidFx = this.buildAcidFx();
    this.meteors = this.buildMeteors();
    this.ripples = this.buildRipples();
    scene.add(this.group);
  }

  // ── 构建 ─────────────────────────────────────────────────────────────────

  private buildSnow(): SnowSystem {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * FIELD.x;
      pos[i * 3 + 1] = Math.random() * FIELD.h;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * FIELD.z;
      seed[i] = Math.random() * Math.PI * 2;
      speed[i] = 0.75 + Math.random() * 0.9; // 缓慢飘落
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.13,
      map: this.spriteTex,
      color: '#e6f1fb',
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.visible = false;
    this.group.add(points);
    return { points, mat, pos, seed, speed, count };
  }

  private buildRain(): RainSystem {
    const count = 950;
    const pos = new Float32Array(count * 6);
    const vel = new Float32Array(count * 3);
    const tail = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const o = i * 3, p = i * 6;
      pos[p] = (Math.random() * 2 - 1) * FIELD.x;
      pos[p + 1] = Math.random() * FIELD.h;
      pos[p + 2] = (Math.random() * 2 - 1) * FIELD.z;
      vel[o] = 0.8 + Math.random() * 0.7;        // 轻微斜向漂移
      vel[o + 1] = -(13 + Math.random() * 4);    // 细密小雨，下落快
      vel[o + 2] = 0.4 + Math.random() * 0.3;
      tail[i] = 0.02 + Math.random() * 0.012;    // 短雨丝
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#a4bccf',
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(geo, mat);
    lines.frustumCulled = false;
    lines.visible = false;
    this.group.add(lines);
    return { lines, mat, pos, vel, tail, count };
  }

  private buildSand(): SandSystem {
    // 三档颗粒分层，构成贴地浓、向上稀的沙暴剖面：
    //   细尘——高空的半透明沙霾帷幕，无风期也在，撑起"身在沙暴里"的底色
    //   粗砂——贴地翻滚的主体沙流，阵风时浓度暴涨，是视觉冲击的主力
    //   飞沙——稀少的大颗粒快速掠过近景，抽打感来自"一闪而过"
    const layerDefs = [
      {
        count: 900, size: 0.08, yMin: 1.2, ySpan: 7,
        restOpacity: 0.26, gustOpacity: 0.12, restSpeed: 0.65, gustSpeed: 1.2,
        colorCalm: '#d4b276', colorStorm: '#a87c48', flicker: false,
      },
      {
        count: 480, size: 0.16, yMin: 0.15, ySpan: 2,
        restOpacity: 0.12, gustOpacity: 0.14, restSpeed: 0.9, gustSpeed: 1.8,
        colorCalm: '#c9a761', colorStorm: '#8f6a3d', flicker: true,
      },
      {
        count: 200, size: 0.3, yMin: 0.1, ySpan: 1.3,
        restOpacity: 0.04, gustOpacity: 0.1, restSpeed: 1.2, gustSpeed: 2.2,
        colorCalm: '#d8b878', colorStorm: '#9a7442', flicker: true,
      },
    ];
    const layers = layerDefs.map((def) => {
      const pos = new Float32Array(def.count * 3);
      const phase = new Float32Array(def.count);
      const freq = new Float32Array(def.count);
      const height = new Float32Array(def.count);
      const speedMul = new Float32Array(def.count);
      const baseBright = new Float32Array(def.count);
      const colors = new Float32Array(def.count * 3);
      for (let i = 0; i < def.count; i++) {
        pos[i * 3] = (Math.random() * 2 - 1) * FIELD.x;
        pos[i * 3 + 1] = def.yMin + Math.random() * def.ySpan;
        pos[i * 3 + 2] = (Math.random() * 2 - 1) * FIELD.z;
        phase[i] = Math.random() * Math.PI * 2;
        freq[i] = 1.2 + Math.random() * 2.4;
        height[i] = 0.2 + Math.random() * def.ySpan;   // 上下起伏幅度
        speedMul[i] = 0.8 + Math.random() * 0.5;
        baseBright[i] = 0.75 + Math.random() * 0.35;   // 静态明暗差异打破均匀感
        colors[i * 3] = baseBright[i];
        colors[i * 3 + 1] = baseBright[i];
        colors[i * 3 + 2] = baseBright[i];
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: def.size,
        map: this.spriteTex,
        color: def.colorCalm,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.group.add(points);
      return {
        points, mat, pos, phase, freq, height, speedMul, baseBright, colors,
        yMin: def.yMin,
        restOpacity: def.restOpacity, gustOpacity: def.gustOpacity,
        restSpeed: def.restSpeed, gustSpeed: def.gustSpeed,
        sizeBase: def.size, colorCalm: def.colorCalm, colorStorm: def.colorStorm,
        flicker: def.flicker, count: def.count,
      };
    });
    return { layers };
  }

  private buildFireflies(): FireflySystem {
    const count = 90;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const freq = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * FIELD.x;
      pos[i * 3 + 1] = 0.3 + Math.random() * 2.2;   // 低空游荡
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * FIELD.z;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.6 + Math.random() * 1.8;          // 各自节奏的明灭闪烁
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.2,
      map: this.spriteTex,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // 加色混合 + bloom = 夜光质感
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.visible = false;
    this.group.add(points);
    return { points, mat, pos, colors, phase, freq, count };
  }

  private buildFogBanks(): FogBankSystem {
    // 10 个独立雾团簇：各自只覆盖地图局部区域，随风缓慢漂移并在越界后
    // 从另一侧重新进入，形成动态进出场的局部雾区，而非全图均匀浓雾
    const clusters: FogCluster[] = [];
    for (let i = 0; i < 10; i++) {
      clusters.push({
        cx: (Math.random() * 2 - 1) * 22,
        cz: (Math.random() * 2 - 1) * 14,
        vx: 0.24 + Math.random() * 0.26,
        vz: (Math.random() * 2 - 1) * 0.16,
        radius: 2 + Math.random() * 1.6,
        phase: (i / 10) * Math.PI * 2 + Math.random() * 0.5,
      });
    }

    // 三层尺寸的雾团分散挂到各簇上，构成有纵深的云团
    const layerDefs = [
      { size: 5.5, baseOpacity: 0.22, perCluster: 3 },
      { size: 9, baseOpacity: 0.17, perCluster: 2 },
      { size: 13, baseOpacity: 0.13, perCluster: 1 },
    ];
    const layers = layerDefs.map((def) => {
      const blobs: FogBlob[] = [];
      clusters.forEach((cluster, ci) => {
        for (let b = 0; b < def.perCluster; b++) {
          const a = Math.random() * Math.PI * 2;
          const r = cluster.radius * Math.sqrt(Math.random()) * 0.8;
          blobs.push({
            cluster: ci,
            offX: Math.cos(a) * r,
            offZ: Math.sin(a) * r,
            baseY: 0.5 + Math.random() * 2,
            seed: Math.random() * Math.PI * 2,
            bright: 0.75 + Math.random() * 0.3,
          });
        }
      });
      const count = blobs.length;
      const pos = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: def.size,
        map: this.spriteTex,
        color: '#88948e',
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.group.add(points);
      return { points, mat, pos, colors, blobs, baseOpacity: def.baseOpacity };
    });
    return { layers, clusters };
  }

  private buildSandFx(): SandStormFxSystem {
    // 阵风云团：与浓雾雾团簇同构的软雾点云（三层尺寸），染成沙色，随阵风缓缓横扫
    const cloudLayerDefs = [
      { size: 5.5, baseOpacity: 0.24, count: 10, speedMul: 0.85 },
      { size: 9, baseOpacity: 0.18, count: 7, speedMul: 1.1 },
      { size: 13, baseOpacity: 0.14, count: 5, speedMul: 1.4 },
    ];
    const clouds: SandCloudLayer[] = cloudLayerDefs.map((def) => {
      const pos = new Float32Array(def.count * 3);
      const seed = new Float32Array(def.count);
      const baseY = new Float32Array(def.count);
      for (let i = 0; i < def.count; i++) {
        pos[i * 3] = (Math.random() * 2 - 1) * (FIELD.x + 6);
        pos[i * 3 + 1] = 0.8 + Math.random() * 1.8;
        pos[i * 3 + 2] = (Math.random() * 2 - 1) * (FIELD.z - 1);
        seed[i] = Math.random() * Math.PI * 2;
        baseY[i] = pos[i * 3 + 1];
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: def.size,
        map: this.spriteTex,
        color: '#c9a971',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.group.add(points);
      return { points, mat, pos, seed, baseY, speedMul: def.speedMul, count: def.count };
    });
    // 沙暴墙（haboob）：高大连续的沙尘帷幕——低处浓密、向上渐稀、顶部翻卷，
    // 整体如一堵墙般向前推进；两道墙错开形成纵深。每道墙分两层点云：
    //   填充层——构成墙体主体（前沿密、尾部渐疏的拖尾分布）
    //   翻卷顶层——集中堆在墙顶的大尺寸软雾点，模拟顶部翻滚的卷云边
    const wallLayerDefs = [
      { size: 4.5, count: 90, top: false },
      { size: 7.5, count: 45, top: true },
    ];
    const walls: SandWall[] = [];
    for (let wi = 0; wi < 2; wi++) {
      for (const def of wallLayerDefs) {
        const count = def.count;
        const pos = new Float32Array(count * 3);
        const trail = new Float32Array(count);
        const seed = new Float32Array(count);
        const height = new Float32Array(count);
        const zBase = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          trail[i] = Math.pow(Math.random(), 2) * 6;   // 前沿密、尾部疏的拖尾
          seed[i] = Math.random() * Math.PI * 2;
          // 填充层低处密、向上渐稀（haboob 剖面）；顶层集中在墙顶翻滚
          height[i] = def.top ? 3.8 + Math.random() * 3.6 : 0.35 + Math.pow(Math.random(), 1.6) * 6.4;
          zBase[i] = (Math.random() * 2 - 1) * (FIELD.z - 1);
          // 静态顶点色：前沿受光更亮、尾部渐暗；顶部略亮模拟被照亮的翻卷边缘
          const bright = 1.05 - (trail[i] / 6) * 0.55 + (height[i] / 8) * 0.15;
          colors[i * 3] = bright;
          colors[i * 3 + 1] = bright * 0.92;
          colors[i * 3 + 2] = bright * 0.72;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({
          size: def.size,
          map: this.spriteTex,
          color: '#c49a5e',
          vertexColors: true,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geo, mat);
        points.frustumCulled = false;
        points.visible = false;
        this.group.add(points);
        walls.push({
          points, mat, pos, trail, seed, height, zBase,
          frontX: FIELD.x + 8 + wi * 5,
          speedMul: wi === 0 ? 1.05 : 0.92,
          count,
        });
      }
    }
    // 龙卷风：喇叭形轮廓（顶部大幅外翻）+ 层带纹理（堆叠圆盘）+ 底部碎屑堆与尘幕
    // 用深棕色确保在沙色场景中轮廓清晰、辨识度高
    const funnelMat = new THREE.MeshBasicMaterial({
      map: bandedCloudTexture(128, 256, 9), color: '#c9a971', transparent: true, opacity: 0,
      depthWrite: false, side: THREE.DoubleSide,
    });
    // 喇叭形剖面：底部细窄躯干 → 上方急剧外翻成宽口
    const profile: THREE.Vector2[] = [
      [0.1, 0], [0.14, 0.4], [0.2, 0.9], [0.24, 1.3], [0.32, 1.7],
      [0.5, 2.1], [0.82, 2.5], [1.2, 2.9], [1.55, 3.2], [1.72, 3.5], [1.58, 3.72],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const funnelGeo = new THREE.LatheGeometry(profile, 18);
    const funnel = new THREE.Mesh(funnelGeo, funnelMat);
    funnel.position.y = 0.05;
    this.tornadoBasePos = Float32Array.from(funnelGeo.attributes.position.array as Float32Array);
    const patchMat = new THREE.MeshBasicMaterial({
      map: cloudTexture(128, 128, 18), color: '#b8935c', transparent: true, opacity: 0, depthWrite: false,
    });
    // 底部尘幕：圆形基底 + 周向半径谐波扰动 → 不规则云形，旋转时不再有方形边缘
    const patchGeo = new THREE.CircleGeometry(2.6, 28);
    const ppa = patchGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < ppa.count; i++) {
      const vx = ppa.getX(i);
      const vy = ppa.getY(i);
      const r = Math.hypot(vx, vy);
      if (r < 0.01) continue; // 跳过圆心
      const a = Math.atan2(vy, vx);
      const nr = r * (0.72 + 0.28 * (0.6 * Math.sin(a * 3 + 1.2) + 0.4 * Math.sin(a * 5 + 0.4)));
      ppa.setXY(i, Math.cos(a) * nr, Math.sin(a) * nr);
    }
    const patch = new THREE.Mesh(patchGeo, patchMat);
    patch.rotation.x = -Math.PI / 2;
    patch.position.y = 0.06;
    // 底部碎屑堆：压扁的深色半球
    const moundMat = new THREE.MeshBasicMaterial({ color: '#8f6a3d', transparent: true, opacity: 0, depthWrite: false });
    const mound = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), moundMat);
    mound.scale.set(1.35, 0.42, 1.35);
    mound.position.y = 0.04;
    const tornado = new THREE.Group();
    tornado.add(mound, funnel, patch);
    tornado.visible = false;
    this.group.add(tornado);
    return {
      clouds, walls, tornado, funnel, funnelMat, patch, patchMat, mound, moundMat,
      active: false, nextIn: 10, x: 0, z: 0,
    };
  }

  /** 冰雹：高速斜落的冰粒，落地随机回弹一次再重新升起 */
  private buildHail(): HailSystem {
    const count = 420;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const o = i * 3;
      pos[o] = (Math.random() * 2 - 1) * FIELD.x;
      pos[o + 1] = Math.random() * FIELD.h;
      pos[o + 2] = (Math.random() * 2 - 1) * FIELD.z;
      vel[o] = 1.1 + Math.random() * 0.8;
      vel[o + 1] = -(17 + Math.random() * 9);
      vel[o + 2] = 0.3 + Math.random() * 0.4;
      seed[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.12, map: this.spriteTex, color: '#e6f4ff', transparent: true,
      opacity: 0, depthWrite: false, sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.visible = false;
    this.group.add(points);
    return { points, mat, pos, vel, seed, count };
  }

  /** 火山灰：灰烬缓降 + 火种上升，两层点云叠加 */
  private buildAsh(): AshSystem {
    const defs = [
      { count: 620, size: 0.1, color: '#7a716a', rise: false, speed: 0.7, opacity: 0.42, additive: false },
      { count: 90, size: 0.15, color: '#ff8a3d', rise: true, speed: 1.4, opacity: 0.75, additive: true },
    ];
    const layers: AshLayer[] = defs.map((def) => {
      const pos = new Float32Array(def.count * 3);
      const colors = new Float32Array(def.count * 3);
      const seed = new Float32Array(def.count);
      const speed = new Float32Array(def.count);
      for (let i = 0; i < def.count; i++) {
        const o = i * 3;
        pos[o] = (Math.random() * 2 - 1) * FIELD.x;
        pos[o + 1] = Math.random() * FIELD.h;
        pos[o + 2] = (Math.random() * 2 - 1) * FIELD.z;
        seed[i] = Math.random() * Math.PI * 2;
        speed[i] = def.speed * (0.6 + Math.random() * 0.9);
        colors[o] = 1; colors[o + 1] = 1; colors[o + 2] = 1;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: def.size, map: this.spriteTex, color: def.color, vertexColors: true,
        transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true,
        blending: def.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.group.add(points);
      return { points, mat, pos, colors, seed, speed, rise: def.rise, count: def.count };
    });
    return { layers };
  }

  /** 极光：两层半透明帘幕，参考实拍图保留星空透出与帘幕间暗隙 */
  private buildAurora(): AuroraSystem {
    const defs = [
      { width: 60, height: 22, distance: 30, lift: 7, baseOpacity: 0.62, scroll: 0.006, seed: 1.7 },
      { width: 46, height: 16, distance: 27, lift: 5.2, baseOpacity: 0.38, scroll: -0.009, seed: 4.3 },
    ];
    const layers: AuroraLayer[] = defs.map((def) => {
      const tex = auroraTexture(def.seed);
      const geo = new THREE.PlaneGeometry(def.width, def.height, 1, 1);
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, opacity: 0, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending,
        fog: false, toneMapped: false, // 不被雾吃掉，也不被 ACES 压暗
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      mesh.visible = false;
      this.group.add(mesh);
      return {
        mesh, mat, tex, distance: def.distance, lift: def.lift,
        baseOpacity: def.baseOpacity, scroll: def.scroll,
      };
    });
    return { layers };
  }

  /** 酸雨地面嘶溅：近地短促跳动的绿色亮点，区别于普通雨线 */
  private buildAcidFx(): AcidFxSystem {
    const count = 170;
    const pos = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const maxLife = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * FIELD.x;
      pos[i * 3 + 1] = 0.06;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * FIELD.z;
      maxLife[i] = 0.14 + Math.random() * 0.3;
      life[i] = Math.random() * maxLife[i];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.09, map: this.spriteTex, color: '#b4ff8a', transparent: true,
      opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.visible = false;
    this.group.add(points);
    return { points, mat, pos, life, maxLife, count };
  }

  /** 陨石雨：斜掠光迹 + 落地冲击波环 */
  /** 通用爆发粒子池：陨石落地时的火焰碎屑与烟尘共用 */
  private buildBurstParticles(count: number, size: number, color: string, additive: boolean, gravity: number, opacity: number): BurstParticles {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const maxLife = new Float32Array(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size, map: this.spriteTex, color, vertexColors: true, transparent: true,
      opacity, depthWrite: false, sizeAttenuation: true,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.visible = false;
    this.group.add(points);
    return { points, mat, pos, vel, colors, base, life, maxLife, gravity, count };
  }

  /** 陨石雨：不规则岩体 + 逐粒火焰尾迹 + 落地爆炸/烟雾 */
  private buildMeteors(): MeteorSystem {
    const count = 28;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const life = new Float32Array(count);
    const maxLife = new Float32Array(count);
    const tailLen = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      maxLife[i] = 0.9 + Math.random() * 0.7;
      tailLen[i] = 2.6 + Math.random() * 2.4;
      seed[i] = Math.random() * Math.PI * 2;
    }

    // 不规则岩体：同一顶点位置用相同扰动（非索引几何不能逐顶点随机，否则会裂成碎片），
    // 再交给受光材质渲染出棱面明暗，而不是一坨纯色团
    const rockGeo = new THREE.IcosahedronGeometry(0.34, 0);
    const pa = rockGeo.attributes.position as THREE.BufferAttribute;
    const deformed = new Map<string, [number, number, number]>();
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
      const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
      let p = deformed.get(key);
      if (!p) {
        const f = 0.62 + Math.random() * 0.7;
        p = [x * f * (0.9 + Math.random() * 0.22), y * f * (0.72 + Math.random() * 0.34), z * f * (0.9 + Math.random() * 0.22)];
        deformed.set(key, p);
      }
      pa.setXYZ(i, p[0], p[1], p[2]);
    }
    pa.needsUpdate = true;
    rockGeo.computeVertexNormals();
    const rockMat = new THREE.MeshLambertMaterial({
      color: '#ffffff', emissive: '#5a2c10', emissiveIntensity: 0.45,
      flatShading: true, transparent: true, opacity: 0, toneMapped: false,
    });
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, count);
    rocks.frustumCulled = false;
    rocks.visible = false;
    const dummy = new THREE.Object3D();
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = 0; i < count; i++) {
      rocks.setMatrixAt(i, dummy.matrix);
      rocks.setColorAt(i, new THREE.Color('#8a5230'));
    }
    rocks.instanceMatrix.needsUpdate = true;
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;
    this.group.add(rocks);

    // 陨石头部强光
    const headPos = new Float32Array(count * 3);
    const headColors = new Float32Array(count * 3);
    const headGeo = new THREE.BufferGeometry();
    headGeo.setAttribute('position', new THREE.BufferAttribute(headPos, 3));
    headGeo.setAttribute('color', new THREE.BufferAttribute(headColors, 3));
    const headMat = new THREE.PointsMaterial({
      size: 0.52, map: this.spriteTex, vertexColors: true, transparent: true,
      opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
      sizeAttenuation: true, toneMapped: false,
    });
    const heads = new THREE.Points(headGeo, headMat);
    heads.frustumCulled = false;
    heads.visible = false;
    this.group.add(heads);

    // 火焰尾迹：连续火焰精灵，右端亮头贴着陨石，左端渐隐
    const flameTex = flameTrailTexture();
    const flames: THREE.Sprite[] = [];
    const flameMats: THREE.SpriteMaterial[] = [];
    for (let i = 0; i < count; i++) {
      const mat = new THREE.SpriteMaterial({
        map: flameTex, color: '#ffd08a', transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.center.set(1, 0.5); // 贴图右端（亮头）锚定在陨石上，火焰只能向后延伸
      sprite.visible = false;
      this.group.add(sprite);
      flames.push(sprite);
      flameMats.push(mat);
    }

    const bursts = this.buildBurstParticles(300, 0.34, '#ffffff', true, 7, 0.95);
    const smoke = this.buildBurstParticles(220, 0.62, '#8b8378', false, -0.25, 0.5);

    const impacts: MeteorImpact[] = [];
    for (let i = 0; i < 12; i++) {
      const ringGeo = new THREE.RingGeometry(0.12, 0.17, 18); // 尺寸/扩散与河流涟漪一致，颜色改为火焰橙
      const impactMat = new THREE.MeshBasicMaterial({
        color: '#ff9d4d', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
      });
      const mesh = new THREE.Mesh(ringGeo, impactMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.08;
      mesh.visible = false;
      this.group.add(mesh);
      impacts.push({ mesh, mat: impactMat, life: 0, maxLife: 0.7 });
    }
    return {
      rocks, rockMat, heads, headMat, headPos, headColors,
      flames, flameMats, flameTex,
      pos, vel, seed, life, maxLife, tailLen, count,
      nextIn: 0.6, impacts, bursts, smoke, dummy,
    };
  }

  /** 雨天地面涟漪：场上循环出现的一圈圈扩散水纹 */
  private buildRipples(): RippleSystem {
    const rings: RippleRing[] = [];
    const geo = new THREE.RingGeometry(0.12, 0.17, 18); // 与河流涟漪同尺寸
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: '#bfe3f2', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.05;
      mesh.visible = false;
      this.group.add(mesh);
      rings.push({ mesh, mat, life: 0, maxLife: 0.8 });
    }
    return { rings, nextIn: 0 };
  }

  // ── 对外接口 ──────────────────────────────────────────────────────────────

  /** 注入雷声/冰雹/陨石音效回调（由渲染层接 AudioKit） */
  setThunderCallback(cb: () => void) { this.onThunder = cb; }
  setHailCallback(cb: () => void) { this.onHailImpact = cb; }
  setMeteorCallback(cb: () => void) { this.onMeteorImpact = cb; }

  /** 天气模式：auto 按主题轮换，off 关闭，其余为手动指定 */
  setWeatherMode(mode: 'auto' | 'off' | WeatherKind) {
    if (mode === 'off') {
      this.enabled = false;
      this.forced = null;
      this.episode = null;
      this.phase = 'idle';
      this.phaseTimer = IDLE_DELAY_MIN;
      return;
    }
    this.enabled = true;
    this.forced = mode === 'auto' ? null : mode;
    if (this.forced) {
      this.switchTo(this.forced);
    } else {
      this.episode = null;
      this.phase = 'idle';
      this.phaseTimer = FIRST_DELAY_MIN;
    }
  }

  /** 动态昼夜开关 */
  setDayCycle(on: boolean) {
    this.dayCycle = on;
    if (!on) this.dayPhase = 0;
  }

  /** 当前天气状态：供 UI 徽标、环境音与地面湿润度读取 */
  getWeatherState() {
    const kind = this.episode;
    const weight = kind && this.enabled ? this.weightOf(kind) : 0;
    return {
      kind,
      weight,
      wind: this.gust,
      visibility: weight > 0 ? 1 - weight * 0.45 : 1,
      wetness: kind === 'rain' || kind === 'thunderstorm' || kind === 'acidrain' || kind === 'hail' ? weight : 0,
      night: this.dayCycle ? 0.5 - 0.5 * Math.cos(this.dayPhase * Math.PI * 2) : 0,
    };
  }

  /** 高对比：压低环境光、抬高主光与曝光，由每帧氛围更新统一施加 */
  setHighContrast(on: boolean) {
    this.highContrast = on;
  }

  /** 关卡加载时调用：记录基准氛围；天气改为随机事件，进入关卡先保持原貌 */
  applyTheme(theme: LevelTheme) {
    const fog = this.scene.fog as THREE.Fog | null;
    if (fog) {
      this.baseFogColor.copy(fog.color);
      this.baseFogNear = fog.near;
      this.baseFogFar = fog.far;
    }
    if (this.scene.background instanceof THREE.Color) this.baseSkyColor.copy(this.scene.background);
    this.baseHemi = theme.ambient;
    this.baseSun = theme.sun;
    this.baseHemiColor.copy(this.hemi.color);
    this.baseSunColor.copy(this.sun.color);

    // 天气不再按主题锁定：除菜单手动指定外，全部统一随机；夜间天气由 isNightTime 过滤
    this.theme = theme;

    // 进入关卡先完全还原主题原貌，随机延时后再触发第一次天气
    this.phase = 'idle';
    this.episode = null;
    this.lastEpisode = null;
    this.flashPulses = [];
    this.gust = 0;
    this.gustTarget = 0.25;
    this.nextGustIn = 8;
    this.ripples.nextIn = 0;
    this.meteors.nextIn = 0.6;
    if (this.enabled && this.forced) {
      this.switchTo(this.forced);
    } else {
      this.phaseTimer = FIRST_DELAY_MIN + Math.random() * FIRST_DELAY_RANGE;
    }
  }

  /** 手动触发一次场景（立即淡入，走完整生命周期，用于调试/演出） */
  switchTo(kind: WeatherKind) {
    this.episode = kind;
    this.lastEpisode = kind;
    this.holdDuration = SCENE_DURATION;
    this.phase = 'in';
    this.phaseTimer = FADE_TIME;
    this.resetEpisodeState(kind);
  }

  /** 每帧调用；内部自行计算 dt，暂停恢复时自动钳制，不会跳变 */
  update() {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastNow) / 1000);
    this.lastNow = now;
    this.time += dt;
    if (this.dayCycle) this.dayPhase = (this.dayPhase + dt / DAY_CYCLE_SECONDS) % 1;

    this.updatePhase(dt);
    this.updateGust(dt);
    this.updateFlash(dt);

    this.stepSnow(this.weightOf('snow'), dt);
    // 细雨/雷暴/酸雨共用雨线：雷暴加重落势，酸雨染绿
    const rainW = this.weightOf('rain');
    const thunderW = this.weightOf('thunderstorm');
    const acidW = this.weightOf('acidrain');
    this.stepRain(rainW + thunderW + acidW, thunderW, acidW, dt);
    this.stepSand(this.weightOf('sandstorm'), dt);
    this.stepSandFx(this.weightOf('sandstorm'), dt);
    this.stepFireflies(this.weightOf('fireflies'), dt);
    this.stepFogBanks(this.weightOf('fog'), dt);
    this.stepHail(this.weightOf('hail'), dt);
    this.stepAsh(this.weightOf('ash'), dt);
    this.stepAurora(this.weightOf('aurora'), dt);
    this.stepAcidFx(acidW, dt);
    this.stepMeteors(this.weightOf('meteor'), dt);
    this.stepRipples(dt);
    this.applyAtmosphere();
  }

  dispose() {
    this.scene.remove(this.group);
    [
      ...this.fogBanks.layers.map((l) => l.points),
      this.snow.points, this.rain.lines,
      ...this.sand.layers.map((l) => l.points),
      this.fireflies.points,
      ...this.sandFx.clouds.map((c) => c.points),
      ...this.sandFx.walls.map((wl) => wl.points),
      this.sandFx.tornado,
      this.hail.points,
      ...this.ash.layers.map((l) => l.points),
      ...this.aurora.layers.map((l) => l.mesh),
      this.acidFx.points,
      this.meteors.rocks,
      this.meteors.heads,
      ...this.meteors.flames,
      this.meteors.bursts.points,
      this.meteors.smoke.points,
      ...this.meteors.impacts.map((i) => i.mesh),
      ...this.ripples.rings.map((r) => r.mesh),
    ].forEach((obj) => {
      // 递归释放：沙浪/龙卷风为 Group，需遍历子节点
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) material.dispose();
      });
    });
    this.aurora.layers.forEach((l) => l.tex.dispose());
    this.meteors.flameTex.dispose();
    this.spriteTex.dispose();
  }

  // ── 内部逻辑 ──────────────────────────────────────────────────────────────

  // 场景权重随生命周期阶段平滑升降：淡入线性上升，保持满值，淡出线性归零
  private weightOf(kind: WeatherKind): number {
    if (this.episode !== kind) return 0;
    switch (this.phase) {
      case 'in': return 1 - Math.max(0, this.phaseTimer) / FADE_TIME;
      case 'hold': return 1;
      case 'out': return Math.max(0, this.phaseTimer) / FADE_TIME;
      default: return 0;
    }
  }

  private updatePhase(dt: number) {
    // 昼夜切到白天时，正在进行的夜景天气提前淡出，不在白天继续显示
    if (this.episode && NIGHT_WEATHER.has(this.episode) && !this.isNightTime() && this.phase !== 'out') {
      this.phase = 'out';
      this.phaseTimer = FADE_TIME;
    }
    this.phaseTimer -= dt;
    switch (this.phase) {
      case 'idle': // 无天气：倒计时随机触发
        if (this.phaseTimer <= 0) this.startEpisode();
        break;
      case 'in': // 淡入完成 → 进入保持期
        if (this.phaseTimer <= 0) {
          this.phase = 'hold';
          this.phaseTimer = this.holdDuration;
        }
        break;
      case 'hold': // 完整周期结束 → 淡出
        if (this.phaseTimer <= 0) {
          this.phase = 'out';
          this.phaseTimer = FADE_TIME;
        }
        break;
      case 'out': // 淡出归零 → 回到空闲，等待下一次随机触发
        if (this.phaseTimer <= 0) {
          this.phase = 'idle';
          this.episode = null;
          this.phaseTimer = IDLE_DELAY_MIN + Math.random() * IDLE_DELAY_RANGE;
        }
        break;
    }
  }

  private startEpisode() {
    if (!this.enabled) {
      this.phase = 'idle';
      this.phaseTimer = IDLE_DELAY_MIN;
      return;
    }
    const kind = this.forced ?? this.pickRandom();
    this.episode = kind;
    this.lastEpisode = kind;
    // 完整周期带小幅随机（约 22~36 秒），避免每次节奏完全一致
    this.holdDuration = SCENE_DURATION * (0.85 + Math.random() * 0.4);
    this.phase = 'in';
    this.phaseTimer = FADE_TIME;
    this.resetEpisodeState(kind);
  }

  /** 当前是否算夜晚：开昼夜循环时看相位，否则沿用关卡 night 标记 */
  private isNightTime(): boolean {
    if (this.dayCycle) {
      return 0.5 - 0.5 * Math.cos(this.dayPhase * Math.PI * 2) > 0.55;
    }
    return this.theme?.night ?? false;
  }

  private pickRandom(): WeatherKind {
    const night = this.isNightTime();
    const pool = ALL_WEATHER.filter((k) => k !== this.lastEpisode && (night || !NIGHT_WEATHER.has(k)));
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 场景内部随机事件（阵风/闪电/龙卷风）等淡入完成后再逐步出现，避免刚起势就打到最高强度
  private resetEpisodeState(kind: WeatherKind) {
    if (kind === 'sandstorm') {
      this.gustTarget = 0.22;
      this.nextGustIn = 5 + Math.random() * 4;
      this.sandFx.nextIn = 10 + Math.random() * 8; // 龙卷风更晚出现，避免开场就一片浑浊
    }
    if (kind === 'thunderstorm') this.nextFlashIn = FADE_TIME + 1 + Math.random() * 3;
  }

  /** 风力缓慢趋向目标值：约 3 秒时间常数，避免骤起骤停与突然一层厚沙 */
  private updateGust(dt: number) {
    if (this.episode !== 'sandstorm') {
      this.gust += (0 - this.gust) * Math.min(1, dt * 0.6);
      return;
    }
    this.nextGustIn -= dt;
    if (this.nextGustIn <= 0) {
      this.gustTarget = 0.18 + Math.random() * 0.42; // 0.18~0.6，强度克制
      this.nextGustIn = 7 + Math.random() * 9;
    }
    this.gust += (this.gustTarget - this.gust) * Math.min(1, dt * 0.3);
  }

  private stepSnow(w: number, dt: number) {
    const s = this.snow;
    s.points.visible = w > 0;
    s.mat.opacity = 0.85 * w;
    if (w <= 0) return;
    const pos = s.pos;
    const windX = Math.sin(this.time * 0.25) * 0.4;
    for (let i = 0; i < s.count; i++) {
      const o = i * 3;
      pos[o] = wrap(pos[o] + (windX + Math.sin(this.time * 1.1 + s.seed[i]) * 0.3) * dt, FIELD.x);
      pos[o + 1] -= s.speed[i] * dt;
      pos[o + 2] = wrap(pos[o + 2] + Math.cos(this.time * 0.9 + s.seed[i]) * 0.22 * dt, FIELD.z);
      if (pos[o + 1] < 0) pos[o + 1] += FIELD.h;
    }
    (s.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  private stepRain(w: number, thunder: number, acid: number, dt: number) {
    const r = this.rain;
    r.lines.visible = w > 0;
    // 酸雨复用雨线：按权重占比染成毒绿色；雷暴则在原色上加重雨势
    const acidRatio = w > 0 ? Math.min(1, acid / w) : 0;
    r.mat.color.set('#a4bccf').lerp(this.tmpColor.set('#a6ff86'), acidRatio);
    r.mat.opacity = (0.32 + thunder * 0.2 + acid * 0.16) * w;
    if (w <= 0) return;
    const fallDt = dt * (1 + thunder * 0.45);
    const pos = r.pos;
    for (let i = 0; i < r.count; i++) {
      const o = i * 3, p = i * 6;
      pos[p] += r.vel[o] * fallDt;
      pos[p + 1] += r.vel[o + 1] * fallDt;
      pos[p + 2] += r.vel[o + 2] * fallDt;
      if (pos[p + 1] < -0.3) {
        pos[p] = (Math.random() * 2 - 1) * FIELD.x;
        pos[p + 1] = FIELD.h + Math.random() * 3;
        pos[p + 2] = (Math.random() * 2 - 1) * FIELD.z;
      }
      const len = r.tail[i];
      pos[p + 3] = pos[p] - r.vel[o] * len;
      pos[p + 4] = pos[p + 1] - r.vel[o + 1] * len;
      pos[p + 5] = pos[p + 2] - r.vel[o + 2] * len;
    }
    (r.lines.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  private stepSand(w: number, dt: number) {
    for (const layer of this.sand.layers) {
      layer.points.visible = w > 0;
      // 浓度演进：无风期维持基础沙霾，阵风期暴涨；细尘层永远在场，粗砂/飞沙负责冲击
      layer.mat.opacity = (layer.restOpacity + this.gust * layer.gustOpacity) * w;
      if (w <= 0) continue;
      // 速度分层：贴地粗砂/飞沙快、高空细尘慢，形成剪切感
      const wind = layer.restSpeed + this.gust * layer.gustSpeed;
      const pos = layer.pos;
      for (let i = 0; i < layer.count; i++) {
        const o = i * 3;
        pos[o] = wrap(pos[o] - wind * layer.speedMul[i] * dt, FIELD.x);
        pos[o + 1] = layer.yMin + (Math.sin(this.time * layer.freq[i] + layer.phase[i]) * 0.5 + 0.5) * layer.height[i];
        pos[o + 2] = wrap(pos[o + 2] + (0.35 + Math.sin(this.time * 0.6 + layer.phase[i]) * 0.4) * dt, FIELD.z);
        // 闪烁：模拟沙粒翻滚时的受光/背光变化（细尘层静态明暗即可，节省更新）
        if (layer.flicker) {
          const glint = layer.baseBright[i] * (0.68 + 0.32 * Math.sin(this.time * layer.freq[i] * 3 + layer.phase[i] * 2));
          layer.colors[o] = glint;
          layer.colors[o + 1] = glint;
          layer.colors[o + 2] = glint;
        }
      }
      (layer.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      if (layer.flicker) {
        (layer.points.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      }
      // 颗粒色调随阵风由干热浅土黄加深为铁锈色，是沙暴强度的直观"仪表盘"
      layer.mat.color.set(layer.colorCalm).lerp(this.tmpColor.set(layer.colorStorm), this.gust * 0.5);
    }
  }

  private stepFireflies(w: number, dt: number) {
    const f = this.fireflies;
    f.points.visible = w > 0;
    f.mat.opacity = 0.95 * w;
    if (w <= 0) return;
    const pos = f.pos;
    const colors = f.colors;
    for (let i = 0; i < f.count; i++) {
      const o = i * 3;
      pos[o] = wrap(pos[o] + Math.sin(this.time * 0.7 + f.phase[i] * 1.7) * 0.45 * dt, FIELD.x);
      pos[o + 1] += Math.sin(this.time * 0.9 + f.phase[i]) * 0.25 * dt;
      pos[o + 2] = wrap(pos[o + 2] + Math.cos(this.time * 0.6 + f.phase[i]) * 0.4 * dt, FIELD.z);
      if (pos[o + 1] < 0.25) pos[o + 1] = 0.25;
      if (pos[o + 1] > 3.2) pos[o + 1] = 3.2;
      // 明灭闪烁：sin² 包络，各萤火虫相位独立；暗态保留微光
      const glow = Math.sin(this.time * f.freq[i] * 2 + f.phase[i]);
      const bright = 0.08 + 0.92 * glow * glow;
      colors[o] = 0.62 * bright;
      colors[o + 1] = 0.95 * bright;
      colors[o + 2] = 0.3 * bright;
    }
    (f.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (f.points.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  private stepFogBanks(w: number, dt: number) {
    const sys = this.fogBanks;
    // 簇心随风漂移：雾团簇作为一个整体进出地图，雾区覆盖范围随时间变化
    for (const cl of sys.clusters) {
      cl.cx += (cl.vx + Math.sin(this.time * 0.07 + cl.phase) * 0.1) * dt;
      cl.cz += (cl.vz + Math.cos(this.time * 0.05 + cl.phase) * 0.08) * dt;
      if (cl.cx > 24) { cl.cx = -24; cl.cz = (Math.random() * 2 - 1) * 10; }
      if (cl.cz > 16) cl.cz = -16;
      else if (cl.cz < -16) cl.cz = 16;
    }
    for (const layer of sys.layers) {
      layer.points.visible = w > 0;
      layer.mat.opacity = layer.baseOpacity * w;
      if (w <= 0) continue;
      const pos = layer.pos;
      const colors = layer.colors;
      layer.blobs.forEach((blob, i) => {
        const cl = sys.clusters[blob.cluster];
        const o = i * 3;
        // 簇心 + 静态偏移 + 个体微摆：云团保持聚拢又各自缓缓游动
        pos[o] = cl.cx + blob.offX + Math.sin(this.time * 0.14 + blob.seed) * 0.5;
        pos[o + 1] = blob.baseY + Math.sin(this.time * 0.15 + blob.seed) * 0.45;
        pos[o + 2] = cl.cz + blob.offZ + Math.cos(this.time * 0.1 + blob.seed * 2) * 0.4;
        // 逐簇呼吸：明暗在簇间交替，雾区有聚散层次
        const breathe = 0.55 + 0.45 * Math.sin(this.time * 0.3 + cl.phase);
        const bright = blob.bright * (0.4 + 0.6 * breathe);
        colors[o] = bright;
        colors[o + 1] = bright;
        colors[o + 2] = bright;
      });
      (layer.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (layer.points.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  /** 冰雹：斜向高速下落，触地后部分回弹，并节流触发冰雹敲击音 */
  private stepHail(w: number, dt: number) {
    const h = this.hail;
    h.points.visible = w > 0;
    h.mat.opacity = 0.9 * w;
    if (w <= 0) return;
    const pos = h.pos;
    let hit = false;
    for (let i = 0; i < h.count; i++) {
      const o = i * 3;
      h.vel[o + 1] -= 7 * dt;
      pos[o] = wrap(pos[o] + (h.vel[o] + Math.sin(this.time * 2 + h.seed[i]) * 0.4) * dt, FIELD.x);
      pos[o + 1] += h.vel[o + 1] * dt;
      pos[o + 2] = wrap(pos[o + 2] + h.vel[o + 2] * dt, FIELD.z);
      if (pos[o + 1] < 0.12) {
        hit = true;
        if (Math.random() < 0.35) {
          pos[o + 1] = 0.14;
          h.vel[o + 1] = 2.2 + Math.random() * 2.2;
        } else {
          pos[o] = (Math.random() * 2 - 1) * FIELD.x;
          pos[o + 1] = FIELD.h + Math.random() * 3;
          pos[o + 2] = (Math.random() * 2 - 1) * FIELD.z;
          h.vel[o + 1] = -(17 + Math.random() * 9);
        }
      }
    }
    (h.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    if (hit && this.time - this.lastHailTick > 0.1) {
      this.lastHailTick = this.time;
      this.onHailImpact?.();
    }
  }

  /** 火山灰：灰烬缓慢飘落、火种向上飘散并逐粒明灭 */
  private stepAsh(w: number, dt: number) {
    for (const layer of this.ash.layers) {
      layer.points.visible = w > 0;
      layer.mat.opacity = (layer.rise ? 0.85 : 0.5) * w;
      if (w <= 0) continue;
      const pos = layer.pos;
      const colors = layer.colors;
      for (let i = 0; i < layer.count; i++) {
        const o = i * 3;
        pos[o] = wrap(pos[o] + Math.sin(this.time * 0.4 + layer.seed[i]) * 0.4 * dt, FIELD.x);
        pos[o + 1] += (layer.rise ? layer.speed[i] : -layer.speed[i]) * dt;
        pos[o + 2] = wrap(pos[o + 2] + Math.cos(this.time * 0.32 + layer.seed[i]) * 0.3 * dt, FIELD.z);
        if (layer.rise && pos[o + 1] > FIELD.h) {
          pos[o + 1] = 0.2;
          pos[o] = (Math.random() * 2 - 1) * FIELD.x;
          pos[o + 2] = (Math.random() * 2 - 1) * FIELD.z;
        } else if (!layer.rise && pos[o + 1] < 0) {
          pos[o + 1] = FIELD.h;
          pos[o] = (Math.random() * 2 - 1) * FIELD.x;
          pos[o + 2] = (Math.random() * 2 - 1) * FIELD.z;
        }
        if (layer.rise) {
          const glow = 0.35 + 0.65 * Math.sin(this.time * 3 + layer.seed[i]) ** 2;
          colors[o] = glow; colors[o + 1] = glow * 0.75; colors[o + 2] = glow * 0.45;
        }
      }
      (layer.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      if (layer.rise) (layer.points.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  /** 极光：两层帘幕跟随相机缓慢漂移，纹理自身携带竖直光柱与暗隙 */
  private stepAurora(w: number, dt: number) {
    if (w <= 0) {
      for (const layer of this.aurora.layers) layer.mesh.visible = false;
      return;
    }
    const cam = this.camera;
    cam.getWorldDirection(this.tmpDir);
    this.tmpUp.set(0, 1, 0).applyQuaternion(cam.quaternion);
    for (let i = 0; i < this.aurora.layers.length; i++) {
      const layer = this.aurora.layers[i];
      layer.mesh.visible = true;
      layer.mat.opacity = layer.baseOpacity * w;
      layer.tex.offset.x = (this.time * layer.scroll + i * 0.37) % 1;
      const sway = Math.sin(this.time * 0.18 + i * 2.1) * 1.1;
      layer.mesh.position.copy(cam.position)
        .addScaledVector(this.tmpDir, layer.distance)
        .addScaledVector(this.tmpUp, layer.lift + sway);
      layer.mesh.quaternion.copy(cam.quaternion);
      layer.mesh.rotation.z = Math.sin(this.time * 0.12 + i) * 0.035;
    }
  }

  /** 酸雨嘶溅：近地亮点短促跳起后消失 */
  private stepAcidFx(w: number, dt: number) {
    const f = this.acidFx;
    f.points.visible = w > 0;
    f.mat.opacity = 0.72 * w;
    if (w <= 0) return;
    for (let i = 0; i < f.count; i++) {
      const o = i * 3;
      f.life[i] -= dt;
      if (f.life[i] <= 0) {
        f.life[i] = f.maxLife[i];
        f.pos[o] = (Math.random() * 2 - 1) * FIELD.x;
        f.pos[o + 2] = (Math.random() * 2 - 1) * FIELD.z;
      }
      f.pos[o + 1] = 0.05 + (1 - f.life[i] / f.maxLife[i]) * 0.55;
    }
    (f.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  /** 向爆发粒子池投放一组粒子（火焰碎屑 / 烟尘） */
  private spawnBurstParticles(
    sys: BurstParticles, x: number, y: number, z: number, count: number,
    speed: number, upward: number, lifeMin: number, lifeMax: number, rgb: [number, number, number],
  ) {
    for (let k = 0; k < count; k++) {
      const i = sys.life.findIndex((l) => l <= 0);
      if (i < 0) break;
      const o = i * 3;
      const a = Math.random() * Math.PI * 2;
      const r = speed * (0.35 + Math.random() * 0.65);
      sys.pos[o] = x + Math.cos(a) * 0.15;
      sys.pos[o + 1] = y + Math.random() * 0.2;
      sys.pos[o + 2] = z + Math.sin(a) * 0.15;
      sys.vel[o] = Math.cos(a) * r;
      sys.vel[o + 1] = upward * (0.4 + Math.random() * 0.8);
      sys.vel[o + 2] = Math.sin(a) * r;
      sys.life[i] = sys.maxLife[i] = lifeMin + Math.random() * (lifeMax - lifeMin);
      const bright = 0.75 + Math.random() * 0.35;
      sys.base[o] = rgb[0] * bright;
      sys.base[o + 1] = rgb[1] * bright;
      sys.base[o + 2] = rgb[2] * bright;
      sys.colors[o] = sys.base[o];
      sys.colors[o + 1] = sys.base[o + 1];
      sys.colors[o + 2] = sys.base[o + 2];
    }
    sys.points.visible = true;
  }

  /** 更新爆发粒子；天气结束后仍让已生成的爆炸/烟雾自然消散 */
  private stepBurstParticles(sys: BurstParticles, dt: number) {
    let alive = false;
    for (let i = 0; i < sys.count; i++) {
      if (sys.life[i] <= 0) continue;
      alive = true;
      sys.life[i] -= dt;
      const o = i * 3;
      if (sys.life[i] <= 0) {
        sys.colors[o] = sys.colors[o + 1] = sys.colors[o + 2] = 0;
        continue;
      }
      sys.pos[o] += sys.vel[o] * dt;
      sys.pos[o + 1] += sys.vel[o + 1] * dt;
      sys.pos[o + 2] += sys.vel[o + 2] * dt;
      sys.vel[o + 1] += sys.gravity * dt;
      const fade = sys.life[i] / sys.maxLife[i];
      sys.colors[o] = sys.base[o] * fade;
      sys.colors[o + 1] = sys.base[o + 1] * fade;
      sys.colors[o + 2] = sys.base[o + 2] * fade;
    }
    sys.points.visible = alive;
    if (alive) {
      (sys.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (sys.points.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  /** 陨石落地：冲击波环 + 不规则火焰碎屑 + 烟尘 */
  private spawnMeteorImpactAt(m: MeteorSystem, x: number, z: number) {
    const imp = m.impacts.find((it) => it.life <= 0);
    if (imp) {
      imp.life = imp.maxLife = 0.6 + Math.random() * 0.35;
      imp.mesh.position.set(x, 0.08, z);
      imp.mesh.scale.setScalar(1);
      imp.mesh.visible = true;
    }
    this.spawnBurstParticles(m.bursts, x, 0.2, z, 18, 5.5, 2.6, 0.35, 0.85, [1, 0.55, 0.16]);
    this.spawnBurstParticles(m.smoke, x, 0.25, z, 12, 2.4, 1.1, 0.9, 1.8, [0.5, 0.47, 0.44]);
    if (this.time - this.lastMeteorSound > 0.45) {
      this.lastMeteorSound = this.time;
      this.onMeteorImpact?.();
    }
  }

  /** 陨石雨：密集的不规则陨石拖火焰尾迹，落地爆炸并留下烟尘 */
  private stepMeteors(w: number, dt: number) {
    const m = this.meteors;
    this.stepBurstParticles(m.bursts, dt);
    this.stepBurstParticles(m.smoke, dt);
    for (const imp of m.impacts) {
      if (imp.life <= 0) continue;
      imp.life -= dt;
      if (imp.life <= 0) {
        imp.mesh.visible = false;
        imp.mat.opacity = 0;
        continue;
      }
      const p = 1 - imp.life / imp.maxLife;
      imp.mesh.scale.setScalar(1 + p * 0.6);
      imp.mat.opacity = 0.5 * (1 - p);
    }
    m.rocks.visible = w > 0;
    m.heads.visible = w > 0;
    if (w <= 0) {
      for (const sprite of m.flames) sprite.visible = false;
      return;
    }
    m.rockMat.opacity = w;
    m.headMat.opacity = w;
    const cam = this.camera;
    cam.updateMatrixWorld();
    this.tmpRight.setFromMatrixColumn(cam.matrixWorld, 0);
    this.tmpScreenUp.setFromMatrixColumn(cam.matrixWorld, 1);

    m.nextIn -= dt;
    if (m.nextIn <= 0) {
      const burst = 3 + Math.floor(Math.random() * 3); // 每次 3~5 颗，明显更密集
      for (let b = 0; b < burst; b++) {
        const i = m.life.findIndex((l) => l <= 0);
        if (i < 0) break;
        const o = i * 3;
        // 降低下落/横移速度，并按「高度 ÷ 下落速度」反推寿命，保证每颗都能飞到地面
        const startY = FIELD.h + 1 + Math.random() * 3;
        const vy = -(7 + Math.random() * 4);
        m.life[i] = m.maxLife[i] = startY / -vy + 0.15 + Math.random() * 0.3;
        m.pos[o] = (Math.random() * 2 - 1) * FIELD.x;
        m.pos[o + 1] = startY;
        m.pos[o + 2] = (Math.random() * 2 - 1) * FIELD.z;
        m.vel[o] = -(5 + Math.random() * 4);
        m.vel[o + 1] = vy;
        m.vel[o + 2] = (Math.random() * 2 - 1) * 2.2;
        m.seed[i] = Math.random() * Math.PI * 2;
        m.tailLen[i] = 2.6 + Math.random() * 2.4;
        m.rocks.setColorAt(i, new THREE.Color().setHSL(0.04 + Math.random() * 0.05, 0.5, 0.26 + Math.random() * 0.16));
      }
      if (m.rocks.instanceColor) m.rocks.instanceColor.needsUpdate = true;
      m.nextIn = 0.45 + Math.random() * 0.7;
    }

    let matricesChanged = false;
    let pointsChanged = false;
    const t = this.time;
    for (let i = 0; i < m.count; i++) {
      if (m.life[i] <= 0) continue;
      const o = i * 3;
      m.life[i] -= dt;
      m.pos[o] += m.vel[o] * dt;
      m.pos[o + 1] += m.vel[o + 1] * dt;
      m.pos[o + 2] += m.vel[o + 2] * dt;
      const x = m.pos[o], y = m.pos[o + 1], z = m.pos[o + 2];
      const vx = m.vel[o], vy = m.vel[o + 1], vz = m.vel[o + 2];
      const fade = Math.max(0, Math.min(1, m.life[i] / m.maxLife[i]));
      const d = m.dummy;
      d.position.set(x, y, z);
      d.rotation.set(t * 3 + m.seed[i], t * 2.2 + m.seed[i] * 1.7, t * 1.7 + m.seed[i] * 0.5);
      d.scale.setScalar((0.85 + 0.35 * Math.sin(m.seed[i] * 3)) * (0.72 + 0.28 * fade));
      d.updateMatrix();
      m.rocks.setMatrixAt(i, d.matrix);
      matricesChanged = true;
      m.headPos[o] = x; m.headPos[o + 1] = y; m.headPos[o + 2] = z;
      m.headColors[o] = fade; m.headColors[o + 1] = fade * 0.78; m.headColors[o + 2] = fade * 0.42;
      // 连续火焰精灵：贴着陨石尾部，按屏幕空间速度方向旋转
      const sprite = m.flames[i];
      const mat = m.flameMats[i];
      const sx = vx * this.tmpRight.x + vy * this.tmpRight.y + vz * this.tmpRight.z;
      const sy = vx * this.tmpScreenUp.x + vy * this.tmpScreenUp.y + vz * this.tmpScreenUp.z;
      const flameLen = m.tailLen[i] * 0.75 + 0.8;
      const flick = 0.86 + 0.14 * Math.sin(t * 13 + m.seed[i] * 3);
      sprite.visible = true;
      sprite.position.set(x, y, z);
      sprite.scale.set(flameLen, 0.9 * flick, 1);
      mat.rotation = Math.atan2(sy, sx);
      mat.opacity = 0.9 * w * fade * flick;
      if (y < 0.1 || m.life[i] <= 0) {
        // 无论先触地还是寿命耗尽，都算一次撞击，避免出现「凭空消失」的陨石
        this.spawnMeteorImpactAt(m, x, z);
        m.life[i] = 0;
        d.scale.setScalar(0);
        d.updateMatrix();
        m.rocks.setMatrixAt(i, d.matrix);
        matricesChanged = true;
        m.headColors[o] = m.headColors[o + 1] = m.headColors[o + 2] = 0;
        sprite.visible = false;
        mat.opacity = 0;
      }
    }
    if (matricesChanged) m.rocks.instanceMatrix.needsUpdate = true;
    if (pointsChanged) {
      (m.heads.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (m.heads.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  private wetWeight(): number {
    const kind = this.episode;
    if (!kind || (kind !== 'rain' && kind !== 'thunderstorm' && kind !== 'acidrain')) return 0;
    return this.weightOf(kind);
  }

  /** 雨天地面涟漪：积水水纹按随机间隔在战场各处扩散 */
  private stepRipples(dt: number) {
    const w = this.wetWeight();
    const ry = this.ripples;
    const color = this.episode === 'acidrain' ? '#b4ff8a' : this.episode === 'hail' ? '#e3f4ff' : '#bfe3f2';
    ry.nextIn -= dt;
    if (w > 0 && ry.nextIn <= 0) {
      const ring = ry.rings.find((r) => r.life <= 0);
      if (ring) {
        ring.maxLife = 0.55 + Math.random() * 0.4;
        ring.life = ring.maxLife;
        ring.mesh.position.set((Math.random() * 2 - 1) * FIELD.x, 0.05, (Math.random() * 2 - 1) * FIELD.z);
        ring.mesh.scale.setScalar(0.8);
        ring.mesh.visible = true;
        ring.mat.color.set(color);
      }
      ry.nextIn = 0.1 + Math.random() * 0.3;
    }
    for (const ring of ry.rings) {
      if (ring.life <= 0) continue;
      ring.life -= dt;
      if (ring.life <= 0) {
        ring.mesh.visible = false;
        ring.mat.opacity = 0;
        continue;
      }
      const p = 1 - ring.life / ring.maxLife;
      ring.mesh.scale.setScalar(0.8 + p * 0.9);
      ring.mat.opacity = 0.55 * w * (1 - p);
    }
  }

  private stepSandFx(w: number, dt: number) {
    const fx = this.sandFx;
    // 阵风云团：软雾点云随阵风缓缓横扫，让风的流动肉眼可见
    for (const layer of fx.clouds) {
      layer.points.visible = w > 0 && this.gust > 0.08;
      layer.mat.opacity = (0.06 + this.gust * 0.12) * w;
      if (!layer.points.visible) continue;
      const speed = (1 + this.gust * 1.6) * layer.speedMul;
      const pos = layer.pos;
      for (let i = 0; i < layer.count; i++) {
        const o = i * 3;
        pos[o] -= speed * dt;
        if (pos[o] < -(FIELD.x + 7)) pos[o] = FIELD.x + 7;
        pos[o + 1] = layer.baseY[i] + Math.sin(this.time * 0.35 + layer.seed[i]) * 0.3;
        pos[o + 2] = wrap(pos[o + 2] + Math.sin(this.time * 0.2 + layer.seed[i] * 2) * 0.2 * dt, FIELD.z);
      }
      (layer.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // 沙暴墙：haboob 沙尘帷幕整体向前推进——顶部翻卷起伏、前沿浓重、尾部拖出渐疏的尘尾
    for (const wall of fx.walls) {
      wall.points.visible = w > 0;
      wall.mat.opacity = (0.14 + this.gust * 0.16) * w;
      if (w <= 0) continue;
      wall.frontX -= (1.2 + this.gust * 1.8) * wall.speedMul * dt;
      if (wall.frontX < -(FIELD.x + 10)) wall.frontX = FIELD.x + 8;
      const pos = wall.pos;
      const t = this.time;
      for (let i = 0; i < wall.count; i++) {
        const o = i * 3;
        // 顶部翻卷：整体高度随时间缓慢起伏（像墙顶在滚动）
        pos[o] = wall.frontX - wall.trail[i] + Math.sin(t * 0.5 + wall.seed[i]) * 0.35;
        pos[o + 1] = wall.height[i] * (1 + Math.sin(t * 0.6 + wall.seed[i]) * 0.07);
        pos[o + 2] = wall.zBase[i] + Math.cos(t * 0.4 + wall.seed[i] * 2) * 0.4;
      }
      (wall.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // 龙卷风：沙暴期间偶发（偏爱与阵风同期），缓慢横穿场地后自然消散
    fx.tornado.visible = fx.active;
    if (w <= 0) {
      fx.active = false;
      return;
    }
    if (fx.active) {
      fx.x -= (1.4 + this.gust * 0.8) * dt;
      fx.z += Math.sin(this.time * 0.25) * 0.35 * dt;
      // 进出场地时平滑淡入淡出
      const traveled = FIELD.x + 7 - fx.x;
      const distToExit = fx.x + FIELD.x + 7;
      const alpha = Math.min(1, traveled / 3) * Math.min(1, Math.max(0, distToExit) / 4);
      fx.funnelMat.opacity = 0.72 * alpha * w;
      fx.patchMat.opacity = 0.52 * alpha * w;
      fx.moundMat.opacity = 0.92 * alpha * w;
      this.stepTornadoVertices();
      fx.funnel.rotation.z = Math.sin(this.time * 0.4) * 0.12;  // 缓慢摇摆倾斜
      fx.patch.rotation.z += 0.4 * dt;                          // 底部尘幕缓慢旋转（不规则云形）
      const s = 1.55 + Math.sin(this.time * 0.7) * 0.08;        // 整体放大 1.55 倍 + 缓慢脉动
      fx.tornado.scale.set(s, s + Math.sin(this.time * 0.55) * 0.06, s);
      fx.tornado.position.set(fx.x, 0, fx.z);
      if (fx.x < -(FIELD.x + 7)) {
        fx.active = false;
        fx.nextIn = 5 + Math.random() * 7; // 高频重现：消散后 5~12 秒再来一场
      }
    } else {
      fx.nextIn -= dt;
      if (fx.nextIn <= 0) {
        fx.active = true;
        fx.x = FIELD.x + 7;
        fx.z = (Math.random() * 2 - 1) * (FIELD.z - 3);
      }
    }
  }

  /** 龙卷风漏斗顶点：螺旋缠绕 + 躯干蛇形摆动（底部摆幅大、外翻顶口稳定） */
  private stepTornadoVertices() {
    const base = this.tornadoBasePos;
    if (!base) return;
    const geo = this.sandFx.funnel.geometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = this.time;
    const yMax = 3.72;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = base[i];
      const by = base[i + 1];
      const bz = base[i + 2];
      const hn = Math.min(1, by / yMax); // 归一化高度
      const r = Math.hypot(bx, bz);
      const ang = Math.atan2(bz, bx);
      // 螺旋缠绕：半径起伏幅度自下而上减弱，保住外翻宽口的轮廓
      const na = ang + t * 1.6 + by * 1.1;
      const nr = r * (1 + Math.sin(t * 1.3 + by * 2.4 + ang * 3) * (0.06 + 0.12 * (1 - hn)));
      // 躯干蛇形摆动：越靠下摆幅越大，模拟被风卷起的扭动形态
      const sway = 0.36 * Math.pow(1 - hn, 1.5);
      const offX = Math.sin(t * 0.7 + by * 1.9) * sway;
      const offZ = Math.cos(t * 0.6 + by * 1.6) * sway;
      arr[i] = Math.cos(na) * nr + offX;
      arr[i + 1] = by + Math.sin(t * 0.9 + by * 1.7) * 0.08 * (0.4 + hn);
      arr[i + 2] = Math.sin(na) * nr + offZ;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  private updateFlash(dt: number) {
    // 仅在雷暴权重足够高（淡入后期/保持期）时触发，淡出中不再新增闪电
    const active = this.weightOf('thunderstorm') > 0.5;
    if (!active) {
      this.nextFlashIn = Math.max(this.nextFlashIn, 2.5); // 重新进入雷暴时先等一小段
      return;
    }
    if (this.flashPulses.length > 0) return; // 当前闪电尚未结束
    this.nextFlashIn -= dt;
    if (this.nextFlashIn > 0) return;
    // 一次闪电 = 2~3 个快速脉冲（主闪 + 回闪），并同步触发雷声
    const count = 2 + (Math.random() < 0.4 ? 1 : 0);
    let at = 0;
    const pulses: { start: number; dur: number; peak: number }[] = [];
    for (let i = 0; i < count; i++) {
      pulses.push({
        start: this.time + at,
        dur: 0.14 + Math.random() * 0.12,
        peak: i === 0 ? 1 : 0.45 + Math.random() * 0.3,
      });
      at += 0.1 + Math.random() * 0.16;
    }
    this.flashPulses = pulses;
    this.nextFlashIn = 5 + Math.random() * 11;
    this.onThunder?.();
  }

  private flashIntensity(): number {
    let v = 0;
    for (const p of this.flashPulses) {
      const t = this.time - p.start;
      if (t < 0 || t > p.dur) continue;
      const attack = Math.min(1, t / 0.03);
      const release = Math.min(1, (p.dur - t) / 0.12);
      v = Math.max(v, p.peak * attack * release);
    }
    return v;
  }

  private applyAtmosphere() {
    const fog = this.scene.fog as THREE.Fog | null;
    if (!fog) return;

    // 每帧从关卡主题基准值出发；无天气时完全还原主题原貌，
    // 有天气时权重随生命周期（淡入/保持/淡出）平滑升降，过渡自然
    const kind = this.episode;
    const w = kind ? this.weightOf(kind) : 0;
    let near = this.baseFogNear;
    let far = this.baseFogFar;
    let hemiMul = 1;
    let sunMul = 1;

    if (kind && w > 0) {
      const p = ATMOS[kind];
      // 风沙：阵风权重影响更大，且雾色由土黄向铁锈色演进（色调即强度仪表盘）
      const gustScale = kind === 'sandstorm' ? 0.75 + 0.25 * this.gust : 1;
      const ws = w * gustScale;
      if (kind === 'sandstorm') {
        this.tmpColor.set(p.fogColor).lerp(this.tmpColor2.set(SAND_FOG_STORM), this.gust * 0.4);
      } else {
        this.tmpColor.set(p.fogColor);
      }
      fog.color.lerp(this.tmpColor, ws * 0.8);
      near += (p.fogNear - near) * ws;
      far += (p.fogFar - far) * ws;
      // 浓雾能见度缓慢起伏：雾气在聚散之间流动
      if (kind === 'fog') far += Math.sin(this.time * 0.16) * 2.5 * w;
      hemiMul += (p.hemiMul - 1) * w;
      sunMul += (p.sunMul - 1) * w;
    }

    fog.near = near;
    fog.far = far;
    // 动态昼夜：天空/雾色同步入夜，主光衰减更快、环境光保留少量填充，避免全黑
    const night = this.dayCycle ? 0.5 - 0.5 * Math.cos(this.dayPhase * Math.PI * 2) : 0;
    if (night > 0) {
      fog.color.lerp(NIGHT_FOG, night * 0.5);
      if (this.scene.background instanceof THREE.Color) this.scene.background.copy(this.baseSkyColor).lerp(NIGHT_SKY, night * 0.8);
    } else if (this.scene.background instanceof THREE.Color) {
      this.scene.background.copy(this.baseSkyColor);
    }
    // 高对比：压低环境填充光、抬高主光方向感，并在曝光上再拉开层次
    const hemiContrast = this.highContrast ? 0.72 : 1;
    const sunContrast = this.highContrast ? 1.4 : 1;
    this.hemi.intensity = this.baseHemi * hemiMul * hemiContrast * (1 - night * 0.35);
    this.sun.intensity = this.baseSun * sunMul * sunContrast * (1 - night * 0.62);

    // 沙色浸染：风沙期场景环境光/阳光被暖沙色污染，炮台地面整体向暖褐偏移，
    // 阵风峰值最强、沙退后随权重归零还原主题固有色；夜间再向冷蓝偏移
    const pollute = kind === 'sandstorm' ? w * this.gust * 0.5 : 0;
    this.hemi.color.copy(this.baseHemiColor).lerp(this.tmpColor.set(SAND_TINT_HEMI), pollute * 0.35)
      .lerp(this.tmpColor2.set('#6f8ec0'), night * 0.35);
    this.sun.color.copy(this.baseSunColor).lerp(this.tmpColor.set(SAND_TINT_SUN), pollute * 0.3)
      .lerp(this.tmpColor2.set('#8fa8d8'), night * 0.45);

    // 闪电：雾色与光照瞬间被照亮，曝光同步抬升，脉冲结束快速回落
    const flash = this.flashIntensity();
    if (flash > 0) {
      fog.color.lerp(this.tmpColor.set(FLASH_FOG), flash * 0.85);
      this.hemi.intensity += this.baseHemi * flash * 2.4 * hemiContrast;
      this.sun.intensity += this.baseSun * flash * 1.2 * sunContrast;
    }
    this.renderer.toneMappingExposure = this.baseExposure * (1 + flash * 0.9) * (1 - night * 0.15) * (this.highContrast ? 1.08 : 1);
  }
}
