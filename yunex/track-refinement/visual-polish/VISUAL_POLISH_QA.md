# YUNEX track visual polish — VISUAL POLISH QA

## Provenance

- Agent D branch: `sol/yunex-track-visual-polish`
- Started from: `sol/yunex-track-static-final`
- Agent A branch head / Agent D fork merge-base verified by branch comparison: `f93985f3432b724a93222bb950a1af436049c2a0`
- Agent A render source recorded in `STATIC_QA.md`: `c714d3282e80f960ed039ee706f66153d3cda50b`
- Agent A generated proof commit recorded in the handoff/QA: `a362b8d5df922aae36292df38479c7040c88e8f6`
- Agent D work is isolated from `sol/yunex-track-motion-final` and from the 27.6-second full-film source.

## Locked approved assets

- Porsche exterior SHA-256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- Engine SHA-256: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

The isolated visual-polish workflow verifies both hashes before rendering and again after rendering, before the proof-output commit step. The final proof bundle was committed only after those checks passed.

A direct branch comparison from `sol/yunex-track-static-final` to `sol/yunex-track-visual-polish` also confirms there are no changes to:
- `cars/porsche-911-gt3-rs-992/model.glb`
- `cars/porsche-911-gt3-rs-992/engine/engine.glb`
- any Porsche geometry/material/livery source
- Agent B motion outputs/source
- audio/VO
- the full 27.6-second film

## Final source changes

### Portrait camera

Agent A final portrait:
- Position: `[6.65, 1.85, 7.95]`
- Target: `[-0.05, 0.38, 0.18]`
- FOV: `40°`

Agent D final portrait:
- Position: `[2.20, 1.45, 5.85]`
- Target: `[-0.05, 0.38, 0.18]`
- FOV: `55°`

The closer, more frontal three-quarter camera reduces the projected horizontal length of the Porsche enough to make it materially larger in the 9:16 frame without cropping the splitter, wheels, body or rear wing. The final FOV keeps clean side margins.

The landscape camera is unchanged:
- Position: `[3.35, 1.50, 4.25]`
- Target: `[-0.10, 0.58, 0.15]`
- FOV: `36°`

The motion camera, 75-frame timing and orbit path are unchanged.

### Foliage / background polish

The environment was not rebuilt.

Only the most visible tree-crown repetition was refined:
- tree count and placement system remain deterministic
- existing subdued tree palette remains
- added restrained per-tree crown width variation
- added restrained per-tree crown height variation
- added small deterministic crown asymmetry
- added slight trunk lean
- replaced the repeated fixed four-lobe crown recipe with three deterministic five-lobe crown silhouettes
- retained low-detail motion geometry/shadow behaviour
- shrubs, kerb, rail, asphalt, verge and track layout were not redesigned

The result remains intentionally lightweight/procedural. It is less obviously made from repeated primitive clusters, while still keeping the Porsche brighter and sharper than the background.

## Rendered outputs

Required proof files:
- `yunex/track-refinement/visual-polish/landscape_polished.png`
- `yunex/track-refinement/visual-polish/portrait_polished.png`
- `yunex/track-refinement/visual-polish/landscape_comparison.png`
- `yunex/track-refinement/visual-polish/portrait_comparison.png`

Technical metadata:
- `yunex/track-refinement/visual-polish/landscape_polished_ffprobe.json`
- `yunex/track-refinement/visual-polish/portrait_polished_ffprobe.json`

Compact private review helpers were also generated from the exact comparison PNGs so the private branch renders could be opened and visually checked:
- `landscape_comparison_review.jpg.b64`
- `portrait_comparison_review.jpg.b64`

## Dimension validation

Final ffprobe results:
- `landscape_polished.png`: PNG / RGB24 / **1600 × 1000**
- `portrait_polished.png`: PNG / RGB24 / **1080 × 1920**

Workflow assertions also require:
- `landscape_comparison.png`: **3200 × 1000**
- `portrait_comparison.png`: **2160 × 1920**

## Human visual inspection

The actual Agent A → Agent D comparison renders were opened and inspected after the final render.

### Landscape

Result: **improved / no regression**

- Porsche framing and scale remain matched to Agent A.
- Complete Porsche silhouette remains visible.
- Tyres remain visually planted.
- Foliage remains behind the rail and does not intersect the car.
- New tree crowns show more varied width, height and asymmetry.
- The repeated round four-lobe/tree-wall impression is reduced.
- Background greens remain muted relative to the white/green Porsche.
- Kerb, guardrail, verge and overall local-circuit layout remain unchanged.
- No new distracting scenery or visual clutter was introduced.

### Portrait

Result: **materially improved**

- Porsche is substantially larger and more dominant in the 9:16 composition than Agent A.
- Empty asphalt below is visibly reduced.
- Empty sky above is also reduced after the final vertical balance correction.
- Front splitter has a clean visible margin.
- Full body and all visible wheels remain inside frame.
- Rear wing/endplate remains fully visible with safe margin.
- The view is more frontal than Agent A's portrait, intentionally shortening the projected car width so the car can be larger without clipping.
- The result still reads as a low premium front-three-quarter automotive angle rather than a flat head-on shot.
- No foliage-to-car or guardrail-to-car intersection was observed.
- The green livery remains distinct from the subdued foliage.

## Tradeoffs / limitations

- The foliage is still authored procedural low-poly geometry, not scanned/photoreal vegetation. The goal of this pass was to make the silhouettes less repetitive, not introduce a new vegetation system.
- The portrait uses a more frontal three-quarter perspective than Agent A. This is the deliberate tradeoff that allows a much larger Porsche in a narrow 9:16 frame while preserving the full silhouette.
- Shared tree-silhouette source changes would affect motion mode if Agent C later integrates them, but Agent D did not change motion timing, orbit, duration, output files or Agent B's branch.

## Integration recommendation

**Yes — Agent C should integrate this visual polish.**

Recommended integration scope:
1. take the final portrait camera settings from Agent D;
2. take the restrained tree-silhouette refinements from Agent D;
3. preserve Agent B's motion timing/path and outputs;
4. keep the Porsche and engine hashes locked exactly as above;
5. do not pull in any unrelated full-film changes.

## Acceptance result

PASS.

- portrait Porsche is materially larger
- dead sky/asphalt are reduced
- complete silhouette remains visible
- foliage reads less repetitive / less blob-like
- landscape is not degraded
- Porsche/engine hashes remain locked
- actual comparison renders were visually inspected
- Agent B motion work and the full film were not touched
