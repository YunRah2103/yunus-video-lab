#!/usr/bin/env python3
"""Validate native YUNEX 003 chunk coverage, provenance and stream properties."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from fractions import Fraction
from pathlib import Path

CHUNK_RE = re.compile(r"^chunk-(\d+)-(\d+)\.mp4$")


def ffprobe(path: Path) -> dict:
    cmd = [
        "ffprobe", "-v", "error", "-count_frames",
        "-show_entries",
        "stream=index,codec_type,codec_name,pix_fmt,width,height,r_frame_rate,avg_frame_rate,nb_read_frames",
        "-of", "json", str(path),
    ]
    return json.loads(subprocess.check_output(cmd, text=True))


def parse_rate(value: str) -> Fraction:
    return Fraction(value)


def fail(message: str) -> None:
    raise ValueError(message)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("chunks_dir", type=Path)
    parser.add_argument("--total-frames", type=int, required=True)
    parser.add_argument("--expected-source", required=True)
    parser.add_argument("--width", type=int, default=1080)
    parser.add_argument("--height", type=int, default=1920)
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument(
        "--allowed-pixel-formats",
        default="yuv420p,yuvj420p",
        help=(
            "Comma-separated intermediate chunk formats. The proven Y003 native "
            "renderer can emit yuvj420p chunks even when yuv420p is requested; "
            "the delivery workflow normalizes once after concatenation."
        ),
    )
    args = parser.parse_args()

    if args.total_frames < 1:
        fail("total_frames must be >= 1")
    if not re.fullmatch(r"[0-9a-fA-F]{40}", args.expected_source):
        fail("expected-source must be an exact 40-character commit SHA")

    allowed_pixel_formats = {
        value.strip() for value in args.allowed_pixel_formats.split(",") if value.strip()
    }
    if not allowed_pixel_formats:
        fail("allowed-pixel-formats must contain at least one format")

    files = sorted(args.chunks_dir.glob("chunk-*.mp4"))
    if not files:
        fail(f"no chunks found in {args.chunks_dir}")

    ranges = []
    records = []
    observed_pixel_formats = set()
    for path in files:
        match = CHUNK_RE.match(path.name)
        if not match:
            fail(f"invalid chunk filename: {path.name}")
        start, end = map(int, match.groups())
        if end < start:
            fail(f"invalid range in {path.name}")
        expected_count = end - start + 1

        source_file = args.chunks_dir / f"source-sha-{start:04d}-{end:04d}.txt"
        if not source_file.exists():
            fail(f"missing provenance file for {path.name}")
        source_sha = source_file.read_text(encoding="utf-8").strip()
        if source_sha != args.expected_source:
            fail(f"source mismatch for {path.name}: {source_sha} != {args.expected_source}")

        data = ffprobe(path)
        videos = [s for s in data.get("streams", []) if s.get("codec_type") == "video"]
        if len(videos) != 1:
            fail(f"{path.name}: expected exactly one video stream")
        stream = videos[0]
        if stream.get("codec_name") != "h264":
            fail(f"{path.name}: codec {stream.get('codec_name')} is not h264")
        pixel_format = stream.get("pix_fmt")
        if pixel_format not in allowed_pixel_formats:
            fail(
                f"{path.name}: pix_fmt {pixel_format} not in "
                f"{sorted(allowed_pixel_formats)}"
            )
        observed_pixel_formats.add(pixel_format)
        if int(stream.get("width", 0)) != args.width or int(stream.get("height", 0)) != args.height:
            fail(f"{path.name}: dimensions are not {args.width}x{args.height}")
        rate = parse_rate(stream.get("avg_frame_rate") or stream.get("r_frame_rate") or "0/1")
        if rate != Fraction(args.fps, 1):
            fail(f"{path.name}: frame rate {rate} != {args.fps}")
        actual_count = int(stream.get("nb_read_frames") or 0)
        if actual_count != expected_count:
            fail(f"{path.name}: decoded {actual_count} frames, expected {expected_count}")

        ranges.append((start, end))
        records.append({
            "file": path.name,
            "start": start,
            "end": end,
            "frames": actual_count,
            "source_sha": source_sha,
            "pixel_format": pixel_format,
        })

    ranges.sort()
    expected_start = 0
    for start, end in ranges:
        if start != expected_start:
            fail(f"coverage gap/overlap: expected start {expected_start}, got {start}")
        expected_start = end + 1
    if expected_start != args.total_frames:
        fail(f"coverage ends at frame {expected_start - 1}, expected {args.total_frames - 1}")

    result = {
        "status": "PASS",
        "expected_source_sha": args.expected_source,
        "total_frames": args.total_frames,
        "frame_range": f"0-{args.total_frames - 1}",
        "chunk_count": len(records),
        "allowed_pixel_formats": sorted(allowed_pixel_formats),
        "observed_pixel_formats": sorted(observed_pixel_formats),
        "requires_delivery_normalization": observed_pixel_formats != {"yuv420p"},
        "chunks": records,
    }
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
