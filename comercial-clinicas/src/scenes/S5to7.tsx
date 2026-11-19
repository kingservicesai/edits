import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, EASE, EASE_INOUT, FONT } from "../theme";
import {
  Beam,
  Bg,
  clamp,
  Figure,
  Headline,
  Kicker,
  Particles,
  Phone,
  ramp,
  RevealLine,
  Shot,
  Viewfinder,
} from "../components/core";
import { ContentPiece } from "../components/ui";

/* ---------- utilería de estudio ---------- */

const Softbox: React.FC<{ x: number; y: number; w: number; h: number; on: number; angle?: number }> = ({ x, y, w, h, on, angle = 0 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `perspective(1200px) rotateY(${angle}deg)` }}>
    <div style={{ position: "absolute", inset: -12, borderRadius: 10, background: "#16191E", border: "2px solid #2B3038" }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 6,
        background: `linear-gradient(180deg, rgba(255,255,255,${0.95 * on}), rgba(220,232,245,${0.75 * on}))`,
        boxShadow: `0 0 ${220 * on}px ${60 * on}px rgba(220,232,245,${0.35 * on})`,
      }}
    />
  </div>
);

const CinemaCamera: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <svg viewBox="0 0 600 420" width={600 * scale} height={420 * scale} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <defs>
      <linearGradient id="cam-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2C3138" />
        <stop offset="1" stopColor="#0A0B0D" />
      </linearGradient>
      <linearGradient id="cam-lens" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#565C65" />
        <stop offset="0.5" stopColor="#15181C" />
        <stop offset="1" stopColor="#3A3F46" />
      </linearGradient>
    </defs>
    {/* asa superior */}
    <rect x={180} y={20} width={240} height={26} rx={8} fill="#1A1D22" stroke="#4A515B" />
    <rect x={200} y={40} width={20} height={50} fill="#1A1D22" />
    <rect x={380} y={40} width={20} height={50} fill="#1A1D22" />
    {/* cuerpo */}
    <rect x={160} y={90} width={300} height={220} rx={14} fill="url(#cam-body)" stroke="#59616C" strokeWidth={2} />
    <rect x={190} y={120} width={90} height={40} rx={4} fill="#0E1A26" stroke="#3A5675" />
    <circle cx={420} cy={130} r={10} fill="#E5484D" />
    {/* lente con anillos */}
    <rect x={20} y={130} width={150} height={140} rx={10} fill="url(#cam-lens)" stroke="#6B737E" />
    {[40, 70, 100, 130].map((xx) => (
      <rect key={xx} x={xx} y={126} width={6} height={148} fill="#8C949E" opacity={0.5} />
    ))}
    {/* parasol */}
    <path d="M20 110 L -60 70 L -60 330 L 20 290 Z" fill="#101215" stroke="#4A515B" />
    {/* trípode */}
    <rect x={290} y={310} width={40} height={60} fill="#15181C" />
    <path d="M310 370 L 200 420 M310 370 L 420 420 M310 370 L 310 420" stroke="#2C3138" strokeWidth={12} />
  </svg>
);

/* ================================================================== */
/* ESCENA 5 — CAMBIO DE PARADIGMA (300 f)                              */
/* ================================================================== */
export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const on1 = ramp(f, 14, 18);
  const on2 = ramp(f, 28, 32);
  const on3 = ramp(f, 42, 46);
  const nodes = [
    { x: 540, y: 760, r: 64, label: "AUTORIDAD" },
    { x: 250, y: 560, r: 40, label: "AUDIENCIA" },
    { x: 830, y: 560, r: 40, label: "MENSAJE" },
    { x: 220, y: 980, r: 40, label: "CONFIANZA" },
    { x: 860, y: 980, r: 40, label: "DISTRIBUCIÓN" },
    { x: 540, y: 1120, r: 40, label: "CONVERSIÓN" },
  ];
  const graphP = ramp(f, 168, 230, EASE_INOUT);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* A — el estudio se enciende */}
      <Shot from={0} to={112} push={0.05} fadeIn={0} fadeOut={4}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at 50% 55%, rgba(30,38,48,${on1}) 0%, #020203 80%)` }} />
        <Softbox x={170} y={720} w={240} h={420} on={on1} angle={30} />
        <Softbox x={910} y={700} w={240} h={420} on={on2} angle={-30} />
        <Beam x={540} y={-80} angle={0} width={700} length={1600} opacity={0.22 * on3} />
        <Figure x={560} y={1380} h={760} rimSide="both" opacity={0.2 + 0.8 * on2} />
        <CinemaCamera x={-120} y={1180} scale={1.25} />
        <Kicker text="El cambio" at={50} out={104} top={330} color={C.silver} />
      </Shot>
      {/* B — punto de vista de la cámara: entrevista */}
      <Shot from={110} to={170} push={0.06} fadeIn={4} fadeOut={4}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 45% at 40% 45%, #1F2A36 0%, #050608 75%)" }} />
        <Beam x={0} y={200} angle={-35} width={600} length={1500} opacity={0.2} />
        <Figure x={540} y={1650} h={1150} rimSide="left" rim="#E8EEF4" />
        <Viewfinder startTc={4200} />
      </Shot>
      {/* C — sala de estrategia */}
      <Shot from={168} to={300} push={0.04} fadeIn={3} fadeOut={10}>
        <Bg tone="cold" />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <defs>
            <filter id="s5g">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {/* curva de comportamiento del consumidor */}
          <path
            d={`M 80 1380 ${new Array(40)
              .fill(0)
              .map((_, i) => `L ${80 + i * 23} ${1380 - Math.pow(i / 39, 2.2) * 300 - Math.sin(i / 2) * 14}`)
              .join(" ")}`}
            stroke={C.ice}
            strokeWidth={3}
            fill="none"
            strokeDasharray={1200}
            strokeDashoffset={1200 * (1 - graphP)}
            opacity={0.7}
          />
          {nodes.slice(1).map((n, i) => {
            const p = ramp(f, 176 + i * 6, 210 + i * 6);
            return (
              <line
                key={i}
                x1={nodes[0].x}
                y1={nodes[0].y}
                x2={nodes[0].x + (n.x - nodes[0].x) * p}
                y2={nodes[0].y + (n.y - nodes[0].y) * p}
                stroke={C.silver}
                strokeOpacity={0.4}
                strokeWidth={2}
              />
            );
          })}
          {nodes.map((n, i) => {
            const p = ramp(f, 172 + i * 6, 196 + i * 6);
            const pulse = i === 0 ? 1 + 0.06 * Math.sin(f / 8) : 1;
            return (
              <g key={n.label} opacity={p}>
                <circle cx={n.x} cy={n.y} r={n.r * 1.9 * pulse} fill={C.ice} opacity={0.08} filter="url(#s5g)" />
                <circle cx={n.x} cy={n.y} r={n.r * pulse} fill="#0D141C" stroke={i === 0 ? C.white : C.silver} strokeWidth={i === 0 ? 3 : 2} />
                <text x={n.x} y={n.y + n.r + 44} textAnchor="middle" fontFamily={FONT} fontSize={22} letterSpacing={5} fill={C.titanium}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
        {/* equipo creativo de espaldas, en primer término */}
        <Figure x={170} y={2050} h={820} coat={false} rimSide="right" rim="#8FBCE6" />
        <Figure x={930} y={2080} h={760} coat={false} rimSide="left" rim="#8FBCE6" />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 80%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <RevealLine at={196} size={78} weight={800} tracking={0.02} color={f > 236 ? C.titanium : C.white}>
            ESTRATEGIA.
          </RevealLine>
          <RevealLine at={234} size={78} weight={800} tracking={0.02} color={f > 268 ? C.titanium : C.white}>
            NEUROMARKETING.
          </RevealLine>
          <RevealLine at={266} size={78} weight={800} tracking={0.02} metallic>
            AUTORIDAD.
          </RevealLine>
        </div>
      </Shot>
    </AbsoluteFill>
  );
};

/* ---------- símbolos de conocimiento ---------- */

const Heart: React.FC<{ p: number; x: number; y: number; s: number }> = ({ p, x, y, s }) => (
  <svg viewBox="0 0 200 200" width={200 * s} height={200 * s} style={{ position: "absolute", left: x - 100 * s, top: y - 100 * s, overflow: "visible" }}>
    <path
      d="M100 175 C 40 130 15 95 25 60 C 35 25 80 20 100 55 C 120 20 165 25 175 60 C 185 95 160 130 100 175 Z M100 55 C 95 80 110 95 100 120 M70 40 C 72 20 85 10 95 8 M128 38 C 135 22 150 14 160 18"
      fill="none"
      stroke={C.ice}
      strokeWidth={3}
      strokeDasharray={900}
      strokeDashoffset={900 * (1 - p)}
    />
  </svg>
);

const Helix: React.FC<{ p: number; t: number; x: number; y: number; h: number }> = ({ p, t, x, y, h }) => {
  const n = 22;
  return (
    <svg width={160} height={h} style={{ position: "absolute", left: x - 80, top: y - h / 2, overflow: "visible", opacity: p }}>
      {new Array(n).fill(0).map((_, i) => {
        const yy = (i / (n - 1)) * h;
        const a = i * 0.55 + t / 12;
        const x1 = 80 + Math.sin(a) * 60;
        const x2 = 80 - Math.sin(a) * 60;
        const show = i / n < p;
        return show ? (
          <g key={i}>
            <line x1={x1} y1={yy} x2={x2} y2={yy} stroke={C.silver} strokeOpacity={0.25} strokeWidth={2} />
            <circle cx={x1} cy={yy} r={5} fill={C.ice} opacity={0.5 + 0.5 * Math.cos(a)} />
            <circle cx={x2} cy={yy} r={5} fill={C.white} opacity={0.5 - 0.5 * Math.cos(a) + 0.2} />
          </g>
        ) : null;
      })}
    </svg>
  );
};

/* ================================================================== */
/* ESCENA 6 — EL MÉDICO COMO PROTAGONISTA (435 f)                      */
/* ================================================================== */
export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const ringP = ramp(f, 150, 200);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* A — entrevista en plano medio, visor */}
      <Shot from={0} to={150} push={0.08} fadeIn={10} fadeOut={4}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 45% at 35% 45%, #22303D 0%, #050608 75%)" }} />
        <Beam x={-60} y={100} angle={-30} width={700} length={1800} opacity={0.22} />
        <Figure x={600} y={1720} h={1150} rimSide="left" rim="#F0F4F8" />
        <Viewfinder startTc={9100} opacity={0.75} label="ENTREVISTA · TOMA 03" />
        <Headline lines={["EL ESPECIALISTA", "ES EL PROTAGONISTA."]} at={30} out={140} size={80} top="78%" stagger={5} />
      </Shot>
      {/* B — núcleo magnético: el conocimiento orbita al especialista */}
      <Shot from={148} to={282} push={0.05} fadeIn={4} fadeOut={6}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 40% at 50% 40%, #142130 0%, #040506 75%)" }} />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {[1, 2, 3, 4].map((k) => {
            const r = 220 + k * 120 + ((f * 1.2) % 120);
            return <circle key={k} cx={540} cy={760} r={r * ringP} fill="none" stroke={C.ice} strokeOpacity={0.22 * (1 - (r - 220) / 600)} strokeWidth={2} />;
          })}
          {new Array(8).fill(0).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + f / 90;
            const R = 380;
            const px = 540 + Math.cos(a) * R;
            const py = 760 + Math.sin(a) * R * 0.75;
            const p = ramp(f, 160 + i * 4, 190 + i * 4);
            return (
              <g key={i} opacity={p}>
                <line x1={540} y1={760} x2={px} y2={py} stroke={C.silver} strokeOpacity={0.12} />
                <circle cx={px} cy={py} r={7} fill={C.white} />
                <circle cx={px} cy={py} r={20} fill={C.ice} opacity={0.15} />
              </g>
            );
          })}
        </svg>
        <Figure x={540} y={1500} h={1000} rimSide="both" rim="#E8EEF4" />
        <Heart p={ramp(f, 170, 230)} x={190} y={420} s={1.2} />
        <Helix p={ramp(f, 180, 240)} t={f} x={900} y={1080} h={420} />
        <Kicker text="Sabiduría  ·  Criterio  ·  Reputación" at={176} out={272} top={1580} color={C.silver} />
      </Shot>
      {/* C — el conocimiento se convierte en contenido que llega a las personas */}
      <Shot from={280} to={360} push={0.03} fadeIn={4} fadeOut={4}>
        <Bg tone="cold" />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {new Array(6).fill(0).map((_, i) => {
            const a = (i / 6) * Math.PI * 2 + 0.5;
            const p = ramp(f, 296 + i * 3, 330 + i * 3);
            return (
              <line
                key={i}
                x1={540}
                y1={960}
                x2={540 + Math.cos(a) * 420 * p}
                y2={960 + Math.sin(a) * 640 * p}
                stroke={C.ice}
                strokeOpacity={0.35}
                strokeWidth={2}
                strokeDasharray="6 10"
                strokeDashoffset={-f * 2}
              />
            );
          })}
        </svg>
        {new Array(6).fill(0).map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + 0.5;
          const p = ramp(f, 300 + i * 3, 336 + i * 3);
          return (
            <Phone key={i} width={170} x={540 + Math.cos(a) * 420 * p} y={960 + Math.sin(a) * 640 * p} scale={0.4 + 0.6 * p} glow={0.5}>
              <ContentPiece t={f} title="" />
            </Phone>
          );
        })}
        <Phone width={420} x={540} y={960} glow={0.7}>
          <ContentPiece t={f - 280} />
        </Phone>
      </Shot>
      {/* D — paciente informado, tranquilo */}
      <Shot from={358} to={435} push={0.05} fadeIn={4} fadeOut={8}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 45% at 50% 55%, #1E2630 0%, #050607 75%)" }} />
        <Figure x={540} y={1700} h={1050} pose="seated" coat={false} rimSide="both" rim="#C9DDF0" phoneGlow={1} headTilt={2} />
      </Shot>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.35)", opacity: ramp(f, 322, 336) * (f < 435 ? 1 : 0) }} />
      <Headline lines={["CONOCIMIENTO QUE", "GENERA CONFIANZA."]} at={326} size={86} top="22%" stagger={5} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ESCENA 7 — DESTRUIR OBJECIONES (225 f)                              */
/* ================================================================== */
export const Scene7: React.FC = () => {
  const f = useCurrentFrame();
  const barriers = [
    { label: "PRECIO", open: 92 },
    { label: "MIEDO", open: 132 },
    { label: "DESCONFIANZA", open: 172 },
  ];
  const words = [
    { w: "EDUCAR.", at: 88 },
    { w: "POSICIONAR.", at: 128 },
    { w: "CONVERTIR.", at: 168 },
  ];
  const flood = ramp(f, 176, 215, EASE_INOUT);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Bg tone="cold" />
      {/* clínica al fondo (alzado lineal) */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.35 + 0.65 * flood }}>
        <g stroke={C.silver} strokeWidth={2} fill="none" opacity={0.7}>
          <rect x={300} y={560} width={480} height={360} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={300 + i * 80} y1={560} x2={300 + i * 80} y2={920} strokeOpacity={0.5} />
          ))}
          <line x1={300} y1={680} x2={780} y2={680} strokeOpacity={0.5} />
          <line x1={300} y1={800} x2={780} y2={800} strokeOpacity={0.5} />
          <rect x={490} y={820} width={100} height={100} />
          <line x1={240} y1={920} x2={840} y2={920} />
        </g>
        <rect x={300} y={560} width={480} height={360} fill={C.ice} opacity={0.12 * flood} />
      </svg>
      {/* barreras de vidrio que se abren como compuertas */}
      <AbsoluteFill style={{ perspective: 1600 }}>
        {barriers.map((b, i) => {
          const z = -i * 260;
          const appear = ramp(f, 4 + i * 8, 30 + i * 8);
          const open = ramp(f, b.open, b.open + 26, EASE);
          return (
            <div
              key={b.label}
              style={{
                position: "absolute",
                left: 140,
                width: 800,
                top: 1060 - i * 70,
                height: 230,
                transformStyle: "preserve-3d",
                transformOrigin: "0% 50%",
                transform: `translateZ(${z}px) rotateY(${-open * 82}deg)`,
                opacity: appear * (1 - open * 0.9),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, rgba(60,70,82,0.85), rgba(18,22,27,0.92))",
                  border: `2px solid ${C.lineStrong}`,
                  boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT,
                  fontSize: 72,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: C.silver,
                }}
              >
                {b.label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* contenido educativo atravesando: tarjetas que fluyen hacia la clínica */}
      {new Array(14).fill(0).map((_, i) => {
        const start = 50 + i * 9;
        const p = interpolate(f, [start, start + 50], [0, 1], clamp);
        if (p <= 0 || p >= 1) return null;
        const x = 140 + random(`c${i}`) * 800;
        const y = 1750 - p * 1050;
        const sc = 1 - p * 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 70,
              top: y,
              width: 140,
              height: 220,
              borderRadius: 16,
              background: "linear-gradient(180deg, rgba(220,232,245,0.22), rgba(143,188,230,0.06))",
              border: "1px solid rgba(220,232,245,0.45)",
              transform: `scale(${sc})`,
              opacity: Math.sin(p * Math.PI),
              boxShadow: "0 0 40px rgba(143,188,230,0.25)",
            }}
          >
            <div style={{ margin: "70px auto 0", width: 0, height: 0, borderLeft: "34px solid rgba(255,255,255,0.8)", borderTop: "22px solid transparent", borderBottom: "22px solid transparent" }} />
          </div>
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(220,232,245,0.45), rgba(0,0,0,0) 70%)", opacity: flood }} />
      {/* palabras sincronizadas */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        {words.map((w, i) => (
          <RevealLine key={w.w} at={w.at} size={96} weight={800} tracking={0.01} color={i === 2 ? undefined : C.white} metallic={i === 2}>
            {w.w}
          </RevealLine>
        ))}
      </div>
      <Particles count={30} seed="s7" speed={1.4} opacity={0.4 * flood} />
    </AbsoluteFill>
  );
};
