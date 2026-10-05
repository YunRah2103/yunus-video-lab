# YUNEX wheel + aero polish QA

Source render commit: 28bd3712725ba0fcf4d6206fcb30267040a0a748

## Locked assets
- Porsche exterior SHA-256: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb
- Engine SHA-256: aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d
- Both hashes were verified before and after rendering.

## Proof media
- wheel_motion_proof.mp4 - 1080 x 1920, 30 fps, 90 frames, 3186558 bytes
- aero_motion_proof.mp4 - 1080 x 1920, 30 fps, 120 frames, 4339843 bytes
- wheel_frame_start.png / wheel_frame_mid.png
- aero_frame_start.png / aero_frame_mid.png / aero_frame_end.png
- wheel_ffprobe.json / aero_ffprobe.json / proof_sha256.txt

## Automated validation
- Both MP4s fully decoded with FFmpeg without errors.
- Both proofs asserted native 1080 x 1920 at 30 fps.
- Wheel proof asserted at 90 frames; aero proof asserted at 120 frames.
- No Porsche or engine asset bytes changed.

## Visual inspection
- Wheel proof inspected as a temporal sequence, including adjacent-frame rear-wheel crops.
- The visible wheels rotate in the forward-roll direction for the +Z-forward car, with a smooth ramp from the 13.2 s grip beat and no phase reset or hub wobble.
- All four named Spin_* pivots receive the same deterministic local-X wheel angle. Calipers remain outside those spin pivots and stay visually fixed to the upright while rims/tyres move.
- Aero proof inspected at start, mid and end plus a five-frame contact sequence.
- Flow direction reads front -> rear immediately. The copper centre path hugs the bonnet/windscreen/roof line, paired green roof/shoulder paths add depth, side paths stay close to the flanks, and two low underbody paths rise gently into the rear wake.
- The rear-wing region is visibly part of the flow story; the centre/shoulder paths continue through/over the wing area and the restrained downforce cue remains anchored at the rear aero package.
- Streamlines remain thin and low-opacity, tracer beads show direction without becoming a particle storm, and the Porsche remains the dominant visual.
- No path discontinuity, frame-to-frame popping, body penetration that distracts at the reviewed angles, or wheel flicker/wobble was observed.
- One downforce arrow is partly occluded from the high rear-three-quarter camera at peak aero; this reads as normal 3D occlusion rather than a detached overlay and was left unchanged to keep the treatment restrained.
- No bounded corrective source pass was necessary after inspection; the first rendered pass met the handoff quality gate.

## Integration note
- ModelLedVideo contains the live wheel/aero changes.
- FinalFinish still uses the flattened v3-review.mp4 base and was intentionally not replaced.
- Master integration must regenerate the live V3 base before any FinalFinish replacement is considered.
