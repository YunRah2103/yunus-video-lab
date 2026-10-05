# YUNEX 001 V2 delivery
Complete model-led film: 27.6s video, 1080x1920 native render, 30fps, 828 frames.
Final output: out/YUNEX_001_V2_FINAL.mp4.
Source branch: sol/yunex-full-film-v2. V1 and motion proof preserved.

## Reproduce
Use existing production-pack vo.wav and sound.wav; stage approved model.glb and engine.glb in public. From yunex:
- npm ci
- node render-v2.cjs full
- node render-v2.cjs final

The first pass renders continuous Three.js camera/object animation at native resolution. The second Remotion pass reuses that video at native resolution and adds projected rear tyre contact/load cues, airflow particles and wing downforce cues. It uses the original VO again; embedded first-pass audio is muted. No upscale.

## Verification
Final video stream: H.264, 1080x1920, 30fps, 828 frames, 27.600s.
AAC container duration: 27.605s.
Complete FFmpeg decode: exit 0. Sound peak -1.4 dBFS, average -15.2 dBFS.
Reviewed full-timeline contact sheets and key native frames; corrected engine-following transform, cutaway scope, pitch axis, label wrapping, load readability and aero cues. Audio was checked by timing/levels; auditory playback is not available in this review environment.
Exterior SHA256 unchanged: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.
Engine SHA256 unchanged: 62216a409c52b2411315e8c02324e25907b3f447b44138cd26d73378dea617fd.

## Limits
Engine, grip-loss rotation, contact/load cues and airflow are illustrative. Open-mesh engine clearance is not CAD-validated; no physics or CFD simulation claims. For software rendering, material clones use a lighter textured/specular shader and MSAA is disabled; original GLB materials and geometry are unchanged. Native edges can show aliasing.
Exterior attribution/licence remains as documented in LICENSES.md; no ownership or manufacturer affiliation is implied.
