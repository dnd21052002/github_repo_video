#!/bin/bash
# usage: scripts/new_project.sh <workdir>/<tên-dự-án> <portrait|landscape>
# Tạo thư mục dự án từ template. Sau đó sửa script.json + build.mjs (xem docs/PIPELINE.md).
set -e
KIT="$(cd "$(dirname "$0")/.." && pwd)"; P="$1"; MODE="${2:-portrait}"
[ -n "$P" ] || { echo "usage: $0 <dir> <portrait|landscape>"; exit 1; }
mkdir -p "$P"/{audio,build,voice,assets/clips,assets/img,assets/vid}
ln -sfn "$KIT/assets/fonts" "$P/assets/fonts"; ln -sf "$KIT/assets/gsap.min.js" "$P/assets/gsap.min.js"
cp "$KIT/lexicon.json" "$P/"; cp "$KIT/docs/RULES.md" "$P/RULES.md"
cp "$KIT/templates/script.example.json" "$P/script.json"
if [ "$MODE" = landscape ]; then cp "$KIT/templates/build_landscape_tutorial.mjs" "$P/build.mjs"; else cp "$KIT/templates/build_portrait_screen_demo.mjs" "$P/build.mjs"; fi
cat > "$P/hyperframes.json" <<'J'
{"$schema":"https://hyperframes.heygen.com/schema/hyperframes.json","registry":"https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry","paths":{"blocks":"compositions","components":"compositions/components","assets":"assets"},"media":{"autoProxy":true}}
J
echo "{\"id\":\"$(basename "$P")\",\"name\":\"$(basename "$P")\",\"createdAt\":\"$(date -u +%FT%TZ)\"}" > "$P/meta.json"
ln -sfn "$KIT/node_modules" "$P/node_modules"
echo "Đã tạo $P ($MODE). Việc tiếp theo: sửa script.json, rồi: scripts/pipeline.sh $P"
