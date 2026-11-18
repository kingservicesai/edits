import cv2, json, numpy as np, os
from scipy.ndimage import gaussian_filter1d
Y=cv2.FaceDetectorYN.create('/home/user/tools/yunet.onnx','',(540,960),0.6,0.3,50)
out={}
for c in ['1359','1363','1364','1365']:
    d=f'/home/user/work/p2/frames/{c}'; fs=sorted(os.listdir(d)); xs=[];ys=[];ss=[]
    prev=None
    for f in fs:
        g=cv2.resize(cv2.imread(f'{d}/{f}'),(540,960)); _,F=Y.detect(g)
        det=[tuple(r[:4]) for r in (F if F is not None else [])]
        det=[x for x in det if x[1]<650 and x[2]>45]
        if det:
            if prev is not None: det.sort(key=lambda r:abs(r[0]+r[2]/2-prev[0])+abs(r[1]+r[3]/2-prev[1])-0.5*r[2])
            else: det.sort(key=lambda r:-r[2])
            x,y,w,h=det[0]; cx,cy=(x+w/2)*2,(y+h/2)*2
            if prev is None or abs(cx-prev[0])+abs(cy-prev[1])<260: xs.append(cx);ys.append(cy);ss.append(w*2);prev=(cx,cy);continue
        xs.append(np.nan);ys.append(np.nan);ss.append(np.nan)
    a=np.array([xs,ys,ss],float); n=a.shape[1]; idx=np.arange(n)
    ok=~np.isnan(a[0]); print(c,'detected',ok.sum(),'/',n)
    for k in range(3): a[k]=np.interp(idx,idx[ok],a[k][ok])
    sm=[gaussian_filter1d(a[k],9) for k in range(3)]  # ~0.3 s smoothing
    out[c]=dict(x=[round(v,1) for v in sm[0]],y=[round(v,1) for v in sm[1]],s=[round(v,1) for v in sm[2]])
    print(c,'x %.0f-%.0f y %.0f-%.0f size %.0f'%(np.nanmin(sm[0]),np.nanmax(sm[0]),np.nanmin(sm[1]),np.nanmax(sm[1]),np.nanmean(sm[2])))
json.dump(out,open('track.json','w'))
