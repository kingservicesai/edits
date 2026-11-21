import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { PackageCheck, ChevronDown, Check, AlertTriangle, MapPin, Search, Download, ArrowRight, ArrowLeftRight, Minus, Plus, Building2, ChevronRight, CheckCircle2, ArrowDownLeft, ArrowUpRight, Warehouse } from "lucide-react";
import { AppShell, Btn, Card, Header, ProductThumb, Stepper, ui } from "./kit";
import { EASE, prog } from "../lib/anim";
import { C, F } from "../theme";

const Select: React.FC<{ label?: string; value: string; on?: number; at?: number; w?: number | string; icon?: React.ReactNode; hl?: number }> = ({ label, value, at, w = "100%", icon, hl = 0 }) => {
  const f = useCurrentFrame();
  const p = at === undefined ? 1 : prog(f, at, 10);
  return (
    <div style={{ width: w }}>
      {label && <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 10 }}>{label}</div>}
      <div
        style={{
          height: 62, borderRadius: 14, border: `1.5px solid ${hl > 0 ? "#9DB4F0" : ui.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 18px",
          fontSize: 21, fontWeight: 600, background: "#fff", boxShadow: hl > 0 ? `0 0 0 ${5 * hl}px rgba(79,120,240,0.18)` : "none",
        }}
      >
        {icon}
        <span style={{ opacity: p, color: p < 0.5 ? ui.text3 : ui.text }}>{p < 0.5 ? "Seleccionar…" : value}</span>
        <ChevronDown size={22} style={{ marginLeft: "auto" }} color={ui.text2} />
      </div>
    </div>
  );
};

/* ───────────────────────── Registrar Recepción ───────────────────────── */
export type RecEv = { oc: number; qty: number; diff: number; exception: number; loc: number; confirm: number; done: number; inv: number };

export const PageRecepcion: React.FC<{ ev: RecEv }> = ({ ev }) => {
  const f = useCurrentFrame();
  const step = f >= ev.confirm ? 3 : f >= ev.loc ? 2 : f >= ev.qty ? 1 : 0;
  const stepP = step === 0 ? prog(f, ev.oc, 30) : step === 1 ? prog(f, ev.qty, 40) : step === 2 ? prog(f, ev.loc, 30) : 1;
  const typed = (at: number, v: string) => (f < at ? "" : v.slice(0, Math.round(v.length * prog(f, at, 8, (t) => t))));
  const rows = [{ n: "Silla Ejecutiva Plus", img: "silla_ejecutiva", e: 50, r: "48", at: ev.qty }];
  const diffHL = interpolate(f, [ev.diff, ev.diff + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exc = prog(f, ev.exception, 14, EASE.back);
  const done = prog(f, ev.done, 16, EASE.out);
  const pressed = interpolate(f, [ev.confirm - 1, ev.confirm + 2, ev.confirm + 7], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inv = prog(f, ev.inv, 24);
  return (
    <AppShell role="gerente" active="recepciones">
      <Header greet="Registrar Recepción" sub="Ingresa la información de la orden de compra" user="Carlos" role="Gerente · Norte" avatarColor={C.vzBlue} emoji={false} />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ width: 900 }}>
          <Stepper steps={["Orden de compra", "Cantidades", "Ubicación", "Confirmar"]} current={step} progress={stepP} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        <Card style={{ width: 430, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>Orden de compra</div>
          <Select label="Selecciona orden de compra" value="OC-2026-0158" at={ev.oc} />
          <div style={{ opacity: prog(f, ev.oc + 6, 10) }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Proveedor</div>
            <div style={{ fontSize: 21, marginTop: 6 }}>Muebles del Caribe, C.A.</div>
          </div>
          <div style={{ opacity: prog(f, ev.oc + 10, 10) }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Fecha prevista</div>
            <div style={{ fontSize: 21, marginTop: 6 }}>22/06/2026</div>
          </div>
          <div style={{ opacity: prog(f, ev.loc - 6, 10) }}>
            <Select label="Ubicación en Sucursal Norte" value="Bodega A-1" at={ev.loc} icon={<MapPin size={22} color={ui.red} />} hl={interpolate(f, [ev.loc, ev.loc + 6, ev.loc + 40, ev.loc + 50], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          </div>
        </Card>
        <Card style={{ flex: 1, padding: "24px 26px", position: "relative" }}>
          <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 14 }}>Productos a recibir</div>
          <div style={{ display: "flex", fontSize: 18, fontWeight: 600, color: ui.text, padding: "10px 0", borderBottom: `1px solid ${ui.line}` }}>
            <span style={{ flex: 1 }}>Producto</span>
            <span style={{ width: 160, textAlign: "center" }}>Cant. esperada</span>
            <span style={{ width: 170, textAlign: "center" }}>Cant. recibida</span>
            <span style={{ width: 150, textAlign: "center" }}>Diferencia</span>
          </div>
          {rows.map((r, i) => {
            const val = typed(r.at, r.r);
            const d = val ? Number(val) - r.e : null;
            const bad = d !== null && d < 0 && val.length === r.r.length;
            return (
              <div key={r.n} style={{ display: "flex", alignItems: "center", height: 92, borderBottom: `1px solid ${ui.line}`, fontSize: 21 }}>
                <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 14 }}>
                  <ProductThumb src={r.img} size={58} /> {r.n}
                </span>
                <span style={{ width: 160, textAlign: "center" }}>{r.e}</span>
                <span style={{ width: 170, display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 110, height: 52, borderRadius: 12, border: `1.5px solid ${f >= r.at && f < r.at + 14 ? "#9DB4F0" : ui.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{val}</div>
                </span>
                <span style={{ width: 150, display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      width: 90, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800,
                      background: d === null ? "#F4F5F8" : bad ? "#FDECEC" : ui.greenBg, color: bad ? ui.red : ui.green,
                      boxShadow: bad && diffHL > 0 ? `0 0 0 ${4 * diffHL}px rgba(214,40,40,${0.35 + 0.25 * Math.sin(f / 4)})` : "none",
                      transform: `scale(${bad ? 1 + 0.08 * diffHL : 1})`,
                    }}
                  >
                    {d === null ? "–" : d === 0 ? "0" : d}
                  </div>
                </span>
              </div>
            );
          })}
          {exc > 0 && (
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 16, background: "#FFF4E5", border: "1.5px solid #F5C77E", transform: `scale(${0.9 + 0.1 * exc})`, opacity: Math.min(1, exc), transformOrigin: "left center" }}>
              <AlertTriangle size={30} color="#D97706" />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontWeight: 800, fontSize: 20, color: "#92400E" }}>Excepción generada · Silla Ejecutiva Plus (−2 und.)</div>
                <div style={{ fontSize: 17, color: "#92400E" }}>Pendiente de revisión por el gerente</div>
              </div>
            </div>
          )}
          <div style={{ position: "absolute", right: 26, bottom: 22, display: "flex", gap: 16 }}>
            <Btn variant="outline" style={{ borderColor: ui.line }}>Cancelar</Btn>
            <Btn pressed={pressed} icon={<Check size={22} />}>Registrar recepción</Btn>
          </div>
        </Card>
      </div>
      {done > 0 && (
        <div style={{ position: "absolute", left: "50%", top: 330, transform: `translate(-50%, ${(1 - done) * 40}px) scale(${0.92 + 0.08 * done})`, opacity: done, zIndex: 10 }}>
          <Card style={{ width: 760, padding: "28px 34px", boxShadow: "0 40px 100px rgba(14,27,61,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: ui.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={42} color="#fff" strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800 }}>Recepción registrada</div>
                <div style={{ fontSize: 19, color: ui.text2 }}>OC-2026-0158 · Muebles del Caribe, C.A. · Sucursal Norte · Bodega A-1</div>
              </div>
            </div>
            <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 16, background: "#F6F7FB" }}>
              <ProductThumb src="silla_ejecutiva" size={60} />
              <div style={{ fontSize: 21, fontWeight: 600 }}>Silla Ejecutiva Plus</div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                <span style={{ color: ui.text3, fontSize: 24 }}>472</span>
                <ArrowRight size={26} color={ui.text3} />
                <span>{Math.round(472 + 48 * inv)}</span>
                <span style={{ fontSize: 18, color: ui.green, background: ui.greenBg, padding: "6px 12px", borderRadius: 10, opacity: inv }}>+48</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
};

/* ───────────────────────── Transferencias ───────────────────────── */
export type TrEv = { origin: number; dest: number; product: number; qty: number; validate: number; hlOrigin: number; hlDest: number; press: number; record: number; moves: number };

export const PageTransfer: React.FC<{ ev: TrEv }> = ({ ev }) => {
  const f = useCurrentFrame();
  const q = f < ev.qty ? 0 : Math.min(10, Math.floor(prog(f, ev.qty, 22, (t) => t) * 10));
  const prodIn = prog(f, ev.product, 12, EASE.back);
  const val = prog(f, ev.validate, 12, EASE.back);
  const hl = (at: number) => interpolate(f, [at, at + 6, at + 30, at + 40], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pressed = interpolate(f, [ev.press - 1, ev.press + 2, ev.press + 7], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rec = prog(f, ev.record, 16, EASE.out);
  const mv = (i: number) => prog(f, ev.moves + i * 8, 14, EASE.out);
  return (
    <AppShell role="gerente" active="transferencias">
      <Header greet="Transferencias" sub="Gestiona el movimiento de mercancía entre sucursales" user="Carlos" role="Gerente · Norte" avatarColor={C.vzBlue} emoji={false} />
      <div style={{ display: "flex", gap: 34, fontSize: 21, fontWeight: 600, marginBottom: 18 }}>
        <span style={{ color: ui.red, borderBottom: `3px solid ${ui.red}`, paddingBottom: 8 }}>Nueva Transferencia</span>
        <span>Mis Solicitudes</span>
        <span>Historial</span>
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        <Card style={{ width: 350, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 22 }}>
          <Select label="Sucursal Origen" value="Sucursal Norte" at={ev.origin} icon={<Building2 size={22} color={ui.navy} />} hl={hl(ev.hlOrigin)} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: ui.blueBg, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${prog(f, ev.dest, 16) * 180}deg)` }}>
              <ArrowLeftRight size={26} color={ui.navy} style={{ transform: "rotate(90deg)" }} />
            </div>
          </div>
          <Select label="Sucursal Destino" value="Sucursal Sur" at={ev.dest} icon={<Building2 size={22} color={ui.red} />} hl={hl(ev.hlDest)} />
        </Card>
        <Card style={{ flex: 1, padding: "24px 26px" }}>
          <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 14 }}>Productos</div>
          <div style={{ height: 56, borderRadius: 14, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", fontSize: 19, color: ui.text2 }}>
            <Search size={22} /> {f >= ev.product - 14 ? "Silla Ejecutiva Plus".slice(0, Math.round(20 * prog(f, ev.product - 14, 12, (t) => t))) : "Buscar producto..."}
          </div>
          {prodIn > 0 && (
            <div style={{ display: "flex", alignItems: "center", height: 96, borderBottom: `1px solid ${ui.line}`, fontSize: 21, opacity: Math.min(1, prodIn), transform: `translateY(${(1 - prodIn) * 16}px)` }}>
              <ProductThumb src="silla_ejecutiva" size={60} />
              <span style={{ marginLeft: 16, flex: 1, fontWeight: 600, whiteSpace: "nowrap" }}>Silla Ejecutiva Plus</span>
              <span style={{ width: 150, color: ui.text2, whiteSpace: "nowrap" }}>Stock: <b style={{ color: ui.text }}>520</b></span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={18} /></div>
                <div style={{ width: 64, height: 52, borderRadius: 12, border: `1.5px solid ${q > 0 && q < 10 ? "#9DB4F0" : ui.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24 }}>{q}</div>
                <div style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={18} /></div>
              </div>
            </div>
          )}
          {val > 0 && (
            <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 14, background: ui.greenBg, color: ui.green, fontWeight: 700, fontSize: 19, transform: `scale(${val})`, transformOrigin: "left center" }}>
              <CheckCircle2 size={24} fill={ui.green} color="#fff" /> Existencias validadas · 520 disponibles en Sucursal Norte
            </div>
          )}
        </Card>
        <Card style={{ width: 260, padding: "24px 22px" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Observaciones <span style={{ color: ui.text3, fontWeight: 500, fontSize: 17 }}>(opcional)</span></div>
          <div style={{ marginTop: 14, height: 170, borderRadius: 14, border: `1px solid ${ui.line}`, padding: 16, fontSize: 18, color: ui.text3 }}>Ej. Para nueva sala de ventas</div>
        </Card>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 20 }}>
        <Btn variant="outline" style={{ borderColor: ui.line }}>Cancelar</Btn>
        <Btn pressed={pressed} icon={<ArrowRight size={22} />} style={{ flexDirection: "row-reverse" }}>Solicitar Transferencia</Btn>
      </div>
      {rec > 0 && (
        <Card style={{ marginTop: 20, padding: "22px 26px", opacity: rec, transform: `translateY(${(1 - rec) * 30}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 800 }}>
            <ArrowLeftRight size={28} color={ui.red} /> Transferencia #302 registrada
            <span style={{ marginLeft: "auto", fontSize: 17, fontWeight: 600, color: ui.text2 }}>15/06/2026 · Responsable: Carlos</span>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
            {[
              { I: ArrowUpRight, t: "Salida", s: "Sucursal Norte · Bodega A-1", v: "−10", c: ui.red, bg: "#FDECEC" },
              { I: ArrowDownLeft, t: "Entrada", s: "Sucursal Sur", v: "+10", c: ui.green, bg: ui.greenBg },
            ].map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, background: m.bg, opacity: mv(i), transform: `translateX(${(1 - mv(i)) * (i ? 40 : -40)}px)` }}>
                <m.I size={30} color={m.c} />
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontWeight: 800, fontSize: 21, color: m.c }}>{m.t} · Silla Ejecutiva Plus</div>
                  <div style={{ fontSize: 17, color: ui.text2 }}>{m.s}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 34, fontWeight: 900, color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AppShell>
  );
};

/* ───────────────────────── Inventario por Sucursal ───────────────────────── */
export const PageInventario: React.FC<{ at: number; update: number; moves: number; role?: "gerente" | "dueno"; tab?: number; lowStock?: number }> = ({ at, update, moves, role = "gerente", tab = 0, lowStock }) => {
  const f = useCurrentFrame();
  const up = prog(f, update, 24);
  const rows = [
    { n: "Silla Ejecutiva Plus", img: "silla_ejecutiva", s: Math.round(520 - 10 * up), u: "Bodega A-1", hl: true },
    { n: "Silla Visitante Pro", img: "silla_visitante", s: 1200, u: "Bodega B-2" },
    { n: "Silla Ergonómica", img: "silla_ergonomica", s: 340, u: "Bodega C-1" },
    { n: "Silla Presidente", img: "silla_presidente", s: 210, u: "Bodega A-3" },
    { n: "Silla de Oficina", img: "silla_visitante", s: 980, u: "Bodega B-1" },
  ];
  const tabs = ["Norte", "Sur", "Centro"];
  return (
    <AppShell role={role} active="inventario">
      <Header greet="Inventario por Sucursal" sub="Stock actualizado en tiempo real" user={role === "gerente" ? "Carlos" : "José"} role={role === "gerente" ? "Gerente · Norte" : "Dueño"} avatarColor={role === "gerente" ? C.vzBlue : C.gold} emoji={false} />
      <div style={{ display: "flex", gap: 34, fontSize: 21, fontWeight: 600, marginBottom: 18 }}>
        {tabs.map((t, i) => (
          <span key={t} style={{ color: i === tab ? ui.red : ui.text, borderBottom: i === tab ? `3px solid ${ui.red}` : "3px solid transparent", paddingBottom: 8 }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 22, flex: 1 }}>
        <Card style={{ width: 400, padding: "26px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Warehouse size={44} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>Sucursal {tabs[tab]}</div>
              <div style={{ fontSize: 17, color: ui.text2 }}>Av. Principal, Local 1</div>
            </div>
          </div>
          <div style={{ marginTop: 26, padding: "22px", borderRadius: 18, background: "#F6F7FB", textAlign: "center" }}>
            <div style={{ fontSize: 19 }}>Total de Productos</div>
            <div style={{ fontSize: 56, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{Math.round(5120 - 10 * up).toLocaleString("de-DE")}</div>
            <div style={{ fontSize: 19 }}>unidades</div>
          </div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14, fontSize: 19 }}>
            {[["En Stock", "4.690", ui.green], ["Stock Bajo", "280", C.amber], ["Sin Stock", "150", ui.red]].map(([k, v, c]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, outline: lowStock !== undefined && k === "Stock Bajo" && f >= lowStock ? `3px solid rgba(245,158,11,0.5)` : "none", borderRadius: 10, padding: "4px 6px" }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: c }} /> {k}
                <b style={{ marginLeft: "auto" }}>{v}</b>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ flex: 1, padding: "24px 26px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1, height: 56, borderRadius: 14, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", fontSize: 19, color: ui.text2 }}><Search size={22} /> Buscar producto...</div>
            <Btn variant="outline" style={{ borderColor: ui.line, padding: "0 22px" }} icon={<Download size={20} />}>Exportar</Btn>
            <Btn variant="outline" style={{ borderColor: ui.line, padding: "0 22px" }} icon={<MapPin size={20} />}>Ver ubicaciones</Btn>
          </div>
          <div style={{ display: "flex", fontSize: 18, fontWeight: 600, padding: "16px 10px 10px", borderBottom: `1px solid ${ui.line}`, marginTop: 6 }}>
            <span style={{ flex: 1 }}>Producto</span><span style={{ width: 180 }}>Stock</span><span style={{ width: 220 }}>Ubicación</span><span style={{ width: 30 }} />
          </div>
          {rows.map((r, i) => (
            <div key={r.n} style={{ display: "flex", alignItems: "center", height: 84, borderBottom: `1px solid ${ui.line}`, fontSize: 21, padding: "0 10px", opacity: prog(f, at + i * 3, 10), background: r.hl && up > 0 && up < 1.2 ? `rgba(253,233,233,${0.9 * (1 - prog(f, update + 40, 30))})` : undefined, borderRadius: 12 }}>
              <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 14 }}><ProductThumb src={r.img} size={56} /> {r.n}</span>
              <span style={{ width: 180, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {r.s.toLocaleString("de-DE")}
                {r.hl && up > 0 && <span style={{ marginLeft: 10, fontSize: 16, color: ui.red, background: "#FDECEC", padding: "4px 8px", borderRadius: 8 }}>−10</span>}
              </span>
              <span style={{ width: 220 }}>{r.u}</span>
              <ChevronRight size={22} color={ui.text2} />
            </div>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Movimientos recientes</div>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { t: "Recepción · OC-2026-0158", v: "+48", c: ui.green, bg: ui.greenBg, I: PackageCheck },
                { t: "Transferencia #302 → Sur", v: "−10", c: ui.red, bg: "#FDECEC", I: ArrowLeftRight },
              ].map((m, i) => {
                const p = prog(f, moves + i * 8, 14, EASE.out);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, background: m.bg, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
                    <m.I size={24} color={m.c} />
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{m.t}</span>
                    <b style={{ marginLeft: "auto", color: m.c, fontSize: 22 }}>{m.v}</b>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export const _F = F;
