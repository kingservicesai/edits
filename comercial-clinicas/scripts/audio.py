"""Banda sonora y diseño sonoro sintetizados, sincronizados con src/timing.ts.

Uso: python3 scripts/audio.py public/banda-sonora.wav
Genera música + efectos pensados para ir DEBAJO de una locución.
"""
import sys
import numpy as np

SR = 48000
FPS = 30
SCENES = [270, 255, 300, 210, 300, 435, 225, 900, 315, 450]
START = np.cumsum([0] + SCENES)  # en fotogramas
TOTAL = START[-1] / FPS
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)
RVB_L = np.zeros(N)  # envío a reverb
RVB_R = np.zeros(N)


def sc(i, frame=0):
    """segundos de un fotograma dentro de la escena i (1-indexada)."""
    return (START[i - 1] + frame) / FPS


def t_arr(dur):
    return np.arange(int(dur * SR)) / SR


def add(sig, at, gain=1.0, pan=0.0, send=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl = gain * np.sqrt(0.5 * (1 - pan))
    gr = gain * np.sqrt(0.5 * (1 + pan))
    L[i : i + len(sig)] += sig * gl
    R[i : i + len(sig)] += sig * gr
    if send:
        RVB_L[i : i + len(sig)] += sig * gl * send
        RVB_R[i : i + len(sig)] += sig * gr * send


def fft_filter(x, lo=None, hi=None):
    n = len(x)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(fr)
    if hi:
        g *= 1 / np.sqrt(1 + (fr / hi) ** 4)
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(fr, 1e-3)) ** 4)
    return np.fft.irfft(X * g, n)


def env(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-curve * np.maximum(0, t - a) / max(d, 1e-4))
    return e


def fade(n, fi, fo):
    e = np.ones(n)
    a = int(fi * SR)
    b = int(fo * SR)
    if a:
        e[:a] = np.linspace(0, 1, a) ** 2
    if b:
        e[-b:] *= np.linspace(1, 0, b) ** 2
    return e


def note(f):
    return 440.0 * 2 ** ((f - 69) / 12)


# ------------------------------------------------------------------ sonidos
def impact(dur=3.0, f0=90, f1=32, noise=0.6, bright=2500):
    t = t_arr(dur)
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 9)) / SR
    body = np.sin(ph) * np.exp(-t * 1.6)
    nz = fft_filter(rng.standard_normal(len(t)), hi=bright) * np.exp(-t * 7) * noise
    return np.tanh((body + nz) * 1.4)


def kick():
    t = t_arr(0.5)
    ph = 2 * np.pi * np.cumsum(45 + 110 * np.exp(-t * 30)) / SR
    return np.sin(ph) * np.exp(-t * 9)


def tom(f=110):
    t = t_arr(0.7)
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 18))) / SR
    return np.sin(ph) * np.exp(-t * 6) + fft_filter(rng.standard_normal(len(t)), hi=1800) * np.exp(-t * 25) * 0.3


def tick(f=4200):
    t = t_arr(0.04)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 160)


def blip(f=1320):
    t = t_arr(0.18)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 22)


def whoosh(dur=0.9, lo=300, hi=6000, rev=False):
    n = int(dur * SR)
    nz = rng.standard_normal(n)
    parts = []
    bands = np.geomspace(lo, hi, 6)
    w = np.zeros(n)
    seg = n // 6
    for k, b in enumerate(bands):
        f = fft_filter(nz, lo=b * 0.6, hi=b * 1.6)
        win = np.exp(-(((np.arange(n) - (k + 0.5) * seg) / (seg * 0.9)) ** 2))
        w += f * win
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    out = w * e
    return out[::-1] if rev else out


def riser(dur=2.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = fft_filter(rng.standard_normal(n), lo=800, hi=9000)
    f = 200 * 2 ** (t / dur * 3)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    e = (t / dur) ** 2.5
    return (nz * 0.7 + tone) * e


def heartbeat():
    t = t_arr(0.6)
    th = lambda: np.sin(2 * np.pi * 55 * t) * np.exp(-t * 18)
    a = th()
    b = np.zeros_like(a)
    k = int(0.22 * SR)
    b[k:] = a[: len(a) - k] * 0.7
    return a + b


def pad(midis, dur, bright=1800, detune=0.12):
    """Pad de sierras desafinadas por síntesis aditiva."""
    t = t_arr(dur)
    out = np.zeros(len(t))
    for m in midis:
        f = note(m)
        for d in (-detune, 0, detune):
            ff = f * 2 ** (d / 12)
            for h in range(1, 14):
                if ff * h > 12000:
                    break
                amp = (1 / h) * np.exp(-(ff * h) / bright)
                out += amp * np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28))
    out /= max(1e-9, np.abs(out).max())
    return out


def pluck_bass(m, dur=0.32):
    t = t_arr(dur)
    f = note(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3 * f * t)
    return s * env(len(t), 0.004, dur * 0.5, 3)


# ------------------------------------------------------------------ partitura
T5 = sc(5)  # 34.5 s: cambio de energía

# Dron grave de tensión: 0 – fin escena 4
d_end = sc(5) - 0.05
t = t_arr(d_end)
lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t)
drone = (np.sin(2 * np.pi * 55 * t) + 0.6 * np.sin(2 * np.pi * 82.4 * t + 1) + 0.3 * np.sin(2 * np.pi * 110.3 * t)) * lfo
rumble = fft_filter(rng.standard_normal(len(t)), hi=140) * 3
build = np.interp(t, [0, 2, 9, 17, 27, d_end], [0, 0.55, 0.7, 0.8, 0.6, 0.75])
dr = (drone * 0.22 + rumble * 0.1) * build * fade(len(t), 1.5, 0.02)
add(dr, 0.0, 0.9)

# Apertura: golpe grave en negro
add(impact(4.0, 70, 28, 0.4, 900), 0.2, 0.8, send=0.5)
add(whoosh(1.4, 120, 2500), 0.4, 0.25, pan=-0.3)

# Escena 1: latido + tic del reloj + notificaciones que se apagan
for k in range(9):
    add(heartbeat(), 1.0 + k * 1.0, 0.35)
for k in range(12):
    add(tick(3200), sc(1, 176) + k * 0.1, 0.12, pan=0.2)
add(blip(1480), sc(1, 208), 0.18, pan=-0.2, send=0.4)
add(blip(1320), sc(1, 216), 0.15, pan=0.2, send=0.4)
add(whoosh(0.6, 2000, 9000, rev=True), sc(1, 226), 0.12)
add(impact(2.5, 110, 40, 0.5, 3000), sc(1, 228), 0.45, send=0.4)

# Escena 2: pulsos digitales a 100 bpm, cortes con whoosh
beat = 60 / 100
for k in range(int((sc(3) - sc(2)) / (beat / 2))):
    tt = sc(2) + k * beat / 2
    add(tick(5200 if k % 2 else 3600), tt, 0.10 if k % 2 else 0.14, pan=0.25 if k % 2 else -0.25)
    if k % 2 == 0:
        add(heartbeat(), tt, 0.22)
for fr in (42, 76, 110):
    add(whoosh(0.5, 400, 7000), sc(2, fr) - 0.25, 0.18, pan=np.sign(fr - 80) * 0.4)
# corte abrupto al teléfono
add(impact(1.6, 160, 50, 1.0, 6000), sc(2, 152), 0.5, send=0.3)
add(impact(3.0, 80, 30, 0.3, 1200), sc(2, 180), 0.6, send=0.5)  # "0"

# Escena 3: ritmo acelerado + glitches del trend
beat = 60 / 128
k = 0
while sc(3) + k * beat / 2 < sc(3, 150) / 1:
    tt = sc(3) + k * beat / 2
    add(tick(6000), tt, 0.1, pan=(-1) ** k * 0.3)
    if k % 2 == 0:
        add(kick(), tt, 0.35)
    k += 1
for fr in range(0, 120, 9):
    g = fft_filter(rng.standard_normal(int(0.06 * SR)), lo=800, hi=7000) * np.hanning(int(0.06 * SR))
    add(g, sc(3, fr), 0.16, pan=rng.uniform(-0.6, 0.6))
add(whoosh(0.7, 300, 8000), sc(3, 118) - 0.3, 0.25)
add(impact(2.5, 100, 35, 0.6, 2500), sc(3, 154), 0.6, send=0.5)  # NO NECESITAS HACER CIRCO
add(riser(1.6), sc(3, 214) - 1.6, 0.22)
add(impact(3.5, 70, 30, 0.4, 1500), sc(3, 214), 0.7, send=0.7)  # AUTORIDAD

# Escena 4: pad frío y disminuido
p4 = pad([45, 57, 60, 64], sc(5) - sc(4), bright=900) * fade(int((sc(5) - sc(4)) * SR), 1.0, 0.05)
add(p4, sc(4), 0.16, send=0.6)
add(impact(3.0, 90, 30, 0.4, 1500), sc(4, 138), 0.55, send=0.6)  # TU REPUTACIÓN NO ES UN TREND

# Escena 5 en adelante: progresión épica minimalista (90 bpm, La menor)
BPM = 90
beat = 60 / BPM
bar = 4 * beat
prog = [
    [45, 57, 60, 64],  # Am
    [41, 57, 60, 65],  # F
    [48, 55, 60, 64],  # C
    [43, 55, 59, 62],  # G
]
bass_root = [33, 29, 36, 31]
music_start = sc(5, 46)  # tras encender las luces del estudio
music_end = sc(10, 252)  # pausa antes del impacto final
# encendido de luces del estudio
for fr in (14, 28, 42):
    add(impact(0.8, 220, 90, 1.2, 5000), sc(5, fr), 0.32, send=0.5)
nbars = int(np.ceil((music_end - music_start) / bar))
for b in range(nbars):
    t0 = music_start + b * bar
    chord = prog[b % 4]
    intensity = np.interp(t0, [music_start, sc(6), sc(7), sc(8), sc(9), sc(10), music_end], [0.45, 0.6, 0.75, 0.85, 1.0, 0.8, 0.8])
    p = pad(chord, bar + 1.2, bright=900 + 1600 * intensity)
    p *= fade(len(p), 0.25, 1.0)
    add(p, t0, 0.13 + 0.07 * intensity, send=0.5)
    # ostinato de bajo en corcheas a partir de la entrevista
    if t0 >= sc(5, 110):
        for e in range(8):
            add(pluck_bass(bass_root[b % 4] + (12 if e % 4 == 3 else 0)), t0 + e * beat / 2, 0.10 + 0.08 * intensity)
    # pulso de bombo desde la escena 6, toms en la 7
    if t0 >= sc(6):
        for q in range(4):
            add(kick(), t0 + q * beat, 0.28 + 0.2 * intensity)
    if sc(7) <= t0 < sc(8):
        add(tom(95), t0 + 3.5 * beat, 0.3, send=0.3)
        add(tom(80), t0 + 3.75 * beat, 0.3, send=0.3)
    # arpegio alto (cristal) en escenas 6 y 9
    if sc(6, 150) <= t0 < sc(7) or sc(9) <= t0 < sc(10):
        for e in range(8):
            m = chord[1 + e % 3] + 24
            tt = t_arr(0.5)
            s = np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * 7)
            add(s, t0 + e * beat / 2, 0.05, pan=(-1) ** e * 0.5, send=0.8)

# Escena 5: palabras sincronizadas
for fr in (196, 234, 266):
    add(impact(1.6, 130, 45, 0.5, 3000), sc(5, fr), 0.32, send=0.5)

# Escena 6: núcleo magnético (barrido) y distribución
add(riser(2.0), sc(6, 150) - 0.6, 0.12)
add(whoosh(1.2, 200, 6000), sc(6, 296), 0.2)
for k in range(6):
    add(blip(1760 + k * 110), sc(6, 300 + k * 3), 0.07, pan=-0.6 + k * 0.24, send=0.6)

# Escena 7: compuertas que se abren
for fr in (92, 132, 172):
    add(whoosh(0.8, 200, 3000), sc(7, fr) - 0.1, 0.22, pan=-0.3)
    add(impact(1.8, 120, 40, 0.5, 2500), sc(7, fr - 4), 0.38, send=0.4)
add(riser(1.8), sc(8) - 1.8, 0.2)

# Escena 8: casos — impactos sincronizados con las cifras
add(impact(3.5, 80, 30, 0.5, 2000), sc(8, 10), 0.7, send=0.6)  # ESTO NO ES TEORÍA
INTRO, CASE = 104, 199
for i in range(4):
    c0 = INTRO + i * CASE
    add(whoosh(0.7, 300, 9000), sc(8, c0) - 0.35, 0.3, pan=0.4)
    add(impact(1.4, 150, 50, 0.6, 4000), sc(8, c0), 0.32)
# Kingphone: 7 y 150+
add(impact(1.6, 120, 40, 0.5, 3000), sc(8, INTRO + 50), 0.4, send=0.3)
for k in range(10):
    add(tick(3000 + k * 250), sc(8, INTRO + 92) + k * 0.15, 0.08)
add(impact(3.0, 90, 30, 0.6, 3000), sc(8, INTRO + 140), 0.7, send=0.6)
# Bogo: lleno, meses, agotado
add(riser(1.6), sc(8, INTRO + CASE + 58) - 0.4, 0.15)
add(impact(2.2, 110, 35, 0.5, 2500), sc(8, INTRO + CASE + 60), 0.5, send=0.4)
add(impact(1.6, 130, 45, 0.5, 3000), sc(8, INTRO + CASE + 142), 0.4, send=0.4)
add(impact(2.4, 90, 30, 0.6, 2500), sc(8, INTRO + CASE + 162), 0.6, send=0.5)
# GSM: 17 días, 263, +426 %
g0 = INTRO + 2 * CASE
add(impact(1.6, 130, 45, 0.5, 3000), sc(8, g0 + 24), 0.4, send=0.3)
for k in range(16):
    add(tick(2600 + k * 180), sc(8, g0 + 60) + k * 0.165, 0.07)
add(impact(2.2, 100, 35, 0.6, 3000), sc(8, g0 + 140), 0.55, send=0.4)
add(impact(3.2, 80, 28, 0.6, 2500), sc(8, g0 + 176), 0.75, send=0.6)
# Rodacentro: contador de vistas
r0 = INTRO + 3 * CASE
add(whoosh(1.4, 100, 1500), sc(8, r0 + 4), 0.25)  # giro del neumático
for k in range(20):
    add(tick(3000 + k * 140), sc(8, r0 + 64) + k * 0.11, 0.06)
add(impact(3.0, 85, 30, 0.6, 3000), sc(8, r0 + 134), 0.7, send=0.6)
add(impact(1.6, 130, 45, 0.5, 3000), sc(8, r0 + 146), 0.35, send=0.3)

# Escena 9: escala
add(riser(2.4), sc(9, 66) - 2.4, 0.28)
add(impact(5.0, 70, 26, 0.7, 2500), sc(9, 66), 0.95, send=0.8)
add(impact(4.0, 60, 25, 0.5, 2000), sc(9, 150), 0.8, send=0.8)
add(impact(2.0, 120, 40, 0.5, 3000), sc(9, 190), 0.4, send=0.5)

# Escena 10: resolución y cierre
add(whoosh(1.0, 200, 4000), sc(10, 146) - 0.3, 0.2)
add(whoosh(0.8, 300, 6000), sc(10, 268) - 0.3, 0.22)
add(impact(2.4, 110, 40, 0.4, 2000), sc(10, 276), 0.4, send=0.6)  # TU EXCELENCIA...
# pausa musical → impacto final con el 2026
add(riser(1.4), sc(10, 328) - 1.4, 0.18)
add(impact(7.0, 65, 24, 0.8, 3500), sc(10, 328), 1.0, send=1.0)
fin = pad([36, 48, 55, 60, 64], 5.5, bright=1400) * fade(int(5.5 * SR), 0.6, 2.5)
add(fin, sc(10, 330), 0.16, send=0.7)

# ------------------------------------------------------------------ reverb
ir_len = int(2.8 * SR)
tt = np.arange(ir_len) / SR
ir_l = rng.standard_normal(ir_len) * np.exp(-tt * 2.4)
ir_r = rng.standard_normal(ir_len) * np.exp(-tt * 2.4)
ir_l = fft_filter(ir_l, lo=150, hi=6000)
ir_r = fft_filter(ir_r, lo=150, hi=6000)
n_fft = 1 << int(np.ceil(np.log2(N + ir_len)))
wet_l = np.fft.irfft(np.fft.rfft(RVB_L, n_fft) * np.fft.rfft(ir_l, n_fft), n_fft)[:N]
wet_r = np.fft.irfft(np.fft.rfft(RVB_R, n_fft) * np.fft.rfft(ir_r, n_fft), n_fft)[:N]
wet_l /= np.abs(ir_l).sum() / 40
wet_r /= np.abs(ir_r).sum() / 40
L += wet_l * 0.5
R += wet_r * 0.5

# limpieza de subgraves y saturación suave
L = fft_filter(L, lo=25)
R = fft_filter(R, lo=25)
out = np.stack([L, R], axis=1)[: int(TOTAL * SR)]
out = out / np.abs(out).max() * 0.95
out = np.tanh(out * 1.3) / np.tanh(1.3)
out = out / np.abs(out).max() * 0.89

import wave

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype("<i2").tobytes())
print("ok", TOTAL, "s")
