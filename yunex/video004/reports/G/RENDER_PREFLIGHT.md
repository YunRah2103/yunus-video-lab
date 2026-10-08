# YUNEX 004 — Agent G render-tooling preflight

**Date:** 2026-10-08 (Europe/London)  
**Branch:** `sol/y004-g-render`  
**Status:** **TOOLING PREFLIGHT PASS; FINAL NATIVE RENDER BLOCKED BY MANAGER RELEASE GATE**  
**Final MP4 created:** NO. **Full 720-frame render initiated:** NO.

## Source/ownership lock
- Read: `START_HERE.md`, `MANAGER_CONTRACT.md`, `TASKS.json`, `G_RENDER_HANDOFF.md`, E's existing `render/pipeline.py`, `render/README.md`, E's release and CI workflows, D's `CEDAR_AUDIO_RELEASE.md`.
- G only writes `yunex/video004/reports/G/**` and small text `yunex/video004/delivery/**`. No Y004 scene, model, camera, audio, timeline, E renderer, or Manager registry modifications.
- Existing E tooling origin: `9d4593308cf660d7824fb5ba013a59c15878e204`; keep `yunex/video004/render/pipeline.py` and `.github/workflows/yunex-004-native-release.yml` unchanged.
- Original Porsche GLB required SHA256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb` (repository workflow enforces this; G has not separately downloaded/hashed the GLB in this preflight).

## Verified tooling
1. Local runtime executable preflight: Python `3.13.5`, FFmpeg `7.1.5`, FFprobe `7.1.5`, Node `22.16.0`, npm `10.9.2`; `git` installed. FFmpeg has `libx264`, `aac` encoders and H.264/AAC decoders, and supports `yuv420p`.
2. Independent **synthetic** 1080x1920 30fps four-frame H264/AAC MP4 preflight PASSED in the local execution environment: ffprobe decoded exactly four frames, video `h264`/`yuv420p`/`color_range=tv`, stereo AAC 48k; faststart `moov` before `mdat`; full FFmpeg `-xerror -err_detect explode` video+audio decode; strictly consecutive 30fps frame PTS. Synthetic file SHA256 `850b547a23a2f05d2074129322476da3c9d50d3e39f204cb8a88b4d71ca33ebf`, duration 0.133333 seconds. **This is not the Y004 film or an Agent H proof**.
3. Independent chunk-plan check PASSED: exactly 36 contiguous 20-frame windows spanning 0–719, each frame owned once; first 0000–0019, last 0700–0719.
4. E's **remote GitHub CI**, run [37750922383](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37750922383), checked `completed/success`; tooling artifact **11538520721** (`Y004-E-NATIVE-TOOLING-SMOKE`) exists, not expired at check. E's test suite includes 4-frame fixture, source provenance negative paths and strict final validation. Separate earlier Manager Porsche moving smoke run [37755997906](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37755997906) checked `completed/success`, but uses *older* source and is not H's approved retimed native proof.

## Immutable release blockers (checked on remote)
- Manager branch `sol/y004-rear-steering-manager`, at `005cf9c5469a4ff7447623219f624c486b4dd54f`: `locked_frames=720`, but `render_source_sha=null`. `pre_render_qa_status` and `pre_render_qa_evidence` are not yet published. This is a **hard gate**, not permission to begin rendering.
- H branch `sol/y004-h-integration` still points to dispatch `5914ddcabaeec4b14ff5e3ca6bcbaf4e6e71a1bb` when checked: final integrated `YUNEX-004` composition/VO retime and new moving H proofs were not yet pushed. Existing index still registers `YUNEX-004-VISUAL-PROVISIONAL`, not approved final `YUNEX-004`.
- F independent native visual release **PASS matching exact H commit** has not been published. Existing F branch `650cd0bdabaa127103ab214a1c44eb1c86ebb0aa` only contains previous harness/blocker status.
- D has confirmed approved Cedar AAC 24.000s / 48k stereo and release SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`, on `sol/y004-d-edit-audio` @ `9567f6b2efa901d3667d084eedbbca9c98943c36`, in Library `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`. The approved bytes are **not present** at proposed `yunex/public/y004-final-mix.m4a` in checked H or Manager branches. Do not assume another audio asset is the approved AAC; H/Manager must supply repo-local bytes and prove hash.
- `.github/workflows/yunex-004-native-release.yml` exists in E/G branches but returns **404 on the repository default branch `main`**. GitHub manual `workflow_dispatch` registration normally requires a workflow on the default branch. This is an actionable scheduling/dispatch blocker; G must not alter `main` or duplicate E tooling outside assigned scope. Manager/E must authorize a supported registered-workflow or local execution path before release.
- The available GitHub connector allows remote source inspection and writes but does **not expose a manual workflow-dispatch action**; do not claim a run was dispatched.

## Locked final-production procedure once gates are genuinely true
1. Re-read **current Manager** `TASKS.json`; require full immutable 40-hex `render_source_sha`, `locked_frames=720`, `pre_render_qa_status="PASS"`, and matching `pre_render_qa_evidence` from F's real moving visual QA against **that exact source SHA**. Require H-registered `YUNEX-004`, exact model hash, and in-repo D AAC SHA256 match. Do not self-authorize.
2. With the E workflow available for actual manual dispatch, use `source_sha=<manager pin>`, `frame_count=720`, `composition_id=YUNEX-004`, `audio_path=<verified Y004 AAC repository path>`. Never render from the G branch merely because it is latest.
3. Run all 36 actual 1080x1920 30fps source-pinned native Remotion chunks; retain a `source-sha-NNNN-NNNN.txt` for each. Ensure every file passes frame count, one video stream, and provenance tests.
4. Reuse E's `pipeline.py assemble` unchanged; mux only approved Cedar audio; require exactly 720 decoded frames, 24s, H264 limited-range yuv420p, AAC stereo 48k, faststart, timestamp continuity, and FFmpeg full decode.
5. Publish **one** accessible `YUNEX-004-FINAL.mp4` with GitHub artifact/run IDs, exact MP4 SHA256, E release JSON/CHUNKS evidence, and G final delivery report. Then hand off for independent F **final file QA**. Do not label as Master creative approval.

**Preflight verdict:** The production tooling and synthetic codec path are ready. The final authentic Porsche film is correctly NOT rendered, NOT delivered, and has no MP4 SHA256 or final workflow/artifact ID until release gates, repo-local AAC, and workflow execution path are resolved.
