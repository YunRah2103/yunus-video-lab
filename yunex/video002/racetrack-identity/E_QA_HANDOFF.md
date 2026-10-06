# YUNEX 002 — E — Independent Track / Visual QA

Phase: Y002-RACETRACK-IDENTITY-02
Role: E — Independent Track / Visual QA
Repository: YunRah2103/yunus-video-lab
Work branch: sol/y002-track-identity-qa

## Read first / current state
Read [START_HERE.md](START_HERE.md), [COMMON_BRIEF.md](COMMON_BRIEF.md) and [TASKS.json](TASKS.json) on sol/y002-track-identity-manager. This is the NEW racetrack identity phase. Older handoffs using your letter do not apply. The approved car and film are complete; only the environment's track identity needs changing.

## Goal and decisions already made
Make the existing environment read as a coherent premium racetrack section. Preserve the approved Porsche and current edit/audio. Master direction and constraints are locked in COMMON_BRIEF.md. Execute your assigned implementation; do not write another handoff or spawn agents.

## Owned files
- `yunex/src/video002/trackUpgrade/qa/trackIdentity/`
- `yunex/video002/racetrack-identity/reports/E/`
Also own your role's report/proof sources under yunex/video002/racetrack-identity/reports/E/. Do not edit another role's report or TASKS.json (Manager only).

## Exact tasks / outputs / tests
Start by auditing the existing baseline and recording failures relevant to track identity. Build focused repeatable checks for layout coordinate compatibility, car footprint/surface height, kerb clearance, camera/furniture/foliage occlusion, unchanged asset hashes, seeded determinism and component quality/seed APIs. After integration inspect seven chronological native beat frames and a short moving proof from the pinned SHA.

Judge whether this reads as one continuous racetrack without labels: course direction, bend continuity, correctly related kerbs/runoff/barriers, no broad apron seam, grass intrusion or random road furniture. Report severity and exact frame/owned file for every visual issue. QA needs human-style visual inspection as well as automated checks; do not invent a quantitative 'beauty' score. Run relevant build/type checks and verify car/VO/timing preservation. Return PASS/BLOCKED with evidence and remaining risks. Do not fix A–D files yourself, rewrite cameras, weaken render validators or approve from code alone. Manager routes corrections; Astra owns creative approval.

## Must keep / do not touch
Approved Porsche GLB and materials, wing mechanics, VO/SFX, timeline, typography and camera animation. No other role's files. Shared-file changes require Manager integration. Match existing quality/seed interfaces and real-world coordinates. All completion claims require actual pushed implementation and proof evidence.

## Escalation and return
Escalate scope/architecture/car/camera/story changes or unclear layout to Manager; routine bugs remain your responsibility. Return phase, role, input SHA, output branch and full SHA, changed files, proof links, tests, known limitations. Verify GitHub remote head after push. Follow COMMON_BRIEF's routing and render limits.
