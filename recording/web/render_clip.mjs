import { chromium } from 'playwright-core';
import http from 'http'; import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
const [,, clipName, sceneId, ...figs] = process.argv;   // figs: name[:weight]
const T = JSON.parse(fs.readFileSync('../build/timeline.json','utf8'));
const scene = T.scenes.find(s=>s.id===sceneId);
const FPS=30, TAIL=0.5;
const total = (scene.end-scene.start)+TAIL;
// segment boundaries: figures weighted by given weights, over the scene's phrase starts when counts match, else evenly
const list = figs.map(f=>{const [n,w]=f.split(':');return {name:n,w:+(w||1)}});
const starts = scene.phrases.map(p=>p.start-scene.start);
let bounds=[];
if(list.length===scene.phrases.length){ bounds=[...starts,total]; }
else { const sum=list.reduce((a,b)=>a+b.w,0); let acc=0; bounds=[0]; list.forEach((f,i)=>{acc+=f.w/sum*total; bounds.push(i===list.length-1?total:acc)}); }
const Z=([x,y])=>[420+(x-420)*1.05,336+(y-336)*1.05];
const S=(a,b)=>Math.sin(2*Math.PI*a/b);
const paths={
  _default:(t,T)=>[420+230*S(t+0.4,3.3), 385+120*S(t,2.2)],
  riffle:(t,T)=>[420+170*S(t,T*0.95), 335+25*S(t,1.3)],
  exploded:(t,T)=>[420+190*S(t,T*0.8), 250+270*(t/T)],
  keyboard:(t,T)=>[420+250*S(t+0.3,3.0), 400+80*S(t,1.9)],
  laptop:(t,T)=>[420+20*S(t,2), 385+235*S(t,T*0.95)],
  vault:(t,T)=>{const a=2*Math.PI*(0.15+1.15*t/T);return [420+135*Math.cos(a), 360+135*Math.sin(a)]},
  branches:(t,T)=>[420+270*S(t,T*0.95), 385+40*S(t,1.4)],
  stack:(t,T)=>[420+10*S(t,2), 330+210*S(t,T*0.95)],
};
const root=process.cwd();
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}const t={'.js':'text/javascript','.html':'text/html','.woff2':'font/woff2'}[path.extname(f)]||'application/octet-stream';r.writeHead(200,{'content-type':t});fs.createReadStream(f).pipe(r)}).listen(0);
const port=srv.address().port;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:840,height:672},deviceScaleFactor:2});
const page=await ctx.newPage();
page.on('pageerror',e=>console.log('pageerror:',e.message));
await page.clock.install({time:0});
await page.goto(`http://localhost:${port}/reel.html`);
await page.waitForFunction('window.ready===true');
const dir=`/tmp/cs/frames_${clipName}`; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
const nFrames=Math.round(total*FPS);
let seg=-1, segStart=0;
for(let f=0;f<nFrames;f++){
  const t=f/FPS;
  let k=0; while(k<list.length-1 && t>=bounds[k+1]) k++;
  if(k!==seg){ seg=k; segStart=bounds[k];
    await page.evaluate(([n,i,tot])=>window.mountFigure(n,i,tot),[list[k].name,k+1,list.length]);
    const [x0,y0]=Z((paths[list[k].name]||paths._default)(0,bounds[k+1]-bounds[k]));
    await page.mouse.move(x0,y0);
  }
  const L=bounds[k+1]-segStart, lt=t-segStart;
  const [x,y]=Z((paths[list[k].name]||paths._default)(lt,L));
  await page.mouse.move(x,y);
  await page.evaluate(([x,y])=>window.setCursor(x,y,true),[x,y]);
  const fade = Math.min(1, lt/0.18, (L-lt)/0.18, 1);
  await page.evaluate(v=>{document.body.style.opacity=v},Math.max(0,Math.min(1,fade<0?0:fade)));
  await page.clock.runFor(1000/FPS);
  await page.screenshot({path:`${dir}/f${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});
}
await b.close(); srv.close();
fs.mkdirSync('../assets/vid',{recursive:true});
execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(FPS),'-i',`${dir}/f%05d.jpg`,'-c:v','libx264','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',`../assets/vid/${clipName}.mp4`]);
console.log('done',clipName,nFrames,'frames',(nFrames/FPS).toFixed(2),'s');
