#!/usr/bin/env python3
"""Transcribe a video/audio file to timestamped segments (JSON + SRT).
Usage: /home/user/tools/whisper-venv/bin/python /home/user/tools/transcribe.py INPUT [--lang es] [--out PREFIX]
Uses sherpa-onnx Whisper (small, multilingual) + Silero VAD. Timestamps = VAD segment bounds."""
import sys, json, subprocess, argparse, tempfile, os
import numpy as np, soundfile as sf, sherpa_onnx
M = "/home/user/tools/whisper-models"
ap = argparse.ArgumentParser()
ap.add_argument("input"); ap.add_argument("--lang", default="es"); ap.add_argument("--out")
a = ap.parse_args()
out = a.out or os.path.splitext(a.input)[0]
with tempfile.TemporaryDirectory() as d:
    wav = os.path.join(d, "a.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.input, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
    audio, sr = sf.read(wav, dtype="float32")
P = f"{M}/dl/sherpa-onnx-whisper-small/small"
rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=P+"-encoder.int8.onnx", decoder=P+"-decoder.int8.onnx", tokens=P+"-tokens.txt",
    language=a.lang, task="transcribe", num_threads=4)
vc = sherpa_onnx.VadModelConfig()
vc.silero_vad.model = f"{M}/silero_vad.onnx"; vc.silero_vad.max_speech_duration = 8
vc.silero_vad.min_silence_duration = 0.2; vc.sample_rate = 16000
vad = sherpa_onnx.VoiceActivityDetector(vc, buffer_size_in_seconds=60)
segs = []
def drain():
    while not vad.empty():
        s = vad.front; st = s.start / 16000; samples = np.array(s.samples, dtype=np.float32)
        stream = rec.create_stream(); stream.accept_waveform(16000, samples); rec.decode_stream(stream)
        t = stream.result.text.strip()
        if t: segs.append({"start": round(st, 2), "end": round(st + len(samples)/16000, 2), "text": t})
        vad.pop()
w = vc.silero_vad.window_size
for i in range(0, len(audio), w):
    vad.accept_waveform(audio[i:i+w]); drain()
vad.flush(); drain()
json.dump(segs, open(out + ".json", "w"), ensure_ascii=False, indent=1)
ts = lambda x: "%02d:%02d:%02d,%03d" % (x//3600, x%3600//60, x%60, round((x%1)*1000))
open(out + ".srt", "w").write("".join(f"{n}\n{ts(s['start'])} --> {ts(s['end'])}\n{s['text']}\n\n" for n, s in enumerate(segs, 1)))
for s in segs: print(f"[{s['start']:7.2f}-{s['end']:7.2f}] {s['text']}")
