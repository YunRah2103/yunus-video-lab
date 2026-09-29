#!/usr/bin/env bash
set -euo pipefail
ROOT=/mnt/data/cid_assets
OUT=/mnt/data/cid_build_v2
PS1=/mnt/data/cid_ps1_v2
mkdir -p "$OUT"
LONG="$ROOT/From the NASA Archives： The Crash in the Desert [HcRyVEFDgGM].webm"
C1="$ROOT/Controlled_Impact_Demonstration.ogv.240p.vp9.webm"
C2="$ROOT/Controlled_Impact_Demonstration_2.ogv.240p.vp9.webm"
C3="$ROOT/Controlled_Impact_Demonstration_3.ogv.240p.vp9.webm"

arch(){
  local in="$1" ss="$2" dur="$3" out="$4" fgwidth="\${5:-1120}" sat="\${6:-0.94}"
  ffmpeg -y -hide_banner -loglevel error -ss "$ss" -t "$dur" -i "$in" \
    -filter_complex "[0:v]fps=30,split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=34,eq=brightness=-0.13:saturation=0.72[bgv];[fg]scale=\${fgwidth}:-2:flags=lanczos,eq=contrast=1.08:brightness=0.005:saturation=\${sat},unsharp=5:5:0.45[fgv];[bgv][fgv]overlay=(W-w)/2:(H-h)/2,setsar=1,format=yuv420p[v]" \
    -map "[v]" -an -r 30 -c:v libx264 -preset veryfast -crf 13 -pix_fmt yuv420p "$out"
}

# 0.00-1.25: real fireball hero, no graphics.
arch "$C1" 9.20 1.25 "$OUT/00_hook.mp4" 1250 1.00
# 1.25-4.15: two real Boeing shots so the first five seconds keep progressing.
arch "$LONG" 59.80 1.45 "$OUT/01_intact_side.mp4" 1160 0.96
arch "$LONG" 56.70 1.45 "$OUT/02_intact_rear.mp4" 1120 0.94
# 4.15-5.75: actual instrumented crash-test dummies, not a generic aerial shot.
arch "$C2" 4.10 1.60 "$OUT/03_dummy.mp4" 1120 0.93
# 5.75-7.35: real technical cabin / instrumentation context.
arch "$LONG" 70.00 1.60 "$OUT/04_technical.mp4" 1110 0.92
# 7.35-10.20: real low approach.
arch "$C1" 1.00 2.85 "$OUT/05_approach.mp4" 1150 0.95

# 10.20-12.95: authored PS1/Puppet Combo cabin reconstruction.
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i "$PS1/cabin/%04d.png" -t 2.75 \
  -vf "scale=1080:1920:flags=neighbor,gblur=sigma=0.20,noise=alls=1.8:allf=t+u,eq=contrast=1.05:saturation=0.94,setsar=1,format=yuv420p" \
  -an -r 30 -c:v libx264 -preset veryfast -crf 11 -pix_fmt yuv420p "$OUT/06_cabin_ps1.mp4"

# 12.95-15.65: back to real approach before explaining failure.
arch "$LONG" 57.10 2.70 "$OUT/07_real_approach.mp4" 1140 0.95

# 15.65-18.45: clearer PS1 failure reconstruction; contact lands at the very end.
ffmpeg -y -hide_banner -loglevel error -framerate 30 -i "$PS1/failure/%04d.png" -t 2.80 \
  -vf "scale=1080:1920:flags=neighbor,gblur=sigma=0.18,noise=alls=2.0:allf=t+u,eq=contrast=1.07:saturation=0.92,setsar=1,format=yuv420p" \
  -an -r 30 -c:v libx264 -preset veryfast -crf 11 -pix_fmt yuv420p "$OUT/08_failure_ps1.mp4"

# 18.45 onward: hard return to reality and stay there.
arch "$C1" 7.00 2.85 "$OUT/09_impact_side.mp4" 1210 1.00
arch "$C3" 17.25 1.15 "$OUT/10_impact_tail.mp4" 1120 0.98
arch "$LONG" 110.00 1.80 "$OUT/11_fireball.mp4" 1190 1.00
arch "$LONG" 152.50 1.25 "$OUT/12_burning_wreckage.mp4" 1180 1.00
arch "$LONG" 162.40 1.068 "$OUT/13_aftermath.mp4" 1140 0.96

cat > "$OUT/list.txt" <<EOF
file '$OUT/00_hook.mp4'
file '$OUT/01_intact_side.mp4'
file '$OUT/02_intact_rear.mp4'
file '$OUT/03_dummy.mp4'
file '$OUT/04_technical.mp4'
file '$OUT/05_approach.mp4'
file '$OUT/06_cabin_ps1.mp4'
file '$OUT/07_real_approach.mp4'
file '$OUT/08_failure_ps1.mp4'
file '$OUT/09_impact_side.mp4'
file '$OUT/10_impact_tail.mp4'
file '$OUT/11_fireball.mp4'
file '$OUT/12_burning_wreckage.mp4'
file '$OUT/13_aftermath.mp4'
EOF
ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "$OUT/list.txt" -c copy "$OUT/video_silent.mp4"

VO="$ROOT/openai-fm-alloy-audio.mp3"
PLANE="$ROOT/tanweraman-big-plane-sound-effect-247601.mp3"
METAL="$ROOT/freesound_community-metal-impact-30254.mp3"
SMASH="$ROOT/soumages-iron-smash-with-debris-351841.mp3"
FIRE="$ROOT/freesound_community-grand-feu-big-fire-gran-incendio-81140.mp3"
FINAL=/mnt/data/NASA_FAA_1984_Controlled_Impact_Demonstration_V4_2.mp4

ffmpeg -y -hide_banner -loglevel error \
  -i "$OUT/video_silent.mp4" -i "$VO" -i "$PLANE" -i "$METAL" -i "$SMASH" -i "$FIRE" \
  -filter_complex "\
[1:a]aresample=48000,loudnorm=I=-15.5:TP=-1.3:LRA=6[vo];\
[2:a]aresample=48000,atrim=start=1.0:end=15.6,asetpts=PTS-STARTPTS,volume='0.040+0.050*(t/14.6)':eval=frame,afade=t=in:st=0:d=0.35,afade=t=out:st=13.8:d=0.8,adelay=1000|1000,lowpass=f=5200[plane];\
[2:a]aresample=48000,atrim=start=4.5:end=7.5,asetpts=PTS-STARTPTS,volume=.055,lowpass=f=260,highpass=f=45,afade=t=in:st=0:d=0.25,afade=t=out:st=2.5:d=0.45,adelay=10200|10200[cabinrumble];\
[4:a]aresample=48000,atrim=start=0:end=0.85,asetpts=PTS-STARTPTS,volume=.23,afade=t=out:st=0.34:d=0.5,adelay=17980|17980[cutter];\
[3:a]aresample=48000,atrim=start=0.05:end=0.80,asetpts=PTS-STARTPTS,volume=.14,afade=t=out:st=0.30:d=0.45,adelay=18450|18450[impact];\
[5:a]aresample=48000,atrim=start=0:end=1.20,asetpts=PTS-STARTPTS,volume=.20,afade=t=out:st=0.75:d=0.40[firehook];\
[5:a]aresample=48000,atrim=start=0:end=7.80,asetpts=PTS-STARTPTS,volume=.145,afade=t=in:st=0:d=0.22,afade=t=out:st=7.25:d=0.45,adelay=18850|18850[firemain];\
[vo][plane][cabinrumble][cutter][impact][firehook][firemain]amix=inputs=7:duration=longest:normalize=0,alimiter=limit=.95[a]" \
  -map 0:v -map "[a]" -t 26.568 -c:v copy \
  -c:a aac -ar 48000 -b:a 192k -movflags +faststart "$FINAL"

echo "$FINAL"
