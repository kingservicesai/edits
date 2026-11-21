import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Building2, ShoppingCart, PackageX, Percent, Coins, CalendarClock, Lock, Hourglass, Mail, FileSpreadsheet, X, Eye, BarChart3, Lightbulb, Database, Sparkles, Phone } from "lucide-react";
import { C, F as FONT, SHADOW } from "../theme";
import { EASE, prog } from "../lib/anim";
import { F, FE, W } from "../timeline";
import { DarkBG, LightBG, Photo, Flash, FlagBar, Clip } from "../components/base";
import { ChapterTitle, CallCard, Cursor, StampLines, Spreadsheet, CK } from "../components/motion";
import { Camera, CamKey } from "../components/camera";
import { Headline, Quote, Toast } from "../components/overlays";
import { AppWindow } from "../ui/kit";
import { PageDashboard, PageReportes, Assistant } from "../ui/PagesDueno";
import { cue, Cue } from "../lib/scene";

const S = F("sc4") - 12;
const E = F("sc5") + 20;
const CH = 52;

const t = {
  title: F("title4"), titleEnd: FE("title4"),
  intro: F("s4_intro"),
  j1: F("D_JOSE1"), j1End: FE("D_JOSE1"),
  ger: F("D_GERENTE"), gerEnd: FE("D_GERENTE"),
  msg: F("s4_msg"),
  n1: F("S4N1"), mayor: W("S4N1", "mayor"), basta: W("S4N1", "basta"), toda: W("S4N1", "toda"),
  tienda: W("S4N1", "tienda"), agotando: W("S4N1", "agotando"), rentabilidad: W("S4N1", "rentabilidad"), comisiones: W("S4N1", "comisiones"), vencer: W("S4N1", "vencer"),
  departamento: W("S4N1", "departamento"), horas: W("S4N1", "horas"), dias: W("S4N1", "días"), excel: W("S4N1", "excel"), decision: W("S4N1", "decisión"),
  flip: F("s4_flip"),
  n2: F("S4N2"), n2End: FE("S4N2"),
  s2: W("S4N2", "puede", 10), mejores: W("S4N2", "mejores"),
  s3: W("S4N2", "puede", 30), s4: W("S4N2", "puede", 45), s5: W("S4N2", "también"),
  mic: F("s4_mic"),
  q1: F("D_JOSE2"), q1End: FE("D_JOSE2"),
  a1: F("D_ASIST"), a1End: FE("D_ASIST"),
  q2: F("D_JOSE3"), q2End: FE("D_JOSE3"),
  ans2: F("s4_answer2"),
  n7: F("S4N7"), navegar: W("S4N7", "navegar"), solicitar: W("S4N7", "solicitar"), real: W("S4N7", "real"), decidir: W("S4N7", "decidir"),
  close: F("s4_close"),
  n8: F("S4N8"), verlo: W("S4N8", "verlo"), analizarlo: W("S4N8", "analizarlo"), decisiones: W("S4N8", "decisiones"),
  stamp: F("s4_stamp"),
};

export const sfx4: Cue[] = [
  cue(t.title - 10, "whoosh_deep", 0.55),
  cue(t.titleEnd - 12, "whoosh", 0.45),
  cue(t.intro + 30, "click", 0.4),
  cue(t.intro + 42, "pop", 0.4),
  cue(t.intro + 50, "pop2", 0.4),
  cue(t.intro + 58, "pop", 0.4),
  cue(t.j1 - 14, "call_beep", 0.35, 20),
  cue(t.msg + 4, "msg", 0.5),
  cue(t.msg + 20, "pop2", 0.4),
  cue(t.n1, "whoosh", 0.35),
  cue(t.toda - 4, "whoosh2", 0.4),
  cue(t.tienda - 3, "pop", 0.45),
  cue(t.agotando - 3, "pop2", 0.45),
  cue(t.rentabilidad - 3, "pop", 0.45),
  cue(t.comisiones - 3, "pop2", 0.45),
  cue(t.vencer - 3, "pop", 0.45),
  cue(t.departamento - 4, "box", 0.4),
  cue(t.horas - 4, "ticks", 0.4),
  cue(t.dias - 2, "stamp", 0.45),
  cue(t.excel - 4, "typing", 0.3, 30),
  cue(t.decision - 4, "glitch", 0.4),
  cue(t.flip - 6, "riser", 0.4),
  cue(t.flip + 4, "impact", 0.5),
  cue(t.flip + 6, "shimmer", 0.4),
  cue(t.n2 + 6, "ticks", 0.3),
  cue(t.s2 - 8, "click", 0.45),
  cue(t.mejores - 2, "pop", 0.4),
  cue(t.s3 - 8, "click2", 0.45),
  cue(t.s4 - 8, "click", 0.45),
  cue(t.s5 - 8, "click2", 0.45),
  cue(t.mic + 14, "click", 0.5),
  cue(t.mic + 16, "mic", 0.5),
  cue(t.a1 - 4, "data", 0.35),
  cue(t.q2 - 4, "mic", 0.35),
  cue(t.ans2 + 4, "data", 0.35),
  cue(t.navegar - 4, "pop", 0.4),
  cue(t.solicitar - 4, "pop2", 0.4),
  cue(t.real - 6, "data", 0.4),
  cue(t.close + 2, "whoosh2", 0.4),
  cue(t.close + 8, "click", 0.35),
  cue(t.close + 14, "click2", 0.35),
  cue(t.close + 20, "click", 0.35),
  cue(t.verlo - 2, "pop", 0.35),
  cue(t.analizarlo - 2, "pop2", 0.35),
  cue(t.decisiones - 2, "pop", 0.35),
  cue(t.stamp + 2, "stamp", 0.6),
  cue(t.stamp + 16, "stamp", 0.6),
  cue(t.stamp + 30, "stamp", 0.6),
];

const AppStage: React.FC<{ cam: CamKey[]; children: React.ReactNode; cursor?: CK[]; cursorShow?: [number, number] }> = ({ cam, children, cursor, cursorShow }) => (
  <Camera keys={cam} w={1720} h={1040 + CH}>
    <AppWindow width={1720} height={1040}>
      {children}
      {cursor && <Cursor keys={cursor} show={cursorShow} scale={1.1} />}
    </AppWindow>
  </Camera>
);

const Q: React.FC<{ at: number; I: React.ElementType; t: string; c: string }> = ({ at, I, t: text, c }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14, EASE.back);
  return (
    <div style={{ width: 300, height: 300, borderRadius: 34, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.16)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 20, boxSizing: "border-box", transform: `translateY(${(1 - p) * 70}px) scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p), textAlign: "center" }}>
      <div style={{ width: 100, height: 100, borderRadius: 28, background: c, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I size={56} color="#fff" />
      </div>
      <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 32, color: "#fff", lineHeight: 1.1 }}>{text}</div>
    </div>
  );
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S || f > E) return null;
  const problem = f < t.flip + 26;
  const sol = f >= t.flip;

  // page switching in S4N2
  const page: "dash" | "ventas" | "inventario" | "comisiones" | "cxp" =
    f < t.s2 - 4 ? "dash" : f < t.s3 - 4 ? "ventas" : f < t.s4 - 4 ? "inventario" : f < t.s5 - 4 ? "comisiones" : f < t.mic ? "cxp" : "dash";

  const camN2: CamKey[] = [
    { f: t.flip, s: 0.6, x: 860, y: 600 },
    { f: t.n2, s: 0.9, x: 860, y: 560 },
    { f: t.n2 + 30, s: 1.15, x: 1000, y: 240 },
    { f: t.s2 - 10, s: 1.15, x: 1000, y: 260 },
    { f: t.s2 + 6, s: 0.95, x: 900, y: 600 },
    { f: t.mejores - 10, s: 1.15, x: 760, y: 650 },
    { f: t.s3 - 6, s: 0.95, x: 900, y: 560 },
    { f: t.s3 + 40, s: 1.05, x: 1000, y: 620 },
    { f: t.s4 - 6, s: 0.95, x: 900, y: 600 },
    { f: t.s4 + 30, s: 1.1, x: 1000, y: 720 },
    { f: t.s5 - 6, s: 0.95, x: 900, y: 600 },
    { f: t.s5 + 30, s: 1.12, x: 1000, y: 640 },
    { f: t.mic - 2, s: 1.0, x: 1000, y: 560 },
    { f: t.mic + 12, s: 0.92, x: 1000, y: 540 },
    { f: t.q1, s: 1.05, x: 1180, y: 560 },
    { f: t.navegar - 12, s: 1.05, x: 1180, y: 560 },
    { f: t.navegar + 4, s: 0.74, x: 640, y: 560 },
    { f: t.close - 6, s: 0.74, x: 640, y: 560 },
    { f: t.close + 10, s: 0.86, x: 860, y: 560 },
    { f: t.stamp, s: 1.0, x: 860, y: 540 },
  ];
  const cur: CK[] = [
    { f: t.n2, x: 900, y: 760 },
    { f: t.s2 - 12, x: 167, y: 624 },
    { f: t.s2 - 8, x: 167, y: 624, click: true },
    { f: t.s3 - 12, x: 167, y: 380 },
    { f: t.s3 - 8, x: 167, y: 380, click: true },
    { f: t.s4 - 14, x: 167, y: 624, click: true },
    { f: t.s4 - 8, x: 752, y: 212, click: true },
    { f: t.s5 - 12, x: 905, y: 212 },
    { f: t.s5 - 8, x: 905, y: 212, click: true },
    { f: t.mic + 4, x: 167, y: 258, click: true },
    { f: t.mic + 14, x: 1290, y: 52, click: true },
    { f: t.mic + 40, x: 1000, y: 700 },
  ];

  return (
    <AbsoluteFill>
      {problem && (
        <AbsoluteFill>
          <DarkBG />
          {f < t.n1 + 4 && (
            <AbsoluteFill style={{ opacity: 1 - prog(f, t.n1 - 4, 8) }}>
              <Clip name="office_slow" from={t.intro} dur={480} zoom={[1.0, 1.08]} grade="brightness(0.85)" overlay="linear-gradient(90deg, rgba(7,12,28,0.75) 0%, rgba(7,12,28,0.1) 60%)" />
              <div style={{ position: "absolute", left: 120, top: 140, fontFamily: FONT.display, color: "#fff", opacity: prog(f, t.intro, 10) * (1 - prog(f, t.j1 - 10, 8)) }}>
                <div style={{ fontSize: 30, fontFamily: FONT.ui, fontWeight: 700, letterSpacing: 6, color: C.gold2 }}>LUNES</div>
                <div style={{ fontSize: 160, fontWeight: 900, lineHeight: 1 }}>
                  8:0{Math.min(9, Math.floor(prog(f, t.intro, 60) * 9))} <span style={{ fontSize: 80 }}>a.m.</span>
                </div>
              </div>
              {/* excel windows cascading */}
              {[0, 1, 2, 3].map((k) => {
                const at = t.intro + 30 + k * 8 + (k === 3 ? t.msg - t.intro - 26 : 0);
                if (f < at) return null;
                return (
                  <div key={k} style={{ position: "absolute", left: 820 + k * 70, top: 170 + k * 60, transform: `scale(${0.7 + 0.3 * prog(f, at, 12, EASE.back)}) rotate(${(k - 1.5) * 2}deg)`, opacity: prog(f, at, 6) * (1 - 0.4 * prog(f, t.j1, 10)) }}>
                    <Spreadsheet name={["ventas_centro_mayo.xlsx", "inventario_norte_v2.xlsx", "comisiones_FINAL.xlsx", "pagos_proveedores.xlsx"][k]} width={720} rows={9} seed={k * 7 + 3} errors={k === 2 ? [10, 25] : []} />
                  </div>
                );
              })}
              {f >= t.j1 - 16 && f < t.msg && (
                <div style={{ position: "absolute", left: 120, top: 220, transform: `translateY(${(1 - prog(f, t.j1 - 16, 14, EASE.back)) * -200}px)`, opacity: prog(f, t.j1 - 16, 8) * (1 - prog(f, t.msg - 6, 6)) }}>
                  <CallCard name="Carlos · Gerente" sub="En llamada" state="active" voice={f < t.ger - 4 ? { src: "audio/vo/D_JOSE1.flac", start: t.j1 } : { src: "audio/vo/D_GERENTE.flac", start: t.ger }} color={C.vzBlue} icon={<Phone size={32} color="#fff" />} />
                </div>
              )}
              <Toast at={t.msg + 2} title="Contabilidad" sub="Pagos a proveedores pendientes por revisar" color="#64748B" icon={<Mail size={28} color="#fff" />} x={120} y={260} width={600} out={t.n1 - 4} />
              <Quote who="jose" text="Necesito saber cuánto vendimos este mes, cuánto tenemos en inventario y cuánto llevamos acumulado en comisiones." at={t.j1} end={t.j1End} dark />
              <Quote who="carlos" text="Déjame revisar los reportes de la sucursal y te envío la información." at={t.ger} end={t.gerEnd} dark />
            </AbsoluteFill>
          )}
          {/* N1 */}
          {f >= t.n1 - 4 && f < t.tienda - 6 && (
            <AbsoluteFill style={{ opacity: prog(f, t.n1 - 4, 8) * (1 - prog(f, t.tienda - 12, 6)) }}>
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                {f < t.basta - 4 ? (
                  <Headline at={t.n1 + 2} text="Para el dueño, el problema es todavía mayor" size={92} accentWord="mayor" style={{ maxWidth: 1500 }} />
                ) : (
                  <div style={{ position: "relative", width: 1600, height: 700 }}>
                    {[
                      { n: "Norte", x: 650, y: 230 },
                      { n: "Sur", x: 150, y: 120 },
                      { n: "Centro", x: 1150, y: 120 },
                      { n: "Compras", x: 150, y: 420 },
                      { n: "Contabilidad", x: 1150, y: 420 },
                    ].map((b, i) => {
                      const at = i === 0 ? t.basta - 4 : t.toda - 10 + i * 3;
                      const p = prog(f, at, 14, EASE.back);
                      const zoom = prog(f, t.toda - 10, 20, EASE.inOut);
                      return (
                        <div key={b.n} style={{ position: "absolute", left: b.x, top: b.y, width: 300, padding: "26px 0", borderRadius: 28, textAlign: "center", background: i === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)", border: `2px solid ${i < 3 ? "rgba(143,176,255,0.6)" : "rgba(255,255,255,0.2)"}`, color: "#fff", fontFamily: FONT.ui, transform: `scale(${p * (i === 0 ? 1.4 - 0.4 * zoom : 1)})`, opacity: Math.min(1, p) }}>
                          <Building2 size={56} color={i < 3 ? "#8FB0FF" : "#fff"} />
                          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{i < 3 ? `Sucursal ${b.n}` : b.n}</div>
                          {zoom > 0.5 && <div style={{ position: "absolute", top: -22, right: -22, width: 56, height: 56, borderRadius: 28, background: C.red, fontFamily: FONT.display, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${prog(f, t.toda + i * 3, 10, EASE.back)})` }}>?</div>}
                        </div>
                      );
                    })}
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", opacity: prog(f, t.toda - 4, 10) }}>
                      <Headline at={t.toda - 4} text="¿Qué está pasando en toda la empresa?" size={64} accentWord="toda" />
                    </div>
                  </div>
                )}
              </AbsoluteFill>
            </AbsoluteFill>
          )}
          {f >= t.tienda - 8 && f < t.departamento - 4 && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: prog(f, t.tienda - 8, 6) * (1 - prog(f, t.departamento - 10, 6)) }}>
              <div style={{ display: "flex", gap: 28 }}>
                <Q at={t.tienda - 6} I={ShoppingCart} t="¿Cuánto vende cada tienda?" c={C.vzBlue} />
                <Q at={t.agotando - 6} I={PackageX} t="¿Qué se está agotando?" c={C.red} />
                <Q at={t.rentabilidad - 6} I={Percent} t="¿Qué es más rentable?" c={C.gold} />
                <Q at={t.comisiones - 6} I={Coins} t="¿Cuánto en comisiones?" c="#7C3AED" />
                <Q at={t.vencer - 8} I={CalendarClock} t="¿Qué pagos vencen?" c="#0F766E" />
              </div>
            </AbsoluteFill>
          )}
          {f >= t.departamento - 8 && f < t.excel - 8 && (
            <AbsoluteFill style={{ opacity: prog(f, t.departamento - 8, 6) * (1 - prog(f, t.excel - 14, 6)) }}>
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
                <div style={{ display: "flex", gap: 34 }}>
                  {["Ventas", "Inventario", "Compras", "Contabilidad"].map((d, i) => {
                    const p = prog(f, t.departamento - 6 + i * 4, 14, EASE.back);
                    return (
                      <div key={d} style={{ width: 340, height: 260, borderRadius: 26, background: "rgba(255,255,255,0.05)", border: "3px solid rgba(255,255,255,0.18)", boxShadow: "inset 0 0 0 10px rgba(7,12,28,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, transform: `scale(${p})`, color: "#fff", fontFamily: FONT.display, fontWeight: 800, fontSize: 36 }}>
                        <Lock size={56} color="rgba(255,255,255,0.6)" />
                        {d}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: prog(f, t.horas - 6, 10) }}>
                  <Hourglass size={80} color={C.yellow} style={{ transform: `rotate(${Math.floor((f - t.horas) / 20) * 180}deg)` }} />
                  <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 80, color: "#fff" }}>
                    Esperar horas… <span style={{ color: C.red2, opacity: prog(f, t.dias - 4, 8) }}>o incluso días</span>
                  </div>
                </div>
              </AbsoluteFill>
            </AbsoluteFill>
          )}
          {f >= t.excel - 12 && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: prog(f, t.excel - 12, 8) * (1 - prog(f, t.flip + 2, 6)) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
                <div style={{ position: "relative" }}>
                  <Spreadsheet name="reporte_consolidado.xlsx" width={760} rows={10} seed={21} />
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: -90, fontFamily: FONT.ui, color: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 600 }}>
                      <span>Preparando reporte…</span>
                      <span>{Math.round(12 + 6 * prog(f, t.excel - 12, 60))}%</span>
                    </div>
                    <div style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.12)", marginTop: 10 }}>
                      <div style={{ width: `${12 + 6 * prog(f, t.excel - 12, 60)}%`, height: "100%", borderRadius: 8, background: C.yellow }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center", opacity: prog(f, t.decision - 8, 10), transform: `scale(${prog(f, t.decision - 8, 14, EASE.back)})` }}>
                  <div style={{ width: 300, height: 300, borderRadius: 150, border: "6px dashed rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lock size={130} color="#fff" />
                  </div>
                  <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 58, color: "#fff", marginTop: 24 }}>Decisión en espera</div>
                </div>
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {sol && (
        <AbsoluteFill style={{ clipPath: `circle(${prog(f, t.flip, 22, EASE.inOut) * 120}% at 50% 50%)` }}>
          <LightBG />
          <AppStage cam={camN2} cursor={cur} cursorShow={[t.n2 + 10, t.mic + 40]}>
            {page === "dash" && (
              <PageDashboard at={f < t.mic ? t.flip + 8 : t.mic - 30} kpiHL={f < t.mic ? [t.n2 + 30, t.n2 + 38, t.n2 + 46, t.n2 + 54] : []} mic={{ press: t.mic + 14, listening: [t.q1 - 6, t.q2End + 4] }}>
                {f >= t.mic && (
                  <Assistant ev={{ open: t.mic + 16, q1: t.q1, q1End: t.q1End, a1: t.a1, a1End: t.a1End, q2: t.q2, q2End: t.q2End, a2: t.ans2 + 2, voiceQ1: "audio/vo/D_JOSE2.flac", voiceA1: "audio/vo/D_ASIST.flac", voiceQ2: "audio/vo/D_JOSE3.flac" }} />
                )}
              </PageDashboard>
            )}
            {page === "ventas" && <PageReportes tab="ventas" at={t.s2} hl={t.mejores - 4} />}
            {page === "inventario" && <PageReportes tab="inventario" at={t.s3} />}
            {page === "comisiones" && <PageReportes tab="comisiones" at={t.s4} />}
            {page === "cxp" && <PageReportes tab="cxp" at={t.s5} />}
          </AppStage>
          {/* assistant principles */}
          {f >= t.navegar - 6 && f < t.close && (
            <AbsoluteFill style={{ pointerEvents: "none", opacity: 1 - prog(f, t.close - 8, 8) }}>
              <div style={{ position: "absolute", left: 50, top: 300, display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { at: t.navegar - 6, txt: "Sin navegar por menús", I: X, c: C.red },
                  { at: t.solicitar - 6, txt: "Sin solicitar reportes", I: X, c: C.red },
                  { at: t.real - 8, txt: "Datos reales del negocio", I: Database, c: C.green },
                  { at: t.decidir - 10, txt: "Respuestas para decidir", I: Lightbulb, c: C.gold },
                ].map((x) => {
                  const p = prog(f, x.at, 14, EASE.back);
                  return (
                    <div key={x.txt} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px 14px 14px", borderRadius: 999, background: "#fff", boxShadow: SHADOW.deep, transform: `translateX(${(1 - p) * -80}px)`, opacity: Math.min(1, p), fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: C.navy, width: "fit-content" }}>
                      <div style={{ width: 54, height: 54, borderRadius: 27, background: x.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <x.I size={30} color="#fff" />
                      </div>
                      {x.txt}
                    </div>
                  );
                })}
              </div>
            </AbsoluteFill>
          )}
          {/* closing the excel files */}
          {f >= t.close - 4 && f < t.n8 + 20 && (
            <AbsoluteFill style={{ pointerEvents: "none" }}>
              {[0, 1, 2].map((k) => {
                const at = t.close + k * 6;
                const p = prog(f, at, 12, EASE.in);
                return (
                  <div key={k} style={{ position: "absolute", left: 300 + k * 90, top: 200 + k * 70, transform: `scale(${1 - p}) rotate(${(k - 1) * 3 + p * 10}deg)`, opacity: (1 - p) * prog(f, t.close - 4, 4), transformOrigin: "100% 0%" }}>
                    <div style={{ position: "relative" }}>
                      <Spreadsheet name={["ventas_centro_mayo.xlsx", "inventario_norte_v2.xlsx", "comisiones_FINAL.xlsx"][k]} width={620} rows={7} seed={k * 7 + 3} />
                      <div style={{ position: "absolute", right: 8, top: 6, width: 28, height: 28, borderRadius: 14, background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={18} color="#fff" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </AbsoluteFill>
          )}
          {/* see / analyze / decide */}
          {f >= t.verlo - 6 && f < t.stamp && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 70, pointerEvents: "none" }}>
              <div style={{ display: "flex", gap: 24 }}>
                {[
                  { at: t.verlo - 4, txt: "Verlo", I: Eye },
                  { at: t.analizarlo - 4, txt: "Analizarlo", I: BarChart3 },
                  { at: t.decisiones - 4, txt: "Decidir", I: Sparkles },
                ].map((x, i) => {
                  const p = prog(f, x.at, 12, EASE.back);
                  return (
                    <div key={x.txt} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 34px", borderRadius: 999, background: [C.navy, C.vzBlue, C.red][i], color: "#fff", fontFamily: FONT.display, fontWeight: 800, fontSize: 40, transform: `scale(${p})`, boxShadow: SHADOW.deep }}>
                      <x.I size={38} /> {x.txt}
                    </div>
                  );
                })}
              </div>
            </AbsoluteFill>
          )}
          {f >= t.stamp - 6 && (
            <AbsoluteFill style={{ background: `rgba(246,247,251,${0.94 * prog(f, t.stamp - 6, 8)})` }}>
              <StampLines at={t.stamp} lines={["VISIBILIDAD TOTAL.", "DECISIONES INTELIGENTES.", "CONTROL DEL NEGOCIO."]} />
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 120 }}>
                <FlagBar w={260} h={7} p={prog(f, t.stamp + 30, 20, EASE.out)} />
              </AbsoluteFill>
            </AbsoluteFill>
          )}
          <Flash at={t.flip} dur={14} color="#fff" max={0.9} />
        </AbsoluteFill>
      )}
      <ChapterTitle at={t.title - 10} end={t.titleEnd} num="03" kicker="EL DUEÑO" title="Ver el negocio completo" who="jose" />
    </AbsoluteFill>
  );
};

export const _s4 = { FileSpreadsheet, interpolate };
