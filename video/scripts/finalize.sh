#!/usr/bin/env bash
# Loudness-normalize the master render (-15 LUFS, -1 dBTP) and make a 720p preview.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=out/mayor-de-sillas-master.mp4
OUT=out/mayor-de-sillas-1080p.mp4
PREV=out/mayor-de-sillas-preview-720p.mp4
J=$(ffmpeg -hide_banner -nostats -i "$IN" -vn -af loudnorm=I=-15:TP=-1.0:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get(){ echo "$J" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
F="loudnorm=I=-15:TP=-1.0:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true"
ffmpeg -v error -y -i "$IN" -c:v copy -af "$F,aresample=48000" -c:a aac -b:a 320k -movflags +faststart "$OUT"
ffmpeg -v error -y -i "$OUT" -vf scale=1280:720:flags=lanczos -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$PREV"
ls -la out/
