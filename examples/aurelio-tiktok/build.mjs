import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);


const PAL = {
 hook:    {pat:"t-ledger",ink:"#1F2A24",acc:"#B8332A",hl:"#1F5B45",hlt:"#FFFFFF",term:"#1F2A24",wire:"rgba(31,42,36,.5)",vsh:"10px 10px 0 #1F2A24",hf:"Playfair Display, serif",rule:"#1F2A24",prog:"#B8332A"},
 intro:   {pat:"t-olive",ink:"#F5EFD6",acc:"#E8C547",hl:"#E8C547",hlt:"#2F3A22",term:"#1F2716",wire:"rgba(232,197,71,.6)",vsh:"0 0 0 8px rgba(232,197,71,.15)",hf:"Playfair Display, serif",rule:"#E8C547",prog:"#F5EFD6"},
 dash:    {pat:"t-guil",ink:"#12372A",acc:"#1F7A5C",hl:"#1F7A5C",hlt:"#FFFFFF",term:"#12372A",wire:"rgba(18,55,42,.45)",vsh:"10px 10px 0 rgba(18,55,42,.85)",hf:"Playfair Display, serif",rule:"#12372A",prog:"#1F7A5C"},
 port:    {pat:"t-mm",ink:"#0F3B2E",acc:"#2E7D5B",hl:"#0F3B2E",hlt:"#FFFFFF",term:"#0F3B2E",wire:"rgba(15,59,46,.5)",vsh:"10px 10px 0 rgba(15,59,46,.85)",hf:"Playfair Display, serif",rule:"#0F3B2E",prog:"#2E7D5B"},
 ai:      {pat:"t-gold",ink:"#F4EFE1",acc:"#E8C547",hl:"#E8C547",hlt:"#1B1C1F",term:"#0E0F11",wire:"rgba(232,197,71,.55)",vsh:"0 0 0 8px rgba(232,197,71,.14)",hf:"Playfair Display, serif",rule:"#E8C547",prog:"#F4EFE1"},
 cost:    {pat:"t-terra",ink:"#FFF6E8",acc:"#FFE08A",hl:"#FFE08A",hlt:"#5A1F12",term:"#4A180E",wire:"rgba(255,246,232,.6)",vsh:"0 0 0 8px rgba(255,246,232,.14)",hf:"Playfair Display, serif",rule:"#FFF6E8",prog:"#FFE08A"},
 install: {pat:"t-night",ink:"#E8F0F7",acc:"#7FD1AE",hl:"#7FD1AE",hlt:"#0D1B2A",term:"#06101C",wire:"rgba(127,209,174,.5)",vsh:"0 0 0 8px rgba(127,209,174,.12)",hf:"Playfair Display, serif",rule:"#E8F0F7",prog:"#7FD1AE"},
 note:    {pat:"t-hazard",ink:"#1B1B1B",acc:"#B8332A",hl:"#1B1B1B",hlt:"#FFE600",term:"#1B1B1B",wire:"rgba(27,27,27,.6)",vsh:"10px 10px 0 #1B1B1B",hf:"Anton, sans-serif",rule:"#1B1B1B",prog:"#B8332A"},
 cta:     {pat:"t-ledger",ink:"#1F2A24",acc:"#B8332A",hl:"#1F5B45",hlt:"#FFFFFF",term:"#1F2A24",wire:"rgba(31,42,36,.5)",vsh:"10px 10px 0 #1F2A24",hf:"Playfair Display, serif",rule:"#1F2A24",prog:"#B8332A"}
};
const vars = id=>{const p=PAL[id];return `--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--hlt:${p.hlt};--term:${p.term};--wire:${p.wire};--vsh:${p.vsh};--hf:${p.hf};`;};

// ---- scene markup -------------------------------------------------------
const st = id=>sc[id].start, en=id=>sc[id].end, ph=(id,i)=>sc[id].phrases[i];
const scenes = {};
scenes.hook = `
  <div class="h1" id="hk-h"><span class="ln">Tiền của bạn</span><span class="ln acc">đang ở đâu?</span></div>
  <div class="cards" id="hk-cards">${[["Ngân hàng"],["Sàn chứng khoán"],["Quỹ chỉ số"],["Khoản vay nhà"]].map((c,i)=>`<div class="card" id="hk-c${i}"><div class="mono lab2">${c[0]}</div><div class="amt">€ ???</div></div>`).join("")}</div>
  <div class="total" id="hk-t"><span class="mono">TỔNG</span><b>€ ???</b></div>`;
scenes.intro = `
  <div class="mark" id="in-mark"><span class="ln">Aurelio</span></div>
  <div class="tag" id="in-tag"><span class="mono">Quản lý tài sản · chạy local</span></div>
  <div class="chips" id="in-chips"><span class="chip mono">MIT</span><span class="chip mono">Python + React</span><span class="chip mono hotchip">Dữ liệu ở máy bạn</span></div>
  <div class="shot still" id="in-shot"><img id="in-img" src="assets/img/dash_shot.jpg"></div>`;
scenes.dash = `<div class="chips lv" id="ds-chips"><span class="chip mono hotchip">Rê chuột: xem chi tiết từng điểm</span></div>`;
scenes.port = `<div class="chips lv" id="pt-chips"><span class="chip mono" id="pt-c0">Giá vốn · lãi lỗ · cổ tức</span></div><div class="chips lw" id="lk-chips"><span class="chip mono hotchip">Quốc gia · ngành · công ty · tiền tệ</span><span class="chip mono dim2">hoạt ảnh minh họa từ repo</span></div>`;
scenes.ai = `<div class="chips lw" id="ai-chips"><span class="chip mono" id="ai-c0">Trả lời từ số liệu của bạn</span><span class="chip mono" id="ai-c1">Có thể tìm web</span><span class="chip mono hotchip" id="ai-c2">Bạn xác nhận mới thực hiện</span><span class="chip mono dim2">hoạt ảnh minh họa từ repo</span></div>`;
scenes.cost = `
  <div class="stat" id="co-s0"><b>$0,11</b><span class="mono">câu hỏi đầu<br>(kèm 2 thẻ đề xuất)</span></div>
  <div class="stat" id="co-s1"><b>$0,03</b><span class="mono">câu hỏi tiếp theo<br>trong cùng cuộc trò chuyện</span></div>
  <div class="stat" id="co-s2"><b>$0,33–0,51</b><span class="mono">một lần phân tích<br>toàn bộ danh mục</span></div>
  <div class="chips" id="co-chips"><span class="chip mono hotchip">mô-đồ mặc định: Claude Opus 5.5</span><span class="chip mono dim2">đo tháng 10/2026</span></div>`;
scenes.install = `
  <div class="term" id="is-t"><div class="termbar"><i></i><i></i><i></i><span>terminal</span></div><div class="termbody mono">
    <div><span class="dim">$</span> git clone …/aurelio-finance.git</div>
    <div><span class="dim">$</span> cd aurelio-finance</div>
    <div><span class="dim">$</span> ./start.sh --demo</div>
    <div class="ok2">→ http://localhost:8000</div></div></div>
  <div class="chips" id="is-chips"><span class="chip mono">macOS · Linux: start.sh</span><span class="chip mono">Windows: start.ps1 -Demo</span></div>
  <div class="chips" id="is-chips2"><span class="chip mono hotchip">Git · Node 22+ · uv</span></div>`;
scenes.note = `
  <div class="h1" id="nt-h"><span class="ln">LƯU Ý</span></div>
  <div class="chips" id="nt-chips"><span class="chip mono">€ đồng euro</span><span class="chip mono">quỹ ETF châu Âu</span><span class="chip mono">Hỏi AI: nội dung đi qua OpenRouter</span></div>`;
scenes.cta = `
  <div class="h1" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono" style="font-size:30px">github.com/<b>LosaLosSantos</b>/aurelio-finance</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;

// clips: real app recordings (Playwright, deterministic clock) + the repo's own banner animation (cropped)
const VID = [
  {id:"dash", cls:"tall", src:"assets/vid/dash.mp4", dur:7.7,  from:()=>st("dash"), to:()=>en("dash")},
  {id:"port", cls:"tall", src:"assets/vid/port.mp4", dur:4.2,  from:()=>st("port"), to:()=>ph("port",1).start-0.1},
  {id:"look", cls:"wide", src:"assets/vid/look.mp4", dur:4.9,  from:()=>ph("port",1).start, to:()=>en("port")},
  {id:"ask",  cls:"wide", src:"assets/vid/ask.mp4",  dur:9.7,  from:()=>st("ai"), to:()=>en("ai")}
];
const vidHTML = VID.map(v=>`
  <div class="vwrap ${v.cls}" id="vw-${v.id}" style="${vars(v.id==="look"?"port":v.id==="ask"?"ai":v.id)}"><video id="vv-${v.id}" src="${v.src}" muted playsinline class="clip" data-start="${f(v.from())}" data-duration="${v.dur}" data-track-index="2" data-has-audio="false"></video></div>`).join("");

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
  const t0=v.from(), t1=v.to();
  L(`tl.fromTo("#vw-${v.id}",{opacity:0,y:40},{opacity:1,y:0,duration:0.4,ease:"power3.out"},${f(t0+0.05)});`);
  L(`tl.to("#vw-${v.id}",{opacity:0,duration:0.3},${f(t1-0.05)});`);
});
// hook
{ const t=st("hook");
  lines("#hk-h",t+0.05,0.6,0.25);
  [0,1,2,3].forEach(i=>L(`tl.from("#hk-c${i}",{y:50,opacity:0,duration:0.4,ease:"back.out(1.6)"},${f(t+0.9+i*0.55)});`));
  const p2=ph("hook",1).start;
  L(`tl.to("#hk-cards",{opacity:0,duration:0.3},${f(p2)});`);
  L(`tl.from("#hk-t",{scale:0.7,opacity:0,duration:0.5,ease:"back.out(2)"},${f(p2+0.2)});`); }
// intro
{ const t=st("intro");
  lines("#in-mark",t+0.1,0.7);
  L(`tl.from("#in-tag",{opacity:0,x:-40,duration:0.45,ease:"power2.out"},${f(t+0.8)});`);
  L(`tl.from("#in-chips .chip",{opacity:0,y:30,duration:0.35,stagger:0.5,ease:"back.out(1.8)"},${f(t+1.2)});`);
  L(`tl.from("#in-shot",{y:70,opacity:0,duration:0.55,ease:"power3.out"},${f(t+1.8)});`); }
// dash
{ const t=st("dash");
  L(`tl.from("#ds-chips .chip",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(t+2.2)});`); }
// port
{ const t=st("port");
  L(`tl.from("#pt-c0",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(t+1.8)});`);
  L(`tl.to("#pt-chips",{opacity:0,duration:0.2},${f(ph("port",1).start-0.1)});`);
  L(`tl.from("#lk-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(ph("port",1).start+0.6)});`); }
// ai
{ const t=st("ai");
  [0,1].forEach(i=>L(`tl.from("#ai-c${i}",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(t+1.4+i*1.4)});`));
  L(`tl.from("#ai-c2",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(ph("ai",1).start+0.8)});`); }
// cost
{ const t=st("cost");
  L(`tl.from("#co-s0",{x:-80,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#co-s1",{x:-80,opacity:0,duration:0.5,ease:"power3.out"},${f(ph("cost",1).start+0.1)});`);
  L(`tl.from("#co-s2",{x:-80,opacity:0,duration:0.5,ease:"power3.out"},${f(ph("cost",1).start+1.6)});`);
  L(`tl.from("#co-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(t+1.4)});`); }
// install
{ const t=st("install");
  L(`tl.from("#is-t",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#is-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(t+1.6)});`);
  L(`tl.from("#is-chips2 .chip",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(t+2.4)});`); }
// note
{ const t=st("note");
  lines("#nt-h",t+0.05,0.5,0.2);
  L(`tl.from("#nt-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.8,ease:"back.out(1.8)"},${f(t+0.8)});`); }
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
${[["Be Vietnam Pro","be-vietnam-pro",[500,700,800]],["JetBrains Mono","jetbrains-mono",[500,700]],["Anton","anton",[400]],["Playfair Display","playfair-display",[700,900]]].map(([fam,file,ws])=>ws.map(w=>`
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

/* ===== AURELIO: per-slide backgrounds (ledger / olive / banknote / graph / gold / terracotta / night / hazard) ===== */
.bg{background-position:0 0}
.bg.t-ledger{background-color:#F6F1E3;background-image:linear-gradient(90deg,transparent 108px,rgba(190,60,50,.7) 108px 110px,transparent 110px),repeating-linear-gradient(180deg,transparent 0 62px,rgba(46,125,100,.32) 62px 64px);background-size:auto}
.bg.t-olive{background-color:#2F3A22;background-image:none;background-size:auto}
.bg.t-olive::after{content:"";position:absolute;inset:40px;border:2px solid rgba(232,197,71,.7);box-shadow:inset 0 0 0 10px #2F3A22,inset 0 0 0 11px rgba(232,197,71,.4)}
.bg.t-guil{background-color:#EAF1EC;background-image:repeating-radial-gradient(circle at 12% 10%,rgba(31,122,92,.2) 0 2px,transparent 2px 16px),repeating-radial-gradient(circle at 92% 92%,rgba(31,122,92,.2) 0 2px,transparent 2px 22px);background-size:auto}
.bg.t-mm{background-color:#E4F3EA;background-image:linear-gradient(rgba(15,59,46,.28) 2px,transparent 2px),linear-gradient(90deg,rgba(15,59,46,.28) 2px,transparent 2px),linear-gradient(rgba(15,59,46,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(15,59,46,.12) 1px,transparent 1px);background-size:100px 100px,100px 100px,20px 20px,20px 20px}
.bg.t-gold{background-color:#1B1C1F;background-image:radial-gradient(circle at 85% 12%,rgba(232,197,71,.35) 0 250px,transparent 251px),radial-gradient(rgba(232,197,71,.32) 3px,transparent 3.6px);background-size:100% 100%,26px 26px}
.bg.t-terra{background-color:#C8553D;background-image:repeating-linear-gradient(90deg,rgba(255,240,220,.14) 0 40px,transparent 40px 80px),radial-gradient(circle at 20% 90%,rgba(60,15,5,.45) 0 280px,transparent 281px);background-size:auto}
.bg.t-night{background-color:#0D1B2A;background-image:radial-gradient(rgba(220,235,255,.55) 1.6px,transparent 2px),radial-gradient(rgba(220,235,255,.3) 1.2px,transparent 1.6px),radial-gradient(circle at 50% 100%,rgba(60,140,120,.35),transparent 60%);background-size:173px 211px,97px 131px,100% 100%;background-position:0 0,40px 70px,0 0}
.bg.t-hazard{background-color:#FFF4C2;background-image:repeating-linear-gradient(135deg,#1B1B1B 0 34px,#FFE600 34px 68px);background-size:100% 150px,100% 150px;background-repeat:no-repeat;background-position:0 0}
.bg.t-hazard::after{content:"";position:absolute;left:0;top:1770px;width:1080px;height:150px;background:repeating-linear-gradient(135deg,#1B1B1B 0 34px,#FFE600 34px 68px)}
.bg.t-hazard::before{content:"";position:absolute;left:0;top:150px;width:1080px;height:1620px;background:#FFF4C2}
.rule{background:#1F2A24}
.h1,.h2,.mark{font-family:var(--hf,"Playfair Display",serif);font-weight:900;letter-spacing:-0.02em}
.scene[id="sc-note"] .h1{font-family:"Anton",sans-serif;font-weight:400;font-size:230px;letter-spacing:.01em}
.h1{font-size:112px;line-height:1.12}
.mark{position:static;font-size:190px;line-height:1.1}
.tag{position:static;display:inline-block;margin-top:6px;background:var(--hl);color:var(--hlt);border-radius:8px}
.hl{background:var(--hl);color:var(--hlt,#fff)}
.cl>span{border-color:var(--hl)}
.chip.hotchip{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.chip.dim2{background:transparent;color:var(--ink);border:2px dashed var(--wire);font-weight:500;font-size:26px}
.chip{font-size:30px}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:34px}
.card{background:#fff;border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink);padding:26px 24px;color:#1F2A24}
.card .lab2{font-size:26px;color:#4C5E55}
.card .amt{font-family:"Playfair Display",serif;font-weight:900;font-size:64px;margin-top:10px;color:#B8332A}
.total{position:absolute;left:0;top:380px;display:flex;align-items:baseline;gap:22px;background:var(--ink);color:#F6F1E3;padding:22px 32px;box-shadow:10px 10px 0 var(--acc)}
.total span{font-size:30px;letter-spacing:.14em;color:#E8C547}.total b{font-family:"Playfair Display",serif;font-size:96px}
.vwrap{position:absolute;left:60px;width:840px;overflow:hidden;background:#FBFAF5;border:2px solid var(--ink);box-shadow:var(--vsh);opacity:0;z-index:5;border-radius:4px}
.vwrap.tall{top:270px;height:672px}
.vwrap.wide{top:300px;height:432px}
.vwrap video{position:absolute;left:0;top:0;width:840px;display:block;object-fit:cover}
.vwrap.tall video{height:672px}.vwrap.wide video{height:432px}
.chips.lv{position:absolute;left:0;top:700px;width:840px;margin-top:0}
.chips.lw{position:absolute;left:0;top:500px;width:840px;margin-top:0}
.shot.still{height:420px;margin-top:30px;border:2px solid var(--wire);border-radius:4px;background:#FBFAF5;box-shadow:none}
#in-img{width:840px;height:auto;top:0}
#in-chips{margin-top:26px}
.stat{display:flex;align-items:center;gap:26px;background:rgba(255,246,232,.1);border:2px solid var(--wire);padding:20px 26px;margin-bottom:22px}
.stat b{font-family:"Playfair Display",serif;font-weight:900;font-size:96px;color:var(--acc);min-width:280px;line-height:1}
.stat span{font-size:27px;line-height:1.35;color:var(--ink)}
.term{background:var(--term);border:1px solid var(--wire);box-shadow:none;margin-top:0}
.termbar{background:rgba(255,255,255,.08);color:var(--ink)}
.termbody{font-size:30px;line-height:1.7}
.termbody .ok2{color:#7FD1AE;margin-top:4px}
#is-chips,#is-chips2,#co-chips,#nt-chips{margin-top:28px}
.urlcard{border-radius:4px;border:2px solid var(--ink);box-shadow:8px 8px 0 var(--ink)}
.urlcard .urlbody b{color:#1F5B45}
.follow .pill{background:var(--hl);color:var(--hlt)}
.handle{background:var(--ink);color:#F6F1E3}
.lbl,.hdl{font-family:"JetBrains Mono",monospace}
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
