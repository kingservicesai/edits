import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ShoppingCart, User, Phone, Mail, RefreshCw, Search, CheckCircle2, Minus, Plus, Trash2, Tag, Lock, Info, Check, Save } from "lucide-react";
import { AppShell, Btn, Card, Header, PageTitle, Pill, ProductThumb, ui } from "./kit";
import { EASE, prog } from "../lib/anim";
import { F } from "../theme";

export type VentaEv = {
  client: number; // client selected
  type1: number; row1: number;
  type2: number; row2: number;
  highlightVendor: number; highlightSuc: number;
  stock: number; qty: number; totals: number;
  confirm: number; // button press
};

const usd = (v: number) => "$" + v.toFixed(2);

const Glow: React.FC<{ at: number; until: number; children: React.ReactNode; radius?: number; color?: string }> = ({ at, until, children, radius = 18, color = "214,40,40" }) => {
  const f = useCurrentFrame();
  const on = interpolate(f, [at, at + 8, until - 8, until], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.6 + 0.4 * Math.sin((f - at) / 4);
  return (
    <div style={{ position: "relative", borderRadius: radius, boxShadow: on > 0 ? `0 0 0 ${4 * on}px rgba(${color},${0.55 * on * pulse}), 0 0 40px rgba(${color},${0.35 * on})` : undefined, transform: `scale(${1 + 0.015 * on})` }}>
      {children}
    </div>
  );
};

export const PageVenta: React.FC<{ ev: VentaEv }> = ({ ev }) => {
  const f = useCurrentFrame();
  const clientIn = prog(f, ev.client, 12);
  const r1 = prog(f, ev.row1, 14, EASE.back);
  const r2 = prog(f, ev.row2, 14, EASE.back);
  const qty1 = f >= ev.qty ? 2 : 1;
  const qtyPop = interpolate(f, [ev.qty, ev.qty + 4, ev.qty + 10], [1, 1.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tot1 = 120 * qty1;
  const sub = (r1 > 0.5 ? tot1 : 0) + (r2 > 0.5 ? 180 : 0);
  const tp = prog(f, ev.totals, 24);
  const subShown = f < ev.totals ? 0 : sub * tp;
  const tax = subShown * 0.16;
  const typing1 = f >= ev.type1 && f < ev.row1;
  const typing2 = f >= ev.type2 && f < ev.row2;
  const q = typing1 ? "SE-001".slice(0, Math.round(6 * prog(f, ev.type1, 14, (t) => t))) : typing2 ? "MO-002".slice(0, Math.round(6 * prog(f, ev.type2, 14, (t) => t))) : "";
  const suggest = typing1 ? prog(f, ev.type1 + 10, 6) : typing2 ? prog(f, ev.type2 + 10, 6) : 0;
  const stockGlow = interpolate(f, [ev.stock, ev.stock + 6, ev.stock + 40, ev.stock + 50], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pressed = interpolate(f, [ev.confirm - 1, ev.confirm + 2, ev.confirm + 7], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const th: React.CSSProperties = { fontSize: 18, fontWeight: 600, color: ui.text, padding: "18px 16px", textAlign: "left" };
  const Row: React.FC<{ p: number; img: string; name: string; sku: string; stock: number; qty: number; price: number; total: number; qtyScale?: number }> = ({ p, img, name, sku, stock, qty, price, total, qtyScale = 1 }) => (
    <div style={{ display: "flex", alignItems: "center", height: 84, borderTop: `1px solid ${ui.line}`, opacity: p, transform: `translateY(${(1 - p) * 20}px)`, fontSize: 20 }}>
      <div style={{ width: 300, display: "flex", alignItems: "center", gap: 16, paddingLeft: 16 }}>
        <ProductThumb src={img} size={66} />
        <span style={{ fontWeight: 500 }}>{name}</span>
      </div>
      <div style={{ width: 130, color: ui.text }}>{sku}</div>
      <div style={{ width: 190 }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, color: ui.green, fontWeight: 600, padding: "6px 12px", borderRadius: 12,
            background: stockGlow > 0 ? `rgba(22,163,74,${0.14 * stockGlow})` : "transparent", boxShadow: stockGlow > 0 ? `0 0 0 ${3 * stockGlow}px rgba(22,163,74,0.35)` : undefined,
          }}
        >
          <CheckCircle2 size={24} fill={ui.green} color="#fff" /> {stock} und.
        </span>
      </div>
      <div style={{ width: 180, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={18} /></div>
        <div style={{ width: 54, height: 50, borderRadius: 10, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, transform: `scale(${qtyScale})` }}>{qty}</div>
        <div style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={18} /></div>
      </div>
      <div style={{ width: 230 }}>
        <div style={{ width: 190, height: 52, borderRadius: 12, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 20 }}>{price.toFixed(2)}</div>
      </div>
      <div style={{ flex: 1, textAlign: "right", fontWeight: 800, fontSize: 26, paddingRight: 30 }}>{usd(total)}</div>
      <div style={{ width: 70, display: "flex", justifyContent: "center" }}><Trash2 size={24} color={ui.text2} /></div>
    </div>
  );

  return (
    <AppShell role="vendedor" active="ventas">
      <Header greet="Buenos días, Andrea" sub="Aquí puedes registrar una nueva venta" user="Andrea" role="Vendedora · Centro" avatarColor="#D62828" />
      <Card style={{ flex: 1, padding: "22px 30px", position: "relative" }}>
        <PageTitle icon={<ShoppingCart size={36} color="#fff" />} title="Registrar venta" />
        <div style={{ height: 1, background: ui.line, margin: "14px 0 12px" }} />
        {/* Cliente */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
          <User size={26} /> Cliente
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ flex: 1, height: 78, borderRadius: 16, background: "#F5F6FA", border: `1px solid ${ui.line}`, padding: "0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {clientIn > 0 ? (
              <div style={{ opacity: clientIn, transform: `translateY(${(1 - clientIn) * 10}px)` }}>
                <div style={{ fontWeight: 700, fontSize: 22 }}>María Rodríguez</div>
                <div style={{ display: "flex", gap: 18, fontSize: 18, color: ui.text, marginTop: 6, alignItems: "center" }}>
                  <Phone size={18} /> +58 412 555 1234 <span style={{ color: ui.line }}>|</span> <Mail size={18} /> maria.rodriguez@gmail.com
                </div>
              </div>
            ) : (
              <div style={{ color: ui.text3, fontSize: 20 }}>Seleccionar cliente…</div>
            )}
          </div>
          <Btn variant="outline" style={{ borderRadius: 999, borderColor: ui.line, borderWidth: 1.5 }} icon={<RefreshCw size={20} />}>Cambiar cliente</Btn>
        </div>
        {/* Search */}
        <div style={{ position: "relative", marginTop: 12 }}>
          <div style={{ height: 62, borderRadius: 16, border: `1.5px solid ${typing1 || typing2 ? "#9DB4F0" : ui.line}`, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", fontSize: 20, background: "#fff", boxShadow: typing1 || typing2 ? "0 0 0 4px rgba(79,120,240,0.12)" : "none" }}>
            <Search size={24} color={ui.text2} />
            <span style={{ color: q ? ui.text : ui.text2 }}>
              {q || "Buscar producto por SKU o nombre..."}
              {(typing1 || typing2) && Math.floor(f / 8) % 2 === 0 && <span style={{ display: "inline-block", width: 2, height: 22, background: ui.navy, marginLeft: 2, verticalAlign: "middle" }} />}
            </span>
          </div>
          {suggest > 0 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 68, zIndex: 5, opacity: suggest, transform: `translateY(${(1 - suggest) * -8}px)` }}>
              <Card pad={10} style={{ boxShadow: "0 20px 40px rgba(14,27,61,0.16)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 12px", borderRadius: 12, background: "#F3F6FD", fontSize: 19 }}>
                  <ProductThumb src={typing1 ? "silla_ejecutiva" : "mesa_oficina"} size={46} />
                  <b>{typing1 ? "Silla Ejecutiva" : "Mesa de Oficina"}</b>
                  <span style={{ color: ui.text2 }}>{typing1 ? "SE-001" : "MO-002"}</span>
                  <span style={{ marginLeft: "auto", color: ui.green, fontWeight: 600 }}>{typing1 ? "12" : "8"} und. disponibles</span>
                </div>
              </Card>
            </div>
          )}
        </div>
        {/* Table */}
        <div style={{ marginTop: 14, borderRadius: 18, border: `1px solid ${ui.line}`, overflow: "hidden", minHeight: 230 }}>
          <div style={{ display: "flex", background: ui.head }}>
            <div style={{ ...th, width: 300, paddingLeft: 60 }}>Producto</div>
            <div style={{ ...th, width: 130, padding: "18px 0" }}>SKU</div>
            <div style={{ ...th, width: 190, padding: "18px 0" }}>Stock Disponible</div>
            <div style={{ ...th, width: 180, padding: "18px 0" }}>Cantidad</div>
            <div style={{ ...th, width: 230, padding: "18px 0" }}>Precio Unitario (USD)</div>
            <div style={{ ...th, flex: 1, padding: "18px 30px 18px 0", textAlign: "right" }}>Total (USD)</div>
            <div style={{ width: 70 }} />
          </div>
          {r1 > 0 && <Row p={r1} img="silla_ejecutiva" name="Silla Ejecutiva" sku="SE-001" stock={12} qty={qty1} price={120} total={tot1} qtyScale={qtyPop} />}
          {r2 > 0 && <Row p={r2} img="mesa_oficina" name="Mesa de Oficina" sku="MO-002" stock={8} qty={1} price={180} total={180} />}
        </div>
        {/* Bottom */}
        <div style={{ display: "flex", gap: 22, marginTop: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, background: "#F5F6FA", fontSize: 18, fontWeight: 600 }}>
                <Tag size={22} /> Descuento (USD)
              </div>
              <div style={{ width: 160, height: 54, borderRadius: 12, border: `1px solid ${ui.line}`, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 20, color: ui.text2 }}>0.00</div>
            </div>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <Glow at={ev.highlightVendor} until={ev.highlightVendor + 75}>
                <div style={{ width: 330, padding: "16px 20px", borderRadius: 18, border: `1px solid ${ui.line}`, background: "#F8F9FC", display: "flex", gap: 14, alignItems: "center" }}>
                  <Lock size={26} color={ui.text} />
                  <div style={{ lineHeight: 1.25 }}>
                    <div style={{ fontSize: 16, color: ui.text2 }}>Vendedor</div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>Andrea</div>
                    <div style={{ fontSize: 14, color: ui.text2 }}>Asignado automáticamente</div>
                  </div>
                </div>
              </Glow>
              <Glow at={ev.highlightSuc} until={ev.highlightSuc + 60}>
                <div style={{ width: 300, padding: "16px 20px", borderRadius: 18, border: `1px solid ${ui.line}`, background: "#F8F9FC", display: "flex", gap: 14, alignItems: "center" }}>
                  <Lock size={26} color={ui.text} />
                  <div style={{ lineHeight: 1.25 }}>
                    <div style={{ fontSize: 16, color: ui.text2 }}>Sucursal</div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>Centro</div>
                    <div style={{ fontSize: 14, color: ui.text2 }}>Asignada automáticamente</div>
                  </div>
                </div>
              </Glow>
              <Pill style={{ fontSize: 17, padding: "12px 16px" }} icon={<CheckCircle2 size={22} fill={ui.green} color="#fff" />}>Inventario disponible</Pill>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 20px", borderRadius: 16, background: "#EEF3FD", fontSize: 16, color: ui.text, lineHeight: 1.45 }}>
              <Info size={30} color="#fff" fill="#3B6FE0" style={{ flexShrink: 0 }} />
              <div>
                Por políticas del sistema, el vendedor y la sucursal se asignan automáticamente y no pueden ser cambiados por el vendedor.
                <br />
                El vendedor no puede ver las ventas, márgenes o comisiones de otros vendedores.
              </div>
            </div>
          </div>
          <div style={{ width: 370, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ borderRadius: 18, background: "#F5F6FA", border: `1px solid ${ui.line}`, padding: "16px 24px", fontSize: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span>Subtotal</span><b style={{ fontWeight: 600 }}>{usd(subShown)}</b></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Impuesto (16%)</span><b style={{ fontWeight: 600 }}>{usd(tax)}</b></div>
              <div style={{ height: 1, background: ui.line2, margin: "14px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 28, fontWeight: 800 }}>Total</span>
                <span style={{ fontSize: 40, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{usd(subShown + tax)}</span>
              </div>
            </div>
            <Btn pressed={pressed} style={{ width: "100%", padding: "16px 0", fontSize: 22, borderRadius: 16, boxSizing: "border-box" }} icon={<Check size={26} />}>Confirmar venta</Btn>
            <Btn variant="outline" style={{ width: "100%", padding: "12px 0", fontSize: 20, borderRadius: 16, boxSizing: "border-box" }} icon={<Save size={22} />}>Guardar borrador</Btn>
          </div>
        </div>
      </Card>
    </AppShell>
  );
};

export const ventaTotals = { subtotal: 420, tax: 67.2, total: 487.2, commission: 42 };
export const FONT_UI = F.ui;
