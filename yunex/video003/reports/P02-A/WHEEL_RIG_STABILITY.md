# YUNEX 003 — POLISH-02 — Agent A wheel-rig stability

Phase: `Y003-POLISH-02`  
Role: `A — Wheel rig stability`  
Branch: `sol/y003-p02-wheel-rig`  
Input baseline: `064fc7687ad16e9fc99c32c3c323154b7e4496f1`

## Diagnosis

The approved Porsche wheel hierarchy itself is concentric and intentionally prepared for articulation:

- `Steer_FL/FR/RL/RR` origins are the measured wheel centres from `asset-manifest.json`.
- Each `Spin_*` is a child at local origin `[0,0,0]`; wheel tyre/rim vertices were baked relative to that pivot.
- Wheel spin axis is local `+X`; front steering axis is local `+Y`.
- The prepared steer/spin nodes are authored without non-uniform scale or baked pivot rotations.
- Front calipers live under the steer node but outside the spin node. Rear calipers remain non-spinning root children.

The strongest reproducible instability was instead in the driving contract. Steering was derived directly from a very short ±0.08 m numerical curvature sample of the smoothstep track bend. Position and heading are continuous, but curvature changes abruptly at the bend endpoints. On the 735-frame production timing this produced a worst one-frame front-steer change of approximately **3.755° at frame 331**. That reads visually as wheel wag/wobble even though the hub pivot is not eccentric.

This is separate from normal spoke/tyre temporal aliasing at high spin rates.

## Correction

Two bounded changes were made under `src/video003/motion/` only:

1. **Steering curvature conditioning**
   - Root route, distance curve, speed, raw curvature, chassis load and story timing are unchanged.
   - Front steering now uses average heading curvature over a ±1.5 m lookahead/lookbehind window.
   - Raw short-window curvature remains the source for lateral-load behaviour.
   - Worst measured one-frame front-steer change falls from ~3.755° to ~0.270° while retaining real front steering (peak remains ~3.44°).

2. **Stable local-axis rotation composition**
   - Runtime steer and spin deltas now compose from the authored base quaternion using explicit local-axis quaternions.
   - Steer remains local Y and spin remains local X.
   - A proof-only `legacy-euler` mode exists only for the same-time before/after diagnostic and is not the production default.

Distance-derived spin is unchanged: `spinRad = wheelPathDistance / tyreRadius`. The route and wheel path distances were not altered.

## Repeatable QA

`validateMotionContract({fps:30,durationFrames:735})` now gates:

- maximum steering change <= 0.35° per frame;
- exact distance/spin agreement;
- tyre-bottom contact;
- rear steering remains zero;
- deterministic arbitrary-frame evaluation;
- road containment.

`validateRuntimeWheelRigKinematics()` additionally builds the prepared steer/spin hierarchy from the locked source pivots and checks representative frames for:

- hub-origin radial/lateral drift <= 1e-8 m;
- spin-axis precession relative to root + steering <= 1e-6°;
- repeat application of non-sequential frames <= 1e-10 matrix-element error.

## Native proof package

The isolated P02 proof renderer produces three **1080×1920, 30 fps, 90-frame / 3.0 s** H.264 proofs from the actual locked `model.glb`:

- `YUNEX_003_P02_A_NEUTRAL_ROLL.mp4` — neutral rolling/all-four inspection.
- `YUNEX_003_P02_A_STEERING_LOAD.mp4` — bend-entry steering/load inspection.
- `YUNEX_003_P02_A_BEFORE_AFTER.mp4` — same-time legacy raw-curvature/Euler versus stabilized lookahead-curvature/quaternion comparison, including the bend-exit instability window.

Each proof cycles FL → FR → RL → RR using a wheel-local locked diagnostic viewpoint so hub/rim concentricity and caliper ownership remain easy to judge instead of being hidden by cinematic camera motion.

The dedicated Agent-A proof workflow also verifies the locked Porsche SHA-256 before rendering:

`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

## Evidence status

Source implementation and deterministic QA are complete. Native moving-proof run/artifact identifiers, hashes and visual inspection findings are appended after the branch proof workflow completes. This report does not claim Master approval.
