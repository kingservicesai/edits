import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { ShoppingCart, Package, Building2, Coins, Landmark } from "lucide-react";
import { C, F as FONT, SHADOW } from "../theme";
import { EASE, prog } from "../lib/anim";
import { F, FE, W } from "../timeline";
import { LightBG, Photo, Flash, FlagBar, LightSweep, Grain, Clip } from "../components/base";
import { Headline } from "../components/overlays";
import { LogoReveal } from "../components/Logo";
import { cue, Cue } from "../lib/scene";
import { AppWindow } from "../ui/kit";
import { PageDashboard } from "../ui/PagesDueno";

const S = F("sc6") - 6;
const E = F("end") + 2;

const t = {
  n1: F("S6N1"), negocio: W("S6N1", "negocio"), crecimiento: W("S6N1", "crecimiento"),
  por: W("S6N1", "por"), presentamos: W("S6N1", "presentamos"), empresa: W("S6N1", "empresa"),
  una: W("S6N1", "una", 26), plataforma: W("S6N1", "plataforma"),
  ventas: W("S6N1", "ventas"), inventario: W("S6N1", "inventario"), sucursales: W("S6N1", "sucursales"), comisiones: W("S6N1", "comisiones"), financiera: W("S6N1", "financiera"), lugar: W("S6N1", "lugar"),
  porque: W("S6N1", "porque"), vender: W("S6N1", "vender"),
  significa: W("S6N1", "significa", 54), pasando: W("S6N1", "pasando"), mejorar: W("S6N1", "mejorar"), avanzar: W("S6N1", "avanzar"),
  build: F("s6_build"),
  n2: F("S6N2"), unNeg: W("S6N2", "un"), sistema: W("S6N2", "sistema"), control: W("S6N2", "control"), siguiente: W("S6N2", "el", 10),
  endcard: F("endcard"), end: F("end"),
};

export const sfx6: Cue[] = [
  cue(t.n1 - 4, "whoosh_deep", 0.4),
  cue(t.por - 4, "whoosh", 0.4),
  cue(t.plataforma - 4, "impact2", 0.35),
  cue(t.ventas - 2, "pop", 0.4),
  cue(t.inventario - 2, "pop2", 0.4),
  cue(t.sucursales - 2, "pop", 0.4),
  cue(t.comisiones - 2, "pop2", 0.4),
  cue(t.financiera - 2, "pop", 0.4),
  cue(t.lugar - 4, "data", 0.4),
  cue(t.porque - 4, "whoosh2", 0.4),
  cue(t.significa - 4, "whoosh", 0.35),
  cue(t.mejorar - 4, "whoosh2", 0.3),
  cue(t.avanzar - 4, "whoosh", 0.3),
  cue(t.build - 6, "riser", 0.45),
  cue(t.n2 - 2, "shimmer", 0.5),
  cue(t.unNeg - 2, "stamp", 0.45),
  cue(t.sistema - 2, "stamp", 0.45),
  cue(t.control - 2, "stamp", 0.5),
];

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S || f > E) return null;
  const mods = [
    { at: t.ventas, l: "Ventas", I: ShoppingCart, c: C.red },
    { at: t.inventario, l: "Inventario", I: Package, c: C.vzBlue },
    { at: t.sucursales, l: "Sucursales", I: Building2, c: C.navy },
    { at: t.comisiones, l: "Comisiones", I: Coins, c: C.amber },
    { at: t.financiera, l: "Finanzas", I: Landmark, c: "#0F766E" },
  ];
  const conv = prog(f, t.lugar - 6, 20, EASE.inOut);
  const endFade = prog(f, t.end - 30, 30, EASE.inOut);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* 1. hero product */}
      {f < t.por + 4 && (
        <AbsoluteFill style={{ opacity: 1 - prog(f, t.por - 4, 8) }}>
          <Clip name="chair_hero" from={S} dur={190} zoom={[1.0, 1.04]} grade="contrast(1.05)" />
          <LightSweep at={t.n1 + 10} dur={60} color="255,240,220" />
          <div style={{ position: "absolute", left: 130, top: 330, width: 820 }}>
            <Headline at={t.n1 + 2} text="Un negocio construido para crecer" size={86} color={C.navy} accentWord="crecer" accent={C.red} align="left" />
            <div style={{ marginTop: 26 }}>
              <FlagBar w={240} h={7} p={prog(f, t.negocio, 24, EASE.out)} />
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* 2. new way to manage → platform */}
      {f >= t.por - 6 && f < t.porque + 4 && (
        <AbsoluteFill style={{ opacity: prog(f, t.por - 6, 8) * (1 - prog(f, t.porque - 4, 8)) }}>
          <LightBG />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2200 }}>
            <div
              style={{
                width: 1200, height: 762, borderRadius: 22, overflow: "hidden", boxShadow: "0 60px 140px rgba(14,27,61,0.35)",
                transform: `translateY(${(1 - prog(f, t.por - 2, 30, EASE.out)) * 400 + 20}px) rotateX(${18 * (1 - prog(f, t.por - 2, 40, EASE.out))}deg) scale(${0.85 + 0.1 * prog(f, t.plataforma, 120)})`,
                opacity: prog(f, t.por - 2, 10),
              }}
            >
              <div style={{ transform: `scale(${1200 / 1720})`, transformOrigin: "0 0" }}>
                <AppWindow width={1720} height={1040}>
                  <PageDashboard at={t.por} />
                </AppWindow>
              </div>
            </div>
          </AbsoluteFill>
          {mods.map((m, i) => {
            const ang = -Math.PI / 2 + (i / mods.length) * Math.PI * 2;
            const rx = 820 * (1 - conv);
            const ry = 400 * (1 - conv);
            const x = 960 + Math.cos(ang) * rx;
            const y = 540 + Math.sin(ang) * ry;
            const p = prog(f, m.at - 4, 12, EASE.back);
            return (
              <div key={m.l} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p * (1 - 0.6 * conv)})`, opacity: Math.min(1, p) * (1 - conv), display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", borderRadius: 999, background: "#fff", boxShadow: SHADOW.deep, fontFamily: FONT.display, fontWeight: 800, fontSize: 38, color: C.navy, whiteSpace: "nowrap" }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: m.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <m.I size={30} color="#fff" />
                </div>
                {m.l}
              </div>
            );
          })}
          {conv > 0 && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 60 }}>
              <div style={{ padding: "20px 44px", borderRadius: 999, background: C.navy, color: "#fff", fontFamily: FONT.display, fontWeight: 900, fontSize: 52, transform: `scale(${prog(f, t.lugar - 4, 14, EASE.back)})`, boxShadow: SHADOW.deep }}>
                Todo en un solo lugar
              </div>
            </AbsoluteFill>
          )}
          <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}>
            {f < t.una - 4 && <Headline at={t.presentamos - 4} text="Una nueva forma de gestionar la empresa" size={64} color={C.navy} accentWord="nueva" accent={C.red} />}
          </div>
        </AbsoluteFill>
      )}
      {/* 3. growth ≠ only selling more */}
      {f >= t.porque - 6 && f < t.significa + 2 && (
        <AbsoluteFill style={{ opacity: prog(f, t.porque - 6, 8) * (1 - prog(f, t.significa - 4, 6)) }}>
          <Clip name="chairs_row" from={t.porque - 6} dur={110} zoom={[1.0, 1.05]} grade="brightness(0.55) saturate(0.9)" />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <Headline at={t.porque} text="Crecer no es solo vender más" size={110} accentWord="vender" accent={C.yellow} style={{ maxWidth: 1500 }} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {/* 4. control: what's happening / where to improve / where to go */}
      {f >= t.significa - 6 && f < t.n2 + 2 && (
        <AbsoluteFill style={{ opacity: prog(f, t.significa - 6, 8) * (1 - prog(f, t.n2 - 4, 6)) }}>
          {[
            { at: t.significa - 6, src: "photos/showroom.jpg", txt: "Saber qué está pasando" },
            { at: t.mejorar - 6, src: "photos/warehouse.jpg", txt: "Dónde mejorar" },
            { at: t.avanzar - 8, src: "photos/chair_detail.jpg", txt: "Hacia dónde avanzar" },
          ].map((s, i, arr) => {
            const next = arr[i + 1]?.at ?? t.n2;
            if (f < s.at || f > next + 6) return null;
            const p = prog(f, s.at, 12, EASE.out);
            return (
              <AbsoluteFill key={i} style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
                {s.src.includes("showroom") ? (
                  <Clip name="showroom" from={s.at} dur={60} zoom={[1.0, 1.04]} grade="brightness(0.6)" />
                ) : s.src.includes("warehouse") ? (
                  <Clip name="warehouse" from={s.at} dur={60} zoom={[1.0, 1.04]} grade="brightness(0.6)" />
                ) : (
                  <Photo src={s.src} start={s.at} dur={60} from={{ s: 1.2, x: 30, y: 0 }} to={{ s: 1.1, x: -30, y: 0 }} grade="brightness(0.6)" />
                )}
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                  <Headline at={s.at + 2} text={s.txt} size={110} accent={C.yellow} accentWord={["pasando", "mejorar", "avanzar"][i]} />
                </AbsoluteFill>
              </AbsoluteFill>
            );
          })}
          {/* control word */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center", fontFamily: FONT.ui, fontWeight: 700, letterSpacing: 10, fontSize: 26, color: "rgba(255,255,255,0.85)" }}>TENER EL CONTROL</div>
        </AbsoluteFill>
      )}
      {/* 5. logo + tagline + end card */}
      {f >= t.build - 2 && (
        <AbsoluteFill style={{ opacity: prog(f, t.build - 2, 6) }}>
          <LightBG />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateY(${-150 * prog(f, t.unNeg - 6, 24, EASE.inOut)}px) scale(${1 - 0.22 * prog(f, t.unNeg - 6, 24, EASE.inOut)})` }}>
            <LogoReveal at={t.build - 2} width={520} speed={1.0} shineAt={70} />
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 170 + 90 * prog(f, t.endcard, 18, EASE.inOut) }}>
            <div style={{ display: "flex", gap: 34, fontFamily: FONT.display, fontWeight: 900, fontSize: 70, color: C.navy, letterSpacing: -1 }}>
              {[
                { at: t.unNeg, w: "Un negocio." },
                { at: t.sistema - 6, w: "Un sistema." },
                { at: t.control - 8, w: "Un control total." },
              ].map((x, i) => {
                const sc = interpolate(f, [x.at - 2, x.at + 4, x.at + 10], [1.6, 0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <span key={i} style={{ opacity: prog(f, x.at - 2, 5), transform: `scale(${sc})`, color: i === 2 ? C.red : C.navy, display: "inline-block" }}>{x.w}</span>
                );
              })}
            </div>
            <div style={{ marginTop: 26, fontFamily: FONT.ui, fontSize: 34, fontWeight: 500, color: C.text2, opacity: prog(f, t.siguiente - 4, 14) * (1 - prog(f, t.endcard + 10, 12)) }}>El siguiente paso en la evolución de tu empresa.</div>
          </AbsoluteFill>
          {/* end card text */}
          {f >= t.endcard && (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 70 }}>
              <div style={{ textAlign: "center", opacity: prog(f, t.endcard + 14, 14) }}>
                <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 30, letterSpacing: 8, color: C.navy }}>MAYOR DE SILLAS VENEZUELA C.A.</div>
                <div style={{ display: "flex", gap: 26, justifyContent: "center", marginTop: 16, fontFamily: FONT.ui, fontSize: 26, color: C.text2, fontWeight: 600 }}>
                  {["Tu negocio, conectado.", "Tu información, bajo control.", "Tu crecimiento, con dirección."].map((s, i) => (
                    <span key={s} style={{ opacity: prog(f, t.endcard + 22 + i * 10, 12), transform: `translateY(${(1 - prog(f, t.endcard + 22 + i * 10, 14, EASE.out)) * 16}px)`, display: "inline-block" }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
                  <FlagBar w={300} h={6} p={prog(f, t.endcard + 50, 24, EASE.out)} />
                </div>
              </div>
            </AbsoluteFill>
          )}
          <Flash at={t.build - 2} dur={12} color="#fff" max={0.8} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "#000", opacity: endFade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const _s6 = { FE, Grain };
