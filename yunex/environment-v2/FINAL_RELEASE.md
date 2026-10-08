# YUNEX Circuit Environment V2 — Final Release

## Delivered movie
- File: YUNEX_CIRCUIT_ENVIRONMENT_V2.mp4
- SHA256: 7985c6662db09621a318e3439c7f96888783c6cd5321ef16cb1fb88b6c2cc182
- Bytes: 53,141,920
- 12.000 seconds; 360 frames; 1080 × 1920; 30 fps CFR.
- H.264, true yuv420p, TV range; AAC 48 kHz stereo; faststart.

## Immutable rendering source
- Branch: sol/yunex-circuit-environment-v2
- Render source: d501217476a3532571203eb323aa07329ed05775
- GitHub Actions run: https://github.com/YunRah2103/yunus-video-lab/actions/runs/37834526569
- Final artifact ID: 11576965432
- Download: https://github.com/YunRah2103/yunus-video-lab/actions/runs/37834526569/artifacts/11576965432
- Artifact name: YUNEX-CIRCUIT-ENVIRONMENT-V2-FINAL
- All eight workflow jobs passed. This documentation commit does not change the immutable rendered source.

## Environment and reuse
CircuitWorldV2 is an opt-in reusable environment. See README.md for integration and rendering.
The environment adds varied oak foliage, grass and bushes, rolling terrain, three-bay paddock garages, a glazed control tower, roofed grandstand, marshal shelter, gantry, continuous guardrails and fencing, braking markers and warmer sunlight against a blue sky.
The approved Porsche GLB, steering rig, wheel/caliper separation, driving utilities and physical road layout remain unchanged. Existing episodes remain unaffected.
Use CircuitWorldV2 instead of both previous environment components, with the same world-space car pose. Do not mount competing track worlds.

## Proof-based corrections
Initial native proofs revealed a side camera obscured by catch fencing, a grey sky and artificial foliage. The side camera was moved inside the fence; the sky/light and grass were corrected; an alpha oak-cluster texture, finer grass and architectural detail were added.
The final render contains all of these corrections. No blocking visual defects were found in the finished-file review.

## Validation and actual review
- Original model SHA256 verified: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.
- Alpha foliage WebP SHA256 verified: 0491a906a61458fcf6c56be8ff72b8a3d9be38e525d0aeb25d6e46a593bad1ec.
- Deterministic environment audit passed: 154 trees; minimum tree-to-road-edge clearance 8.761723 m.
- All 360 motion frames passed containment and wheel-spin continuity checks within each shot; minimum car-to-road-edge clearance 3.106098 m.
- Native Remotion bundle and full-resolution six-chunk rendering passed.
- The actual downloaded final MP4 matches the published checksum.
- Independent complete video and audio decoding passed.
- All 360 presentation timestamps match frame number / 30; no adjacent duplicate decoded frames.
- MP4 moov precedes mdat: faststart verified.
- All 360 sequential frame thumbnails were inspected, including independently downloaded native middle chunks. Phone-sized keyframes, wheel crops, opening, transitions and final frame were inspected.
- The Porsche stays framed and grounded, the environment has road-relative parallax, the wheels show no apparent wobble, typography remains restrained and the final shot is moving.
- Review was frame-based. Uninterrupted normal-speed sound-on/muted playback was not available; no claim of that review is made.
- Sound is a quiet synthetic engine/road/wind demonstration bed, not an authentic Porsche recording. No narration is used and the approved Cedar recording is unchanged.
- This remains a stylized native 3D scene, not a claim of photoreal footage.

MP4s and intermediate render archives are external artifacts, not committed to the repository.
