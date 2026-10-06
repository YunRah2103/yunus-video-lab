#!/usr/bin/env python3
import json
import statistics
import subprocess
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: validate_delivery_motion.py <final-or-visual.mp4>")

src = Path(sys.argv[1])
if not src.is_file():
    raise SystemExit(f"missing video: {src}")

W, H = 54, 96
FRAME_BYTES = W * H
TOTAL = 751

raw = subprocess.check_output([
    "ffmpeg", "-v", "error", "-i", str(src),
    "-an", "-vf", f"scale={W}:{H}:flags=area,format=gray",
    "-f", "rawvideo", "-"
])

if len(raw) % FRAME_BYTES:
    raise SystemExit(f"decoded raw byte count is not frame-aligned: {len(raw)}")

frames = [raw[i:i+FRAME_BYTES] for i in range(0, len(raw), FRAME_BYTES)]
if len(frames) != TOTAL:
    raise SystemExit(f"expected {TOTAL} decoded frames, got {len(frames)}")

def mad(a, b):
    return sum(abs(x-y) for x, y in zip(a, b)) / FRAME_BYTES

deltas = [mad(frames[i-1], frames[i]) for i in range(1, len(frames))]
median = statistics.median(deltas)

exact_duplicate_pairs = [i for i, d in enumerate(deltas, start=1) if d == 0.0]
low_motion_pairs = [i for i, d in enumerate(deltas, start=1) if d < 0.05]

max_exact_run = 0
run = 0
for d in deltas:
    if d == 0.0:
        run += 1
        max_exact_run = max(max_exact_run, run)
    else:
        run = 0

seams = []
for boundary in range(30, 751, 30):
    d = deltas[boundary-1]
    lo = max(0, boundary-4)
    hi = min(len(deltas), boundary+3)
    local = [x for idx, x in enumerate(deltas[lo:hi], start=lo) if idx != boundary-1]
    local_median = statistics.median(local) if local else median
    ratio = d / max(local_median, 1e-9)
    seams.append({
        "boundary_frame": boundary,
        "delta": round(d, 5),
        "local_median": round(local_median, 5),
        "ratio": round(ratio, 3),
    })

top_changes = sorted(
    ({"frame": i, "delta": round(d, 5)} for i, d in enumerate(deltas, start=1)),
    key=lambda x: x["delta"],
    reverse=True,
)[:20]

result = {
    "decoded_frames": len(frames),
    "analysis_resolution": [W, H],
    "median_consecutive_frame_delta": round(median, 5),
    "minimum_consecutive_frame_delta": round(min(deltas), 5),
    "maximum_consecutive_frame_delta": round(max(deltas), 5),
    "exact_duplicate_pair_count": len(exact_duplicate_pairs),
    "exact_duplicate_pairs": exact_duplicate_pairs,
    "max_exact_duplicate_run_pairs": max_exact_run,
    "low_motion_pair_count_below_0_05": len(low_motion_pairs),
    "chunk_boundary_metrics": seams,
    "top_20_frame_changes": top_changes,
}
print(json.dumps(result, indent=2))
