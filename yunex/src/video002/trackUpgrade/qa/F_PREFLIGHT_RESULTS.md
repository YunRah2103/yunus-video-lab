# YUNEX 002 — Agent F track integration preflight results

Phase: `Y002-TRACK-UPGRADE-01`  
Role: `F` — track integration preflight / QA  
Base branch: `sol/yunex-002-active-aero`  
Work branch: `sol/yunex-002-track-preflight`  
Scope: A road + B furniture + C vegetation + D lighting. C final receipt was added after the initial A/B/D preflight.

## Verdict

**Overall: WARN — A/B/C/D are source-compatible and can be integrated. No specialist source-file conflict or Porsche mutation was found. Manager must replace the legacy kerb, rail, vegetation and lighting paths rather than stacking the upgrades additively.**

Do **not** mount the new components additively on top of every legacy `TechnicalTrackWorld` primitive. The current base still contains legacy kerb, rail and lighting that overlap or double the new specialist work.

## Remote inputs audited

| Input | Remote head audited | Result |
| --- | --- | --- |
| Manager base | `2e0f8fa6d9eae3ee8cef59d954766811e2841e6e` | PASS |
| A — road | `3893c35596943f8fd1eeec5017f8a4c2d6f47b34` | WARN |
| B — furniture | `adc17d6539bead1fae8d67283f565429a83de1d8` | WARN |
| C — vegetation | `10ea53862d696fbf49e67a9a6227284da0622069` | PASS/WARN |
| D — lighting | `7f95c2000eef6635b395fcc275e069f5dea3350b` | WARN |

A/B/D fork from merge-base `c7b2be16526eeed9e5635c6462887fa92be94353` and are currently **2 manager commits behind** the audited base. C is cleaner: it is **13 commits ahead / 0 behind** the audited manager base `2e0f8fa6d9eae3ee8cef59d954766811e2841e6e`. A/B/C/D implementation paths are mutually disjoint. Manager should cherry-pick the specialist source commits conservatively rather than merge divergent A/B/D branch histories.

## A — RoadSurfaces

**Status: WARN (component PASS, additive legacy integration WARN)**

PASS:
- API is compatible: `quality: 'preview' | 'final'` through `RoadQuality`, optional `seed?: number`.
- Authored in `TechnicalTrackWorld` **local** coordinates.
- Explicit manager root contract matches `position={[-1,-0.028,0]}` + `rotationY=Math.PI`.
- Procedural road textures and decor are seeded and memoized; no `Math.random`, wall-clock or per-frame generation.
- Final specialist budget is approximately **7 road/decor draw calls**, **181 instances**, and **10.67 MiB** of road texture memory including mipmaps.
- New A kerb and B furniture are separated by **0.260 m local X**; no A/B geometry overlap is predicted.

WARN:
- The current `TechnicalTrackWorld` still renders legacy `Kerb()`. A's bevelled kerb occupies the same central strip and overlaps the legacy kerb in X/Z/Y. Rendering both is an integration defect, not harmless layering.
- A asphalt and verge overlap by 0.04 m at the edge with only 0.0007 m local-Y separation. The A asphalt is also only about 0.0016 m above the legacy technical asphalt. This is analytically non-coplanar but should be inspected at native resolution for a seam/shimmer.

**Manager fix:** when A is enabled, suppress the legacy `Kerb()` in the YUNEX 002 path. Treat A as the visible authored road/kerb layer; keep any legacy road only as a non-coplanar backing surface if needed.

## B — TrackFurniture

**Status: WARN (component PASS, additive legacy integration WARN)**

PASS:
- API is compatible: `quality: 'preview' | 'final'`, optional `seed?: number`.
- Layout is seeded/memoized and contains no per-frame random rebuild.
- Authored in the same local track space as A and intended to receive the shared manager root transform exactly once.
- Final specialist budget is approximately **10 instanced draw calls**, **270 instances**, no authored texture allocation.
- Full 751-frame camera-to-target audit found **0 guardrail hits** and **0 catch-fence hits**.
- The camera ray crosses the guardrail plane on 254 frames; the closest crossing is still **0.601 m above** the guardrail/post envelope (frame 72).
- The camera ray crosses the catch-fence X plane on 218 frames; the nearest longitudinal approach misses the actual fence section by **0.636 m** (frame 0).

WARN:
- The current `TechnicalTrackWorld` still renders legacy `Rail()`. B's authored rail is centred on the same local `x=-3.62` run and physically overlaps the old guardrail through the central section.

**Manager fix:** when B is enabled, suppress the legacy `Rail()` in the YUNEX 002 path. Do not stack B over the old rail.

## C — TrackVegetation

**Status: PASS/WARN (implementation and native specialist proof PASS; legacy vegetation replacement + workflow ownership WARN)**

PASS:
- Final remote head: `10ea53862d696fbf49e67a9a6227284da0622069`.
- C is based on the current audited manager head: **13 commits ahead / 0 behind**.
- API is compatible: `quality: 'preview' | 'final'`, optional `seed?: number`.
- Layout uses a deterministic seeded LCG and is memoized by `quality + seed`; no `Math.random`, wall-clock or per-frame layout rebuild.
- Source component uses six instanced layers and no transparent foliage objects.
- Final deterministic layout contract: **44 trees, 70 shrubs, 380 grass clumps, ~6 draw calls, ~51,684 approximate triangles**.
- Protected camera corridors are encoded in the layout and the proof contract validates camera/tree and camera/shrub clearance across the timeline at five-frame intervals.
- No C source path overlaps A, B or D implementation paths.
- No central scene, camera, driving, timing, aero or Porsche path is changed.
- Porsche `model.glb` remains Git blob `d5d746376a2e6753ae1bbb1ee638c160a3ef32ab`; manifest remains `6ee6affd75bc7ea4affcf5caabee6e42554060f2`.
- GitHub Actions vegetation proof run **37446553642** completed successfully: dependency install, Porsche SHA validation, composition validation, six native 1080×1920 before/after stills, 48-frame / 30-fps native parallax render, output validation and artifact upload all passed.
- Proof artifact `y002-c-vegetation-proof` was uploaded successfully (artifact id `11403837872`).

WARN:
- The current `TechnicalTrackWorld` still renders its legacy tree/shrub group. C is a replacement foliage system; stacking it with the old foliage would create duplicate vegetation, excess cost and potentially reintroduce the faceted silhouettes C was built to remove.
- C grass centres are authored as far trackside as local X `-3.98`, while B furniture declares bounds through local X `-4.34 .. -3.48`. Their low-level envelopes therefore overlap. This is not a hero-car occlusion failure, but native integration should inspect grass intersecting posts/rail bases and prune locally if necessary.
- C added `.github/workflows/y002-c-vegetation-proof.yml`. The C handoff assigns implementation ownership to `TrackVegetation.tsx` + `vegetation/*`, while workflow paths are manager/E territory. The workflow was useful and passed, but the manager should integrate the C **source implementation** independently and only retain the workflow if intentionally desired.

**Manager fix:** mount `<TrackVegetation quality="final" seed={2103}/>` inside the same shared local track root as A/B, suppress the old `layout.shrubs/layout.trees` foliage group for the YUNEX 002 upgraded path, and inspect the grass/rail base region in the combined native proof.

## D — TrackLighting

**Status: WARN (component PASS, manager wiring required)**

PASS:
- API is compatible: `quality: 'preview' | 'final'`, optional `seed?: number`.
- D follows `rootPoseAt(frame)` in world space; the moving key-light target and contact catcher follow the Porsche.
- Sky/contact textures are deterministic.
- PMREM creation is mount/effect scoped and is not keyed to frame.
- D does not traverse or rewrite Porsche materials.

WARN:
- D is **not** a child of the shared rotated track root. It must mount at scene/world level because it consumes the Porsche world-space root directly.
- The audited integrated scene still has its old hemisphere + two directional lights, sets exposure to `1.02`, sets a solid background, disables Porsche `castShadow`, and does not enable ThreeCanvas shadows. Adding D without replacing that setup would double-light the car and leave D's shadow contract incomplete.
- D adds one contact draw plus a 2048 shadow map/shadow pass. Source sky + contact textures are only about **0.22 MiB**, but the 2048 shadow target and extra Porsche shadow render are the likely new render-time hotspot; PMREM/shadow-target GPU memory is implementation dependent.

**Manager fix:** replace rather than stack the legacy scene lighting/background. Enable renderer shadows + `PCFSoftShadowMap`, use ACES exposure `0.94`, set Porsche mesh `castShadow=true` while preserving all material values, keep road/track receivers enabled, and mount `<TrackLighting />` at scene/world level.

## Shared coordinates / road-barrier geometry

Shared A/B/C root:

```tsx
<group position={[-1, -0.028, 0]} rotation={[0, Math.PI, 0]}>
  <RoadSurfaces quality="final" seed={2103} />
  <TrackFurniture quality="final" seed={2103} />
  <TrackVegetation quality="final" seed={2103} />
</group>
```

Do **not** place D inside that group.

Analytic transformed coverage for A road + verge is world X `-15.2 .. 15.0`, world Z `-38 .. 42`. Across frames `0..750`, camera and target remain inside that authored ground coverage with a minimum margin of **6.600 m** (frame 285). No camera/target ray endpoint drops through the road plane.

## Integration conflict audit

PASS:
- A/B/C/D implementation changed-file sets are disjoint.
- No specialist implementation changes `Video002Integrated.tsx`, `TrackPreview.tsx`, camera/story/timing/aero files or Porsche assets.
- A road vs B furniture has positive physical separation at the kerb/rail side.

WARN:
- A/B/D are 2 manager commits behind the audited active-aero head; C is 0 behind. A/B/D history divergence is not a source-file collision.
- Legacy base primitives conflict with new A/B/C/D if the manager simply appends components.
- C's proof workflow is outside the C source-ownership contract; integrate it only deliberately.

Recommended manager integration order:
1. Cherry-pick A/B/C/D specialist **source** commits conservatively.
2. Create/use the manager-owned shared track root once for A/B/C.
3. Suppress legacy `Kerb()`, `Rail()` and legacy tree/shrub foliage when A/B/C are active.
4. Mount D at world level and replace old lighting/background/renderer settings as described above.
5. Run this preflight again with C enabled.
6. Run the combined native same-frame/motion proof before the full 751-frame render; specifically inspect road edge seam, rail parallax, grass/rail-base intersections, foliage hero clearance and Porsche contact/shadow quality.

## Porsche lock

PASS:
- Approved SHA-256 in the manifest remains `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- `model.glb` Git blob is identical on base/A/B/C/D: `d5d746376a2e6753ae1bbb1ee638c160a3ef32ab` (10,512,896 bytes).
- Manifest Git blob is identical on base/A/B/C/D: `6ee6affd75bc7ea4affcf5caabee6e42554060f2`.
- None of the A/B/C/D implementation diffs touches the Porsche source, manifest, staged model or protected camera/aero files.

## Rerunnable tooling

From a checkout with the specialist refs fetched:

```bash
node yunex/src/video002/trackUpgrade/qa/preflight.cjs
```

Machine-readable output:

```bash
node yunex/src/video002/trackUpgrade/qa/preflight.cjs --json
```

The all-frame geometric audit can run independently:

```bash
node yunex/src/video002/trackUpgrade/qa/sightline-audit.cjs
```

C is now complete. Include its final ref in the rerunnable preflight:

```bash
node yunex/src/video002/trackUpgrade/qa/preflight.cjs --c=sol/yunex-002-track-vegetation
```

The C option performs protected-path, branch-divergence, file-conflict and obvious determinism checks. The successful C native proof is recorded above; the manager still owns the combined A/B/C/D visual integration QA.

## Validation performed for this F pass

- Remote branch/file audit through the GitHub repository: PASS.
- Exact A/B/C/D current heads recorded: PASS.
- Porsche model/manifest Git-object identity across base/A/B/C/D: PASS.
- C dedicated native proof workflow run 37446553642: PASS (all steps successful, proof artifact uploaded).
- `sightline-audit.cjs` syntax check: PASS.
- Independent execution of the 751-frame geometric audit: PASS.
- `preflight.cjs` syntax check: PASS.
- Native integrated render: **not performed by F**; F is preflight-only and does not edit/integrate the final scene.

## Final manager decision

**READY FOR INTEGRATION: YES. A/B/C/D are all available. Required manager actions: replace legacy kerb, replace legacy rail, replace legacy foliage, and replace/wire legacy lighting.**

The specialist phase no longer has a C dependency. The next blocking work is manager integration + combined native proof, followed by E's native final render/audio pipeline.
