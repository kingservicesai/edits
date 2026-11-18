import json, numpy as np, soundfile as sf
R='/home/user/work/p2/raw/'
PLAN=[('IMG_1357',0.0,9.9,{}),('IMG_1359',0.0,8.9,{}),('IMG_1360',8.4,99,{}),('IMG_1362',0.0,99,{}),
      ('IMG_1363',0.0,99,{}),('IMG_1364',0.0,99,{'react':(6.25,6.88)}),('IMG_1365',0.0,99,{}),('IMG_1366',0.0,99,{'tail':(9.3,10.5)})]
MINSIL=.30; PRE=.10; POST=.16; H=.01
segs=[]
for clip,a,b,ex in PLAN:
    W=json.load(open(R+clip+'.json'))
    au,sr=sf.read(R+clip+'.wav',dtype='float32'); dur=len(au)/sr; h=int(H*sr)
    r=20*np.log10(np.sqrt(np.array([np.mean(au[i:i+h]**2) for i in range(0,len(au)-h,h)]))+1e-9)
    floor=np.percentile(r,10); thr=max(floor+10,-46)
    # smooth voiced mask
    v=r>thr
    lastw=max(x['start'] for x in W if a<=x['start']<b)
    b=min(b,dur, lastw+1.3)
    i0,i1=int(a/H),int(b/H)
    runs=[];cur=None
    for i in range(i0,min(i1,len(v))):
        if v[i]:
            if cur is None: cur=[i,i]
            else: cur[1]=i
        elif cur is not None and (i-cur[1])*H>MINSIL: runs.append(cur);cur=None
    if cur: runs.append(cur)
    # merge runs separated by < MINSIL
    m=[]
    for s,e in runs:
        if m and (s-m[-1][1])*H<MINSIL: m[-1][1]=e
        else: m.append([s,e])
    # drop tiny blips (<120ms) without words
    out=[]
    for s,e in m:
        ts,te=s*H,(e+1)*H
        ws=[x for x in W if ts-.15<=x['start']<te]
        if (te-ts)<.12 and not ws: continue
        out.append([max(a,ts-PRE),min(dur,te+POST),ws])
    # resolve overlaps from padding
    for k in range(1,len(out)):
        if out[k][0]<out[k-1][1]: mid=(out[k][0]+out[k-1][1])/2; out[k-1][1]=mid; out[k][0]=mid
    # every kept word must be covered: extend segments to include word starts
    kw=[x for x in W if a<=x['start']<b]
    for x in kw:
        if any(s-0.001<=x['start']<e for s,e,_ in out): continue
        nxt=[o for o in out if o[0]>x['start']]
        if nxt and nxt[0][0]-x['start']<.8: nxt[0][0]=max(a,x['start']-PRE)
        else:
            prv=[o for o in out if o[1]<=x['start']]
            if prv: prv[-1][1]=x['start']+.35
    # merge same-clip segments with small gaps, drop wordless blips
    out.sort(key=lambda o:o[0]); mm=[]
    for o in out:
        if mm and o[0]-mm[-1][1]<.25: mm[-1][1]=max(mm[-1][1],o[1])
        else: mm.append(list(o))
    for o in mm: o[2]=[x for x in kw if o[0]-.001<=x['start']<o[1]]
    mm=[o for o in mm if o[2]]
    for s,e,ws in mm:
        segs.append(dict(clip=clip,src_in=round(s,3),src_out=round(e,3),words=[dict(x) for x in ws]))
    if 'react' in ex:
        r0,r1=ex['react']
        for sg in segs:
            if sg['clip']==clip and sg['words'] and abs(sg['words'][0]['start']-r1)<.1: sg['src_in']=round(r0,3); sg['react']=True
    if 'tail' in ex:
        t0,t1=ex['tail']; segs[-1]['src_out']=round(t1,3); segs[-1]['tailshot']=True
# manual tweaks
FIRSTW={}
for sg in segs: FIRSTW.setdefault(sg['clip'],sg['words'][0]['start'] if sg['words'] else None)
fix=[]
for sg in segs:
    fw=sg['words'][0]['start'] if sg['words'] else None
    if fw is not None and not sg.get('react'): sg['src_in']=round(max(sg['src_in'],fw-.25),3)
    if sg.get('react'): sg['src_out']=7.95
    if fix and fix[-1]['clip']==sg['clip']=='IMG_1359': fix[-1]['src_out']=sg['src_out']; fix[-1]['words']+=sg['words']; continue
    fix.append(sg)
segs=fix
T=0
for s in segs:
    s['t0']=round(T,3); T+=s['src_out']-s['src_in']; s['t1']=round(T,3)
    for x in s['words']: x['tl']=round(s['t0']+x['start']-s['src_in'],3)
    s['text']=' '.join(x['text'] for x in s['words'])
    print(f"{s['t0']:6.2f}-{s['t1']:6.2f} {s['clip']} [{s['src_in']:.2f}-{s['src_out']:.2f}] {s['text']}")
print('TOTAL',round(T,2))
json.dump(segs,open('edl.json','w'),ensure_ascii=False,indent=1)
