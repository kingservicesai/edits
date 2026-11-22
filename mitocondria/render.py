"""Video 9:16 — Mitocondrias y Citoesqueleto (render local con PIL + ffmpeg)."""
import math, subprocess, wave, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 720, 1280, 30
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
_fc = {}
def F(size, bold=True):
    k = (size, bold)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(FB if bold else FR, size)
    return _fc[k]

# ---------- easing ----------
def clamp(x, a=0, b=1): return max(a, min(b, x))
def eout(x): x = clamp(x); return 1 - (1 - x) ** 3
def eback(x):
    x = clamp(x); c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def lerp(a, b, t): return a + (b - a) * t

WHITE = (255, 255, 255)
DARK = (18, 18, 30)
YEL = (255, 214, 10)
ORANGE = (255, 140, 40)
PINK = (255, 80, 130)
CYAN = (40, 210, 230)
GREEN = (80, 220, 120)
PURPLE = (150, 90, 255)
RED = (240, 70, 60)

def text_c(d, xy, s, size, fill=WHITE, bold=True, anchor="mm", stroke=0, sfill=DARK):
    d.text(xy, s, font=F(size, bold), fill=fill, anchor=anchor,
           stroke_width=stroke, stroke_fill=sfill)

def pop_text(d, t, t0, xy, s, size, fill=WHITE, anchor="mm", stroke=0):
    """Texto que entra deslizando desde abajo con fade (simulado por desplazamiento)."""
    p = eback((t - t0) / 0.35)
    if t < t0: return
    x, y = xy
    y = y + (1 - clamp(p)) * 40
    text_c(d, (x, y), s, size, fill, anchor=anchor, stroke=stroke)

def chip(d, t, t0, xy, s, size=30, bg=YEL, fg=DARK, anchor="mm"):
    if t < t0: return
    p = eback((t - t0) / 0.3)
    f = F(size)
    bb = d.textbbox((0, 0), s, font=f)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    x, y = xy
    if anchor == "lm": x = x + (tw / 2 + 18)
    sc = clamp(p, 0, 1.2)
    w2, h2 = (tw / 2 + 18) * sc, (th / 2 + 14) * sc
    if w2 < 2: return
    d.rounded_rectangle((x - w2, y - h2, x + w2, y + h2), radius=int(h2), fill=bg)
    if p > 0.6:
        d.text((x, y), s, font=f, fill=fg, anchor="mm")

def bullet(d, t, t0, y, s, size=34, col=YEL, x=70):
    if t < t0: return
    p = eout((t - t0) / 0.3)
    xo = x - (1 - p) * 300
    d.ellipse((xo, y - 9, xo + 18, y + 9), fill=col)
    d.text((xo + 34, y), s, font=F(size, False), fill=WHITE, anchor="lm")

def bg_grad(top, bot):
    a = np.linspace(0, 1, H)[:, None, None]
    arr = (np.array(top)[None, None, :] * (1 - a) + np.array(bot)[None, None, :] * a)
    arr = np.repeat(arr, W, axis=1).astype(np.uint8)
    return Image.fromarray(arr, "RGB")

def header(d, t, num, title, col):
    p = eout(t / 0.35)
    x = lerp(-400, 0, p)
    d.rounded_rectangle((x - 40, 90, x + 650, 190), radius=30, fill=col)
    if num:
        d.ellipse((x + 30, 105, x + 100, 175), fill=DARK)
        text_c(d, (x + 65, 140), num, 38, YEL)
        d.text((x + 120, 140), title, font=F(40), fill=DARK, anchor="lm")
    else:
        d.text((x + 40, 140), title, font=F(40), fill=DARK, anchor="lm")

# ---------- dibujos ----------
def mito_shape(d, cx, cy, rx, ry, t, labels_t=None, scale=1.0):
    scale = max(scale, 0.25); rx *= scale; ry *= scale
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(255, 150, 60), outline=(120, 50, 10), width=6)
    d.ellipse((cx - rx + 18, cy - ry + 18, cx + rx - 18, cy + ry - 18), fill=(255, 205, 140))
    # membrana interna con crestas (línea zigzag suave)
    pts = []
    n = 400
    for i in range(n + 1):
        a = 2 * math.pi * i / n
        wob = 0.5 + 0.5 * math.sin(a * 9 + t * 1.5)
        k = 1 - 0.55 * wob ** 4
        pts.append((cx + (rx - 30) * k * math.cos(a), cy + (ry - 30) * k * math.sin(a)))
    d.polygon(pts, fill=(255, 120, 150), outline=(150, 30, 70))
    for (x, y) in pts[::1]:
        pass
    d.line(pts, fill=(150, 30, 70), width=5)
    # ADN circular y ribosomas en la matriz
    d.ellipse((cx - 40 * scale, cy - 22 * scale, cx + 40 * scale, cy + 22 * scale), outline=(60, 20, 120), width=4)
    random.seed(3)
    for _ in range(14):
        a = random.random() * 6.28; r = random.random()
        x = cx + math.cos(a) * r * rx * 0.4; y = cy + math.sin(a) * r * ry * 0.35
        d.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(80, 30, 90))

def arrow(d, a, b, col=WHITE, w=6, head=18):
    d.line((a, b), fill=col, width=w)
    ang = math.atan2(b[1] - a[1], b[0] - a[0])
    p1 = (b[0] - head * math.cos(ang - 0.45), b[1] - head * math.sin(ang - 0.45))
    p2 = (b[0] - head * math.cos(ang + 0.45), b[1] - head * math.sin(ang + 0.45))
    d.polygon([b, p1, p2], fill=col)

# ---------- escenas ----------
def s_intro(img, d, t):
    # pulso de energía
    r = 160 + 20 * math.sin(t * 8)
    for i in range(5, 0, -1):
        rr = r + i * 25
        c = int(40 + 20 * i)
        d.ellipse((W / 2 - rr, 560 - rr, W / 2 + rr, 560 + rr), outline=(255, 200, 0), width=2)
    mito_shape(d, W / 2, 560, 230, 120, t, scale=eback(t / 0.6))
    pop_text(d, t, 0.2, (W / 2, 210), "¿QUIÉN LE DA", 64, YEL, stroke=4)
    pop_text(d, t, 0.45, (W / 2, 290), "ENERGÍA A", 64, YEL, stroke=4)
    pop_text(d, t, 0.7, (W / 2, 370), "TUS CÉLULAS?", 64, YEL, stroke=4)
    pop_text(d, t, 1.4, (W / 2, 850), "Mitocondrias", 70, WHITE, stroke=4)
    pop_text(d, t, 1.7, (W / 2, 930), "+ Citoesqueleto", 52, CYAN, stroke=3)
    chip(d, t, 2.2, (W / 2, 1060), "explicado rápido", 34, PINK, WHITE)

def s_estructura(img, d, t):
    header(d, t, "1", "Estructura", YEL)
    mito_shape(d, W / 2, 470, 280, 150, t, scale=eback(t / 0.5))
    cx, cy = W / 2, 470
    labs = [
        (0.6, (cx - 200, 290), (cx - 190, 360), "Membrana externa", ORANGE),
        (1.0, (cx + 200, 650), (cx + 150, 540), "Membrana interna", PINK),
        (1.4, (cx + 220, 290), (cx + 120, 400), "Crestas", (255, 120, 150)),
        (1.8, (cx - 230, 660), (cx - 20, 480), "Matriz", (255, 205, 140)),
    ]
    for t0, tp, tgt, s, c in labs:
        if t > t0:
            p = eout((t - t0) / 0.3)
            e = (lerp(tp[0], tgt[0], p), lerp(tp[1], tgt[1], p))
            d.line((tp, e), fill=WHITE, width=3)
            chip(d, t, t0, tp, s, 26, c, DARK)
    bullet(d, t, 2.3, 790, "Externa: lisa, con porinas", 31, ORANGE)
    bullet(d, t, 2.7, 860, "Interna: crestas, impermeable", 31, PINK)
    bullet(d, t, 3.1, 930, "Espacio intermembrana: H+", 31, CYAN)
    bullet(d, t, 3.5, 1000, "Matriz: ADN propio, ribosomas,", 31, (255, 205, 140))
    if t > 3.6: d.text((104, 1050), "enzimas del ciclo de Krebs", font=F(31, False), fill=WHITE, anchor="lm")
    chip(d, t, 4.2, (W / 2, 1160), "Organela de doble membrana", 32, YEL)

def s_funcion(img, d, t):
    header(d, t, "1", "Función", YEL)
    # batería que se llena
    bx, by = W / 2, 420
    d.rounded_rectangle((bx - 110, by - 170, bx + 110, by + 170), radius=26, outline=WHITE, width=8)
    d.rectangle((bx - 40, by - 195, bx + 40, by - 170), fill=WHITE)
    lvl = eout(t / 2.0)
    top = by + 150 - 300 * lvl
    d.rounded_rectangle((bx - 90, top, bx + 90, by + 150), radius=14, fill=GREEN)
    text_c(d, (bx, by), "ATP", 64, DARK if lvl > 0.5 else WHITE)
    pop_text(d, t, 0.3, (W / 2, 660), "LA \"CENTRAL ELÉCTRICA\"", 44, YEL, stroke=3)
    bullet(d, t, 0.9, 760, "Produce ~90% del ATP celular", 32, GREEN)
    bullet(d, t, 1.4, 830, "Respiración celular aeróbica", 32, CYAN)
    bullet(d, t, 1.9, 900, "Regula Ca2+ y apoptosis", 32, PINK)
    bullet(d, t, 2.4, 970, "Produce calor (grasa parda)", 32, ORANGE)
    bullet(d, t, 2.9, 1040, "Se divide sola: ADN materno", 32, PURPLE)

def s_glicolisis(img, d, t):
    header(d, t, "2", "Glicólisis", CYAN)
    pop_text(d, t, 0.2, (W / 2, 250), "Ocurre en el CITOSOL", 38, CYAN)
    # glucosa hexágono -> 2 piruvatos
    def hexa(cx, cy, r, col, lab, sz=30):
        pts = [(cx + r * math.cos(math.pi / 3 * i), cy + r * math.sin(math.pi / 3 * i)) for i in range(6)]
        d.polygon(pts, fill=col, outline=WHITE)
        text_c(d, (cx, cy), lab, sz, DARK)
    sp = eout((t - 1.0) / 0.8)
    hexa(W / 2, 400, 80 * (1 - sp * 0.0), YEL, "Glucosa", 26) if sp < 0.5 else None
    if sp >= 0.5:
        hexa(W / 2 - 170 * sp, 420, 60, ORANGE, "Piruvato", 18)
        hexa(W / 2 + 170 * sp, 420, 60, ORANGE, "Piruvato", 18)
    if t > 1.0:
        text_c(d, (W / 2, 520), "6C  →  2 × 3C", 34, WHITE)
    chip(d, t, 1.8, (W / 2 - 150, 610), "+2 ATP", 34, GREEN)
    chip(d, t, 2.1, (W / 2 + 150, 610), "+2 NADH", 34, PINK, WHITE)
    pop_text(d, t, 2.8, (W / 2, 730), "¿Y luego?", 44, YEL)
    bullet(d, t, 3.2, 820, "Piruvato entra a la mitocondria", 31, ORANGE)
    bullet(d, t, 3.6, 890, "Se convierte en Acetil-CoA", 31, YEL)
    bullet(d, t, 4.0, 960, "Libera CO2 + 1 NADH", 31, PINK)
    chip(d, t, 4.5, (W / 2, 1090), "No necesita oxígeno", 32, WHITE, DARK)

def s_krebs(img, d, t):
    header(d, t, "2", "Ciclo de Krebs", CYAN)
    pop_text(d, t, 0.2, (W / 2, 240), "Ciclo de los ácidos tricarboxílicos", 28, CYAN)
    pop_text(d, t, 0.4, (W / 2, 285), "en la MATRIZ mitocondrial", 28, WHITE)
    cx, cy, R = W / 2, 560, 190
    p = eout(t / 0.6)
    d.ellipse((cx - R * p, cy - R * p, cx + R * p, cy + R * p), outline=CYAN, width=12)
    # flechas giratorias
    for k in range(3):
        a = t * 2.2 + k * 2 * math.pi / 3
        x, y = cx + R * math.cos(a), cy + R * math.sin(a)
        d.ellipse((x - 18, y - 18, x + 18, y + 18), fill=YEL)
    text_c(d, (cx, cy - 20), "Acetil-CoA", 30, YEL)
    text_c(d, (cx, cy + 20), "+ Oxalacetato", 26, WHITE)
    outs = [(0.9, (cx - 230, 340), "3 NADH", PINK, WHITE), (1.3, (cx + 230, 340), "1 FADH2", PURPLE, WHITE),
            (1.7, (cx - 230, 790), "1 GTP/ATP", GREEN, DARK), (2.1, (cx + 230, 790), "2 CO2", (200, 200, 200), DARK)]
    for t0, xy, s, bg, fg in outs:
        chip(d, t, t0, xy, s, 32, bg, fg)
    pop_text(d, t, 2.7, (W / 2, 900), "por cada vuelta (x2 por glucosa)", 28, WHITE)
    chip(d, t, 3.3, (W / 2, 1010), "NADH y FADH2 = \"baterías\"", 32, YEL)
    pop_text(d, t, 3.8, (W / 2, 1100), "llevan electrones a la cadena", 30, CYAN)

def s_cadena(img, d, t):
    header(d, t, "3", "Cadena de electrones", PINK)
    pop_text(d, t, 0.2, (W / 2, 245), "Espacio intermembrana", 28, CYAN)
    # membrana
    my = 520
    d.rectangle((0, my - 45, W, my + 45), fill=(255, 170, 100))
    for x in range(0, W, 24):
        d.ellipse((x, my - 52, x + 18, my - 36), fill=(255, 120, 60))
        d.ellipse((x, my + 36, x + 18, my + 52), fill=(255, 120, 60))
    text_c(d, (W / 2, 820), "MATRIZ", 28, (255, 205, 140))
    comps = [(90, "I", 0.4), (210, "II", 0.6), (330, "III", 0.8), (450, "IV", 1.0)]
    for x, lab, t0 in comps:
        if t > t0:
            s = eback((t - t0) / 0.3)
            d.rounded_rectangle((x - 45 * s, my - 90 * s, x + 45 * s, my + 90 * s), radius=18, fill=PURPLE, outline=WHITE, width=3)
            if s > 0.7: text_c(d, (x, my), lab, 34, WHITE)
    # flujo de electrones
    if t > 1.3:
        for k in range(4):
            ph = ((t - 1.3) * 0.8 + k / 4) % 1
            x = lerp(90, 450, ph)
            d.ellipse((x - 10, my + 60 - 10, x + 10, my + 60 + 10), fill=YEL)
        text_c(d, (270, my + 120), "e-  →", 26, YEL)
    # H+ bombeados por I, III, IV
    if t > 1.6:
        for x in (90, 330, 450):
            for k in range(3):
                ph = ((t - 1.6) * 0.9 + k / 3) % 1
                y = lerp(my + 40, my - 210, ph)
                d.ellipse((x - 16, y - 16, x + 16, y + 16), fill=RED)
                text_c(d, (x, y), "H+", 15, WHITE)
    # O2 -> H2O
    chip(d, t, 2.2, (560, 700), "O2 → H2O", 28, CYAN, DARK)
    chip(d, t, 0.8, (120, 700), "NADH", 26, PINK, WHITE)
    chip(d, t, 0.9, (240, 760), "FADH2", 24, PURPLE, WHITE)
    bullet(d, t, 2.8, 900, "4 complejos en membrana interna", 30, PURPLE)
    bullet(d, t, 3.2, 965, "Bombean H+ al espacio intermembrana", 28, RED)
    bullet(d, t, 3.6, 1030, "O2 es el aceptor final de e-", 30, CYAN)
    chip(d, t, 4.2, (W / 2, 1140), "= GRADIENTE de protones", 34, YEL)

def s_atp(img, d, t):
    header(d, t, "3", "ATP sintasa", PINK)
    my = 470
    d.rectangle((0, my - 45, W, my + 45), fill=(255, 170, 100))
    for x in range(0, W, 24):
        d.ellipse((x, my - 52, x + 18, my - 36), fill=(255, 120, 60))
        d.ellipse((x, my + 36, x + 18, my + 52), fill=(255, 120, 60))
    cx = W / 2
    # F0 canal
    d.rounded_rectangle((cx - 50, my - 70, cx + 50, my + 70), radius=16, fill=(90, 160, 255), outline=WHITE, width=3)
    # tallo
    d.rectangle((cx - 12, my + 70, cx + 12, my + 140), fill=(70, 120, 220))
    # F1 cabeza rotando
    hy = my + 210
    d.ellipse((cx - 85, hy - 70, cx + 85, hy + 70), fill=(60, 110, 230), outline=WHITE, width=3)
    for k in range(6):
        a = t * 5 + k * math.pi / 3
        x, y = cx + 52 * math.cos(a), hy + 40 * math.sin(a)
        d.ellipse((x - 16, y - 16, x + 16, y + 16), fill=(130, 190, 255) if k % 2 else (40, 80, 200))
    text_c(d, (cx + 150, my), "F0", 30, WHITE)
    text_c(d, (cx + 150, hy), "F1", 30, WHITE)
    # H+ arriba bajando por el canal
    for k in range(10):
        random.seed(k)
        x0 = random.randint(40, W - 40); y0 = random.randint(230, my - 80)
        d.ellipse((x0 - 14, y0 - 14, x0 + 14, y0 + 14), fill=RED)
        text_c(d, (x0, y0), "H+", 13, WHITE)
    for k in range(3):
        ph = (t * 0.9 + k / 3) % 1
        y = lerp(my - 120, my + 70, ph)
        d.ellipse((cx - 14, y - 14, cx + 14, y + 14), fill=RED)
        text_c(d, (cx, y), "H+", 13, WHITE)
    # ATP saliendo
    if t > 1.0:
        for k in range(3):
            ph = ((t - 1.0) * 0.7 + k / 3) % 1
            x = lerp(cx + 90, cx + 290, ph); y = hy + 30 + 60 * math.sin(ph * 3)
            chip(d, 99, 0, (x, y), "ATP", 22, GREEN, DARK)
        text_c(d, (cx - 200, hy + 30), "ADP + Pi", 28, WHITE)
        arrow(d, (cx - 200, hy + 60), (cx - 110, hy + 60), WHITE, 4, 14)
    bullet(d, t, 1.6, 860, "H+ regresa a la matriz por F0", 30, RED)
    bullet(d, t, 2.0, 925, "El rotor gira como turbina", 30, CYAN)
    bullet(d, t, 2.4, 990, "F1 une ADP + Pi → ATP", 30, GREEN)
    chip(d, t, 3.0, (W / 2, 1090), "Quimiosmosis (Mitchell)", 32, YEL)
    pop_text(d, t, 3.6, (W / 2, 1180), "Fosforilación oxidativa", 34, WHITE, stroke=2)

def s_balance(img, d, t):
    header(d, t, "3", "Balance de ATP", PINK)
    rows = [(0.4, "Glicólisis", "2 ATP", CYAN), (0.8, "Krebs", "2 ATP", PURPLE),
            (1.2, "Fosf. oxidativa", "~26-28 ATP", PINK)]
    y = 320
    for t0, a, b, c in rows:
        if t > t0:
            p = eout((t - t0) / 0.3)
            x = lerp(W, 60, p)
            d.rounded_rectangle((x, y - 50, x + 600, y + 50), radius=24, fill=c)
            d.text((x + 30, y), a, font=F(34), fill=DARK, anchor="lm")
            d.text((x + 575, y), b, font=F(34), fill=WHITE, anchor="rm", stroke_width=2, stroke_fill=DARK)
        y += 130
    if t > 1.8:
        s = eback((t - 1.8) / 0.4)
        n = int(clamp((t - 1.8) / 1.0) * 32)
        text_c(d, (W / 2, 780), f"~{max(30, n) if n >= 30 else n}", int(150 * clamp(s, 0, 1.2)) + 1, YEL, stroke=6)
        text_c(d, (W / 2, 900), "ATP por glucosa", 44, WHITE)
    chip(d, t, 2.8, (W / 2, 1030), "vs. solo 2 sin oxígeno", 34, RED, WHITE)
    pop_text(d, t, 3.3, (W / 2, 1130), "1 NADH ≈ 2.5 ATP · 1 FADH2 ≈ 1.5", 28, CYAN)

def draw_cell(d, t, cx, cy):
    d.ellipse((cx - 300, cy - 230, cx + 300, cy + 230), fill=(30, 60, 90), outline=CYAN, width=5)
    d.ellipse((cx - 70, cy - 60, cx + 70, cy + 60), fill=(90, 60, 160), outline=WHITE, width=3)
    random.seed(7)
    for _ in range(14):  # microtúbulos radiales
        a = random.random() * 6.28
        r = 70 + 200 * eout(t / 1.2)
        d.line((cx + 70 * math.cos(a), cy + 60 * math.sin(a), cx + r * math.cos(a) * 1.0, cy + r * 0.75 * math.sin(a)), fill=GREEN, width=4)
    for k in range(40):  # actina cortical
        a = 2 * math.pi * k / 40
        d.line((cx + 280 * math.cos(a), cy + 212 * math.sin(a), cx + 260 * math.cos(a + 0.12), cy + 195 * math.sin(a + 0.12)), fill=RED, width=4)
    random.seed(9)
    for _ in range(8):  # intermedios ondulados
        a = random.random() * 6.28
        pts = [(cx + (80 + i * 18) * math.cos(a + 0.15 * math.sin(i + t * 2)), cy + (70 + i * 13) * math.sin(a + 0.15 * math.sin(i + t * 2))) for i in range(10)]
        d.line(pts, fill=YEL, width=3)

def s_citoesq(img, d, t):
    header(d, t, "4", "Citoesqueleto", GREEN)
    draw_cell(d, t, W / 2, 470)
    chip(d, t, 0.8, (190, 760), "Microtúbulos", 26, GREEN, DARK)
    chip(d, t, 1.0, (500, 760), "Microfilamentos", 26, RED, WHITE)
    chip(d, t, 1.2, (W / 2, 830), "Filamentos intermedios", 26, YEL, DARK)
    pop_text(d, t, 1.7, (W / 2, 910), "Movimientos celulares:", 38, WHITE, stroke=2)
    bullet(d, t, 2.1, 980, "Cilios y flagelos (microtúbulos)", 30, GREEN)
    bullet(d, t, 2.5, 1045, "Pseudópodos y contracción (actina)", 28, RED)
    bullet(d, t, 2.9, 1110, "Transporte de vesículas (motores)", 30, CYAN)
    bullet(d, t, 3.3, 1175, "Separación de cromosomas", 30, PURPLE)

def s_microtub(img, d, t):
    header(d, t, "5", "Microtúbulos", GREEN)
    # tubo de dímeros α/β creciendo
    x0, y0 = 120, 400
    grow = int(clamp(t / 1.5) * 12)
    for row in range(5):
        for c in range(grow):
            x = x0 + c * 40 + (row % 2) * 6
            y = y0 - 90 + row * 36
            col = (120, 230, 140) if (c % 2 == 0) else (40, 150, 80)
            d.ellipse((x, y, x + 36, y + 32), fill=col, outline=DARK)
    if grow:
        d.text((x0 - 50, y0 - 20), "−", font=F(60), fill=WHITE, anchor="mm")
        xe = x0 + grow * 40 + 30
        d.text((xe, y0 - 20), "+", font=F(60), fill=YEL, anchor="mm")
    chip(d, t, 1.6, (180, 540), "α-tubulina", 24, (120, 230, 140), DARK)
    chip(d, t, 1.8, (420, 540), "β-tubulina", 24, (40, 150, 80), WHITE)
    bullet(d, t, 2.1, 630, "Tubos huecos de 25 nm", 31, GREEN)
    bullet(d, t, 2.4, 690, "13 protofilamentos", 31, GREEN)
    bullet(d, t, 2.7, 750, "Usan GTP · polaridad + / −", 31, YEL)
    bullet(d, t, 3.0, 810, "Inestabilidad dinámica", 31, PINK)
    bullet(d, t, 3.3, 870, "Nacen del centrosoma (MTOC)", 31, CYAN)
    pop_text(d, t, 3.8, (W / 2, 950), "Función:", 36, YEL)
    pop_text(d, t, 4.0, (W / 2, 1010), "Huso mitótico · Cilios/flagelos (9+2)", 27, WHITE)
    pop_text(d, t, 4.2, (W / 2, 1055), "Transporte · Forma celular", 27, WHITE)
    # motor caminando
    if t > 4.4:
        xm = lerp(80, 640, ((t - 4.4) * 0.4) % 1)
        d.line((40, 1170, 680, 1170), fill=GREEN, width=10)
        d.ellipse((xm - 22, 1130, xm + 22, 1160), fill=ORANGE)
        d.ellipse((xm - 30, 1090, xm + 30, 1130), fill=PINK)

def s_maps(img, d, t):
    header(d, t, "5", "Proteínas asociadas", GREEN)
    pop_text(d, t, 0.2, (W / 2, 250), "MAPs", 70, YEL, stroke=4)
    pop_text(d, t, 0.5, (W / 2, 320), "(Microtubule-Associated Proteins)", 26, WHITE)
    # riel
    ry = 520
    d.line((40, ry, 680, ry), fill=GREEN, width=16)
    text_c(d, (30, ry - 40), "−", 50, WHITE); text_c(d, (690, ry - 40), "+", 50, YEL)
    # cinesina hacia +
    if t > 0.8:
        xk = lerp(100, 600, ((t - 0.8) * 0.35) % 1)
        d.ellipse((xk - 20, ry - 40, xk + 20, ry - 10), fill=ORANGE)
        d.ellipse((xk - 34, ry - 95, xk + 34, ry - 40), fill=CYAN)
        text_c(d, (xk, ry - 130), "Cinesina →", 26, CYAN)
    if t > 1.2:
        xk = lerp(600, 100, ((t - 1.2) * 0.35) % 1)
        d.ellipse((xk - 20, ry + 10, xk + 20, ry + 40), fill=ORANGE)
        d.ellipse((xk - 34, ry + 40, xk + 34, ry + 95), fill=PINK)
        text_c(d, (xk, ry + 130), "← Dineína", 26, PINK)
    bullet(d, t, 1.8, 760, "Motoras: cinesina (va al +)", 30, CYAN)
    bullet(d, t, 2.2, 825, "  y dineína (va al −)", 30, PINK)
    bullet(d, t, 2.6, 890, "Usan ATP para caminar", 30, GREEN)
    bullet(d, t, 3.0, 955, "Estabilizadoras: MAP2, tau", 30, YEL)
    chip(d, t, 3.6, (W / 2, 1070), "Tau alterada → Alzheimer", 32, RED, WHITE)

def s_actina(img, d, t):
    header(d, t, "6", "Microfilamentos", RED)
    # doble hélice de actina
    n = int(clamp(t / 1.2) * 18)
    for i in range(n):
        x = 60 + i * 34
        y1 = 400 + 30 * math.sin(i * 0.6 + t * 2)
        y2 = 400 - 30 * math.sin(i * 0.6 + t * 2)
        d.ellipse((x, y1 - 18, x + 34, y1 + 18), fill=(255, 110, 100), outline=DARK)
        d.ellipse((x, y2 - 18, x + 34, y2 + 18), fill=(200, 50, 50), outline=DARK)
    chip(d, t, 1.3, (W / 2, 500), "Actina G  →  Actina F", 28, RED, WHITE)
    bullet(d, t, 1.7, 600, "Los más delgados: ~7 nm", 31, RED)
    bullet(d, t, 2.0, 660, "Doble hélice · polaridad + / −", 31, RED)
    bullet(d, t, 2.3, 720, "Usan ATP · trabajan con miosina", 31, YEL)
    pop_text(d, t, 2.8, (W / 2, 810), "Función:", 36, YEL)
    bullet(d, t, 3.0, 880, "Contracción muscular", 30, PINK)
    bullet(d, t, 3.3, 940, "Pseudópodos (amebas, macrófagos)", 28, PINK)
    bullet(d, t, 3.6, 1000, "Microvellosidades", 30, PINK)
    bullet(d, t, 3.9, 1060, "Anillo contráctil en citocinesis", 30, PINK)

def s_intermedios(img, d, t):
    header(d, t, "6", "F. intermedios", YEL)
    # cuerda trenzada
    L = clamp(t / 1.2)
    for k in range(4):
        pts = []
        for i in range(int(60 * L) + 2):
            x = 60 + i * 10
            pts.append((x, 400 + 28 * math.sin(i * 0.35 + k * math.pi / 2)))
        if len(pts) > 1:
            d.line(pts, fill=[YEL, ORANGE, (255, 240, 150), (220, 170, 0)][k], width=9)
    chip(d, t, 1.3, (W / 2, 500), "Como una cuerda: ~10 nm", 28, YEL, DARK)
    bullet(d, t, 1.7, 600, "Sin polaridad, sin ATP/GTP", 31, YEL)
    bullet(d, t, 2.0, 660, "Muy resistentes y estables", 31, YEL)
    pop_text(d, t, 2.5, (W / 2, 750), "Tipos:", 36, CYAN)
    chip(d, t, 2.7, (170, 830), "Queratinas", 26, (255, 240, 150))
    chip(d, t, 2.9, (470, 830), "Vimentina", 26, ORANGE)
    chip(d, t, 3.1, (170, 910), "Desmina", 26, PINK, WHITE)
    chip(d, t, 3.3, (470, 910), "Neurofilamentos", 26, PURPLE, WHITE)
    chip(d, t, 3.5, (W / 2, 990), "Láminas nucleares", 26, CYAN)
    pop_text(d, t, 4.0, (W / 2, 1090), "Función: resistencia mecánica", 32, WHITE, stroke=2)
    pop_text(d, t, 4.2, (W / 2, 1140), "y anclaje (desmosomas)", 32, WHITE, stroke=2)

def s_resumen(img, d, t):
    header(d, t, "", "Resumen express", YEL)
    rows = [(0.3, "Mitocondria", "doble membrana → ATP", ORANGE),
            (0.7, "Glicólisis + Krebs", "NADH y FADH2", CYAN),
            (1.1, "Cadena + ATP sintasa", "gradiente H+ → ATP", PINK),
            (1.5, "Microtúbulos", "tubulina · 25 nm", GREEN),
            (1.9, "Microfilamentos", "actina · 7 nm", RED),
            (2.3, "F. intermedios", "resistencia · 10 nm", YEL)]
    y = 290
    for t0, a, b, c in rows:
        if t > t0:
            p = eout((t - t0) / 0.3)
            x = lerp(-650, 40, p)
            d.rounded_rectangle((x, y - 55, x + 640, y + 55), radius=22, fill=c)
            d.text((x + 25, y - 18), a, font=F(32), fill=DARK, anchor="lm")
            d.text((x + 25, y + 22), b, font=F(26, False), fill=DARK, anchor="lm")
        y += 135
    pop_text(d, t, 3.0, (W / 2, 1150), "¡Guárdalo para tu examen!", 40, YEL, stroke=3)

SCENES = [
    (s_intro, 3.4, (40, 20, 70), (10, 10, 25)),
    (s_estructura, 5.6, (60, 25, 15), (15, 10, 10)),
    (s_funcion, 4.4, (20, 50, 30), (8, 15, 10)),
    (s_glicolisis, 5.6, (10, 40, 60), (5, 10, 20)),
    (s_krebs, 5.0, (10, 30, 60), (5, 8, 20)),
    (s_cadena, 5.4, (60, 15, 40), (15, 5, 15)),
    (s_atp, 5.0, (50, 15, 50), (12, 5, 15)),
    (s_balance, 4.4, (40, 10, 40), (10, 5, 12)),
    (s_citoesq, 4.6, (10, 50, 40), (5, 15, 12)),
    (s_microtub, 5.8, (10, 45, 25), (5, 12, 8)),
    (s_maps, 4.8, (15, 40, 40), (5, 12, 12)),
    (s_actina, 5.0, (60, 15, 15), (15, 5, 5)),
    (s_intermedios, 5.0, (55, 45, 10), (15, 12, 5)),
    (s_resumen, 4.4, (30, 20, 60), (10, 8, 20)),
]

VOICE_DELAY = 0.25
ORIG = [sc[1] for sc in SCENES]
def load_voice(sr=44100):
    import os, glob
    os.makedirs("voz", exist_ok=True)
    for f in sorted(glob.glob("voz_raw/*.mp3")):  # recorta silencios y acelera 1.2x
        out = "voz/" + os.path.basename(f)[:-4] + ".wav"
        if not os.path.exists(out):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-af",
                "silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.25:stop_threshold=-45dB,atempo=1.2,loudnorm=I=-16:TP=-1.5",
                "-ar", "44100", "-ac", "1", out], check=True)
    clips = []
    for i in range(len(SCENES)):
        p = f"voz/{i:02d}.wav"
        if os.path.exists(p):
            with wave.open(p) as wf:
                a = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float64) / 32767
        else:
            a = np.zeros(1)
        clips.append(a)
        dur = VOICE_DELAY + len(a) / sr + 0.35
        fn, _, c1, c2 = SCENES[i]
        SCENES[i] = (fn, max(ORIG[i], dur), c1, c2)
    return clips

def render():
    total = sum(s[1] for s in SCENES)
    nframes = int(total * FPS)
    proc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                             "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", "music.wav",
                             "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
                             "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart",
                             "mitocondria_citoesqueleto.mp4"], stdin=subprocess.PIPE)
    bgs = [bg_grad(s[2], s[3]) for s in SCENES]
    starts = np.cumsum([0] + [s[1] for s in SCENES])
    for f in range(nframes):
        T = f / FPS
        i = int(np.searchsorted(starts, T, side="right") - 1)
        i = min(i, len(SCENES) - 1)
        fn, dur, _, _ = SCENES[i]
        t = T - starts[i]
        img = bgs[i].copy()
        d = ImageDraw.Draw(img)
        fn(img, d, t * ORIG[i] / dur)
        # barra de progreso
        d.rectangle((0, 0, int(W * T / total), 10), fill=YEL)
        # transición: barrido de color en los primeros 0.18 s
        if t < 0.18 and i > 0:
            w = int(W * (1 - t / 0.18))
            d.rectangle((W - w, 0, W, H), fill=YEL)
        proc.stdin.write(img.tobytes())
    proc.stdin.close(); proc.wait()
    return total

def music(total, sr=44100):
    n = int(sr * (total + 0.5))
    out = np.zeros(n)
    bpm = 124; beat = 60 / bpm
    tt = np.arange(int(sr * 0.25)) / sr
    kick = np.sin(2 * np.pi * (50 + 120 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12)
    hat = np.random.default_rng(1).normal(0, 1, int(sr * 0.05)) * np.exp(-np.arange(int(sr * 0.05)) / sr * 90)
    bass_notes = [55, 55, 65.4, 49]
    k = 0; tb = 0.0
    while tb < total:
        s = int(tb * sr)
        out[s:s + len(kick)] += 0.9 * kick[: n - s]
        h = int((tb + beat / 2) * sr)
        out[h:h + len(hat)] += 0.18 * hat[: max(0, n - h)]
        # bajo
        f0 = bass_notes[(k // 4) % 4]
        bl = int(sr * beat * 0.9); bt = np.arange(bl) / sr
        b = 0.25 * np.sign(np.sin(2 * np.pi * f0 * bt)) * np.exp(-bt * 4)
        hb = int((tb + beat / 2) * sr)
        out[hb:hb + bl] += b[: max(0, n - hb)]
        tb += beat; k += 1
    # whoosh en cada transición
    starts = np.cumsum([0] + [s[1] for s in SCENES])[1:-1]
    wl = int(sr * 0.3); wt = np.arange(wl) / sr
    wh = np.random.default_rng(2).normal(0, 1, wl) * np.sin(np.pi * wt / 0.3) ** 2 * 0.25
    for st in starts:
        s = int(st * sr) - wl // 2
        out[s:s + wl] += wh
    fade = int(sr * 1.0)
    out[-fade:] *= np.linspace(1, 0, fade)
    out = out / np.max(np.abs(out)) * 0.16
    st = np.cumsum([0] + [sc[1] for sc in SCENES])
    for i, a in enumerate(VOICE):
        p = int((st[i] + VOICE_DELAY) * sr)
        out[p:p + len(a)] += a[: max(0, n - p)] * 0.95
    out = np.clip(out, -0.99, 0.99)
    with wave.open("music.wav", "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(sr)
        wf.writeframes((out * 32767).astype(np.int16).tobytes())

if __name__ == "__main__":
    import sys
    VOICE = load_voice()
    total = sum(s[1] for s in SCENES)
    if len(sys.argv) > 1 and sys.argv[1] == "preview":
        for idx, (fn, dur, a, b) in enumerate(SCENES):
            img = bg_grad(a, b); d = ImageDraw.Draw(img); fn(img, d, dur - 0.1)
            img.save(f"preview_{idx:02d}.png")
    else:
        music(total)
        print("duración:", render())
