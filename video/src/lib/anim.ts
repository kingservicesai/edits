import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
export const s2f = (s: number) => Math.round(s * FPS);

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  snap: Easing.bezier(0.2, 0.9, 0.1, 1),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};

/** 0..1 progress between [start, start+dur] with easing (clamped). */
export const prog = (frame: number, start: number, dur: number, ease = EASE.out) =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const spr = (
  frame: number,
  delay = 0,
  cfg: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping: cfg.damping ?? 18, stiffness: cfg.stiffness ?? 140, mass: cfg.mass ?? 0.9 },
  });

/** in/out envelope: fades in over inDur at `start`, out over outDur ending at `end`. */
export const env = (frame: number, start: number, end: number, inDur = 10, outDur = 10) => {
  const a = prog(frame, start, inDur, EASE.out);
  const b = 1 - prog(frame, end - outDur, outDur, EASE.in);
  return Math.min(a, b);
};

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** deterministic pseudo random */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const fmtUSD = (v: number, dec = 2) =>
  "$" + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
/** Venezuelan/European style used on the dashboard screenshots: $48.250 */
export const fmtDot = (v: number) => "$" + Math.round(v).toLocaleString("de-DE");
export const fmtInt = (v: number) => Math.round(v).toLocaleString("de-DE");
