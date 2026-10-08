# YUNEX reusable circuit environment V2

Authorised by the user's request to replace the soulless environment for future films and deliver one actual moving MP4. Based on the latest fetched dual-release branch at 1260d99bbc1020c9bf3be9ccd2d2346f8a709d59. This is an opt-in reusable environment; released YUNEX 001–004 compositions are not visually changed.

## Reuse

Import `CircuitWorldV2` from `src/environment/CircuitWorldV2.tsx` inside the existing ThreeCanvas. Supply the same world-space `carPose` from the driving sampler. It replaces BOTH legacy `TrackWorld` and `Y003CircuitWorldExtension`; do not mount them together. It owns lighting, sky, terrain and circuit furniture. Keep the original Porsche, sampler and rig.

Approved physical road geometry, root transform, surface elevation, kerbs and runoff are reused without changes. Scenery is derived from that same layout. New terrain, 154 varied trees with individual alpha leaves, shrubs, catch fencing/guardrails, marshal post, roofed grandstand, garages, race-control tower and YUNEX gantry. Blue sky/warm directional light and lighter haze improve depth; fixed sun direction with car-following shadow bounds maintains continuity.

Paddock terrain is a smoothly graded flat foundation. All tree origins derive from terrain elevation. Seed 210304 provides reproducible placement. Scenery does not enter the racing envelope.

## Showcase

`YUNEX-CIRCUIT-V2`, 12 s, 360 frames, 1080×1920, 30 fps. Four actual rolling shots: low rear tracking, elevated front tracking, side rolling, rear chase. Original rear-steer rig keeps spin axes and independent calipers. Motion samples reuse four approved native driving ranges; source-frame mapping is one-to-one within shots. Car is always driving, including the ending.

Sound is a restrained synthetic engine/road/wind demonstration bed. It is not claimed to be a real Porsche recording and does not reuse or alter Cedar narration. Future episode mixes should use their own approved audio.

## Render and evidence

`python3 environment-v2/make_sound.py public/circuit-v2-sound.wav` and stage original `cars/porsche-911-gt3-rs-992/model.glb` as `public/model.glb` before rendering. `npx remotion render src/index.tsx YUNEX-CIRCUIT-V2 out/showcase.mp4 --gl=swangle --concurrency=1 --codec=h264 --pixel-format=yuv420p --crf=16`.

GitHub workflow builds native shot proofs first, then six disjoint 60-frame chunks, validates and assembles the final MP4 with AAC. Source SHAs and ranges accompany clips. Full decoder, exact count and adjacent-frame checks accompany delivery. Optical approval must follow inspection of actual output; successful source tests alone are insufficient.
