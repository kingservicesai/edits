import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { User, Package, CreditCard, Coins, MessageCircle, Play, TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { C, F as FONT } from "../theme";
import { EASE, prog, rnd } from "../lib/anim";
import { F, FE, W, sec } from "../timeline";
import { DarkBG, LightBG, Photo, Flash, Grain, FlagBar, LightSweep, Clip } from "../components/base";
import { CharacterChip, Spreadsheet, IdleBars, CharKey } from "../components/motion";
import { LogoReveal } from "../components/Logo";
import { cue, Cue } from "../lib/scene";

const S = F("sc1");
const E = F("sc2") + 18;

// key beats
const b = {
  venta: W("S1", "venta"),
  producto: W("S1", "producto"),
  sucursal: W("S1", "sucursal"),
  existe: W("S1", "existe"),
  perfect: W("S1", "perfectamente"),
  pero: W("S1", "pero"),
  excel: W("S1", "excel"),
  cuadernos: W("S1", "cuadernos"),
  mensajes: W("S1", "mensajes"),
  convers: W("S1", "conversaciones"),
  controlar: W("S1", "controlar"),
  desafio: W("S1", "desafío"),
  unaVenta: W("S1", "una", 40),
  quien: W("S1", "¿quién"),
  inventario: W("S1", "¿cuánto", 50),
  pago: W("S1", "¿el"),
  vendedor: W("S1", "¿cuánto", 58),
  y: W("S1", "y", 66),
  crece: W("S1", "crece", 70),
  dificultad: W("S1", "dificultad"),
  control: W("S1", "control", 78),
  en: W("S1", "en", 80),
  oport: W("S1", "oportunidades"),
  retos: W("S1", "retos"),
  pero2: W("S1", "pero", 90),
};

export const sfx1: Cue[] = [
  cue(S + 2, "whoosh_deep", 0.5),
  cue(b.venta - 4, "whoosh", 0.45),
  cue(b.producto - 4, "whoosh2", 0.45),
  cue(b.sucursal - 4, "whoosh", 0.45),
  cue(b.existe - 2, "data", 0.35),
  cue(b.pero - 3, "glitch", 0.55),
  cue(b.pero, "impact2", 0.35),
  cue(b.excel - 2, "pop", 0.6),
  cue(b.cuadernos - 2, "paper", 0.35, 40),
  cue(b.mensajes - 2, "msg", 0.4),
  cue(b.mensajes + 6, "msg", 0.3),
  cue(b.convers - 2, "pop2", 0.5),
  cue(b.desafio - 4, "impact", 0.6),
  cue(b.desafio - 2, "glitch", 0.4),
  cue(b.unaVenta - 2, "pop", 0.4),
  cue(b.quien - 2, "stamp", 0.5),
  cue(b.inventario - 2, "stamp", 0.5),
  cue(b.pago - 2, "stamp", 0.5),
  cue(b.vendedor - 2, "stamp", 0.5),
  cue(b.y, "riser", 0.35),
  cue(b.en - 6, "whoosh_deep", 0.5),
  cue(b.en, "shimmer", 0.45),
  cue(b.oport - 2, "pop", 0.45),
  cue(b.retos - 3, "pop2", 0.45),
];

/* ───────── helpers ───────── */
const Label: React.FC<{ at: number; kicker: string; text: string; color?: string }> = ({ at, kicker, text, color = C.yellow }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 16, EASE.out);
  return (
    <div style={{ position: "absolute", left: 40, bottom: 50, right: 30 }}>
      <div style={{ overflow: "hidden" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: 18, letterSpacing: 6, color, transform: `translateY(${(1 - p) * 100}%)` }}>{kicker}</div>
      </div>
      <div style={{ overflow: "hidden", marginTop: 6 }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.05, transform: `translateY(${(1 - prog(f, at + 3, 18, EASE.out)) * 110}%)` }}>{text}</div>
      </div>
    </div>
  );
};

const Panel: React.FC<{ at: number; i: number; src: string; pos?: string; children?: React.ReactNode; from?: number; video?: string }> = ({ at, i, src, pos, children, from = 1, video }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 20, EASE.out);
  const w = 1920 / 3;
  return (
    <div
      style={{
        position: "absolute", left: i * w, top: 0, width: w + 1, height: 1080, overflow: "hidden",
        clipPath: `inset(${(1 - p) * 100 * (from > 0 ? 1 : 0)}% 0 ${(1 - p) * 100 * (from < 0 ? 1 : 0)}% 0)`,
      }}
    >
      {video ? (
        <Clip name={video} from={at} dur={160} zoom={[1.12, 1.04]} position={pos} grade="saturate(0.95) contrast(1.05)" overlay="linear-gradient(180deg, rgba(7,12,28,0) 45%, rgba(7,12,28,0.85) 100%)" />
      ) : (
        <Photo src={src} start={at} dur={160} from={{ s: 1.25, x: 0, y: from * 30 }} to={{ s: 1.1, x: 0, y: 0 }} position={pos} grade="saturate(0.95) contrast(1.05)" overlay="linear-gradient(180deg, rgba(7,12,28,0) 45%, rgba(7,12,28,0.85) 100%)" />
      )}
      {children}
    </div>
  );
};

const ChaosItem: React.FC<{ at: number; x: number; y: number; r: number; children: React.ReactNode; jitterFrom: number; z?: number }> = ({ at, x, y, r, children, jitterFrom, z = 1 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14, EASE.back);
  const j = f > jitterFrom ? Math.min(1, (f - jitterFrom) / 20) : 0;
  const jx = j * (rnd(f * 3.1 + x) - 0.5) * 14;
  const jy = j * (rnd(f * 2.3 + y) - 0.5) * 14;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: z, transform: `translate(${jx}px, ${jy + (1 - p) * 60}px) rotate(${r + (1 - p) * 10}deg) scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 1.4) }}>
      {children}
    </div>
  );
};

const Question: React.FC<{ at: number; idx: number; text: string; Icon: React.ElementType; settle: number }> = ({ at, idx, text, Icon, settle }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 9, EASE.snap);
  const sc = interpolate(f, [at, at + 6, at + 12], [1.5, 0.97, 1], { extrapolateRight: "clamp" });
  // after next question arrives, move into grid slot
  const g = prog(f, settle, 16, EASE.inOut);
  const slot = [
    [-430, -150],
    [430, -150],
    [-430, 150],
    [430, 150],
  ][idx];
  const x = slot[0] * g;
  const y = slot[1] * g;
  const s = 1 - 0.45 * g;
  return (
    <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${sc * s})`, opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", gap: 34, padding: "34px 54px", borderRadius: 36, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.16)", backdropFilter: "blur(14px)" }}>
        <div style={{ width: 110, height: 110, borderRadius: 30, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={60} color="#fff" />
        </div>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 78, color: "#fff", letterSpacing: -1.5, whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};

/* ───────── Scene ───────── */
export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S || f > E) return null;

  const darkOn = f >= b.pero - 2 && f < b.en - 4;
  const lightLogo = f >= b.en - 4;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* ── A. Intro + three panels (venta / producto / sucursal) ── */}
      {f < b.existe + 4 && (
        <AbsoluteFill>
          <Clip name="showroom" from={S} dur={180} zoom={[1.0, 1.03]} grade="brightness(0.92)" overlay={`rgba(0,0,0,${interpolate(f, [S, S + 40], [1, 0.25], { extrapolateRight: "clamp" })})`} />
          <LightSweep at={S + 6} dur={50} />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: interpolate(f, [S + 10, S + 24, b.venta - 6, b.venta], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <FlagBar w={360} h={6} p={prog(f, S + 10, 30, EASE.inOut)} />
          </AbsoluteFill>
          {f >= b.venta - 6 && (
            <>
              <Panel at={b.venta - 6} i={0} src="photos/showroom.jpg" pos="30% center" video="showroom">
                <Label at={b.venta - 2} kicker="CADA" text="venta" color={C.yellow} />
              </Panel>
              <Panel at={b.producto - 6} i={1} src="photos/dock.jpg" from={-1} video="dock">
                <Label at={b.producto - 2} kicker="CADA" text="producto que llega" color="#8FB0FF" />
              </Panel>
              <Panel at={b.sucursal - 6} i={2} src="photos/chairs_row.jpg" pos="40% center" video="chairs_row">
                <Label at={b.sucursal - 2} kicker="CADA" text="sucursal que abre" color="#FF8A8A" />
              </Panel>
            </>
          )}
        </AbsoluteFill>
      )}

      {/* ── B. The three people that make the business run ── */}
      {f >= b.existe - 4 && f < b.pero + 2 && (
        <AbsoluteFill>
          {([
            ["photos/sales_counter.jpg", "andrea", "center"],
            ["photos/warehouse.jpg", "carlos", "center"],
            ["photos/owner_office.jpg", "jose", "60% center"],
          ] as [string, CharKey, string][]).map(([src, who, pos], i) => {
            const at = b.existe - 4 + i * 5;
            return (
              <Panel key={who} at={at} i={i} src={src} pos={pos} from={i % 2 ? -1 : 1} video={who === "carlos" ? "warehouse" : who === "jose" ? "owner_office" : undefined}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: prog(f, at + 8, 12), transform: `translateY(${(1 - prog(f, at + 8, 18, EASE.out)) * 40}px)` }}>
                  <CharacterChip who={who} dark size={0.82} />
                </div>
              </Panel>
            );
          })}
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 30px", borderRadius: 999, background: "rgba(7,12,28,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", opacity: prog(f, b.perfect - 4, 10), transform: `scale(${0.9 + 0.1 * prog(f, b.perfect - 4, 14, EASE.back)})` }}>
              <CheckCircle2 size={38} color="#4ADE80" />
              <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: "#fff" }}>Un negocio que necesita funcionar perfectamente</span>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* ── C. Chaos (dark) ── */}
      {darkOn && (
        <AbsoluteFill>
          <DarkBG />
          {/* kinetic sentence before the objects arrive */}
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - prog(f, b.excel - 6, 8) }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 96, color: "#fff", letterSpacing: -2, display: "flex", gap: 26 }}>
              {"la información está repartida".split(" ").map((w, i) => {
                const st = b.pero + 8 + i * 6;
                const p = prog(f, st, 12, EASE.out);
                const spread = w === "repartida" ? 0 : (i - 1.5) * 26 * prog(f, b.pero + 40, 30, EASE.inOut);
                return (
                  <span key={i} style={{ opacity: p, transform: `translate(${spread}px, ${(1 - p) * 40 + (w === "repartida" ? Math.sin(f / 3) * 4 : 0)}px) rotate(${w === "repartida" ? -3 : 0}deg)`, color: w === "repartida" ? C.red2 : "#fff" }}>
                    {w}
                  </span>
                );
              })}
            </div>
          </AbsoluteFill>
          {/* objects */}
          {f >= b.excel - 4 && f < b.unaVenta && (
            <AbsoluteFill style={{ opacity: 1 - prog(f, b.unaVenta - 8, 8), transform: `scale(${1 + 0.06 * prog(f, b.controlar, 60)})` }}>
              <ChaosItem at={b.excel - 4} x={120} y={150} r={-6} jitterFrom={b.controlar}>
                <Spreadsheet name="ventas_sucursales_FINAL_v3.xlsx" width={700} seed={2} errors={[9, 22, 40]} />
              </ChaosItem>
              <ChaosItem at={b.excel + 4} x={1060} y={90} r={5} jitterFrom={b.controlar} z={0}>
                <Spreadsheet name="inventario_norte (2).xlsx" width={640} rows={8} seed={5} errors={[13, 31]} />
              </ChaosItem>
              <ChaosItem at={b.cuadernos - 4} x={260} y={560} r={-10} jitterFrom={b.controlar} z={2}>
                <div style={{ width: 560, height: 360, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.5)", border: "6px solid #fff" }}>
                  <Img src={staticFile("photos/sales_counter.jpg")} style={{ width: 1300, marginLeft: -620, marginTop: -360 }} />
                </div>
              </ChaosItem>
              <ChaosItem at={b.mensajes - 4} x={1180} y={520} r={4} jitterFrom={b.controlar} z={3}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 470 }}>
                  {[
                    ["¿Todavía hay sillas ejecutivas?", 0],
                    ["Déjame preguntar en almacén…", 5],
                    ["¿El cliente ya pagó la venta de ayer?", 10],
                  ].map(([t, d], i) => {
                    const p = prog(f, b.mensajes - 4 + (d as number), 10, EASE.back);
                    return (
                      <div key={i} style={{ alignSelf: i === 1 ? "flex-end" : "flex-start", background: i === 1 ? "#1D4ED8" : "#fff", color: i === 1 ? "#fff" : "#111", borderRadius: 20, padding: "14px 20px", fontFamily: FONT.ui, fontSize: 24, fontWeight: 500, transform: `scale(${p})`, transformOrigin: i === 1 ? "right" : "left", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", display: "flex", gap: 10, alignItems: "center" }}>
                        <MessageCircle size={22} /> {t as string}
                      </div>
                    );
                  })}
                </div>
              </ChaosItem>
              <ChaosItem at={b.convers - 4} x={820} y={820} r={-3} jitterFrom={b.controlar} z={4}>
                <div style={{ display: "flex", gap: 16 }}>
                  {[0, 1].map((k) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderRadius: 999, background: k ? "#1D4ED8" : "#fff", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", transform: `scale(${prog(f, b.convers - 4 + k * 6, 10, EASE.back)})` }}>
                      <div style={{ width: 44, height: 44, borderRadius: 22, background: k ? "#fff" : C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Play size={20} color={k ? "#1D4ED8" : "#fff"} fill={k ? "#1D4ED8" : "#fff"} />
                      </div>
                      <IdleBars bars={16} color={k ? "#fff" : C.navy} height={34} amp={0.9} />
                      <span style={{ fontFamily: FONT.mono, fontSize: 18, color: k ? "#fff" : "#111" }}>0:{k ? "38" : "52"}</span>
                    </div>
                  ))}
                </div>
              </ChaosItem>
              {/* red warning pulse */}
              <AbsoluteFill style={{ background: `rgba(214,40,40,${0.18 * prog(f, b.controlar, 20) * (0.5 + 0.5 * Math.sin(f / 3))})`, mixBlendMode: "screen" }} />
              {/* DESAFÍO */}
              {f >= b.desafio - 3 && (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 20, background: `rgba(7,12,28,${0.55 * prog(f, b.desafio - 3, 6)})` }}>
                  <div
                    style={{
                      fontFamily: FONT.display, fontWeight: 900, fontSize: 250, color: "#fff", letterSpacing: -6,
                      transform: `scale(${interpolate(f, [b.desafio - 3, b.desafio + 3, b.desafio + 9], [2.2, 0.95, 1], { extrapolateRight: "clamp" })}) rotate(-4deg)`,
                      textShadow: "0 20px 80px rgba(214,40,40,0.8)", WebkitTextStroke: "2px rgba(255,255,255,0.2)",
                    }}
                  >
                    DESAFÍO
                  </div>
                </AbsoluteFill>
              )}
            </AbsoluteFill>
          )}
          {/* sale card + questions */}
          {f >= b.unaVenta - 4 && (
            <AbsoluteFill>
              <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) scale(${1.4 * prog(f, b.unaVenta - 4, 12, EASE.back)}) translateY(${-prog(f, b.quien - 12, 10, EASE.in) * 500}px)`, opacity: 1 - prog(f, b.quien - 8, 6) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 40px", borderRadius: 28, background: "#fff", fontFamily: FONT.ui, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                  <CheckCircle2 size={56} color={C.green} />
                  <div>
                    <div style={{ fontSize: 22, color: C.text2 }}>Venta</div>
                    <div style={{ fontSize: 44, fontWeight: 800, color: C.navy }}>Registrada</div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", right: -80, top: -120, fontFamily: FONT.display, fontWeight: 900, fontSize: 1300, lineHeight: 1, color: "transparent", WebkitTextStroke: "3px rgba(255,255,255,0.06)", transform: `rotate(${12 + (f - b.quien) * 0.05}deg)`, opacity: prog(f, b.quien - 4, 20) }}>?</div>
              <Question at={b.quien - 2} idx={0} text="¿Quién la realizó?" Icon={User} settle={b.inventario - 6} />
              <Question at={b.inventario - 2} idx={1} text="¿Cuánto inventario queda?" Icon={Package} settle={b.pago - 6} />
              <Question at={b.pago - 2} idx={2} text="¿El cliente ya pagó?" Icon={CreditCard} settle={b.vendedor - 6} />
              <Question at={b.vendedor - 2} idx={3} text="¿Cuánto se le debe a cada vendedor?" Icon={Coins} settle={b.y - 2} />
              {/* growth vs complexity */}
              {f >= b.y - 2 && <GrowthVsComplexity at={b.y} crece={b.crece} dificultad={b.dificultad} control={b.control} />}
            </AbsoluteFill>
          )}
          <Flash at={b.pero - 2} dur={8} color="#D62828" max={0.35} />
        </AbsoluteFill>
      )}

      {/* ── D. Brand moment (light) ── */}
      {lightLogo && (
        <AbsoluteFill>
          <LightBG />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateY(${-110 * prog(f, b.oport - 10, 20, EASE.inOut)}px) scale(${1 - 0.18 * prog(f, b.oport - 10, 20, EASE.inOut)})` }}>
            <LogoReveal at={b.en - 2} width={470} speed={1.15} />
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 130 }}>
            <div style={{ display: "flex", gap: 40 }}>
              {[
                { at: b.oport - 6, t: "Nuevas oportunidades", c: C.green, I: ArrowUpRight, bg: "#E7F6EC" },
                { at: b.retos - 6, t: "Nuevos retos", c: C.red, I: ArrowDownRight, bg: "#FDECEC" },
              ].map((x) => {
                const p = prog(f, x.at, 14, EASE.back);
                return (
                  <div key={x.t} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 40px", borderRadius: 999, background: "#fff", boxShadow: "0 20px 50px rgba(14,27,61,0.14)", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px)` }}>
                    <div style={{ width: 70, height: 70, borderRadius: 35, background: x.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <x.I size={40} color={x.c} />
                    </div>
                    <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 52, color: C.navy }}>{x.t}</span>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
          <Flash at={b.en - 4} dur={12} color="#fff" />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const GrowthVsComplexity: React.FC<{ at: number; crece: number; dificultad: number; control: number }> = ({ at, crece, dificultad, control }) => {
  const f = useCurrentFrame();
  const g = prog(f, at + 4, 50, EASE.inOut);
  const c = prog(f, dificultad - 6, 40, EASE.inOut);
  const show = prog(f, at, 10);
  // growth path
  const pts = Array.from({ length: 30 }, (_, i) => [200 + i * 52, 860 - Math.pow(i / 29, 1.6) * 560]);
  const n = Math.max(2, Math.floor(pts.length * g));
  const d = pts.slice(0, n).map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  // tangled lines
  const tangles = Array.from({ length: 14 }, (_, k) => {
    const seg = Array.from({ length: 9 }, (_, i) => [300 + rnd(k * 17 + i) * 1300, 200 + rnd(k * 31 + i * 7) * 680]);
    return seg.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  });
  return (
    <AbsoluteFill style={{ opacity: show }}>
      <AbsoluteFill style={{ background: "rgba(7,12,28,0.75)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {tangles.map((t, k) => (
          <path key={k} d={t} stroke={C.red} strokeOpacity={0.55} strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, c * (1 + k * 0.05))} />
        ))}
        <path d={d} stroke={C.yellow} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 18px rgba(244,180,0,0.6))" }} />
      </svg>
      <div style={{ position: "absolute", left: 200, top: 170, fontFamily: FONT.display, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 64, fontWeight: 900, opacity: prog(f, crece - 4, 10), transform: `translateX(${(1 - prog(f, crece - 4, 16, EASE.out)) * -40}px)` }}>
          <TrendingUp size={64} color={C.yellow} /> El negocio crece
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 64, fontWeight: 900, marginTop: 14, color: "#FF8A8A", opacity: prog(f, dificultad - 4, 10), transform: `translateX(${(1 - prog(f, dificultad - 4, 16, EASE.out)) * -40}px)` }}>
          <AlertTriangle size={60} color={C.red2} /> …y también la dificultad
        </div>
        <div style={{ fontFamily: FONT.ui, fontSize: 30, marginTop: 20, color: "rgba(255,255,255,0.7)", opacity: prog(f, control - 6, 12) }}>de mantener todo bajo control</div>
      </div>
    </AbsoluteFill>
  );
};

export const SCENE1_RANGE = [S, E];
export const _s1 = { sec, FE, Grain };
