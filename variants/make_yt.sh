#!/bin/bash
# usage: WORK=/path/to/work variants/make_yt.sh <name> <hue-degrees>
# expects $WORK/<name>-video (TikTok project) and creates $WORK/<name>-yt (YouTube Shorts variant)
set -e
N=$1; HUE=$2; WORK=${WORK:?set WORK}; SRC=$WORK/$N-video; DST=$WORK/$N-yt
rm -rf $DST; mkdir -p $DST
tar -C $SRC --exclude=.venv --exclude=node_modules --exclude=./build --exclude=./snapshots --exclude=./audio --exclude=./index.html --exclude=./pipeline_backup --exclude=./app --exclude=cover.png --exclude=tiktok_post.txt -cf - . | tar -C $DST -xf -
[ -e $SRC/tools/node_modules ] && true
mkdir -p $DST/audio $DST/build
cd $DST
python3 - "$HUE" <<'PY'
import json,sys,re
hue=sys.argv[1]
d=json.load(open('script.json'))
last=d['scenes'][-1]['phrases'][-1]
last['say']="Nhớ đăng ký kênh, để xem thêm nhiều công cụ ây ai hay nhé."
last['show']="Nhớ *đăng ký kênh*\nđể xem thêm công cụ AI."
last['speed']=0.93
json.dump(d,open('script.json','w'),ensure_ascii=False,indent=1)
b=open('build.mjs').read()
b=b.replace('@ai.unbox0026','@AIUnBox0026').replace('+ Theo dõi','+ Đăng ký')
Z=0.88; mx=60*(1-Z)/Z; my=(200-Z*150)/Z
css=f'''
/* ===== YouTube Shorts safe-zone + hue variant ===== */
.lbl,.hdl,.rule,#prog,.vis,.cap,.vwrap{{zoom:{Z};margin-left:{mx:.2f}px;margin-top:{my:.2f}px}}
.scene,.cap,.vwrap,.rule,#prog{{filter:hue-rotate({hue}deg)}}
.scene img,.scene video,.vwrap video{{filter:hue-rotate(-{hue}deg)}}
'''
b=b.replace('</style></head>',css+'</style></head>',1)
open('build.mjs','w').write(b)
m=open('music.py').read()
pass  # music variant now via MUSIC_PROFILE=youtube
open('music.py','w').write(m)
PY
grep -c "AIUnBox0026" build.mjs
