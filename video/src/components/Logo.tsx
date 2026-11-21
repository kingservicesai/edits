import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { EASE, prog } from "../lib/anim";

const IW = 724;
const IH = 739;
const SRC = "brand/logo_keyed.png";

const Layer: React.FC<{ clip: string; style?: React.CSSProperties; mask?: string }> = ({ clip, style, mask }) => (
  <div style={{ position: "absolute", inset: 0, clipPath: clip, WebkitMaskImage: mask, maskImage: mask, ...style }}>
    <Img src={staticFile(SRC)} style={{ width: "100%", height: "100%", display: "block" }} />
  </div>
);

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/**
 * Cinematic logo build using the real logo artwork, split into layers:
 * arc sweep → tricolor bars rise → stars twinkle → MAYOR / DE SILLAS / VENEZUELA C.A wipe → gold shine.
 * `at` is the local start frame. Total build ≈ 70 frames.
 */
export const LogoReveal: React.FC<{ at: number; width: number; speed?: number; shineAt?: number; style?: React.CSSProperties }> = ({
  at,
  width,
  speed = 1,
  shineAt,
  style,
}) => {
  const f = (useCurrentFrame() - at) * speed;
  const h = (width * IH) / IW;
  const arc = prog(f, 0, 34, EASE.inOut);
  const bars = prog(f, 6, 26, EASE.out);
  const barsY = (1 - bars) * 40;
  const mayor = prog(f, 26, 22, EASE.out);
  const sillas = prog(f, 34, 22, EASE.out);
  const vzla = prog(f, 44, 22, EASE.out);
  const shineT = prog(f, shineAt !== undefined ? shineAt : 58, 40, EASE.inOut);
  const pop = interpolate(f, [6, 30, 40], [0.92, 1.015, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // geometry (image coords)
  const barTop = 50;
  const barBottom = 465;
  const arcClip = `polygon(0% 0%, 100% 0%, 100% ${pct(barBottom, IH)}, ${pct(588, IW)} ${pct(barBottom, IH)}, ${pct(588, IW)} ${pct(barTop, IH)}, ${pct(142, IW)} ${pct(barTop, IH)}, ${pct(142, IW)} ${pct(barBottom, IH)}, 0% ${pct(barBottom, IH)})`;
  const arcMask = `conic-gradient(from 248deg at 50% 58%, #000 0deg, #000 ${arc * 230}deg, transparent ${arc * 230 + 0.5}deg)`;
  const barsRevealTop = barBottom - (barBottom - barTop + 20) * bars;
  const barsClip = `polygon(${pct(142, IW)} ${pct(barsRevealTop, IH)}, ${pct(588, IW)} ${pct(barsRevealTop, IH)}, ${pct(588, IW)} ${pct(barBottom, IH)}, ${pct(142, IW)} ${pct(barBottom, IH)})`;
  const band = (y0: number, y1: number, p: number, mode: "lr" | "center") => {
    if (mode === "lr") return `polygon(0% ${pct(y0, IH)}, ${p * 100}% ${pct(y0, IH)}, ${p * 100}% ${pct(y1, IH)}, 0% ${pct(y1, IH)})`;
    const l = 50 - p * 50;
    const r = 50 + p * 50;
    return `polygon(${l}% ${pct(y0, IH)}, ${r}% ${pct(y0, IH)}, ${r}% ${pct(y1, IH)}, ${l}% ${pct(y1, IH)})`;
  };

  // star twinkles (image coords of the 8 stars)
  const stars = [
    [297, 156], [307, 133], [322, 114], [340, 100], [361, 90], [383, 85], [407, 83], [409, 83],
  ];

  return (
    <div style={{ position: "relative", width, height: h, transform: `scale(${pop})`, ...style }}>
      {/* arc */}
      <Layer clip={arcClip} mask={arcMask} />
      {/* bars + chair */}
      <Layer clip={barsClip} style={{ transform: `translateY(${(barsY * width) / IW}px)` }} />
      {/* MAYOR */}
      <Layer clip={band(465, 592, mayor, "lr")} style={{ transform: `translateY(${(1 - mayor) * 18}px)`, opacity: mayor }} />
      {/* DE SILLAS */}
      <Layer clip={band(592, 672, sillas, "lr")} style={{ transform: `translateY(${(1 - sillas) * 14}px)`, opacity: sillas }} />
      {/* VENEZUELA C.A */}
      <Layer clip={band(672, 739, vzla, "center")} style={{ opacity: vzla }} />
      {/* stars sparkle */}
      {stars.slice(0, 7).map(([x, y], i) => {
        const t = prog(f, 24 + i * 2.5, 10, EASE.out);
        const o = interpolate(f, [24 + i * 2.5, 30 + i * 2.5, 44 + i * 2.5], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (x / IW) * width,
              top: (y / IH) * h,
              width: 26 * (width / IW) * (0.6 + t),
              height: 26 * (width / IW) * (0.6 + t),
              transform: "translate(-50%,-50%) rotate(45deg)",
              background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)",
              opacity: o,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
      {/* gold shine restricted to logo pixels */}
      {shineT > 0 && shineT < 1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: `url(${staticFile(SRC)})`,
            maskImage: `url(${staticFile(SRC)})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${shineT * 140 - 30}%, rgba(255,250,225,0.85) ${shineT * 140 - 15}%, rgba(255,255,255,0) ${shineT * 140}%)`,
            mixBlendMode: "screen",
          }}
        />
      )}
    </div>
  );
};

/** Static logo (keyed) */
export const Logo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <Img src={staticFile(SRC)} style={{ width, height: (width * IH) / IW, display: "block", ...style }} />
);

/** White circular badge version for dark backgrounds */
export const LogoBadge: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img
    src={staticFile("brand/logo_badge.png")}
    style={{ width: size, height: size, display: "block", borderRadius: "50%", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", ...style }}
  />
);
