# YUNEX — engine visual refinement handoff
Implementation owner: GPT-5.6 Sol. Master retains creative direction and final approval.

## Task
Improve the existing 992 GT3 RS flat-six engine so it reads as substantial, credible machinery in medium and close technical shots. Refine the existing asset; do not rebuild the approved car, create another engine, rewrite the film, or pursue manufacturer CAD fidelity. One bounded quality pass.

## Start from canonical state
Repository: YunRah2103/yunus-video-lab.
Film branch: sol/yunex-full-film-v2, current baseline 95c34f83a338133a4aee084f3648e6c41eb30c31.
Engine source: sol/gt3rs-engine-lookdev, cars/porsche-911-gt3-rs-992/engine/. Inspect its latest commit before editing. Existing README documents build_engine.py, render_review.mjs and validation.
Create a dedicated engine-refinement branch from the film baseline and bring over only the needed engine source files if missing. Do not merge unrelated branch history.
Current engine: 39,108 triangles; 1.10 × 0.65 × 0.85 m; SHA-256 62216a409c52b2411315e8c02324e25907b3f447b44138cd26d73378dea617fd.
Approved exterior SHA-256: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb. It must remain unchanged.

## Visual direction
The current simplified engine is useful for layout explanations but needs richer surface structure and less primitive-looking housings. Make it look stronger through mass, construction detail and material contrast—not arbitrary enlargement.
Keep a clearly horizontal opposed-six silhouette, broad low banks and coherent intake/header routing.
Inspect the actual existing GLB and previews first; avoid spending the pass on details already present.
Use official Porsche engine imagery to check visible shapes and routing before adding features. Record reference links. Approximate what cannot be verified; do not invent decorative mechanical complexity.

## Priority order
1. Housings: refine crankcase/bank/cover forms with bevelled edges, plausible casting transitions, seam lines, shallow ribs and a restrained set of visible fasteners. Avoid stacked rectangular blocks.
2. Intake: strengthen the plenum silhouette and six distinct intake connections; smooth bends, credible joining flanges and restrained composite material. Keep the opposed-bank arrangement legible.
3. Headers: preserve three primaries per bank and continuous collectors; improve tube smoothness, flange joints and subtle heat-toned metal. Avoid intersecting/disconnected tubes.
4. Accessories: a few convincing pulley/bracket/cover forms and simple plausible hose/wiring routes. No full internals, microscopic bolts, turbo hardware or air-cooled fan tower.
5. Materials: distinguish cast aluminium, machined edges, dark covers/composites, steel headers and rubber. Moderate roughness variation; no chrome-all-over or noisy grunge. Geometry and lighting must do most of the work.

Use a soft triangle target of 50–75k, hard ceiling 90k unless the master approves otherwise. Reuse geometry/materials where practical; keep normals clean and export size reasonable. No unnecessary high-resolution texture pack.

## Non-negotiable asset contract
Metres; +Y up; +Z car forward; +X driver's left.
Engine_Root stays at the crankcase centre. Install at Marker_Engine_Mass = [0, 0.47, -1.78] with zero local offset. Rear axle Z approximately -1.2114.
Flywheel interface faces +Z; accessory end -Z.
Preserve independent named groups: Crankcase, Bank_L, Bank_R, Intake, Headers_L, Headers_R, Accessory_Drive, Cover_L, Cover_R, Mounts, beneath Engine_Root.
Preserve existing explode/highlight capability. Put new details beneath their relevant component group.
Stay within the existing approximate envelope; do not enlarge the asset to manufacture visual impact. Report any necessary envelope change before accepting it.
Marker location is approximate, not a validated centre of gravity. Open exterior geometry is not proof of mechanical clearance.

## Film compatibility
Check yunex/src/ModelLedVideo.tsx: its runtime converts model materials to MeshPhong for software-render performance. Better PBR materials alone may not improve the film.
Show both an isolated PBR render and an actual film-renderer preview. Ensure geometric upgrades and material contrast survive the existing runtime. Do not silently redesign the renderer.
When approved, synchronize engine.glb to yunex/public/engine.glb and verify the hashes match. No exterior changes and no full film rerender required for this handoff.

## Tools and workflow
Use Context7 for any new Three.js/GLTF API details. Use Superpowers for a short implementation plan and structured debugging where needed. GitHub is canonical. Floot/Replit only if execution genuinely benefits.
Keep the pass focused: inspect → implement highest-impact changes → render actual exported GLB → inspect → one corrective pass → deliver for master review.

## Required review package
Update engine.glb, reproducible builder, README, asset-manifest.json and validation data in the engine folder.
Render:
- isolated rear three-quarter hero;
- side and top;
- close three-quarter showing intake, bank and headers;
- installed side/top with rear axle context;
- exploded component view;
- one representative native-resolution film-renderer cutaway frame.
Provide matched before/after hero and close views using identical camera, lighting and scale. No beauty lighting that hides geometry defects.
Check six opposed cylinders/intake connections, tube continuity, clean shading, named-group independence, finite bounds, triangle budget, export reload, placement and unchanged exterior hash.
Report visible intersections honestly; do not call bounding-box overlap a clearance test.

## Done means
The engine feels convincingly mechanical at the intended viewing distance, retains an unmistakable flat-six layout, and supports cutaway/explode/highlight use without breaking existing scene placement.
Return branch, commit, preview links, exact metrics, files changed and remaining limitations. Stop for master visual review rather than expanding into another modelling marathon.
