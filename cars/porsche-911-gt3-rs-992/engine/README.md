# YUNEX · 992 GT3 RS flat-six engine add-on

Status: **targeted finishing pass for master review**.

This folder contains one separate reusable engine asset for the approved `cars/porsche-911-gt3-rs-992/model.glb`. The exterior is loaded read-only for installed previews and is never rebuilt, replaced, or baked together with the engine.

## Scope

This remains a deliberately simplified water-cooled, naturally aspirated 4.0-litre Porsche flat-six for YUNEX technical explainers, not Porsche CAD or a mechanical simulation. The refinement preserves the existing opposed-bank layout and component groups while improving only large visible housings, six intake connections, continuous 3-into-1 headers, PBR review rendering and installation review.

No V layout, turbochargers, air-cooled fan tower, gearbox, pistons, valvetrain or tiny-detail pass is included.

## Coordinate / installation contract

- Metres; `+Y` up, `+Z` car forward, `+X` driver's left.
- `Engine_Root` is the crankcase centre.
- Flywheel/transmission interface faces `+Z`; accessory end faces `-Z`.
- Install at `Marker_Engine_Mass = [0, 0.47, -1.78]` m with local offset `[0, 0, 0]`.
- Rear axle centre is approximately `Z = -1.2114 m`.
- The marker is approximate, not a validated centre of gravity.

## Named groups

`Engine_Root` with direct children: `Crankcase`, `Bank_L`, `Bank_R`, `Intake`, `Headers_L`, `Headers_R`, `Accessory_Drive`, `Cover_L`, `Cover_R`, `Mounts`.

`asset-manifest.json` records local explode vectors. `validation.json` verifies the exact exported GLB, direct parenting and independent component translations.

## Exact generated metrics

<!-- BEGIN GENERATED METRICS -->
- Engine dimensions (X × Y × Z): **1.1000 × 0.6500 × 0.8500 m**.
- Local Y bounds: **-0.2400 m to 0.4100 m**.
- Triangle count: **58,112**.
- Geometry primitives: **126**.
- GLB NORMAL accessors: **all primitives present / POSITION counts matched**.
- Engine SHA-256: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`.
- Approved exterior SHA-256 before/after: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb` / `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb` (**unchanged**).
- Installation: `Engine_Root` at `Marker_Engine_Mass` = `[0, 0.47, -1.78]` m; local offset `[0, 0, 0]`.
<!-- END GENERATED METRICS -->

## Master-review renders

Three.js renders the **actual exported GLB** with its PBR materials, fixed cameras, restrained environment light, a shadow-casting studio key and contact shadow. Installed views suppress obstructing interior/rear layers in memory, keep only a restrained body outline plus opaque wheels/brakes, frame the rear bay large, and add a small full-car context inset. The exterior GLB itself is never edited.

- `renders/review_isolated_rear_three_quarter.png`
- `renders/review_installed_side.png`
- `renders/review_installed_top.png`
- `renders/engine_turntable.mp4` — 6-second shading turntable from the exact exported GLB.
- `REVIEW_NOTE.md` — concise master-review checks and the unresolved fit statement.

Side/top views show the rear axle and actual exterior surfaces for fit review. Bounding-box overlap is not treated as proof of clearance; unresolved visible intersections must be reported honestly.

## Rebuild / validate

```bash
python -m pip install numpy==2.3.5 trimesh==4.11.1
python build_engine.py
```

The build reloads the exact GLB and checks finite metre-scale bounds, required groups, direct parenting, independent translations and the 25–50k triangle budget. It compares the approved exterior SHA-256 before/after and fails if the exterior changes.

## Render

From repository root:

```bash
npm install --prefix cars/porsche-911-gt3-rs-992/engine --no-save three@0.180.0 playwright@1.55.0
npx --prefix cars/porsche-911-gt3-rs-992/engine playwright install chromium
python -m http.server 8000 --bind 127.0.0.1
node cars/porsche-911-gt3-rs-992/engine/render_review.mjs
```

## Exterior attribution / licence

The approved Porsche exterior remains the existing Ddiaz Design / CSR2-derived production-prepared model under its documented **CC BY-NC-SA 4.0** terms. This add-on does not change the exterior asset or attribution. Porsche names and marks belong to their respective owners; no affiliation is implied.
