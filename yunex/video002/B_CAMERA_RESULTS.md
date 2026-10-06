# YUNEX 002 — Agent B Camera / Track Motion Results

## IMPLEMENTED

Agent B owns only deterministic vehicle travel, camera direction and the isolated camera proof for YUNEX 002. The approved Porsche GLB, approved track source, mechanics, airflow, VO/timeline and shared composition registry were not edited.

Branch: `sol/yunex-002-b-camera`
Base: `sol/yunex-002-active-aero` at `c220d66bc7b4fe855b29cafdd1fa22d9d167a7a7`

## Integration API

Import from `yunex/src/video002/cameras.ts`:

```ts
poseFor(frame, timing?)
```

Returns:

```ts
{
  camera: {
    position: [x, y, z],
    target: [x, y, z],
    focalLength: number
  },
  rootPose: {
    position: [x, y, z],
    rotation: [x, y, z],
    distance: number,
    speed: number
  },
  wheelAngle: number,
  shot: CameraShot
}
```

`wheelAngle` is cumulative distance / tyre radius. Integration should add it to the approved `Spin_FL`, `Spin_FR`, `Spin_RL`, `Spin_RR` local-X baseline rotations. Caliper nodes are not children of this contract and stay fixed.

Default timing is 30 fps with boundaries 72 / 165 / 285 / 405 / 540 / 660 / 750 frames. A manager can override those boundaries through `Partial<Yunex002CameraTiming>` without changing Agent B source.

## Directed camera progression

1. Rear-quarter hook — car large, rear wing readable.
2. Wing macro — intentional technical crop, rear body retained.
3. Medium/high rear high-downforce view.
4. Side-tracking DRS view.
5. Controlled braking quarter.
6. Larger whole-car coordination reveal.
7. Moving final hero/pass.

All camera transforms are root-relative and frame-derived. There is no accumulated per-frame mutable travel state and no endless orbit.

## Driving / wheel contract

Travel uses a monotone cubic Hermite distance curve through fixed distance keys. It is deterministic, monotonic and C1 across beat boundaries, so the car does not reset or artificially stop at every camera beat.

Presentation travel reaches 5.15 m by the final beat. Wheel phase is derived directly from cumulative travel with a 0.34 m reference tyre radius. Whole-car braking pitch peaks at only 0.0035 rad (about 0.20 degrees).

The automated contract test includes a front/rear axle tyre-contact proxy during braking. With the approved axle markers, contact stays inside the configured road-contact tolerance rather than burying/floating the tyres.

## Source checks

`b_camera_tests.ts` checks:
- repeated-frame pose determinism;
- finite camera/root/wheel values;
- portrait camera height and focal-length guardrails;
- continuous monotonic travel with no reset;
- cumulative wheel phase with no reset;
- braking pitch below 0.25 degrees;
- front/rear tyre-contact proxy during braking;
- a genuinely moving final hero beat.

Portrait camera keys were additionally rebalanced from the first draft so the whole-car beats use wider lenses / greater camera distance while the wing macro remains intentionally tight.

## Proof

Isolated proof root: `yunex/src/video002/b_proof_index.tsx`
Composition: `YUNEX-002-B-CAMERA-PROOF`
Output contract: native 1080 x 1920, 30 fps, 75 frames.

The proof deliberately keeps aero neutral and reuses `TechnicalTrackWorld`; it exists to review B's camera/travel/wheel motion only. It does not claim mechanics, airflow or final film integration are finished.

Final native validation run: GitHub Actions run `37387397537`.
The final proof workflow is temporary validation infrastructure and must not remain in the integration diff after proof collection.

## Locked asset

Expected Porsche exterior SHA-256:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

The validation workflow checks this hash before rendering.

## Integration notes

Manager should consume `poseFor()` from the final 002 composition rather than copying the proof scene. The proof lighting is intentionally economical. Keep the approved track renderer/scene architecture and use B only as camera/root/wheel motion input.

No full-film render was performed by Agent B.
