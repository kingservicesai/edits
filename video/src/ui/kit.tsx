import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import {
  Home, ShoppingCart, Package, PackageCheck, ArrowLeftRight, Tag, BarChart3, Users, HelpCircle, Star,
  CreditCard, Search, ChevronDown, Bell, Mic, Headphones,
} from "lucide-react";
import { C, F, SHADOW } from "../theme";
import { EASE, prog } from "../lib/anim";

export const ui = {
  bg: "#F6F7FB",
  card: "#FFFFFF",
  line: "#ECEEF3",
  line2: "#DDE0E8",
  head: "#F3F4F8",
  navy: "#0E1B3D",
  text: "#0E1B3D",
  text2: "#5B6478",
  text3: "#8B93A7",
  red: "#D62828",
  pink: "#FDE9E9",
  green: "#16A34A",
  greenBg: "#E7F6EC",
  amber: "#F59E0B",
  amberBg: "#FEF3DC",
  blueBg: "#EAF0FB",
  indigo: "#4F5BD5",
};

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; pad?: number }> = ({ style, children, pad = 24 }) => (
  <div
    style={{
      background: ui.card,
      borderRadius: 22,
      border: `1px solid ${ui.line}`,
      boxShadow: SHADOW.card,
      padding: pad,
      fontFamily: F.ui,
      color: ui.text,
      ...style,
    }}
  >
    {children}
  </div>
);

export const IconCircle: React.FC<{ icon: React.ReactNode; bg: string; size?: number; style?: React.CSSProperties }> = ({ icon, bg, size = 56, style }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...style }}>
    {icon}
  </div>
);

export const Btn: React.FC<{ children: React.ReactNode; variant?: "navy" | "outline" | "soft" | "red"; style?: React.CSSProperties; pressed?: number; icon?: React.ReactNode }> = ({
  children, variant = "navy", style, pressed = 0, icon,
}) => {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 12,
    borderRadius: 14, padding: "16px 28px", fontFamily: F.ui, fontWeight: 700, fontSize: 20,
    transform: `scale(${1 - pressed * 0.05})`, whiteSpace: "nowrap",
  };
  const v: Record<string, React.CSSProperties> = {
    navy: { background: ui.navy, color: "#fff", boxShadow: "0 8px 20px rgba(14,27,61,0.25)" },
    red: { background: ui.red, color: "#fff", boxShadow: "0 8px 20px rgba(214,40,40,0.28)" },
    outline: { background: "#fff", color: ui.navy, border: `1.5px solid ${ui.navy}` },
    soft: { background: ui.blueBg, color: ui.navy },
  };
  return <div style={{ ...base, ...v[variant], ...style }}>{icon}{children}</div>;
};

export const Pill: React.FC<{ children: React.ReactNode; color?: string; bg?: string; style?: React.CSSProperties; icon?: React.ReactNode }> = ({ children, color = ui.green, bg = ui.greenBg, style, icon }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999, background: bg, color, fontWeight: 600, fontSize: 17, fontFamily: F.ui, whiteSpace: "nowrap", ...style }}>
    {icon}
    {children}
  </div>
);

/** Text input with optional typing animation */
export const Field: React.FC<{
  label?: string; value: string; typeAt?: number; typeDur?: number; icon?: React.ReactNode; placeholder?: string;
  style?: React.CSSProperties; focus?: boolean; select?: boolean; big?: boolean; caretFrom?: number;
}> = ({ label, value, typeAt, typeDur = 20, icon, placeholder, style, focus, select, big, caretFrom }) => {
  const f = useCurrentFrame();
  let shown = value;
  let typing = false;
  if (typeAt !== undefined) {
    const p = prog(f, typeAt, typeDur, (t) => t);
    shown = value.slice(0, Math.round(value.length * p));
    typing = p > 0 && p < 1;
  }
  const showCaret = focus || typing || (caretFrom !== undefined && f >= caretFrom && shown.length === 0);
  const caretOn = Math.floor(f / 8) % 2 === 0 || typing;
  return (
    <div style={{ fontFamily: F.ui, ...style }}>
      {label && <div style={{ fontSize: 19, fontWeight: 600, color: ui.text, marginBottom: 10 }}>{label}</div>}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 14, height: big ? 70 : 62, padding: "0 20px",
          borderRadius: 14, background: "#fff", border: `1.5px solid ${focus || typing ? "#9DB4F0" : ui.line}`,
          boxShadow: focus || typing ? "0 0 0 4px rgba(79,120,240,0.12)" : "none",
          fontSize: big ? 26 : 21, color: ui.text, fontWeight: 500,
        }}
      >
        {icon}
        <div style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", color: shown ? ui.text : ui.text3 }}>
          {shown || placeholder}
          {showCaret && caretOn && <span style={{ display: "inline-block", width: 2, height: "1.1em", background: ui.navy, marginLeft: 2, verticalAlign: "middle" }} />}
        </div>
        {select && <ChevronDown size={22} color={ui.text2} />}
      </div>
    </div>
  );
};

export const Avatar: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 52, color = C.navy }) => {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}CC)`,
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui,
        fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, boxShadow: "0 0 0 3px #fff, 0 4px 10px rgba(0,0,0,0.12)",
      }}
    >
      {initials}
    </div>
  );
};

export const ProductThumb: React.FC<{ src: string; size?: number; style?: React.CSSProperties }> = ({ src, size = 64, style }) => (
  <div style={{ width: size, height: size, borderRadius: 12, background: "#F4F5F8", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    <Img src={staticFile(`products/${src}.png`)} style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
  </div>
);

/* ───────── Sidebar ───────── */

export type Role = "vendedor" | "gerente" | "dueno";
const NAV: Record<Role, { k: string; label: string; icon: React.ElementType }[]> = {
  vendedor: [
    { k: "inicio", label: "Inicio", icon: Home },
    { k: "ventas", label: "Mis Ventas", icon: ShoppingCart },
    { k: "validador", label: "Validador de Pagos", icon: CreditCard },
    { k: "comisiones", label: "Mis Comisiones", icon: Star },
    { k: "inventario", label: "Inventario", icon: Package },
    { k: "ayuda", label: "Ayuda", icon: HelpCircle },
  ],
  gerente: [
    { k: "inicio", label: "Inicio", icon: Home },
    { k: "inventario", label: "Inventario", icon: Package },
    { k: "recepciones", label: "Recepciones", icon: PackageCheck },
    { k: "transferencias", label: "Transferencias", icon: ArrowLeftRight },
    { k: "productos", label: "Productos", icon: Tag },
    { k: "reportes", label: "Reportes", icon: BarChart3 },
    { k: "ayuda", label: "Ayuda", icon: HelpCircle },
  ],
  dueno: [
    { k: "inicio", label: "Inicio", icon: Home },
    { k: "ventas", label: "Ventas", icon: ShoppingCart },
    { k: "inventario", label: "Inventario", icon: Package },
    { k: "recepciones", label: "Recepciones", icon: PackageCheck },
    { k: "transferencias", label: "Transferencias", icon: ArrowLeftRight },
    { k: "productos", label: "Productos", icon: Tag },
    { k: "reportes", label: "Reportes", icon: BarChart3 },
    { k: "usuarios", label: "Usuarios", icon: Users },
    { k: "ayuda", label: "Ayuda", icon: HelpCircle },
  ],
};

export const Sidebar: React.FC<{ role: Role; active: string; width?: number }> = ({ role, active, width = 290 }) => (
  <div
    style={{
      width, flexShrink: 0, background: "#fff", borderRadius: 26, border: `1px solid ${ui.line}`, boxShadow: SHADOW.card,
      display: "flex", flexDirection: "column", alignItems: "stretch", padding: "26px 16px", fontFamily: F.ui, gap: 6,
    }}
  >
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
      <Img src={staticFile("brand/logo_keyed.png")} style={{ width: 150, height: 153 }} />
    </div>
    {NAV[role].map((n) => {
      const on = n.k === active;
      const I = n.icon;
      return (
        <div
          key={n.k}
          style={{
            display: "flex", alignItems: "center", gap: 16, padding: "15px 18px", borderRadius: 16,
            background: on ? ui.pink : "transparent", color: on ? ui.red : ui.text, fontWeight: on ? 700 : 500, fontSize: 20, whiteSpace: "nowrap",
          }}
        >
          <I size={25} strokeWidth={on ? 2.3 : 1.8} />
          {n.label}
        </div>
      );
    })}
  </div>
);

export const Header: React.FC<{ greet: string; sub: string; user: string; role: string; mic?: React.ReactNode; avatarColor?: string; emoji?: boolean }> = ({ greet, sub, user, role, mic, avatarColor, emoji = true }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", fontFamily: F.ui, marginBottom: 20 }}>
    <div>
      <div style={{ fontSize: 46, fontWeight: 800, color: ui.text, letterSpacing: -1 }}>
        {greet} {emoji && <span style={{ fontFamily: "Noto Color Emoji" }}>👋</span>}
      </div>
      <div style={{ fontSize: 22, color: ui.text2, marginTop: 6 }}>{sub}</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {mic}
      <div style={{ width: 60, height: 60, borderRadius: "50%", border: `1px solid ${ui.line}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Search size={26} color={ui.text} />
      </div>
      <div style={{ width: 60, height: 60, borderRadius: "50%", border: `1px solid ${ui.line}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Bell size={26} color={ui.text} />
        <div style={{ position: "absolute", top: 10, right: 12, width: 12, height: 12, borderRadius: 6, background: ui.red, border: "2px solid #fff" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 16px 6px 6px", borderRadius: 999, border: `1px solid ${ui.line}`, background: "#fff" }}>
        <Avatar name={user} size={50} color={avatarColor} />
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user}</div>
          <div style={{ fontSize: 15, color: ui.text2 }}>{role}</div>
        </div>
        <ChevronDown size={20} color={ui.text2} />
      </div>
    </div>
  </div>
);

export const MicButton: React.FC<{ active?: number; pulse?: boolean }> = ({ active = 0, pulse }) => {
  const f = useCurrentFrame();
  const ring = pulse ? (f % 30) / 30 : 0;
  return (
    <div style={{ position: "relative", width: 60, height: 60 }}>
      {pulse && (
        <div style={{ position: "absolute", inset: -ring * 18, borderRadius: "50%", border: `2px solid rgba(214,40,40,${0.5 * (1 - ring)})` }} />
      )}
      <div
        style={{
          width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: active > 0.5 ? ui.red : "#fff", border: `1px solid ${active > 0.5 ? ui.red : ui.line}`,
          boxShadow: active > 0.5 ? "0 8px 24px rgba(214,40,40,0.35)" : "none",
        }}
      >
        <Mic size={26} color={active > 0.5 ? "#fff" : ui.red} />
      </div>
    </div>
  );
};

/** App shell: sidebar + content */
export const AppShell: React.FC<{
  role: Role; active: string; children: React.ReactNode; width?: number; height?: number; style?: React.CSSProperties;
}> = ({ role, active, children, width = 1720, height = 1040, style }) => (
  <div style={{ width, height, background: ui.bg, display: "flex", gap: 26, padding: 22, boxSizing: "border-box", fontFamily: F.ui, ...style }}>
    <Sidebar role={role} active={active} />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>{children}</div>
  </div>
);

/** Window chrome around the app */
export const AppWindow: React.FC<{ children: React.ReactNode; width: number; height: number; url?: string; style?: React.CSSProperties }> = ({ children, width, height, url = "app.mayordesillas.com", style }) => (
  <div
    style={{
      width, height: height + 52, borderRadius: 22, overflow: "hidden", background: "#fff",
      boxShadow: "0 50px 120px rgba(14,27,61,0.28), 0 12px 30px rgba(14,27,61,0.12)", border: "1px solid rgba(14,27,61,0.08)", ...style,
    }}
  >
    <div style={{ height: 52, background: "#F1F2F6", display: "flex", alignItems: "center", padding: "0 20px", gap: 10, borderBottom: "1px solid #E4E6EC" }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, background: "#FF5F57" }} />
      <div style={{ width: 14, height: 14, borderRadius: 7, background: "#FEBC2E" }} />
      <div style={{ width: 14, height: 14, borderRadius: 7, background: "#28C840" }} />
      <div style={{ marginLeft: 24, flex: 1, maxWidth: 560, height: 32, borderRadius: 9, background: "#fff", border: "1px solid #E4E6EC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.ui, fontSize: 15, color: ui.text2, gap: 8 }}>
        <span style={{ color: ui.green }}>●</span> {url}
      </div>
    </div>
    <div style={{ width, height, overflow: "hidden", position: "relative" }}>{children}</div>
  </div>
);

/** Section title inside pages (icon chip + big title) */
export const PageTitle: React.FC<{ icon: React.ReactNode; title: string; sub?: string; dark?: boolean }> = ({ icon, title, sub, dark = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: F.ui }}>
    <div style={{ width: 72, height: 72, borderRadius: "50%", background: dark ? ui.navy : ui.pink, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
    <div>
      <div style={{ fontSize: 40, fontWeight: 800, color: ui.text, letterSpacing: -0.8 }}>{title}</div>
      {sub && <div style={{ fontSize: 20, color: ui.text2, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

export const Stepper: React.FC<{ steps: string[]; current: number; progress?: number }> = ({ steps, current, progress = 0 }) => (
  <div style={{ display: "flex", alignItems: "flex-start", fontFamily: F.ui }}>
    {steps.map((s, i) => {
      const done = i < current;
      const on = i === current;
      return (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 150 }}>
            <div
              style={{
                width: 44, height: 44, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? ui.green : on ? ui.navy : "#E3E6EE", color: done || on ? "#fff" : ui.text3, fontWeight: 700, fontSize: 19,
                boxShadow: on ? "0 0 0 6px rgba(14,27,61,0.12)" : "none",
              }}
            >
              {done ? "✓" : i + 1}
            </div>
            <div style={{ fontSize: 17, fontWeight: on ? 700 : 500, color: on || done ? ui.text : ui.text3 }}>{s}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 3, marginTop: 21, background: "#E3E6EE", borderRadius: 2, overflow: "hidden", minWidth: 40 }}>
              <div style={{ width: `${done ? 100 : on ? progress * 100 : 0}%`, height: "100%", background: ui.green }} />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export const SupportIcon = Headphones;
