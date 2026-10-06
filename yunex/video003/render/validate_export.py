#!/usr/bin/env python3
"""Decode/probe validator for the final YUNEX 003 native export."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from fractions import Fraction
from pathlib import Path


def run_json(cmd: list[str]) -> dict:
    return json.loads(subprocess.check_output(cmd, text=True))


def fail(message: str) -> None:
    raise ValueError(message)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("media", type=Path)
    parser.add_argument("--total-frames", type=int, required=True)
    parser.add_argument("--width", type=int, default=1080)
    parser.add_argument("--height", type=int, default=1920)
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--require-audio", action="store_true")
    args = parser.parse_args()

    if not args.media.is_file() or args.media.stat().st_size == 0:
        fail(f"missing/empty media: {args.media}")

    # Full decoder pass: corrupted timestamps/packets must fail validation.
    subprocess.run(
        ["ffmpeg", "-v", "error", "-xerror", "-i", str(args.media), "-f", "null", "-"],
        check=True,
    )

    data = run_json([
        "ffprobe", "-v", "error", "-count_frames",
        "-show_entries",
        "stream=index,codec_type,codec_name,pix_fmt,width,height,r_frame_rate,avg_frame_rate,nb_read_frames,sample_rate,channels",
        "-show_entries", "format=duration",
        "-of", "json", str(args.media),
    ])
    videos = [s for s in data.get("streams", []) if s.get("codec_type") == "video"]
    audios = [s for s in data.get("streams", []) if s.get("codec_type") == "audio"]
    if len(videos) != 1:
        fail(f"expected one video stream, found {len(videos)}")
    video = videos[0]
    if video.get("codec_name") != "h264":
        fail(f"video codec is {video.get('codec_name')}, expected h264")
    if video.get("pix_fmt") != "yuv420p":
        fail(f"pixel format is {video.get('pix_fmt')}, expected yuv420p")
    if int(video.get("width", 0)) != args.width or int(video.get("height", 0)) != args.height:
        fail(f"dimensions are {video.get('width')}x{video.get('height')}, expected {args.width}x{args.height}")
    rate = Fraction(video.get("avg_frame_rate") or video.get("r_frame_rate") or "0/1")
    if rate != Fraction(args.fps, 1):
        fail(f"frame rate is {rate}, expected {args.fps}")
    decoded = int(video.get("nb_read_frames") or 0)
    if decoded != args.total_frames:
        fail(f"decoded frame count is {decoded}, expected {args.total_frames}")
    if args.require_audio:
        if len(audios) != 1:
            fail(f"expected exactly one audio stream, found {len(audios)}")
        if audios[0].get("codec_name") != "aac":
            fail(f"audio codec is {audios[0].get('codec_name')}, expected aac")

    expected_duration = args.total_frames / args.fps
    format_duration = float(data.get("format", {}).get("duration") or 0.0)
    # Container/AAC priming can move format duration by a few hundredths; the
    # authoritative visual duration is decoded frames / exact fps.
    if abs(format_duration - expected_duration) > 0.12:
        fail(f"container duration {format_duration:.6f}s differs from expected {expected_duration:.6f}s")

    result = {
        "status": "PASS",
        "path": str(args.media),
        "width": args.width,
        "height": args.height,
        "fps": args.fps,
        "frames": decoded,
        "expected_duration_seconds": expected_duration,
        "container_duration_seconds": format_duration,
        "video_codec": video.get("codec_name"),
        "pixel_format": video.get("pix_fmt"),
        "audio": audios[0] if audios else None,
    }
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
