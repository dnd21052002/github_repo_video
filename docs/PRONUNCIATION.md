# Cách đọc (TTS) — đã được chủ kênh duyệt

**Nguyên tắc:** chỉ chỉnh ở trường `say` của `script.json`. Chữ hiện trên slide (`show`) luôn giữ tên gốc. Nguồn dữ liệu máy đọc được: `lexicon.json`.

| Viết trên slide | Viết trong `say` (để TTS đọc đúng) |
|---|---|
| AI | ây ai (câu cuối: "công cụ ây ai hay nhé" — đọc "ây ai", không phải "ây") |
| CLI | Xi Eo Ai |
| Claude Code | Clau cốt |
| Codex | Cô-đếch |
| Cursor | Cớ-sơ |
| GitHub | Ghít-hấp |
| Multica | Mun-ti-ca |
| Meetily | Mi-ti-li |
| Hairline | He-lai |
| Aurelio | Ao-rê-li-ô |
| MIT | em ai ti |
| React | Rê-ác |
| CSS | xi ét ét |
| model | mô-đồ |
| CPU / GPU | xi pi diu / gi pi diu |
| YouTube / Reddit / Twitter | Diu-túp / Rét-đít / Tuýt-tơ |
| cookie | cúc-ki |
| token | tô-ken |
| Linux | Li-nức |
| Qwen / Gemma | Quen / Gem-ma |
| Parakeet | Pa-ra-kít |
| Groq | Grốc |
| MB / GB | mê-ga-bai / gi-ga-bai |
| RSS | rờ ét ét |

Đọc nguyên (viết thường, TTS đọc ổn): isometric, npm, npx, commit, skill, HTML, Whisper, Ollama, OpenRouter, Git, uv, Node.js, Windows, macOS, MP4, WebM, "Answer me with HTML", "3Blue1Brown", Python (đôi khi viết "Pai-thon").

Mẹo từ thực tế:
- "Họp" đứng đầu câu bị đọc thành "học" → viết "Cuộc họp…".
- Tránh "file" (đọc "phai"), "ghi âm" dễ thành "game/khi âm" → dùng "thu âm / bản thu âm / ghi âm trực tuyến" khi hợp ngữ cảnh.
- Tránh nói "Markdown"; tránh từ khó (daemon/standup/audit/provider) → dùng từ Việt.
- Số trong `say` viết thành chữ.
- Whisper (asr.py) không đáng tin với dấu tiếng Việt; chỉ dùng để dò từ tiếng Anh. Nếu nghi ngờ một từ, thử vài cách viết và nghe thật.
- Câu cuối: `"speed": 0.93`, có dấu phẩy sau "kênh".
