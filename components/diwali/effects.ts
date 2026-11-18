import type { Options } from "canvas-confetti";

export const PALETTE = ["#ffcf5a", "#ff9a2e", "#ff4d3d", "#ff5fa2", "#a55bff"];

async function fire(opts: Options) {
  const { default: confetti } = await import("canvas-confetti");
  confetti({ colors: PALETTE, zIndex: 100, disableForReducedMotion: true, ...opts });
}

/** Big burst from both bottom sides, used once when Diwali mode starts. */
export function celebrate() {
  void fire({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0, y: 0.6 } });
  void fire({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1, y: 0.6 } });
}

/** Small burst at a screen position (diya lit, button tapped). */
export function smallBurst(x: number, y: number) {
  void fire({
    particleCount: 36, spread: 60, startVelocity: 22, scalar: 0.7, ticks: 120,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
  });
}

/* ---- tiny synth sounds. Never autoplay: callers only use these when the user turned Sound on ---- */
let ac: AudioContext | null = null;
function audio() {
  if (!ac) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ac = new C();
  }
  return ac;
}
export function unlockAudio() {
  try { void audio().resume(); } catch { /* audio not available */ }
}
function tone(type: OscillatorType, f0: number, f1: number, gain: number, dur: number) {
  try {
    const a = audio();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(f1, a.currentTime + dur * 0.9);
    g.gain.setValueAtTime(gain, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur + 0.05);
  } catch { /* ignore */ }
}
let lastPop = 0;
export function playPop() {
  const now = performance.now();
  if (now - lastPop < 160) return;
  lastPop = now;
  tone("triangle", 140, 40, 0.07, 0.28);
}
export function playDing() { tone("sine", 1320, 1180, 0.05, 1.1); }
