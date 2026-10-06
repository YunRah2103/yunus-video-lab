#!/usr/bin/env python3
import json
import re
import subprocess
import sys
from pathlib import Path

TOTAL=751
W=1080
H=1920
FPS='30/1'
PATTERN=re.compile(r'^chunk-(\d{4})-(\d{4})\.mp4$')

root=Path(sys.argv[1] if len(sys.argv)>1 else 'chunks')
files=sorted(root.glob('chunk-*.mp4'))
if not files:
    raise SystemExit('no native chunks found')

ranges=[]
manifest=[]
cursor=0
for path in files:
    m=PATTERN.match(path.name)
    if not m:
        raise SystemExit(f'invalid chunk filename: {path.name}')
    start,end=map(int,m.groups())
    if start != cursor:
        raise SystemExit(f'coverage gap/overlap: expected {cursor}, got {start} in {path.name}')
    if end < start or end >= TOTAL:
        raise SystemExit(f'invalid range {start}-{end}')
    expected=end-start+1
    raw=subprocess.check_output([
        'ffprobe','-v','error','-count_frames','-select_streams','v:0',
        '-show_entries','stream=width,height,r_frame_rate,avg_frame_rate,nb_read_frames',
        '-of','json',str(path)
    ], text=True)
    probe=json.loads(raw)['streams'][0]
    if (int(probe['width']),int(probe['height'])) != (W,H):
        raise SystemExit(f'wrong dimensions in {path.name}: {probe}')
    if probe['r_frame_rate'] != FPS or probe['avg_frame_rate'] != FPS:
        raise SystemExit(f'wrong fps in {path.name}: {probe}')
    actual=int(probe['nb_read_frames'])
    if actual != expected:
        raise SystemExit(f'wrong frame count in {path.name}: expected {expected}, got {actual}')
    manifest.append({'file':path.name,'start':start,'end':end,'frames':actual})
    ranges.append((start,end))
    cursor=end+1

if cursor != TOTAL:
    raise SystemExit(f'coverage ends at {cursor-1}, expected {TOTAL-1}')

print(json.dumps({
    'chunks':len(files),
    'coverage':'0-750 inclusive exactly once',
    'total_frames':sum(x['frames'] for x in manifest),
    'fps':30,
    'dimensions':[W,H],
    'parts':manifest,
},indent=2))
