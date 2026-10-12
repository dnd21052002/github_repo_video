# Ví dụ: toàn bộ video đã làm
Mỗi thư mục: `script.json` (kịch bản đã duyệt), `build.mjs` (bố cục + bộ nền riêng của video đó), `tiktok_post.txt`/`yt_post.txt` (bài đăng mẫu).
- `*-tiktok/`: bản 9:16 TikTok. `*-youtube-shorts/`: bản biến thể YouTube Shorts (cùng kịch bản, CTA "đăng ký").
- `meetily-guide-youtube-16x9/`: video hướng dẫn dài 16:9 (kịch bản; bố cục: `templates/build_landscape_tutorial.mjs`).
- `meetily-tiktok-screen-demo/`: bản TikTok có demo quay thật (bố cục: `templates/build_portrait_screen_demo.mjs`).
Các `build.mjs` cũ đọc `build/timeline.json` + tài nguyên trong `assets/` (ảnh/clip của từng repo KHÔNG nằm trong kit; tự tạo lại bằng quy trình ở `docs/`). Dùng chúng để tham khảo bố cục, bảng màu `PAL`, hoạt ảnh GSAP, và cách chọn nền khác nhau cho mỗi video.
