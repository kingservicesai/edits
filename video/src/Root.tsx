import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { fontsReady } from "./fonts";
import { TOTAL_FRAMES } from "./timeline";
import { Main } from "./Main";
import { LogoTest } from "./tests/LogoTest";
import { UITest } from "./tests/UITest";

const h = delayRender("fonts");
fontsReady.then(() => continueRender(h)).catch(() => continueRender(h));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MayorDeSillas" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="LogoTest" component={LogoTest} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="UITest" component={UITest} durationInFrames={1200} fps={30} width={1920} height={1080} />
  </>
);
