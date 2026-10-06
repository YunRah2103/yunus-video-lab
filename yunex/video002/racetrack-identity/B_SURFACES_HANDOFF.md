# YUNEX 002 — B — Racing Surface / Kerbs

Phase: Y002-RACETRACK-IDENTITY-02
Role: B — Racing Surface / Kerbs
Repository: YunRah2103/yunus-video-lab
Work branch: sol/y002-track-identity-surface

## Read first / current state
Read [START_HERE.md](START_HERE.md), [COMMON_BRIEF.md](COMMON_BRIEF.md) and [TASKS.json](TASKS.json) on sol/y002-track-identity-manager. This is the NEW racetrack identity phase. Older handoffs using your letter do not apply. The approved car and film are complete; only the environment's track identity needs changing.

## Goal and decisions already made
Make the existing environment read as a coherent premium racetrack section. Preserve the approved Porsche and current edit/audio. Master direction and constraints are locked in COMMON_BRIEF.md. Execute your assigned implementation; do not write another handoff or spawn agents.

## Owned files
- `yunex/src/video002/trackUpgrade/RoadSurfaces.tsx`
- `yunex/src/video002/trackUpgrade/road/`
- `yunex/src/video002/trackUpgrade/racetrack/Surface.tsx`
- `yunex/src/video002/trackUpgrade/racetrack/Kerbs.tsx`
Also own your role's report/proof sources under yunex/video002/racetrack-identity/reports/B/. Do not edit another role's report or TASKS.json (Manager only).

## Exact tasks / outputs / tests
After Manager publishes layout_contract_sha, build the connected asphalt surface and kerbs from A's contract. Replace the disconnected rectangular/apron look with continuous circuit edges. Use restrained asphalt texture at correct world scale, subtle wear/racing-line variation, white edge paint and selected red/white kerbs that follow bend/apex/exit logic. Do not add a centre divider or paint every straight edge like an apex. Kerbs must have believable height and meet the road without floating, z-fighting or touching locked tyres.

Preserve the RoadSurfaces quality/seed API. Return native opening, side/DRS and final hero comparisons plus a short camera-motion proof checking texture aliasing/seams. Verify road continuity, texture reuse/disposal, stable normals and wheel clearance across the full car path. Do not own runoff terrain, barriers, lighting, car or central integration. If a legacy backing plane still shows outside your surface, identify it for Manager rather than editing TrackWorld.

## Must keep / do not touch
Approved Porsche GLB and materials, wing mechanics, VO/SFX, timeline, typography and camera animation. No other role's files. Shared-file changes require Manager integration. Match existing quality/seed interfaces and real-world coordinates. All completion claims require actual pushed implementation and proof evidence.

## Escalation and return
Escalate scope/architecture/car/camera/story changes or unclear layout to Manager; routine bugs remain your responsibility. Return phase, role, input SHA, output branch and full SHA, changed files, proof links, tests, known limitations. Verify GitHub remote head after push. Follow COMMON_BRIEF's routing and render limits.
