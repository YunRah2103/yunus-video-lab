#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: validate_final.py <ffprobe.json>")

data = json.loads(Path(sys.argv[1]).read_text())
streams = data.get("streams", [])
videos = [s for s in streams if s.get("codec_type") == "video"]
audios = [s for s in streams if s.get("codec_type") == "audio"]
if len(videos) != 1:
    raise SystemExit(f"expected exactly one video stream, got {len(videos)}")
if len(audios) != 1:
    raise SystemExit(f"expected exactly one audio stream, got {len(audios)}")

v = videos[0]
a = audios[0]
fmt = data.get("format", {})

assert int(v["width"]) == 1080, v
assert int(v["height"]) == 1920, v
assert v.get("r_frame_rate") == "30/1", v
assert v.get("avg_frame_rate") == "30/1", v
assert v.get("codec_name") == "h264", v
assert v.get("pix_fmt") in {"yuv420p", "yuvj420p"}, v
assert int(v.get("nb_read_frames") or 0) == 751, v

assert a.get("codec_name") == "aac", a
assert int(a.get("sample_rate") or 0) > 0, a
assert int(a.get("channels") or 0) >= 1, a

duration = float(fmt.get("duration") or 0)
assert 25.02 <= duration <= 25.10, duration

start_time = float(fmt.get("start_time") or 0)
assert abs(start_time) <= 0.10, start_time

result = {
    "phase": "Y002-RACETRACK-IDENTITY-02",
    "mode": "final-delivery",
    "native_source": [1080, 1920],
    "scale": 1,
    "fps": 30,
    "frames": 751,
    "duration_seconds": duration,
    "video_codec": v.get("codec_name"),
    "pixel_format": v.get("pix_fmt"),
    "audio_codec": a.get("codec_name"),
    "audio_sample_rate": int(a.get("sample_rate")),
    "audio_channels": int(a.get("channels")),
    "faststart_expected": True,
}
print(json.dumps(result, indent=2, sort_keys=True))
