# YUNEX track motion proof — final QA

## Provenance

- Branch: `sol/yunex-track-motion-final`
- Render source commit: `c8c9d8a79f018478d896e84e190dae844bcd0708`
- Segmented render workflow run: `37330180125`
- Composition: `YUNEX-TRACK-MOTION-PROOF`

## Native render

The real frame-driven Remotion / Three.js proof was rendered as three native frame ranges to avoid the CI single-job timeout, then concatenated without re-encoding:

- frames 0–24
- frames 25–49
- frames 50–74
- each range used `--gl=swangle --concurrency=2 --codec=h264 --crf=17 --timeout=120000`
- final assembly used FFmpeg concat stream copy; no CSS pan or flattened Porsche replacement was used.

Final proof:
- 1080 × 1920
- 30/1 fps
- 75 frames
- 2.5 seconds
- H.264
- full FFmpeg decode: PASS

## Locked assets

- Approved Porsche exterior SHA-256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- Approved engine SHA-256: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`
- Both locked hashes passed before/after segment rendering and were rechecked before publication.
- Porsche and engine geometry, materials, livery, transforms, scale and placement contract were not modified.

## Inspection

Exact required inspection PNGs were opened and inspected:
- `motion_frame_000.png` — frame 0
- `motion_frame_mid.png` — frame 37
- `motion_frame_end.png` — frame 74

The assembled MP4 was also sampled at frames 0, 12, 24, 25, 37, 49, 50, 62 and 74 to inspect motion continuity and both segment boundaries.

Human visual result:
- no foliage popping observed
- no transparency instability observed
- no Porsche clipping or crop caused by the orbit
- no floating tyres observed
- guardrail remains behind the Porsche with no rail/car intersection
- Porsche contact shadow remains present throughout
- green livery stays clearly separated from the subdued foliage
- foliage spacing remains varied enough to avoid a single obvious repeated wall
- perspective remains coherent through the move
- frame 24→25 and frame 49→50 joins are visually continuous
- camera motion remains restrained and premium rather than a sweeping game-camera move

## Corrective pass

No corrective scene pass was required after the final visual inspection. The existing motion-only optimisations are retained:
- 75 frames / 2.5 s
- motion foliage shadow cost reduction
- reduced motion foliage tessellation
- 1024 motion shadow map
- frame-driven orbit over frames 0→74

## Remaining limitation

Foliage is intentionally deterministic procedural low-poly geometry rather than photoreal scanned vegetation. It is stable, subdued and suitable for this proof, but remains stylised at close scrutiny. This branch completes only the native motion proof; it does not re-edit the 27.6-second film.
