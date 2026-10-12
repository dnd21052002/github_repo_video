import { chromium } from 'playwright-core';
import fs from 'fs'; import { execFileSync } from 'child_process';
const [,, clip, seconds] = process.argv; const FPS=30, total=+seconds;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:900,height:720},deviceScaleFactor:2});
const page=await ctx.newPage();
await page.goto('http://localhost:8000/',{waitUntil:'networkidle'});
await page.waitForTimeout(1200);
await page.addStyleTag({content:'#__cur{position:fixed;width:30px;height:30px;margin:-15px 0 0 -15px;border:3px solid #C9A227;border-radius:50%;box-shadow:0 0 0 6px rgba(201,162,39,.2);pointer-events:none;z-index:99999;left:-100px;top:-100px}'});
await page.evaluate(()=>{const d=document.createElement('div');d.id='__cur';document.body.appendChild(d)});
await page.clock.install({time:0});
const ease=x=>x<0?0:x>1?1:x*x*(3-2*x);
const dir=`/tmp/cs/frames_au_${clip}`; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
let chart=null, clicked=false;
const n=Math.round(total*FPS);
for(let f=0;f<n;f++){
  const t=f/FPS; let cur=null;
  if(clip==='dash'){
    const sy=150*ease((t-0.5)/0.8);
    await page.evaluate(y=>window.scrollTo(0,y),sy);
    if(t>=1.5 && !chart){ chart=await page.evaluate(()=>{let best=null;for(const s of document.querySelectorAll('svg')){const r=s.getBoundingClientRect();if(r.width>400&&r.height>150&&(!best||r.width*r.height>best.w*best.h))best={x:r.x,y:r.y,w:r.width,h:r.height}}return best}); console.log('chart',JSON.stringify(chart)); }
    if(chart){ const u=ease((t-1.6)/(total-2.4)); cur=[chart.x+30+u*(chart.w-90), chart.y+chart.h*0.45]; }
    else cur=[300,360];
  } else if(clip==='port'){
    if(t>=0.4 && !clicked){ clicked=true; await page.getByText('Portfolio',{exact:true}).first().click(); await page.waitForTimeout(700); }
    const sy=330*ease((t-1.4)/(total-2.0));
    await page.evaluate(y=>window.scrollTo(0,y),sy);
    cur=[600,300+80*Math.sin(t*2)];
  }
  if(cur){ await page.mouse.move(cur[0],cur[1]); await page.evaluate(([x,y])=>{const c=document.getElementById('__cur');c.style.left=x+'px';c.style.top=y+'px'},cur); }
  await page.clock.runFor(1000/FPS);
  await page.screenshot({path:`${dir}/f${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});
}
await b.close();
fs.mkdirSync('../assets/vid',{recursive:true});
execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(FPS),'-i',`${dir}/f%05d.jpg`,'-c:v','libx264','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',`../assets/vid/${clip}.mp4`]);
console.log('done',clip,n);
