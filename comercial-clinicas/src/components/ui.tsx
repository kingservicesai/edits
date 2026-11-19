import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { clamp, Figure, ramp } from "./core";

/* ------------------------------------------------------------------ */
/* Reloj de pared (time-lapse)                                         */
/* ------------------------------------------------------------------ */
export const Clock: React.FC<{ size: number; x: number; y: number; speed?: number }> = ({ size, x, y, speed = 1 }) => {
  const f = useCurrentFrame();
  const sec = Math.floor(f / 3) * 6 * speed;
  const min = f * 1.4 * speed;
  const hr = min / 12 + 290;
  const hand = (deg: number, len: number, w: number, color: string, tail = 0.12) => (
    <line
      x1={0}
      y1={len * tail}
      x2={0}
      y2={-len}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      transform={`rotate(${deg})`}
    />
  );
  return (
    <svg width={size} height={size} viewBox="-110 -110 220 220" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible" }}>
      <defs>
        <radialGradient id="ck-face" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#F4F5F6" />
          <stop offset="1" stopColor="#B9BEC4" />
        </radialGradient>
        <linearGradient id="ck-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5F7FA" />
          <stop offset="0.5" stopColor="#5E646C" />
          <stop offset="1" stopColor="#DADFE5" />
        </linearGradient>
        <filter id="ck-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.6" />
        </filter>
      </defs>
      <circle r={104} fill="url(#ck-ring)" filter="url(#ck-shadow)" />
      <circle r={96} fill="url(#ck-face)" />
      {new Array(60).fill(0).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={-88}
          x2={0}
          y2={i % 5 === 0 ? -74 : -83}
          stroke="#2A2F36"
          strokeWidth={i % 5 === 0 ? 3.2 : 1}
          transform={`rotate(${i * 6})`}
        />
      ))}
      {hand(hr, 46, 6, "#1A1D22")}
      {hand(min, 70, 4, "#1A1D22")}
      {hand(sec, 80, 1.6, "#3D7FC1", 0.25)}
      <circle r={5} fill="#1A1D22" />
      <circle r={2.2} fill="#3D7FC1" />
      <ellipse cx={-30} cy={-50} rx={70} ry={30} fill="#fff" opacity={0.18} transform="rotate(-30)" />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Agenda con espacios vacíos                                          */
/* ------------------------------------------------------------------ */
export const Agenda: React.FC<{ at: number; width?: number; x?: number; y?: number; dim?: number }> = ({
  at,
  width = 900,
  x = 540,
  y = 960,
  dim = 0,
}) => {
  const f = useCurrentFrame();
  const days = ["LUN", "MAR", "MIÉ", "JUE", "VIE"];
  const hours = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
  const booked = new Set(["0-0", "2-3", "4-1"]);
  const cw = (width - 140) / 5;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - 560,
        width,
        height: 1120,
        borderRadius: 36,
        background: "linear-gradient(180deg, rgba(28,32,38,0.92), rgba(12,14,17,0.92))",
        border: `1px solid ${C.lineStrong}`,
        boxShadow: "0 80px 160px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)",
        fontFamily: FONT,
        color: C.silver,
        padding: "48px 40px",
        opacity: 1 - dim,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>Agenda</div>
        <div style={{ fontSize: 22, letterSpacing: "0.28em", color: C.titanium }}>ESTA SEMANA</div>
      </div>
      <div style={{ display: "flex", marginLeft: 100 }}>
        {days.map((d) => (
          <div key={d} style={{ width: cw, textAlign: "center", fontSize: 22, letterSpacing: "0.2em", color: C.titanium }}>
            {d}
          </div>
        ))}
      </div>
      {hours.map((h, r) => (
        <div key={h} style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
          <div style={{ width: 100, fontSize: 22, color: C.titanium, fontVariantNumeric: "tabular-nums" }}>{h}</div>
          {days.map((_, d) => {
            const k = `${d}-${r}`;
            const isB = booked.has(k);
            const ap = ramp(f, at + (r * 5 + d) * 1.2, at + (r * 5 + d) * 1.2 + 14);
            const pulse = 0.5 + 0.5 * Math.sin((f + r * 7 + d * 11) / 10);
            return (
              <div key={k} style={{ width: cw, padding: "0 6px", opacity: ap }}>
                <div
                  style={{
                    height: 118,
                    borderRadius: 16,
                    border: isB ? "none" : `2px dashed rgba(201,206,214,${0.18 + 0.12 * pulse})`,
                    background: isB ? "linear-gradient(180deg,#3B5672,#22364B)" : "rgba(255,255,255,0.015)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    letterSpacing: "0.1em",
                    color: isB ? "#DCE8F5" : "rgba(201,206,214,0.45)",
                  }}
                >
                  {isB ? "CITA" : "LIBRE"}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Notificación que se desvanece antes de llegar                       */
/* ------------------------------------------------------------------ */
export const LostNotification: React.FC<{ at: number; y: number; title: string; sub: string }> = ({ at, y, title, sub }) => {
  const f = useCurrentFrame();
  const inP = ramp(f, at, at + 14);
  const outP = ramp(f, at + 22, at + 52);
  const blocks = 18;
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: y,
        height: 150,
        transform: `translateY(${(1 - inP) * -40}px)`,
        opacity: inP,
      }}
    >
      {/* la tarjeta se desintegra en bandas verticales */}
      {new Array(blocks).fill(0).map((_, i) => {
        const r = random(`n${at}-${i}`);
        const local = interpolate(outP, [r * 0.6, r * 0.6 + 0.4], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(i / blocks) * 100}%`,
              width: `${100 / blocks + 0.2}%`,
              overflow: "hidden",
              opacity: 1 - local,
              transform: `translateY(${-local * 60 * (0.5 + r)}px)`,
              filter: `blur(${local * 6}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                height: 150,
                left: `${-(i / blocks) * 840 * (100 / 100)}px`,
                width: 840,
                borderRadius: 32,
                background: "rgba(38,42,49,0.92)",
                border: `1px solid ${C.lineStrong}`,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 32px",
                fontFamily: FONT,
                boxSizing: "border-box",
              }}
            >
              <div style={{ width: 82, height: 82, borderRadius: 20, background: "linear-gradient(135deg,#DCE3EA,#8A939E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 34, height: 10, background: "#2A3340", borderRadius: 3, position: "absolute" }} />
                <div style={{ width: 10, height: 34, background: "#2A3340", borderRadius: 3 }} />
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 600, color: C.white }}>{title}</div>
                <div style={{ fontSize: 24, color: C.titanium, marginTop: 6 }}>{sub}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Monitor diagnóstico                                                 */
/* ------------------------------------------------------------------ */
export const MonitorScan: React.FC<{ t: number }> = ({ t }) => {
  const scan = (t * 9) % 900;
  const ecg = (() => {
    let d = "M0 60";
    for (let x = 0; x <= 900; x += 6) {
      const ph = ((x + t * 14) % 300) / 300;
      let yy = 60;
      if (ph > 0.42 && ph < 0.46) yy = 60 - (ph - 0.42) * 900;
      else if (ph >= 0.46 && ph < 0.5) yy = 24 + (ph - 0.46) * 2400;
      else if (ph >= 0.5 && ph < 0.53) yy = 120 - (ph - 0.5) * 2000;
      else if (ph > 0.65 && ph < 0.75) yy = 60 - Math.sin(((ph - 0.65) / 0.1) * Math.PI) * 10;
      d += ` L${x} ${yy}`;
    }
    return d;
  })();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #0E1A26 0%, #04070A 70%)" }}>
      <svg width={1080} height={1920}>
        <defs>
          <filter id="ct">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="7" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.9  0 0 0 0 0.95  0 0 0 1.6 -0.55" />
          </filter>
          <clipPath id="skull">
            <ellipse cx={540} cy={820} rx={330} ry={400} />
          </clipPath>
          <radialGradient id="tissue" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#5E6E7E" stopOpacity="0.55" />
            <stop offset="0.8" stopColor="#2A3542" stopOpacity="0.5" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        {/* rejilla */}
        {new Array(19).fill(0).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={1920} stroke="#8FBCE6" strokeOpacity={0.05} />
        ))}
        {new Array(33).fill(0).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 60} x2={1080} y2={i * 60} stroke="#8FBCE6" strokeOpacity={0.05} />
        ))}
        <ellipse cx={540} cy={820} rx={360} ry={430} fill="none" stroke="#E8EEF4" strokeWidth={22} opacity={0.75} filter="url(#glow)" />
        <ellipse cx={540} cy={820} rx={360} ry={430} fill="none" stroke="#F4F7FA" strokeWidth={8} opacity={0.9} />
        <ellipse cx={540} cy={820} rx={330} ry={400} fill="url(#tissue)" />
        <g clipPath="url(#skull)">
          <rect x={160} y={380} width={760} height={880} filter="url(#ct)" opacity={0.42} />
          <path d="M540 440 C 520 600 560 900 540 1210" stroke="#0A0F14" strokeWidth={10} fill="none" opacity={0.7} />
          <ellipse cx={470} cy={800} rx={40} ry={90} fill="#0A0F14" opacity={0.6} />
          <ellipse cx={610} cy={800} rx={40} ry={90} fill="#0A0F14" opacity={0.6} />
        </g>
        {/* línea de barrido */}
        <rect x={0} y={380 + (scan % 880)} width={1080} height={3} fill="#8FBCE6" opacity={0.6} />
        <rect x={0} y={380 + (scan % 880) - 60} width={1080} height={60} fill="url(#tissue)" opacity={0.15} />
        {/* HUD */}
        <g fontFamily={FONT} fill="#9DB3C8" fontSize={22} letterSpacing="3">
          <text x={90} y={300}>AXIAL · 12 / 48</text>
          <text x={990} y={300} textAnchor="end">
            W 80 · L 40
          </text>
          <text x={90} y={1340}>SERIE 3</text>
          <text x={990} y={1340} textAnchor="end">
            0.6 mm
          </text>
        </g>
        <g transform="translate(90 1420)">
          <path d={ecg} stroke="#8FBCE6" strokeWidth={3} fill="none" />
          <path d={ecg} stroke="#8FBCE6" strokeWidth={10} fill="none" opacity={0.25} filter="url(#glow)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Instrumental de precisión (plano macro)                             */
/* ------------------------------------------------------------------ */
export const Instruments: React.FC<{ t: number }> = ({ t }) => {
  const rot = -18 + t * 0.06;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, #1C2128 0%, #050608 80%)" }}>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F7F9FB" />
            <stop offset="0.35" stopColor="#8E959E" />
            <stop offset="0.55" stopColor="#E3E7EC" />
            <stop offset="1" stopColor="#3F454D" />
          </linearGradient>
          <filter id="ins-blur">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="ins-dof">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {/* superficie */}
        <rect x={0} y={1180} width={1080} height={740} fill="#0B0D10" />
        <rect x={0} y={1176} width={1080} height={4} fill="#9AA3AE" opacity={0.25} />
        {/* instrumentos alineados, desenfoque de profundidad en extremos */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 760 + i * 120;
          const dof = Math.abs(i - 2) > 1 ? "url(#ins-dof)" : undefined;
          return (
            <g key={i} transform={`rotate(${rot} 540 ${y})`} filter={dof}>
              <rect x={-60} y={y - 9} width={760 - i * 40} height={18} rx={9} fill="url(#steel)" />
              <path d={`M${700 - i * 40} ${y - 9} L ${880 - i * 30} ${y - 2} L ${880 - i * 30} ${y + 2} L ${700 - i * 40} ${y + 9} Z`} fill="url(#steel)" />
              {new Array(14).fill(0).map((_, k) => (
                <rect key={k} x={40 + k * 22} y={y - 9} width={4} height={18} fill="#2A2F36" opacity={0.5} />
              ))}
            </g>
          );
        })}
        {/* destello especular viajando */}
        <rect x={((t * 18) % 1600) - 300} y={700} width={140} height={720} fill="#fff" opacity={0.12} filter="url(#ins-blur)" transform="skewX(-20)" />
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Perfil social débil (contraste con la excelencia física)            */
/* ------------------------------------------------------------------ */
const loud = ["#FF3EA5", "#FFD60A", "#2EE85B", "#8A3FFC", "#FF7A00", "#00C2FF", "#FF2D2D", "#B8FF3D", "#FF9EDB"];
const postTexts = ["¡FELIZ LUNES!", "PROMO", "ESTAMOS ABIERTOS", "", "2x1", "FELIZ DÍA", "", "HOY", "¡VEN!"];

export const WeakProfile: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => (
  <AbsoluteFill style={{ background: "#fff", fontFamily: "Arial, sans-serif", color: "#111" }}>
    <div style={{ transform: `translateY(${-scroll}px)` }}>
      <div style={{ height: 70 }} />
      <div style={{ display: "flex", alignItems: "center", padding: "10px 24px", gap: 20 }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: "#7FD3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, color: "#E00", fontWeight: 900 }}>+</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>@clinica.ejemplo</div>
          <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 80, height: 16, borderRadius: 8, background: "#E3E3E3" }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "6px 24px", fontSize: 20, lineHeight: 1.35, color: "#333" }}>
        Consultorio!!! citas al DM!!! Llámanos ya
      </div>
      <div style={{ display: "flex", gap: 18, padding: "16px 24px" }}>
        {["#FF3EA5", "#FFD60A", "#2EE85B", "#8A3FFC"].map((c) => (
          <div key={c} style={{ width: 70, height: 70, borderRadius: 35, border: `4px solid ${c}`, background: "#eee" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginTop: 10 }}>
        {loud.concat(loud).map((c, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1 / 1",
              background: i % 4 === 3 ? "linear-gradient(135deg,#bbb,#888)" : c,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: i % 2 ? "Impact, Arial Black, sans-serif" : "Comic Sans MS, Arial, sans-serif",
              fontWeight: 900,
              fontSize: 26,
              color: i % 3 ? "#fff" : "#111",
              textShadow: "2px 2px 0 rgba(0,0,0,0.4)",
              transform: `rotate(${(random(`p${i}`) - 0.5) * 3}deg)`,
              textAlign: "center",
              padding: 8,
            }}
          >
            {postTexts[i % postTexts.length]}
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Pantalla de "trend" satírica                                        */
/* ------------------------------------------------------------------ */
export const TrendScreen: React.FC<{ t: number; variant: number }> = ({ t, variant }) => {
  const bgs = [
    "linear-gradient(160deg,#FF2D95,#7B2CFF)",
    "linear-gradient(160deg,#00E5FF,#FF00C8)",
    "linear-gradient(160deg,#FFE600,#FF4D00)",
  ];
  const sway = Math.sin(t * 0.55) * 9;
  const bob = Math.abs(Math.sin(t * 0.55)) * 18;
  const labels = ["#trend", "#viral", "#challenge"];
  return (
    <AbsoluteFill style={{ background: bgs[variant % 3], overflow: "hidden" }}>
      {/* luces de discoteca */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 280 * i - 100,
            top: -200,
            width: 160,
            height: 1400,
            background: "rgba(255,255,255,0.18)",
            transform: `rotate(${Math.sin(t / 8 + i) * 30}deg)`,
            transformOrigin: "50% 0",
            filter: "blur(18px)",
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, transform: `translateY(${-bob}px)` }}>
        <Figure x={280} y={1180} h={900} pose="standing" sway={sway} rim="#ffffff" />
      </div>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: "Impact, 'Arial Black', sans-serif",
          fontSize: 50,
          color: "#fff",
          WebkitTextStroke: "2px #000",
          transform: `rotate(${Math.sin(t / 3) * 3}deg) scale(${1 + Math.abs(Math.sin(t / 4)) * 0.06})`,
        }}
      >
        POV: tu doctor se une al trend
      </div>
      <div style={{ position: "absolute", right: 22, bottom: 260, display: "flex", flexDirection: "column", gap: 34, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 70, height: 70, borderRadius: 35, background: "rgba(255,255,255,0.85)" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 26, bottom: 150, fontFamily: "Arial, sans-serif", color: "#fff", fontSize: 26, fontWeight: 700 }}>
        @clinica.ejemplo · {labels[variant % 3]}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 110, height: 6, width: `${(t * 7) % 100}%`, background: "#fff" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Feed de publicaciones estáticas genéricas                           */
/* ------------------------------------------------------------------ */
export const StaticFeed: React.FC<{ scroll: number }> = ({ scroll }) => {
  const captions = ["Nuestro consultorio", "Sala de espera", "Nuestra recepción", "Consultorio 2", "¡Te esperamos!", "Nuestras instalaciones"];
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {new Array(12).fill(0).map((_, i) => (
          <div key={i} style={{ marginBottom: 24, fontFamily: "Arial, sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px" }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: "#cfd8e0" }} />
              <div style={{ width: 220, height: 16, borderRadius: 8, background: "#e4e4e4" }} />
            </div>
            <div
              style={{
                height: 520,
                background: `linear-gradient(180deg, ${["#d9dcd6", "#cfd3d8", "#e0d9cf", "#d2d6cc"][i % 4]}, ${["#a9ada6", "#9ea4ab", "#b3a99c", "#a3a89b"][i % 4]})`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* "foto" plana de consultorio: camilla y silla */}
              <div style={{ position: "absolute", left: 60, bottom: 90, width: 280, height: 70, background: "#7d8790", borderRadius: 8 }} />
              <div style={{ position: "absolute", left: 80, bottom: 30, width: 20, height: 60, background: "#555" }} />
              <div style={{ position: "absolute", left: 300, bottom: 30, width: 20, height: 60, background: "#555" }} />
              <div style={{ position: "absolute", right: 70, bottom: 30, width: 120, height: 180, background: "#5f6871", borderRadius: 10 }} />
              <div style={{ position: "absolute", right: 120, top: 70, width: 120, height: 160, background: "#f2f2f2", border: "8px solid #8a8a8a" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,200,0.12)" }} />
            </div>
            <div style={{ padding: "16px 20px", fontSize: 26, color: "#222" }}>{captions[i % captions.length]}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Paciente comparando opciones                                        */
/* ------------------------------------------------------------------ */
export const CompareScreen: React.FC<{ t: number }> = ({ t }) => {
  const s = interpolate(t, [0, 40, 60, 100, 120, 160], [0, 0, 260, 260, 120, 120], clamp);
  return (
    <AbsoluteFill style={{ background: "#0F1216", fontFamily: FONT, color: C.white }}>
      <div style={{ padding: "90px 36px 0" }}>
        <div style={{ fontSize: 30, fontWeight: 600 }}>Buscar especialista</div>
        <div style={{ marginTop: 22, height: 64, borderRadius: 18, background: "#1E232A", display: "flex", alignItems: "center", padding: "0 22px", color: C.titanium, fontSize: 24 }}>
          Especialista en Caracas
        </div>
      </div>
      <div style={{ transform: `translateY(${-s}px)`, padding: "26px 36px" }}>
        {["Opción A", "Opción B", "Opción C", "Opción D", "Opción E"].map((n, i) => (
          <div key={n} style={{ height: 210, borderRadius: 24, background: "#171B21", marginBottom: 20, padding: 26, display: "flex", gap: 22, border: `1px solid ${C.line}` }}>
            <div style={{ width: 120, height: 120, borderRadius: 18, background: "#2A3038" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 600 }}>{n}</div>
              <div style={{ width: "80%", height: 14, background: "#2A3038", borderRadius: 7, marginTop: 18 }} />
              <div style={{ width: "55%", height: 14, background: "#2A3038", borderRadius: 7, marginTop: 12 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
                {[0, 1, 2, 3, 4].map((k) => (
                  <div key={k} style={{ width: 22, height: 22, borderRadius: 4, background: k < 2 + (i % 3) ? "#5E6670" : "#2A3038" }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Pieza de contenido educativo (lo que produce la agencia)            */
/* ------------------------------------------------------------------ */
export const ContentPiece: React.FC<{ t: number; title?: string }> = ({ t, title = "Lo que debes saber antes de tu procedimiento" }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #1B2633 0%, #07090C 75%)", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(220,232,245,0.18), rgba(0,0,0,0) 40%)" }} />
    <Figure x={300} y={1180} h={900} rimSide="left" headTilt={Math.sin(t / 30) * 2} />
    <div style={{ position: "absolute", left: 36, right: 36, bottom: 170, fontFamily: FONT }}>
      <div style={{ fontSize: 20, letterSpacing: "0.3em", color: C.ice }}>ESPECIALISTA</div>
      <div style={{ fontSize: 40, fontWeight: 700, color: C.white, marginTop: 12, lineHeight: 1.15 }}>{title}</div>
    </div>
    <div style={{ position: "absolute", left: 36, right: 36, bottom: 120, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.2)" }}>
      <div style={{ width: `${Math.min(100, t * 0.6)}%`, height: "100%", background: C.white, borderRadius: 3 }} />
    </div>
  </AbsoluteFill>
);
