# YUNEX 002 — A — Layout

Phase: Y002-RACETRACK-IDENTITY-02
Role: A — Layout
Repository: YunRah2103/yunus-video-lab
Work branch: sol/y002-track-identity-layout

## Read first / current state
Read [START_HERE.md](START_HERE.md), [COMMON_BRIEF.md](COMMON_BRIEF.md) and [TASKS.json](TASKS.json) on sol/y002-track-identity-manager. This is the NEW racetrack identity phase. Older handoffs using your letter do not apply. The approved car and film are complete; only the environment's track identity needs changing.

## Goal and decisions already made
Make the existing environment read as a coherent premium racetrack section. Preserve the approved Porsche and current edit/audio. Master direction and constraints are locked in COMMON_BRIEF.md. Execute your assigned implementation; do not write another handoff or spawn agents.

## Owned files
- `yunex/src/video002/trackUpgrade/racetrack/layout.ts`
- `yunex/src/video002/trackUpgrade/racetrack/types.ts`
- `yunex/src/video002/trackUpgrade/racetrack/LayoutDebug.tsx`
Also own your role's report/proof sources under yunex/video002/racetrack-identity/reports/A/. Do not edit another role's report or TASKS.json (Manager only).

## Exact tasks / outputs / tests
Implement the shared track-section layout contract first. Inspect the locked car poses, all camera beats and existing root transform. Define a single sampled centreline with tangent/normal, racing-surface left/right edges, kerb eligibility, runoff boundaries and furniture/landscape exclusion zones. Keep the existing car travel corridor straight and grounded; introduce a modest bend farther away where visible from current cameras. Choose credible width from car scale rather than retaining the oversized disconnected asphalt apron. Document units and coordinate space explicitly; downstream components must derive boundaries from this contract rather than invent offsets.

Create a simple debug/layout presentation plus two current-camera proofs and one high-angle proof showing continuous course geometry. Validate car footprint clearance through every frame, sampled edge continuity and nonintersecting surfaces. Manager reviews and pins the contract before B/C/D start. Do not edit RoadSurfaces, furniture, foliage, lighting, TrackWorld or the film. If the existing trajectory cannot fit a coherent track, report exact conflicting poses; do not move the Porsche.

## Must keep / do not touch
Approved Porsche GLB and materials, wing mechanics, VO/SFX, timeline, typography and camera animation. No other role's files. Shared-file changes require Manager integration. Match existing quality/seed interfaces and real-world coordinates. All completion claims require actual pushed implementation and proof evidence.

## Escalation and return
Escalate scope/architecture/car/camera/story changes or unclear layout to Manager; routine bugs remain your responsibility. Return phase, role, input SHA, output branch and full SHA, changed files, proof links, tests, known limitations. Verify GitHub remote head after push. Follow COMMON_BRIEF's routing and render limits.
