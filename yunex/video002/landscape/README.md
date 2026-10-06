# Reusable YUNEX track landscape
Component: src/video002/trackUpgrade/DistantLandscape.tsx.
Purpose: surround the existing small track with continuous distant coverage visible from every camera azimuth, leaving the car/wing/camera corridor clear.
Usage inside the same ThreeCanvas: <DistantLandscape seed={2103}/>.
Mount in WORLD space, outside the rotated track-local group. Default world groundY=-.025, road corridor x=-15.2..2.22, ring centre[-6,0,3]. All future videos using this approved track reuse the same module/seed/layout; do not copy the component into each new film or regenerate terrain per frame.
Deterministic seed changes arrangement without asynchronous asset loading. Two far tree belts, low shrubs on formerly empty side and surrounding grass planes; instanced geometry, no tree shadow maps or perframe animation. Approximately224trees/896canopyinstances plus68shrubs,3instanced layers/4groundplanes.
Keep TrackWorld as environment composition root. Future shot paths can change freely within the established central safe corridor. If a different track requires different road bounds, extend a shared configuration in this module after native lookdev; do not scale grass over road or move forest into camera stations.
No approved Porsche GLB/material/rig/timeline modifications. Current change uses live3D geometry, no background plate/fakepanning.
Validation: fresh seven native beat stills and short moving proof on landscape branch; full render must use all fresh frames0..750 from SAME source SHA. Previous H cached opening chunks are invalid for this background revision.
Status: completed native frame render and final editorial export. All 751 frames verified at 1080x1920, 30 fps; whole film checked through 50 chronological review frames plus native beat proofs. Real-time playback/listening unavailable here.


## Reuse contract
- Import the existing DistantLandscape and TrackWorld modules into future films; do not duplicate their source per video.
- The car and aero controls are independent of the environment. This landscape contains no Porsche mesh, narration, edit timing or camera keyframes.
- Use seed 2103 to retain the YUNEX location across videos. Placement is static world-space data, not regenerated when frames change.
- Shared vegetation/foliageGeometry.ts provides seeded leaf-cluster geometry and a procedural alpha-tested leaf texture, also used by TrackVegetation. Textures and geometry are created once and disposed on unmount.
- Leaf materials use alpha testing with normal depth writes, not sorted transparent foliage. Distant layers do not add shadow-map passes.
- Tall fencing starts beyond the established opening-camera corridor. Keep this clearance when adding future shots.
- Native 1080x1920 proof and full output checks are required after changes affecting the environment or cameras. Do not approve scenery from source alone.


## Delivered version
- Rendered source: 606f560b98ba2f600142f4836fb863ab2ff5bbb3; GitHub Actions run 37468376991. All 38 chunks came from this exact source, with no cached old opening.
- Final: YUNEX_002_REUSABLE_TRACK_FINAL.mp4, 25.033333 seconds, 751 frames, 1080x1920, H.264 yuv420p, exact 30/1 average and nominal frame rate, AAC 48kHz mono copied unchanged.
- Final SHA256: 599fb5bc11daf868d4d4a133c088f78a8b9945f3a71f27b9246479acb436da30.
- See EDIT_QA.json and final_probe.json for checks, limits and provenance; chunk_manifest.json proves exact coverage.
- The final was assembled locally from verified GitHub chunk archives while the remote stitch job was delayed installing FFmpeg. Every archive SHA256 matched its GitHub digest. Raw concat metadata has a one-clock-tick rounding difference; the finished encode is verified exactly 30fps with all frames retained.
- finish.py records the established finishing pass. To reproduce, stage the concatenated native visual with the approved AAC as YUNEX_002_FINAL_MASTER.mp4 beside it, and stage the approved Barlow Condensed ExtraBold font in fonts/Display.ttf. Requires FFmpeg with libass. Apply the pass once.
- Reuse TrackWorld with quality='final' and seed=2103 for the complete environment. Reuse DistantLandscape alone only when keeping the same world-space road bounds and lighting. Never place it inside the rotated track-local group.
