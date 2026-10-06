#!/usr/bin/env python3
"""Independent YUNEX 002 racetrack-identity preflight.

This checker intentionally owns no environment implementation. It verifies locked film/car
invariants, the shared racetrack contract, deterministic quality/seed APIs, and static
cross-section/occlusion safeguards. Native visual acceptance remains a separate human QA step.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import subprocess
from pathlib import Path
from typing import Any

PHASE = "Y002-RACETRACK-IDENTITY-02"
APPROVED_CAR_SHA256 = "1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb"
EXPECTED_FPS = 30
EXPECTED_FRAMES = 751
EXPECTED_DURATION_SECONDS = 25.02
EXPECTED_DEFAULT_SEED = 2103
EXPECTED_ROOT_POSITION = (-1.0, -0.028, 0.0)
EXPECTED_ROOT_YAW = math.pi
BEAT_FRAMES = {
    "hook": 18,
    "isolate": 114,
    "high_downforce": 210,
    "drs": 336,
    "airbrake": 456,
    "whole_car": 600,
    "payoff": 705,
}


def repo_root_from_script() -> Path:
    # .../yunex/src/video002/trackUpgrade/qa/trackIdentity/preflight.py -> repo root
    return Path(__file__).resolve().parents[6]


def read(root: Path, relative: str) -> str:
    path = root / relative
    if not path.is_file():
        raise FileNotFoundError(relative)
    return path.read_text(encoding="utf-8")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for block in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def git_head(root: Path) -> str | None:
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=root, text=True, stderr=subprocess.DEVNULL
        ).strip()
    except Exception:
        return None


def number(text: str, name: str) -> float:
    pattern = rf"\b{name}\s*:\s*(-?\d+(?:\.\d+)?)"
    match = re.search(pattern, text)
    if not match:
        raise AssertionError(f"missing numeric config field: {name}")
    return float(match.group(1))


def const_number(text: str, name: str) -> float:
    pattern = rf"\b{name}\s*=\s*(-?\d+(?:\.\d+)?)"
    match = re.search(pattern, text)
    if not match:
        raise AssertionError(f"missing numeric constant: {name}")
    return float(match.group(1))


def has_quality_seed_api(text: str) -> bool:
    return (
        "quality" in text
        and ("'preview'|'final'" in text.replace(" ", "") or "'preview' | 'final'" in text)
        and "seed?: number" in text
        and re.search(r"seed\s*=\s*2103", text) is not None
    )


def smoothstep(start: float, end: float, value: float) -> float:
    t = max(0.0, min(1.0, (value - start) / max(1e-9, end - start)))
    return t * t * (3.0 - 2.0 * t)


def smoothstep_derivative(start: float, end: float, value: float) -> float:
    if value <= start or value >= end:
        return 0.0
    span = end - start
    t = (value - start) / span
    return (6.0 * t * (1.0 - t)) / span


def contract_metrics(layout_text: str) -> dict[str, float]:
    bend_start = number(layout_text, "bendStartZ")
    bend_end = number(layout_text, "bendEndZ")
    bend_offset = number(layout_text, "bendOffsetX")
    min_z = number(layout_text, "sampleMinZ")
    max_z = number(layout_text, "sampleMaxZ")
    step = number(layout_text, "sampleStep")
    straight_x = number(layout_text, "straightCenterX")
    straight_min = number(layout_text, "straightCorridorMinZ")
    straight_max = number(layout_text, "straightCorridorMaxZ")
    road_width = number(layout_text, "roadWidth")
    road_half = number(layout_text, "roadHalfWidth")

    sample_count = int(math.floor((max_z - min_z) / step)) + 1
    max_heading = 0.0
    max_center_step = 0.0
    straight_error = 0.0
    previous = None

    for i in range(sample_count):
        z = min_z + i * step
        x = straight_x + bend_offset * smoothstep(bend_start, bend_end, z)
        slope = bend_offset * smoothstep_derivative(bend_start, bend_end, z)
        heading = abs(math.degrees(math.atan2(slope, 1.0)))
        max_heading = max(max_heading, heading)
        if straight_min <= z <= straight_max:
            straight_error = max(straight_error, abs(x - straight_x))
        if previous is not None:
            max_center_step = max(max_center_step, math.hypot(x - previous[0], z - previous[1]))
        previous = (x, z)

    # The locked driving path stays in the straight corridor. Its only lateral motion is the
    # 0.055 m payoff wiggle; conservative Porsche footprint half-width is 1.12 m.
    locked_half_width = number(layout_text, "lockedCarFootprintHalfWidth")
    max_locked_world_x = 0.055
    min_car_clearance = road_half - (locked_half_width + max_locked_world_x)

    return {
        "sample_count": sample_count,
        "road_width_m": road_width,
        "max_heading_degrees": max_heading,
        "max_center_step_m": max_center_step,
        "straight_corridor_max_center_error_m": straight_error,
        "minimum_locked_car_edge_clearance_m": min_car_clearance,
    }


def add_check(checks: list[dict[str, Any]], check_id: str, ok: bool, detail: str, severity: str = "blocker") -> None:
    checks.append({"id": check_id, "ok": bool(ok), "severity": severity, "detail": detail})


def run(root: Path, mode: str, expected_source_sha: str | None) -> dict[str, Any]:
    checks: list[dict[str, Any]] = []
    warnings: list[str] = []

    head = git_head(root)
    if expected_source_sha:
        add_check(
            checks,
            "source_sha_pinned",
            head == expected_source_sha,
            f"git HEAD={head!r}; expected={expected_source_sha}",
        )

    car = root / "cars/porsche-911-gt3-rs-992/model.glb"
    car_sha = sha256_file(car) if car.is_file() else None
    add_check(
        checks,
        "approved_porsche_hash",
        car_sha == APPROVED_CAR_SHA256,
        f"sha256={car_sha}; expected={APPROVED_CAR_SHA256}",
    )

    timeline = read(root, "yunex/src/video002/timeline.ts")
    fps_match = re.search(r"VIDEO002_FPS\s*=\s*(\d+)", timeline)
    duration_match = re.search(r"VIDEO002_DURATION_SECONDS\s*=\s*([0-9.]+)", timeline)
    fps = int(fps_match.group(1)) if fps_match else None
    duration = float(duration_match.group(1)) if duration_match else None
    frames = round(duration * fps) if fps is not None and duration is not None else None
    add_check(checks, "locked_timeline_fps", fps == EXPECTED_FPS, f"fps={fps}")
    add_check(
        checks,
        "locked_timeline_frames",
        frames == EXPECTED_FRAMES and duration == EXPECTED_DURATION_SECONDS,
        f"duration={duration}; rounded_frames={frames}",
    )

    driving = read(root, "yunex/src/video002/driving.ts")
    expected_timing_tokens = [
        "fps: 30",
        "hookEnd: 72",
        "wingMacroEnd: 165",
        "highDownforceEnd: 285",
        "drsEnd: 405",
        "brakingEnd: 540",
        "coordinationEnd: 660",
        "finalEnd: 750",
    ]
    add_check(
        checks,
        "locked_camera_timing",
        all(token in driving for token in expected_timing_tokens),
        "DEFAULT_CAMERA_TIMING retains the seven locked beat boundaries",
    )

    track_world = read(root, "yunex/src/video002/trackUpgrade/TrackWorld.tsx")
    compact_world = re.sub(r"\s+", "", track_world)
    root_position_ok = "TRACK_ROOT_POSITION:[number,number,number]=[-1,-0.028,0]" in compact_world
    root_yaw_ok = "TRACK_ROOT_ROTATION:[number,number,number]=[0,Math.PI,0]" in compact_world
    add_check(
        checks,
        "track_root_transform",
        root_position_ok and root_yaw_ok,
        f"expected root position={EXPECTED_ROOT_POSITION}, yaw=PI",
    )
    add_check(
        checks,
        "trackworld_quality_seed_api",
        "quality?:'preview'|'final'" in compact_world
        and "seed?:number" in compact_world
        and "seed=2103" in compact_world,
        "TrackWorld exposes reusable quality/seed controls",
    )

    if mode == "baseline":
        road = read(root, "yunex/src/video002/trackUpgrade/RoadSurfaces.tsx")
        furniture = read(root, "yunex/src/video002/trackUpgrade/TrackFurniture.tsx")
        legacy_straight_plane = "new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH)" in road
        fixed_single_rail = "const RAIL_X = -3.62" in furniture
        legacy_backing = "legacy wide ground as a lowered backing plane" in track_world
        add_check(
            checks,
            "baseline_identity_failure_detected",
            legacy_straight_plane and fixed_single_rail,
            "baseline uses a rectangular straight road plane plus a fixed-X roadside rail; this is the known track-identity failure",
            severity="info",
        )
        if legacy_backing:
            warnings.append(
                "Legacy wide backing plane remains present in baseline TrackWorld; integrated visual QA must check for broad apron/seam visibility."
            )
        status = "BASELINE_RECORDED"
    else:
        layout = read(root, "yunex/src/video002/trackUpgrade/racetrack/layout.ts")
        surface = read(root, "yunex/src/video002/trackUpgrade/racetrack/Surface.tsx")
        kerbs = read(root, "yunex/src/video002/trackUpgrade/racetrack/Kerbs.tsx")
        runoff = read(root, "yunex/src/video002/trackUpgrade/racetrack/Runoff.tsx")
        terrain = read(root, "yunex/src/video002/trackUpgrade/racetrack/Terrain.tsx")
        furniture = read(root, "yunex/src/video002/trackUpgrade/TrackFurniture.tsx")
        vegetation = read(root, "yunex/src/video002/trackUpgrade/TrackVegetation.tsx")
        vegetation_layout = read(root, "yunex/src/video002/trackUpgrade/vegetation/layout.ts")
        lighting = read(root, "yunex/src/video002/trackUpgrade/TrackLighting.tsx")

        metrics = contract_metrics(layout)
        add_check(checks, "layout_sample_count", metrics["sample_count"] == 161, str(metrics))
        add_check(
            checks,
            "layout_locked_car_clearance",
            metrics["minimum_locked_car_edge_clearance_m"] >= 0.6,
            f"minimum proxy edge clearance={metrics['minimum_locked_car_edge_clearance_m']:.3f} m",
        )
        add_check(
            checks,
            "layout_restrained_bend",
            metrics["max_heading_degrees"] <= 10.0,
            f"max heading={metrics['max_heading_degrees']:.6f} deg",
        )
        add_check(
            checks,
            "layout_straight_locked_corridor",
            metrics["straight_corridor_max_center_error_m"] <= 1e-9,
            f"max straight-corridor center drift={metrics['straight_corridor_max_center_error_m']:.9f} m",
        )

        road_half = number(layout, "roadHalfWidth")
        base_runoff = number(layout, "baseRunoffWidth")
        barrier_setback = number(layout, "barrierSetback")
        landscape_setback = number(layout, "landscapeSetback")
        add_check(
            checks,
            "cross_section_order",
            road_half > 0 and base_runoff > 0 and barrier_setback > 0 and landscape_setback > 0,
            "road -> runoff -> barrier -> landscape setbacks are strictly outward",
        )

        component_texts = {
            "Surface": surface,
            "Kerbs": kerbs,
            "Runoff": runoff,
            "Terrain": terrain,
            "TrackFurniture": furniture,
            "TrackVegetation": vegetation,
            "TrackLighting": lighting,
        }
        for name, text in component_texts.items():
            add_check(
                checks,
                f"{name.lower()}_quality_seed_api",
                has_quality_seed_api(text),
                f"{name} has quality preview/final + optional seed defaulting to {EXPECTED_DEFAULT_SEED}",
            )
            add_check(
                checks,
                f"{name.lower()}_no_math_random",
                "Math.random(" not in text,
                f"{name} contains no per-run Math.random()",
            )

        add_check(
            checks,
            "surface_uses_layout_samples",
            "TRACK_LAYOUT_SAMPLES" in surface,
            "surface ribbon derives from shared sampled layout",
        )
        add_check(
            checks,
            "kerbs_selected_not_continuous",
            "kerbEligibilityAtZ" in layout
            and "right: z >= 17.5 && z <= 26.5 ? 'apex' : 'none'" in layout
            and "left: z >= 28 && z <= 34.5 ? 'exit' : 'none'" in layout,
            "kerbs are limited to explicit apex/exit zones",
        )
        add_check(
            checks,
            "runoff_derives_from_track_edges",
            "sampleTrackRange" in runoff and "sample.runoffLeft" in runoff and "sample.runoffRight" in runoff,
            "runoff derives from road/runoff boundaries",
        )
        add_check(
            checks,
            "barriers_derive_from_layout",
            "sample.barrierLeft" in furniture and "sample.barrierRight" in furniture,
            "both guardrail runs derive from shared barrier lines",
        )
        add_check(
            checks,
            "opening_camera_fence_exclusion",
            "openingCameraFenceExclusionZ: [4.1, 10.6]" in furniture,
            "tall catch fence documents exclusion from the known opening-camera corridor",
        )
        add_check(
            checks,
            "vegetation_exclusion_validation",
            "validateVegetationLayout" in vegetation_layout
            and "landscape exclusion" in vegetation_layout
            and "createSeededRandom" in vegetation_layout,
            "vegetation is seeded and validates against landscape/camera exclusions",
        )

        warnings.extend(
            [
                "Static checks cannot prove wheel contact, barrier/foliage occlusion, seam visibility, or premium track readability.",
                "Final E PASS requires seven native 1080x1920 beat frames plus a decoded short moving proof from the Manager-pinned render_source_sha.",
            ]
        )
        status = "STATIC_PASS_VISUAL_PENDING"

    blockers = [item for item in checks if item["severity"] == "blocker" and not item["ok"]]
    if blockers:
        status = "BLOCKED"

    return {
        "phase": PHASE,
        "role": "E — Independent Track / Visual QA",
        "mode": mode,
        "source_head": head,
        "status": status,
        "approved_car_sha256": car_sha,
        "expected_car_sha256": APPROVED_CAR_SHA256,
        "expected_native_beats": BEAT_FRAMES,
        "checks": checks,
        "warnings": warnings,
        "blockers": blockers,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, default=repo_root_from_script())
    parser.add_argument("--mode", choices=("baseline", "integrated"), default="baseline")
    parser.add_argument("--expected-source-sha")
    parser.add_argument("--json-out", type=Path)
    args = parser.parse_args()

    report = run(args.repo_root.resolve(), args.mode, args.expected_source_sha)
    rendered = json.dumps(report, indent=2, sort_keys=True)
    print(rendered)
    if args.json_out:
        args.json_out.parent.mkdir(parents=True, exist_ok=True)
        args.json_out.write_text(rendered + "\n", encoding="utf-8")
    return 1 if report["status"] == "BLOCKED" else 0


if __name__ == "__main__":
    raise SystemExit(main())
