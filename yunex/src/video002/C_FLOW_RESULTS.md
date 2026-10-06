# YUNEX 002 — Agent C airflow results

Status: IMPLEMENTED. This module is a qualitative technical visualization, not computed CFD or measured force data.

## Owned implementation

- `AeroFlow.tsx` — reusable frame-deterministic Three.js/React airflow layer.
- `flowPaths.ts` — pure path/state/transform math.
- `c_flow_proof.tsx` + `c_flow_entry.tsx` — isolated native 1080x1920 / 30 fps three-state proof.
- `c_flow_tests.ts` — deterministic contract checks.
- `.github/workflows/yunex-c-flow-proof.yml` — isolated render/validation/artifact job.

No Porsche geometry/material/source GLB, track source, mechanics rig, camera/story, VO, or Video001 composition was edited.

## Integration API

Import:

```tsx
import {AeroFlow} from './video002/AeroFlow';
import type {AeroMode, CarTransform, FlapBounds} from './video002/flowPaths';
```

Primary props:

```ts
type AeroFlowProps = {
  frame: number;
  mode: 'highDownforce' | 'drs' | 'airbrake';
  progress?: number;      // 0..1 interpolation from fromMode -> mode
  fromMode?: AeroMode;
  carTransform?: {
    position: [number, number, number];
    rotation: [number, number, number];
  };
  flapBounds?: {
    min: [number, number, number];
    max: [number, number, number];
    clearance?: number;
  };
  opacity?: number;
  showUnderbody?: boolean;
};
```

Manager/A should pass the live car root transform and current rear moving-flap bounds when available. If no bounds are supplied, C uses the measured static approved-GLB fallback envelope only for safe visualization/proofing.

## Visual contract

- Flow travels vehicle-front `+Z` to rear `-Z`.
- Seven restrained paths: roof/upper flow, side flow, selective underbody flow.
- High downforce uses sparse separate downward load marks at front and rear.
- DRS reduces qualitative wake lift/spread and force/drag emphasis; it never reverses airflow.
- Airbrake increases wake deflection/spread and adds a distinct sparse rearward copper drag cue.
- Streamline control points are lifted over the supplied flap envelope plus clearance.
- Effects stay muted/transparent so the white/green livery remains readable.
- No HUD, numerical CFD, neon ribbon field, pressure map, or unsupported force/speed number.

## Deterministic checks

`runCFlowTests()` verifies:

- repeat calls produce byte-equivalent path data;
- every path progresses from front `+Z` toward rear `-Z`;
- path opacity remains within the restrained budget;
- highDownforce -> DRS interpolation has matching start/end states with no state pop;
- DRS has lower illustrative wake lift/spread than highDownforce;
- airbrake has the strongest rearward drag cue;
- roof path control points clear the provided flap envelope;
- world attachment transform math is deterministic;
- tracer location is frame deterministic.

The native proof entry executes these checks before Remotion registers the composition, so a proof render cannot proceed if they fail.

## Proof

Composition: `YUNEX-002-C-FLOW-PROOF`

- 1080x1920
- 30 fps
- 45 frames / 1.5 s
- Frames 0-14: high downforce
- Frames 15-29: DRS, smooth transition settles by frame 20
- Frames 30-44: airbrake, smooth transition settles by frame 35
- Approved Porsche and existing technical track remain visible.
- Review stills are extracted from the encoded native MP4 at representative settled frames.
- Workflow verifies the approved exterior SHA256:
  `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.

## Simplifications / limitations

- The paths are authored explanatory trajectories, not simulated streamlines.
- Load and drag marks communicate direction/relative state only; their lengths are art-direction controls.
- C does not actuate the rear/front aero. Final integration must use Agent A's mechanics and should pass A's current flap bounds into `AeroFlow`.
- The isolated C proof shows C's effect-state transitions around the approved car; it is not the final integrated mechanics/camera proof.
