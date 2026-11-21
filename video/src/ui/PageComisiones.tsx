import React from "react";
import { useCurrentFrame, Img, staticFile } from "remotion";
import { evolvePath } from "@remotion/paths";
import { BarChart3, Coins, CheckCircle2, Trophy, ArrowRight, Receipt, ArrowUp } from "lucide-react";
import { AppShell, Card, Header, ui } from "./kit";
import { EASE, prog } from "../lib/anim";
import { C, F } from "../theme";

export const PageComisiones: React.FC<{ chartAt: number; newSale: number }> = ({ chartAt, newSale }) => {
  const f = useCurrentFrame();
  const ns = prog(f, newSale, 16, EASE.out);
  const comm = 1260 + 42 * prog(f, newSale + 6, 20);
  const ventas = 12480 + 487.2 * prog(f, newSale + 6, 20);
  const nVentas = f >= newSale + 10 ? 49 : 48;
  const kpis = [
    { I: BarChart3, l: "Ventas Propias", v: "$" + Math.round(ventas).toLocaleString("de-DE"), d: "+12% vs. mes anterior", c: ui.navy },
    { I: Coins, l: "Comisiones Devengadas", v: "$" + Math.round(comm).toLocaleString("de-DE"), d: "+8% vs. mes anterior", c: C.amber },
    { I: CheckCircle2, l: "Ventas del Mes", v: String(nVentas), d: "+5% vs. mes anterior", c: C.amber },
    { I: Trophy, l: "Tu Ranking", v: "#2", d: "de 12 vendedores", c: C.amber },
  ];
  // chart
  const pts = [[0, 300], [1, 262], [2, 248], [3, 222], [4, 196], [4.6, 170], [5, 158]];
  const cw = 760, ch = 330;
  const px = (i: number) => 60 + (i / 5) * (cw - 100);
  const d = pts.map(([i, y], k) => `${k ? "L" : "M"}${px(i)} ${y}`).join(" ");
  const ev = evolvePath(prog(f, chartAt, 40, EASE.inOut), d);
  const sales = [
    { n: "#4588", c: "María Rodríguez", m: "$487.20", k: "$42.00", isNew: true },
    { n: "#4587", c: "Ana Torres", m: "$440.00", k: "$44.00" },
    { n: "#4586", c: "Comercial Global", m: "$620.00", k: "$62.00" },
    { n: "#4585", c: "Luis Martínez", m: "$310.00", k: "$31.00" },
  ];
  return (
    <AppShell role="vendedor" active="comisiones">
      <Header greet="Mis Comisiones" sub="Consulta tus ventas y comisiones" user="Andrea" role="Vendedora · Centro" avatarColor="#D62828" emoji={false} />
      <div style={{ display: "flex", gap: 34, fontSize: 21, fontWeight: 600, marginBottom: 18 }}>
        <span style={{ color: ui.red, borderBottom: `3px solid ${ui.red}`, paddingBottom: 8 }}>Resumen</span>
        <span>Detalle por Venta</span>
        <span>Histórico</span>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {kpis.map((k, i) => (
          <Card key={i} style={{ flex: 1, padding: "22px 24px", transform: `translateY(${(1 - prog(f, chartAt - 20 + i * 4, 16)) * 30}px)`, opacity: prog(f, chartAt - 20 + i * 4, 12) }}>
            <k.I size={34} color={k.c} />
            <div style={{ fontSize: 19, marginTop: 10 }}>{k.l}</div>
            <div style={{ fontSize: 42, fontWeight: 800, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{k.v}</div>
            <div style={{ fontSize: 16, color: i === 3 ? ui.text2 : ui.green, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              {i < 3 && <ArrowUp size={16} />} {k.d}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 20, flex: 1 }}>
        <Card style={{ width: 820, padding: "22px 26px" }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Tus Comisiones</div>
          <svg width={cw} height={ch + 40} style={{ marginTop: 10 }}>
            {[0, 1, 2, 3].map((g) => (
              <g key={g}>
                <line x1={60} x2={cw - 30} y1={330 - g * 80} y2={330 - g * 80} stroke="#EEF0F4" />
                <text x={0} y={335 - g * 80} fontSize={16} fill={ui.text2} fontFamily={F.ui}>{["$0", "$500", "$1.000", "$1.500"][g]}</text>
              </g>
            ))}
            {["Ene", "Feb", "Mar", "Abr", "May", "Jun"].map((m, i) => (
              <text key={m} x={px(i) - 14} y={364} fontSize={17} fill={ui.text2} fontFamily={F.ui}>{m}</text>
            ))}
            <path d={`${d} L ${px(5)} 330 L ${px(0)} 330 Z`} fill="url(#gfill)" opacity={prog(f, chartAt + 20, 20)} />
            <defs>
              <linearGradient id="gfill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2F5BD3" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#2F5BD3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={d} stroke={ui.navy} strokeWidth={4} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} strokeLinecap="round" />
            {pts.filter((_, k) => k !== 5).map(([i, y], k) => (
              <circle key={k} cx={px(i)} cy={y} r={8} fill="#fff" stroke={ui.navy} strokeWidth={3} opacity={prog(f, chartAt + k * 5, 8)} />
            ))}
            <g opacity={prog(f, chartAt + 36, 10)} transform={`translate(${px(5) - 60}, 92)`}>
              <rect width={120} height={46} rx={12} fill={ui.navy} />
              <text x={60} y={31} textAnchor="middle" fontSize={22} fontWeight={700} fill="#fff" fontFamily={F.ui}>$1.260</text>
            </g>
          </svg>
        </Card>
        <Card style={{ flex: 1, padding: "22px 26px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Últimas Ventas</div>
            <span style={{ marginLeft: "auto", fontSize: 18, color: ui.text2, display: "flex", alignItems: "center", gap: 6 }}>Ver todas <ArrowRight size={18} /></span>
          </div>
          <div style={{ marginTop: 10 }}>
            {sales.map((s, i) => {
              const h = s.isNew ? 92 * ns : 92;
              if (h < 1) return null;
              return (
                <div key={s.n} style={{ height: h, overflow: "hidden", opacity: s.isNew ? ns : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, height: 92, borderTop: i > (ns > 0 ? 0 : 1) ? `1px solid ${ui.line}` : "none", background: s.isNew ? `rgba(253,233,233,${1 - prog(f, newSale + 50, 30)})` : undefined, borderRadius: 14, padding: "0 10px" }}>
                    <div style={{ width: 54, height: 54, borderRadius: 14, background: "#F4F5F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Receipt size={26} color={ui.text} />
                    </div>
                    <div style={{ lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 700, fontSize: 21 }}>Venta {s.n}</div>
                      <div style={{ fontSize: 16, color: ui.text2 }}>Cliente: {s.c}</div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right", lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 800, fontSize: 22 }}>{s.m}</div>
                      <div style={{ fontSize: 16, color: ui.text2 }}>Comisión: <b style={{ color: s.isNew ? ui.red : ui.text }}>{s.k}</b></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

/** Invoice document generated from a sale */
export const Invoice: React.FC<{ width?: number }> = ({ width = 640 }) => (
  <div style={{ width, background: "#fff", borderRadius: 18, boxShadow: "0 40px 100px rgba(14,27,61,0.3)", fontFamily: F.ui, color: ui.text, overflow: "hidden" }}>
    <div style={{ display: "flex", height: 10 }}>
      <div style={{ flex: 1, background: C.yellow }} />
      <div style={{ flex: 1, background: C.vzBlue }} />
      <div style={{ flex: 1, background: C.red }} />
    </div>
    <div style={{ padding: "28px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Img src={staticFile("brand/logo_keyed.png")} style={{ width: 96, height: 98 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>Mayor de Sillas Venezuela C.A.</div>
          <div style={{ fontSize: 15, color: ui.text2 }}>Sucursal Centro</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 1 }}>FACTURA</div>
          <div style={{ fontSize: 15, color: ui.text2 }}>Venta #4588 · 15/06/2026</div>
        </div>
      </div>
      <div style={{ marginTop: 22, padding: "14px 18px", background: "#F6F7FB", borderRadius: 12, fontSize: 16, display: "flex", justifyContent: "space-between" }}>
        <span><b>Cliente:</b> María Rodríguez</span>
        <span><b>Vendedor:</b> Andrea</span>
      </div>
      <div style={{ marginTop: 16, fontSize: 17 }}>
        <div style={{ display: "flex", fontWeight: 700, color: ui.text2, fontSize: 14, letterSpacing: 1, padding: "8px 0", borderBottom: `1px solid ${ui.line}` }}>
          <span style={{ width: 60 }}>CANT.</span><span style={{ flex: 1 }}>DESCRIPCIÓN</span><span style={{ width: 110, textAlign: "right" }}>P. UNIT.</span><span style={{ width: 110, textAlign: "right" }}>TOTAL</span>
        </div>
        {[["2", "Silla Ejecutiva · SE-001", "$120.00", "$240.00"], ["1", "Mesa de Oficina · MO-002", "$180.00", "$180.00"]].map((r) => (
          <div key={r[1]} style={{ display: "flex", padding: "12px 0", borderBottom: `1px solid ${ui.line}` }}>
            <span style={{ width: 60 }}>{r[0]}</span><span style={{ flex: 1 }}>{r[1]}</span><span style={{ width: 110, textAlign: "right" }}>{r[2]}</span><span style={{ width: 110, textAlign: "right", fontWeight: 600 }}>{r[3]}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: ui.greenBg, color: ui.green, fontWeight: 700, border: `2px solid ${ui.green}`, transform: "rotate(-4deg)" }}>
          <CheckCircle2 size={22} /> PAGADA
        </div>
        <div style={{ width: 260, fontSize: 17 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>$420.00</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span>IVA (16%)</span><span>$67.20</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontWeight: 800, fontSize: 26 }}><span>Total</span><span>$487.20</span></div>
        </div>
      </div>
    </div>
  </div>
);
