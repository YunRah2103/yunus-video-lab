# YUNEX — focused engine refinement handoff

## Continue existing work
Repo: YunRah2103/yunus-video-lab.
Implementation branch: sol/gt3rs-engine-lookdev.
Reviewed commit: 396736154ca54d378969dbc94fe0b393ca9e6326.
Continue that branch; inspect any newer changes before editing. Do not rebuild or modify the approved exterior model. Read ENGINE_SOL_HANDOFF.md for the existing coordinate and component contract.

## Master review
The current engine is a useful rough base, not approved for production close-ups.
Keep the opposed banks, six intake connections, separate components, metre scale, +Y up / +Z forward, and Marker_Engine_Mass installation.
Observed problems:
- Large sharp rectangular block, bank and cover shapes look unfinished.
- Exhaust pipes consist of angular capped cylinder segments.
- render_lookdev.py uses Matplotlib face colours and triangle edges, not the GLB's PBR materials. Its dark, cluttered images cannot establish material quality or installation clearance.
- README triangle count (29,116) disagrees with the manifest (29,308).

## One bounded pass
1. Replace the preview pipeline with deterministic Three.js GLB rendering. Use Context7 for current APIs. Use a soft studio environment, controlled key/rim light, appropriate colour management, smooth normals and clean framing. Render the actual exported GLB. Remove visible triangle edges. Inspect these results before adding geometry.
2. Refine only the large visible shapes: modest bevels, more credible crankcase/bank/cover profiles, readable opposed banks and six intake connections. Preserve the current design and groups. No internal mechanisms, tiny bolt work, manufacturer CAD claims or new car.
3. Replace segmented headers with smooth continuous tube paths: three primary pipes per bank into a believable collector. Avoid capped joints at every bend. Keep sufficient clearance between neighbouring parts.
4. Produce three review images: isolated rear three-quarter hero, installed orthographic side, installed top. In installation views retain opaque wheels and a clean ghosted/cutaway body. Show the rear axle and engine clearly; do not remove random mesh triangles. Fit the complete subject in frame.
5. Verify the exact exported GLB: finite metre-scale bounds, required groups and transforms, sensible normals/materials, functioning independent component translations, and successful Three.js loading. Check visible fit against the actual car surfaces in side/top views; bounding-box overlap alone is not proof of clearance. Record any unresolved intersections honestly.
6. Regenerate manifest and correct README from actual measurements. Record engine dimensions, triangle count, file hash, installation transform and reproducible build/render commands. Compare the exterior model hash before/after and confirm it is unchanged.

## Budget and stop point
Aim near the existing 29k triangles; retain the original 25–50k target unless a clear visual need justifies otherwise. Prefer silhouette, pipes, materials and lighting over extra detail.
Commit source, engine.glb, updated manifest/docs and the three review PNGs to the implementation branch.
Stop for master visual review. Do not merge the engine, make the full video, or claim final approval.

After acceptance: complete the requested reusable asset previews and an exploded-view check, then proceed to the short orbit-to-cutaway proof specified in yunex/SOL_HANDOFF_MODEL_LED_V2.md. Full film integration follows that proof.
