# YUNEX 002 — AGENT G — FINAL TRACK INTEGRATION

Phase: **Y002-RACETRACK-IDENTITY-02**
Role: **G — Integration**
Repository: **YunRah2103/yunus-video-lab**
Manager branch: **sol/y002-track-identity-manager**
Your branch: **sol/y002-track-identity-integration**

You are the sole integration agent for this phase. Do the actual integration yourself. Do not spawn more agents and do not take over E or F.

## Pinned specialist inputs

- A layout contract: `7ecd296b10f6d1d316544f1eb06a84bf5babedf3`
- B surface/kerbs: `ca42043a6124a98d78f89cfd1964aa9635866b55`
- C runoff/barriers/terrain: `10780592824776357c2e6eb751ec2542e34fecb7`
- D landscape/lookdev: `15dc8ffc33a17520abf82f5042e422311c7488cf`
- E baseline QA: `d395efd3c6c762d3ce943d3a89f273bd851b7e4a`
- F render preflight: `2496ff0e9d3d55bd7f2e18de95aaaaca9b8814d6`

## Job

1. Integrate B, C and D onto the pinned A layout contract.
2. Mount the new racetrack pieces in `yunex/src/video002/trackUpgrade/TrackWorld.tsx`.
3. Preserve the approved Porsche, camera/edit/audio/typography and active-aero behaviour unchanged.
4. Resolve overlap/seam issues conservatively:
   - Surface/kerbs inside.
   - Runoff outside road edge.
   - Gravel/terrain outside runoff.
   - Barriers beyond runoff.
   - Vegetation beyond landscape exclusion.
5. Remove or suppress legacy broad apron/backing elements only when they visibly conflict with the new connected racetrack.
6. Run compile/static validation and create reproducible integrated proof evidence.
7. Produce the integrated source commit only; do **not** claim final visual approval and do **not** render the final master.
8. Push your branch and return the full remote SHA.

## Acceptance

The result must read as one connected racetrack section, not a road beside barriers/foliage. The Porsche must remain grounded and visually dominant. No motorway markings, random barrier placement, grass intrusion, broad backing-plane seam, or camera obstruction.

After your push:
- Manager verifies and pins your exact SHA as `render_source_sha`.
- E performs final integrated QA.
- F performs the full native final render only after E passes.
