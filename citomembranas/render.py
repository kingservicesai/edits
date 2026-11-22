"""Video 9:16 - Sistema de Citomembranas (render liviano con PIL + ffmpeg)."""
import math, subprocess, wave, sys
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 24
OUT = sys.argv[1] if len(sys.argv) > 1 else "citomembranas.mp4"
FD = "/usr/share/fonts/opentype/inter/"
F_BLACK = FD + "Inter-ExtraBold.otf"
F_BOLD = FD + "Inter-SemiBold.otf"
F_MED = FD + "Inter-Medium.otf"

WHITE = (255, 255, 255)
YEL = (255, 214, 64)
PINK = (255, 92, 150)
CYAN = (64, 220, 255)
GREEN = (110, 235, 140)
ORANGE = (255, 150, 60)
PURPLE = (170, 120, 255)
GREY = (190, 200, 220)


@lru_cache(None)
def font(path, size):
    return ImageFont.truetype(path, size)


def ease(x):  # easeOutBack: entra con un pequeño rebote
    x = max(0.0, min(1.0, x))
    c = 1.70158
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


def lin(x):
    return max(0.0, min(1.0, x))


def smooth(x):
    x = lin(x)
    return x * x * (3 - 2 * x)


@lru_cache(None)
def text_img(s, path, size, color):
    f = font(path, size)
    l, t, r, b = f.getbbox(s)
    im = Image.new("RGBA", (r - l + 8, b - t + 8), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((4 - l, 4 - t), s, font=f, fill=color)
    return im


def put(img, s, x, y, size=48, color=WHITE, path=F_BOLD, anchor="mm", a=1.0, scale=1.0):
    """Pega texto con alpha a y escala."""
    if a <= 0.01:
        return
    im = text_img(s, path, size, color)
    if scale != 1.0:
        sw, sh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
        im = im.resize((sw, sh), Image.BILINEAR)
    if a < 1:
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
    if anchor == "mm":
        px, py = x - im.width // 2, y - im.height // 2
    elif anchor == "lm":
        px, py = x, y - im.height // 2
    else:
        px, py = x, y
    img.paste(im, (int(px), int(py)), im)


def wrap(s, path, size, maxw):
    f = font(path, size)
    words, lines, cur = s.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if f.getlength(test) <= maxw:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def bullets(img, items, t, start, y0, gap=0.45, size=44, color=WHITE, dot=YEL, maxw=860, lh=1.28):
    """Lista que entra deslizándose desde la derecha, uno por uno."""
    d = ImageDraw.Draw(img, "RGBA")
    y = y0
    for i, s in enumerate(items):
        k = ease((t - start - i * gap) / 0.35)
        a = lin((t - start - i * gap) / 0.25)
        off = (1 - k) * 300
        lines = wrap(s, F_MED, size, maxw)
        if a > 0:
            r = 11
            cx, cy = 90 + off, y + size * 0.62
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=dot + (int(255 * a),))
            for j, ln in enumerate(lines):
                put(img, ln, 125 + off, y + j * size * lh, size, color, F_MED, anchor="lt", a=a)
        y += len(lines) * size * lh + 22
    return y


# ---------- Fondo ----------
def gradient(c1, c2):
    g = np.linspace(0, 1, H)[:, None, None]
    arr = (np.array(c1) * (1 - g) + np.array(c2) * g).astype(np.uint8)
    arr = np.repeat(arr, W, axis=1)
    im = Image.fromarray(arr, "RGB")
    return im


BG_CACHE = {}


def bg(key, c1, c2):
    if key not in BG_CACHE:
        BG_CACHE[key] = gradient(c1, c2)
    return BG_CACHE[key].copy()


def particles(img, t, color=(255, 255, 255)):
    d = ImageDraw.Draw(img, "RGBA")
    rng = np.random.default_rng(3)
    for i in range(26):
        x0, y0, sp, r = rng.uniform(0, W), rng.uniform(0, H), rng.uniform(20, 70), rng.uniform(3, 9)
        y = (y0 - t * sp) % H
        x = x0 + 18 * math.sin(t * 0.8 + i)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color + (40,))


def header(img, t, num, title, color):
    """Etiqueta de sección + título que cae con rebote."""
    d = ImageDraw.Draw(img, "RGBA")
    k = ease(t / 0.4)
    y = 200 - (1 - k) * 160
    if num:
        tw = font(F_BLACK, 34).getlength(num)
        bx = W // 2
        d.rounded_rectangle([bx - tw / 2 - 26, y - 110, bx + tw / 2 + 26, y - 56], 27, fill=color + (255,))
        put(img, num, bx, y - 83, 34, (20, 20, 40), F_BLACK)
    for i, ln in enumerate(title.split("\n")):
        put(img, ln, W // 2, y + i * 92, 84, WHITE, F_BLACK, a=lin(t / 0.25))


def card(img, box, color, a=1.0):
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle(box, 36, fill=(255, 255, 255, int(22 * a)), outline=color + (int(160 * a),), width=4)


# ---------- Dibujos de organelas ----------
def draw_rer(img, t, cx, cy, s=1.0):
    d = ImageDraw.Draw(img, "RGBA")
    for i in range(4):
        k = ease((t - i * 0.15) / 0.4)
        if k <= 0:
            continue
        w = (520 - i * 30) * s * k
        hh = 46 * s
        y = cy + (i - 1.5) * 78 * s + 6 * math.sin(t * 2 + i)
        d.rounded_rectangle([cx - w / 2, y - hh / 2, cx + w / 2, y + hh / 2], int(hh / 2),
                            fill=(255, 92, 150, 90), outline=PINK + (255,), width=6)
        # ribosomas
        if t > 0.6:
            n = int(w / (34 * s))
            for j in range(n):
                if (t - 0.6) * 30 < j:
                    break
                rx = cx - w / 2 + 20 * s + j * 34 * s
                for ry in (y - hh / 2 - 9 * s, y + hh / 2 + 9 * s):
                    d.ellipse([rx - 8 * s, ry - 8 * s, rx + 8 * s, ry + 8 * s], fill=YEL + (255,))


def draw_rel(img, t, cx, cy, s=1.0):
    d = ImageDraw.Draw(img, "RGBA")
    rev = lin(t / 1.0)
    for i in range(4):
        pts = []
        y0 = cy + (i - 1.5) * 75 * s
        n = int(60 * rev)
        for j in range(n + 1):
            x = cx - 270 * s + j * 9 * s
            y = y0 + 28 * s * math.sin(j * 0.22 + i * 1.3 + t * 2.2)
            pts.append((x, y))
        if len(pts) > 1:
            d.line(pts, fill=(64, 220, 255, 255), width=int(26 * s), joint="curve")
            d.line(pts, fill=(20, 60, 100, 255), width=int(8 * s), joint="curve")
    # conexiones
    if rev >= 1:
        for x in (-150, 20, 190):
            for i in range(3):
                y1 = cy + (i - 1.5) * 75 * s
                d.line([(cx + x * s, y1 + 10), (cx + (x + 20) * s, y1 + 65 * s)], fill=CYAN + (200,), width=int(12 * s))


def draw_golgi(img, t, cx, cy, s=1.0, vesicles=True):
    d = ImageDraw.Draw(img, "RGBA")
    cols = [GREEN, (150, 230, 120), (200, 220, 100), (240, 200, 90), ORANGE]
    for i in range(5):
        k = ease((t - i * 0.12) / 0.4)
        if k <= 0:
            continue
        r = (300 - i * 18) * s
        y = cy + (i - 2) * 58 * s + r * 0.55
        bb = [cx - r * k, y - r * 0.9, cx + r * k, y + r * 0.9 - 40 * s]
        d.arc(bb, 215, 325, fill=cols[i] + (255,), width=int(30 * s))
    if vesicles and t > 0.8:
        for j in range(5):
            ph = ((t - 0.8) * 0.6 + j / 5) % 1
            ang = math.radians(220 + j * 25)
            dist = 250 * s + ph * 260 * s
            vx = cx + math.cos(ang) * dist * 0.9
            vy = cy + 260 * s + abs(math.sin(ang)) * 20 + ph * 120 * s
            r = 20 * s
            al = int(255 * (1 - ph))
            d.ellipse([vx - r, vy - r, vx + r, vy + r], fill=ORANGE + (al,), outline=WHITE + (al,), width=3)


def draw_vesicle(img, x, y, r, color, coat, a=1.0, spin=0.0):
    d = ImageDraw.Draw(img, "RGBA")
    al = int(255 * a)
    if coat == "clatrina":
        pts = []
        for i in range(12):
            ang = spin + i * math.pi / 6
            rr = r + (22 if i % 2 == 0 else 6)
            pts.append((x + rr * math.cos(ang), y + rr * math.sin(ang)))
        d.polygon(pts, outline=color + (al,), width=6)
    else:
        for i in range(14):
            ang = spin + i * 2 * math.pi / 14
            px, py = x + (r + 14) * math.cos(ang), y + (r + 14) * math.sin(ang)
            d.ellipse([px - 9, py - 9, px + 9, py + 9], fill=color + (al,))
    d.ellipse([x - r, y - r, x + r, y + r], fill=color + (int(70 * a),), outline=WHITE + (al,), width=5)


def arrow(d, p1, p2, color, w=8, a=1.0):
    al = int(255 * a)
    d.line([p1, p2], fill=color + (al,), width=w)
    ang = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
    L = 28
    pa = (p2[0] - L * math.cos(ang - 0.45), p2[1] - L * math.sin(ang - 0.45))
    pb = (p2[0] - L * math.cos(ang + 0.45), p2[1] - L * math.sin(ang + 0.45))
    d.polygon([p2, pa, pb], fill=color + (al,))


# ---------- Escenas ----------
def s_intro(t):
    img = bg("intro", (40, 10, 80), (10, 30, 70))
    particles(img, t)
    d = ImageDraw.Draw(img, "RGBA")
    # célula pulsando
    r = 330 + 12 * math.sin(t * 4)
    k = ease(t / 0.5)
    d.ellipse([W / 2 - r * k, 760 - r * k, W / 2 + r * k, 760 + r * k], outline=CYAN + (255,), width=10, fill=(64, 220, 255, 25))
    d.ellipse([W / 2 - 90 * k, 760 - 90 * k, W / 2 + 90 * k, 760 + 90 * k], fill=PURPLE + (200,))
    put(img, "¿Cómo viaja una", W / 2, 1220, 64, WHITE, F_BLACK, a=lin((t - 0.3) / 0.3), scale=0.8 + 0.2 * ease((t - 0.3) / 0.4))
    put(img, "proteína en la célula?", W / 2, 1310, 64, WHITE, F_BLACK, a=lin((t - 0.5) / 0.3), scale=0.8 + 0.2 * ease((t - 0.5) / 0.4))
    sc = ease((t - 1.3) / 0.4)
    put(img, "CITOMEMBRANAS", W / 2, 1480, 100, YEL, F_BLACK, a=lin((t - 1.3) / 0.2), scale=max(0.01, 0.5 + 0.5 * sc))
    put(img, "en menos de 1 minuto", W / 2, 1590, 46, GREY, F_MED, a=lin((t - 1.8) / 0.3))
    return img


def s_sistema(t):
    img = bg("sis", (15, 20, 60), (40, 15, 70))
    particles(img, t)
    header(img, t, "1 · ¿QUÉ ES?", "Sistema de\ncitomembranas", CYAN)
    put(img, "Red de membranas internas que", W / 2, 470, 44, GREY, F_MED, a=lin((t - 0.4) / 0.3))
    put(img, "se comunican mediante vesículas", W / 2, 528, 44, GREY, F_MED, a=lin((t - 0.5) / 0.3))
    items = [("Retículo Endoplasmático Rugoso", "RER", PINK), ("Retículo Endoplasmático Liso", "REL", CYAN),
             ("Complejo de Golgi", "CG", GREEN), ("Lisosomas", "LIS", ORANGE), ("Peroxisomas", "PER", PURPLE)]
    d = ImageDraw.Draw(img, "RGBA")
    for i, (name, ab, c) in enumerate(items):
        st = 0.9 + i * 0.4
        k = ease((t - st) / 0.35)
        if k <= 0:
            continue
        y = 700 + i * 200
        x = (1 - k) * -700
        d.rounded_rectangle([90 + x, y, 990 + x, y + 160], 40, fill=c + (45,), outline=c + (255,), width=5)
        d.ellipse([120 + x, y + 20, 240 + x, y + 140], fill=c + (255,))
        put(img, ab, 180 + x, y + 80, 38, (20, 20, 40), F_BLACK)
        put(img, name, 275 + x, y + 80, 42, WHITE, F_BOLD, anchor="lm")
    return img


def s_rer(t):
    img = bg("rer", (60, 10, 50), (20, 10, 50))
    particles(img, t, PINK)
    header(img, t, "2 · ESTRUCTURA Y FUNCIÓN", "RER", PINK)
    draw_rer(img, t - 0.2, W / 2, 560, 1.0)
    put(img, "Ribosomas", 840, 340, 36, YEL, F_BOLD, a=lin((t - 1.0) / 0.3))
    card(img, [60, 820, 1020, 1800], PINK, lin((t - 0.6) / 0.3))
    put(img, "Cisternas aplanadas + ribosomas,", W / 2, 880, 40, YEL, F_BOLD, a=lin((t - 0.7) / 0.3))
    put(img, "continuo con la envoltura nuclear", W / 2, 935, 40, YEL, F_BOLD, a=lin((t - 0.8) / 0.3))
    bullets(img, [
        "Sintetiza proteínas de secreción, de membrana y lisosomales",
        "Pliega proteínas y controla su calidad (chaperonas)",
        "Inicia la N-glicosilación (añade azúcares)",
        "Las envía al Golgi en vesículas COPII",
    ], t, 1.3, 1030, gap=0.7, dot=PINK)
    return img


def s_rel(t):
    img = bg("rel", (10, 40, 70), (10, 15, 45))
    particles(img, t, CYAN)
    header(img, t, "3 · ESTRUCTURA Y FUNCIÓN", "REL", CYAN)
    draw_rel(img, t - 0.2, W / 2, 560, 1.0)
    card(img, [60, 820, 1020, 1800], CYAN, lin((t - 0.6) / 0.3))
    put(img, "Túbulos interconectados", W / 2, 880, 40, YEL, F_BOLD, a=lin((t - 0.7) / 0.3))
    put(img, "SIN ribosomas", W / 2, 935, 40, YEL, F_BOLD, a=lin((t - 0.8) / 0.3))
    bullets(img, [
        "Sintetiza lípidos: fosfolípidos, colesterol y hormonas esteroides",
        "Detoxifica fármacos y tóxicos (hígado)",
        "Almacena y libera Ca²⁺ (músculo)",
        "Metabolismo del glucógeno (glucosa-6-fosfatasa)",
        "Lípidos salen por vesículas o proteínas transportadoras",
    ], t, 1.3, 1030, gap=0.6, dot=CYAN)
    return img


def s_golgi(t):
    img = bg("golgi", (10, 50, 30), (10, 20, 40))
    particles(img, t, GREEN)
    header(img, t, "4 · ESTRUCTURA Y FUNCIÓN", "Complejo de Golgi", GREEN)
    draw_golgi(img, t - 0.2, W / 2, 440, 0.85)
    put(img, "cara CIS (entrada)", 230, 560, 34, GREEN, F_BOLD, a=lin((t - 0.9) / 0.3))
    put(img, "cara TRANS (salida)", 840, 800, 34, ORANGE, F_BOLD, a=lin((t - 1.1) / 0.3))
    card(img, [60, 860, 1020, 1800], GREEN, lin((t - 0.6) / 0.3))
    put(img, "Pila de cisternas aplanadas", W / 2, 920, 40, YEL, F_BOLD, a=lin((t - 0.7) / 0.3))
    put(img, "cis → medial → trans → red trans", W / 2, 975, 40, YEL, F_BOLD, a=lin((t - 0.8) / 0.3))
    bullets(img, [
        "Glicosilación de proteínas y lípidos (O-glicosilación y modifica N-glicanos)",
        "Marca enzimas lisosomales con manosa-6-fosfato",
        "Clasifica, empaqueta y envía en vesículas",
    ], t, 1.3, 1070, gap=0.8, dot=GREEN)
    return img


def s_lis_per(t):
    img = bg("lp", (50, 25, 10), (30, 10, 60))
    particles(img, t, ORANGE)
    header(img, t, "BONUS RÁPIDO", "Lisosomas y\nperoxisomas", ORANGE)
    d = ImageDraw.Draw(img, "RGBA")
    for i, (name, c, lines, y0) in enumerate([
        ("LISOSOMAS", ORANGE, ["Hidrolasas ácidas (pH ≈ 5)", "Digestión intracelular", "Vienen del Golgi"], 600),
        ("PEROXISOMAS", PURPLE, ["Oxidan ácidos grasos", "Catalasa degrada H₂O₂", "Detoxificación"], 1180)]):
        k = ease((t - 0.4 - i * 0.6) / 0.4)
        if k <= 0:
            continue
        x = (1 - k) * (900 if i else -900)
        d.rounded_rectangle([70 + x, y0, 1010 + x, y0 + 500], 40, fill=c + (40,), outline=c + (255,), width=5)
        r = 85 + 6 * math.sin(t * 5 + i)
        d.ellipse([200 - r + x, y0 + 250 - r, 200 + r + x, y0 + 250 + r], fill=c + (160,), outline=WHITE + (255,), width=5)
        for j in range(6):
            ang = t * 2 + j
            d.ellipse([200 + x + 45 * math.cos(ang) - 10, y0 + 250 + 45 * math.sin(ang) - 10,
                       200 + x + 45 * math.cos(ang) + 10, y0 + 250 + 45 * math.sin(ang) + 10], fill=WHITE + (220,))
        put(img, name, 340 + x, y0 + 110, 50, c, F_BLACK, anchor="lm")
        for j, ln in enumerate(lines):
            put(img, "• " + ln, 340 + x, y0 + 210 + j * 75, 38, WHITE, F_MED, anchor="lm",
                a=lin((t - 0.8 - i * 0.6 - j * 0.25) / 0.3))
    return img


def s_vesiculas(t):
    img = bg("ves", (20, 20, 70), (10, 40, 60))
    particles(img, t)
    header(img, t, "5 · TRANSPORTE EN VESÍCULAS", "3 tipos de\nvesículas", YEL)
    d = ImageDraw.Draw(img, "RGBA")
    data = [("COPII", GREEN, "copii", "RE  →  Golgi", "Anterógrado (hacia adelante)"),
            ("COPI", CYAN, "copi", "Golgi  →  RE", "Retrógrado (devuelve proteínas)"),
            ("CLATRINA", ORANGE, "clatrina", "Golgi trans → lisosomas", "y endocitosis (membrana → adentro)")]
    for i, (name, c, coat, route, desc) in enumerate(data):
        st = 0.6 + i * 0.9
        k = ease((t - st) / 0.4)
        if k <= 0:
            continue
        y = 640 + i * 400
        d.rounded_rectangle([60, y - 150, 1020, y + 150], 40, fill=c + (35,), outline=c + (int(255 * lin(k)),), width=5)
        draw_vesicle(img, 200, y, 62 * k, c, coat if coat == "clatrina" else "cop", lin(k), spin=t * 1.5)
        put(img, name, 330, y - 80, 54, c, F_BLACK, anchor="lm", a=lin(k))
        put(img, route, 330, y, 42, WHITE, F_BOLD, anchor="lm", a=lin((t - st - 0.2) / 0.3))
        put(img, desc, 330, y + 70, 32, GREY, F_MED, anchor="lm", a=lin((t - st - 0.35) / 0.3))
    return img


def s_via(t):
    img = bg("via", (25, 10, 55), (10, 10, 30))
    particles(img, t, PURPLE)
    header(img, t, "6 · VÍA BIOSINTÉTICA SECRETORIA", "El viaje", PURPLE)
    d = ImageDraw.Draw(img, "RGBA")
    nodes = [("RER", "proteínas + azúcares", PINK, 430),
             ("REL", "lípidos", CYAN, 430),
             ("Golgi CIS", "llegan en vesículas COPII", GREEN, 720),
             ("Golgi MEDIAL / TRANS", "glicosilación (glúcidos)", (200, 220, 100), 950),
             ("Red TRANS-Golgi", "clasificación y empaque", ORANGE, 1180)]
    pos = {}
    for i, (n, desc, c, y) in enumerate(nodes):
        x = 300 if n == "RER" else (780 if n == "REL" else W / 2)
        pos[n] = (x, y)
        k = ease((t - 0.4 - i * 0.35) / 0.35)
        if k <= 0:
            continue
        bw = 210 if n in ("RER", "REL") else 400
        d.rounded_rectangle([x - bw * k, y - 52, x + bw * k, y + 52], 52, fill=c + (70,), outline=c + (255,), width=5)
        put(img, n, x, y - 12, 40, WHITE, F_BLACK, a=lin(k))
        put(img, desc, x, y + 26, 26, GREY, F_MED, a=lin(k))
    outs = [("Secreción constitutiva", 160, GREEN), ("Secreción regulada", W / 2, YEL), ("Lisosomas", 920, ORANGE)]
    for i, (n, x, c) in enumerate(outs):
        k = ease((t - 2.4 - i * 0.2) / 0.35)
        if k <= 0:
            continue
        y = 1480
        arrow(d, (W / 2, 1240), (x, y - 70), c, 7, lin(k))
        r = 60 * k
        d.ellipse([x - r, y - r, x + r, y + r], fill=c + (90,), outline=c + (255,), width=5)
        for j, ln in enumerate(wrap(n, F_BOLD, 32, 300)):
            put(img, ln, x, y + 100 + j * 40, 32, WHITE, F_BOLD, a=lin(k))
    # flechas fijas
    if t > 2.2:
        a = lin((t - 2.2) / 0.3)
        arrow(d, (300, 485), (W / 2 - 60, 665), PINK, 7, a)
        arrow(d, (780, 485), (W / 2 + 60, 665), CYAN, 7, a)
        arrow(d, (W / 2, 775), (W / 2, 895), GREEN, 7, a)
        arrow(d, (W / 2, 1005), (W / 2, 1125), ORANGE, 7, a)
    # vesícula viajera
    if t > 3.0:
        path = [(300, 430), (W / 2, 720), (W / 2, 950), (W / 2, 1180), (W / 2 if int((t - 3) / 2.2) % 3 == 1 else (160 if int((t - 3) / 2.2) % 3 == 0 else 920), 1480)]
        ph = ((t - 3.0) / 2.2) % 1
        seg = min(int(ph * 4), 3)
        f = smooth(ph * 4 - seg)
        (x1, y1), (x2, y2) = path[seg], path[seg + 1]
        vx, vy = x1 + (x2 - x1) * f, y1 + (y2 - y1) * f
        draw_vesicle(img, vx, vy, 26, YEL, "cop", 1.0, spin=t * 3)
    put(img, "Proteína: RER → Golgi → destino", W / 2, 1720, 38, YEL, F_BOLD, a=lin((t - 3.2) / 0.3))
    put(img, "Lípidos: REL  ·  Glúcidos: RER + Golgi", W / 2, 1780, 38, YEL, F_BOLD, a=lin((t - 3.5) / 0.3))
    return img


def s_outro(t):
    img = bg("outro", (40, 10, 80), (10, 30, 70))
    particles(img, t)
    put(img, "RESUMEN", W / 2, 360, 96, YEL, F_BLACK, scale=max(0.01, ease(t / 0.4)))
    rows = [("RER", "fabrica proteínas", PINK), ("REL", "fabrica lípidos", CYAN),
            ("GOLGI", "modifica, empaqueta y envía", GREEN), ("VESÍCULAS", "los transportan", ORANGE)]
    d = ImageDraw.Draw(img, "RGBA")
    for i, (a_, b_, c) in enumerate(rows):
        k = ease((t - 0.4 - i * 0.3) / 0.35)
        if k <= 0:
            continue
        y = 620 + i * 230
        x = (1 - k) * 800
        d.rounded_rectangle([80 + x, y - 90, 1000 + x, y + 90], 45, fill=c + (50,), outline=c + (255,), width=5)
        put(img, a_, 540 + x, y - 32, 56, c, F_BLACK)
        put(img, b_, 540 + x, y + 38, 40, WHITE, F_BOLD)
    put(img, "¡Guárdalo para el examen!", W / 2, 1650, 52, WHITE, F_BLACK, a=lin((t - 1.8) / 0.3),
        scale=1 + 0.04 * math.sin(t * 6))
    return img


SCENES = [(s_intro, 3.0), (s_sistema, 4.6), (s_rer, 5.6), (s_rel, 5.8), (s_golgi, 5.6),
          (s_lis_per, 4.4), (s_vesiculas, 5.6), (s_via, 9.0), (s_outro, 3.8)]


def render_video():
    total = sum(d for _, d in SCENES)
    nframes = int(total * FPS)
    starts, acc = [], 0
    for _, dur in SCENES:
        starts.append(acc)
        acc += dur
    proc = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
         "-r", str(FPS), "-i", "-", "-i", "music.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", OUT],
        stdin=subprocess.PIPE)
    TR = 0.25  # transición (flash + zoom)
    for fi in range(nframes):
        T = fi / FPS
        si = max(i for i, s in enumerate(starts) if s <= T)
        fn, dur = SCENES[si]
        lt = T - starts[si]
        img = fn(lt)
        # barra de progreso
        d = ImageDraw.Draw(img, "RGBA")
        d.rectangle([0, 0, W, 14], fill=(255, 255, 255, 50))
        d.rectangle([0, 0, W * T / total, 14], fill=YEL + (255,))
        frame = img.convert("RGB")
        # zoom de entrada
        if lt < TR and si > 0:
            z = 1.08 - 0.08 * smooth(lt / TR)
            cw, ch = int(W / z), int(H / z)
            frame = frame.crop(((W - cw) // 2, (H - ch) // 2, (W + cw) // 2, (H + ch) // 2)).resize((W, H), Image.BILINEAR)
            fl = 1 - lt / TR
            frame = Image.blend(frame, Image.new("RGB", (W, H), WHITE), 0.5 * fl)
        proc.stdin.write(frame.tobytes())
        if fi % 120 == 0:
            print(f"frame {fi}/{nframes}", flush=True)
    proc.stdin.close()
    proc.wait()
    return starts, total


# ---------- Música sintetizada (beat simple 120 BPM) ----------
def make_music(starts, total, sr=44100):
    n = int(total * sr) + sr
    out = np.zeros(n)
    bpm = 118
    beat = 60 / bpm
    t = np.arange(int(0.35 * sr)) / sr
    kick = np.sin(2 * np.pi * (50 + 120 * np.exp(-t * 30)) * t) * np.exp(-t * 9)
    th = np.arange(int(0.05 * sr)) / sr
    rng = np.random.default_rng(1)
    hat = rng.uniform(-1, 1, len(th)) * np.exp(-th * 80) * 0.25
    ts = np.arange(int(0.2 * sr)) / sr
    snare = rng.uniform(-1, 1, len(ts)) * np.exp(-ts * 22) * 0.45
    chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7], [164.8, 196.0, 246.9]]
    bass = [110.0, 87.3, 98.0, 82.4]
    nb = int(total / beat) + 1

    def add(sig, pos, g=1.0):
        i = int(pos * sr)
        e = min(n, i + len(sig))
        out[i:e] += sig[: e - i] * g

    for b in range(nb):
        pos = b * beat
        add(kick, pos, 0.9)
        if b % 2 == 1:
            add(snare, pos, 0.8)
        add(hat, pos + beat / 2, 0.9)
        bar = (b // 4) % 4
        # bajo
        tb = np.arange(int(beat * 0.9 * sr)) / sr
        bs = np.sign(np.sin(2 * np.pi * bass[bar] * tb)) * 0.12 * np.exp(-tb * 3)
        add(bs, pos)
        # acordes pluck en contratiempo
        tp = np.arange(int(0.3 * sr)) / sr
        pl = sum(np.sin(2 * np.pi * f * 2 * tp) for f in chords[bar]) * np.exp(-tp * 10) * 0.07
        add(pl, pos + beat / 2)
    # whoosh en transiciones
    tw = np.arange(int(0.4 * sr)) / sr
    wh = rng.uniform(-1, 1, len(tw)) * np.sin(np.pi * tw / 0.4) ** 2 * 0.3
    for s in starts[1:]:
        add(wh, max(0, s - 0.2))
    out = out[: int(total * sr)]
    fade = int(0.8 * sr)
    out[-fade:] *= np.linspace(1, 0, fade)
    out = out / np.max(np.abs(out)) * 0.8
    with wave.open("music.wav", "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    total = sum(d for _, d in SCENES)
    starts, acc = [], 0
    for _, dur in SCENES:
        starts.append(acc)
        acc += dur
    if "--preview" in sys.argv:
        for i, (fn, dur) in enumerate(SCENES):
            fn(dur - 0.3).convert("RGB").resize((540, 960)).save(f"prev_{i}.png")
        sys.exit()
    make_music(starts, total)
    render_video()
    print("listo", OUT, total, "s")
