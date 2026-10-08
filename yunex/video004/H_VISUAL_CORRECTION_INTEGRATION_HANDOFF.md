# YUNEX 004 — Agent H corrective integration assignment (after C visual fix)

**Manager authorization:** Integrate only Agent C's corrected camera/guide files into your existing Y004 integrated source and make actual source-matched moving proofs. **Do not start the full 720-frame render.**

## Exact remote input pins
- Repository: `YunRah2103/yunus-video-lab`.
- H assigned branch: `sol/y004-h-integration`, remote HEAD observed `943475571faa53217397404bb9e750359d66cfcd`. Check live remote again before editing.
- Prior good, fully tested *but visually rejected* animation source: `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`.
- C correction branch: `sol/y004-c-camera-guides` @ **`f891e3b991c73c4c62305dddcd45cea9eeea5090`**.
- C commits to intake in this order:
  1. `8039e03db2d2a774c4a4f3ff9639b8148eb69707` (actual code + specialist report).
  2. `f891e3b991c73c4c62305dddcd45cea9eeea5090` (30/30 numerical audit report only).
- F's independent visual FAIL: `sol/y004-f-qa` @ `d7896e5eeef802587b95e61784558b30a794af4a`, `yunex/video004/reports/F/H_RESCUE_37764504658_INDEPENDENT_QA.md`.
- The Manager's earlier general correction brief is `yunex/video004/F_VISUAL_CORRECTIONS_MANAGER_HANDOFF.md`.

## What to integrate
C modified only `yunex/src/video004/camera/index.ts`, added `guides/SteeringOverlay.tsx`, `guides/overlayGeometry.ts`, `guides/correctionChecks.ts`, `camera/testEntry.ts`, and C reports. C's older Y004 camera/guide sources should NOT overwrite H's unrelated production files. Cherry-pick two C commits when supported, or carry their actual changes by exact path with source provenance, preserving H's full existing model, motion, rig, timeline, narration and validated GLB asset.

**Critical H-owned central composition change:** In `yunex/src/video004/Video004.tsx` import `{Y004SteeringGuidesOverlay}` from `./guides/SteeringOverlay`. Mount `<Y004SteeringGuidesOverlay/>` **after `</ThreeCanvas>` and before `<Yunex004EditLayer windows={Y004_EDIT_WINDOWS}/>`**. The new overlay is optional by design and won't show otherwise. Avoid drawing a redundant competing 3D guide set in low/high explanations where the overlay is active; do not remove effective macro guide proof without checking actual images.

### Mandatory compilation & visual caveats
- Run C's owner fixture using `npx esbuild src/video004/camera/testEntry.ts --bundle --platform=node --format=cjs --outfile=/tmp/y004-c-tests.cjs` then `node /tmp/y004-c-tests.cjs` from `yunex/`. C's 30/30 result is an isolated numerical preflight (not a real Remotion render); ensure actual TypeScript/React build and projection view in the integrated source.
- The overlay shows *true projected angles* and categorical LEFT/RIGHT/CENTRED text. It intentionally reports `CENTRED` if real wheel yaw equals zero at some high-speed frames, notably near source frame 397. Do NOT misrepresent a zero-steering frame as showing active same-direction turning. Instead use genuinely turning frames and correct voice/text placement. If F still finds steering demonstration confusing, consult Manager for safe real motion adjustment; no invented physical yaw amplification.
- C's safe-area card begins around vertical coordinate Y=1485 in 1080×1920. Verify no overlap with existing editorial text or critical wheels, especially frames 272/336/397. If it obscures important scene content, refine within H-owned composition/layout or request C's scoped update; do not approve blindly.
- Do not undo H's existing frame **333** low→high cut, frame **567** active drive exit or 720-frame timing. Porsche stays on-track/moving, genuine white-green livery unchanged.

## Native proof work after committing source changes
Create new exact-source moving proof(s) for C-changed and F-missing ranges:
- opening 0–59,
- low education 150–246 (F's original unreviewed 97 frames),
- low steering 247–306,
- crossing 307–311 then matched low→high 312–371,
- high steering 372–431,
- roadside 432–551,
- cut 552–566,
- sample close rear macro if necessary for caliper demonstration,
- active final film frames if new source affects their presentation.
Use H's existing 1080×1920 30fps strict limited-range yuv420p/tv proof encoder and full decode, frame counts, exact SHA256 and **same new film source commit** in every artifact. Retain unchanged old clips for diagnostics only; F independent revised film visual PASS needs evidence on the same new source. If dense proof coverage would cost too much, group contiguous low/cut windows and render only required segments, never substitute stills/source tests for moving footage.

## Report and release handoff
Update `yunex/video004/reports/H/INTEGRATION.md` and machine-readable inventory with the NEW actual film source SHA, diff report, proof workflow run/job/artifact IDs, validation pass/fail, unresolved issues; push only your H branch. Return FULL verified H remote SHA and immutable new film source SHA. Agent F then reviews actual NEW clips, Agent J provides advisory deep creative review, and Manager decides release. **NO 720-frame G render** until F PASS, approved exact Cedar AAC reachable at final source, and Manager release lock.
