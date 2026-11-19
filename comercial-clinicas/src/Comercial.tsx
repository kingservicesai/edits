import React from "react";
import { AbsoluteFill, Audio, getInputProps, Sequence, staticFile } from "remotion";
import { Grain, Vignette } from "./components/core";
import { SCENES } from "./timing";
import { Scene1, Scene2, Scene3, Scene4 } from "./scenes/S1to4";
import { Scene5, Scene6, Scene7 } from "./scenes/S5to7";
import { Scene8 } from "./scenes/S8";
import { Scene9, Scene10 } from "./scenes/S9to10";

const MAP: Record<string, React.FC> = {
  s1: Scene1,
  s2: Scene2,
  s3: Scene3,
  s4: Scene4,
  s5: Scene5,
  s6: Scene6,
  s7: Scene7,
  s8: Scene8,
  s9: Scene9,
  s10: Scene10,
};

export const Comercial: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SCENES.map((s) => {
        const from = t;
        t += s.frames;
        const Comp = MAP[s.id];
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.frames} name={s.id}>
            <Comp />
          </Sequence>
        );
      })}
      <Vignette strength={0.7} />
      <Grain opacity={0.06} />
      {(getInputProps() as { noAudio?: boolean }).noAudio ? null : <Audio src={staticFile("banda-sonora.wav")} />}
    </AbsoluteFill>
  );
};
