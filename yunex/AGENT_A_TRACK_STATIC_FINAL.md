# AGENT A — YUNEX track static proof + technical validation handoff

## Mission

Finish the **static proof half** of the YUNEX track foliage rescue without touching the approved Porsche, engine, full film, or motion-proof source unless a static-render blocker absolutely requires it.

You are Agent A. Work in parallel with Agent B.

Agent B owns:
- native portrait motion proof rendering
- motion-frame inspection
- motion-only corrective work

You own:
- baseline landscape still
- refined landscape still
- matched before/after comparison
- portrait hero still
- static-media metadata
- locked-asset hash verification
- static visual inspection notes

Do not duplicate Agent B's work.

## Repository / starting branch

Repository:
`YunRah2103/yunus-video-lab`

Canonical integration branch:
`sol/yunex-full-film-v2`

Latest known source work includes the motion optimisations through commit:
`b1b9ea23ed393d42b2c4a0a34704e58320b58791`

Before editing:
1. fetch the latest `sol/yunex-full-film-v2`
2. read `yunex/NEXT_AGENT_TRACK_FOLIAGE_RESCUE.md`
3. read `yunex/TRACK_FOLIAGE_REFINEMENT_HANDOFF.md`
4. read `yunex/TRACK_FOLIAGE_IMPLEMENTATION.md`
5. inspect `yunex/src/TrackPreview.tsx`
6. inspect `.github/workflows/yunex-track-refinement.yml`

Create/use a dedicated branch such as:
`sol/yunex-track-static-final`

Do not push directly over Agent B's work.

## Locked assets — absolute rule

Do not modify, rebuild, recolour, re-export, decimate, move, rescale, or replace the Porsche or engine.

Exterior SHA-256:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Engine SHA-256:
`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

The approved Porsche remains the hero.

## Required outputs

Persist these under:
`yunex/track-refinement/`

You own:
- `before_landscape.png`
- `after_landscape.png`
- `before_after_landscape.png`
- `portrait_hero.png`
- `landscape_ffprobe.json`
- `portrait_ffprobe.json`
- `STATIC_QA.md`

Do not create or overwrite Agent B's:
- `portrait_motion_proof.mp4`
- `motion_ffprobe.json`
- `motion_frame_000.png`
- `motion_frame_mid.png`
- `motion_frame_end.png`
- `MOTION_QA.md`

## Static proof workflow

### 1. Recreate baseline

Use baseline commit:
`73893baf2a75111cf91fd9d77fa83156c53d2e91`

Render the baseline `YUNEX-TRACK-PREVIEW` at exactly:
- 1600 × 1000
- same camera
- same baseline source

Save:
`yunex/track-refinement/before_landscape.png`

### 2. Render refined landscape

Return to current refined source and render:
`YUNEX-TRACK-PREVIEW`

Save:
`yunex/track-refinement/after_landscape.png`

Acceptance:
- 1600 × 1000
- complete Porsche silhouette
- no foliage intersecting car
- tyres visually planted
- foliage stays behind rail
- no giant empty sky
- no toy-like repeated foliage wall
- Porsche remains brighter/sharper than background

### 3. Build matched comparison

Create:
`yunex/track-refinement/before_after_landscape.png`

Use a true side-by-side matched comparison. Do not crop one differently from the other.

### 4. Render native portrait hero

Render:
`YUNEX-TRACK-PORTRAIT`

Save:
`yunex/track-refinement/portrait_hero.png`

Acceptance:
- 1080 × 1920
- car large in frame
- full splitter/body/rear wing readable
- no excessive sky
- believable verge/rail/foliage depth
- subdued greens
- no environment element competes with the Porsche

### 5. Inspect the actual PNGs

Human visual inspection is mandatory.

Inspect:
- before landscape
- after landscape
- comparison
- portrait hero

If there is a **static-only** issue, fix only the environment/source necessary for the stills. Do not alter the Porsche.

If a correction changes shared source, clearly document it so the integration agent can reconcile with Agent B.

### 6. Technical validation

Generate:
- `landscape_ffprobe.json`
- `portrait_ffprobe.json`

Assert:
- landscape = 1600 × 1000
- portrait = 1080 × 1920

Verify exterior and engine hashes both before and after rendering.

### 7. Write static QA

Create:
`yunex/track-refinement/STATIC_QA.md`

Record:
- exact source commit
- baseline commit
- exact render commands
- dimensions
- exterior hash
- engine hash
- visual inspection findings
- any corrective pass
- remaining limitations, if any

Do not write "pending visual inspection". Actually inspect the outputs.

## Do not do

- do not edit the 27.6-second film
- do not touch VO/audio
- do not rebuild the environment
- do not alter Porsche geometry/materials/livery
- do not alter engine
- do not perform motion-proof optimisation
- do not overwrite Agent B output files
- do not stop at planning

## Definition of done

Agent A is complete only when:
- all four static PNGs exist
- landscape + portrait dimensions are verified
- exterior + engine hashes match exactly
- the PNGs were visually inspected
- STATIC_QA.md records the inspection
- all Agent A outputs are committed and pushed to your dedicated branch

Return:
- branch
- final commit SHA
- changed paths
- proof paths
- hashes
- render commands
- visual inspection summary
- any source change that Agent B/integration must know about
