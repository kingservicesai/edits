import React from "react";
import { AbsoluteFill } from "remotion";
import { LightBG, Grain } from "../components/base";
import { LogoReveal } from "../components/Logo";
export const LogoTest: React.FC = () => (
  <AbsoluteFill>
    <LightBG />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <LogoReveal at={5} width={620} />
    </AbsoluteFill>
    <Grain />
  </AbsoluteFill>
);
