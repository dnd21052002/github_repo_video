# AGENTS.md — hướng dẫn cho agent/model làm video cho kênh AI UnBox

Bạn (agent/model) đang được nhờ làm video giới thiệu repo/công cụ cho **TikTok @ai.unbox0026** và/hoặc **YouTube AIUnBox0026**. Repo này chứa công cụ + quy định đã được chủ kênh duyệt qua nhiều vòng góp ý. **Đọc `docs/RULES.md` trước khi làm bất cứ gì.** Làm đúng quy định = không bị chủ kênh sửa lại.

## Việc cần làm (playbook)
1. **Đọc**: `docs/RULES.md` (bắt buộc), `docs/PLATFORMS.md`, `docs/PRONUNCIATION.md` + `lexicon.json`, `docs/BACKGROUNDS.md` + `themes/THEMES_LOG.md`, `docs/REPO_SELECTION.md`.
2. **Xác định yêu cầu**: repo nào (nếu chưa có → chọn theo `docs/REPO_SELECTION.md`, quyết đoán, đừng hỏi lại nhiều); nền tảng nào (TikTok 9:16 / YouTube Shorts 9:16 / YouTube dài 16:9); có cần demo quay thật không.
3. **Nghiên cứu repo thật**: clone README/docs/code vào thư mục tạm; ghi lại sự thật kiểm chứng được (giấy phép, bản trả phí, API key, ngôn ngữ, hệ điều hành, số đo của repo). KHÔNG bịa số.
4. **Chuẩn bị tư liệu thật**: ảnh/GIF của repo, hoặc quay thật (`docs/SCREEN_RECORDING.md`). Đo số liệu thật nếu video có số liệu.
5. **Tạo dự án**: `scripts/setup.sh` (một lần) → `scripts/new_project.sh <thư-mục>/<tên> portrait|landscape`.
6. **Viết `script.json`** (cấu trúc: Vấn đề → Giới thiệu → Cách dùng/Demo → Số liệu/Lưu ý → Cài đặt → CTA). Mỗi cụm: `say` (lời đọc, áp dụng bảng cách đọc) + `show` (chữ slide, ≤ ~27 ký tự/dòng, 2 dòng, `*từ khóa*`). Câu cuối đúng mẫu (xem RULES §0.2).
7. **Chỉnh `build.mjs`**: chọn bố cục + **bộ nền mới** (không trùng `themes/THEMES_LOG.md`), bảng màu `PAL` theo cảnh, nội dung từng cảnh. Tham khảo `templates/` và `examples/*/build.mjs`.
8. **Chạy**: `scripts/pipeline.sh <dự-án>` (TTS → nhạc → mix → build → check → render → đo LUFS). Xem snapshot (`npx hyperframes snapshot`), sửa tới khi sạch lỗi chồng chữ/tương phản thật.
9. **Kiểm tra cuối** (checklist bên dưới).
10. **Giao**: mp4 + `cover.png` + file bài đăng theo mẫu `examples/*/tiktok_post.txt` / `yt_post.txt`. Nêu rõ cái gì đã kiểm tra thật, cái gì chưa. Thêm dòng vào `themes/THEMES_LOG.md`. Nếu chủ kênh đưa quy định mới → ghi vào `docs/RULES.md`.

## Checklist trước khi giao (tick hết)
- [ ] Giọng tiếng Việt, câu cuối đúng mẫu, `speed 0.93`; KHÔNG đọc URL; KHÔNG "mỗi tuần một repo".
- [ ] Cách đọc chỉ sửa ở `say`; `show` giữ tên gốc; tên riêng/thuật ngữ theo `lexicon.json`.
- [ ] Có nhạc nền tự soạn, ducking; **không whoosh/sfx**; −14 LUFS, peak ≤ −1.5 dBFS.
- [ ] Chuyển cảnh chỉ fade 0.3s.
- [ ] Mỗi slide một kiểu nền khác hẳn; bộ nền khác video trước; đã ghi `THEMES_LOG.md`; không dùng họ "v1".
- [ ] Caption ≤ 2 dòng, không xuống 3 dòng, từ khóa tô sáng không trải qua 2 dòng.
- [ ] Nhận diện kênh đủ: nhãn mục + handle, đường kẻ + thanh tiến độ, caption khung trắng viền màu, khối CTA cuối.
- [ ] Vùng an toàn đúng nền tảng (TikTok / Shorts / 16:9).
- [ ] Tư liệu thật; minh họa có nhãn; tua nhanh có nhãn "TUA NHANH ×N".
- [ ] Sự thật đã kiểm chứng; số tự đo ghi điều kiện; ước tính ghi "ước tính"; hạn chế nêu thẳng; tài chính có "không phải lời khuyên đầu tư".
- [ ] Bài đăng: nhãn nội dung AI; TikTok không dán link trong caption; YouTube tiêu đề ngắn + đúng 4 hashtag + (video dài) chương.
- [ ] `npx hyperframes check` không còn lỗi thật; đã xem snapshot các cảnh.
- [ ] Báo cáo trung thực: nêu rõ việc chưa kiểm tra (vd. chưa nghe lại giọng).

## Quy ước làm việc với chủ kênh
- Bị bác một lựa chọn → chọn phương án khác dứt khoát, đừng hỏi đi hỏi lại.
- Trả lời bình luận hộ: ngắn, giọng người thật.
- File gửi qua chat > 30 MB → nén bản nhẹ.
- Việc dài (render, build, TTS) chạy nền + poll; không chạy song song hai tiến trình điều khiển GUI; không `pkill -f` chuỗi có trong lệnh (xem `docs/RULES.md` §9).

## Môi trường đã dùng
Ubuntu (container cloud) 4 nhân CPU, không GPU, 15GB RAM; Python 3.13; Node 22; ffmpeg; Chromium (Playwright); HyperFrames CLI 0.8.x; VieNeu-TTS 3.8; faster-whisper 1.2. Giọng mặc định "Hải Đăng"; giọng của chủ kênh: chờ `voice/ref.wav` + `voice/ref.txt` (5–10s + lời đúng từng chữ).
