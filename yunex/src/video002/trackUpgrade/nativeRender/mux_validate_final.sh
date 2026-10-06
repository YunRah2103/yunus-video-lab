#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 3 ]; then
  echo "usage: $0 <native-visual-master.mp4> <approved-openai-fm-vo.mp3> <final-output.mp4>" >&2
  exit 2
fi

VISUAL="$1"
SOURCE_VO="$2"
OUT="$3"
ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
YUNEX="$ROOT/yunex"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

EXPECTED_SOURCE_SHA="899514c1a72080d87b76a5155841cb727b43644d6c636aa16f8eb28c83f60171"
EXPECTED_MIX_SHA="217e5efe0619d922a215c7572c4cc205731b79e57b65267bfdf39daf6280a8b9"
EXPECTED_CAR_SHA="1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb"

test -s "$VISUAL"
test -s "$SOURCE_VO"
test "$(sha256sum "$SOURCE_VO" | awk '{print $1}')" = "$EXPECTED_SOURCE_SHA"
test "$(sha256sum "$ROOT/cars/porsche-911-gt3-rs-992/model.glb" | awk '{print $1}')" = "$EXPECTED_CAR_SHA"

"$YUNEX/video002/build-d-audio.sh" "$SOURCE_VO" "$TMP/audio"
MIX="$TMP/audio/d_mix.wav"
test "$(sha256sum "$MIX" | awk '{print $1}')" = "$EXPECTED_MIX_SHA"

mkdir -p "$(dirname "$OUT")"

mux () {
  local gain="$1"
  ffmpeg -y -hide_banner -loglevel error \
    -i "$VISUAL" -i "$MIX" \
    -map 0:v:0 -map 1:a:0 \
    -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 1 \
    -af "volume=\${gain}dB,apad=pad_dur=0.020" \
    -t 25.033333 \
    -movflags +faststart \
    "$OUT"
}

measure () {
  local tag="$1"
  ffmpeg -hide_banner -nostats -i "$OUT" -map 0:a:0 \
    -af "loudnorm=I=-15:TP=-1:LRA=6:print_format=json" \
    -f null - 2>"$TMP/loudnorm-\${tag}.txt" || true
  python - "$TMP/loudnorm-\${tag}.txt" "$TMP/audio_metrics.json" <<'PY'
import json,re,sys
text=open(sys.argv[1],encoding='utf-8',errors='ignore').read()
blocks=re.findall(r'\{[^{}]*"input_i"[^{}]*\}',text,re.S)
if not blocks:
    raise SystemExit("loudnorm JSON not found")
data=json.loads(blocks[-1])
open(sys.argv[2],'w').write(json.dumps(data,indent=2,sort_keys=True))
print(data.get("input_i"),data.get("input_tp"))
PY
}

mux 0
measure pass1
TP="$(python -c 'import json; print(float(json.load(open("'"$TMP/audio_metrics.json"'"))["input_tp"]))')"
if ! python - "$TP" <<'PY'
import sys
raise SystemExit(0 if float(sys.argv[1]) <= -1.0 else 1)
PY
then
  mux -0.5
  measure pass2
fi

ffmpeg -v error -xerror -i "$OUT" -f null -
ffprobe -v error -count_frames \
  -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,nb_read_frames,sample_rate,channels \
  -show_entries format=duration \
  -of json "$OUT" > "$TMP/final_ffprobe.json"

python - "$TMP/final_ffprobe.json" "$TMP/audio_metrics.json" <<'PY'
import json,sys
probe=json.load(open(sys.argv[1]))
streams=probe["streams"]
video=next(s for s in streams if s["codec_type"]=="video")
audio=next(s for s in streams if s["codec_type"]=="audio")
assert (int(video["width"]),int(video["height"]))==(1080,1920),video
assert video["r_frame_rate"]=="30/1" and video["avg_frame_rate"]=="30/1",video
assert int(video["nb_read_frames"])==751,video
assert audio["codec_name"]=="aac",audio
assert int(audio["sample_rate"])==48000,audio
assert int(audio["channels"])==1,audio
duration=float(probe["format"]["duration"])
assert 25.02 <= duration <= 25.05,duration
metrics=json.load(open(sys.argv[2]))
assert float(metrics["input_tp"]) <= -1.0,metrics
assert -16.2 <= float(metrics["input_i"]) <= -14.6,metrics
print(json.dumps({
  "video_frames":751,
  "fps":30,
  "dimensions":[1080,1920],
  "duration_seconds":duration,
  "audio_codec":"aac",
  "audio_sample_rate":48000,
  "audio_channels":1,
  "integrated_lufs":float(metrics["input_i"]),
  "true_peak_dbfs":float(metrics["input_tp"]),
},indent=2))
PY

cp "$TMP/final_ffprobe.json" "\${OUT}.ffprobe.json"
cp "$TMP/audio_metrics.json" "\${OUT}.audio_metrics.json"
sha256sum "$OUT" > "\${OUT}.sha256"
echo "final: $OUT"
