# YUNEX 002 — Agent B Track Furniture QA

Branch: `sol/yunex-002-track-furniture`  
Locked base: `c7b2be16526eeed9e5635c6462887fa92be94353`  
Approved Porsche SHA-256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

## Scope completed

- Added isolated `TrackFurniture` module only.
- Added corrugated/W-beam-style guardrail treatment using a recessed panel, two raised longitudinal ridges and central valley.
- Added real vertical steel posts, paired flanges, spacer blocks, joint plates and bolt heads.
- Added one restrained catch-fence section behind the rail; no grandstands, billboards, neon, HUD or track clutter.
- All geometry is authored from Three.js primitives. No third-party texture or mesh asset was introduced.
- Porsche, cameras, timing, aero, typography, audio and central scene files were not edited.

## Integration contract

`TrackFurniture` accepts exactly the specialist contract:

```tsx
<TrackFurniture quality="preview" | "final" seed={2103} />
```

The component is authored in the same **local track coordinate space** as `TrackEnvironment`. The manager must apply the YUNEX 002 track root transform once:

```tsx
<group position={[-1, -0.028, 0]} rotation={[0, Math.PI, 0]}>
  <TrackFurniture quality="final" seed={2103} />
</group>
```

Do not apply that transform inside `TrackFurniture` and again outside it.

Local authored bounds:

- X: `-4.34 .. -3.48`
- Y: `-0.22 .. 2.25`
- Z: `-17.20 .. 20.60`
- rail center: X `-3.62`, Y `0.48`

After the YUNEX 002 root transform these sit on the same side of the road as the existing technical-track rail.

## Determinism and render cost

There is no per-frame random generation. Layout is memoized from `quality + seed`.

Approximate instance/draw-call budget at seed 2103:

| Quality | Instances | Draw calls |
| --- | ---: | ---: |
| preview | 187 | 10 |
| final | 270 | 10 |

The module reuses one unit box geometry/material per furniture family and one instanced cylinder family for bolts. Instance matrices are written once and their bounding spheres are recomputed after `setMatrixAt`.

## Sightline / occlusion audit

An analytic 751-frame audit was run against the approved `poseFor()` driving/camera path plus the manager's current DRS, airbrake and payoff camera overrides from `Video002Integrated.tsx`.

Checked every frame `0..750` for camera-to-target intersections with:

- guardrail/post envelope
- catch-fence plane and height range

Result: **0 camera-to-car sightline intersections found**.

This is a geometry/camera audit, not a substitute for visual review of the native render.

## Review harness

The isolated review entry point is:

`src/video002/trackUpgrade/furniture/review-entry.tsx`

It provides:

- `YUNEX-002-FURNITURE-QUARTER-BEFORE`
- `YUNEX-002-FURNITURE-QUARTER-AFTER`
- `YUNEX-002-FURNITURE-SIDE-BEFORE`
- `YUNEX-002-FURNITURE-SIDE-AFTER`
- `YUNEX-002-FURNITURE-PARALLAX` — 91 frames / 30 fps

Before rendering, the approved Porsche must be staged exactly as the existing YUNEX workflows do:

```bash
cp ../cars/porsche-911-gt3-rs-992/model.glb public/model.glb
printf '%s  %s\n' '1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb' public/model.glb | sha256sum -c -
```

Then render natively from `yunex/`:

```bash
npx remotion still src/video002/trackUpgrade/furniture/review-entry.tsx YUNEX-002-FURNITURE-QUARTER-BEFORE out/furniture-quarter-before.png --gl=swangle --timeout=120000
npx remotion still src/video002/trackUpgrade/furniture/review-entry.tsx YUNEX-002-FURNITURE-QUARTER-AFTER out/furniture-quarter-after.png --gl=swangle --timeout=120000
npx remotion still src/video002/trackUpgrade/furniture/review-entry.tsx YUNEX-002-FURNITURE-SIDE-BEFORE out/furniture-side-before.png --gl=swangle --timeout=120000
npx remotion still src/video002/trackUpgrade/furniture/review-entry.tsx YUNEX-002-FURNITURE-SIDE-AFTER out/furniture-side-after.png --gl=swangle --timeout=120000
npx remotion render src/video002/trackUpgrade/furniture/review-entry.tsx YUNEX-002-FURNITURE-PARALLAX out/furniture-parallax.mp4 --gl=swangle --concurrency=2 --codec=h264 --crf=17 --timeout=120000
```

## Validation performed in this agent environment

- TypeScript transpile/syntax check of `TrackFurniture.tsx`: **PASS** using TypeScript 5.8.3.
- Three.js instancing API checked against current documentation: `setMatrixAt`, `instanceMatrix.needsUpdate` and bounding-sphere recomputation are used correctly.
- 751-frame analytic sightline audit: **PASS**, zero intersections.
- Terminal partial guardrail segment was corrected so authored geometry stays inside the declared Z coverage.

## Remaining manager-owned check

The manager/E render queue must execute the provided native review entry and visually inspect the actual quarter, side and parallax outputs before final integration. This branch intentionally does not modify global workflow files or the central `Video002Integrated.tsx` wiring.
