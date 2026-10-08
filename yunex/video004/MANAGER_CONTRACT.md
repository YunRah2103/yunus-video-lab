# YUNEX 004 — MANAGER INTERFACE AND ACCEPTANCE CONTRACT
Phase: Y004-REAR-STEERING-01. Source base `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Manager owns the central TypeScript contract in `yunex/src/video004/contracts.ts`. Individual specialists MUST import this; do not edit its definition.

## Coordinate and motion convention
- Three.js: +Y up, +Z forward, +X vehicle left. Units meters, radians, seconds.
- Y003 `motionStateAt` returns a world-space track pose; NEVER reapply TrackWorld root transform.
- Root yaw is yaw about +Y; actual GLB rear pivot names `Steer_RL`, `Steer_RR`; spin under `Spin_RL`, `Spin_RR`; calipers `Caliper_RL`, `Caliper_RR` may not inherit rear steer.
- Rotations of the wheel spin use measured `SOURCE_WHEEL_SPIN_AXES` (not local X), quaternion composition. GLB geometry/material bytes stay fixed.
- Source model approximate centre wheelbase 2.4539 m (derived from existing source centre Z coordinates). Treat the source coordinates as animation geometry, not certified Porsche wheelbase specification.
- One `Y004DriveFrame` sampled deterministically by frame, containing inherited `MotionState`, `segmentId`, `regime` and actual per-wheel signed steering values. A is the producer; B/C/D are consumers.
- At low speed rear steering sign opposes front. At higher speed same direction. Both rear wheels steer coherently, not artificial opposite toe. The max absolute displayed rear steer is 1° illustrative, never presented as Porsche spec.
- Track proof: two **separate shot-local runs** on covered road sections, separated by explicit match cut; do not use a fake constant acceleration from slow to high regime.
- Low-speed kinematic validation documents simplified bicycle relation `kappa ≈ (tan(delta_front) - tan(delta_rear))/L` with consistent wheel/vehicle axes; at high speed show qualitative aligned mode and declare it is not an OEM simulation.
- Camera guides must derive projected endpoints from actual wheel orientation and car frame per sample. The line may lengthen for visibility but must NOT inflate the portrayed physical angle; heading guide and neutral reference together follow car transform.
- At most two technical cue groups simultaneously; subtle thin line art; preserve wheel and rim; muted comprehension.
- Preserve world road contact, effective spin-by-distance, per-wheel geometry and moving/trackside parallax.
- Do not claim exact speed threshold, controller switch law, lap time, grip delta, turning circle or proprietary Porsche steering calibration.

## Public interface
`yunex/src/video004/contracts.ts` contains `Y004DriveFrame`, `Y004Regime`, `Y004SegmentId`, `Y004CameraPose`, `Y004WheelGuide`, `Y004_FPS` and provisional frame ceiling. A exports `y004MotionAtFrame(frame): Y004DriveFrame` from `motion/index.ts`; B exports `createY004RearSteerRig(model)` from `rig/index.ts`; C exports `resolveY004CameraPose(state,shotProgress)` and `resolveY004Guides(state,camera)` from camera/ and guides/. D exports `Yunex004EditLayer` and audio cue metadata (or documented equivalent). Manager integration binds these in Video004.tsx; E must NOT author a competing composition.

## Ownership
Manager: `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json`, integration/review manifests.
A: `yunex/src/video004/motion/**`, `yunex/video004/reports/A/**`.
B: `yunex/src/video004/rig/**`, `yunex/video004/reports/B/**`.
C: `yunex/src/video004/camera/**`, `yunex/src/video004/guides/**`, `yunex/video004/reports/C/**`.
D: `yunex/src/video004/edit/**`, `yunex/src/video004/audio/**`, `yunex/video004/audio/**`, `yunex/video004/reports/D/**`, and new `yunex/public/y004-*` audio assets if small/licensed.
E: `yunex/video004/render/**`, new `.github/workflows/yunex-004-*.yml`, `yunex/video004/reports/E/**`.
F: `yunex/src/video004/qa/**`, `yunex/video004/reports/F/**`.
No specialist may change Y003 source or existing GLB. Any shared fix must be requested to Manager with exact diagnosis/proof, not slipped into a cherry-pick.

## Work release / acceptance
A+B can start in parallel. A publishes contract-compatible state sampler and driving proof; B proves axle/spin/caliper mechanics with fixture state first, then real A pin. C builds matching camera/guide helpers against typed dummy frames first and binds accepted A/B before QA. D records/obtains new Y004 VO and measures exact length; creates cue plan but cannot lock frame count alone. E validates tools independently but cannot render full video until Manager publishes exact render source SHA and F short-proof gate. F prepares automated independent checks immediately, then executes actual visual QA after native moving clips exist.

Requirements: out-of-order deterministic sampling; actual-GLB rim-plane and no precession under rear steer; brake calipers follow steer but do not wheel-spin; world-ground/arch clearance; sampled path domain; actual moving perspective; understandable low/high sequence muted; full native decode/audio/faststart and single genuine export. QA PASS is evidence-backed only.

## Locked film intent
Premium ~20–24 s 1080x1920 30 fps 9:16. Hook rear wheel within 0–2.8 s; short rear macro, matched elevated opposing low regime, match cut aligned higher regime, fast gentle motion, active drive-off. Moving Porsche all the way; no static logo card, no suspension teardown, no airflow lesson. White/green approved Porsche livery; restrained YUNEX identity. At most 1–3 s without meaningful action/framing change.

## Suggested source references (verified in Master brief)
- Porsche eight things 911 GT3: https://www.porsche.com/stories/innovation/eight-things-you-need-to-know-about-the-911-gt3/
- 992 GT3 RS press kit: https://newsroom.porsche.com/dam/jcr:46a23375-e7ee-4507-a577-d9761b784d33/992%20911%20GT3%20RS%20Press%20Kit%201.pdf

Everything beyond the directional low/high principle, including exactly 1° cap, local path staging, and cinematic speeds, is an illustrative YUNEX production choice.
