import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { Package, Unlink, Clock, AlertTriangle, FileWarning, MapPin, Building2, X, Link2, Truck, ClipboardList, CheckCircle2, Search, Phone } from "lucide-react";
import { C, F as FONT, SHADOW } from "../theme";
import { EASE, prog, rnd } from "../lib/anim";
import { F, FE, W } from "../timeline";
import { DarkBG, LightBG, Photo, Flash, FlagBar, Clip } from "../components/base";
import { ChapterTitle, CallCard, Cursor, StampLines, Spreadsheet, CK } from "../components/motion";
import { Camera, CamKey } from "../components/camera";
import { Headline, Quote } from "../components/overlays";
import { AppWindow } from "../ui/kit";
import { PageRecepcion, PageTransfer, PageInventario } from "../ui/PagesGerente";
import { cue, Cue } from "../lib/scene";

const S = F("sc3") - 12;
const E = F("sc4") + 20;
const CH = 52;

const t = {
  title: F("title3"), titleEnd: FE("title3"),
  intro: F("s3_intro"),
  emp: F("D_EMP"), empEnd: FE("D_EMP"), cincuenta: W("D_EMP", "50"), donde: W("D_EMP", "dónde"),
  docs: F("s3_docs"), ring: F("s3_ring"),
  suc1: F("D_SUC1"), suc1End: FE("D_SUC1"),
  car: F("D_CARLOS"), carEnd: FE("D_CARLOS"),
  chaos: F("s3_chaos"),
  n1: F("S3N1"), control: W("S3N1", "control"),
  recepciones: W("S3N1", "recepciones"), separado: W("S3N1", "separado"),
  diferencias: W("S3N1", "diferencias"), retrasos: W("S3N1", "retrasos"), incompleta: W("S3N1", "incompleta"),
  mercancia: W("S3N1", "mercancía"), quedo: W("S3N1", "quedó"),
  otra: W("S3N1", "otra"), almacen: W("S3N1", "almacén"), mano: W("S3N1", "mano"),
  flip: F("s3_flip"),
  n2: F("S3N2"), n2End: FE("S3N2"),
  cada: W("S3N2", "cada"), orden: W("S3N2", "orden"), proveedor: W("S3N2", "proveedor"), sucursal: W("S3N2", "sucursal"), ubicacion: W("S3N2", "ubicación"),
  diferencia: W("S3N2", "diferencia"), excepcion: W("S3N2", "excepción"), gerente: W("S3N2", "gerente"),
  documentada: W("S3N2", "documentada"), inventario: W("S3N2", "inventario"),
  ring2: F("s3_ring2"), suc2: F("D_SUC2"), suc2End: FE("D_SUC2"),
  trOpen: F("s3_transfer_open"),
  n3: F("S3N3"), n3End: FE("S3N3"), valida: W("S3N3", "valida"), origen: W("S3N3", "origen"), destino: W("S3N3", "destino"), mantiene: W("S3N3", "mantiene"), registro: W("S3N3", "registro"),
  conocer: W("S3N3", "conocer"), movimientos: W("S3N3", "movimientos"),
  n4: F("S3N4"), perseguir: W("S3N4", "perseguir"), disponible: W("S3N4", "disponible"),
  stamp: F("s3_stamp"),
};

const recEv = { oc: t.n2 + 40, qty: t.cada + 6, diff: t.diferencia - 2, exception: t.excepcion - 4, loc: t.ubicacion - 2, confirm: t.documentada - 22, done: t.documentada - 14, inv: t.inventario - 4 };
const trEv = { origin: t.n3 + 26, dest: t.n3 + 44, product: t.n3 + 82, qty: t.n3 + 96, validate: t.valida - 2, hlOrigin: t.origen - 4, hlDest: t.destino - 4, press: t.mantiene - 6, record: t.mantiene + 2, moves: t.registro + 6 };

export const sfx3: Cue[] = [
  cue(t.title - 10, "whoosh_deep", 0.55),
  cue(t.titleEnd - 12, "whoosh", 0.45),
  cue(t.intro + 6, "box", 0.6),
  cue(t.intro + 30, "box", 0.45),
  cue(t.cincuenta - 3, "pop", 0.45),
  cue(t.docs, "paper", 0.45, 36),
  cue(t.ring, "phone_ring", 0.55),
  cue(t.suc1 - 6, "call_beep", 0.3, 12),
  cue(t.chaos, "glitch", 0.45),
  cue(t.chaos + 6, "msg", 0.35),
  cue(t.n1, "whoosh", 0.35),
  cue(t.recepciones - 4, "paper", 0.3, 20),
  cue(t.separado - 2, "glitch", 0.35),
  cue(t.diferencias - 2, "stamp", 0.5),
  cue(t.retrasos - 2, "stamp", 0.5),
  cue(t.incompleta - 8, "stamp", 0.5),
  cue(t.mercancia - 4, "data", 0.35),
  cue(t.quedo - 4, "glitch", 0.3),
  cue(t.otra - 4, "whoosh2", 0.35),
  cue(t.mano - 8, "glitch", 0.45),
  cue(t.flip - 6, "riser", 0.4),
  cue(t.flip + 4, "impact", 0.5),
  cue(t.flip + 6, "shimmer", 0.4),
  cue(recEv.oc - 2, "click", 0.45),
  cue(recEv.qty, "typing", 0.3, 10),
  cue(t.orden - 2, "pop", 0.4),
  cue(t.proveedor - 2, "pop2", 0.4),
  cue(t.sucursal - 2, "pop", 0.4),
  cue(t.ubicacion - 4, "click2", 0.4),
  cue(t.ubicacion - 2, "pop2", 0.4),
  cue(recEv.exception, "glitch", 0.35),
  cue(recEv.exception + 2, "pop", 0.45),
  cue(recEv.confirm, "click", 0.55),
  cue(recEv.done, "success", 0.55),
  cue(recEv.inv, "ticks", 0.3),
  cue(t.ring2, "phone_ring", 0.5),
  cue(t.suc2 - 6, "call_beep", 0.25, 12),
  cue(t.trOpen + 4, "click", 0.45),
  cue(trEv.origin - 2, "click2", 0.4),
  cue(trEv.dest - 2, "click", 0.4),
  cue(trEv.product - 14, "typing", 0.25, 12),
  cue(trEv.product, "pop", 0.4),
  cue(trEv.qty, "ticks", 0.3),
  cue(trEv.validate, "success", 0.35),
  cue(trEv.press, "click", 0.55),
  cue(trEv.record, "data", 0.4),
  cue(trEv.moves, "pop", 0.4),
  cue(trEv.moves + 8, "pop2", 0.4),
  cue(t.n4 - 10, "whoosh", 0.4),
  cue(t.perseguir - 2, "glitch", 0.3),
  cue(t.disponible - 2, "success", 0.35),
  cue(t.stamp + 2, "stamp", 0.6),
  cue(t.stamp + 16, "stamp", 0.6),
  cue(t.stamp + 30, "stamp", 0.6),
];

const AppStage: React.FC<{ cam: CamKey[]; children: React.ReactNode; cursor?: CK[]; cursorShow?: [number, number]; extra?: React.ReactNode }> = ({ cam, children, cursor, cursorShow, extra }) => (
  <Camera keys={cam} w={1720} h={1040 + CH}>
    <AppWindow width={1720} height={1040}>
      {children}
      {cursor && <Cursor keys={cursor} show={cursorShow} scale={1.1} />}
    </AppWindow>
    {extra}
  </Camera>
);

const RedTag: React.FC<{ at: number; text: string; I: React.ElementType }> = ({ at, text, I }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const sc = interpolate(f, [at, at + 5, at + 10], [1.8, 0.95, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 34px", borderRadius: 24, background: C.red, color: "#fff", fontFamily: FONT.display, fontWeight: 900, fontSize: 56, transform: `scale(${sc}) rotate(${-2 + rnd(at) * 4}deg)`, boxShadow: "0 20px 60px rgba(214,40,40,0.45)", opacity: prog(f, at, 4) }}>
      <I size={54} /> {text}
    </div>
  );
};

/** Top-down warehouse map with a lost box */
const LostBox: React.FC<{ at: number; lostAt: number }> = ({ at, lostAt }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 50, EASE.inOut);
  const path = [[180, 820], [520, 820], [520, 300], [980, 300], [980, 640], [1380, 640]];
  // position along path
  const segs = path.slice(1).map((pt, i) => Math.hypot(pt[0] - path[i][0], pt[1] - path[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let d = p * total;
  let pos = path[0];
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const k = d / segs[i];
      pos = [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k];
      break;
    }
    d -= segs[i];
    pos = path[i + 1];
  }
  const lost = prog(f, lostAt, 14);
  return (
    <AbsoluteFill style={{ opacity: prog(f, at - 6, 8) }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 6 }).map((_, c) =>
          Array.from({ length: 3 }).map((_, r) => (
            <rect key={`${c}-${r}`} x={300 + c * 230} y={170 + r * 260} width={150} height={190} rx={12} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth={2} />
          )),
        )}
        <rect x={60} y={760} width={200} height={140} rx={14} fill="rgba(244,180,0,0.12)" stroke={C.yellow} strokeWidth={3} strokeDasharray="10 8" />
        <text x={160} y={930} textAnchor="middle" fill={C.yellow} fontFamily={FONT.ui} fontWeight={700} fontSize={24}>MUELLE</text>
        <polyline points={path.map((q) => q.join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeDasharray="14 12" />
      </svg>
      <div style={{ position: "absolute", left: pos[0] - 45, top: pos[1] - 45, width: 90, height: 90, borderRadius: 18, background: "#C89A5B", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(0,0,0,0.5)", opacity: 1 - lost }}>
        <Package size={54} color="#fff" />
      </div>
      {lost > 0 &&
        [[375, 265], [835, 525], [1295, 265], [605, 785], [1525, 785], [1065, 785]].map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x - 40, top: y - 50, width: 80, height: 80, borderRadius: 40, background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontWeight: 900, fontSize: 52, transform: `scale(${prog(f, lostAt + i * 3, 10, EASE.back)})` }}>?</div>
        ))}
    </AbsoluteFill>
  );
};

const BranchLink: React.FC<{ at: number; brokeAt: number }> = ({ at, brokeAt }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14, EASE.back);
  const line = prog(f, at + 10, 30, EASE.inOut);
  const broke = prog(f, brokeAt, 10, EASE.back);
  const Node: React.FC<{ x: number; name: string; sub: string; c: string; need?: boolean }> = ({ x, name, sub, c, need }) => (
    <div style={{ position: "absolute", left: x, top: 330, width: 440, transform: `scale(${1.25 * p})`, transformOrigin: "center", fontFamily: FONT.ui }}>
      <div style={{ padding: "30px 32px", borderRadius: 32, background: "rgba(255,255,255,0.06)", border: `2px solid ${c}`, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 38, fontWeight: 800 }}>
          <Building2 size={44} color={c} /> {name}
        </div>
        <div style={{ fontSize: 28, opacity: 0.75, marginTop: 10 }}>{sub}</div>
        {need && <div style={{ marginTop: 16, fontSize: 30, fontWeight: 800, color: "#FF8A8A" }}>Necesita 10 sillas ejecutivas</div>}
        {!need && <div style={{ marginTop: 16, fontSize: 30, fontWeight: 800, color: "#86EFAC" }}>Tiene disponibilidad</div>}
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={620} y1={540} x2={620 + 680 * line} y2={540} stroke="rgba(255,255,255,0.4)" strokeWidth={5} strokeDasharray="16 12" />
      </svg>
      <Node x={180} name="Sucursal Sur" sub="Solicita mercancía" c={C.red} need />
      <Node x={1300} name="Sucursal Norte" sub="Otro almacén" c="#8FB0FF" />
      {broke > 0 && (
        <div style={{ position: "absolute", left: 960 - 70, top: 540 - 70, width: 140, height: 140, borderRadius: 70, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${broke})`, boxShadow: "0 20px 60px rgba(214,40,40,0.5)" }}>
          <Unlink size={72} color="#fff" />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: FONT.display, fontWeight: 900, fontSize: 60, color: "#fff", opacity: broke }}>
        La información <span style={{ color: C.red2 }}>no está a la mano</span>
      </div>
    </AbsoluteFill>
  );
};

/** callout chip in canvas space (moves with camera) */
const LinkChip: React.FC<{ at: number; x: number; y: number; label: string; value: string; I: React.ElementType; c: string; fromX: number; fromY: number; out: number }> = ({ at, x, y, label, value, I, c, fromX, fromY, out }) => {
  const f = useCurrentFrame();
  if (f < at || f > out + 12) return null;
  const p = prog(f, at, 14, EASE.back);
  const o = 1 - prog(f, out, 10);
  const lp = prog(f, at, 12, EASE.out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <svg width={1720} height={1100} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M${fromX} ${fromY} C ${fromX} ${(fromY + y) / 2}, ${x + 30} ${(fromY + y) / 2}, ${x + 30} ${y}`} stroke={c} strokeWidth={3} fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - lp} />
        <circle cx={fromX} cy={fromY} r={7} fill={c} />
      </svg>
      <div style={{ position: "absolute", left: x, top: y, transform: `scale(${p})`, transformOrigin: "30px 0", display: "flex", alignItems: "center", gap: 14, padding: "14px 22px 14px 14px", borderRadius: 18, background: "#fff", boxShadow: SHADOW.deep, border: `2px solid ${c}`, fontFamily: FONT.ui, whiteSpace: "nowrap" }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: c, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I size={26} color="#fff" />
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 15, color: C.text2, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 21, fontWeight: 800, color: C.navy }}>{value}</div>
        </div>
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S || f > E) return null;
  const problem = f < t.flip + 26;
  const sol = f >= t.flip;

  const camRec: CamKey[] = [
    { f: t.flip, s: 0.6, x: 860, y: 600 },
    { f: t.n2, s: 0.9, x: 860, y: 560 },
    { f: recEv.oc - 10, s: 1.05, x: 760, y: 420 },
    { f: t.cada - 6, s: 1.05, x: 900, y: 420 },
    { f: t.cada + 10, s: 1.0, x: 1000, y: 520 },
    { f: t.diferencia - 10, s: 1.0, x: 1000, y: 520 },
    { f: t.diferencia + 6, s: 1.35, x: 1350, y: 480 },
    { f: t.gerente + 10, s: 1.35, x: 1350, y: 500 },
    { f: recEv.confirm - 8, s: 1.1, x: 1200, y: 600 },
    { f: recEv.done + 6, s: 0.95, x: 900, y: 560 },
    { f: t.ring2 + 10, s: 0.85, x: 860, y: 560 },
  ];
  const curRec: CK[] = [
    { f: t.n2, x: 700, y: 700 },
    { f: recEv.oc - 8, x: 560, y: 345 },
    { f: recEv.oc - 2, x: 560, y: 345, click: true },
    { f: recEv.qty - 8, x: 1437, y: 372 },
    { f: recEv.qty - 2, x: 1437, y: 372, click: true },
    { f: recEv.loc - 10, x: 560, y: 590 },
    { f: recEv.loc - 2, x: 560, y: 590, click: true },
    { f: recEv.confirm - 10, x: 1560, y: 628 },
    { f: recEv.confirm, x: 1560, y: 628, click: true },
    { f: recEv.confirm + 30, x: 1300, y: 800 },
  ];
  const camTr: CamKey[] = [
    { f: t.trOpen, s: 0.85, x: 860, y: 560 },
    { f: t.n3 + 10, s: 1.1, x: 760, y: 420 },
    { f: trEv.product - 20, s: 1.1, x: 900, y: 420 },
    { f: trEv.validate - 6, s: 1.05, x: 1000, y: 440 },
    { f: t.origen - 8, s: 1.2, x: 560, y: 380 },
    { f: t.destino + 6, s: 1.2, x: 560, y: 440 },
    { f: trEv.press - 10, s: 1.0, x: 1100, y: 560 },
    { f: trEv.moves + 10, s: 1.05, x: 1000, y: 720 },
    { f: t.n3End + 20, s: 1.05, x: 1000, y: 720 },
  ];
  const curTr: CK[] = [
    { f: t.trOpen, x: 600, y: 700 },
    { f: t.trOpen + 4, x: 167, y: 441, click: true },
    { f: trEv.origin - 8, x: 500, y: 267 },
    { f: trEv.origin - 2, x: 500, y: 267, click: true },
    { f: trEv.dest - 8, x: 500, y: 425 },
    { f: trEv.dest - 2, x: 500, y: 425, click: true },
    { f: trEv.product - 18, x: 900, y: 254, click: true },
    { f: trEv.qty - 8, x: 1340, y: 330 },
    { f: trEv.qty, x: 1340, y: 330, click: true },
    { f: trEv.qty + 8, x: 1340, y: 330, click: true },
    { f: trEv.qty + 16, x: 1340, y: 330, click: true },
    { f: trEv.press - 10, x: 1555, y: 527 },
    { f: trEv.press, x: 1555, y: 527, click: true },
    { f: trEv.press + 40, x: 1400, y: 900 },
  ];
  const inRec = f < t.trOpen;
  const inTr = f >= t.trOpen && f < t.n4 - 8;
  const inInv = f >= t.n4 - 8;

  return (
    <AbsoluteFill>
      {problem && (
        <AbsoluteFill>
          <DarkBG />
          {/* delivery at the dock */}
          {f < t.n1 + 2 && (
            <AbsoluteFill>
              <Clip name="dock_slow" from={t.intro} dur={700} zoom={[1.0, 1.12]} grade="brightness(0.75) saturate(0.9)" overlay="linear-gradient(180deg, rgba(7,12,28,0.2) 0%, rgba(7,12,28,0.75) 100%)" />
              <div style={{ position: "absolute", left: 110, top: 120, opacity: prog(f, t.intro + 8, 10) * (1 - prog(f, t.ring - 6, 8)), transform: `translateX(${(1 - prog(f, t.intro + 8, 18, EASE.out)) * -50}px)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", borderRadius: 22, background: "rgba(255,255,255,0.95)", boxShadow: SHADOW.deep, fontFamily: FONT.ui }}>
                  <Truck size={46} color={C.navy} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, color: C.red }}>PEDIDO RECIBIDO · SUCURSAL NORTE</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: C.navy }}>50 × Silla Ejecutiva Plus</div>
                  </div>
                </div>
              </div>
              {f >= t.cincuenta - 4 && f < t.ring && (
                <div style={{ position: "absolute", right: 160, top: 300, textAlign: "center", fontFamily: FONT.display, color: "#fff", opacity: prog(f, t.cincuenta - 4, 8) * (1 - prog(f, t.docs, 8)) }}>
                  <div style={{ fontSize: 30, fontFamily: FONT.ui, fontWeight: 700, letterSpacing: 4, opacity: 0.8 }}>¿CUÁNTAS LLEGARON?</div>
                  <div style={{ fontSize: 220, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                    {f < t.cincuenta + 60 ? Math.floor(40 + rnd(Math.floor(f / 3)) * 15) : "¿?"}
                  </div>
                </div>
              )}
              {f >= t.donde - 6 && f < t.ring && (
                <div style={{ position: "absolute", right: 260, top: 640, display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderRadius: 999, background: C.red, color: "#fff", fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, transform: `scale(${prog(f, t.donde - 6, 12, EASE.back)})`, opacity: 1 - prog(f, t.docs, 8) }}>
                  <MapPin size={34} /> ¿Dónde las colocamos?
                </div>
              )}
              {/* docs */}
              {f >= t.docs - 4 && f < t.ring + 14 && (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(7,12,28,${0.45 * prog(f, t.docs - 4, 8)})`, opacity: 1 - prog(f, t.ring + 2, 10) }}>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{ position: "absolute", left: 640 + k * 80, top: 220 + k * 30, width: 520, height: 660, background: "#FBFAF6", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: `rotate(${-8 + k * 7}deg) translateY(${(1 - prog(f, t.docs - 4 + k * 4, 14, EASE.out)) * 600}px)`, padding: 40, boxSizing: "border-box", fontFamily: FONT.ui }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#333" }}>{["ORDEN DE COMPRA", "NOTA DE ENTREGA", "INVENTARIO (copia)"][k]}</div>
                      {Array.from({ length: 12 }).map((_, r) => (
                        <div key={r} style={{ height: 12, marginTop: 22, borderRadius: 6, background: "#DDD9CE", width: `${40 + rnd(k * 13 + r) * 60}%` }} />
                      ))}
                    </div>
                  ))}
                </AbsoluteFill>
              )}
              {/* phone call */}
              {f >= t.ring - 4 && f < t.n1 && (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(7,12,28,${0.55 * prog(f, t.ring - 4, 8)})` }}>
                  <div style={{ transform: `translateY(${(1 - prog(f, t.ring - 4, 14, EASE.back)) * -300}px) scale(1.35)`, marginTop: -200 }}>
                    <CallCard name="Sucursal Sur" sub={f >= t.car - 4 ? "Carlos responde…" : "En llamada"} state={f < t.suc1 - 4 ? "ringing" : "active"} voice={f < t.car - 2 ? { src: "audio/vo/D_SUC1.flac", start: t.suc1 } : { src: "audio/vo/D_CARLOS.flac", start: t.car }} color={C.red} />
                  </div>
                </AbsoluteFill>
              )}
              <Quote who="sucursal" text="Necesitamos 10 sillas ejecutivas. ¿Ustedes tienen disponibles?" at={t.suc1} end={t.suc1End} dark />
              <Quote who="carlos" text="No estoy seguro. Déjame revisar y te aviso." at={t.car} end={t.carEnd} dark />
              <Quote who="empleado" text="Carlos, según la orden deberían haber llegado 50 unidades, pero necesitamos revisar cuántas llegaron realmente y dónde vamos a colocarlas." at={t.emp} end={t.empEnd} dark />
            </AbsoluteFill>
          )}
          {/* chaos: excel + messages + asking */}
          {f >= t.chaos - 4 && f < t.control && (
            <AbsoluteFill style={{ opacity: prog(f, t.chaos - 4, 6) * (1 - prog(f, t.control - 8, 8)) }}>
              <div style={{ position: "absolute", left: 160, top: 160, transform: `rotate(-5deg) scale(${0.8 + 0.2 * prog(f, t.chaos - 4, 12, EASE.back)})` }}>
                <Spreadsheet name="existencias_norte_ACTUAL.xlsx" width={760} rows={12} seed={9} errors={[7, 20, 33]} highlight={4} />
              </div>
              <div style={{ position: "absolute", right: 170, top: 200, display: "flex", flexDirection: "column", gap: 14, width: 560 }}>
                {["¿Cuántas ejecutivas quedan en la bodega B?", "Creo que unas 30… no estoy seguro", "Revisa el mensaje de la semana pasada"].map((m, i) => (
                  <div key={i} style={{ alignSelf: i === 1 ? "flex-end" : "flex-start", padding: "16px 22px", borderRadius: 20, background: i === 1 ? "#1D4ED8" : "#fff", color: i === 1 ? "#fff" : "#111", fontFamily: FONT.ui, fontSize: 26, transform: `scale(${prog(f, t.chaos + i * 6, 10, EASE.back)})`, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}>{m}</div>
                ))}
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
                <Headline at={t.n1 + 4} text="Mantener el control de toda la sucursal" size={80} accentWord="control" />
              </div>
            </AbsoluteFill>
          )}
          {/* N1 visuals */}
          {f >= t.control - 8 && f < t.mercancia - 4 && (
            <AbsoluteFill style={{ opacity: prog(f, t.control - 8, 8) * (1 - prog(f, t.mercancia - 10, 6)) }}>
              <Photo src="photos/warehouse.jpg" start={t.control} dur={300} from={{ s: 1.1, x: 0, y: 0 }} to={{ s: 1.3, x: 0, y: -20 }} grade="brightness(0.35) saturate(0.6)" />
              {f < t.diferencias - 6 ? (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
                    <div style={{ textAlign: "center", opacity: prog(f, t.recepciones - 6, 10), transform: `translateY(${(1 - prog(f, t.recepciones - 6, 14, EASE.out)) * 40}px)` }}>
                      <div style={{ width: 300, height: 300, borderRadius: 40, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ClipboardList size={150} color="#fff" strokeWidth={1.3} />
                      </div>
                      <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 44, color: "#fff", marginTop: 20 }}>Recepciones a mano</div>
                    </div>
                    <div style={{ width: 120, height: 120, borderRadius: 60, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${prog(f, t.separado - 4, 12, EASE.back)})` }}>
                      <Unlink size={62} color="#fff" />
                    </div>
                    <div style={{ textAlign: "center", opacity: prog(f, t.separado - 10, 10), transform: `translateY(${(1 - prog(f, t.separado - 10, 14, EASE.out)) * 40}px)` }}>
                      <div style={{ width: 300, height: 300, borderRadius: 40, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Package size={150} color="#fff" strokeWidth={1.3} />
                      </div>
                      <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 44, color: "#fff", marginTop: 20 }}>Existencias por separado</div>
                    </div>
                  </div>
                </AbsoluteFill>
              ) : (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30 }}>
                  <RedTag at={t.diferencias - 4} text="DIFERENCIAS" I={AlertTriangle} />
                  <RedTag at={t.retrasos - 4} text="RETRASOS" I={Clock} />
                  <RedTag at={t.incompleta - 10} text="INFORMACIÓN INCOMPLETA" I={FileWarning} />
                </AbsoluteFill>
              )}
            </AbsoluteFill>
          )}
          {f >= t.mercancia - 6 && f < t.otra - 2 && (
            <AbsoluteFill style={{ opacity: prog(f, t.mercancia - 6, 8) * (1 - prog(f, t.otra - 8, 6)) }}>
              <LostBox at={t.mercancia - 2} lostAt={t.quedo - 8} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}>
                <Headline at={t.mercancia} text="¿Dónde quedó la mercancía?" size={70} accentWord="dónde" />
              </div>
            </AbsoluteFill>
          )}
          {f >= t.otra - 6 && (
            <AbsoluteFill style={{ opacity: prog(f, t.otra - 6, 8) * (1 - prog(f, t.flip + 2, 6)) }}>
              <BranchLink at={t.otra - 4} brokeAt={t.mano - 14} />
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {sol && (
        <AbsoluteFill style={{ clipPath: `circle(${prog(f, t.flip, 22, EASE.inOut) * 120}% at 50% 50%)` }}>
          <LightBG />
          {inRec && (
            <AppStage
              cam={camRec}
              cursor={curRec}
              cursorShow={[t.n2, t.ring2]}
              extra={
                <>
                  <LinkChip at={t.orden - 4} x={250} y={760} label="Orden de compra" value="OC-2026-0158" I={ClipboardList} c={C.navy} fromX={1100} fromY={422} out={t.diferencia - 14} />
                  <LinkChip at={t.proveedor - 4} x={600} y={850} label="Proveedor" value="Muebles del Caribe, C.A." I={Truck} c={C.vzBlue} fromX={1100} fromY={422} out={t.diferencia - 14} />
                  <LinkChip at={t.sucursal - 4} x={1010} y={760} label="Sucursal" value="Norte" I={Building2} c={C.red} fromX={1100} fromY={422} out={t.diferencia - 14} />
                  <LinkChip at={t.ubicacion - 4} x={1250} y={850} label="Ubicación física" value="Bodega A-1" I={MapPin} c={C.gold} fromX={1100} fromY={422} out={t.diferencia - 14} />
                </>
              }
            >
              <PageRecepcion ev={recEv} />
            </AppStage>
          )}
          {inTr && (
            <AppStage cam={camTr} cursor={curTr} cursorShow={[t.trOpen, t.n3End]}>
              <PageTransfer ev={trEv} />
            </AppStage>
          )}
          {inInv && (
            <AppStage cam={[{ f: t.n4 - 8, s: 0.8, x: 860, y: 560 }, { f: t.n4 + 20, s: 1.0, x: 1000, y: 500 }, { f: t.perseguir - 10, s: 1.0, x: 1000, y: 560 }, { f: t.perseguir + 4, s: 0.8, x: 860, y: 620 }, { f: t.stamp, s: 0.8, x: 860, y: 620 }]} cursor={[{ f: t.n4 - 8, x: 600, y: 700 }, { f: t.n4 + 4, x: 167, y: 319, click: true }, { f: t.n4 + 40, x: 900, y: 800 }]} cursorShow={[t.n4 - 6, t.n4 + 50]}>
              <PageInventario at={t.n4 + 6} update={t.n4 + 26} moves={t.n4 + 40} />
            </AppStage>
          )}
          {/* ring again */}
          {f >= t.ring2 - 4 && f < t.trOpen + 6 && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(14,27,61,${0.25 * prog(f, t.ring2 - 4, 8) * (1 - prog(f, t.trOpen, 6))})`, opacity: 1 - prog(f, t.trOpen, 6) }}>
              <div style={{ transform: `translateY(${(1 - prog(f, t.ring2 - 4, 14, EASE.back)) * -300}px) scale(1.25)`, marginTop: -220 }}>
                <CallCard name="Sucursal Sur" sub="En llamada" state={f < t.suc2 - 4 ? "ringing" : "active"} voice={{ src: "audio/vo/D_SUC2.flac", start: t.suc2 }} color={C.red} />
              </div>
            </AbsoluteFill>
          )}
          <Quote who="sucursal" text="Ya verificamos. Necesitamos esas 10 sillas." at={t.suc2} end={t.suc2End} />
          {/* principle chips */}
          {f >= t.perseguir - 6 && f < t.stamp && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 26 }}>
              <div style={{ display: "flex", gap: 30 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 32px", borderRadius: 999, background: "#fff", boxShadow: SHADOW.deep, fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.text2, transform: `scale(${prog(f, t.perseguir - 6, 12, EASE.back)})`, position: "relative" }}>
                  <Search size={40} /> Perseguir información
                  <div style={{ position: "absolute", left: 24, right: 24, top: "50%", height: 6, background: C.red, borderRadius: 3, transform: `scaleX(${prog(f, t.perseguir + 8, 10)})`, transformOrigin: "left" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 32px", borderRadius: 999, background: C.navy, boxShadow: SHADOW.deep, fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: "#fff", transform: `scale(${prog(f, t.disponible - 6, 12, EASE.back)})` }}>
                  <CheckCircle2 size={40} color="#4ADE80" /> Tenerla disponible
                </div>
              </div>
            </AbsoluteFill>
          )}
          {f >= t.stamp - 6 && (
            <AbsoluteFill style={{ background: `rgba(246,247,251,${0.94 * prog(f, t.stamp - 6, 8)})` }}>
              <StampLines at={t.stamp} lines={["INVENTARIO ACTUALIZADO.", "RECEPCIONES REGISTRADAS.", "TRANSFERENCIAS CONTROLADAS."]} />
              <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 120 }}>
                <FlagBar w={260} h={7} p={prog(f, t.stamp + 30, 20, EASE.out)} />
              </AbsoluteFill>
            </AbsoluteFill>
          )}
          <Flash at={t.flip} dur={14} color="#fff" max={0.9} />
        </AbsoluteFill>
      )}
      <ChapterTitle at={t.title - 10} end={t.titleEnd} num="02" kicker="EL GERENTE" title="Una sucursal bajo control" who="carlos" />
    </AbsoluteFill>
  );
};

export const _s3 = { Img, staticFile, X, Link2, Phone };
