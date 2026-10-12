// VÍ DỤ: đường dẫn trang demo (file://…) và đầu ra là của video Answer-me-with-HTML — sửa cho dự án của bạn.
import { chromium } from 'playwright-core';
import fs from 'fs'; import {execSync} from 'child_process';
const FPS=30, N=Math.round(13*FPS), dir='/tmp/cs/pg'; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:900,height:720},deviceScaleFactor:1.4});
const page=await ctx.newPage();
await page.goto('file:///home/user/amhtml-video/assets/login_blueprint.html');
await page.waitForTimeout(1200);
const H=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
await page.evaluate(()=>{const c=document.createElement('div');c.id='cur';c.style.cssText='position:fixed;width:34px;height:34px;border:4px solid #FFD400;border-radius:50%;z-index:99999;pointer-events:none;left:0;top:0;opacity:0;box-shadow:0 0 0 3px rgba(0,0,0,.35)';document.body.appendChild(c)});
const sel=async(k,v)=>{await page.selectOption(`select[data-am="${k}"]`,v)};
const opts=async k=>page.$$eval(`select[data-am="${k}"] option`,o=>o.map(x=>x.value));
const themes=await opts('theme'), modes=await opts('mode'); console.log(themes,modes,H);
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
for(let i=0;i<N;i++){
  const t=i/FPS;
  // 0-1.5 hold, 1.5-8 scroll down, 8-9 back top, then theme/mode switches
  let y=0; if(t>1.2&&t<7.5) y=H*ease((t-1.2)/6.3); else if(t>=7.5&&t<8.5) y=H*(1-ease(t-7.5)); 
  await page.evaluate(y=>window.scrollTo(0,y),y);
  if(i===Math.round(9*FPS)&&themes[1]) await sel('theme',themes[1]);
  if(i===Math.round(10.6*FPS)&&themes[2]) await sel('theme',themes[2]);
  if(i===Math.round(11.8*FPS)&&modes.includes('dark')) await sel('mode','dark');
  await page.evaluate(()=>{const c=document.getElementById('cur');c.style.opacity=0});
  await page.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`});
}
await b.close();
execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${dir}/f%04d.png -vf "scale=1260:1008" -c:v libx264 -pix_fmt yuv420p -crf 18 assets/vid/page.mp4`);
