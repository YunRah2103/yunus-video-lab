# YUNEX 002 — Agent F track integration preflight results

Phase: `Y002-TRACK-UPGRADE-01`  
Role: `F` — track integration preflight / QA  
Base branch: `sol/yunex-002-active-aero`  
Work branch: `sol/yunex-002-track-preflight`  
Scope: A road + B furniture + D lighting. C vegetation is intentionally not required for this pass.

## Verdict

**Overall: WARN — A/B/D are source-compatible and can be integrated, but only with the manager-owned replacement/wiring fixes below. There is no specialist-to-specialist same-file conflict and no Porsche mutation.**

Do **not** mount the new components additively on top of every legacy `TechnicalTrackWorld` primitive. The current base still contains legacy kerb, rail and lighting that overlap or double the new specialist work.

## Remote inputs audited

| Input | Remote head audited | Result |
| --- | --- | --- |
| Manager base | `2e0f8fa6d9eae3ee8cef59d954766811e2841e6e` | PASS |
| A — road | `3893c35596943f8fd1eeec5017f8a4c2d6f47b34` | WARN |
| B — furniture | `adc17d6539bead1fae8d67283f565429a83de1d8` | WARN |
| D — lighting | `7f95c2000eef6635b395fcc275e069f5dea3350b` | WARN |

A/B/D all fork from merge-base `c7b2be16526eeed9e5635c6462887fa92be94353` and are currently **2 manager commits behind** the audited base. Their changed paths are disjoint and remain inside their owned specialist areas. Manager should cherry-pick the specialist implementation commits; do not merge/rebase whole divergent branch histories just to gain the two routing/documentation commits.

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

Shared A/B root:

```tsx
<group position={[-1, -0.028, 0]} rotation={[0, Math.PI, 0]}>
  <RoadSurfaces quality="final" seed={2103} />
  <TrackFurniture quality="final" seed={2103} />
  {/* C vegetation can join this local root after its own receipt/QA. */}
</group>
```

Do **not** place D inside that group.

Analytic transformed coverage for A road + verge is world X `-15.2 .. 15.0`, world Z `-38 .. 42`. Across frames `0..750`, camera and target remain inside that authored ground coverage with a minimum margin of **6.600 m** (frame 285). No camera/target ray endpoint drops through the road plane.

## Integration conflict audit

PASS:
- A/B/D changed-file sets are disjoint.
- No specialist branch changes `Video002Integrated.tsx`, `TrackPreview.tsx`, camera/story/timing/aero files or Porsche assets.
- A road vs B furniture has positive physical separation at the kerb/rail side.

WARN:
- Each specialist branch is 2 manager commits behind the audited active-aero head. This is history divergence, not a source-file collision.
- Legacy base primitives conflict with new A/B/D if the manager simply appends components.

Recommended manager integration order:
1. Cherry-pick A/B/D specialist source commits only.
2. Create/use the manager-owned shared track root once for A/B (and later C).
3. Suppress legacy `Kerb()` and `Rail()` when A/B are active.
4. Mount D at world level and replace old lighting/background/renderer settings as described above.
5. Run this preflight again.
6. Run native same-frame visual QA before the full 751-frame render; specifically inspect road edge seam, rail parallax and Porsche contact/shadow quality.

## Porsche lock

PASS:
- Approved SHA-256 in the manifest remains `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- `model.glb` Git blob is identical on base/A/B/D: `d5d746376a2e6753ae1bbb1ee638c160a3ef32ab` (10,512,896 bytes).
- Manifest Git blob is identical on base/A/B/D: `6ee6affd75bc7ea4affcf5caabee6e42554060f2`.
- None of the A/B/D branch diffs touches the Porsche source, manifest, staged model or protected camera/aero files.

## Rerunnable tooling

From a checkout with the four refs fetched:

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

When C arrives, F does not need to be rewritten. Add its ref for generic protected-path, branch-divergence, file-conflict and obvious determinism checks:

```bash
node yunex/src/video002/trackUpgrade/qa/preflight.cjs --c=sol/yunex-002-track-vegetation
```

The C option intentionally does not make vegetation-specific visual claims; the manager still owns final C visual integration QA.

## Validation performed for this F pass

- Remote branch/file audit through the GitHub repository: PASS.
- Exact A/B/D current heads recorded: PASS.
- Porsche model/manifest Git-object identity across base/A/B/D: PASS.
- `sightline-audit.cjs` syntax check: PASS.
- Independent execution of the 751-frame geometric audit: PASS.
- `preflight.cjs` syntax check: PASS.
- Native integrated render: **not performed by F**; F is preflight-only and does not edit/integrate the final scene.

## Final manager decision

**READY FOR INTEGRATION: YES, with the three required manager fixes (replace legacy kerb, replace legacy rail, replace/wire legacy lighting).**

There is no reason to wait for C before integrating or validating A/B/D source. Re-run the preflight with `--c=...` once C is available, then do the manager-owned native visual proof.
