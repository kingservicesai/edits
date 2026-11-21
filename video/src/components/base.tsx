import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import clipLen from "../data/clips.json";
const CLIP_LEN = clipLen as Record<string, number>;
import { C, F as FONT } from "../theme";
import { EASE, prog, rnd } from "../lib/anim";

/* ───────────────────────── Backgrounds ───────────────────────── */

export const Grain: React.FC<{ opacity?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({
  opacity = 0.06,
  blend = "overlay",
}) => {
  const f = useCurrentFrame();
  const x = Math.floor(rnd(f * 1.3) * 512);
  const y = Math.floor(rnd(f * 2.7 + 9) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile("brand/grain.png")})`,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: blend,
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.55, color = "0,0,0" }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, rgba(${color},0) 45%, rgba(${color},${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Light, airy background used for "solution" moments – mirrors the app/landing style */
export const LightBG: React.FC<{ dots?: boolean; drift?: number }> = ({ dots = true, drift = 0 }) => {
  const f = useCurrentFrame() + drift;
  const a = Math.sin(f / 90) * 40;
  const b = Math.cos(f / 110) * 50;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -250 + a,
          top: -380 + b,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,180,0,0.16) 0%, rgba(244,180,0,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: -300 - a,
          bottom: -500 + b * 0.6,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(214,40,40,0.12) 0%, rgba(214,40,40,0) 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: 200 + b,
          top: -600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,63,154,0.10) 0%, rgba(29,63,154,0) 65%)",
        }}
      />
      {dots && (
        <AbsoluteFill
          style={{
            backgroundImage: "radial-gradient(rgba(14,27,61,0.10) 1.2px, transparent 1.4px)",
            backgroundSize: "28px 28px",
            backgroundPosition: `${(f * 0.15) % 28}px 0px`,
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/** Dark, tense background used for "problem" moments */
export const DarkBG: React.FC<{ grid?: boolean; redGlow?: number }> = ({ grid = true, redGlow = 0.35 }) => {
  const f = useCurrentFrame();
  const p = 0.5 + 0.5 * Math.sin(f / 18);
  return (
    <AbsoluteFill style={{ background: C.dark, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 70% 110%, rgba(214,40,40,${redGlow * (0.6 + 0.4 * p)}) 0%, rgba(214,40,40,0) 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 15% -10%, rgba(29,63,154,0.45) 0%, rgba(29,63,154,0) 55%)",
        }}
      />
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            backgroundPosition: `0px ${(f * 0.4) % 80}px`,
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
      )}
      <Vignette strength={0.7} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── Photo plates ───────────────────────── */

export const Photo: React.FC<{
  src: string;
  start?: number; // local frame for move start
  dur?: number;
  from?: { s: number; x: number; y: number };
  to?: { s: number; x: number; y: number };
  style?: React.CSSProperties;
  grade?: string; // css filter
  overlay?: string; // css background for overlay
  position?: string;
}> = ({ src, start = 0, dur = 150, from = { s: 1.08, x: 0, y: 0 }, to = { s: 1.0, x: 0, y: 0 }, style, grade, overlay, position = "center" }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.soft });
  const s = from.s + (to.s - from.s) * t;
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `translate(${x}px, ${y}px) scale(${s})`,
          filter: grade,
        }}
      />
      {overlay && <AbsoluteFill style={{ background: overlay }} />}
    </AbsoluteFill>
  );
};

/* ───────────────────────── Motion wrappers ───────────────────────── */

/** Generic entrance/exit wrapper. `at` & `out` are local frames. */
export const Appear: React.FC<{
  at: number;
  out?: number;
  dur?: number;
  outDur?: number;
  x?: number;
  y?: number;
  s?: number;
  blur?: number;
  rot?: number;
  ease?: (t: number) => number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
}> = ({ at, out, dur = 18, outDur = 12, x = 0, y = 24, s = 1, blur = 0, rot = 0, ease = EASE.out, style, children }) => {
  const f = useCurrentFrame();
  const pIn = prog(f, at, dur, ease);
  const pOut = out !== undefined ? prog(f, out, outDur, EASE.in) : 0;
  const op = pIn * (1 - pOut);
  if (op <= 0.001 && (f < at || (out !== undefined && f > out + outDur))) return null;
  const k = 1 - pIn;
  const tx = x * k + (out !== undefined ? -x * 0.5 * pOut : 0);
  const ty = y * k + (out !== undefined ? -y * 0.5 * pOut : 0);
  const sc = s + (1 - s) * pIn - (out !== undefined ? (1 - s) * 0.5 * pOut : 0);
  const bl = blur * k + blur * pOut;
  return (
    <div
      style={{
        opacity: op,
        transform: `translate(${tx}px, ${ty}px) scale(${sc}) rotate(${rot * k}deg)`,
        filter: bl > 0.05 ? `blur(${bl}px)` : undefined,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Words animate in one by one (optionally on explicit frames). */
export const Words: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  times?: number[]; // explicit local frames per word
  dur?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number, w: string) => React.CSSProperties;
  y?: number;
  blur?: number;
  out?: number;
}> = ({ text, at, stagger = 3, times, dur = 16, style, wordStyle, y = 40, blur = 10, out }) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const pOut = out !== undefined ? prog(f, out, 12, EASE.in) : 0;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.28em", ...style, opacity: 1 - pOut }}>
      {words.map((w, i) => {
        const st = times ? times[i] ?? times[times.length - 1] : at + i * stagger;
        const p = prog(f, st, dur, EASE.out);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * y}px)`,
              filter: p < 0.99 ? `blur(${(1 - p) * blur}px)` : undefined,
              ...(wordStyle ? wordStyle(i, w) : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Mask-wipe reveal of a single line (text slides up from a clipping box). */
export const LineReveal: React.FC<{
  at: number;
  dur?: number;
  out?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "bottom" | "top";
}> = ({ at, dur = 22, out, children, style, from = "bottom" }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, EASE.out);
  const po = out !== undefined ? prog(f, out, 14, EASE.in) : 0;
  const dir = from === "bottom" ? 1 : -1;
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 105 * dir - po * 105 * dir}%)` }}>{children}</div>
    </div>
  );
};

/** Number counter */
export const Counter: React.FC<{
  from?: number;
  to: number;
  at: number;
  dur?: number;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, at, dur = 30, format = (v) => Math.round(v).toString(), style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, EASE.out);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(from + (to - from) * p)}</span>;
};

/* ───────────────────────── Misc ───────────────────────── */

export const FlagBar: React.FC<{ w?: number; h?: number; p?: number; style?: React.CSSProperties }> = ({ w = 120, h = 6, p = 1, style }) => (
  <div style={{ display: "flex", width: w * p, height: h, borderRadius: h, overflow: "hidden", ...style }}>
    <div style={{ flex: 1, background: C.yellow }} />
    <div style={{ flex: 1, background: C.vzBlue }} />
    <div style={{ flex: 1, background: C.red }} />
  </div>
);

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.red, style }) => (
  <div
    style={{
      fontFamily: FONT.ui,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: 6,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Full-screen flash (white or color) */
export const Flash: React.FC<{ at: number; dur?: number; color?: string; max?: number }> = ({ at, dur = 14, color = "#fff", max = 1 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 3, at + dur], [0, max, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

/** Light leak sweep */
export const LightSweep: React.FC<{ at: number; dur?: number; color?: string; angle?: number }> = ({ at, dur = 30, color = "255,214,140", angle = 115 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, EASE.inOut);
  if (p <= 0 || p >= 1) return null;
  const x = -60 + p * 220;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, rgba(${color},0) ${x - 25}%, rgba(${color},0.55) ${x}%, rgba(${color},0) ${x + 25}%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

/* ───────────────────────── Video plates ───────────────────────── */
export const CLIPS: Record<string, number> = {}; // name -> length in timeline frames (filled from data)
/** Video plate that starts playing at absolute frame `from`; after the clip ends, holds its last frame (still image). */
export const Clip: React.FC<{
  name: string;
  from: number;
  dur?: number;
  zoom?: [number, number];
  grade?: string;
  overlay?: string;
  style?: React.CSSProperties;
  position?: string;
}> = ({ name, from, dur = 180, zoom = [1.0, 1.05], grade, overlay, style, position = "center" }) => {
  const f = useCurrentFrame();
  const len = CLIP_LEN[name] ?? 180;
  const t = interpolate(f, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = zoom[0] + (zoom[1] - zoom[0]) * t;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: position, transform: `scale(${s})`, filter: grade };
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      {f < from + len - 1 ? (
        <Sequence from={from} durationInFrames={len} layout="none">
          <OffthreadVideo src={staticFile(`video/${name}.mp4`)} muted style={st} />
        </Sequence>
      ) : (
        <Img src={staticFile(`video/${name}_last.jpg`)} style={st} />
      )}
      {f < from && <Img src={staticFile(`video/${name}_first.jpg`)} style={{ ...st, position: "absolute", inset: 0 }} />}
      {overlay && <AbsoluteFill style={{ background: overlay }} />}
    </AbsoluteFill>
  );
};
