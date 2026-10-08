#!/usr/bin/env bash
# Agent H: repair the raw Remotion full-range export without changing the strict video gate.
# Usage: bash normalize-native-proof.sh RAW_MP4 DEST_DIR LABEL RANGE EXPECTED_FRAMES SOURCE_SHA
set -euo pipefail
if [ "$#" -ne 6 ]; then echo "Usage: $0 RAW DEST LABEL RANGE EXPECTED SOURCE_SHA" >&2; exit 2; fi
RAW="$1"; DIR="$2"; LABEL="$3"; RANGE="$4"; EXPECTED="$5"; SOURCE="$6"
test -s "$RAW"
mkdir -p "$DIR"
OUT="$DIR/$LABEL.mp4"
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=codec_name,pix_fmt,color_range,width,height,r_frame_rate,nb_read_frames -show_entries format=duration -of json "$RAW" > "$DIR/ffprobe-original.json"
python3 - "$DIR/ffprobe-original.json" "$EXPECTED" <<'PY'
import json,sys
j=json.load(open(sys.argv[1])); s=j['streams'][0]; n=int(sys.argv[2])
assert s['codec_name']=='h264',s
assert (s['width'],s['height'],s['r_frame_rate'])==(1080,1920,'30/1'),s
assert int(s['nb_read_frames'])==n,s
assert abs(float(j['format']['duration'])-n/30)<0.08,j
print('ORIGINAL NATIVE FRAMES/FPS/RESOLUTION PASS')
PY
INPUT_FMT="$(ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of default=nw=1:nk=1 "$RAW")"
INPUT_RANGE="$(ffprobe -v error -select_streams v:0 -show_entries stream=color_range -of default=nw=1:nk=1 "$RAW")"
if [ "$INPUT_FMT" = yuvj420p ] || [ "$INPUT_RANGE" = pc ]; then FROM_RANGE=pc; else FROM_RANGE=tv; fi
echo "Original pixel format=$INPUT_FMT, color range=$INPUT_RANGE; convert $FROM_RANGE to limited TV range" | tee "$DIR/normalization.txt"
ffmpeg -nostdin -hide_banner -loglevel warning -y -i "$RAW" -an -vf "scale=iw:ih:in_range=$FROM_RANGE:out_range=tv,format=yuv420p" -r 30 -fps_mode cfr -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p -color_range tv -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart "$OUT"
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=codec_name,pix_fmt,color_range,width,height,r_frame_rate,nb_read_frames -show_entries format=duration -of json "$OUT" > "$DIR/ffprobe.json"
python3 - "$DIR/ffprobe.json" "$EXPECTED" <<'PY'
import json,sys
j=json.load(open(sys.argv[1])); s=j['streams'][0]; n=int(sys.argv[2])
assert s['codec_name']=='h264' and s['pix_fmt']=='yuv420p' and s['color_range']=='tv',s
assert (s['width'],s['height'],s['r_frame_rate'])==(1080,1920,'30/1'),s
assert int(s['nb_read_frames'])==n,s
assert abs(float(j['format']['duration'])-n/30)<0.08,j
print('STRICT LIMITED RANGE YUV420P, FRAMES, FPS AND RESOLUTION PASS')
PY
ffmpeg -nostdin -v error -xerror -i "$OUT" -f null -
echo FULL_DECODER_PASS > "$DIR/decoder-result.txt"
printf '%s\n' "$SOURCE" > "$DIR/source-sha.txt"
printf '%s\n' "$RANGE" > "$DIR/frames-inclusive.txt"
(cd "$DIR" && sha256sum "$LABEL.mp4" > SHA256SUMS)
sha256sum "$RAW" > "$DIR/original-mp4-sha256.txt"
echo "SHA locked: $SOURCE; normalization performed only after full native render; strict validator unmodified" > "$DIR/provenance.txt"
