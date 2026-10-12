import sys, numpy as np, soundfile as sf, subprocess
from faster_whisper import WhisperModel
def load(p):
    raw=subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","1","-ar","16000","-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.float32)
m=WhisperModel("small",device="cpu",compute_type="int8")
segs,_=m.transcribe(load(sys.argv[1]),language="vi",beam_size=3)
for s in segs: print(round(s.start,1),s.text.strip())
