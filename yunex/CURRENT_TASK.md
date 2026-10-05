# YUNEX — CURRENT TASK

## Status

**Agents A, B, C, D and E: COMPLETE / INTEGRATED**

Canonical branch:
`sol/yunex-full-film-v2`

Latest D/E selective integration commit:
`29488d6be59cd90b9c05a3252cd4e64a3a369a11`

Agent D final branch / SHA:
`sol/yunex-track-visual-polish`
`d2fc8c59b5083c70b7fb8c5246cd86f79e488213`

Agent E final branch / SHA:
`sol/yunex-wheel-aero-polish`
`2fb499012938e9bb8f7f76bbf6049a543af66867`

## Integrated work

Agent D:
- polished portrait framing is canonical in `yunex/src/TrackPreview.tsx`
- restrained tree-silhouette variation is canonical
- polished review bundle is under `yunex/track-refinement/visual-polish/`

Agent E:
- real frame-driven `Spin_FL/FR/RL/RR` wheel rotation is canonical in `yunex/src/ModelLedVideo.tsx`
- premium front-to-rear 3D airflow/tracer treatment is canonical
- proof-only wheel/aero compositions are registered in `yunex/src/index.tsx`
- reviewed proof bundle is under `yunex/motion-polish/`

## Locked assets

The approved Porsche and engine remain byte-identical and locked.

- Exterior SHA-256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- Engine SHA-256: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Do not rebuild, recolour, re-export, move, rescale or replace them without explicit new direction.

## Source of truth

Read:
- `yunex/POLISH_INTEGRATION_QA.md`
- `yunex/track-refinement/QA.md`
- `yunex/track-refinement/visual-polish/VISUAL_POLISH_QA.md`
- `yunex/motion-polish/MOTION_POLISH_QA.md`

Older Agent A/B/C/D/E handoffs are historical implementation instructions and should not be re-run unless explicitly requested.

## Important final-film architecture state

Agent E improved the **live** `ModelLedVideo` source only.

`yunex/src/FinalFinish.tsx` remains unchanged and still uses the existing flattened V3 review base. The D/E integration did **not** replace the 27.6-second final film, `v3-review.mp4`, VO or audio.

Therefore the next film-production step, if requested, is:
1. regenerate/review the live V3 base so the integrated wheel/aero changes are baked into it;
2. only then consider updating the flattened FinalFinish base and producing a new full-film review.

Do not claim the current flattened final film already contains Agent E's wheel/aero polish.
