# Agent C — F visual corrections, 8 October 2026

- Owner branch: `sol/y004-c-camera-guides`; parent head before correction: `affe2eedc93836a110b407606f9b87294275df9e`.
- Manager assignment: `F_VISUAL_CORRECTIONS_MANAGER_HANDOFF.md` at Manager `4cdf4f8d16f862013854adae7fe5db33c8461879`.
- QA input: `reports/F/H_RESCUE_37764504658_INDEPENDENT_QA.md`, SHA `d7896e5eeef802587b95e61784558b30a794af4a`.
- Existing approved source verified: `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`, exact H visual modules inspected; C camera and guide index implementations are unchanged between earlier C commit and integrated H source.
- All writes restricted to `yunex/src/video004/camera/**`, `yunex/src/video004/guides/**` and this C report.
- Opening shot `low-hook` widened/recentred with 25–25.5mm virtual lens; `high-drive` pulled back to 27–28mm with continuous moving tracking, no unchanged macro / active exit edits.
- New `guides/SteeringOverlay.tsx` and `guides/overlayGeometry.ts`: actual source projection, bright true-angle dotted white + green strokes and two maximum labelled front/rear direction categories in 1080x1920 safe lower field. Captions explicitly say categorical car-left/car-right (NOT angle magnitude), or centred if both axes genuinely straight. NO wheel yaw amplification, altered geometry, invented Porsche calibration, or changed model bytes.
- H MUST integrate the new optional `Y004SteeringGuidesOverlay` in the central composition (exact instructions below). Just cherry-picking camera+guide index without overlay will leave F-004-01 poorly addressed.

## H integration (DO NOT override H source with C's stale standalone proof)
1. From commit this report belongs to, integrate **only** `yunex/src/video004/camera/index.ts`, `yunex/src/video004/guides/index.ts`, `yunex/src/video004/guides/overlayGeometry.ts`, `yunex/src/video004/guides/SteeringOverlay.tsx` and optionally C test files. Preserve current A/B motion, rig, timeline, D audio, track, GLB and H native runner.
2. In H's `yunex/src/video004/Video004.tsx`, add `import {Y004SteeringGuidesOverlay} from './guides/SteeringOverlay';`.
3. In `Yunex004Visual`, **after** the closing `</ThreeCanvas>` and **before** `<Yunex004EditLayer windows={Y004_EDIT_WINDOWS}/>`, insert `<Y004SteeringGuidesOverlay/>`. The new overlay samples H's locked 720-frame timeline itself. No new timeline or extra composition.
4. For a clean visual comparison, H may suppress its redundant white/green primitive `art` **in low-explain/high-explain only**; the overlay redraws those actual world rays at exact source projections at high contrast. Keep 3D guides in hook/macro (overlay intentionally absent). This is an H-owned composition choice, **not** a change C made.
5. Run `cd yunex && npx esbuild src/video004/camera/testEntry.ts --bundle --platform=node --format=cjs --outfile=/tmp/y004-c-tests.cjs && node /tmp/y004-c-tests.cjs` on the integrated checkout; run H's existing native short-proof process for frames **0–59**, **247–306**, **312–371**, **372–431**, **432–551** and missing 150–246, 307–311, 552–566. Exact-source artifact manifests and F visual decision required. Do not reuse old f5cb proof as changed-source visual QA.

## Physical limitation
At portions of high-speed pass, including approximate frame 397, A stages the car on a straight section. Real wheel heading may be zero at that instant. Overlay truthfully says CENTRED, while the category header describes directional RESPONSE when turning. No camera-only patch can prove nonzero steering where A emitted zero. H/Manager should prioritize actual turning frames (e.g. early high segment) for F's native evidence. Do not edit motion in C.

## Evidence
A projection-only preflight on the authored camera equations and virtual bounding car corners improved the relative portrait horizontal silhouette from crop (min/max beyond ±1) to approximately within ±0.95 for both sustained shots. This is an **approximate silhouette proxy**, not actual GLB video validation. C-owned fixture test added for real angular sign, zero-state truthfulness and projection in `correctionChecks.ts`. Full npm/esbuild and native 1080p source-pinned proofs must be recorded separately; no false PASS claims.
