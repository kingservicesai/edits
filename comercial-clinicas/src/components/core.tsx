import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE, EASE_INOUT, FONT, metal } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ramp = (f: number, a: number, b: number, ease = EASE) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

/* ---------- Atmósfera ---------- */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const f = useCurrentFrame();
  const seed = f % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.85 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 40%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Haz de luz volumétrico. */
export const Beam: React.FC<{
  x: number;
  y: number;
  angle: number;
  width: number;
  length: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, angle, width, length, color = "rgba(220,232,245,1)", opacity = 0.18 }) => (
  <div
    style={{
      position: "absolute",
      left: x - width / 2,
      top: y,
      width,
      height: length,
      transformOrigin: "50% 0%",
      transform: `rotate(${angle}deg)`,
      background: `linear-gradient(180deg, ${color} 0%, rgba(0,0,0,0) 100%)`,
      clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
      filter: "blur(28px)",
      opacity,
      mixBlendMode: "screen",
    }}
  />
);

export const Particles: React.FC<{
  count?: number;
  seed?: string;
  speed?: number;
  color?: string;
  maxSize?: number;
  opacity?: number;
}> = ({ count = 70, seed = "p", speed = 1, color = "#DCE6F2", maxSize = 4, opacity = 0.6 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * width;
        const y0 = random(`${seed}y${i}`) * height;
        const z = 0.3 + random(`${seed}z${i}`) * 0.7;
        const y = (((y0 - f * speed * z * 0.9) % height) + height) % height;
        const x = x0 + Math.sin(f / 60 + i) * 12 * z;
        const s = maxSize * z;
        const tw = 0.5 + 0.5 * Math.sin(f / 9 + i * 1.7);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: color,
              opacity: opacity * z * (0.4 + 0.6 * tw),
              filter: z < 0.5 ? "blur(2px)" : undefined,
              boxShadow: `0 0 ${s * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Tipografía ---------- */

/** Línea revelada por máscara (desplazamiento + opacidad, sin rebote). */
export const RevealLine: React.FC<{
  children: React.ReactNode;
  at: number;
  out?: number;
  size: number;
  weight?: number;
  color?: string;
  tracking?: number;
  style?: React.CSSProperties;
  duration?: number;
  metallic?: boolean;
}> = ({
  children,
  at,
  out,
  size,
  weight = 700,
  color = C.white,
  tracking = -0.02,
  style,
  duration = 22,
  metallic,
}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + duration);
  const o = out !== undefined ? 1 - ramp(f, out, out + 12, EASE_INOUT) : 1;
  const blur = (1 - p) * 10 + (1 - o) * 8;
  return (
    <div style={{ overflow: "hidden", paddingBottom: size * 0.12, ...style }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: size,
          fontWeight: weight,
          letterSpacing: `${tracking}em`,
          lineHeight: 1.02,
          whiteSpace: "nowrap",
          color,
          transform: `translateY(${(1 - p) * 105}%)`,
          opacity: p * o,
          filter: `blur(${blur}px)`,
          ...(metallic
            ? {
                background: metal,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Bloque de titular centrado con varias líneas escalonadas. */
export const Headline: React.FC<{
  lines: string[];
  at: number;
  out?: number;
  size?: number;
  weight?: number;
  gap?: number;
  stagger?: number;
  color?: string;
  align?: "center" | "left";
  top?: number | string;
  tracking?: number;
  metallic?: boolean;
}> = ({
  lines,
  at,
  out,
  size = 104,
  weight = 800,
  gap = 0,
  stagger = 5,
  color,
  align = "center",
  top = "50%",
  tracking = -0.03,
  metallic,
}) => (
  <div
    style={{
      position: "absolute",
      left: 80,
      right: 80,
      top,
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align,
      gap,
    }}
  >
    {lines.map((l, i) => (
      <RevealLine
        key={i}
        at={at + i * stagger}
        out={out}
        size={size}
        weight={weight}
        color={color}
        tracking={tracking}
        metallic={metallic}
      >
        {l}
      </RevealLine>
    ))}
  </div>
);

/** Etiqueta pequeña con regla (estilo editorial). */
export const Kicker: React.FC<{ text: string; at: number; out?: number; top: number; color?: string }> = ({
  text,
  at,
  out,
  top,
  color = C.titanium,
}) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, at + 24);
  const o = out !== undefined ? 1 - ramp(f, out, out + 10) : 1;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        opacity: p * o,
      }}
    >
      <div style={{ width: 70 * p, height: 1, background: color }} />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "0.42em",
          color,
          textTransform: "uppercase",
        }}
      >
        {text}
      </div>
      <div style={{ width: 70 * p, height: 1, background: color }} />
    </div>
  );
};

/* ---------- Composición ---------- */

/** Entrada/salida de plano con fundido y desenfoque opcional. */
export const Shot: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  push?: number; // zoom lento total a lo largo del plano
  driftX?: number;
  driftY?: number;
  style?: React.CSSProperties;
}> = ({ from, to, children, fadeIn = 8, fadeOut = 8, push = 0.05, driftX = 0, driftY = 0, style }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const i = fadeIn ? ramp(f, from, from + fadeIn, EASE_INOUT) : 1;
  const o = fadeOut ? 1 - ramp(f, to - fadeOut, to, EASE_INOUT) : 1;
  const t = (f - from) / Math.max(1, to - from);
  const s = 1 + push * t;
  return (
    <AbsoluteFill
      style={{
        opacity: i * o,
        transform: `translate(${driftX * t}px, ${driftY * t}px) scale(${s})`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Marco de visor de cámara de cine (REC, timecode, guías). */
export const Viewfinder: React.FC<{ startTc?: number; opacity?: number; label?: string }> = ({
  startTc = 0,
  opacity = 1,
  label = "A-CAM  ·  35mm  ·  T1.8",
}) => {
  const f = useCurrentFrame();
  const fr = f + startTc;
  const tc = `00:0${Math.floor(fr / 1800) % 10}:${String(Math.floor(fr / 30) % 60).padStart(2, "0")}:${String(fr % 30).padStart(2, "0")}`;
  const corner = (s: React.CSSProperties) => (
    <div style={{ position: "absolute", width: 70, height: 70, borderColor: "rgba(255,255,255,0.75)", borderStyle: "solid", borderWidth: 0, ...s }} />
  );
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT, color: "rgba(255,255,255,0.85)" }}>
      {corner({ left: 70, top: 200, borderLeftWidth: 3, borderTopWidth: 3 })}
      {corner({ right: 70, top: 200, borderRightWidth: 3, borderTopWidth: 3 })}
      {corner({ left: 70, bottom: 260, borderLeftWidth: 3, borderBottomWidth: 3 })}
      {corner({ right: 70, bottom: 260, borderRightWidth: 3, borderBottomWidth: 3 })}
      <div style={{ position: "absolute", top: 222, left: 104, display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 600, letterSpacing: "0.12em" }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#E5484D", opacity: blink ? 1 : 0.25 }} />
        REC
      </div>
      <div style={{ position: "absolute", top: 222, right: 104, fontSize: 26, fontWeight: 500, letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums" }}>{tc}</div>
      <div style={{ position: "absolute", bottom: 282, left: 104, fontSize: 22, fontWeight: 500, letterSpacing: "0.16em", opacity: 0.75 }}>{label}</div>
      <div style={{ position: "absolute", bottom: 282, right: 104, fontSize: 22, fontWeight: 500, letterSpacing: "0.16em", opacity: 0.75 }}>4K  ·  ISO 800</div>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 40, height: 2, marginLeft: -20, background: "rgba(255,255,255,0.4)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 2, height: 40, marginTop: -20, background: "rgba(255,255,255,0.4)" }} />
    </AbsoluteFill>
  );
};

/* ---------- Dispositivos ---------- */

export const Phone: React.FC<{
  children: React.ReactNode;
  width?: number;
  x?: number;
  y?: number;
  rotate?: number;
  rotateY?: number;
  rotateX?: number;
  scale?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ children, width = 560, x = 540, y = 960, rotate = 0, rotateY = 0, rotateX = 0, scale = 1, glow = 0.35, style }) => {
  const f = useCurrentFrame();
  const h = width * 2.06;
  const sweep = ((f * 6) % 2400) - 800;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - h / 2,
        width,
        height: h,
        transform: `perspective(2400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotate}deg) scale(${scale})`,
        borderRadius: width * 0.15,
        padding: width * 0.03,
        background: "linear-gradient(135deg, #5C626B 0%, #1C1F24 30%, #9097A1 52%, #23262B 70%, #6C727B 100%)",
        boxShadow: `0 60px 140px rgba(0,0,0,0.75), 0 0 ${180 * glow}px rgba(143,188,230,${glow * 0.35})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: width * 0.125,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            top: width * 0.03,
            left: "50%",
            width: width * 0.3,
            height: width * 0.075,
            marginLeft: -width * 0.15,
            background: "#000",
            borderRadius: width * 0.05,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, rgba(255,255,255,0) ${sweep / 24}%, rgba(255,255,255,0.10) ${sweep / 24 + 6}%, rgba(255,255,255,0) ${sweep / 24 + 14}%)`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

/* ---------- Personajes a contraluz ---------- */

const BUST =
  "M500 150 C 600 150 650 220 652 330 C 668 340 672 400 650 420 C 640 480 600 545 560 565 L 562 640 C 640 680 760 700 830 740 C 880 770 900 840 905 1000 L 95 1000 C 100 840 120 770 170 740 C 240 700 360 680 438 640 L 440 565 C 400 545 360 480 350 420 C 328 400 332 340 348 330 C 350 220 400 150 500 150 Z";
const STAND =
  "M500 40 C 545 40 565 75 565 115 C 565 160 545 185 530 195 L 532 222 C 580 232 620 245 635 270 L 650 470 L 640 500 L 648 650 L 590 655 L 585 1000 L 525 1000 L 505 680 L 495 680 L 475 1000 L 415 1000 L 410 655 L 352 650 L 360 500 L 350 470 L 365 270 C 380 245 420 232 468 222 L 470 195 C 455 185 435 160 435 115 C 435 75 455 40 500 40 Z";

/**
 * Figura humana a contraluz. Concepto visual del comercial: todas las personas
 * se presentan como siluetas recortadas por luz de borde, nunca como rostros
 * sintéticos.
 */
export const Figure: React.FC<{
  x: number;
  y: number; // base de la figura
  h: number;
  coat?: boolean;
  rim?: string;
  rimSide?: "left" | "right" | "both";
  pose?: "bust" | "seated" | "standing";
  sway?: number;
  opacity?: number;
  headTilt?: number;
  phoneGlow?: number;
}> = ({ x, y, h, coat = true, rim = "#DCE8F5", rimSide = "both", pose = "bust", sway = 0, opacity = 1, headTilt = 0, phoneGlow = 0 }) => {
  const id = React.useId().replace(/:/g, "");
  const s = h / 1000;
  const rimL = rimSide !== "right" ? 1 : 0.1;
  const rimR = rimSide !== "left" ? 1 : 0.1;
  const standing = pose === "standing";
  const path = standing ? STAND : BUST;
  const off = (standing ? 7 : 11) / Math.max(0.4, Math.min(1.6, s));
  return (
    <div
      style={{
        position: "absolute",
        left: x - 500 * s,
        top: y - 1000 * s,
        width: 1000 * s,
        height: 1000 * s,
        opacity,
        transform: `rotate(${sway}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <svg viewBox="0 0 1000 1000" width="100%" height="100%" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`rim${id}`} x1="0" x2="1">
            <stop offset="0" stopColor={rim} stopOpacity={rimL} />
            <stop offset="0.16" stopColor={rim} stopOpacity={0} />
            <stop offset="0.84" stopColor={rim} stopOpacity={0} />
            <stop offset="1" stopColor={rim} stopOpacity={rimR} />
          </linearGradient>
          <linearGradient id={`fill${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0D1015" />
            <stop offset="1" stopColor="#040506" />
          </linearGradient>
          <radialGradient id={`ph${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#BFDCF7" stopOpacity="0.55" />
            <stop offset="1" stopColor="#8FBCE6" stopOpacity="0" />
          </radialGradient>
          <filter id={`soft${id}`}>
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id={`bloom${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <g transform={`rotate(${headTilt} 500 ${standing ? 220 : 620})`}>
          <clipPath id={`clip${id}`}>
            <path d={path} />
          </clipPath>
          <clipPath id={`clipL${id}`}>
            <path d={path} transform={`translate(${-off} ${off * 0.3})`} />
          </clipPath>
          {/* luz de borde: la silueta se ilumina solo en su contorno */}
          <g clipPath={`url(#clip${id})`}>
            <rect x={0} y={0} width={1000} height={1000} fill={rim} />
            <g clipPath={rimSide === "both" ? `url(#clipL${id})` : undefined}>
              <path
                d={path}
                fill={`url(#fill${id})`}
                transform={`translate(${rimSide === "left" ? off : rimSide === "right" ? -off : off} ${off * 0.3})`}
              />
            </g>
          </g>
          {/* halo */}
          <path d={path} fill="none" stroke={rim} strokeOpacity={0.22} strokeWidth={26} filter={`url(#bloom${id})`} />
          {coat && !standing && (
            <g fill="none" strokeLinecap="round" opacity={0.55}>
              {/* solapas de la bata y cuello de camisa: apenas insinuados */}
              <path d="M438 650 L 470 720 L 500 690 L 530 720 L 562 650" stroke="#4C5562" strokeWidth={6} />
              <path d="M455 700 C 430 790 400 880 370 1000" stroke={rim} strokeOpacity={0.35} strokeWidth={5} />
              <path d="M545 700 C 570 790 600 880 630 1000" stroke={rim} strokeOpacity={0.35} strokeWidth={5} />
              <path d="M500 700 L 500 1000" stroke="#2A3038" strokeWidth={4} />
            </g>
          )}
          {coat && standing && (
            <g fill="none" opacity={0.5}>
              <path d="M480 230 L 470 640" stroke={rim} strokeOpacity={0.35} strokeWidth={4} />
              <path d="M520 230 L 530 640" stroke={rim} strokeOpacity={0.35} strokeWidth={4} />
            </g>
          )}
        </g>
        {phoneGlow > 0 && (
          <g>
            <ellipse cx={500} cy={720} rx={360} ry={300} fill={`url(#ph${id})`} opacity={phoneGlow} />
            <rect x={455} y={830} width={90} height={150} rx={14} fill="#DCEBFA" opacity={0.95 * phoneGlow} />
          </g>
        )}
      </svg>
    </div>
  );
};

/* ---------- Números ---------- */

export const fmt = (n: number) => Math.round(n).toLocaleString("es-VE").replace(/,/g, ".");

export const Counter: React.FC<{
  from?: number;
  to: number;
  at: number;
  dur: number;
  size: number;
  suffix?: string;
  prefix?: string;
  weight?: number;
  metallic?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, at, dur, size, suffix = "", prefix = "", weight = 800, metallic, color = C.white, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 4) });
  const v = from + (to - from) * p;
  const appear = ramp(f, at - 6, at + 10);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: "-0.045em",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
        opacity: appear,
        color,
        ...(metallic ? { background: metal, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}),
        ...style,
      }}
    >
      {prefix}
      {fmt(v)}
      {suffix}
    </div>
  );
};

/** Pequeña leyenda legal/editorial. */
export const Legend: React.FC<{ text: string; opacity?: number; bottom?: number }> = ({ text, opacity = 0.55, bottom = 120 }) => (
  <div
    style={{
      position: "absolute",
      bottom,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: FONT,
      fontSize: 20,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: C.titanium,
      opacity,
    }}
  >
    {text}
  </div>
);

export const Bg: React.FC<{ tone?: "carbon" | "cold" | "warm"; children?: React.ReactNode }> = ({ tone = "carbon", children }) => (
  <AbsoluteFill
    style={{
      background:
        tone === "cold"
          ? "radial-gradient(ellipse 90% 60% at 50% 35%, #13202D 0%, #07090C 60%, #030405 100%)"
          : tone === "warm"
            ? "radial-gradient(ellipse 90% 60% at 50% 40%, #1E1A16 0%, #0A0908 60%, #040404 100%)"
            : "radial-gradient(ellipse 90% 60% at 50% 40%, #171A1F 0%, #08090B 60%, #030304 100%)",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Fade: React.FC<{ from: number; to: number; color?: string }> = ({ from, to, color = "#000" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, to], [0, 1], clamp);
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

export const FadeFromBlack: React.FC<{ dur?: number }> = ({ dur = 12 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, dur], [1, 0], clamp);
  return <AbsoluteFill style={{ background: "#000", opacity: o, pointerEvents: "none" }} />;
};
