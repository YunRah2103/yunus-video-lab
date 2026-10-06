# Reusable YUNEX track landscape
Component: src/video002/trackUpgrade/DistantLandscape.tsx.
Purpose: surround the existing small track with continuous distant coverage visible from every camera azimuth, leaving the car/wing/camera corridor clear.
Usage inside the same ThreeCanvas: <DistantLandscape seed={2103}/>.
Mount in WORLD space, outside the rotated track-local group. Default world groundY=-.025, road corridor x=-15.2..2.22, ring centre[-6,0,3]. All future videos using this approved track reuse the same module/seed/layout; do not copy the component into each new film or regenerate terrain per frame.
Deterministic seed changes arrangement without asynchronous asset loading. Two far tree belts, low shrubs on formerly empty side and surrounding grass planes; instanced geometry, no tree shadow maps or perframe animation. Approximately224trees/896canopyinstances plus68shrubs,3instanced layers/4groundplanes.
Keep TrackWorld as environment composition root. Future shot paths can change freely within the established central safe corridor. If a different track requires different road bounds, extend a shared configuration in this module after native lookdev; do not scale grass over road or move forest into camera stations.
No approved Porsche GLB/material/rig/timeline modifications. Current change uses live3D geometry, no background plate/fakepanning.
Validation: fresh seven native beat stills and short moving proof on landscape branch; full render must use all fresh frames0..750 from SAME source SHA. Previous H cached opening chunks are invalid for this background revision.
Status: seven native views inspected on dd332bceca47f07ab56fa5600fbc52c32c579b4b; leaf-detail revision accepted for background coverage. Final camera-corridor check and complete fresh render pending.


## Reuse contract
- Import the existing DistantLandscape and TrackWorld modules into future films; do not duplicate their source per video.
- The car and aero controls are independent of the environment. This landscape contains no Porsche mesh, narration, edit timing or camera keyframes.
- Use seed 2103 to retain the YUNEX location across videos. Placement is static world-space data, not regenerated when frames change.
- Shared vegetation/foliageGeometry.ts provides seeded leaf-cluster geometry and a procedural alpha-tested leaf texture, also used by TrackVegetation. Textures and geometry are created once and disposed on unmount.
- Leaf materials use alpha testing with normal depth writes, not sorted transparent foliage. Distant layers do not add shadow-map passes.
- Tall fencing starts beyond the established opening-camera corridor. Keep this clearance when adding future shots.
- Native 1080x1920 proof and full output checks are required after changes affecting the environment or cameras. Do not approve scenery from source alone.
