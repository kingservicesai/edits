import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const FPS=30, N=1223, W=4;
const words=JSON.parse(fs.readFileSync('words_fixed.json','utf8'));
const only=process.argv[2]?process.argv[2].split(',').map(Number):null; // times for stills
const outDir=only?'stills':'out'; fs.mkdirSync(outDir,{recursive:true});
const b=await chromium.launch({args:['--allow-file-access-from-files']});
async function worker(k,list){
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('pageerror',e=>console.error('pageerror',e.message));
  await p.goto('file:///home/user/work/v3/comp.html'); await p.evaluate(w=>buildCaps(w),words);
  for(const i of list){ const t=i/FPS; const src=`file:///home/user/work/v3/src/${String(Math.min(i+1,N)).padStart(5,'0')}.jpg`;
    await p.evaluate(async([t,src])=>{await setFrame(src);render(t)},[t,src]);
    await p.screenshot({path:only?`${outDir}/t${t.toFixed(2)}.jpg`:`${outDir}/${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:only?85:94}); }
}
const idx=only?only.map(t=>Math.round(t*FPS)):[...Array(N).keys()];
const parts=[...Array(W)].map((_,k)=>idx.filter((_,j)=>j%W===k));
const t0=Date.now(); await Promise.all(parts.map((l,k)=>worker(k,l))); await b.close();
console.log('frames',idx.length,'in',((Date.now()-t0)/1000).toFixed(1),'s');
