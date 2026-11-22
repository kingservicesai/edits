# Renderiza un video vertical 1080x1920 (9:16) a partir de los paneles de las infografías.
import subprocess, sys, math, wave, struct, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SRC = Path(sys.argv[1])          # carpeta con a.png y b.png (infografías originales)
OUT = Path(sys.argv[2])          # mp4 de salida
W, H, FPS = 1080, 1920, 30
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
F = lambda s: ImageFont.truetype(BOLD, s)

a = Image.open(SRC / "a.png").convert("RGB"); b = Image.open(SRC / "b.png").convert("RGB")
cols = [(4, 506), (517, 1020), (1030, 1532)]; rows = [(4, 300), (310, 568), (580, 802), (816, 1020)]
P = {}; n = 0
for r in rows:
    for c in cols:
        n += 1; P[n] = a.crop((c[0], r[0], c[1], r[1]))
P["u"] = b.crop((517, 695, 1020, 1020))

# (panel, color, encabezado, viñetas, duración)
Y, C, G, V, O = (255, 214, 0), (0, 220, 255), (90, 230, 120), (190, 140, 255), (255, 150, 60)
S = [
 (1, Y, "¿Qué protege a\nTODAS tus células?", ["La membrana plasmática", "En 50 segundos"], 3.0),
 (2, C, "1. Organización", ["Bicapa de lípidos", "Proteínas incrustadas", "Carbohidratos hacia afuera"], 3.8),
 (3, C, "2. Componentes", ["LÍPIDOS: fosfolípidos, esfingolípidos-glicolípidos y colesterol", "CARBOHIDRATOS: glucocáliz", "PROTEÍNAS: integrales, periféricas y ancladas"], 5.0),
 (4, G, "3. Funciones", ["ESTRUCTURA: soporte y forma", "TRANSPORTE: paso selectivo", "Comunicación y reconocimiento"], 4.0),
 (5, O, "4. Transporte\nbaja masa molecular", ["PASIVO (sin ATP): difusión simple y facilitada", "ACTIVO (con ATP): bomba de sodio-potasio y otras bombas"], 4.6),
 (6, O, "4. Transporte\nalta masa molecular", ["ENDOCITOSIS: fagocitosis, pinocitosis y mediada por receptor", "EXOCITOSIS: saca sustancias en vesículas", "TRANSCITOSIS: cruza la célula de lado a lado"], 5.2),
 (7, V, "5. Célula eucariota", ["Membrana plasmática", "Núcleo verdadero", "Organelas membranosas y no membranosas"], 4.0),
 (8, V, "5. Célula procariota", ["Pared celular y cápsula", "Nucleoide (sin núcleo)", "Organelas presentes, flagelos y fimbrias"], 4.2),
 ("u", G, "6. Uniones\nintercelulares", ["OCLUSIVAS: sellan", "ADHERENTES y DESMOSOMAS: anclan", "GAP: comunican"], 4.2),
 (9, G, "6. ¿Cómo se\ncomunican?", ["Uniones intercelulares", "Señales químicas (hormonas)", "Contacto directo"], 3.8),
 (10, G, "6. Tipos de\ncomunicación", ["ENDOCRINA: por la sangre", "PARACRINA: a células vecinas", "AUTOCRINA: sobre sí misma"], 4.0),
 (11, C, "6. Receptores", ["Captan el ligando (señal)", "Activan una respuesta celular"], 3.4),
 (12, Y, "En resumen", ["Organiza. Transporta. Comunica.", "¡Guárdalo para tu examen!"], 3.6),
]

# Fondo fijo
bg = Image.new("RGB", (W, H))
d = ImageDraw.Draw(bg)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=(int(8 + 20 * t), int(18 + 30 * t), int(60 + 70 * (1 - abs(t - .5) * 2))))
rnd = random.Random(3)
for _ in range(40):
    x, y, r = rnd.randint(0, W), rnd.randint(0, H), rnd.randint(4, 18)
    d.ellipse([x - r, y - r, x + r, y + r], fill=(60, 110, 200))
bg = bg.filter(ImageFilter.GaussianBlur(6))
ImageDraw.Draw(bg).text((W // 2, H - 70), "Membrana plasmática · Biología celular", font=F(30), fill=(150, 180, 230), anchor="mm")

PW = 1040
def prep(img):
    h = int(img.height * PW / img.width)
    im = img.resize((PW * 2, h * 2), Image.LANCZOS)   # margen para el zoom
    return im
PANELS = {k: prep(v) for k, v in P.items()}
mask_cache = {}
def rmask(w, h):
    if (w, h) not in mask_cache:
        m = Image.new("L", (w, h), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], 36, fill=255)
        mask_cache[(w, h)] = m
    return mask_cache[(w, h)]

def ease(t): t = max(0, min(1, t)); return 1 - (1 - t) ** 3
def back(t):
    t = max(0, min(1, t)); c = 1.7; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2

def wrap(text, font, maxw, dr):
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        tst = (cur + " " + w_).strip()
        if dr.textlength(tst, font=font) <= maxw: cur = tst
        else: lines.append(cur); cur = w_
    lines.append(cur); return lines

total = sum(s[4] for s in S)
events = []  # (tiempo, tipo) para el audio
ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                       "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-pix_fmt", "yuv420p", str(OUT) + ".noaudio.mp4"],
                      stdin=subprocess.PIPE)
fb, fh = F(52), F(78)
t0 = 0.0
for si, (pk, col, head, bullets, dur) in enumerate(S):
    events.append((t0, "whoosh"))
    for i in range(len(bullets)): events.append((t0 + 0.55 + i * 0.35, "pop"))
    pan = PANELS[pk]; ph = pan.height // 2
    _d = ImageDraw.Draw(bg)
    bl_h = sum(len(wrap(x, fb, W - 220, _d)) * 64 + 40 + 24 for x in bullets)
    nh = len(head.split("\n"))
    blk = nh * 92 + 50 + ph + 60 + bl_h
    top = max(130, (H - 120 - blk) // 2 + 40)
    nf = int(dur * FPS)
    for f in range(nf):
        t = f / FPS; g = (t0 + t) / total
        fr = bg.copy(); dr = ImageDraw.Draw(fr)
        # barra de progreso
        dr.rounded_rectangle([60, 70, W - 60, 82], 6, fill=(40, 60, 110))
        dr.rounded_rectangle([60, 70, 60 + int((W - 120) * g), 82], 6, fill=col)
        # encabezado con pop
        s = back(t / 0.35)
        fs = max(10, int(78 * s))
        hl = head.split("\n"); ytop = top + 46
        for li, ln in enumerate(hl):
            dr.text((W // 2 + 4, ytop + li * 92 + 4), ln, font=F(fs), fill=(0, 0, 0), anchor="mm")
            dr.text((W // 2, ytop + li * 92), ln, font=F(fs), fill=col if li == 0 else (255, 255, 255), anchor="mm")
        # panel: entra deslizando + zoom lento (Ken Burns)
        z = 1.0 + 0.10 * (t / dur)
        cw, ch = int(pan.width / z), int(pan.height / z)
        cx, cy = (pan.width - cw) // 2, (pan.height - ch) // 2
        crop = pan.crop((cx, cy, cx + cw, cy + ch)).resize((PW, ph), Image.BILINEAR)
        px = (W - PW) // 2 + int((1 - ease(t / 0.4)) * W)
        py = top + nh * 92 + 30
        dr.rounded_rectangle([px - 8, py - 8, px + PW + 8, py + ph + 8], 42, fill=col)
        fr.paste(crop, (px, py), rmask(PW, ph))
        # viñetas escalonadas
        y = py + ph + 60
        for i, txt in enumerate(bullets):
            k = ease((t - 0.55 - i * 0.35) / 0.3)
            if k <= 0: break
            lines = wrap(txt, fb, W - 220, dr)
            bh = len(lines) * 64 + 40
            off = int((1 - k) * -300)
            card = Image.new("RGBA", (W - 120, bh), (255, 255, 255, 0))
            cd = ImageDraw.Draw(card)
            cd.rounded_rectangle([0, 0, W - 121, bh - 1], 26, fill=(255, 255, 255, int(235 * k)))
            cd.rounded_rectangle([0, 0, 16, bh - 1], 8, fill=col + (255,))
            for li, ln in enumerate(lines):
                cd.text((44, 20 + li * 64), ln, font=fb, fill=(15, 25, 60, int(255 * k)))
            fr.paste(card, (60 + off, y), card)
            y += bh + 24
        ff.stdin.write(fr.tobytes())
    t0 += dur
ff.stdin.close(); ff.wait()

# Audio simple: whoosh al cambiar de escena, pop por viñeta
SR = 44100; N = int(total * SR); buf = [0.0] * N
def add(start, samples):
    s = int(start * SR)
    for i, v in enumerate(samples):
        if s + i < N: buf[s + i] += v
rng = random.Random(1)
whoosh = [rng.uniform(-1, 1) * math.sin(math.pi * i / 9000) * 0.18 for i in range(9000)]
lp = 0; ws = []
for v in whoosh: lp = lp * 0.85 + v * 0.15; ws.append(lp * 3)
pop = [math.sin(2 * math.pi * (900 - i * 0.12) * i / SR) * math.exp(-i / 900) * 0.35 for i in range(4000)]
for tt, kind in events: add(tt, ws if kind == "whoosh" else pop)
with wave.open(str(OUT) + ".wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v)) * 32000)) for v in buf))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(OUT) + ".noaudio.mp4", "-i", str(OUT) + ".wav",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", str(OUT)], check=True)
Path(str(OUT) + ".noaudio.mp4").unlink(); Path(str(OUT) + ".wav").unlink()
print("ok", total, "s")
