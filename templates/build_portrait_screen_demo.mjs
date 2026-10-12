import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const CL = JSON.parse(fs.readFileSync("build/clips.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);
const P=(pat,ink,acc,hl,hlt,term,wire,vsh)=>({pat,ink,acc,hl,hlt,term,wire,vsh});
const PAL = {
 hook:    P("t-sunrise","#3A1A0D","#E4572E","#E4572E","#FFFFFF","#2B1208","rgba(58,26,13,.5)","8px 8px 0 #3A1A0D"),
 what:    P("t-terrazzo","#1F2937","#0F766E","#0F766E","#FFFFFF","#111827","rgba(31,41,55,.45)","8px 8px 0 #1F2937"),
 setup:   P("t-check","#082F49","#0284C7","#0369A1","#FFFFFF","#082F49","rgba(8,47,73,.5)","8px 8px 0 #082F49"),
 rec:     P("t-arcs","#431407","#EA580C","#C2410C","#FFFFFF","#431407","rgba(67,20,7,.5)","8px 8px 0 #431407"),
 result:  P("t-ruled","#052E16","#15803D","#166534","#FFFFFF","#052E16","rgba(5,46,22,.5)","8px 8px 0 #052E16"),
 summary: P("t-polka","#422006","#CA8A04","#854D0E","#FEF3C7","#422006","rgba(66,32,6,.5)","8px 8px 0 #422006"),
 tokens:  P("t-vstripe","#E0F2FE","#38BDF8","#38BDF8","#0C4A6E","#0A1A33","rgba(224,242,254,.5)","0 0 0 6px rgba(56,189,248,.25)"),
 note:    P("t-rings","#4C0519","#E11D48","#BE123C","#FFFFFF","#4C0519","rgba(76,5,25,.5)","8px 8px 0 #4C0519"),
 cta:     P("t-split","#F8FAFC","#FBBF24","#FBBF24","#1F2937","#0F2A2E","rgba(248,250,252,.6)","0 0 0 6px rgba(251,191,36,.3)")
};
const vars=id=>{const p=PAL[id];return `--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--hlt:${p.hlt};--term:${p.term};--wire:${p.wire};--vsh:${p.vsh};`;};
const st=id=>sc[id].start, ph=(id,i)=>sc[id].phrases[i];
const scenes={};
scenes.hook=`
  <div class="big" id="hk-h"><span class="ln">Họp xong</span><span class="ln acc">là quên sạch?</span></div>
  <div class="bigtitle" id="hk-t"><span class="mono">HƯỚNG DẪN CHI TIẾT</span><b>Meetily</b><span class="mono sub">họp tiếng Việt · đo số token</span></div>`;
scenes.what=`
  <div class="wlogo" id="wh-logo">Meetily</div>
  <div class="chips" id="wh-chips"><span class="chip mono hotchip">Mã nguồn mở · MIT</span><span class="chip mono">Chạy trên máy bạn</span><span class="chip mono">Whisper / Parakeet</span><span class="chip mono">Tóm tắt bằng model có sẵn</span></div>`;
for (const id of ["setup","rec","result","summary"]) scenes[id]="";
scenes.tokens=`
  <div class="chart" id="tk-chart">
    <div class="grp" id="g1"><div class="bars2"><div class="bar in" style="height:${Math.round(855/849*300)}px"><b>855</b></div><div class="bar out" style="height:${Math.round(648/849*300)}px"><b>648</b></div></div><div class="mono gl">LƯỢT 1 · viết</div></div>
    <div class="grp" id="g2"><div class="bars2"><div class="bar in" style="height:${Math.round(839/849*300)}px"><b>839</b></div><div class="bar out" style="height:300px"><b>849</b></div></div><div class="mono gl">LƯỢT 2 · dịch</div></div>
    <div class="legend mono"><i class="in"></i>vào <i class="out"></i>ra</div>
  </div>
  <div class="term" id="tk-log"><div class="termbody mono"><span class="dim">①</span> Prompt 855 · Output 648 · 1.93 tok/s<br><span class="dim">②</span> Prompt 839 · Output 849 · 1.75 tok/s<br><span class="dim"># log thật của app</span></div></div>
  <div class="total" id="tk-total"><span class="mono">TỔNG</span><b>3.191</b><span class="mono">token</span></div>`;
scenes.note=`
  <div class="nrow" id="nt-1"><b>1</b><span>CPU thì rất chậm; có GPU nhanh hơn</span></div>
  <div class="nrow" id="nt-2"><b>2</b><span>Báo mọi người khi ghi âm cuộc họp</span></div>
  <div class="nrow" id="nt-3"><b>3</b><span>Soát lại bản tóm tắt trước khi gửi</span></div>`;
scenes.cta=`
  <div class="big sm" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono">github.com/<b>Zackriya-Solutions</b>/meetily</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;
const sceneHTML=T.scenes.map(s=>`
  <div class="scene clip" style="${vars(s.id)}" id="sc-${s.id}" data-start="${f(s.start)}" data-duration="${f(s.end-s.start+(s.id==="cta"?0:0.3))}" data-track-index="1"><div class="sw"><div class="bg ${PAL[s.id].pat}"></div><div class="lbl mono">${s.label}</div><div class="hdl mono">@ai.unbox0026</div><div class="vis">${scenes[s.id]}</div></div></div>`).join("");
let vidHTML="";
const screens=T.scenes.filter(s=>s.layout==="screen");
screens.forEach(s=>s.phrases.forEach((p,i)=>{
  const c=CL[`${s.id}_${i}`]; const d=f(p.end-p.start+0.45);
  const media=c.kind==="video"
   ?`<video id="vv-${s.id}-${i}" src="${c.file}" muted playsinline class="clip" data-start="${f(p.start)}" data-duration="${d}" data-track-index="2" data-has-audio="false"></video>`
   :`<img class="still" id="vi-${s.id}-${i}" src="${c.file}">`;
  const badge=c.speed>=3?`<div class="badge mono">TUA NHANH ×${Math.round(c.speed)}</div>`:"";
  vidHTML+=`<div class="vwrap" id="vw-${s.id}-${i}" style="${vars(s.id)}">${media}${badge}<div class="tag mono">${esc(p.tag)}</div></div>`;
}));
const capHTML=T.scenes.flatMap(s=>s.phrases.map((p,i)=>{
  const lines=p.show.split("\n").map(l=>`<span class="cl"><span>${esc(l).replace(/\*([^*]+)\*/g,'<span class="hl">$1</span>')}</span></span>`).join("");
  return `<div class="cap clip" style="${vars(s.id)}" id="cap-${s.id}-${i}" data-start="${f(p.start)}" data-duration="${f(Math.max(0.3,p.end-p.start+0.1))}" data-track-index="3"><div class="capin">${lines}</div></div>`;
})).join("\n  ");
let js=""; const L=s=>{js+=s+"\n";};
T.scenes.slice(1).forEach(s=>L(`tl.fromTo("#sc-${s.id} .sw",{opacity:0},{opacity:1,duration:0.3,ease:"power1.inOut"},${f(s.start)});`));
L(`tl.fromTo("#prog",{scaleX:0},{scaleX:1,duration:${DUR},ease:"none",transformOrigin:"0 50%"},0);`);
T.scenes.forEach(s=>{L(`tl.set(".rule",{backgroundColor:"${PAL[s.id].ink}"},${f(s.start+0.12)});`);L(`tl.set("#prog",{backgroundColor:"${PAL[s.id].acc}"},${f(s.start+0.12)});`);});
T.scenes.forEach(s=>s.phrases.forEach((p,i)=>L(`tl.from("#cap-${s.id}-${i} .cl",{y:26,opacity:0,duration:0.22,stagger:0.07,ease:"power2.out"},${f(p.start)});`)));
const lines=(sel,t,d=0.5,gap=0.12)=>L(`tl.from("${sel} .ln",{yPercent:110,duration:${d},stagger:${gap},ease:"power3.out"},${f(t)});`);
screens.forEach(s=>s.phrases.forEach((p,i)=>{
  L(`tl.fromTo("#vw-${s.id}-${i}",{opacity:0},{opacity:1,duration:0.2},${f(p.start)});`);
  if(i===0) L(`tl.from("#vw-${s.id}-${i}",{y:40,duration:0.45,ease:"power3.out"},${f(p.start)});`);
  L(`tl.to("#vw-${s.id}-${i}",{opacity:0,duration:0.2},${f(p.end+0.2)});`);
  const c=CL[`${s.id}_${i}`];
  if(c.kind!=="video"){
    const dd=f(p.end-p.start+0.3);
    if(s.id==="result") L(`tl.fromTo("#vi-${s.id}-${i}",{scale:1.6,x:-95,y:0,transformOrigin:"0 0"},{scale:1.6,x:-95,y:-330,duration:${dd},ease:"power1.inOut"},${f(p.start)});`);
    else L(`tl.fromTo("#vi-${s.id}-${i}",{scale:1.5,x:-90,y:-190,transformOrigin:"0 0"},{scale:1.5,x:-90,y:-470,duration:${dd},ease:"power1.inOut"},${f(p.start)});`);
  }
}));
{ const t=st("hook"), p2=ph("hook",1).start;
  lines("#hk-h",t+0.05,0.6,0.22);
  L(`tl.to("#hk-h",{opacity:0,y:-30,duration:0.3},${f(p2-0.1)});`);
  L(`tl.from("#hk-t",{scale:0.85,opacity:0,duration:0.55,ease:"back.out(1.6)"},${f(p2+0.1)});`); }
{ const t=st("what");
  L(`tl.from("#wh-logo",{x:-80,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#wh-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.5,ease:"back.out(1.8)"},${f(t+0.9)});`); }
{ L(`tl.from("#tk-chart",{opacity:0,duration:0.3},${f(st("tokens")+0.05)});`);
  L(`tl.from("#g1",{opacity:0,y:40,duration:0.45,ease:"back.out(1.5)"},${f(ph("tokens",0).start+0.8)});`);
  L(`tl.from("#g2",{opacity:0,y:40,duration:0.45,ease:"back.out(1.5)"},${f(ph("tokens",1).start+0.2)});`);
  L(`tl.from("#tk-log",{opacity:0,y:30,duration:0.4},${f(ph("tokens",1).start+0.4)});`);
  L(`tl.from("#tk-total",{scale:0.7,opacity:0,duration:0.5,ease:"back.out(2)"},${f(ph("tokens",2).start+0.2)});`); }
{ [1,2,3].forEach(n=>L(`tl.from("#nt-${n}",{x:-80,opacity:0,duration:0.5,ease:"power3.out"},${f(st("note")+0.2+(n-1)*1.4)});`)); }
{ const t=st("cta");
  L(`tl.from("#ct-card",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.7)});`);
  lines("#ct-h",t+0.1,0.55,0.2);
  L(`tl.from("#ct-h2",{scale:0.8,opacity:0,duration:0.45,ease:"back.out(1.8)"},${f(ph("cta",1).start+0.1)});`); }
const FONTS=[["Be Vietnam Pro","be-vietnam-pro",[500,700,800]],["JetBrains Mono","jetbrains-mono",[500,700]],["Anton","anton",[400]]].map(([fam,file,ws])=>ws.map(w=>`
@font-face{font-family:"${fam}";font-weight:${w};src:url(assets/fonts/${file}-latin-${w}-normal.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:"${fam}";font-weight:${w};src:url(assets/fonts/${file}-vietnamese-${w}-normal.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;}`).join("")).join("");
const CSS=`${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#111}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:"Be Vietnam Pro",sans-serif}
.mono{font-family:"JetBrains Mono",monospace;font-weight:500}
.sw,.scene,.bg{position:absolute;left:0;top:0;width:1080px;height:1920px}
.scene{color:var(--ink)}
.lbl{position:absolute;left:60px;top:150px;font-size:27px;font-weight:700;letter-spacing:.16em;color:var(--ink)}
.hdl{position:absolute;left:560px;width:340px;text-align:right;top:150px;font-size:27px;font-weight:700;color:var(--acc)}
.rule{position:absolute;left:60px;top:200px;width:840px;height:3px;z-index:5;background:#333}
#prog{position:absolute;left:60px;top:198px;width:840px;height:7px;z-index:6;background:#E2531F}
.vis{position:absolute;left:60px;top:250px;width:840px;height:900px}
.bg.t-sunrise{background:repeating-linear-gradient(115deg,#FFE8D1 0 140px,#FFD9B8 140px 280px)}
.bg.t-sunrise::after{content:"";position:absolute;right:-200px;top:1100px;width:620px;height:620px;border-radius:50%;background:#FF7A59;opacity:.85}
.bg.t-terrazzo{background-color:#F3EDE4;background-image:radial-gradient(circle at 20px 30px,#E4572E 7px,transparent 8px),radial-gradient(circle at 120px 90px,#0F766E 9px,transparent 10px),radial-gradient(circle at 210px 40px,#FBBF24 6px,transparent 7px),radial-gradient(circle at 70px 170px,#6B7280 5px,transparent 6px),radial-gradient(circle at 180px 200px,#E4572E 5px,transparent 6px);background-size:260px 260px}
.bg.t-check{background-color:#DDF1FF;background-image:conic-gradient(rgba(2,132,199,.10) 25%,transparent 0 50%,rgba(2,132,199,.10) 0 75%,transparent 0);background-size:80px 80px}
.bg.t-arcs{background-color:#FFE9DD;background-image:repeating-radial-gradient(circle at 100% 100%,rgba(234,88,12,.18) 0 3px,transparent 3px 70px)}
.bg.t-ruled{background-color:#E2F7EC;background-image:repeating-linear-gradient(180deg,rgba(21,128,61,.16) 0 2px,transparent 2px 54px)}
.bg.t-polka{background-color:#FFF6D6;background-image:radial-gradient(rgba(202,138,4,.28) 16px,transparent 17px);background-size:110px 110px}
.bg.t-vstripe{background-color:#0F172A;background-image:repeating-linear-gradient(90deg,rgba(56,189,248,.10) 0 3px,transparent 3px 90px),radial-gradient(circle at 80% 20%,rgba(56,189,248,.22),transparent 50%)}
.bg.t-rings{background-color:#FFE4EA;background-image:radial-gradient(circle at 12% 80%,transparent 150px,rgba(225,29,72,.22) 152px 158px,transparent 160px),radial-gradient(circle at 88% 22%,transparent 220px,rgba(225,29,72,.22) 222px 228px,transparent 230px)}
.bg.t-split{background:linear-gradient(115deg,#0F2A2E 0 58%,#134E4A 58% 100%)}
.bg.t-split::after{content:"";position:absolute;right:-120px;bottom:-100px;width:520px;height:520px;border-radius:50%;background:#FBBF24;opacity:.9}
.cap{position:absolute;left:60px;top:1180px;width:840px;height:260px;z-index:20}
.capin{display:flex;flex-direction:column;align-items:flex-start;gap:12px}
.cl{display:block}
.cl>span{display:inline-block;background:#fff;color:#14181A;font-weight:800;font-size:46px;line-height:1.25;padding:6px 20px;letter-spacing:-0.01em;border:3px solid var(--hl);box-shadow:0 10px 24px rgba(0,0,0,.14)}
.hl{background:var(--hl);color:var(--hlt);padding:0 10px;margin:0 -4px}
.dim{color:#9AB0C4}
.big{font-family:Anton,sans-serif;font-weight:400;font-size:150px;line-height:1.15;overflow:hidden;position:absolute;left:0;top:20px}
.big.sm{font-size:150px}
.ln{display:block;line-height:1.2}.acc{color:var(--acc)}
.bigtitle{position:absolute;left:0;top:60px;display:flex;flex-direction:column;gap:14px}
.bigtitle b{font-family:Anton,sans-serif;font-weight:400;font-size:230px;line-height:1.05;color:var(--ink)}
.bigtitle .mono{font-size:30px;font-weight:700;letter-spacing:.12em;color:var(--acc)}.bigtitle .sub{color:var(--ink);letter-spacing:.02em;font-size:28px}
.wlogo{font-family:Anton,sans-serif;font-size:220px;line-height:1.05;color:var(--ink);position:absolute;left:0;top:10px}
#wh-chips{position:absolute;left:0;top:340px;flex-direction:column;align-items:flex-start;gap:18px}
.chips{display:flex;flex-wrap:wrap;gap:16px}
.chip{color:#14181A;background:#fff;border:2px solid var(--ink);border-radius:10px;padding:16px 26px;font-size:36px;font-weight:700}
.chip.hotchip{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.vwrap{position:absolute;left:60px;top:250px;width:840px;height:880px;overflow:hidden;background:#fff;border:3px solid var(--ink);box-shadow:var(--vsh);opacity:0;z-index:5}
.vwrap video,.vwrap img{position:absolute;left:0;top:0;width:840px;height:880px;display:block}
.badge{position:absolute;right:12px;top:12px;background:#111;color:#FFE14D;font-size:26px;font-weight:700;padding:8px 14px;letter-spacing:.08em;z-index:3}
.tag{position:absolute;left:0;bottom:0;background:var(--hl);color:var(--hlt);font-size:26px;font-weight:700;padding:10px 18px;letter-spacing:.06em;z-index:3}
.term{background:var(--term);color:#E6F0E6;border:1px solid var(--wire);box-shadow:var(--vsh)}
.termbody{padding:16px 22px;font-size:25px;line-height:1.55}
.chart{position:absolute;left:0;top:10px;width:840px;height:430px;display:flex;gap:70px;align-items:flex-end;padding:0 40px}
.grp{display:flex;flex-direction:column;align-items:center}
.bars2{display:flex;gap:14px;align-items:flex-end;height:310px}
.bar{width:120px;display:flex;align-items:flex-start;justify-content:center;font-family:Anton,sans-serif;font-size:42px;color:#082F49;padding-top:6px}
.bar.in{background:#7DD3FC}.bar.out{background:#FBBF24}
.gl{font-size:24px;font-weight:700;letter-spacing:.08em;margin-top:12px}
.legend{position:absolute;right:0;top:-10px;font-size:24px;display:flex;gap:10px;align-items:center}.legend i{display:inline-block;width:22px;height:22px}.legend i.in{background:#7DD3FC}.legend i.out{background:#FBBF24;margin-left:14px}
#tk-log{position:absolute;left:0;top:470px;width:840px}
.total{position:absolute;left:0;top:690px;display:flex;align-items:baseline;gap:20px;background:var(--acc);color:#0C4A6E;padding:6px 34px}
.total b{font-family:Anton,sans-serif;font-size:140px;font-weight:400;line-height:1.1}.total span{font-size:30px;font-weight:700}
.nrow{display:flex;align-items:center;gap:24px;background:#fff;color:#14181A;border:3px solid var(--ink);box-shadow:var(--vsh);padding:22px 26px;margin-bottom:34px}
.nrow b{font-family:Anton,sans-serif;font-size:90px;color:var(--acc);font-weight:400;min-width:60px}.nrow span{font-size:42px;font-weight:800;line-height:1.25}
.urlcard{position:absolute;left:0;top:410px;width:840px;background:#fff;border:2px solid var(--ink);box-shadow:var(--vsh);color:#14181A}
.urlbar{display:flex;align-items:center;gap:10px;padding:12px 20px;background:#E5EEF0;font-size:22px;color:#456}.urlbar i{width:14px;height:14px;border-radius:50%;background:#B5C7CC;display:block}
.urlbody{padding:28px 24px;font-size:31px;font-weight:700}.urlbody b{color:#0F766E}
.follow{position:absolute;left:0;top:640px;display:flex;align-items:center;gap:20px}
.handle{background:#fff;color:#0F2A2E;padding:16px 26px;font-size:40px;font-weight:700}
.pill{background:var(--hl);color:var(--hlt);font-weight:800;font-size:40px;padding:18px 30px;border-radius:999px}
`;
const html=`<!doctype html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920">
<script src="assets/gsap.min.js"></script>
<style>${CSS}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  <div class="rule"></div><div id="prog"></div>
  ${sceneHTML}
  ${vidHTML}
  ${capHTML}
  <audio id="mix" src="audio/mix.wav" data-start="0" data-duration="${DUR}" data-track-index="0" data-volume="1"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
${js}
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
</script></body></html>`;
fs.writeFileSync("index.html",html); console.log("built",DUR);
