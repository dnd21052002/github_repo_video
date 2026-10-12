# Quy trình kỹ thuật làm một video

Công cụ: **HyperFrames** (HTML → MP4, https://hyperframes.heygen.com), **VieNeu-TTS** (giọng Việt), ffmpeg, GSAP, Playwright (quay web), Xvfb + xdotool (quay app desktop).
Cài đặt: `scripts/setup.sh`. Tạo dự án: `scripts/new_project.sh <thư-mục>/<tên> portrait|landscape`. Chạy cả quy trình: `scripts/pipeline.sh <thư-mục-dự-án>`.

## Sơ đồ
```
README/docs repo thật ─▶ script.json ─▶ pipeline/gen_tts.py ─▶ audio/narration_raw.wav + build/timeline.json
                                      └▶ (nếu có cảnh quay) pipeline/make_clips_*.py ─▶ assets/clips/* + build/clips.json
audio/narration_raw.wav ─ loudnorm(-14) ─▶ narration.wav ─▶ pipeline/music.py ─▶ audio/mix.wav ─ loudnorm(-14, TP -1.5)
timeline.json (+clips.json) ─▶ build.mjs ─▶ index.html ─▶ npx hyperframes check ─▶ snapshot ─▶ render -f 30 -q high ─▶ mp4
```

## 1. `script.json` (hợp đồng dữ liệu)
```json
{"scenes":[{"id":"hook","label":"01 — VẤN ĐỀ","layout":"card|screen|tokens",
  "phrases":[{"say":"lời đọc (đã sửa cách đọc)","show":"Chữ *từ khóa*\nhai dòng","speed":0.93,
              "src":[a,b],"still":t,"cx":430,"tag":"NHÃN","side":{"k":"","v":"","s":""}}]}]}
```
- `say`: lời đọc, dùng cách đọc ở `lexicon.json`; số viết thành chữ. `show`: chữ trên slide (đúng tên gốc), `\n` ngắt dòng, `*…*` tô sáng.
- `speed` (tuỳ chọn): ffmpeg atempo cho cụm đó. Mỗi cụm = 1 caption = 1 mốc thời gian.
- Các trường `src/still/cx/tag/side/...` do `build.mjs` tự định nghĩa; `gen_tts.py` chuyển nguyên mọi trường (trừ `say`,`speed`) sang `build/timeline.json` kèm `start`,`end` (giây).
- Mỗi cảnh một `id` (dùng để chọn bảng màu `PAL[id]` và bố cục). Mẫu: `templates/script.example.json`; kịch bản các video đã làm: `examples/`.

## 2. Giọng đọc — `pipeline/gen_tts.py` (chạy trong thư mục dự án)
- Chèn 0.25s im lặng đầu, 0.16s giữa các cụm, 0.12s cuối cảnh; cắt khoảng lặng đầu/cuối từng cụm; chuẩn hoá peak 0.89.
- Có `voice/ref.wav` (+`ref.txt`) → nhân bản giọng; không có → preset (`VOICE` env, mặc định "Hải Đăng").
- VieNeu lần đầu tải model Hugging Face. Nếu lỗi "External data path escapes" → xem `TROUBLESHOOTING.md`.

## 3. Âm thanh
```
ffmpeg -y -i audio/narration_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=7 -ar 48000 audio/narration.wav
python pipeline/music.py            # đọc build/timeline.json (độ dài) + narration.wav; ghi audio/mix.wav
ffmpeg -y -i audio/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=9 -ar 48000 audio/mix_n.wav && mv audio/mix_n.wav audio/mix.wav
```
**Luôn chạy đúng thứ tự gen_tts → loudnorm → music → loudnorm** (đã từng dính lỗi dùng narration.wav cũ).

## 4. Dựng hình — `build.mjs` → `index.html`
- Hợp đồng HyperFrames: root `data-composition-id="main"` + `data-start/data-duration/data-width/data-height`; **một** timeline GSAP `paused:true` đăng ký `window.__timelines["main"]`; phần tử có thời gian dùng `class="clip"` + `data-start` + `data-duration`; `<video>` đặt ở cấp root (không nằm trong phần tử có `data-start`); `<audio id=…>`; không dùng `Date.now()/Math.random()`.
- Template tham chiếu (copy rồi chỉnh): `templates/build_portrait_screen_demo.mjs` (9:16, cảnh quay màn hình cắt dọc, thẻ token…), `templates/build_landscape_tutorial.mjs` (16:9, cột phải thông tin + danh sách chương). Các build đã dùng cho từng video: `examples/*/build.mjs` (mỗi video bố cục/nền khác nhau — tham khảo để đa dạng).
- Mỗi build đọc `build/timeline.json` (mốc) → sinh HTML + JS timeline (caption fade-up, từng khối hiện đúng lúc lời đọc nhắc tới, đổi màu đường kẻ/thanh tiến độ mỗi cảnh, crossfade 0.3s giữa các cảnh).
- Sau khi build: `npx hyperframes check` (lint + layout + contrast), `npx hyperframes snapshot -o <dir> --at t1,t2,…` rồi **xem ảnh** (ghép contact sheet bằng PIL) trước khi render.
- Render: `npx hyperframes render -f 30 -q high -o build/<tên>.mp4` (video 70s ≈ 2–4 phút; 3 phút 16:9 ≈ 10 phút trên CPU 4 nhân, không GPU).
- Kiểm tra cuối: `ffmpeg -i x.mp4 -af ebur128=peak=true -f null -` → I ≈ −14 LUFS, Peak ≤ −1.5 dBFS.

## 5. Cảnh quay thật (nếu có)
Xem `docs/SCREEN_RECORDING.md`. Cắt từ bản quay: `pipeline/make_clips_portrait.py` (crop `1031×1080` → `840×880`, tua nhanh bằng `setpts`) hoặc `make_clips_landscape.py` (scale 1250×704). Cần `TAKE=<file quay>` và các trường `src:[a,b]` / `still:t` / `cx` trong `script.json`; ghi `build/clips.json`, `assets/clips/*`. Chiều cao phải **chẵn** (libx264).

## 6. Bản YouTube Shorts từ video TikTok có sẵn
```
export WORK=<thư-mục-chứa-các-dự-án> KIT=<kit> VENV=<kit>/.venv
variants/make_yt.sh <tên> <độ-hue>     # copy $WORK/<tên>-video → $WORK/<tên>-yt, sửa CTA/handle/CSS thu nhỏ + hue
variants/render_yt.sh <tên>            # TTS + nhạc (youtube profile) + build + check; rồi tự render
```
(Quy ước dự án: thư mục `<tên>-video` = TikTok, `<tên>-yt` = Shorts. `make_yt.sh` giả định `build.mjs` có chuỗi `@ai.unbox0026`, `+ Theo dõi` và thẻ `</style></head>`; nếu khác, sửa tay.)

## 7. Gửi/giao sản phẩm
mp4 + `cover.png` (khung hình sạch ở cảnh giới thiệu) + file bài đăng (`tiktok_post.txt` / `yt_post.txt`) theo mẫu trong `examples/`. Ghi lại kiểu nền vào `themes/THEMES_LOG.md`.
