#!/usr/bin/env python3
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

TOTAL = 751
W = 1080
H = 1920
FPS = "30/1"
PIX = {"yuv420p", "yuvj420p"}
PATTERN = re.compile(r"^chunk-(\d{4})-(\d{4})\.mp4$")

root = Path(sys.argv[1] if len(sys.argv) > 1 else "chunks")
files = sorted(root.glob("chunk-*.mp4"))
if not files:
    raise SystemExit("no native chunks found")

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()

manifest = []
cursor = 0
for path in files:
    m = PATTERN.match(path.name)
    if not m:
        raise SystemExit(f"invalid chunk filename: {path.name}")
    start, end = map(int, m.groups())
    if start != cursor:
        raise SystemExit(f"coverage gap/overlap: expected {cursor}, got {start} in {path.name}")
    if end < start or end >= TOTAL:
        raise SystemExit(f"invalid range {start}-{end}")
    expected = end - start + 1
    raw = subprocess.check_output([
        "ffprobe", "-v", "error", "-count_frames",
        "-show_streams", "-show_format", "-of", "json", str(path)
    ], text=True)
    probe = json.loads(raw)
    videos = [s for s in probe.get("streams", []) if s.get("codec_type") == "video"]
    audios = [s for s in probe.get("streams", []) if s.get("codec_type") == "audio"]
    if len(videos) != 1:
        raise SystemExit(f"expected one video stream in {path.name}, got {len(videos)}")
    if audios:
        raise SystemExit(f"fresh visual chunk unexpectedly contains audio: {path.name}")
    v = videos[0]
    if (int(v["width"]), int(v["height"])) != (W, H):
        raise SystemExit(f"wrong dimensions in {path.name}: {v}")
    if v.get("r_frame_rate") != FPS or v.get("avg_frame_rate") != FPS:
        raise SystemExit(f"wrong fps in {path.name}: {v}")
    if v.get("codec_name") != "h264" or v.get("pix_fmt") not in PIX:
        raise SystemExit(f"wrong codec/pixel format in {path.name}: {v}")
    actual = int(v.get("nb_read_frames") or 0)
    if actual != expected:
        raise SystemExit(f"wrong frame count in {path.name}: expected {expected}, got {actual}")
    manifest.append({
        "file": path.name,
        "start": start,
        "end": end,
        "frames": actual,
        "sha256": sha256(path),
    })
    cursor = end + 1

if cursor != TOTAL:
    raise SystemExit(f"coverage ends at {cursor - 1}, expected {TOTAL - 1}")

result = {
    "phase": "Y002-RACETRACK-IDENTITY-02",
    "native": True,
    "source_dimensions": [W, H],
    "scale": 1,
    "fps": 30,
    "coverage": "0-750 inclusive exactly once",
    "total_frames": sum(x["frames"] for x in manifest),
    "chunks": len(manifest),
    "parts": manifest,
}
print(json.dumps(result, indent=2, sort_keys=True))
