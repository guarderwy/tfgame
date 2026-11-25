import * as THREE from 'three';
import type { DecoKind, LevelTheme, WeatherKind } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// 动态环境系统：雪地飘雪 / 雨林细雨 / 沙漠风沙 / 雷电暴雨 / 萤火虫之夜 / 浓雾
// 设计要点：
//   1. 粒子系统常驻显存，按需切换可见性，场景切换零重建、零 GC 压力
//   2. 天气是随机事件而非常驻：进入关卡先保持原貌，随机延时后触发，
//      淡入 → 保持一个完整周期 → 淡出归零 → 再次随机延时，循环往复
//   3. 各阶段均为权重渐变（雾色/雾距/光照/粒子透明度同步插值），过渡自然流畅
//   4. 每帧仅 1~2 个 draw call（Points / LineSegments），无阴影参与，性能平稳
//   5. 沙漠风沙 = 三档颗粒分层（细尘帷幕 / 粗砂贴地 / 前景飞沙）+ 随机阵风包络：
//      无风期维持基础沙霾，阵风期浓度、颗粒色、雾色、场景受光同步向铁锈色加深，
//      形成从"扬灰"到"遮天蔽日"的浓度与色调双重演进
//   6. 雷暴复用雨系统加重雨势，闪电为多脉冲包络，同步驱动雾色/光照/曝光与雷声
//   7. 萤火虫用顶点色逐粒明灭 + AdditiveBlending，配合 bloom 呈现夜光效果
//   8. 浓雾 = 10 个独立云团簇（只覆盖局部地图）+ 轻度全局雾霾：簇随风漂移进出
//      场地，逐簇呼吸明暗，形成动态、有层次的局部雾区
//   9. 沙暴增强：阵风沙浪成片横扫呈现风的流动；偶发龙卷风（线框漏斗+底部尘幕）
//      横穿场地，作为突发天气事件增强冲击力
// ─────────────────────────────────────────────────────────────────────────────

// 粒子活动范围（世界坐标，略大于战场，保证任意镜头角度都有粒子）
const FIELD = { x: 17, z: 13, h: 17 };

// 场景生命周期节奏（秒）：
//   进入关卡先无天气 → 随机延时触发 → 淡入 → 保持一个完整周期 → 淡出归零 → 再次随机延时
// 萤火虫之夜不进入随机池（白天出现不合理），仅夜间关卡或显式指定时启用
const CYCLE_ORDER: WeatherKind[] = ['snow', 'rain', 'thunderstorm', 'sandstorm', 'fog'];
const SCENE_DURATION = 60;      // 场景保持时长基准（完整周期），天气有足够持续性
const FADE_TIME = 3;            // 淡入/淡出时长
const FIRST_DELAY_MIN = 6;      // 进入关卡后首次触发延时 6~16 秒
const FIRST_DELAY_RANGE = 10;
const IDLE_DELAY_MIN = 6;       // 两次场景之间的空闲间隔 6~18 秒（天气基本连绵不断）
const IDLE_DELAY_RANGE = 12;

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
};

// 闪电雾色（雷暴时雾被照亮）
const FLASH_FOG = '#c9d6e6';

// 风沙雾色演进：平静期干热土黄 → 阵风峰值浓重铁锈色（光线被沙尘吞噬）
const SAND_FOG_STORM = '#6e4a2a';
// 场景固有色浸染目标：风沙期环境光/阳光整体被暖沙色污染
const SAND_TINT_HEMI = '#c39a6b';
const SAND_TINT_SUN = '#e8b070';

// 关卡装饰类型 → 天气场景映射；未命中则进入自动轮换
function weatherFromDeco(deco: DecoKind): WeatherKind | null {
  if (deco === 'snow') return 'snow';
  if (deco === 'forest' || deco === 'reeds') return 'rain';
  if (deco === 'desert') return 'sandstorm';
  return null;
}

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

/** 层带状云纹：水平堆叠的参差圆盘条带，模拟龙卷风的分层旋转盘面 */
function bandedCloudTexture(w: number, h: number, bands: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  const bandH = h / bands;
  for (let b = 0; b < bands; b++) {
    // 相邻层带明暗交替 + 层间留缝隙，营造堆叠圆盘的观感
    const base = b % 2 === 0 ? 0.8 : 0.42;
    const gap = Math.abs(Math.sin(b * 2.3)) < 0.22 ? 0.25 : 1;
    for (let row = 0; row < bandH; row++) {
      const yy = Math.floor(b * bandH + row);
      const edge = Math.sin((yy / h) * Math.PI * 12 + b * 2) * w * 0.1;
      const alpha = base * gap * (0.8 + 0.2 * Math.sin(yy * 0.5 + b));
      if (alpha <= 0.02) continue;
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fillRect(edge, yy, w * 0.9, 1);
    }
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

export class WeatherSystem {
  private readonly group = new THREE.Group();
  private readonly spriteTex = softSprite();

  private snow: SnowSystem;
  private rain: RainSystem;
  private sand: SandSystem;
  private fireflies: FireflySystem;
  private fogBanks: FogBankSystem;
  private sandFx: SandStormFxSystem;

  // 场景生命周期：idle（无天气）→ in（淡入）→ hold（完整周期）→ out（淡出）→ idle
  private phase: 'idle' | 'in' | 'hold' | 'out' = 'idle';
  private phaseTimer = 0;                          // 当前阶段剩余时间
  private episode: WeatherKind | null = null;      // 进行中的场景
  private lastEpisode: WeatherKind | null = null;  // 上一个场景，随机时避免连续重复
  private holdDuration = SCENE_DURATION;           // 本次保持时长（完整周期，略带随机）
  private pinned: WeatherKind | null = null;       // 主题锁定的场景（null = 随机挑选）

  // 风沙阵风：不定时触发，带平滑进出包络
  private gust = 0;
  private gustDuration = 0;
  private gustElapsed = 0;
  private nextGustIn = 4;

  // 雷暴闪电：脉冲序列 + 随机间隔，仅在雷暴场景激活期间触发
  private flashPulses: { start: number; dur: number; peak: number }[] = [];
  private nextFlashIn = 6;

  private time = 0;
  private lastNow = performance.now();

  // 关卡主题写入的基准氛围
  private baseFogColor = new THREE.Color('#1a2418');
  private baseFogNear = 28;
  private baseFogFar = 68;
  private baseHemi = 1;
  private baseSun = 1;
  private baseHemiColor = new THREE.Color('#cfe0b8');
  private baseSunColor = new THREE.Color('#ffe9c4');
  private baseExposure: number;
  private tmpColor = new THREE.Color();
  private tmpColor2 = new THREE.Color();

  // 龙卷风漏斗的基准顶点（用于逐帧螺旋变形）
  private tornadoBasePos: Float32Array | null = null;

  constructor(
    private scene: THREE.Scene,
    private hemi: THREE.HemisphereLight,
    private sun: THREE.DirectionalLight,
    private renderer: THREE.WebGLRenderer,
    private onThunder?: () => void,
  ) {
    this.baseExposure = renderer.toneMappingExposure;
    this.snow = this.buildSnow();
    this.rain = this.buildRain();
    this.sand = this.buildSand();
    this.fireflies = this.buildFireflies();
    this.fogBanks = this.buildFogBanks();
    this.sandFx = this.buildSandFx();
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
        restOpacity: 0.22, gustOpacity: 0.42, restSpeed: 0.9, gustSpeed: 4,
        colorCalm: '#d4b276', colorStorm: '#a87c48', flicker: false,
      },
      {
        count: 480, size: 0.16, yMin: 0.15, ySpan: 2,
        restOpacity: 0.08, gustOpacity: 0.6, restSpeed: 1.3, gustSpeed: 6,
        colorCalm: '#c9a761', colorStorm: '#8f6a3d', flicker: true,
      },
      {
        count: 200, size: 0.3, yMin: 0.1, ySpan: 1.3,
        restOpacity: 0, gustOpacity: 0.5, restSpeed: 2, gustSpeed: 7,
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

  // ── 对外接口 ──────────────────────────────────────────────────────────────

  /** 注入雷声回调（闪电触发时调用，与画面闪光同步） */
  setThunderCallback(cb: () => void) {
    this.onThunder = cb;
  }

  /** 关卡加载时调用：记录基准氛围；天气改为随机事件，进入关卡先保持原貌 */
  applyTheme(theme: LevelTheme) {
    const fog = this.scene.fog as THREE.Fog | null;
    if (fog) {
      this.baseFogColor.copy(fog.color);
      this.baseFogNear = fog.near;
      this.baseFogFar = fog.far;
    }
    this.baseHemi = theme.ambient;
    this.baseSun = theme.sun;
    this.baseHemiColor.copy(this.hemi.color);
    this.baseSunColor.copy(this.sun.color);

    // 优先级：显式 weather 字段 > 装饰类型映射 > 夜间关卡 → 萤火虫之夜
    // 场景内容按主题锁定，但触发时机仍是随机的（进入关卡先无天气）
    this.pinned = theme.weather ?? weatherFromDeco(theme.deco) ?? (theme.night ? 'fireflies' : null);

    // 进入关卡先完全还原主题原貌，随机延时后再触发第一次天气
    this.phase = 'idle';
    this.episode = null;
    this.lastEpisode = null;
    this.flashPulses = [];
    this.gust = 0;
    this.gustDuration = 0;
    this.phaseTimer = FIRST_DELAY_MIN + Math.random() * FIRST_DELAY_RANGE;
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

    this.updatePhase(dt);
    this.updateGust(dt);
    this.updateFlash(dt);

    this.stepSnow(this.weightOf('snow'), dt);
    // 细雨与雷暴共用同一套雨系统：雷暴权重叠加雨势与落速
    const rainW = this.weightOf('rain');
    const thunderW = this.weightOf('thunderstorm');
    this.stepRain(rainW + thunderW, thunderW, dt);
    this.stepSand(this.weightOf('sandstorm'), dt);
    this.stepSandFx(this.weightOf('sandstorm'), dt);
    this.stepFireflies(this.weightOf('fireflies'), dt);
    this.stepFogBanks(this.weightOf('fog'), dt);
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
    const kind = this.pinned ?? this.pickRandom();
    this.episode = kind;
    this.lastEpisode = kind;
    // 完整周期带小幅随机（约 22~36 秒），避免每次节奏完全一致
    this.holdDuration = SCENE_DURATION * (0.85 + Math.random() * 0.4);
    this.phase = 'in';
    this.phaseTimer = FADE_TIME;
    this.resetEpisodeState(kind);
  }

  private pickRandom(): WeatherKind {
    const pool = CYCLE_ORDER.filter((k) => k !== this.lastEpisode);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 场景内部随机事件（阵风/闪电/龙卷风）等淡入完成后再逐步出现，避免刚起势就打到最高强度
  private resetEpisodeState(kind: WeatherKind) {
    if (kind === 'sandstorm') {
      this.nextGustIn = FADE_TIME + 1 + Math.random() * 3;
      this.sandFx.nextIn = FADE_TIME + 2 + Math.random() * 3; // 淡入后很快迎来第一场龙卷风
    }
    if (kind === 'thunderstorm') this.nextFlashIn = FADE_TIME + 1 + Math.random() * 3;
  }

  private updateGust(dt: number) {
    if (this.gustDuration > 0) {
      this.gustElapsed += dt;
      const remain = this.gustDuration - this.gustElapsed;
      const attack = Math.min(1, this.gustElapsed / 1.4);   // 起风渐强
      const release = Math.min(1, Math.max(0, remain) / 1.8); // 收尾渐弱
      this.gust = attack * release;
      if (remain <= 0) {
        this.gustDuration = 0;
        this.gust = 0;
      }
    } else {
      this.nextGustIn -= dt;
      this.gust = Math.max(0, this.gust - dt * 0.5);
      if (this.nextGustIn <= 0) {
        this.gustDuration = 4 + Math.random() * 4.5; // 阵风时长 4~8.5 秒
        this.gustElapsed = 0;
        this.nextGustIn = 7 + Math.random() * 13;    // 间隔 7~20 秒
      }
    }
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

  private stepRain(w: number, thunder: number, dt: number) {
    const r = this.rain;
    r.lines.visible = w > 0;
    r.mat.opacity = (0.32 + thunder * 0.2) * w; // 雷暴雨势更重
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
      layer.mat.color.set(layer.colorCalm).lerp(this.tmpColor.set(layer.colorStorm), this.gust * 0.85);
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

  private stepSandFx(w: number, dt: number) {
    const fx = this.sandFx;
    // 阵风云团：软雾点云随阵风缓缓横扫，让风的流动肉眼可见
    for (const layer of fx.clouds) {
      layer.points.visible = w > 0 && this.gust > 0.08;
      layer.mat.opacity = (0.08 + this.gust * 0.34) * w;
      if (!layer.points.visible) continue;
      const speed = (1.5 + this.gust * 4) * layer.speedMul;
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
      wall.mat.opacity = (0.28 + this.gust * 0.4) * w;
      if (w <= 0) continue;
      wall.frontX -= (2.2 + this.gust * 4.5) * wall.speedMul * dt;
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
      fx.x -= (2 + this.gust * 1.4) * dt;
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
      const gustScale = kind === 'sandstorm' ? 0.35 + 0.65 * this.gust : 1;
      const ws = w * gustScale;
      if (kind === 'sandstorm') {
        this.tmpColor.set(p.fogColor).lerp(this.tmpColor2.set(SAND_FOG_STORM), this.gust * 0.85);
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
    this.hemi.intensity = this.baseHemi * hemiMul;
    this.sun.intensity = this.baseSun * sunMul;

    // 沙色浸染：风沙期场景环境光/阳光被暖沙色污染，炮台地面整体向暖褐偏移，
    // 阵风峰值最强、沙退后随权重归零还原主题固有色
    const pollute = kind === 'sandstorm' ? w * this.gust : 0;
    this.hemi.color.copy(this.baseHemiColor).lerp(this.tmpColor.set(SAND_TINT_HEMI), pollute * 0.55);
    this.sun.color.copy(this.baseSunColor).lerp(this.tmpColor.set(SAND_TINT_SUN), pollute * 0.5);

    // 闪电：雾色与光照瞬间被照亮，曝光同步抬升，脉冲结束快速回落
    const flash = this.flashIntensity();
    if (flash > 0) {
      fog.color.lerp(this.tmpColor.set(FLASH_FOG), flash * 0.85);
      this.hemi.intensity += this.baseHemi * flash * 2.4;
      this.sun.intensity += this.baseSun * flash * 1.2;
    }
    this.renderer.toneMappingExposure = this.baseExposure * (1 + flash * 0.9);
  }
}
