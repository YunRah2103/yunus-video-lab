# YUNEX 001 V5 Delivery

Approved master: `YUNEX_001_V5_FINAL.mp4`

- 1080 × 1920, 30 fps, 828 frames (27.605 s)
- H.264 video with 48 kHz stereo AAC audio
- Final SHA-256: `8308aa20277a6ec3584bdb47f4855c14b930e280a21c039aed3d41a203507906`
- Audio QA: mean -15.2 dB, peak -1.4 dB
- Full FFmpeg decode: pass

## V5 correction

The approved racetrack now remains visible throughout every technical beat: engine cutaway, axle proof, rear-mass rotation, traction/load and native 3D airflow. The V4 timing, camera path, narration, model animation, labels and clean track bookends remain unchanged.

`ModelLedVideo` exposes an opt-in `trackMode`; its default remains false so V3/V4 are reproducible. The technical world reuses the approved procedural asphalt, kerb, guardrail, verge and foliage. It is rotated and offset so the barrier stays on the far side of the unchanged technical cameras. Technical rendering intentionally uses economical motion-lite foliage, Phong vehicle lighting, no PMREM and no shadow map. A deterministic lower asphalt underlay fills rays originating below the ground plane in the low orthographic views; it is a presentation solution, not physical CAD geometry.

Opening and final hero frames retain the approved native PBR plates. `render-v5.cjs` generates missing clean plates, copies the newest review for final assembly, then rebundles so Remotion's public snapshot cannot be stale.

## Reproduction

```sh
node render-v5.cjs review
node render-v5.cjs final
```

Locked asset SHA-256 hashes:

- `public/model.glb`: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- `public/engine.glb`: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

V3 and V4 compositions and outputs remain preserved.
