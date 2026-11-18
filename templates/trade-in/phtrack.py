import cv2, numpy as np, json
from scipy.ndimage import gaussian_filter1d
D='../frames_cc/1362/%05d.jpg'; n=209
G=lambda i: cv2.cvtColor(cv2.imread(D%(i+1)),cv2.COLOR_BGR2GRAY)
k0=45; c0=(665,1095); H=48
g=G(k0); tpl0=g[c0[1]-H:c0[1]+H,c0[0]-H:c0[0]+H].astype(np.float32)
pos={k0:(c0[0],c0[1],1.0)}
for rng in (range(k0+1,n),range(k0-1,-1,-1)):
    tpl=tpl0.copy(); cx,cy=c0
    for i in rng:
        g=G(i).astype(np.float32); R=90
        x0,y0=max(0,cx-H-R),max(0,cy-H-R); win=g[y0:cy+H+R,x0:cx+H+R]
        best=(-1,None)
        for s in (0.9,1.0,1.1):
            t=cv2.resize(tpl,None,fx=s,fy=s); 
            if t.shape[0]>=win.shape[0] or t.shape[1]>=win.shape[1]: continue
            r=cv2.matchTemplate(win,t,cv2.TM_CCOEFF_NORMED); _,mv,_,ml=cv2.minMaxLoc(r)
            if mv>best[0]: best=(mv,(x0+ml[0]+t.shape[1]//2,y0+ml[1]+t.shape[0]//2))
        sc,(nx,ny)=best
        if sc>0.45:
            cx,cy=nx,ny; patch=g[cy-H:cy+H,cx-H:cx+H]
            if patch.shape==tpl.shape and sc>0.6: tpl=0.9*tpl+0.1*patch
        pos[i]=(cx,cy,sc)
xs=np.array([pos[i][0] for i in range(n)],float); ys=np.array([pos[i][1] for i in range(n)],float); sc=[pos[i][2] for i in range(n)]
print('low-score frames',sum(1 for s in sc if s<0.45), 'min',min(sc))
xs=gaussian_filter1d(xs,2.5); ys=gaussian_filter1d(ys,2.5)
for t in [0.3,1.5,3.0,4.5,5.6]: i=int(t*30); print(t, int(xs[i]),int(ys[i]), round(sc[i],2))
json.dump(dict(x=[round(v,1) for v in xs],y=[round(v,1) for v in ys]),open('phtrack.json','w'))
# visual check
ims=[]
for t in [0.3,1.5,3.0,4.5,5.6]:
    i=int(t*30); im=cv2.imread(D%(i+1)); cv2.circle(im,(int(xs[i])+30,int(ys[i])+80),150,(0,255,255),6)
    ims.append(cv2.resize(im[700:1500,250:1050],(260,260)))
cv2.imwrite('phcheck.jpg',cv2.hconcat(ims))
