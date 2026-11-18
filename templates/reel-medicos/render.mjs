import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const FPS=30, TL=JSON.parse(fs.readFileSync('timeline.json','utf8')), K=JSON.parse(fs.readFileSync('cues.json','utf8')), TR=JSON.parse(fs.readFileSync('track.json','utf8'));
const F=TL.frames, N=F.length, W=4;
const RG=(process.argv[2]||'').startsWith('range:')?process.argv[2].slice(6).split('-').map(Number):null;
const only=(!RG&&process.argv[2])?process.argv[2].split(',').map(Number):null;
const outDir=only?'stills':'out'; if(!RG)fs.rmSync(outDir,{recursive:true,force:true}); fs.mkdirSync(outDir,{recursive:true});
const b=await chromium.launch({args:['--allow-file-access-from-files']});
async function worker(list){
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('pageerror',e=>console.error('pageerror',e.message)); p.on('console',m=>{if(m.type()==='error')console.error('console',m.text())});
  await p.goto('file:///home/user/work/p3/build/comp.html'); await p.evaluate(async([k,f])=>{await init(k,f)},[K,{y:TR.y,s:TR.s}]);
  for(const i of list){ const f=F[i]; const t=i/FPS; const src=`file:///home/user/work/p3/frames/${String(f[0]).padStart(5,'0')}.jpg`;
    await p.evaluate(async([t,src,f])=>{await setFrame(src);await render(t,f)},[t,src,f]);
    await p.screenshot({path:only?`${outDir}/t${t.toFixed(2)}.jpg`:`${outDir}/${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:only?85:94}); }
}
const idx=only?only.map(t=>Math.min(N-1,Math.round(t*FPS))):RG?[...Array(RG[1]-RG[0]).keys()].map(i=>i+RG[0]):[...Array(N).keys()];
const parts=[...Array(W)].map((_,k)=>idx.filter((_,j)=>j%W===k));
const t0=Date.now(); await Promise.all(parts.map(worker)); await b.close();
console.log('frames',idx.length,'in',((Date.now()-t0)/1000).toFixed(1),'s');
