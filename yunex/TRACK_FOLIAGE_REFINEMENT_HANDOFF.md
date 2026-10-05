# YUNEX — track refinement implementation handoff

## Assignment
Improve the existing small racetrack presentation scene. Add believable foliage and environmental depth, then return reviewable renders and source to the master agent. Do not re-edit the film yet: the master reviews the environment first and performs/directs the next edit.

User request: "improve the track section like add foliage ect and then once all done and looks good you make the edit again".

## Canonical starting point
- Repository: YunRah2103/yunus-video-lab
- Branch: sol/yunex-full-film-v2
- Track baseline commit: 73893baf2a75111cf91fd9d77fa83156c53d2e91
- Read the current branch before changing anything; preserve any newer work.
- Existing scene: yunex/src/TrackPreview.tsx
- Renderer: yunex/render-track.cjs
- Composition: YUNEX-TRACK-PREVIEW, 1600 × 1000
- Film baseline: yunex/V3_DELIVERY.md; approved V3 is 27.6 seconds, native 1080 × 1920 at 30 fps.
- Existing scene already loads the original GLTF PBR materials, uses contact shadows and an outdoor PMREM environment. Extend it rather than start over.

## Non-negotiable asset lock
Do not rebuild, export over, decimate, recolour or modify the approved car, engine, livery, materials, proportions, pivots or scale.
Exterior SHA-256: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb
Engine SHA-256: aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d
Car: metres, +Y up, +Z forward. Place environment relative to the existing car; ground follows model bounds minimum Y. Preserve the film and its audio.

## Creative direction — decided by master
Keep the car as the bright, sharp hero. Build only the visible local track section.
1. Add a narrow, believable grass verge outside the asphalt/kerb.
2. Add an irregular, restrained line of shrubs and a few convincing trees beyond the guardrail. Use varied scale, spacing and subdued greens; avoid repeated obvious primitives, cones and identical tree silhouettes.
3. Give the background layered depth and a controlled horizon. Mild atmospheric perspective is useful; foliage must not turn into a flat green wall.
4. Improve the asphalt-to-verge boundary and modest track wear if needed. Texture scale must suit a real car. Avoid exaggerated cracks, noisy grain and artificial wet reflections.
5. Retain the low front three-quarter hero composition, full splitter/wing and tyre contact. The green livery must remain distinct from the foliage. Keep the background less contrasty than the car.
6. Keep outdoor lighting coherent across sky, foliage, metal rail and car. No glowing greens, fake HDR, heavy bloom or gratuitous lens effects.
No grandstands, entire circuit, buildings, spectators or elaborate terrain. Fence only if it improves the shot. Avoid unnecessary environment systems.

## Implementation scope
Extract the local environment into a reusable component if that makes later film integration straightforward; do not refactor unrelated film code.
Keep existing original PBR car presentation. Use deterministic seeded placement and frame-based animation for Remotion; no random changes between frames or wall-clock camera movement.
Prefer economical instanced foliage or a small properly licensed asset with real leaf/branch structure. Record asset provenance/license. Do not quietly introduce a restricted third-party asset.
Use Context7 for unfamiliar current Three.js/Remotion APIs if available; use existing working APIs otherwise and report any unavailable connector. Use Superpowers for scoped planning/debugging/verification. No new hosting project needed.
Existing driver: node render-track.cjs from yunex. Existing fix-network.cjs is required by render drivers in this runtime. Do not reinstall working dependencies.
Use a separate refinement output name so the approved still remains intact.

## Proofs and acceptance
Deliver:
- Improved 1600 × 1000 landscape still matching the baseline angle for comparison.
- Native 1080 × 1920 hero proof suitable for the eventual film: car large, complete silhouette, no blank sky dominating.
- A short native portrait camera-motion proof (around 3 seconds) using a subtle orbit/pan. Show the environment holds up during motion; do not make a new full film.
Inspect the actual outputs, not just compilation. Fix floating tyres, clipping, sparse unfinished background, toy-like trees, distracting rails, shadow acne and unstable leaf transparency.
Verify car and engine hashes before and after. Do not invent a test suite for scene cosmetics; useful evidence is native renders, a full proof decode and recorded visual inspection.
Save user-facing renders persistently; commit source and concise reproduction/QA notes to GitHub. Avoid committing large intermediates. If using another branch, report its exact name and commit.

## Return to master
Give exact commit, changed paths, output paths/downloads, render commands, hashes and any remaining limitation. Include a matched before/after comparison. Do not claim master approval or publishability.
Master then inspects the improved scene. Only after it passes, integrate it into the next video edit.

## Next video edit — master-owned direction
Preserve the approved VO, 27.6-second structure, refined engine and clear technical diagrams.
Use the track for cinematic opening/payoff and, if helpful, the traction beat. Preserve controlled studio/cutaway backgrounds where they improve engineering clarity; foliage must not compete with labels.
Keep the model large, animate with deliberate camera changes and avoid returning to dead space.
Render review, inspect the full timeline, fix weaknesses, render final MP4 again. Native 1080 × 1920, 30 fps, H.264/AAC. New filenames/composition; retain approved V3.
This paragraph is context for the master, not permission for the environment implementer to redesign the story.
