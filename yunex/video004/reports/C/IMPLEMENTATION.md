# YUNEX 004 — Agent C Camera + Guide Implementation

Phase: Y004-REAR-STEERING-01  
Branch: `sol/y004-c-camera-guides`  
Pinned dispatch base: `bf2f0996f4176791d5ac78d818090e8b429397ad`  
Owner: Agent C (camera, guides, reports/C only)

## Implemented
- Pure per-frame world-space camera poses for all six Y004 segment IDs, with restrained optics and road-above camera-height checks.
- One shared camera spec for matched low/high 3/4 elevated explanation shots.
- Low rear three-quarter hook, planted wheel macro, fast side/rear drive, fixed-world pass followed by editorially distinct moving rear-quarter exit.
- **Manager must cut the trackside-to-exit shot at progress 0.54**; this is not a physically simulated flying camera transition.
- Wheel-contact-tethered paired straight/actual heading guides. Always identical ray lengths and true signed physical angles; no enlarged fake yaw, no arbitrary rear toe.
- Camera-facing axle selection, geometric view safety, rear-only hook/macro, two axle groups max during matched demos, no guides on moving drive-off.
- All coordinates use manager Y004DriveFrame / Y003 MotionState; approved world track transform is applied only once by A.

## Native proof status and dependencies
**NATIVE MOVING PROOF NOT YET EXECUTED.** Agent C began from the dispatch commit with only shared `contracts.ts`; A motion sampler, B steering rig and Manager composition were unavailable on this branch. The available GitHub connection does not expose a workflow-dispatch action, and the isolated local runner does not have Remotion/Three dependencies or access to clone GitHub. No clip, run or artifact is claimed. Do not accept this report as the native proof gate.

After Manager integrates the real A and B SHAs, E/Manager must render native muted matched low/high consecutively, rear macro and active trackside pass/exit at 1080x1920 30fps. Capture immutable render source SHA, artifact/run ID, exact frame ranges and full playback QA. C re-check frustum and trackside anchor against the accepted shot-local motion after those SHAs exist.

## Intentional integration notes
- Import `resolveY004CameraPose(state,shotProgress)` from `src/video004/camera/index.ts`.
- Import `resolveY004Guides(state,camera)` from `src/video004/guides/index.ts`; draw each pair as thin neutral + restrained green heading lines, suppress when `visible=false`, no projected-angle amplification.
- Convert `y004VerticalFovDegrees(focalLengthMm)` for Remotion ThreeCanvas perspective FOV using the same 24mm virtual sensor height as P03.
- Place a **real editorial cut** at `Y004_EXIT_EDITORIAL_CUT_PROGRESS=0.54` (world-fixed to mobile camera). Do not interpolate across that boundary.
- Exit trackside static lens is anchored at track-local Z=-24, near the provisional Agent A exit sweep (-48 to +38) at A branch 8ba8678a9a98d5abd5b1b61bd800c5e90b95dc83; requires revalidation if Manager revises/accepts A.
- Camera and guide tests must validate with accepted A/B input before QA PASS; fixture validation alone is not final evidence.

## Accuracy
Illustrative steering capped by Manager/A at <= 1 degree. C never modifies physical wheel steering. No Porsche numerical steering threshold or proprietary control claim.

## Fixture numeric preflight
The exported `camera/contractChecks.ts` and `camera/testEntry.ts` implement deterministic typed P03 motion-fixture checks for 30 camera poses, two-group limits, front/rear line-angle integrity, rear wheel macro framing, five matched mode samples, static-world exit camera and repeat sampling. Run with `npx esbuild src/video004/camera/testEntry.ts --bundle --platform=node --format=cjs --outfile=/tmp/y004-c-tests.cjs && node /tmp/y004-c-tests.cjs` from `yunex` after `npm ci`.

An isolated JS-equivalent geometry smoke pass on the current authored camera/guides source caught and fixed two unsafe guide crops. The full repository esbuild/TypeScript test command and required native Remotion proof remain **unexecuted** in this chat; they are NOT claimed PASS. The starter environment cannot clone the remote repo or install its packages. Manager must run the above gate on an integrated full checkout.

Latest inspected independent dependencies (not yet Manager-accepted at inspection): A `8ba8678a9a98d5abd5b1b61bd800c5e90b95dc83`; B `0c6398a497bd034ca12baa39d519e5a92b504a26`.
