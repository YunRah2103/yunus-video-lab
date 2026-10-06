#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
required = {
    "index": root / "yunex/src/index.tsx",
    "integrated": root / "yunex/src/video002/Video002Integrated.tsx",
    "timeline": root / "yunex/src/video002/timeline.ts",
    "audio": root / "yunex/src/video002/audio.ts",
    "package": root / "yunex/package.json",
}
missing = [str(p) for p in required.values() if not p.is_file()]
if missing:
    raise SystemExit("missing required files: " + ", ".join(missing))

text = {k: p.read_text(errors="replace") for k, p in required.items()}

checks = {
    "proof_composition_registered": 'id="YUNEX-002-INTEGRATED-PROOF"' in text["index"],
    "final_composition_registered": 'id="YUNEX-002-FINAL"' in text["index"],
    "proof_is_visual_only": "includeAudio={false}" in text["integrated"],
    "final_includes_audio": "<EditAudioComposition Scene={Video002IntegratedScene} includeAudio/>" in text["integrated"],
    "approved_mix_path_present": "video002/d_mix.wav" in text["audio"],
    "approved_mix_hash_present": "217e5efe0619d922a215c7572c4cc205731b79e57b65267bfdf39daf6280a8b9" in text["audio"],
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("preflight source contract failed: " + ", ".join(failed))

fps_m = re.search(r"VIDEO002_FPS\s*=\s*(\d+)", text["timeline"])
secs_m = re.search(r"VIDEO002_DURATION_SECONDS\s*=\s*([0-9.]+)", text["timeline"])
if not fps_m or not secs_m:
    raise SystemExit("could not parse VIDEO002 timeline constants")
fps = int(fps_m.group(1))
seconds = float(secs_m.group(1))
frames = round(fps * seconds)
if fps != 30 or frames != 751:
    raise SystemExit(f"unexpected timeline: fps={fps}, rounded_frames={frames}")

package = json.loads(text["package"])
deps = package.get("dependencies", {})
for dep in ("remotion", "@remotion/cli", "@remotion/three", "three"):
    if dep not in deps:
        raise SystemExit(f"missing runtime dependency: {dep}")

result = {
    "phase": "Y002-RACETRACK-IDENTITY-02",
    "role": "F_RENDER",
    "fps": fps,
    "duration_seconds_source": seconds,
    "duration_frames": frames,
    "proof_composition": "YUNEX-002-INTEGRATED-PROOF",
    "final_composition": "YUNEX-002-FINAL",
    "approved_mix": "yunex/public/video002/d_mix.wav",
    "approved_mix_sha256": "217e5efe0619d922a215c7572c4cc205731b79e57b65267bfdf39daf6280a8b9",
    "checks": checks,
}
print(json.dumps(result, indent=2, sort_keys=True))
