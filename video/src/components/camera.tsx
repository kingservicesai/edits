import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../lib/anim";

export type CamKey = { f: number; s: number; x: number; y: number; r?: number; rx?: number; ry?: number };

/** Evaluate camera keys at frame (ease-in-out between keys) */
export const camAt = (keys: CamKey[], f: number) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f >= a.f && f <= b.f) {
      const t = interpolate(f, [a.f, b.f], [0, 1], { easing: EASE.inOut });
      // log-space interpolation for scale feels more natural
      const s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t);
      return {
        f, s,
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        r: (a.r ?? 0) + ((b.r ?? 0) - (a.r ?? 0)) * t,
        rx: (a.rx ?? 0) + ((b.rx ?? 0) - (a.rx ?? 0)) * t,
        ry: (a.ry ?? 0) + ((b.ry ?? 0) - (a.ry ?? 0)) * t,
      };
    }
  }
  return keys[keys.length - 1];
};

/**
 * Camera: renders `children` (a canvas of size w×h) so that the point (x,y) of the canvas
 * sits in the center of the 1920×1080 frame at scale s. Optional 3D tilt.
 */
export const Camera: React.FC<{ keys: CamKey[]; w: number; h: number; children: React.ReactNode; vw?: number; vh?: number; perspective?: number }> = ({
  keys, w, h, children, vw = 1920, vh = 1080, perspective = 2400,
}) => {
  const f = useCurrentFrame();
  const k = camAt(keys, f);
  const tx = vw / 2 - k.x * k.s;
  const ty = vh / 2 - k.y * k.s;
  return (
    <div style={{ position: "absolute", inset: 0, perspective, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${k.s}) rotateX(${k.rx ?? 0}deg) rotateY(${k.ry ?? 0}deg) rotateZ(${k.r ?? 0}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
};
