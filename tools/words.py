#!/usr/bin/env python3
"""Word-level timestamps with Parakeet TDT v3 (multilingual). Usage: words.py in.wav out.json
Splits audio into VAD chunks (<=20 s), returns [{id,text,start,end}]."""
import sys, json, numpy as np, soundfile as sf, sherpa_onnx
M="/home/user/tools/whisper-models"; P=f"{M}/dl/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8"
rec=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{P}/encoder.int8.onnx",decoder=f"{P}/decoder.int8.onnx",
    joiner=f"{P}/joiner.int8.onnx",tokens=f"{P}/tokens.txt",model_type="nemo_transducer",num_threads=4)
a,sr=sf.read(sys.argv[1],dtype="float32"); assert sr==16000
# chunk at <=20 s, cutting at the quietest 100ms window near the limit
chunks=[];s=0;N=len(a)
while s<N:
    e=min(N,s+20*sr)
    if e<N:
        lo=s+12*sr; win=1600; best=e; bv=1e9
        for k in range(lo,e-win,400):
            v=float(np.sqrt(np.mean(a[k:k+win]**2)))
            if v<bv: bv=v; best=k+win//2
        e=best
    chunks.append((s,e)); s=e
words=[]
for s,e in chunks:
    st=rec.create_stream(); st.accept_waveform(sr,a[s:e]); rec.decode_stream(st); r=st.result
    toks,ts=r.tokens,r.timestamps; off=s/sr; cur=None
    for i,(tk,t) in enumerate(zip(toks,ts)):
        if tk.startswith(" ") or tk.startswith("▁") or cur is None:
            if cur: words.append(cur)
            cur={"text":tk.lstrip(" ▁"),"start":round(off+t,3)}
        else: cur["text"]+=tk
        cur["end"]=round(off+(ts[i+1] if i+1<len(ts) else t+0.25),3)
    if cur: words.append(cur)
words=[w for w in words if w["text"].strip()]
for i,w in enumerate(words): w["id"]=f"w{i}"
json.dump(words,open(sys.argv[2],"w"),ensure_ascii=False,indent=0)
print(" ".join(f'{w["text"]}[{w["start"]:.2f}]' for w in words))
