#!/usr/bin/env python3
import json
import sys
from pathlib import Path

W=1080
H=1920
FPS='30/1'
TOTAL_FRAMES=751

def load_probe(path):
    data=json.loads(Path(path).read_text())
    if not data.get('streams'):
        raise SystemExit('ffprobe has no video stream')
    stream=data['streams'][0]
    fmt=data.get('format',{})
    return stream,fmt

def common(stream):
    assert int(stream['width'])==W, stream
    assert int(stream['height'])==H, stream
    assert stream['r_frame_rate']==FPS, stream
    assert stream['avg_frame_rate']==FPS, stream
    assert stream.get('codec_name')=='h264', stream
    assert int(stream['nb_read_frames'])>0, stream

mode=sys.argv[1]
probe=sys.argv[2]
stream,fmt=load_probe(probe)
common(stream)

if mode=='benchmark':
    elapsed=int(Path(sys.argv[3]).read_text().strip())
    frames=int(stream['nb_read_frames'])
    assert frames==30, stream
    duration=float(fmt['duration'])
    assert 0.99 <= duration <= 1.01, duration
    peak_rss_kb=None
    if len(sys.argv) > 4:
        resource=Path(sys.argv[4]).read_text(errors='ignore')
        for line in resource.splitlines():
            if 'Maximum resident set size (kbytes)' in line:
                peak_rss_kb=int(line.rsplit(':',1)[1].strip())
                break
    result={
        'mode':'benchmark',
        'native_source':[W,H],
        'scale':1,
        'frames':frames,
        'fps':30,
        'duration_seconds':duration,
        'elapsed_seconds':elapsed,
        'render_seconds_per_frame':round(elapsed/frames,3),
        'realtime_factor':round(elapsed/max(duration,0.001),2),
        'peak_rss_kb':peak_rss_kb,
        'peak_rss_mib':round(peak_rss_kb/1024,1) if peak_rss_kb else None,
        'render_concurrency':2,
        'frame_range':'330-359',
    }
elif mode=='final-visual':
    frames=int(stream['nb_read_frames'])
    assert frames==TOTAL_FRAMES, stream
    duration=float(fmt['duration'])
    assert 25.02 <= duration <= 25.05, duration
    result={
        'mode':'final-visual',
        'native_source':[W,H],
        'scale':1,
        'frames':frames,
        'fps':30,
        'duration_seconds':duration,
        'frame_range':'0-750 inclusive exactly once',
        'audio_expected':False,
    }
else:
    raise SystemExit(f'unknown mode: {mode}')

print(json.dumps(result,indent=2,sort_keys=True))
