# NEXT AGENT — YUNEX track foliage refinement rescue / finish

## Mission

Finish the track foliage/environment refinement on the existing branch, produce the required review proofs, inspect them, fix any visible issues, then return the final commit and proof paths to the master agent.

Do **not** re-edit the 27.6-second YUNEX film yet. The master wants to review the improved track environment first.

## Repository / branch

- Repository: \`YunRah2103/yunus-video-lab\`
- Branch: \`sol/yunex-full-film-v2\`
- Current branch head at handoff: \`5ee38dc4733bb8ae216ef0ecef08b33ce2fb8a7f\`
- Original foliage handoff: \`yunex/TRACK_FOLIAGE_REFINEMENT_HANDOFF.md\`
- Implementation note: \`yunex/TRACK_FOLIAGE_IMPLEMENTATION.md\`

## Locked approved assets — DO NOT TOUCH

The Porsche and engine are already approved.

- Exterior SHA-256:
  \`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb\`
- Engine SHA-256:
  \`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d\`

Do not rebuild, recolour, re-export, decimate, move, rescale or otherwise alter:
- approved Porsche geometry
- green/white livery
- original Porsche materials
- car proportions
- engine geometry/materials
- engine placement contract
- existing film/audio

Environment must move around the car, never the reverse.

## What has already been implemented

The environment work itself is already in source.

### \`yunex/src/TrackPreview.tsx\`

Current implementation adds:

- deterministic procedural grass verge outside the asphalt
- subdued asphalt-to-verge dirt/grass seam
- deeper background ground layer
- irregular deterministic shrubs
- varied deterministic trees beyond the guardrail
- subdued greens so the green Porsche stays distinct
- mild atmospheric fog for depth instead of a flat foliage wall
- existing kerb and guardrail retained
- approved original GLTF Porsche materials retained
- existing 1600x1000 landscape camera kept at the baseline angle
- new native 1080x1920 portrait hero mode
- new frame-driven portrait motion mode with restrained orbit/pan

No external foliage asset was introduced. The foliage and texture variation are authored procedurally in Three.js, so no license issue exists.

### \`yunex/src/index.tsx\`

Added:

- \`YUNEX-TRACK-PORTRAIT\` — 1080x1920 still
- \`YUNEX-TRACK-MOTION-PROOF\` — 1080x1920, 30fps, currently 90 frames

Existing:
- \`YUNEX-TRACK-PREVIEW\` — 1600x1000 landscape still

### \`yunex/render-track.cjs\`

Updated to render:
- refined landscape still
- portrait hero still
- portrait motion proof

### Workflow

\`.github/workflows/yunex-track-refinement.yml\`

This workflow was added to:
- recreate the baseline landscape still from commit \`73893baf2a75111cf91fd9d77fa83156c53d2e91\`
- render refined landscape + portrait + motion
- make a matched before/after image
- ffprobe media
- fully decode the MP4
- verify car + engine hashes before and after
- commit persistent proof assets
- upload a review artifact

## What happened / exact failure state

GitHub Actions run:

- Workflow: \`YUNEX track foliage refinement\`
- Run ID: \`37313568284\`
- Head SHA: \`5ee38dc4733bb8ae216ef0ecef08b33ce2fb8a7f\`
- Result: **cancelled**
- It successfully completed:
  - checkout
  - Node setup
  - dependency install
  - approved asset preparation / initial hash verification
  - matched baseline landscape render
- It was cancelled during:
  - \`Render refined proofs\`

The heavy part was the native 1080x1920 WebGL motion proof. Do not treat this as a design failure. The bottleneck is the software-render/CI cost of the 90-frame portrait proof.

No generated proof outputs were committed because cancellation occurred before the validation / commit stages.

## Your first task

Read these files before changing anything:

1. \`yunex/TRACK_FOLIAGE_REFINEMENT_HANDOFF.md\`
2. \`yunex/TRACK_FOLIAGE_IMPLEMENTATION.md\`
3. \`yunex/src/TrackPreview.tsx\`
4. \`yunex/src/index.tsx\`
5. \`yunex/render-track.cjs\`
6. \`.github/workflows/yunex-track-refinement.yml\`

Also confirm the branch head has not moved unexpectedly before editing.

## Finish strategy — do not redo the scene

The source environment is already implemented. Your job is to make the proof render tractable and then visually inspect it.

Use this order:

### 1. Render the refined landscape still only

Render:
\`YUNEX-TRACK-PREVIEW\`

Required:
- 1600x1000
- same baseline camera angle
- complete Porsche silhouette
- tyres visually planted
- foliage behind rail, not intersecting car
- subdued background
- no huge blank sky
- no toy-like repeated tree wall

Compare it directly against the baseline from:
\`73893baf2a75111cf91fd9d77fa83156c53d2e91\`

If the still looks wrong, fix the environment before touching the motion proof.

### 2. Render the portrait hero still separately

Render:
\`YUNEX-TRACK-PORTRAIT\`

Required:
- native 1080x1920
- car large in frame
- full splitter / body / rear wing readable
- no excessive empty sky
- grass / shrubs / trees provide depth without competing with the Porsche

Inspect the actual PNG.

### 3. Make the motion proof efficient instead of brute-forcing the current heavy path

The current 90-frame native SWANGLE render is too expensive in CI.

Keep the motion proof genuinely frame-driven and 1080x1920, but reduce renderer cost **without changing the approved Porsche**.

Preferred optimisations, in this order:

- keep Porsche PBR materials unchanged
- reduce foliage shadow cost in motion mode only
  - foliage does not need to cast expensive shadows every frame
  - car must still cast/receive believable contact lighting
- lower shadow map size for motion mode only if needed
- reduce procedural foliage segment/detail count in motion mode while preserving the same silhouette/placement
- reduce background foliage count only if it is visually indistinguishable in portrait
- increase render concurrency if runner resources allow
- shorten proof slightly only if necessary; target about 2.5–3.0 seconds, still 30fps
- do not fake the camera move with a CSS pan over a still
- do not replace the Porsche with a flattened image

The proof must still demonstrate that the environment holds up under real camera motion.

### 4. Inspect the motion proof at multiple moments

Inspect at least:
- opening frame
- middle frame
- ending frame

Check:
- no foliage popping
- no unstable transparency
- no clipping
- no floating tyres
- no rail intersection
- no obvious repeated tree pattern
- no car crop caused by orbit
- green livery remains separated from foliage
- environment perspective remains believable

If anything fails, perform one corrective pass and render again.

## Required final outputs

Persist these under:

\`yunex/track-refinement/\`

Required files:

- \`before_landscape.png\`
- \`after_landscape.png\`
- \`before_after_landscape.png\`
- \`portrait_hero.png\`
- \`portrait_motion_proof.mp4\`
- \`landscape_ffprobe.json\`
- \`portrait_ffprobe.json\`
- \`motion_ffprobe.json\`
- \`QA.md\`

You may also add inspected motion stills such as:
- \`motion_frame_000.png\`
- \`motion_frame_mid.png\`
- \`motion_frame_end.png\`

These would be useful for master review.

## Validation requirements

Before final commit:

1. Confirm exterior SHA-256 still equals:
   \`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb\`

2. Confirm engine SHA-256 still equals:
   \`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d\`

3. Confirm:
   - landscape = 1600x1000
   - portrait still = 1080x1920
   - motion proof = 1080x1920
   - motion proof = 30fps
   - full FFmpeg decode exits successfully

4. Record **human visual inspection** in \`QA.md\`.
Do not claim visual inspection if you only checked metadata.

## Important visual direction

The environment should feel like a believable local section of a race circuit, not a game-level diorama.

Keep:
- car bright/sharp as hero
- narrow verge
- restrained shrubs
- a few convincing trees
- background depth
- coherent outdoor lighting
- modest asphalt wear / believable scale
- low front-three-quarter premium automotive composition

Avoid:
- giant scenery
- grandstands
- buildings
- crowds
- entire circuit
- neon greens
- obvious repeated cones/spheres
- flat green wall
- wet-look asphalt
- heavy bloom
- fake HDR
- distracting fences
- overcomplicated environment systems

## Do not proceed into full-film re-edit

Once the track proofs are finished and pushed, stop.

Return to the master agent:
- branch
- final commit SHA
- changed paths
- exact proof paths
- exterior + engine hashes
- render commands
- what was visually inspected
- any remaining limitation

The master agent will review the track environment first and then decide whether to integrate it into the next 27.6-second film edit.

## Definition of done

This rescue is complete only when:

- source refinements remain on \`sol/yunex-full-film-v2\`
- matched before/after stills exist
- native portrait hero exists
- native portrait motion proof exists
- actual outputs were visually inspected
- required technical checks pass
- approved Porsche + engine hashes remain unchanged
- proof bundle is committed and pushed

Do not stop at planning, documentation, another handoff, or a compile-only result.
