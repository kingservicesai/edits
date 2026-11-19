import { Easing } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const C = {
  carbon: "#060709",
  ink: "#0B0D11",
  graphite: "#14171C",
  titanium: "#8A9099",
  silver: "#C9CED6",
  white: "#F4F6F8",
  ice: "#8FBCE6",
  iceDeep: "#2A4560",
  line: "rgba(201,206,214,0.16)",
  lineStrong: "rgba(201,206,214,0.38)",
};

export const FONT =
  "'Inter Display', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif";

// Curva principal: entrada rápida, asentamiento largo. Sin rebote.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);

export const metal =
  "linear-gradient(180deg, #FFFFFF 0%, #DCE1E7 28%, #8D949E 52%, #E9EDF1 70%, #9AA1AB 100%)";
