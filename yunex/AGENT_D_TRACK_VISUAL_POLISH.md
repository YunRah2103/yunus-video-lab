# AGENT D — YUNEX track visual polish / portrait framing handoff

## Mission

Perform one **small, targeted visual polish pass** on the existing YUNEX racetrack proof.

This is NOT a rebuild.

The current environment is already structurally approved enough to keep. The goal is to improve the two weakest visual areas identified after inspecting Agent A's real renders:

1. the portrait composition has too much empty asphalt below and too much sky above, making the Porsche feel too small in the 9:16 frame;
2. the foliage/background still reads somewhat low-poly / game-like, especially the tree silhouettes.

Keep the approved Porsche and engine completely unchanged.

Do not interfere with Agent B's motion-proof rendering work.

## Repository / branch

Repository:
`YunRah2103/yunus-video-lab`

Canonical branch:
`sol/yunex-full-film-v2`

Agent A finished static branch:
`sol/yunex-track-static-final`

Agent A generated proof commit:
`a362b8d5df922aae36292df38479c7040c88e8f6`

Agent A render source commit:
`c714d3282e80f960ed039ee706f66153d3cda50b`

Create/use a dedicated branch:
`sol/yunex-track-visual-polish`

Prefer starting from Agent A's finished static branch so you inherit its corrected portrait framing.

Do not push directly to:
- `sol/yunex-full-film-v2`
- `sol/yunex-track-motion-final`

## Read first

1. `yunex/AGENT_A_TRACK_STATIC_FINAL.md`
2. `yunex/AGENT_B_TRACK_MOTION_FINAL.md`
3. `yunex/NEXT_AGENT_TRACK_FOLIAGE_RESCUE.md`
4. `yunex/TRACK_FOLIAGE_IMPLEMENTATION.md`
5. `yunex/src/TrackPreview.tsx`
6. Agent A's final `yunex/track-refinement/STATIC_QA.md`

Also inspect the actual Agent A renders before changing anything:
- `yunex/track-refinement/after_landscape.png`
- `yunex/track-refinement/portrait_hero.png`
- `yunex/track-refinement/before_after_landscape.png`

## Locked assets — absolute rule

Do not alter the approved Porsche or engine in any way.

Exterior SHA-256:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Engine SHA-256:
`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Do not:
- rebuild Porsche geometry
- change Porsche materials
- change livery
- move or rescale the car
- change engine geometry/materials
- modify engine placement
- touch the 27.6-second film
- touch audio/VO

Environment and camera must adapt around the locked car.

## Visual findings to address

The real Agent A outputs have already been inspected.

### What is working

Keep:
- Porsche model quality
- green/white livery
- landscape front-three-quarter composition
- kerb / guardrail concept
- restrained local-circuit environment
- general background depth
- subdued greens
- Porsche as bright visual hero

### What still needs improvement

#### Portrait framing

Current portrait still:
- car occupies too little of the 9:16 frame
- too much empty asphalt sits below the Porsche
- too much sky remains above it
- composition feels safe rather than premium/aggressive

Improve this WITHOUT cropping:
- front splitter
- full body
- rear wing
- wheels

The Porsche should feel clearly larger and more dominant.

Aim for:
- noticeably more Porsche in frame
- less dead asphalt
- less dead sky
- still enough breathing room around the silhouette
- premium low automotive framing rather than a cramped zoom

Do not overcorrect into another clipped composition.

#### Foliage realism

Current foliage is useful for depth, but some tree crowns read as obvious low-poly blobs.

Make one restrained improvement pass:
- break up tree crown silhouettes
- vary crown mass and asymmetry
- reduce the impression of repeated primitive clusters
- introduce subtle scale/shape variation
- retain subdued, natural greens
- preserve background depth and fog

Do NOT:
- import a giant foliage system
- use photoreal scanned vegetation
- add expensive transparency-heavy leaves
- create a dense forest
- add grandstands/buildings/crowds
- add dramatic fake HDR or bloom

A few better silhouettes are preferable to lots more geometry.

#### Background / sky

If helpful, make the background feel slightly more photographic by improving:
- sky/horizon balance
- atmospheric separation
- tonal variation behind the trees

Keep this restrained.

The Porsche must stay higher contrast than the background.

## Important conflict rule with Agent B

Agent B owns the motion proof and may still be rendering from the current motion source.

Do not modify Agent B's branch.

Do not overwrite Agent B files.

If your source changes would also affect motion mode, isolate them where practical or document them precisely for Agent C.

Prefer:
- portrait-specific camera changes
- static-safe foliage refinements
- changes that preserve the existing motion contract

Do not change:
- 75-frame motion duration
- motion timing
- motion orbit path
- Agent B workflow files
- Agent B output paths

## Required proof outputs

Do not overwrite Agent A's final files.

Create separate candidate outputs under:

`yunex/track-refinement/visual-polish/`

Required:

- `landscape_polished.png`
- `portrait_polished.png`
- `landscape_comparison.png`
- `portrait_comparison.png`
- `VISUAL_POLISH_QA.md`

Comparisons should clearly show:
- Agent A final → Agent D polished

Use matched framing for landscape comparison.

For portrait comparison, preserve both full 1080×1920 frames side by side or in a clearly reviewable matched presentation.

## Workflow

### 1. Inspect Agent A outputs

Actually open:
- after_landscape.png
- portrait_hero.png

Do not make changes from code alone.

### 2. Fix portrait framing first

Adjust only the portrait camera/target/FOV as necessary.

Goal:
- Porsche significantly larger
- lower dead-space ratio
- full silhouette still safe
- no rear-wing clipping
- no splitter clipping
- no wheel clipping

Render and inspect.

Perform up to two small framing iterations if needed.

### 3. Perform one foliage/background polish pass

Improve only the most visible issues:
- tree silhouette repetition
- low-poly blob appearance
- horizon/atmosphere flatness

Do not redesign the environment.

Render landscape and portrait again.

### 4. Inspect actual outputs

Human visual inspection is mandatory.

Check:
- full Porsche silhouette
- car remains planted
- no foliage/rail intersection
- no obvious repeated tree wall
- foliage does not compete with green livery
- portrait feels intentionally framed
- no excessive empty sky/asphalt
- landscape remains at least as strong as Agent A
- no new visual regression

### 5. Validate locked assets

Verify before and after:

Exterior:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Engine:
`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

### 6. Write QA

Create:
`yunex/track-refinement/visual-polish/VISUAL_POLISH_QA.md`

Record:
- source branch/commit
- exact camera changes
- exact foliage/background changes
- locked hashes
- render dimensions
- visual inspection findings
- whether landscape improved
- whether portrait improved
- any tradeoffs
- whether shared source changes may affect Agent B motion mode

Do not claim improvement without inspecting the real renders.

## Acceptance bar

This pass succeeds if:

- portrait Porsche feels materially larger and more premium
- dead sky/asphalt is reduced
- complete silhouette remains visible
- foliage reads less like repeated low-poly blobs
- background remains restrained
- landscape is not degraded
- Porsche/engine hashes remain unchanged
- the result is clearly better than Agent A when viewed side by side

If foliage changes make the scene busier or distract from the Porsche, revert them.

## Do not do

- do not rebuild the scene
- do not redesign the track
- do not touch Porsche geometry/materials/livery
- do not touch engine
- do not edit motion duration/path
- do not render the full 27.6-second film
- do not touch audio/VO
- do not overwrite Agent A or Agent B proof files
- do not create another handoff
- do not stop at planning

## Definition of done

Agent D is finished only when:

- polished landscape render exists
- polished portrait render exists
- both comparison images exist
- actual renders were visually inspected
- Porsche + engine hashes match exactly
- VISUAL_POLISH_QA.md exists
- source + proof outputs are committed and pushed to `sol/yunex-track-visual-polish`

Return:
- branch
- final commit SHA
- changed source paths
- proof paths
- exact portrait camera settings
- foliage/background changes
- locked hashes
- visual inspection summary
- whether Agent C should integrate the polish into the canonical branch

Then stop.

Agent C will decide how to reconcile this visual-polish branch with Agent A and Agent B.
