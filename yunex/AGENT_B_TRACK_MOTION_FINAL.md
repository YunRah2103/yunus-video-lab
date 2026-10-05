# AGENT B — YUNEX native motion proof + visual QA handoff

## Mission

Finish the **motion half** of the YUNEX track foliage rescue.

You are Agent B. Work in parallel with Agent A.

Agent A owns:
- baseline/refined landscape stills
- before/after comparison
- portrait hero still
- static ffprobe
- static QA

You own:
- native 1080 × 1920 motion proof
- motion render optimisation
- opening/mid/end inspection frames
- full decode
- motion metadata
- one corrective pass if necessary
- motion visual QA

Do not duplicate Agent A's static work.

## Repository / starting branch

Repository:
`YunRah2103/yunus-video-lab`

Canonical integration branch:
`sol/yunex-full-film-v2`

Latest known motion optimisation work includes:
`b1b9ea23ed393d42b2c4a0a34704e58320b58791`

Before editing:
1. fetch latest `sol/yunex-full-film-v2`
2. read `yunex/NEXT_AGENT_TRACK_FOLIAGE_RESCUE.md`
3. read `yunex/TRACK_FOLIAGE_REFINEMENT_HANDOFF.md`
4. read `yunex/TRACK_FOLIAGE_IMPLEMENTATION.md`
5. inspect `yunex/src/TrackPreview.tsx`
6. inspect `yunex/src/index.tsx`
7. inspect `yunex/render-track.cjs`
8. inspect `.github/workflows/yunex-track-refinement.yml`

Create/use a dedicated branch such as:
`sol/yunex-track-motion-final`

Do not push directly over Agent A's work.

## Current motion optimisation state

The proof has already been reduced from 90 frames to:
- 75 frames
- 30 fps
- 2.5 seconds
- native 1080 × 1920

Motion-only optimisations already added:
- foliage does not cast/receive expensive shadows in motion mode
- foliage tessellation is reduced only in motion mode
- motion shadow map reduced to 1024
- static shadow map can be reused after model load
- approved Porsche PBR materials remain unchanged
- the Porsche still receives a refreshed shadow map after GLTF load
- orbit timing now spans frames 0 → 74

Do not undo these optimisations unless you can prove a visual defect requires it.

## Locked assets — absolute rule

Do not modify, rebuild, recolour, re-export, decimate, move, rescale, or replace the Porsche or engine.

Exterior SHA-256:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Engine SHA-256:
`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Environment moves around the approved car. Never the reverse.

## Required outputs

Persist these under:
`yunex/track-refinement/`

You own:
- `portrait_motion_proof.mp4`
- `motion_ffprobe.json`
- `motion_frame_000.png`
- `motion_frame_mid.png`
- `motion_frame_end.png`
- `MOTION_QA.md`

Do not create or overwrite Agent A's:
- `before_landscape.png`
- `after_landscape.png`
- `before_after_landscape.png`
- `portrait_hero.png`
- `landscape_ffprobe.json`
- `portrait_ffprobe.json`
- `STATIC_QA.md`

## Motion workflow

### 1. Render the real native motion proof

Composition:
`YUNEX-TRACK-MOTION-PROOF`

Required:
- 1080 × 1920
- 30 fps
- 75 frames
- H.264
- actual frame-driven 3D camera movement
- no CSS/still-image fake pan
- no flattened Porsche replacement

Save:
`yunex/track-refinement/portrait_motion_proof.mp4`

Start with the currently optimised source. Do not redesign the scene.

### 2. Extract inspection frames

Extract exactly:
- opening frame → `motion_frame_000.png`
- midpoint around frame 37 → `motion_frame_mid.png`
- ending frame around frame 74 → `motion_frame_end.png`

### 3. Human visual inspection

Actually inspect all three PNGs and the MP4.

Check:
- no foliage popping
- no transparency instability
- no clipping
- no floating tyres
- no rail/car intersection
- no obvious repeated tree pattern
- no Porsche crop caused by orbit
- green livery stays separated from foliage
- perspective remains believable
- contact shadow remains present
- motion is subtle/premium, not a sweeping game-camera move

### 4. Corrective pass

If anything fails:
- perform one bounded corrective pass
- change environment/motion settings only
- do not modify Porsche or engine
- render again
- re-inspect the new outputs

If you change shared source, document every shared-source edit clearly for integration.

### 5. Technical verification

Generate:
`motion_ffprobe.json`

Assert:
- width 1080
- height 1920
- frame rate 30/1
- frame count 75

Run a full FFmpeg decode and require exit code 0.

Verify exterior + engine hashes before and after rendering.

### 6. Write motion QA

Create:
`yunex/track-refinement/MOTION_QA.md`

Record:
- exact source commit
- render command
- dimensions
- fps
- frame count
- full decode result
- exterior hash
- engine hash
- inspection of opening/mid/end
- whether a corrective pass happened
- remaining limitations, if any

Do not claim visual inspection from metadata alone.

## Performance rule

Do not brute-force your way back to the old 90-frame heavy path.

Preferred levers if still too slow:
1. keep Porsche PBR untouched
2. further reduce foliage shadow cost only
3. reduce background foliage geometry only if visually indistinguishable
4. tune render concurrency
5. retain 75-frame / 2.5-second target unless absolutely impossible

Do not shorten below roughly 2.5 s without explicitly documenting why.

## Do not do

- do not edit full film
- do not alter audio/VO
- do not change Porsche geometry/materials/livery
- do not alter engine
- do not redo landscape/portrait static proofs
- do not overwrite Agent A outputs
- do not stop at compile-only or planning

## Definition of done

Agent B is complete only when:
- the native motion MP4 exists
- it is 1080 × 1920, 30 fps, 75 frames
- full FFmpeg decode passes
- opening/mid/end inspection PNGs exist
- actual motion visuals were inspected
- any visual defect got one corrective pass
- exterior + engine hashes match exactly
- MOTION_QA.md records all of the above
- all Agent B outputs are committed and pushed to your dedicated branch

Return:
- branch
- final commit SHA
- changed paths
- exact motion proof paths
- hashes
- render/decode commands
- visual inspection summary
- any shared-source correction the integration agent must reconcile
