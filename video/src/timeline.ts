import voRaw from "./data/vo.json";

export type VO = { file: string; dur: number; words: [string, number, number][]; text: string };
export const vo = voRaw as unknown as Record<string, VO>;
export const FPS = 30;

export type Item = { id: string; kind: "vo" | "dlg" | "hold" | "mark"; start: number; end: number };
const items: Item[] = [];
let t = 0;
const hold = (id: string, d: number) => {
  items.push({ id, kind: "hold", start: t, end: t + d });
  t += d;
};
const say = (id: string, pre = 0.15) => {
  t += pre;
  const d = vo[id].dur;
  items.push({ id, kind: id.startsWith("D_") ? "dlg" : "vo", start: t, end: t + d });
  t += d;
};
const mark = (id: string) => items.push({ id, kind: "mark", start: t, end: t });

// ───────────── SCENE 1 · EL PROBLEMA ─────────────
mark("sc1");
hold("intro", 2.2);
say("S1", 0);
hold("s1_out", 1.2);
// ───────────── SCENE 2 · LA VENDEDORA ─────────────
mark("sc2");
hold("title2", 2.6);
hold("s2_montage", 5.0);
say("D_CLIENTA", 0.15);
say("D_ANDREA1", 0.35);
hold("s2_switch", 1.4);
say("S2N1", 0.1);
mark("s2_sol");
hold("s2_flip", 1.4);
say("S2N2", 0.1);
hold("s2_after_sale", 1.0);
hold("s2_validator", 4.6);
say("D_ANDREA2", 0.2);
say("S2N3", 0.4);
hold("s2_invoice", 2.2);
say("S2N4", 0.1);
hold("s2_stamp", 3.0);
// ───────────── SCENE 3 · EL GERENTE ─────────────
mark("sc3");
hold("title3", 2.6);
hold("s3_intro", 2.4);
say("D_EMP", 0.1);
hold("s3_docs", 1.0);
hold("s3_ring", 1.6);
say("D_SUC1", 0.1);
say("D_CARLOS", 0.3);
hold("s3_chaos", 1.2);
say("S3N1", 0.1);
mark("s3_sol");
hold("s3_flip", 1.4);
say("S3N2", 0.1);
hold("s3_after_rec", 1.0);
hold("s3_ring2", 1.4);
say("D_SUC2", 0.1);
hold("s3_transfer_open", 0.8);
say("S3N3", 0.1);
hold("s3_after_tr", 0.8);
say("S3N4", 0.2);
hold("s3_stamp", 3.0);
// ───────────── SCENE 4 · EL DUEÑO ─────────────
mark("sc4");
hold("title4", 2.6);
hold("s4_intro", 3.0);
say("D_JOSE1", 0.1);
say("D_GERENTE", 0.4);
hold("s4_msg", 1.8);
say("S4N1", 0.1);
mark("s4_sol");
hold("s4_flip", 1.4);
say("S4N2", 0.1);
hold("s4_mic", 1.4);
say("D_JOSE2", 0.1);
hold("s4_think", 0.7);
say("D_ASIST", 0.1);
hold("s4_q2", 0.5);
say("D_JOSE3", 0.1);
hold("s4_answer2", 2.0);
say("S4N7", 0.2);
hold("s4_close", 1.0);
say("S4N8", 0.1);
hold("s4_stamp", 3.0);
// ───────────── SCENE 5 · CONECTADOS ─────────────
mark("sc5");
hold("s5_in", 1.2);
say("S5", 0.1);
hold("s5_out", 0.8);
// ───────────── SCENE 6 · CIERRE ─────────────
mark("sc6");
say("S6N1", 0.3);
hold("s6_build", 0.8);
say("S6N2", 0.1);
hold("endcard", 6.5);
mark("end");

export const TOTAL_SEC = t;
export const TOTAL_FRAMES = Math.ceil(t * FPS);
export const ITEMS = items;
const byId: Record<string, Item> = Object.fromEntries(items.map((i) => [i.id, i]));
export const T = (id: string): Item => {
  const it = byId[id];
  if (!it) throw new Error("timeline id not found: " + id);
  return it;
};
/** absolute frame of an item start */
export const F = (id: string) => Math.round(T(id).start * FPS);
export const FE = (id: string) => Math.round(T(id).end * FPS);
export const sec = (s: number) => Math.round(s * FPS);

/** absolute frame of the n-th word (0-based) in a VO clip, or the first word matching `match` (after index `from`) */
export const W = (id: string, match: number | string, from = 0, which: "start" | "end" = "start") => {
  const it = T(id);
  const words = vo[id].words;
  let idx = -1;
  if (typeof match === "number") idx = match;
  else {
    const m = match.toLowerCase().replace(/[¿?¡!.,;:…"]/g, "");
    for (let i = from; i < words.length; i++) {
      const w = words[i][0].toLowerCase().replace(/[¿?¡!.,;:…"]/g, "");
      if (w === m || w.startsWith(m)) {
        idx = i;
        break;
      }
    }
  }
  if (idx < 0 || idx >= words.length) throw new Error(`word ${match} not found in ${id}`);
  return Math.round((it.start + words[idx][which === "start" ? 1 : 2]) * FPS);
};
/** index of a word */
export const WI = (id: string, match: string, from = 0) => {
  const words = vo[id].words;
  const m = match.toLowerCase().replace(/[¿?¡!.,;:…"]/g, "");
  for (let i = from; i < words.length; i++) {
    const w = words[i][0].toLowerCase().replace(/[¿?¡!.,;:…"]/g, "");
    if (w === m || w.startsWith(m)) return i;
  }
  throw new Error(`word ${match} not found in ${id}`);
};

/** scene ranges (frames) */
export const SCENES = {
  sc1: [F("sc1"), F("sc2")],
  sc2: [F("sc2"), F("sc3")],
  sc3: [F("sc3"), F("sc4")],
  sc4: [F("sc4"), F("sc5")],
  sc5: [F("sc5"), F("sc6")],
  sc6: [F("sc6"), F("end")],
} as const;
