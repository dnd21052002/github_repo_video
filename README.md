# ai-unbox-video-kit

Bộ công cụ + **quy định/quy ước** để làm video giới thiệu repo/công cụ AI cho kênh **TikTok @ai.unbox0026** và **YouTube AIUnBox0026**: kịch bản tiếng Việt → giọng đọc VieNeu-TTS → nhạc nền tự soạn → dựng bằng HyperFrames (HTML → MP4) → bài đăng chuẩn từng nền tảng.

> English summary: tooling and strict channel conventions for producing short Vietnamese explainer videos about GitHub repos (9:16 TikTok / YouTube Shorts, 16:9 tutorials). Pipeline: `script.json` → VieNeu-TTS → procedurally generated music (no SFX) → HyperFrames HTML composition → MP4 (−14 LUFS). **Agents: read `AGENTS.md` and `docs/RULES.md` first.**

## Bắt đầu nhanh
```bash
git clone <repo-này> && cd ai-unbox-video-kit
scripts/setup.sh                                   # venv + VieNeu + faster-whisper + HyperFrames + fonts + GSAP (cần ffmpeg, node 20+, python 3.10+)
scripts/new_project.sh ~/work/ten-repo portrait    # hoặc landscape (YouTube 16:9)
# sửa ~/work/ten-repo/script.json và build.mjs (xem docs/PIPELINE.md)
scripts/pipeline.sh ~/work/ten-repo                # TTS → nhạc → mix → build → check → render → đo LUFS
```
Giọng của chủ kênh (khi có): đặt `voice/ref.wav` (5–10s) + `voice/ref.txt` (lời đã đọc) vào thư mục dự án.

## Cấu trúc
| Đường dẫn | Nội dung |
|---|---|
| `AGENTS.md` | **Playbook + checklist cho agent/model** (đọc đầu tiên) |
| `docs/RULES.md` | **Toàn bộ quy định đã duyệt** (nội dung, giọng, âm thanh, hình, nền, trung thực, đăng bài, giao tiếp, an toàn thao tác) |
| `docs/PLATFORMS.md` | TikTok / YouTube Shorts / YouTube dài: vùng an toàn, tiêu đề, hashtag, nhãn AI |
| `docs/PIPELINE.md` | Quy trình kỹ thuật, hợp đồng dữ liệu `script.json`, lệnh |
| `docs/PRONUNCIATION.md`, `lexicon.json` | Cách đọc từ tiếng Anh/tên riêng cho TTS |
| `docs/BACKGROUNDS.md`, `themes/` | Quy tắc nền + nhật ký bộ nền đã dùng + thư viện CSS |
| `docs/SCREEN_RECORDING.md` | Quay thật app web/desktop (Playwright, Xvfb+PulseAudio+ffmpeg), đo token/độ chính xác |
| `docs/REPO_SELECTION.md` | Cách chọn repo, danh sách đã làm/đã bị bác |
| `docs/TROUBLESHOOTING.md` | Lỗi đã gặp + cách sửa |
| `pipeline/` | `gen_tts.py`, `music.py` (không sfx), `asr.py`, `make_clips_*.py` |
| `templates/` | `script.example.json`, `build_portrait_screen_demo.mjs`, `build_landscape_tutorial.mjs` |
| `variants/` | Tạo bản YouTube Shorts từ video TikTok (thu nhỏ + lùi vào, hue, nhạc, CTA) |
| `recording/` | Helper quay màn hình (xdotool/PulseAudio/ffmpeg), proxy ghi log token, script Playwright |
| `examples/` | Kịch bản + `build.mjs` + bài đăng của TẤT CẢ video đã làm (Multica, DeepTutor, Meetily ×3, Hairline, Aurelio, Answer me with HTML, Agent Reach; bản TikTok & Shorts) |

## Lưu ý
- Repo **không** chứa video, âm thanh, cảnh quay thô, model, hay khóa/bí mật. Fonts và GSAP được cài qua `npm` (`scripts/setup.sh` chép vào `assets/`).
- Chưa kèm giấy phép (LICENSE): chủ repo tự chọn khi cần chia sẻ công khai. Lưu ý giấy phép của VieNeu-TTS, HyperFrames, GSAP, các font khi tái phân phối.
- Mọi quy định bắt nguồn từ góp ý thật của chủ kênh; khi có góp ý mới, cập nhật `docs/RULES.md` trước.
