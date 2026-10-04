# YUNEX 001 · Sol implementation handoff

Implement the model-led V2 described here. Astra retains creative direction, architecture and final approval. Preserve V1 and its completed render; add a separate `YUNEX-001-V2` composition. Do not rebuild or replace the approved green/white 992 GT3 RS.

## Existing state

Repo: `YunRah2103/yunus-video-lab`. Project: `yunex/`. Asset: `cars/porsche-911-gt3-rs-992/model.glb`. Read both READMEs, `LICENSES.md`, `Car.tsx` and `transcript-edited.json`. The delivered production pack supplies VO/media/cached views absent from GitHub. Reuse the 27.05-second edited VO without rewriting it; output 27.6 seconds, 1080 × 1920, 30 fps. The approved appearance does not change the recorded source licence.

## Directing contract

One charcoal studio, one centred hero car. Preserve ivory/copper/pale-green palette and Barlow Condensed. Car occupies roughly 65–80% of frame width; retain safe margins for wing and nose. Use small, timed labels and short statements in negative space. Replace the V1 poster-like scene cards and fixed-pose crossfades with real, controlled camera movement and progressive technical states. No archival detour or unrelated footage is needed for V2.

| Time | Required evolution |
|---|---|
| 0–3.5 s | Beautiful centred rear three-quarter hero. Slow deliberate orbit; hook `PORSCHE NEVER FIXED THIS.` First glimpse of engine by 2 s, then camera settles toward side-on. |
| 3.5–8.5 s | Glass fades, interior hides, an opaque body cutaway advances around the rear; faint full-body shell preserves silhouette. Reveal simplified flat-six at the existing engine marker. Project FRONT AXLE, REAR AXLE and ENGINE MASS labels from actual model coordinates. Show rear bias without physically moving the engine. |
| 8.5–11.5 s | Rise toward overhead. Dim rear contact patches as grip goes; rear and its engine mass swing together. A trail follows the actual projected mass marker. Keep the front axle steady as an illustrative pivot, not a claimed physics simulation. |
| 11.5–13.2 s | Recover into medium rear-side framing; `WHY KEEP IT?` Body remains recognisable. |
| 13.2–18.3 s | Reveal driven rear contact patches, downward load and subtle acceleration squat; wheels begin rolling. Distinguish static rear weight bias from acceleration transferring load rearward. `MORE REAR GRIP.` |
| 18.3–22.5 s | Restore body during the VO about decades of control. Low rear-quarter camera; sparse smooth streamlines traverse the body and wing. Downforce cues connect visibly to wing/body and road. `AERO + CHASSIS + CONTROL.` Aero is a modern GT3 RS example and acts at speed, not a cure for every handling condition. |
| 22.5–27.6 s | Finish exterior restoration and settle into a beautiful full-car hero. `UNMISTAKABLY 911.` Quiet YUNEX mark at the end. |

## Architecture fixed by Astra

Use one persistent Three.js scene and GLB load. Separate deterministic frame-driven camera, part-state, engine/load/rotation and aero layers. A shared frame-state function drives both the 3D render and projected Remotion labels. Use real camera orbit, not rotating a flat image. Retain the original GLB; material clones/clipping layers are rendering aids, not new vehicle assets. Sparse aero curves illustrate flow only; no CFD claims or invented force numbers.

Remotion assembles typography, VO and restrained SFX around the 3D layer. If software rendering is slow, bake the **continuous animation** once to a transparent frame sequence, then composite it. Do not revert to the old fixed-view cache to imitate an orbit. Memoize model/material/environment setup; avoid rebuilding it per frame.

## Execution and review gate

Use Context7 for current APIs and Superpowers for focused debugging/verification. Use the working local runtime; Floot/Replit only if they solve an observed limitation. First produce a look-development sheet and a short orbit-to-cutaway motion proof for Astra review. Then implement remaining beats, render `YUNEX_001_V2_REVIEW.mp4`, and provide source changes, full-timeline contact sheets, stream/decode checks and exact limitations. Astra reviews the actual motion and compositions before final approval. Commit work to a dedicated branch; do not overwrite V1 or declare it publishable yourself.
