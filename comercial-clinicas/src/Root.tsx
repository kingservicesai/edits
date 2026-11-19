import React from "react";
import { Composition } from "remotion";
import { Comercial } from "./Comercial";
import { FPS, H, W } from "./theme";
import { TOTAL } from "./timing";

export const Root: React.FC = () => (
  <Composition id="Comercial" component={Comercial} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
