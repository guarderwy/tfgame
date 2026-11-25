import type { TowerType } from './types';

interface MusicTrack {
  name: string;
  root: number;
  bpm: number;
  bass: (number | null)[];
  lead: (number | null)[];
  bassType: OscillatorType;
  leadType: OscillatorType;
}

const TRACKS: MusicTrack[] = [
  {
    name: '前线进行曲', root: 110, bpm: 100,
    bass: [0, null, 0, null, 3, null, 5, null, 0, null, 0, null, 7, null, 5, null],
    lead: [12, null, 15, 19, null, 15, 12, null, 10, null, 12, 15, null, 19, 15, null],
    bassType: 'triangle', leadType: 'square',
  },
  {
    name: '霓虹脉冲', root: 98, bpm: 128,
    bass: [0, 0, null, 0, 7, null, 0, null, 0, 0, null, 3, 5, null, 3, null],
    lead: [12, 16, 19, 16, 12, 16, 19, 23, 22, 19, 16, 19, 15, 12, 15, 19],
    bassType: 'sawtooth', leadType: 'square',
  },
  {
    name: '深空回响', root: 82.4, bpm: 76,
    bass: [0, null, null, null, 5, null, null, null, 3, null, null, null, 7, null, null, null],
    lead: [12, null, 19, null, 15, null, 22, null, 12, null, 19, null, 17, null, 15, null],
    bassType: 'sine', leadType: 'triangle',
  },
];

export class AudioKit {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicTimer: number | null = null;
  private musicStep = 0;
  private nextNoteTime = 0;
  private currentTrack = -1;
  private ambience: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private lastHitAt = 0;
  muted = false;
  musicMuted = false;
  private disposed = false;
  private timers = new Set<number>(); // 延迟衍生的音效定时器，dispose 时统一清理

  private after(ms: number, fn: () => void) {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
  }

  private ensure(): AudioContext | null {
    if (this.disposed || typeof AudioContext === 'undefined') return null;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.ctx.destination);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.musicMuted ? 0 : 0.9;
      this.musicBus.connect(this.master);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = this.muted ? 0 : 1;
      this.sfxBus.connect(this.master);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  unlock() {
    const wasSuspended = !this.ctx || this.ctx.state === 'suspended';
    this.ensure();
    if (wasSuspended && this.currentTrack >= 0) this.playMusic(this.currentTrack);
  }

  private startAmbience() {
    const ctx = this.ensure();
    if (!ctx || !this.sfxBus || this.ambience) return;
    const len = Math.floor(ctx.sampleRate * 2);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;
    const gain = ctx.createGain();
    gain.gain.value = 0.055;
    src.connect(filter).connect(gain).connect(this.sfxBus);
    src.start();
    this.ambience = { src, gain };
  }

  private connectSfx(node: AudioNode, pan: number) {
    if (!this.ctx || !this.sfxBus) return;
    if (pan !== 0) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = Math.max(-0.9, Math.min(0.9, pan));
      node.connect(panner).connect(this.sfxBus);
    } else {
      node.connect(this.sfxBus);
    }
  }

  private musicNote(freq: number, dur: number, type: OscillatorType, gain: number, at: number) {
    if (!this.ctx || !this.musicBus) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g).connect(this.musicBus);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }

  private scheduleMusic() {
    const ctx = this.ctx;
    if (!ctx || this.currentTrack < 0 || this.musicMuted) return;
    if (this.nextNoteTime < ctx.currentTime - 0.1) this.nextNoteTime = ctx.currentTime + 0.03;
    const track = TRACKS[this.currentTrack];
    const stepDur = 60 / track.bpm / 2;
    while (this.nextNoteTime < ctx.currentTime + 0.12) {
      const step = this.musicStep % 16;
      const bass = track.bass[step];
      const lead = track.lead[step];
      if (bass !== null) this.musicNote(track.root * Math.pow(2, bass / 12), stepDur * 1.8, track.bassType, 0.28, this.nextNoteTime);
      if (lead !== null) this.musicNote(track.root * 2 * Math.pow(2, lead / 12), stepDur * 0.9, track.leadType, 0.14, this.nextNoteTime);
      this.musicStep++;
      this.nextNoteTime += stepDur;
    }
  }

  playMusic(index: number) {
    const ctx = this.ensure();
    if (!ctx) return;
    this.currentTrack = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
    this.musicStep = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;
    if (this.musicTimer !== null) window.clearInterval(this.musicTimer);
    this.musicTimer = window.setInterval(() => this.scheduleMusic(), 25);
    this.scheduleMusic();
    this.startAmbience();
  }

  stopMusic() {
    if (this.musicTimer !== null) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  playMusicForLevel(levelId: number) {
    this.playMusic(Math.floor(Math.random() * TRACKS.length));
  }

  dispose() {
    this.stopMusic();
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers.clear();
    if (this.ambience) {
      try { this.ambience.src.stop(); } catch { /* 已停止 */ }
      this.ambience = null;
    }
    this.disposed = true;
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.master = null;
    this.musicBus = null;
    this.sfxBus = null;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.sfxBus && this.ctx) this.sfxBus.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.02);
  }

  setMusicMuted(muted: boolean) {
    this.musicMuted = muted;
    if (this.musicBus && this.ctx) this.musicBus.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.03);
    if (!muted && this.currentTrack >= 0) {
      this.musicStep = 0;
      this.nextNoteTime = this.ctx ? this.ctx.currentTime + 0.05 : 0;
      this.scheduleMusic();
    }
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, slideTo?: number, pan = 0) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.sfxBus) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const t = ctx.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g);
    this.connectSfx(g, pan);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(dur: number, gain: number, cutoff: number, sweepTo?: number, pan = 0) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.sfxBus) return;
    const len = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const t = ctx.currentTime;
    filter.frequency.setValueAtTime(cutoff, t);
    if (sweepTo) filter.frequency.exponentialRampToValueAtTime(Math.max(60, sweepTo), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(g);
    this.connectSfx(g, pan);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  build() {
    this.tone(320, 0.08, 'square', 0.18);
    this.tone(480, 0.12, 'square', 0.12);
  }

  upgrade() {
    this.tone(420, 0.1, 'triangle', 0.16);
    this.tone(630, 0.14, 'triangle', 0.14);
    this.tone(840, 0.18, 'triangle', 0.1);
  }

  fire(type: TowerType, pan = 0) {
    if (type === 'machinegun' || type === 'aa') {
      this.noise(0.06, 0.12, 2600, 900, pan);
      this.tone(180, 0.05, 'square', 0.06, 90, pan);
    } else if (type === 'howitzer') {
      this.noise(0.22, 0.28, 1200, 180, pan);
      this.tone(90, 0.2, 'sine', 0.16, 45, pan);
    } else {
      this.noise(0.16, 0.24, 1500, 240, pan);
      this.tone(110, 0.16, 'sine', 0.14, 55, pan);
    }
  }

  explode(big = false, pan = 0) {
    this.noise(big ? 0.42 : 0.24, big ? 0.34 : 0.2, big ? 900 : 1400, 90, pan);
    this.tone(big ? 70 : 100, big ? 0.32 : 0.18, 'sine', 0.12, 40, pan);
  }

  hit(pan = 0) {
    const ctx = this.ensure();
    if (!ctx || this.muted || ctx.currentTime - this.lastHitAt < 0.045) return;
    this.lastHitAt = ctx.currentTime;
    this.noise(0.045, 0.07, 3200, 1200, pan);
    this.tone(760, 0.05, 'triangle', 0.045, 380, pan);
  }

  leak() {
    this.tone(220, 0.3, 'sawtooth', 0.2, 80);
    this.noise(0.25, 0.16, 700, 200);
  }

  wave() {
    this.tone(330, 0.12, 'square', 0.12);
    this.tone(440, 0.12, 'square', 0.12);
    this.tone(550, 0.2, 'square', 0.1);
  }

  /** 雷声：低频轰鸣 + 滤波噪声滚雷，与闪电闪光同步触发 */
  thunder(pan = 0) {
    this.noise(0.9, 0.22, 320, 70, pan);
    this.tone(58, 0.7, 'sine', 0.14, 32, pan);
    // 余震二次滚雷
    this.after(280, () => this.noise(0.6, 0.12, 220, 60, pan));
  }

  win() {
    [392, 494, 587, 784].forEach((f, i) => this.after(i * 130, () => this.tone(f, 0.3, 'triangle', 0.16)));
  }

  lose() {
    [330, 262, 196].forEach((f, i) => this.after(i * 180, () => this.tone(f, 0.4, 'sawtooth', 0.16)));
  }
}
