"""Prepare the three narration-led footage punches from the supplied source."""
import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--footage', type=Path, required=True)
args = p.parse_args()
out = ROOT / 'public/media/punches'
out.mkdir(parents=True, exist_ok=True)
for name, start, duration, center in [
    ('advantage', 110.3, 1.08, .57),
    ('traction', 26.2, 1.30, .49),
    ('chassis', 114.1, 1.40, .42),
]:
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(args.footage),
        '-ss', str(start), '-t', str(duration), '-vf', f'scale=-2:1920,crop=1080:1920:iw*{center}-540:0',
        '-an', '-c:v', 'libx264', '-crf', '19', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart', str(out / f'{name}.mp4'), '-y'], check=True)
    subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=nb_frames', str(out / f'{name}.mp4')], check=True)
    if (out / f'{name}.mp4').stat().st_size < 1024:
        raise RuntimeError(f'No usable frames in {name}')
print('Three photographic footage punches prepared')
