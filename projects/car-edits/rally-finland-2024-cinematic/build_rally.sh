#!/usr/bin/env bash
set -euo pipefail

MAIN="${MAIN:-/mnt/data/WRC Rally Finland 2024 ｜ Flat Out & Big Jumps ｜ 4K [QyOQq-rZxP4].webm}"
CRASH="${CRASH:-/mnt/data/WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! ： Secto Rally Finland 2021 [pHKZQEAZ37k].webm}"

# Clean song from the 190804 reference: Ufo361 - RICK OWENS (feat. Ken Carson).
# The supplied clean TikTok clip has its major drop at ~7.323s.
# Delaying it by 2.177s lands that drop exactly on the edit's 9.500s monochrome switch.
# If the file is unavailable, the script safely falls back to rally-source audio only.
MUSIC="${MUSIC:-/mnt/data/RICK_OWENS_CLEAN_REFERENCE_AUDIO.mp3}"
MUSIC_OFFSET="${MUSIC_OFFSET:-0}"
MUSIC_DELAY="${MUSIC_DELAY:-2.177}"
MUSIC_GAIN="${MUSIC_GAIN:-0.86}"
RALLY_GAIN="${RALLY_GAIN:-0.58}"

WORK="${WORK:-/mnt/data/rally_music_sync_work}"
FINAL="${FINAL:-/mnt/data/Rally_Finland_Cinematic_TikTok_Edit_CLEAN_RICK_OWENS.mp4}"
OUT="$WORK/segments"
mkdir -p "$OUT"

FPS=60
TOTAL=19.278
ENC=(-an -r "$FPS" -c:v libx264 -preset veryfast -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -movflags +faststart)

# Approved visual base. Do not rebuild the concept.
CINE="split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=26,eq=brightness=-0.17:saturation=0.75[bg2];[fg]scale=1080:-2,eq=contrast=1.05:saturation=1.06,unsharp=3:3:0.25:3:3:0[fg2];[bg2][fg2]overlay=(W-w)/2:(H-h)/2,format=yuv420p"

# Crash / freeze / rewind
ffmpeg -y -hide_banner -loglevel error -ss 12.65 -t 0.90 -i "$CRASH" -vf "$CINE,fps=$FPS" "${ENC[@]}" "$OUT/00_crash.mp4"
ffmpeg -y -hide_banner -loglevel error -ss 13.54 -i "$CRASH" -frames:v 1 -vf "$CINE" -c:v png "$OUT/freeze.png"
ffmpeg -y -hide_banner -loglevel error -loop 1 -framerate "$FPS" -i "$OUT/freeze.png" -t 0.08 -vf "format=yuv420p" "${ENC[@]}" "$OUT/01_freeze.mp4"
ffmpeg -y -hide_banner -loglevel error -ss 12.95 -t 0.60 -i "$CRASH" -vf "reverse,setpts=PTS/1.153846,$CINE,fps=$FPS" "${ENC[@]}" -t 0.52 "$OUT/02_rewind.mp4"

make_cine(){
  local idx=$1 ss=$2 dur=$3
  ffmpeg -y -hide_banner -loglevel error -ss "$ss" -t "$dur" -i "$MAIN"     -vf "$CINE,fps=$FPS" "${ENC[@]}" "$OUT/${idx}.mp4"
}

make_bw_pan(){
  local idx=$1 ss=$2 dur=$3 x0=$4 x1=$5 flash=${6:-0}
  local slope
  slope=$(awk -v a="$x0" -v b="$x1" -v d="$dur" 'BEGIN{printf "%.8f", (b-a)/d}')
  local vf="setpts=PTS-STARTPTS,scale=-2:1920,crop=1080:1920:'${x0}+(${slope})*t':0,eq=saturation=0:contrast=1.20:brightness=-0.018:gamma=1.04,unsharp=5:5:0.42:5:5:0,noise=alls=1.25:allf=t+u"
  if [[ "$flash" == "1" ]]; then
    vf+=",drawbox=x=0:y=0:w=iw:h=ih:color=white@0.94:t=fill:enable='lt(t,0.05)'"
  fi
  vf+=",fps=$FPS,format=yuv420p"
  ffmpeg -y -hide_banner -loglevel error -ss "$ss" -t "$dur" -i "$MAIN" -vf "$vf" "${ENC[@]}" "$OUT/${idx}.mp4"
}

# Calm build: preserve.
make_cine 03_calm1 38.20 2.10
make_cine 04_calm2 84.00 1.95
make_cine 05_calm3 124.00 1.75
make_cine 06_calm4 108.00 2.20

# Fast post-drop cadence derived from the supplied 190804 reference.
ACTION_NAMES=(
  07_sideways 08_nearpass 09_crest 10_archjump 11_hyundai 12_forestford
  13_blackpass 14_bluewhite 15_redpass 16_attack 17_orangecrest 18_whitepass
  19_rearhop 20_mspec 21_jump 22_bluejump 23_finaljump
)
ACTION_SS=(57.00 70.00 35.00 53.00 75.00 100.00 55.00 120.00 148.00 63.00 163.00 178.00 91.00 113.50 140.00 165.00 16.00)
ACTION_DUR=(0.53 0.43 0.51 0.41 0.45 0.51 0.41 0.47 0.39 0.45 0.47 0.39 0.53 0.53 0.58 0.58 2.138)
ACTION_X0=(1100 1080 1160 1160 1350 1120 1120 1160 950 1080 1080 1050 1420 1300 1160 1030 1060)
ACTION_X1=(1550 1450 1160 1160 1450 1320 1420 1260 1420 1420 1320 1360 1500 1380 1160 1500 1060)

for i in "${!ACTION_NAMES[@]}"; do
  flash=0
  [[ "$i" == "0" ]] && flash=1
  make_bw_pan "${ACTION_NAMES[$i]}" "${ACTION_SS[$i]}" "${ACTION_DUR[$i]}" "${ACTION_X0[$i]}" "${ACTION_X1[$i]}" "$flash"
done

cat > "$OUT/list.txt" <<EOF
file '00_crash.mp4'
file '01_freeze.mp4'
file '02_rewind.mp4'
file '03_calm1.mp4'
file '04_calm2.mp4'
file '05_calm3.mp4'
file '06_calm4.mp4'
EOF
for name in "${ACTION_NAMES[@]}"; do printf "file '%s.mp4'\n" "$name" >> "$OUT/list.txt"; done
ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "$OUT/list.txt" -c copy "$WORK/video_silent.mp4"

# ---------------------------------------------------------------------------
# AUDIO:
# - authentic rally source audio is always the backbone
# - Isle of Man speech is NEVER used
# - if MUSIC is supplied, it should be the exact clean song from 190804
# ---------------------------------------------------------------------------

CALM_SS=(38.20 84.00 124.00 108.00)
CALM_DUR=(2.10 1.95 1.75 2.20)

FC=""
FC+="[0:a]atrim=12.65:13.55,asetpts=PTS-STARTPTS,highpass=f=35,volume=1.00,afade=t=in:d=0.01,afade=t=out:st=0.84:d=0.06[s0];"
FC+="[0:a]atrim=13.46:13.54,asetpts=PTS-STARTPTS,lowpass=f=180,volume=0.58,afade=t=out:st=0.02:d=0.06[s1];"
FC+="[0:a]atrim=12.95:13.55,areverse,asetpts=PTS-STARTPTS,atempo=1.153846,highpass=f=45,volume=0.82,afade=t=in:d=0.015,afade=t=out:st=0.47:d=0.05[s2];"

idx=3
for i in 0 1 2 3; do
  ss=${CALM_SS[$i]}; dur=${CALM_DUR[$i]}
  end=$(awk -v s="$ss" -v d="$dur" 'BEGIN{printf "%.3f", s+d}')
  fout=$(awk -v d="$dur" 'BEGIN{v=d-0.08; if(v<0)v=0; printf "%.3f",v}')
  FC+="[1:a]atrim=${ss}:${end},asetpts=PTS-STARTPTS,highpass=f=38,volume=0.96,afade=t=in:d=0.02,afade=t=out:st=${fout}:d=0.08[s${idx}];"
  idx=$((idx+1))
done

for i in "${!ACTION_SS[@]}"; do
  ss=${ACTION_SS[$i]}; dur=${ACTION_DUR[$i]}
  end=$(awk -v s="$ss" -v d="$dur" 'BEGIN{printf "%.3f", s+d}')
  fout=$(awk -v d="$dur" 'BEGIN{v=d-0.025; if(v<0)v=0; printf "%.3f",v}')
  FC+="[1:a]atrim=${ss}:${end},asetpts=PTS-STARTPTS,highpass=f=42,volume=1.02,afade=t=in:d=0.008,afade=t=out:st=${fout}:d=0.025[s${idx}];"
  idx=$((idx+1))
done

CONCAT=""
for ((i=0;i<idx;i++)); do CONCAT+="[s${i}]"; done
FC+="${CONCAT}concat=n=${idx}:v=0:a=1,acompressor=threshold=-15dB:ratio=2.2:attack=8:release=70:makeup=1.6,alimiter=limit=0.97:attack=4:release=60,atrim=0:${TOTAL}[rally]"

ffmpeg -y -hide_banner -loglevel error -i "$CRASH" -i "$MAIN"   -filter_complex "$FC" -map '[rally]' -ar 48000 -c:a aac -b:a 320k "$WORK/rally_audio.m4a"

if [[ -n "$MUSIC" && -f "$MUSIC" ]]; then
  # Keep the crash/rewind fully physical before the song enters, then duck rally audio under music.
  ffmpeg -y -hide_banner -loglevel error     -i "$WORK/rally_audio.m4a" -ss "$MUSIC_OFFSET" -i "$MUSIC"     -filter_complex "[0:a]volume='if(lt(t,${MUSIC_DELAY}),1.0,${RALLY_GAIN})':eval=frame[r];[1:a]atrim=0:16.7706,asetpts=PTS-STARTPTS,volume=${MUSIC_GAIN},adelay=${MUSIC_DELAY}s:all=1,afade=t=in:st=0:d=0.05,afade=t=out:st=16.48:d=0.29[m];[r][m]amix=inputs=2:normalize=0:dropout_transition=0,alimiter=limit=0.965:attack=4:release=60,atrim=0:${TOTAL}[aout]"     -map '[aout]' -ar 48000 -c:a aac -b:a 320k "$WORK/audio.m4a"
else
  echo "Clean RICK OWENS audio not found; rendering source-audio-only fallback." >&2
  cp "$WORK/rally_audio.m4a" "$WORK/audio.m4a"
fi

ffmpeg -y -hide_banner -loglevel error -i "$WORK/video_silent.mp4" -i "$WORK/audio.m4a"   -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -t "$TOTAL" -movflags +faststart "$FINAL"

ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,codec_type,width,height,r_frame_rate,bit_rate -of default=noprint_wrappers=1 "$FINAL"
