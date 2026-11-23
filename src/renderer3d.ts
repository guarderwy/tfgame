import * as THREE from 'three';
import { BASE_TILE, COLS, ROWS, TILE, TOWER_CONFIG } from './config';
import type { DecoKind, LevelTheme, Point, TowerType } from './types';
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
const alignYAxis = (obj: THREE.Object3D, dx: number, dz: number) => {
  const len = Math.hypot(dx, dz) || 0.001;
  obj.quaternion.setFromUnitVectors(UP, new THREE.Vector3(dx / len, 0, dz / len));
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
  return color;
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
  obj.traverse((child) => {
    const m = child as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const material = (m as any).material;
    if (Array.isArray(material)) material.forEach((x) => x.dispose());
    else if (material) material.dispose();
  });
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
  private projMeshes = new Map<Projectile, THREE.Object3D>();
  private effectMeshes = new Map<Effect, THREE.Object3D>();
  private particleMeshes = new Map<Particle, THREE.Mesh>();
  private ripples: { mesh: THREE.Mesh; phase: number }[] = [];

  private rangeMesh: THREE.Mesh;
  private hoverMesh: THREE.Mesh;
  private clock = 0;
  private zoom = 1;
  private cameraAngle = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene.background = new THREE.Color('#1a2418');
    this.scene.fog = new THREE.Fog('#1a2418', 30, 70);

    this.updateCamera();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.hemi = new THREE.HemisphereLight(0xcfe0b8, 0x28331f, 1.05);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffe9c4, 1.15);
    this.sun.position.set(12, 22, 10);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -18;
    this.sun.shadow.camera.right = 18;
    this.sun.shadow.camera.top = 14;
    this.sun.shadow.camera.bottom = -14;
    this.scene.add(this.sun);

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

    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoomBy(e.deltaY > 0 ? 1.09 : 0.91);
    }, { passive: false });
    this.resize();
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
    this.camera.position.set(
      Math.sin(this.cameraAngle) * horizontal,
      18 * this.zoom,
      Math.cos(this.cameraAngle) * horizontal,
    );
    this.camera.lookAt(0, 0, 0);
  }

  private resize() {
    const w = this.canvas.clientWidth || 960;
    const h = this.canvas.clientHeight || 600;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
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
    this.groundMat.color.set('#ffffff');
    this.groundMat.needsUpdate = true;
    if (this.waterTex) this.waterTex.dispose();
    if (this.roadTex) this.roadTex.dispose();
    this.waterTex = waterTexture(theme.water);
    this.roadTex = roadTexture(theme);
    this.waterMat.map = this.waterTex;
    this.waterMat.color.set('#ffffff');
    this.waterMat.emissive.set(theme.water).multiplyScalar(0.3);
    this.waterMat.needsUpdate = true;
    this.hemi.intensity = theme.ambient;
    this.hemi.color.set(theme.night ? '#8ba1bd' : '#cfe0b8');
    this.hemi.groundColor.set(theme.night ? '#131a1c' : '#28331f');
    this.sun.intensity = theme.sun;
    this.sun.color.set(theme.night ? '#a9c2e0' : '#ffe9c4');

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
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.24), mat('#e0b34d', { side: THREE.DoubleSide }));
    flag.position.set(0.61, 1.06, -0.4);
    base.add(platform, block, roof, pole, flag);
    if (theme.night) {
      const lamp = new THREE.PointLight(0xffc98a, 2.2, 11);
      lamp.position.set(0, 1.6, 0);
      base.add(lamp);
    }
    base.position.set(tileX(BASE_TILE[0]), 0, tileZ(BASE_TILE[1]));
    this.staticGroup.add(base);
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

  private createMineLayerMesh(color: string): THREE.Group {
    const g = new THREE.Group();
    const steel = mat('#4a545c', { metalness: 0.55, roughness: 0.5 });
    const dark = mat('#242c33', { metalness: 0.4, roughness: 0.6 });
    const warn = mat('#e9b23c');
    const glow = mat(color, { emissive: new THREE.Color(color), emissiveIntensity: 0.9 });

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

    const pips: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const pip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mat('#fff1c8'));
      pip.position.set(-0.14 + i * 0.14, 0.46, 0.16);
      g.add(pip);
      pips.push(pip);
    }
    g.userData = { pivot, pips };
    return g;
  }

  private createTower(t: Tower): THREE.Group {
    const cfg = TOWER_CONFIG[t.type];
    if (t.type === 'mine') return this.createMineLayerMesh(cfg.color);
    const g = new THREE.Group();
    const base = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.25, 12), mat('#2b3327')));
    base.position.y = 0.15;
    const turret = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.3, 0.52), mat(cfg.color)));
    turret.position.y = 0.39;
    const pivot = new THREE.Group();
    pivot.position.y = 0.4;
    const barrelLen = t.type === 'railgun' ? 1.1 : t.type === 'howitzer' ? 0.85 : t.type === 'flak' ? 0.62 : 0.7;
    const barrel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, barrelLen, 8), mat('#3a3a32')));
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = barrelLen * 0.52;
    if (t.type === 'howitzer') {
      const muzzle = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 8), mat(cfg.color)));
      muzzle.rotation.x = Math.PI / 2;
      muzzle.position.z = barrelLen;
      pivot.add(muzzle);
    }
    if (t.type === 'flak') {
      [-0.18, 0.18].forEach((x) => {
        const side = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, barrelLen * 0.85, 6), mat('#3a3a32')));
        side.rotation.x = Math.PI / 2;
        side.position.set(x, 0, barrelLen * 0.44);
        pivot.add(side);
      });
    }
    if (t.type === 'railgun') {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, barrelLen * 1.15), mat(cfg.color, { emissive: new THREE.Color(cfg.color), emissiveIntensity: 0.5 }));
      [-0.16, 0.16].forEach((x) => {
        const r = rail.clone();
        r.position.set(x, 0, barrelLen * 0.55);
        pivot.add(r);
      });
    }
    if (t.type === 'laser') {
      const emitter = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), mat(cfg.color, { emissive: new THREE.Color(cfg.color), emissiveIntensity: 0.9 }));
      emitter.position.z = barrelLen * 0.92;
      pivot.add(emitter);
    }
    if (t.type === 'tesla') {
      for (let i = 0; i < 3; i++) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.19 - i * 0.03, 0.025, 6, 12), mat(cfg.color, { emissive: new THREE.Color(cfg.color), emissiveIntensity: 0.55 }));
        coil.rotation.x = Math.PI / 2;
        coil.position.set(0, 0.3 + i * 0.14, 0);
        g.add(coil);
      }
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), mat('#e6d4ff', { emissive: new THREE.Color(cfg.color), emissiveIntensity: 1 }));
      orb.position.set(0, 0.7, 0);
      g.add(orb);
    }
    pivot.add(barrel);
    g.add(base, turret, pivot);

    const pips: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const pip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mat('#fff1c8'));
      pip.position.set(-0.16 + i * 0.16, 0.29, 0.42);
      g.add(pip);
      pips.push(pip);
    }
    g.userData = { pivot, pips };
    return g;
  }

  private createEnemy(e: Enemy): THREE.Group {
    const g = new THREE.Group();
    const bodyMat = mat(e.color);
    const darkMat = mat('#2c3028');
    const glassMat = mat('#9fc0c8', { metalness: 0.4, roughness: 0.3 });
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
    if (e.boss) {
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
      g.scale.setScalar(1.18);
    }
    return g;
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
    const alive = new Set(towers);
    [...this.towerMeshes.keys()].forEach((t) => {
      if (!alive.has(t)) {
        this.entityGroup.remove(this.towerMeshes.get(t)!);
        disposeObject(this.towerMeshes.get(t)!);
        this.towerMeshes.delete(t);
      }
    });
    towers.forEach((t) => {
      let mesh = this.towerMeshes.get(t);
      if (!mesh) {
        mesh = this.createTower(t);
        this.towerMeshes.set(t, mesh);
        this.entityGroup.add(mesh);
      }
      mesh.position.set(tileX(t.tx), 0, tileZ(t.ty));
      mesh.userData.pivot.rotation.y = Math.PI / 2 - t.angle;
      mesh.userData.pips.forEach((pip: THREE.Mesh, i: number) => { pip.visible = i < t.level; });
    });
  }

  private syncMines(mines: NavalMine[]) {
    const alive = new Set(mines);
    [...this.mineMeshes.keys()].forEach((m) => {
      if (!alive.has(m)) {
        this.entityGroup.remove(this.mineMeshes.get(m)!);
        disposeObject(this.mineMeshes.get(m)!);
        this.mineMeshes.delete(m);
      }
    });
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
    const alive = new Set(enemies);
    const spinQ = new THREE.Quaternion();
    const spinAxis = new THREE.Vector3(0, 1, 0);
    [...this.enemyMeshes.keys()].forEach((e) => {
      if (!alive.has(e)) {
        this.entityGroup.remove(this.enemyMeshes.get(e)!);
        disposeObject(this.enemyMeshes.get(e)!);
        this.enemyMeshes.delete(e);
        const bar = this.barMeshes.get(e);
        if (bar) { this.fxGroup.remove(bar); disposeObject(bar); this.barMeshes.delete(e); }
      }
    });
    enemies.forEach((e) => {
      let mesh = this.enemyMeshes.get(e);
      if (!mesh) {
        mesh = this.createEnemy(e);
        this.enemyMeshes.set(e, mesh);
        this.entityGroup.add(mesh);
        const bar = this.createBar(e.boss);
        this.barMeshes.set(e, bar);
        this.fxGroup.add(bar);
      }
      const baseY = e.type === 'submarine' ? -0.12
        : e.type === 'bomber' ? 1.6 : e.type === 'helicopter' ? 1.35
        : e.kind === 'air' ? 1.25 : e.type === 'ship' || e.type === 'destroyer' ? 0.08 : 0;
      const bob = e.type === 'infantry' ? Math.sin(this.clock * 9 + e.id) * 0.035
        : e.kind === 'air' ? Math.sin(this.clock * 3 + e.id) * 0.04 : 0;
      mesh.position.set(toX(e.x), baseY + bob, toZ(e.y));
      mesh.rotation.y = Math.PI / 2 - e.angle;
      if (mesh.userData.wheels) {
        spinQ.setFromAxisAngle(spinAxis, e.traveled * 2.2);
        (mesh.userData.wheels as THREE.Mesh[]).forEach((wheel) => {
          wheel.quaternion.copy(wheel.userData.baseQuat).multiply(spinQ);
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
    if (p.type === 'laser') {
      const group = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, 1, 8),
        new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      const glow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, 1, 10),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      );
      group.add(glow, core);
      return group;
    }
    if (p.type === 'tesla') {
      const group = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1, 6),
        new THREE.MeshBasicMaterial({ color: '#ffffff', blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      const halo = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 1, 6),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      group.add(halo, core);
      return group;
    }
    if (p.type === 'railgun') {
      const group = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.04, 0.24, 4, 8),
        new THREE.MeshBasicMaterial({ color: '#ffffff', blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      const glow = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.1, 0.3, 4, 8),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      group.add(glow, core);
      return group;
    }
    if (p.type === 'machinegun' || p.type === 'aa') {
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.035, 0.16, 4, 6),
        new THREE.MeshBasicMaterial({ color: '#fff4cc', blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      return mesh;
    }
    const radius = p.type === 'coastal' ? 0.15 : p.type === 'flak' ? 0.14 : 0.12;
    const group = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 10, 8),
      new THREE.MeshBasicMaterial({ color }),
    );
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.6, 8, 6),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(halo, shell);
    return group;
  }

  private syncProjectiles(projectiles: Projectile[]) {
    const alive = new Set(projectiles);
    [...this.projMeshes.keys()].forEach((p) => {
      if (!alive.has(p)) {
        this.fxGroup.remove(this.projMeshes.get(p)!);
        disposeObject(this.projMeshes.get(p)!);
        this.projMeshes.delete(p);
      }
    });
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
        mesh.rotation.x += 0.2;
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

  private syncEffects(effects: Effect[]) {
    const alive = new Set(effects);
    [...this.effectMeshes.keys()].forEach((e) => {
      if (!alive.has(e)) {
        this.fxGroup.remove(this.effectMeshes.get(e)!);
        disposeObject(this.effectMeshes.get(e)!);
        this.effectMeshes.delete(e);
      }
    });
    effects.forEach((e) => {
      let mesh = this.effectMeshes.get(e);
      if (!mesh) {
        if (e.kind === 'beam') mesh = this.createBeamEffect(e);
        else if (e.kind === 'arc') mesh = this.createArcEffect(e);
        else if (e.kind === 'flash') {
          mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 12, 8),
            new THREE.MeshBasicMaterial({ color: e.color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
          );
        } else {
          mesh = new THREE.Mesh(
            new THREE.RingGeometry(0.82, 1, 28),
            new THREE.MeshBasicMaterial({ color: e.color, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }),
          );
          mesh.rotation.x = -Math.PI / 2;
        }
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
        mesh.scale.setScalar(r * (0.4 + k * 0.6));
        (mesh as THREE.Mesh).material && (((mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - k));
      } else {
        const r = (e.r + (e.maxR - e.r) * k) / TILE;
        mesh.position.set(toX(e.x), 0.09, toZ(e.y));
        mesh.scale.setScalar(Math.max(0.05, r));
        ((mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - k);
      }
    });
  }

  private syncParticles(particles: Particle[]) {
    const alive = new Set(particles);
    [...this.particleMeshes.keys()].forEach((p) => {
      if (!alive.has(p)) {
        this.fxGroup.remove(this.particleMeshes.get(p)!);
        disposeObject(this.particleMeshes.get(p)!);
        this.particleMeshes.delete(p);
      }
    });
    particles.forEach((p) => {
      let mesh = this.particleMeshes.get(p);
      if (!mesh) {
        mesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 6, 4),
          new THREE.MeshBasicMaterial({ color: p.color, transparent: true, depthWrite: false }),
        );
        this.particleMeshes.set(p, mesh);
        this.fxGroup.add(mesh);
      }
      const k = Math.max(0, p.life / p.maxLife);
      mesh.position.set(toX(p.x), p.z, toZ(p.y));
      mesh.scale.setScalar(p.size * k);
      (mesh.material as THREE.MeshBasicMaterial).opacity = k;
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
    this.ripples.forEach(({ mesh, phase }) => {
      const k = (this.clock * 0.55 + phase / (Math.PI * 2)) % 1;
      mesh.scale.setScalar(0.6 + k * 1.5);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k);
    });
    this.renderer.render(this.scene, this.camera);
  }
}
