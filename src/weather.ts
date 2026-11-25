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
//   8. 浓雾 = 厚重雾距 + 多层大型雾团：缓慢漂移、明暗呼吸、雾距起伏，
//      呈现真实浓雾的流动感；零额外模型，仍是每层一个 draw call
// ─────────────────────────────────────────────────────────────────────────────

// 粒子活动范围（世界坐标，略大于战场，保证任意镜头角度都有粒子）
const FIELD = { x: 17, z: 13, h: 17 };

// 场景生命周期节奏（秒）：
//   进入关卡先无天气 → 随机延时触发 → 淡入 → 保持一个完整周期 → 淡出归零 → 再次随机延时
// 萤火虫之夜不进入随机池（白天出现不合理），仅夜间关卡或显式指定时启用
const CYCLE_ORDER: WeatherKind[] = ['snow', 'rain', 'thunderstorm', 'sandstorm', 'fog'];
const SCENE_DURATION = 26;      // 场景保持时长基准（完整周期）
const FADE_TIME = 3;            // 淡入/淡出时长
const FIRST_DELAY_MIN = 8;      // 进入关卡后首次触发延时 8~24 秒
const FIRST_DELAY_RANGE = 16;
const IDLE_DELAY_MIN = 10;      // 两次场景之间的空闲间隔 10~32 秒
const IDLE_DELAY_RANGE = 22;

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
  fog:          { fogColor: '#59635d', fogNear: 7,  fogFar: 34, hemiMul: 0.85, sunMul: 0.7 },
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

interface FogBankLayer {
  points: THREE.Points;
  mat: THREE.PointsMaterial;
  pos: Float32Array;
  seed: Float32Array;
  baseY: Float32Array;
  speed: number;       // 漂移速度倍率
  baseOpacity: number;
  phase: number;       // 呼吸/漂移相位
  count: number;
}

interface FogBankSystem {
  layers: FogBankLayer[];
}

export class WeatherSystem {
  private readonly group = new THREE.Group();
  private readonly spriteTex = softSprite();

  private snow: SnowSystem;
  private rain: RainSystem;
  private sand: SandSystem;
  private fireflies: FireflySystem;
  private fogBanks: FogBankSystem;

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
        restOpacity: 0.22, gustOpacity: 0.42, restSpeed: 1.4, gustSpeed: 6.5,
        colorCalm: '#d4b276', colorStorm: '#a87c48', flicker: false,
      },
      {
        count: 480, size: 0.16, yMin: 0.15, ySpan: 2,
        restOpacity: 0.08, gustOpacity: 0.6, restSpeed: 2, gustSpeed: 9.5,
        colorCalm: '#c9a761', colorStorm: '#8f6a3d', flicker: true,
      },
      {
        count: 200, size: 0.3, yMin: 0.1, ySpan: 1.3,
        restOpacity: 0, gustOpacity: 0.5, restSpeed: 3.2, gustSpeed: 11,
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
    // 三层雾团：由近及远、由小到大，层间速度与呼吸节奏错开形成纵深流动感
    const layerDefs = [
      { count: 10, size: 5.5, speed: 0.35, baseOpacity: 0.2, yMin: 0.5, yMax: 1.6 },
      { count: 7, size: 9, speed: 0.55, baseOpacity: 0.16, yMin: 0.8, yMax: 2.4 },
      { count: 5, size: 13, speed: 0.78, baseOpacity: 0.13, yMin: 1.2, yMax: 3.2 },
    ];
    const layers = layerDefs.map((def, li) => {
      const pos = new Float32Array(def.count * 3);
      const seed = new Float32Array(def.count);
      const baseY = new Float32Array(def.count);
      for (let i = 0; i < def.count; i++) {
        pos[i * 3] = (Math.random() * 2 - 1) * (FIELD.x + 2);
        pos[i * 3 + 1] = def.yMin + Math.random() * (def.yMax - def.yMin);
        pos[i * 3 + 2] = (Math.random() * 2 - 1) * (FIELD.z + 2);
        seed[i] = Math.random() * Math.PI * 2;
        baseY[i] = pos[i * 3 + 1];
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: def.size,
        map: this.spriteTex,
        color: '#88948e',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      points.visible = false;
      this.group.add(points);
      return { points, mat, pos, seed, baseY, speed: def.speed, baseOpacity: def.baseOpacity, phase: li * 2.1 + Math.random(), count: def.count };
    });
    return { layers };
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
    this.stepFireflies(this.weightOf('fireflies'), dt);
    this.stepFogBanks(this.weightOf('fog'), dt);
    this.applyAtmosphere();
  }

  dispose() {
    this.scene.remove(this.group);
    [...this.fogBanks.layers.map((l) => l.points), this.snow.points, this.rain.lines, ...this.sand.layers.map((l) => l.points), this.fireflies.points].forEach((obj) => {
      obj.geometry.dispose();
      (obj.material as THREE.Material).dispose();
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

  // 场景内部随机事件（阵风/闪电）等淡入完成后再逐步出现，避免刚起势就打到最高强度
  private resetEpisodeState(kind: WeatherKind) {
    if (kind === 'sandstorm') this.nextGustIn = FADE_TIME + 1 + Math.random() * 3;
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
    for (const layer of this.fogBanks.layers) {
      layer.points.visible = w > 0;
      // 明暗呼吸：各层相位错开，雾团像在缓慢翻涌而非静止贴图
      layer.mat.opacity = layer.baseOpacity * w * (0.72 + 0.28 * Math.sin(this.time * 0.22 + layer.phase * 3));
      if (w <= 0) return;
      const pos = layer.pos;
      // 主漂移：缓慢风向 + 层速，叠加微弱的蛇形摆动，流动更自然
      const driftX = layer.speed * (0.6 + 0.4 * Math.sin(this.time * 0.11 + layer.phase));
      for (let i = 0; i < layer.count; i++) {
        const o = i * 3;
        pos[o] = wrap(pos[o] + (driftX + Math.sin(this.time * 0.05 + layer.seed[i]) * 0.12) * dt, FIELD.x + 4);
        // 缓慢起伏：雾团在贴地与半空之间游移
        pos[o + 1] = layer.baseY[i] + Math.sin(this.time * 0.15 + layer.seed[i]) * 0.5;
        pos[o + 2] = wrap(pos[o + 2] + Math.cos(this.time * 0.06 + layer.seed[i] * 2) * 0.14 * dt, FIELD.z + 3);
      }
      (layer.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
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
