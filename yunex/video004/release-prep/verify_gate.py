#!/usr/bin/env python3
"""Fail-closed YUNEX 004 Manager release gate; never renders anything.

Usage:
  verify_gate.py registry --registry path/to/TASKS.json
  verify_gate.py source --registry path/to/TASKS.json --source-root checkout
"""
import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

PHASE = "Y004-REAR-STEERING-01"
MODEL_SHA = "1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb"
AUDIO_SHA = "a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51"
AUDIO_PATHS = {
    "yunex/video004/audio/y004-approved-cedar-24s.m4a",
    "yunex/public/y004-final-mix.m4a",
}
FULL_SHA = re.compile(r"^[0-9a-f]{40}$")


class GateError(Exception):
    pass


def require(condition, message):
    if not condition:
        raise GateError(message)


def file_sha(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_registry(path):
    data = json.loads(Path(path).read_text())
    require(data.get("phase") == PHASE, "wrong film phase")
    sha = data.get("render_source_sha")
    require(isinstance(sha, str) and FULL_SHA.fullmatch(sha), "no immutable Manager source SHA")
    require(type(data.get("locked_frames")) is int and data["locked_frames"] == 720,
            "locked_frames must equal 720")
    require(data.get("pre_render_qa_status") == "PASS", "independent F pre-render QA not PASS")
    evidence = data.get("pre_render_qa_evidence")
    require(isinstance(evidence, dict), "QA evidence must be a structured object")
    require(evidence.get("source_sha") == sha, "F QA evidence does not pin exact source SHA")
    require(evidence.get("agent") == "F" and evidence.get("verdict") == "PASS",
            "evidence must be independent F PASS")
    require(bool(evidence.get("report")) and
            (bool(evidence.get("run_id")) or bool(evidence.get("artifact_id"))),
            "F evidence must identify report plus run or artifact")
    require(data.get("i_release_launch_authorized") is True,
            "Manager has not explicitly authorized branch release launch")
    audio_path = data.get("release_audio_path", "yunex/video004/audio/y004-approved-cedar-24s.m4a")
    require(audio_path in AUDIO_PATHS, "unauthorized audio path")
    return {"source_sha": sha, "locked_frames": 720, "audio_path": audio_path,
            "composition": "YUNEX-004", "qa_evidence": evidence}


def checked_output(*args):
    return subprocess.check_output(args, text=True).strip()


def verify_source(root, gate):
    root = Path(root)
    sha = checked_output("git", "-C", str(root), "rev-parse", "HEAD")
    require(sha == gate["source_sha"], "checked-out source is not approved immutable SHA")
    model = root / "cars/porsche-911-gt3-rs-992/model.glb"
    require(model.is_file() and file_sha(model) == MODEL_SHA, "Porsche model SHA mismatch")
    audio = root / gate["audio_path"]
    require(audio.is_file(), "approved Cedar AAC missing in pinned source")
    require(audio.stat().st_size == 753974 and file_sha(audio) == AUDIO_SHA,
            "approved Cedar AAC size/SHA mismatch")
    track = root / "yunex/src/index.tsx"
    require(track.is_file() and bool(re.search(r"""\bid\s*=\s*['"]YUNEX-004['"]""", track.read_text())),
            "YUNEX-004 final composition not registered")
    info = json.loads(checked_output("ffprobe", "-v", "error", "-show_entries",
                                    "format=duration:stream=codec_type,codec_name,sample_rate,channels",
                                    "-of", "json", str(audio)))
    streams = info.get("streams", [])
    require(len(streams) == 1 and streams[0].get("codec_name") == "aac" and
            streams[0].get("codec_type") == "audio" and
            streams[0].get("sample_rate") == "48000" and
            streams[0].get("channels") == 2, "Cedar AAC codec/rate/channels mismatch")
    require(abs(float(info["format"]["duration"]) - 24.0) < .005, "Cedar AAC not 24s")
    subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-v", "error", "-xerror",
                    "-err_detect", "explode", "-i", str(audio), "-f", "null", "-"], check=True)
    return {**gate, "audio_sha256": AUDIO_SHA, "audio_full_decode": "PASS",
            "model_sha256": MODEL_SHA, "source_checks": "PASS"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["registry", "source"])
    parser.add_argument("--registry", required=True)
    parser.add_argument("--source-root")
    args = parser.parse_args()
    try:
        gate = read_registry(args.registry)
        if args.mode == "source":
            require(bool(args.source_root), "--source-root required")
            gate = verify_source(args.source_root, gate)
        print(json.dumps({"status": "PASS", **gate}, sort_keys=True))
    except (GateError, ValueError, KeyError, OSError, subprocess.SubprocessError) as exc:
        print(f"RELEASE BLOCKED: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
