import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { Phone, PhoneOff, Check, ShoppingCart, Warehouse, Building2, Signal, Wifi, BatteryFull, ChevronLeft, CheckCheck } from "lucide-react";
import { C, F, SHADOW } from "../theme";
import { EASE, prog, rnd } from "../lib/anim";
import { FlagBar } from "./base";

/* ───────────────────────── Cursor ───────────────────────── */
export type CK = { f: number; x: number; y: number; click?: boolean };

export const Cursor: React.FC<{ keys: CK[]; show?: [number, number]; scale?: number }> = ({ keys, show, scale = 1 }) => {
  const f = useCurrentFrame();
  if (show && (f < show[0] || f > show[1])) return null;
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f >= a.f && f <= b.f) {
      const t = interpolate(f, [a.f, b.f], [0, 1], { easing: EASE.inOut });
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
      break;
    }
    if (f > b.f) {
      x = b.x;
      y = b.y;
    }
  }
  let press = 0;
  let ripple: { p: number } | null = null;
  for (const k of keys) {
    if (!k.click) continue;
    const d = f - k.f;
    if (d >= -3 && d <= 5) press = Math.max(press, 1 - Math.abs(d - 1) / 4);
    if (d >= 0 && d <= 16) ripple = { p: d / 16 };
  }
  const op = show ? Math.min(prog(f, show[0], 6), 1 - prog(f, show[1] - 6, 6)) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 50, opacity: op, pointerEvents: "none" }}>
      {ripple && (
        <div
          style={{
            position: "absolute", left: -30 * (0.4 + ripple.p), top: -30 * (0.4 + ripple.p), width: 60 * (0.4 + ripple.p), height: 60 * (0.4 + ripple.p),
            borderRadius: "50%", border: `3px solid rgba(214,40,40,${0.7 * (1 - ripple.p)})`, background: `rgba(214,40,40,${0.12 * (1 - ripple.p)})`,
          }}
        />
      )}
      <svg width={34 * scale} height={34 * scale} viewBox="0 0 24 24" style={{ transform: `scale(${1 - press * 0.15})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.35))" }}>
        <path d="M4 2 L4 19 L8.5 14.8 L11.6 21.5 L14.4 20.2 L11.4 13.6 L17.6 13.6 Z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Helper to know if cursor pressed at frame (for button press feedback) */
export const pressAt = (f: number, at: number) => {
  const d = f - at;
  return d >= -2 && d <= 6 ? 1 - Math.abs(d - 1) / 5 : 0;
};

/* ───────────────────────── Phone + Chat ───────────────────────── */

export const PhoneFrame: React.FC<{ children: React.ReactNode; width?: number; height?: number; style?: React.CSSProperties; dark?: boolean }> = ({
  children, width = 400, height = 820, style, dark,
}) => (
  <div
    style={{
      width, height, borderRadius: 56, background: "#0B0F1A", padding: 12, boxSizing: "border-box",
      boxShadow: "0 40px 90px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(255,255,255,0.08)", position: "relative", ...style,
    }}
  >
    <div style={{ width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: dark ? "#0F172A" : "#EEF1F6", position: "relative", fontFamily: F.ui }}>
      <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontSize: 16, fontWeight: 700, color: dark ? "#fff" : "#111" }}>
        <span>9:41</span>
        <div style={{ position: "absolute", left: "50%", top: 10, transform: "translateX(-50%)", width: 110, height: 30, borderRadius: 20, background: "#0B0F1A" }} />
        <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Signal size={16} />
          <Wifi size={16} />
          <BatteryFull size={18} />
        </span>
      </div>
      {children}
    </div>
  </div>
);

export type Msg = { at: number; side: "in" | "out"; text?: string; receipt?: boolean; time?: string; typingFrom?: number };

export const ReceiptCard: React.FC<{ amount: string; bank: string; date: string; ref?: string; width?: number }> = ({ amount, bank, date, ref = "Ref. 0045 8921 3307", width = 250 }) => (
  <div style={{ width, background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #E5E7EB", fontFamily: F.ui }}>
    <div style={{ background: "#0E3B8C", color: "#fff", padding: "10px 14px", fontSize: 13, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
      <span>{bank}</span>
      <span style={{ opacity: 0.8 }}>Comprobante</span>
    </div>
    <div style={{ padding: "14px 14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.green, fontWeight: 700, fontSize: 14 }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={13} color="#fff" strokeWidth={3} />
        </div>
        Transferencia enviada
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#0E1B3D", margin: "10px 0 6px" }}>{amount}</div>
      <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
        {date}
        <br />
        {ref}
      </div>
    </div>
  </div>
);

export const ChatThread: React.FC<{ name: string; status?: string; msgs: Msg[]; avatarColor?: string; receipt?: { amount: string; bank: string; date: string } }> = ({
  name, status = "en línea", msgs, avatarColor = C.red, receipt,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 46px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 14px", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <ChevronLeft size={24} color="#1D4ED8" />
        <div style={{ width: 42, height: 42, borderRadius: 21, background: avatarColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
          {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 21, color: "#111" }}>{name}</div>
          <div style={{ fontSize: 13, color: "#16A34A" }}>{status}</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>
        {msgs.map((m, i) => {
          const typing = m.typingFrom !== undefined && f >= m.typingFrom && f < m.at;
          const p = prog(f, m.at, 12, EASE.back);
          if (!typing && f < m.at) return null;
          const out = m.side === "out";
          return (
            <div key={i} style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start" }}>
              {typing ? (
                <div style={{ background: "#fff", borderRadius: 18, padding: "14px 18px", display: "flex", gap: 6 }}>
                  {[0, 1, 2].map((d) => (
                    <div key={d} style={{ width: 9, height: 9, borderRadius: 5, background: "#9CA3AF", opacity: 0.4 + 0.6 * Math.max(0, Math.sin((f - d * 4) / 4)) }} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    maxWidth: "80%", transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: out ? "100% 100%" : "0% 100%", opacity: Math.min(1, p * 1.5),
                    background: out ? "#1D4ED8" : "#fff", color: out ? "#fff" : "#111", borderRadius: 18,
                    borderBottomRightRadius: out ? 6 : 18, borderBottomLeftRadius: out ? 18 : 6, padding: m.receipt ? 6 : "11px 15px",
                    fontSize: 21, lineHeight: 1.3, boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
                  }}
                >
                  {m.receipt && receipt ? <ReceiptCard {...receipt} width={290} /> : m.text}
                  <div style={{ fontSize: 11, opacity: 0.65, textAlign: "right", marginTop: 4, padding: m.receipt ? "0 6px 2px" : 0, display: "flex", justifyContent: "flex-end", gap: 4, alignItems: "center" }}>
                    {m.time ?? "10:2" + (i % 10)}
                    {out && <CheckCheck size={13} />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ───────────────────────── Voice-reactive waveform ───────────────────────── */

export const VoiceBars: React.FC<{ src: string; startFrame: number; bars?: number; color?: string; height?: number; width?: number; gap?: number }> = ({
  src, startFrame, bars = 28, color = "#fff", height = 60, width = 6, gap = 5,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = useAudioData(staticFile(src));
  const local = f - startFrame;
  let vals: number[] = new Array(bars).fill(0);
  if (data && local >= 0 && local < data.durationInSeconds * fps) {
    const v = visualizeAudio({ fps, frame: local, audioData: data, numberOfSamples: 64, smoothing: true });
    vals = new Array(bars).fill(0).map((_, i) => {
      const idx = Math.min(v.length - 1, Math.floor((Math.abs(i - bars / 2) / (bars / 2)) * 24) + 1);
      return Math.min(1, Math.sqrt(v[idx]) * 2.4);
    });
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap, height }}>
      {vals.map((v, i) => (
        <div key={i} style={{ width, height: Math.max(width, v * height), borderRadius: width, background: color, opacity: 0.55 + 0.45 * v }} />
      ))}
    </div>
  );
};

/** Fake idle waveform (no audio) */
export const IdleBars: React.FC<{ bars?: number; color?: string; height?: number; amp?: number }> = ({ bars = 28, color = "#fff", height = 60, amp = 0.25 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, height }}>
      {new Array(bars).fill(0).map((_, i) => {
        const v = amp * (0.4 + 0.6 * Math.abs(Math.sin(f / 5 + i * 0.7) * Math.cos(f / 9 + i * 0.3)));
        return <div key={i} style={{ width: 6, height: Math.max(6, v * height), borderRadius: 6, background: color, opacity: 0.6 }} />;
      })}
    </div>
  );
};

/* ───────────────────────── Phone call card ───────────────────────── */

export const CallCard: React.FC<{
  name: string; sub: string; state: "ringing" | "active" | "ended"; voice?: { src: string; start: number }; style?: React.CSSProperties; color?: string; icon?: React.ReactNode;
}> = ({ name, sub, state, voice, style, color = C.vzBlue, icon }) => {
  const f = useCurrentFrame();
  const shake = state === "ringing" ? Math.sin(f * 1.9) * 3 * (Math.floor(f / 12) % 2) : 0;
  return (
    <div
      style={{
        width: 560, borderRadius: 30, background: "rgba(14,20,40,0.92)", color: "#fff", padding: "26px 28px", fontFamily: F.ui,
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)", transform: `rotate(${shake * 0.3}deg) translateX(${shake}px)`, ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ position: "relative" }}>
          {state === "ringing" && (
            <div style={{ position: "absolute", inset: -((f % 24) / 24) * 16, borderRadius: "50%", border: `2px solid rgba(255,255,255,${0.5 * (1 - (f % 24) / 24)})` }} />
          )}
          <div style={{ width: 72, height: 72, borderRadius: 36, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon ?? <Phone size={32} color="#fff" />}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{name}</div>
          <div style={{ fontSize: 18, opacity: 0.7 }}>{state === "ringing" ? "Llamada entrante…" : state === "active" ? sub : "Llamada finalizada"}</div>
        </div>
        {state === "ringing" ? (
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 58, height: 58, borderRadius: 29, background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhoneOff size={26} color="#fff" />
            </div>
            <div style={{ width: 58, height: 58, borderRadius: 29, background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Phone size={26} color="#fff" />
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: F.mono, fontSize: 18, opacity: 0.7 }}>00:{String(Math.max(0, Math.floor((f % 3000) / 30) % 60)).padStart(2, "0")}</div>
        )}
      </div>
      {state === "active" && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          {voice ? <VoiceBars src={voice.src} startFrame={voice.start} bars={34} height={54} /> : <IdleBars bars={34} height={54} />}
        </div>
      )}
    </div>
  );
};

/* ───────────────────────── Spreadsheet chaos ───────────────────────── */

export const Spreadsheet: React.FC<{ name: string; width?: number; rows?: number; cols?: number; seed?: number; errors?: number[]; style?: React.CSSProperties; highlight?: number }> = ({
  name, width = 640, rows = 11, cols = 6, seed = 1, errors = [], style, highlight,
}) => {
  const f = useCurrentFrame();
  const colW = (width - 46) / cols;
  const heads = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const words = ["Silla Ejec.", "Mesa Ofic.", "Silla Visit.", "Ergonómica", "Presidente", "Silla Ofic.", "Banqueta", "Escritorio"];
  return (
    <div style={{ width, background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.45)", fontFamily: F.ui, ...style }}>
      <div style={{ height: 40, background: "#1E7145", color: "#fff", display: "flex", alignItems: "center", padding: "0 14px", gap: 10, fontSize: 15, fontWeight: 600 }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: "#fff", color: "#1E7145", fontWeight: 900, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>X</div>
        {name}
        <span style={{ marginLeft: "auto", opacity: 0.7, fontSize: 13 }}>Guardado: hace 3 días</span>
      </div>
      <div style={{ display: "flex", background: "#F3F4F6", borderBottom: "1px solid #D1D5DB", height: 26, fontSize: 13, color: "#6B7280" }}>
        <div style={{ width: 46 }} />
        {new Array(cols).fill(0).map((_, c) => (
          <div key={c} style={{ width: colW, textAlign: "center", lineHeight: "26px", borderLeft: "1px solid #E5E7EB" }}>{heads[c]}</div>
        ))}
      </div>
      {new Array(rows).fill(0).map((_, r) => (
        <div key={r} style={{ display: "flex", height: 30, borderBottom: "1px solid #EEF0F3", fontSize: 14, background: highlight === r ? "#FEF3C7" : undefined }}>
          <div style={{ width: 46, textAlign: "center", lineHeight: "30px", background: "#F9FAFB", color: "#9CA3AF", fontSize: 12 }}>{r + 1}</div>
          {new Array(cols).fill(0).map((_, c) => {
            const k = r * cols + c;
            const isErr = errors.includes(k);
            const v = c === 0 ? words[(r + seed) % words.length] : c === cols - 1 ? (rnd(k + seed) > 0.7 ? "¿?" : Math.floor(rnd(k * 3 + seed) * 90 + 5).toString()) : `$${Math.floor(rnd(k * 7 + seed) * 900 + 60)}`;
            const flick = isErr && Math.floor(f / 6) % 2 === 0;
            return (
              <div
                key={c}
                style={{
                  width: colW, padding: "0 8px", lineHeight: "30px", borderLeft: "1px solid #F1F2F4", whiteSpace: "nowrap", overflow: "hidden",
                  textAlign: c === 0 ? "left" : "right", color: isErr ? "#B91C1C" : "#374151", background: isErr ? (flick ? "#FEE2E2" : "#FECACA") : undefined, fontWeight: isErr ? 700 : 400,
                }}
              >
                {isErr ? (k % 2 ? "#¡REF!" : "#N/A") : v}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ───────────────────────── Character card ───────────────────────── */

export const CHAR = {
  andrea: { name: "Andrea", role: "Vendedora", place: "Sucursal Centro", color: C.red, Icon: ShoppingCart },
  carlos: { name: "Carlos", role: "Gerente", place: "Sucursal Norte", color: C.vzBlue, Icon: Warehouse },
  jose: { name: "José", role: "Dueño", place: "Mayor de Sillas Venezuela C.A.", color: C.gold, Icon: Building2 },
} as const;
export type CharKey = keyof typeof CHAR;

export const CharacterChip: React.FC<{ who: CharKey; size?: number; dark?: boolean; style?: React.CSSProperties }> = ({ who, size = 1, dark, style }) => {
  const c = CHAR[who];
  const I = c.Icon;
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 18 * size, padding: `${14 * size}px ${30 * size}px ${14 * size}px ${14 * size}px`,
        borderRadius: 999, background: dark ? "rgba(255,255,255,0.08)" : "#fff", border: dark ? "1px solid rgba(255,255,255,0.14)" : `1px solid ${C.line}`,
        boxShadow: dark ? "none" : SHADOW.float, fontFamily: F.ui, backdropFilter: dark ? "blur(10px)" : undefined, ...style,
      }}
    >
      <div style={{ width: 64 * size, height: 64 * size, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${4 * size}px ${dark ? "rgba(255,255,255,0.12)" : "#fff"}` }}>
        <I size={30 * size} color="#fff" strokeWidth={2} />
      </div>
      <div style={{ lineHeight: 1.15, whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 30 * size, fontWeight: 800, color: dark ? "#fff" : C.text }}>{c.name}</div>
        <div style={{ fontSize: 18 * size, color: dark ? "rgba(255,255,255,0.7)" : C.text2, fontWeight: 500 }}>
          {c.role} · {c.place}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── Chapter title ───────────────────────── */

export const ChapterTitle: React.FC<{ at: number; end: number; num: string; kicker: string; title: string; who: CharKey }> = ({ at, end, num, kicker, title, who }) => {
  const f = useCurrentFrame();
  const inP = prog(f, at, 16, EASE.inOut);
  const outP = prog(f, end - 12, 12, EASE.in);
  if (f < at || f > end + 2) return null;
  const c = CHAR[who];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* panel wipe */}
      <AbsoluteFill
        style={{
          background: C.navy,
          clipPath: `polygon(0% 0%, ${inP * 120}% 0%, ${inP * 120 - 20}% 100%, 0% 100%)`,
          transform: `translateX(${outP * 110}%)`,
        }}
      >
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 80% 120%, ${c.color}55 0%, transparent 60%)` }} />
        <AbsoluteFill style={{ padding: "0 160px", justifyContent: "center", fontFamily: F.display }}>
          <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
            <div
              style={{
                fontSize: 300, fontWeight: 900, lineHeight: 0.8, color: "transparent", WebkitTextStroke: "3px rgba(255,255,255,0.22)",
                transform: `translateY(${(1 - prog(f, at + 4, 22, EASE.out)) * 80}px)`, opacity: prog(f, at + 4, 14),
              }}
            >
              {num}
            </div>
            <div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 26, letterSpacing: 10, color: c.color === C.gold ? C.gold2 : c.color === C.vzBlue ? "#8FB0FF" : "#FF8A8A", transform: `translateY(${(1 - prog(f, at + 8, 18, EASE.out)) * 100}%)` }}>
                  {kicker}
                </div>
              </div>
              <div style={{ overflow: "hidden", marginTop: 14 }}>
                <div style={{ fontSize: 92, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1, transform: `translateY(${(1 - prog(f, at + 12, 22, EASE.out)) * 110}%)` }}>{title}</div>
              </div>
              <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 30 }}>
                <FlagBar w={180} h={7} p={prog(f, at + 18, 20, EASE.out)} />
                <div style={{ opacity: prog(f, at + 22, 14), transform: `translateX(${(1 - prog(f, at + 22, 20, EASE.out)) * 30}px)` }}>
                  <CharacterChip who={who} dark size={0.9} />
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────────────────── Stamp lines (on-screen text) ───────────────────────── */

export const StampLines: React.FC<{ at: number; lines: string[]; gap?: number; dark?: boolean; end?: number }> = ({ at, lines, gap = 14, dark = false, end }) => {
  const f = useCurrentFrame();
  const outP = end !== undefined ? prog(f, end - 10, 10, EASE.in) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - outP }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
        {lines.map((l, i) => {
          const st = at + i * gap;
          const p = prog(f, st, 10, EASE.snap);
          const sc = interpolate(f, [st, st + 5, st + 11], [1.6, 0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const cp = prog(f, st + 6, 10, EASE.back);
          return (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `scale(${sc})`, transformOrigin: "left center" }}>
              <div style={{ width: 74, height: 74, borderRadius: 20, background: [C.yellow, C.vzBlue, C.red][i % 3], display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${cp})` }}>
                <Check size={44} color="#fff" strokeWidth={3.4} />
              </div>
              <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 88, letterSpacing: -1.5, color: dark ? "#fff" : C.navy, lineHeight: 1 }}>{l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
