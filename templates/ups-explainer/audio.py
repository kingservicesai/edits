import sys; sys.path.insert(0,'/home/user/lemomo-ai/lemo-opuscar')
import numpy as np, soundfile as sf
from core.audio.sfx import SR, add, limit, whoosh, pop, thump, click, clack, ignite, rumble, noise, hp, lp, bp, env_exp, t_, norm, compress
from core.audio import pluck as P
DUR=40.8; N=int(DUR*SR)
rng=np.random.default_rng(3)
# ---------- music bed: 110 BPM, Am F C G ----------
BPM=110; beat=60/BPM; bar=4*beat
mus=np.zeros((N,2),np.float32)
def kick(): d=.4; tt=t_(d); f=50+90*np.exp(-tt/.03); return norm(np.sin(2*np.pi*np.cumsum(f)/SR)*env_exp(d,.11)+hp(noise(d),3000)*env_exp(d,.002)*.3)
def hat(o=False): d=.25 if o else .06; return norm(hp(noise(d),7000)*env_exp(d,.07 if o else .012))
def clap():
    d=.25; x=np.zeros(int(d*SR))
    for k,o in enumerate([0,.011,.022]): s=int(o*SR); n=bp(noise(.2),900,2500)*env_exp(.2,.03 if k==2 else .008); x[s:s+len(n)]+=n[:len(x)-s]
    return norm(x)
K,H,HO,CL=kick(),hat(),hat(True),clap()
chords=[('A2',['A3','C4','E4']),('F2',['F3','A3','C4']),('C3',['G3','C4','E4']),('G2',['G3','B3','D4'])]
start_full=1.6; brk=(16.05,16.6)
t=start_full; b=0
while t<DUR:
    root,ch=chords[b%4]
    for q in range(4):
        tb=t+q*beat
        if tb>=DUR: break
        if brk[0]<=tb<brk[1]: continue
        if q in (0,2): add(mus,K,tb,.9)
        if q in (1,3): add(mus,CL,tb,.38,.1)
        add(mus,H,tb+beat/2,.22,.35); add(mus,H,tb,.12,.35)
        if q==3: add(mus,HO,tb+beat/2,.12,-.3)
        # bass on 1, and-of-2, 3
        for off in ([0,1.5,2] if q==0 else []):
            add(mus,P.pluck('upright_bass_pizz',root,beat*1.2,vel=.8),t+off*beat,.55)
        # guitar stabs on offbeats
        if q in (1,3) and not (brk[0]<=tb+beat/2<brk[1]):
            add(mus,P.strum('acoustic_guitar',ch,beat*.9,vel=.55),tb+beat/2,.22,-.25)
    t+=bar; b+=1
# intro 0..1.6: filtered hats + riser
for k in range(int(1.6/(beat/2))): add(mus,H,k*beat/2,.10,.3)
rz=noise(1.0)*np.linspace(0,1,int(SR))**2; rz=np.concatenate([bp(rz[i:i+2400],300+i/SR*5000,600+i/SR*9000) for i in range(0,len(rz),2400)])[:int(SR)]
add(mus,norm(rz),0.6,.35)
# fade end
fe=int(1.0*SR); mus[-fe:]*=np.linspace(1,0,fe)[:,None]
mus=np.stack([limit(mus[:,0],.9),limit(mus[:,1],.9)],1)
# ---------- sfx ----------
fx=np.zeros((N,2),np.float32)
def imp(): return norm(thump(1,48)+np.concatenate([lp(noise(.6),2500)*env_exp(.6,.12),np.zeros(int(.35*SR)-int(.6*SR)) if False else np.zeros(0)])[:int(.35*SR)]*.6)
add(fx,imp(),1.6+1/30,.9)
W=[(1.62,.3,.35),(2.45,.32,.5),(10.55,.28,.35),(12.45,.25,.35),(16.55,.4,.45),(22.0,.3,.55),(22.35,.35,.45),(25.02,.3,.55),(33.25,.3,.3),(37.72,.35,.5),(19.2,.3,.35),(35.42,.45,.3)]
for k,(tt,d,g) in enumerate(W): add(fx,whoosh(d*(.9+.2*(k%3)/2)),tt-.05,g,(-.3,.3,0)[k%3])
POPS=[2.62,4.28,4.8,6.36,7.08,8.52,11.0,12.12,20.0,22.3,24.5,25.5,27.8,29.28,29.94,31.78,35.95,37.1,39.55,13.2]
for k,tt in enumerate(POPS): add(fx,pop(),tt+1/30,.35*(1-.15*(k%2)),((k%3)-1)*.25)
for i in range(12): add(fx,click(1.2+.05*i),30.62+i*.045+1/30,.14,((i%5)-2)*.2)
# lightning
add(fx,ignite(),13.08,.8); add(fx,rumble(1.2),13.1,.6); add(fx,thump(1,40),13.12,.7)
# stamp + X
add(fx,thump(1,60),14.57,.95); add(fx,clack(.7),14.57,.5); add(fx,thump(.8,80),21.55,.6)
# 50 counter ticks
for i in range(8): add(fx,click(1.5+i*.08),1.6+i*.05,.12)
# follow tap
add(fx,click(1.0),39.25+1/30,.6)
# ---------- mix ----------
v,sr=sf.read('voice.wav',dtype='float32'); assert sr==SR; v=v[:N]; v=np.pad(v,((0,N-len(v)),(0,0)))
vc=np.stack([compress(v[:,0],.3,3,.004,.12),compress(v[:,1],.3,3,.004,.12)],1)
def rms(x): return np.sqrt(np.mean(x**2))
vg=.25/ (rms(vc)+1e-9)*0.5
vc*=vg
# duck music under voice (envelope)
env=np.abs(vc).mean(1); from scipy.ndimage import uniform_filter1d; env=uniform_filter1d(env,int(.15*SR)); env=env/ (env.max()+1e-9)
duck=1-.45*np.clip(env*3,0,1)
mg=.16*rms(vc)/(rms(mus)+1e-9)*2.2
def fin(x): return np.stack([limit(x[:,0],.95),limit(x[:,1],.95)],1)
full=vc+mus*mg*duck[:,None]+fx*.55*rms(vc)/(rms(fx)+1e-9)*.9
nomus=vc+fx*.55*rms(vc)/(rms(fx)+1e-9)*.9
sf.write('mix_music.wav',fin(full),SR); sf.write('mix_nomusic.wav',fin(nomus),SR)
print('ok', rms(vc), rms(mus*mg), rms(fx))
