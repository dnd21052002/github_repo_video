#!/bin/bash
# usage: WORK=/path KIT=/path/to/kit VENV=/path/venv variants/render_yt.sh <name>
set -e
source ${VENV:?set VENV}/bin/activate; export MUSIC_PROFILE=youtube
cd ${WORK:?set WORK}/$1-yt
python ${KIT:?set KIT}/pipeline/gen_tts.py 2>&1 | tail -2
ffmpeg -y -loglevel error -i audio/narration_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=7 -ar 48000 audio/narration.wav
python ${KIT}/pipeline/music.py 2>&1 | tail -1
ffmpeg -y -loglevel error -i audio/mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=9 -ar 48000 audio/mix_n.wav && mv audio/mix_n.wav audio/mix.wav
node build.mjs
npx hyperframes check 2>&1 | grep -E "✗|error\(s\)" | head -8
