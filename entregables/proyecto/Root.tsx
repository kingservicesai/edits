import React from 'react';
import {Composition} from 'remotion';
import {Ad, FPS} from './Ad';
import edl from './edl.json';

export const Root: React.FC = () => (
  <Composition
    id="Ad"
    component={Ad}
    durationInFrames={Math.round(edl.end * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
