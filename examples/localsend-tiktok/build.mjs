import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);
const st = id=>sc[id].start, ph=(id,i)=>sc[id].phrases[i];

// ---- bảng màu theo cảnh: pattern, ink, acc, hl, hlt, rule, prog ----
const P=(pat,ink,acc,hl,hlt)=>({pat,ink,acc,hl,hlt});
const PAL = {
 hook:    P("t-halftone","#2B1208","#8A1F0C","#C2331B","#FFFFFF"),
 intro:   P("t-teal","#FFFFFF","#FFE27A","#FFE27A","#06302E"),
 where:   P("t-waves","#0B3B3B","#E4572E","#0F7C7C","#FFFFFF"),
 demo:    P("t-sky","#102A43","#0F7C7C","#0F7C7C","#FFFFFF"),
 how:     P("t-net","#EAF6F6","#7FE3D6","#7FE3D6","#06302E"),
 install: P("t-tickets","#3A2A00","#B34700","#3A2A00","#FFE27A"),
 note:    P("t-brick","#FFF1E6","#FFD166","#FFD166","#3B1306"),
 cta:     P("t-arcs","#FFFFFF","#FFE27A","#FFE27A","#06302E")
};
const vars = id=>{const p=PAL[id];return `--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--hlt:${p.hlt};`;};

// ---- nội dung từng cảnh ----
const scenes = {};
scenes.hook = `
  <div class="devrow" id="hk-dev">
    <div class="phone"><i></i></div>
    <div class="cloud mono" id="hk-cloud">Zalo · email<br><small>qua internet</small></div>
    <div class="laptop"><div class="lscr"></div><div class="lbase"></div></div>
  </div>
  <svg class="arc" id="hk-arc" viewBox="0 0 840 360"><path d="M150 330 C 150 40, 690 40, 690 330" fill="none" stroke="var(--acc)" stroke-width="10" stroke-dasharray="18 14" stroke-linecap="round"/><path d="M670 300 L690 335 L715 305" fill="none" stroke="var(--acc)" stroke-width="10" stroke-linecap="round"/></svg>
  <div class="gap mono" id="hk-gap">chỉ vài chục cm</div>`;
scenes.intro = `
  <img class="logo" id="in-logo" src="assets/img/logo.png">
  <div class="h1" id="in-h"><span class="ln">Local</span><span class="ln acc">Send</span></div>
  <div class="chips" id="in-chips"><span class="chip mono hotchip">mã nguồn mở</span><span class="chip mono">miễn phí</span><span class="chip mono">không cần internet</span></div>`;
const plats=["Windows","macOS","Linux","Android","iOS","Fire OS"];
scenes.where = `<div class="pgrid" id="wh-grid">${plats.map((p,i)=>`<div class="pl" id="wh-${i}"><span class="mono">${p}</span><b>✓</b></div>`).join("")}</div>
  <div class="swap mono" id="wh-swap"><span>điện thoại</span><b>⇄</b><span>máy tính</span></div>
  <div class="chips" id="wh-chips"><span class="chip mono hotchip">VI · tiếng Việt</span><span class="chip mono dim2">theo tệp dịch trong repo</span></div>`;
scenes.demo = `
  <div class="shotwrap">
    <div class="shot" id="dm-pc"><img src="assets/img/pc.png"><span class="st mono" style="top:128px">xong</span><span class="st mono now" style="top:180px">đang nhận</span><span class="st mono" style="top:234px">chờ</span></div>
    <div class="shot ph" id="dm-ph"><img src="assets/img/phone.png"></div>
  </div>
  <div class="stamp mono" id="dm-stamp">ẢNH TỪ TRANG CHỦ DỰ ÁN</div>`;
scenes.how = `
  <div class="net" id="hw-net">
    <svg viewBox="0 0 840 440"><g stroke="var(--acc)" stroke-width="6" stroke-dasharray="12 10" fill="none"><line id="hw-l1" x1="150" y1="130" x2="420" y2="300"/><line id="hw-l2" x1="690" y1="130" x2="420" y2="300"/><line id="hw-l3" x1="150" y1="130" x2="690" y2="130"/></g></svg>
    <div class="nd" id="hw-a" style="left:40px;top:70px">Điện thoại</div>
    <div class="nd" id="hw-b" style="left:580px;top:70px">Máy tính</div>
    <div class="nd" id="hw-c" style="left:295px;top:270px">Máy tính bảng</div>
    <div class="lockb mono" id="hw-lock">HTTPS · chứng chỉ tạo trên từng máy</div>
  </div>
  <div class="srv mono" id="hw-srv"><s>máy chủ bên thứ ba</s><b>✕</b></div>`;
scenes.install = `
  <div class="stores" id="is-grid">${["App Store","Play Store","F-Droid","Flathub","Winget","Scoop","Chocolatey","Homebrew"].map((p,i)=>`<div class="stc mono" id="is-${i}">${p}</div>`).join("")}</div>
  <div class="two" id="is-two"><div class="tw"><div class="mono tl">WINDOWS</div><div class="tv">winget</div></div><div class="tw hot"><div class="mono tl">MACOS</div><div class="tv">Homebrew</div></div></div>
  <div class="ntx mono" id="is-note">README: app chưa có tự cập nhật</div>`;
scenes.note = `
  <div class="h1" id="nt-h"><span class="ln">CÙNG</span><span class="ln acc">MỘT MẠNG</span></div>
  <div class="route" id="nt-route"><div class="rd">Máy A</div><div class="rx mono">✕</div><div class="rd">Máy B</div></div>
  <div class="chips" id="nt-chips"><span class="chip mono hotchip">AP isolation</span><span class="chip mono">Windows: mạng “riêng tư”</span><span class="chip mono">VPN chặn LAN</span></div>`;
scenes.cta = `
  <img class="logo sm" id="ct-logo" src="assets/img/logo.png">
  <div class="h1" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono">github.com/<b>localsend</b>/localsend</div></div>
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
  pop("#hk-dev",t+0.1,0.5);
  L(`tl.from("#hk-cloud",{scale:0.5,opacity:0,duration:0.4,ease:"back.out(2)"},${f(t+0.9)});`);
  L(`tl.from("#hk-arc",{opacity:0,duration:0.5},${f(t+1.2)});`);
  L(`tl.to("#hk-arc",{opacity:0.18,duration:0.4},${f(p2)});`);
  L(`tl.to("#hk-cloud",{opacity:0.25,duration:0.4},${f(p2)});`);
  L(`tl.from("#hk-gap",{scale:0.7,opacity:0,duration:0.4,ease:"back.out(2)"},${f(p2+0.4)});`); }
// intro
{ const t=st("intro");
  L(`tl.from("#in-logo",{scale:0,rotation:-25,duration:0.55,ease:"back.out(2)"},${f(t+0.1)});`);
  lines("#in-h",t+0.15,0.6,0.2);
  L(`tl.from("#in-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.35,ease:"back.out(1.8)"},${f(t+1.4)});`); }
// where
{ const t=st("where");
  L(`tl.from("#wh-grid .pl",{y:40,opacity:0,duration:0.35,stagger:0.3,ease:"back.out(1.6)"},${f(t+0.2)});`);
  L(`tl.from("#wh-swap",{scale:0.8,opacity:0,duration:0.45,ease:"back.out(1.8)"},${f(ph("where",1).start+0.1)});`);
  L(`tl.from("#wh-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(ph("where",2).start+0.1)});`); }
// demo
{ const t=st("demo"), p2=ph("demo",1).start;
  L(`tl.from("#dm-pc",{y:50,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#dm-stamp",{scale:0.7,opacity:0,duration:0.4,ease:"back.out(2)"},${f(t+0.6)});`);
  L(`tl.to("#dm-pc",{opacity:0,y:-20,duration:0.3},${f(p2-0.05)});`);
  L(`tl.from("#dm-ph",{y:50,opacity:0,duration:0.5,ease:"power3.out"},${f(p2+0.05)});`); }
// how
{ const t=st("how"), p2=ph("how",1).start;
  ["a","b","c"].forEach((k,i)=>L(`tl.from("#hw-${k}",{y:30,opacity:0,duration:0.4,ease:"back.out(1.6)"},${f(t+0.2+i*0.35)});`));
  L(`tl.from("#hw-net line",{opacity:0,duration:0.3,stagger:0.25},${f(t+0.9)});`);
  L(`tl.from("#hw-lock",{scale:0.8,opacity:0,duration:0.4,ease:"back.out(2)"},${f(t+2.2)});`);
  L(`tl.from("#hw-srv",{y:30,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(p2+0.15)});`); }
// install
{ const t=st("install"), p2=ph("install",1).start;
  L(`tl.from("#is-grid .stc",{y:30,opacity:0,duration:0.3,stagger:0.18,ease:"back.out(1.6)"},${f(t+0.3)});`);
  L(`tl.from("#is-note",{opacity:0,x:-30,duration:0.4},${f(t+2.2)});`);
  L(`tl.from("#is-two .tw",{y:40,opacity:0,duration:0.45,stagger:0.35,ease:"back.out(1.6)"},${f(p2+0.1)});`); }
// note
{ const t=st("note"), p2=ph("note",1).start;
  lines("#nt-h",t+0.05,0.55,0.2);
  L(`tl.from("#nt-route",{y:40,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(t+0.9)});`);
  L(`tl.from("#nt-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.8,ease:"back.out(1.8)"},${f(p2+0.2)});`); }
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
const wave=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60"><path d="M0 30 Q60 0 120 30 T240 30" fill="none" stroke="rgba(15,124,124,.28)" stroke-width="4"/></svg>`);
const netbg=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360"><g stroke="rgba(127,227,214,.28)" stroke-width="2"><line x1="40" y1="60" x2="200" y2="140"/><line x1="200" y1="140" x2="320" y2="40"/><line x1="200" y1="140" x2="150" y2="300"/><line x1="150" y1="300" x2="320" y2="260"/><line x1="40" y1="60" x2="60" y2="240"/><line x1="60" y1="240" x2="150" y2="300"/></g><g fill="rgba(127,227,214,.5)"><circle cx="40" cy="60" r="7"/><circle cx="200" cy="140" r="9"/><circle cx="320" cy="40" r="6"/><circle cx="150" cy="300" r="8"/><circle cx="320" cy="260" r="6"/><circle cx="60" cy="240" r="6"/></g></svg>`);
const tick=svg(`<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><circle cx="0" cy="70" r="22" fill="rgba(179,71,0,.16)"/><circle cx="140" cy="70" r="22" fill="rgba(179,71,0,.16)"/><line x1="12" y1="70" x2="128" y2="70" stroke="rgba(179,71,0,.2)" stroke-width="3" stroke-dasharray="10 8"/></svg>`);
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
.bg.t-halftone{background-color:#FFB28A;background-image:radial-gradient(#E8663E 9px,transparent 10px),radial-gradient(#E8663E 5px,transparent 6px);background-size:64px 64px,64px 64px;background-position:0 0,32px 32px}
.bg.t-teal{background-color:#0F7C7C}
.bg.t-teal::before{content:"";position:absolute;left:-260px;top:1180px;width:900px;height:900px;border-radius:50%;background:#0A5F5F}
.bg.t-teal::after{content:"";position:absolute;right:-300px;top:-240px;width:760px;height:760px;border-radius:50%;background:#0C6B6B}
.bg.t-waves{background-color:#EAF6F4;background-image:${wave};background-size:240px 60px}
.bg.t-sky{background-color:#D7E9F7;background-image:linear-gradient(180deg,#EAF4FC 0%,#C5DDF0 100%)}
.bg.t-sky::before{content:"";position:absolute;left:-60px;top:1500px;width:1200px;height:260px;background:#B7D3EA;border-radius:50% 50% 0 0}
.bg.t-net{background-color:#0A2430;background-image:${netbg};background-size:360px 360px}
.bg.t-tickets{background-color:#FFD84D;background-image:${tick};background-size:140px 140px}
.bg.t-brick{background-color:#B5452B;background-image:linear-gradient(rgba(0,0,0,.18) 3px,transparent 3px),linear-gradient(90deg,rgba(0,0,0,.18) 3px,transparent 3px);background-size:180px 72px,180px 144px}
.bg.t-arcs{background-color:#0F7C7C;background-image:repeating-radial-gradient(circle at 50% 108%,rgba(255,255,255,.16) 0 4px,transparent 4px 120px)}
/* hook */
.devrow{display:flex;align-items:flex-end;justify-content:space-between;margin-top:400px;position:relative}
.phone{width:150px;height:290px;border-radius:26px;border:8px solid var(--ink);background:#fff;position:relative;box-shadow:8px 8px 0 var(--ink)}
.phone i{position:absolute;left:50%;top:12px;width:44px;height:8px;margin-left:-22px;border-radius:4px;background:var(--ink)}
.laptop{width:400px}
.lscr{height:250px;border:8px solid var(--ink);border-radius:14px 14px 0 0;background:#fff;box-shadow:8px 8px 0 var(--ink)}
.lbase{height:20px;background:var(--ink);border-radius:0 0 20px 20px;width:460px;margin-left:-30px}
.cloud{position:absolute;left:290px;top:-290px;width:260px;text-align:center;background:#fff;color:#14181A;border:4px solid var(--ink);border-radius:60px;padding:22px 10px;font-size:34px;font-weight:700;box-shadow:8px 8px 0 var(--ink)}
.cloud small{font-size:22px;color:#555}
.arc{position:absolute;left:0;top:170px;width:840px;height:360px}
.gap{position:absolute;left:230px;top:660px;background:var(--ink);color:#FFE9DC;padding:14px 22px;font-size:30px;font-weight:700}
/* intro */
.logo{width:170px;height:170px;display:block;border-radius:50%;background:#fff;padding:14px;box-shadow:0 14px 30px rgba(0,0,0,.25)}
.logo.sm{width:130px;height:130px;padding:11px}
#in-h{margin-top:18px;font-size:190px}
.chips{display:flex;flex-wrap:wrap;gap:14px;margin-top:22px}
.chip{color:#14181A;background:#fff;border:2px solid var(--ink);border-radius:10px;padding:14px 22px;font-size:30px;font-weight:700}
.chip.hotchip{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.chip.dim2{background:transparent;color:var(--ink);border:2px dashed var(--ink);font-weight:500;font-size:24px}
/* where */
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}
.pl{display:flex;justify-content:space-between;align-items:center;padding:26px 26px;border:3px solid var(--ink);background:#fff;font-size:34px;font-weight:700;box-shadow:6px 6px 0 var(--ink);color:#14181A}
.pl b{color:#0F7C7C;font-size:40px}
.swap{display:flex;align-items:center;justify-content:space-between;margin-top:34px;background:var(--ink);color:#EAF6F4;padding:22px 30px;font-size:34px;font-weight:700}
.swap b{font-size:52px;color:#7FE3D6}
/* demo */
.shotwrap{position:relative;height:700px;margin-top:10px}
.shot{position:absolute;left:0;top:0;width:840px;border:3px solid var(--ink);background:#fff;box-shadow:12px 12px 0 var(--ink);overflow:hidden}
.shot img{display:block;width:840px;height:auto}
.st{position:absolute;right:14px;background:#0F7C7C;color:#fff;font-size:22px;font-weight:700;padding:5px 12px}.st.now{background:#E4572E}
.shot.ph{left:247px;width:346px;height:700px;top:0}
.shot.ph img{width:346px;height:700px}
.stamp{position:absolute;left:0;top:760px;background:var(--ink);color:#EAF4FC;padding:12px 18px;font-size:26px;font-weight:700}
/* how */
.net{position:relative;width:840px;height:440px;margin-top:20px}
.net svg{position:absolute;left:0;top:0;width:840px;height:440px}
.nd{position:absolute;width:250px;text-align:center;padding:20px 8px;background:#fff;color:#0A2430;border:3px solid var(--hl);font-size:30px;font-weight:800;box-shadow:6px 6px 0 var(--hl)}
.lockb{position:absolute;left:150px;top:392px;background:var(--hl);color:var(--hlt);padding:10px 16px;font-size:23px;font-weight:700}
.srv{margin-top:80px;display:flex;justify-content:space-between;align-items:center;border:3px dashed var(--ink);padding:22px 28px;font-size:32px;font-weight:700}
.srv b{color:#FF6B5A;font-size:60px}
/* install */
.stores{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
.stc{background:#fff;color:#3A2A00;border:3px solid var(--ink);padding:20px 16px;font-size:30px;font-weight:700;text-align:center;box-shadow:6px 6px 0 var(--ink)}
.two{display:flex;gap:20px;margin-top:40px}
.tw{flex:1;background:#fff;color:#3A2A00;border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink);padding:22px 20px}
.tw.hot{background:var(--ink);color:#FFE27A}
.tl{font-size:22px;font-weight:700;letter-spacing:.1em}.tv{font-family:Anton,sans-serif;font-size:60px;margin-top:6px;line-height:1.1}
.ntx{margin-top:34px;font-size:30px;font-weight:700}
/* note */
#nt-h{font-size:200px}
.route{display:flex;align-items:center;justify-content:space-between;margin-top:30px}
.rd{background:#fff;color:#3B1306;border:3px solid var(--ink);padding:24px 34px;font-size:40px;font-weight:800;box-shadow:6px 6px 0 var(--ink)}
.rx{font-size:90px;color:#FFD166;font-weight:700}
/* cta */
#ct-h{margin-top:20px;font-size:160px}
.urlcard{margin-top:34px;background:#fff;border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink)}
.urlbar{display:flex;align-items:center;gap:10px;padding:13px 20px;background:#D8EFEE;font-size:22px;color:#0A4A4A}
.urlbar i{width:14px;height:14px;border-radius:50%;background:#9CCFCB;display:block}
.urlbody{padding:32px 26px;font-size:38px;font-weight:700;color:#14181A}
.urlbody b{color:#0F7C7C}
.follow{display:flex;align-items:center;gap:20px;margin-top:34px}
.pill{background:var(--hl);color:var(--hlt);font-weight:800;font-size:40px;padding:20px 30px;border-radius:999px}
.handle{background:var(--ink);color:#06302E;padding:20px 30px;font-size:44px;font-weight:700}`;
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
