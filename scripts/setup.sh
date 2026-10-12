#!/bin/bash
# Cài môi trường: Python venv (VieNeu-TTS, faster-whisper), Node deps (HyperFrames, GSAP, fonts), copy fonts + gsap vào assets/.
# Yêu cầu hệ thống: python3.10+, node 20+, ffmpeg, (tùy chọn) chromium cho Playwright. HyperFrames tự dùng Chromium.
set -e
KIT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$KIT"
python3 -m venv .venv && source .venv/bin/activate
pip install -q -r requirements.txt
npm install --no-audit --no-fund
mkdir -p assets/fonts
for fam in be-vietnam-pro jetbrains-mono anton playfair-display; do
  cp node_modules/@fontsource/$fam/files/$fam-latin-*-normal.woff2 node_modules/@fontsource/$fam/files/$fam-vietnamese-*-normal.woff2 assets/fonts/ 2>/dev/null || true
done
cp node_modules/gsap/dist/gsap.min.js assets/gsap.min.js
echo "OK. Kích hoạt: source $KIT/.venv/bin/activate   (lần đầu chạy VieNeu sẽ tải model từ Hugging Face, ~vài trăm MB)"
echo "Nếu onnxruntime báo 'External data path escapes': thay symlink trong ~/.cache/huggingface/hub/*/snapshots bằng file thật (xem docs/TROUBLESHOOTING.md)."
