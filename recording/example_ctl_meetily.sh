source "$(dirname "${BASH_SOURCE[0]}")/ui_helpers.sh"
LOG=${WORK_MT:-/home/user/mt}/app.log
launch(){ pkill -x meetily; sleep 2; rm -rf /root/.local/share/com.meetily.ai /root/.config/com.meetily.ai /home/user/meetily-recordings
 BIN=$(ls /tmp/claude-0/-home-user/*/scratchpad/src/meetily/target/release/meetily); : > $LOG
 (cd $(dirname $BIN) && nohup env DISPLAY=:99 PULSE_SERVER=unix:/tmp/pa.sock WEBKIT_DISABLE_COMPOSITING_MODE=1 WEBKIT_DISABLE_DMABUF_RENDERER=1 LIBGL_ALWAYS_SOFTWARE=1 $BIN >> $LOG 2>&1 &)
 for i in $(seq 1 40); do W=$(xdotool search --onlyvisible --name "meetily" | head -1); [ -n "$W" ] && break; sleep 2; done
 sleep 4; xdotool windowsize $W 1920 1080; xdotool windowmove $W 0 0; sleep 3; xdotool mousemove 960 700; }
startrec(){ rm -f ${WORK_MT:-/home/user/mt}/take.mkv ${WORK_MT:-/home/user/mt}/marks.txt; date +%s.%N > ${WORK_MT:-/home/user/mt}/t0; (nohup ffmpeg -y -loglevel error -f x11grab -framerate 30 -video_size 1920x1080 -draw_mouse 1 -i :99 -c:v libx264 -preset ultrafast -crf 20 -pix_fmt yuv420p ${WORK_MT:-/home/user/mt}/take.mkv > /dev/null 2>&1 &); }
stoprec(){ pkill -INT -x ffmpeg; }
mk(){ echo "$1 $(echo "$(date +%s.%N) - $(cat ${WORK_MT:-/home/user/mt}/t0)" | bc)" >> ${WORK_MT:-/home/user/mt}/marks.txt; }
mv_(){ local x1=$1 y1=$2; read x0 y0 < <(xdotool getmouselocation | sed 's/x:\([0-9]*\) y:\([0-9]*\).*/\1 \2/'); for i in $(seq 1 14); do xdotool mousemove $(( x0 + (x1-x0)*i/14 )) $(( y0 + (y1-y0)*i/14 )); sleep 0.025; done; }
clk(){ mv_ $1 $2; sleep 0.35; xdotool click 1; }
px(){ ffmpeg -loglevel error -f x11grab -video_size 1920x1080 -i :99 -frames:v 1 -vf "crop=1:1:$1:$2" -f rawvideo -pix_fmt rgb24 - 2>/dev/null | od -An -tx1 | tr -d " \n"; }
