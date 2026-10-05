# YUNEX approved Porsche — track presentation
One additional native 1600 × 1000 PNG presentation, not a film revision.

Run from yunex with existing dependencies:
```bash
node render-track.cjs
```
Output: out/YUNEX_GT3RS_TRACK_FINAL.png.
Composition: YUNEX-TRACK-PREVIEW.

TrackPreview.tsx loads public/model.glb read-only, preserving its geometry, livery, PBR material values and root transform. The road height follows the model's world minimum Y. Deterministic procedural asphalt/sky, a short painted kerb and a parallel guardrail form the environment. Outdoor PMREM reflections and directional cast shadows use the original model materials.

Final native render inspected after correcting empty sky and clipped front framing. PNG decoded/verified; approved exterior SHA-256 remains 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb. Film and engine files are unchanged. The final image is delivered separately; the repository contains its reproducible scene and render driver.
