# Lỗi đã gặp & cách xử lý

| Triệu chứng | Nguyên nhân / cách xử lý |
|---|---|
| onnxruntime: `External data path escapes` khi chạy VieNeu | Cache Hugging Face dùng symlink → thay symlink bằng file thật trong `~/.cache/huggingface/hub/*/snapshots/*/` (`cp --remove-destination "$(readlink -f f)" f`). |
| faster-whisper lỗi `av` TypeError | Đừng truyền đường dẫn file; giải mã bằng ffmpeg ra float32 16kHz rồi truyền numpy (xem `pipeline/asr.py`). Chạy `python pipeline/asr.py audio/narration.wav`. |
| Mix có tiếng cũ | Thứ tự bắt buộc: gen_tts → loudnorm → music → loudnorm (`scripts/pipeline.sh`). |
| Font tên có dấu nháy hỏng CSS (`hf:""Playfair Display", serif"`) | Trong chuỗi JS dùng không nháy: `Playfair Display, serif`. |
| ffmpeg `-frames:v` với ảnh tuần tự đếm theo khung ra | Dùng `-t` làm tùy chọn input. |
| libx264 `height not divisible by 2` | Dùng kích thước chẵn (1250×704, 840×880). |
| Caption bị xuống 3 dòng / `*…*` trải 2 dòng | Rút gọn ≤ ~27 ký tự/dòng (9:16). |
| `check` báo tương phản/chồng chữ lúc chuyển cảnh | Bình thường (crossfade). Chồng thật (vd. chip đè thẻ) thì sửa vị trí/ẩn. |
| `<video>` không chạy | Đang nằm trong phần tử có `data-start` → đưa lên cấp root, bọc `div` không có `data-start`. |
| Handle không đọc được | Trùng màu hình khối nền → đổi màu nhấn cảnh đó. |
| `gh api search/...` bị chặn trong sandbox | Dùng web search; `gh` chỉ truy cập repo của phiên. |
| `apt install libwebkit2gtk-4.1-dev` không tìm thấy | `apt-get update` trước. |
| Tauri app trong Xvfb: cửa sổ nhỏ 1100×700 | Không có window manager → `xdotool windowsize/windowmove` (xem `docs/SCREEN_RECORDING.md`). |
| `xxd: command not found` | Dùng `od -An -tx1 \| tr -d " \n"` (đã có trong `ui` helpers). |
| `pkill -f` giết luôn shell đang chạy lệnh | Chuỗi mẫu có mặt trong chính lệnh. Dùng `pkill -x` hoặc kill PID. |
| Vòng `until grep -q 'Finished' log` thoát ngay | Mẫu khớp dòng cũ; dùng mẫu duy nhất/đếm số lần xuất hiện. |
| Hai script điều khiển GUI chạy song song, lượt quay hỏng | Kiểm tra tiến trình (`ps`) trước khi chạy lại; kill PID cũ. |
| Gửi file > 30 MB bị từ chối | Nén `-crf 25 -preset slow -c:a copy`. |
| Whisper ra câu "hãy subscribe cho kênh …" | Ảo giác khi gần như im lặng: kiểm tra thiết bị thu âm, mức âm, dùng tai nghe có dây, model Medium+. |
| Render lâu | CPU không GPU: 70s 9:16 ≈ 2–4 phút; 3 phút 16:9 ≈ 10 phút. Chạy nền và poll. |
