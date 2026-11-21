import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Check, X, AlertTriangle } from "lucide-react";
import { C, F as FONT, SHADOW } from "../theme";
import { EASE, prog } from "../lib/anim";
import { CHAR, CharKey } from "./motion";

/** Quote caption for a character line (used when a character speaks over UI) */
export const Quote: React.FC<{ who: CharKey | "clienta" | "empleado" | "sucursal" | "asistente"; text: string; at: number; end: number; dark?: boolean; pos?: "bottom" | "top" }> = ({ who, text, at, end, dark, pos = "bottom" }) => {
  const f = useCurrentFrame();
  if (f < at - 6 || f > end + 14) return null;
  const p = prog(f, at - 6, 14, EASE.back);
  const o = 1 - prog(f, end + 2, 12, EASE.in);
  const info =
    who in CHAR
      ? { n: CHAR[who as CharKey].name, r: CHAR[who as CharKey].role, c: CHAR[who as CharKey].color }
      : who === "clienta"
        ? { n: "Clienta", r: "María Rodríguez", c: "#7C3AED" }
        : who === "empleado"
          ? { n: "Encargado", r: "Almacén · Sucursal Norte", c: "#0F766E" }
          : who === "sucursal"
            ? { n: "Sucursal Sur", r: "Por teléfono", c: C.red }
            : { n: "Asistente IA", r: "Mayor de Sillas", c: C.navy };
  // words reveal progressively
  const words = text.split(" ");
  const shownW = Math.ceil(words.length * prog(f, at, Math.max(6, end - at - 6), (t) => t));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: pos === "bottom" ? "flex-end" : "flex-start", padding: pos === "bottom" ? "0 0 70px" : "70px 0 0", pointerEvents: "none" }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 22, maxWidth: 1400, padding: "20px 34px 20px 20px", borderRadius: 30,
          background: dark ? "rgba(10,16,34,0.82)" : "rgba(255,255,255,0.96)", border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(14,27,61,0.08)",
          boxShadow: SHADOW.deep, backdropFilter: "blur(12px)", transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p) * o,
        }}
      >
        <div style={{ width: 70, height: 70, borderRadius: 35, background: info.c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.ui, fontWeight: 800, fontSize: 28, flexShrink: 0 }}>
          {info.n[0]}
        </div>
        <div>
          <div style={{ fontFamily: FONT.ui, fontSize: 18, fontWeight: 700, color: dark ? "rgba(255,255,255,0.7)" : C.text2, letterSpacing: 1 }}>
            {info.n.toUpperCase()} · <span style={{ fontWeight: 500 }}>{info.r}</span>
          </div>
          <div style={{ fontFamily: FONT.ui, fontSize: 34, fontWeight: 600, color: dark ? "#fff" : C.navy, marginTop: 4, lineHeight: 1.25 }}>
            “{words.map((w, i) => (
              <span key={i} style={{ opacity: i < shownW ? 1 : 0.18 }}>{w}{i < words.length - 1 ? " " : ""}</span>
            ))}”
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Floating notification toast */
export const Toast: React.FC<{ at: number; out?: number; title: string; sub?: string; icon?: React.ReactNode; color?: string; x?: number; y?: number; width?: number }> = ({ at, out, title, sub, icon, color = C.green, x = 1340, y = 60, width = 520 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 14, EASE.back);
  const o = out !== undefined ? 1 - prog(f, out, 10, EASE.in) : 1;
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, transform: `translateY(${(1 - p) * -30}px) scale(${0.92 + 0.08 * p})`, opacity: Math.min(1, p) * o, zIndex: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 22, background: "rgba(255,255,255,0.97)", boxShadow: SHADOW.deep, fontFamily: FONT.ui, border: "1px solid rgba(14,27,61,0.06)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon ?? <Check size={30} color="#fff" strokeWidth={3} />}</div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontSize: 23, fontWeight: 800, color: C.navy }}>{title}</div>
          {sub && <div style={{ fontSize: 18, color: C.text2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

/** Big headline kinetic line used over footage/dark backgrounds */
export const Headline: React.FC<{ at: number; out?: number; text: string; size?: number; color?: string; accent?: string; accentWord?: string; align?: "center" | "left"; style?: React.CSSProperties }> = ({
  at, out, text, size = 92, color = "#fff", accent = C.red2, accentWord, align = "center", style,
}) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - prog(f, out, 10, EASE.in) : 1;
  if (f < at || o <= 0) return null;
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, rowGap: 0, fontFamily: FONT.display, fontWeight: 900, fontSize: size, letterSpacing: -size * 0.02, lineHeight: 1.04, opacity: o, ...style }}>
      {words.map((w, i) => {
        const p = prog(f, at + i * 3, 14, EASE.out);
        const isA = accentWord && w.toLowerCase().includes(accentWord.toLowerCase());
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.08 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)`, color: isA ? accent : color }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Red "unverified" stamp */
export const Stamp: React.FC<{ at: number; text: string; color?: string; icon?: "x" | "warn"; rot?: number; size?: number }> = ({ at, text, color = C.red, icon = "x", rot = -8, size = 64 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const sc = interpolate(f, [at, at + 5, at + 10], [2, 0.94, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 30px", border: `6px solid ${color}`, borderRadius: 18, color, fontFamily: FONT.display, fontWeight: 900, fontSize: size, transform: `rotate(${rot}deg) scale(${sc})`, opacity: prog(f, at, 4), background: "rgba(255,255,255,0.08)", letterSpacing: 2 }}>
      {icon === "x" ? <X size={size} strokeWidth={4} /> : <AlertTriangle size={size} strokeWidth={3} />}
      {text}
    </div>
  );
};

/** Clock badge showing time slipping */
export const TimeBadge: React.FC<{ at: number; from: number; to: number; dur: number; label?: string; style?: React.CSSProperties }> = ({ at, from, to, dur, label = "min", style }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const v = Math.round(from + (to - from) * prog(f, at, dur, (t) => t));
  const a = (f - at) * 24;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 22px 12px 12px", borderRadius: 999, background: "rgba(214,40,40,0.92)", color: "#fff", fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, boxShadow: "0 16px 40px rgba(214,40,40,0.35)", opacity: prog(f, at, 8), ...style }}>
      <svg width={48} height={48} viewBox="0 0 48 48">
        <circle cx={24} cy={24} r={20} stroke="#fff" strokeWidth={4} fill="none" />
        <line x1={24} y1={24} x2={24} y2={10} stroke="#fff" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a} 24 24)`} />
        <line x1={24} y1={24} x2={33} y2={24} stroke="#fff" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a / 12} 24 24)`} />
      </svg>
      +{v} {label}
    </div>
  );
};
