# Reusable YUNEX track landscape
Component: src/video002/trackUpgrade/DistantLandscape.tsx.
Purpose: surround the existing small track with continuous distant coverage visible from every camera azimuth, leaving the car/wing/camera corridor clear.
Usage inside the same ThreeCanvas: <DistantLandscape seed={2103}/>.
Mount in WORLD space, outside the rotated track-local group. Default world groundY=-.025, road corridor x=-15.2..2.22, ring centre[-6,0,3]. All future videos using this approved track reuse the same module/seed/layout; do not copy the component into each new film or regenerate terrain per frame.
Deterministic seed changes arrangement without asynchronous asset loading. Two far tree belts, low shrubs on formerly empty side and surrounding grass planes; instanced geometry, no tree shadow maps or perframe animation. Approximately224trees/896canopyinstances plus68shrubs,3instanced layers/4groundplanes.
Keep TrackWorld as environment composition root. Future shot paths can change freely within the established central safe corridor. If a different track requires different road bounds, extend a shared configuration in this module after native lookdev; do not scale grass over road or move forest into camera stations.
No approved Porsche GLB/material/rig/timeline modifications. Current change uses live3D geometry, no background plate/fakepanning.
Validation: fresh seven native beat stills and short moving proof on landscape branch; full render must use all fresh frames0..750 from SAME source SHA. Previous H cached opening chunks are invalid for this background revision.
Status: lookdev in progress, not visually approved or final-rendered yet.
