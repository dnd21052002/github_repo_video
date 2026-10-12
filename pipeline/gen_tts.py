import json, os, sys, subprocess, numpy as np, soundfile as sf
from vieneu import Vieneu
SR=48000
cfg=json.load(open("script.json"))
ref="voice/ref.wav"
tts=Vieneu()
kw={}
if os.path.exists(ref):
    kw["ref_audio"]=ref
    if os.path.exists("voice/ref.txt"): kw["ref_text"]=open("voice/ref.txt").read().strip()
    print("VOICE: cloned from",ref)
else:
    kw["voice"]=os.environ.get("VOICE","Hải Đăng"); print("VOICE preset:",kw["voice"])
out=[]; t=0.0; tl=[]
def add(a): 
    global t; out.append(a.astype(np.float32)); t+=len(a)/SR
def sil(s): add(np.zeros(int(SR*s),dtype=np.float32))
sil(0.25)
for sc in cfg["scenes"]:
    s0=t; ph=[]
    for p in sc["phrases"]:
        w=np.asarray(tts.infer(p["say"],**kw),dtype=np.float32)
        if p.get("speed"):
            sf.write("/tmp/_ph.wav",w,SR)
            subprocess.run(["ffmpeg","-y","-loglevel","error","-i","/tmp/_ph.wav","-af","atempo=%s"%p["speed"],"-ar",str(SR),"/tmp/_ph2.wav"],check=True)
            w,_=sf.read("/tmp/_ph2.wav",dtype="float32")
        # trim leading/trailing near-silence
        thr=0.01*max(1e-6,np.abs(w).max()); idx=np.where(np.abs(w)>thr)[0]
        w=w[max(0,idx[0]-int(.03*SR)):idx[-1]+int(.06*SR)]
        a=t; add(w); ph.append({**{k:v for k,v in p.items() if k not in("say","speed")},"start":round(a,3),"end":round(t,3)}); sil(0.16)
    sil(0.12)
    tl.append({**{k:v for k,v in sc.items() if k!="phrases"},"start":round(s0,3),"end":round(t,3),"phrases":ph})
audio=np.concatenate(out)
pk=np.abs(audio).max(); audio=audio/pk*0.89
sf.write("audio/narration_raw.wav",audio,SR)
json.dump({"duration":round(t,3),"scenes":tl},open("build/timeline.json","w"),ensure_ascii=False,indent=1)
print("TOTAL",t)
for s in tl: print(s["id"],s["start"],s["end"])
