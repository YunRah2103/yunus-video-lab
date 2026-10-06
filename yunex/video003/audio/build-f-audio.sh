#!/usr/bin/env bash
set -euo pipefail

# YUNEX 003 Agent F deterministic audio preparation.
# Input must be the exact user-supplied MP3 (Library ID in cue-sheet.json).
# No narration trimming or time-stretching occurs.
IN="${1:?usage: build-f-audio.sh /path/to/openai-fm-cedar-friendly.mp3 [out-dir]}"
OUT_DIR="${2:-/tmp/y003-audio}"
mkdir -p "$OUT_DIR"
VO="$OUT_DIR/narration_48k_stereo.wav"
MIX="$OUT_DIR/f_preflight_mix.wav"
DUR=24.500
EXPECTED_SHA="826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb"
ACTUAL_SHA="$(sha256sum "$IN" | awk '{print $1}')"
if [[ "$ACTUAL_SHA" != "$EXPECTED_SHA" ]]; then
  echo "ERROR: narration SHA mismatch: $ACTUAL_SHA" >&2
  exit 2
fi

# Format conversion only; +0.50 dB gain leaves >3 dB source peak headroom.
ffmpeg -y -hide_banner -loglevel error -i "$IN" \
  -af "aresample=48000,volume=1.06" -ar 48000 -ac 2 -c:a pcm_s24le "$VO"

# Preflight/reference bed. Final dynamic gains should be driven from y003AudioMixState.
ffmpeg -y -hide_banner -loglevel error \
  -i "$VO" \
  -f lavfi -i "sine=frequency=86:sample_rate=48000:duration=$DUR" \
  -f lavfi -i "sine=frequency=172:sample_rate=48000:duration=$DUR" \
  -f lavfi -i "anoisesrc=color=pink:amplitude=0.12:r=48000:d=$DUR:seed=3003" \
  -f lavfi -i "anoisesrc=color=white:amplitude=0.055:r=48000:d=$DUR:seed=3011" \
  -filter_complex "
    [0:a]apad=pad_dur=1.244,atrim=0:$DUR[vo];
    [1:a]lowpass=f=230,volume=0.035[eng1];
    [2:a]lowpass=f=360,volume=0.018[eng2];
    [3:a]highpass=f=170,lowpass=f=2800,volume=0.030[road];
    [4:a]highpass=f=600,lowpass=f=5200,volume=0.015[wind];
    [eng1][eng2][road][wind]amix=inputs=4:normalize=0[fxraw];
    [fxraw][vo]sidechaincompress=threshold=0.018:ratio=8:attack=10:release=220:makeup=1[fxduck];
    [vo][fxduck]amix=inputs=2:normalize=0,alimiter=limit=0.891:attack=5:release=80[mix]" \
  -map '[mix]' -t "$DUR" -ar 48000 -ac 2 -c:a pcm_s24le "$MIX"

ffprobe -v error -show_entries format=duration,size:stream=codec_name,sample_rate,channels -of json "$MIX"
sha256sum "$IN" "$VO" "$MIX"
