#!/usr/bin/env python3
import json
import re
import subprocess
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: validate_audio.py <final.mp4>")
src = Path(sys.argv[1])
if not src.is_file():
    raise SystemExit(f"missing final video: {src}")

vol = subprocess.run([
    "ffmpeg", "-hide_banner", "-nostats", "-i", str(src),
    "-map", "0:a:0", "-af", "volumedetect", "-f", "null", "-"
], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
if vol.returncode:
    raise SystemExit(vol.stderr)
m = re.findall(r"max_volume:\s*(-?inf|[-+0-9.]+)\s*dB", vol.stderr)
if not m:
    raise SystemExit("could not parse max_volume")
max_volume = float("-inf") if m[-1] == "-inf" else float(m[-1])
if max_volume > 0.0:
    raise SystemExit(f"audio clips above 0 dBFS: {max_volume} dB")

ebu = subprocess.run([
    "ffmpeg", "-hide_banner", "-nostats", "-i", str(src),
    "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"
], text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
if ebu.returncode:
    raise SystemExit(ebu.stderr)

integrated = re.findall(r"\bI:\s*(-?inf|[-+0-9.]+)\s*LUFS", ebu.stderr)
true_peak = re.findall(r"\bPeak:\s*(-?inf|[-+0-9.]+)\s*dBFS", ebu.stderr)
i_lufs = None if not integrated or integrated[-1] == "-inf" else float(integrated[-1])
tp_dbfs = None if not true_peak or true_peak[-1] == "-inf" else float(true_peak[-1])
if i_lufs is None:
    raise SystemExit("could not parse integrated loudness")
if not (-18.0 <= i_lufs <= -13.0):
    raise SystemExit(f"integrated loudness outside approved-mix guardrail: {i_lufs} LUFS")
if tp_dbfs is not None and tp_dbfs > 0.0:
    raise SystemExit(f"true peak above 0 dBFS: {tp_dbfs} dBFS")

result = {
    "phase": "Y002-RACETRACK-IDENTITY-02",
    "max_volume_db": max_volume,
    "integrated_lufs": i_lufs,
    "true_peak_dbfs": tp_dbfs,
    "clipping_detected": False,
}
print(json.dumps(result, indent=2, sort_keys=True))
