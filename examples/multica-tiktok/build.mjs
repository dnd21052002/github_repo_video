import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);


const PAL = {
 hook:    {paper:"#FDF6EE",glow:"#F4C4B0",glow2:"#F6DEC8",dot:"#DDBFB0",ink:"#1E2B25",acc:"#B8380F",hl:"#158A55",term:"#1E2B25",pat:"dots"},
 intro:   {paper:"#F0F6EF",glow:"#BFE3CC",glow2:"#DDEFD0",dot:"#B5CFBC",ink:"#14281F",acc:"#0F6B4A",hl:"#0F6B4A",term:"#14281F",pat:"lines"},
 board:   {paper:"#EEF3FC",glow:"#BFD4F7",glow2:"#DCE6FA",dot:"#BCCBE6",ink:"#14213D",acc:"#2F5BD3",hl:"#2F5BD3",term:"#14213D",pat:"grid"},
 runtimes:{paper:"#FFF8E3",glow:"#FADC82",glow2:"#FDEBB0",dot:"#E5CF8A",ink:"#2B2310",acc:"#C2410C",hl:"#2B2310",term:"#2B2310",pat:"dots"},
 log:     {paper:"#F4F0FD",glow:"#D6C8F5",glow2:"#E8DDFA",dot:"#CDBFEA",ink:"#231745",acc:"#6D3FCB",hl:"#6D3FCB",term:"#231745",pat:"diag"},
 auto:    {paper:"#FFF0EC",glow:"#FFB9A6",glow2:"#FFD9CC",dot:"#EDBDB0",ink:"#3A1410",acc:"#D9341F",hl:"#C42B17",term:"#3A1410",pat:"grid"},
 stack:   {paper:"#14201B",glow:"#24493A",glow2:"#1B3328",dot:"#2E4A3F",ink:"#F4EFE4",acc:"#FF8A5C",hl:"#158A55",term:"#0B1210",pat:"grid"},
 cta:     {paper:"#FDF6EE",glow:"#F4C4B0",glow2:"#F6DEC8",dot:"#DDBFB0",ink:"#1E2B25",acc:"#B8380F",hl:"#158A55",term:"#1E2B25",pat:"dots"}
};
const vars = id=>{const p=PAL[id];return `--paper:${p.paper};--glow:${p.glow};--glow2:${p.glow2};--dot:${p.dot};--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--term:${p.term}`;};

// ---- scene markup -------------------------------------------------------
const scenes = {};
scenes.hook = `
  <div class="h1 ink" id="hk-h"><span class="ln">4 tab.</span><span class="ln acc">4 lần giải thích.</span></div>
  <div class="stackwrap" id="hk-stack">
    ${["claude","codex","cursor","kimi"].map((n,i)=>`
    <div class="term hk-t" id="hk-t${i}">
      <div class="termbar"><i></i><i></i><i></i><span class="mono">${n} — ~/project</span><b class="mono">#${i+1}</b></div>
      <div class="termbody mono"><span class="dim">$</span> giải thích lại context từ đầu<span class="cur"></span></div>
    </div>`).join("")}
  </div>`;
scenes.intro = `
  <img class="logo" id="in-logo" src="assets/img/logo.svg">
  <div class="mark" id="in-mark"><span class="ln">Multica</span></div>
  <div class="mono repo" id="in-repo">github.com/multica-ai/multica</div>
  <div class="tag" id="in-tag"><span class="mono">Agents that show up on the board.</span></div>`;
scenes.board = `
  <div class="shot" id="bd-shot"><img id="bd-img" src="assets/img/workspace-overview.png"></div>
  <div class="steps" id="bd-steps">
    <div class="step" id="bd-s0"><b class="mono">01</b><span>Giao issue</span></div>
    <div class="step" id="bd-s1"><b class="mono">02</b><span>Agent làm</span></div>
    <div class="step" id="bd-s2"><b class="mono">03</b><span>Review</span></div>
  </div>`;
const clis = ["Claude Code","Codex","Cursor Agent","Copilot CLI","OpenCode","Kimi","Qwen Code","Grok","Kiro CLI","Hermes","Trae CLI","Antigravity","OpenClaw","Pi"];
scenes.runtimes = `
  <div class="bignum"><span class="mono acc" id="rt-n">0</span><div class="h2 ink"><span class="ln">agent CLI.</span><span class="ln">Một dropdown.</span></div></div>
  <div class="chips" id="rt-chips">
    ${clis.map((c,i)=>`<span class="chip mono rt-c" id="rt-c${i}">${c}</span>`).join("")}
    <span class="chip mono rt-c more" id="rt-c${clis.length}">+12</span>
  </div>`;
scenes.log = `
  <div class="flow" id="lg-flow">
    <span class="node mono">server</span><span class="arr">→</span><span class="node mono hot">daemon · máy bạn</span><span class="arr">→</span><span class="node mono">agent CLI</span>
  </div>
  <div class="shot tall" id="lg-shot"><img id="lg-img" src="assets/img/tutorial-execution-log.png"></div>
  <div class="stamp mono" id="lg-stamp">149 events · 28m 2s</div>`;
scenes.auto = `
  <div class="shot" id="au-shot"><img id="au-img" src="assets/img/autopilot-schedule.png"></div>
  <div class="pipe" id="au-pipe">
    <span class="node mono">cron 0 9 * * *</span><span class="arr">→</span><span class="node mono">agent</span><span class="arr">→</span><span class="node mono hot">review</span><span class="arr x">⇢</span><span class="node mono lock" id="au-main">main</span>
  </div>`;
scenes.stack = `
  <div id="sk-a">
    <div class="rows">
      ${[["BACKEND","Go · Chi · sqlc"],["WEB","Next.js 16"],["DATABASE","PostgreSQL 17"],["CLIENT","Electron · Expo"]].map((r,i)=>`
      <div class="row sk-r" id="sk-r${i}"><span class="mono lab">${r[0]}</span><span class="val">${r[1]}</span></div>`).join("")}
    </div>
    <div class="term big" id="sk-term">
      <div class="termbar"><i></i><i></i><i></i><span class="mono">self-host</span></div>
      <div class="termbody mono"><div><span class="dim">$</span> curl -fsSL …/install.sh | bash -s -- --with-server</div><div><span class="dim">$</span> multica setup self-host</div></div>
    </div>
  </div>
  <div id="sk-b" class="lic">
    <div class="mono lab">LICENSE</div>
    <div class="h2 ink"><span class="ln">Apache 2.0</span><span class="ln acc">+ điều kiện.</span></div>
    <div class="licnote">Hosted service · nhúng thương mại · branding — đọc file LICENSE trước khi dùng cho sản phẩm.</div>
  </div>`;
scenes.cta = `
  <div class="h1 ink" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono">github.com/<b>multica-ai</b>/multica</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;

const sceneHTML = T.scenes.map(s=>`
  <div class="scene clip" style="${vars(s.id)}" id="sc-${s.id}" data-start="${f(s.start)}" data-duration="${f(s.end-s.start+(s.id==="cta"?0:0.3))}" data-track-index="1"><div class="sw"><div class="bg ${PAL[s.id].pat}"></div><div class="lbl mono">${s.label}</div><div class="hdl mono">@ai.unbox0026</div><div class="vis">${scenes[s.id]}</div></div></div>`).join("");

const capHTML = T.scenes.flatMap(s=>s.phrases.map((p,i)=>{
  const lines = p.show.split("\n").map(l=>`<span class="cl"><span>${esc(l).replace(/\*([^*]+)\*/g,'<span class="hl">$1</span>')}</span></span>`).join("");
  return `<div class="cap clip" style="${vars(s.id)}" id="cap-${s.id}-${i}" data-start="${f(p.start)}" data-duration="${f(Math.max(0.3,p.end-p.start+0.1))}" data-track-index="3"><div class="capin">${lines}</div></div>`;
})).join("\n  ");

// ---- timeline JS --------------------------------------------------------
const st = id=>sc[id].start, en=id=>sc[id].end, ph=(id,i)=>sc[id].phrases[i];
let js = "";
const L = (s)=>{js+=s+"\n";};
// crossfade between scenes
T.scenes.slice(1).forEach(s=>{ L(`tl.fromTo("#sc-${s.id} .sw",{opacity:0},{opacity:1,duration:0.3,ease:"power1.inOut"},${f(s.start)});`); });
// progress
L(`tl.fromTo("#prog",{scaleX:0},{scaleX:1,duration:${DUR},ease:"none",transformOrigin:"0 50%"},0);`);
// rule color follows scene darkness
L(`tl.set(".rule",{backgroundColor:"#F4EFE4"},${f(st("stack")+0.15)});`);
L(`tl.set(".rule",{backgroundColor:"#1E2B25"},${f(en("stack")+0.15)});`);
// captions
T.scenes.forEach(s=>s.phrases.forEach((p,i)=>{
  L(`tl.from("#cap-${s.id}-${i} .cl",{y:26,opacity:0,duration:0.22,stagger:0.07,ease:"power2.out"},${f(p.start)});`);
}));
// generic lines reveal helper
const lines=(sel,t,d=0.5,gap=0.12)=>L(`tl.from("${sel} .ln",{yPercent:110,duration:${d},stagger:${gap},ease:"power3.out"},${f(t)});`);

// hook
{ const t=st("hook");
  lines("#hk-h",t+0.05,0.55,0.35);
  [0,1,2,3].forEach(i=>L(`tl.from("#hk-t${i}",{y:-120,opacity:0,duration:0.4,ease:"back.out(1.5)"},${f(t+0.9+i*0.55)});`));
  [0,1,2,3].forEach(i=>L(`tl.to("#hk-t${i}",{y:${[0,0,0,0][i]},duration:0.01},${f(t+0.9+i*0.55)});`)); }
// intro
{ const t=st("intro");
  L(`tl.from("#in-logo",{scale:0.2,rotation:-90,opacity:0,duration:0.55,ease:"back.out(1.6)",transformOrigin:"50% 50%"},${f(t+0.1)});`);
  lines("#in-mark",t+0.25,0.6);
  L(`tl.from("#in-repo",{opacity:0,y:20,duration:0.4},${f(t+0.9)});`);
  L(`tl.from("#in-tag",{opacity:0,x:-40,duration:0.45,ease:"power2.out"},${f(ph("intro",1).start)});`); }
// board
{ const t=st("board");
  L(`tl.from("#bd-shot",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.05)});`);
  L(`tl.fromTo("#bd-img",{x:0,scale:1.0},{x:-30,scale:1.0,duration:${f(ph("board",0).end-t)},ease:"sine.inOut"},${f(t+0.1)});`);
  L(`tl.to("#bd-img",{x:-330,duration:${f(ph("board",2).start-ph("board",1).start)},ease:"sine.inOut"},${f(ph("board",1).start)});`);
  L(`tl.to("#bd-img",{x:-510,duration:${f(ph("board",2).end-ph("board",2).start)},ease:"sine.inOut"},${f(ph("board",2).start)});`);
  [0,1,2].forEach(i=>{ const p = i==0?ph("board",1).start-0.2: i==1?ph("board",2).start: ph("board",2).start+ (ph("board",2).end-ph("board",2).start)*0.62;
    L(`tl.from("#bd-s${i}",{y:40,opacity:0,duration:0.35,ease:"power3.out"},${f(p)});`);
    L(`tl.set("#bd-s${i}",{backgroundColor:"var(--hl)",color:"#FFFFFF"},${f(p)});`);
    if(i<2) L(`tl.set("#bd-s${i}",{backgroundColor:"#FFFFFF",color:"#14181A"},${f(p+ (i==0? (ph("board",2).start-p): 1.6))});`); }); }
// runtimes
{ const t=st("runtimes");
  L(`const c={v:0}; tl.to(c,{v:26,duration:1.4,ease:"power2.out",onUpdate:()=>{document.getElementById("rt-n").textContent=Math.round(c.v)}},${f(t+0.2)});`);
  lines(".bignum .h2",t+0.3,0.5,0.15);
  const n=clis.length+1;
  for(let i=0;i<n;i++) L(`tl.from("#rt-c${i}",{scale:0.6,opacity:0,duration:0.3,ease:"back.out(2)"},${f(ph("runtimes",1).start+0.25+i*0.28)});`);
  L(`tl.to("#rt-chips",{opacity:1,duration:0.01},${f(t)});`); }
// log
{ const t=st("log");
  L(`tl.from("#lg-flow .node, #lg-flow .arr",{opacity:0,x:-24,duration:0.35,stagger:0.18,ease:"power2.out"},${f(t+0.15)});`);
  L(`tl.from("#lg-shot",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(ph("log",0).start+1.2)});`);
  L(`tl.fromTo("#lg-img",{y:0},{y:-190,duration:${f(en("log")-ph("log",1).start)},ease:"sine.inOut"},${f(ph("log",1).start)});`);
  L(`tl.from("#lg-stamp",{scale:0.7,opacity:0,duration:0.35,ease:"back.out(2)"},${f(ph("log",1).start+2.5)});`); }
// auto
{ const t=st("auto");
  L(`tl.from("#au-shot",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.05)});`);
  L(`tl.fromTo("#au-img",{scale:1,transformOrigin:"20% 20%"},{scale:1.12,duration:${f(ph("auto",0).end-t)},ease:"sine.inOut"},${f(t+0.2)});`);
  L(`tl.from("#au-pipe .node, #au-pipe .arr",{opacity:0,y:30,duration:0.35,stagger:0.14,ease:"power3.out"},${f(ph("auto",1).start-0.1)});`);
  L(`tl.set("#au-main",{backgroundColor:"var(--ink)",color:"var(--paper)"},${f(ph("auto",1).start+1.5)});`); }
// stack
{ const t=st("stack");
  [0,1,2,3].forEach(i=>L(`tl.from("#sk-r${i}",{x:-80,opacity:0,duration:0.4,ease:"power3.out"},${f(t+0.1+i*0.22)});`));
  L(`tl.from("#sk-term",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+1.4)});`);
  const s1=ph("stack",1).start;
  L(`tl.to("#sk-a",{opacity:0,duration:0.25},${f(s1-0.15)});`);
  L(`tl.fromTo("#sk-b",{opacity:0},{opacity:1,duration:0.01},${f(s1-0.12)});`);
  L(`tl.from("#sk-b .lab, #sk-b .ln, #sk-b .licnote",{y:40,opacity:0,duration:0.4,stagger:0.12,ease:"power3.out"},${f(s1-0.1)});`); }
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
/* cta */
.follow{display:flex;align-items:center;gap:20px;margin-top:34px}
.pill{background:var(--hl);color:#fff;font-weight:800;font-size:40px;padding:20px 30px;border-radius:999px}
.urlcard{margin-top:34px;background:#fff;border:1px solid #D9CFC6;border-radius:18px;box-shadow:0 26px 54px rgba(120,60,40,.2);overflow:hidden}
.urlbar{display:flex;align-items:center;gap:10px;padding:13px 20px;background:#E8F2EC;font-size:22px;color:var(--mut)}
.urlbar i{width:14px;height:14px;border-radius:50%;background:#B9CFC3;display:block}
.urlbody{padding:34px 28px;font-size:39px;font-weight:700;color:#14181A}
.urlbody b{color:var(--hl)}
.handle{display:inline-block;background:var(--ink);color:var(--paper);padding:20px 30px;border-radius:12px;font-size:46px;font-weight:700}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  <div class="rule"></div><div id="prog"></div>
  ${sceneHTML}
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
