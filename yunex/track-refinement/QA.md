# YUNEX track foliage proof — final integrated QA

## Final state

- Canonical branch: `sol/yunex-full-film-v2`
- Agent A branch: `sol/yunex-track-static-final`
- Agent A final SHA: `f93985f3432b724a93222bb950a1af436049c2a0`
- Agent A render source SHA: `c714d3282e80f960ed039ee706f66153d3cda50b`
- Agent A generated proof SHA: `a362b8d5df922aae36292df38479c7040c88e8f6`
- Agent B branch: `sol/yunex-track-motion-final`
- Agent B final SHA: `c9790bd9deb717edb78d058de3710e83e05eed6c`
- Agent B render source SHA: `c8c9d8a79f018478d896e84e190dae844bcd0708`
- Agent B segmented render workflow run: `37330180125`
- Integration source commit: `91b92c7a04610768e6fae27ff0f3b08d9672445c`
- Final proof-bundle integration commit: `5ed62e2164060ca79433bb75d6936f21250968fe`

The integration commit is the exact commit that combines Agent A and Agent B outputs with the canonical source. The later QA/CURRENT_TASK documentation commit does not alter the integrated proof media or locked assets.

## Locked approved assets

- Porsche exterior SHA-256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- Engine SHA-256: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Agent A and Agent B both verified these SHA-256 values during their render/validation runs. Agent C additionally verified that the Git blobs are identical across the canonical, Agent A and Agent B branches:

- exterior Git blob: `d5d746376a2e6753ae1bbb1ee638c160a3ef32ab`
- engine Git blob: `0ee04c589d13c12d3a4525b2246bbcc6cdc58f70`

No Porsche or engine geometry, material, livery, transform, scale, placement or export was changed.

## Complete proof bundle

All required files are present under `yunex/track-refinement/`:

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

## Technical validation

Static:
- baseline landscape: 1600 × 1000
- refined landscape: 1600 × 1000
- matched before/after comparison: 3200 × 1000
- portrait hero: 1080 × 1920
- landscape and portrait ffprobe/dimension assertions: PASS

Motion:
- native portrait proof: 1080 × 1920
- codec: H.264
- frame rate: 30/1 fps
- frame count: 75
- duration: 2.5 seconds
- full FFmpeg decode: PASS
- exact opening/mid/end inspection frames exist at frames 0, 37 and 74

## Shared-source conflict resolution

Integration was selective rather than a blind branch merge.

Kept:
- the canonical motion-performance optimisations and 75-frame motion contract
- the existing canonical environment and approved Porsche PBR/material setup
- Agent A's legitimate portrait-only camera correction in `yunex/src/TrackPreview.tsx`
- Agent A's final static proof bundle and `STATIC_QA.md`
- Agent B's final native motion proof bundle and `MOTION_QA.md`

Deliberately not carried into the canonical branch:
- Agent A's branch-specific static-only workflow rewrite
- Agent B's branch-specific render/segmentation/publish helper workflows

The canonical `.github/workflows/yunex-track-refinement.yml` stayed byte-identical through integration (Git blob `58537faba22a46a27c832bf6465a0045626f36bb`).

Agent A's portrait correction changes only portrait framing; its QA and source diff confirm the landscape and motion camera/path were not changed. Agent B required no shared scene-source correction after final motion inspection.

The concurrently added `yunex/AGENT_D_TRACK_VISUAL_POLISH.md` handoff was preserved unchanged. It is not part of this completed integration and was not executed.

## Agent C combined visual inspection

Agent C inspected the actual finished static review outputs and the assembled motion proof rather than relying on metadata alone.

Static review:
- the refined landscape is a clear improvement over the sparse baseline
- Porsche remains the visual hero
- guardrail and foliage remain behind the car with no visible intersection
- tyres read as planted
- foliage is restrained and varied rather than a single repeated wall
- green livery stays visually distinct from the subdued foliage
- portrait hero keeps the complete splitter/body/rear-wing silhouette in frame

Motion review:
- opening, midpoint and ending frames remain coherent
- sampled motion shows no visible foliage popping or transparency instability
- no Porsche crop, rail intersection or floating-tyre issue was observed
- contact shadow remains readable
- perspective and environment continuity hold through the restrained orbit
- segment joins remain visually continuous
- lighting/environment vocabulary remains consistent with the static proofs

## Remaining limitations

- Vegetation is intentionally economical deterministic low-poly procedural geometry, so tree silhouettes remain somewhat stylised at close scrutiny.
- The portrait proof still has noticeable asphalt/sky negative space. This is acceptable for proof completion, but the separate Agent D handoff documents an optional visual-polish pass if explicitly requested.
- This task did not edit, re-render or alter the 27.6-second YUNEX film, VO or audio.

## Result

Track foliage proof integration is COMPLETE. The complete validated bundle is canonical on `sol/yunex-full-film-v2`. Further work requires master review or an explicitly requested optional polish/full-film integration task.
