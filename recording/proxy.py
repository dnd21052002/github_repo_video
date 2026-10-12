# Logging pass-through proxy: Meetily -> :11435 -> Ollama :11434. Records real token usage returned by Ollama.
import http.server, urllib.request, json, time, sys, os
OUT=os.environ.get("WORK_MT",".")  # thư mục ghi usage.jsonl / last_request.json / last_response.json
UP="http://127.0.0.1:11434"
class H(http.server.BaseHTTPRequestHandler):
    def _do(self):
        n=int(self.headers.get("Content-Length") or 0); body=self.rfile.read(n) if n else None
        req=urllib.request.Request(UP+self.path,data=body,method=self.command,headers={k:v for k,v in self.headers.items() if k.lower() not in("host","content-length")})
        t0=time.time()
        try:
            r=urllib.request.urlopen(req,timeout=3600); data=r.read(); code=r.status; hdr=r.headers
        except urllib.error.HTTPError as e:
            data=e.read(); code=e.code; hdr=e.headers
        dt=time.time()-t0
        if self.path.endswith("/chat/completions") or self.path.endswith("/api/chat") or self.path.endswith("/api/generate"):
            try:
                j=json.loads(data); u=j.get("usage") or {"prompt_eval_count":j.get("prompt_eval_count"),"eval_count":j.get("eval_count")}
                rq=json.loads(body) if body else {}
                rec={"path":self.path,"model":rq.get("model"),"seconds":round(dt,1),"usage":u,"req_chars":len(body or b""),"time":time.strftime("%H:%M:%S")}
                open(os.path.join(OUT,"usage.jsonl"),"a").write(json.dumps(rec,ensure_ascii=False)+"\n")
                open(os.path.join(OUT,"last_request.json"),"wb").write(body or b"")
                open(os.path.join(OUT,"last_response.json"),"wb").write(data)
            except Exception as e: open(os.path.join(OUT,"usage.jsonl"),"a").write(json.dumps({"err":str(e)})+"\n")
        self.send_response(code)
        for k,v in hdr.items():
            if k.lower() not in("transfer-encoding","content-length","connection"): self.send_header(k,v)
        self.send_header("Content-Length",str(len(data))); self.end_headers(); self.wfile.write(data)
    do_GET=do_POST=do_PUT=do_DELETE=do_HEAD=_do
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(("127.0.0.1",11435),H).serve_forever()
