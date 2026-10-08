# YUNEX Circuit Environment V3 — Final Release

## Delivered MP4
- YUNEX_CIRCUIT_ENVIRONMENT_V3.mp4
- SHA256: b0f6a58b0d3b9964765865c75591a623bfc348cd6f89333f5268058f7bee61a4
- Bytes: 64522834
- Exactly 12.000 s, 360 frames, 1080 × 1920, 30 fps CFR.
- H.264, true yuv420p, TV range; AAC 48 kHz stereo; faststart verified.

## Source and render
- Dedicated branch: sol/yunex-circuit-environment-v3.
- Immutable render source: 82fc641dc97fb6ce62b787223be1cca0ff3c5ea2.
- Actions run: https://github.com/YunRah2103/yunus-video-lab/actions/runs/37842617457
- Final artifact: 11580675094, YUNEX-CIRCUIT-ENVIRONMENT-V3-FINAL.
- Download: https://github.com/YunRah2103/yunus-video-lab/actions/runs/37842617457/artifacts/11580675094
- Corrected native shot proof: 11577554864.
- Inspected standalone moving chunks: 11580265732 (120–179) and 11579766981 (180–239).
- All eight jobs passed: proof, six disjoint native chunks and final assembly.
- The first V3 run was superseded by proof-based corrections. This final run uses the corrected source.
- This release-record commit changes documentation only; it does not change the source used to render.

## What improved
347 varied trees with broader canopy and near-road alpha foliage shadows; 4,200 grass tufts; mottled grass, gravel shoulders and sparse stones; garage glazing, cladding and roof seams; marked pit apron, terrace and benches; cones and cylindrical tire stacks. Brighter fill/sun and depth haze. Camera three raised to reduce empty sky while keeping the whole car framed.
Native proofs revealed exposed branches and a blank visible garage wall; those were corrected before this render.
The original Porsche GLB, rear-steer rig, driving sampler and physical road/kerb/runoff modules remain unchanged. The reusable compatibility component remains CircuitWorldV2; see README.md.

## Validation and actual optical review
- Native layout audit passes: 347 trees, deterministic placement, minimum tree-to-road-edge clearance 8.74841985180974 m.
- All 360 driving samples pass containment and within-shot wheel-spin continuity; minimum car-to-road-edge clearance 3.106097981979639 m.
- Fresh actual-Porsche-GLB rig regression passes: zero hub offset, zero caliper spin, maximum rim precession 0.000032013665695784785 degrees and maximum tyre contact error 1.0330059481422627e-8 m.
- Remotion bundle and scene compilation pass. Python finishing script compiles.
- The actual downloaded final MP4 matches the CI SHA256.
- Independent complete video and audio decoding passes.
- All 360 presentation timestamps equal frame number / 30 within 1e-5 s.
- No adjacent duplicate decoded frames. Exactly 360 video frames.
- All 360 decoded frames differ from V2: this is real visual change, not a filename/container change.
- Final encoding independently probed: H.264 yuv420p TV 1080x1920 30/1; AAC 48000 Hz stereo; duration 12.000.
- Faststart verified by MP4 box order (moov before mdat).
- Inspected all 360 sequential thumbnails from the actual final movie, four native proof views, wheel crops and phone-sized opening, shot boundaries, hero views and final frame.
- Result: Porsche stays fully framed and planted, clear road-relative parallax, no apparent wheel wobble, legible restrained typography and an active final moving shot. No blocking optical defect found.
- Review was frame-based. Continuous normal-speed sound-on/muted playback was unavailable; no claim of that review is made.
- This remains a stylized native Three.js scene. The demonstration sound bed is synthetic engine/road/wind, not an authentic Porsche recording. It has no narration and does not replace the approved Cedar recording.

## Future reuse
Use this branch or pin the immutable render source. Mount CircuitWorldV2 inside the existing ThreeCanvas with the same world-space driving root pose. It replaces both old track-world components. Preserve the Porsche and steering rig. Future shot routes still require their own containment and visual proofs.
MP4s and intermediate archives remain external artifacts and are not committed to Git.
