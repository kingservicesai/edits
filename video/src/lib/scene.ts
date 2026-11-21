export type Cue = { f: number; id: string; v?: number; dur?: number };
export const cue = (f: number, id: string, v = 0.6, dur?: number): Cue => ({ f: Math.round(f), id, v, dur });
