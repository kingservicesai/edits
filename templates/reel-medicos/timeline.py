import json, numpy as np
FPS=30; W=json.load(open('/home/user/work/p3/raw/main_words.json')); TR=json.load(open('track.json'))
SIL=[(0.0,0.22),(5.81,5.99),(6.97,7.17),(11.15,11.33),(19.63,19.91),(23.95,24.54),(24.55,24.73),(31.02,31.32),(36.51,36.8),(41.36,41.54),(44.94,45.24),(46.86,47.15),(50.29,50.47),(50.65,50.87),(51.16,51.39),(59.53,59.84),(64.14,64.41),(66.9,67.09),(67.54,67.72),(68.15,68.67),(71.93,72.19),(73.13,73.56),(80.53,80.98),(84.36,84.55),(87.67,88.13)]
TAKES=[7.1667,14.7333,24.1667,31.2667,33.0333,41.5,45.0333,51.3333,64.1667,68.4333,72.2,73.4667,80.7,84.5333,90.2333]
END=95.2; M=.06
# keep-segments of source
cuts=[(max(0,a+M) if a>0 else 0, b-M) for a,b in SIL if (b-a)-2*M>=.06 or a==0]
keep=[];cur=0.0
for a,b in cuts:
    if a>cur: keep.append([cur,a])
    cur=max(cur,b)
keep.append([cur,END])
# split also at take cuts (hard cut there anyway)
seg=[]
for a,b in keep:
    pts=[a]+[t for t in TAKES if a<t<b]+[b]
    seg+= [[x,y] for x,y in zip(pts,pts[1:]) if y-x>.05]
# split long segments into <=2.0 s sub-shots at word starts
wst=[w['start'] for w in W]
shots=[]
for a,b in seg:
    s=a
    while b-s>2.15:
        tgt=s+1.75; cand=[t for t in wst if s+1.1<t<min(b-.5,s+2.05)]
        c=min(cand,key=lambda t:abs(t-tgt)) if cand else s+1.8
        shots.append([s,c]); s=c
    shots.append([s,b])
# output times
t=0;rows=[]
for a,b in shots: rows.append(dict(i=a,o=b,t0=t)); t+=b-a
TOTAL=t
def s2o(x):
    for r in rows:
        if r['i']-1e-6<=x<r['o']+1e-6: return r['t0']+x-r['i']
    # in a removed gap: snap to next shot
    nx=[r for r in rows if r['i']>x]; return nx[0]['t0'] if nx else TOTAL
# framing levels with head tracking
fs=np.array(TR['s']); fx=np.array(TR['x']); fy=np.array(TR['y'])
prevz=None; lv_cycle=[0,2,1,2,0,1]; k=0
for r in rows:
    f0,f1=int(r['i']*FPS),max(int(r['i']*FPS)+1,int(r['o']*FPS))
    face=np.median(fs[f0:f1])
    for tries in range(6):
        lv=lv_cycle[k%len(lv_cycle)]; k+=1
        z1=max(1.15,min(1.55,300/face)); z2=max(z1+.18,min(1.8,440/face))
        z={0:1.0,1:z1,2:z2}[lv]
        if prevz is None or abs(z-prevz)>=.12: break
    r['z']=round(float(z),3); prevz=z
frames=[]
for r in rows:
    n0=int(round(r['t0']*FPS)); n1=int(round((r['t0']+r['o']-r['i'])*FPS))
    for n in range(n0,n1):
        st=r['i']+(n/FPS-r['t0']); fi=min(int(st*FPS),len(fx)-1)
        p=(n-n0)/max(1,n1-n0); z=r['z']*(1+.025*p)  # subtle push within the shot
        if z>1.001:
            tx=540-fx[fi]*z; ty=1920*.40-fy[fi]*z
            tx=max(1080-1080*z,min(0,tx)); ty=max(1920-1920*z,min(0,ty))
        else: tx=ty=0
        frames.append([fi+1,round(z,4),round(float(tx),1),round(float(ty),1)])
# words on output timeline (with display corrections)
FIX={'rol':'error','presencial':'presencia en','tres,':'trends,','evalúa':'devalúa','cirfa':'circo','Kim':'King','Fo':'Phone','Bobo':'Bogo'}
OW=[dict(text=FIX.get(w['text'],w['text']),t=round(s2o(w['start']),3),src=w['start']) for w in W if w['start']<END]
json.dump(dict(frames=frames,total=TOTAL,shots=rows,words=OW),open('timeline.json','w'),ensure_ascii=False)
print('shots',len(rows),'total %.2f s'%TOTAL,'frames',len(frames),'longest shot %.2f'%max(r['o']-r['i'] for r in rows))
print('levels z:',[r['z'] for r in rows[:20]])
