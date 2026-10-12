export DISPLAY=:99 PULSE_SERVER=unix:/tmp/pa.sock
shot(){ ffmpeg -y -loglevel error -f x11grab -video_size 1920x1080 -i :99 -frames:v 1 ${OUT:-/tmp}/$1.png; }
click(){ xdotool mousemove $1 $2 click 1; }
