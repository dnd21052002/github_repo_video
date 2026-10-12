import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);


const PAL = {
 hook:    {paper:"#FDF6EE",glow:"#F4C4B0",glow2:"#F6DEC8",dot:"#DDBFB0",ink:"#1E2B25",acc:"#B8380F",hl:"#158A55",term:"#1E2B25",pat:"dots"},
 intro:   {paper:"#F0F6EF",glow:"#BFE3CC",glow2:"#DDEFD0",dot:"#B5CFBC",ink:"#14281F",acc:"#0F6B4A",hl:"#0F6B4A",term:"#14281F",pat:"lines"},
 live:    {paper:"#EEF3FC",glow:"#BFD4F7",glow2:"#DCE6FA",dot:"#BCCBE6",ink:"#14213D",acc:"#2F5BD3",hl:"#2F5BD3",term:"#14213D",pat:"grid"},
 summary: {paper:"#FFF8E3",glow:"#FADC82",glow2:"#FDEBB0",dot:"#E5CF8A",ink:"#2B2310",acc:"#C2410C",hl:"#2B2310",term:"#2B2310",pat:"dots"},
 privacy: {paper:"#F4F0FD",glow:"#D6C8F5",glow2:"#E8DDFA",dot:"#CDBFEA",ink:"#231745",acc:"#6D3FCB",hl:"#6D3FCB",term:"#231745",pat:"diag"},
 install: {paper:"#14201B",glow:"#24493A",glow2:"#1B3328",dot:"#2E4A3F",ink:"#F4EFE4",acc:"#FF8A5C",hl:"#158A55",term:"#0B1210",pat:"grid"},
 cta:     {paper:"#FDF6EE",glow:"#F4C4B0",glow2:"#F6DEC8",dot:"#DDBFB0",ink:"#1E2B25",acc:"#B8380F",hl:"#158A55",term:"#1E2B25",pat:"dots"}
};
const vars = id=>{const p=PAL[id];return `--paper:${p.paper};--glow:${p.glow};--glow2:${p.glow2};--dot:${p.dot};--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--term:${p.term}`;};

// ---- scene markup -------------------------------------------------------
const st = id=>sc[id].start, en=id=>sc[id].end, ph=(id,i)=>sc[id].phrases[i];
const scenes = {};
scenes.hook = `
  <div class="h1 ink" id="hk-h"><span class="ln">Họp xong là</span><span class="ln acc">quên sạch.</span></div>
  <div class="mock" id="hk-win">
    <div class="urlbar mono"><i></i><i></i><i></i><span>biên-bản-họp.docx</span></div>
    <div class="docbody">
      <div class="sk w90"></div><div class="sk w70"></div><div class="sk w82"></div><div class="sk w40"></div>
      <div class="typed mono" id="hk-typed">Hôm nay chúng ta họp về…<span class="cur"></span></div>
    </div>
  </div>
  <div class="qchip" id="hk-q">Gõ lại mất <b>cả tiếng</b></div>
  <div class="bubble warn mono" id="hk-w">Bản ghi nằm trên máy chủ của ai?</div>`;
scenes.intro = `
  <div class="mark disp" id="in-mark"><span class="ln">Meetily</span></div>
  <div class="tag" id="in-tag"><span class="mono">Privacy-First AI Meeting Assistant</span></div>
  <div class="chips" id="in-chips"><span class="chip mono">MIT</span><span class="chip mono">Windows · macOS</span><span class="chip mono">Chạy local</span></div>
  <div class="shot" id="in-shot"><img id="in-img" src="assets/img/home.jpg"></div>`;
scenes.live = `
  <div class="chips lv" id="lv-chips"><span class="chip mono" id="lv-c0">REC · phiên âm trực tiếp</span><span class="chip mono" id="lv-c1">Micro + âm thanh máy</span><span class="chip mono hotchip" id="lv-c2">Tiếng Việt · Whisper</span></div>`;
scenes.summary = `
  <div class="chips lv" id="sm-chips"><span class="chip mono" id="sm-c0">Tóm tắt</span><span class="chip mono" id="sm-c1">Quyết định</span><span class="chip mono" id="sm-c2">Việc cần làm</span><span class="chip mono hotchip" id="sm-c3">Ollama · local</span><span class="chip mono hotchip" id="sm-c4">Import audio · Beta</span></div>`;
scenes.privacy = `
  <div class="shot auto" id="pv-shot"><img id="pv-img" src="assets/img/storage.jpg"></div>
  <div class="shot auto pop" id="pv-pop"><img id="pv-pimg" src="assets/img/popup.jpg"></div>
  <div class="chips" id="pv-chips"><span class="chip mono hotchip">Ollama = ở lại trên máy</span></div>`;
scenes.install = `
  <div class="rows" id="is-rows">
    ${[["WINDOWS","Bộ cài .exe"],["MACOS","Bộ cài .dmg"],["LINUX","Tự build"]].map((r,i)=>`<div class="row is-r" id="is-r${i}"><span class="mono lab">${r[0]}</span><span class="val">${r[1]}</span></div>`).join("")}
  </div>
  <div class="term big" id="is-term">
    <div class="termbar"><i></i><i></i><i></i><span>Linux · build từ nguồn</span></div>
    <div class="termbody mono"><div><span class="dim">$</span> cd frontend</div><div><span class="dim">$</span> pnpm install --frozen-lockfile</div><div><span class="dim">$</span> ./build-gpu.sh</div></div>
  </div>
  <div class="chips" id="is-chips"><span class="chip mono hotchip">+ Ollama cho tóm tắt local</span></div>`;
scenes.cta = `
  <div class="h1 ink" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono" style="font-size:30px">github.com/<b>Zackriya-Solutions</b>/meetily</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;

// real screen-recording clips (root level: a <video data-start> may not sit inside another timed element)
const VID = [
  {id:"live",   scene:"live",    src:"assets/vid/live.mp4", dur:10.4},
  {id:"sum",    scene:"summary", src:"assets/vid/sum.mp4",  dur:10.2}
];
const vidHTML = VID.map(v=>`
  <div class="vwrap" id="vw-${v.id}" style="${vars(v.scene)}"><video id="vv-${v.id}" src="${v.src}" muted playsinline class="clip" data-start="${f(st(v.scene)+0.1)}" data-duration="${v.dur}" data-track-index="2" data-has-audio="false"></video></div>`).join("");
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
L(`tl.set(".rule",{backgroundColor:"#F4EFE4"},${f(st("install")+0.15)});`);
L(`tl.set(".rule",{backgroundColor:"#1E2B25"},${f(en("install")+0.15)});`);
// video wrappers: fade in with their scene, fade out at its end
VID.forEach(v=>{
  const t0=st(v.scene), t1=en(v.scene);
  L(`tl.fromTo("#vw-${v.id}",{opacity:0,y:40},{opacity:1,y:0,duration:0.4,ease:"power3.out"},${f(t0+0.1)});`);
  L(`tl.to("#vw-${v.id}",{opacity:0,duration:0.3},${f(t1-0.05)});`);
});
// hook
{ const t=st("hook");
  lines("#hk-h",t+0.05,0.55,0.25);
  L(`tl.from("#hk-win",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.6)});`);
  L(`tl.from(".sk",{scaleX:0,transformOrigin:"0 50%",duration:0.4,stagger:0.12,ease:"power2.out"},${f(t+1.0)});`);
  L(`tl.from("#hk-q",{y:50,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(t+2.2)});`);
  L(`tl.to("#hk-win, #hk-q",{opacity:0,duration:0.3},${f(ph("hook",1).start-0.1)});`);
  L(`tl.from("#hk-w",{scale:0.6,opacity:0,duration:0.45,ease:"back.out(2)"},${f(ph("hook",1).start+0.4)});`); }
// intro
{ const t=st("intro");
  lines("#in-mark",t+0.15,0.6);
  L(`tl.from("#in-tag",{opacity:0,x:-40,duration:0.45,ease:"power2.out"},${f(t+0.8)});`);
  L(`tl.from("#in-chips .chip",{opacity:0,y:30,duration:0.35,stagger:0.18,ease:"back.out(1.8)"},${f(ph("intro",1).start)});`);
  L(`tl.from("#in-shot",{y:70,opacity:0,duration:0.55,ease:"power3.out"},${f(t+1.2)});`); }
// live (chips follow phrases)
{ const t=st("live");
  [0,1,2].forEach(i=>L(`tl.from("#lv-c${i}",{opacity:0,y:30,duration:0.35,ease:"back.out(1.8)"},${f(ph("live",i).start+0.2)});`)); }
// summary
{ const t=st("summary");
  [["sm-c0",0.4],["sm-c1",0.8],["sm-c2",1.2]].forEach(([id,d])=>L(`tl.from("#${id}",{opacity:0,y:30,duration:0.35,ease:"back.out(1.8)"},${f(ph("summary",0).start+d+1.6)});`));
  L(`tl.from("#sm-c3",{opacity:0,y:30,duration:0.35,ease:"back.out(1.8)"},${f(ph("summary",1).start+0.3)});`);
  L(`tl.from("#sm-c4",{opacity:0,y:30,duration:0.35,ease:"back.out(1.8)"},${f(ph("summary",2).start+0.2)});`); }
// privacy
{ const t=st("privacy");
  L(`tl.from("#pv-shot",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#pv-chips .chip",{opacity:0,y:30,duration:0.35,ease:"back.out(1.8)"},${f(t+1.4)});`);
  L(`tl.to("#pv-shot",{opacity:0,duration:0.3},${f(ph("privacy",1).start-0.15)});`);
  L(`tl.fromTo("#pv-pop",{opacity:0,y:40},{opacity:1,y:0,duration:0.45,ease:"power3.out"},${f(ph("privacy",1).start)});`);
  L(`tl.to("#pv-chips",{opacity:0,duration:0.2},${f(ph("privacy",1).start-0.15)});`); }
// install
{ const t=st("install");
  [0,1,2].forEach(i=>L(`tl.from("#is-r${i}",{x:-80,opacity:0,duration:0.4,ease:"power3.out"},${f(t+0.1+i*0.25)});`));
  L(`tl.from("#is-term",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+1.2)});`);
  L(`tl.from("#is-chips .chip",{opacity:0,y:30,duration:0.35,ease:"back.out(1.8)"},${f(ph("install",1).start+0.2)});`); }
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
