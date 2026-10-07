# YUNEX 003 — POLISH 02 — AGENT G — NATIVE RENDER / DELIVERY
Phase: Y003-POLISH-02
Work branch: sol/y003-p02-render
Owned production files: yunex/video003/render/, .github/workflows/yunex-003-*.yml, yunex/video003/reports/P02-G/
Do not redesign visuals or edit A/B/C/central composition.

## Start condition
Do preparation/benchmarking immediately, but do NOT launch the expensive final render until Manager publishes an exact approved P02 render_source_sha after integrated moving-proof review.

## Mission
Reuse the proven Y003 native chunk/render pipeline for the revised source.
Do not reuse stale visual chunks from the old source.

## Final requirements
- 1080 x 1920
- scale 1
- 30 fps
- exactly 735 frames
- exactly 24.5 s expected timeline
- H.264
- yuv420p
- AAC audio
- faststart
- supplied narration/mix timing unchanged

Use deterministic exact-source chunks if chunking is required.
A changed source SHA invalidates affected chunks.
One final normalization encode is acceptable where the proven pipeline requires it; document it.

## Validate
- full decode
- exact frame count/fps/duration
- audio present and synchronized
- no missing/corrupt frames
- no visible chunk seams
- seven native milestone frames
- model hash unchanged
- artifact provenance tied to render_source_sha

Return artifact/run IDs, validation, reproducible commands/workflow and full remote SHA.
Do not claim final visual approval; H owns independent final QA.
