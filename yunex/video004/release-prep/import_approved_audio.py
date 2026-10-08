#!/usr/bin/env python3
"""Import only Agent D's original byte-locked Cedar M4A into Agent I's owned path.

Does not call GitHub, stage/commit/push files, invoke Remotion or render video.
Example:
python3 yunex/video004/release-prep/import_approved_audio.py \
  --source /path/to/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a --repo-root .
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

SHA256 = "a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51"
SIZE = 753974
DESTINATION = "yunex/video004/audio/y004-approved-cedar-24s.m4a"


def digest(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for b in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(b)
    return h.hexdigest()


def check_audio(path):
    assert path.is_file() and path.stat().st_size == SIZE, "missing/wrong size approved original"
    assert digest(path) == SHA256, "AAC source SHA256 mismatch — refusing to replace"
    data = json.loads(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration,size:stream=codec_type,codec_name,sample_rate,channels",
         "-of", "json", str(path)], text=True))
    assert abs(float(data["format"]["duration"]) - 24.0) < .005, "not 24 seconds"
    assert len(data["streams"]) == 1 and data["streams"][0]["codec_name"] == "aac"
    assert data["streams"][0]["sample_rate"] == "48000"
    assert data["streams"][0]["channels"] == 2
    subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-v", "error", "-xerror",
                    "-err_detect", "explode", "-i", str(path), "-f", "null", "-"], check=True)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--source", type=Path, required=True)
    p.add_argument("--repo-root", type=Path, default=Path.cwd())
    args = p.parse_args()
    try:
        check_audio(args.source)
        destination = args.repo_root / DESTINATION
        destination.parent.mkdir(parents=True, exist_ok=True)
        if not destination.is_file() or destination.resolve() != args.source.resolve():
            if destination.exists():
                check_audio(destination)
            else:
                shutil.copyfile(args.source, destination)
        check_audio(destination)
    except (AssertionError, subprocess.CalledProcessError, OSError, KeyError, ValueError) as e:
        print(f"APPROVED AUDIO IMPORT BLOCKED: {e}", file=sys.stderr)
        return 2
    print(json.dumps({"status": "PASS", "destination": str(destination),
                      "sha256": SHA256, "bytes": SIZE, "duration_seconds": 24,
                      "sample_rate": 48000, "channels": 2, "full_decode": "PASS"}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
