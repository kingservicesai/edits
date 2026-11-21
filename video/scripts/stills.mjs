import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [,, outDir, framesArg, scaleArg] = process.argv;
const frames = framesArg.split(",").map(Number);
const scale = Number(scaleArg || 0.5);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => c });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const composition = await selectComposition({ serveUrl, id: "MayorDeSillas", browserExecutable });
for (const fr of frames) {
  await renderStill({ composition, serveUrl, output: path.join(outDir, `f${String(fr).padStart(5, "0")}.jpg`), frame: fr, scale, imageFormat: "jpeg", jpegQuality: 85, browserExecutable, chromiumOptions: { gl: "swangle" } });
  process.stdout.write(fr + " ");
}
console.log("done");
