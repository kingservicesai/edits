import sys,json; sys.path.insert(0,'/home/user/lemomo-ai/lemo-opuscar')
import numpy as np, soundfile as sf
from core.audio.sfx import SR, add, limit, whoosh, pop, click
TL=json.load(open('timeline.json')); C=TL['cues']; N=int(TL['total']*SR)+SR//10
out=np.zeros((N,2),np.float32); XF=int(.015*SR)
for c,i,o,t0 in TL['audio']:
    a,_=sf.read(f'a_{c}.wav',dtype='float32'); x=a[int(i*SR):int(o*SR)].copy()
    r=np.linspace(0,1,XF)[:,None]; x[:XF]*=r; x[-XF:]*=r[::-1]
    s=int(t0*SR); out[s:s+len(x)]+=x[:N-s]
fx=np.zeros_like(out)
add(fx,whoosh(.45),C['iph']-.35,.5,-.2)
for k,t in enumerate([C['wa'],C['co'],C['fo']]): add(fx,pop(),t-.1+1/30,.35,(k-1)*.3)
for k,t in enumerate([C['c2'],C['f2'],C['cv'],C['vi']]): add(fx,click(1.3+k*.05),t+1/30,.35,(k%2-.5)*.4)
add(fx,whoosh(.35),C['deuna']-.2,.4,.2); add(fx,pop(),C['deuna']+.05,.4)
for t in [C['d449'],C['p1499b'],C['p1050'],C['r449']]: add(fx,whoosh(.25),t-.25,.18,0)
v=np.sqrt(np.mean(out**2)); f=np.sqrt(np.mean(fx[fx!=0]**2)) if np.any(fx) else 1
mix=out+fx*(v/f)*.55
sf.write('mix.wav',np.stack([limit(mix[:,0],.95),limit(mix[:,1],.95)],1),SR); print('ok')
