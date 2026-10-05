# AGENT C — YUNEX track proof integration + final QA handoff

## Mission

Act as the **integration and final-review agent** for the YUNEX track foliage rescue.

Do not redo Agent A or Agent B's rendering work.

Your job starts only after both agents have completed their branches and returned final commit SHAs.

Agent A owns:
- baseline landscape still
- refined landscape still
- matched before/after comparison
- portrait hero still
- static metadata
- static visual QA

Agent B owns:
- native portrait motion proof
- opening/mid/end inspection frames
- motion metadata
- full decode validation
- motion visual QA
- any bounded motion-only corrective pass

You own:
- integrating both finished proof branches
- resolving any shared-source conflicts conservatively
- re-verifying locked assets
- checking that the complete proof bundle is internally consistent
- writing the final combined QA
- cleaning/marking stale handoffs so future agents have one clear source of truth
- returning the final integration commit

Do not re-render anything unless integration reveals a concrete broken or missing deliverable that cannot be validated otherwise.

## Repository / canonical branch

Repository:
`YunRah2103/yunus-video-lab`

Final integration target:
`sol/yunex-full-film-v2`

Read first:
1. `yunex/NEXT_AGENT_TRACK_FOLIAGE_RESCUE.md`
2. `yunex/AGENT_A_TRACK_STATIC_FINAL.md`
3. `yunex/AGENT_B_TRACK_MOTION_FINAL.md`
4. `yunex/TRACK_FOLIAGE_IMPLEMENTATION.md`
5. `yunex/src/TrackPreview.tsx`
6. `yunex/src/index.tsx`
7. `.github/workflows/yunex-track-refinement.yml`

Do not begin integration until you have:
- Agent A final branch + commit SHA
- Agent B final branch + commit SHA

## Locked approved assets — absolute rule

The Porsche and engine are already approved and must remain byte-identical.

Exterior SHA-256:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Engine SHA-256:
`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Do not rebuild, recolour, re-export, decimate, move, rescale, or replace either asset.

Do not edit the 27.6-second film or audio.

## Integration strategy

### 1. Inspect both agent commits before merging

Compare Agent A and Agent B against the latest:
`sol/yunex-full-film-v2`

Identify:
- generated proof files
- QA files
- shared source edits
- workflow edits
- accidental overlap

Do not blindly merge conflicting shared-source changes.

### 2. Integrate Agent A outputs

Bring in:
- `yunex/track-refinement/before_landscape.png`
- `yunex/track-refinement/after_landscape.png`
- `yunex/track-refinement/before_after_landscape.png`
- `yunex/track-refinement/portrait_hero.png`
- `yunex/track-refinement/landscape_ffprobe.json`
- `yunex/track-refinement/portrait_ffprobe.json`
- `yunex/track-refinement/STATIC_QA.md`

Also reconcile any legitimate static-source fix Agent A made.

### 3. Integrate Agent B outputs

Bring in:
- `yunex/track-refinement/portrait_motion_proof.mp4`
- `yunex/track-refinement/motion_ffprobe.json`
- `yunex/track-refinement/motion_frame_000.png`
- `yunex/track-refinement/motion_frame_mid.png`
- `yunex/track-refinement/motion_frame_end.png`
- `yunex/track-refinement/MOTION_QA.md`

Also reconcile any legitimate motion-source fix Agent B made.

### 4. Resolve shared-source conflicts conservatively

If both agents touched:
- `yunex/src/TrackPreview.tsx`
- `yunex/src/index.tsx`
- `yunex/render-track.cjs`
- `.github/workflows/yunex-track-refinement.yml`

preserve:
- approved Porsche PBR materials
- approved Porsche geometry and transform
- existing refined environment
- 75-frame native motion proof at 30 fps
- Agent B's successful motion-performance optimisations
- Agent A's still-quality fixes only if they do not break motion

Do not redesign the environment during conflict resolution.

If there is no real conflict, do not touch source unnecessarily.

## Required final proof bundle

The final canonical branch must contain:

`yunex/track-refinement/`

- `before_landscape.png`
- `after_landscape.png`
- `before_after_landscape.png`
- `portrait_hero.png`
- `portrait_motion_proof.mp4`
- `landscape_ffprobe.json`
- `portrait_ffprobe.json`
- `motion_ffprobe.json`
- `motion_frame_000.png`
- `motion_frame_mid.png`
- `motion_frame_end.png`
- `STATIC_QA.md`
- `MOTION_QA.md`
- `QA.md`

## Final verification

Verify from the integrated branch:

### Locked assets
Exterior must equal:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Engine must equal:
`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

### Static proofs
- landscape = 1600 × 1000
- portrait hero = 1080 × 1920

### Motion proof
- 1080 × 1920
- 30 fps
- 75 frames
- full FFmpeg decode passes

### Bundle consistency
Confirm:
- all required files exist
- no duplicate stale proof with a misleading filename
- Agent A/B QA statements match the actual final files
- source paths referenced in QA are correct
- the branch contains no accidental Porsche/engine modifications

## Final combined visual review

Review the complete bundle as one unit.

Confirm:
- refined landscape is a believable improvement over baseline
- Porsche remains the visual hero
- foliage is restrained and does not look like a repeated game wall
- tyres are planted
- rail does not intersect the car
- portrait hero is composed well
- opening/mid/end motion frames remain coherent
- no foliage popping or clipping
- no major lighting discontinuity between static and motion proofs
- green livery remains distinct from foliage
- motion proof looks like the same environment as the stills

Do not claim inspection if you did not inspect the actual outputs.

## Write final QA

Create:
`yunex/track-refinement/QA.md`

Include:
- Agent A branch + final SHA
- Agent B branch + final SHA
- integration source commit
- final integration commit
- exterior hash
- engine hash
- all media dimensions / fps / frame count
- full-decode result
- summary of static visual inspection
- summary of motion visual inspection
- any conflict resolution performed
- any remaining limitation

The final QA should make it possible for the master agent to understand the complete state without reopening every old handoff.

## Handoff cleanup / future-agent clarity

After integration succeeds, create or update:
`yunex/CURRENT_TASK.md`

It must clearly state:

- Track foliage proof task: COMPLETE
- Canonical branch: `sol/yunex-full-film-v2`
- Final proof bundle location: `yunex/track-refinement/`
- Approved Porsche and engine remain locked
- Older track foliage handoffs are historical and should not be followed unless explicitly requested
- Next allowed task: master review / integration into the 27.6-second YUNEX film

Do not delete historical handoffs unless explicitly instructed.
Instead, make `CURRENT_TASK.md` the obvious source of truth.

## Do not do

- do not create another redesign handoff
- do not redo Agent A static renders
- do not redo Agent B motion render unless technically required
- do not modify Porsche
- do not modify engine
- do not re-edit the full film
- do not touch audio/VO
- do not introduce new foliage assets
- do not stop at conflict analysis

## Definition of done

Agent C is complete only when:

- Agent A outputs are integrated
- Agent B outputs are integrated
- shared source conflicts are resolved correctly
- complete proof bundle exists on `sol/yunex-full-film-v2`
- hashes remain exact
- all technical checks pass
- final combined visual review is recorded
- `QA.md` exists
- `CURRENT_TASK.md` clearly marks older handoffs as historical
- the final integration commit is pushed

Return:
- final branch
- final integration commit SHA
- Agent A source commit
- Agent B source commit
- changed paths
- complete proof paths
- exterior + engine hashes
- technical validation summary
- visual inspection summary
- any remaining limitation

Then stop.

The master agent decides whether to use the approved track environment in the next 27.6-second film edit.
