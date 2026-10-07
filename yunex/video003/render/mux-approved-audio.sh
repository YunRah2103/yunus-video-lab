#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "usage: mux-approved-audio.sh <native-visual.mp4> <approved-audio.m4a> <final.mp4>" >&2
  exit 2
fi

VISUAL="$1"
AUDIO="$2"
OUT="$3"
EXPECTED_AUDIO_SHA="cd411b0dcc9e733f5b142e59f8340f913816e28bf113a32639c4fd12f7ec04c3"

[[ -s "$VISUAL" ]] || { echo "missing visual: $VISUAL" >&2; exit 2; }
[[ -s "$AUDIO" ]] || { echo "missing audio: $AUDIO" >&2; exit 2; }

actual_audio_sha="$(sha256sum "$AUDIO" | awk '{print $1}')"
[[ "$actual_audio_sha" == "$EXPECTED_AUDIO_SHA" ]] || {
  echo "approved audio SHA mismatch: $actual_audio_sha" >&2
  exit 2
}

video_frames="$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 "$VISUAL")"
video_fps="$(ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=nw=1:nk=1 "$VISUAL")"
video_size="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$VISUAL")"
video_pix="$(ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of default=nw=1:nk=1 "$VISUAL")"
[[ "$video_frames" == "735" && "$video_fps" == "30/1" && "$video_size" == "1080x1920" && "$video_pix" == "yuv420p" ]] || {
  echo "visual contract mismatch: frames=$video_frames fps=$video_fps size=$video_size pix=$video_pix" >&2
  exit 2
}

audio_codec="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$AUDIO")"
audio_rate="$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=nw=1:nk=1 "$AUDIO")"
audio_channels="$(ffprobe -v error -select_streams a:0 -show_entries stream=channels -of default=nw=1:nk=1 "$AUDIO")"
audio_duration="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$AUDIO")"
[[ "$audio_codec" == "aac" && "$audio_rate" == "48000" && "$audio_channels" == "2" ]] || {
  echo "audio contract mismatch: codec=$audio_codec rate=$audio_rate channels=$audio_channels" >&2
  exit 2
}
python - "$audio_duration" <<'PY'
import sys
d=float(sys.argv[1])
if abs(d-24.5)>0.02:
    raise SystemExit(f"approved audio duration mismatch: {d}")
PY

ffmpeg -y -v error -i "$VISUAL" -i "$AUDIO"   -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -movflags +faststart "$OUT"

ffmpeg -v error -xerror -i "$OUT" -f null -
final_frames="$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 "$OUT")"
final_audio="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$OUT")"
[[ "$final_frames" == "735" && "$final_audio" == "aac" ]] || {
  echo "final mux validation failed" >&2
  exit 2
}
sha256sum "$OUT"
