import fs from "fs";
const T = JSON.parse(fs.readFileSync("build/timeline.json","utf8"));
const DUR = Math.ceil((T.duration+0.6)*10)/10;
const sc = Object.fromEntries(T.scenes.map(s=>[s.id,s]));
const esc = s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const f = n=>+n.toFixed(3);



const P=(pat,ink,acc,hl,hlt,term,wire,vsh,hf,rule,prog)=>({pat,ink,acc,hl,hlt,term,wire,vsh,hf,rule,prog});
const PAL = {
 hook:    P("t-scan","#EAF2FF","#FF5A4F","#FF5A4F","#FFFFFF","#05070D","rgba(234,242,255,.5)","0 0 0 8px rgba(255,90,79,.3)","Anton, sans-serif","#EAF2FF","#FF5A4F"),
 intro:   P("t-memphis","#1B1340","#E5307A","#1B1340","#FFE14D","#1B1340","rgba(27,19,64,.55)","8px 8px 0 #1B1340","Anton, sans-serif","#1B1340","#E5307A"),
 where:   P("t-radar","#E6F6FF","#7FE3FF","#7FE3FF","#06284A","#041B33","rgba(230,246,255,.6)","0 0 0 8px rgba(127,227,255,.2)","Anton, sans-serif","#E6F6FF","#7FE3FF"),
 cookie:  P("t-cookie","#4A2A12","#B3441A","#4A2A12","#FFE9C7","#3A210F","rgba(74,42,18,.55)","8px 8px 0 #4A2A12","Anton, sans-serif","#4A2A12","#B3441A"),
 install: P("t-lattice","#DFF7E6","#6CFFA0","#6CFFA0","#06231A","#031610","rgba(223,247,230,.55)","0 0 0 8px rgba(108,255,160,.18)","Anton, sans-serif","#DFF7E6","#6CFFA0"),
 use:     P("t-stripe","#4A1B12","#C2410C","#C2410C","#FFFFFF","#4A1B12","rgba(74,27,18,.55)","8px 8px 0 #4A1B12","Anton, sans-serif","#4A1B12","#C2410C"),
 note:    P("t-grad","#FFFFFF","#FFD166","#FFD166","#2B0F4A","#2B0F4A","rgba(255,255,255,.65)","8px 8px 0 rgba(0,0,0,.35)","Anton, sans-serif","#FFFFFF","#FFD166"),
 cta:     P("t-spot","#FFF4E5","#FF9F2E","#FF9F2E","#1A0F00","#1A0F00","rgba(255,244,229,.6)","0 0 0 8px rgba(255,159,46,.25)","Anton, sans-serif","#FFF4E5","#FF9F2E")
};
const vars = id=>{const p=PAL[id];return `--ink:${p.ink};--acc:${p.acc};--hl:${p.hl};--hlt:${p.hlt};--term:${p.term};--wire:${p.wire};--vsh:${p.vsh};--hf:${p.hf};`;};


// ---- scene markup -------------------------------------------------------
const st = id=>sc[id].start, en=id=>sc[id].end, ph=(id,i)=>sc[id].phrases[i];
const scenes = {};
scenes.hook = `
  <div class="vp" id="hk-p"><div class="vpbar mono"><i></i><i></i><i></i><span>youtube.com/watch?v=…</span></div><div class="vpbody"><div class="vplay"></div><div class="err mono" id="hk-e1">KHÔNG XEM ĐƯỢC</div></div></div>
  <div class="post" id="hk-post"><div class="mono ptag">bài đăng mạng xã hội</div><div class="plines"><i></i><i style="width:70%"></i></div><div class="lock mono" id="hk-lock">🔒 403 · cần đăng nhập</div></div>`;
scenes.intro = `
  <div class="h1" id="in-h"><span class="ln">Agent</span><span class="ln acc">Reach</span></div>
  <div class="tag" id="in-tag"><span class="mono">Cho agent đọc &amp; tìm trên mạng</span></div>
  <div class="chips" id="in-chips"><span class="chip mono">MIT</span><span class="chip mono hotchip">Python 3.10+</span><span class="chip mono">miễn phí</span></div>
  <div class="eye" id="in-eye">👁️</div>`;
const plats=[["Web","ok"],["GitHub","ok"],["YouTube","ok"],["RSS","ok"],["Bilibili","ok"],["Reddit","lock"],["Twitter / X","lock"],["Facebook","lock"]];
scenes.where = `<div class="pgrid" id="wh-grid">${plats.map((p,i)=>`<div class="pl ${p[1]}" id="wh-${i}"><span class="mono">${p[0]}</span><b>${p[1]==="ok"?"✓":"🔒"}</b></div>`).join("")}</div>
  <div class="chips" id="wh-chips"><span class="chip mono hotchip">✓ dùng ngay</span><span class="chip mono">🔒 cần đăng nhập</span></div>`;
scenes.cookie = `
  <div class="flow3" id="ck-flow"><div class="fb" id="ck-a"><div class="mono fl">TRÌNH DUYỆT</div><div class="fv">của bạn</div></div><div class="fa">→</div><div class="fb hot" id="ck-b"><div class="mono fl">COOKIE</div><div class="fv">🍪</div></div><div class="fa">→</div><div class="fb" id="ck-c"><div class="mono fl">MÁY BẠN</div><div class="fv">🔒</div></div></div>
  <div class="chips" id="ck-chips"><span class="chip mono">Twitter / X</span><span class="chip mono">Reddit</span><span class="chip mono dim2">theo mô tả của repo</span></div>`;
scenes.install = `
  <div class="term" id="is-t"><div class="termbar"><i></i><i></i><i></i><span>dán cho agent</span></div><div class="termbody mono" style="font-size:25px">
    <div class="dim" style="font-size:22px"># một dòng:</div>
    <div>Install Agent Reach:</div>
    <div style="font-size:19px;word-break:break-all">https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md</div>
    <div style="margin-top:22px"><span class="dim">$</span> agent-reach doctor</div>
    <div class="ok2" style="font-size:22px">→ cái nào chạy được / chưa</div></div></div>
  <div class="chips" id="is-chips"><span class="chip mono hotchip">Agent tự cài</span><span class="chip mono">có lệnh doctor</span></div>`;
scenes.use = `
  <div class="uc" id="us-0"><div class="ut">Video bài giảng</div><div class="ua mono">→ tóm tắt <i>(cần có phụ đề)</i></div></div>
  <div class="uc" id="us-1"><div class="ut">Ý kiến mọi người</div><div class="ua mono">→ gom lại trước khi mua</div></div>`;
scenes.note = `
  <div class="h1" id="nt-h"><span class="ln">LƯU Ý</span></div>
  <div class="chips" id="nt-chips"><span class="chip mono">Dùng tài khoản của bạn</span><span class="chip mono">Theo điều khoản từng nền tảng</span><span class="chip mono">Mạng xã hội hay đổi cách chặn</span></div>`;
scenes.cta = `
  <div class="h1" id="ct-h"><span class="ln">Link dự án</span><span class="ln acc">ở ngay đây.</span></div>
  <div class="urlcard" id="ct-card"><div class="urlbar mono"><i></i><i></i><i></i><span>repo</span></div><div class="urlbody mono" style="font-size:32px">github.com/<b>Panniantong</b>/Agent-Reach</div></div>
  <div class="follow" id="ct-h2"><div class="handle mono">@ai.unbox0026</div><div class="pill">+ Theo dõi</div></div>`;
const VID=[]; const vidHTML="";
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
  L(`tl.from("#hk-p",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#hk-e1",{scale:0.6,opacity:0,duration:0.4,ease:"back.out(2)"},${f(t+1.2)});`);
  L(`tl.from("#hk-post",{y:60,opacity:0,duration:0.5,ease:"power3.out"},${f(p2+0.1)});`);
  L(`tl.from("#hk-lock",{scale:0.6,opacity:0,duration:0.4,ease:"back.out(2)"},${f(p2+1.0)});`); }
// intro
{ const t=st("intro");
  lines("#in-h",t+0.05,0.6,0.2);
  L(`tl.from("#in-tag",{opacity:0,x:-40,duration:0.45,ease:"power2.out"},${f(t+1.0)});`);
  L(`tl.from("#in-eye",{scale:0,rotation:-20,duration:0.5,ease:"back.out(2)"},${f(t+0.8)});`);
  L(`tl.from("#in-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.4,ease:"back.out(1.8)"},${f(ph("intro",1).start+0.1)});`); }
// where
{ const t=st("where");
  L(`tl.from("#wh-grid .pl",{y:40,opacity:0,duration:0.35,stagger:0.45,ease:"back.out(1.6)"},${f(t+0.2)});`);
  L(`tl.from("#wh-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(ph("where",1).start+0.1)});`); }
// cookie
{ const t=st("cookie");
  ["a","b","c"].forEach((k,i)=>L(`tl.from("#ck-${k}",{y:40,opacity:0,duration:0.4,ease:"back.out(1.6)"},${f(t+0.3+i*0.9)});`));
  L(`tl.from("#ck-flow .fa",{opacity:0,duration:0.3,stagger:0.9},${f(t+0.8)});`);
  L(`tl.from("#ck-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(t+1.6)});`); }
// install
{ const t=st("install");
  L(`tl.from("#is-t",{y:50,opacity:0,duration:0.45,ease:"power3.out"},${f(t+0.1)});`);
  L(`tl.from("#is-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.3,ease:"back.out(1.8)"},${f(ph("install",1).start+0.1)});`); }
// use
{ L(`tl.from("#us-0",{x:-80,opacity:0,duration:0.5,ease:"power3.out"},${f(st("use")+0.2)});`);
  L(`tl.from("#us-1",{x:-80,opacity:0,duration:0.5,ease:"power3.out"},${f(ph("use",1).start+0.1)});`); }
// note
{ const t=st("note");
  lines("#nt-h",t+0.05,0.5,0.2);
  L(`tl.from("#nt-chips .chip",{opacity:0,y:30,duration:0.4,stagger:0.8,ease:"back.out(1.8)"},${f(t+0.9)});`); }
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


/* ===== AGENT-REACH backgrounds: scanlines / memphis / radar / cookie / lattice / stripes / gradient / spotlight ===== */
.bg{background-position:0 0;background-image:none}
.bg.t-scan{background-color:#0B0F1A;background-image:repeating-linear-gradient(180deg,rgba(255,255,255,.05) 0 2px,transparent 2px 8px),radial-gradient(circle at 50% 40%,rgba(255,90,79,.22),transparent 60%)}
.bg.t-scan::after{content:"";position:absolute;left:0;top:640px;width:1080px;height:70px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.07),transparent)}
.bg.t-memphis{background-color:#FFF3DA}
.bg.t-memphis::before{content:"";position:absolute;left:640px;top:1300px;width:0;height:0;border-left:170px solid transparent;border-right:170px solid transparent;border-bottom:290px solid #2BB8A8;transform:rotate(14deg)}
.bg.t-memphis::after{content:"";position:absolute;left:-120px;top:1420px;width:380px;height:380px;border-radius:50%;background:#E5307A;box-shadow:560px -980px 0 -90px #FFD23F,700px -430px 0 -170px #1B1340}
.bg.t-radar{background-color:#06284A;background-image:repeating-radial-gradient(circle at 50% 62%,rgba(127,227,255,.28) 0 3px,transparent 3px 110px),linear-gradient(90deg,transparent 539px,rgba(127,227,255,.2) 539px 541px,transparent 541px)}
.bg.t-cookie{background-color:#E9CC9F;background-image:radial-gradient(#B98350 9px,transparent 10px),radial-gradient(#B98350 6px,transparent 7px),radial-gradient(#C79A62 11px,transparent 12px);background-size:230px 230px,170px 170px,310px 310px;background-position:20px 40px,110px 120px,200px 20px}
.bg.t-lattice{background-color:#0A2E24;background-image:repeating-linear-gradient(45deg,rgba(108,255,160,.18) 0 2px,transparent 2px 46px),repeating-linear-gradient(-45deg,rgba(108,255,160,.18) 0 2px,transparent 2px 46px)}
.bg.t-stripe{background-color:#FFD9C2;background-image:repeating-linear-gradient(90deg,#FFB48A 0 90px,#FFD9C2 90px 180px)}
.bg.t-grad{background-color:#4B1D8F;background-image:linear-gradient(160deg,#2B0F4A 0%,#7B2CBF 45%,#FF7A3D 100%)}
.bg.t-grad::after{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.12) 1.4px,transparent 1.8px);background-size:7px 7px}
.bg.t-spot{background-color:#0D0A06;background-image:radial-gradient(ellipse at 50% 18%,rgba(255,159,46,.55),transparent 55%)}
.bg.t-spot::after{content:"";position:absolute;left:290px;top:0;width:500px;height:1100px;background:linear-gradient(180deg,rgba(255,200,120,.25),transparent);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%)}
.h1,.h2,.mark{font-family:var(--hf);font-weight:400;letter-spacing:.005em}
.h1{font-size:150px;line-height:1.12}
.scene[id="sc-note"] .h1{font-size:230px}
.acc{color:var(--acc)}
.tag,.hl{background:var(--hl);color:var(--hlt)}
.cl>span{border-color:var(--hl)}
.chip{font-size:30px;color:#14181A}
.chip.hotchip{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.chip.dim2{background:transparent;color:var(--ink);border:2px dashed var(--wire);font-weight:500;font-size:26px}
.term{background:var(--term);border:1px solid var(--wire);box-shadow:var(--vsh);margin-top:0;color:#fff}
.termbar{background:rgba(255,255,255,.1);color:#ddd}
.termbody{color:#E6F0E6;line-height:1.55}
.dim{color:#9AB09A}.ok2{color:#6CFFA0}
.chips,#in-chips,#is-chips,#nt-chips{margin-top:30px}
.tag{position:static;display:inline-block;margin-top:6px;padding:16px 26px;font-size:30px;font-weight:700}
.vp{margin-top:10px;height:auto;display:block;border-radius:0;background:#000;border:2px solid var(--ink);box-shadow:var(--vsh)}
.vpbar{display:flex;gap:10px;align-items:center;padding:12px 18px;background:#1B1F2B;font-size:22px;color:#ccd}
.vpbar i{width:14px;height:14px;border-radius:50%;background:#555;display:block}
.vpbody{position:relative;height:330px;display:flex;align-items:center;justify-content:center;background:#0E1220}
.vpbody .vplay{width:0;height:0;border-left:90px solid rgba(255,255,255,.35);border-top:56px solid transparent;border-bottom:56px solid transparent}
.err{position:absolute;bottom:26px;left:0;right:0;text-align:center;font-size:44px;font-weight:700;color:#FF5A4F;letter-spacing:.08em}
.post{margin-top:34px;background:#fff;color:#14181A;border:2px solid var(--ink);box-shadow:var(--vsh);padding:24px}
.ptag{font-size:22px;color:#667}.plines i{display:block;height:22px;background:#E0E4EC;border-radius:6px;margin-top:14px}
.lock{margin-top:22px;display:inline-block;background:#FF5A4F;color:#fff;padding:12px 22px;font-size:32px;font-weight:700}
.eye{position:absolute;right:10px;top:120px;font-size:200px;line-height:1}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}
.pl{display:flex;justify-content:space-between;align-items:center;padding:24px 26px;border:3px solid var(--ink);background:rgba(255,255,255,.08);font-size:34px;font-weight:700}
.pl.ok{background:var(--hl);color:var(--hlt);border-color:var(--hl)}
.pl b{font-size:38px}
.flow3{display:flex;align-items:center;gap:14px;margin-top:20px}
.fb{flex:1;background:#fff;color:#14181A;border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink);padding:26px 14px;text-align:center}
.fb.hot{background:var(--hl);color:var(--hlt)}
.fl{font-size:21px;font-weight:700;letter-spacing:.08em}.fv{font-family:Anton,sans-serif;font-size:56px;margin-top:10px;line-height:1.1}
.fa{font-size:56px;font-weight:700;color:var(--ink)}
.uc{background:#fff;color:#14181A;border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink);padding:28px 30px;margin-bottom:30px}
.ut{font-family:Anton,sans-serif;font-size:76px;line-height:1.15}
.ua{font-size:30px;font-weight:700;margin-top:12px;color:var(--acc)}.ua i{font-style:normal;font-weight:500;color:#555}
.urlcard{border-radius:4px;border:2px solid var(--ink);box-shadow:var(--vsh);background:#fff}
.urlcard .urlbody b{color:#C2410C}
.follow .pill{background:var(--hl);color:var(--hlt)}
.handle{background:var(--ink);color:#1A0F00}
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