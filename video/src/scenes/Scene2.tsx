import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { Search, Landmark, Calculator, MessageCircle, FileSpreadsheet, HelpCircle, Package, TrendingUp, Coins, Lock, Receipt, CheckCircle2, ShoppingCart, FileText, Printer, Clock, Smile } from "lucide-react";
import { C, F as FONT, SHADOW } from "../theme";
import { EASE, prog, rnd } from "../lib/anim";
import { F, FE, W } from "../timeline";
import { DarkBG, LightBG, Photo, Flash, FlagBar } from "../components/base";
import { ChapterTitle, PhoneFrame, ChatThread, ReceiptCard, Cursor, StampLines, Spreadsheet, CK } from "../components/motion";
import { Camera, CamKey } from "../components/camera";
import { Headline, Quote, Stamp, TimeBadge, Toast } from "../components/overlays";
import { LogoBadge } from "../components/Logo";
import { AppWindow, ProductThumb, ui } from "../ui/kit";
import { PageVenta } from "../ui/PageVenta";
import { PageValidador } from "../ui/PageValidador";
import { PageComisiones, Invoice } from "../ui/PageComisiones";
import { cue, Cue } from "../lib/scene";

const S = F("sc2") - 12;
const E = F("sc3") + 20;
const CH = 52; // window chrome height

const t = {
  title: F("title2"),
  titleEnd: FE("title2"),
  mont: F("s2_montage"),
  cli: F("D_CLIENTA"),
  cliEnd: FE("D_CLIENTA"),
  aquí: W("D_CLIENTA", "aquí"),
  and1: F("D_ANDREA1"),
  and1End: FE("D_ANDREA1"),
  sw: F("s2_switch"),
  n1: F("S2N1"),
  manuales: W("S2N1", "manuales"),
  comprobar: W("S2N1", "comprobar"),
  atender: W("S2N1", "atender"),
  disp: W("S2N1", "disponibilidad"),
  seg: W("S2N1", "seguimiento"),
  com: W("S2N1", "comisiones"),
  y: W("S2N1", "y", 40),
  captura: W("S2N1", "captura"),
  noNec: W("S2N1", "necesariamente"),
  dinero: W("S2N1", "dinero"),
  flip: F("s2_flip"),
  n2: F("S2N2"),
  n2End: FE("S2N2"),
  quien: W("S2N2", "quién"),
  sucursal: W("S2N2", "sucursal"),
  comprueba: W("S2N2", "comprueba"),
  dispo: W("S2N2", "disponibilidad"),
  calcula: W("S2N2", "calcula"),
  registra: W("S2N2", "registra"),
  numero: W("S2N2", "número"),
  una: W("S2N2", "una", 40),
  inventario: W("S2N2", "inventario"),
  comision: W("S2N2", "comisión"),
  val: F("s2_validator"),
  and2: F("D_ANDREA2"),
  and2End: FE("D_ANDREA2"),
  n3: F("S2N3"),
  todas: W("S2N3", "todas"),
  empresa: W("S2N3", "empresa"),
  otra: W("S2N3", "otra"),
  consultar: W("S2N3", "consultar"),
  introducir: W("S2N3", "introducir"),
  verificar: W("S2N3", "verificar"),
  asi: W("S2N3", "así"),
  pagada: W("S2N3", "pagada"),
  seguimiento: W("S2N3", "seguimiento"),
  n3End: FE("S2N3"),
  inv: F("s2_invoice"),
  n4: F("S2N4"),
  stamp: F("s2_stamp"),
  end: F("sc3"),
};

// Venta events
const vEv = {
  client: t.n2 + 18, type1: t.n2 + 30, row1: t.n2 + 48, type2: t.n2 + 56, row2: t.n2 + 74,
  highlightVendor: t.quien - 4, highlightSuc: t.sucursal - 4, stock: t.dispo - 4, qty: t.dispo + 12,
  totals: t.calcula - 2, confirm: t.registra + 14,
};
// Validador events
const valStart = t.val + 14;
const valEv = { order: valStart + 12, date: valStart + 30, bank: valStart + 44, amount: valStart + 58, press: valStart + 80, verifying: valStart + 82, success: t.and2 - 10, newRow: t.and2 + 20 };

export const sfx2: Cue[] = [
  cue(t.title - 10, "whoosh_deep", 0.55),
  cue(t.titleEnd - 12, "whoosh", 0.45),
  cue(t.mont + 2, "pop", 0.5),
  cue(t.mont + 8, "pop2", 0.5),
  cue(t.mont + 34, "paper", 0.3, 30),
  cue(t.mont + 70, "msg", 0.4),
  cue(t.mont + 100, "msg", 0.4),
  cue(t.mont + 128, "stamp", 0.5),
  cue(t.cli - 2, "msg", 0.45),
  cue(t.aquí - 2, "msg", 0.45),
  cue(t.and1 - 2, "pop", 0.4),
  cue(t.sw, "whoosh2", 0.35),
  cue(t.sw + 10, "click", 0.4),
  cue(t.sw + 20, "click2", 0.4),
  cue(t.sw + 30, "click", 0.4),
  cue(t.n1 + 2, "whoosh", 0.35),
  cue(t.comprobar - 4, "ticks", 0.3),
  cue(t.disp - 3, "pop", 0.45),
  cue(t.seg - 3, "pop2", 0.45),
  cue(t.com - 3, "pop", 0.45),
  cue(t.captura - 3, "whoosh2", 0.35),
  cue(t.noNec - 2, "glitch", 0.5),
  cue(t.noNec, "stamp", 0.55),
  cue(t.flip - 6, "riser", 0.4),
  cue(t.flip + 4, "impact", 0.5),
  cue(t.flip + 6, "shimmer", 0.4),
  cue(vEv.client, "click", 0.45),
  cue(vEv.type1, "typing", 0.3, 18),
  cue(vEv.row1 - 4, "click2", 0.4),
  cue(vEv.row1, "pop", 0.4),
  cue(vEv.type2, "typing", 0.3, 18),
  cue(vEv.row2 - 4, "click", 0.4),
  cue(vEv.row2, "pop2", 0.4),
  cue(vEv.highlightVendor, "data", 0.3),
  cue(vEv.stock, "pop", 0.35),
  cue(vEv.qty, "click2", 0.45),
  cue(vEv.totals, "ticks", 0.35),
  cue(vEv.confirm, "click", 0.55),
  cue(t.numero - 4, "success", 0.5),
  cue(t.inventario - 2, "pop", 0.45),
  cue(t.comision - 2, "pop2", 0.45),
  cue(t.val, "msg", 0.45),
  cue(t.val + 22, "click", 0.45),
  cue(valEv.order, "typing", 0.25, 12),
  cue(valEv.date - 4, "click2", 0.35),
  cue(valEv.bank - 4, "click", 0.35),
  cue(valEv.amount, "typing", 0.25, 12),
  cue(valEv.press, "click", 0.55),
  cue(valEv.success, "success", 0.6),
  cue(t.todas - 4, "whoosh", 0.35),
  cue(t.empresa - 2, "glitch", 0.25),
  cue(t.otra, "msg", 0.3),
  cue(t.consultar - 6, "whoosh2", 0.35),
  cue(t.pagada - 3, "pop", 0.4),
  cue(t.seguimiento - 3, "pop2", 0.4),
  cue(t.inv + 8, "click", 0.5),
  cue(t.inv + 12, "printer", 0.35, 50),
  cue(t.n4 - 6, "whoosh", 0.4),
  cue(t.n4 + 10, "click2", 0.4),
  cue(t.n4 + 30, "success", 0.35),
  cue(t.stamp + 2, "stamp", 0.6),
  cue(t.stamp + 16, "stamp", 0.6),
  cue(t.stamp + 30, "stamp", 0.6),
];

/* ───────── problem montage helpers ───────── */
const Tile: React.FC<{ at: number; x: number; y: number; w: number; h: number; children: React.ReactNode; rot?: number }> = ({ at, x, y, w, h, children, rot = 0 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14, EASE.back);
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.5)", transform: `scale(${0.6 + 0.4 * p}) rotate(${rot * (1 - p)}deg)`, opacity: Math.min(1, p * 1.5), background: "#111" }}>
      {children}
    </div>
  );
};

const TagLabel: React.FC<{ text: string; color?: string }> = ({ text, color = C.yellow }) => (
  <div style={{ position: "absolute", left: 18, bottom: 16, padding: "8px 16px", borderRadius: 12, background: "rgba(7,12,28,0.75)", color: "#fff", fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, borderLeft: `5px solid ${color}` }}>{text}</div>
);

/* ───────── App stage with camera + cursor ───────── */
const AppStage: React.FC<{ cam: CamKey[]; children: React.ReactNode; cursor?: CK[]; cursorShow?: [number, number] }> = ({ cam, children, cursor, cursorShow }) => (
  <Camera keys={cam} w={1720} h={1040 + CH}>
    <AppWindow width={1720} height={1040}>
      {children}
      {cursor && <Cursor keys={cursor} show={cursorShow} scale={1.1} />}
    </AppWindow>
  </Camera>
);

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S || f > E) return null;
  const problem = f < t.flip + 26;
  const sol = f >= t.flip;

  // ── camera for Venta page ──
  const camVenta: CamKey[] = [
    { f: t.flip, s: 0.6, x: 860, y: 600 },
    { f: t.n2, s: 0.92, x: 860, y: 560 },
    { f: t.n2 + 20, s: 1.12, x: 1000, y: 470 },
    { f: vEv.row2 + 10, s: 1.12, x: 1000, y: 520 },
    { f: t.quien - 10, s: 1.42, x: 760, y: 870 },
    { f: t.sucursal + 30, s: 1.42, x: 820, y: 870 },
    { f: t.comprueba - 4, s: 1.3, x: 980, y: 640 },
    { f: t.calcula - 6, s: 1.3, x: 980, y: 640 },
    { f: t.calcula + 4, s: 1.5, x: 1450, y: 850 },
    { f: vEv.confirm + 8, s: 1.45, x: 1450, y: 900 },
    { f: t.numero - 6, s: 0.84, x: 1080, y: 560 },
    { f: t.n2End + 30, s: 0.8, x: 1100, y: 560 },
  ];
  const curVenta: CK[] = [
    { f: t.n2, x: 900, y: 700 },
    { f: vEv.client - 6, x: 900, y: 320 },
    { f: vEv.client, x: 900, y: 320, click: true },
    { f: vEv.type1 - 6, x: 700, y: 400 },
    { f: vEv.type1, x: 700, y: 400, click: true },
    { f: vEv.row1 - 10, x: 800, y: 470 },
    { f: vEv.row1 - 4, x: 800, y: 470, click: true },
    { f: vEv.type2, x: 700, y: 400, click: true },
    { f: vEv.row2 - 10, x: 800, y: 470 },
    { f: vEv.row2 - 4, x: 800, y: 470, click: true },
    { f: vEv.qty - 10, x: 1119, y: 549 },
    { f: vEv.qty - 1, x: 1119, y: 549, click: true },
    { f: vEv.confirm - 14, x: 1483, y: 925 },
    { f: vEv.confirm, x: 1483, y: 925, click: true },
    { f: vEv.confirm + 40, x: 1560, y: 980 },
  ];
  // ── Validador ──
  const camVal: CamKey[] = [
    { f: t.val, s: 0.8, x: 860, y: 560 },
    { f: valStart + 8, s: 1.18, x: 660, y: 420 },
    { f: valEv.press + 4, s: 1.18, x: 700, y: 440 },
    { f: valEv.success - 4, s: 1.05, x: 1050, y: 420 },
    { f: t.and2End, s: 1.05, x: 1080, y: 420 },
    { f: t.todas - 8, s: 1.05, x: 860, y: 520 },
    { f: t.empresa, s: 1.25, x: 760, y: 480 },
    { f: t.consultar - 6, s: 1.25, x: 760, y: 480 },
    { f: t.consultar + 6, s: 1.25, x: 640, y: 330 },
    { f: t.introducir + 4, s: 1.25, x: 640, y: 460 },
    { f: t.verificar + 4, s: 1.1, x: 1100, y: 380 },
    { f: t.asi - 6, s: 1.1, x: 1100, y: 400 },
    { f: t.asi + 6, s: 1.3, x: 1100, y: 880 },
    { f: t.n3End + 30, s: 1.3, x: 1100, y: 880 },
  ];
  const curVal: CK[] = [
    { f: t.val + 4, x: 700, y: 700 },
    { f: t.val + 22, x: 167, y: 380, click: true },
    { f: valEv.order - 6, x: 600, y: 300 },
    { f: valEv.order - 2, x: 600, y: 300, click: true },
    { f: valEv.date - 6, x: 560, y: 405, click: true },
    { f: valEv.bank - 6, x: 860, y: 405, click: true },
    { f: valEv.amount - 6, x: 640, y: 520, click: true },
    { f: valEv.press - 8, x: 700, y: 614 },
    { f: valEv.press, x: 700, y: 614, click: true },
    { f: valEv.press + 30, x: 880, y: 760 },
  ];
  const inVal = f >= t.val && f < t.n4 - 8;
  const inCom = f >= t.n4 - 8;

  return (
    <AbsoluteFill>
      {/* ═════════ PROBLEM ═════════ */}
      {problem && (
        <AbsoluteFill>
          <DarkBG />
          {/* montage: the client wants 2 chairs + 1 table, Andrea checks prices, asks by chat... */}
          {f < t.cli - 4 && (
            <AbsoluteFill style={{ opacity: 1 - prog(f, t.cli - 10, 6) }}>
              <Tile at={t.mont} x={90} y={170} w={640} h={430}>
                <div style={{ width: "100%", height: "100%", background: "#fff", padding: 26, boxSizing: "border-box", fontFamily: FONT.ui }}>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, color: C.red }}>LA CLIENTA QUIERE</div>
                  {[["silla_ejecutiva", "Silla Ejecutiva", "× 2"], ["mesa_oficina", "Mesa de Oficina", "× 1"]].map(([img, n, q], i) => (
                    <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18, opacity: prog(f, t.mont + 4 + i * 6, 10) }}>
                      <ProductThumb src={img} size={110} />
                      <div style={{ fontSize: 30, fontWeight: 700, color: C.navy }}>{n}</div>
                      <div style={{ marginLeft: "auto", fontSize: 40, fontWeight: 900, color: C.navy }}>{q}</div>
                    </div>
                  ))}
                </div>
              </Tile>
              <Tile at={t.mont + 28} x={780} y={150} w={620} h={500} rot={4}>
                <Img src={staticFile("photos/sales_counter.jpg")} style={{ width: 1500, marginLeft: -880, marginTop: -40 }} />
                <div style={{ position: "absolute", left: 220 + Math.sin((f - t.mont) / 6) * 120, top: 140 + Math.cos((f - t.mont) / 7) * 60, width: 150, height: 150, borderRadius: 75, border: "8px solid #fff", boxShadow: "0 0 0 3px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,255,255,0.4)" }} />
                <TagLabel text="Buscando precios en la lista…" />
              </Tile>
              <Tile at={t.mont + 62} x={1450} y={80} w={400} h={840} rot={-4}>
                <PhoneFrame width={400} height={840}>
                  <ChatThread
                    name="Almacén Centro"
                    status="escribiendo…"
                    avatarColor="#0F766E"
                    msgs={[
                      { at: t.mont + 70, side: "out", text: "¿Todavía hay 2 sillas ejecutivas disponibles?", time: "10:14" },
                      { at: t.mont + 100, side: "in", text: "Déjame confirmar con Luis 🤔", time: "10:19", typingFrom: t.mont + 84 },
                      { at: t.mont + 118, side: "in", text: "Sí, quedan. ¿Te las aparto?", time: "10:26", typingFrom: t.mont + 108 },
                    ]}
                  />
                </PhoneFrame>
              </Tile>
              <div style={{ position: "absolute", left: 90, top: 650 }}>
                <TimeBadge at={t.mont + 20} from={2} to={25} dur={120} />
              </div>
              <div style={{ position: "absolute", left: 520, top: 760, opacity: prog(f, t.mont + 128, 8) }}>
                <Stamp at={t.mont + 128} text="VENTA CONCRETADA" color="#4ADE80" icon="warn" rot={-6} size={52} />
              </div>
            </AbsoluteFill>
          )}
          {/* client sends transfer receipt */}
          {f >= t.cli - 8 && f < t.n1 + 4 && (
            <AbsoluteFill style={{ opacity: 1 - prog(f, t.n1 - 4, 8) }}>
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${-300 * prog(f, t.sw, 14, EASE.inOut)}px) scale(${1 - 0.1 * prog(f, t.sw, 14, EASE.inOut)})` }}>
                <div style={{ transform: `translateY(${(1 - prog(f, t.cli - 8, 14, EASE.out)) * 700}px)` }}>
                  <PhoneFrame width={470} height={940}>
                    <ChatThread
                      name="María Rodríguez"
                      status="en línea"
                      avatarColor="#7C3AED"
                      receipt={{ amount: "$487.20", bank: "Banco Provincial", date: "15/06/2026 · 10:24 a.m." }}
                      msgs={[
                        { at: t.cli, side: "in", text: "Listo, Andrea. Ya te hice la transferencia.", time: "10:24" },
                        { at: t.aquí, side: "in", text: "Aquí te envío el comprobante.", time: "10:24" },
                        { at: t.aquí + 12, side: "in", receipt: true, time: "10:24" },
                        { at: t.and1 + 4, side: "out", text: "Perfecto, muchas gracias. Voy a verificar que haya llegado el pago.", time: "10:25", typingFrom: t.and1 - 6 },
                      ]}
                    />
                  </PhoneFrame>
                </div>
              </AbsoluteFill>
              {/* speaker labels */}
              <div style={{ position: "absolute", left: 140, top: 380, opacity: interpolate(f, [t.cli, t.cli + 8, t.cliEnd, t.cliEnd + 8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: FONT.ui, color: "#fff" }}>
                <div style={{ fontSize: 22, letterSpacing: 4, color: "#C4B5FD", fontWeight: 700 }}>LA CLIENTA</div>
                <div style={{ fontSize: 54, fontWeight: 800, fontFamily: FONT.display, maxWidth: 520, lineHeight: 1.05 }}>“Ya te hice la transferencia.”</div>
              </div>
              <div style={{ position: "absolute", right: 120, top: 380, textAlign: "right", opacity: interpolate(f, [t.and1, t.and1 + 8, t.and1End, t.and1End + 8], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontFamily: FONT.ui, color: "#fff" }}>
                <div style={{ fontSize: 22, letterSpacing: 4, color: "#FF8A8A", fontWeight: 700 }}>ANDREA</div>
                <div style={{ fontSize: 54, fontWeight: 800, fontFamily: FONT.display, maxWidth: 560, lineHeight: 1.05 }}>“Voy a verificar que haya llegado el pago.”</div>
              </div>
              {/* app switching */}
              {f >= t.sw && (
                <div style={{ position: "absolute", right: 120, top: 210, width: 820, height: 620 }}>
                  {[
                    { I: Landmark, n: "Banca en línea", c: "#0E3B8C" },
                    { I: MessageCircle, n: "Chats (37)", c: "#16A34A" },
                    { I: FileSpreadsheet, n: "ventas_junio.xlsx", c: "#1E7145" },
                    { I: Calculator, n: "Calculadora", c: "#F59E0B" },
                    { I: HelpCircle, n: "¿Comisión?", c: C.red },
                  ].map((w, i) => {
                    const at = t.sw + i * 7;
                    const p = prog(f, at, 10, EASE.back);
                    if (f < at) return null;
                    return (
                      <div key={i} style={{ position: "absolute", left: i * 60, top: i * 70, width: 560, height: 330, borderRadius: 22, background: "#fff", boxShadow: "0 30px 70px rgba(0,0,0,0.5)", transform: `scale(${0.7 + 0.3 * p}) rotate(${(i - 2) * 2}deg)`, opacity: p, overflow: "hidden", fontFamily: FONT.ui }}>
                        <div style={{ height: 64, background: w.c, color: "#fff", display: "flex", alignItems: "center", gap: 14, padding: "0 22px", fontSize: 26, fontWeight: 700 }}>
                          <w.I size={30} /> {w.n}
                        </div>
                        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
                          {[0, 1, 2, 3].map((r) => (
                            <div key={r} style={{ height: 22, borderRadius: 6, background: "#EEF0F4", width: `${50 + rnd(i * 9 + r) * 50}%` }} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </AbsoluteFill>
          )}
          {/* narrator S2N1 visuals */}
          {f >= t.n1 - 4 && (
            <AbsoluteFill>
              {/* manual records */}
              {f < t.comprobar && (
                <AbsoluteFill style={{ opacity: prog(f, t.n1 - 4, 8) * (1 - prog(f, t.comprobar - 6, 6)) }}>
                  <Photo src="photos/sales_counter.jpg" start={t.n1} dur={120} from={{ s: 1.35, x: 120, y: 60 }} to={{ s: 1.15, x: 0, y: 0 }} grade="saturate(0.6) brightness(0.55)" />
                  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                    <Headline at={t.n1 + 4} text="Registros manuales" size={130} accentWord="manuales" />
                  </AbsoluteFill>
                </AbsoluteFill>
              )}
              {/* time bars */}
              {f >= t.comprobar - 6 && f < t.disp - 4 && (
                <AbsoluteFill style={{ padding: "0 220px", justifyContent: "center", gap: 50, opacity: prog(f, t.comprobar - 6, 8) * (1 - prog(f, t.disp - 10, 6)) }}>
                  {[
                    { l: "Comprobando información", w: 0.92, c: C.red, at: t.comprobar - 4, I: Search },
                    { l: "Atendiendo clientes", w: 0.24, c: "#4ADE80", at: t.atender - 4, I: Smile },
                  ].map((x) => {
                    const p = prog(f, x.at, 30, EASE.out);
                    return (
                      <div key={x.l} style={{ opacity: prog(f, x.at, 8) }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FONT.display, fontWeight: 800, fontSize: 52, color: "#fff" }}>
                          <x.I size={50} color={x.c} /> {x.l}
                        </div>
                        <div style={{ marginTop: 18, height: 42, borderRadius: 21, background: "rgba(255,255,255,0.08)" }}>
                          <div style={{ width: `${x.w * 100 * p}%`, height: "100%", borderRadius: 21, background: x.c, boxShadow: `0 0 30px ${x.c}88` }} />
                        </div>
                      </div>
                    );
                  })}
                </AbsoluteFill>
              )}
              {/* three difficulties */}
              {f >= t.disp - 8 && f < t.y && (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - prog(f, t.y - 8, 8) }}>
                  <div style={{ display: "flex", gap: 40 }}>
                    {[
                      { at: t.disp - 6, I: Package, l: "Disponibilidad", s: "¿Hay en stock?" },
                      { at: t.seg - 6, I: TrendingUp, l: "Seguimiento", s: "¿Cómo van mis ventas?" },
                      { at: t.com - 6, I: Coins, l: "Comisiones", s: "¿Cuánto he generado?" },
                    ].map((x, i) => {
                      const p = prog(f, x.at, 14, EASE.back);
                      return (
                        <div key={i} style={{ width: 460, height: 460, borderRadius: 40, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.14)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, transform: `translateY(${(1 - p) * 80}px) scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p), position: "relative" }}>
                          <div style={{ position: "absolute", top: 26, right: 30, width: 70, height: 70, borderRadius: 35, background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontWeight: 900, fontSize: 44, transform: `rotate(${Math.sin((f - x.at) / 5) * 10}deg)` }}>?</div>
                          <x.I size={120} color="#fff" strokeWidth={1.4} />
                          <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 52, color: "#fff" }}>{x.l}</div>
                          <div style={{ fontFamily: FONT.ui, fontSize: 28, color: "rgba(255,255,255,0.65)" }}>{x.s}</div>
                        </div>
                      );
                    })}
                  </div>
                </AbsoluteFill>
              )}
              {/* screenshot ≠ money */}
              {f >= t.y - 6 && (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: prog(f, t.y - 6, 8) * (1 - prog(f, t.flip + 2, 6)) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
                    <div style={{ width: 500, height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ transform: `scale(${1.75 + 0.1 * prog(f, t.captura, 60)}) rotate(-4deg)`, filter: f >= t.noNec && Math.floor(f / 3) % 4 === 0 ? "hue-rotate(160deg) saturate(2)" : undefined }}>
                        <ReceiptCard amount="$487.20" bank="Banco Provincial" date="15/06/2026 · 10:24 a.m." />
                      </div>
                    </div>
                    <div style={{ opacity: prog(f, t.noNec - 4, 10), transform: `translateX(${(1 - prog(f, t.noNec - 4, 16, EASE.out)) * 60}px)` }}>
                      <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 84, color: "#fff", lineHeight: 1 }}>
                        Una captura
                        <br />
                        <span style={{ color: C.red2 }}>≠</span> dinero recibido
                      </div>
                      <div style={{ marginTop: 34 }}>
                        <Stamp at={t.dinero - 2} text="SIN VERIFICAR" size={56} />
                      </div>
                    </div>
                  </div>
                </AbsoluteFill>
              )}
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* ═════════ SOLUTION ═════════ */}
      {sol && (
        <AbsoluteFill style={{ clipPath: `circle(${prog(f, t.flip, 22, EASE.inOut) * 120}% at 50% 50%)` }}>
          <LightBG />
          {/* app stage */}
          {f < t.val + 2 && (
            <AppStage cam={camVenta} cursor={curVenta} cursorShow={[t.n2, t.val]}>
              <PageVenta ev={vEv} />
            </AppStage>
          )}
          {inVal && (
            <AppStage cam={camVal} cursor={curVal} cursorShow={[t.val + 2, t.and2 + 20]}>
              <PageValidador ev={valEv} />
              {/* company-wide sales wall (what she does NOT need to check) */}
              {f >= t.todas - 8 && f < t.consultar && (
                <AbsoluteFill style={{ background: `rgba(246,247,251,${0.92 * prog(f, t.todas - 8, 10)})`, opacity: 1 - prog(f, t.consultar - 8, 8), padding: 60, display: "flex", flexWrap: "wrap", gap: 12, alignContent: "flex-start" }}>
                  {Array.from({ length: 77 }).map((_, i) => {
                    const mine = i === 24;
                    const p = prog(f, t.todas - 6 + (i % 14), 8);
                    return (
                      <div key={i} style={{ width: 222, height: 74, borderRadius: 12, background: mine ? "#fff" : "#E9ECF3", border: mine ? `3px solid ${C.red}` : "none", display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontFamily: FONT.ui, fontSize: 19, color: mine ? C.navy : "#A0A7B8", opacity: p, filter: mine || f < t.empresa ? undefined : "blur(2px)", transform: mine && f >= t.empresa ? "scale(1.25)" : undefined, zIndex: mine ? 2 : 1, boxShadow: mine ? SHADOW.float : undefined }}>
                        {mine ? <ShoppingCart size={20} color={C.red} /> : <Lock size={16} />}
                        {mine ? <b>Venta #4588</b> : `Venta #${4100 + i * 7}`}
                      </div>
                    );
                  })}
                </AbsoluteFill>
              )}
            </AppStage>
          )}
          {inCom && (
            <AppStage
              cam={[
                { f: t.n4 - 8, s: 0.78, x: 860, y: 560 },
                { f: t.n4 + 20, s: 1.0, x: 1000, y: 470 },
                { f: t.n4 + 70, s: 1.15, x: 1100, y: 620 },
                { f: t.stamp, s: 1.0, x: 900, y: 520 },
              ]}
              cursor={[{ f: t.n4 - 8, x: 600, y: 700 }, { f: t.n4 + 8, x: 167, y: 441 }, { f: t.n4 + 10, x: 167, y: 441, click: true }, { f: t.n4 + 40, x: 900, y: 760 }]}
              cursorShow={[t.n4 - 6, t.n4 + 50]}
            >
              <PageComisiones chartAt={t.n4 + 12} newSale={t.n4 + 26} />
            </AppStage>
          )}
          {/* sale registered toast + consequences */}
          <Toast at={t.numero - 4} out={t.val - 6} title="Venta #4588 registrada" sub="Andrea · Sucursal Centro · 15/06/2026" x={1390} y={70} width={500} />
          <Toast at={t.inventario - 2} out={t.val - 6} title="Inventario actualizado" sub="Silla Ejecutiva 12 → 10 · Mesa de Oficina 8 → 7" color={C.vzBlue} icon={<Package size={30} color="#fff" />} x={1390} y={190} width={500} />
          <Toast at={t.comision - 2} out={t.val - 6} title="Comisión calculada: +$42.00" sub="Asignada automáticamente a Andrea" color={C.amber} icon={<Coins size={30} color="#fff" />} x={1390} y={310} width={500} />
          {/* incoming transfer notification */}
          <Toast at={t.val - 2} out={t.val + 40} title="María Rodríguez" sub="Te envió un comprobante de transferencia" color="#7C3AED" icon={<Receipt size={30} color="#fff" />} x={1300} y={70} />
          {/* Andrea's line */}
          <Quote who="andrea" text="¡Perfecto! Ya tengo confirmado el pago de esta venta." at={t.and2} end={t.and2End} />
          {/* "no depende de otra persona" */}
          {f >= t.otra - 4 && f < t.consultar - 4 && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - prog(f, t.consultar - 10, 6) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 40px", borderRadius: 30, background: "#fff", boxShadow: SHADOW.deep, transform: `scale(${prog(f, t.otra - 4, 12, EASE.back)})`, fontFamily: FONT.ui, position: "relative" }}>
                <MessageCircle size={44} color={C.text2} />
                <span style={{ fontSize: 40, fontWeight: 600, color: C.text2 }}>“¿Me confirmas si llegó el pago?”</span>
                <div style={{ position: "absolute", left: 20, right: 20, top: "50%", height: 8, borderRadius: 4, background: C.red, transform: `scaleX(${prog(f, t.otra + 14, 10, EASE.out)})`, transformOrigin: "left" }} />
              </div>
            </AbsoluteFill>
          )}
          {/* invoice */}
          {f >= t.inv - 6 && f < t.n4 + 4 && (
            <AbsoluteFill style={{ background: `rgba(14,27,61,${0.35 * prog(f, t.inv - 6, 8)})`, alignItems: "center", justifyContent: "center", opacity: 1 - prog(f, t.n4 - 6, 8) }}>
              <div style={{ position: "absolute", left: 300, top: 330, transform: `scale(${prog(f, t.inv - 6, 12, EASE.back)})` }}>
                <div style={{ width: 520, padding: "28px 30px", borderRadius: 26, background: "#fff", boxShadow: SHADOW.deep, fontFamily: FONT.ui }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <CheckCircle2 size={40} color={C.green} />
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>Venta #4588</div>
                      <div style={{ fontSize: 18, color: C.text2 }}>Pagada · $487.20</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px 0", borderRadius: 14, background: C.navy, color: "#fff", fontWeight: 700, fontSize: 22, transform: `scale(${1 - 0.06 * interpolate(f, [t.inv + 6, t.inv + 9, t.inv + 14], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
                    <FileText size={24} /> Generar factura
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 900, top: 140, transform: `translateY(${(1 - prog(f, t.inv + 12, 22, EASE.out)) * 900}px) rotate(${3 - 3 * prog(f, t.inv + 12, 22)}deg)` }}>
                <Invoice width={700} />
              </div>
            </AbsoluteFill>
          )}
          {/* stamp lines */}
          {f >= t.stamp - 6 && (
            <AbsoluteFill style={{ background: `rgba(246,247,251,${0.94 * prog(f, t.stamp - 6, 8)})` }}>
              <StampLines at={t.stamp} lines={["VENTAS REGISTRADAS.", "COMISIONES CONTROLADAS.", "PAGOS VERIFICADOS."]} />
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 120 }}>
                <FlagBar w={260} h={7} p={prog(f, t.stamp + 30, 20, EASE.out)} />
              </AbsoluteFill>
            </AbsoluteFill>
          )}
          <Flash at={t.flip} dur={14} color="#fff" max={0.9} />
          {f >= t.flip - 2 && f < t.n2 + 6 && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - prog(f, t.n2 - 4, 8) }}>
              <div style={{ transform: `scale(${0.6 + 0.4 * prog(f, t.flip, 16, EASE.back)})` }}>
                <LogoBadge size={260} />
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      <ChapterTitle at={t.title - 10} end={t.titleEnd} num="01" kicker="LA VENDEDORA" title="Vender sin perder el control" who="andrea" />
    </AbsoluteFill>
  );
};

export const _s2 = { Clock, Printer };
