import json
E=json.load(open('edl.json')); TR=json.load(open('track.json')); FPS=30
DUR={'1357':5.84,'1359':10.1,'1360':14.77,'1362':6.97,'1363':8.10,'1364':9.40,'1365':6.13,'1366':10.53}
# boundary styles between consecutive segments: ('J'|'L'|'cut', d)
STY=['J','L','J','L','J','cut','J','L']
TRACK={('1359',0),('1363',0),('1364',1),('1365',0)}  # (clip, nth segment of that clip)
segs=[];cnt={}
for s in E:
    c=s['clip'][4:]; n=cnt.get(c,0); cnt[c]=n+1
    segs.append(dict(c=c,i=s['src_in'],o=s['src_out'],t0=s['t0'],t1=s['t1'],track=(c,n) in TRACK))
V=[dict(x) for x in segs]
for k in range(len(segs)-1):
    st=STY[k]; A,B=V[k],V[k+1]
    if st=='J':  # video of A continues d after audio boundary
        d=min(.35, DUR[A['c']]-A['o']-.05); A['t1']+=d; B['t0']+=d; B['vi']=B['i']+d
    elif st=='L':  # video of B starts d before audio boundary
        d=min(.35, B['i']-.02); A['t1']-=d; B['t0']-=d; B['vi']=B['i']-d
    print(f"{A['c']}->{B['c']} {st} d={d if st!='cut' else 0:.2f}")
for v in V: v.setdefault('vi',v['i'])
TOTAL=segs[-1]['t1']; N=int(round(TOTAL*FPS))
frames=[]
for f in range(N):
    t=f/FPS; v=next(x for x in V if x['t0']<=t<x['t1']+1e-6) if t<V[-1]['t1'] else V[-1]
    st=v['vi']+(t-v['t0']); fi=min(int(round(st*FPS)), int(DUR[v['c']]*FPS)-2)
    z,tx,ty=1.0,0.0,0.0
    if v['track']:
        T=TR[v['c']]; j=min(fi,len(T['x'])-1); fx,fy=T['x'][j],T['y'][j]; z=1.32
        tx=540-fx*z; ty=720-fy*z
        tx=max(1080-1080*z,min(0,tx)); ty=max(1920-1920*z,min(0,ty))
    frames.append([v['c'],fi+1,round(z,3),round(tx,1),round(ty,1)])
# cue times on the audio timeline
W=[w|{'clip':s['clip'][4:]} for s in E for w in s['words']]
def cue(clip,text,after=0):
    for w in W:
        if w['clip']==clip and w['text'].strip('.,¿?').lower()==text.lower() and w['start']>=after: return round(w['tl'],3)
    raise SystemExit(f'missing {clip} {text}')
C=dict(iph=cue('1357','iPhone'), p1499a=cue('1357','1499'), v1_end=V[0]['t1'],
  d449=cue('1359','449'), no=cue('1359','No'), seg2_end=V[1]['t1'],
  sell=cue('1360','sellado'), p1499b=cue('1360','1499'), seg3_end=V[2]['t1'],
  u17=cue('1362','17'), usado=cue('1362','usado'), p1050=cue('1362','1050'), seg4_end=V[3]['t1'],
  m1499=cue('1363','1499'), restamos=cue('1363','restamos'), m1050=cue('1363','1050'), seg5_end=V[4]['t1'],
  r449=cue('1364','449'), rsell=cue('1364','sellado'), asi=cue('1364','Así'), seg7_end=V[6]['t1'],
  wa=cue('1365','WhatsApp'), co=cue('1365','correo'), fo=cue('1365','foto'), seg8_end=V[7]['t1'],
  tras=cue('1366','traspasa'), c2=cue('1366','Correo'), f2=cue('1366','fotos'), cv=cue('1366','conversaciones'), vi=cue('1366','vídeos'),
  deuna=cue('1366','una'), end=TOTAL)
print(C); print('TOTAL',TOTAL,'frames',N)
json.dump(dict(frames=frames,cues=C,total=TOTAL,audio=[[s['c'],s['i'],s['o'],s['t0']] for s in segs]),open('timeline.json','w'))
