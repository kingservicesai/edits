import sys,json; sys.path.insert(0,'/home/user/lemomo-ai/lemo-opuscar')
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit, whoosh, click, thump, noise, hp, lp, bp, env_exp, t_, norm
T=json.load(open('timeline.json')); K=json.load(open('cues.json')); DUR=T['total']; N=int(DUR*SR)+SR//10
# ---- voice: assemble shots with 10 ms fades
v,_=sf.read('voice_src.wav',dtype='float32'); voice=np.zeros((N,2),np.float32); X=int(.01*SR)
for r in T['shots']:
    x=v[int(r['i']*SR):int(r['o']*SR)].copy(); f=np.linspace(0,1,X)[:,None]; x[:X]*=f; x[-X:]*=f[::-1]
    s=int(r['t0']*SR); voice[s:s+len(x)]+=x[:N-s]
# ---- music: 84 BPM, Bm G D A, piano arpeggios + sine pad; sub + soft kick from the cases
BPM=84; beat=60/BPM; bar=4*beat
prog=[('B1','B3',['B3','D4','F#4','B4']),('G1','G3',['G3','B3','D4','G4']),('D2','D3',['A3','D4','F#4','A4']),('A1','A3',['A3','C#4','E4','A4'])]
ev=[]; tb=0.0; b=0
while tb<DUR+bar:
    sub,root,ch=prog[b%4]
    for i in range(8):                       # 8th-note arpeggio
        n=ch[[0,1,2,3,2,1,2,3][i]]; vel=.32+.08*(i==0)
        ev.append((tb+i*beat/2,'piano',n,beat*1.6,vel,-.15+.1*(i%3)))
    ev.append((tb,'piano',root,bar*1.05,.38,0))
    tb+=bar; b+=1
mus=S.render(ev,dur=DUR+.1)
mus=mus[:N] if len(mus)>=N else np.pad(mus,((0,N-len(mus)),(0,0)))
mus=S.room(mus,size=.55,mix=.22)[:N]
# sine pad (soft) + sub & kick from the first case card
pad=np.zeros((N,2),np.float32); tb=0.0; b=0; tcase=K['conesto']-.2
def hzp(p): return 440*2**((S.midi(p)-69)/12)
while tb<DUR:
    sub,root,ch=prog[b%4]; d=bar; tt=np.arange(int(d*SR))/SR; env=np.minimum(1,tt/.6)*np.minimum(1,(d-tt)/.6)
    tone=sum(np.sin(2*np.pi*hzp(n)*tt)*a for n,a in zip(ch[:3],[.5,.35,.3]))*env*.06
    add(pad,tone,tb,1.0,0)
    if tb>=tcase-.01:
        add(pad,np.sin(2*np.pi*hzp(sub)*tt)*env*.22,tb,1.0,0)
        for q in range(4):
            k=thump(1,52)*.55; add(pad,k,tb+q*beat,.55 if q in (0,2) else .3,0)
            hh=hp(noise(.05),7000)*env_exp(.05,.01); add(pad,hh,tb+q*beat+beat/2,.05,.3)
    tb+=bar; b+=1
music=mus*.9+pad
fe=int(1.2*SR); music[-fe:]*=np.linspace(1,0,fe)[:,None]
# duck music under the voice
e=np.abs(voice).mean(1); from scipy.ndimage import uniform_filter1d; e=uniform_filter1d(e,int(.2*SR)); e/=e.max()+1e-9
music*= (1-.45*np.clip(e*3,0,1))[:,None]
# ---- sfx
fx=np.zeros((N,2),np.float32)
def shimmer(d=.8):
    tt=t_(d); x=hp(noise(d),5000)*np.sin(np.pi*tt/d)**2; return norm(x)
for t in [K['conesto']-.35,K['aumento']-.35,K['nueva']-.35,K['muchos']-.4]: add(fx,whoosh(.4),t,.5,0)
for t in [K['cambiar'],K['cien'],K['y2026']]: add(fx,shimmer(),t-.1,.35,0)
for t in [K['error'],K['cero']]: add(fx,thump(1,46),t+1/30,.6,0)
for t0,steps in [(K['c150']-.05,4),(K['c263']-.05,3),(K['c300']-.1,4)]:
    for i in range(steps): add(fx,click(1.4+i*.06),t0+i*.22+1/30,.18,0)
for t in [K['especialistas'],K['tecnologia'],K['experiencia'],K['seguridad'],K['agenda'],K['crec'],K['comenta']]: add(fx,click(.9),t-.08,.12,0)
def rms(x): return np.sqrt(np.mean(x**2))+1e-9
mix=voice + music*(rms(voice)/rms(music))*.16 + fx*(rms(voice)/rms(fx[fx!=0]))*.35
sf.write('mix.wav',np.stack([limit(mix[:,0],.95),limit(mix[:,1],.95)],1),SR)
print('ok', round(DUR,2))
print('\n'.join(S.credits(['piano'])))
