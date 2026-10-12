# Quy ước theo nền tảng

## TikTok (@ai.unbox0026) — 9:16, 1080×1920, ~50–75s
- Vùng an toàn: x 60..900, y 200..~1450 (chừa nút bên phải, mô tả/tên kênh phía dưới, thanh trên). Caption ở y≈1180. Nhãn mục + handle ở y≈150, đường kẻ y≈200.
- Caption bài đăng: `Hook (câu hỏi/nỗi đau) 👇 #aiunbox0026 #TênRepo #AIagent #congcuAI …` — có thể 4–6 hashtag.
- KHÔNG dán link trong caption → "Link repo: xem trên màn hình video / ghim ở bình luận (…)".
- Bật nhãn "Nội dung do AI tạo" (dùng TTS). Không dùng nhạc/tài nguyên có bản quyền.
- Cuối video: URL card + "@ai.unbox0026" + nút "+ Theo dõi"; lời: "Nhớ theo dõi kênh, …".
- Mẫu bài đăng: `examples/*/tiktok_post.txt`.

## YouTube Shorts (AIUnBox0026) — 9:16, bản biến thể của video TikTok
Tạo bằng `variants/make_yt.sh` + `variants/render_yt.sh` (xem `docs/PIPELINE.md`). Khác bản TikTok:
- **Bố cục thu nhỏ & lùi vào trong** vì UI Shorts che mép: CSS `zoom:0.86` cho `.lbl,.hdl,.rule,#prog,.vis,.cap,.vwrap`, lề trái 100px (`margin-left=(100-60·Z)/Z px`), lề trên đưa nhãn xuống y≈200 → chữ nằm trong y≈200..1340, x≈100..820. (Chủ kênh phản hồi: bản đầu "bị dính màn, to quá" → đã thu 0.88 → 0.86 và lùi từ 60px lên 100px; nếu vẫn sát thì 0.84 + lề 120px.)
- Đổi tông màu toàn bộ nền/nhấn (`filter:hue-rotate(N°)`, ảnh/video được bù ngược), đổi hồ sơ nhạc (`MUSIC_PROFILE=youtube`), handle `@AIUnBox0026`, nút "+ Đăng ký", câu cuối "Nhớ **đăng ký** kênh, …" (speed 0.93).
- Vẫn để link trên màn hình (link trong mô tả/bình luận Shorts không bấm được) + chép dạng chữ trong mô tả.
- **Tiêu đề NGẮN** (≤ ~40 ký tự, ví dụ "Agent Reach: cho AI đọc cả internet"), **đúng 4 hashtag** (tính cả `#Shorts`).
- Bật mục "Nội dung bị thay đổi hoặc tổng hợp" = Có (giọng TTS / cảnh do AI tạo).
- Tránh bị coi là nội dung lặp: không đăng cùng lúc với bản TikTok; nên cách nhau vài ngày; có thể viết lại câu mở đầu.
- Mẫu: `examples/*-youtube-shorts/yt_post.txt`.

## YouTube video dài (16:9) — hướng dẫn chi tiết
- 1920×1080. Bố cục: nhãn mục + handle trên cùng; khung demo (1250×704) bên trái + cột phải (thẻ "thông tin chính" + danh sách chương); caption ở y≈884 (font 54px, ≤ ~38 ký tự/dòng).
- Thumbnail 1280×720: cắt từ khung tiêu đề (không có caption).
- Mô tả: tóm tắt + link repo (chữ) + **chương có timestamp** (chương đầu 0:00, mỗi chương ≥ 10s) + số liệu đo + lưu ý trung thực + 4 hashtag.
- Mẫu: `examples/meetily-guide-youtube-16x9/yt_post.txt` (script + bố cục: `templates/build_landscape_tutorial.mjs`).

## Chung
- Tên kênh/handle: TikTok `@ai.unbox0026`; YouTube `AIUnBox0026` (`@AIUnBox0026`).
- Không nhắc tên nền tảng khác trong video (đừng nói "TikTok" trong bản YouTube và ngược lại).
- File video > 30 MB không gửi qua chat được → nén `ffmpeg -crf 25 -preset slow -c:a copy`.
