import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Mini motor de perspectiva para construir arquitectura (pasillos, recepción,
 * sala de espera) con un movimiento de cámara real (dolly / travelling).
 */
export type Cam = { x: number; y: number; z: number; f: number; cx: number; cy: number };
type V3 = [number, number, number];

const NEAR = 0.35;

export const proj = (c: Cam, [X, Y, Z]: V3) => {
  const zc = Math.max(Z - c.z, NEAR);
  return [c.cx + (c.f * (X - c.x)) / zc, c.cy + (c.f * (Y - c.y)) / zc, zc] as const;
};

/** Recorta un polígono contra el plano cercano y lo proyecta. */
const polyPts = (c: Cam, pts: V3[]) => {
  const out: V3[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const za = a[2] - c.z;
    const zb = b[2] - c.z;
    if (za >= NEAR) out.push(a);
    if ((za >= NEAR) !== (zb >= NEAR)) {
      const t = (NEAR - za) / (zb - za);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, c.z + NEAR]);
    }
  }
  if (out.length < 3) return null;
  return out.map((p) => proj(c, p).slice(0, 2).join(",")).join(" ");
};

export const Quad: React.FC<{
  c: Cam;
  pts: V3[];
  fill: string;
  opacity?: number;
  stroke?: string;
  sw?: number;
  filter?: string;
}> = ({ c, pts, fill, opacity = 1, stroke, sw = 1, filter }) => {
  const p = polyPts(c, pts);
  if (!p) return null;
  return <polygon points={p} fill={fill} opacity={opacity} stroke={stroke} strokeWidth={sw} filter={filter} />;
};

export const Line3: React.FC<{ c: Cam; a: V3; b: V3; stroke: string; sw?: number; opacity?: number }> = ({
  c,
  a,
  b,
  stroke,
  sw = 2,
  opacity = 1,
}) => {
  if (a[2] - c.z < NEAR && b[2] - c.z < NEAR) return null;
  const clip = (p: V3, q: V3): V3 => {
    const zp = p[2] - c.z;
    if (zp >= NEAR) return p;
    const zq = q[2] - c.z;
    const t = (NEAR - zp) / (zq - zp);
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, c.z + NEAR];
  };
  const A = proj(c, clip(a, b));
  const B = proj(c, clip(b, a));
  return <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={stroke} strokeWidth={sw} opacity={opacity} />;
};

/** Caja sólida sombreada (sillas, mostradores, mobiliario). */
export const Box: React.FC<{
  c: Cam;
  x: number;
  y: number; // y superior
  z: number;
  w: number;
  h: number;
  d: number;
  top: string;
  front: string;
  side: string;
  edge?: string;
}> = ({ c, x, y, z, w, h, d, top, front, side, edge }) => {
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const y0 = y;
  const y1 = y + h;
  const z0 = z;
  const z1 = z + d;
  const faces: React.ReactNode[] = [];
  // lado visible según posición de cámara
  if (c.x < x0) faces.push(<Quad key="l" c={c} pts={[[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]} fill={side} />);
  if (c.x > x1) faces.push(<Quad key="r" c={c} pts={[[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]]} fill={side} />);
  if (c.y < y0) faces.push(<Quad key="t" c={c} pts={[[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]} fill={top} />);
  faces.push(
    <Quad key="f" c={c} pts={[[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]} fill={front} stroke={edge} sw={1.5} />,
  );
  return <g>{faces}</g>;
};

/* ------------------------------------------------------------------ */
/* Pasillo / recepción de clínica premium                              */
/* ------------------------------------------------------------------ */

export const ClinicHall: React.FC<{
  camZ: number;
  camX?: number;
  camY?: number;
  depth?: number;
  endGlow?: number;
  figures?: React.ReactNode;
  coldness?: number; // 0 cálido-neutro, 1 frío
}> = ({ camZ, camX = 0, camY = 0, depth = 42, endGlow = 1, coldness = 0.4 }) => {
  const f = useCurrentFrame();
  const c: Cam = { x: camX, y: camY, z: camZ, f: 820, cx: 540, cy: 900 };
  const HW = 2.3; // medio ancho
  const FL = 1.55; // suelo
  const CE = -1.75; // techo
  const strips: React.ReactNode[] = [];
  const refl: React.ReactNode[] = [];
  const mull: React.ReactNode[] = [];
  const panels: React.ReactNode[] = [];
  const joints: React.ReactNode[] = [];
  const light = `rgba(${235 - coldness * 20},${240 - coldness * 5},${248},1)`;

  for (let z = 1; z < depth - 4; z += 3.2) {
    strips.push(<Quad key={`s${z}`} c={c} pts={[[-0.22, CE, z], [0.22, CE, z], [0.22, CE, z + 2.2], [-0.22, CE, z + 2.2]]} fill={light} />);
    refl.push(<Quad key={`r${z}`} c={c} pts={[[-0.3, FL, z], [0.3, FL, z], [0.3, FL, z + 2.2], [-0.3, FL, z + 2.2]]} fill={light} opacity={0.22} />);
  }
  for (let z = 0; z < depth - 4; z += 2.6) {
    const a = 0.1 + 0.08 * Math.sin(z * 1.3);
    panels.push(
      <Quad key={`pl${z}`} c={c} pts={[[-HW, CE, z], [-HW, CE, z + 2.5], [-HW, FL, z + 2.5], [-HW, FL, z]]} fill={`rgba(150,185,215,${a})`} />,
      <Quad key={`pr${z}`} c={c} pts={[[HW, CE, z], [HW, CE, z + 2.5], [HW, FL, z + 2.5], [HW, FL, z]]} fill={`rgba(160,170,182,${a * 0.9})`} />,
    );
    mull.push(
      <Line3 key={`ml${z}`} c={c} a={[-HW, CE, z]} b={[-HW, FL, z]} stroke="#9AA3AE" sw={3} opacity={0.55} />,
      <Line3 key={`mr${z}`} c={c} a={[HW, CE, z]} b={[HW, FL, z]} stroke="#9AA3AE" sw={3} opacity={0.55} />,
    );
  }
  for (let z = 0; z < depth - 4; z += 1.6) {
    joints.push(<Line3 key={`j${z}`} c={c} a={[-HW, FL, z]} b={[HW, FL, z]} stroke="#ffffff" sw={1} opacity={0.06} />);
  }
  const ez = depth - 4;
  const shimmer = 0.85 + 0.15 * Math.sin(f / 20);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A2E35" />
            <stop offset="1" stopColor="#0C0E11" />
          </linearGradient>
          <linearGradient id="ceil" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#1E2228" />
            <stop offset="1" stopColor="#08090B" />
          </linearGradient>
          <linearGradient id="wallL" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#1F242B" />
            <stop offset="1" stopColor="#0A0C0F" />
          </linearGradient>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6B5A48" />
            <stop offset="1" stopColor="#2A231C" />
          </linearGradient>
          <linearGradient id="marble" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F2F2F0" />
            <stop offset="0.5" stopColor="#D8D9D8" />
            <stop offset="1" stopColor="#B9BBBD" />
          </linearGradient>
          <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="soft">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {/* volúmenes */}
        <Quad c={c} pts={[[-HW, FL, 0], [HW, FL, 0], [HW, FL, depth], [-HW, FL, depth]]} fill="url(#floor)" />
        <Quad c={c} pts={[[-HW, CE, 0], [HW, CE, 0], [HW, CE, depth], [-HW, CE, depth]]} fill="url(#ceil)" />
        <Quad c={c} pts={[[-HW, CE, 0], [-HW, CE, depth], [-HW, FL, depth], [-HW, FL, 0]]} fill="url(#wallL)" />
        <Quad c={c} pts={[[HW, CE, 0], [HW, CE, depth], [HW, FL, depth], [HW, FL, 0]]} fill="url(#wallL)" />
        {panels}
        {joints}
        {/* pared de fondo: listones de madera retroiluminados */}
        <Quad c={c} pts={[[-HW, CE, ez], [HW, CE, ez], [HW, FL, ez], [-HW, FL, ez]]} fill="url(#wood)" />
        {new Array(23).fill(0).map((_, i) => {
          const x = -HW + 0.1 + i * 0.2;
          return <Line3 key={`sl${i}`} c={c} a={[x, CE, ez - 0.01]} b={[x, FL, ez - 0.01]} stroke="#000" sw={2} opacity={0.45} />;
        })}
        <Quad c={c} pts={[[-HW, CE + 0.05, ez - 0.02], [HW, CE + 0.05, ez - 0.02], [HW, CE + 0.25, ez - 0.02], [-HW, CE + 0.25, ez - 0.02]]} fill={light} opacity={0.9 * endGlow} filter="url(#soft)" />
        {/* mostrador de mármol */}
        <Box c={c} x={0} y={FL - 1.05} z={ez - 2.6} w={2.6} h={1.05} d={0.8} top="#E9EAEA" front="url(#marble)" side="#A9ABAE" edge="rgba(255,255,255,0.5)" />
        <Quad c={c} pts={[[-1.3, FL - 0.04, ez - 2.62], [1.3, FL - 0.04, ez - 2.62], [1.3, FL, ez - 2.62], [-1.3, FL, ez - 2.62]]} fill={light} opacity={0.95 * endGlow} filter="url(#soft)" />
        {/* reflejos de luz en el suelo pulido */}
        <g filter="url(#bloom)">{refl}</g>
        {/* tiras de luz en techo + bloom */}
        <g filter="url(#bloom)" opacity={0.9 * shimmer}>
          {strips}
        </g>
        {strips}
        {mull}
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Sala de espera vacía                                                */
/* ------------------------------------------------------------------ */

export const WaitingRoom: React.FC<{ camX: number; camZ: number }> = ({ camX, camZ }) => {
  const c: Cam = { x: camX, y: -0.15, z: camZ, f: 900, cx: 540, cy: 980 };
  const FL = 1.2;
  const chairs: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const x = -2.6 + i * 1.04;
    const z = 4.6;
    chairs.push(
      <g key={i}>
        <Box c={c} x={x} y={FL - 0.5} z={z} w={0.86} h={0.12} d={0.7} top="#B8BEC6" front="#5A616B" side="#3A3F46" />
        <Box c={c} x={x} y={FL - 1.25} z={z + 0.62} w={0.86} h={0.75} d={0.1} top="#C6CBD2" front="#7C838D" side="#3A3F46" />
        <Box c={c} x={x - 0.38} y={FL - 0.38} z={z + 0.05} w={0.05} h={0.38} d={0.05} top="#999" front="#22252A" side="#111" />
        <Box c={c} x={x + 0.38} y={FL - 0.38} z={z + 0.05} w={0.05} h={0.38} d={0.05} top="#999" front="#22252A" side="#111" />
      </g>,
    );
  }
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <linearGradient id="wr-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#101317" />
            <stop offset="1" stopColor="#1C2026" />
          </linearGradient>
          <linearGradient id="wr-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#23272D" />
            <stop offset="1" stopColor="#0A0B0D" />
          </linearGradient>
          <radialGradient id="wr-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#DDE7F2" stopOpacity="0.28" />
            <stop offset="1" stopColor="#DDE7F2" stopOpacity="0" />
          </radialGradient>
          <filter id="wr-blur">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <Quad c={c} pts={[[-8, -4, 5.6], [8, -4, 5.6], [8, FL, 5.6], [-8, FL, 5.6]]} fill="url(#wr-wall)" />
        <Quad c={c} pts={[[-8, FL, 0], [8, FL, 0], [8, FL, 5.6], [-8, FL, 5.6]]} fill="url(#wr-floor)" />
        {/* luz cenital lavando la pared */}
        {[-2.1, 0, 2.1].map((x) => (
          <Quad key={x} c={c} pts={[[x - 0.7, -3.5, 5.59], [x + 0.7, -3.5, 5.59], [x + 1.1, FL, 5.59], [x - 1.1, FL, 5.59]]} fill="url(#wr-pool)" />
        ))}
        {chairs}
        {/* reflejo del suelo */}
        <Quad c={c} pts={[[-3.2, FL, 3.9], [2.6, FL, 3.9], [2.6, FL, 4.6], [-3.2, FL, 4.6]]} fill="#000" opacity={0.45} filter="url(#wr-blur)" />
      </svg>
    </AbsoluteFill>
  );
};
