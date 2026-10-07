#!/usr/bin/env python3
"""Independent YUNEX 003 POLISH-02 final delivery verifier.

This tool intentionally does not edit production source. It verifies the delivered
native movie, extracts deterministic milestone frames for human inspection, and
optionally verifies the locked Porsche GLB hash.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from fractions import Fraction
from pathlib import Path

EXPECTED_MODEL_SHA256 = "1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb"
EXPECTED_WIDTH = 1080
EXPECTED_HEIGHT = 1920
EXPECTED_FPS = 30
EXPECTED_FRAMES = 735
EXPECTED_DURATION = EXPECTED_FRAMES / EXPECTED_FPS
MILESTONES = {
    "hook": 27,
    "turn-in": 144,
    "reveal": 234,
    "profile": 306,
    "braking-load": 492,
    "whole-car": 603,
    "exit": 711,
}


class QaFailure(RuntimeError):
    pass


def run(cmd: list[str], *, capture: bool = False) -> str:
    result = subprocess.run(
        cmd,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )
    return result.stdout if capture else ""


def probe(media: Path) -> dict:
    raw = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-count_frames",
            "-show_entries",
            (
                "stream=index,codec_type,codec_name,pix_fmt,width,height,"
                "r_frame_rate,avg_frame_rate,nb_read_frames,sample_rate,channels"
            ),
            "-show_entries",
            "format=duration,format_name",
            "-of",
            "json",
            str(media),
        ],
        capture=True,
    )
    return json.loads(raw)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def faststart_verified(path: Path) -> bool:
    # A fast-start MP4 places the moov atom before the first media-data atom.
    # This lightweight byte-order check is deterministic and sufficient for
    # delivery QA; ffmpeg/ffprobe perform structural validation separately.
    data = path.read_bytes()
    moov = data.find(b"moov")
    mdat = data.find(b"mdat")
    return moov != -1 and mdat != -1 and moov < mdat


def extract_milestones(media: Path, output_dir: Path) -> list[dict]:
    output_dir.mkdir(parents=True, exist_ok=True)
    records = []
    for name, frame in MILESTONES.items():
        out = output_dir / f"{name}-frame-{frame}.png"
        # select uses decoded frame number, keeping the review tied to the
        # deterministic 735-frame timeline rather than approximate seek time.
        run(
            [
                "ffmpeg",
                "-v",
                "error",
                "-y",
                "-i",
                str(media),
                "-vf",
                f"select=eq(n\\,{frame})",
                "-vsync",
                "0",
                "-frames:v",
                "1",
                str(out),
            ]
        )
        if not out.is_file() or out.stat().st_size == 0:
            raise QaFailure(f"failed to extract milestone {name} at frame {frame}")
        records.append(
            {
                "milestone": name,
                "frame": frame,
                "time_seconds": frame / EXPECTED_FPS,
                "path": str(out),
            }
        )
    return records


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("media", type=Path, help="Final native YUNEX 003 POLISH-02 MP4")
    parser.add_argument("--source-sha", required=True, help="Manager-pinned 40-char render source SHA")
    parser.add_argument("--model", type=Path, help="Approved Porsche GLB to hash-check")
    parser.add_argument(
        "--milestones-dir",
        type=Path,
        default=Path("yunex/video003/qa/polish02/final/milestones"),
    )
    parser.add_argument("--json-out", type=Path)
    args = parser.parse_args()

    failures: list[str] = []
    blockers: list[str] = []

    if not args.media.is_file() or args.media.stat().st_size == 0:
        raise QaFailure(f"missing/empty final movie: {args.media}")

    if len(args.source_sha) != 40 or any(c not in "0123456789abcdefABCDEF" for c in args.source_sha):
        blockers.append("render source SHA is missing or is not a full 40-character Git SHA")

    # Full decoder pass. Any corrupt packet/timestamp surfaces as a hard failure.
    try:
        run(["ffmpeg", "-v", "error", "-xerror", "-i", str(args.media), "-f", "null", "-"])
        full_decode = True
    except subprocess.CalledProcessError:
        full_decode = False
        failures.append("full ffmpeg decoder pass failed")

    data = probe(args.media)
    videos = [s for s in data.get("streams", []) if s.get("codec_type") == "video"]
    audios = [s for s in data.get("streams", []) if s.get("codec_type") == "audio"]

    if len(videos) != 1:
        failures.append(f"expected exactly one video stream, found {len(videos)}")
        video = {}
    else:
        video = videos[0]

    if len(audios) != 1:
        failures.append(f"expected exactly one audio stream, found {len(audios)}")
        audio = {}
    else:
        audio = audios[0]

    width = int(video.get("width") or 0)
    height = int(video.get("height") or 0)
    rate = Fraction(video.get("avg_frame_rate") or video.get("r_frame_rate") or "0/1")
    decoded_frames = int(video.get("nb_read_frames") or 0)
    duration = float(data.get("format", {}).get("duration") or 0.0)

    checks = {
        "width": width,
        "height": height,
        "fps": float(rate),
        "decoded_frames": decoded_frames,
        "container_duration_seconds": duration,
        "video_codec": video.get("codec_name"),
        "pixel_format": video.get("pix_fmt"),
        "audio_codec": audio.get("codec_name"),
        "faststart": faststart_verified(args.media),
        "full_decode": full_decode,
    }

    if width != EXPECTED_WIDTH or height != EXPECTED_HEIGHT:
        failures.append(f"dimensions {width}x{height}; expected {EXPECTED_WIDTH}x{EXPECTED_HEIGHT}")
    if rate != Fraction(EXPECTED_FPS, 1):
        failures.append(f"frame rate {rate}; expected {EXPECTED_FPS}")
    if decoded_frames != EXPECTED_FRAMES:
        failures.append(f"decoded frames {decoded_frames}; expected {EXPECTED_FRAMES}")
    if abs(duration - EXPECTED_DURATION) > 0.12:
        failures.append(f"container duration {duration:.6f}s; expected about {EXPECTED_DURATION:.6f}s")
    if str(video.get("codec_name")).lower() != "h264":
        failures.append(f"video codec {video.get('codec_name')}; expected h264")
    if str(video.get("pix_fmt")).lower() != "yuv420p":
        failures.append(f"pixel format {video.get('pix_fmt')}; expected yuv420p")
    if str(audio.get("codec_name")).lower() != "aac":
        failures.append(f"audio codec {audio.get('codec_name')}; expected aac")
    if not checks["faststart"]:
        failures.append("MP4 faststart not verified (moov atom is not before mdat)")

    model_result = None
    if args.model is not None:
        if not args.model.is_file():
            failures.append(f"model path does not exist: {args.model}")
        else:
            digest = sha256(args.model)
            model_result = {"path": str(args.model), "sha256": digest}
            if digest != EXPECTED_MODEL_SHA256:
                failures.append(
                    f"approved Porsche GLB hash changed: {digest}; expected {EXPECTED_MODEL_SHA256}"
                )
    else:
        blockers.append("approved Porsche GLB hash was not independently checked; pass --model")

    milestones = extract_milestones(args.media, args.milestones_dir)

    # Visual judgement remains deliberately human. The generated review sheet
    # names every mandatory observation and prevents technical checks from
    # being mistaken for a visual PASS.
    visual_checks = {
        "porsche_drives_naturally": None,
        "wheel_wobble_gone": None,
        "wheel_spin_and_steer_plausible": None,
        "no_wheel_clipping_or_contact_regression": None,
        "suspension_richer_and_connected": None,
        "double_wishbone_and_aero_concept_readable": None,
        "circuit_identity_persists": None,
        "track_parallax_believable": None,
        "no_scenery_occlusion_or_repetition_regression": None,
        "approved_exterior_and_livery_unchanged": None,
        "airflow_clears_revised_geometry": None,
        "typography_camera_story_vo_intact": None,
        "active_exit_present": None,
        "no_visible_chunk_seams": None,
    }

    status = "FAIL" if failures else "BLOCKED"
    result = {
        "phase": "Y003-POLISH-02",
        "role": "H",
        "status": status,
        "render_source_sha": args.source_sha,
        "movie": str(args.media),
        "technical_checks": checks,
        "model_check": model_result,
        "milestones": milestones,
        "visual_checks": visual_checks,
        "failures": failures,
        "blockers": blockers
        + [
            "human visual review is required before PASS; set every visual check from observed native movie/milestones"
        ],
        "expected": {
            "width": EXPECTED_WIDTH,
            "height": EXPECTED_HEIGHT,
            "fps": EXPECTED_FPS,
            "frames": EXPECTED_FRAMES,
            "duration_seconds": EXPECTED_DURATION,
            "video_codec": "h264",
            "pixel_format": "yuv420p",
            "audio_codec": "aac",
            "model_sha256": EXPECTED_MODEL_SHA256,
        },
    }

    output = json.dumps(result, indent=2)
    print(output)
    if args.json_out:
        args.json_out.parent.mkdir(parents=True, exist_ok=True)
        args.json_out.write_text(output + "\n", encoding="utf-8")

    # This executable can prove FAIL, but never auto-PASS the final creative
    # review. H must watch the actual native movie and complete the review sheet.
    return 1 if failures else 3


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (QaFailure, subprocess.CalledProcessError, json.JSONDecodeError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
