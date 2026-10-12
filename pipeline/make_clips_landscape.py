import json,subprocess,os
TAKE=os.environ.get("TAKE","take.mkv")  # path of the screen recording
T=json.load(open("build/timeline.json")); out={}
os.makedirs("assets/clips",exist_ok=True)
for s in T["scenes"]:
    if s.get("layout")!="screen": continue
    for i,p in enumerate(s["phrases"]):
        key=f'{s["id"]}_{i}'; L=p["end"]-p["start"]+0.5
        if "still" in p:
            fn=f'assets/clips/{key}.png'
            subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(p["still"]),"-i",TAKE,"-frames:v","1","-vf","scale=1250:704",fn],check=True)
            out[key]=dict(file=fn,speed=1,kind="image")
        else:
            a,b=p["src"]; sp=(b-a)/L; fn=f'assets/clips/{key}.mp4'
            subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(a),"-t",str(b-a),"-i",TAKE,"-vf",f"setpts=PTS/{sp:.5f},scale=1250:704,fps=30","-t",f"{L:.3f}","-an","-c:v","libx264","-crf","20","-pix_fmt","yuv420p",fn],check=True)
            out[key]=dict(file=fn,speed=round(sp,2),kind="video")
        print(key,out[key]["speed"],round(L,2))
json.dump(out,open("build/clips.json","w"),indent=1)
