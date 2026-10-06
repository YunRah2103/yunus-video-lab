#!/usr/bin/env python3
"""Validate the evidence package used for Agent E's final human visual QA."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

EXPECTED_BEATS = [
    ("hook", 18),
    ("isolate", 114),
    ("high_downforce", 210),
    ("drs", 336),
    ("airbrake", 456),
    ("whole_car", 600),
    ("payoff", 705),
]


def ffprobe(path: Path) -> dict:
    raw = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-count_frames",
            "-show_entries",
            "stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,nb_read_frames",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            str(path),
        ],
        text=True,
    )
    return json.loads(raw)


def image_dimensions(path: Path) -> tuple[int, int]:
    raw = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "json",
            str(path),
        ],
        text=True,
    )
    stream = json.loads(raw)["streams"][0]
    return int(stream["width"]), int(stream["height"])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--moving-proof", type=Path)
    parser.add_argument("--expected-source-sha", required=True)
    parser.add_argument("--json-out", type=Path)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    failures: list[str] = []
    evidence: list[dict] = []

    if manifest.get("phase") != "Y002-RACETRACK-IDENTITY-02":
        failures.append("manifest phase mismatch")
    if manifest.get("source_sha") != args.expected_source_sha:
        failures.append(
            f"manifest source_sha={manifest.get('source_sha')} does not match pinned {args.expected_source_sha}"
        )

    by_beat = {item.get("beat"): item for item in manifest.get("frames", [])}
    for beat, frame in EXPECTED_BEATS:
        item = by_beat.get(beat)
        if not item:
            failures.append(f"missing beat entry: {beat}")
            continue
        if int(item.get("frame", -1)) != frame:
            failures.append(f"{beat}: expected frame {frame}, got {item.get('frame')}")
        path = (args.manifest.parent / item.get("file", "")).resolve()
        if not path.is_file():
            failures.append(f"{beat}: missing proof file {path}")
            continue
        width, height = image_dimensions(path)
        if (width, height) != (1080, 1920):
            failures.append(f"{beat}: native still must be 1080x1920, got {width}x{height}")
        evidence.append(
            {
                "beat": beat,
                "frame": frame,
                "file": str(path),
                "dimensions": [width, height],
            }
        )

    motion = None
    if args.moving_proof:
        if not args.moving_proof.is_file():
            failures.append(f"moving proof missing: {args.moving_proof}")
        else:
            probe = ffprobe(args.moving_proof)
            video = next((s for s in probe.get("streams", []) if s.get("codec_type") == "video"), None)
            if not video:
                failures.append("moving proof has no video stream")
            else:
                try:
                    subprocess.check_call(
                        ["ffmpeg", "-v", "error", "-xerror", "-i", str(args.moving_proof), "-f", "null", "-"],
                        stdout=subprocess.DEVNULL,
                    )
                except subprocess.CalledProcessError:
                    failures.append("moving proof failed full decode")
                motion = {
                    "file": str(args.moving_proof.resolve()),
                    "width": int(video.get("width", 0)),
                    "height": int(video.get("height", 0)),
                    "r_frame_rate": video.get("r_frame_rate"),
                    "avg_frame_rate": video.get("avg_frame_rate"),
                    "frames": int(video["nb_read_frames"]) if video.get("nb_read_frames") else None,
                    "duration_seconds": float(probe.get("format", {}).get("duration", 0)),
                    "label": manifest.get("moving_proof_label"),
                }
                if motion["r_frame_rate"] != "30/1":
                    failures.append(f"moving proof must preserve 30 fps, got {motion['r_frame_rate']}")
                if not motion["label"]:
                    failures.append(
                        "moving proof needs an explicit label (for example native or reduced-resolution)"
                    )

    result = {
        "phase": "Y002-RACETRACK-IDENTITY-02",
        "role": "E — Independent Track / Visual QA",
        "source_sha": args.expected_source_sha,
        "native_stills": evidence,
        "moving_proof": motion,
        "automated_evidence_status": "PASS" if not failures else "BLOCKED",
        "failures": failures,
        "manual_visual_review_required": [
            "course direction and distant bend continuity read without labels",
            "kerbs are selected apex/exit accents rather than continuous decoration",
            "runoff separates racing surface from barriers on both sides",
            "barriers follow the course and do not read as a random roadside rail",
            "no broad apron/backing-plane seam or grass intrusion is visible",
            "furniture and foliage do not occlude the Porsche or critical aero beats",
            "wheel contact and grounded shadow remain convincing in all seven beats",
            "Porsche, typography, camera chronology and audio/edit intent remain unchanged",
        ],
    }
    rendered = json.dumps(result, indent=2, sort_keys=True)
    print(rendered)
    if args.json_out:
        args.json_out.parent.mkdir(parents=True, exist_ok=True)
        args.json_out.write_text(rendered + "\n", encoding="utf-8")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
