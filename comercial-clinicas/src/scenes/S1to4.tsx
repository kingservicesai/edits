import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE_INOUT, FONT } from "../theme";
import {
  Beam,
  Bg,
  clamp,
  Fade,
  Figure,
  Headline,
  Kicker,
  Particles,
  Phone,
  ramp,
  RevealLine,
  Shot,
} from "../components/core";
import { ClinicHall, WaitingRoom } from "../components/space";
import {
  Agenda,
  Clock,
  CompareScreen,
  Instruments,
  LostNotification,
  MonitorScan,
  StaticFeed,
  TrendScreen,
  WeakProfile,
} from "../components/ui";

/* ================================================================== */
/* ESCENA 1 — EL PROBLEMA (270 f)                                      */
/* ================================================================== */
export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const dolly = interpolate(f, [10, 135], [0, 11], { ...clamp, easing: EASE_INOUT });
  const reveal = interpolate(f, [10, 60], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* A — travelling hacia el interior de la clínica */}
      <Shot from={10} to={132} fadeIn={0} fadeOut={6} push={0}>
        <div style={{ opacity: reveal }}>
          <ClinicHall camZ={dolly} camY={Math.sin(f / 40) * 0.02} />
        </div>
        <Kicker text="Caracas" at={34} out={112} top={300} />
      </Shot>
      {/* B — sala de espera vacía, travelling lateral */}
      <Shot from={128} to={178} push={0.03} fadeIn={4} fadeOut={4}>
        <WaitingRoom camX={interpolate(f, [128, 178], [-1.1, -0.2])} camZ={0} />
        <Beam x={540} y={-100} angle={0} width={900} length={1400} opacity={0.12} />
      </Shot>
      {/* C — el reloj avanza */}
      <Shot from={176} to={208} push={0.06} fadeIn={3} fadeOut={3}>
        <Bg tone="cold" />
        <Clock size={760} x={540} y={900} speed={2.4} />
      </Shot>
      {/* D — agenda con espacios libres y solicitudes que no llegan */}
      <Shot from={206} to={270} push={0.04} fadeIn={3} fadeOut={0}>
        <Bg />
        <div style={{ opacity: 1 - ramp(f, 222, 240) * 0.75, filter: `blur(${ramp(f, 222, 240) * 8}px)` }}>
          <Agenda at={200} />
        </div>
        <LostNotification at={208} y={250} title="Nueva solicitud de cita" sub="Paciente potencial" />
        <LostNotification at={216} y={420} title="Consulta pendiente" sub="Sin respuesta" />
        <Headline lines={["MILES DE DÓLARES", "EN OPORTUNIDADES", "PERDIDAS"]} at={228} size={86} stagger={6} top="58%" />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ESCENA 2 — EXCELENCIA SIN VISIBILIDAD (255 f)                       */
/* ================================================================== */
export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* 1 — médico estudiando imágenes diagnósticas (sobre el hombro) */}
      <Shot from={0} to={44} push={0.07} fadeIn={0} fadeOut={3}>
        <MonitorScan t={f} />
        <Figure x={170} y={1980} h={1100} coat rimSide="right" rim="#9CC6EE" />
      </Shot>
      {/* 2 — macro de instrumental */}
      <Shot from={42} to={78} push={0.08} driftX={-30} fadeIn={3} fadeOut={3}>
        <Instruments t={f} />
      </Shot>
      {/* 3 — pasillo con profesionales caminando */}
      <Shot from={76} to={112} push={0} fadeIn={3} fadeOut={3}>
        <ClinicHall camZ={4 + (f - 76) * 0.05} camX={0.4} />
        <Figure x={350 + (f - 76) * 1.5} y={1250} h={560} pose="standing" opacity={0.95} rim="#E8EEF4" />
        <Figure x={720 - (f - 76) * 0.8} y={1180} h={430} pose="standing" opacity={0.9} rim="#E8EEF4" />
      </Shot>
      {/* 4 — retrato del especialista mirando al horizonte */}
      <Shot from={110} to={152} push={0.05} fadeIn={3} fadeOut={0}>
        <Bg tone="cold" />
        <Beam x={980} y={-200} angle={22} width={700} length={2200} opacity={0.22} />
        <Figure x={540} y={1980} h={1500} rimSide="right" rim="#DCE8F5" headTilt={-3} />
      </Shot>
      <Headline lines={["EXCELENCIA", "MÉDICA"]} at={50} out={140} size={118} stagger={5} top="20%" metallic />
      {/* Corte abrupto: la realidad digital */}
      <Shot from={152} to={255} push={0.04} fadeIn={0} fadeOut={0}>
        <Bg />
        <Phone width={600} x={540} y={1040} rotate={-4} glow={0.2}>
          <WeakProfile scroll={interpolate(f, [152, 255], [0, 320], clamp)} />
        </Phone>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", opacity: ramp(f, 176, 192) }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <RevealLine at={180} size={420} weight={800} tracking={-0.06} duration={14}>
            0
          </RevealLine>
          <RevealLine at={188} size={92} weight={800} tracking={-0.02}>
            AUTORIDAD DIGITAL
          </RevealLine>
        </div>
      </Shot>
      {/* destello del corte */}
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [151, 152, 158], [0, 0.5, 0], clamp) }} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ESCENA 3 — EL ERROR DEL MARKETING TRADICIONAL (300 f)               */
/* ================================================================== */
export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  // cortes rápidos: cambia la variante del trend cada 9 fotogramas
  const variant = Math.floor(f / 9);
  const jolt = f < 120 && f % 9 === 0 ? 1 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shot from={0} to={120} push={0.06} fadeIn={0} fadeOut={0}>
        <Bg />
        <Phone width={640} x={540 + jolt * 14} y={980} rotate={jolt * 2 - 1} glow={0.5}>
          <TrendScreen t={f} variant={variant} />
        </Phone>
      </Shot>
      <Shot from={120} to={205} push={0.02} fadeIn={0} fadeOut={0}>
        <Bg />
        <Phone width={640} x={540} y={980} glow={0.2}>
          <StaticFeed scroll={interpolate(f, [120, 205], [0, 2300], { ...clamp, easing: (t) => t * t * (3 - 2 * t) })} />
        </Phone>
        {/* desenfoque de movimiento */}
        <AbsoluteFill style={{ backdropFilter: "blur(1px)" }} />
      </Shot>
      {/* oscurecemos y declaramos */}
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [150, 170], [0, 0.72], clamp) * (f < 205 ? 1 : 0) }} />
      <Headline lines={["NO NECESITAS", "HACER CIRCO."]} at={154} out={208} size={116} top="50%" />
      <Shot from={205} to={300} push={0.03} fadeIn={0} fadeOut={10}>
        <Bg tone="cold" />
        <Particles count={40} seed="s3" speed={0.4} opacity={0.35} />
        <Kicker text="El método" at={212} top={640} />
        <Headline lines={["NECESITAS", "CONSTRUIR", "AUTORIDAD."]} at={214} size={128} stagger={6} top="52%" metallic />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ESCENA 4 — LA CONSECUENCIA (210 f)                                  */
/* ================================================================== */
export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const split = ramp(f, 92, 130, EASE_INOUT);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* A — paciente en casa, compara opciones */}
      <Shot from={0} to={96} push={0.05} fadeIn={10} fadeOut={0}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 40% at 30% 60%, #13202D 0%, #040506 70%)" }} />
        <Figure x={330} y={1650} h={1100} pose="seated" coat={false} rimSide="right" rim="#8FBCE6" phoneGlow={1} headTilt={4} />
        <Phone width={420} x={790} y={820} rotate={6} glow={0.6}>
          <CompareScreen t={f} />
        </Phone>
      </Shot>
      {/* B — composición dividida: médico preparado vs paciente lejano */}
      <Shot from={92} to={200} push={0.03} fadeIn={0} fadeOut={0}>
        <AbsoluteFill style={{ background: "#030405" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960, overflow: "hidden", transform: `translateY(${-(1 - split) * 120}px)`, opacity: split }}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, #1A2632 0%, #050608 80%)" }} />
          <Figure x={540} y={1040} h={760} rimSide="both" rim="#DCE8F5" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, height: 960, overflow: "hidden", transform: `translateY(${(1 - split) * 120}px)`, opacity: split }}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, #13202D 0%, #040506 75%)" }} />
          <Figure x={540} y={1300} h={760} pose="seated" coat={false} rimSide="left" rim="#8FBCE6" phoneGlow={0.8} />
        </div>
        {/* la distancia: una línea que se abre */}
        <div style={{ position: "absolute", left: 540 - 440 * split, width: 880 * split, top: 959, height: 2, background: C.lineStrong }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 940,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 24,
            letterSpacing: "0.5em",
            color: C.titanium,
            opacity: ramp(f, 112, 130) * (1 - ramp(f, 134, 144)),
          }}
        >
          DISTANCIA
        </div>
        <AbsoluteFill style={{ background: "#000", opacity: ramp(f, 132, 146) * 0.72 }} />
        <Headline lines={["TU REPUTACIÓN", "NO ES UN TREND."]} at={138} size={112} top="50%" />
      </Shot>
      {/* corte limpio a negro */}
      <Fade from={199} to={201} />
    </AbsoluteFill>
  );
};
