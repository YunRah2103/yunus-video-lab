# YUNEX 002 — A_ROAD results

Status: **IMPLEMENTED / SOURCE COMPLETE**
Branch: `sol/yunex-002-track-road`
Locked base: `c7b2be16526eeed9e5635c6462887fa92be94353`

## Delivered

- `../RoadSurfaces.tsx` — opt-in road upgrade component with the required API:
  `<RoadSurfaces quality="preview"|"final" seed={number} />`
- `layout.ts` — deterministic track-local layout, coverage bounds and cost model.
- `proceduralRoadTexture.ts` — authored deterministic asphalt and soil/grass-verge textures.
- `roadSurfaceTests.ts` — deterministic layout, layer spacing, camera/travel coverage, tyre-lane and memory-budget contract checks.
- `RoadSurfaceProof.tsx`, `road_proof_entry.tsx`, `render_road_proof.cjs` — isolated native same-frame before/after proof harness.
- `PROVENANCE.md` — explicit no-third-party-texture provenance.

No central registry, `TrackPreview.tsx`, `Video002Integrated.tsx`, Porsche asset, barrier or vegetation file was edited.

## Visual implementation

- Asphalt uses centimetre-scale procedural grain plus broad low-frequency tonal variation.
- Large deterministic roughness/tone patches break repetition without obvious tiled rectangles.
- Sparse paired rubber streaks sit along the active car lane.
- The visible road edge receives a deterministic soil/grass-verge texture and sparse gravel breakup.
- Kerbs are actual raised bevelled extrusions rather than flat painted boxes.
- Alternating ivory/red kerb paint has restrained per-segment wear variation plus small physical wear chips.
- Coverage is extended well beyond the active 5.15 m car travel so the seven approved camera beats do not fall back to a flat grey void.

## Coordinate / integration contract

The module is authored in **TechnicalTrackWorld local coordinates**.

Manager integration should mount it inside the shared YUNEX 002 track root:

```tsx
<group position={[-1, -0.028, 0]} rotation={[0, Math.PI, 0]}>
  <RoadSurfaces quality="final" seed={2103} />
</group>
```

`RoadSurfaces` deliberately does **not** apply that root transform itself, preventing the double-transform failure called out in the handoff.

## Determinism / performance

All procedural layout and textures are seed-driven and created through `useMemo`; no per-frame random texture, geometry or PMREM rebuild is introduced.

Estimated A_ROAD final cost:
- 2 × 1024² RGBA procedural textures
- ~10.67 MiB including mipmaps
- 181 deterministic instances
- 5 instanced decor draw calls + 2 main surface planes
- bevel segments: 2 final / 1 preview

Preview cost:
- 2 × 512² RGBA textures
- ~2.67 MiB including mipmaps
- 136 deterministic instances

## QA performed here

Analytical checks against the current `poseFor()` / `rootPoseAt()` path were run for representative frames 36, 119, 225, 345, 472, 600 and 705:
- car remains on authored asphalt: PASS
- camera/target ground coverage remains inside authored asphalt+verge extent: PASS
- car lane clears the kerb and opposite road boundary: PASS
- kerb coverage spans the active travel region: PASS
- layer heights are separated from the legacy technical surface to avoid coplanar z-fighting: PASS
- final texture/instance budget remains under the contract thresholds: PASS

The branch diff against the locked base contains A_ROAD-owned files only: PASS.

## Native proof status

The native proof harness is complete and renders four true 1080×1920 same-camera/same-car-pose stills:
- close before — source frame 225
- close after — source frame 225
- wide before — source frame 600
- wide after — source frame 600

It also creates close/wide side-by-side comparison PNGs and verifies the approved Porsche SHA-256 before and after rendering.

**The proof was not executed from this chat runtime.** The local execution container has no project npm runtime and cannot resolve GitHub/npm, while the available GitHub connector does not expose workflow dispatch. The manager handoff also reserves workflow/render-queue paths for Agent E, so A_ROAD did not add an out-of-scope Actions workflow or fake a render.

Run from the normal YUNEX checkout / manager render queue:

```bash
node src/video002/trackUpgrade/road/render_road_proof.cjs
```

Expected proof output directory:
`yunex/out/track-upgrade/a-road/`

## Locked asset

Approved Porsche exterior remains untouched:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

## Known limitation

A_ROAD is ready for manager integration, but visual approval must wait for the native close/wide proof because this agent cannot truthfully claim to have inspected pixels that were not renderable in the current runtime.
