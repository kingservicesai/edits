// Renderiza fotogramas de control: node scripts/stills.mjs <dir> f1 f2 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [dir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const inputProps = { noAudio: true };
const composition = await selectComposition({ serveUrl, id: "Comercial", inputProps, browserExecutable });
for (const fr of frames) {
  await renderStill({ composition, serveUrl, frame: Number(fr), output: path.join(dir, `f${fr}.jpg`), imageFormat: "jpeg", scale: 0.5, inputProps, browserExecutable });
  process.stdout.write(fr + " ");
}
console.log("ok");
