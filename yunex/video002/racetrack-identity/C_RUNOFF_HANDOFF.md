# YUNEX 002 — C — Runoff / Barriers / Circuit Furniture

Phase: Y002-RACETRACK-IDENTITY-02
Role: C — Runoff / Barriers / Circuit Furniture
Repository: YunRah2103/yunus-video-lab
Work branch: sol/y002-track-identity-runoff

## Read first / current state
Read [START_HERE.md](START_HERE.md), [COMMON_BRIEF.md](COMMON_BRIEF.md) and [TASKS.json](TASKS.json) on sol/y002-track-identity-manager. This is the NEW racetrack identity phase. Older handoffs using your letter do not apply. The approved car and film are complete; only the environment's track identity needs changing.

## Goal and decisions already made
Make the existing environment read as a coherent premium racetrack section. Preserve the approved Porsche and current edit/audio. Master direction and constraints are locked in COMMON_BRIEF.md. Execute your assigned implementation; do not write another handoff or spawn agents.

## Owned files
- `yunex/src/video002/trackUpgrade/TrackFurniture.tsx`
- `yunex/src/video002/trackUpgrade/racetrack/Runoff.tsx`
- `yunex/src/video002/trackUpgrade/racetrack/Terrain.tsx`
Also own your role's report/proof sources under yunex/video002/racetrack-identity/reports/C/. Do not edit another role's report or TASKS.json (Manager only).

## Exact tasks / outputs / tests
Use Manager's pinned A layout. Build coherent track-edge context: modest painted runoff where useful, gravel/grass transition and terrain beyond the racing surface. Reposition guardrails/fencing beyond these boundaries, following course direction and sensible visual setbacks. The current rail beside random asphalt must become part of a readable track cross-section. A few deliberate track-specific fixtures are optional; no prop dump or huge grandstands.

Deliver standalone Runoff/Terrain components for Manager to mount, preserving TrackFurniture quality/seed API. Keep road/kerbs owned by B and vegetation/lighting by D. Render native rear-quarter, side-motion and wider context views; prove transitions meet B's surface without gaps, terrain intrusion, floating rails or tall posts across the Porsche. Inspect all existing camera corridors, including the prior opening fence-post obstruction. Verify deterministic placements and efficient instancing. Do not change car placement or cameras to hide poor furniture placement.

## Must keep / do not touch
Approved Porsche GLB and materials, wing mechanics, VO/SFX, timeline, typography and camera animation. No other role's files. Shared-file changes require Manager integration. Match existing quality/seed interfaces and real-world coordinates. All completion claims require actual pushed implementation and proof evidence.

## Escalation and return
Escalate scope/architecture/car/camera/story changes or unclear layout to Manager; routine bugs remain your responsibility. Return phase, role, input SHA, output branch and full SHA, changed files, proof links, tests, known limitations. Verify GitHub remote head after push. Follow COMMON_BRIEF's routing and render limits.
