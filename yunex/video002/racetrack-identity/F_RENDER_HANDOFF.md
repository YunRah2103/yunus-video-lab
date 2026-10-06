# YUNEX 002 — F — Native Render / Final Delivery

Phase: Y002-RACETRACK-IDENTITY-02
Role: F — Native Render / Final Delivery
Repository: YunRah2103/yunus-video-lab
Work branch: sol/y002-track-identity-render

## Read first / current state
Read [START_HERE.md](START_HERE.md), [COMMON_BRIEF.md](COMMON_BRIEF.md) and [TASKS.json](TASKS.json) on sol/y002-track-identity-manager. This is the NEW racetrack identity phase. Older handoffs using your letter do not apply. The approved car and film are complete; only the environment's track identity needs changing.

## Goal and decisions already made
Make the existing environment read as a coherent premium racetrack section. Preserve the approved Porsche and current edit/audio. Master direction and constraints are locked in COMMON_BRIEF.md. Execute your assigned implementation; do not write another handoff or spawn agents.

## Owned files
- `.github/workflows/yunex-002-track-identity-render.yml`
- `yunex/src/video002/trackUpgrade/nativeRender/trackIdentity/`
- `yunex/video002/racetrack-identity/reports/F/`
Also own your role's report/proof sources under yunex/video002/racetrack-identity/reports/F/. Do not edit another role's report or TASKS.json (Manager only).

## Exact tasks / outputs / tests
Preflight the existing render pipeline now; do not render the old environment. After Manager pins render_source_sha and E passes integration, render all 751 frames freshly from that exact SHA at native 1080x1920 scale1, 30fps. Reuse chunked Remotion rendering and existing source staging; do not reuse old opening frames. Preserve approved car hash, original VO/AAC, film timing and current finishing typography/grade applied exactly once. Use a separate phase workflow/branch trigger so pushes do not accidentally launch older full-film workflows.

Render deterministic disjoint chunks, validate gap-free frame coverage and counts, then assemble and finish to H264 yuv420p/AAC MP4 with faststart. Preflight installed FFmpeg rather than waiting on unnecessary package installation. Diagnose tiny concat timestamp rounding separately from missing frames; final export must be exact 30fps and 751 frames. Do not weaken final validators or upscale a draft.

Decode the entire export; verify resolution/duration/frame count, audio preservation/no clipping, source provenance and hashes. Play/watch the whole film where supported and review chronological motion, not only stills; honestly report playback limitations. Return playable full MP4, seven beat frames, probe/manifests and verified remote commit. No creative re-edit, asset simplification or model changes; render bugs go to Manager if integration is involved.

## Must keep / do not touch
Approved Porsche GLB and materials, wing mechanics, VO/SFX, timeline, typography and camera animation. No other role's files. Shared-file changes require Manager integration. Match existing quality/seed interfaces and real-world coordinates. All completion claims require actual pushed implementation and proof evidence.

## Escalation and return
Escalate scope/architecture/car/camera/story changes or unclear layout to Manager; routine bugs remain your responsibility. Return phase, role, input SHA, output branch and full SHA, changed files, proof links, tests, known limitations. Verify GitHub remote head after push. Follow COMMON_BRIEF's routing and render limits.
