# YUNEX 003 POLISH-03 — direct master revision

User requested remaining wheel wobble and environment fixes after POLISH-02 delivery. This revision is based on exact rendered integration source 0db1a6509c54b6df1df0422152aa90d7c02b5de1; no agent handoff or production restart.

Root cause: approved GLB wheels have baked 1-degree front and 2-degree rear camber, while the runtime spun their geometry about +X. A new regression test measures actual GLB rim-plane normals over 72 spin angles per wheel; the unchanged POLISH-02 rig failed with 3.9999998 degrees of axle precession. Synthetic hub/X-axis QA did not catch this geometry-dependent defect.

Correction: spin about the measured source camber axes. The actual-asset test now measures 0.0000321 degrees maximum precession; all 735-frame motion contract checks pass. Source GLB bytes, proportions, livery, suspension, timing and approved audio remain unchanged.

Environment corrections: pass the Y003 root pose into reusable TrackWorld lighting so contact/key shadows follow the actual moving car rather than the old Y002 route. Rotate the contact shadow with heading. Render extension tree trunks using opaque bark-compatible material rather than alpha-cutout foliage. Replace oversized foliage cards with four times as many half-size clusters while retaining existing seeded tree positions and silhouettes.

Track coverage and typography contract QA pass. Native moving proof and final render validation are required before release. Approved audio SHA256 remains cd411b0dcc9e733f5b142e59f8340f913816e28bf113a32639c4fd12f7ec04c3; locked Porsche SHA256 remains 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.

Additional world-space reproduction found a 0.0384000m tyre/asphalt gap because motion used root Y=0 while the circuit surface lives at root -0.028 plus local -0.0104. The world-space contact regression failed before the correction and passes at 1.04e-8m afterward. Motion now uses the shared asphalt height; suspension and camera remain car-relative. Default Y002 lighting placement is preserved when no explicit Y003 pose is passed.
