# YUNEX — Agent D + Agent E polish integration QA

## Canonical integration

- Canonical branch: `sol/yunex-full-film-v2`
- Integration commit: `29488d6be59cd90b9c05a3252cd4e64a3a369a11`
- Integration base: `a177f9686e82632ebeb2d70287ad18eeb24bbfce`

Agent D:
- branch: `sol/yunex-track-visual-polish`
- final SHA: `d2fc8c59b5083c70b7fb8c5246cd86f79e488213`
- final render source: `7dee6be7a4560b4c334398a04d712be718de77fd`
- successful final render run: `37336982245`

Agent E:
- branch: `sol/yunex-wheel-aero-polish`
- final SHA: `2fb499012938e9bb8f7f76bbf6049a543af66867`
- proof render source: `28bd3712725ba0fcf4d6206fcb30267040a0a748`
- generated proof commit: `39383713bbe4d975c33d694d84efa07b2a3a24cb`
- successful proof render run: `37339171942`

## Locked assets

Expected and verified:
- Porsche exterior SHA-256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- Engine SHA-256: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Git blobs are identical on the canonical, D and E branches:
- exterior blob: `d5d746376a2e6753ae1bbb1ee638c160a3ef32ab`
- engine blob: `0ee04c589d13c12d3a4525b2246bbcc6cdc58f70`

No Porsche/engine asset bytes were changed.

## Agent D integrated scope

Canonical source:
- `yunex/src/TrackPreview.tsx`

Canonical proof bundle:
- `yunex/track-refinement/visual-polish/landscape_polished.png`
- `yunex/track-refinement/visual-polish/portrait_polished.png`
- `yunex/track-refinement/visual-polish/landscape_comparison.png`
- `yunex/track-refinement/visual-polish/portrait_comparison.png`
- `yunex/track-refinement/visual-polish/landscape_polished_ffprobe.json`
- `yunex/track-refinement/visual-polish/portrait_polished_ffprobe.json`
- `yunex/track-refinement/visual-polish/VISUAL_POLISH_QA.md`

Not integrated:
- D's branch-specific rewrite of `.github/workflows/yunex-track-refinement.yml`
- private base64 review-helper files

Technical validation:
- polished landscape: PNG / RGB24 / 1600 × 1000
- polished portrait: PNG / RGB24 / 1080 × 1920

Visual inspection by integration agent:
- landscape keeps the Porsche scale/composition while tree crowns are less repetitive
- portrait is materially stronger: Porsche is larger and more dominant
- empty sky/asphalt are reduced
- splitter, body, visible wheels and rear wing remain inside the frame
- no visible rail/foliage intersection was introduced
- green livery remains distinct from the subdued background

Tradeoff:
- portrait is intentionally more frontal three-quarter than Agent A
- tree-silhouette changes are shared source and will affect future motion renders, but Agent B's timing/path/output files were not replaced

## Agent E integrated scope

Canonical source:
- `yunex/src/ModelLedVideo.tsx`
- `yunex/src/index.tsx`

Canonical proof bundle:
- `yunex/motion-polish/wheel_motion_proof.mp4`
- `yunex/motion-polish/aero_motion_proof.mp4`
- wheel/aero inspection PNGs
- wheel/aero ffprobe JSON
- `yunex/motion-polish/proof_sha256.txt`
- `yunex/motion-polish/MOTION_POLISH_QA.md`

Not integrated:
- `.github/workflows/yunex-wheel-aero-polish.yml`

Wheel implementation:
- uses existing `Spin_FL`, `Spin_FR`, `Spin_RL`, `Spin_RR` pivots
- deterministic frame-driven local-X rotation
- smooth ramp from the traction beat
- no phase reset
- calipers remain outside the rotating spin pivots

Aero implementation:
- seven restrained 3D streamline families
- centre/roof, shoulder/side and low underbody paths
- front-to-rear moving tracer beads
- rear-wing relationship retained
- restrained green/copper treatment
- illustrative-airflow disclaimer retained

Technical validation independently rechecked from the rendered artifacts:
- wheel proof: 1080 × 1920, H.264, 30 fps, 90 frames
- aero proof: 1080 × 1920, H.264, 30 fps, 120 frames
- full FFmpeg decode of both proofs: PASS

Visual inspection by integration agent:
- wheel spoke orientation changes coherently through the sampled proof; no visible hub wobble
- aero contact sequence reads progressively front → rear
- airflow remains thin/subtle and the Porsche stays dominant
- roof/side/underbody paths are visually distinct
- rear-wing/downforce relationship is readable
- no obvious popping or distracting body penetration was observed in the reviewed proof frames/contact sheet

## Conflict resolution

D and E edit separate functional source areas:
- D: `TrackPreview.tsx`
- E: `ModelLedVideo.tsx` + proof registrations in `index.tsx`

They therefore combine cleanly.

Integration was selective, not a blind branch merge. Temporary agent workflows were excluded. The existing canonical proof history from Agents A/B/C was retained.

## Full-film state

`yunex/src/FinalFinish.tsx` is byte-identical before/after this D/E integration (Git blob `d96b4981b894f897348df7917e119b73b69492d6`).

The integration diff contains no replacement of `v3-review.mp4`, VO or audio.

Agent E's wheel/aero improvements are now canonical in the live `ModelLedVideo` source, but they are **not yet baked into the existing flattened FinalFinish base**.

## Result

Agent D and Agent E polish work is integrated and validated on `sol/yunex-full-film-v2`.

Next film step, only when requested: regenerate/review the live V3 base with the integrated source before replacing any flattened full-film base.
