import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BASE_TILE, COLS, ROWS, TILE, TOWER_CONFIG } from './config';
import { WeatherSystem } from './weather';
import type { DecoKind, EnemyType, LevelTheme, Point, TowerPattern, TowerType } from './types';
import type { Effect, Enemy, NavalMine, Particle, PathData, Projectile, Tower } from './gameTypes';

export interface RenderState {
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  effects: Effect[];
  particles: Particle[];
  selected: Tower | null;
  buildType: TowerType | null;
  hoverTile: [number, number] | null;
  pathTiles: Set<string>;
  mines: NavalMine[];
  gold: number;
}

const toX = (px: number) => px / TILE - COLS / 2;
const toZ = (py: number) => py / TILE - ROWS / 2;
const tileX = (tx: number) => tx + 0.5 - COLS / 2;
const tileZ = (ty: number) => ty + 0.5 - ROWS / 2;
const toWorldRange = (px: number) => px / TILE;
const UP = new THREE.Vector3(0, 1, 0);
const TMP_V3 = new THREE.Vector3(); // 模块级复用向量，热路径禁止 new
const alignYAxis = (obj: THREE.Object3D, dx: number, dz: number) => {
  const len = Math.hypot(dx, dz) || 0.001;
  obj.quaternion.setFromUnitVectors(UP, TMP_V3.set(dx / len, 0, dz / len));
  return len;
};

function smoothCorners(points: Point[], radius = TILE * 0.32): Point[] {
  if (points.length < 3) return points;
  const out: Point[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const next = points[i + 1];
    const inLen = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const outLen = Math.hypot(next.x - cur.x, next.y - cur.y);
    if (inLen < 1 || outLen < 1) { out.push(cur); continue; }
    const inX = (cur.x - prev.x) / inLen;
    const inY = (cur.y - prev.y) / inLen;
    const outX = (next.x - cur.x) / outLen;
    const outY = (next.y - cur.y) / outLen;
    if (Math.abs(inX * outY - inY * outX) < 0.05) { out.push(cur); continue; }
    const rIn = Math.min(radius, inLen * 0.45);
    const rOut = Math.min(radius, outLen * 0.45);
    out.push({ x: cur.x - inX * rIn, y: cur.y - inY * rIn });
    out.push({ x: cur.x + outX * rOut, y: cur.y + outY * rOut });
  }
  out.push(points[points.length - 1]);
  return out;
}

function ribbonGeometry(source: Point[], width: number, y: number): THREE.BufferGeometry {
  const points = smoothCorners(source);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    let dx = next.x - prev.x;
    let dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const px = -dy * width * 0.5;
    const py = dx * width * 0.5;
    const cx = toX(points[i].x);
    const cz = toZ(points[i].y);
    positions.push(cx + px, y, cz + py, cx - px, y, cz - py);
    uvs.push(0, i, 1, i);
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
    indices.push(a, b, c, b, d, c);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function seeded(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function normalTexture(repeat: [number, number], strength: number): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(size, size);
  const height = (x: number, y: number) =>
    seeded((x + size) % size * 3.7 + (y + size) % size * 9.1) * 0.62
    + seeded((x + size) % size * 1.3 + (y + size) % size * 5.7) * 0.38;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = -(height(x + 1, y) - height(x - 1, y)) * strength;
      const ny = -(height(x, y + 1) - height(x, y - 1)) * strength;
      const len = Math.hypot(nx, ny, 1) || 1;
      const i = (y * size + x) * 4;
      image.data[i] = (nx / len * 0.5 + 0.5) * 255;
      image.data[i + 1] = (ny / len * 0.5 + 0.5) * 255;
      image.data[i + 2] = (1 / len * 0.5 + 0.5) * 255;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(...repeat);
  tex.anisotropy = 4;
  return tex;
}

function terrainTexture(base: string, opts: {
  repeat: [number, number];
  blotches: string[];
  speckles: string[];
  streaks?: boolean;
}): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 90; i++) {
    const x = seeded(i * 1.7) * size;
    const y = seeded(i * 2.3 + 7) * size;
    const r = 12 + seeded(i * 3.1) * 46;
    ctx.globalAlpha = 0.05 + seeded(i * 4.7) * 0.1;
    ctx.fillStyle = opts.blotches[i % opts.blotches.length];
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (0.5 + seeded(i * 5.9) * 0.7), seeded(i) * 6.28, 0, 6.28);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 1300; i++) {
    const x = seeded(i * 6.1 + 3) * size;
    const y = seeded(i * 7.3 + 11) * size;
    ctx.globalAlpha = 0.1 + seeded(i * 8.9) * 0.24;
    ctx.fillStyle = opts.speckles[i % opts.speckles.length];
    const s = 0.6 + seeded(i * 9.7) * 2.4;
    ctx.fillRect(x, y, s, s);
  }
  if (opts.streaks) {
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = opts.speckles[0];
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      const y = seeded(i * 10.1) * size;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(size * 0.3, y + seeded(i) * 8 - 4, size * 0.7, y + seeded(i + 1) * 8 - 4, size, y);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(...opts.repeat);
  tex.anisotropy = 4;
  return tex;
}

function groundTexture(theme: LevelTheme): THREE.CanvasTexture {
  const d = theme.deco;
  const base = theme.ground;
  if (d === 'desert') return terrainTexture(base, { repeat: [8, 5], blotches: ['#c8a06a', '#7c623d', '#e0c08a'], speckles: ['#e8cf9a', '#6b5433'], streaks: true });
  if (d === 'snow') return terrainTexture(base, { repeat: [8, 5], blotches: ['#ffffff', '#9fb8c4', '#dceaf0'], speckles: ['#ffffff', '#8ba6b4'] });
  if (d === 'city' || d === 'rails' || d === 'space') return terrainTexture(base, { repeat: [10, 6], blotches: ['#6b6f76', '#3d4048', '#8f939c'], speckles: ['#a9adb6', '#2b2e33'] });
  if (d === 'reeds') return terrainTexture(base, { repeat: [8, 5], blotches: ['#5a7645', '#2d4a36', '#7a8f52'], speckles: ['#9db55f', '#27402d'], streaks: true });
  return terrainTexture(base, { repeat: [8, 5], blotches: ['#5c7747', '#25402c', '#778a4e'], speckles: ['#9cb25c', '#223a28'] });
}

function roadTexture(theme: LevelTheme): THREE.CanvasTexture {
  const d = theme.deco;
  if (d === 'city' || d === 'space' || d === 'rails') return terrainTexture(theme.path, { repeat: [1, 0.16], blotches: ['#9aa0a8', '#5a5d64'], speckles: ['#c8ccd2', '#43464c'] });
  if (d === 'snow') return terrainTexture(theme.path, { repeat: [1, 0.16], blotches: ['#c9cfc9', '#8e9a92'], speckles: ['#e6ece8', '#78847c'] });
  return terrainTexture(theme.path, { repeat: [1, 0.16], blotches: ['#9a8256', '#5a4a2e'], speckles: ['#c4ac72', '#4c3d24'], streaks: true });
}

function waterTexture(color: string): THREE.CanvasTexture {
  return terrainTexture(color, { repeat: [1, 0.2], blotches: ['#6fb4cf', '#0e4258'], speckles: ['#cfeaf4', '#12506a'], streaks: true });
}

function mat(color: number | string, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.12, ...extra });
}

function shadow(mesh: THREE.Mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cfgAccent(color: string) {
  const c = new THREE.Color(color);
  c.offsetHSL(0, 0.12, 0.14);
  return `#${c.getHexString()}`;
}

function glowMat(color: number | string, intensity = 0.9) {
  return new THREE.MeshStandardMaterial({
    color, emissive: new THREE.Color(color), emissiveIntensity: intensity,
    roughness: 0.35, metalness: 0.2,
  });
}

function metalMat(color: number | string, metalness = 0.6, roughness = 0.4) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

const patternTextures = new Map<string, THREE.CanvasTexture>();
function patternTexture(pattern: TowerPattern, body: string, secondary: string) {
  const cacheKey = `${pattern}|${body}|${secondary}`;
  const cached = patternTextures.get(cacheKey);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = secondary;
  ctx.fillStyle = secondary;
  ctx.lineWidth = 12;
  switch (pattern) {
    case 'stripe':
      for (let i = -128; i < 256; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 128, 128); ctx.stroke();
      }
      break;
    case 'chevron':
      for (let y = -32; y < 160; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(64, y + 22); ctx.lineTo(128, y); ctx.stroke();
      }
      break;
    case 'dot':
      for (let x = 16; x < 128; x += 32) {
        for (let y = 16; y < 128; y += 32) {
          ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
        }
      }
      break;
    case 'grid':
      ctx.lineWidth = 8;
      for (let i = 0; i <= 128; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 128); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(128, i); ctx.stroke();
      }
      break;
    case 'warning':
      ctx.lineWidth = 18;
      for (let i = -128; i < 256; i += 48) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 128, 128); ctx.stroke();
      }
      break;
    case 'circuit':
      ctx.lineWidth = 6;
      for (let y = 16; y < 128; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(40, y); ctx.lineTo(56, y + 16); ctx.lineTo(128, y + 16); ctx.stroke();
        ctx.beginPath(); ctx.arc(36, y, 5, 0, Math.PI * 2); ctx.fill();
      }
      break;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.4, 1.4);
  tex.colorSpace = THREE.SRGBColorSpace;
  patternTextures.set(cacheKey, tex);
  return tex;
}

function addEdges(mesh: THREE.Mesh, opacity = 0.45) {
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, 32),
    new THREE.LineBasicMaterial({ color: '#151812', transparent: true, opacity }),
  );
  mesh.add(edges);
  return mesh;
}

function hullGeometry(length: number, beam: number, depth: number, deckY: number): THREE.BufferGeometry {
  const sections = [
    { z: -length * 0.5, w: beam * 0.38 },
    { z: -length * 0.32, w: beam * 0.78 },
    { z: -length * 0.05, w: beam },
    { z: length * 0.22, w: beam * 0.95 },
    { z: length * 0.4, w: beam * 0.62 },
    { z: length * 0.5, w: beam * 0.1 },
  ];
  const positions: number[] = [];
  const indices: number[] = [];
  const ring = 7;
  sections.forEach((s) => {
    const h = s.w * 0.5;
    const profile: [number, number][] = [
      [-h, deckY], [-h * 0.86, deckY - depth * 0.52], [-h * 0.5, deckY - depth],
      [h * 0.5, deckY - depth], [h * 0.86, deckY - depth * 0.52], [h, deckY], [0, deckY],
    ];
    profile.forEach(([x, y]) => positions.push(x, y, s.z));
  });
  for (let j = 0; j < sections.length - 1; j++) {
    for (let i = 0; i < ring - 1; i++) {
      const a = j * ring + i;
      const b = a + 1;
      const c = (j + 1) * ring + i;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function deckShape(length: number, beam: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-beam * 0.5, -length * 0.42);
  s.lineTo(-beam * 0.42, -length * 0.5);
  s.lineTo(beam * 0.42, -length * 0.5);
  s.lineTo(beam * 0.5, -length * 0.42);
  s.lineTo(beam * 0.48, length * 0.3);
  s.lineTo(beam * 0.2, length * 0.5);
  s.lineTo(-beam * 0.2, length * 0.5);
  s.lineTo(-beam * 0.48, length * 0.3);
  s.closePath();
  return s;
}

function disposeObject(obj: THREE.Object3D) {
  const m = obj as THREE.Mesh;
  if (m.geometry) m.geometry.dispose();
  const material = (m as any).material;
  if (Array.isArray(material)) material.forEach((x) => x.dispose());
  else if (material) material.dispose();
  [...obj.children].forEach(disposeObject);
}

export class Renderer3D {
  private canvas: HTMLCanvasElement;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  private renderer: THREE.WebGLRenderer;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private groundPlane: THREE.Mesh;
  private groundMat: THREE.MeshStandardMaterial;
  private waterMat: THREE.MeshStandardMaterial;
  private waterTex: THREE.CanvasTexture | null = null;
  private roadTex: THREE.CanvasTexture | null = null;
  private hemi: THREE.HemisphereLight;
  private sun: THREE.DirectionalLight;

  private staticGroup = new THREE.Group();
  private entityGroup = new THREE.Group();
  private fxGroup = new THREE.Group();
  private helperGroup = new THREE.Group();

  private towerMeshes = new Map<Tower, THREE.Group>();
  private mineMeshes = new Map<NavalMine, THREE.Group>();
  private enemyMeshes = new Map<Enemy, THREE.Group>();
  private barMeshes = new Map<Enemy, THREE.Group>();

  // 每帧同步用的复用容器：禁止在热路径 new Set / 展开数组
  private aliveTowers = new Set<Tower>();
  private aliveMines = new Set<NavalMine>();
  private aliveEnemies = new Set<Enemy>();
  private aliveProjectiles = new Set<Projectile>();
  private aliveEffects = new Set<Effect>();
  private aliveParticles = new Set<Particle>();
  private spinQ = new THREE.Quaternion();
  private spinAxis = new THREE.Vector3(0, 1, 0);

  // 敌人/血条对象池：死亡实体回收复用，消除刷怪高峰期的 geometry churn。
  // 池按「兵种+是否首领」分键，王冠/光环等变体装饰与实体一一对应。
  private enemyPool = new Map<string, THREE.Group[]>();
  private barPool: Record<'normal' | 'boss', THREE.Group[]> = { normal: [], boss: [] };
  private static readonly POOL_CAP = 14;
  private static readonly BAR_POOL_CAP = 24;

  private canvasW = 960;
  private canvasH = 600;

  // 大本营旗帜波动（buildLevel 时重建）
  private flag: THREE.Mesh | null = null;
  private flagBasePos: Float32Array | null = null;
  private projMeshes = new Map<Projectile, THREE.Object3D>();
  private effectMeshes = new Map<Effect, THREE.Object3D>();
  private particleMeshes = new Map<Particle, THREE.Object3D>();
  private ripples: { mesh: THREE.Mesh; phase: number }[] = [];

  private rangeMesh: THREE.Mesh;
  private hoverMesh: THREE.Mesh;
  private composer!: EffectComposer;
  private bloomPass!: UnrealBloomPass;
  private envMap: THREE.Texture | null = null;
  private weather!: WeatherSystem;
  private groundNormalTex: THREE.CanvasTexture | null = null;
  private waterNormalTex: THREE.CanvasTexture | null = null;
  private cameraShake = 0;
  private cinematicT = 0;
  private readonly cinematicTarget = new THREE.Vector3();
  private readonly onResize = () => this.resize();
  private readonly onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.zoomBy(e.deltaY > 0 ? 1.09 : 0.91);
  };
  private clock = 0;
  private zoom = 1;
  private cameraAngle = 0;
  private nightFactor = 1;
  private highContrast = false;
  private currentTheme: LevelTheme | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene.background = new THREE.Color('#1a2418');
    this.scene.fog = new THREE.Fog('#1a2418', 30, 70);

    this.updateCamera();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.environmentIntensity = 0.18;

    this.hemi = new THREE.HemisphereLight(0xcfe0b8, 0x28331f, 1.05);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffe9c4, 1.15);
    this.sun.position.set(12, 22, 10);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.radius = 3;
    this.sun.shadow.blurSamples = 8;
    this.sun.shadow.camera.left = -18;
    this.sun.shadow.camera.right = 18;
    this.sun.shadow.camera.top = 14;
    this.sun.shadow.camera.bottom = -14;
    this.scene.add(this.sun);

    this.weather = new WeatherSystem(this.scene, this.hemi, this.sun, this.renderer);

    this.groundMat = mat('#2f3d29');
    this.groundPlane = new THREE.Mesh(new THREE.PlaneGeometry(COLS, ROWS), this.groundMat);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);
    this.waterMat = mat('#235d78', { emissive: new THREE.Color('#0a3348'), emissiveIntensity: 0.15, metalness: 0.25, roughness: 0.4 });

    this.scene.add(this.staticGroup, this.entityGroup, this.fxGroup, this.helperGroup);

    this.rangeMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.97, 1, 64),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false }),
    );
    this.rangeMesh.rotation.x = -Math.PI / 2;
    this.rangeMesh.visible = false;
    this.helperGroup.add(this.rangeMesh);

    this.hoverMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.94, 0.04, 0.94),
      new THREE.MeshBasicMaterial({ color: '#7ac47a', transparent: true, opacity: 0.38, depthWrite: false }),
    );
    this.hoverMesh.visible = false;
    this.helperGroup.add(this.hoverMesh);

    this.setupEnvironment();
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.72, 0.62, 0.88);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    window.addEventListener('resize', this.onResize);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.resize();
  }

  private setupEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#516155');
    const panels: [string, [number, number, number], [number, number, number]][] = [
      ['#b7d2e2', [0, 6, 0], [-Math.PI / 2, 0, 0]],
      ['#f2d39b', [7, 2, 0], [0, -Math.PI / 2, 0]],
      ['#8fb8c8', [-7, 2, 0], [0, Math.PI / 2, 0]],
    ];
    panels.forEach(([color, pos, rot]) => {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(14, 12),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
      );
      panel.position.set(...pos);
      panel.rotation.set(...rot);
      envScene.add(panel);
    });
    this.envMap = pmrem.fromScene(envScene, 0.04).texture;
    this.scene.environment = this.envMap;
    pmrem.dispose();
    envScene.traverse((obj) => disposeObject(obj));
  }

  /** 注入雷声回调（由 Game 层接 AudioKit，天气系统不持有音频引用） */
  setThunderSound(cb: () => void) {
    this.weather.setThunderCallback(cb);
  }

  private get accentIntensity() {
    return (this.highContrast ? 2.15 : 1.6) * this.nightFactor;
  }

  setHighContrast(on: boolean) {
    this.highContrast = on;
    this.applyContrast();
  }

  private applyContrast() {
    const factor = this.highContrast ? 0.9 : 1;
    this.hemi.intensity = (this.currentTheme?.ambient ?? 1.05) * factor;
    this.sun.intensity = (this.currentTheme?.sun ?? 1.15) * factor;
    this.renderer.toneMappingExposure = this.highContrast ? 1.05 : 0.95;
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.weather.dispose();
    this.composer.dispose();
    this.bloomPass.dispose();
    this.renderer.dispose();
    this.envMap?.dispose();
    this.groundNormalTex?.dispose();
    this.waterNormalTex?.dispose();
  }

  shake(amount: number) {
    this.cameraShake = Math.min(0.4, this.cameraShake + amount);
  }

  cinematicFocus(px: number, py: number) {
    this.cinematicT = 1.2;
    this.cinematicTarget.set(toX(px), 0, toZ(py));
  }

  worldToScreen(px: number, py: number, pz: number): { x: number; y: number } | null {
    const v = TMP_V3.set(toX(px), pz, toZ(py)).project(this.camera);
    if (v.z > 1) return null;
    return { x: (v.x * 0.5 + 0.5) * this.canvasW, y: (-v.y * 0.5 + 0.5) * this.canvasH };
  }

  zoomBy(factor: number) {
    this.zoom = Math.max(0.65, Math.min(1.8, this.zoom * factor));
    this.updateCamera();
  }

  rotateBy(delta: number) {
    this.cameraAngle += delta;
    this.updateCamera();
  }

  resetCamera() {
    this.zoom = 1;
    this.cameraAngle = 0;
    this.updateCamera();
  }

  private updateCamera() {
    const horizontal = 14 * this.zoom;
    const focus = this.cinematicT > 0 ? Math.min(1, this.cinematicT / 1.2) * 0.22 : 0;
    const fx = this.cinematicTarget.x * focus;
    const fz = this.cinematicTarget.z * focus;
    const s = this.cameraShake;
    this.camera.position.set(
      Math.sin(this.cameraAngle) * horizontal + fx + (Math.random() - 0.5) * s,
      18 * this.zoom + (Math.random() - 0.5) * s,
      Math.cos(this.cameraAngle) * horizontal + fz + (Math.random() - 0.5) * s,
    );
    this.camera.lookAt(fx, 0, fz);
  }

  resize() {
    const w = this.canvas.clientWidth || 960;
    const h = this.canvas.clientHeight || 600;
    this.canvasW = w;
    this.canvasH = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.composer.setSize(w, h);
  }

  getTileFromEvent(e: MouseEvent): [number, number] | null {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hit = this.raycaster.intersectObject(this.groundPlane)[0];
    if (!hit) return null;
    const tx = Math.floor(hit.point.x + COLS / 2);
    const ty = Math.floor(hit.point.z + ROWS / 2);
    if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return null;
    return [tx, ty];
  }

  buildLevel(groundPaths: PathData[], waterPaths: PathData[], pathTiles: Set<string>, theme: LevelTheme) {
    this.clearGroup(this.staticGroup);
    this.clearGroup(this.entityGroup);
    this.clearGroup(this.fxGroup);
    this.towerMeshes.clear();
    this.mineMeshes.clear();
    this.enemyMeshes.clear();
    this.barMeshes.clear();
    this.projMeshes.clear();
    this.effectMeshes.clear();
    this.particleMeshes.clear();
    this.ripples = [];

    this.scene.background = new THREE.Color(theme.sky);
    this.scene.fog = new THREE.Fog(theme.fog, 28, 68);
    if (this.groundMat.map) this.groundMat.map.dispose();
    this.groundMat.map = groundTexture(theme);
    if (this.groundNormalTex) this.groundNormalTex.dispose();
    this.groundNormalTex = normalTexture([8, 5], 1.4);
    this.groundMat.normalMap = this.groundNormalTex;
    this.groundMat.normalScale.set(0.32, 0.32);
    this.groundMat.color.set('#ffffff');
    this.groundMat.needsUpdate = true;
    if (this.waterTex) this.waterTex.dispose();
    if (this.roadTex) this.roadTex.dispose();
    this.waterTex = waterTexture(theme.water);
    this.roadTex = roadTexture(theme);
    if (this.waterNormalTex) this.waterNormalTex.dispose();
    this.waterNormalTex = normalTexture([2, 8], 2.2);
    this.waterMat.map = this.waterTex;
    this.waterMat.normalMap = this.waterNormalTex;
    this.waterMat.normalScale.set(0.55, 0.55);
    this.waterMat.color.set('#ffffff');
    this.waterMat.emissive.set(theme.water).multiplyScalar(0.3);
    this.waterMat.needsUpdate = true;
    this.currentTheme = theme;
    this.nightFactor = theme.night ? 1.3 : theme.ambient < 0.9 ? 1.15 : 1;
    this.hemi.color.set(theme.night ? '#8ba1bd' : '#cfe0b8');
    this.hemi.groundColor.set(theme.night ? '#131a1c' : '#28331f');
    this.sun.color.set(theme.night ? '#a9c2e0' : '#ffe9c4');
    this.applyContrast();
    this.weather.applyTheme(theme);

    const dummy = new THREE.Object3D();
    const side: THREE.MeshStandardMaterialParameters = { side: THREE.DoubleSide };
    const roadMat = mat('#ffffff', { ...side, map: this.roadTex!, roughness: 0.95, metalness: 0.02 });
    const roadEdgeMat = mat(new THREE.Color(theme.path).multiplyScalar(0.5).getStyle(), { ...side, roughness: 1 });
    const roadShoulderMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme.path).multiplyScalar(0.72), transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false,
    });
    const waterEdgeMat = mat(new THREE.Color(theme.water).multiplyScalar(0.5).getStyle(), { ...side, roughness: 0.5 });

    const addRibbon = (path: PathData, edgeMat: THREE.Material, mainMat: THREE.Material, width: number, y: number, shoulder?: THREE.Material) => {
      if (path.points.length < 2) return;
      if (shoulder) {
        const soft = new THREE.Mesh(ribbonGeometry(path.points, width + 0.5, y - 0.02), shoulder);
        this.staticGroup.add(soft);
      }
      const edge = new THREE.Mesh(ribbonGeometry(path.points, width + 0.2, y - 0.008), edgeMat);
      const main = new THREE.Mesh(ribbonGeometry(path.points, width, y), mainMat);
      edge.receiveShadow = true;
      main.receiveShadow = true;
      this.staticGroup.add(edge, main);
    };
    groundPaths.forEach((p) => addRibbon(p, roadEdgeMat, roadMat, 0.82, 0.035, roadShoulderMat));
    waterPaths.forEach((p) => addRibbon(p, waterEdgeMat, this.waterMat, 0.92, 0.028));

    const roadMarks: Point[] = [];
    groundPaths.forEach((p) => p.points.forEach((pt, i) => {
      if (i % 3 === 0) roadMarks.push(pt);
    }));
    if (roadMarks.length) {
      const markGeo = theme.deco === 'city' || theme.deco === 'rails' || theme.deco === 'space'
        ? new THREE.BoxGeometry(0.18, 0.012, 0.06)
        : new THREE.DodecahedronGeometry(0.09, 0);
      const markMat = mat(theme.deco === 'space' ? '#c9d6f0' : new THREE.Color(theme.path).multiplyScalar(1.25).getStyle());
      const marks = new THREE.InstancedMesh(markGeo, markMat, roadMarks.length);
      roadMarks.forEach((pt, i) => {
        dummy.position.set(toX(pt.x) + ((i % 3) - 1) * 0.16, 0.055, toZ(pt.y) + ((i % 2) - 0.5) * 0.22);
        dummy.rotation.set(0, i * 1.7, 0);
        dummy.scale.setScalar(0.6 + (i % 4) * 0.12);
        dummy.updateMatrix();
        marks.setMatrixAt(i, dummy.matrix);
      });
      marks.instanceMatrix.needsUpdate = true;
      this.staticGroup.add(marks);
    }

    waterPaths.forEach((p) => {
      for (let i = 3; i < p.points.length - 1; i += 5) {
        const mesh = new THREE.Mesh(
          new THREE.RingGeometry(0.12, 0.17, 18),
          new THREE.MeshBasicMaterial({ color: '#d6f0f8', transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }),
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(toX(p.points[i].x), 0.062, toZ(p.points[i].y));
        this.ripples.push({ mesh, phase: (i * 0.7) % (Math.PI * 2) });
        this.staticGroup.add(mesh);
      }
    });

    const waterTileSet = new Set<string>();
    waterPaths.forEach((p) => p.tiles.forEach(([x, y]) => waterTileSet.add(`${x},${y}`)));
    const bridgeTiles: number[][] = [];
    groundPaths.forEach((p) => p.tiles.forEach(([x, y]) => {
      if (waterTileSet.has(`${x},${y}`)) bridgeTiles.push([x, y]);
    }));
    if (bridgeTiles.length) {
      const bridgeMat = mat(theme.deco === 'space' || theme.deco === 'city' ? '#8d929a' : '#7a705c');
      const railMat = mat(theme.deco === 'space' || theme.deco === 'city' ? '#b9c0c8' : '#a89a79');
      const deck = new THREE.InstancedMesh(new THREE.BoxGeometry(0.98, 0.22, 0.98), bridgeMat, bridgeTiles.length);
      const railH = new THREE.InstancedMesh(new THREE.BoxGeometry(0.98, 0.16, 0.09), railMat, bridgeTiles.length);
      const railV = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.16, 0.98), railMat, bridgeTiles.length);
      bridgeTiles.forEach(([tx, ty], i) => {
        const wx = tileX(tx), wz = tileZ(ty);
        dummy.scale.setScalar(1);
        dummy.rotation.set(0, 0, 0);
        dummy.position.set(wx, 0.09, wz);
        dummy.updateMatrix();
        deck.setMatrixAt(i, dummy.matrix);
        dummy.position.set(wx, 0.28, wz - 0.44);
        dummy.updateMatrix();
        railH.setMatrixAt(i, dummy.matrix);
        dummy.position.set(wx, 0.28, wz + 0.44);
        dummy.updateMatrix();
        railH.setMatrixAt(i + bridgeTiles.length, dummy.matrix);
        dummy.position.set(wx - 0.44, 0.28, wz);
        dummy.updateMatrix();
        railV.setMatrixAt(i, dummy.matrix);
        dummy.position.set(wx + 0.44, 0.28, wz);
        dummy.updateMatrix();
        railV.setMatrixAt(i + bridgeTiles.length, dummy.matrix);
      });
      [deck, railH, railV].forEach((m) => {
        m.instanceMatrix.needsUpdate = true;
        m.castShadow = m.receiveShadow = true;
        this.staticGroup.add(m);
      });
    }
    const waterShoreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme.water).multiplyScalar(0.7), transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false,
    });
    waterPaths.forEach((p) => {
      const shore = new THREE.Mesh(ribbonGeometry(p.points, 1.55, 0.012), waterShoreMat);
      this.staticGroup.add(shore);
    });

    const wallMat = mat(theme.deco === 'ruins' ? '#5c5548' : '#4c4b3b');
    const wallH = new THREE.InstancedMesh(new THREE.BoxGeometry(0.96, 0.35, 0.18), wallMat, COLS * 2);
    const wallV = new THREE.InstancedMesh(new THREE.BoxGeometry(0.18, 0.35, 0.96), wallMat, ROWS * 2);
    let hi = 0;
    let vi = 0;
    const setWall = (mesh: THREE.InstancedMesh, index: number, x: number, z: number) => {
      dummy.position.set(x, 0.17, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    };
    for (let i = 0; i < COLS; i++) {
      setWall(wallH, hi++, tileX(i), tileZ(0) - 0.42);
      setWall(wallH, hi++, tileX(i), tileZ(ROWS - 1) + 0.42);
    }
    for (let j = 0; j < ROWS; j++) {
      setWall(wallV, vi++, tileX(0) - 0.42, tileZ(j));
      setWall(wallV, vi++, tileX(COLS - 1) + 0.42, tileZ(j));
    }
    wallH.instanceMatrix.needsUpdate = true;
    wallV.instanceMatrix.needsUpdate = true;
    wallH.castShadow = wallH.receiveShadow = true;
    wallV.castShadow = wallV.receiveShadow = true;
    this.staticGroup.add(wallH, wallV);

    this.addGroundPatchwork(pathTiles, waterTileSet, theme, dummy);
    this.addPathVerge(groundPaths, waterPaths, theme, dummy);

    const density = theme.deco === 'forest' ? 34 : theme.deco === 'trees' ? 22 : theme.deco === 'reeds' ? 26 : 18;
    const spots: number[][] = [];
    for (let tx = 1; tx < COLS - 1; tx++) {
      for (let ty = 1; ty < ROWS - 1; ty++) {
        const hash = Math.abs((tx * 73856093) ^ (ty * 19349663)) % 100;
        if (hash > density || pathTiles.has(`${tx},${ty}`)) continue;
        if (tx === BASE_TILE[0] && ty === BASE_TILE[1]) continue;
        spots.push([tx, ty, hash]);
      }
    }
    this.addDeco(spots, pathTiles, waterTileSet, theme, dummy);

    const base = new THREE.Group();
    const platform = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.58, 0.22, 8), mat('#3c4632')));
    platform.position.y = 0.12;
    const block = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.55, 0.62), mat('#b85446')));
    block.position.y = 0.5;
    const roof = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.3, 4), mat('#d6b070')));
    roof.position.y = 0.92;
    roof.rotation.y = Math.PI / 4;
    const pole = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.65, 6), mat('#e8e0c8')));
    pole.position.set(0.4, 0.9, -0.4);
    // 分段旗帜：顶点每帧做正弦波动，贴杆端固定、旗尾摆幅递增
    const flagGeo = new THREE.PlaneGeometry(0.4, 0.24, 8, 2);
    const flag = new THREE.Mesh(flagGeo, mat('#e0b34d', { side: THREE.DoubleSide }));
    flag.position.set(0.61, 1.06, -0.4);
    this.flag = flag;
    this.flagBasePos = Float32Array.from(flagGeo.attributes.position.array as Float32Array);
    base.add(platform, block, roof, pole, flag);
    if (theme.night) {
      const lamp = new THREE.PointLight(0xffc98a, 2.2, 11);
      lamp.position.set(0, 1.6, 0);
      base.add(lamp);
    }
    base.position.set(tileX(BASE_TILE[0]), 0, tileZ(BASE_TILE[1]));
    this.staticGroup.add(base);

    if (theme.night) {
      const postMat = mat('#3a4147', { metalness: 0.5, roughness: 0.5 });
      const bulbMat = new THREE.MeshBasicMaterial({ color: '#ffd39a' });
      const spots: [number, number][] = [[2, 2], [COLS - 3, 2], [2, ROWS - 3], [COLS - 3, ROWS - 3]];
      spots.forEach(([tx, ty]) => {
        const lamp = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.8, 6), postMat);
        pole.position.y = 0.4;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), bulbMat);
        bulb.position.y = 0.84;
        const light = new THREE.PointLight(0xffb86b, 1.7, 10, 2);
        light.position.y = 0.84;
        lamp.add(pole, bulb, light);
        lamp.position.set(tileX(tx), 0, tileZ(ty));
        this.staticGroup.add(lamp);
      });
    }
  }

  private addGroundPatchwork(pathTiles: Set<string>, waterTileSet: Set<string>, theme: LevelTheme, dummy: THREE.Object3D) {
    const patches: number[][] = [];
    for (let tx = 0; tx < COLS; tx++) {
      for (let ty = 0; ty < ROWS; ty++) {
        if (pathTiles.has(`${tx},${ty}`) || waterTileSet.has(`${tx},${ty}`)) continue;
        const h = seeded(tx * 31 + ty * 17);
        if (h < 0.34) patches.push([tx, ty, h]);
      }
    }
    if (!patches.length) return;
    const colors = theme.deco === 'desert'
      ? ['#b39261', '#d2b483', '#8d7248']
      : theme.deco === 'snow'
        ? ['#e4eef0', '#c3d6dd', '#f2f7f8']
        : theme.deco === 'city' || theme.deco === 'rails' || theme.deco === 'space'
          ? ['#565b62', '#6c7178', '#454950']
          : ['#476138', '#5c7646', '#385234'];
    colors.forEach((color, ci) => {
      const group = patches.filter(([, , h]) => Math.floor(h * 100) % colors.length === ci);
      if (!group.length) return;
      const mesh = new THREE.InstancedMesh(
        new THREE.CircleGeometry(0.5, 7),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }),
        group.length,
      );
      group.forEach(([tx, ty, h], i) => {
        dummy.position.set(tileX(tx) + (seeded(i * 3.3) - 0.5) * 0.4, 0.018 + ci * 0.001, tileZ(ty) + (seeded(i * 5.1) - 0.5) * 0.4);
        dummy.rotation.set(-Math.PI / 2, 0, seeded(i * 2.2) * 6.28);
        dummy.scale.set(0.6 + seeded(i * 7.7) * 0.6, 0.5 + seeded(i * 9.1) * 0.5, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      this.staticGroup.add(mesh);
    });
  }

  private addPathVerge(groundPaths: PathData[], waterPaths: PathData[], theme: LevelTheme, dummy: THREE.Object3D) {
    const verge: number[][] = [];
    const stamp = (px: number, py: number, salt: number) => {
      const tx = Math.round(px / TILE - 0.5);
      const ty = Math.round(py / TILE - 0.5);
      const h = seeded(salt * 1.37 + tx * 13 + ty * 7);
      if (h > 0.5) verge.push([toX(px), toZ(py), h]);
    };
    [...groundPaths, ...waterPaths].forEach((p) => {
      p.points.forEach((pt, i) => {
        if (i % 2 !== 0) return;
        const prev = p.points[Math.max(0, i - 1)];
        const next = p.points[Math.min(p.points.length - 1, i + 1)];
        let dx = next.x - prev.x, dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;
        const nx = -dy * (TILE * 0.9), ny = dx * (TILE * 0.9);
        stamp(pt.x + nx, pt.y + ny, i + 1);
        stamp(pt.x - nx, pt.y - ny, i + 40);
      });
    });
    if (!verge.length) return;
    const tuft = theme.deco === 'desert' || theme.deco === 'snow'
      ? new THREE.DodecahedronGeometry(0.07, 0)
      : new THREE.ConeGeometry(0.08, 0.26, 5);
    const tuftMat = mat(theme.deco === 'desert' ? '#a08a5e'
      : theme.deco === 'snow' ? '#dbe7ea'
        : theme.deco === 'space' || theme.deco === 'city' ? '#7d8590' : '#688049');
    const mesh = new THREE.InstancedMesh(tuft, tuftMat, verge.length);
    verge.forEach(([x, z, h], i) => {
      dummy.position.set(x, 0.06, z);
      dummy.rotation.set(0, seeded(i * 3.1) * 6.28, (seeded(i * 4.3) - 0.5) * 0.4);
      dummy.scale.setScalar(0.6 + h * 0.7);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    this.staticGroup.add(mesh);
  }

  private addDeco(spots: number[][], pathTiles: Set<string>, waterTileSet: Set<string>, theme: LevelTheme, dummy: THREE.Object3D) {
    if (!spots.length) return;
    const place = (geo: THREE.BufferGeometry, material: THREE.Material, y: number, scaleFn?: (hash: number) => number, filter?: (hash: number) => boolean) => {
      const selected = filter ? spots.filter(([, , h]) => filter(h)) : spots;
      if (!selected.length) { geo.dispose(); material.dispose(); return; }
      const mesh = new THREE.InstancedMesh(geo, material, selected.length);
      selected.forEach(([tx, ty, hash], i) => {
        const jitterX = (seeded(hash + i * 1.3) - 0.5) * 0.34;
        const jitterZ = (seeded(hash + i * 2.7) - 0.5) * 0.34;
        dummy.position.set(tileX(tx) + jitterX, y, tileZ(ty) + jitterZ);
        dummy.rotation.set(0, hash * 0.063, 0);
        dummy.scale.setScalar(scaleFn ? scaleFn(hash) : 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.staticGroup.add(mesh);
    };
    const half = (h: number) => h % 2 === 0;
    const quarter = (h: number) => h % 4 === 0;
    switch (theme.deco) {
      case 'trees':
      case 'forest': {
        const dark = theme.deco === 'forest';
        place(new THREE.CylinderGeometry(0.05, 0.07, 0.24, 6), mat('#5a4630'), 0.12);
        place(new THREE.ConeGeometry(0.24, 0.58, 7), mat(dark ? '#35603a' : '#497245'), 0.5, (h) => 0.75 + h * 0.006);
        place(new THREE.SphereGeometry(0.14, 7, 6), mat(dark ? '#2b7a45' : '#5b8a50'), 0.34, (h) => 0.7 + h * 0.008, half);
        place(new THREE.ConeGeometry(0.1, 0.3, 6), mat('#7a9e56'), 0.16, (h) => 0.6 + h * 0.01, quarter);
        place(new THREE.DodecahedronGeometry(0.09, 0), mat('#8b8870'), 0.07, (h) => 0.6 + h * 0.012, (h) => h % 3 === 0);
        break;
      }
      case 'rocks':
        place(new THREE.DodecahedronGeometry(0.27, 0), mat('#6d6d5f'), 0.16, (h) => 0.7 + h * 0.008);
        place(new THREE.DodecahedronGeometry(0.14, 0), mat('#848478'), 0.08, (h) => 0.6 + h * 0.012, half);
        place(new THREE.ConeGeometry(0.09, 0.32, 5), mat('#738a5c'), 0.16, (h) => 0.6 + h * 0.01, quarter);
        break;
      case 'reeds':
        place(new THREE.ConeGeometry(0.09, 0.5, 5), mat('#779249'), 0.25, (h) => 0.7 + h * 0.009);
        place(new THREE.CylinderGeometry(0.015, 0.02, 0.7, 5), mat('#93ad63'), 0.35, (h) => 0.7 + h * 0.01, half);
        place(new THREE.SphereGeometry(0.06, 6, 5), mat('#b9a05c'), 0.7, (h) => 0.8 + h * 0.006, quarter);
        place(new THREE.DodecahedronGeometry(0.1, 0), mat('#7b7d6c'), 0.06, (h) => 0.6 + h * 0.012, (h) => h % 3 === 0);
        break;
      case 'crates':
        place(new THREE.BoxGeometry(0.36, 0.36, 0.36), mat('#8d6c45'), 0.18, (h) => 0.8 + h * 0.008);
        place(new THREE.CylinderGeometry(0.16, 0.16, 0.36, 10), mat('#6d5638'), 0.18, (h) => 0.8 + h * 0.008, half);
        place(new THREE.BoxGeometry(0.14, 0.14, 0.14), mat('#a98454'), 0.08, (h) => 0.7 + h * 0.012, quarter);
        break;
      case 'rails':
        place(new THREE.BoxGeometry(0.12, 0.06, 0.9), mat('#7d7d6d'), 0.05);
        place(new THREE.CylinderGeometry(0.03, 0.04, 0.5, 6), mat('#9c9c8c'), 0.25, (h) => 0.8 + h * 0.01, half);
        place(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat('#b1a377'), 0.05, (h) => 0.6 + h * 0.012, quarter);
        break;
      case 'ruins':
        place(new THREE.BoxGeometry(0.34, 0.5, 0.28), mat('#7c715f'), 0.25, (h) => 0.7 + h * 0.01);
        place(new THREE.BoxGeometry(0.5, 0.18, 0.4), mat('#91856e'), 0.09, (h) => 0.7 + h * 0.01, half);
        place(new THREE.CylinderGeometry(0.07, 0.09, 0.44, 8), mat('#6f6555'), 0.22, (h) => 0.8 + h * 0.008, quarter);
        place(new THREE.DodecahedronGeometry(0.09, 0), mat('#a99a80'), 0.05, (h) => 0.6 + h * 0.012, (h) => h % 3 === 0);
        break;
      case 'desert':
        place(new THREE.CylinderGeometry(0.05, 0.08, 0.36, 6), mat('#6f8a4b'), 0.18, (h) => 0.7 + h * 0.01, half);
        place(new THREE.SphereGeometry(0.11, 7, 6), mat('#4f7d42'), 0.4, (h) => 0.7 + h * 0.01, half);
        place(new THREE.DodecahedronGeometry(0.23, 0), mat('#9c8059'), 0.14, (h) => 0.7 + h * 0.008);
        place(new THREE.TorusGeometry(0.14, 0.05, 5, 10, Math.PI), mat('#b99a68'), 0.06, (h) => 0.6 + h * 0.01, quarter);
        break;
      case 'snow':
        place(new THREE.CylinderGeometry(0.04, 0.06, 0.2, 6), mat('#5d5144'), 0.1, (h) => 0.7 + h * 0.01, half);
        place(new THREE.ConeGeometry(0.26, 0.64, 7), mat('#d8e6e8'), 0.46, (h) => 0.75 + h * 0.006, half);
        place(new THREE.DodecahedronGeometry(0.15, 0), mat('#eef5f6'), 0.1, (h) => 0.7 + h * 0.012, quarter);
        place(new THREE.OctahedronGeometry(0.09, 0), mat('#a9cbd6', { metalness: 0.2, roughness: 0.3 }), 0.18, (h) => 0.6 + h * 0.012, (h) => h % 3 === 0);
        break;
      case 'city':
        place(new THREE.BoxGeometry(0.38, 0.8, 0.38), mat('#6f7377'), 0.4, (h) => 0.8 + h * 0.006);
        place(new THREE.BoxGeometry(0.14, 0.14, 0.14), mat('#c4ad74'), 0.86, (h) => 0.8 + h * 0.008, half);
        place(new THREE.CylinderGeometry(0.02, 0.03, 0.5, 6), mat('#9fa6ad'), 0.25, (h) => 0.8 + h * 0.01, quarter);
        place(new THREE.SphereGeometry(0.07, 7, 6), mat('#6f8f5a'), 0.14, (h) => 0.7 + h * 0.012, (h) => h % 3 === 0);
        break;
      case 'space':
        place(new THREE.OctahedronGeometry(0.28, 0), mat('#8fa2c4', { metalness: 0.35, roughness: 0.35 }), 0.24, (h) => 0.7 + h * 0.01);
        place(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 5), mat('#c9d6f0'), 0.5, (h) => 0.8 + h * 0.006, half);
        place(new THREE.SphereGeometry(0.09, 8, 6), mat('#a9c8ff', { emissive: new THREE.Color('#5b8fd8'), emissiveIntensity: 0.7 }), 0.3, (h) => 0.7 + h * 0.01, quarter);
        place(new THREE.TorusGeometry(0.16, 0.025, 5, 12), mat('#b9c8e0', { metalness: 0.5, roughness: 0.3 }), 0.06, (h) => 0.6 + h * 0.012, (h) => h % 3 === 0);
        break;
    }
  }

  private clearGroup(group: THREE.Group) {
    [...group.children].forEach((child) => {
      group.remove(child);
      disposeObject(child);
    });
  }

  private createNavalMineMesh(color: string): THREE.Group {
    const g = new THREE.Group();
    const bodyMat = mat('#3c4248', { metalness: 0.5, roughness: 0.55 });
    const body = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), bodyMat));
    body.position.y = 0.06;
    g.add(body);
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), mat(color, { emissive: new THREE.Color(color), emissiveIntensity: 1.3 }));
    light.position.y = 0.34;
    g.add(light);
    const directions = [
      [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1],
      [0.7, 0.55, 0], [-0.7, 0.55, 0], [0, 0.55, 0.7], [0, 0.55, -0.7],
    ];
    directions.forEach(([dx, dy, dz]) => {
      const spike = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.2, 6), bodyMat));
      const dir = new THREE.Vector3(dx, dy, dz).normalize();
      spike.position.set(dir.x * 0.38, 0.06 + dir.y * 0.38, dir.z * 0.38);
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      g.add(spike);
    });
    return g;
  }

  private createMineLayerMesh(color: string, type: TowerType): THREE.Group {
    const g = new THREE.Group();
    const cfg = TOWER_CONFIG[type];
    const steel = mat('#ffffff', { metalness: 0.42, roughness: 0.55, map: patternTexture(cfg.pattern, cfg.body, cfg.secondary) });
    const dark = mat('#596154', { metalness: 0.4, roughness: 0.58 });
    const warn = mat('#e9b23c');
    const glow = glowMat(color, 1);

    // 双层六角基座
    const foot = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.1, 6), dark));
    foot.position.y = 0.06;
    g.add(foot);
    const deck = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 0.12, 6), steel));
    deck.position.y = 0.17;
    g.add(deck);
    // 基座警示条纹
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.11, 0.05), warn);
      stripe.position.set(Math.cos(a) * 0.41, 0.17, Math.sin(a) * 0.41);
      stripe.rotation.y = -a;
      g.add(stripe);
    }

    // 装甲塔身：主圆柱 + 上沿环 + 侧护板
    const body = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.32, 0.3, 10), steel));
    body.position.y = 0.38;
    g.add(body);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 10), dark);
    collar.position.y = 0.54;
    g.add(collar);
    [-1, 1].forEach((s) => {
      const plate = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.3), dark));
      plate.position.set(s * 0.28, 0.38, 0);
      plate.rotation.z = s * 0.18;
      g.add(plate);
    });

    // 可旋转投放机构
    const pivot = new THREE.Group();
    pivot.position.y = 0.56;
    g.add(pivot);
    const turret = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.12, 10), dark));
    turret.position.y = 0.03;
    pivot.add(turret);
    // 关节臂：上臂 + 前伸臂，抬起呈投放姿态
    const upper = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.34, 0.11), steel));
    upper.position.set(0, 0.2, 0.05);
    upper.rotation.x = -0.35;
    pivot.add(upper);
    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), glow);
    joint.position.set(0, 0.37, 0.11);
    pivot.add(joint);
    const forearm = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.46), steel));
    forearm.position.set(0, 0.42, 0.32);
    forearm.rotation.x = 0.5;
    pivot.add(forearm);
    // 末端夹爪（半环）夹持一颗待布水雷
    const claw = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 6, 14, Math.PI * 1.4), glow));
    claw.rotation.x = Math.PI / 2;
    claw.rotation.z = Math.PI * 0.3;
    claw.position.set(0, 0.5, 0.55);
    pivot.add(claw);
    const payload = shadow(new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), dark));
    payload.position.set(0, 0.5, 0.55);
    pivot.add(payload);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 5), steel);
      spike.position.set(Math.cos(a) * 0.13, 0.5, 0.55 + Math.sin(a) * 0.13);
      spike.rotation.z = -a;
      pivot.add(spike);
    }
    // 顶部信标灯
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 6), dark);
    mast.position.set(0, 0.15, -0.16);
    pivot.add(mast);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), glow);
    beacon.position.set(0, 0.24, -0.16);
    pivot.add(beacon);

    const pipMat = glowMat('#ffffff', 0.9);
    const pips: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const pip = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), pipMat);
      pip.position.set(-0.12 + i * 0.12, 0.1, 0.5);
      g.add(pip);
      pips.push(pip);
    }
    g.userData = { pivot, pips };
    return g;
  }

  private addBossCrown(g: THREE.Group, e: Enemy): THREE.Group {
    const crown = new THREE.Group();
    const gold = mat('#f2c66a', { metalness: 0.7, roughness: 0.25, emissive: new THREE.Color('#8a5a12'), emissiveIntensity: 0.35 });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 8), gold);
    crown.add(band);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 5), gold);
      spike.position.set(Math.cos(a) * 0.19, 0.14, Math.sin(a) * 0.19);
      crown.add(spike);
    }
    crown.position.y = e.kind === 'air' ? 0.62 : e.type === 'strider' ? 1.65 : e.type === 'tank' || e.type === 'mech' ? 1.5 : 1.0;
    g.add(crown);
    return crown;
  }

  private createTower(t: Tower): THREE.Group {
    const cfg = TOWER_CONFIG[t.type];
    if (t.type === 'mine') return this.createMineLayerMesh(cfg.color, t.type);
    const g = new THREE.Group();
    const accent = cfg.color;
    const armor = new THREE.MeshStandardMaterial({
      color: '#ffffff', map: patternTexture(cfg.pattern, cfg.body, cfg.secondary),
      metalness: 0.42, roughness: 0.55,
    });
    const trim = metalMat(cfg.secondary, 0.5, 0.5);
    const dark = metalMat('#596154', 0.4, 0.58);
    const glow = glowMat(accent, 1);
    const lens = glowMat(accent, 1.15);
    const pulse: THREE.Mesh[] = [];

    const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
      const m = shadow(new THREE.Mesh(geo, material));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      parent.add(m);
      return m;
    };
    const box = (parent: THREE.Object3D, w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) =>
      add(parent, new THREE.BoxGeometry(w, h, d), material, x, y, z, rx, ry, rz);
    const cyl = (parent: THREE.Object3D, rt: number, rb: number, h: number, seg: number, material: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) =>
      add(parent, new THREE.CylinderGeometry(rt, rb, h, seg), material, x, y, z, rx, ry, rz);
    const tor = (parent: THREE.Object3D, r: number, tube: number, radial: number, tubular: number, material: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) =>
      add(parent, new THREE.TorusGeometry(r, tube, radial, tubular), material, x, y, z, rx, ry, rz);
    const sph = (parent: THREE.Object3D, r: number, material: THREE.Material, x: number, y: number, z: number) =>
      add(parent, new THREE.SphereGeometry(r, 10, 8), material, x, y, z);
    const cone = (parent: THREE.Object3D, r: number, h: number, seg: number, material: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) =>
      add(parent, new THREE.ConeGeometry(r, h, seg), material, x, y, z, rx, ry, rz);

    // 共用底盘：八边形装甲 + 发光识别环，所有武器保持同一轮廓语言
    add(g, new THREE.CylinderGeometry(0.5, 0.54, 0.1, 8), dark, 0, 0.07, 0);
    addEdges(add(g, new THREE.CylinderGeometry(0.42, 0.48, 0.16, 8), armor, 0, 0.19, 0), 0.32);
    add(g, new THREE.CylinderGeometry(0.35, 0.35, 0.05, 8), trim, 0, 0.29, 0);
    tor(g, 0.42, 0.035, 5, 16, glow, 0, 0.27, 0, Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2;
      cyl(g, 0.028, 0.028, 0.05, 6, trim, Math.cos(a) * 0.38, 0.31, Math.sin(a) * 0.38);
    }
    addEdges(add(g, new THREE.CylinderGeometry(0.3, 0.35, 0.24, 8), armor, 0, 0.43, 0), 0.3);
    box(g, 0.46, 0.16, 0.14, trim, 0, 0.44, 0.28, -0.16);
    box(g, 0.22, 0.1, 0.2, dark, 0, 0.57, -0.22);
    const pipMat = glowMat('#ffffff', 0.9);
    const pips: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) pips.push(sph(g, 0.028, pipMat, -0.12 + i * 0.12, 0.1, 0.5));

    const pivot = new THREE.Group();
    pivot.position.y = 0.46;
    g.add(pivot);

    switch (t.type) {
      case 'machinegun': {
        [-0.12, 0.12].forEach((x) => {
          cyl(pivot, 0.032, 0.038, 0.72, 8, trim, x, 0.02, 0.36, Math.PI / 2);
          cyl(pivot, 0.05, 0.05, 0.12, 8, armor, x, 0.02, 0.68, Math.PI / 2);
          pulse.push(sph(pivot, 0.035, glow, x, 0.02, 0.76));
        });
        box(pivot, 0.2, 0.22, 0.3, armor, -0.3, -0.04, 0.02);
        box(pivot, 0.36, 0.06, 0.24, trim, 0, 0.18, 0.18, -0.2);
        break;
      }
      case 'howitzer': {
        cyl(pivot, 0.115, 0.135, 0.82, 10, trim, 0, 0.02, 0.4, Math.PI / 2);
        cyl(pivot, 0.15, 0.15, 0.16, 10, armor, 0, 0.02, 0.78, Math.PI / 2);
        pulse.push(tor(pivot, 0.15, 0.025, 6, 14, glow, 0, 0.02, 0.86));
        [-0.22, 0.22].forEach((x) => box(pivot, 0.05, 0.16, 0.42, armor, x, 0.04, 0.1, -0.12));
        box(pivot, 0.34, 0.18, 0.3, dark, 0, 0, -0.16);
        pulse.push(box(pivot, 0.05, 0.03, 0.3, glow, 0, 0.18, 0.34));
        break;
      }
      case 'aa': {
        [-0.14, 0.14].forEach((x) => {
          cyl(pivot, 0.033, 0.04, 0.78, 8, trim, x, 0.1, 0.34, Math.PI / 2 - 0.3);
          cyl(pivot, 0.052, 0.052, 0.1, 8, armor, x, 0.34, 0.68, Math.PI / 2 - 0.3);
        });
        box(pivot, 0.42, 0.1, 0.14, armor, 0, 0.02, 0.02);
        [-0.34, 0.34].forEach((x) => cyl(g, 0.14, 0.14, 0.1, 10, dark, x, 0.43, -0.06, 0, 0, Math.PI / 2));
        cyl(g, 0.02, 0.02, 0.18, 6, trim, 0, 0.61, -0.18);
        add(g, new THREE.SphereGeometry(0.18, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.42), armor, 0, 0.72, -0.18, Math.PI / 2.6);
        pulse.push(sph(g, 0.045, glow, 0, 0.79, -0.18));
        break;
      }
      case 'coastal': {
        cyl(pivot, 0.075, 0.105, 1.05, 10, trim, 0, 0.02, 0.5, Math.PI / 2);
        cyl(pivot, 0.11, 0.11, 0.18, 10, armor, 0, 0.02, 1, Math.PI / 2);
        pulse.push(tor(pivot, 0.115, 0.022, 6, 14, glow, 0, 0.02, 1.08));
        box(pivot, 0.6, 0.36, 0.05, armor, 0, 0.05, 0.18, -0.16);
        pulse.push(box(pivot, 0.62, 0.05, 0.08, glow, 0, 0.24, 0.2, -0.16));
        [-0.16, 0.16].forEach((x) => cyl(pivot, 0.03, 0.03, 0.5, 6, armor, x, -0.1, 0.28, Math.PI / 2));
        box(g, 0.38, 0.06, 0.08, trim, 0, 0.66, -0.06);
        [-0.16, 0.16].forEach((x) => sph(g, 0.035, lens, x, 0.68, -0.06));
        break;
      }
      case 'laser': {
        box(pivot, 0.08, 0.08, 0.7, trim, 0, 0, 0.34);
        [-0.16, 0.16].forEach((x) => {
          box(pivot, 0.05, 0.16, 0.34, armor, x, 0, 0.18, 0, 0, x > 0 ? -0.12 : 0.12);
          pulse.push(box(pivot, 0.03, 0.1, 0.28, glow, x, 0, 0.2));
        });
        cyl(pivot, 0.14, 0.16, 0.2, 10, trim, 0, 0, 0.7, Math.PI / 2);
        pulse.push(sph(pivot, 0.1, glow, 0, 0, 0.82));
        pulse.push(tor(pivot, 0.14, 0.02, 6, 16, glow, 0, 0, 0.78));
        cyl(pivot, 0.12, 0.12, 0.22, 8, dark, 0, 0, -0.12, Math.PI / 2);
        break;
      }
      case 'flak': {
        [-0.13, 0, 0.13].forEach((x) => {
          cyl(pivot, 0.032, 0.04, 0.66, 8, trim, x, 0.02, 0.32, Math.PI / 2);
          cyl(pivot, 0.048, 0.048, 0.1, 8, armor, x, 0.02, 0.62, Math.PI / 2);
        });
        pulse.push(tor(pivot, 0.2, 0.025, 6, 18, glow, 0, 0.02, 0.66));
        cyl(pivot, 0.17, 0.17, 0.12, 12, dark, -0.3, -0.02, 0, 0, 0, Math.PI / 2);
        tor(pivot, 0.18, 0.02, 6, 16, armor, -0.36, -0.02, 0, 0, Math.PI / 2);
        break;
      }
      case 'railgun': {
        [-0.16, 0.16].forEach((x) => {
          box(pivot, 0.05, 0.06, 1.2, armor, x, 0, 0.55);
          pulse.push(box(pivot, 0.025, 0.025, 1.16, glow, x, 0.05, 0.55));
        });
        [0.22, 0.5, 0.78].forEach((z) => {
          tor(pivot, 0.19, 0.03, 6, 14, trim, 0, 0, z);
          pulse.push(box(pivot, 0.4, 0.04, 0.05, glow, 0, -0.06, z));
        });
        box(pivot, 0.5, 0.24, 0.36, dark, 0, 0, -0.2);
        pulse.push(box(pivot, 0.07, 0.07, 1.1, glow, 0, 0, 0.55));
        box(pivot, 0.42, 0.06, 0.08, armor, 0, 0, 1.12);
        break;
      }
      case 'tesla': {
        cyl(g, 0.16, 0.2, 0.16, 8, dark, 0, 0.57, 0);
        [0.2, 0.38, 0.56].forEach((y, i) => {
          pulse.push(tor(pivot, 0.2 - i * 0.02, 0.03, 6, 16, glow, 0, y, 0, Math.PI / 2));
          cyl(pivot, 0.05, 0.05, 0.16, 6, trim, 0, y - 0.08, 0);
        });
        pulse.push(sph(pivot, 0.12, glow, 0, 0.76, 0));
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2;
          cone(pivot, 0.035, 0.16, 5, armor, Math.cos(a) * 0.16, 0.68, Math.sin(a) * 0.16, 0, 0, -a);
        }
        pulse.push(tor(pivot, 0.22, 0.018, 5, 18, glow, 0, 0.8, 0, Math.PI / 2));
        break;
      }
    }

    pulse.forEach((part) => {
      const material = part.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) part.userData.baseEmissive = material.emissiveIntensity;
    });
    g.userData = { pivot, pips, pulse };
    return g;
  }

  private decorateEnemy(g: THREE.Group, e: Enemy) {
    const accent = glowMat(cfgAccent(e.color), 0.75);
    const steel = metalMat('#7c8678', 0.62, 0.42);
    const dark = metalMat('#394037', 0.45, 0.58);
    const trim = metalMat('#d8e0d4', 0.35, 0.55);
    const lamp = glowMat('#fff0c0', 1.15);
    const red = glowMat('#ff7365', 1.3);
    const green = glowMat('#89f5ad', 1.3);
    const pulse: THREE.Mesh[] = [];
    const add = (geo: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
      const m = shadow(new THREE.Mesh(geo, material));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      g.add(m);
      return m;
    };
    const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) =>
      add(new THREE.BoxGeometry(w, h, d), m, x, y, z, rx, ry, rz);
    const cyl = (rt: number, rb: number, h: number, s: number, m: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) =>
      add(new THREE.CylinderGeometry(rt, rb, h, s), m, x, y, z, rx, ry, rz);
    const sph = (r: number, m: THREE.Material, x: number, y: number, z: number) => add(new THREE.SphereGeometry(r, 10, 8), m, x, y, z);

    g.children.slice(0, 9).forEach((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) addEdges(mesh, 0.3);
    });

    switch (e.type) {
      case 'infantry':
        box(0.2, 0.07, 0.04, dark, 0, 0.82, 0.13);
        pulse.push(box(0.16, 0.035, 0.03, accent, 0, 0.83, 0.15));
        [-0.2, 0.2].forEach((x) => box(0.1, 0.1, 0.16, steel, x, 0.7, 0));
        box(0.05, 0.3, 0.04, steel, -0.14, 0.52, -0.15, 0, 0, -0.15);
        box(0.05, 0.3, 0.04, steel, 0.14, 0.52, -0.15, 0, 0, 0.15);
        sph(0.035, red, 0.14, 0.62, 0.1);
        cyl(0.012, 0.012, 0.22, 5, trim, -0.16, 0.78, -0.18);
        box(0.04, 0.04, 0.18, dark, 0.16, 0.56, 0.34);
        break;
      case 'truck':
        box(0.5, 0.06, 0.07, steel, 0, 0.85, 0.44);
        pulse.push(box(0.3, 0.045, 0.06, accent, 0, 0.89, 0.44));
        [-0.3, 0.3].forEach((x) => box(0.02, 0.06, 0.6, trim, x, 0.47, 0));
        [-0.28, 0.28].forEach((x) => box(0.02, 0.08, 0.4, steel, x, 0.7, -0.3));
        sph(0.05, lamp, -0.24, 0.55, 0.55);
        sph(0.05, lamp, 0.24, 0.55, 0.55);
        box(0.34, 0.2, 0.28, steel, 0, 0.74, -0.3);
        box(0.26, 0.16, 0.24, dark, 0, 0.74, -0.3);
        cyl(0.02, 0.02, 0.18, 6, dark, -0.42, 0.74, 0.4, 0, 0, Math.PI / 2);
        sph(0.05, dark, -0.51, 0.74, 0.4);
        break;
      case 'tank':
        box(0.94, 0.14, 0.1, steel, 0, 0.32, 0.62);
        box(0.09, 0.12, 0.78, steel, -0.46, 0.32, 0);
        box(0.09, 0.12, 0.78, steel, 0.46, 0.32, 0);
        [-0.52, 0.52].forEach((x) => box(0.03, 0.16, 0.9, trim, x, 0.42, 0));
        pulse.push(cyl(0.075, 0.075, 0.05, 8, accent, 0, 0.74, 0.62, Math.PI / 2));
        sph(0.05, lamp, -0.28, 0.55, 0.6);
        sph(0.05, lamp, 0.28, 0.55, 0.6);
        cyl(0.02, 0.02, 0.42, 6, dark, -0.3, 1.02, -0.16);
        box(0.2, 0.14, 0.18, steel, 0.24, 0.86, -0.24);
        break;
      case 'plane':
      case 'bomber':
        sph(0.05, red, -0.88, 0.06, 0);
        sph(0.05, green, 0.88, 0.06, 0);
        [-0.4, 0.4].forEach((x) => {
          cyl(0.08, 0.08, 0.1, 10, accent, x, 0, 0.34, Math.PI / 2);
          pulse.push(box(0.44, 0.02, 0.07, accent, x, 0.08, 0.02));
          box(0.06, 0.04, 0.3, steel, x, 0.02, -0.16);
        });
        if (e.type === 'bomber') {
          [-0.18, 0.18].forEach((x) => box(0.08, 0.12, 0.32, dark, x, -0.14, -0.02));
          [-0.2, 0.2].forEach((x) => box(0.04, 0.2, 0.22, steel, x, 0.16, -0.62));
        }
        break;
      case 'helicopter':
        sph(0.06, lamp, 0, -0.12, 0.42);
        cyl(0.07, 0.07, 0.06, 8, trim, 0, 0.33, 0);
        pulse.push(box(0.04, 0.04, 0.4, accent, 0, 0.06, -0.45));
        [-0.42, 0.42].forEach((x) => cyl(0.06, 0.06, 0.3, 8, dark, x, -0.1, 0.02, 0, 0, Math.PI / 2));
        add(new THREE.TorusGeometry(0.14, 0.02, 5, 12), steel, 0.06, 0.1, -0.76, Math.PI / 2);
        break;
      case 'ship':
      case 'destroyer': {
        const len = e.type === 'destroyer' ? 1.9 : 1.6;
        [-0.36, 0.36].forEach((x) => box(0.02, 0.08, len * 0.8, steel, x, 0.38, 0));
        pulse.push(box(0.08, 0.012, len * 0.7, accent, 0, 0.34, 0));
        box(0.32, 0.05, 0.02, trim, 0, 0.66, 0.02);
        sph(0.07, lamp, 0, 0.78, -0.12);
        box(0.22, 0.1, 0.12, accent, -0.24, 0.42, -0.6);
        add(new THREE.CapsuleGeometry(0.08, 0.18, 4, 8), steel, 0.26, 0.46, -0.62, Math.PI / 2);
        box(0.2, 0.14, 0.01, accent, 0, 1.18, -0.14);
        break;
      }
      case 'submarine':
        cyl(0.025, 0.025, 0.12, 6, red, 0, 0.58, -0.05);
        pulse.push(box(0.12, 0.02, 0.2, accent, 0, 0.37, -0.05));
        sph(0.04, lamp, 0, 0.02, 0.72);
        [-0.5, 0.5].forEach((z) => box(0.5, 0.03, 0.06, accent, 0, 0.02, z));
        break;
      case 'hovercraft':
        add(new THREE.TorusGeometry(0.52, 0.035, 6, 18), accent, 0, 0.07, 0, Math.PI / 2);
        pulse.push(add(new THREE.TorusGeometry(0.46, 0.012, 5, 18), accent, 0, 0.12, 0, Math.PI / 2));
        box(0.3, 0.03, 0.05, trim, 0, 0.24, 0.58);
        [-0.3, 0.3].forEach((x) => add(new THREE.TorusGeometry(0.14, 0.02, 5, 14), lamp, x, 0.4, -0.57));
        break;
      case 'mech':
      case 'strider':
        pulse.push(sph(0.11, accent, 0, 0.82, 0.22));
        [-0.42, 0.42].forEach((x) => {
          cyl(0.03, 0.03, 0.22, 6, accent, x, 1.0, -0.1);
          box(0.18, 0.1, 0.26, trim, x, 0.92, 0.02);
          cyl(0.025, 0.025, 0.3, 6, steel, x, 0.62, 0.12);
          box(0.1, 0.22, 0.12, steel, x, 0.45, -0.04);
        });
        box(0.34, 0.08, 0.06, steel, 0, 0.98, 0.2);
        break;
      case 'drone':
        [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([x, z]) =>
          pulse.push(add(new THREE.TorusGeometry(0.17, 0.018, 5, 14), accent, x, 0.05, z, Math.PI / 2)));
        add(new THREE.TorusGeometry(0.09, 0.012, 5, 12), trim, 0, -0.02, 0.18);
        pulse.push(sph(0.05, glowMat('#66d0ff', 1.4), 0, -0.02, 0.18));
        break;
    }
    // 首领光环：所有敌人模型统一携带（非首领隐藏），引用存入 userData，
    // 避免每帧 children.find 查找，也让对象池复用时状态可恢复
    {
      const aura = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.025, 6, 32),
        new THREE.MeshBasicMaterial({ color: '#f2c66a', transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      aura.rotation.x = Math.PI / 2;
      aura.position.y = 0.08;
      aura.visible = !!e.boss;
      g.add(aura);
      pulse.forEach((part) => {
        const material = part.material as THREE.MeshStandardMaterial;
        if (material.emissiveIntensity !== undefined) part.userData.baseEmissive = material.emissiveIntensity;
      });
      Object.assign(g.userData, { aura, pulse });
    }
  }

  private createEnemy(e: Enemy): THREE.Group {
    const g = new THREE.Group();
    const bodyMat = mat(e.color, {
      metalness: e.kind === 'air' ? 0.45 : 0.32,
      roughness: e.kind === 'water' ? 0.5 : 0.62,
      emissive: new THREE.Color(e.color),
      emissiveIntensity: 0.12,
    });
    const darkMat = mat('#394037', { metalness: 0.45, roughness: 0.58 });
    const glassMat = mat('#bcd8e0', {
      metalness: 0.25, roughness: 0.2,
      emissive: new THREE.Color('#6fa0b0'), emissiveIntensity: 0.08,
    });
    if (e.type === 'infantry') {
      const legGeo = new THREE.BoxGeometry(0.1, 0.32, 0.1);
      const legs: THREE.Mesh[] = [];
      [-0.08, 0.08].forEach((x) => {
        const leg = shadow(new THREE.Mesh(legGeo, mat('#4a4a3a')));
        leg.position.set(x, 0.16, 0);
        legs.push(leg);
        g.add(leg);
      });
      const torso = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.42, 8), bodyMat)); torso.position.y = 0.5;
      const vest = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.12), mat('#6b6a4d'))); vest.position.set(0, 0.52, 0.11);
      const pack = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.14), mat('#5f5b42'))); pack.position.set(0, 0.52, -0.16);
      const head = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mat('#d8bd97'))); head.position.y = 0.8;
      const helmet = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat)); helmet.position.y = 0.83;
      const brim = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 10), bodyMat)); brim.position.y = 0.8;
      [-0.19, 0.19].forEach((x) => {
        const arm = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), bodyMat));
        arm.position.set(x, 0.5, 0.03);
        arm.rotation.x = -0.5;
        g.add(arm);
      });
      const rifle = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.5), darkMat)); rifle.position.set(0.16, 0.5, 0.28);
      g.add(legs[0], legs[1], torso, vest, pack, head, helmet, brim, rifle);
      g.userData = { legs };
    } else if (e.type === 'truck') {
      const chassis = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.26, 1.0), bodyMat)); chassis.position.y = 0.38;
      const cabin = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.42), bodyMat)); cabin.position.set(0, 0.64, 0.26);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.03), glassMat); glass.position.set(0, 0.68, 0.48);
      const bed = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.44), mat('#6c6249'))); bed.position.set(0, 0.59, -0.28);
      const bumper = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.1, 0.08), darkMat)); bumper.position.set(0, 0.3, 0.55);
      [-0.24, 0.24].forEach((x) => {
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), mat('#ffe6a8', { emissive: new THREE.Color('#ffcc66'), emissiveIntensity: 0.8 }));
        lamp.position.set(x, 0.42, 0.53);
        g.add(lamp);
      });
      const wheels: THREE.Mesh[] = [];
      const wheelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 10);
      [[-0.35, -0.32], [0.35, -0.32], [-0.35, 0.32], [0.35, 0.32]].forEach(([x, z]) => {
        const wheel = shadow(new THREE.Mesh(wheelGeo, mat('#242822')));
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.18, z);
        wheel.userData.baseQuat = wheel.quaternion.clone();
        wheels.push(wheel);
        g.add(wheel);
      });
      g.add(chassis, cabin, glass, bed, bumper);
      g.userData = { wheels };
    } else if (e.type === 'tank') {
      const hull = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.36, 1.16), bodyMat)); hull.position.y = 0.4;
      const glacis = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.14, 0.4), bodyMat)); glacis.position.set(0, 0.5, 0.62); glacis.rotation.x = -0.5;
      const trackGeo = new THREE.BoxGeometry(0.22, 0.3, 1.3);
      [-0.52, 0.52].forEach((x) => {
        const track = shadow(new THREE.Mesh(trackGeo, mat('#33382d')));
        track.position.set(x, 0.23, 0);
        g.add(track);
      });
      const turret = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.26, 10), bodyMat)); turret.position.y = 0.72;
      const hatch = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.08, 8), darkMat)); hatch.position.set(0.12, 0.88, -0.06);
      const barrel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.78, 8), darkMat));
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.74, 0.48);
      const brake = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8), mat('#4b5042')));
      brake.rotation.x = Math.PI / 2;
      brake.position.set(0, 0.74, 0.88);
      const antenna = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.4, 5), mat('#c8c4a8'))); antenna.position.set(-0.26, 1.0, -0.14);
      const wheels: THREE.Mesh[] = [];
      const roadGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 8);
      [-0.45, -0.15, 0.15, 0.45].forEach((z) => {
        [-0.52, 0.52].forEach((x) => {
          const wheel = shadow(new THREE.Mesh(roadGeo, mat('#4b5042')));
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.19, z);
          wheel.userData.baseQuat = wheel.quaternion.clone();
          wheels.push(wheel);
          g.add(wheel);
        });
      });
      g.add(hull, glacis, turret, hatch, barrel, brake, antenna);
      g.userData = { wheels };
    } else if (e.type === 'plane') {
      const fuselage = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.15), bodyMat));
      const wingGeo = new THREE.BoxGeometry(0.7, 0.05, 0.28);
      [-0.36, 0.36].forEach((x) => {
        const wing = shadow(new THREE.Mesh(wingGeo, bodyMat));
        wing.position.set(x, 0.02, 0);
        wing.rotation.z = x > 0 ? -0.08 : 0.08;
        g.add(wing);
        const tip = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.2), mat(cfgAccent(e.color)))); tip.position.set(x * 1.9, 0.04, 0);
        g.add(tip);
      });
      const canopy = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), glassMat)); canopy.scale.set(0.8, 0.55, 1.4); canopy.position.set(0, 0.13, 0.2);
      const tail = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.18), bodyMat)); tail.position.z = -0.5;
      const fin = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.24), bodyMat)); fin.position.set(0, 0.15, -0.5);
      const nose = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.34, 8), mat('#d8e3e8'))); nose.rotation.x = Math.PI / 2; nose.position.z = 0.72;
      const propeller = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.05, 0.05), darkMat); propeller.position.z = 0.92;
      const spinner = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 8), mat('#e8e0c8'))); spinner.rotation.x = Math.PI / 2; spinner.position.z = 0.96;
      g.add(fuselage, canopy, tail, fin, nose, propeller, spinner);
      g.userData = { propeller };
    } else if (e.type === 'ship') {
      const hullMat = mat(e.color, { roughness: 0.62, metalness: 0.28 });
      const deckMat = mat('#8a948f', { roughness: 0.85 });
      const trimMat = mat('#e6d8a8', { roughness: 0.5, metalness: 0.35 });
      const darkTrim = mat('#39434a', { roughness: 0.6, metalness: 0.4 });

      const hull = shadow(new THREE.Mesh(hullGeometry(1.6, 0.78, 0.3, 0.3), hullMat));
      g.add(hull);

      const deckGeo = new THREE.ShapeGeometry(deckShape(1.6, 0.78));
      deckGeo.rotateX(-Math.PI / 2);
      const deck = shadow(new THREE.Mesh(deckGeo, deckMat));
      deck.position.y = 0.3;
      g.add(deck);

      const waterline = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.035, 1.35), darkTrim));
      waterline.position.y = 0.06;
      g.add(waterline);

      const superstructure = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.56), hullMat));
      superstructure.position.set(0, 0.43, -0.22);
      const bridge = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.28), hullMat));
      bridge.position.set(0, 0.63, -0.12);
      const bridgeRoof = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.34), trimMat));
      bridgeRoof.position.set(0, 0.75, -0.12);
      g.add(superstructure, bridge, bridgeRoof);

      const windows: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.012), glassMat);
        win.position.set(-0.1 + i * 0.1, 0.65, 0.025);
        windows.push(win);
        g.add(win);
      }
      [-0.23, 0.23].forEach((x) => {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.4), glassMat);
        strip.position.set(x, 0.45, -0.22);
        g.add(strip);
      });

      const funnel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.26, 10), darkTrim));
      funnel.position.set(0, 0.47, -0.5);
      const funnelCap = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 10), trimMat));
      funnelCap.position.set(0, 0.61, -0.5);
      g.add(funnel, funnelCap);

      const mast = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.022, 0.46, 6), trimMat));
      mast.position.set(0, 1.0, -0.14);
      const yard = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.018, 0.018), trimMat));
      yard.position.set(0, 1.16, -0.14);
      const radar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.016, 6, 14), mat('#dce6e8', { metalness: 0.5 }));
      radar.position.set(0, 1.26, -0.14);
      radar.rotation.x = 0.55;
      g.add(mast, yard, radar);

      const turretBase = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 10), hullMat));
      turretBase.position.set(0, 0.37, 0.42);
      const turret = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), hullMat));
      turret.position.set(0, 0.41, 0.42);
      const barrel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 0.42, 8), darkTrim));
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.45, 0.65);
      g.add(turretBase, turret, barrel);

      [-0.28, 0.28].forEach((x) => {
        const rail = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.5), darkTrim));
        rail.position.set(x, 0.35, 0.1);
        g.add(rail);
      });

      g.userData = { radar, barrel };
    } else if (e.type === 'mech') {
      const legs: THREE.Mesh[] = [];
      [-0.28, 0.28].forEach((x) => {
        const leg = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.55, 8), darkMat)); leg.position.set(x, 0.3, 0);
        const foot = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.38), darkMat)); foot.position.set(x, 0.05, 0.1);
        legs.push(leg);
        g.add(leg, foot);
      });
      const torso = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.5, 0.4), bodyMat)); torso.position.y = 0.78;
      const cockpit = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), glassMat)); cockpit.scale.set(1, 0.7, 0.8); cockpit.position.set(0, 1.0, 0.16);
      [-0.42, 0.42].forEach((x) => {
        const shoulder = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.24, 0.34), bodyMat)); shoulder.position.set(x, 0.88, 0);
        const cannon = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.5, 8), darkMat)); cannon.rotation.x = Math.PI / 2; cannon.position.set(x, 0.78, 0.32);
        g.add(shoulder, cannon);
      });
      g.add(torso, cockpit);
      g.userData = { legs };
    } else if (e.type === 'drone') {
      const core = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), bodyMat));
      const ring = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.025, 6, 14), mat(cfgAccent(e.color)))); ring.rotation.x = Math.PI / 2;
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), mat('#2a3a48', { emissive: new THREE.Color('#66d0ff'), emissiveIntensity: 0.8 })); lens.position.z = 0.16;
      const rotors: THREE.Mesh[] = [];
      [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([x, z]) => {
        const arm = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.42), darkMat)); arm.position.set(x * 0.5, 0, z * 0.5); arm.rotation.y = x * z > 0 ? Math.PI / 4 : -Math.PI / 4;
        const rotor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.04), mat('#d8e4ec')); rotor.position.set(x, 0.04, z);
        rotors.push(rotor);
        g.add(arm, rotor);
      });
      g.add(core, ring, lens);
      g.userData = { rotors };
    } else if (e.type === 'hovercraft') {
      const hullMat = mat(e.color, { roughness: 0.58, metalness: 0.3 });
      const skirtMat = mat('#3a4649', { roughness: 0.9 });
      const trimMat = mat('#d8c88e', { roughness: 0.5, metalness: 0.3 });

      const hull = shadow(new THREE.Mesh(hullGeometry(1.4, 0.8, 0.22, 0.3), hullMat));
      hull.position.y = 0.06;
      g.add(hull);

      const skirt = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.56, 0.14, 14), skirtMat));
      skirt.scale.z = 1.5;
      skirt.position.y = 0.02;
      const skirtBand = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.035, 6, 18), trimMat));
      skirtBand.rotation.x = Math.PI / 2;
      skirtBand.scale.y = 1.5;
      skirtBand.position.y = 0.08;
      g.add(skirt, skirtBand);

      const cockpit = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), glassMat));
      cockpit.scale.set(0.85, 0.62, 1.2);
      cockpit.position.set(0, 0.42, 0.22);
      const canopyFrame = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.014, 5, 12), trimMat));
      canopyFrame.rotation.y = Math.PI / 2;
      canopyFrame.scale.set(1, 0.7, 1);
      canopyFrame.position.set(0, 0.42, 0.22);
      g.add(cockpit, canopyFrame);

      const rotors: THREE.Mesh[] = [];
      [-0.3, 0.3].forEach((x) => {
        const housing = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 12), hullMat));
        housing.rotation.x = Math.PI / 2;
        housing.position.set(x, 0.4, -0.5);
        const ring = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.016, 5, 14), trimMat));
        ring.position.set(x, 0.4, -0.56);
        const fan = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.05), mat('#e0eaf0'));
        fan.position.set(x, 0.4, -0.56);
        rotors.push(fan);
        g.add(housing, ring, fan);
      });

      const turret = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.1, 10), hullMat));
      turret.position.set(0, 0.38, 0.52);
      const barrel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.4, 8), darkMat));
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.42, 0.72);
      g.add(turret, barrel);

      g.userData = { rotors };
    } else if (e.type === 'bomber') {
      const fuselage = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 1.1, 10), bodyMat)); fuselage.rotation.x = Math.PI / 2;
      const nose = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.36, 10), mat('#c8c4b4'))); nose.rotation.x = Math.PI / 2; nose.position.z = 0.68;
      const tail = shadow(new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.4, 8), bodyMat)); tail.rotation.x = -Math.PI / 2; tail.position.z = -0.7;
      [-0.55, 0.55].forEach((x) => {
        const wing = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.34), bodyMat)); wing.position.set(x, 0, 0.05); wing.rotation.z = x > 0 ? -0.08 : 0.08;
        const engine = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.36, 8), darkMat)); engine.rotation.x = Math.PI / 2; engine.position.set(x * 1.05, -0.02, 0.05);
        g.add(wing, engine);
      });
      const tailWing = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.22), bodyMat)); tailWing.position.z = -0.65;
      const fin = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.3), bodyMat)); fin.position.set(0, 0.14, -0.66);
      const bombBay = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.4), darkMat); bombBay.position.set(0, -0.16, 0);
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), glassMat); canopy.scale.set(0.8, 0.6, 1.3); canopy.position.set(0, 0.13, 0.42);
      g.add(fuselage, nose, tail, tailWing, fin, bombBay, canopy);
    } else if (e.type === 'helicopter') {
      const body = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), bodyMat)); body.scale.set(0.85, 0.85, 1.35);
      const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), glassMat); cockpit.scale.set(0.85, 0.7, 1); cockpit.position.set(0, 0.02, 0.22);
      const tailBoom = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.7, 8), bodyMat)); tailBoom.rotation.x = Math.PI / 2; tailBoom.position.z = -0.45;
      const tailFin = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.16), bodyMat)); tailFin.position.set(0, 0.1, -0.76);
      const mastRotor = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 6), darkMat); mastRotor.position.y = 0.28;
      const rotors: THREE.Mesh[] = [];
      const mainRotor = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.06), mat('#d8e4ec')); mainRotor.position.y = 0.36;
      const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.02), mat('#d8e4ec')); tailRotor.position.set(0.06, 0.1, -0.76);
      rotors.push(mainRotor, tailRotor);
      [-0.26, 0.26].forEach((x) => {
        const pod = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.3), darkMat)); pod.position.set(x, -0.06, 0);
      });
      const skidMat = mat('#4a5055');
      [-0.16, 0.16].forEach((x) => {
        const skid = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), skidMat)); skid.rotation.x = Math.PI / 2; skid.position.set(x, -0.28, 0);
        g.add(skid);
      });
      g.add(body, cockpit, tailBoom, tailFin, mastRotor, mainRotor, tailRotor);
      g.userData = { rotors };
    } else if (e.type === 'destroyer') {
      const hull = shadow(new THREE.Mesh(hullGeometry(1.9, 0.82, 0.34, 0.34), bodyMat));
      const deckMat = mat('#8a948f');
      const deckGeo = new THREE.ShapeGeometry(deckShape(1.9, 0.82)); deckGeo.rotateX(-Math.PI / 2);
      const deck = shadow(new THREE.Mesh(deckGeo, deckMat)); deck.position.y = 0.34;
      const superstructure = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.3, 0.62), bodyMat)); superstructure.position.set(0, 0.5, -0.28);
      const bridge = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.3), bodyMat)); bridge.position.set(0, 0.74, -0.18);
      const funnel = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.2), darkMat)); funnel.position.set(0, 0.55, -0.62);
      const destroyerTrim = mat('#e6d8a8', { roughness: 0.5, metalness: 0.35 });
      const mast = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.022, 0.5, 6), destroyerTrim)); mast.position.set(0, 1.08, -0.2);
      const radar = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.016, 6, 14), mat('#dce6e8', { metalness: 0.5 })); radar.position.set(0, 1.34, -0.2); radar.rotation.x = 0.5;
      const turret = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat)); turret.position.set(0, 0.42, 0.5);
      const barrel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.038, 0.5, 8), darkMat)); barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 0.46, 0.75);
      const rearTurret = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat)); rearTurret.position.set(0, 0.4, -0.75);
      for (let i = 0; i < 3; i++) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.012), glassMat); win.position.set(-0.1 + i * 0.1, 0.76, -0.02);
        g.add(win);
      }
      g.add(hull, deck, superstructure, bridge, funnel, mast, radar, turret, barrel, rearTurret);
      g.userData = { radar };
    } else if (e.type === 'submarine') {
      const hull = shadow(new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.7, 6, 12), bodyMat)); hull.rotation.x = Math.PI / 2;
      const tower = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.28), bodyMat)); tower.position.set(0, 0.24, -0.05);
      const periscope = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 6), darkMat)); periscope.position.set(0, 0.46, -0.05);
      [-0.5, 0.5].forEach((z) => {
        const fin = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.16), bodyMat)); fin.position.set(0, 0, z);
        g.add(fin);
      });
      const tailFin = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.2), bodyMat)); tailFin.position.set(0, 0.12, -0.72);
      const portholes: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const port = new THREE.Mesh(new THREE.CircleGeometry(0.035, 8), glassMat); port.position.set(0.235, 0.02, -0.3 + i * 0.3); port.rotation.y = Math.PI / 2;
        portholes.push(port);
      }
      g.add(hull, tower, periscope, tailFin, ...portholes);
    } else {
      const legs: THREE.Mesh[] = [];
      [[-0.34, -0.34], [0.34, -0.34], [-0.34, 0.34], [0.34, 0.34]].forEach(([x, z]) => {
        const leg = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.75, 6), darkMat)); leg.position.set(x, 0.38, z); leg.rotation.z = x > 0 ? 0.18 : -0.18;
        legs.push(leg);
        g.add(leg);
      });
      const body = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.46, 0.7), bodyMat)); body.position.y = 0.95;
      const dome = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMat)); dome.position.y = 1.18;
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), mat('#d9c2ff', { emissive: new THREE.Color(e.color), emissiveIntensity: 1 }));
      core.position.set(0, 0.98, 0.36);
      const mast = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 5), mat('#d8d2e8'))); mast.position.set(0, 1.55, -0.1);
      g.add(body, dome, core, mast);
      g.userData = { legs };
    }
    this.decorateEnemy(g, e);
    if (e.boss) { g.userData.crown = this.addBossCrown(g, e); g.scale.setScalar(1.18); }
    Object.assign(g.userData, { prevAngle: e.angle });
    return g;
  }

  private poolKey(type: EnemyType, boss: boolean) {
    return boss ? `${type}:boss` : type;
  }

  private recycleEnemy(type: EnemyType, boss: boolean, mesh: THREE.Group) {
    const key = this.poolKey(type, boss);
    const pool = this.enemyPool.get(key);
    if (pool) {
      if (pool.length >= Renderer3D.POOL_CAP) {
        disposeObject(mesh);
        return;
      }
      pool.push(mesh);
    } else {
      this.enemyPool.set(key, [mesh]);
    }
    // 复位姿态与变体装饰，等待下次复用
    mesh.rotation.set(0, 0, 0);
    const aura = mesh.userData.aura as THREE.Mesh | undefined;
    if (aura) aura.visible = false;
  }

  private recycleBar(boss: boolean, bar: THREE.Group) {
    const pool = boss ? this.barPool.boss : this.barPool.normal;
    if (pool.length >= Renderer3D.BAR_POOL_CAP) {
      disposeObject(bar);
      return;
    }
    pool.push(bar);
  }

  private createBar(boss = false): THREE.Group {
    const width = boss ? 1.25 : 0.72;
    const g = new THREE.Group();
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(width, boss ? 0.14 : 0.09), new THREE.MeshBasicMaterial({ color: '#4a1f1a', depthTest: false }));
    const fg = new THREE.Mesh(new THREE.PlaneGeometry(width, boss ? 0.14 : 0.09), new THREE.MeshBasicMaterial({ color: boss ? '#f2c66a' : '#8fd18a', depthTest: false }));
    fg.position.z = 0.002;
    fg.name = 'fg';
    g.add(bg, fg);
    g.renderOrder = 10;
    return g;
  }

  private syncTowers(towers: Tower[]) {
    const alive = this.aliveTowers;
    alive.clear();
    for (const t of towers) alive.add(t);
    // Map 支持遍历中删除；配合复用的 alive 集合实现零分配的增删同步
    for (const [t, mesh] of this.towerMeshes) {
      if (!alive.has(t)) {
        this.entityGroup.remove(mesh);
        disposeObject(mesh);
        this.towerMeshes.delete(t);
      }
    }
    towers.forEach((t) => {
      let mesh = this.towerMeshes.get(t);
      if (!mesh) {
        mesh = this.createTower(t);
        this.towerMeshes.set(t, mesh);
        this.entityGroup.add(mesh);
      }
      mesh.position.set(tileX(t.tx), 0, tileZ(t.ty));
      mesh.userData.pivot.rotation.y = Math.PI / 2 - t.angle;
      const recoil = Math.max(0, t.recoil ?? 0);
      mesh.userData.pivot.position.z = -recoil * 0.18;
      mesh.userData.pivot.rotation.x = recoil * 0.07;
      mesh.userData.pips.forEach((pip: THREE.Mesh, i: number) => { pip.visible = i < t.level; });
      (mesh.userData.pulse as THREE.Mesh[] | undefined)?.forEach((part, i) => {
        const wave = Math.sin(this.clock * 5 + t.id * 0.7 + i * 0.9);
        part.scale.setScalar(1 + wave * 0.14);
        const material = part.material as THREE.MeshStandardMaterial;
        if (material.emissiveIntensity !== undefined) {
          const base = (part.userData.baseEmissive as number | undefined) ?? 1;
          material.emissiveIntensity = this.accentIntensity * base * (1 + wave * 0.3);
        }
      });
    });
  }

  private syncMines(mines: NavalMine[]) {
    const alive = this.aliveMines;
    alive.clear();
    for (const m of mines) alive.add(m);
    for (const [m, mesh] of this.mineMeshes) {
      if (!alive.has(m)) {
        this.entityGroup.remove(mesh);
        disposeObject(mesh);
        this.mineMeshes.delete(m);
      }
    }
    mines.forEach((m) => {
      let mesh = this.mineMeshes.get(m);
      if (!mesh) {
        mesh = this.createNavalMineMesh(m.color);
        this.mineMeshes.set(m, mesh);
        this.entityGroup.add(mesh);
      }
      mesh.position.set(toX(m.x), Math.sin(this.clock * 2 + m.id) * 0.03, toZ(m.y));
      mesh.rotation.y = this.clock * 0.6 + m.id;
    });
  }

  private syncEnemies(enemies: Enemy[]) {
    const alive = this.aliveEnemies;
    alive.clear();
    for (const e of enemies) alive.add(e);
    for (const [e, mesh] of this.enemyMeshes) {
      if (!alive.has(e)) {
        this.entityGroup.remove(mesh);
        this.recycleEnemy(e.type, e.boss, mesh);
        this.enemyMeshes.delete(e);
        const bar = this.barMeshes.get(e);
        if (bar) {
          this.fxGroup.remove(bar);
          this.recycleBar(e.boss, bar);
          this.barMeshes.delete(e);
        }
      }
    }
    enemies.forEach((e) => {
      let mesh = this.enemyMeshes.get(e);
      if (!mesh) {
        // 优先从对象池取同类实体，池空才新建
        mesh = this.enemyPool.get(this.poolKey(e.type, e.boss))?.pop() ?? this.createEnemy(e);
        mesh.scale.setScalar(e.boss ? 1.18 : 1);
        const crown = mesh.userData.crown as THREE.Group | undefined;
        if (crown) crown.visible = e.boss;
        this.enemyMeshes.set(e, mesh);
        this.entityGroup.add(mesh);
        const bar = (e.boss ? this.barPool.boss : this.barPool.normal).pop() ?? this.createBar(e.boss);
        this.barMeshes.set(e, bar);
        this.fxGroup.add(bar);
      }
      const baseY = e.type === 'submarine' ? -0.12
        : e.type === 'bomber' ? 1.6 : e.type === 'helicopter' ? 1.35
        : e.kind === 'air' ? 1.25 : e.type === 'ship' || e.type === 'destroyer' ? 0.08 : 0;
      const bob = e.type === 'infantry' ? Math.sin(this.clock * 9 + e.id) * 0.035
        : e.kind === 'air' ? Math.sin(this.clock * 3 + e.id) * 0.04
          : e.kind === 'ground' ? Math.abs(Math.sin(this.clock * 8 + e.id)) * 0.018 : 0;
      mesh.position.set(toX(e.x), baseY + bob, toZ(e.y));
      mesh.rotation.y = Math.PI / 2 - e.angle;
      if (e.kind === 'air' && mesh.userData.prevAngle !== undefined) {
        let diff = e.angle - mesh.userData.prevAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const bank = THREE.MathUtils.clamp(-diff * 3.2, -0.5, 0.5);
        mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, bank, 0.18);
      }
      mesh.userData.prevAngle = e.angle;
      if (mesh.userData.wheels) {
        this.spinQ.setFromAxisAngle(this.spinAxis, e.traveled * 2.2);
        (mesh.userData.wheels as THREE.Mesh[]).forEach((wheel) => {
          wheel.quaternion.copy(wheel.userData.baseQuat).multiply(this.spinQ);
        });
      }
      if (mesh.userData.propeller) (mesh.userData.propeller as THREE.Mesh).rotation.z = this.clock * 28;
      if (mesh.userData.rotors) {
        (mesh.userData.rotors as THREE.Mesh[]).forEach((rotor, i) => {
          rotor.rotation.z = this.clock * (26 + i * 2);
        });
      }
      if (mesh.userData.radar) {
        (mesh.userData.radar as THREE.Mesh).rotation.z = this.clock * 1.5;
      }
      if (mesh.userData.legs) {
        (mesh.userData.legs as THREE.Mesh[]).forEach((leg, i) => {
          leg.rotation.x = Math.sin(this.clock * 8 + i * Math.PI) * 0.32;
        });
      }
      (mesh.userData.pulse as THREE.Mesh[] | undefined)?.forEach((part, i) => {
        const material = part.material as THREE.MeshStandardMaterial;
        if (material.emissiveIntensity === undefined) return;
        const base = (part.userData.baseEmissive as number | undefined) ?? 1;
        material.emissiveIntensity = base * (0.82 + 0.28 * Math.sin(this.clock * 3 + e.id * 0.4 + i));
      });
      const aura = mesh.userData.aura as THREE.Mesh | undefined;
      if (aura) {
        aura.visible = e.boss;
        if (e.boss) {
          aura.rotation.z = this.clock * 0.9;
          (aura.material as THREE.MeshBasicMaterial).opacity = 0.5 + 0.28 * Math.sin(this.clock * 4);
        }
      }

      const bar = this.barMeshes.get(e)!;
      const barY = e.type === 'drone' ? 0.72 : e.type === 'helicopter' ? 0.65 : e.kind === 'air' ? 1.9
        : e.type === 'strider' ? 1.9 : e.type === 'mech' ? 1.4
        : e.type === 'destroyer' ? 1.1 : e.type === 'ship' ? 0.82 : e.type === 'submarine' ? 0.55
        : e.type === 'hovercraft' ? 0.72 : e.type === 'tank' ? 1.05 : 0.95;
      bar.position.set(toX(e.x), barY + (e.boss ? 0.55 : 0), toZ(e.y));
      bar.quaternion.copy(this.camera.quaternion);
      const ratio = Math.max(0, e.hp / e.maxHp);
      const fg = bar.getObjectByName('fg') as THREE.Mesh;
      const barWidth = e.boss ? 1.25 : 0.72;
      fg.scale.x = ratio;
      fg.position.x = -barWidth / 2 * (1 - ratio);
      (fg.material as THREE.MeshBasicMaterial).color.setHex(
        !e.boss && ratio <= 0.4 ? 0xe06b5d : e.boss && ratio <= 0.25 ? 0xe06b5d : e.boss ? 0xf2c66a : 0x8fd18a,
      );
    });
  }

  private createProjectileMesh(p: Projectile): THREE.Object3D {
    const color = p.color;
    const additive = (c: string, opacity = 0.5) => new THREE.MeshBasicMaterial({
      color: c, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const group = new THREE.Group();
    const add = (geo: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, material);
      m.position.set(x, y, z);
      group.add(m);
      return m;
    };
    const ring = (radius: number, tube: number, material: THREE.Material, y: number) => {
      const m = add(new THREE.TorusGeometry(radius, tube, 6, 14), material, 0, y, 0);
      m.rotation.x = Math.PI / 2;
      return m;
    };
    const tail = (radius: number, length: number, material: THREE.Material, y: number) => {
      const m = add(new THREE.ConeGeometry(radius, length, 10), material, 0, y, 0);
      m.rotation.x = Math.PI;
      return m;
    };

    // 激光：细相干光束 + 两侧约束线，呼应塔上的开放式发射架
    if (p.type === 'laser') {
      // 向目标端收束的聚焦激光：细白核 + 极薄色晕 + 两条近身约束线
      const layers: [number, number, string, number][] = [
        [0.003, 0.007, '#ffffff', 1],
        [0.007, 0.013, color, 0.9],
        [0.013, 0.022, color, 0.18],
      ];
      layers.forEach(([top, bottom, c, o]) =>
        add(new THREE.CylinderGeometry(top, bottom, 1, 6), additive(c, o)));
      return group;
    }

    // 电弧：折线闪电替代直光束，与线圈塔的锯齿能量呼应
    if (p.type === 'tesla') {
      add(new THREE.CylinderGeometry(0.075, 0.075, 1, 8), additive(color, 0.22));
      const pts = [0, 0.2, 0.4, 0.6, 0.8, 1].map((y, i) =>
        new THREE.Vector3(i % 2 ? 0.045 : -0.045, y - 0.5, i % 3 === 1 ? 0.03 : -0.03));
      for (let i = 0; i < pts.length - 1; i++) {
        const dir = new THREE.Vector3().subVectors(pts[i + 1], pts[i]);
        const len = dir.length();
        const mid = pts[i].clone().add(pts[i + 1]).multiplyScalar(0.5);
        const core = add(new THREE.CylinderGeometry(0.014, 0.014, len, 6), additive('#ffffff', 1));
        core.position.copy(mid);
        core.quaternion.setFromUnitVectors(UP, dir.normalize());
        const halo = add(new THREE.CylinderGeometry(0.03, 0.03, len, 6), additive(color, 0.6));
        halo.position.copy(mid);
        halo.quaternion.copy(core.quaternion);
      }
      pts.forEach((pt) => add(new THREE.SphereGeometry(0.028, 6, 5), additive(color, 0.7)).position.copy(pt));
      return group;
    }

    // 磁轨弹：双轨约束 + 磁环 + 锥形尾焰，对应双轨炮的轮廓
    if (p.type === 'railgun') {
      add(new THREE.CapsuleGeometry(0.03, 0.3, 4, 10), additive('#ffffff', 1));
      add(new THREE.CapsuleGeometry(0.085, 0.34, 4, 10), additive(color, 0.5));
      [-0.07, 0.07].forEach((x) => add(new THREE.BoxGeometry(0.016, 0.5, 0.016), additive('#ffffff', 0.9), x));
      [0.06, 0.2].forEach((y) => ring(0.11, 0.018, additive(color, 0.75), y));
      tail(0.08, 0.42, additive(color, 0.4), -0.34);
      return group;
    }

    // 机枪/防空：细曳光弹 + 亮弹头 + 收束尾迹
    if (p.type === 'machinegun' || p.type === 'aa') {
      const nose = add(new THREE.ConeGeometry(0.024, 0.12, 8), additive('#fff8d8', 1), 0, 0.13);
      nose.rotation.x = 0;
      add(new THREE.CapsuleGeometry(0.026, 0.18, 4, 8), additive('#ffffff', 0.95));
      add(new THREE.CapsuleGeometry(0.065, 0.22, 4, 8), additive(color, 0.45));
      tail(0.05, 0.36, additive(color, 0.35), -0.28);
      return group;
    }

    // 重炮弹：金属弹芯 + 尖头 + 弹带 + 尾翼，岸防炮更大、防空爆破炮带爆环
    const shell = p.type === 'coastal' ? { r: 0.16, len: 0.38, seg: 10, fins: 6 }
      : p.type === 'flak' ? { r: 0.13, len: 0.3, seg: 8, fins: 4 }
      : { r: 0.12, len: 0.32, seg: 8, fins: 4 };
    add(new THREE.CapsuleGeometry(shell.r * 0.68, shell.len * 0.5, 4, shell.seg), new THREE.MeshStandardMaterial({
      color, emissive: new THREE.Color(color), emissiveIntensity: 0.8, metalness: 0.62, roughness: 0.3,
    }));
    const nose = add(new THREE.ConeGeometry(shell.r * 0.68, shell.r * 1.4, shell.seg), additive('#ffffff', 0.95), 0, shell.len * 0.42 + shell.r * 0.35);
    nose.rotation.x = 0;
    ring(shell.r * 0.86, 0.018, additive('#ffffff', 0.85), shell.len * 0.08);
    add(new THREE.SphereGeometry(shell.r * 1.6, 10, 8), additive(color, 0.26));
    tail(shell.r * 0.75, 0.42, additive(color, 0.42), -shell.len * 0.5 - 0.16);
    for (let i = 0; i < shell.fins; i++) {
      const fin = add(new THREE.BoxGeometry(0.02, 0.18, shell.r * 1.3), additive(color, 0.6), 0, -shell.len * 0.35, 0);
      fin.rotation.y = (i / shell.fins) * Math.PI * 2;
    }
    if (p.type === 'flak') ring(shell.r * 1.35, 0.016, additive('#ffffff', 0.7), shell.len * 0.5);
    return group;
  }

  private syncProjectiles(projectiles: Projectile[]) {
    const alive = this.aliveProjectiles;
    alive.clear();
    for (const p of projectiles) alive.add(p);
    for (const [p, mesh] of this.projMeshes) {
      if (!alive.has(p)) {
        this.fxGroup.remove(mesh);
        disposeObject(mesh);
        this.projMeshes.delete(p);
      }
    }
    projectiles.forEach((p) => {
      let mesh = this.projMeshes.get(p);
      if (!mesh) {
        mesh = this.createProjectileMesh(p);
        this.projMeshes.set(p, mesh);
        this.fxGroup.add(mesh);
      }
      const y = p.target?.kind === 'air' ? 1.3 : 0.55;
      if (p.type === 'laser') {
        const sx = toX(p.originX), sz = toZ(p.originY);
        const ex = toX(p.x), ez = toZ(p.y);
        mesh.position.set((sx + ex) / 2, y, (sz + ez) / 2);
        const len = alignYAxis(mesh, ex - sx, ez - sz);
        mesh.scale.set(1, len, 1);
      } else if (p.type === 'tesla') {
        const sx = toX(p.originX), sz = toZ(p.originY);
        const ex = toX(p.x), ez = toZ(p.y);
        mesh.position.set((sx + ex) / 2, y, (sz + ez) / 2);
        const len = alignYAxis(mesh, ex - sx, ez - sz);
        mesh.scale.set(1, len, 1);
      } else if (p.type === 'railgun' || p.type === 'machinegun' || p.type === 'aa') {
        mesh.position.set(toX(p.x), y, toZ(p.y));
        alignYAxis(mesh, p.vx, p.vy);
      } else {
        mesh.position.set(toX(p.x), y, toZ(p.y));
        alignYAxis(mesh, p.vx, p.vy);
        mesh.rotateY(this.clock * 12);
      }
    });
  }

  private createBeamEffect(e: Effect): THREE.Object3D {
    const group = new THREE.Group();
    const color2 = e.color2 ?? e.color;
    const glow = new THREE.Mesh(
      new THREE.CylinderGeometry((e.width ?? 0.08) * 2.2, (e.width ?? 0.08) * 2.2, 1, 10),
      new THREE.MeshBasicMaterial({ color: color2, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(e.width ?? 0.08, e.width ?? 0.08, 1, 8),
      new THREE.MeshBasicMaterial({ color: e.color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(glow, core);
    return group;
  }

  private createArcEffect(e: Effect): THREE.Object3D {
    const group = new THREE.Group();
    const color2 = e.color2 ?? e.color;
    const pts = e.points ?? [];
    if (pts.length >= 2) {
      const zigzag: THREE.Vector3[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const ax = toX(a.x), az = toZ(a.y);
        const bx = toX(b.x), bz = toZ(b.y);
        const segments = 7;
        for (let s = 0; s < segments; s++) {
          const t = s / segments;
          const jitter = s === 0 ? 0 : (Math.random() - 0.5) * 0.34;
          zigzag.push(new THREE.Vector3(
            ax + (bx - ax) * t + jitter,
            e.z + (Math.random() - 0.5) * 0.16,
            az + (bz - az) * t + jitter,
          ));
        }
      }
      const last = pts[pts.length - 1];
      zigzag.push(new THREE.Vector3(toX(last.x), e.z, toZ(last.y)));
      const curve = new THREE.CatmullRomCurve3(zigzag);
      const geometry = new THREE.TubeGeometry(curve, Math.min(120, zigzag.length * 4), e.width ?? 0.05, 6, false);
      group.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: color2, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })));
      const coreGeometry = new THREE.TubeGeometry(curve, Math.min(120, zigzag.length * 4), (e.width ?? 0.05) * 0.4, 5, false);
      group.add(new THREE.Mesh(coreGeometry, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })));
    }
    return group;
  }

  private createFlashEffect(e: Effect): THREE.Group {
    const group = new THREE.Group();
    const additive = (color: string, opacity: number) => new THREE.MeshBasicMaterial({
      color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), additive('#ffffff', 1));
    core.userData.baseOpacity = 1;
    group.add(core);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), additive(e.color, 0.5));
    halo.userData.baseOpacity = 0.5;
    group.add(halo);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.95, 6), additive(i % 2 ? e.color : '#ffffff', 0.75));
      spike.rotation.z = -a;
      spike.position.set(Math.cos(a) * 0.58, Math.sin(a) * 0.58, 0);
      spike.userData.baseOpacity = 0.75;
      group.add(spike);
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 6, 28), additive(e.color, 0.7));
    ring.rotation.x = Math.PI / 2;
    ring.userData.baseOpacity = 0.7;
    group.add(ring);
    return group;
  }

  private createRingEffect(e: Effect): THREE.Group {
    const group = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const opacity = 0.8 - i * 0.2;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.76 + i * 0.05, 0.85 + i * 0.05, 44),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? '#ffffff' : e.color, transparent: true, opacity,
          side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = i * 0.006;
      ring.userData.delay = i * 0.1;
      ring.userData.baseOpacity = opacity;
      group.add(ring);
    }
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const sparkMat = new THREE.MeshBasicMaterial({
        color: e.color, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const spark = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.024), sparkMat);
      spark.position.set(Math.cos(a) * 0.9, 0.014, Math.sin(a) * 0.9);
      spark.rotation.y = -a;
      spark.userData.delay = 0.06;
      spark.userData.baseOpacity = 0.6;
      group.add(spark);
    }
    return group;
  }

  private syncEffects(effects: Effect[]) {
    const alive = this.aliveEffects;
    alive.clear();
    for (const e of effects) alive.add(e);
    for (const [e, mesh] of this.effectMeshes) {
      if (!alive.has(e)) {
        this.fxGroup.remove(mesh);
        disposeObject(mesh);
        this.effectMeshes.delete(e);
      }
    }
    effects.forEach((e) => {
      let mesh = this.effectMeshes.get(e);
      if (!mesh) {
        if (e.kind === 'beam') mesh = this.createBeamEffect(e);
        else if (e.kind === 'arc') mesh = this.createArcEffect(e);
        else if (e.kind === 'flash') mesh = this.createFlashEffect(e);
        else mesh = this.createRingEffect(e);
        this.effectMeshes.set(e, mesh);
        this.fxGroup.add(mesh);
      }
      const k = 1 - e.life / e.maxLife;
      if (e.kind === 'beam') {
        const pts = e.points ?? [];
        if (pts.length >= 2) {
          const sx = toX(pts[0].x), sz = toZ(pts[0].y);
          const ex = toX(pts[1].x), ez = toZ(pts[1].y);
          const dx = ex - sx, dz = ez - sz;
          mesh.position.set((sx + ex) / 2, e.z, (sz + ez) / 2);
          const len = alignYAxis(mesh, dx, dz);
          mesh.scale.set(1, len * (1 - k * 0.15), 1);
        }
        mesh.traverse((child) => {
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
          if (m) m.opacity = Math.max(0, 1 - k) * (m.color.getHexString() === 'ffffff' ? 1 : 0.45);
        });
      } else if (e.kind === 'arc') {
        mesh.visible = Math.sin(k * Math.PI * 9) > -0.4;
        mesh.traverse((child) => {
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
          if (m) m.opacity = (m.color.getHexString() === 'ffffff' ? 1 : 0.5) * (1 - k * 0.4);
        });
      } else if (e.kind === 'flash') {
        const r = Math.max(0.05, (e.r + (e.maxR - e.r) * k) / TILE * 0.5);
        mesh.position.set(toX(e.x), e.z, toZ(e.y));
        mesh.scale.setScalar(r * (0.5 + k * 0.7));
        mesh.rotation.y = k * 0.6;
        mesh.traverse((child) => {
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
          const base = child.userData.baseOpacity as number | undefined;
          if (m && base !== undefined) m.opacity = base * (1 - k) * (1 - k * 0.25);
        });
      } else {
        const r = (e.r + (e.maxR - e.r) * k) / TILE;
        mesh.position.set(toX(e.x), 0.09, toZ(e.y));
        mesh.scale.setScalar(Math.max(0.05, r));
        mesh.rotation.y = k * 0.4;
        mesh.traverse((child) => {
          const delay = (child.userData.delay as number | undefined) ?? 0;
          const kk = Math.max(0, (k - delay) / (1 - delay));
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
          const base = child.userData.baseOpacity as number | undefined;
          if (m && base !== undefined) m.opacity = base * (1 - kk);
          child.scale.setScalar(1 + kk * 0.14);
        });
      }
    });
  }

  private createSmokeMesh(p: Particle): THREE.Object3D {
    const group = new THREE.Group();
    const blobs = 5;
    for (let i = 0; i < blobs; i++) {
      const a = (i / blobs) * Math.PI * 2 + Math.random() * 0.7;
      const dist = 0.28 + Math.random() * 0.42;
      const s = 0.45 + Math.random() * 0.45;
      const blob = new THREE.Mesh(
        new THREE.SphereGeometry(1, 7, 5),
        new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.5, depthWrite: false }),
      );
      blob.position.set(Math.cos(a) * dist, (Math.random() - 0.5) * 0.35, Math.sin(a) * dist);
      blob.scale.set(s, s * (0.7 + Math.random() * 0.5), s);
      blob.userData.baseOpacity = 0.34 + Math.random() * 0.18;
      group.add(blob);
    }
    return group;
  }

  private syncParticles(particles: Particle[]) {
    const alive = this.aliveParticles;
    alive.clear();
    for (const p of particles) alive.add(p);
    for (const [p, mesh] of this.particleMeshes) {
      if (!alive.has(p)) {
        this.fxGroup.remove(mesh);
        disposeObject(mesh);
        this.particleMeshes.delete(p);
      }
    }
    particles.forEach((p) => {
      let mesh = this.particleMeshes.get(p);
      if (!mesh) {
        mesh = p.smoke
          ? this.createSmokeMesh(p)
          : new THREE.Mesh(
            new THREE.SphereGeometry(1, 6, 4),
            new THREE.MeshBasicMaterial({ color: p.color, transparent: true, depthWrite: false }),
          );
        this.particleMeshes.set(p, mesh);
        this.fxGroup.add(mesh);
      }
      const k = Math.max(0, p.life / p.maxLife);
      mesh.position.set(toX(p.x), p.z, toZ(p.y));
      if (p.smoke) {
        mesh.scale.setScalar(p.size * (1 + (1 - k) * 0.5));
        mesh.traverse((child) => {
          const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
          const base = child.userData.baseOpacity as number | undefined;
          if (m && base !== undefined) m.opacity = base * k * k;
        });
      } else {
        mesh.scale.setScalar(p.size * k);
        ((mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = k;
      }
    });
  }

  private syncHelpers(state: RenderState) {
    const occupied = new Set(state.towers.map((t) => `${t.tx},${t.ty}`));
    let cx = 0, cz = 0, radius = 0, color = '#ffffff';
    this.hoverMesh.visible = false;

    if (state.buildType && state.hoverTile) {
      const [tx, ty] = state.hoverTile;
      const cfg = TOWER_CONFIG[state.buildType];
      cx = tileX(tx); cz = tileZ(ty);
      radius = toWorldRange(cfg.range);
      const ok = tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS
        && !state.pathTiles.has(`${tx},${ty}`) && !occupied.has(`${tx},${ty}`) && state.gold >= cfg.cost;
      color = ok ? '#9fe09f' : '#e78a7a';
      this.hoverMesh.visible = true;
      this.hoverMesh.position.set(cx, 0.06, cz);
      (this.hoverMesh.material as THREE.MeshBasicMaterial).color.set(color);
    } else if (state.selected) {
      cx = tileX(state.selected.tx);
      cz = tileZ(state.selected.ty);
      radius = toWorldRange(state.selected.range);
      color = '#ffffff';
    }

    this.rangeMesh.visible = radius > 0;
    if (radius > 0) {
      this.rangeMesh.position.set(cx, 0.07, cz);
      this.rangeMesh.scale.setScalar(radius);
      (this.rangeMesh.material as THREE.MeshBasicMaterial).color.set(color);
    }
  }

  render(state: RenderState) {
    this.clock = performance.now() / 1000;
    this.syncTowers(state.towers);
    this.syncMines(state.mines);
    this.syncEnemies(state.enemies);
    this.syncProjectiles(state.projectiles);
    this.syncEffects(state.effects);
    this.syncParticles(state.particles);
    this.syncHelpers(state);
    this.waterMat.emissiveIntensity = 0.12 + 0.08 * Math.sin(this.clock * 2.2);
    if (this.waterTex) this.waterTex.offset.y = (this.clock * 0.012) % 1;
    if (this.waterNormalTex) {
      this.waterNormalTex.offset.y = (this.clock * 0.03) % 1;
      this.waterNormalTex.offset.x = (this.clock * 0.008) % 1;
    }
    this.ripples.forEach(({ mesh, phase }) => {
      const k = (this.clock * 0.55 + phase / (Math.PI * 2)) % 1;
      mesh.scale.setScalar(0.6 + k * 1.5);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k);
    });
    if (this.cameraShake > 0 || this.cinematicT > 0) {
      this.cameraShake *= 0.84;
      if (this.cameraShake < 0.002) this.cameraShake = 0;
      this.cinematicT = Math.max(0, this.cinematicT - 1 / 60);
      this.updateCamera();
    }
    this.weather.update();
    this.updateFlag();
    this.composer.render();
  }

  /** 大本营旗帜：顶点级正弦波，贴杆一端固定、旗尾摆幅递增，双层波叠加出布料飘动感 */
  private updateFlag() {
    const flag = this.flag;
    const base = this.flagBasePos;
    if (!flag || !base) return;
    const geo = flag.geometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = this.clock;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = base[i];
      const by = base[i + 1];
      const k = (bx + 0.2) / 0.4; // 离杆距离归一化：0=贴杆固定，1=旗尾最大摆幅
      arr[i] = bx;
      arr[i + 1] = by + Math.sin(t * 5.6 + bx * 9) * 0.02 * k;
      arr[i + 2] = Math.sin(t * 4.2 + bx * 7 - by * 3) * 0.085 * k;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }
}
