# YUNEX 004 — Agent E native renderer

Owned source: `yunex/video004/render/**`, `.github/workflows/yunex-004-*.yml`, `yunex/video004/reports/E/**`.

## Pipeline now available

- `pipeline.py matrix --frames N --chunk-size 20`: creates contiguous, inclusive ordered frame windows from **Manager-locked** integer N. Provisional 720 is not treated as a final frame lock. Previous Y003 count (735) is never hard-coded.
- `pipeline.py chunks DIR --frames N --chunk-size 20 --source SHA`: verifies one exact chunk per interval, contiguous complete coverage, exact immutable 40-character source SHA in each provenance file, decoded frame counts, native resolution and 30 fps.
- `pipeline.py assemble DIR OUTPUT --frames N --chunk-size 20 --source SHA --audio PATH --evidence REPORT_DIR`: validates every native chunk; makes one final limited-range `yuv420p` H.264 normalization encode; muxes **new Y004** audio to AAC 48 kHz stereo; preserves faststart; writes chunk SHA256 values, full decoded final validation and master SHA256. No metadata-only duplicate variant.
- `pipeline.py final FILE --frames N --source SHA`: independently checks exact frame count, dimensions, 30 fps, H.264 limited-range `yuv420p` (never relaxes to `yuvj420p`), AAC stereo/48 kHz, faststart, total duration, **all** 30 fps PTS and complete video+audio decoder pass.
- `test_pipeline.py`: four tests including 4-frame **native 1080×1920, 30 fps moving-colour test fixture**, mixed yuvj420p/yuv420p chunk normalization, audio mux, wrong source provenance rejection, missing chunk rejection, parameter guards and exact SHA256 evidence. Fixture does not represent the Porsche film.

CI: `.github/workflows/yunex-004-render-ci.yml` on Agent E's branch runs native smoke with system FFmpeg/ffprobe, verifies the original GLB SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`, and uploads `Y004-E-NATIVE-TOOLING-SMOKE`. Local command:

```bash
cd yunex/video004/render
Y004_SMOKE_EVIDENCE_DIR=out/smoke python3 -m unittest -v test_pipeline.py
```

## Gate for full Y004 film (NOT released)

`.github/workflows/yunex-004-native-release.yml` is a **manual workflow**, not automatic on branch pushes. Only after Manager merges this tooling and the actual Y004 composition/audio, D measures VO and Manager/F approve the integrated **native moving short proof**, the Manager must publish in Manager-owned `TASKS.json`:

- `locked_frames`: integer final VO-locked frame count;
- `render_source_sha`: exact immutable source commit with all accepted A/B/C/D/E/F dependencies and audio;
- `pre_render_qa_status: "PASS"` and `pre_render_qa_evidence`: identifiable accepted native proof.

Set these registry fields in a commit **after** the immutable source commit; a commit cannot contain its own SHA. Then dispatch the release workflow with `source_sha`, `frame_count`, `composition_id` (default `YUNEX-004`; verify actual composition registration) and repo-relative `audio_path` under `yunex/video004/audio/` or `yunex/public/y004-*`. Ensure GitHub has registered the workflow for manual dispatch (some configurations require publishing it to default branch first). The gate checks all conditions and model hash **before** rendering; it refuses missing approval or audio that would be truncated.

Native renders use 20-frame source-pinned Remotion chunks at 1080×1920, 30 fps; every artifact includes `source-sha-NNNN-NNNN.txt`. Package downloads all pieces, validates exact-source continuity, exports one master `YUNEX-004-FINAL.mp4` and publishes GitHub artifact `YUNEX-004-FINAL-SINGLE-MASTER` with `RELEASE_METADATA.json`, SHA256SUMS and machine checks. Final media needs human continuous audiovisual creative review; automated checks alone cannot establish perfect narration or motion.

For *assembly-only rescue* of valid previous chunks, set optional `replay_run_id` to the successful chunk-render run ID with the **same source/count/composition**; the render job is skipped, coverage and SHA checks cannot be bypassed. All chunks must still be within GitHub artifact retention.

**Current dependency boundary:** No Y004 Porsche film is rendered by Agent E while integrated film and QA gates are absent. Do not substitute the synthetic native smoke artifact for real low/high rear-steering evidence or Master's creative approval.
