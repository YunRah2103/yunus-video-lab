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
Pending agent inspection of the generated artifact bundle.

## Integration note
- ModelLedVideo contains the live wheel/aero changes.
- FinalFinish still uses the flattened v3-review.mp4 base and was intentionally not replaced.
- Master integration must regenerate the live V3 base before any FinalFinish replacement is considered.
