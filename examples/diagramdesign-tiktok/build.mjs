import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);
const st = id=>sc[id].start, ph=(id,i)=>sc[id].phrases[i];

// ---- bảng màu theo cảnh ----
const P=(pat,ink,acc,hl,hlt)=>({pat,ink,acc,hl,hlt});
const PAL = {
 hook:    P("t-plus","#1F1A00","#8F2B00","#C8421A","#FFFFFF"),
 intro:   P("t-tri","#FFFFFF","#FFD93D","#FFD93D","#0B2A8A"),
 types:   P("t-chev","#0E3B2E","#C2410C","#0E7A5A","#FFFFFF"),
 demo:    P("t-blocks","#2A2A33","#C2410C","#C2410C","#FFFFFF"),
 how:     P("t-plaid","#EAF7EA","#B8F27A","#B8F27A","#0B2E13"),
 install: P("t-scallop","#4A0F2E","#B0125E","#B0125E","#FFFFFF"),
 note:    P("t-argyle","#EEF1FF","#FFC857","#FFC857","#141B4D"),
 cta:     P("t-squares","#10300A","#10300A","#10300A","#D9FF8A")
};
const vars = id=>{const p=PAL[id];return `--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--hlt:${p.hlt};`;};

// ---- nội dung từng cảnh ----
const scenes = {};
scenes.hook = `
  <div class="gen" id="hk-gen">
    <div class="gbox">Frontend</div><i class="garr"></i><div class="gbox">API</div><i class="garr"></i><div class="gbox">DB</div>
  </div>
  <div class="gtag mono" id="hk-tag">(minh họa) sơ đồ vẽ vội</div>
  <div class="skill" id="hk-skill"><div class="mono sk1">SKILL</div><div class="sk2">diagram-design</div></div>`;
scenes.intro = `
  <img class="logo" id="in-logo" src="assets/img/logo.png">
  <div class="h1" id="in-h"><span class="ln">Diagram</span><span class="ln acc">Design</span></div>
  <div class="chips" id="in-chips"><span class="chip mono hotchip">MIT</span><span class="chip mono">mã nguồn mở</span><span class="chip mono">50k+ sao</span></div>
  <div class="one mono" id="in-one">1 trang .html · SVG nhúng sẵn</div>`;
scenes.types = `
  <div class="gal" id="ty-gal"><img src="assets/img/gallery.png"></div>
  <div class="gal2" id="ty-arch"><img src="assets/img/architecture.png"><span class="dot mono">1 màu nhấn</span></div>
  <div class="stamp mono" id="ty-stamp">ẢNH TỪ THƯ VIỆN CỦA REPO</div>`;
scenes.demo = `
  <div class="win" id="dm-win"><div class="wbar mono"><i></i><i></i><i></i><span>vi.html</span></div><div class="wbody"><img id="dm-img" src="assets/img/vi.png"></div></div>
  <div class="stamp mono" id="dm-stamp">TỰ CHẠY THỬ · ĐỔI CHỮ TRONG MẪU CỦA REPO</div>`;
scenes.how = `
  <div class="steps" id="hw-steps">
    <div class="sp" id="hw-s1"><b class="mono">1</b><span>Mô tả bằng lời</span></div>
    <div class="sp" id="hw-s2"><b class="mono">2</b><span>Agent chọn kiểu, vẽ</span></div>
    <div class="sp hot" id="hw-s3"><b class="mono">3</b><span>1 trang HTML → SVG, PNG</span></div>
  </div>
  <div class="brand" id="hw-brand"><div class="mono bl">website</div><b>→</b><div class="sw3"><i style="background:#B8F27A"></i><i style="background:#2D3142"></i><i style="background:#FFC857"></i></div><div class="mono bl">màu + phông</div></div>`;
scenes.install = `
  <div class="cmd" id="is-cmd"><div class="cbar mono"><i></i><i></i><i></i><span>terminal</span></div><div class="cbody mono"><span class="pr">$</span> npx skills add <b>cathrynlavery</b>/diagram-design</div></div>
  <div class="stores" id="is-grid">${["Claude Code","Cursor","Codex","Copilot","Gemini CLI","Windsurf"].map((p,i)=>`<div class="stc mono" id="is-${i}">${p}</div>`).join("")}</div>
  <div class="plug mono" id="is-plug">/plugin install diagram-design</div>`;
scenes.note = `
  <div class="h1" id="nt-h"><span class="ln">TÙY</span><span class="ln acc">MÔ HÌNH</span></div>
  <div class="two" id="nt-two"><div class="lay"><i></i><i></i><i class="s"></i></div><b class="mono">≠</b><div class="lay"><i class="s"></i><i></i><i></i></div></div>
  <div class="mono cap2" id="nt-c1">cùng một lệnh, hai bố cục</div>
  <div class="nodrag" id="nt-nd"><s class="mono">kéo thả</s><b>✕</b><span class="mono">nhờ agent sửa</span></div>`;
scenes.cta = `
  <img class="logo sm" id="ct-logo" src="assets/img/logo.png">
  <div class="h1" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono">github.com/<b>cathrynlavery</b>/diagram-design</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;

const sceneHTML = T.scenes.map(s=>`
  <div class="scene clip" style="${vars(s.id)}" id="sc-${s.id}" data-start="${f(s.start)}" data-duration="${f(s.end-s.start+(s.id==="cta"?0:0.3))}" data-track-index="1"><div class="sw"><div class="bg ${PAL[s.id].pat}"></div><div class="lbl mono">${s.label}</div><div class="hdl mono">@ai.unbox0026</div><div class="vis">${scenes[s.id]}</div></div></div>`).join("");
const capHTML = T.scenes.flatMap(s=>s.phrases.map((p,i)=>{
  const lines = p.show.split("\n").map(l=>`<span class="cl"><span>${esc(l).replace(/\*([^*]+)\*/g,'<span class="hl">$1</span>')}</span></span>`).join("");
  return `<div class="cap clip" style="${vars(s.id)}" id="cap-${s.id}-${i}" data-start="${f(p.start)}" data-duration="${f(Math.max(0.3,p.end-p.start+0.1))}" data-track-index="3"><div class="capin">${lines}</div></div>`;
})).join("\n  ");

// ---- timeline ----
let js=""; const L=s=>{js+=s+"\n";};
T.scenes.slice(1).forEach(s=>L(`tl.fromTo("#sc-${s.id} .sw",{opacity:0},{opacity:1,duration:0.3,ease:"power1.inOut"},${f(s.start)});`));
L(`tl.fromTo("#prog",{scaleX:0},{scaleX:1,duration:${DUR},ease:"none",transformOrigin:"0 50%"},0);`);
T.scenes.forEach(s=>s.phrases.forEach((p,i)=>L(`tl.from("#cap-${s.id}-${i} .cl",{y:26,opacity:0,duration:0.22,stagger:0.07,ease:"power2.out"},${f(p.start)});`)));
T.scenes.forEach(s=>{L(`tl.set(".rule",{backgroundColor:"${PAL[s.id].ink}"},${f(s.start+0.12)});`);L(`tl.set("#prog",{backgroundColor:"${PAL[s.id].acc}"},${f(s.start+0.12)});`);});
const lines=(sel,t,d=0.5,gap=0.12)=>L(`tl.from("${sel} .ln",{yPercent:110,duration:${d},stagger:${gap},ease:"power3.out"},${f(t)});`);
const pop=(sel,t,d=0.4)=>L(`tl.from("${sel}",{y:36,opacity:0,duration:${d},ease:"back.out(1.6)"},${f(t)});`);
// hook
{ const t=st("hook"), p2=ph("hook",1).start;
  pop("#hk-gen",t+0.2,0.5);
  L(`tl.from("#hk-tag",{scale:0.7,opacity:0,duration:0.4,ease:"back.out(2)"},${f(t+1.0)});`);
  L(`tl.to("#hk-gen",{opacity:0.22,y:30,duration:0.4},${f(p2)});`);
  L(`tl.to("#hk-tag",{opacity:0,duration:0.3},${f(p2)});`);
  L(`tl.from("#hk-skill",{y:80,opacity:0,scale:0.85,duration:0.55,ease:"back.out(1.6)"},${f(p2+0.2)});`); }
// intro
{ const t=st("intro"), p2=ph("intro",1).start;
  L(`tl.from("#in-logo",{scale:0,rotation:-25,duration:0.55,ease:"back.out(2)"},${f(t+0.1)});`);
  lines("#in-h",t+0.15,0.6,0.2);
  L(`tl.from("#in-one",{opacity:0,x:-30,duration:0.4},${f(t+1.6)});`);
  L(`tl.from("#in-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.35,ease:"back.out(1.8)"},${f(p2+0.1)});`); }
// types
{ const t=st("types"), p2=ph("types",1).start;
  L(`tl.from("#ty-gal",{y:50,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.15)});`);
  L(`tl.from("#ty-stamp",{scale:0.7,opacity:0,duration:0.4,ease:"back.out(2)"},${f(t+0.7)});`);
  L(`tl.to("#ty-gal",{opacity:0,y:-20,duration:0.3},${f(p2-0.05)});`);
  L(`tl.from("#ty-arch",{y:50,opacity:0,duration:0.5,ease:"power3.out"},${f(p2+0.05)});`);
  L(`tl.from("#ty-arch .dot",{scale:0.6,opacity:0,duration:0.4,ease:"back.out(2)"},${f(p2+0.9)});`); }
// demo
{ const t=st("demo");
  L(`tl.from("#dm-win",{y:50,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#dm-stamp",{scale:0.7,opacity:0,duration:0.4,ease:"back.out(2)"},${f(t+0.6)});`);
  L(`tl.to("#dm-img",{y:-330,duration:${f(Math.max(1,ph("demo",1).end-t-1.2))},ease:"power1.inOut"},${f(t+1.4)});`); }
// how
{ const t=st("how");
  [1,2,3].forEach((k,i)=>L(`tl.from("#hw-s${k}",{x:-50,opacity:0,duration:0.4,ease:"back.out(1.6)"},${f(i===0?t+0.2:i===1?ph("how",0).start+1.7:ph("how",1).start+0.2)});`));
  L(`tl.from("#hw-brand",{y:40,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(ph("how",2).start+0.2)});`); }
// install
{ const t=st("install"), p2=ph("install",1).start;
  L(`tl.from("#is-cmd",{y:40,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#is-grid .stc",{y:30,opacity:0,duration:0.3,stagger:0.3,ease:"back.out(1.6)"},${f(t+1.2)});`);
  L(`tl.from("#is-plug",{opacity:0,x:-40,duration:0.45,ease:"power3.out"},${f(p2+0.15)});`); }
// note
{ const t=st("note"), p2=ph("note",1).start;
  lines("#nt-h",t+0.05,0.55,0.2);
  L(`tl.from("#nt-two",{y:40,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(t+0.9)});`);
  L(`tl.from("#nt-c1",{opacity:0,duration:0.4},${f(t+1.5)});`);
  L(`tl.to("#nt-two",{opacity:0,duration:0.3},${f(p2)});`);
  L(`tl.to("#nt-h",{opacity:0,duration:0.3},${f(p2)});`);
  L(`tl.to("#nt-c1",{opacity:0,duration:0.3},${f(p2)});`);
  L(`tl.from("#nt-nd",{y:40,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(p2+0.2)});`); }
// cta
{ const t=st("cta");
  L(`tl.from("#ct-logo",{scale:0,duration:0.5,ease:"back.out(2)"},${f(t+0.1)});`);
  lines("#ct-h",t+0.2,0.55,0.2);
  L(`tl.from("#ct-card",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.9)});`);
  L(`tl.from("#ct-h2",{scale:0.8,opacity:0,duration:0.45,ease:"back.out(1.8)"},${f(ph("cta",1).start+0.1)});`); }

const FONTS=[["Be Vietnam Pro","be-vietnam-pro",[500,700,800]],["JetBrains Mono","jetbrains-mono",[500,700]],["Anton","anton",[400]]].map(([fam,file,ws])=>ws.map(w=>`
@font-face{font-family:"${fam}";font-weight:${w};src:url(assets/fonts/${file}-latin-${w}-normal.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:"${fam}";font-weight:${w};src:url(assets/fonts/${file}-vietnamese-${w}-normal.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;}`).join("")).join("");
const svg=(s)=>`url("data:image/svg+xml;utf8,${encodeURIComponent(s)}")`;
const plus=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><path d="M45 28v34M28 45h34" stroke="rgba(143,43,0,.35)" stroke-width="6" stroke-linecap="round"/></svg>`);
const chev=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><path d="M0 20 L60 60 L120 20" fill="none" stroke="rgba(14,122,90,.25)" stroke-width="10"/></svg>`);
const scal=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><circle cx="60" cy="60" r="56" fill="none" stroke="rgba(176,18,94,.3)" stroke-width="5"/><circle cx="0" cy="60" r="56" fill="none" stroke="rgba(176,18,94,.3)" stroke-width="5"/><circle cx="120" cy="60" r="56" fill="none" stroke="rgba(176,18,94,.3)" stroke-width="5"/></svg>`);
const argy=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><path d="M70 6 L134 70 L70 134 L6 70Z" fill="rgba(255,200,87,.10)" stroke="rgba(255,200,87,.35)" stroke-width="3"/></svg>`);
const css=`${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#fff}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"Be Vietnam Pro",sans-serif}
.mono{font-family:"JetBrains Mono",monospace;font-weight:500}
.sw,.scene,.bg{position:absolute;left:0;top:0;width:1080px;height:1920px}
.scene{color:var(--ink)}
.vis{position:absolute;left:60px;top:250px;width:840px;height:880px}
.lbl{position:absolute;left:60px;top:150px;font-size:27px;font-weight:700;letter-spacing:.16em;color:var(--ink)}
.hdl{position:absolute;left:560px;width:340px;text-align:right;top:150px;font-size:27px;font-weight:700;color:var(--acc)}
.rule{position:absolute;left:60px;top:200px;width:840px;height:3px;background:#222;z-index:5}
#prog{position:absolute;left:60px;top:198px;width:840px;height:7px;background:#fff;z-index:6}
.ln{display:block;line-height:1.2;overflow:hidden;padding-bottom:34px;margin-bottom:-22px}
.h1{font-family:"Anton",sans-serif;font-size:170px;letter-spacing:.005em;overflow:hidden;padding-bottom:10px}
.acc{color:var(--acc)}
.cap{position:absolute;left:60px;top:1180px;width:840px;height:260px;z-index:20}
.capin{display:flex;flex-direction:column;align-items:flex-start;gap:12px}
.cl{display:block}
.cl>span{display:inline-block;background:#fff;color:#14181A;font-weight:800;font-size:52px;line-height:1.25;padding:6px 22px;letter-spacing:-0.01em;border:3px solid var(--hl);box-shadow:0 10px 24px rgba(0,0,0,.18)}
.hl{background:var(--hl);color:var(--hlt);padding:0 10px;margin:0 -4px}
/* nền: mỗi slide một kiểu */
.bg.t-plus{background-color:#FFD23F;background-image:${plus};background-size:90px 90px}
.bg.t-tri{background-color:#1B3FC4}
.bg.t-tri::before{content:"";position:absolute;left:-140px;top:1250px;width:0;height:0;border-left:420px solid transparent;border-right:420px solid transparent;border-bottom:720px solid #1634A3}
.bg.t-tri::after{content:"";position:absolute;right:-200px;top:-180px;width:0;height:0;border-left:360px solid transparent;border-right:360px solid transparent;border-top:620px solid #2549DB}
.bg.t-chev{background-color:#DDF5E8;background-image:${chev};background-size:120px 80px}
.bg.t-blocks{background-color:#E9E5DF}
.bg.t-blocks::before{content:"";position:absolute;left:-80px;top:1500px;width:420px;height:420px;border-radius:60px;background:#D5CFC6}
.bg.t-blocks::after{content:"";position:absolute;right:-120px;top:-100px;width:520px;height:520px;border-radius:80px;background:#DCD6CD;transform:rotate(14deg)}
.bg.t-plaid{background-color:#0F3D1E;background-image:repeating-linear-gradient(0deg,rgba(184,242,122,.16) 0 18px,transparent 18px 90px),repeating-linear-gradient(90deg,rgba(0,0,0,.28) 0 18px,transparent 18px 90px)}
.bg.t-scallop{background-color:#FFC2DD;background-image:${scal};background-size:120px 60px}
.bg.t-argyle{background-color:#16205C;background-image:${argy};background-size:140px 140px}
.bg.t-squares{background-color:#C6F26B}
.bg.t-squares::before{content:"";position:absolute;left:140px;top:1240px;width:800px;height:800px;background:#B2E24F;transform:rotate(12deg);box-shadow:0 0 0 70px #BCE95A,0 0 0 140px #C1ED63}
/* hook */
.gen{display:flex;align-items:center;justify-content:space-between;margin-top:90px}
.gbox{width:200px;padding:38px 0;text-align:center;background:#F1F1F3;color:#8A8A93;border:2px solid #D3D3D9;border-radius:30px;font-size:34px;font-weight:700}
.garr{display:block;width:70px;height:4px;background:#B9B9C2}
.gtag{margin-top:34px;display:inline-block;background:var(--ink);color:#FFE9A8;padding:12px 20px;font-size:26px;font-weight:700}
.skill{position:absolute;left:0;top:420px;width:840px;background:#fff;border:4px solid var(--ink);box-shadow:12px 12px 0 var(--ink);padding:34px 36px}
.sk1{font-size:26px;letter-spacing:.2em;color:var(--hl);font-weight:700}
.sk2{font-family:"Anton",sans-serif;font-size:110px;color:var(--ink);line-height:1.15;margin-top:6px}
/* intro */
.logo{width:170px;height:170px;display:block;border-radius:50%;background:#fff;padding:14px;box-shadow:0 14px 30px rgba(0,0,0,.25);object-fit:contain}
.logo.sm{width:130px;height:130px;padding:11px}
#in-h{margin-top:18px;font-size:190px}
.chips{display:flex;flex-wrap:wrap;gap:14px;margin-top:22px}
.chip{color:#14181A;background:#fff;border:2px solid var(--ink);border-radius:10px;padding:14px 22px;font-size:30px;font-weight:700}
.chip.hotchip{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.one{margin-top:12px;font-size:28px;font-weight:700;color:var(--acc)}
/* types */
.gal,.gal2{position:absolute;left:0;top:20px;width:840px;border:3px solid var(--ink);background:#f5f5f5;box-shadow:12px 12px 0 var(--ink);overflow:hidden}
.gal img{display:block;width:840px;height:630px}
.gal2{top:120px;border-color:var(--ink)}
.gal2 img{display:block;width:840px;height:auto}
.dot{position:absolute;right:16px;bottom:16px;background:var(--hl);color:var(--hlt);font-size:26px;font-weight:700;padding:8px 16px}
.stamp{position:absolute;left:0;top:740px;background:var(--ink);color:#fff;padding:12px 18px;font-size:24px;font-weight:700}
/* demo */
.win{position:absolute;left:0;top:10px;width:840px;height:760px;border:3px solid var(--ink);background:#f5f5f5;box-shadow:12px 12px 0 var(--ink);overflow:hidden}
.wbar{display:flex;align-items:center;gap:10px;padding:12px 18px;background:var(--ink);color:#fff;font-size:22px}
.wbar i{width:14px;height:14px;border-radius:50%;background:#888;display:block}
.wbar span{margin-left:12px}
.wbody{height:700px;overflow:hidden}
.wbody img{display:block;width:840px;height:auto}
/* how */
.steps{display:flex;flex-direction:column;gap:22px;margin-top:20px}
.sp{display:flex;align-items:center;gap:22px;background:#0B2E13;border:3px solid var(--hl);padding:26px 28px;font-size:40px;font-weight:800;color:#EAF7EA;box-shadow:8px 8px 0 var(--hl)}
.sp b{background:var(--hl);color:var(--hlt);width:62px;height:62px;display:flex;align-items:center;justify-content:center;font-size:36px}
.sp.hot{background:var(--hl);color:var(--hlt);border-color:#fff;box-shadow:8px 8px 0 #fff}
.sp.hot b{background:var(--hlt);color:var(--hl)}
.brand{margin-top:44px;display:flex;align-items:center;justify-content:space-between;background:#fff;border:3px solid var(--hl);padding:22px 24px;box-shadow:8px 8px 0 var(--hl);color:#0B2E13}
.bl{font-size:28px;font-weight:700}
.brand b{font-size:50px}
.sw3{display:flex;gap:10px}.sw3 i{display:block;width:56px;height:56px;border:2px solid #0B2E13}
/* install */
.cmd{border:3px solid var(--ink);background:#fff;box-shadow:10px 10px 0 var(--ink);margin-top:10px}
.cbar{display:flex;align-items:center;gap:10px;padding:12px 18px;background:var(--ink);color:#FFD6E8;font-size:22px}
.cbar i{width:14px;height:14px;border-radius:50%;background:#B0125E;display:block}
.cbody{padding:34px 20px;font-size:26px;font-weight:700;color:#14181A;word-break:break-all}
.cbody .pr{color:var(--hl)}.cbody b{color:var(--hl)}
.stores{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:34px}
.stc{background:#fff;color:#4A0F2E;border:3px solid var(--ink);padding:20px 8px;font-size:25px;font-weight:700;text-align:center;box-shadow:6px 6px 0 var(--ink)}
.plug{margin-top:34px;background:var(--ink);color:#FFD6E8;padding:24px 26px;font-size:32px;font-weight:700}
/* note */
#nt-h{font-size:200px}
.two{display:flex;align-items:center;justify-content:space-between;margin-top:24px}
.two b{font-size:80px;color:#FFC857}
.lay{width:330px;height:240px;background:#fff;border:3px solid #FFC857;padding:18px;display:flex;flex-direction:column;gap:12px;box-shadow:6px 6px 0 #FFC857}
.lay i{display:block;flex:1;background:#D7DBF2;border:2px solid #16205C}
.lay i.s{background:#FFC857}
.cap2{margin-top:18px;font-size:26px;font-weight:700;color:#FFC857}
.nodrag{position:absolute;left:0;top:120px;width:840px;display:flex;align-items:center;justify-content:space-between;border:3px dashed #EEF1FF;padding:26px 30px;font-size:32px;font-weight:700}
.nodrag s{opacity:.85}.nodrag b{color:#FF7A6B;font-size:60px}
.nodrag span{background:#FFC857;color:#141B4D;padding:10px 16px}
/* cta */
#ct-h{margin-top:20px;font-size:160px}
.urlcard{margin-top:34px;background:#fff;border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink)}
.urlbar{display:flex;align-items:center;gap:10px;padding:13px 20px;background:#E1F5B8;font-size:22px;color:#10300A}
.urlbar i{width:14px;height:14px;border-radius:50%;background:#9CC25A;display:block}
.urlbody{padding:32px 20px;font-size:31px;font-weight:700;color:#14181A}
.urlbody b{color:#2F6B14}
.follow{display:flex;align-items:center;gap:20px;margin-top:34px}
.pill{background:var(--hl);color:var(--hlt);font-weight:800;font-size:40px;padding:20px 30px;border-radius:999px}
.handle{background:var(--ink);color:#D9FF8A;padding:20px 30px;font-size:44px;font-weight:700}`;
const html=`<!doctype html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920">
<script src="assets/gsap.min.js"></script>
<style>${css}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  <div class="rule"></div><div id="prog"></div>
  ${sceneHTML}
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
