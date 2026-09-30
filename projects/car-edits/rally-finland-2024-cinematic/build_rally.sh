#!/usr/bin/env bash
set -euo pipefail

MAIN="${MAIN:-/mnt/data/WRC Rally Finland 2024 ｜ Flat Out & Big Jumps ｜ 4K [QyOQq-rZxP4].webm}"
CRASH="${CRASH:-/mnt/data/WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! ： Secto Rally Finland 2021 [pHKZQEAZ37k].webm}"
REF="${REF:-/mnt/data/Pure Speed junky’s  . . . #isleofmantt #touristtrophy #superbike #mot... [7685358261817658646].mp3}"
WORK="${WORK:-/mnt/data/rally_v3_work}"
FINAL="${FINAL:-/mnt/data/Rally_Finland_Cinematic_TikTok_Edit_V3.mp4}"
OUT="$WORK/segments"
mkdir -p "$OUT"

FPS=60
TOTAL=19.278
DROP=9.500
ENC=(-an -r "$FPS" -c:v libx264 -preset veryfast -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -movflags +faststart)

# Preserve the approved base's calm landscape-in-portrait treatment.
CINE="split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=26,eq=brightness=-0.17:saturation=0.75[bg2];[fg]scale=1080:-2,eq=contrast=1.05:saturation=1.06,unsharp=3:3:0.25:3:3:0[fg2];[bg2][fg2]overlay=(W-w)/2:(H-h)/2,format=yuv420p"

# Intro: unchanged story language from the approved base.
ffmpeg -y -hide_banner -loglevel error -ss 12.65 -t 0.90 -i "$CRASH" -vf "$CINE,fps=$FPS" "${ENC[@]}" "$OUT/00_crash.mp4"
ffmpeg -y -hide_banner -loglevel error -ss 13.54 -i "$CRASH" -frames:v 1 -vf "$CINE" -c:v png "$OUT/freeze.png"
ffmpeg -y -hide_banner -loglevel error -loop 1 -framerate "$FPS" -i "$OUT/freeze.png" -t 0.08 -vf "format=yuv420p" "${ENC[@]}" "$OUT/01_freeze.mp4"
ffmpeg -y -hide_banner -loglevel error -ss 12.95 -t 0.60 -i "$CRASH" -vf "reverse,setpts=PTS/1.153846,$CINE,fps=$FPS" "${ENC[@]}" -t 0.52 "$OUT/02_rewind.mp4"

make_cine(){
  local idx=$1 ss=$2 dur=$3
  ffmpeg -y -hide_banner -loglevel error -ss "$ss" -t "$dur" -i "$MAIN"     -vf "$CINE,fps=$FPS" "${ENC[@]}" "$OUT/${idx}.mp4"
}

# Reference-informed monochrome: hard, rich blacks but less crushed gravel/tyre detail than V1.
# x0/x1 give a gentle deliberate reframe, never shake. flash=1 adds only the reference-style drop flash.
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

# Calm build is deliberately kept intact to protect the base's tension curve.
make_cine 03_calm1 38.20 2.10
make_cine 04_calm2 84.00 1.95
make_cine 05_calm3 124.00 1.75
make_cine 06_calm4 108.00 2.20

# Post-drop cadence is the main V3 change. It follows the supplied 190804 reference:
# short motion-led hits, hard cuts, no repeated shots, then a long hero jump payoff.
ACTION_NAMES=(
  07_sideways 08_nearpass 09_crest 10_archjump 11_hyundai 12_forestford
  13_blackpass 14_bluewhite 15_redpass 16_attack 17_orangecrest 18_whitepass
  19_rearhop 20_mspec 21_jump 22_bluejump 23_finaljump
)
ACTION_SS=(57.00 70.00 35.00 53.00 75.00 100.00 55.00 120.00 148.00 63.00 163.00 178.00 91.00 113.50 140.00 165.00 16.00)
ACTION_DUR=(0.53 0.43 0.51 0.41 0.45 0.51 0.41 0.47 0.39 0.45 0.47 0.39 0.53 0.53 0.58 0.58 2.138)
ACTION_X0=(1100 1080 1160 1160 1350 1120 1120 1160 950 1080 1080 1050 1420 1300 1160 1030 1060)
ACTION_X1=(1550 1450 1160 1160 1450 1320 1420 1260 1420 1420 1320 1360 1500 1380 1160 1500 1060)
ACTION_VOL=(0.38 0.45 0.38 0.50 0.50 0.40 0.46 0.42 0.48 0.42 0.43 0.48 0.44 0.43 0.48 0.46 0.48)

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

# Build synced physical sound from the exact visual source moments.
# The supplied reference music remains dominant; rally engine/gravel only adds weight and realism.
main_count=$((4 + ${#ACTION_NAMES[@]}))
main_labels=""
for ((i=0;i<main_count;i++)); do main_labels+="[m${i}]"; done

FC="[0:a]atrim=0:${TOTAL},asetpts=PTS-STARTPTS,volume=0.81[master];"
FC+="[1:a]asplit=3[ca][cb][cc];"
FC+="[ca]atrim=12.65:13.55,asetpts=PTS-STARTPTS,volume=0.66,afade=t=out:st=0.82:d=0.08[caf];"
FC+="[cb]atrim=12.65:13.55,asetpts=PTS-STARTPTS,lowpass=f=120,volume=0.88,afade=t=out:st=0.78:d=0.12[low];"
FC+="[cc]atrim=12.95:13.55,areverse,asetpts=PTS-STARTPTS,atempo=1.153846,volume=0.46,adelay=980|980,afade=t=in:st=0:d=0.03,afade=t=out:st=0.45:d=0.07[rew];"
FC+="[2:a]asplit=${main_count}${main_labels};"

# Calm engine bed.
CALM_SS=(38.20 84.00 124.00 108.00)
CALM_DUR=(2.10 1.95 1.75 2.20)
CALM_DELAY=(1500 3600 5550 7300)
CALM_VOL=(0.11 0.11 0.12 0.13)
for i in 0 1 2 3; do
  end=$(awk -v s="${CALM_SS[$i]}" -v d="${CALM_DUR[$i]}" 'BEGIN{printf "%.3f",s+d}')
  fade=$(awk -v d="${CALM_DUR[$i]}" 'BEGIN{printf "%.3f",d-0.10}')
  FC+="[m${i}]atrim=${CALM_SS[$i]}:${end},asetpts=PTS-STARTPTS,volume=${CALM_VOL[$i]},adelay=${CALM_DELAY[$i]}|${CALM_DELAY[$i]},afade=t=in:d=0.04,afade=t=out:st=${fade}:d=0.10[c${i}];"
done

# Fast section: derive delays from the exact edit durations so the engine accents stay frame-synced.
delay_ms=9500
for i in "${!ACTION_NAMES[@]}"; do
  mi=$((i+4))
  end=$(awk -v s="${ACTION_SS[$i]}" -v d="${ACTION_DUR[$i]}" 'BEGIN{printf "%.3f",s+d}')
  fade=$(awk -v d="${ACTION_DUR[$i]}" 'BEGIN{v=d-0.035;if(v<0)v=0;printf "%.3f",v}')
  FC+="[m${mi}]atrim=${ACTION_SS[$i]}:${end},asetpts=PTS-STARTPTS,highpass=f=55,volume=${ACTION_VOL[$i]},adelay=${delay_ms}|${delay_ms},afade=t=in:d=0.015,afade=t=out:st=${fade}:d=0.035[a${i}];"
  delay_ms=$(awk -v ms="$delay_ms" -v d="${ACTION_DUR[$i]}" 'BEGIN{printf "%d",ms+(d*1000)+0.5}')
done

MIX="[master][caf][low][rew]"
for i in 0 1 2 3; do MIX+="[c${i}]"; done
for i in "${!ACTION_NAMES[@]}"; do MIX+="[a${i}]"; done
mix_inputs=$((1+3+4+${#ACTION_NAMES[@]}))
FC+="${MIX}amix=inputs=${mix_inputs}:normalize=0:dropout_transition=0,alimiter=limit=0.965:attack=4:release=55,atrim=0:${TOTAL}[aout]"

ffmpeg -y -hide_banner -loglevel error -i "$REF" -i "$CRASH" -i "$MAIN"   -filter_complex "$FC" -map '[aout]' -c:a aac -b:a 320k "$WORK/audio.m4a"

ffmpeg -y -hide_banner -loglevel error -i "$WORK/video_silent.mp4" -i "$WORK/audio.m4a"   -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -t "$TOTAL" -movflags +faststart "$FINAL"

ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,codec_type,width,height,r_frame_rate,bit_rate -of default=noprint_wrappers=1 "$FINAL"
