# YUNEX track foliage refinement — implementation note

This pass extends the existing approved Porsche track presentation without changing the car, engine, livery, materials, proportions, pivots, placement contract or approved film.

## Environment changes

- Added a narrow deterministic procedural grass verge plus a subdued dirt/grass seam outside the asphalt.
- Added deterministic, irregular shrubs and varied trees beyond the existing guardrail.
- Added a deeper grass ground layer and mild scene fog for layered atmospheric perspective instead of a flat green wall.
- Kept the approved 1600 × 1000 landscape camera exactly at the existing baseline position and target.
- Added a native 1080 × 1920 portrait hero composition and a 90-frame portrait motion proof with a restrained frame-driven orbit/pan.
- Kept outdoor lighting coherent and background greens lower-contrast than the Porsche.

## Asset provenance

No third-party foliage, terrain, HDRI or texture asset is introduced. Grass/asphalt variation uses seeded procedural DataTextures and the shrubs/trees use deterministic Three.js primitive geometry authored in \`src/TrackPreview.tsx\`.

## Locked assets

- Approved exterior SHA-256: \`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb\`
- Refined engine SHA-256: \`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d\`

The render validation workflow verifies both hashes before and after proof rendering.

## Reproduce

From \`yunex\` with the existing dependencies installed:

\`\`\`bash
node render-track.cjs
\`\`\`

Outputs:
- \`track-refinement/after_landscape.png\`
- \`track-refinement/portrait_hero.png\`
- \`track-refinement/portrait_motion_proof.mp4\`

The GitHub Actions refinement workflow additionally recreates the landscape baseline from commit \`73893baf2a75111cf91fd9d77fa83156c53d2e91\`, generates a matched before/after comparison, checks image/video dimensions and the 90-frame motion proof, performs a full FFmpeg decode, and persists the review bundle.

The full 27.6-second film is intentionally not re-edited in this pass; the environment proofs are reviewed first.
