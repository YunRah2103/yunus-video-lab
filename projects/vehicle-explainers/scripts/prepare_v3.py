"""Prepare deterministic presenter crops and user-provided hero footage for V3.
Photos under public/photo are already masked production assets; don't replace
those with the procedural V1 vehicle SVGs.
"""
import argparse
import shutil
import subprocess
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--footage', type=Path, help='The supplied Green Hornet Porsche 992 GT3 RS source video')
parser.add_argument('--voice', type=Path, help='Optional replacement for the supplied Cedar recording; retime cues if different')
args = parser.parse_args()
subprocess.run([sys.executable, str(ROOT/'scripts/prepare_assets.py')], check=True)
for p in (ROOT/'public/presenter').glob('*.png'):
    if p.name[:2].isdigit():
        im = Image.open(p)
        im.crop((180,160,800,825)).save(p.with_name('upper-'+p.name))
        im.crop((330,160,575,410)).save(p.with_name('head-'+p.name))
media = ROOT/'public/media'
media.mkdir(exist_ok=True)
if args.voice:
    shutil.copy2(args.voice, media/'cedar.mp3')
if args.footage:
    subprocess.run(['ffmpeg','-loglevel','error','-ss','58','-i',str(args.footage),'-t','6.7','-vf','scale=1920:-2','-an','-c:v','libx264','-crf','17','-preset','fast',str(media/'hero.mp4'),'-y'],check=True)
if not (media/'hero.mp4').exists():
    raise SystemExit('Pass --footage with the supplied Green Hornet source video to prepare the 6.7s hero clip. Large source video is intentionally excluded from Git.')
print('Porsche V3 production assets ready')
