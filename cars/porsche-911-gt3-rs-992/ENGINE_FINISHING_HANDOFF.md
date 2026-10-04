# YUNEX engine — targeted finishing pass
Master reviewed branch sol/gt3rs-engine-lookdev at abb20774ef9cdfa757bb65f74de891f4297e47ff.

## Continue, do not restart
Repo: YunRah2103/yunus-video-lab. Continue the existing engine branch and inspect newer commits before editing.
Keep the approved exterior unchanged, engine scale/orientation, Marker_Engine_Mass placement and all existing addressable groups. Read ENGINE_SOL_HANDOFF.md for the asset contract.
Current result is improved but not approved for premium close shots. Keep its continuous headers, softened housings and 34,668-triangle base. No full rebuild, internal mechanics or tiny-detail pass.

## Fix these visible problems
1. **Shading first.** Curved intake pipes, headers and plenum crown show strong polygon bands in review_isolated_rear_three_quarter.png. Inspect the actual GLB NORMAL accessors and vertex sharing. Export smooth normals on curved surfaces, preserve hard seams/cap boundaries on housings, and verify outward tube winding. Normalizing existing vectors does not smooth flat normals. Fix the exported asset, not only the viewer. Do not simply add thousands of polygons.
2. **Connected intake.** The six runner ends appear as capped diagonal stubs above the banks. Inspect their endpoints and route all six visibly from plenum through throttle bodies into plausible head ports. Conceal end caps inside connected housings; no floating ends or exposed solid disks at joins.
3. **Materials and light.** Dark composite currently reads grey and most metal looks chalky. Check the exported baseColorFactor values against the intended Python values before adjusting lighting. Keep composite/rubber distinctly dark and metal believable. Reduce excessive fill, use controlled studio reflections and a contact shadow. review.html enables shadows but its lights do not cast them; make shadow setup functional. Preserve readable midtones instead of compensating with a black background.
4. **Accessory belt.** Replace the three round rods with one simple continuous flat belt following pulley tangents and wraps. Keep the current pulleys. This is a large visible silhouette correction, not a detail expansion.
5. **Installed presentation.** The full-car side/top renders show too many transparent layers; the top view especially hides the engine. In the viewer only, hide obstructing rear deck/undertray/interior meshes deliberately, retain a restrained body outline and opaque wheels, and show an opaque engine. Keep full-car context in a small inset or companion view, then frame the rear bay large enough to assess it. Label REAR AXLE and ENGINE with legible leaders. Inspect actual shell surfaces for visible intersections; record unresolved fit issues. Do not claim a clearance pass from marker placement or bounds alone.

## Outputs and limits
Return:
- Updated engine.glb plus build source, manifest, README and validation.
- Three new PNGs: isolated rear three-quarter; clear installed side; clear installed top.
- A short 5–7 second engine turntable MP4 rendered from the exact exported GLB to check shading across angles.
- A concise review note listing changed files, actual triangle count, load/normal/component checks, exterior before/after hashes and any unresolved fit issue.

Use Context7 for current Three.js/GLTF API questions and Superpowers for structured debugging. Fix causes before adding geometry.
Stay within 25–50k triangles; no new car, no extra engine variants and no full video yet. No need to run unrelated project tests.
Commit to the existing implementation branch. Stop for master review; do not merge or label the engine approved.
Once approved, the next task is the short hero-orbit to engine-cutaway proof in yunex/SOL_HANDOFF_MODEL_LED_V2.md.
