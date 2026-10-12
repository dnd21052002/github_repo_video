import numpy as np, json, soundfile as sf, subprocess, math
import os
# MUSIC_PROFILE=tiktok (default, 107 BPM, C D G C D C E G) | youtube (variant, 100 BPM, A F C G ...)
PROFILE=os.environ.get("MUSIC_PROFILE","tiktok")
SR=48000; rng=np.random.default_rng(7 if PROFILE=="tiktok" else 23)
T=json.load(open("build/timeline.json")); DUR=math.ceil((T["duration"]+0.6)*10)/10
N=int(DUR*SR)
L=np.zeros(N,np.float32); R=np.zeros(N,np.float32)
BPM=107 if PROFILE=="tiktok" else 100; beat=60/BPM; bar=4*beat
def put(sig,t,pan=0.0,g=1.0):
    i=int(t*SR)
    if i>=N: return
    s=sig[:N-i]*g; L[i:i+len(s)]+=s*(1-max(pan,0)); R[i:i+len(s)]+=s*(1+min(pan,0))
def tt(d): return np.arange(int(d*SR))/SR
def midi(n): return 440*2**((n-69)/12)
def sub(f,d,att=0.012):
    t=tt(d); env=np.minimum(t/att,1)*np.exp(-t*1.7)*np.minimum((d-t)/0.05,1)
    w=np.sin(2*np.pi*f*t)+0.0
    w=np.tanh(2.2*w)          # saturation -> harmonics audible on phone speakers
    w+=0.25*np.sin(2*np.pi*2*f*t)
    return (w*env).astype(np.float32)
def pad(freqs,d):
    t=tt(d); out=np.zeros_like(t)
    for f in freqs:
        for det in (-0.003,0.003):
            ff=f*(1+det)
            for h in range(1,5): out+=np.sin(2*np.pi*ff*h*t)/h**2.0
    a=np.minimum(t/1.0,1)*np.minimum((d-t)/1.0,1)
    return (out*a/(len(freqs)*2)).astype(np.float32)
def keys(f,d=1.1):
    t=tt(d); e=np.exp(-t*3.5)
    return ((np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*2*f*t)*np.exp(-t*8)+0.15*np.sin(2*np.pi*3*f*t)*np.exp(-t*14))*e*np.minimum(t/0.006,1)).astype(np.float32)
def kick():
    t=tt(0.28); f=48+80*np.exp(-t*32); ph=2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph)*np.exp(-t*12)).astype(np.float32)
def noise(d,hp=True): 
    n=rng.standard_normal(int(d*SR)).astype(np.float32); return np.diff(n,prepend=0) if hp else n
def hat(): t=tt(0.05); return noise(0.05)*np.exp(-t*80)*0.4
# bar roots observed in the reference: C D G C D C E G  (midi bass octave 2)
roots=[36,38,31,36,38,36,40,31] if PROFILE=="tiktok" else [33,29,36,31,33,29,36,40]
chordtones={33:[57,60,64,67],29:[57,60,65,69],36:[60,64,67,71],38:[62,65,69,72],31:[59,62,67,71],40:[59,64,67,71]}
nb=int(DUR/bar)+2
for k in range(nb):
    t0=k*bar; r=roots[k%len(roots)]
    if t0>=DUR: break
    # bass: re-triggered on every beat (pumping sub), long tail on beat 1
    for b in range(4):
        tm=t0+b*beat
        put(sub(midi(r),beat*(1.6 if b==0 else 0.95)),tm,0,0.62 if b==0 else 0.42)
    # warm pad one octave above, sustained through bar
    put(pad([midi(n-12) for n in chordtones[r]],bar+0.6),t0,0,0.30)
    # sparse soft keys (no sparkle): two notes per bar from bar 2
    if k>=1:
        tn=chordtones[r]
        put(keys(midi(tn[1])),t0+beat*0.5,-0.3,0.14)
        put(keys(midi(tn[3]-12)),t0+beat*2.5,0.3,0.12)
    # gentle kick on 1 and 3, tiny hat on offbeats from bar 2
    if k>=1:
        put(kick(),t0,0,0.40); put(kick(),t0+2*beat,0,0.30)
        for b in range(4): put(hat(),t0+b*beat+beat/2,0.2,0.05)
stereo=np.stack([L,R],1)
sf.write("audio/_m_raw.wav",stereo,SR)
# tape-ish filtering + loudness (music ≈ -25 LUFS before ducking)
subprocess.run(["ffmpeg","-y","-loglevel","error","-i","audio/_m_raw.wav","-af","lowpass=f=4200,highpass=f=30,loudnorm=I=-18:TP=-3:LRA=7,afade=t=in:d=1.2,afade=t=out:st=%.2f:d=3"%(DUR-3),"-ar","48000","audio/music.wav"],check=True)
# mix with ducking
def rd(p):
    raw=subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","2","-ar",str(SR),"-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(raw,np.float32).reshape(-1,2)
v=rd("audio/narration.wav"); m=rd("audio/music.wav")
def fit(x): 
    o=np.zeros((N,2),np.float32); o[:min(N,len(x))]=x[:N]; return o
v,m=fit(v),fit(m)
env=np.abs(v).max(1); win=int(0.05*SR)
env=np.convolve(env,np.ones(win)/win,"same")
duck=np.clip(env/0.04,0,1); a=np.exp(-1/(0.25*SR)); 
sm=np.zeros(N,np.float32); c=0.0
for i in range(N):  # fast attack, slow release
    x=duck[i]; c = x if x>c else c*a+(1-a)*x; sm[i]=c
gain=1-0.38*sm
mix=v*1.0+m*gain[:,None]*1.0
pk=np.abs(mix).max(); 
if pk>0.95: mix*=0.95/pk
sf.write("audio/mix.wav",mix,SR)
print("DUR",DUR,"peak",pk)
