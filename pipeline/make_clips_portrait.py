import json,subprocess,os
TAKE=os.environ.get("TAKE","take.mkv")  # path of the screen recording
T=json.load(open("build/timeline.json")); out={}
for s in T["scenes"]:
    if s.get("layout")!="screen": continue
    for i,p in enumerate(s["phrases"]):
        key=f'{s["id"]}_{i}'; L=p["end"]-p["start"]+0.5; cx=p["cx"]
        crop=f"crop=1031:1080:{cx}:0,scale=840:880"
        if "still" in p:
            fn=f'assets/clips/{key}.png'
            subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(p["still"]),"-i",TAKE,"-frames:v","1","-vf",crop,fn],check=True)
            out[key]=dict(file=fn,speed=1,kind="image")
        else:
            a,b=p["src"]; sp=(b-a)/L; fn=f'assets/clips/{key}.mp4'
            subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(a),"-t",str(b-a),"-i",TAKE,"-vf",f"{crop},setpts=PTS/{sp:.5f},fps=30","-t",f"{L:.3f}","-an","-c:v","libx264","-crf","20","-pix_fmt","yuv420p",fn],check=True)
            out[key]=dict(file=fn,speed=round(sp,2),kind="video")
        print(key,out[key]["speed"],round(L,2))
json.dump(out,open("build/clips.json","w"),indent=1)
