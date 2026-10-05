# YUNEX 001 — V3 delivery
A bounded composition re-edit of the approved 27.6-second film. Original VO/story and approved exterior retained; refined engine integrated from d6f22e0e6bea5b673d286abdeb551c0142429611.

## Changes
- High rear three-quarter opening occupies the portrait frame.
- Installed engine/rear-axle close-up contrasts with a brief full side layout view.
- Rotation view keeps the car upright in portrait framing and its rear mass tied to the car.
- Rear-wheel/load close-up, high aero view and a distinct front three-quarter finale.
- Smaller titles, readable projected labels, footprint-sized shadow and antialiasing.
- Tyre-load/airflow finishing overlays use the same camera projection as the model scene.

## Reproduce
From yunex with installed dependencies:
```bash
node render-v3.cjs review
node render-v3.cjs final
```
The final mode copies the newly rendered review to public/v3-review.mp4 before bundling the finishing composition.
Compositions: YUNEX-001-V3 and YUNEX-001-V3-FINAL.
Outputs: out/YUNEX_001_V3_REVIEW.mp4 and out/YUNEX_001_V3_FINAL.mp4.
Previous V2 delivered MP4s remain unchanged; earlier source is retained in Git history. Large rendered intermediates are not source files to commit.

## Verification
Final file: 31,448,890 bytes; native 1080 × 1920; 828 video frames; 30 fps; 27.600-second video / 27.605-second container; H.264 and stereo AAC 48 kHz.
Full FFmpeg decode exited 0. Audio mean -15.2 dBFS; maximum -1.4 dBFS.
Master inspected the complete review timeline at 2 fps and the final contact sheet, alongside native hero/engine/rotation proofs. This is visual frame-sequence review and technical audio measurement, not a claim of auditory listening.
Approved exterior SHA-256 remains 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.
Engine SHA-256 aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d; 58,112 triangles; required groups/normals verified.

## Practical limits
Runtime uses MeshPhong conversion for software-render performance. Engine geometry and airflow are explanatory approximations; installation is an editorial marker placement, not a manufacturer clearance/CAD validation.

