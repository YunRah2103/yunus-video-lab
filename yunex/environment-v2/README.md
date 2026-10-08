# YUNEX reusable circuit environment V3

Authorised by the user's request to replace the soulless environment for future films and deliver one actual moving MP4. Based on the latest fetched dual-release branch at 1260d99bbc1020c9bf3be9ccd2d2346f8a709d59. This is an opt-in reusable environment; released YUNEX 001–004 compositions are not visually changed.

V3 extends the approved V2 release following the user's request for further improvement. The compatibility component name remains CircuitWorldV2. V2 is preserved on sol/yunex-circuit-environment-v2; V3 lives on sol/yunex-circuit-environment-v3. Immutable V3 movie source: 82fc641dc97fb6ce62b787223be1cca0ff3c5ea2.

V3 adds denser and broader woodland with near-road alpha leaf shadows, varied grass and gravel, 4,200 grass tufts, garage glazing/cladding/roof seams, marked pit apron, terrace/benches, safety cones, cylindrical tire bundles and verge stones. Camera three is raised to reduce empty sky. Native-proof corrections shortened exposed tree branches and detailed the visible garage wall.

## Reuse

Import `CircuitWorldV2` from `src/environment/CircuitWorldV2.tsx` inside the existing ThreeCanvas. Supply the same world-space `carPose` from the driving sampler. It replaces BOTH legacy `TrackWorld` and `Y003CircuitWorldExtension`; do not mount them together. It owns lighting, sky, terrain and circuit furniture. Keep the original Porsche, sampler and rig.

Approved physical road geometry, root transform, surface elevation, kerbs and runoff are reused without changes. Scenery is derived from that same layout. New terrain, 347 varied trees with individual alpha leaves, shrubs, catch fencing/guardrails, marshal post, roofed grandstand, garages, race-control tower and YUNEX gantry. Blue sky/warm directional light and lighter haze improve depth; fixed sun direction with car-following shadow bounds maintains continuity.

Paddock terrain is a smoothly graded flat foundation. All tree origins derive from terrain elevation. Seed 210304 provides reproducible placement. Scenery does not enter the racing envelope.

## Showcase

`YUNEX-CIRCUIT-V3`, 12 s, 360 frames, 1080×1920, 30 fps. Four actual rolling shots: low rear tracking, elevated front tracking, side rolling, rear chase. Original rear-steer rig keeps spin axes and independent calipers. Motion samples reuse four approved native driving ranges; source-frame mapping is one-to-one within shots. Car is always driving, including the ending.

Sound is a restrained synthetic engine/road/wind demonstration bed. It is not claimed to be a real Porsche recording and does not reuse or alter Cedar narration. Future episode mixes should use their own approved audio.

## Render and evidence

`python3 environment-v2/make_sound.py public/circuit-v2-sound.wav` and stage original `cars/porsche-911-gt3-rs-992/model.glb` as `public/model.glb` before rendering. `npx remotion render src/index.tsx YUNEX-CIRCUIT-V3 out/showcase.mp4 --gl=swangle --concurrency=1 --codec=h264 --pixel-format=yuv420p --crf=16`.

GitHub workflow builds native shot proofs first, then six disjoint 60-frame chunks, validates and assembles the final MP4 with AAC. Source SHAs and ranges accompany clips. Full decoder, exact count and adjacent-frame checks accompany delivery. Optical approval must follow inspection of actual output; successful source tests alone are insufficient.

## Foliage asset

`public/circuit-v2-oak-cluster.webp` is a generated photographic-style oak leaf-cluster alpha texture, created with the built-in image tool for this project. Prompt: irregular mature European oak foliage cluster, botanical photographic detail, transparent background and holes, no trunk/ground/sky/text, soft afternoon light. The original transparent PNG is retained separately; runtime WebP is a compressed alpha-preserving version. This raster texture is applied to real 3D canopy cluster cards; it does not replace the rendered scene with an image. Runtime asset SHA256: 0491a906a61458fcf6c56be8ff72b8a3d9be38e525d0aeb25d6e46a593bad1ec.

Final polish: shorter varied trunks, verge grass, corrugated metal garage doors, window mullions, corrected sign orientation, blue procedural sky dome, graded paddock foundations and bump-mapped asphalt. Camera stays inside catch fencing in the side shot.
