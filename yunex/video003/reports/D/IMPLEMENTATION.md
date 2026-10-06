# YUNEX 003 — Agent D airflow implementation report

Phase: Y003-SUSPENSION-AERO-01  
Role: D — Suspension aerodynamic explanation  
Branch: sol/y003-airflow  
Preparation input: 50fd478256bbe12d37410e78678bd7c302d96434

## What was implemented

- Added a new Y003-only qualitative suspension-airflow component under `yunex/src/video003/airflow/`.
- Added dependency-injected front-link anchors so Manager can bind B's approved installed profile bounds without D guessing suspension geometry.
- Flow coordinates are explicitly **car-local metres**: +Y up, +Z forward, +X left. Manager must place `<SuspensionAirflow />` inside A's car-root transform once; world-transformed anchors must not be passed.
- Added two restrained paths per visible front corner: one over the link and one outboard of it. No rear-wing route, DRS mode, force arrows, pressure map, velocity heatmap, particle fog or quantitative CFD claim.
- Added deterministic tracer placement driven by A's cumulative travelled distance. Frame is used only for a subtle deterministic opacity pulse; no randomness or wall-clock dependence.
- Tube geometries are memoized and disposed on anchor change/unmount, avoiding geometry reconstruction on ordinary frame changes.
- Added source-level anchor/path validation: finite/ordered bounds, constrained clearance, front-to-rear airflow direction and control-point exclusion from inflated link bounds.
- Component exposes `visibility` and `focusSide` so Manager can show the link shape first, fade airflow for the mechanical-control beat, briefly reconnect both front corners, then remove it before the exit.

## Accuracy note

Porsche's 992 GT3 RS press material states that the double-wishbone front-axle components use teardrop-shaped profiles because the wheel housings are subject to powerful airflow; Porsche separately describes reduced pitch under braking through chassis geometry. D therefore visualizes only airflow around the installed link profile and does not imply that the aero-shaped link is itself the anti-dive mechanism.

Primary source:
https://newsroom.porsche.com/en_US/2022/products/porsche-911-gt3-rs-world-premiere-29439.html

The around-40 kg / 88 lb front-axle figure is intentionally **not** visualized here. If Manager later uses it, retain Porsche's qualifier that it is the added front-axle downforce from the aerodynamically efficient links at top speed, not per-link force.

## Proposed Manager/B interface

D does not edit shared `types.ts`. Manager can adapt B's output to:

```ts
type SuspensionFlowAnchor = {
  id: string;
  side: 'left' | 'right';
  profileBoundsCar: {
    min: [number, number, number];
    max: [number, number, number];
  };
  wheelCenterCar: [number, number, number];
  clearance?: number; // default 0.055 m
};
```

Expected integration:

```tsx
<group position={motion.root.position} rotation={motion.root.rotation}>
  <SuspensionAirflow
    frame={frame}
    fps={30}
    travelDistanceMetres={motion.distanceMetres}
    anchors={suspensionFlowAnchors}
    focusSide={revealSide}
    visibility={flowVisibility}
  />
</group>
```

The anchors above must be B-approved installed geometry. D intentionally does not embed guessed final link coordinates.

## Checks completed

Static source review:
- Y002 `AeroFlow.tsx` and `flowPaths.ts` inspected only for efficient Three/Remotion techniques and restrained green/ivory language.
- Y002 rear-wing force anchors, drag marker, DRS states and whole-car routes were not copied.
- Approved Porsche GLB/material/livery are untouched.
- D changed no manager-owned registry/composition/timeline/root files and no other specialist directory.
- Path generator is deterministic for identical anchors/distance.
- Control points cannot enter the link's clearance-expanded AABB by construction; runtime audit throws if anchor input violates invariants.
- Airflow progresses +Z -> -Z in the vehicle coordinate convention.

## Dependency gate / proof status

Final installed binding and the required 3–5 s moving airflow proof are **blocked on Manager-pinned A+B contracts**. At preparation time `TASKS.json` still has `motion_contract_sha: null` and `suspension_contract_sha: null`, and the corresponding remote specialist branches were not yet published. Producing a fake installed proof against invented geometry would violate the handoff.

Once Manager publishes A+B pins:
1. adapt B's approved installed profile bounds to `SuspensionFlowAnchor[]`;
2. mount D once inside A's car root;
3. render a 3–5 s installed front-corner proof plus native profile and whole-car frames;
4. visually inspect tube/component clearance, tracer direction, alpha/depth and readability;
5. if required, make only D-owned path/opacity refinements and push a binding/proof follow-up commit.

No full-film render is authorized for D.
