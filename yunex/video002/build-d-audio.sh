#!/usr/bin/env bash
set -euo pipefail
IN="${1:-public/video002/openai-fm-alloy-audio.mp3}"
OUT_DIR="${2:-public/video002}"
mkdir -p "$OUT_DIR"
TRIM="$OUT_DIR/d_vo_trimmed.wav"
MIX="$OUT_DIR/d_mix.wav"

FILTER="[0:a]atrim=start=0:end=0.917667,asetpts=PTS-STARTPTS[a0];anullsrc=r=24000:cl=mono:d=0.260000[a1];[0:a]atrim=start=1.190167:end=2.335208,asetpts=PTS-STARTPTS[a2];anullsrc=r=24000:cl=mono:d=0.260000[a3];[0:a]atrim=start=2.969958:end=5.397583,asetpts=PTS-STARTPTS[a4];anullsrc=r=24000:cl=mono:d=0.238542[a5];[0:a]atrim=start=5.636125:end=8.435917,asetpts=PTS-STARTPTS[a6];anullsrc=r=24000:cl=mono:d=0.260000[a7];[0:a]atrim=start=8.981542:end=9.653250,asetpts=PTS-STARTPTS[a8];anullsrc=r=24000:cl=mono:d=0.260000[a9];[0:a]atrim=start=10.067417:end=13.840875,asetpts=PTS-STARTPTS[a10];anullsrc=r=24000:cl=mono:d=0.260000[a11];[0:a]atrim=start=14.365375:end=15.171708,asetpts=PTS-STARTPTS[a12];anullsrc=r=24000:cl=mono:d=0.260000[a13];[0:a]atrim=start=15.498083:end=18.154917,asetpts=PTS-STARTPTS[a14];anullsrc=r=24000:cl=mono:d=0.260000[a15];[0:a]atrim=start=18.679542:end=19.873000,asetpts=PTS-STARTPTS[a16];anullsrc=r=24000:cl=mono:d=0.260000[a17];[0:a]atrim=start=20.196625:end=21.795667,asetpts=PTS-STARTPTS[a18];anullsrc=r=24000:cl=mono:d=0.260000[a19];[0:a]atrim=start=22.463583:end=25.504958,asetpts=PTS-STARTPTS[a20];anullsrc=r=24000:cl=mono:d=0.260000[a21];[0:a]atrim=start=25.851083:end=26.803208,asetpts=PTS-STARTPTS[a22];anullsrc=r=24000:cl=mono:d=0.196792[a23];[a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17][a18][a19][a20][a21][a22][a23]concat=n=24:v=0:a=1[out]"
ffmpeg -y -hide_banner -loglevel error -i "$IN" -filter_complex "$FILTER" -map '[out]' -c:a pcm_s16le -ar 24000 -ac 1 "$TRIM"

ffmpeg -y -hide_banner -loglevel error   -i "$TRIM"   -f lavfi -i "anoisesrc=color=pink:amplitude=0.055:r=24000:d=25.019792:seed=1001"   -f lavfi -i "sine=frequency=82:sample_rate=24000:duration=25.019792"   -f lavfi -i "sine=frequency=164:sample_rate=24000:duration=25.019792"   -f lavfi -i "sine=frequency=960:sample_rate=24000:duration=0.055"   -f lavfi -i "sine=frequency=720:sample_rate=24000:duration=0.07"   -f lavfi -i "anoisesrc=color=white:amplitude=0.12:r=24000:d=0.22:seed=2002"   -filter_complex "[0:a]volume=1[vo];[1:a]highpass=f=230,lowpass=f=2900,volume=0.12,afade=t=in:st=0:d=1.2,afade=t=out:st=23.5:d=1.5[wind];[2:a]lowpass=f=180,volume=0.035[eng1];[3:a]lowpass=f=260,volume=0.018[eng2];[4:a]afade=t=out:st=0:d=0.055,volume=0.16,adelay=650|650[tick1];[4:a]afade=t=out:st=0:d=0.055,volume=0.13,adelay=10250|10250[tick2];[5:a]afade=t=out:st=0:d=0.07,volume=0.11,adelay=14150|14150[tick3];[6:a]highpass=f=1200,lowpass=f=6500,afade=t=in:st=0:d=0.03,afade=t=out:st=0.05:d=0.17,volume=0.10,adelay=14350|14350[brake];[vo][wind][eng1][eng2][tick1][tick2][tick3][brake]amix=inputs=8:normalize=0,alimiter=limit=0.89,loudnorm=I=-15:TP=-1.0:LRA=6[m]"   -map '[m]' -ar 24000 -ac 1 -c:a pcm_s16le "$MIX"

echo "built $TRIM"
echo "built $MIX"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$MIX"
