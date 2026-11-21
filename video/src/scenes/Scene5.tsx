import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { ShoppingCart, Package, Coins, CheckCircle2, PackageCheck, FileText, ArrowLeftRight, ArrowUpRight, ArrowDownLeft, LayoutDashboard, User, Calendar, ClipboardCheck, FileSpreadsheet, NotebookPen, MessageCircle, ArrowRight } from "lucide-react";
import { C, F as FONT, SHADOW } from "../theme";
import { EASE, prog, rnd } from "../lib/anim";
import { F, FE, W } from "../timeline";
import { LightBG, Flash } from "../components/base";
import { CharacterChip, CharKey } from "../components/motion";
import { Headline } from "../components/overlays";
import { LogoBadge } from "../components/Logo";
import { AppWindow } from "../ui/kit";
import { PageDashboard } from "../ui/PagesDueno";
import { cue, Cue } from "../lib/scene";

const S = F("sc5") - 4;
const E = F("sc6") + 16;

const t = {
  in: F("s5_in"),
  n: F("S5"),
  separado: W("S5", "separado"), juntos: W("S5", "juntos"),
  andrea: W("S5", "cuando", 14), registra: W("S5", "registra"), inventario: W("S5", "inventario"), comision: W("S5", "comisión"),
  carlos: W("S5", "cuando", 28), recibe: W("S5", "recibe"), existencias: W("S5", "existencias"), obligacion: W("S5", "obligación"),
  trans: W("S5", "cuando", 44), transferencia: W("S5", "transferencia"), salio: W("S5", "salió"), llego: W("S5", "llegó"),
  jose: W("S5", "y", 62), entra: W("S5", "entra"), disponible: W("S5", "disponible"), empresa: W("S5", "empresa", 80),
  cada: W("S5", "cada", 83), responsable: W("S5", "responsable"), fecha: W("S5", "fecha"), registro: W("S5", "registro", 90),
  ya: W("S5", "ya"), archivos: W("S5", "archivos"), historia: W("S5", "historia"),
  se: W("S5", "se", 106), sola: W("S5", "sola"), fuente: W("S5", "fuente"),
  end: FE("S5"),
};

export const sfx5: Cue[] = [
  cue(t.in, "whoosh_deep", 0.5),
  cue(t.juntos - 8, "whoosh", 0.45),
  cue(t.juntos, "impact2", 0.35),
  cue(t.andrea - 6, "whoosh2", 0.4),
  cue(t.registra - 2, "pop", 0.45),
  cue(t.inventario - 2, "data", 0.35),
  cue(t.comision - 2, "pop2", 0.45),
  cue(t.carlos - 6, "whoosh", 0.4),
  cue(t.recibe - 2, "box", 0.4),
  cue(t.existencias - 2, "data", 0.35),
  cue(t.obligacion - 2, "pop", 0.45),
  cue(t.trans - 6, "whoosh2", 0.4),
  cue(t.transferencia - 2, "data", 0.4),
  cue(t.salio - 2, "pop", 0.45),
  cue(t.llego - 2, "pop2", 0.45),
  cue(t.jose - 4, "whoosh_deep", 0.4),
  cue(t.disponible - 4, "shimmer", 0.35),
  cue(t.cada - 4, "whoosh", 0.35),
  cue(t.responsable - 2, "click", 0.4),
  cue(t.fecha - 2, "click2", 0.4),
  cue(t.registro - 2, "click", 0.4),
  cue(t.ya - 4, "pop", 0.3),
  cue(t.archivos - 4, "paper", 0.3, 30),
  cue(t.se - 6, "riser", 0.4),
  cue(t.fuente - 4, "impact", 0.5),
  cue(t.fuente - 2, "shimmer", 0.45),
];

const MODS = ["registrar_venta", "mis_comisiones", "inventario", "recepcion", "transferencias", "reportes"];

const Node: React.FC<{ at: number; children: React.ReactNode; color?: string; style?: React.CSSProperties; dark?: boolean }> = ({ at, children, color = C.navy, style, dark }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 14, EASE.back);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 26px", borderRadius: 24, background: dark ? color : "#fff", color: dark ? "#fff" : C.navy, border: dark ? "none" : `2px solid ${color}`, boxShadow: SHADOW.float, fontFamily: FONT.ui, fontWeight: 700, fontSize: 30, transform: `scale(${p})`, opacity: Math.min(1, p), whiteSpace: "nowrap", ...style }}>
      {children}
    </div>
  );
};

const Arrow: React.FC<{ at: number; w?: number; color?: string }> = ({ at, w = 120, color = C.navy }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 12, EASE.out);
  const dot = ((f - at) % 30) / 30;
  return (
    <div style={{ position: "relative", width: w, height: 8, margin: "0 10px" }}>
      <div style={{ position: "absolute", left: 0, top: 2, width: w * p, height: 4, borderRadius: 2, background: color }} />
      {p >= 1 && <div style={{ position: "absolute", left: w * dot - 6, top: -2, width: 12, height: 12, borderRadius: 6, background: C.yellow, boxShadow: "0 0 12px rgba(244,180,0,0.8)" }} />}
      <ArrowRight size={30} color={color} style={{ position: "absolute", right: -16, top: -13, opacity: p }} />
    </div>
  );
};

const Strip: React.FC<{ at: number; who: CharKey; action: React.ReactNode; effects: { at: number; node: React.ReactNode }[]; color: string }> = ({ at, who, action, effects, color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ transform: `scale(${prog(f, at, 14, EASE.back)})` }}>
        <CharacterChip who={who} size={0.95} />
      </div>
      <Arrow at={at + 8} color={color} />
      <Node at={at + 14} color={color} dark>{action}</Node>
      <Arrow at={at + 20} color={color} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {effects.map((e, i) => (
          <Node key={i} at={e.at} color={color}>{e.node}</Node>
        ))}
      </div>
    </div>
  );
};

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S || f > E) return null;

  const phaseStrips = f >= t.andrea - 8 && f < t.cada - 2;
  const stack = prog(f, t.jose - 6, 20, EASE.inOut);

  return (
    <AbsoluteFill>
      <LightBG />
      {/* A. modules separate → together */}
      {f < t.andrea + 4 && (
        <AbsoluteFill style={{ opacity: 1 - prog(f, t.andrea - 8, 10) }}>
          {MODS.map((m, i) => {
            const tog = prog(f, t.juntos - 10, 22, EASE.inOut);
            const sx = [260, 1230, 160, 1330, 620, 900][i];
            const sy = [130, 110, 560, 590, 330, 700][i];
            const r = [-9, 7, 6, -8, -3, 5][i];
            const gx = 150 + (i % 3) * 560;
            const gy = 170 + Math.floor(i / 3) * 400;
            const fl = Math.sin((f + i * 20) / 25) * 10 * (1 - tog);
            const x = sx + (gx - sx) * tog;
            const y = sy + (gy - sy) * tog + fl;
            const p = prog(f, t.in + i * 4, 16, EASE.back);
            return (
              <div key={m} style={{ position: "absolute", left: x, top: y, width: 520, transform: `rotate(${r * (1 - tog)}deg) scale(${p * (0.9 + 0.1 * tog)})`, borderRadius: 18, overflow: "hidden", boxShadow: tog > 0.9 ? `0 0 0 4px ${[C.yellow, C.vzBlue, C.red][i % 3]}, ${SHADOW.deep}` : SHADOW.deep, opacity: Math.min(1, p) }}>
                <Img src={staticFile(`ui/mod_${m}.png`)} style={{ width: "100%", display: "block" }} />
              </div>
            );
          })}
          {/* connecting lines */}
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {[[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5]].map(([a, b], k) => {
              const ax = 150 + (a % 3) * 560 + 260;
              const ay = 170 + Math.floor(a / 3) * 400 + 115;
              const bx = 150 + (b % 3) * 560 + 260;
              const by = 170 + Math.floor(b / 3) * 400 + 115;
              const lp = prog(f, t.juntos + 4 + k * 2, 14, EASE.out);
              return <line key={k} x1={ax} y1={ay} x2={ax + (bx - ax) * lp} y2={ay + (by - ay) * lp} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" opacity={0.9} style={{ filter: "drop-shadow(0 0 8px rgba(244,180,0,0.7))" }} />;
            })}
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center" }}>
            {f < t.juntos - 10 ? (
              <Headline at={t.n + 2} text="No es cada módulo por separado…" size={66} color={C.navy} accentWord="separado" accent={C.red} />
            ) : (
              <Headline at={t.juntos - 8} text="…es cómo todos trabajan juntos." size={66} color={C.navy} accentWord="juntos" accent={C.red} />
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* B–E. operation strips */}
      {phaseStrips && (
        <AbsoluteFill style={{ opacity: 1 - prog(f, t.cada - 10, 8) }}>
          {/* strips container */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
            {[
              { at: t.andrea - 6, end: t.carlos - 8, slot: 0 },
              { at: t.carlos - 6, end: t.trans - 8, slot: 1 },
              { at: t.trans - 6, end: t.jose - 8, slot: 2 },
            ].map((st, i) => {
              if (f < st.at) return null;
              const active = f < st.end;
              const exit = prog(f, st.end, 14, EASE.inOut);
              // while active: centered big; afterwards: parked at slot (top-left stack), then in stack phase all to left column
              const parkY = 80 + st.slot * 150;
              const x = interpolate(exit, [0, 1], [230, 60]);
              const y = interpolate(exit, [0, 1], [390, parkY]);
              const s = interpolate(exit, [0, 1], [1.12, 0.5]) * (1 - 0.02 * stack);
              const op = active ? prog(f, st.at, 8) : 0.85;
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "0 0", opacity: op }}>
                  {i === 0 && (
                    <Strip
                      at={st.at}
                      who="andrea"
                      color={C.red}
                      action={<><ShoppingCart size={34} /> Registra una venta</>}
                      effects={[
                        { at: t.inventario - 4, node: <><Package size={30} color={C.vzBlue} /> Inventario: Silla Ejecutiva 12 → 10</> },
                        { at: t.comision - 4, node: <><Coins size={30} color={C.amber} /> Comisión calculada: +$42.00</> },
                        { at: t.comision + 14, node: <><CheckCircle2 size={30} color={C.green} /> Pago verificado → Venta #4588 pagada</> },
                      ]}
                    />
                  )}
                  {i === 1 && (
                    <Strip
                      at={st.at}
                      who="carlos"
                      color={C.vzBlue}
                      action={<><PackageCheck size={34} /> Recibe mercancía</>}
                      effects={[
                        { at: t.existencias - 4, node: <><Package size={30} color={C.green} /> Existencias: Silla Ejecutiva Plus +48</> },
                        { at: t.obligacion - 4, node: <><FileText size={30} color="#4F5BD5" /> Cuenta por pagar: Muebles del Caribe $5.200</> },
                      ]}
                    />
                  )}
                  {i === 2 && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Node at={st.at} color={C.navy} dark><ArrowLeftRight size={34} /> Transferencia #302</Node>
                      <Arrow at={st.at + 8} color={C.navy} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <Node at={t.salio - 4} color={C.red}><ArrowUpRight size={30} color={C.red} /> Sucursal Norte · salió −10</Node>
                        <Node at={t.llego - 4} color={C.green}><ArrowDownLeft size={30} color={C.green} /> Sucursal Sur · llegó +10</Node>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* José + dashboard convergence */}
          {f >= t.jose - 6 && (
            <AbsoluteFill>
              <svg width={1920} height={1080} style={{ position: "absolute" }}>
                {[0, 1, 2].map((k) => {
                  const y0 = 80 + k * 150 + 45;
                  const lp = prog(f, t.entra + k * 4, 18, EASE.out);
                  const d = `M 960 ${y0} C 1150 ${y0}, 1150 560, 1260 560`;
                  return <path key={k} d={d} stroke={[C.red, C.vzBlue, C.navy][k]} strokeWidth={5} fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - lp} />;
                })}
              </svg>
              <div style={{ position: "absolute", left: 1260, top: 300, width: 600, transform: `scale(${prog(f, t.jose - 2, 16, EASE.back)})`, transformOrigin: "left center" }}>
                <div style={{ width: 600, height: 381, borderRadius: 20, overflow: "hidden", boxShadow: `0 0 0 ${4 * prog(f, t.disponible - 4, 10)}px ${C.gold}, ${SHADOW.deep}` }}>
                  <div style={{ transform: `scale(${600 / 1720})`, transformOrigin: "0 0" }}>
                    <AppWindow width={1720} height={1040}>
                      <PageDashboard at={t.jose - 4} />
                    </AppWindow>
                  </div>
                </div>
                <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                  <CharacterChip who="jose" size={0.9} />
                </div>
              </div>
              <div style={{ position: "absolute", left: 60, bottom: 90, width: 1100 }}>
                <Headline at={t.disponible - 6} text="Toda la información, disponible." size={60} color={C.navy} accentWord="disponible" accent={C.red} align="left" />
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* F. audit log */}
      {f >= t.cada - 8 && f < t.ya + 4 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: prog(f, t.cada - 8, 8) * (1 - prog(f, t.ya - 4, 8)) }}>
          <div style={{ width: 1500, borderRadius: 28, background: "#fff", boxShadow: SHADOW.deep, overflow: "hidden", fontFamily: FONT.ui }}>
            <div style={{ display: "flex", background: C.navy, color: "#fff", fontWeight: 800, fontSize: 30 }}>
              {[
                { l: "Responsable", I: User, at: t.responsable, w: 380 },
                { l: "Fecha", I: Calendar, at: t.fecha, w: 380 },
                { l: "Registro", I: ClipboardCheck, at: t.registro, w: 740 },
              ].map((c) => {
                const hl = interpolate(f, [c.at - 4, c.at + 2, c.at + 30], [0, 1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={c.l} style={{ width: c.w, padding: "26px 30px", display: "flex", alignItems: "center", gap: 14, background: `rgba(244,180,0,${0.9 * hl})`, color: hl > 0.5 ? C.navy : "#fff" }}>
                    <c.I size={32} /> {c.l}
                  </div>
                );
              })}
            </div>
            {[
              ["Andrea", "15/06/2026 · 10:22", "Venta #4588 registrada · Sucursal Centro"],
              ["Andrea", "15/06/2026 · 10:24", "Pago verificado · Venta #4588"],
              ["Carlos", "15/06/2026 · 09:10", "Recepción OC-2026-0158 · Bodega A-1"],
              ["Carlos", "15/06/2026 · 11:05", "Transferencia #302 · Norte → Sur"],
            ].map((r, i) => {
              const p = prog(f, t.cada - 2 + i * 5, 12, EASE.out);
              return (
                <div key={i} style={{ display: "flex", fontSize: 28, borderTop: `1px solid ${C.line}`, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
                  <div style={{ width: 380, padding: "22px 30px", fontWeight: 700, color: C.navy }}>{r[0]}</div>
                  <div style={{ width: 380, padding: "22px 30px", color: C.text2 }}>{r[1]}</div>
                  <div style={{ width: 740, padding: "22px 30px", color: C.navy }}>{r[2]}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* G. many files → one source */}
      {f >= t.ya - 6 && (
        <AbsoluteFill style={{ opacity: prog(f, t.ya - 6, 8) }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2 + (f - t.ya) / 60;
            const suck = prog(f, t.se - 2 + i, 20, EASE.in);
            const rad = (380 + (i % 3) * 60) * (1 - suck);
            const x = 960 + Math.cos(ang) * rad * 1.3;
            const y = 540 + Math.sin(ang) * rad * 0.8;
            const kinds = [FileSpreadsheet, NotebookPen, MessageCircle];
            const K = kinds[i % 3];
            const col = ["#1E7145", "#B45309", "#1D4ED8"][i % 3];
            const p = prog(f, t.ya - 4 + i * 2, 12, EASE.back);
            return (
              <div key={i} style={{ position: "absolute", left: x - 70, top: y - 46, width: 140, height: 92, borderRadius: 16, background: "#fff", boxShadow: SHADOW.float, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${p * (1 - suck * 0.7)}) rotate(${(rnd(i) - 0.5) * 20}deg)`, opacity: 1 - suck, fontFamily: FONT.ui, fontSize: 15, color: col, fontWeight: 700 }}>
                <K size={36} color={col} />
                {i % 3 === 0 ? ".xlsx" : i % 3 === 1 ? "notas" : "chat"}
              </div>
            );
          })}
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", transform: `scale(${0.4 + 0.6 * prog(f, t.se - 4, 24, EASE.back)})` }}>
              <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,180,0,0.45) 0%, rgba(244,180,0,0) 70%)", opacity: prog(f, t.fuente - 4, 10), transform: `scale(${1 + 0.05 * Math.sin(f / 6)})` }} />
              <LogoBadge size={300} />
            </div>
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
            {f < t.se - 4 ? (
              <Headline at={t.ya} text="Varios archivos contando la misma historia…" size={60} color={C.navy} accentWord="archivos" accent={C.red} />
            ) : (
              <Headline at={t.se - 2} text="Una sola fuente de información." size={76} color={C.navy} accentWord="sola" accent={C.red} />
            )}
          </div>
          <Flash at={t.fuente - 2} dur={12} color="#fff" max={0.6} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const _s5 = { LayoutDashboard };
