import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Grain } from "./components/base";
import { AudioLayer } from "./AudioLayer";

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <Scene5 />
    <Scene6 />
    <Grain opacity={0.05} />
    <AudioLayer />
  </AbsoluteFill>
);
