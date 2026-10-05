# YUNEX 001 V4 Delivery

Approved master: `YUNEX_001_V4_FINAL.mp4`

- 1080 × 1920, 30 fps, 828 frames (27.605 s)
- H.264 video with 48 kHz stereo AAC audio
- Final SHA-256: `6dcbf968322736a3385050821a3f3aae3a1203d76a226cb1823008f48bb267c3`
- Audio QA: mean -15.2 dB, peak -1.4 dB
- Full FFmpeg decode: pass

## Reproduction

The exterior and engine GLBs remain unchanged. Their SHA-256 hashes are:

- `public/model.glb`: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- `public/engine.glb`: `aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Render the two native clean PBR track plates from the registered Remotion compositions, then render review and final:

```sh
npx remotion still src/index.tsx YUNEX-TRACK-FILM-OPENING public/v4-track-opening-clean.png --frame=24
npx remotion still src/index.tsx YUNEX-TRACK-FILM-FINAL public/v4-track-final-clean.png --frame=720
node render-v4.cjs review
cp out/YUNEX_001_V4_REVIEW.mp4 public/v4-review.mp4
node render-v4.cjs final
```

The track bookends use native 1080 × 1920 PBR plates with restrained, deterministic 2D drift (maximum 1.8%). This is a deliberate SwiftShader render-time fallback. The technical middle remains live animated Three.js, including wheel rotation, cutaway, engine/axle projection, rotation demonstration, traction load and native 3D airflow.

V3 compositions and files are retained unchanged.
