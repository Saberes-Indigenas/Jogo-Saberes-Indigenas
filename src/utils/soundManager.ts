import { Howl, Howler } from "howler";
import ambientSound from "../assets/sounds/ambient/ambient_sound.mp3";

type SoundType =
  | "click"
  | "dragStart"
  | "dragEnd"
  | "success"
  | "error"
  | "feather"
  | "roundComplete"
  | "gameOver"
  | "ambient";

class SoundManager {
  private muted: boolean = false;
  private globalVolume: number = 0.8;
  private howls: Record<Exclude<SoundType, "ambient">, any> = {} as any;
  private ambientHowl: any = null;
  private audioCtx: AudioContext | null = null;

  // Apenas o som ambiente é um arquivo real. Os outros usam sintetizadores via código.
  private soundPaths: Record<SoundType, string[]> = {
    click: [],
    dragStart: [],
    dragEnd: [],
    success: [],
    error: [],
    feather: [],
    roundComplete: [],
    gameOver: [],
    ambient: [ambientSound],
  };

  constructor() {
    // Desbloquear o Howler no primeiro clique do usuário
    const unlock = () => {
      if (!this.muted) {
        this.startAmbient();
      }
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);

    // Carregar estado de mute do localStorage
    const savedMuted = localStorage.getItem("jogo_saberes_muted");
    this.muted = savedMuted === "true";

    // Carregar volume do localStorage
    const savedVolume = localStorage.getItem("jogo_saberes_volume");
    this.globalVolume = savedVolume ? parseFloat(savedVolume) : 0.8;
    Howler.volume(this.globalVolume);

    // Inicializar os objetos Howl
    this.createAllHowls();
  }

  private createAllHowls() {
    this.howls = {
      click: this.createHowl("click"),
      dragStart: this.createHowl("dragStart"),
      dragEnd: this.createHowl("dragEnd"),
      success: this.createHowl("success"),
      error: this.createHowl("error"),
      feather: this.createHowl("feather"),
      roundComplete: this.createHowl("roundComplete"),
      gameOver: this.createHowl("gameOver"),
    };

    this.ambientHowl = this.createHowl("ambient", true);
  }

  private createHowl(type: SoundType, loop: boolean = false): any {
    const paths = this.soundPaths[type];
    if (paths.length === 0) return null;

    return new Howl({
      src: paths,
      html5: type === "ambient",
      loop: loop,
      volume: type === "ambient" ? 1.0 : 0.8,
      onload: () => {
        if (type === "ambient") console.log("[SoundManager] Ambient sound loaded successfully.");
      },
      onloaderror: (_id: any, err: any) => {
        console.warn(`[SoundManager] Aviso ao carregar "${type}" (pode ser ignorado se for sintetizado):`, err);
      },
      onplayerror: (id: any, err: any) => {
        // Ignora erros de autoplay (comum em navegadores modernos antes do primeiro clique)
        console.warn(`[SoundManager] Aguardando interação do usuário para tocar "${type}".`);
        const targetHowl = type === "ambient" ? this.ambientHowl : this.howls[type as Exclude<SoundType, "ambient">];
        targetHowl?.once('unlock', () => {
          targetHowl?.play(id);
        });
      }
    });
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem("jogo_saberes_muted", String(muted));

    if (muted) {
      if (this.ambientHowl) this.ambientHowl.pause();
    } else {
      if (this.ambientHowl && !this.ambientHowl.playing()) {
        this.ambientHowl.play();
      }
    }
  }

  public getVolume(): number {
    return this.globalVolume;
  }

  public setVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("jogo_saberes_volume", String(this.globalVolume));
    Howler.volume(this.globalVolume);

    if (this.globalVolume > 0 && this.muted) {
      this.setMuted(false);
    } else if (this.globalVolume === 0 && !this.muted) {
      this.setMuted(true);
    }
  }

  private playSound(type: Exclude<SoundType, "ambient">, synthFallback: () => void) {
    if (this.muted) return;

    const howl = this.howls[type];
    if (howl && howl.state() === "loaded") {
      try {
        howl.play();
      } catch (e) {
        synthFallback();
      }
    } else {
      synthFallback();
    }
  }

  /* =========================================================================
     SINTETIZADOR FALLBACK (Web Audio API)
     ========================================================================= */

  private synthClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.12 * this.globalVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.globalVolume, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  private synthDragStart() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08 * this.globalVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.globalVolume, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  private synthDragEnd() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.06 * this.globalVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.globalVolume, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  private synthSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const playNote = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(vol * this.globalVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.005 * this.globalVolume, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    playNote(523.25, now, 0.35, 0.15); // C5
    playNote(659.25, now + 0.06, 0.35, 0.15); // E5
    playNote(783.99, now + 0.12, 0.45, 0.20); // G5
  }

  private synthError() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.25);
    gain.gain.setValueAtTime(0.2 * this.globalVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01 * this.globalVolume, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  private synthFeather() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      gain.gain.setValueAtTime(0.12 * this.globalVolume, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.005 * this.globalVolume, now + index * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.45);
    });
  }

  private synthRoundComplete() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const chords = [392.00, 523.25, 659.25, 783.99];
    chords.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.005, now + 0.6);
      gain.gain.setValueAtTime(0.08 * this.globalVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001 * this.globalVolume, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  private synthGameOver() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = index % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + index * 0.12);
      gain.gain.setValueAtTime(0.1 * this.globalVolume, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001 * this.globalVolume, now + index * 0.12 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.95);
    });
  }

  public playClick() { this.playSound("click", () => this.synthClick()); }
  public playDragStart() { this.playSound("dragStart", () => this.synthDragStart()); }
  public playDragEnd() { this.playSound("dragEnd", () => this.synthDragEnd()); }
  public playSuccess() { this.playSound("success", () => this.synthSuccess()); }
  public playError() { this.playSound("error", () => this.synthError()); }
  public playFeather() { this.playSound("feather", () => this.synthFeather()); }
  public playRoundComplete() { this.playSound("roundComplete", () => this.synthRoundComplete()); }
  public playGameOver() { this.playSound("gameOver", () => this.synthGameOver()); }

  public startAmbient() {
    if (this.muted) return;
    if (this.ambientHowl) {
      if (!this.ambientHowl.playing()) {
        try {
          this.ambientHowl.play();
        } catch (e) {
          console.error("[SoundManager] Erro ao tentar tocar ambient:", e);
        }
      }
    }
  }

  public stopAmbient() {
    if (this.ambientHowl && this.ambientHowl.playing()) {
      this.ambientHowl.pause();
    }
  }
}

export const soundManager = new SoundManager();
