set -euo pipefail
OUT=/mnt/data/cid_build
mkdir -p "$OUT"
LONG='/mnt/data/From the NASA Archives： The Crash in the Desert [HcRyVEFDgGM].webm'
C1='/mnt/data/Controlled_Impact_Demonstration.ogv.240p.vp9.webm'
C2='/mnt/data/Controlled_Impact_Demonstration_2.ogv.240p.vp9.webm'
C3='/mnt/data/Controlled_Impact_Demonstration_3.ogv.240p.vp9.webm'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

arch(){
  in="$1"; ss="$2"; dur="$3"; out="$4"; fgwidth="${5:-1080}"; text="${6:-}"
  if [ -n "$text" ]; then
    txt=",drawtext=fontfile=${FONT}:text='${text}':fontcolor=white:fontsize=52:borderw=3:bordercolor=black@0.65:x=(w-text_w)/2:y=250:enable='between(t,0.08,${dur})'"
  else txt=""; fi
  ffmpeg -y -hide_banner -loglevel error -ss "$ss" -t "$dur" -i "$in"    -filter_complex "[0:v]fps=30,split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=35,eq=brightness=-0.10:saturation=0.78[bgv];[fg]scale=${fgwidth}:-2:flags=lanczos,eq=contrast=1.08:brightness=0.01:saturation=0.92,unsharp=5:5:0.6[fgv];[bgv][fgv]overlay=(W-w)/2:(H-h)/2${txt},setsar=1,format=yuv420p[v]"    -map "[v]" -an -r 30 -c:v libx264 -preset medium -crf 12 -pix_fmt yuv420p "$out"
}

arch "$C1" 10.0 1.25 "$OUT/00_hook.mp4" 1180
arch "$LONG" 26.5 2.90 "$OUT/01_intact.mp4" 1080
arch "$C2" 8.0 1.60 "$OUT/02_dummy.mp4" 1080 'NO CREW ABOARD'
arch "$LONG" 68.0 1.60 "$OUT/03_engineer.mp4" 1080
arch "$LONG" 90.5 2.85 "$OUT/04_approach.mp4" 1080

ffmpeg -y -hide_banner -loglevel error -framerate 30 -i /mnt/data/ps1/cabin/%04d.png -t 2.75  -vf "scale=1080:1920:flags=neighbor,gblur=sigma=0.22,noise=alls=2.2:allf=t+u,setsar=1,format=yuv420p"  -an -r 30 -c:v libx264 -preset medium -crf 10 -pix_fmt yuv420p "$OUT/05_cabin.mp4"

arch "$C1" 4.5 2.70 "$OUT/06_realapproach.mp4" 1080

ffmpeg -y -hide_banner -loglevel error -framerate 30 -i /mnt/data/ps1/failure/%04d.png -t 2.80  -vf "scale=1080:1920:flags=neighbor,gblur=sigma=0.22,noise=alls=2.5:allf=t+u,setsar=1,format=yuv420p"  -an -r 30 -c:v libx264 -preset medium -crf 10 -pix_fmt yuv420p "$OUT/07_failure.mp4"

arch "$C1" 7.1 2.85 "$OUT/08_impact1.mp4" 1140
arch "$C3" 8.0 1.15 "$OUT/09_impact2.mp4" 1140
arch "$LONG" 102.2 1.80 "$OUT/10_fire.mp4" 1140
arch "$LONG" 133.5 2.318 "$OUT/11_aftermath.mp4" 1080

cat > "$OUT/list.txt" <<EOF
file '$OUT/00_hook.mp4'
file '$OUT/01_intact.mp4'
file '$OUT/02_dummy.mp4'
file '$OUT/03_engineer.mp4'
file '$OUT/04_approach.mp4'
file '$OUT/05_cabin.mp4'
file '$OUT/06_realapproach.mp4'
file '$OUT/07_failure.mp4'
file '$OUT/08_impact1.mp4'
file '$OUT/09_impact2.mp4'
file '$OUT/10_fire.mp4'
file '$OUT/11_aftermath.mp4'
EOF

ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "$OUT/list.txt" -c copy "$OUT/video_silent.mp4"

VO='/mnt/data/openai-fm-alloy-audio.mp3'
PLANE='/mnt/data/tanweraman-big-plane-sound-effect-247601.mp3'
METAL='/mnt/data/freesound_community-metal-impact-30254.mp3'
SMASH='/mnt/data/soumages-iron-smash-with-debris-351841.mp3'
FIRE='/mnt/data/freesound_community-grand-feu-big-fire-gran-incendio-81140.mp3'

ffmpeg -y -hide_banner -loglevel error  -i "$OUT/video_silent.mp4" -i "$VO" -i "$PLANE" -i "$METAL" -i "$SMASH" -i "$FIRE"  -filter_complex " [1:a]aresample=48000,loudnorm=I=-15:TP=-1.2:LRA=7[vo]; [2:a]aresample=48000,atrim=start=1.5:end=10.5,asetpts=PTS-STARTPTS,volume=0.12,afade=t=in:st=0:d=0.25,afade=t=out:st=8.2:d=0.8,adelay=1100|1100[plane1]; [2:a]aresample=48000,atrim=start=7:end=11,asetpts=PTS-STARTPTS,volume=0.13,afade=t=in:st=0:d=0.15,afade=t=out:st=3.1:d=0.7,adelay=12800|12800[plane2]; [3:a]aresample=48000,atrim=start=0:end=1.0,asetpts=PTS-STARTPTS,volume=0.22,afade=t=out:st=0.45:d=0.5,adelay=18180|18180[metal]; [4:a]aresample=48000,atrim=start=0:end=2.2,asetpts=PTS-STARTPTS,volume=0.23,afade=t=out:st=1.0:d=1.1,adelay=18420|18420[smash]; [5:a]aresample=48000,atrim=start=0:end=1.3,asetpts=PTS-STARTPTS,volume=0.16,afade=t=out:st=0.8:d=0.45[firehook]; [5:a]aresample=48000,atrim=start=0:end=7.8,asetpts=PTS-STARTPTS,volume=0.15,afade=t=in:st=0:d=0.15,afade=t=out:st=7.1:d=0.6,adelay=18750|18750[fireend]; [vo][plane1][plane2][metal][smash][firehook][fireend]amix=inputs=7:duration=longest:normalize=0,alimiter=limit=0.94[a]"  -map 0:v -map "[a]" -t 26.568 -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 -c:a aac -b:a 192k -movflags +faststart  /mnt/data/NASA_FAA_1984_Controlled_Impact_Demonstration_V4.mp4
