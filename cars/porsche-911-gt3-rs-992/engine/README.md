# YUNEX · 992 GT3 RS flat-six engine add-on

Status: **rough look-development for Astra review**.

This folder contains one separate reusable engine asset for the approved `cars/porsche-911-gt3-rs-992/model.glb`. The exterior car GLB is not edited, rebuilt, or replaced.

## What this represents

A deliberately simplified visual representation of the water-cooled, naturally aspirated 4.0-litre Porsche flat-six used for YUNEX technical explainers. It is designed for medium and selected close shots, cutaways, component highlighting, placement behind the rear axle, and exploded-view animation.

It is **not Porsche CAD**, a measured engine package, a mechanical simulation, or a model of internal valvetrain/piston motion.

The silhouette and readable components prioritize:
- low, broad horizontally opposed six-cylinder layout;
- longitudinal crankshaft;
- closed water-cooled bank/head housings;
- upper composite intake with six individual throttle/runner connections;
- three exhaust primaries per bank into collectors underneath;
- restrained accessory drive, mounts, pipes, ribs, flange edges, and fasteners.

No V layout, turbochargers, classic air-cooled fan tower, exposed cooling-fin treatment, gearbox, or internal mechanism is included.

## Coordinate / installation contract

- Units: metres.
- Up: `+Y`.
- Car forward: `+Z`.
- Driver's left: `+X`.
- `Engine_Root`: crankcase centre.
- Flywheel/transmission interface: `+Z` end.
- Accessory end: `-Z` end.
- Parent to the existing car marker `Marker_Engine_Mass`.
- Current marker translation: `[0, 0.47, -1.78]` m.
- Current local installation offset: `[0, 0, 0]` m.

The rear axle centre is approximately `Z = -1.2114 m`. The engine marker is intentionally approximate and must not be presented as a validated centre of gravity.

## Named groups

`Engine_Root`, with direct reusable children:
- `Crankcase`
- `Bank_L`
- `Bank_R`
- `Intake`
- `Headers_L`
- `Headers_R`
- `Accessory_Drive`
- `Cover_L`
- `Cover_R`
- `Mounts`

`asset-manifest.json` records the local explode vectors. These are conservative starting transforms for YUNEX animation, not engineering assembly paths.

## Current look-development asset

- Engine envelope: approximately **1.10 m wide × 0.85 m long × 0.65 m high**.
- Local Y bounds: approximately **-0.24 m to +0.41 m**.
- Triangle count: **29,116**.
- Reusable PBR materials: cast aluminium, brushed aluminium, dark composite, stainless header, dark steel, restrained rubber.
- Textures: none required.
- Self-contained GLB: `engine.glb`.

The two current review images are intentionally limited to the first approval gate:
- `renders/lookdev_isolated.png`
- `renders/lookdev_installed.png`

The installed image uses the canonical car dimensions, exact rear-wheel pivots, and `Marker_Engine_Mass` as a fit proxy because this pass is only checking engine silhouette, scale, and placement. It does **not** replace or modify the approved exterior model.

After Astra accepts the direction, the next pass should refine only silhouette, component readability, materials, and fit, then add the required rear-three-quarter, side, top, installed and exploded review renders.

## Rebuild

Requires Python with `numpy` and `trimesh`.

```bash
python build_engine.py
```

The script rebuilds `engine.glb`, reloads it, verifies finite bounds and all required named groups, then rewrites `asset-manifest.json` including the SHA-256 hash.

## Three.js installation pattern

Load the car and engine as separate GLBs. Locate `Marker_Engine_Mass` in the existing car scene, then parent the engine scene beneath that marker with zero local position/rotation unless a reviewed fit correction is documented.

Do not bake the engine into or replace the approved exterior GLB.

## Exterior attribution / licence

The approved Porsche exterior asset in the parent folder remains the existing Ddiaz Design / CSR2-derived production-prepared model under its documented **CC BY-NC-SA 4.0** terms. This engine add-on does not change that asset or its attribution. Any combined render that includes the exterior must preserve the parent asset's attribution and licence requirements.

Porsche names and marks belong to their respective owners. No affiliation is implied.
