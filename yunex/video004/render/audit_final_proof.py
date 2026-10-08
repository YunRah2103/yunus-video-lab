#!/usr/bin/env python3
"""Independent Agent E validation of actual Y004 H native proof artifacts.

Consumes artifact directories created by actions/download-artifact. Never renders
or edits the approved 004 film. Partial coverage is explicitly PENDING, not PASS.
"""
from __future__ import annotations
import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

SOURCE = "1e2ab54e77090ec9c95c119488bc87d7ab7a45ba"
FPS, WIDTH, HEIGHT, TOTAL = 30, 1080, 1920, 720
OLD_RUN, GAP_RUN = 37769701749, 37781451513
# These intervals must cover precisely 0..719, no gaps or overlapping frames.
SEGMENTS = [
    ("opening-0-59",0,59,OLD_RUN),
    ("opening-tail-60-83",60,83,OLD_RUN),
    ("rear-wheel-macro-84-149",84,149,GAP_RUN),
    ("low-full-150-246",150,246,OLD_RUN),
    ("low-247-306",247,306,OLD_RUN),
    ("low-gap-307-311",307,311,OLD_RUN),
    ("match-312-371",312,371,OLD_RUN),
    ("high-372-431",372,431,OLD_RUN),
    ("roadside-432-551",432,551,OLD_RUN),
    ("roadside-gap-552-566",552,566,OLD_RUN),
    ("exit-567-596",567,596,OLD_RUN),
    ("active-exit-597-686",597,686,GAP_RUN),
    ("ending-687-719",687,719,OLD_RUN),
]


def demand(ok: bool, reason: str) -> None:
    if not ok:
        raise ValueError(reason)


def intervals_valid(segments=SEGMENTS) -> int:
    next_frame = 0
    for label, a, b, _ in segments:
        demand(a == next_frame, f"gap or overlap before {label}: expected {next_frame}, got {a}")
        demand(b >= a, f"invalid range for {label}")
        next_frame = b + 1
    demand(next_frame == TOTAL, f"incomplete coverage: end {next_frame}, expected {TOTAL}")
    return next_frame


def filehash(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def ffprobe(path: Path) -> dict:
    cmd = [
        "ffprobe", "-v", "error", "-count_frames",
        "-show_entries",
        "stream=codec_type,codec_name,pix_fmt,color_range,width,height,r_frame_rate,avg_frame_rate,nb_read_frames",
        "-show_entries", "format=duration", "-of", "json", str(path)
    ]
    return json.loads(subprocess.check_output(cmd, text=True))


def frames_pts(path: Path, count: int) -> None:
    cmd = [
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_frames", "-show_entries", "frame=best_effort_timestamp_time",
        "-of", "json", str(path)
    ]
    data = json.loads(subprocess.check_output(cmd, text=True))
    pts = [Fraction(frame["best_effort_timestamp_time"]) for frame in data.get("frames", [])]
    demand(len(pts) == count, f"{path}: PTS count mismatch")
    # Source excerpts are rendered with zero-based clip timestamps.
    start = pts[0]
    demand(abs(start) <= Fraction(1,1000), f"{path}: nonzero first PTS {start}")
    for i, p in enumerate(pts):
        demand(abs(p - Fraction(i,FPS)) <= Fraction(1,1000),
               f"{path}: missing/repeated/timing-displaced PTS at clip frame {i}: {p}")


def validate_one(label: str, first: int, last: int, run: int, folder: Path) -> dict:
    sources = list(folder.rglob("source-sha.txt"))
    demand(len(sources) == 1, f"{label}: expected exactly one source-sha.txt, got {len(sources)}")
    root = sources[0].parent
    source = sources[0].read_text(encoding="utf8").strip()
    demand(source == SOURCE, f"{label}: source does not match immutable corrected film SHA")
    frame_info = root / "frames-inclusive.txt"
    demand(frame_info.is_file() and frame_info.read_text().strip() == f"{first}-{last}",
           f"{label}: wrong frame provenance")
    media = root / f"{label}.mp4"
    demand(media.is_file() and media.stat().st_size > 0, f"{label}: actual native MP4 missing")
    sumfile = root / "SHA256SUMS"
    demand(sumfile.is_file(), f"{label}: SHA256SUMS missing")
    checksum_lines = sumfile.read_text().splitlines()
    demand(len(checksum_lines) == 1, f"{label}: ambiguous SHA256SUMS")
    line = checksum_lines[0].split(maxsplit=1)
    demand(len(line) == 2 and line[1].lstrip("*") == media.name, f"{label}: SHA256 references wrong file")
    digest = filehash(media)
    demand(line[0] == digest, f"{label}: native MP4 SHA256 mismatch")
    info = ffprobe(media)
    streams = info.get("streams",[])
    vids = [s for s in streams if s.get("codec_type") == "video"]
    demand(len(streams) == 1 and len(vids) == 1, f"{label}: native proof not exactly one silent video stream")
    v = vids[0]
    count = last - first + 1
    demand(v.get("codec_name") == "h264", f"{label}: codec not H.264")
    demand(v.get("pix_fmt") == "yuv420p" and v.get("color_range") == "tv",
           f"{label}: not limited-range yuv420p ({v.get('pix_fmt')}/{v.get('color_range')})")
    demand((v.get("width"),v.get("height")) == (WIDTH,HEIGHT), f"{label}: dimensions incorrect")
    demand(Fraction(v.get("r_frame_rate","0/1")) == FPS and
           Fraction(v.get("avg_frame_rate","0/1")) == FPS,
           f"{label}: not 30 fps")
    demand(int(v.get("nb_read_frames") or 0) == count, f"{label}: decoded frame count mismatch")
    demand(abs(float(info.get("format",{}).get("duration") or 0) - count/FPS) < 0.08,
           f"{label}: wrong native clip duration")
    subprocess.run(["ffmpeg","-hide_banner","-nostdin","-v","error","-xerror",
                    "-i",str(media),"-an","-f","null","-"],check=True)
    frames_pts(media, count)
    return {
        "label":label,"framesInclusive":f"{first}-{last}","decodedFrames":count,
        "first":first,"last":last,"sourceSha":source,"provenanceRun":run,
        "mediaSha256":digest,"bytes":media.stat().st_size,"fps":"30/1",
        "resolution":"1080x1920","codec":"h264","pix_fmt":"yuv420p",
        "color_range":"tv","fullDecoder":"PASS","pts":"PASS",
        "file":str(media)
    }


def audit(old: Path, gaps: Path | None, *, pending_allowed: bool=False) -> dict:
    intervals_valid()
    entries,missing=[],[]
    for label,a,b,run in SEGMENTS:
        directory = old/f"Y004-H-C-NATIVE-{label}" if run==OLD_RUN else (
            gaps/f"Y004-H-FINAL-GAP-{label}" if gaps is not None else None)
        if directory is None or not directory.is_dir():
            demand(pending_allowed and run==GAP_RUN,
                   f"{label}: expected artifact unavailable; cannot claim coverage")
            missing.append({"label":label,"framesInclusive":f"{a}-{b}","frames":b-a+1,"runId":run})
            continue
        entries.append(validate_one(label,a,b,run,directory))
    verified_frames=sum(x["decodedFrames"] for x in entries)
    demand(verified_frames+sum(x["frames"] for x in missing)==TOTAL, "coverage arithmetic inconsistent")
    return {"status":"PASS" if not missing else "PENDING_UNRENDERED_GAPS",
            "sourceSha":SOURCE,"expectedFrames":TOTAL,"verifiedFrames":verified_frames,
            "pendingFrames":TOTAL-verified_frames,"coverageNoOverlap":"PASS",
            "clipsVerified":len(entries),"clipsRequired":len(SEGMENTS),
            "priorRunId":OLD_RUN,"gapRunId":GAP_RUN,"clips":entries,"missing":missing,
            "independentFVisualApproval":"NOT_PERFORMED_BY_E",
            "agentGMasterRender":"NOT_PERFORMED_BY_E"}


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--existing",type=Path,required=True)
    parser.add_argument("--gaps",type=Path)
    parser.add_argument("--allow-pending",action="store_true")
    parser.add_argument("--output",type=Path,required=True)
    a=parser.parse_args()
    try:
        report=audit(a.existing,a.gaps,pending_allowed=a.allow_pending)
        a.output.parent.mkdir(parents=True,exist_ok=True)
        a.output.write_text(json.dumps(report,indent=2)+"\n")
        print(json.dumps({k:report[k] for k in ["status","sourceSha","verifiedFrames","pendingFrames","clipsVerified","clipsRequired"]}))
        if report["missing"]:
            print("MISSING: "+", ".join(x["framesInclusive"] for x in report["missing"]))
    except (ValueError,KeyError,json.JSONDecodeError,subprocess.CalledProcessError) as error:
        print(f"Y004 ACTUAL PROOF AUDIT FAILED: {error}",file=sys.stderr)
        raise SystemExit(2)


if __name__=="__main__":
    main()
