#!/usr/bin/env python3
"""Video 9:16 — Lisosomas y Peroxisomas. Render local con PIL + ffmpeg."""
import math, subprocess, wave, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lisosomas_peroxisomas.mp4")
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
_fc = {}
def F(size, bold=True):
    k = (size, bold)
    if k not in _fc: _fc[k] = ImageFont.truetype(FB if bold else FR, size)
    return _fc[k]

WHITE=(255,255,255); MUTED=(190,200,225)
LYS=(255,92,138); PER=(64,214,160); SYN=(90,170,255); YEL=(255,206,64); ORG=(255,150,60)
M = 70  # margen

def wrap(text, font, maxw):
    out=[]
    for para in text.split("\n"):
        line=""
        for w in para.split(" "):
            t=(line+" "+w).strip()
            if font.getlength(t)<=maxw: line=t
            else: out.append(line); line=w
        out.append(line)
    return out

# ---------- capas (RGBA pre-renderizadas) ----------
def text_layer(text, size, color=WHITE, bold=True, maxw=W-2*M, align="left", spacing=1.18):
    f=F(size,bold); lines=wrap(text,f,maxw); lh=int(size*spacing)
    img=Image.new("RGBA",(maxw,lh*len(lines)+10),(0,0,0,0)); d=ImageDraw.Draw(img)
    for i,l in enumerate(lines):
        x=0 if align=="left" else (maxw-f.getlength(l))/2
        d.text((x,i*lh),l,font=f,fill=color)
    return img

def card(head, body, accent, w=W-2*M, hs=46, bs=36, icon=None):
    pad=30; inner=w-2*pad-18-(110 if icon else 0)
    hl=wrap(head,F(hs),inner); bl=wrap(body,F(bs,False),inner) if body else []
    h=pad*2+len(hl)*int(hs*1.2)+(12 if bl else 0)+len(bl)*int(bs*1.25)
    h=max(h,150 if icon else 0)
    img=Image.new("RGBA",(w,h),(0,0,0,0)); d=ImageDraw.Draw(img)
    d.rounded_rectangle((0,0,w-1,h-1),28,fill=(24,26,58,240),outline=accent+(200,),width=3)
    d.rounded_rectangle((0,0,18,h-1),9,fill=accent+(255,))
    x=pad+18; y=pad
    if icon:
        d.ellipse((x,h/2-45,x+90,h/2+45),fill=accent+(255,))
        f=F(40); tw=f.getlength(icon); d.text((x+45-tw/2,h/2-25),icon,font=f,fill=(20,20,40))
        x+=110
    for l in hl: d.text((x,y),l,font=F(hs),fill=accent); y+=int(hs*1.2)
    y+=12 if bl else 0
    for l in bl: d.text((x,y),l,font=F(bs,False),fill=WHITE); y+=int(bs*1.25)
    return img

def chip(text, color):
    f=F(38); tw=int(f.getlength(text))
    img=Image.new("RGBA",(tw+60,70),(0,0,0,0)); d=ImageDraw.Draw(img)
    d.rounded_rectangle((0,0,tw+59,69),35,fill=color+(255,))
    d.text((30,12),text,font=f,fill=(20,20,40)); return img

def arrow_down(color, h=60):
    img=Image.new("RGBA",(60,h),(0,0,0,0)); d=ImageDraw.Draw(img)
    d.rectangle((24,0,36,h-26),fill=color+(255,)); d.polygon([(4,h-30),(56,h-30),(30,h)],fill=color+(255,))
    return img

def organelle(kind, r=170):
    s=r*2+40; img=Image.new("RGBA",(s,s),(0,0,0,0)); d=ImageDraw.Draw(img); c=s/2
    rng=np.random.default_rng(3 if kind=="lys" else 7)
    if kind=="lys":
        d.ellipse((c-r,c-r,c+r,c+r),fill=(255,92,138,70),outline=LYS+(255,),width=12)
        for _ in range(26):
            a=rng.uniform(0,2*math.pi); rr=rng.uniform(0,r-40); x=c+rr*math.cos(a); y=c+rr*math.sin(a)
            col=[YEL,WHITE,SYN,ORG][rng.integers(4)]
            d.ellipse((x-11,y-11,x+11,y+11),fill=col+(255,))
        d.text((c-48,c+r-75),"pH 5",font=F(34),fill=WHITE)
    else:
        d.ellipse((c-r,c-r*0.85,c+r,c+r*0.85),fill=(64,214,160,60),outline=PER+(255,),width=12)
        for _ in range(40):
            a=rng.uniform(0,2*math.pi); rr=rng.uniform(0,r-35); x=c+rr*math.cos(a); y=c+0.8*rr*math.sin(a)
            d.ellipse((x-5,y-5,x+5,y+5),fill=(200,255,230,200))
        # núcleo cristaloide
        q=60; d.polygon([(c,c-q),(c+q,c),(c,c+q),(c-q,c)],fill=YEL+(255,))
        for k in range(-q+15,q,18): d.line((c-q+abs(k),c+k,c+q-abs(k),c+k),fill=(150,110,0,255),width=3)
    return img

def eq_layer(left, right, color, size=44):
    """ecuación tipo  A  →  B centrada"""
    f=F(size); t=f"{left}  →  {right}"; tw=f.getlength(t)
    w=W-2*M; img=Image.new("RGBA",(w,int(size*1.8)),(0,0,0,0)); d=ImageDraw.Draw(img)
    d.rounded_rectangle((0,0,w-1,img.height-1),20,fill=(8,8,24,235))
    d.text(((w-tw)/2,size*0.35),t,font=f,fill=color); return img

# ---------- escenas ----------
# cada item: (t_inicio, capa, x, y, anim)   anim: 'slide' | 'pop' | 'drop'
scenes=[]
def scene(dur, accent, tag, title, items, title_size=78):
    scenes.append(dict(dur=dur,accent=accent,tag=tag,title=title,items=items,ts=title_size))

def stack(entries, y0, gap=26, t0=0.6, dt=0.55, x=M):
    out=[]; y=y0; t=t0
    for e in entries:
        out.append((t,e,x,y,"slide")); y+=e.height+gap; t+=dt
    return out

# 0 Hook
scene(3.4, YEL, None, None, [
    (0.0, text_layer("¿Quién RECICLA y quién DESINTOXICA tu célula?",86,WHITE,align="center"), M, 380, "pop"),
    (0.9, organelle("lys",150), 80, 900, "pop"),
    (1.2, organelle("per",150), W-80-340, 900, "pop"),
    (1.6, text_layer("LISOSOMA",54,LYS,align="center",maxw=420), 40, 1270, "slide"),
    (1.8, text_layer("PEROXISOMA",54,PER,align="center",maxw=440), W-480, 1270, "slide"),
    (2.3, text_layer("en 1 minuto",60,YEL,align="center"), M, 1500, "pop"),
])
# 1 Organelas síntesis vs catabolismo
s1=[card("SÍNTESIS (anabolismo)","Ribosomas + RER → proteínas\nREL → lípidos y esteroides\nGolgi → modifica, empaca, glucosila",SYN,bs=38),
    card("CATABOLISMO (degradación)","Lisosomas → digestión por hidrólisis\nPeroxisomas → oxidación con O₂ / H₂O₂\nMitocondrias → respiración y ATP",LYS,bs=38)]
scene(7.5, SYN, "1 · ORGANELAS", "¿Dónde se fabrican y se destruyen las biomoléculas?", stack(s1,560,gap=50,dt=1.6), 64)
# 2 Lisosoma estructura
s2=[card("Organela membranosa","Membrana simple que nace del Golgi",LYS,icon="1"),
    card("Interior ácido (pH ≈ 5)","Bomba de H⁺ que gasta ATP",LYS,icon="2"),
    card("~50 hidrolasas ácidas","Membrana glicosilada: no se autodigiere",LYS,icon="3")]
scene(6.5, LYS, "2 · LISOSOMA", "Estructura", [(0.3,organelle("lys",120),W/2-140,420,"pop")]+stack(s2,760,t0=1.0,dt=0.9))
# 3 tipos
s3=[card("Lisosoma PRIMARIO","Recién salido del Golgi. Enzimas listas, aún sin nada que digerir.",LYS,bs=38),
    card("Lisosoma SECUNDARIO","Primario + material a digerir:\nfagolisosoma (externo) o autofagolisosoma (propio).",ORG,bs=38),
    card("Cuerpo residual","Restos no digeridos → exocitosis",MUTED,bs=36,hs=40)]
scene(7.0, LYS, "2 · TIPOS", "Primario vs Secundario", stack(s3,450,gap=34,dt=1.4))
# 4 enzimas lisosomales
s4=[card("Proteolíticas (proteasas)","Catepsinas → proteínas en aminoácidos",LYS,hs=42,bs=34),
    card("Glucosidasas","Rompen glucósidos → azúcares simples",ORG,hs=42,bs=34),
    card("Lipasas","Lípidos → ácidos grasos + glicerol",YEL,hs=42,bs=34),
    card("Esterasas","Rompen ésteres: fosfatasas, sulfatasas",SYN,hs=42,bs=34),
    card("Nucleasas","ADN / ARN → nucleótidos",PER,hs=42,bs=34)]
scene(7.0, LYS, "2 · ENZIMAS", "Hidrolasas ácidas: todas rompen con agua", stack(s4,470,gap=22,dt=0.75), 64)
# 5 digestión celular
steps=[("1","Ingreso","Fagocitosis/endocitosis (heterofagia) o autofagia"),
       ("2","Fusión","El lisosoma primario se une a la vesícula"),
       ("3","Hidrólisis a pH 5","Ahora es lisosoma secundario"),
       ("4","Reciclaje","Monómeros salen al citosol y se reutilizan"),
       ("5","Desecho","Cuerpo residual → exocitosis")]
it=[]; y=430; t=0.5
for i,(n,h,b) in enumerate(steps):
    c=card(h,b,[SYN,ORG,LYS,PER,MUTED][i],icon=n,hs=40,bs=32)
    it.append((t,c,M,y,"slide")); y+=c.height
    if i<4: it.append((t+0.25,arrow_down(WHITE,46),W/2-30,y+4,"drop")); y+=56
    t+=1.15
scene(8.0, LYS, "3 · DIGESTIÓN", "Paso a paso", it)
# 6 peroxisoma estructura
s6=[card("Organela membranosa","Membrana simple, matriz granular",PER,icon="1"),
    card("Núcleo cristaloide","Cristal de urato oxidasa",PER,icon="2"),
    card("Se dividen por fisión","Sus proteínas vienen del citosol",PER,icon="3")]
scene(6.5, PER, "4 · PEROXISOMA", "Estructura", [(0.3,organelle("per",120),W/2-140,420,"pop")]+stack(s6,760,t0=1.0,dt=0.9))
# 7 enzimas peroxisoma
it=[(0.5,card("OXIDASAS","Usan O₂ y producen agua oxigenada",ORG,bs=38),M,450,"slide"),
    (1.2,eq_layer("RH₂ + O₂","R + H₂O₂",ORG,42),M,700,"pop"),
    (2.4,card("CATALASA","Destruye el H₂O₂ (tóxico) antes de que dañe",PER,bs=38),M,900,"slide"),
    (3.1,eq_layer("2 H₂O₂","2 H₂O + O₂",PER,46),M,1150,"pop"),
    (4.1,text_layer("Modo peroxidativo:",40,MUTED),M,1360,"slide"),
    (4.4,eq_layer("H₂O₂ + R'H₂","R' + 2 H₂O",YEL,40),M,1420,"pop")]
scene(7.5, PER, "4 · ENZIMAS", "Oxidasas + Catalasa", it)
# 8 procesos oxidativos
s8=[card("Respiración con H₂O₂","Consume O₂ sin hacer ATP: libera calor",PER,hs=40,bs=32),
    card("β-oxidación","Ácidos grasos de más de 8 C y dicarboxílicos de cadena larga → los acorta y pasan a la mitocondria",YEL,hs=40,bs=32),
    card("Oxidación del etanol","Catalasa: etanol → acetaldehído (hígado y riñón)",ORG,hs=40,bs=32),
    card("Purinas","Ácido úrico → alantoína (urato oxidasa; en humanos no funciona)",LYS,hs=40,bs=32),
    card("Poliaminas","Espermina → espermidina → putrescina",SYN,hs=40,bs=32)]
scene(9.0, PER, "5 · OXIDACIÓN", "Reacciones catabólicas", stack(s8,430,gap=20,dt=1.2))
# 9 resumen
it=[(0.2,organelle("lys",130),90,430,"pop"),(0.5,organelle("per",130),W-90-300,430,"pop"),
    (0.9,text_layer("LISOSOMA\ndigiere con AGUA\n(hidrólisis, pH 5)",46,LYS,align="center",maxw=440),40,780,"slide"),
    (1.3,text_layer("PEROXISOMA\noxida con O₂\n(H₂O₂ → H₂O)",46,PER,align="center",maxw=440),W-480,780,"slide"),
    (2.2,text_layer("Guárdalo para tu examen",64,YEL,align="center"),M,1250,"pop")]
scene(4.5, YEL, "RESUMEN", "En una frase", it)

# ---------- sincronizar con la voz (ElevenLabs) ----------
VOZ=os.path.join(os.path.dirname(os.path.abspath(__file__)),"voz")
VSTART=0.25
voices=[]
for si,sc in enumerate(scenes):
    fn=os.path.join(VOZ,f"v_{si}.wav")
    if os.path.exists(fn):
        with wave.open(fn) as wv:
            data=np.frombuffer(wv.readframes(wv.getnframes()),dtype=np.int16)/32768.0
        voices.append(data); need=VSTART+len(data)/44100+0.45
        if need>sc["dur"]:
            k=need/sc["dur"]; sc["dur"]=need
            sc["items"]=[(t*k,)+tuple(rest) for (t,*rest) in sc["items"]]
    else: voices.append(None)

# ---------- fondo + render ----------
def bg(accent):
    y=np.linspace(0,1,H)[:,None,None]
    top=np.array([14,16,40]); bot=np.array([30,20,60])
    a=np.array(accent)*0.18
    g=(top*(1-y)+bot*y)+a*(1-np.abs(y-0.5)*2)[...]
    return np.repeat(g,W,axis=1).clip(0,255).astype(np.uint8)
BG={}
def ease_back(x):
    c1=1.70158; c3=c1+1; return 1+c3*(x-1)**3+c1*(x-1)**2
def ease_out(x): return 1-(1-x)**3

total=sum(s["dur"] for s in scenes)
pops=[]  # tiempos de efectos de sonido
proc=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}",
    "-r",str(FPS),"-i","-","-c:v","libx264","-preset","veryfast","-crf","23","-pix_fmt","yuv420p","/tmp/_v.mp4"],
    stdin=subprocess.PIPE)
T0=0.0
for si,s in enumerate(scenes):
    acc=s["accent"]; key=acc
    if key not in BG: BG[key]=Image.fromarray(bg(acc)).convert("RGBA")
    tag=chip(s["tag"],acc) if s["tag"] else None
    title=text_layer(s["title"],s["ts"]) if s["title"] else None
    pops.append(T0)
    for it_ in s["items"]: pops.append(T0+it_[0])
    n=int(round(s["dur"]*FPS))
    # deco: burbujas flotantes
    rng=np.random.default_rng(si)
    bub=[(rng.uniform(0,W),rng.uniform(0,H),rng.uniform(8,30),rng.uniform(20,60)) for _ in range(14)]
    for fi in range(n):
        t=fi/FPS; g=T0+t
        fr=BG[key].copy(); d=ImageDraw.Draw(fr,"RGBA")
        for bx,by,br,sp in bub:
            yy=(by-sp*g)%H; d.ellipse((bx-br,yy-br,bx+br,yy+br),fill=acc+(22,))
        # barra de progreso
        d.rectangle((0,0,W,14),fill=(255,255,255,40)); d.rectangle((0,0,int(W*g/total),14),fill=acc+(255,))
        # salida de escena (últimos 0.2s): fundido
        out_k=max(0,(t-(s["dur"]-0.2))/0.2)
        def put(layer,x,y,start,anim):
            k=(t-start)/0.35
            if k<=0: return
            k=min(k,1); a=ease_out(k)*(1-out_k)
            L=layer
            if anim=="pop":
                sc=max(0.05,ease_back(k)); 
                if sc!=1: L=layer.resize((max(1,int(layer.width*sc)),max(1,int(layer.height*sc))),Image.BILINEAR)
                x=x+(layer.width-L.width)/2; y=y+(layer.height-L.height)/2
            elif anim=="slide": x=x+(1-ease_back(k))*-140
            elif anim=="drop": y=y-(1-ease_out(k))*40
            if a<1:
                L=L.copy(); al=L.getchannel("A").point(lambda v:int(v*a)); L.putalpha(al)
            fr.alpha_composite(L,(int(x),int(y)))
        if tag: put(tag,M,120,0.0,"slide")
        if title: put(title,M,215,0.1,"slide")
        for st,L,x,y,an in s["items"]: put(L,x,y,st,an)
        # marca
        d.text((M,H-110),"Biología celular",font=F(30,False),fill=(255,255,255,120))
        proc.stdin.write(fr.convert("RGB").tobytes())
    T0+=s["dur"]
proc.stdin.close(); proc.wait()

# ---------- audio sintetizado (beat + pops) ----------
SR=44100; N=int(total*SR)+SR; au=np.zeros(N)
bpm=124; beat=60/bpm; tt=np.arange(int(0.25*SR))/SR
kick=np.sin(2*np.pi*(50+90*np.exp(-tt*30))*tt)*np.exp(-tt*9)
hat=np.random.default_rng(0).standard_normal(int(0.05*SR))*np.exp(-np.arange(int(0.05*SR))/SR*80)*0.25
bass_notes=[55,55,65.4,49]
b=0;i=0
while b<total-0.5:
    s0=int(b*SR)
    if i%2==0: au[s0:s0+len(kick)]+=kick*0.8
    h0=int((b+beat/2)*SR); au[h0:h0+len(hat)]+=hat
    f=bass_notes[(i//8)%4]; bl=int(beat*SR*0.9); bt=np.arange(bl)/SR
    au[s0:s0+bl]+=0.18*np.sign(np.sin(2*np.pi*f*bt))*np.exp(-bt*4)
    b+=beat;i+=1
pt=np.arange(int(0.12*SR))/SR
pop=np.sin(2*np.pi*(900-500*pt/0.12)*pt)*np.exp(-pt*40)*0.45
for p in pops:
    s0=int(p*SR); au[s0:s0+len(pop)]+=pop
au=au[:int(total*SR)]*0.35
T=0.0
for sc,vd in zip(scenes,voices):
    if vd is not None:
        s0=int((T+VSTART)*SR); au[s0:s0+len(vd)]+=vd[:len(au)-s0]*1.6
    T+=sc["dur"]
fade=int(0.8*SR); au[-fade:]*=np.linspace(1,0,fade)
au=np.tanh(au*0.9)*0.85
with wave.open("/tmp/_a.wav","w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((au*32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg","-y","-loglevel","error","-i","/tmp/_v.mp4","-i","/tmp/_a.wav","-c:v","copy","-c:a","aac",
                "-b:a","128k","-shortest","-movflags","+faststart",OUT],check=True)
print("OK", OUT, f"{total:.1f}s")
