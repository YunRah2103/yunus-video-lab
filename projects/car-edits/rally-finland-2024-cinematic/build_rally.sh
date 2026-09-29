set -euo pipefail
MAIN='/mnt/data/WRC Rally Finland 2024 ｜ Flat Out & Big Jumps ｜ 4K [QyOQq-rZxP4].webm'
CRASH='/mnt/data/WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! ： Secto Rally Finland 2021 [pHKZQEAZ37k].webm'
REF='/mnt/data/Pure Speed junky’s  . . . #isleofmantt #touristtrophy #superbike #mot... [7685358261817658646].mp3'
OUT='/mnt/data/rally_work/segments'
mkdir -p "$OUT"
ENC=(-an -r 60 -c:v libx264 -preset veryfast -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -movflags +faststart)
# Landscape-in-portrait cinematic treatment preserving the source frame.
CINE="split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=26,eq=brightness=-0.17:saturation=0.75[bg2];[fg]scale=1080:-2,eq=contrast=1.05:saturation=1.06,unsharp=3:3:0.25:3:3:0[fg2];[bg2][fg2]overlay=(W-w)/2:(H-h)/2,format=yuv420p"
# Crash forward, 0.90s
ffmpeg -y -hide_banner -loglevel error -ss 12.65 -t 0.90 -i "$CRASH" -vf "$CINE,fps=60" "${ENC[@]}" "$OUT/00_crash.mp4"
# Freeze, 0.08s
ffmpeg -y -hide_banner -loglevel error -ss 13.54 -i "$CRASH" -frames:v 1 -vf "$CINE" -c:v png "$OUT/freeze.png"
ffmpeg -y -hide_banner -loglevel error -loop 1 -framerate 60 -i "$OUT/freeze.png" -t 0.08 -vf "format=yuv420p" "${ENC[@]}" "$OUT/01_freeze.mp4"
# Rewind, 0.52s (reverse 0.60s and speed it up)
ffmpeg -y -hide_banner -loglevel error -ss 12.95 -t 0.60 -i "$CRASH" -vf "reverse,setpts=PTS/1.153846,$CINE,fps=60" "${ENC[@]}" -t 0.52 "$OUT/02_rewind.mp4"

make_cine(){ idx=$1; ss=$2; dur=$3; ffmpeg -y -hide_banner -loglevel error -ss "$ss" -t "$dur" -i "$MAIN" -vf "$CINE,fps=60" "${ENC[@]}" "$OUT/${idx}.mp4"; }
make_bw(){ idx=$1; ss=$2; dur=$3; x=$4; ffmpeg -y -hide_banner -loglevel error -ss "$ss" -t "$dur" -i "$MAIN" -vf "scale=-2:1920,crop=1080:1920:${x}:0,eq=saturation=0:contrast=1.26:brightness=-0.025:gamma=1.02,unsharp=5:5:0.55:5:5:0,noise=alls=2:allf=t+u,fps=60,format=yuv420p" "${ENC[@]}" "$OUT/${idx}.mp4"; }

# Calm build to 9.50s total
make_cine 03_calm1 38.20 2.10
make_cine 04_calm2 84.00 1.95
make_cine 05_calm3 124.00 1.75
make_cine 06_calm4 108.00 2.20
# Drop: monochrome full-bleed action
make_bw 07_sideways   57.00 0.85 1160
make_bw 08_nearpass   73.20 0.80 1180
make_bw 09_land       52.00 1.00 1160
make_bw 10_spectator  95.00 0.85 1480
make_bw 11_jump2     141.20 1.15 1160
make_bw 12_pass      113.50 0.90 1320
make_bw 13_dustpass   76.00 1.05 1400
make_bw 14_sideways2  91.00 1.00 1450
make_bw 15_finaljump  16.00 2.178 1060

cat > "$OUT/list.txt" <<EOF
file '00_crash.mp4'
file '01_freeze.mp4'
file '02_rewind.mp4'
file '03_calm1.mp4'
file '04_calm2.mp4'
file '05_calm3.mp4'
file '06_calm4.mp4'
file '07_sideways.mp4'
file '08_nearpass.mp4'
file '09_land.mp4'
file '10_spectator.mp4'
file '11_jump2.mp4'
file '12_pass.mp4'
file '13_dustpass.mp4'
file '14_sideways2.mp4'
file '15_finaljump.mp4'
EOF
ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "$OUT/list.txt" -c copy /mnt/data/rally_work/video_silent.mp4

# Build sound design around the supplied reference track.
ffmpeg -y -hide_banner -loglevel error \
  -i "$REF" -i "$CRASH" -i "$MAIN" \
  -filter_complex "\
[0:a]atrim=0:19.278,asetpts=PTS-STARTPTS,volume=0.82[master];\
[1:a]asplit=3[ca][cb][cc];\
[ca]atrim=12.65:13.55,asetpts=PTS-STARTPTS,volume=0.68,afade=t=out:st=0.82:d=0.08[caf];\
[cb]atrim=12.65:13.55,asetpts=PTS-STARTPTS,lowpass=f=120,volume=0.95,afade=t=out:st=0.78:d=0.12[low];\
[cc]atrim=12.95:13.55,areverse,asetpts=PTS-STARTPTS,atempo=1.153846,volume=0.48,adelay=980|980,afade=t=in:st=0:d=0.03,afade=t=out:st=0.45:d=0.07[rew];\
[2:a]asplit=13[m1][m2][m3][m4][m5][m6][m7][m8][m9][m10][m11][m12][m13];\
[m1]atrim=38.20:40.30,asetpts=PTS-STARTPTS,volume=0.12,adelay=1500|1500,afade=t=in:d=0.06,afade=t=out:st=1.98:d=0.10[a1];\
[m2]atrim=84.00:85.95,asetpts=PTS-STARTPTS,volume=0.12,adelay=3600|3600,afade=t=in:d=0.05,afade=t=out:st=1.82:d=0.10[a2];\
[m3]atrim=124.00:125.75,asetpts=PTS-STARTPTS,volume=0.13,adelay=5550|5550,afade=t=in:d=0.05,afade=t=out:st=1.62:d=0.10[a3];\
[m4]atrim=108.00:110.20,asetpts=PTS-STARTPTS,volume=0.14,adelay=7300|7300,afade=t=in:d=0.05,afade=t=out:st=2.07:d=0.10[a4];\
[m5]atrim=57.00:57.85,asetpts=PTS-STARTPTS,volume=0.34,adelay=9500|9500[a5];\
[m6]atrim=73.20:74.00,asetpts=PTS-STARTPTS,volume=0.38,adelay=10350|10350[a6];\
[m7]atrim=52.00:53.00,asetpts=PTS-STARTPTS,volume=0.42,adelay=11150|11150[a7];\
[m8]atrim=95.00:95.85,asetpts=PTS-STARTPTS,volume=0.32,adelay=12150|12150[a8];\
[m9]atrim=141.20:142.35,asetpts=PTS-STARTPTS,volume=0.38,adelay=13000|13000[a9];\
[m10]atrim=113.50:114.40,asetpts=PTS-STARTPTS,volume=0.42,adelay=14150|14150[a10];\
[m11]atrim=76.00:77.05,asetpts=PTS-STARTPTS,volume=0.42,adelay=15050|15050[a11];\
[m12]atrim=91.00:92.00,asetpts=PTS-STARTPTS,volume=0.36,adelay=16100|16100[a12];\
[m13]atrim=16.00:18.178,asetpts=PTS-STARTPTS,volume=0.43,adelay=17100|17100,afade=t=out:st=2.06:d=0.11[a13];\
[master][caf][low][rew][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13]amix=inputs=17:normalize=0:dropout_transition=0,alimiter=limit=0.97:attack=5:release=50,atrim=0:19.278[aout]" \
  -map '[aout]' -c:a aac -b:a 320k /mnt/data/rally_work/audio.m4a

# Final high-quality TikTok master.
ffmpeg -y -hide_banner -loglevel error -i /mnt/data/rally_work/video_silent.mp4 -i /mnt/data/rally_work/audio.m4a \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -t 19.278 -movflags +faststart \
  /mnt/data/Rally_Finland_Cinematic_TikTok_Edit.mp4

ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,codec_type,width,height,r_frame_rate,bit_rate -of default=noprint_wrappers=1 /mnt/data/Rally_Finland_Cinematic_TikTok_Edit.mp4
