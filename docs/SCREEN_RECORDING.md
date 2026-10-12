# Quay màn hình thật (app desktop & web) trong môi trường không có màn hình

Mục tiêu: demo bằng **cảnh quay thật**, số liệu lấy từ log thật. Đã dùng để quay Meetily (app Tauri) trong cloud container không GPU.

## A. App web/thư viện JS → Playwright (khuyên dùng)
- `recording/web/rec_page_playwright.mjs`: tải trang, cuộn, đổi `<select>`, vẽ **con trỏ vòng vàng**, chụp từng khung với đồng hồ giả (xác định) → ffmpeg 30fps → mp4.
- `recording/web/rec_app_playwright.mjs`: quay app web chạy cục bộ ở chế độ demo (Aurelio).
- `recording/web/render_clip.mjs` + `reel.html`: render hình tương tác của thư viện (Hairline) bằng `page.clock.install()` + `clock.runFor(33.3ms)` + `mouse.move` + `screenshot`.
- Viewport hẹp (900×720), `deviceScaleFactor` 1.4–2 để chữ đủ to trên điện thoại. Video MP4 phải có chiều chẵn.
- Repo cần khóa API/mạng mà mình không có → KHÔNG bịa: dùng hoạt ảnh/GIF của repo (ghi "hoạt ảnh minh họa từ repo") hoặc bỏ cảnh.
- GIF demo của repo → `ffmpeg` cắt khung cửa sổ + tăng tốc (`setpts`) → mp4 im lặng.

## B. App desktop (Tauri/Electron/…) → Xvfb + xdotool + ffmpeg x11grab
Ví dụ đầy đủ: quay Meetily (build từ mã nguồn: `cd frontend && pnpm install && ./build-gpu.sh`, cần `libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libasound2-dev libxdo-dev libsoup-3.0-dev patchelf`).

1. Màn hình ảo: `Xvfb :99 -screen 0 1920x1080x24 &`; app chạy với `DISPLAY=:99` (+ `WEBKIT_DISABLE_COMPOSITING_MODE=1 WEBKIT_DISABLE_DMABUF_RENDERER=1 LIBGL_ALWAYS_SOFTWARE=1` cho WebKitGTK).
2. Không có window manager → phóng cửa sổ: `xdotool search --onlyvisible --name <tên>` rồi `xdotool windowsize $W 1920 1080; xdotool windowmove $W 0 0`.
3. Âm thanh ảo (để app "nghe" cuộc họp): PulseAudio chế độ system + null sink:
   ```
   pulseaudio -n --system --disallow-exit --exit-idle-time=-1 --daemonize=yes \
     -L "module-native-protocol-unix auth-anonymous=1 socket=/tmp/pa.sock" \
     -L "module-null-sink sink_name=meet" -L module-always-sink
   export PULSE_SERVER=unix:/tmp/pa.sock; pactl set-default-source meet.monitor
   paplay --device=meet meeting.wav      # phát "cuộc họp" vào sink; app thu từ meet.monitor
   ```
4. Quay: `ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -draw_mouse 1 -i :99 -c:v libx264 -preset ultrafast -crf 20 -pix_fmt yuv420p take.mkv` (ghi epoch bắt đầu để suy ra mốc: `recording/example_ctl_meetily.sh` có `startrec/mk`).
5. Điều khiển: `recording/ui_helpers.sh` (`shot`, `click`), `example_ctl_meetily.sh` (`launch`, `clk` di chuột mượt, `px` đọc pixel để biết nút đã bật chưa).
6. **Làm từng bước + kiểm tra ảnh/pixel** thay vì một script mù (nút "Continue" bị mờ lúc đang tải; click sớm là hỏng cả lượt quay). Ghi mốc (`mk nhãn`) tại các sự kiện.
7. Đối chiếu mốc video với log của app (log có timestamp UTC): `video_t = mốc_video_của_sự_kiện_neo + (giờ_log − giờ_log_sự_kiện_neo)`.
8. Phần chờ lâu (phiên âm trên CPU, tóm tắt…) → `setpts=PTS/N` (tua nhanh) và gắn nhãn "TUA NHANH ×N".
9. Cảnh tĩnh (ảnh chụp khung hình đẹp) + zoom/pan bằng GSAP (`scale`, `y`) khi cần đọc chữ nhỏ.

## C. Đo số liệu thật khi làm video hướng dẫn
- **Token**: lấy từ log app (ví dụ Meetily in `Prompt tokens / Output tokens / Speed`), hoặc từ trường `usage` của API (proxy ghi log: `recording/proxy.py` đứng giữa app và Ollama/OpenAI-compatible). Ghi cả điều kiện (CPU/GPU, có quay màn hình hay không — quay màn hình cùng lúc làm chậm ~2×).
- **Độ chính xác phiên âm**: so với kịch bản gốc, chuẩn hoá số (chữ→chữ số), tính `sửa-từ / tổng-từ` (lev trên từ), liệt kê từng lỗi.
- **Kết quả tóm tắt**: tự soát lỗi (thứ/ngày, tên người) và nói thẳng trong video.
- Dữ liệu đầu vào mẫu (cuộc họp giả…) do TTS/AI tạo → ghi rõ "giọng AI, sạch, không ồn"; kết quả với dữ liệu thật có thể kém hơn.
- Whisper có thể "ảo giác" khi gần như im lặng (hay bịa câu "hãy subscribe cho kênh …"): khi người xem báo lỗi như vậy, nghi trước hết là **đường thu âm** (chưa chọn thiết bị âm thanh hệ thống, mic thu lại tiếng loa, tai nghe Bluetooth đổi thiết bị), rồi mới tới model nhỏ/nhạc nền.
