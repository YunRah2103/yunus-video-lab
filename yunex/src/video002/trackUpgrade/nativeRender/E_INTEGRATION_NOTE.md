# YUNEX 002 — Agent E native render integration note

Phase: Y002-TRACK-UPGRADE-01  
Role: E — Native render pipeline and audio delivery  
Branch: sol/yunex-002-native-final

## What Manager should integrate

Cherry-pick/integrate the Agent E render/QA files from this branch without resetting the Manager branch.

The pipeline deliberately separates:

- **source SHA** — the exact Manager-approved integrated scene that is rendered;
- **tooling SHA** — the exact commit containing Agent E's validators/workflow.

This prevents a moving Manager branch from changing between chunks and prevents source checkout from hiding Agent E's QA utilities.

## Benchmark

Normal pushes to `sol/yunex-002-native-final` benchmark frames 330–359 at:

- 1080×1920 source
- scale 1
- 30 fps
- H.264 / yuv420p
- Remotion software GL
- render concurrency 2

The benchmark records source SHA, tooling SHA, elapsed time, resource use, ffprobe data, review frames, output SHA and Porsche SHA.

## Manager full-render trigger

After the upgraded track has passed lookdev/temporal review and Agent E files are integrated into `sol/yunex-002-active-aero`, make an explicit Manager commit whose message contains:

`[native-full]`

Normal Manager pushes execute no expensive render job. The explicit marker starts the full native pipeline.

The full pipeline pins the current Manager source to one commit SHA before rendering, then renders deterministic 30-frame chunks with 0–750 covered exactly once. It validates every chunk before stream-copy stitching and validates the stitched 751-frame 1080×1920 / 30 fps visual master.

## Audio

The approved VO MP3 is intentionally not stored in Git. The mux utility verifies the locked approved VO SHA, deterministic mix SHA, Porsche SHA, video dimensions/fps/frame count, AAC stream, duration, integrated loudness and true peak.

For local/Manager muxing:

`YUNEX002_SOURCE_ROOT=<manager-checkout> mux_validate_final.sh <native-visual.mp4> <approved-vo.mp3> <final.mp4>`

If the workflow is available for manual dispatch, `full` mode can also take an `approved_vo_run_id` and `approved_vo_artifact_name` to download exactly one approved MP3 artifact and emit the validated audio master.

Do not call the visual-only artifact upload-ready. The final master requires the approved audio path and temporal/audio QA.
