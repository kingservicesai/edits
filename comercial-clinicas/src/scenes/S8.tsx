import React from "react";
import { AbsoluteFill, interpolate, random, Sequence, useCurrentFrame } from "remotion";
import { C, EASE, EASE_INOUT, FONT } from "../theme";
import { Beam, Bg, clamp, Counter, Headline, Kicker, Legend, Particles, Phone, ramp, RevealLine, Shot } from "../components/core";

const INTRO = 104;
const CASE = 199;

/* Cabecera común de cada microcaso: índice + identidad tipográfica provisional */
const CaseHeader: React.FC<{ idx: number; children: React.ReactNode; sector: string }> = ({ idx, children, sector }) => {
  const f = useCurrentFrame();
  const p = ramp(f, 2, 26);
  return (
    <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: p }}>
      <div style={{ fontFamily: FONT, fontSize: 22, letterSpacing: "0.5em", color: C.titanium, marginBottom: 26 }}>
        CASO {String(idx).padStart(2, "0")} / 04
      </div>
      <div style={{ transform: `translateY(${(1 - p) * 30}px)` }}>{children}</div>
      <div style={{ width: 120 * p, height: 1, background: C.lineStrong, margin: "28px 0 18px" }} />
      <div style={{ fontFamily: FONT, fontSize: 22, letterSpacing: "0.38em", color: C.titanium }}>{sector}</div>
    </div>
  );
};

/* ------------------------------ 01 Kingphone ------------------------------ */
const Kingphone: React.FC = () => {
  const f = useCurrentFrame();
  const before = 7 * (52 / 12); // equivalente mensual solo para la altura de la barra
  const maxH = 520;
  const hB = ramp(f, 50, 80) * maxH * (before / 150);
  const hA = interpolate(f, [92, 140], [0, maxH], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 4) });
  const rot = interpolate(f, [0, CASE], [-8, 8]);
  return (
    <AbsoluteFill>
      <Bg />
      <Beam x={540} y={-100} angle={0} width={900} length={1300} opacity={0.18} />
      {/* composición publicitaria de dispositivos */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ramp(f, 40, 60) * 0.75 }}>
        {[-1, 0, 1].map((k) => (
          <Phone
            key={k}
            width={k === 0 ? 300 : 250}
            x={540 + k * 250}
            y={980 + Math.abs(k) * 40}
            rotateY={rot - k * 18}
            rotate={k * 4}
            glow={0.4}
            style={{ zIndex: k === 0 ? 2 : 1 }}
          >
            <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + k * 20}% 30%, #3B5672 0%, #0A0F16 70%)` }} />
          </Phone>
        ))}
        <div style={{ position: "absolute", left: 120, right: 120, top: 1330, height: 2, background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(220,232,245,0.6), rgba(0,0,0,0))" }} />
      </div>
      <CaseHeader idx={1} sector="TECNOLOGÍA · TELÉFONOS INTELIGENTES">
        <div style={{ fontFamily: FONT, fontSize: 104, letterSpacing: "-0.03em", color: C.white }}>
          <span style={{ fontWeight: 800 }}>King</span>
          <span style={{ fontWeight: 300 }}>phone</span>
        </div>
      </CaseHeader>
      {/* gráfica comparativa */}
      <div style={{ position: "absolute", left: 130, right: 130, top: 760, height: 900, display: "flex", alignItems: "flex-end", justifyContent: "space-between", fontFamily: FONT }}>
        {[
          { k: "ANTES", h: hB, at: 50, big: <Counter to={7} at={50} dur={20} size={110} />, sub: ["TELÉFONOS", "POR SEMANA"] },
          { k: "DESPUÉS", h: hA, at: 92, big: <Counter to={150} at={92} dur={48} size={110} suffix="+" metallic />, sub: ["MÁS DE 150 TELÉFONOS", "MENSUALES"] },
        ].map((b, i) => {
          const o = ramp(f, b.at - 6, b.at + 12);
          return (
            <div key={b.k} style={{ width: 360, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
              <div style={{ fontSize: 22, letterSpacing: "0.4em", color: C.titanium, marginBottom: 14 }}>{b.k}</div>
              {b.big}
              <div style={{ fontSize: 22, letterSpacing: "0.12em", color: C.silver, textAlign: "center", margin: "14px 0 24px", lineHeight: 1.4 }}>
                {b.sub[0]}
                <br />
                {b.sub[1]}
              </div>
              <div
                style={{
                  width: 200,
                  height: b.h,
                  borderRadius: "14px 14px 0 0",
                  background: i === 1 ? "linear-gradient(180deg, #F4F6F8, #8FBCE6 60%, #2A4560)" : "linear-gradient(180deg, #6B727C, #2A2F36)",
                  boxShadow: i === 1 ? "0 0 80px rgba(143,188,230,0.35)" : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 1660, height: 2, background: C.lineStrong, opacity: ramp(f, 46, 60) }} />
    </AbsoluteFill>
  );
};

/* ------------------------------ 02 Bogo ------------------------------ */
const Bogo: React.FC = () => {
  const f = useCurrentFrame();
  const fill = ramp(f, 58, 110, EASE_INOUT);
  const warm = fill;
  const tables: { x: number; y: number }[] = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) tables.push({ x: 210 + c * 220 + (r % 2) * 40 - 20, y: 720 + r * 170 });
  const months = 8;
  const stock = 1 - ramp(f, 150, 185, EASE_INOUT);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 60%, rgba(${40 + 50 * warm},${34 + 30 * warm},${28 + 10 * warm},1) 0%, #050505 80%)`,
        }}
      />
      <CaseHeader idx={2} sector="LOCAL COMERCIAL">
        <div style={{ fontFamily: FONT, fontSize: 116, fontWeight: 800, letterSpacing: "0.06em", color: C.white }}>Bogo</div>
      </CaseHeader>
      {/* planta del local vista cenital */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 1 - ramp(f, 140, 158) * 0.8 }}>
        <rect x={110} y={650} width={860} height={860} rx={20} fill="none" stroke={C.lineStrong} strokeWidth={2} />
        {tables.map((t, i) => {
          const seats = [
            [0, -58],
            [0, 58],
            [-58, 0],
            [58, 0],
          ];
          return (
            <g key={i}>
              <circle cx={t.x} cy={t.y} r={40} fill="#1E1B18" stroke="#8C8378" strokeWidth={2} />
              {seats.map(([dx, dy], k) => {
                const th = random(`b${i}-${k}`);
                const on = fill > th * 0.9;
                const jig = on ? Math.sin(f / 6 + i + k) * 2 : 0;
                return (
                  <g key={k}>
                    <circle cx={t.x + dx} cy={t.y + dy} r={16} fill="none" stroke="#5E574F" strokeWidth={2} />
                    {on && <circle cx={t.x + dx + jig} cy={t.y + dy} r={14} fill="#F2C98A" opacity={0.95} />}
                    {on && <circle cx={t.x + dx + jig} cy={t.y + dy} r={34} fill="#F2B866" opacity={0.12} />}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      {/* meses de alta demanda + inventario */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 1300, opacity: ramp(f, 140, 158) }}>
        <div style={{ display: "flex", gap: 12 }}>
          {new Array(months).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 70,
                borderRadius: 8,
                background: `rgba(242,201,138,${ramp(f, 140 + i * 2, 150 + i * 2) * 0.85})`,
                boxShadow: "0 0 30px rgba(242,184,102,0.25)",
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 50, fontFamily: FONT, fontSize: 20, letterSpacing: "0.4em", color: C.titanium }}>INVENTARIO</div>
        <div style={{ marginTop: 16, height: 20, borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${stock * 100}%`, height: "100%", borderRadius: 10, background: "linear-gradient(90deg,#F2C98A,#E09A4E)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <RevealLine at={60} out={136} size={92} weight={800}>
          DE VACÍO A LLENO.
        </RevealLine>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <RevealLine at={142} size={78} weight={800}>
          MESES DE ALTA DEMANDA.
        </RevealLine>
        <RevealLine at={162} size={78} weight={800} metallic>
          INVENTARIO AGOTADO.
        </RevealLine>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------ 03 GSM ------------------------------ */
const GSM: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [60, 140], [0, 1], { ...clamp, easing: EASE_INOUT });
  const X0 = 140;
  const X1 = 940;
  const Y0 = 1420; // base
  const top = 860;
  const yOf = (v: number) => Y0 - ((v - 0) / 280) * (Y0 - top);
  // curva ilustrativa entre los dos datos reales (50 → 263); sin puntos intermedios rotulados
  const pts = new Array(17).fill(0).map((_, i) => {
    const t = i / 16;
    const v = 50 + (263 - 50) * Math.pow(t, 1.7);
    return [X0 + t * (X1 - X0), yOf(v)] as const;
  });
  const d = pts.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");
  const len = 1400;
  const head = pts[Math.min(16, Math.floor(p * 16))];
  return (
    <AbsoluteFill>
      <Bg tone="cold" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gsm-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8FBCE6" stopOpacity="0.35" />
            <stop offset="1" stopColor="#8FBCE6" stopOpacity="0" />
          </linearGradient>
          <clipPath id="gsm-clip">
            <rect x={0} y={0} width={X0 + (X1 - X0) * p + 2} height={1920} />
          </clipPath>
          <filter id="gsm-glow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {new Array(6).fill(0).map((_, i) => (
          <line key={i} x1={X0} x2={X1} y1={Y0 - i * 112} y2={Y0 - i * 112} stroke={C.line} />
        ))}
        {new Array(17).fill(0).map((_, i) => (
          <line key={`d${i}`} x1={X0 + (i / 16) * (X1 - X0)} x2={X0 + (i / 16) * (X1 - X0)} y1={Y0} y2={Y0 + 12} stroke={C.lineStrong} />
        ))}
        <text x={X0} y={Y0 + 50} fontFamily={FONT} fontSize={22} fill={C.titanium} letterSpacing={4}>
          DÍA 1
        </text>
        <text x={X1} y={Y0 + 50} fontFamily={FONT} fontSize={22} fill={C.titanium} letterSpacing={4} textAnchor="end">
          DÍA 17
        </text>
        <g clipPath="url(#gsm-clip)">
          <path d={`${d} L ${X1} ${Y0} L ${X0} ${Y0} Z`} fill="url(#gsm-area)" />
          <path d={d} stroke={C.ice} strokeWidth={14} fill="none" opacity={0.35} filter="url(#gsm-glow)" />
          <path d={d} stroke={C.white} strokeWidth={5} fill="none" strokeDasharray={len} />
        </g>
        {p > 0 && (
          <>
            <circle cx={head[0]} cy={head[1]} r={14} fill={C.white} />
            <circle cx={head[0]} cy={head[1]} r={40} fill={C.ice} opacity={0.25} />
          </>
        )}
        <text x={X0} y={yOf(50) - 26} fontFamily={FONT} fontSize={30} fontWeight={700} fill={C.silver} opacity={ramp(f, 60, 70)}>
          50
        </text>
      </svg>
      <CaseHeader idx={3} sector="TECNOLOGÍA · ELECTRÓNICA">
        <div style={{ fontFamily: FONT, fontSize: 120, fontWeight: 800, letterSpacing: "0.22em", color: C.white, marginRight: "-0.22em" }}>GSM</div>
      </CaseHeader>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <RevealLine at={24} size={70} weight={800}>
          EN SOLO 17 DÍAS.
        </RevealLine>
      </div>
      {/* contador 50 → 263 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1530, display: "flex", flexDirection: "column", alignItems: "center", opacity: ramp(f, 56, 70) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26, fontFamily: FONT, color: C.white }}>
          <span style={{ fontSize: 96, fontWeight: 300, color: C.silver }}>50</span>
          <span style={{ fontSize: 80, fontWeight: 300, color: C.titanium }}>→</span>
          <Counter from={50} to={263} at={60} dur={80} size={120} />
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "0.04em", marginLeft: 8 }}>UNIDADES.</span>
        </div>
      </div>
      {/* +426% */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1700, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, opacity: ramp(f, 140, 152) }}>
        <Counter to={426} at={142} dur={34} size={110} prefix="+" suffix="%" metallic />
        <span style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.white }}>DE CRECIMIENTO.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------ 04 Rodacentro ------------------------------ */
const Tire: React.FC<{ x: number; y: number; r: number; rot: number }> = ({ x, y, r, rot }) => (
  <svg width={r * 2.4} height={r * 2.4} viewBox="-120 -120 240 240" style={{ position: "absolute", left: x - r * 1.2, top: y - r * 1.2 }}>
    <defs>
      <radialGradient id="rim" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#F4F6F8" />
        <stop offset="0.5" stopColor="#8A9099" />
        <stop offset="1" stopColor="#2A2F36" />
      </radialGradient>
      <radialGradient id="rubber" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.6" stopColor="#1A1C1F" />
        <stop offset="0.95" stopColor="#0A0B0C" />
        <stop offset="1" stopColor="#2A2D31" />
      </radialGradient>
    </defs>
    <g transform={`rotate(${rot})`}>
      <circle r={100} fill="url(#rubber)" />
      {new Array(36).fill(0).map((_, i) => (
        <rect key={i} x={-5} y={-100} width={10} height={16} rx={2} fill="#2E3237" transform={`rotate(${i * 10})`} />
      ))}
      <circle r={62} fill="#0C0D0F" />
      <circle r={58} fill="url(#rim)" />
      {new Array(10).fill(0).map((_, i) => (
        <path key={i} d="M-6 -14 L -10 -54 L 10 -54 L 6 -14 Z" fill="#1A1D22" transform={`rotate(${i * 36})`} />
      ))}
      <circle r={16} fill="#C9CED6" />
      <circle r={6} fill="#2A2F36" />
    </g>
    <ellipse cx={-30} cy={-50} rx={60} ry={20} fill="#fff" opacity={0.1} transform="rotate(-30)" />
  </svg>
);

const Rodacentro: React.FC = () => {
  const f = useCurrentFrame();
  const rot = f * 4 * (1 - ramp(f, 60, 120) * 0.7);
  return (
    <AbsoluteFill>
      <Bg />
      <Beam x={540} y={-100} angle={0} width={1000} length={1500} opacity={0.2} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ramp(f, 54, 80) * 0.7, transform: `scale(${1 + ramp(f, 0, 199) * 0.08})` }}>
        <Tire x={540} y={1060} r={330} rot={rot} />
        <div style={{ position: "absolute", left: 140, right: 140, top: 1470, height: 3, background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(220,232,245,0.5), rgba(0,0,0,0))" }} />
        <div style={{ position: "absolute", left: 340, right: 340, top: 1480, height: 80, background: "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%)" }} />
      </div>
      <CaseHeader idx={4} sector="AUTOMOTRIZ · NEUMÁTICOS">
        <div style={{ fontFamily: FONT, fontSize: 100, letterSpacing: "-0.01em", color: C.white }}>
          <span style={{ fontWeight: 800 }}>Roda</span>
          <span style={{ fontWeight: 300 }}>centro</span>
        </div>
      </CaseHeader>
      {/* contenido viral: contador de reproducciones */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", flexDirection: "column", alignItems: "center", opacity: ramp(f, 60, 76) }}>
        <svg width={90} height={60} viewBox="0 0 90 60" style={{ marginBottom: 24 }}>
          <path d="M5 30 C 25 0 65 0 85 30 C 65 60 25 60 5 30 Z" fill="none" stroke={C.silver} strokeWidth={4} />
          <circle cx={45} cy={30} r={12} fill={C.silver} />
        </svg>
        <Counter to={300000} at={64} dur={70} size={150} suffix="+" metallic />
        <div style={{ marginTop: 18 }}>
          <RevealLine at={110} size={74} weight={800}>
            VISTAS.
          </RevealLine>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 70 }}>
          {new Array(7).fill(0).map((_, i) => (
            <div key={i} style={{ width: 80, height: 18, borderRadius: 9, background: `rgba(220,232,245,${0.15 + ramp(f, 120 + i * 4, 128 + i * 4) * 0.75})` }} />
          ))}
        </div>
        <div style={{ marginTop: 36 }}>
          <RevealLine at={146} size={64} weight={800} color={C.silver}>
            EN SOLO UNA SEMANA.
          </RevealLine>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ESCENA 8 — CASOS COMERCIALES (900 f)                                */
/* ================================================================== */
export const Scene8: React.FC = () => {
  const f = useCurrentFrame();
  const cases = [Kingphone, Bogo, GSM, Rodacentro];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shot from={0} to={INTRO + 6} push={0.05} fadeIn={6} fadeOut={8}>
        <Bg tone="cold" />
        <Particles count={50} seed="s8" speed={0.6} opacity={0.4} />
        <Kicker text="Resultados" at={6} out={96} top={700} />
        <Headline lines={["ESTO NO ES", "TEORÍA."]} at={10} out={96} size={128} top="50%" metallic />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontFamily: FONT, fontSize: 30, letterSpacing: "0.18em", color: C.silver, opacity: ramp(f, 40, 60) * (1 - ramp(f, 92, 102)) }}>
          MARCAS PERSONALES Y COMERCIALES
        </div>
      </Shot>
      {cases.map((Comp, i) => {
        const from = INTRO + i * CASE;
        return (
          <Sequence key={i} from={from} durationInFrames={CASE}>
            <CaseWrap>
              <Comp />
            </CaseWrap>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Transición entre casos: barrido con desenfoque direccional. */
const CaseWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const i = ramp(f, 0, 12, EASE);
  const o = ramp(f, CASE - 10, CASE, EASE_INOUT);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(i, 1 - o * 0.9),
        transform: `translateX(${(1 - i) * 120 - o * 120}px) scale(${1 + (1 - i) * 0.04})`,
        filter: `blur(${(1 - i) * 14 + o * 14}px)`,
      }}
    >
      {children}
      <Legend text="Recreación ilustrativa" bottom={110} opacity={0.45} />
    </AbsoluteFill>
  );
};

