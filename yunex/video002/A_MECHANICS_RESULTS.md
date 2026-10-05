# YUNEX 002 — Agent A mechanics results

Status: **IMPLEMENTED**

## Scope completed

- Audited the exact locked `model.glb` rather than trusting the `Wing_Flap` node name.
- Added a deterministic runtime rear active-aero rig that separates the real wide upper plane from narrow/vertical fragments accidentally captured by the old height-based asset split.
- Keeps the rear main plane, swan-neck supports and fixed fragments stationary while the identified upper plane rotates around the existing spanwise local-X origin.
- Added deterministic `highDownforce`, `drs` and `airbrake` presentation states plus neutral-relative smooth transitions. Pose degrees are explicitly illustrative, not Porsche-published specifications.
- Added small runtime-only front active-aero explanatory proxies for the two side flap locations. They do not alter or replace the approved exterior GLB.
- Added a self-contained native Remotion proof entry and render script without editing the shared `src/index.tsx`.
- Added contract tests for neutral pose, transition clamping, deterministic repeated state, non-cumulative rotation, fixed-vs-moving partition, and neutral restore.

## Locked asset / geometry audit

Approved exterior SHA-256 verified from the recovered production pack:

`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

The inspected `Wing_Flap` runtime geometry contains a mechanically mixed selection. The runtime connected-component classifier found:

- moving upper-plane triangles: **6,166**
- fixed/misclassified fragments: **3,422**
- moving fraction: **0.6430955361**
- connected components: **307** total / **284** moving / **23** fixed
- existing visual hinge in car coordinates: **[0.0, 1.24, -1.8]**
- parent world scale: **[1, 1, 1]** (uniform)
- moving bounds in car coordinates: min **[-0.85784453, 1.21384128, -2.20465537]**, max **[0.85910428, 1.35173860, -1.79484148]**

Direct indexed-triangle inspection totals **9,588** `Wing_Flap` triangles, matching the historical manifest. The important finding is that the node is mechanically mixed: its name alone is not enough to decide what should move.

## Integration API

```ts
const rig = createActiveAeroRig(car);
rig.apply({mode: 'highDownforce', transition: 1});
rig.apply({mode: 'drs', transition: 1});
rig.apply({mode: 'airbrake', transition: 1});
```

Optional `rearAngle` / `frontAngle` overrides are degrees relative to the neutral asset pose. `blendAeroModes(from, to, progress)` returns a deterministic intermediate state.

For Agent C / integration, `rig.hingeCar`, `rig.movingBoundsCar`, `rig.fixedBoundsCar` and `rig.audit` expose the actual runtime clearance envelope and partition data. `apply()` is absolute from a captured neutral rotation, so revisiting the same frame/state does not accumulate rotation.

The front explanatory component is:

```tsx
<FrontFlaps state={state} />
```

It is tagged in `userData` as a simplified explanatory proxy and remains separate from the approved model.

## Verification performed in this session

- Exact locked GLB SHA-256: **pass**.
- Direct connected-component geometry audit on the locked GLB: **pass**.
- Uniform parent-scale check from the production asset: **pass**.
- TypeScript/TSX syntax transpilation for all Agent A modules: **pass**.
- Standalone exact-GLB mechanics proof: 1080×1920, 30 fps, H.264, 60 frames / 2.0 s; FFmpeg full decode: **pass**.
- Source GLB hash after proof work: **unchanged**.

The chat execution container does not have the project npm runtime installed and cannot reach the network, so the checked-in native Remotion proof entry itself could not be executed here. `a_render_proof.cjs` stages and re-verifies the exact exterior, renders the native proof with the existing project runtime, extracts inspection frames, decodes the MP4 and verifies the GLB again. Run that once in the normal YUNEX checkout before the Manager's mechanics review gate.

## Known limitations

- This is production-asset mechanics, not manufacturer CAD. The retained hinge is validated against the identified upper-plane cluster but remains an illustrative hinge from the prepared model.
- The front active elements are runtime explanatory proxies because the source exterior does not expose clean separately addressable front actuators.
- The local fallback proof is for mechanics inspection only; final lookdev belongs to the native Remotion proof/integrated film.
