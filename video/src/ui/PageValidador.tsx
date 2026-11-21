import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CreditCard, ShoppingCart, Search, Calendar, Landmark, DollarSign, CheckCircle2, Clock, AlertCircle, History, ArrowRight, Printer, Check } from "lucide-react";
import { AppShell, Btn, Card, Field, Header, ui } from "./kit";
import { EASE, prog } from "../lib/anim";
import { C } from "../theme";

export type ValEv = { order: number; date: number; bank: number; amount: number; press: number; verifying: number; success: number; newRow: number };

const Status: React.FC<{ s: "ok" | "rev" | "no" }> = ({ s }) => {
  const m = {
    ok: { t: "Pago Verificado", c: ui.green, bg: ui.greenBg, I: CheckCircle2 },
    rev: { t: "En Revisión", c: "#475569", bg: "#EEF1F6", I: Clock },
    no: { t: "Sin Pago", c: ui.red, bg: "#FDECEC", I: AlertCircle },
  }[s];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: m.bg, color: m.c, fontWeight: 600, fontSize: 18 }}>
      <m.I size={22} fill={s === "ok" ? ui.green : s === "no" ? ui.red : "none"} color={s === "rev" ? "#475569" : "#fff"} /> {m.t}
    </div>
  );
};

export const PageValidador: React.FC<{ ev: ValEv }> = ({ ev }) => {
  const f = useCurrentFrame();
  const verifying = f >= ev.verifying && f < ev.success;
  const ok = prog(f, ev.success, 16, EASE.back);
  const okFade = prog(f, ev.success, 10);
  const pressed = interpolate(f, [ev.press - 1, ev.press + 2, ev.press + 7], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nr = prog(f, ev.newRow, 14, EASE.out);
  const rows: { d: string; o: string; b: string; m: string; s: "ok" | "rev" | "no" }[] = [
    { d: "14/06/2026 – 05:18 p.m.", o: "#4587", b: "Banesco", m: "$440.00", s: "rev" },
    { d: "13/06/2026 – 04:32 p.m.", o: "#4585", b: "Mercantil", m: "$310.00", s: "no" },
  ];
  const cell: React.CSSProperties = { fontSize: 19, padding: "0 22px", display: "flex", alignItems: "center" };
  const W = [300, 200, 250, 190, 0];
  const RowEl: React.FC<{ r: (typeof rows)[0]; style?: React.CSSProperties }> = ({ r, style }) => (
    <div style={{ display: "flex", height: 66, borderTop: `1px solid ${ui.line}`, ...style }}>
      <div style={{ ...cell, width: W[0] }}>{r.d}</div>
      <div style={{ ...cell, width: W[1] }}>{r.o}</div>
      <div style={{ ...cell, width: W[2] }}>{r.b}</div>
      <div style={{ ...cell, width: W[3] }}>{r.m}</div>
      <div style={{ ...cell, flex: 1 }}><Status s={r.s} /></div>
    </div>
  );
  // confetti lines
  const burst = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = -150 + i * 24 + (i > 2 ? 60 : 0);
    const p = prog(f, ev.success + 2, 18, EASE.out);
    return { a, p, c: [C.red, C.yellow, C.red, C.yellow, C.red, C.yellow][i] };
  });
  return (
    <AppShell role="vendedor" active="validador">
      <Header greet="Validador de Pagos" sub="Verifica el pago de tu venta en segundos" user="Andrea" role="Vendedora · Centro" avatarColor="#D62828" emoji={false} />
      <div style={{ display: "flex", gap: 24, height: 560 }}>
        <Card style={{ width: 640, padding: "26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, fontWeight: 700 }}>
            <CreditCard size={36} /> Datos de la Venta
          </div>
          <div style={{ height: 1, background: ui.line }} />
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            <Field style={{ flex: 1 }} label="Orden de Compra / Venta #" value="4588" typeAt={ev.order} typeDur={10} icon={<ShoppingCart size={24} />} placeholder="Número de venta" />
            <Btn variant="soft" icon={<Search size={22} />} style={{ height: 62, padding: "0 24px", boxSizing: "border-box" }}>Buscar</Btn>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Field style={{ flex: 1 }} label="Fecha de Transferencia" value="15/06/2026" typeAt={ev.date} typeDur={8} icon={<Calendar size={24} />} select />
            <Field style={{ flex: 1 }} label="Banco" value="Banco Provincial" typeAt={ev.bank} typeDur={8} icon={<Landmark size={24} />} select />
          </div>
          <Field label="Monto Transferido" value="$487.20" typeAt={ev.amount} typeDur={10} icon={<DollarSign size={24} />} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <Btn pressed={pressed} icon={<Search size={24} />} style={{ borderRadius: 999, padding: "18px 64px", fontSize: 22 }}>
              {verifying ? "Verificando…" : "Validar Pago"}
            </Btn>
          </div>
        </Card>
        <Card
          style={{
            flex: 1, padding: "26px 30px", position: "relative", overflow: "hidden",
            background: okFade > 0 ? `rgba(231,246,236,${okFade})` : "#fff", borderColor: okFade > 0 ? "#BFE6CC" : ui.line,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}
        >
          {f < ev.success && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, color: ui.text3 }}>
              {verifying ? (
                <>
                  <div style={{ width: 96, height: 96, borderRadius: "50%", border: "8px solid #E3E8F2", borderTopColor: ui.navy, transform: `rotate(${(f - ev.verifying) * 14}deg)` }} />
                  <div style={{ fontSize: 24, fontWeight: 600, color: ui.text2 }}>Consultando el banco…</div>
                </>
              ) : (
                <>
                  <CreditCard size={84} strokeWidth={1.4} />
                  <div style={{ fontSize: 22 }}>Ingresa los datos de la transferencia</div>
                </>
              )}
            </div>
          )}
          {ok > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div style={{ position: "relative", width: 110, height: 110, marginTop: 0 }}>
                {burst.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute", left: 55, top: 55, width: 40, height: 8, borderRadius: 4, background: b.c, opacity: 1 - prog(f, ev.success + 18, 14),
                      transform: `rotate(${b.a}deg) translateX(${66 + b.p * 36}px)`, transformOrigin: "0 50%",
                    }}
                  />
                ))}
                <div style={{ width: 110, height: 110, borderRadius: "50%", background: ui.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ok})`, boxShadow: "0 16px 40px rgba(22,163,74,0.35)" }}>
                  <Check size={66} color="#fff" strokeWidth={3.4} />
                </div>
              </div>
              <div style={{ fontSize: 50, fontWeight: 800, marginTop: 10, letterSpacing: -1, opacity: okFade, transform: `translateY(${(1 - okFade) * 16}px)` }}>¡Pago Verificado!</div>
              <div style={{ fontSize: 24, color: ui.text, marginTop: 4, opacity: okFade }}>
                Tu venta <b>#4588</b> ya fue pagada correctamente.
              </div>
              <div style={{ marginTop: 14, width: "92%", background: "#fff", borderRadius: 18, border: `1px solid ${ui.line}`, padding: "4px 24px", opacity: prog(f, ev.success + 8, 12) }}>
                {[
                  [ShoppingCart, "Venta", "#4588"],
                  [Calendar, "Fecha de Transferencia", "15/06/2026 – 10:24 a.m."],
                  [Landmark, "Banco", "Banco Provincial"],
                  [DollarSign, "Monto", "$487.20"],
                ].map(([I, k, v], i) => {
                  const Ic = I as React.ElementType;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 44, borderTop: i ? `1px solid ${ui.line}` : "none", fontSize: 19 }}>
                      <Ic size={24} /> <span>{k as string}</span>
                      <span style={{ marginLeft: "auto", fontWeight: 500 }}>{v as string}</span>
                    </div>
                  );
                })}
              </div>
              <Btn variant="outline" icon={<Printer size={22} />} style={{ marginTop: 14, borderRadius: 999, padding: "12px 52px", opacity: prog(f, ev.success + 12, 12) }}>Descargar Comprobante</Btn>
            </div>
          )}
        </Card>
      </div>
      <Card style={{ marginTop: 24, padding: "18px 26px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
          <History size={30} /> Historial de Validaciones
          <span style={{ marginLeft: "auto", fontSize: 18, fontWeight: 600, color: "#2F5BD3", display: "flex", alignItems: "center", gap: 8 }}>Ver todas <ArrowRight size={20} /></span>
        </div>
        <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${ui.line}` }}>
          <div style={{ display: "flex", height: 50, background: ui.head, fontWeight: 600 }}>
            {["Fecha", "Orden #", "Banco", "Monto", "Estado"].map((h, i) => (
              <div key={h} style={{ ...cell, width: W[i] || undefined, flex: i === 4 ? 1 : undefined }}>{h}</div>
            ))}
          </div>
          {nr > 0 && (
            <div style={{ height: 66 * nr, overflow: "hidden", background: `rgba(231,246,236,${1 - prog(f, ev.newRow + 40, 30)})` }}>
              <RowEl r={{ d: "15/06/2026 – 10:24 a.m.", o: "#4588", b: "Banco Provincial", m: "$487.20", s: "ok" }} style={{ borderTop: "none" }} />
            </div>
          )}
          {rows.map((r) => <RowEl key={r.o} r={r} />)}
        </div>
      </Card>
    </AppShell>
  );
};
