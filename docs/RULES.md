# QUY ĐỊNH & QUY ƯỚC LÀM VIDEO (chủ kênh đã duyệt)

> Dành cho MỌI người/agent/model làm video cho kênh **TikTok @ai.unbox0026** và **YouTube AIUnBox0026**.
> Từ khóa: **PHẢI** = bắt buộc · **KHÔNG** = cấm · **NÊN** = mặc định tốt, chỉ bỏ khi có lý do và phải nói rõ.
> Mỗi quy định dưới đây đều xuất phát từ một lần chủ kênh góp ý thật. Đừng "cải tiến" bỏ qua chúng.
> Khi chủ kênh đưa quy định mới: thêm vào file này (đánh dấu ngày) rồi mới làm tiếp.

## 0. Tóm tắt 12 điều quan trọng nhất
1. Video giới thiệu **repo/công cụ thật**, giọng đọc tiếng Việt, hình ảnh là **tư liệu thật** (ảnh/GIF/cảnh quay app), KHÔNG ảnh stock/robot.
2. **KHÔNG đọc URL/đường dẫn repo.** Kết video: "Link dự án mình để ngay trên màn hình nhé." + "Nhớ theo dõi kênh, để xem thêm nhiều công cụ ây ai hay nhé." (YouTube: "đăng ký kênh").
3. **KHÔNG nói** "mỗi tuần một repo".
4. **PHẢI có nhạc nền tự soạn** (bass ~107 BPM), hạ nhỏ khi có giọng; mix cuối −14 LUFS, peak ≤ −1.5 dBFS.
5. **KHÔNG tiếng vút/whoosh/sfx** khi chuyển cảnh. Chuyển cảnh chỉ **fade ~0.3s**.
6. **Nền đổi hẳn kiểu theo từng slide**, và **không trùng bộ nền** với video khác (xem `docs/BACKGROUNDS.md`).
7. Sửa cách đọc chỉ ở trường `say`, **KHÔNG sửa chữ trên slide (`show`)** để chữa lỗi phát âm.
8. Caption ≤ ~27 ký tự/dòng, tối đa 2 dòng (9:16); từ khóa tô sáng `*từ*`, không trải qua 2 dòng.
9. **Trung thực**: kiểm chứng trong code/README, không bịa số, nêu rõ hạn chế; số tự đo phải ghi rõ "tự đo"; ước tính phải ghi "ước tính".
10. Vùng an toàn theo nền tảng (TikTok / YouTube Shorts khác nhau) — xem `docs/PLATFORMS.md`.
11. Đăng bài: nhãn nội dung AI, link KHÔNG dán trong caption TikTok; YouTube: tiêu đề ngắn, đúng 4 hashtag.
12. Không hỏi lại chủ kênh về việc chọn repo nhiều lần: bị bác thì chọn repo khác một cách dứt khoát.

---

## 1. Nội dung & cấu trúc
- **Cấu trúc 9:16 ~50–75s**: Vấn đề (hook câu hỏi/nỗi đau ngay giây đầu) → Giới thiệu → Cách dùng/Xem trực tiếp → Số liệu & lưu ý → Cài đặt → CTA. Tham khảo video OfficeCLI của kênh (~11k view): dễ ứng dụng ngay.
- Tư liệu: đọc README/docs của repo thật (clone về thư mục tạm); dùng ảnh/GIF chính repo, hoặc **quay thật** (chạy repo; xem `docs/SCREEN_RECORDING.md`).
- Khung minh họa tự dựng PHẢI ghi "(minh họa)"; hoạt ảnh lấy từ repo PHẢI ghi "hoạt ảnh minh họa từ repo".
- Cảnh tua nhanh PHẢI có nhãn "TUA NHANH ×N" trên màn hình.
- Chọn repo: **ưu tiên** repo dễ ứng dụng cho sinh viên / giáo viên / nhân viên văn phòng, nhưng repo hay thì vẫn làm (không bắt buộc đề tài văn phòng, repo dev vẫn OK). Danh sách repo đã làm / bị bác: `docs/REPO_SELECTION.md`.
- Chủ đề tài chính: thêm "không phải lời khuyên đầu tư" vào ghi chú đăng bài.
- Video hướng dẫn dài (16:9, YouTube): quay app thật, có demo từng bước, số liệu đo thật (token, tỷ lệ sai từ) — xem `docs/SCREEN_RECORDING.md`.

## 2. Giọng đọc & phát âm
- TTS: **VieNeu-TTS v3 Turbo**, từng cụm câu một (để lấy mốc thời gian chính xác cho caption).
- Giọng mặc định preset **"Hải Đăng"**. Chủ kênh muốn dùng giọng của chính họ: đặt `voice/ref.wav` (5–10 giây) + `voice/ref.txt` (lời đã đọc, đúng từng chữ) — `gen_tts.py` tự dùng nếu có. (Chưa có thì nói rõ đang dùng giọng preset.)
- Cách đọc từ tiếng Anh/thuật ngữ: bảng đã duyệt ở `lexicon.json` và `docs/PRONUNCIATION.md`. **Chỉ sửa trong `say`.**
- Tốc độ: câu cuối ("Nhớ theo dõi kênh…") dùng `"speed": 0.93` (0.82 bị chậm quá, lạc nhịp; 1.0+ bị vội). Có dấu phẩy sau "kênh".
- Viết số thành chữ trong `say` ("sáu mươi bảy giây", "ba phẩy bốn phần trăm"), còn `show` dùng chữ số.
- Nghe/kiểm tra bằng `pipeline/asr.py` (faster-whisper) chỉ để dò từ **tiếng Anh**; Whisper không đáng tin với dấu tiếng Việt.

## 3. Âm thanh
- Nhạc nền tự soạn bằng `pipeline/music.py` (không dùng nhạc có bản quyền): phong cách bass trầm ấm, bass đổi nốt mỗi ô nhịp, pad giữa, hầu như không có âm cao, bass có saturation để loa điện thoại nghe được.
  - Hồ sơ `tiktok` (mặc định): 107 BPM, gốc C D G C D C E G.
  - Hồ sơ `youtube` (bản biến thể): 100 BPM, gốc A F C G A F C E (`MUSIC_PROFILE=youtube`).
- Ducking: nhạc tự hạ khi có giọng (nhanh vào, chậm ra).
- Mix cuối: `loudnorm=I=-14:TP=-1.5`, peak ≤ −1.5 dBFS. Kiểm tra bằng `ebur128=peak=true`.
- **KHÔNG whoosh / swoosh / sfx** ở bất kỳ chỗ nào (kể cả khi chuyển cảnh). File `music.py` đã bỏ hẳn sfx.

## 4. Hình ảnh & bố cục
- Thông số: 9:16 = 1080×1920; 16:9 = 1920×1080; 30fps; render `-f 30 -q high`.
- **Nhận diện kênh** (giữ trên mọi video): nhãn mục "01 — VẤN ĐỀ" (JetBrains Mono, trái) + handle (@ai.unbox0026 / @AIUnBox0026, phải); đường kẻ + thanh tiến độ đổi màu theo slide; tiêu đề chữ Anton (hoặc font theo slide); **caption = khung trắng viền màu + từ khóa tô sáng**; cuối video có khối CTA (URL card + "@handle" + nút "+ Theo dõi" / "+ Đăng ký").
- **Chuyển cảnh**: chỉ fade ~0.3s (cảnh sau chồng lên cảnh trước). KHÔNG wipe/lướt/slide.
- **Tránh "AI slop"**: không gradient tím kính mờ, không emoji làm icon chính, không ảnh robot; dùng ảnh thật + chữ rõ. (Emoji nhỏ trong nhãn kỹ thuật thì chấp nhận.)
- Caption 9:16: ≤ ~27 ký tự/dòng, ≤ 2 dòng, font ~46–52px; 16:9: ≤ ~38 ký tự/dòng, font 54px. `*từ khóa*` phải nằm trọn trong một dòng. Nếu bị xuống 3 dòng → rút gọn chữ.
- Không để chữ/handle chìm vào hình khối của nền (vd. handle đè lên vòng tròn cùng màu → đổi màu nhấn).
- Video/GIF nhúng: dùng `<video muted playsinline class="clip" data-start data-duration>` đặt **ở cấp root**, bọc trong `div` KHÔNG có `data-start`; không đặt `<video>` trong phần tử đã có `data-start`. Phần tử `<audio>` cần có `id`.
- Chạy `npx hyperframes check` sau mỗi lần build. Cảnh báo tương phản/chồng chữ ngay lúc crossfade là bình thường; chồng chữ thật phải sửa.

## 5. Nền (background) — quy định riêng, chủ kênh nhắc nhiều lần
- Chủ kênh chê nền lặp ("video nào cũng cùng cách làm background"). Vì vậy:
  1. **Mỗi slide một kiểu nền khác hẳn nhau** trong cùng một video (không chỉ đổi màu một họ nền): chấm, kẻ ô, sọc, vòng đồng tâm, màu đặc + hình khối, tối/sáng xen kẽ…
  2. **Mỗi video một bộ nền mới**, không trùng bộ nền của video liền trước (và nên không trùng bất kỳ video nào). Đọc `themes/THEMES_LOG.md` trước khi chọn; **ghi thêm dòng mới sau khi làm xong**.
  3. **KHÔNG dùng lại họ "v1"** (pastel loang + chấm/kẻ kem-hồng-mint).
  4. Mỗi slide có bộ biến màu riêng `--ink --acc --hl --hlt --term --wire --vsh` (xem `templates/build_*.mjs`, hằng `PAL`).
- Bản YouTube Shorts của một video đã có bản TikTok: đổi tông (hue) + họa tiết để khác bản TikTok (xem `variants/`).

## 6. Trung thực, kiểm chứng (đặc biệt quan trọng)
- Kiểm chứng trong code/README: có tiếng Việt không? giấy phép gì? có bản trả phí không? cần API key không? chạy được trên hệ điều hành nào?
- **KHÔNG bịa số liệu.** Không nêu số sao nếu không chắc. Số liệu của repo tự công bố phải ghi "theo repo / phép đo của chính repo" kèm điều kiện (mô hình, thời điểm).
- Số do mình tự đo: nêu điều kiện đo (máy, CPU/GPU, có quay màn hình hay không) và cách đối chiếu (vd. tỷ lệ sai từ = sửa-từ / tổng-từ so với kịch bản gốc).
- Ước tính (không đo): ghi rõ "ước tính, chưa đo".
- Nói thẳng lỗi/hạn chế quan sát được (vd. bản tóm tắt sai thứ trong tuần; giao diện không có tiếng Việt; cần khóa API).
- Dữ liệu mẫu do AI/TTS tạo: nói rõ ("cuộc họp mẫu giọng AI", "dữ liệu giả ở chế độ demo").
- Không giả lập kết quả chạy: nếu không chạy được thật (thiếu khóa API/mạng), dùng hoạt ảnh của repo (có nhãn) hoặc bỏ cảnh đó và nói rõ.

## 7. Đăng bài (tránh điểm mù từng nền tảng) — chi tiết ở `docs/PLATFORMS.md`
- TikTok: caption dạng `Hook 👇 #aiunbox0026 #TênRepo …`; KHÔNG dán link trong caption (để bio/comment ghim); bật nhãn nội dung AI.
- YouTube: tiêu đề NGẮN (≤ ~40 ký tự), **đúng 4 hashtag**, link dạng chữ trong mô tả, bật mục "nội dung bị thay đổi hoặc tổng hợp", video dài có chương (timestamp).
- Bản YouTube Shorts: bố cục thu nhỏ + lùi vào trong (tránh thanh/nút của Shorts), đổi handle/CTA, **không đăng cùng lúc** với bản TikTok (tránh bị coi là nội dung lặp).

## 7b. Bài đăng NGẮN (chủ kênh nhắc 12/10/2026)
- Bài đăng (TikTok/YouTube) **ngắn, ≤ ~550 ký tự**: 1 dòng hook + 1 dòng giới thiệu + 1 dòng lưu ý thật (kể cả "chưa tự chạy thử" nếu vậy) + dòng link + hashtag + nhãn AI. KHÔNG liệt kê dài giấy phép/hệ điều hành/chi tiết kỹ thuật đã nói trong video. Mẫu: `examples/localsend-tiktok/tiktok_post.txt`.
- TikTok: 4 hashtag là đủ (mẫu LocalSend).

## 7c. Bài đăng — chủ kênh nhắc 14/10/2026 (áp dụng cho mọi video sau)
- **YouTube (`yt_post.txt`)**: thêm mục **TAGS** (từ khóa cho ô "Thẻ" của YouTube, cách nhau bằng dấu phẩy, ~8–12 từ khóa: tên repo, chủ đề, "công cụ AI", "mã nguồn mở"…). Vẫn giữ đúng 4 hashtag trong mô tả. **Mô tả KHÔNG có mục "Lưu ý thật lòng"** (hạn chế đã nói trong video). **KHÔNG viết chú thích trong ngoặc ()** trong file bài đăng (vd. "(Link trong Shorts không bấm được…)", "(35 ký tự)").
- **TikTok (`tiktok_post.txt`)**: dòng hook/tiêu đề **ngắn** (~25–40 ký tự + 👇), đừng dài dòng.

## 8. Giao tiếp với chủ kênh
- Trả lời bình luận hộ chủ kênh: ngắn gọn, giọng người thật, không văn mẫu như bot.
- Báo kết quả: nêu rõ cái gì đã kiểm tra thật, cái gì chưa (chưa nghe lại giọng, chưa xem trên app thật…).
- File gửi qua kênh có giới hạn ~30 MB: nén bản nhẹ (`-crf 25`) và nói bản gốc nằm ở đâu.
- Bị bác một lựa chọn (repo…): không hỏi lại dài dòng; chọn phương án khác dứt khoát.

## 9. An toàn thao tác (bài học đau)
- Không `pkill -f "<chuỗi>"` khi chuỗi đó xuất hiện trong chính lệnh bạn đang chạy (tự giết shell) → dùng `pkill -x <tên tiến trình>` hoặc kill theo PID.
- Vòng chờ `grep -q "<mẫu>" log` phải dùng mẫu chỉ xuất hiện MỘT lần ở trạng thái mong muốn (mẫu như "Finished" có thể khớp dòng cũ → vòng chờ thoát ngay).
- Tự động click GUI: kiểm tra trạng thái bằng ảnh chụp/pixel trước khi click bước kế (nút "Continue" bị mờ lúc đang tải); không chạy hai script điều khiển song song.
- Không chạy lệnh nặng CPU (TTS, render) song song với lúc đo tốc độ/quay màn hình nếu cần số đo công bằng.
