// Duración de cada escena en fotogramas (30 fps).
// Calculadas sobre la locución exacta del guion a ~2,9 palabras/segundo.
// Cuando exista la locución grabada, se ajustan aquí y todo se re-sincroniza.
export const SCENES = [
  { id: "s1", frames: 270 }, // 0:00 – 0:09   El problema
  { id: "s2", frames: 255 }, // 0:09 – 0:17.5 Excelencia sin visibilidad
  { id: "s3", frames: 300 }, // – 0:27.5      Error del marketing tradicional
  { id: "s4", frames: 210 }, // – 0:34.5      La consecuencia
  { id: "s5", frames: 300 }, // – 0:44.5      Cambio de paradigma
  { id: "s6", frames: 435 }, // – 0:59        El médico como protagonista
  { id: "s7", frames: 225 }, // – 1:06.5      Destruir objeciones
  { id: "s8", frames: 900 }, // – 1:36.5      Casos comerciales
  { id: "s9", frames: 315 }, // – 1:47        Autoridad y escala
  { id: "s10", frames: 450 }, // – 2:02       Llamado a la acción
] as const;

export const TOTAL = SCENES.reduce((a, s) => a + s.frames, 0);

export const sceneStart = (id: string) => {
  let t = 0;
  for (const s of SCENES) {
    if (s.id === id) return t;
    t += s.frames;
  }
  throw new Error(id);
};
