#!/usr/bin/env bash
set -euo pipefail
# Mandatory new Y004 source: never substitute Y003 voice or a generated tone as finished narration.
if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo 'Usage: prepare-vo-mix.sh NEW_Y004_VO_FILE OUT_DIR [MANAGER_LOCKED_FRAMES]' >&2
  exit 2
fi
SOURCE="$1"; OUT="$2"; LOCKED_FRAMES="${3:-}"
[[ -s "$SOURCE" ]] || { echo 'BLOCKED: new Y004 narration source missing' >&2; exit 3; }
SOURCE_SHA="$(sha256sum "$SOURCE" | awk '{print $1}')"
if [[ "$SOURCE_SHA" == "826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb" ]]; then
  echo 'BLOCKED: old Y003 Cedar voice recording is forbidden for Y004' >&2
  exit 3
fi
# For release use finalize-recording.py with an explicit approved-source SHA and real cue timestamps.

command -v ffmpeg >/dev/null; command -v ffprobe >/dev/null
mkdir -p "$OUT"
DURATION="$(ffprobe -v error -select_streams a:0 -show_entries format=duration -of default=nw=1:nk=1 "$SOURCE")"
[[ "$DURATION" =~ ^[0-9]+([.][0-9]+)?$ ]] || { echo 'Invalid source duration' >&2; exit 4; }
if [[ -n "$LOCKED_FRAMES" ]]; then
  [[ "$LOCKED_FRAMES" =~ ^[0-9]+$ ]] || { echo 'Frame count must be integer' >&2; exit 4; }
  FILM_SECONDS="$(awk -v f="$LOCKED_FRAMES" 'BEGIN {printf "%.6f",f/30}')"
else
  # Reference duration ONLY: do not publish as final Y004 timeline.
  FILM_SECONDS="$(awk -v d="$DURATION" 'BEGIN {printf "%.6f",int((d+0.8)*30+0.999999)/30}')"
fi
awk -v d="$DURATION" -v f="$FILM_SECONDS" 'BEGIN{exit !(d+0.15<f)}' || {
  echo "BLOCKED: uncut voice ${DURATION}s cannot fit ${FILM_SECONDS}s without losing speech" >&2; exit 5;
}
VOICE="$OUT/y004_narration_isolated_48k_stereo.wav"
MIX="$OUT/y004_reference_mix_48k_stereo.wav"
# Sample-rate conversion is NOT time stretching; audio content starts at sample 0.
ffmpeg -y -v error -i "$SOURCE" -map 0:a:0 -vn -ar 48000 -ac 2 -c:a pcm_s24le "$VOICE"
ffmpeg -y -v error -i "$VOICE" \
  -f lavfi -i "sine=frequency=88:sample_rate=48000:duration=${FILM_SECONDS}" \
  -f lavfi -i "sine=frequency=176:sample_rate=48000:duration=${FILM_SECONDS}" \
  -f lavfi -i "anoisesrc=color=pink:amplitude=0.12:r=48000:d=${FILM_SECONDS}:seed=4004" \
  -f lavfi -i "anoisesrc=color=white:amplitude=0.06:r=48000:d=${FILM_SECONDS}:seed=4017" \
  -filter_complex "[0:a]aresample=48000,volume=0.94,apad,atrim=0:${FILM_SECONDS},asetpts=PTS-STARTPTS[vo];\
[1:a]lowpass=f=240,volume=0.032[eng1];[2:a]lowpass=f=400,volume=0.014[eng2];\
[3:a]highpass=f=170,lowpass=f=2500,volume=0.024[road];\
[4:a]highpass=f=650,lowpass=f=4900,volume=0.011[wind];\
[eng1][eng2][road][wind]amix=inputs=4:normalize=0[bed];\
[bed][vo]sidechaincompress=threshold=0.014:ratio=10:attack=7:release=230[bedduck];\
[vo][bedduck]amix=inputs=2:normalize=0,alimiter=limit=0.891:attack=5:release=80,atrim=0:${FILM_SECONDS}[master]" \
  -map '[master]' -ar 48000 -ac 2 -c:a pcm_s24le "$MIX"
ffmpeg -v error -xerror -i "$MIX" -f null -
ffmpeg -v error -xerror -i "$VOICE" -f null -
ffprobe -v error -show_entries format=duration,size:stream=codec_name,sample_rate,channels -of json "$VOICE" > "$OUT/voice_ffprobe.json"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,sample_rate,channels -of json "$MIX" > "$OUT/mix_ffprobe.json"
ffmpeg -hide_banner -i "$MIX" -af volumedetect -f null - 2> "$OUT/mix_peak.txt" || true
sha256sum "$SOURCE" "$VOICE" "$MIX" > "$OUT/source_and_output_sha256.txt"
printf 'Source seconds (measured): %s\nReference duration seconds (NOT manager locked unless frames supplied): %s\n' "$DURATION" "$FILM_SECONDS"
echo 'Sentence onset/end timestamps still require human verification against this recording.'
