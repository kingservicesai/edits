import React from "react";
import { useCurrentFrame, Img, staticFile, interpolate } from "remotion";
import {
  ShoppingCart, Package, Star, FileText, ChevronRight, ArrowUp, AlertTriangle, ArrowRight, History, PackageCheck, ArrowLeftRight, Download,
  ChevronDown, Calendar, Building2, Sparkles, Mic, Clock, TrendingUp, Percent, Trophy, Coins,
} from "lucide-react";
import { AppShell, Btn, Card, Header, IconCircle, MicButton, ProductThumb, ui } from "./kit";
import { EASE, prog } from "../lib/anim";
import { C, F } from "../theme";
import { VoiceBars } from "../components/motion";

const fmt = (v: number) => Math.round(v).toLocaleString("de-DE");

/* ───────────────────────── Dashboard ───────────────────────── */
export const PageDashboard: React.FC<{ at: number; kpiHL?: number[]; mic?: { press: number; listening: [number, number] }; children?: React.ReactNode }> = ({ at, kpiHL = [], mic, children }) => {
  const f = useCurrentFrame();
  const c = (d: number) => prog(f, at + d, 26);
  const kpis = [
    { I: ShoppingCart, bg: "#FDE9E9", ic: ui.red, l: "Ventas del mes", v: "$" + fmt(48250 * c(0)), d: "+12% vs. mes anterior" },
    { I: Package, bg: "#E8EEF8", ic: "#3B5BA9", l: "Inventario total", v: fmt(12840 * c(4)), d: "+8% vs. mes anterior" },
    { I: Star, bg: "#FEF3DC", ic: C.amber, l: "Comisiones pendientes", v: "$" + fmt(1260 * c(8)), d: "" },
    { I: FileText, bg: "#ECEBFB", ic: ui.indigo, l: "Cuentas por pagar", v: "$" + fmt(8400 * c(12)), d: "warn" },
  ];
  const listening = mic ? f >= mic.listening[0] && f < mic.listening[1] : false;
  return (
    <AppShell role="dueno" active="inicio">
      <Header
        greet="Buenos días, José"
        sub="Aquí tienes un resumen de tu negocio"
        user="José"
        role="Dueño"
        avatarColor={C.gold}
        mic={mic ? <MicButton active={f >= mic.press ? 1 : 0} pulse={listening} /> : <MicButton />}
      />
      <div style={{ display: "flex", gap: 18 }}>
        {kpis.map((k, i) => {
          const hl = kpiHL[i] !== undefined ? interpolate(f, [kpiHL[i], kpiHL[i] + 6, kpiHL[i] + 28, kpiHL[i] + 36], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
          return (
            <Card key={i} style={{ flex: 1, padding: "20px 18px", display: "flex", gap: 14, alignItems: "center", transform: `translateY(${(1 - prog(f, at + i * 4, 18, EASE.out)) * 30}px) scale(${1 + hl * 0.04})`, opacity: prog(f, at + i * 4, 12), boxShadow: hl > 0 ? `0 0 0 ${4 * hl}px rgba(214,40,40,0.35), 0 20px 40px rgba(14,27,61,0.12)` : undefined }}>
              <IconCircle icon={<k.I size={28} color={k.ic} />} bg={k.bg} size={58} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 19, color: ui.text }}>{k.l}</div>
                <div style={{ fontSize: 36, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>{k.v}</div>
                {k.d === "warn" ? (
                  <div style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={16} fill={ui.red} color="#fff" /> Vence en 7 días</div>
                ) : (
                  <div style={{ fontSize: 14, color: ui.green, display: "flex", alignItems: "center", gap: 4, minHeight: 18, whiteSpace: "nowrap" }}>{k.d && <ArrowUp size={14} />}{k.d}</div>
                )}
              </div>
              <ChevronRight size={22} color={ui.text2} />
            </Card>
          );
        })}
      </div>
      <div style={{ marginTop: 18, height: 250, borderRadius: 24, overflow: "hidden", position: "relative", background: "linear-gradient(90deg,#F1E9E5 0%, #F3ECE8 45%, #EDE6E2 100%)", border: `1px solid ${ui.line}` }}>
        <Img src={staticFile("products/banner_photo.png")} style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "62%", objectFit: "cover", objectPosition: "right center", maskImage: "linear-gradient(90deg, transparent 0%, #000 22%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 22%)" }} />
        <div style={{ position: "absolute", left: 40, top: 34 }}>
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }}>Tu negocio<br />en un solo lugar</div>
          <div style={{ fontSize: 20, color: ui.text2, marginTop: 12, width: 520 }}>Gestiona tus ventas, inventario y más, de forma rápida y sencilla.</div>
          <Btn style={{ marginTop: 16, borderRadius: 999, padding: "12px 24px", fontSize: 18 }}>Ver reportes <ArrowRight size={18} /></Btn>
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 18, flex: 1 }}>
        <Card style={{ flex: 1.15, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }}>
            <Package size={26} /> Productos con stock bajo
            <span style={{ marginLeft: "auto", fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>Ver todos <ArrowRight size={16} /></span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            {[["silla_ejecutiva", "Silla Ejecutiva", 10], ["mesa_oficina", "Mesa de Oficina", 7], ["silla_visitante", "Silla Visitante", 15]].map(([img, n, q]) => (
              <div key={n as string} style={{ flex: 1, textAlign: "center" }}>
                <ProductThumb src={img as string} size={120} style={{ margin: "0 auto", borderRadius: 18 }} />
                <div style={{ fontSize: 16, marginTop: 8 }}>{n}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: ui.red }}>{q} und.</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ flex: 1, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }}>
            <History size={26} /> Actividad reciente
          </div>
          {[
            { I: ShoppingCart, t: "Venta #4588", s: "Sucursal Centro", h: "hace 12 min" },
            { I: PackageCheck, t: "Recepción OC-2026-0158", s: "Muebles del Caribe, C.A.", h: "hace 1 h" },
            { I: ArrowLeftRight, t: "Transferencia #302", s: "Norte → Sur", h: "hace 2 h" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
              <IconCircle icon={<a.I size={22} color={ui.navy} />} bg="#EEF1F6" size={48} />
              <div style={{ lineHeight: 1.25 }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{a.t}</div>
                <div style={{ fontSize: 15, color: ui.text2 }}>{a.s}</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 14, color: ui.text2 }}>{a.h}</span>
            </div>
          ))}
        </Card>
        <Card style={{ width: 250, padding: "22px", background: "#FFF7EA", borderColor: "#F6E6C9" }}>
          <svg width={120} height={84} viewBox="0 0 120 84">
            <rect x={6} y={56} width={18} height={26} rx={3} fill={C.yellow} />
            <rect x={32} y={42} width={18} height={40} rx={3} fill={C.yellow} />
            <rect x={58} y={30} width={18} height={52} rx={3} fill={C.vzBlue} />
            <rect x={84} y={14} width={18} height={68} rx={3} fill={C.red} />
            <path d="M4 50 L40 30 L64 34 L108 4" stroke={C.yellow} strokeWidth={4} fill="none" />
          </svg>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>¡Vamos por más!</div>
          <div style={{ fontSize: 17, color: ui.text2 }}>Tu negocio sigue creciendo.</div>
          <div style={{ marginTop: 14, display: "inline-block", border: `1.5px solid ${ui.navy}`, borderRadius: 999, padding: "8px 18px", fontSize: 16, fontWeight: 600 }}>Ver estadísticas</div>
        </Card>
      </div>
      {children}
    </AppShell>
  );
};

/* ───────────────────────── Reportes ───────────────────────── */
type Tab = "ventas" | "comisiones" | "cxp" | "inventario";
const TABS = ["Resumen General", "Ventas", "Margen", "Comisiones", "Cuentas por Pagar"];

export const PageReportes: React.FC<{ tab: Tab; at: number; hl?: number }> = ({ tab, at, hl }) => {
  const f = useCurrentFrame();
  const kpis = [
    { I: ShoppingCart, c: C.amber, l: "Ventas Totales", v: "$48.250", d: "+12%", up: true },
    { I: Percent, c: C.amber, l: "Margen Promedio", v: "32%", d: "+2%", up: true },
    { I: Trophy, c: C.amber, l: "Comisiones Totales", v: "$4.860", d: "+14%", up: true },
    { I: FileText, c: ui.navy, l: "Cuentas por Pagar", v: "$8.400", d: "-3%", up: false },
  ];
  const activeTab = tab === "ventas" ? 1 : tab === "comisiones" ? 3 : tab === "cxp" ? 4 : 0;
  const kpiFocus = tab === "comisiones" ? [1, 2] : tab === "cxp" ? [3] : tab === "ventas" ? [0] : [];
  return (
    <AppShell role="dueno" active={tab === "inventario" ? "inventario" : "reportes"}>
      <Header greet={tab === "inventario" ? "Inventario consolidado" : "Reportes"} sub={tab === "inventario" ? "Existencias de todas las sucursales" : "Información clave para tu negocio"} user="José" role="Dueño" avatarColor={C.gold} emoji={false} />
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
        {[[Calendar, "Últimos 30 días"], [Building2, "Todas las sucursales"], [Package, "Todos los productos"]].map(([I, t], i) => {
          const Ic = I as React.ElementType;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 14, border: `1px solid ${ui.line}`, background: "#fff", fontSize: 18, fontWeight: 600 }}>
              <Ic size={20} /> {t as string} <ChevronDown size={18} />
            </div>
          );
        })}
        <Btn style={{ marginLeft: "auto", padding: "14px 22px", fontSize: 18 }}>Generar Reporte <Download size={18} /></Btn>
      </div>
      {tab !== "inventario" && (
        <>
          <div style={{ display: "flex", gap: 30, fontSize: 19, fontWeight: 600, marginBottom: 14 }}>
            {TABS.map((t, i) => (
              <span key={t} style={{ color: i === activeTab ? ui.red : ui.text, borderBottom: i === activeTab ? `3px solid ${ui.red}` : "3px solid transparent", paddingBottom: 6 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {kpis.map((k, i) => {
              const focus = kpiFocus.includes(i);
              return (
                <Card key={i} style={{ flex: 1, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", opacity: kpiFocus.length && !focus ? 0.55 : 1, boxShadow: focus ? "0 0 0 3px rgba(214,40,40,0.35), 0 14px 30px rgba(14,27,61,0.1)" : undefined }}>
                  <k.I size={34} color={k.c} />
                  <div>
                    <div style={{ fontSize: 16 }}>{k.l}</div>
                    <div style={{ fontSize: 32, fontWeight: 800 }}>{k.v}</div>
                    <div style={{ fontSize: 14, color: k.up ? ui.green : ui.text2 }}>{k.up ? "↑" : "↓"} {k.d}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 18, marginTop: 16, flex: 1 }}>
        {tab === "ventas" && <VentasPanels at={at} hl={hl} />}
        {tab === "comisiones" && <ComisionesPanels at={at} />}
        {tab === "cxp" && <CxPPanel at={at} />}
        {tab === "inventario" && <InvConsolidated at={at} />}
      </div>
    </AppShell>
  );
};

const VentasPanels: React.FC<{ at: number; hl?: number }> = ({ at, hl }) => {
  const f = useCurrentFrame();
  const groups = [[14, 9, 8], [17, 15, 11], [12, 8, 7]]; // thousands per period: Norte/Sur/Centro
  const cols = [C.navy, C.yellow, C.red];
  const H = 300;
  const hlp = hl !== undefined ? prog(f, hl, 14) : 0;
  const donut = prog(f, at + 10, 36, EASE.inOut);
  const segs = [{ v: 40, c: C.navy, n: "Norte" }, { v: 35, c: C.yellow, n: "Sur" }, { v: 25, c: C.red, n: "Centro" }];
  let acc = 0;
  return (
    <>
      <Card style={{ flex: 1.5, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Ventas por Sucursal</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 18, fontSize: 16 }}>
            {["Norte", "Sur", "Centro"].map((n, i) => (
              <span key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: cols[i] }} />{n}</span>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", height: H + 40, marginTop: 16 }}>
          {[0, 10, 20].map((g, i) => (
            <div key={g} style={{ position: "absolute", left: 0, right: 0, bottom: 40 + (g / 20) * H, borderTop: "1px dashed #E6E8EF", fontSize: 14, color: ui.text3 }}>
              <span style={{ position: "absolute", top: -10, left: 0, background: "#fff", paddingRight: 6 }}>{g}k</span>
            </div>
          ))}
          <div style={{ position: "absolute", left: 60, right: 10, bottom: 40, top: 0, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
            {groups.map((g, gi) => (
              <div key={gi} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                {g.map((v, i) => {
                  const p = prog(f, at + gi * 6 + i * 3, 24, EASE.out);
                  const dim = hlp > 0 && i !== 0 ? 1 - 0.55 * hlp : 1;
                  return <div key={i} style={{ width: 48, height: (v / 20) * H * p, background: cols[i], borderRadius: "8px 8px 0 0", opacity: dim, boxShadow: hlp > 0 && i === 0 ? `0 0 0 ${3 * hlp}px rgba(14,27,61,0.25)` : undefined }} />;
                })}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 60, right: 10, bottom: 8, display: "flex", justifyContent: "space-around", fontSize: 16, color: ui.text2 }}>
            <span>Semana 1</span><span>Semana 2</span><span>Semana 3</span>
          </div>
          {hlp > 0 && (
            <div style={{ position: "absolute", left: 340, top: 0, padding: "10px 16px", borderRadius: 12, background: ui.navy, color: "#fff", fontWeight: 700, fontSize: 18, opacity: hlp, transform: `translateY(${(1 - hlp) * 10}px)`, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={20} /> Norte lidera las ventas
            </div>
          )}
        </div>
      </Card>
      <Card style={{ flex: 1, padding: "20px 24px" }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Distribución de Ventas</div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 30 }}>
          <svg width={240} height={240} viewBox="0 0 240 240">
            {segs.map((s, i) => {
              const r = 90;
              const circ = 2 * Math.PI * r;
              const len = (s.v / 100) * circ * donut;
              const off = (acc / 100) * circ * donut;
              acc += s.v;
              return <circle key={i} cx={120} cy={120} r={r} fill="none" stroke={s.c} strokeWidth={42} strokeDasharray={`${len} ${circ}`} strokeDashoffset={-off} transform="rotate(-90 120 120)" />;
            })}
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {segs.map((s) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 21 }}>
                <span style={{ width: 16, height: 16, borderRadius: 8, background: s.c }} /> {s.n} <b style={{ marginLeft: 20 }}>{s.v}%</b>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

const ComisionesPanels: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const sellers = [["Juan Pérez", 1480], ["Andrea", 1302], ["Luis M.", 1128], ["Ana T.", 950]] as const;
  const cats = [["Sillas ejecutivas", 36], ["Sillas ergonómicas", 33], ["Sillas de visita", 31], ["Mesas de oficina", 28]] as const;
  return (
    <>
      <Card style={{ flex: 1, padding: "22px 26px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><Coins size={26} color={C.amber} /> Comisiones por vendedor</div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 20 }}>
          {sellers.map(([n, v], i) => {
            const p = prog(f, at + i * 5, 26, EASE.out);
            return (
              <div key={n}>
                <div style={{ display: "flex", fontSize: 19, marginBottom: 6 }}><span style={{ fontWeight: 600 }}>{n}</span><b style={{ marginLeft: "auto" }}>${fmt(v * p)}</b></div>
                <div style={{ height: 16, borderRadius: 8, background: "#F0F2F6" }}>
                  <div style={{ width: `${(v / 1600) * 100 * p}%`, height: "100%", borderRadius: 8, background: n === "Andrea" ? C.red : C.navy }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card style={{ flex: 1, padding: "22px 26px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><Percent size={26} color={C.amber} /> Rentabilidad por categoría</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-end", gap: 26, height: 260, padding: "0 10px" }}>
          {cats.map(([n, v], i) => {
            const p = prog(f, at + 8 + i * 5, 26, EASE.out);
            return (
              <div key={n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <b style={{ fontSize: 22 }}>{Math.round(v * p)}%</b>
                <div style={{ width: "70%", height: (v / 40) * 200 * p, borderRadius: "10px 10px 0 0", background: [C.navy, C.yellow, C.vzBlue, C.red][i] }} />
                <div style={{ fontSize: 15, textAlign: "center", color: ui.text2, height: 40 }}>{n}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

const CxPPanel: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const rows = [
    { p: "Muebles del Caribe, C.A.", r: "OC-2026-0158", m: 5200, d: "22/06/2026", w: "Vence en 7 días", urgent: true },
    { p: "Proveedor MueblesTech", r: "Recepción #1023", m: 3200, d: "30/06/2026", w: "Vence en 15 días", urgent: false },
  ];
  return (
    <Card style={{ flex: 1, padding: "22px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, fontWeight: 700 }}>
        <FileText size={26} /> Obligaciones pendientes con proveedores
        <span style={{ marginLeft: "auto", fontSize: 20 }}>Total: <b>$8.400</b></span>
      </div>
      <div style={{ display: "flex", fontSize: 17, fontWeight: 600, color: ui.text2, padding: "16px 12px 10px", borderBottom: `1px solid ${ui.line}` }}>
        <span style={{ flex: 1.4 }}>Proveedor</span><span style={{ flex: 1 }}>Referencia</span><span style={{ flex: 0.8 }}>Monto</span><span style={{ flex: 0.9 }}>Vencimiento</span><span style={{ flex: 1 }}>Estado</span>
      </div>
      {rows.map((r, i) => {
        const p = prog(f, at + i * 8, 16, EASE.out);
        return (
          <div key={r.p} style={{ display: "flex", alignItems: "center", fontSize: 20, padding: "0 12px", height: 82, borderBottom: `1px solid ${ui.line}`, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
            <span style={{ flex: 1.4, fontWeight: 600, display: "flex", alignItems: "center", gap: 12 }}><Building2 size={22} /> {r.p}</span>
            <span style={{ flex: 1, color: ui.text2 }}>{r.r}</span>
            <span style={{ flex: 0.8, fontWeight: 800 }}>${fmt(r.m)}</span>
            <span style={{ flex: 0.9 }}>{r.d}</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: r.urgent ? "#FDECEC" : "#FEF3DC", color: r.urgent ? ui.red : "#B45309", fontWeight: 700, fontSize: 16 }}>
                {r.urgent ? <AlertTriangle size={18} /> : <Clock size={18} />} {r.w}
              </span>
            </span>
          </div>
        );
      })}
    </Card>
  );
};

const InvConsolidated: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const br = [["Norte", 5110, C.navy], ["Sur", 4320, C.yellow], ["Centro", 3410, C.red]] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
      <div style={{ display: "flex", gap: 18 }}>
        {br.map(([n, v, c], i) => {
          const p = prog(f, at + i * 5, 24, EASE.out);
          return (
            <Card key={n} style={{ flex: 1, padding: "20px 24px", borderTop: `6px solid ${c}`, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
              <div style={{ fontSize: 19, display: "flex", alignItems: "center", gap: 10 }}><Building2 size={22} /> Sucursal {n}</div>
              <div style={{ fontSize: 44, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmt(v * p)} <span style={{ fontSize: 20, fontWeight: 500, color: ui.text2 }}>und.</span></div>
            </Card>
          );
        })}
        <Card style={{ width: 300, padding: "20px 24px", background: ui.navy, color: "#fff", border: "none" }}>
          <div style={{ fontSize: 19, opacity: 0.8 }}>Total empresa</div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>{fmt(12840 * prog(f, at + 12, 24))}</div>
        </Card>
      </div>
      <div style={{ display: "flex", gap: 18, flex: 1 }}>
        <Card style={{ flex: 1, padding: "20px 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><AlertTriangle size={24} color={C.amber} /> Stock bajo · necesitan reposición</div>
          {[["silla_ejecutiva", "Silla Ejecutiva", "Centro", 10], ["mesa_oficina", "Mesa de Oficina", "Centro", 7], ["silla_visitante", "Silla Visitante", "Sur", 15]].map(([img, n, s, q], i) => (
            <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 14, height: 76, borderBottom: `1px solid ${ui.line}`, fontSize: 19, opacity: prog(f, at + 14 + i * 4, 12) }}>
              <ProductThumb src={img as string} size={54} /> <b style={{ fontWeight: 600 }}>{n}</b> <span style={{ color: ui.text2 }}>· {s}</span>
              <span style={{ marginLeft: "auto", fontWeight: 800, color: ui.red }}>{q} und.</span>
            </div>
          ))}
        </Card>
        <Card style={{ flex: 1, padding: "20px 24px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><Clock size={24} color={ui.text2} /> Productos sin movimiento</div>
          {[["silla_presidente", "Silla Presidente", "Norte · Bodega A-3", "45 días"], ["silla_visitante", "Silla de Oficina", "Norte · Bodega B-1", "38 días"]].map(([img, n, s, d], i) => (
            <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 14, height: 76, borderBottom: `1px solid ${ui.line}`, fontSize: 19, opacity: prog(f, at + 20 + i * 4, 12) }}>
              <ProductThumb src={img as string} size={54} /> <b style={{ fontWeight: 600 }}>{n}</b> <span style={{ color: ui.text2 }}>· {s}</span>
              <span style={{ marginLeft: "auto", fontWeight: 700, color: ui.text2 }}>{d}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ───────────────────────── Asistente IA ───────────────────────── */
export type AsstEv = { open: number; q1: number; q1End: number; a1: number; a1End: number; q2: number; q2End: number; a2: number; voiceQ1: string; voiceA1: string; voiceQ2: string };

export const Assistant: React.FC<{ ev: AsstEv }> = ({ ev }) => {
  const f = useCurrentFrame();
  const open = prog(f, ev.open, 18, EASE.out);
  if (open <= 0) return null;
  const bubble = (at: number) => prog(f, at, 12, EASE.back);
  const listening = (f >= ev.q1 && f < ev.q1End + 4) || (f >= ev.q2 && f < ev.q2End + 4);
  const thinking = (f >= ev.q1End + 4 && f < ev.a1) || (f >= ev.q2End + 4 && f < ev.a2);
  const typed = (s: string, at: number, end: number) => s.slice(0, Math.round(s.length * prog(f, at, Math.max(1, end - at), (t) => t)));
  return (
    <div style={{ position: "absolute", right: -6, top: 92, bottom: -6, width: 600, transform: `translateX(${(1 - open) * 640}px)`, zIndex: 20 }}>
      <Card style={{ height: "100%", boxSizing: "border-box", padding: 0, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "-30px 0 80px rgba(14,27,61,0.18)" }}>
        <div style={{ padding: "22px 26px", background: `linear-gradient(135deg, ${C.navy}, #233B7A)`, color: "#fff", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={28} color={C.gold2} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Asistente IA</div>
            <div style={{ fontSize: 15, opacity: 0.75 }}>Responde con los datos reales del negocio</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "22px 22px", display: "flex", flexDirection: "column", gap: 16, background: "#F7F8FB" }}>
          {f >= ev.q1 && (
            <div style={{ alignSelf: "flex-end", maxWidth: "86%", background: ui.navy, color: "#fff", borderRadius: "20px 20px 6px 20px", padding: "14px 18px", fontSize: 20, transform: `scale(${bubble(ev.q1)})`, transformOrigin: "100% 100%" }}>
              {typed("¿Qué sucursal vendió más esta semana?", ev.q1, ev.q1End)}
            </div>
          )}
          {f >= ev.a1 && (
            <div style={{ alignSelf: "flex-start", maxWidth: "94%", background: "#fff", border: `1px solid ${ui.line}`, borderRadius: "20px 20px 20px 6px", padding: "16px 18px", fontSize: 19, transform: `scale(${bubble(ev.a1)})`, transformOrigin: "0% 100%" }}>
              {typed("La sucursal Norte fue la que registró el mayor volumen de ventas durante esta semana.", ev.a1, ev.a1End)}
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Norte", 40, C.navy], ["Sur", 35, C.yellow], ["Centro", 25, C.red]].map(([n, v, c], i) => {
                  const p = prog(f, ev.a1 + 10 + i * 4, 20, EASE.out);
                  return (
                    <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16 }}>
                      <span style={{ width: 60, fontWeight: i === 0 ? 800 : 500 }}>{n as string}</span>
                      <div style={{ flex: 1, height: 14, borderRadius: 7, background: "#EEF0F4" }}>
                        <div style={{ width: `${(Number(v) / 40) * 100 * p}%`, height: "100%", borderRadius: 7, background: c as string }} />
                      </div>
                      <b style={{ width: 44, textAlign: "right" }}>{Math.round(Number(v) * p)}%</b>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {f >= ev.q2 && (
            <div style={{ alignSelf: "flex-end", maxWidth: "86%", background: ui.navy, color: "#fff", borderRadius: "20px 20px 6px 20px", padding: "14px 18px", fontSize: 20, transform: `scale(${bubble(ev.q2)})`, transformOrigin: "100% 100%" }}>
              {typed("¿Qué productos tienen el inventario más bajo?", ev.q2, ev.q2End)}
            </div>
          )}
          {f >= ev.a2 && (
            <div style={{ alignSelf: "flex-start", width: "94%", background: "#fff", border: `1px solid ${ui.line}`, borderRadius: "20px 20px 20px 6px", padding: "14px 16px", transform: `scale(${bubble(ev.a2)})`, transformOrigin: "0% 100%" }}>
              {[["silla_ejecutiva", "Silla Ejecutiva", 10], ["mesa_oficina", "Mesa de Oficina", 7], ["silla_visitante", "Silla Visitante", 15]]
                .sort((a, b) => Number(a[2]) - Number(b[2]))
                .map(([img, n, q], i) => (
                  <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 12, height: 62, borderTop: i ? `1px solid ${ui.line}` : "none", fontSize: 18, opacity: prog(f, ev.a2 + 6 + i * 5, 10) }}>
                    <ProductThumb src={img as string} size={46} /> <b style={{ fontWeight: 600 }}>{n}</b>
                    <span style={{ marginLeft: "auto", fontWeight: 800, color: ui.red }}>{q} und.</span>
                  </div>
                ))}
            </div>
          )}
          {thinking && (
            <div style={{ alignSelf: "flex-start", display: "flex", gap: 6, padding: "14px 18px", background: "#fff", borderRadius: 18, border: `1px solid ${ui.line}` }}>
              {[0, 1, 2].map((d) => (
                <div key={d} style={{ width: 10, height: 10, borderRadius: 5, background: C.navy, opacity: 0.3 + 0.7 * Math.max(0, Math.sin((f - d * 4) / 4)) }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: "16px 22px", borderTop: `1px solid ${ui.line}`, display: "flex", alignItems: "center", gap: 14, background: "#fff" }}>
          <div style={{ width: 58, height: 58, borderRadius: 29, background: listening ? ui.red : ui.navy, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: listening ? `0 0 0 ${6 + 4 * Math.sin(f / 3)}px rgba(214,40,40,0.2)` : "none" }}>
            <Mic size={28} color="#fff" />
          </div>
          <div style={{ flex: 1, height: 50, display: "flex", alignItems: "center" }}>
            {f >= ev.q1 && f < ev.q1End + 4 ? (
              <VoiceBars src={ev.voiceQ1} startFrame={ev.q1} bars={40} height={44} color={ui.red} width={5} gap={4} />
            ) : f >= ev.q2 && f < ev.q2End + 4 ? (
              <VoiceBars src={ev.voiceQ2} startFrame={ev.q2} bars={40} height={44} color={ui.red} width={5} gap={4} />
            ) : f >= ev.a1 && f < ev.a1End ? (
              <VoiceBars src={ev.voiceA1} startFrame={ev.a1} bars={40} height={44} color={ui.navy} width={5} gap={4} />
            ) : (
              <span style={{ fontSize: 18, color: ui.text3 }}>{listening ? "Escuchando…" : "Pregunta lo que necesites…"}</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const _unused = { Mic, F };
