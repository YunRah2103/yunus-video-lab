# GPT-6 HANDOFF — finish YUNEX 001 V2

Continue repo `YunRah2103/yunus-video-lab`.

## Canonical implementation state
- Branch: `sol/yunex-orbit-cutaway-proof`
- Current branch head at handoff: `dd32502682e5607621d211bdebbb8ebab6e27651`
- Main contains the master finish instruction commit `eba29eb10d58519800484aaa6c5fa4614150bcfd`.
- Read first:
  - `yunex/SOL_HANDOFF_MODEL_LED_V2.md`
  - `yunex/SOL_HANDOFF_PROOF_COMPOSITION.md`
  - `yunex/src/OrbitCutawayProof.tsx`
- Do not rebuild the Porsche or engine. Do not alter the approved exterior. Preserve V1.

## Working proof
The 7.5s orbit/cutaway proof is functional. Reuse its camera/loading/cutaway/projected-label infrastructure rather than redesigning the renderer.

Composition fixes requested by master:
- opening needs slightly higher rear-three-quarter depth
- hook closer to subject
- phone-readable axle/engine labels
- add `ENGINE BEHIND THE AXLE`
- use lower negative space for a restrained larger engine-detail view from the SAME `engine.glb`
- keep whole-car silhouette readable
- do not crop the side-on car by blindly zooming

## Real production assets
The original Library artifact is named `YUNEX_Production_Pack.zip` (created 2026-10-04 20:20 UTC, ~51.7 MB). It contains the media deliberately omitted from GitHub:
- `yunex/public/vo.wav`
- `yunex/public/sound.wav`
- `yunex/public/opening.mp4`
- `yunex/public/detail.mp4`
- `yunex/public/drive.mp4`
- `yunex/public/hero.mp4`
- `yunex/public/classic.jpg`
- `yunex/transcript-edited.json`
- original V1 source and cached plates

Use the existing `vo.wav` unchanged. It is the ~27.05s edit for this film, NOT the separate ~60s Cedar narration in `projects/vehicle-explainers`.

The finished separate engine is `cars/porsche-911-gt3-rs-992/engine/engine.glb` (same 622208-byte asset already reviewed).

## Exact VO phrase timing from transcript-edited.json
- 0.000–3.280: “The Porsche 911 breaks one of the oldest rules in car design.”
- 3.653–5.415: “Its engine sits behind the rear axle.”
- 5.715–8.464: “That puts a huge amount of weight at the very back of the car,”
- 8.688–11.072: “which can make the rear want to rotate when grip disappears.”
- 11.634–13.059: “So why hasn't Porsche moved it?”
- 13.253–16.035: “Because that same weight pushes the driven tires into the road,”
- 16.247–17.969: “giving the 911 incredible traction.”
- 18.358–19.662: “And instead of removing the problem,”
- 19.974–22.350: “Porsche spent decades learning how to control it.”
- 22.350–26.619: “What started as a flaw became the thing that makes a 911 feel like a 911.”

## Required 27.6s V2 structure
- 0–3.5: premium centred rear-three-quarter hero orbit; `PORSCHE NEVER FIXED THIS.`; first engine glimpse by ~2s
- 3.5–8.5: continuous cutaway toward side-on; front axle, rear axle, engine mass; rear weight bias
- 8.5–11.5: rear mass rotates with the car as grip disappears; understandable physical context, not a claimed simulation
- 11.5–13.2: `WHY KEEP IT?`
- 13.2–18.3: driven rear contact patches + rear load/traction + acceleration load transfer; `MORE REAR GRIP.`
- 18.3–22.5: restore body; tasteful airflow/downforce/chassis-control visual; `AERO + CHASSIS + CONTROL.`
- 22.5–27.6: whole-car hero; flaw-to-identity payoff; `UNMISTAKABLY 911.`; subtle YUNEX

Meaningful visual evolution every 1–3 seconds. Maintain close/medium/wide contrast.

## Rendering/QA
Final must be native 1080×1920, 30 fps, 828 frames. Do NOT use the proof's half-resolution + upscale path as the final.
Render key stills first, then full review MP4. Watch the entire timeline with audio, correct obvious framing/timing weaknesses, then render `YUNEX_001_V2_FINAL.mp4`.
Verify:
- duration/dimensions/fps/full decode
- VO/SFX balance
- labels/cutaway/engine visibility
- no wing/nose clipping
- exterior GLB unchanged (hash against canonical asset)
- timeline contact sheet

Engine placement remains illustrative; open-mesh clearance is not CAD-validated. No CFD/physics/CAD accuracy claims.

Deliver finished MP4 + exact commit + contact sheet + concise limitations. Do not merge or claim master approval.
