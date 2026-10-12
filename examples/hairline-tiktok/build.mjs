import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);


const PAL = {
 hook:    {pat:"t-grey",ink:"#1E1E1E",acc:"#C4263F",hl:"#1E1E1E",hlt:"#FFFFFF",term:"#1E1E1E",wire:"rgba(30,30,30,.55)",vsh:"none",hf:"Anton, sans-serif",rule:"#1E1E1E",prog:"#C4263F"},
 intro:   {pat:"bp",ink:"#EAF5FF",acc:"#FFD166",hl:"#FFD166",hlt:"#0E2A47",term:"#06182B",wire:"rgba(150,200,255,.55)",vsh:"0 0 0 8px rgba(150,200,255,.1)",hf:"JetBrains Mono, monospace",rule:"#EAF5FF",prog:"#FFD166",paper:"#0E2A47",dot:"rgba(150,200,255,.15)",dot2:"rgba(150,200,255,.32)"},
 demo1:   {pat:"t-riso",ink:"#1B1B1B",acc:"#E0245E",hl:"#00968A",hlt:"#FFFFFF",term:"#1B1B1B",wire:"rgba(27,27,27,.6)",vsh:"12px 12px 0 #1B1B1B",hf:"JetBrains Mono, monospace",rule:"#1B1B1B",prog:"#E0245E"},
 demo2:   {pat:"t-flat",ink:"#1B1B1B",acc:"#1B1B1B",hl:"#1B1B1B",hlt:"#FFD23F",term:"#1B1B1B",wire:"rgba(27,27,27,.6)",vsh:"12px 12px 0 #1B1B1B",hf:"JetBrains Mono, monospace",rule:"#1B1B1B",prog:"#1B1B1B"},
 code:    {pat:"t-terminal",ink:"#7DFFB0",acc:"#FFD166",hl:"#7DFFB0",hlt:"#07110C",term:"#07110C",wire:"rgba(125,255,176,.5)",vsh:"0 0 0 8px rgba(125,255,176,.1)",hf:"JetBrains Mono, monospace",rule:"#7DFFB0",prog:"#FFD166"},
 install: {pat:"t-brand",ink:"#FFFFFF",acc:"#FFD166",hl:"#FFD166",hlt:"#1A1A6E",term:"#0B0B3A",wire:"rgba(255,255,255,.6)",vsh:"0 0 0 8px rgba(255,255,255,.12)",hf:"JetBrains Mono, monospace",rule:"#FFFFFF",prog:"#FFD166",brand:"#3535C8"},
 skill:   {pat:"t-rings",ink:"#FFFFFF",acc:"#FFD166",hl:"#FFD166",hlt:"#10131A",term:"#0D0A22",wire:"rgba(255,255,255,.5)",vsh:"0 0 0 8px rgba(255,255,255,.1)",hf:"JetBrains Mono, monospace",rule:"#FFFFFF",prog:"#FFD166",img:"url(assets/img/vault_still.jpg)"},
 cta:     {pat:"bp",ink:"#EAF5FF",acc:"#FFD166",hl:"#FFD166",hlt:"#0E2A47",term:"#06182B",wire:"rgba(150,200,255,.55)",vsh:"0 0 0 8px rgba(150,200,255,.1)",hf:"JetBrains Mono, monospace",rule:"#EAF5FF",prog:"#FFD166",paper:"#0E2A47",dot:"rgba(150,200,255,.15)",dot2:"rgba(150,200,255,.32)"}
};
const vars = id=>{const p=PAL[id];return `--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--hlt:${p.hlt};--term:${p.term};--wire:${p.wire};--vsh:${p.vsh};--hf:${p.hf};`+(p.paper?`--paper:${p.paper};--dot:${p.dot};--dot2:${p.dot2};`:"")+(p.brand?`--brand:${p.brand};`:"")+(p.img?`--img:${p.img};`:"");};

// ---- scene markup -------------------------------------------------------
const st = id=>sc[id].start, en=id=>sc[id].end, ph=(id,i)=>sc[id].phrases[i];
const scenes = {};
scenes.hook = `
  <div class="h1 ink" id="hk-h"><span class="ln">Web toàn</span><span class="ln acc">ảnh tĩnh.</span></div>
  <div class="mock wire" id="hk-win">
    <div class="urlbar mono"><i></i><i></i><i></i><span>landing-page.html</span></div>
    <div class="phgrid">${[0,1,2,3].map(i=>`<div class="ph" id="hk-p${i}"><span class="mono">ảnh minh họa.png</span></div>`).join("")}</div>
  </div>
  <div class="curring" id="hk-cur"></div>
  <div class="chip mono dullchip" id="hk-dull">…không có gì xảy ra</div>`;
scenes.intro = `
  <div class="mark" id="in-mark"><span class="ln">hairline</span></div>
  <div class="chips" id="in-chips"><span class="chip mono">33 hình</span><span class="chip mono">MIT</span><span class="chip mono">0 phụ thuộc</span><span class="chip mono hotchip">React · DOM</span></div>
  <div class="shot still" id="in-shot"><img id="in-img" src="assets/img/terrain_still.jpg"></div>`;
scenes.demo1 = `
  <div class="chips lv" id="d1-chips"><span class="chip mono hotchip">Thử live: hairline.lucasmarkes.com</span></div>`;
scenes.demo2 = ``;
scenes.code = ``;
scenes.install = `
  <div class="term" id="is-t1"><div class="termbar"><i></i><i></i><i></i><span>terminal</span></div><div class="termbody mono"><div><span class="dim">$</span> npm i @lucasmarkes/hairline</div></div></div>
  <div class="term" id="is-t2"><div class="termbar"><i></i><i></i><i></i><span>Hero.tsx</span></div><div class="termbody mono code">
    <div><span class="kw">import</span> { Terrain } <span class="kw">from</span> <span class="str">"@lucasmarkes/hairline/react"</span>;</div>
    <div>&nbsp;</div>
    <div><span class="kw">export function</span> Hero() {</div>
    <div>&nbsp;&nbsp;<span class="kw">return</span> &lt;Terrain /&gt;;</div>
    <div>}</div></div></div>
  <div class="chips" id="is-chips"><span class="chip mono hotchip">intensity 0 → 1</span><span class="chip mono">theme: auto · light · dark</span><span class="chip mono">6 biến --hairline-*</span></div>`;
scenes.skill = `
  <div class="term" id="sk-t"><div class="termbar"><i></i><i></i><i></i><span>agent</span></div><div class="termbody mono">
    <div id="sk-l1"><span class="dim">$</span> npx skills add lucasmarkes/hairline</div>
    <div id="sk-l2"><span class="dim">&gt;</span> /hairline-create a sales funnel</div>
    <div id="sk-l3" class="ok">→ hairline-&lt;tên&gt;.html</div></div></div>
  <div class="chips" id="sk-chips"><span class="chip mono">Claude Code</span><span class="chip mono">Cursor</span><span class="chip mono">Codex</span></div>
  <div class="chip mono hotchip" id="sk-note">1 tệp HTML, mở thẳng từ ổ đĩa</div>`;
scenes.cta = `
  <div class="h1 ink" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono" style="font-size:34px">github.com/<b>lucasmarkes</b>/hairline</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;

// real renders of the library (Playwright, deterministic clock) as root-level <video> clips
const VID = [
  {id:"demo1", scene:"demo1", src:"assets/vid/demo1.mp4", dur:6.7},
  {id:"demo2", scene:"demo2", src:"assets/vid/demo2.mp4", dur:7.8},
  {id:"code",  scene:"code",  src:"assets/vid/code.mp4",  dur:6.7}
];
const vidHTML = VID.map(v=>`
  <div class="vwrap" id="vw-${v.id}" style="${vars(v.scene)}"><video id="vv-${v.id}" src="${v.src}" muted playsinline class="clip" data-start="${f(st(v.scene))}" data-duration="${v.dur}" data-track-index="2" data-has-audio="false"></video></div>`).join("");

const sceneHTML = T.scenes.map(s=>`
  <div class="scene clip" style="${vars(s.id)}" id="sc-${s.id}" data-start="${f(s.start)}" data-duration="${f(s.end-s.start+(s.id==="cta"?0:0.3))}" data-track-index="1"><div class="sw"><div class="bg ${PAL[s.id].pat}"></div><div class="lbl mono">${s.label}</div><div class="hdl mono">@ai.unbox0026</div><div class="vis">${scenes[s.id]}</div></div></div>`).join("");

const capHTML = T.scenes.flatMap(s=>s.phrases.map((p,i)=>{
  const lines = p.show.split("\n").map(l=>`<span class="cl"><span>${esc(l).replace(/\*([^*]+)\*/g,'<span class="hl">$1</span>')}</span></span>`).join("");
  return `<div class="cap clip" style="${vars(s.id)}" id="cap-${s.id}-${i}" data-start="${f(p.start)}" data-duration="${f(Math.max(0.3,p.end-p.start+0.1))}" data-track-index="3"><div class="capin">${lines}</div></div>`;
})).join("\n  ");

// ---- timeline JS --------------------------------------------------------
let js = "";
const L = (s)=>{js+=s+"\n";};
// crossfade between scenes
T.scenes.slice(1).forEach(s=>{ L(`tl.fromTo("#sc-${s.id} .sw",{opacity:0},{opacity:1,duration:0.3,ease:"power1.inOut"},${f(s.start)});`); });
// progress
L(`tl.fromTo("#prog",{scaleX:0},{scaleX:1,duration:${DUR},ease:"none",transformOrigin:"0 50%"},0);`);
// captions
T.scenes.forEach(s=>s.phrases.forEach((p,i)=>{
  L(`tl.from("#cap-${s.id}-${i} .cl",{y:26,opacity:0,duration:0.22,stagger:0.07,ease:"power2.out"},${f(p.start)});`);
}));
// generic lines reveal helper
const lines=(sel,t,d=0.5,gap=0.12)=>L(`tl.from("${sel} .ln",{yPercent:110,duration:${d},stagger:${gap},ease:"power3.out"},${f(t)});`);

// ---- scene animations ---------------------------------------------------
T.scenes.forEach(sx=>{ L(`tl.set(".rule",{backgroundColor:"${PAL[sx.id].rule}"},${f(sx.start+0.12)});`); L(`tl.set("#prog",{backgroundColor:"${PAL[sx.id].prog}"},${f(sx.start+0.12)});`); });
VID.forEach(v=>{
  const t0=st(v.scene), t1=en(v.scene);
  L(`tl.fromTo("#vw-${v.id}",{opacity:0,y:40},{opacity:1,y:0,duration:0.4,ease:"power3.out"},${f(t0+0.05)});`);
  L(`tl.to("#vw-${v.id}",{opacity:0,duration:0.3},${f(t1-0.05)});`);
});
// hook
{ const t=st("hook");
  lines("#hk-h",t+0.05,0.55,0.25);
  L(`tl.from("#hk-win",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.6)});`);
  L(`tl.from(".ph",{opacity:0,scale:0.92,duration:0.35,stagger:0.12,ease:"power2.out"},${f(t+1.0)});`);
  const p2=ph("hook",1).start;
  L(`tl.fromTo("#hk-cur",{x:560,y:520,opacity:0},{x:560,y:520,opacity:1,duration:0.25},${f(p2)});`);
  L(`tl.to("#hk-cur",{x:150,y:420,duration:0.55,ease:"sine.inOut"},${f(p2+0.25)});`);
  L(`tl.to("#hk-cur",{x:520,y:640,duration:0.55,ease:"sine.inOut"},${f(p2+0.85)});`);
  L(`tl.from("#hk-dull",{opacity:0,y:30,duration:0.4,ease:"power2.out"},${f(p2+0.8)});`); }
// intro
{ const t=st("intro");
  lines("#in-mark",t+0.1,0.6);
  L(`tl.from("#in-chips .chip",{opacity:0,y:30,duration:0.35,stagger:0.45,ease:"back.out(1.8)"},${f(t+0.9)});`);
  L(`tl.from("#in-shot",{y:70,opacity:0,duration:0.55,ease:"power3.out"},${f(t+1.4)});`); }
// demo1
{ const t=st("demo1");
  L(`tl.from("#d1-chips .chip",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(t+1.2)});`); }
// install
{ const t=st("install");
  L(`tl.from("#is-t1",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#is-t2",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+0.9)});`);
  L(`tl.from("#is-chips .chip",{opacity:0,y:30,duration:0.35,stagger:0.3,ease:"back.out(1.8)"},${f(ph("install",1).start+0.2)});`); }
// skill
{ const t=st("skill");
  L(`tl.from("#sk-t",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#sk-l1",{opacity:0,x:-20,duration:0.35},${f(t+0.6)});`);
  L(`tl.from("#sk-l2",{opacity:0,x:-20,duration:0.35},${f(t+2.2)});`);
  L(`tl.from("#sk-l3",{opacity:0,x:-20,duration:0.35},${f(t+4.0)});`);
  L(`tl.from("#sk-chips .chip",{opacity:0,y:30,duration:0.35,stagger:0.3,ease:"back.out(1.8)"},${f(t+2.6)});`);
  L(`tl.from("#sk-note",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(t+4.4)});`); }
// cta
{ const t=st("cta");
  L(`tl.from("#ct-card",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.7)});`);
  lines("#ct-h",t+0.1,0.55,0.2);
  L(`tl.from("#ct-h2",{scale:0.8,opacity:0,duration:0.45,ease:"back.out(1.8)"},${f(ph("cta",1).start+0.1)});`); }

const wipes = "";
const html = `<!doctype html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920">
<script src="assets/gsap.min.js"></script>
<style>
${[["Be Vietnam Pro","be-vietnam-pro",[500,700,800]],["JetBrains Mono","jetbrains-mono",[500,700]],["Anton","anton",[400]]].map(([fam,file,ws])=>ws.map(w=>`
@font-face{font-family:"${fam}";font-weight:${w};src:url(assets/fonts/${file}-latin-${w}-normal.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:"${fam}";font-weight:${w};src:url(assets/fonts/${file}-vietnamese-${w}-normal.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;}`).join("")).join("")}
:root{--paper:#FDF6EE;--card:#FFFFFF;--ink:#1E2B25;--acc:#B8380F;--grn:#158A55;--mut:#5F6F67}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--paper)}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"Be Vietnam Pro",sans-serif;color:#1E2B25;background:#FDF6EE}
.bg{position:absolute;left:0;top:0;width:1080px;height:1920px;background-color:var(--paper);
 background-image:radial-gradient(circle at 88% 22%,var(--glow),transparent 52%),radial-gradient(circle at 5% 70%,var(--glow2),transparent 45%),var(--pat);
 background-size:100% 100%,100% 100%,var(--ps);background-position:0 0,0 0,var(--pp)}
.bg.dots{--pat:radial-gradient(var(--dot) 2.6px,transparent 3.2px);--ps:60px 60px;--pp:30px 30px}
.bg.grid{--pat:linear-gradient(var(--dot) 1.5px,transparent 1.5px),linear-gradient(90deg,var(--dot) 1.5px,transparent 1.5px);--ps:72px 72px;--pp:0 0}
.bg.lines{--pat:linear-gradient(var(--dot) 2px,transparent 2px);--ps:100% 48px;--pp:0 0}
.bg.diag{--pat:repeating-linear-gradient(135deg,var(--dot) 0,var(--dot) 2px,transparent 2px,transparent 34px);--ps:auto;--pp:0 0}
.mono{font-family:"JetBrains Mono",monospace;font-weight:500}
.disp{font-family:"Anton","Be Vietnam Pro",sans-serif;font-weight:400}
.ink{color:var(--ink)}.acc{color:var(--acc)}.dim{color:#8FA197}
.sw{position:absolute;left:0;top:0;width:1080px;height:1920px}
.scene{position:absolute;left:0;top:0;width:1080px;height:1920px;color:var(--ink)}
.vis{position:absolute;left:60px;top:250px;width:840px;height:880px}
.lbl{position:absolute;left:60px;top:150px;font-size:27px;font-weight:700;letter-spacing:.16em;color:var(--ink)}
.hdl{position:absolute;left:560px;width:340px;text-align:right;top:150px;font-size:27px;font-weight:700;color:var(--acc)}
.ln{display:block;line-height:1.2}
.h1,.h2,.mark{overflow:hidden;font-family:"Anton","Be Vietnam Pro",sans-serif;font-weight:400;letter-spacing:.005em}
.h1{font-size:136px;padding-bottom:12px}.h2{font-size:104px;padding-bottom:10px}
.rule{position:absolute;left:60px;top:200px;width:840px;height:3px;background:#1E2B25;z-index:5}
#prog{position:absolute;left:60px;top:198px;width:840px;height:7px;background:#E2531F;z-index:6}
.wipe{position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:50}
/* captions */
.cap{position:absolute;left:60px;top:1180px;width:840px;height:260px;z-index:20}
.capin{display:flex;flex-direction:column;align-items:flex-start;gap:12px}
.cl{display:block}
.cl>span{display:inline-block;background:#fff;color:#14181A;font-weight:800;font-size:52px;line-height:1.25;padding:6px 22px;letter-spacing:-0.01em;border:3px solid var(--hl);box-shadow:0 10px 24px rgba(30,43,37,.14)}
.hl{background:var(--hl);color:#fff;padding:0 10px;margin:0 -4px}
#cap-cta-0 .cl>span{font-size:50px}
/* terminals */
.stackwrap{position:absolute;left:0;top:330px;width:840px}
#hk-h{font-size:118px}
.term{background:var(--term);color:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 44px rgba(30,43,37,.28);margin-bottom:26px}
.termbar{display:flex;align-items:center;gap:10px;padding:11px 20px;background:#2C3E36;font-size:22px;color:#BCD0C6}
.termbar i{width:14px;height:14px;border-radius:50%;background:#4E6459;display:block}
.termbar span{margin-left:14px;flex:1}.termbar b{color:#FF8A5C}
.termbody{padding:16px 24px;font-size:26px;line-height:1.5}
.cur{display:inline-block;width:14px;height:30px;background:#FF8A5C;vertical-align:-5px;margin-left:6px}
.term.big{margin-top:44px}.term.big .termbody{font-size:25px}
/* intro */
.logo{position:absolute;left:0;top:0;width:150px;height:150px}
.mark{position:absolute;left:0;top:170px;width:840px;font-size:270px;line-height:1.1;color:var(--ink)}
.repo{position:absolute;left:4px;top:500px;font-size:30px;color:var(--mut)}
.tag{position:absolute;left:0;top:590px;background:var(--hl);color:#fff;padding:18px 26px;font-size:30px;font-weight:700;border-radius:10px;box-shadow:0 12px 26px rgba(21,138,85,.3)}
/* shots */
.shot{position:relative;width:840px;height:700px;margin-top:20px;background:#fff;border:1px solid #D9CFC6;border-radius:18px;box-shadow:0 26px 54px rgba(120,60,40,.2);overflow:hidden}
.shot img{position:absolute;left:0;top:0;display:block}
#bd-img{height:900px;width:auto;left:-250px;top:-70px;transform-origin:0 0}
.shot.tall{height:680px;margin-top:30px}
#lg-img{height:auto;width:1900px;left:-410px;top:-130px}
#au-img{width:840px;height:auto}
#au-shot{height:593px}
.steps{display:flex;gap:16px;margin-top:56px}
.step{color:#14181A;flex:1;display:flex;gap:14px;align-items:center;background:#fff;border:2px solid var(--ink);border-radius:12px;padding:18px;font-weight:800;font-size:30px;letter-spacing:-0.01em}
.step b{font-size:22px;font-weight:700}
/* runtimes */
.bignum{display:flex;align-items:flex-end;gap:30px;height:260px;margin-top:10px}
.bignum .mono{font-family:"Anton",sans-serif;font-weight:400;font-size:230px;line-height:.95;letter-spacing:0;min-width:230px}
.bignum .h2{font-size:84px;padding-bottom:6px}
.chips{display:flex;flex-wrap:wrap;gap:16px;margin-top:44px}
.chip{color:#14181A;background:#fff;border:2px solid var(--ink);border-radius:10px;padding:14px 22px;font-size:33px;font-weight:700}
.chip.more{background:var(--ink);color:var(--paper)}
/* log / auto */
.flow,.pipe{display:flex;align-items:center;gap:12px;flex-wrap:nowrap}
.node{color:#14181A;background:#fff;border:2px solid var(--ink);border-radius:10px;padding:12px 16px;font-size:24px;font-weight:700;white-space:nowrap}
.node.hot{background:var(--hl);color:#fff;border-color:var(--hl)}
.arr{font-size:30px;font-weight:700}.arr.x{color:var(--acc)}
.pipe{margin-top:64px}
.pipe .node{font-size:22px;padding:12px 12px}
.node.lock{border-style:dashed}
.stamp{position:absolute;right:20px;top:740px;background:var(--acc);color:#fff;border-radius:10px;padding:12px 18px;font-size:26px;font-weight:700;box-shadow:0 12px 26px rgba(184,56,15,.35)}
/* stack */
#sk-a,#sk-b{position:absolute;left:0;top:0;width:840px}
.rows{border-top:3px solid var(--ink)}
.row{display:flex;align-items:baseline;gap:24px;padding:18px 0;border-bottom:3px solid var(--ink)}
.row .lab,.lab{font-size:24px;color:var(--mut);width:190px;letter-spacing:.06em}
.row .val{font-family:"Anton",sans-serif;font-weight:400;font-size:76px;letter-spacing:.005em;line-height:1.1}
.lic{top:20px}.lic .lab{margin-bottom:20px}.lic .h2{font-size:150px}
.licnote{margin-top:40px;font-size:38px;font-weight:500;line-height:1.4;color:var(--ink);border-left:8px solid var(--hl);padding-left:22px}

.mock{background:#fff;border:1px solid #D9CFC6;border-radius:18px;box-shadow:0 26px 54px rgba(120,60,40,.2);overflow:hidden;margin-top:30px}
.mock .urlbar{display:flex;align-items:center;gap:10px;padding:13px 20px;background:#E8F2EC;font-size:22px;color:#4C5E55}
.mock .urlbar i{width:14px;height:14px;border-radius:50%;background:#B9CFC3;display:block}
.chatbody{padding:26px 24px;display:flex;flex-direction:column;gap:18px;min-height:285px}
.bubble{max-width:82%;padding:18px 22px;border-radius:16px;font-size:30px;font-weight:600;line-height:1.35;color:#14181A}
.bubble.me{align-self:flex-end;background:var(--hl);color:#fff}
.bubble.ai{align-self:flex-start;background:#EDEFEA}
.bubble.warn{align-self:flex-start;background:#fff;color:var(--acc);border:3px dashed var(--acc);font-size:34px;font-weight:700}
.qchip{display:inline-block;margin-top:30px;background:var(--ink);color:var(--paper);font-size:42px;font-weight:700;padding:18px 28px;border-radius:14px}
.qchip b{color:#FFB596}
.cite{position:absolute;left:560px;top:690px;background:var(--hl);color:#fff;border-radius:10px;padding:10px 18px;font-size:30px;font-weight:700;box-shadow:0 12px 26px rgba(47,91,211,.35)}
.yt{position:absolute;left:0;top:20px;width:840px;margin-top:0}
.ytbody{padding:24px}
.player{height:340px;background:#14213D;border-radius:12px;display:flex;align-items:center;justify-content:center}
.play{width:0;height:0;border-left:70px solid #fff;border-top:42px solid transparent;border-bottom:42px solid transparent;margin-left:20px}
.track{position:relative;height:12px;background:#D7DFF0;border-radius:6px;margin:34px 0 22px}
.fill{height:12px;background:var(--hl);border-radius:6px;width:6%}
.marker{position:absolute;left:38%;top:-48px;background:var(--hl);color:#fff;font-size:22px;font-weight:700;padding:5px 12px;border-radius:8px}
.tline{font-size:25px;color:#14181A;padding:8px 0}
.tline.hot{background:var(--hl);color:#fff;padding:12px 16px;border-radius:10px;font-weight:700;margin-top:6px}
.chip.hotchip{background:var(--hl);color:#fff;border-color:var(--hl)}
#in-shot{height:400px;margin-top:30px}
#in-img{width:840px;height:auto}
#rd-img{height:1023px;width:auto;left:-200px;top:-40px}
#bk-img{height:1008px;width:auto;left:-570px;top:-130px}
#ms-img{height:1014px;width:auto;left:-760px;top:-50px}
#mm-img{height:700px;width:auto}
#mm-shot{height:560px}#mm-img{height:560px;left:-190px}
#bk-shot{height:600px}
#ms-shot{height:560px}
.stamp{top:auto}
#bk-stamp{position:absolute;right:20px;top:560px}
#ms-stamp{position:absolute;right:20px;top:520px}
.mark{position:static;font-size:200px;line-height:1.12}
.tag{position:static;display:inline-block;margin-top:6px}
#in-chips,#mm-chips{margin-top:26px}
#bk-steps{margin-top:40px}
#ms-flow{margin-top:44px}


.vwrap{position:absolute;left:60px;top:270px;width:840px;height:535px;border-radius:18px;overflow:hidden;background:#fff;border:1px solid #D9CFC6;box-shadow:0 26px 54px rgba(120,60,40,.2);opacity:0;z-index:5}
.vwrap video{position:absolute;left:0;top:0;width:840px;height:535px;object-fit:cover;display:block}
.chips.lv{position:absolute;left:0;top:590px;width:840px;margin-top:0}
.docbody{padding:28px 26px;min-height:330px}
.sk{height:22px;background:#E4E9E5;border-radius:6px;margin-bottom:16px}
.w90{width:90%}.w70{width:70%}.w82{width:82%}.w40{width:40%}
.typed{font-size:30px;margin-top:30px;color:#14181A}
.qchip{display:inline-block;margin-top:26px;background:var(--ink);color:var(--paper);font-size:42px;font-weight:700;padding:18px 28px;border-radius:14px}
.qchip b{color:#FFB596}
.bubble.warn{position:absolute;left:0;top:400px;background:#fff;color:var(--acc);border:3px dashed var(--acc);font-size:34px;font-weight:700;border-radius:16px;padding:18px 22px;max-width:100%}
.mock{background:#fff;border:1px solid #D9CFC6;border-radius:18px;box-shadow:0 26px 54px rgba(120,60,40,.2);overflow:hidden;margin-top:30px}
.mock .urlbar{display:flex;align-items:center;gap:10px;padding:13px 20px;background:#E8F2EC;font-size:22px;color:#4C5E55}
.mock .urlbar i{width:14px;height:14px;border-radius:50%;background:#B9CFC3;display:block}
.chip.hotchip{background:var(--hl);color:#fff;border-color:var(--hl)}
#in-shot{height:400px;margin-top:30px}
#in-img{width:840px;height:auto;top:-10px}
.shot.auto{height:auto}
.shot.auto img{position:static;width:840px;height:auto;display:block}
#pv-shot{margin-top:20px}
#pv-pop{position:absolute;left:0;top:20px;margin-top:0;width:840px}
#pv-chips{margin-top:40px}
.mark{position:static;font-size:230px;line-height:1.12}
.tag{position:static;display:inline-block;margin-top:6px}
#in-chips{margin-top:26px}

/* ===== BLUEPRINT family (video Hairline) ===== */
.bg.bp{background-color:var(--paper);
 background-image:linear-gradient(var(--dot2) 2.5px,transparent 2.5px),linear-gradient(90deg,var(--dot2) 2.5px,transparent 2.5px),linear-gradient(var(--dot) 1.5px,transparent 1.5px),linear-gradient(90deg,var(--dot) 1.5px,transparent 1.5px);
 background-size:216px 216px,216px 216px,54px 54px,54px 54px;background-position:0 0,0 0,0 0,0 0}
.bg.bp::after{content:"";position:absolute;inset:48px;border:2px solid var(--dot2)}
.rule{background:#EAF5FF}
#prog{background:#FFD166}
.h1,.h2,.mark{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:-0.05em}
.h1{font-size:104px;line-height:1.1}
.mark{position:static;font-size:152px;line-height:1.1}
.hl{background:var(--hl);color:var(--hlt,#fff)}
.cl>span{border-color:var(--hl)}
.chip.hotchip{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.chip.dullchip{position:absolute;left:0;top:700px;background:transparent;color:#9CC9F5;border:2px dashed rgba(150,200,255,.5)}
.term{background:var(--term);border:1px solid var(--dot2);box-shadow:none;margin-top:0;margin-bottom:26px}
.termbar{background:rgba(150,200,255,.12);color:#9CC9F5}
.termbody.code{font-size:22px;line-height:1.55}
.termbody .kw{color:#7FC1FF}.termbody .str{color:#FFD166}.termbody .ok{color:#7DFFB0}
#sk-l3{color:#7DFFB0;margin-top:6px}
.mock.wire{background:rgba(255,255,255,.04);border:2px solid rgba(150,200,255,.5);box-shadow:none}
.mock.wire .urlbar{background:rgba(150,200,255,.14);color:#9CC9F5}
.mock.wire .urlbar i{background:rgba(150,200,255,.5)}
.phgrid{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:22px}
.ph{height:210px;border:2px dashed rgba(150,200,255,.55);position:relative;display:flex;align-items:flex-end;justify-content:center;padding-bottom:12px;color:#7FA8D4;font-size:20px;
 background:linear-gradient(to top right,transparent calc(50% - 1px),rgba(150,200,255,.35) 50%,transparent calc(50% + 1px)),linear-gradient(to top left,transparent calc(50% - 1px),rgba(150,200,255,.35) 50%,transparent calc(50% + 1px))}
.curring{position:absolute;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:4px solid #FFD166;border-radius:50%;box-shadow:0 0 0 8px rgba(255,209,102,.2);opacity:0}
.vwrap{position:absolute;left:60px;top:270px;width:840px;height:672px;border-radius:6px;overflow:hidden;background:#0E2A47;border:2px solid rgba(150,200,255,.55);box-shadow:0 0 0 8px rgba(150,200,255,.08);opacity:0;z-index:5}
.vwrap video{position:absolute;left:0;top:0;width:840px;height:672px;object-fit:cover;display:block}
.chips.lv{position:absolute;left:0;top:730px;width:840px;margin-top:0}
.shot.still{height:430px;margin-top:30px;border-radius:6px;background:#0E2A47;border:2px solid rgba(150,200,255,.55);box-shadow:none}
#in-img{width:840px;height:auto;top:-110px}
#in-chips{margin-top:26px}
#is-chips{margin-top:30px}
#sk-chips{margin-top:26px}
#sk-note{margin-top:26px;display:inline-block}
.urlcard{border-radius:6px}
.urlbody b{color:#0E5FB5}
.pill{background:var(--hl);color:var(--hlt)}
.handle{background:var(--ink);color:var(--paper)}
/* cta */
.follow{display:flex;align-items:center;gap:20px;margin-top:34px}
.pill{background:var(--hl);color:#fff;font-weight:800;font-size:40px;padding:20px 30px;border-radius:999px}
.urlcard{margin-top:34px;background:#fff;border:1px solid #D9CFC6;border-radius:18px;box-shadow:0 26px 54px rgba(120,60,40,.2);overflow:hidden}
.urlbar{display:flex;align-items:center;gap:10px;padding:13px 20px;background:#E8F2EC;font-size:22px;color:var(--mut)}
.urlbar i{width:14px;height:14px;border-radius:50%;background:#B9CFC3;display:block}
.urlbody{padding:34px 28px;font-size:39px;font-weight:700;color:#14181A}
.urlbody b{color:var(--hl)}
.handle{display:inline-block;background:var(--ink);color:var(--paper);padding:20px 30px;border-radius:12px;font-size:46px;font-weight:700}
.urlcard .urlbody b{color:#0E5FB5}
.follow .pill{background:var(--hl);color:var(--hlt)}
#sk-t .termbody{font-size:28px;line-height:1.6}
#is-t1 .termbody{font-size:28px}

/* ===== per-slide FLEX backgrounds (video Hairline v2) ===== */
.bg.t-grey{background-color:#CFCFCA;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.07) 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0 3px,transparent 3px 9px);background-size:auto;background-position:0 0}
.bg.t-grey::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.25) 100%)}
.bg.t-riso{background-color:#F4EEE1;background-image:radial-gradient(circle at 16% 12%,rgba(255,90,140,.9) 0 160px,transparent 161px),radial-gradient(circle at 96% 28%,rgba(0,170,160,.85) 0 220px,transparent 221px),radial-gradient(rgba(30,30,30,.18) 2px,transparent 2.6px);background-size:100% 100%,100% 100%,14px 14px;background-position:0 0;background-blend-mode:multiply,multiply,normal}
.bg.t-riso::after{content:"";position:absolute;left:0;top:1360px;width:1080px;height:560px;background:#FF5A8C;mix-blend-mode:multiply;opacity:.9}
.bg.t-flat{background-color:#FFD23F;background-image:radial-gradient(circle at 100% 0,#FF5D3A 0 340px,transparent 341px),radial-gradient(circle at 0 100%,#1B1B1B 0 280px,transparent 281px),repeating-linear-gradient(135deg,rgba(0,0,0,.08) 0 14px,transparent 14px 44px);background-size:auto;background-position:0 0}
.bg.t-terminal{background-color:#07110C;background-image:repeating-linear-gradient(0deg,rgba(80,255,150,.07) 0 2px,transparent 2px 6px),radial-gradient(ellipse at 50% 35%,rgba(40,120,70,.38),transparent 65%);background-size:auto;background-position:0 0}
.bg.t-terminal::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.7) 100%)}
.bg.t-brand{background-color:var(--brand,#3535C8);background-image:linear-gradient(rgba(255,255,255,.16) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.16) 2px,transparent 2px);background-size:100% 480px,360px 100%;background-position:0 0}
.bg.t-screen{background:#10131A;overflow:hidden}
.bg.t-screen::before{content:"";position:absolute;inset:-100px;background-image:var(--img);background-size:cover;background-position:center;filter:blur(30px) saturate(1.4);opacity:.7}
.bg.t-screen::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,12,20,.45),rgba(10,12,20,.8))}
.rule{background:#EAF5FF}
.h1,.h2,.mark{font-family:var(--hf,"JetBrains Mono",monospace)}
.scene[id="sc-hook"] .h1{font-size:140px;font-weight:400;letter-spacing:.005em}
.mock.wire{background:rgba(255,255,255,.12);border:2px solid var(--wire);box-shadow:none}
.mock.wire .urlbar{background:rgba(0,0,0,.08);color:var(--ink)}
.mock.wire .urlbar i{background:var(--wire)}
.ph{border-color:var(--wire);color:var(--ink);background:linear-gradient(to top right,transparent calc(50% - 1px),var(--wire) 50%,transparent calc(50% + 1px)),linear-gradient(to top left,transparent calc(50% - 1px),var(--wire) 50%,transparent calc(50% + 1px))}
.chip.dullchip{color:var(--ink);border-color:var(--wire);background:rgba(255,255,255,.35)}
.curring{border-color:var(--acc);box-shadow:0 0 0 8px rgba(196,38,63,.18)}
.vwrap{border:2px solid var(--wire);box-shadow:var(--vsh);border-radius:6px}
.termbar{color:#9CC9F5}
.bg.t-rings{background-color:#150F2E;background-image:repeating-radial-gradient(circle at 88% 72%,rgba(190,160,255,.22) 0 3px,transparent 3px 64px),radial-gradient(circle at 88% 72%,rgba(120,80,255,.35),transparent 55%);background-size:auto;background-position:0 0}
#sk-t .termbody{font-size:32px;line-height:1.7}
#sk-chips .chip,#sk-note{font-size:34px}
#sk-note{margin-top:30px}
.scene[id="sc-install"] #is-chips .chip{font-size:34px}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  <div class="rule"></div><div id="prog"></div>
  ${sceneHTML}
  ${vidHTML}
  ${capHTML}
  ${wipes}
  <audio id="mix" src="audio/mix.wav" data-start="0" data-duration="${DUR}" data-track-index="0" data-volume="1"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
${js}
window.__timelines["main"] = tl;
</script></body></html>`;
fs.writeFileSync("index.html",html);
console.log("built", DUR);
