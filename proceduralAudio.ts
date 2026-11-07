// Procedural Web Audio Music Synthesizer & Sound Effects Engine
// Produces an original "Magical Fantasy Adventure – Pulau Ilmu" soundtrack
// without any external MP3 file dependencies!

export type MusicState = 'playing' | 'paused' | 'stopped';

class ProceduralAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65; // User chosen volume (0.0 to 1.0)
  private musicState: MusicState = 'stopped';
  private isDucked: boolean = false; // Ducking during Text-to-Speech

  // Master Gain & Sub-Gains
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Background River Ambience
  private noiseSource: AudioBufferSourceNode | null = null;

  // Musical Loop Clock & Sequencing
  private musicIntervalId: number | null = null;
  private stepIndex: number = 0;
  private chordIndex: number = 0;

  // State change listeners for UI reactivity
  private listeners: Set<() => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music sub-gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Ambient stream sub-gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // SFX sub-gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.initRiverAmbience();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState(): {
    state: MusicState;
    isMuted: boolean;
    volume: number;
    isDucked: boolean;
  } {
    return {
      state: this.musicState,
      isMuted: this.isMuted,
      volume: this.volume,
      isDucked: this.isDucked,
    };
  }

  // Set master volume (0.0 to 1.0)
  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    this.updateGains();
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    this.updateGains();
    this.notify();
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.initContext();
    this.isMuted = muted;
    this.updateGains();
    this.notify();
  }

  // Smooth audio ducking when Text-to-Speech is speaking
  public duckAudio(isDucked: boolean) {
    this.isDucked = isDucked;
    this.updateGains();
    this.notify();
  }

  private updateGains() {
    if (!this.ctx || !this.masterGain || !this.musicGain) return;
    const now = this.ctx.currentTime;

    if (this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.15);
      return;
    }

    // Duck music to ~15% if TTS is speaking
    const targetMaster = this.volume;
    const targetMusic = this.isDucked ? 0.15 : 0.55;

    this.masterGain.gain.setTargetAtTime(targetMaster, now, 0.2);
    this.musicGain.gain.setTargetAtTime(targetMusic, now, 0.3);
  }

  // ==========================================
  // ORIGINAL PROCEDURAL SOUNDTRACK GENERATOR
  // "Magical Fantasy Adventure – Pulau Ilmu"
  // ==========================================
  public startMusic() {
    this.initContext();
    if (!this.ctx) return;

    if (this.musicState === 'playing') return;

    this.musicState = 'playing';
    this.updateGains();

    // Start 16th-note procedural sequencer at ~108 BPM (138ms per 16th note)
    const stepTimeMs = 138;
    this.stepIndex = 0;
    this.chordIndex = 0;

    if (this.musicIntervalId) {
      window.clearInterval(this.musicIntervalId);
    }

    this.musicIntervalId = window.setInterval(() => {
      this.tickSequencer();
    }, stepTimeMs);

    this.notify();
  }

  public pauseMusic() {
    if (this.musicState === 'playing') {
      this.musicState = 'paused';
      if (this.musicIntervalId) {
        window.clearInterval(this.musicIntervalId);
        this.musicIntervalId = null;
      }
      this.notify();
    }
  }

  public resumeMusic() {
    if (this.musicState === 'paused' || this.musicState === 'stopped') {
      this.startMusic();
    }
  }

  public stopMusic() {
    this.musicState = 'stopped';
    if (this.musicIntervalId) {
      window.clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.stepIndex = 0;
    this.chordIndex = 0;
    this.notify();
  }

  // Musical progressions in C Major / Pentatonic (cheerful, fantasy, uplifting)
  // Chords: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 / G
  private chords = [
    { root: 261.63, notes: [261.63, 329.63, 392.0, 493.88], bass: 130.81 }, // Cmaj7
    { root: 220.0, notes: [220.0, 261.63, 329.63, 392.0], bass: 110.0 },     // Am7
    { root: 174.61, notes: [174.61, 220.0, 261.63, 329.63], bass: 87.31 },   // Fmaj7
    { root: 196.0, notes: [196.0, 261.63, 293.66, 392.0], bass: 98.0 },      // Gsus4
  ];

  // Marimba/Music Box melody pitches in C pentatonic (G4, A4, C5, D5, E5, G5, A5)
  private melodyPitches = [
    392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5
  ];

  private tickSequencer() {
    if (!this.ctx || this.musicState !== 'playing' || this.isMuted) return;

    const stepInBar = this.stepIndex % 16;
    if (stepInBar === 0) {
      this.chordIndex = Math.floor(this.stepIndex / 16) % this.chords.length;
      // Play warm synth chord pad at bar start
      this.playSynthPad(this.chords[this.chordIndex].notes);
      // Play bass note on downbeat
      this.playBassNote(this.chords[this.chordIndex].bass);
    } else if (stepInBar === 8) {
      // Secondary bass pulse on beat 3
      this.playBassNote(this.chords[this.chordIndex].bass * 1.5); // Fifth
    }

    // Play light percussion shaker on every 2nd 16th note
    if (stepInBar % 2 === 0) {
      this.playShaker(stepInBar % 4 === 2 ? 0.05 : 0.025);
    }

    // Play gentle marimba/music box arpeggio melody
    // Patterned rhythm for lively adventure vibe
    const melodySteps = [0, 2, 4, 6, 7, 10, 12, 14];
    if (melodySteps.includes(stepInBar)) {
      const currentChord = this.chords[this.chordIndex];
      // Pick a note from chord harmony with occasional pentatonic sparkle
      const isSparkle = (this.stepIndex % 3 === 0);
      const note = isSparkle
        ? this.melodyPitches[(this.stepIndex * 2) % this.melodyPitches.length]
        : currentChord.notes[(this.stepIndex / 2) % currentChord.notes.length] * 2;

      this.playMarimba(note, 0.12);
    }

    // Occasional magic wind chime glissando on bar 4
    if (this.chordIndex === 3 && stepInBar === 12) {
      this.playChime(783.99); // G5
      setTimeout(() => this.playChime(1046.5), 100); // C6
    }

    this.stepIndex++;
    if (this.stepIndex >= 64) {
      this.stepIndex = 0; // Loop 4 bars
    }
  }

  // 1. Soft Marimba / Music Box Synthesizer
  private playMarimba(freq: number, gainVal: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * 3.01, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc.start();
      oscHarmonic.start();
      osc.stop(this.ctx.currentTime + 0.45);
      oscHarmonic.stop(this.ctx.currentTime + 0.45);
    } catch {
      // Audio node cleanup
    }
  }

  // 2. Warm Pad Synthesizer
  private playSynthPad(notes: number[]) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const padDuration = 2.4;
      notes.forEach((freq) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.5, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + padDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start();
        osc.stop(this.ctx.currentTime + padDuration);
      });
    } catch {}
  }

  // 3. Gentle Bass Note
  private playBassNote(freq: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.7);
    } catch {}
  }

  // 4. Light Shaker Percussion
  private playShaker(gainVal: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 4500;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start();
    } catch {}
  }

  // 5. River Flow Ambient Background
  private initRiverAmbience() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 2.0;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Soft river murmur

      this.noiseSource.connect(filter);
      filter.connect(this.ambientGain);

      this.noiseSource.start();
    } catch {}
  }

  // 6. Sound Effects: Crystal Chime
  public playCrystalChime(pitchIndex = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const baseFreqs = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const freq = baseFreqs[pitchIndex % baseFreqs.length];

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.01, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.sfxGain);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 1.2);
      osc2.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      window.setTimeout(() => {
        this.playChime(freq);
      }, idx * 140);
    });
  }

  private playChime(freq: number) {
    if (!this.ctx || !this.sfxGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {}
  }
}

export const proceduralAudio = new ProceduralAudioManager();
