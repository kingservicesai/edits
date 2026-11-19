"""Builds the edit decision list (EDL) for the vertical ad.

All times are seconds on the final timeline (voice_paced.wav starts at 0).
Output: remotion/src/edl.json
"""
import json

END_VOICE = 109.60
END = 114.60

# [start, end, source, motion, grade, extra]
# motion: in | out | up | down | left | right | static
# grade:  none | bw | teal | warm | green | red | cool | desat
SHOTS = [
    # ---- BLOQUE 1: el cambio que se avecina
    [0.00, 1.80, "v1_retro.mp4", "static", "warm", {}],
    [1.80, 2.45, "i02_lens.png", "in", "teal", {}],
    [2.45, 3.20, "i03_circuit.png", "out", "cool", {}],
    [3.20, 3.85, "i04_film.png", "left", "bw", {}],
    [3.85, 4.75, "BLACK", "static", "none", {}],
    [4.75, 6.20, "WHITE", "static", "none", {}],
    [6.20, 8.05, "v2_medium.mp4", "static", "warm", {}],
    [8.05, 10.25, "i05_workflow_boss.png", "in", "cool", {}],
    # ---- BLOQUE 2: el problema de los negocios
    [10.25, 11.10, "i07_cafe.png", "in", "warm", {}],
    [11.10, 11.85, "i08_boutique.png", "right", "none", {}],
    [11.85, 12.75, "i10_chef.png", "out", "warm", {}],
    [12.75, 14.75, "i09_phones.png", "up", "none", {"zoom": 1.9, "origin": "50% 92%"}],
    [14.75, 15.30, "i11_perfume.png", "in", "red", {}],
    [15.30, 16.90, "i12_skincare.png", "left", "teal", {}],
    [16.90, 18.30, "i13_phone_tap.png", "in", "green", {}],
    [18.30, 20.95, "i14_workshop.png", "out", "teal", {}],
    [20.95, 21.25, "BLACK", "static", "none", {}],
    [21.25, 24.40, "p_close.png", "in", "none", {"slow": True}],
    [24.40, 24.95, "i16_hands_film.png", "in", "warm", {}],
    [24.95, 25.50, "i17_timeline.png", "right", "none", {}],
    [25.50, 26.70, "i18_desk_mess.png", "out", "cool", {}],
    [26.70, 28.10, "i19_grading.png", "in", "teal", {}],
    [28.10, 29.50, "i20_subs.png", "in", "cool", {}],
    [29.50, 31.55, "i21_versions.png", "left", "none", {}],
    [31.55, 32.55, "i22_clock.png", "in", "green", {}],
    [32.55, 33.40, "v4_tired.mp4", "static", "cool", {}],
    [33.40, 34.95, "WHITE", "static", "none", {}],
    [34.95, 37.20, "i24_bakery.png", "in", "warm", {}],
    [37.20, 40.00, "i25_meeting.png", "right", "warm", {}],
    [40.00, 41.60, "v6_hourglass.mp4", "static", "red", {}],
    [41.60, 43.35, "i26_hourglass.png", "in", "red", {"zoom": 1.25, "origin": "50% 75%"}],
    # ---- BLOQUE 3: aparece la solución
    [43.35, 46.30, "p_lean.png", "in", "teal", {"slow": True}],
    [46.30, 47.80, "i28_neural.png", "in", "cool", {}],
    [47.80, 49.50, "i29_particles.png", "out", "teal", {}],
    [49.50, 51.35, "i30_cinecam.png", "right", "teal", {}],
    [51.35, 53.25, "i31_scene.png", "up", "warm", {}],
    [53.25, 54.55, "i32_splash.png", "in", "cool", {}],
    [54.55, 55.85, "v5_sneaker.mp4", "static", "none", {}],
    [55.85, 56.80, "i34_sketch.png", "in", "warm", {}],
    [56.80, 57.85, "i11_perfume.png", "out", "red", {}],
    [57.85, 60.50, "i35_nodes.png", "up", "cool", {}],
    [60.50, 62.70, "i36_bigcrew.png", "left", "bw", {}],
    [62.70, 65.75, "i37_endless.png", "in", "cool", {"slow": True}],
    # ---- BLOQUE 4: el cambio de mentalidad
    [65.75, 69.35, "p_wide.png", "in", "warm", {"slow": True}],
    [69.35, 72.80, "i39_moodboard.png", "right", "warm", {}],
    [72.80, 76.05, "i40_review.png", "in", "none", {}],
    [76.05, 77.15, "i41_phones_row.png", "left", "none", {}],
    [77.15, 78.35, "i42_watch.png", "in", "bw", {}],
    [78.35, 81.45, "i43_clean_desk.png", "out", "warm", {}],
    [81.45, 85.15, "BLACK", "static", "none", {}],
    [85.15, 87.55, "v3_firm.mp4", "static", "warm", {}],
    # ---- BLOQUE 5: curso y llamado a la acción
    [87.55, 90.90, "v2_medium.mp4", "static", "warm", {}],
    [90.90, 92.60, "i28_neural.png", "out", "teal", {"zoom": 1.35, "origin": "50% 45%"}],
    [92.60, 93.10, "i50_coffee_ad.png", "in", "warm", {}],
    [93.10, 93.60, "i32_splash.png", "out", "cool", {}],
    [93.60, 95.60, "i05_workflow_boss.png", "left", "cool", {"zoom": 1.3, "origin": "70% 30%"}],
    [95.60, 96.50, "i51_fashion_ad.png", "up", "none", {}],
    [96.50, 97.40, "i50_coffee_ad.png", "out", "warm", {}],
    [97.40, 98.30, "i42_watch.png", "in", "none", {}],
    [98.30, 99.60, "i12_skincare.png", "right", "teal", {}],
    [99.60, 102.50, "v4_tired.mp4", "static", "desat", {}],
    [102.50, 105.70, "i52_happy_owner.png", "in", "warm", {}],
    [105.70, 107.40, "v5_sneaker.mp4", "static", "none", {"zoom": 1.15}],
    [107.40, END_VOICE, "p_firm.png", "in", "warm", {"slow": True}],
    [END_VOICE, END, "ENDCARD", "static", "none", {}],
]

# On-screen typography. kind: giant | card | kinetic | serif
# pos: center | upper | lower   (all inside the 9:16 safe zone)
TEXTS = [
    {"s": 1.80, "e": 2.45, "kind": "giant", "lines": ["CREAR"]},
    {"s": 2.45, "e": 3.20, "kind": "giant", "lines": ["CONTENIDO"]},
    {"s": 3.20, "e": 3.85, "kind": "giant", "lines": ["YA NO ES"]},
    {"s": 3.85, "e": 4.75, "kind": "card", "bg": "black",
     "lines": [{"t": "CREAR CONTENIDO", "f": "sans", "c": "#ffffff"},
               {"t": "YA NO ES", "f": "sans", "c": "#ffffff"},
               {"t": "SUFICIENTE", "f": "pixel", "c": "#ff3b30"}]},
    {"s": 4.75, "e": 6.20, "kind": "card", "bg": "white",
     "lines": [{"t": "LA VERDADERA", "f": "sans", "c": "#0a0a0a"},
               {"t": "ventaja", "f": "serif", "c": "#0a0a0a"}]},
    {"s": 12.75, "e": 14.75, "kind": "giant", "lines": ["PUBLICAR", "CONSTANTEMENTE."], "pos": "upper"},
    {"s": 14.75, "e": 15.30, "kind": "giant", "lines": ["VENDER"]},
    {"s": 24.40, "e": 24.95, "kind": "giant", "lines": ["GRABAR."]},
    {"s": 24.95, "e": 25.50, "kind": "giant", "lines": ["EDITAR."]},
    {"s": 26.70, "e": 28.10, "kind": "giant", "lines": ["CORREGIR."]},
    {"s": 29.50, "e": 31.55, "kind": "giant", "lines": ["VOLVER A", "EMPEZAR."], "pos": "upper"},
    {"s": 33.40, "e": 34.95, "kind": "card", "bg": "white",
     "lines": [{"t": "UN VIDEO.", "f": "sans", "c": "#0a0a0a"},
               {"t": "HORAS DE TRABAJO.", "f": "sans", "c": "#0a0a0a", "small": True}]},
    {"s": 41.60, "e": 43.35, "kind": "giant", "lines": ["TIEMPO", "= DINERO."], "pos": "upper"},
    {"s": 51.35, "e": 53.25, "kind": "giant", "lines": ["CREÁ", "ESCENAS."], "pos": "upper"},
    {"s": 53.25, "e": 54.55, "kind": "giant", "lines": ["GENERÁ", "IMÁGENES."], "pos": "upper"},
    {"s": 54.55, "e": 55.85, "kind": "giant", "lines": ["PRODUCÍ", "VIDEOS."], "pos": "upper"},
    {"s": 55.85, "e": 57.85, "kind": "giant", "lines": ["DISEÑÁ", "ANUNCIOS."], "pos": "upper"},
    {"s": 57.85, "e": 60.50, "kind": "giant", "lines": ["AUTOMATIZÁ", "PROCESOS."], "pos": "upper"},
    {"s": 76.05, "e": 77.15, "kind": "giant", "lines": ["MÁS", "CONTENIDO."]},
    {"s": 77.15, "e": 78.35, "kind": "giant", "lines": ["MEJORES", "PRODUCCIONES."]},
    {"s": 78.35, "e": 81.45, "kind": "giant", "lines": ["MENOS", "TIEMPO", "PERDIDO."], "pos": "upper"},
    {"s": 81.45, "e": 85.15, "kind": "kinetic", "bg": "black",
     "lines": [{"t": "LA DIFERENCIA", "at": 81.50, "f": "sans", "c": "#ffffff"},
               {"t": "NO ESTARÁ SOLAMENTE", "at": 82.30, "f": "sans", "c": "#8a8a8a", "small": True},
               {"t": "EN TENER LAS", "at": 83.55, "f": "sans", "c": "#ffffff", "small": True},
               {"t": "herramientas", "at": 84.30, "f": "serif", "c": "#ffffff"}]},
    {"s": 86.35, "e": 87.55, "kind": "giant",
     "lines": ["LA DIFERENCIA ESTÁ", "EN SABER UTILIZARLAS."], "pos": "lower", "size": 78},
    {"s": 108.30, "e": END_VOICE, "kind": "giant",
     "lines": ["ESTE ES EL MOMENTO", "DE APRENDER."], "pos": "lower", "size": 82},
]

FLASHES = [4.75, 33.40, 43.35, 87.55, END_VOICE]
GLITCHES = [1.80, 3.85, 20.95, 24.40, 46.30, 81.45, 99.60]


def build_subs(words):
    """Discreet subtitles: short word groups, hidden wherever big type is on screen."""
    big = [(t["s"], t["e"]) for t in TEXTS]
    def covered(a):
        return any(s - 0.02 <= a < e for s, e in big) or a >= END_VOICE
    chunks, cur = [], []
    for a, b, w in words:
        if covered(a):
            if cur:
                chunks.append(cur); cur = []
            continue
        cur.append([a, b, w])
        text = " ".join(x[2] for x in cur)
        if w[-1] in ".,?!…" or len(text) > 22:
            chunks.append(cur); cur = []
    if cur:
        chunks.append(cur)
    subs = []
    for i, c in enumerate(chunks):
        s = c[0][0]
        nxt = chunks[i + 1][0][0] if i + 1 < len(chunks) else c[-1][1] + 0.6
        e = min(c[-1][1] + 0.35, nxt)
        # never run a subtitle into a big-type block
        for bs, be in big:
            if s < bs < e:
                e = bs
        clean = lambda w: w.strip(".,").lower()
        subs.append({"s": round(s, 3), "e": round(e, 3),
                     "words": [{"t": clean(w), "a": round(a, 3)} for a, b, w in c]})
    return subs


if __name__ == "__main__":
    words = json.load(open("/home/user/ad/words_final.json"))
    # Whisper places "pero" (block 3) before the inserted pause; the voice actually says it at ~43.85 s.
    for w in words:
        if w[2] == "pero" and 43.0 < w[0] < 43.5:
            w[0], w[1] = 43.80, 44.00
    shots = [{"s": s, "e": e, "src": src, "motion": m, "grade": g, **x} for s, e, src, m, g, x in SHOTS]
    for a, b in zip(shots, shots[1:]):
        assert abs(a["e"] - b["s"]) < 1e-6, (a, b)
    edl = {"end": END, "endVoice": END_VOICE, "shots": shots, "texts": TEXTS,
           "subs": build_subs(words), "flashes": FLASHES, "glitches": GLITCHES}
    json.dump(edl, open("/home/user/ad/remotion/src/edl.json", "w"), ensure_ascii=False, indent=1)
    print(len(shots), "shots,", len(TEXTS), "type blocks,", len(edl["subs"]), "subtitle chunks")
