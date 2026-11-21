import React from "react";
import { Audio, Sequence, staticFile, interpolate } from "remotion";
import { ITEMS, vo, F, FE, FPS, TOTAL_FRAMES } from "./timeline";
import { sfx1 } from "./scenes/Scene1";
import { sfx2 } from "./scenes/Scene2";
import { sfx3 } from "./scenes/Scene3";
import { sfx4 } from "./scenes/Scene4";
import { sfx5 } from "./scenes/Scene5";
import { sfx6 } from "./scenes/Scene6";

const SFX_GAIN = 0.62;
const voIntervals = ITEMS.filter((i) => i.kind === "vo" || i.kind === "dlg").map((i) => [Math.round(i.start * FPS), Math.round(i.end * FPS)] as const);

/** 0 = no voice nearby, 1 = voice active (smoothed) */
const duck = (f: number) => {
  let best = 0;
  for (const [a, b] of voIntervals) {
    let d = 0;
    if (f < a - 3) d = a - 3 - f;
    else if (f > b + 6) d = f - (b + 6);
    const v = Math.max(0, 1 - d / 12);
    if (v > best) best = v;
    if (best >= 1) break;
  }
  return best;
};

type Region = { file: string; start: number; end: number; offset: number; fadeIn: number; fadeOut: number; base: number; duckTo?: number };

// music regions (absolute seconds → frames)
const s = (x: number) => Math.round(x * FPS);
const REGIONS: Region[] = [
  { file: "tension_2", start: 0, end: F("sc2") + s(0.6), offset: 0, fadeIn: s(1.5), fadeOut: s(0.8), base: 0.5 },
  { file: "tension_3", start: F("title2") + s(0.3), end: F("s2_sol") + s(0.15), offset: s(8), fadeIn: s(1.2), fadeOut: s(0.2), base: 0.5 },
  { file: "solution_3", start: F("s2_sol"), end: F("sc3") + s(0.6), offset: s(1.5), fadeIn: s(0.1), fadeOut: s(0.8), base: 0.5 },
  { file: "tension_4", start: F("title3") + s(0.3), end: F("s3_sol") + s(0.15), offset: 0, fadeIn: s(1.2), fadeOut: s(0.2), base: 0.5 },
  { file: "solution_1", start: F("s3_sol"), end: F("sc4") + s(0.6), offset: 0, fadeIn: s(0.1), fadeOut: s(0.8), base: 0.5 },
  { file: "tension_1", start: F("title4") + s(0.3), end: F("s4_sol") + s(0.15), offset: s(14), fadeIn: s(1.2), fadeOut: s(0.2), base: 0.5 },
  { file: "solution_4", start: F("s4_sol"), end: F("sc5") + s(0.4), offset: 0, fadeIn: s(0.1), fadeOut: s(0.6), base: 0.5 },
  { file: "finale_4", start: F("sc5"), end: TOTAL_FRAMES, offset: s(13.9), fadeIn: s(0.4), fadeOut: s(1.5), base: 0.55, duckTo: 0.45 },
];

const AMBIENCE = [
  { file: "amb_store", start: F("intro"), end: F("S1") + s(9), v: 0.16 },
  { file: "amb_store", start: F("s2_montage"), end: F("s2_sol"), v: 0.13 },
  { file: "amb_warehouse", start: F("s3_intro"), end: F("s3_sol"), v: 0.14 },
  { file: "amb_office", start: F("s4_intro"), end: F("s4_sol"), v: 0.13 },
];

const PHONE_LINES = new Set(["D_SUC1", "D_SUC2", "D_GERENTE"]);

export const AudioLayer: React.FC = () => {
  const allSfx = [...sfx1, ...sfx2, ...sfx3, ...sfx4, ...sfx5, ...sfx6];
  return (
    <>
      {/* voice */}
      {ITEMS.filter((i) => i.kind === "vo" || i.kind === "dlg").map((i) => (
        <Sequence key={i.id} from={F(i.id)} durationInFrames={FE(i.id) - F(i.id) + 4} layout="none">
          <Audio src={staticFile(vo[i.id].file)} volume={i.kind === "vo" ? 1.0 : PHONE_LINES.has(i.id) ? 0.95 : 0.95} />
        </Sequence>
      ))}
      {/* music */}
      {REGIONS.map((r, k) => (
        <Sequence key={`m${k}`} from={r.start} durationInFrames={r.end - r.start} layout="none">
          <Audio
            src={staticFile(`audio/music/${r.file}.flac`)}
            trimBefore={r.offset}
            volume={(lf) => {
              const af = r.start + lf;
              const fade = Math.min(
                interpolate(lf, [0, Math.max(1, r.fadeIn)], [0, 1], { extrapolateRight: "clamp" }),
                interpolate(af, [r.end - Math.max(1, r.fadeOut), r.end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              );
              const d = duck(af);
              const g = 1 - (1 - (r.duckTo ?? 0.36)) * d;
              return r.base * fade * g;
            }}
          />
        </Sequence>
      ))}
      {/* ambience */}
      {AMBIENCE.map((a, k) => (
        <Sequence key={`a${k}`} from={a.start} durationInFrames={a.end - a.start} layout="none">
          <Audio
            src={staticFile(`audio/sfx/${a.file}.wav`)}
            loop
            volume={(lf) => a.v * Math.min(interpolate(lf, [0, 20], [0, 1], { extrapolateRight: "clamp" }), interpolate(lf, [a.end - a.start - 20, a.end - a.start], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
          />
        </Sequence>
      ))}
      {/* sfx */}
      {allSfx.map((c, k) => (
        <Sequence key={`s${k}`} from={Math.max(0, c.f)} durationInFrames={c.dur ?? 150} layout="none">
          <Audio
            src={staticFile(`audio/sfx/${c.id}.wav`)}
            volume={(lf) => (c.v ?? 0.6) * SFX_GAIN * (c.dur ? interpolate(lf, [c.dur - 6, c.dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1)}
          />
        </Sequence>
      ))}
    </>
  );
};
