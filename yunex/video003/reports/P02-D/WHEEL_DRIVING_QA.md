# YUNEX 003 — POLISH-02 — Agent D wheel / driving QA

Phase: `Y003-POLISH-02`  
Role: `D — Wheel / Driving QA`  
Branch: `sol/y003-p02-wheel-qa`

## Verdict

**PASS — Agent A's wheel-rig correction removes the reproducible wheel-plane wag while preserving real rolling, steering, contact and fixed-caliper behaviour.**

This is an independent specialist QA result, not Master approval and not final delivery QA.

## Exact revisions reviewed

- P02 branch base / Agent A input: `064fc7687ad16e9fc99c32c3c323154b7e4496f1`
- Pre-polish native visual source: `805c74fc2f749ed701c95d1aa5809e60e5a02d76`
- Pre-polish native artifact: `11465758048`
- Agent A output actually reviewed: `b4f6c0e5382683f433b47a0bdd216fea4ff3a5dd`
- Agent A successful proof workflow: `37601280858`

There are no `yunex/src/video003/**` production changes between the approved native visual source and the P02 base; the intervening commits are workflow/report/handoff/QA packaging changes. The pre-polish movie is therefore a valid visual baseline for the wheel behaviour inherited by P02.

Agent A proof artifacts from the exact reviewed SHA:

- deterministic QA: `11473120934`
- native neutral/all-four proof: `11473001572`
- native steering/load proof: `11473451183`
- native same-time before/after proof: `11473365935`
- packaged proof set: `11472713155`

## Baseline characterization

The old wheel issue is real and reproducible. In the pre-polish native master, the front wheel plane visibly changes too abruptly around frames **327–334**, with the strongest transition at approximately **frame 331 (11.03 s)**. The hub itself does not trace an eccentric orbit; the defect reads as steering/wheel-plane wag layered on otherwise valid wheel spin.

This is consistent with the old raw-curvature steering path rather than a tyre/rim pivot offset.

## Independent same-time comparison

I reviewed Agent A's split-screen native before/after proof using the same source frames and the same diagnostic camera.

For the FR wheel over source frames **313–335**, I ran an image-space repeatability check on the rendered rim: threshold the green rim, take the largest rim contour, fit an ellipse per frame, then measure frame-to-frame center and equivalent-diameter changes.

At the old instability window:

- legacy maximum fitted rim-center step: **4.83 px**, occurring at source frame **331**
- stabilized maximum fitted rim-center step: **1.11 px**
- legacy maximum equivalent-diameter step: **0.87 px**
- stabilized maximum equivalent-diameter step: **0.29 px**

This image-space result is not used as an engineering dimension; it is a repeatable visual-stability check. It independently confirms the visible bend-exit snap is materially reduced rather than hidden by stopping the wheel.

## All-four-wheel moving review

The native neutral and steering/load proofs cycle **FL → FR → RL → RR** with a wheel-local locked viewpoint.

Observed:

- all four hub/rim/tyre assemblies remain visually concentric through multiple rotations;
- no unjustified lateral/radial wheel-plane precession is visible;
- front steering remains active and plausible under bend/load;
- rear steering remains absent;
- spokes and tyres continue rotating — the fix does not freeze wheel motion;
- calipers remain stationary relative to their uprights while rims/discs rotate;
- tyre-road contact remains stable with no new visible lift or penetration;
- left/right behaviour is symmetric apart from the expected steering/load differences;
- residual spoke pattern changes are normal temporal aliasing from wheel rotation, not transform wobble.

## Deterministic / kinematic checks

Agent A's exact proof SHA passed the 735-frame motion QA. I independently inspected the resulting artifact values:

- max steering step: **0.270233°/frame**
- max front steering magnitude: **3.445122°**
- max hub-center error: **3.553e-15 m**
- max axle-axis error: **0°**
- repeat transform error: **0**
- max tyre-contact error: **1.033e-8 m**
- max spin-distance error: **2.842e-14 m**
- minimum road-edge clearance: **3.179787 m**

These values are consistent with the moving proof: steering is still present, spin is still distance-derived, and the hub/axle transforms remain stable.

## Proof-media note

The three diagnostic proofs are 1080×1920, 30 fps, 90 frames / 3.0 s, H.264. Independent ffprobe reports full-range `yuvj420p` for these proof clips. That is **not a D blocker** because this handoff requires native moving diagnostic evidence, not the final delivery encoding contract. G/H must still enforce the final master requirement of H.264 `yuv420p`.

## Blockers

**None for Agent A integration.**

Agent D recommends the Manager accept A's motion-only changes from:

`b4f6c0e5382683f433b47a0bdd216fea4ff3a5dd`

and continue with integrated short-proof review before release to final rendering.
