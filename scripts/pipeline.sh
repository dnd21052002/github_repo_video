#!/bin/bash
# usage: scripts/pipeline.sh <project-dir> [--youtube-music] [--no-render]
# script.json -> TTS -> loudnorm -> nhạc -> mix -> loudnorm -> (clips nếu có) -> build.mjs -> check -> render -> báo LUFS/peak.
set -e
KIT="$(cd "$(dirname "$0")/.." && pwd)"; P="$(cd "$1" && pwd)"; shift || true
source "$KIT/.venv/bin/activate"
[[ " $* " == *" --youtube-music "* ]] && export MUSIC_PROFILE=youtube
cd "$P"
python "$KIT/pipeline/gen_tts.py"                      # -> audio/narration_raw.wav, build/timeline.json
ffmpeg -y -loglevel error -i audio/narration_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=7 -ar 48000 audio/narration.wav
python "$KIT/pipeline/music.py"                        # -> audio/mix.wav (nhạc + ducking dưới giọng)
ffmpeg -y -loglevel error -i audio/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=9 -ar 48000 audio/mix_n.wav && mv audio/mix_n.wav audio/mix.wav
if [ -n "$TAKE" ]; then python "$KIT/pipeline/make_clips_${CLIPS:-portrait}.py"; fi   # cần $TAKE=đường dẫn video quay màn hình
node build.mjs                                         # -> index.html
npx hyperframes check | grep -E "✗|error\(s\)" | head -20 || true
[[ " $* " == *" --no-render "* ]] && exit 0
OUT="build/$(basename "$P").mp4"
npx hyperframes render -f 30 -q high -o "$OUT"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
echo "XONG: $P/$OUT   (mục tiêu: -14 LUFS, peak <= -1.5 dBFS)"
