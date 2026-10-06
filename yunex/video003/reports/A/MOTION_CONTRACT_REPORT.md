# YUNEX 003 — Agent A driving/motion report

Phase: `Y003-SUSPENSION-AERO-01`  
Role: `A — Driving dynamics and runtime articulation`  
Input baseline: `50fd478256bbe12d37410e78678bd7c302d96434`  
Work branch: `sol/y003-driving`

## Status

Actual motion/runtime implementation is present on the branch. The source contract is deterministic and an isolated 1080x1920 proof renderer is included. The connected GitHub surface used by this chat does not provide repository command execution or workflow dispatch, so I cannot truthfully attach a newly rendered MP4 from this role. The visual proof gate therefore remains pending execution of the included isolated proof script; do not treat this report alone as visual approval.

The proof entry calls `assertMotionContract()` before rendering, so a proof render is also a source-QA gate.

## Source-asset audit

Source: `cars/porsche-911-gt3-rs-992/{prepare_asset.py,asset-manifest.json,README.md}`.

- Asset SHA256 remains locked: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- Units: metres; source axes +Y up, +Z forward, +X left.
- Front wheel centres:
  - FL `[0.8047665688, 0.3521761158, 1.2425107362]`
  - FR `[-0.8047665640, 0.3521761365, 1.2425106101]`
- Rear wheel centres:
  - RL `[0.7878194083, 0.3713972649, -1.2120098332]`
  - RR `[-0.7878194081, 0.3713972649, -1.2108212101]`
- Derived wheelbase: `2.4539261948 m`.
- Front/rear track: `1.6095331328 m / 1.5756388164 m`.
- Prepared-asset rolling radii used by A:
  - front `0.3521761262 m`
  - rear `0.3713972649 m`
  These use the prepared wheel-centre Y values because the asset contract puts ground at Y=0. They replace Y002's generic 0.34 m spin radius.
- `prepare_asset.py` creates `Steer_* -> Spin_*` chains. Front calipers are reparented under `Steer_FL/FR`, so they steer with the uprights and do not spin. Rear calipers remain non-steering source children.

## Motion contract

Public entry: `yunex/src/video003/motion/index.ts`.

Primary call:

`motionStateAt(frame, {fps, durationFrames})`

The state is pure frame-derived data and contains:

- time/progress/phase
- cumulative path distance
- speed and longitudinal acceleration
- path curvature and lateral acceleration
- world-space car root position/yaw
- chassis pitch/roll/heave plus normalized brake/corner load
- FL/FR/RL/RR local and world wheel centres
- wheel-specific travelled distance
- front Ackermann-like steering from path curvature
- wheel spin from travelled wheel-path distance / source-specific radius
- upright vertical offset (zero on this flat-track contract, keeping tyre bottoms grounded)

World transforms are already in YUNEX world space from the approved track-local centreline. Do **not** apply the TrackWorld root transform to A's root positions a second time.

Manager remains owner of `src/video003/types.ts`. This module intentionally owns its local interface so Manager can mirror/install the minimal shared shape without A editing central files.

## Route / driving behaviour

A does not reuse or speed-scale Y002's 5.15 m path.

Default route samples the corrected approved racetrack centreline from track-local Z `-60` to `136`, approximately `196.17464 m`. It passes through the existing gentle S-bend instead of inventing a new circuit.

Default 25 s profile:

- quick moving approach
- progressive braking before the bend
- genuine front steering through the bend
- slower but still moving installed-detail window
- release and acceleration
- active exit

The curve is monotone cubic in distance, evaluated directly at any frame. No `useFrame` accumulation, random bounce, or stateful time integration is used.

Reference numeric audit of the exact contract constants at 30 fps / 750 frames:

- route distance: `196.17464 m`
- speed range: `5.7695–12.8664 m/s` (~20.8–46.3 km/h)
- peak braking: `3.0227 m/s²`
- peak positive acceleration: `1.4992 m/s²`
- max front steer: `3.9066°`
- max chassis pitch: `1.0391°`
- max chassis roll: `0.6277°`
- minimum centreline-based road-edge clearance after locked half-width: `3.1798 m`
- tyre-bottom contact error by contract: `0 m`
- spin-distance error by construction: `0 m`

These are illustrative cinematic dynamics, not a Porsche vehicle-dynamics solver.

## Runtime articulation

`createRuntimeMotionRig(container)` preserves the GLB bytes and snapshots/restores source transforms before applying each frame.

- Car/world root gets path translation + yaw only.
- A runtime chassis wrapper carries modest pitch/roll/heave.
- Source body/glass/lights/grilles/interior/wing groups are reparented only at runtime under that wrapper.
- `Steer_*` gets steering/upright motion.
- `Spin_*` gets rolling angle.
- Front calipers inherit steer motion from their prepared hierarchy and never receive spin.
- Rear steering remains exactly zero.
- `restore()` returns source transforms/hierarchy after use.

B should attach simplified suspension links to the published source wheel/axle anchors and consume A wheel/chassis state rather than introducing a second wheel-motion system.

## QA encoded in source

`validateMotionContract()` / `assertMotionContract()` check:

- finite transforms
- monotone distance
- speed derivative agreement
- steering sign versus path curvature
- rear-steer absence
- source-radius tyre contact
- wheel spin versus wheel-path distance
- track containment
- deterministic non-sequential frame calls
- representative chunk boundaries

The isolated proof entry executes `assertMotionContract()` before the render can proceed.

## Isolated proof

No central `index.tsx` edit is required.

From `yunex/`:

`node src/video003/motion/render-proof.cjs`

Expected local outputs:

- `out/y003-agent-a/YUNEX_003_A_MOTION_PROOF.mp4`
- native 1080x1920 stills at proof frames 0, 89, 128 and 179

The 180-frame proof uses the first six seconds of the real 25 s motion state, with a moving low front-three-quarter tracking view followed by a genuinely fixed trackside station. The station is based on source frame 128 so the car crosses the camera rather than the camera simply following the GLB.

Large proof media must stay out of Git history. Publish the resulting artifact URL/provenance in this report or Manager registry after an actual runner executes it and a human/vision review checks opening/mid/crossing/end.

## Integration request

Manager should review this branch diff, then pin the accepted full remote SHA as `motion_contract_sha` in `TASKS.json`.

Dependency consumers:

- B: wheel centres, chassis attitude/load, steering/upright state
- C: root path, speed, yaw, wheel state; retain at least one fixed/trackside car-crossing shot
- D: root/front-wheel transforms plus approved B link anchors
- H: run independent driving/contact/determinism review after Manager integration

Do not call A visually complete until the moving proof is actually rendered and inspected. Master creative approval is not claimed.
