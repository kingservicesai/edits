import cv2, json, numpy as np, os
from scipy.ndimage import gaussian_filter1d
Y=cv2.FaceDetectorYN.create('/home/user/tools/yunet.onnx','',(540,960),0.6,0.3,50)
cap=cv2.VideoCapture('/home/user/work/p3/raw/main.mov'); xs=[];ys=[];ss=[];prev=None;n=0
while True:
    ok,f=cap.read()
    if not ok or n>=int(95.3*30): break
    if f.shape[1]!=1080: f=cv2.rotate(f,cv2.ROTATE_90_CLOCKWISE) if f.shape[1]>f.shape[0] else f
    g=cv2.resize(f,(540,960)); _,F=Y.detect(g); det=[tuple(r[:4]) for r in (F if F is not None else []) if r[2]>30]
    if det:
        det.sort(key=lambda r:-(r[2]*r[3])); x,y,w,h=det[0]; xs.append((x+w/2)*2); ys.append((y+h/2)*2); ss.append(h*2)
    else: xs.append(np.nan); ys.append(np.nan); ss.append(np.nan)
    n+=1
a=np.array([xs,ys,ss]); idx=np.arange(a.shape[1]); ok=~np.isnan(a[0]); print('frames',n,'detected',ok.sum())
cuts=[7.1667,14.7333,24.1667,31.2667,33.0333,41.5,45.0333,51.3333,64.1667,68.4333,72.2,73.4667,80.7,84.5333,90.2333]
bounds=[0]+[int(round(c*30)) for c in cuts]+[a.shape[1]]
out=np.zeros_like(a)
for b0,b1 in zip(bounds,bounds[1:]):   # smooth per take, never across take cuts
    seg=a[:,b0:b1]; o=~np.isnan(seg[0]); ii=np.arange(b1-b0)
    for k in range(3):
        v=np.interp(ii,ii[o],seg[k][o]) if o.any() else np.full(b1-b0,[540,700,300][k])
        out[k,b0:b1]=gaussian_filter1d(v,8,mode='nearest')
json.dump(dict(x=out[0].round(1).tolist(),y=out[1].round(1).tolist(),s=out[2].round(1).tolist()),open('track.json','w'))
print('face y range',out[1].min().round(),out[1].max().round(),'size',out[2].min().round(),out[2].max().round())
