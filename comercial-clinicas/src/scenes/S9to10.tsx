import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, EASE, EASE_INOUT, FONT, metal } from "../theme";
import { Beam, clamp, Counter, Figure, Particles, ramp, RevealLine, Shot } from "../components/core";
import { ClinicHall, proj } from "../components/space";

/* ================================================================== */
/* ESCENA 9 — AUTORIDAD Y ESCALA (315 f)                               */
/* ================================================================== */
export const Scene9: React.FC = () => {
  const f = useCurrentFrame();
  const N = 64;
  const spread = interpolate(f, [0, 120], [0.15, 1], { ...clamp, easing: EASE_INOUT });
  const pull = interpolate(f, [0, 315], [0, 1], clamp);
  const dimScreens = ramp(f, 60, 90) * 0.55;
  return (
    <AbsoluteFill style={{ background: "#020203" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 45% at 50% 45%, #13202D 0%, #020203 75%)", opacity: 0.4 + 0.6 * ramp(f, 40, 120) }} />
      <Particles count={120} seed="s9" speed={0.5} opacity={0.55} maxSize={3.5} />
      {/* pantallas flotantes que se multiplican en un volumen 3D */}
      <AbsoluteFill style={{ perspective: 1400, opacity: 1 - dimScreens }}>
        <div style={{ position: "absolute", left: 540, top: 900, transformStyle: "preserve-3d", transform: `rotateY(${-14 + pull * 22}deg) rotateX(${8 - pull * 6}deg) translateZ(${-200 - pull * 500}px)` }}>
          {new Array(N).fill(0).map((_, i) => {
            const show = ramp(f, (i / N) * 70, (i / N) * 70 + 16);
            const gx = ((i % 8) - 3.5) * 330 * spread;
            const gy = (Math.floor(i / 8) - 3.5) * 470 * spread;
            const gz = (random(`z${i}`) - 0.5) * 1400 * spread;
            const hue = random(`h${i}`);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: -110,
                  top: -195,
                  width: 220,
                  height: 390,
                  borderRadius: 22,
                  transform: `translate3d(${gx}px, ${gy}px, ${gz}px) scale(${show})`,
                  background: `linear-gradient(160deg, rgba(${60 + hue * 60},${80 + hue * 60},${110 + hue * 50},0.55), rgba(10,14,20,0.8))`,
                  border: "1px solid rgba(220,232,245,0.35)",
                  boxShadow: "0 0 50px rgba(143,188,230,0.18)",
                  opacity: show,
                }}
              >
                <div style={{ position: "absolute", left: 18, right: 18, bottom: 26, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.25)" }}>
                  <div style={{ width: `${30 + hue * 70}%`, height: "100%", background: "rgba(255,255,255,0.8)", borderRadius: 3 }} />
                </div>
                <div style={{ margin: "150px auto 0", width: 0, height: 0, borderLeft: "34px solid rgba(255,255,255,0.7)", borderTop: "22px solid transparent", borderBottom: "22px solid transparent" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* luz volumétrica tras la cifra */}
      <Beam x={540} y={300} angle={0} width={1200} length={900} opacity={0.3 * ramp(f, 60, 100)} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 18% at 50% 46%, rgba(220,232,245,0.25), rgba(0,0,0,0) 70%)", opacity: ramp(f, 70, 110) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}>
        <RevealLine at={2} out={54} size={64} weight={600} color={C.silver} tracking={0.04}>
          Y MUCHOS CASOS MÁS.
        </RevealLine>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${1 + ramp(f, 66, 150) * 0.04})`, filter: `drop-shadow(0 0 40px rgba(143,188,230,${0.35 * ramp(f, 120, 150)}))` }}>
          <Counter to={200000000} at={66} dur={84} size={150} suffix="+" metallic />
        </div>
        <div style={{ marginTop: 26 }}>
          <RevealLine at={120} size={70} weight={800} tracking={0.06}>
            VISTAS GENERADAS.
          </RevealLine>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <RevealLine at={190} size={58} weight={700} color={C.silver} tracking={0.02}>
          DECENAS DE MILES DE
        </RevealLine>
        <RevealLine at={196} size={58} weight={700} color={C.silver} tracking={0.02}>
          DÓLARES FACTURADOS.
        </RevealLine>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ESCENA 10 — LLAMADO A LA ACCIÓN (450 f)                             */
/* ================================================================== */
export const Scene10: React.FC = () => {
  const f = useCurrentFrame();
  // A: dolly por el pasillo mientras el especialista avanza hacia cámara
  const camZ = interpolate(f, [0, 150], [2, 10], { ...clamp, easing: EASE_INOUT });
  const figZ = interpolate(f, [0, 150], [22, 15]);
  const cam = { x: 0, y: 0, z: camZ, f: 820, cx: 540, cy: 900 };
  const base = proj(cam, [0, 1.55, figZ]);
  const top = proj(cam, [0, -0.35, figZ]);
  const figH = (base[1] - top[1]) * 1.0;
  const step = Math.sin(f / 7) * 0.8;
  const ctaIn = 270;
  const sweep = interpolate(f, [ctaIn + 70, ctaIn + 130], [-60, 160], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shot from={0} to={150} push={0} fadeIn={10} fadeOut={6}>
        <ClinicHall camZ={camZ} coldness={0.2} />
        <Figure x={base[0]} y={base[1] + figH * 0.02} h={figH} pose="standing" rim="#F4F7FA" sway={step} />
      </Shot>
      {/* B: primer plano, la cámara avanza lentamente */}
      <Shot from={146} to={272} push={0.12} fadeIn={4} fadeOut={14}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 45% at 50% 40%, #1F2B38 0%, #040506 75%)" }} />
        <Beam x={1080} y={-200} angle={25} width={700} length={2200} opacity={0.24} />
        <Beam x={0} y={-200} angle={-25} width={500} length={2000} opacity={0.12} />
        <Figure x={540} y={2150} h={1800} rimSide="both" rim="#F4F7FA" />
        <Particles count={30} seed="s10" speed={0.3} opacity={0.3} />
      </Shot>
      {/* C: cierre gráfico */}
      {f >= ctaIn - 4 && (
        <AbsoluteFill style={{ opacity: ramp(f, ctaIn - 4, ctaIn + 8) }}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 55%, #0E141B 0%, #000 75%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <RevealLine at={ctaIn + 6} size={86} weight={800}>
              TU EXCELENCIA
            </RevealLine>
            <RevealLine at={ctaIn + 12} size={86} weight={800}>
              MERECE SER VISTA.
            </RevealLine>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: "0.5em",
                marginRight: "-0.5em",
                color: C.silver,
                opacity: ramp(f, ctaIn + 50, ctaIn + 66),
              }}
            >
              COMENTA
            </div>
            {/* 2026 con profundidad y acabado metálico */}
            <div style={{ position: "relative", marginTop: 10, transform: `scale(${0.92 + 0.08 * ramp(f, ctaIn + 60, ctaIn + 90, EASE)})`, opacity: ramp(f, ctaIn + 58, ctaIn + 72) }}>
              {new Array(10).fill(0).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    left: 0,
                    top: 0,
                    transform: `translate(${i * 1.4}px, ${i * 2.2}px)`,
                    zIndex: 10 - i,
                    fontFamily: FONT,
                    fontSize: 300,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: i === 0 ? "transparent" : `rgb(${30 - i * 2},${34 - i * 2},${40 - i * 2})`,
                    ...(i === 0
                      ? {
                          backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 20}%, rgba(255,255,255,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 20}%), ${metal}`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                        }
                      : {}),
                  }}
                >
                  2026
                </div>
              ))}
            </div>
            <div style={{ width: 160 * ramp(f, ctaIn + 90, ctaIn + 110), height: 1, background: C.lineStrong, margin: "50px 0 40px" }} />
            <RevealLine at={ctaIn + 96} size={40} weight={600} color={C.silver} tracking={0.12}>
              EVALUAREMOS TU CASO POR PRIVADO.
            </RevealLine>
          </div>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 40% 12% at 50% 52%, rgba(220,232,245,0.18), rgba(0,0,0,0) 70%)", opacity: ramp(f, ctaIn + 60, ctaIn + 100) }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
