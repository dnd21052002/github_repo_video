import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);



const P=(pat,ink,acc,hl,hlt,term,wire,vsh,hf,rule,prog)=>({pat,ink,acc,hl,hlt,term,wire,vsh,hf,rule,prog});
const PAL = {
 hook:    P("t-tractor","#14301F","#C0392B","#1B5E3A","#FFFFFF","#10261A","rgba(20,48,31,.5)","8px 8px 0 #14301F","Anton, sans-serif","#14301F","#C0392B"),
 intro:   P("t-swiss","#FFFFFF","#FFD400","#111111","#FFFFFF","#1A1A1A","rgba(255,255,255,.7)","8px 8px 0 #111111","Anton, sans-serif","#FFFFFF","#111111"),
 demo:    P("t-check","#111111","#2B4BFF","#2B4BFF","#FFFFFF","#111111","rgba(17,17,17,.5)","10px 10px 0 #2B4BFF","Anton, sans-serif","#111111","#2B4BFF"),
 num:     P("t-sun","#2A1500","#B3261E","#2A1500","#FFE08A","#2A1500","rgba(42,21,0,.55)","8px 8px 0 #2A1500","Anton, sans-serif","#2A1500","#B3261E"),
 kinds:   P("t-polka","#FFFFFF","#FFDF6B","#FFDF6B","#0B3B37","#0B3B37","rgba(255,255,255,.6)","8px 8px 0 #0B3B37","Anton, sans-serif","#FFFFFF","#FFDF6B"),
 video:   P("t-film","#F2F2F2","#FF5A4F","#FF5A4F","#FFFFFF","#000000","rgba(242,242,242,.5)","0 0 0 8px rgba(255,90,79,.35)","Anton, sans-serif","#F2F2F2","#FF5A4F"),
 install: P("t-kraft","#3A2410","#8A3B12","#3A2410","#F5E6C8","#2B1B0C","rgba(58,36,16,.6)","8px 8px 0 #3A2410","Anton, sans-serif","#3A2410","#8A3B12"),
 note:    P("t-lilac","#2B1A5A","#5B3FD0","#5B3FD0","#FFFFFF","#2B1A5A","rgba(43,26,90,.55)","8px 8px 0 #2B1A5A","Anton, sans-serif","#2B1A5A","#5B3FD0"),
 cta:     P("t-swiss","#FFFFFF","#FFD400","#111111","#FFFFFF","#1A1A1A","rgba(255,255,255,.7)","8px 8px 0 #111111","Anton, sans-serif","#FFFFFF","#111111")
};
const vars = id=>{const p=PAL[id];return `--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--hlt:${p.hlt};--term:${p.term};--wire:${p.wire};--vsh:${p.vsh};--hf:${p.hf};`;};


// ---- scene markup -------------------------------------------------------
const st = id=>sc[id].start, en=id=>sc[id].end, ph=(id,i)=>sc[id].phrases[i];
const scenes = {};
const wall=["## Các bước","1. **Bước một** — máy khách gửi gói tin có cờ SYN","   và một số thứ tự ngẫu nhiên, rồi chuyển sang","   trạng thái chờ.","2. **Bước hai** — máy chủ trả lời bằng SYN và ACK,","   xác nhận số thứ tự và chọn số của riêng nó.","3. **Bước ba** — máy khách xác nhận, hai bên mở","   kết nối.","","Máy khách ───SYN────▶ Máy chủ","Máy khách ◀──SYN-ACK── Máy chủ","Máy khách ───ACK────▶ Máy chủ","","… và nó cứ dài mãi …"];
scenes.hook = `
  <div class="term" id="hk-t"><div class="termbar"><i></i><i></i><i></i><span>terminal · câu trả lời của AI</span></div><div class="termclip"><div class="termbody mono" id="hk-body">${wall.map(l=>`<div>${esc(l)||"&nbsp;"}</div>`).join("")}</div></div></div>
  <div class="qs" id="hk-q"><span>?</span><span>?</span><span>?</span></div>`;
scenes.intro = `
  <div class="h1" id="in-h"><span class="ln">Answer me</span><span class="ln acc">with HTML</span></div>
  <div class="shot still" id="in-shot"><img src="assets/img/text-vs-page.png"></div>
  <div class="chips" id="in-chips"><span class="chip mono">MIT</span><span class="chip mono hotchip">Claude Code · Codex · Cursor…</span></div>`;
scenes.demo = `<div class="chips lv" id="dm-chips"><span class="chip mono" id="dm-c0">Chủ đề: Blueprint → Shadcn → Paper</span><span class="chip mono hotchip" id="dm-c1">Chế độ tối · một tệp offline</span></div>`;
scenes.num = `
  <div class="bars" id="nm-bars">
   <div class="brow"><div class="blab mono">TOKEN CHỮ VIẾT RA</div>
    <div class="btrack"><div class="bfill grey" id="nm-a0"><b>4.893</b><i>tự viết HTML</i></div></div>
    <div class="btrack"><div class="bfill hot" id="nm-a1" style="width:13%"><b>612</b></div><span class="bnote mono">skill</span></div></div>
   <div class="brow"><div class="blab mono">THỜI GIAN</div>
    <div class="btrack"><div class="bfill grey" id="nm-b0"><b>31 giây</b><i>tự viết HTML</i></div></div>
    <div class="btrack"><div class="bfill hot" id="nm-b1" style="width:39%"><b>12 giây</b></div><span class="bnote mono">skill</span></div></div>
  </div>
  <div class="src mono" id="nm-src">trung vị, 3 chủ đề × 3 lần · số đo của chính repo</div>
  <div class="bill" id="nm-bill"><span class="mono">HÓA ĐƠN</span><b>≈ −15%</b></div>`;
scenes.kinds = `
  <div class="kgrid" id="kd-grid">
   <div class="kc" id="kd-0"><div class="kt">So sánh</div><div class="ka mono">→ bảng</div><div class="kmini tbl"><i></i><i></i><i></i><i></i></div></div>
   <div class="kc" id="kd-1"><div class="kt">Luồng chạy</div><div class="ka mono">→ sơ đồ</div><div class="kmini flw"><i></i><s></s><i></i><s></s><i></i></div></div>
   <div class="kc" id="kd-2"><div class="kt">Lịch sử</div><div class="ka mono">→ dòng thời gian</div><div class="kmini tml"><i></i><i></i><i></i><i></i></div></div>
   <div class="kc dashed" id="kd-3"><div class="kt">Câu hỏi 1 dòng</div><div class="ka mono">→ trả lời 1 dòng</div><div class="kmini one"><i></i></div></div>
  </div>`;
scenes.video = `
  <div class="shot still film" id="vd-shot"><img src="assets/img/video-en.png"></div>
  <div class="chips" id="vd-chips"><span class="chip mono hotchip">MP4 (cần ffmpeg)</span><span class="chip mono">WebM</span><span class="chip mono dim2">ảnh minh họa từ repo</span></div>`;
scenes.install = `
  <div class="term" id="is-t"><div class="termbar"><i></i><i></i><i></i><span>terminal</span></div><div class="termbody mono" style="font-size:25px">
    <div><span class="dim">$</span> npx skills add \<br>&nbsp;&nbsp;QingYunA/answer-me-with-html</div>
    <div class="dim" style="margin-top:14px;font-size:22px">hoặc trong Claude Code:</div>
    <div style="font-size:22px"><span class="dim">/</span>plugin marketplace add QingYunA/answer-me-with-html</div></div></div>
  <div class="chips" id="is-chips"><span class="chip mono hotchip">Node.js 20+</span><span class="chip mono">không cần npm install</span></div>`;
scenes.note = `
  <div class="h1" id="nt-h"><span class="ln">LƯU Ý</span></div>
  <div class="chips" id="nt-chips"><span class="chip mono">Nút bấm trên trang: tiếng Anh</span><span class="chip mono">Sơ đồ do AI viết: cần soát lại</span><span class="chip mono">Số đo là của chính repo</span></div>`;
scenes.cta = `
  <div class="h1" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono" style="font-size:30px">github.com/<b>QingYunA</b>/answer-me-with-html</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;

const VID = [ {id:"demo", cls:"tall", src:"assets/vid/page.mp4", dur:13, from:()=>st("demo"), to:()=>en("demo")} ];
const vidHTML = VID.map(v=>`
  <div class="vwrap ${v.cls}" id="vw-${v.id}" style="${vars(v.id)}"><video id="vv-${v.id}" src="${v.src}" muted playsinline class="clip" data-start="${f(v.from())}" data-duration="${v.dur}" data-track-index="2" data-has-audio="false"></video></div>`).join("");

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
{ const t=st("hook"), p2=ph("hook",1).start;
  L(`tl.from("#hk-t",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.to("#hk-body",{y:-110,duration:${f(p2-t)},ease:"none"},${f(t+0.3)});`);
  L(`tl.from("#hk-q span",{scale:0,opacity:0,duration:0.4,stagger:0.25,ease:"back.out(2.4)"},${f(p2+0.2)});`); }
// intro
{ const t=st("intro");
  lines("#in-h",t+0.05,0.6,0.2);
  L(`tl.from("#in-shot",{y:70,opacity:0,duration:0.55,ease:"power3.out"},${f(t+0.8)});`);
  L(`tl.from("#in-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.5,ease:"back.out(1.8)"},${f(ph("intro",1).start+0.1)});`); }
// demo
{ L(`tl.from("#dm-c0",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(ph("demo",1).start+0.2)});`);
  L(`tl.from("#dm-c1",{opacity:0,y:30,duration:0.4,ease:"back.out(1.8)"},${f(ph("demo",2).start+0.2)});`); }
// num
{ const t=st("num"), p2=ph("num",1).start;
  L(`tl.from("#nm-bars .brow",{opacity:0,y:30,duration:0.4,stagger:0.15},${f(t+0.1)});`);
  ["a0","a1","b0","b1"].forEach((k,i)=>L(`tl.from("#nm-${k}",{scaleX:0,transformOrigin:"0 50%",duration:0.7,ease:"power3.out"},${f(t+0.6+(i<2?i*0.5:1.2+(i-2)*0.5))});`));
  L(`tl.from("#nm-src",{opacity:0,duration:0.4},${f(t+3)});`);
  L(`tl.from("#nm-bill",{scale:0.6,opacity:0,duration:0.5,ease:"back.out(2)"},${f(p2+0.3)});`); }
// kinds
{ const t=st("kinds");
  [0,1,2].forEach(i=>L(`tl.from("#kd-${i}",{y:50,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(t+0.4+i*1.25)});`));
  L(`tl.from("#kd-3",{y:50,opacity:0,duration:0.45,ease:"back.out(1.6)"},${f(ph("kinds",1).start+0.1)});`); }
// video
{ const t=st("video");
  L(`tl.from("#vd-shot",{y:70,opacity:0,duration:0.55,ease:"power3.out"},${f(t+0.15)});`);
  L(`tl.from("#vd-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.35,ease:"back.out(1.8)"},${f(ph("video",1).start+0.1)});`); }
// install
{ const t=st("install");
  L(`tl.from("#is-t",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#is-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(t+2.4)});`); }
// note
{ const t=st("note");
  lines("#nt-h",t+0.05,0.5,0.2);
  L(`tl.from("#nt-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.9,ease:"back.out(1.8)"},${f(t+0.9)});`); }
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


/* ===== ANSWER-ME-WITH-HTML backgrounds: tractor / swiss / checker / sunburst / polka / film / kraft / lilac ===== */
.bg{background-position:0 0;background-image:none}
.bg.t-tractor{background-color:#fff;background-image:repeating-linear-gradient(180deg,#DDEFD6 0 96px,#FFFFFF 96px 192px),radial-gradient(#9AA79A 7px,transparent 8px),radial-gradient(#9AA79A 7px,transparent 8px);background-size:auto,40px 40px,40px 40px;background-position:0 0,20px 0,1020px 0;background-repeat:repeat,repeat-y,repeat-y}
.bg.t-tractor::after{content:"";position:absolute;left:0;top:0;width:1080px;height:1920px;background:linear-gradient(90deg,rgba(0,0,0,.08) 0 3px,transparent 3px 60px,rgba(0,0,0,.08) 60px 62px,transparent 62px 1018px,rgba(0,0,0,.08) 1018px 1020px,transparent 1020px 1077px,rgba(0,0,0,.08) 1077px)}
.bg.t-swiss{background-color:#D7261E}
.bg.t-swiss::before{content:"";position:absolute;left:560px;top:1250px;width:760px;height:760px;border-radius:50%;background:#F4F0E8}
.bg.t-swiss::after{content:"";position:absolute;left:0;top:1700px;width:1080px;height:36px;background:#111}
.bg.t-check{background-color:#F6F6F3;background-image:conic-gradient(#E4E4DE 25%,transparent 0 50%,#E4E4DE 0 75%,transparent 0);background-size:180px 180px}
.bg.t-sun{background-color:#FFC53D;background-image:repeating-conic-gradient(from 0deg at 50% 62%,#FFB300 0 7.5deg,#FFD25E 7.5deg 15deg)}
.bg.t-polka{background-color:#0F766E;background-image:radial-gradient(rgba(255,255,255,.22) 14px,transparent 15px),radial-gradient(rgba(255,223,107,.28) 8px,transparent 9px);background-size:120px 120px,120px 120px;background-position:0 0,60px 60px}
.bg.t-film{background-color:#0A0A0A;background-image:repeating-linear-gradient(180deg,#E9E9E9 0 34px,transparent 34px 72px),repeating-linear-gradient(180deg,#E9E9E9 0 34px,transparent 34px 72px);background-size:26px 100%,26px 100%;background-position:12px 20px,1042px 20px;background-repeat:repeat-y}
.bg.t-film::after{content:"";position:absolute;left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 38%,rgba(255,90,79,.18),transparent 55%)}
.bg.t-kraft{background-color:#C8A672;background-image:repeating-linear-gradient(95deg,rgba(90,55,20,.07) 0 2px,transparent 2px 9px),repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 7px)}
.bg.t-kraft::after{content:"";position:absolute;inset:36px;border:5px dashed rgba(58,36,16,.65);border-radius:14px}
.bg.t-lilac{background-color:#DCD0F7;background-image:repeating-linear-gradient(45deg,rgba(91,63,208,.18) 0 3px,transparent 3px 22px)}
.bg.t-lilac::before{content:"";position:absolute;left:-180px;top:1300px;width:520px;height:520px;border:14px solid rgba(91,63,208,.35);border-radius:50%}
.bg.t-lilac::after{content:"";position:absolute;left:640px;top:-120px;width:560px;height:560px;border:14px solid rgba(255,255,255,.7);border-radius:50%}
.h1,.h2,.mark{font-family:var(--hf);font-weight:400;letter-spacing:.005em}
.h1{font-size:150px;line-height:1.12}
.scene[id="sc-note"] .h1{font-size:230px}
.acc{color:var(--acc)}
.tag,.hl{background:var(--hl);color:var(--hlt)}
.cl>span{border-color:var(--hl)}
.chip{font-size:30px;color:#14181A}
.chip.hotchip{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.chip.dim2{background:transparent;color:var(--ink);border:2px dashed var(--wire);font-weight:500;font-size:26px}
.vwrap{position:absolute;left:60px;width:840px;overflow:hidden;background:#fff;border:2px solid var(--ink);box-shadow:var(--vsh);opacity:0;z-index:5;border-radius:4px}
.vwrap.tall{top:270px;height:672px}
.vwrap video{position:absolute;left:0;top:0;width:840px;height:672px;object-fit:cover;display:block}
.chips.lv{position:absolute;left:0;top:730px;width:840px;margin-top:0}
.shot.still{height:473px;margin-top:30px;border:2px solid var(--ink);border-radius:4px;background:#fff;box-shadow:var(--vsh)}
.shot.still img{width:840px;height:auto;top:0;left:0}
#in-h{font-size:128px}
#in-shot{height:486px;margin-top:34px}
#in-shot img{width:840px}
#in-chips,#vd-chips,#is-chips,#nt-chips{margin-top:30px}
.term{background:var(--term);border:1px solid var(--wire);box-shadow:var(--vsh);margin-top:0;color:#fff}
.termbar{background:rgba(255,255,255,.1);color:#ddd}
.termclip{height:700px;overflow:hidden}
.termbody{font-size:25px;line-height:1.55;color:#E6F0E6}
#hk-t{margin-top:20px}
.qs{position:absolute;right:20px;top:770px;display:flex;gap:12px}
.qs span{font-family:Anton,sans-serif;font-size:190px;line-height:1;color:var(--acc);text-shadow:6px 6px 0 var(--ink)}
.dim{color:#9AB09A}
#is-t .termbody{color:#fff}
.bars{margin-top:20px}
.brow{margin-bottom:40px}
.blab{font-size:26px;letter-spacing:.14em;font-weight:700;margin-bottom:12px}
.btrack{position:relative;height:84px;margin-bottom:14px}
.bfill{height:84px;display:flex;align-items:center;gap:18px;padding:0 22px;white-space:nowrap;overflow:visible;border:3px solid var(--ink)}
.bfill.grey{width:100%;background:#fff;color:#14181A}
.bfill.hot{background:var(--hl);color:var(--hlt);border-color:var(--ink)}
.bfill b{font-family:Anton,sans-serif;font-weight:400;font-size:56px}
.bfill i{font-style:normal;font-size:24px;font-weight:700;opacity:.8}
.bnote{position:absolute;top:22px;font-size:26px;font-weight:700}
#nm-a1+.bnote{left:calc(13% + 16px)}#nm-b1+.bnote{left:calc(39% + 16px)}
.src{font-size:22px;margin-top:-14px;font-weight:700}
.bill{display:inline-flex;align-items:baseline;gap:20px;margin-top:34px;background:var(--hl);color:var(--hlt);padding:16px 30px;box-shadow:8px 8px 0 var(--acc)}
.bill span{font-size:28px;letter-spacing:.14em}.bill b{font-family:Anton,sans-serif;font-weight:400;font-size:100px;line-height:1.1}
.kgrid{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:20px}
.kc{background:#fff;color:#14181A;border:3px solid var(--term);box-shadow:8px 8px 0 var(--term);padding:24px;min-height:360px;display:flex;flex-direction:column}
.kc.dashed{border-style:dashed;background:transparent;color:var(--ink);border-color:var(--ink);box-shadow:none}
.kt{font-family:Anton,sans-serif;font-size:50px;line-height:1.15}
.ka{font-size:28px;font-weight:700;margin-top:10px;color:#0F766E}.kc.dashed .ka{color:var(--acc)}
.kmini{margin-top:auto;display:flex;gap:10px;align-items:center;height:110px}
.kmini.tbl{display:grid;grid-template-columns:1fr 1fr;gap:8px}.kmini.tbl i{background:#CFE6E2;height:44px;border:2px solid #0B3B37}
.kmini.flw i{width:56px;height:56px;border:3px solid #0B3B37;background:#CFE6E2}.kmini.flw s{flex:1;height:4px;background:#0B3B37;text-decoration:none}
.kmini.tml{border-top:4px solid #0B3B37;align-items:flex-start;justify-content:space-between;padding-top:0}.kmini.tml i{width:22px;height:22px;border-radius:50%;background:#0F766E;margin-top:-13px}
.kmini.one i{display:block;width:100%;height:8px;background:var(--ink)}
.film img{filter:none}
.film{border-color:#F2F2F2;box-shadow:none}
.urlcard{border-radius:4px;border:2px solid var(--ink);box-shadow:var(--vsh);background:#fff}
.urlcard .urlbody b{color:#D7261E}
.follow .pill{background:var(--hl);color:var(--hlt)}
.handle{background:var(--ink);color:#D7261E}
.scene[id="sc-cta"] .handle,.scene[id="sc-intro"] .handle{color:#D7261E}
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