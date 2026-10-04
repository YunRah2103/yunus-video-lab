# YUNEX — Orbit/Cutaway Proof Rescue Handoff

## Status

Take over branch:

`sol/yunex-orbit-cutaway-proof`

Current head at handoff creation:
`4ef8545d004c08908946d48fdf71cbf7b5a24b9d`

Original reviewed engine commit:
`989947aaa7c71858ced751a05f3bc934ec62cb2e`

Read first:
- `yunex/SOL_HANDOFF_ORBIT_CUTAWAY_PROOF.md`
- `yunex/SOL_HANDOFF_MODEL_LED_V2.md`
- `cars/porsche-911-gt3-rs-992/README.md`
- `cars/porsche-911-gt3-rs-992/engine/README.md`
- `cars/porsche-911-gt3-rs-992/engine/REVIEW_NOTE.md`

Do NOT merge to main. Do NOT modify the approved exterior model. Do NOT remodel the finished engine.

## Master goal

Return only a clean 6–8 second vertical proof at 1080x1920, 30 fps:

1. 0–2 s:
   - centred green/white Porsche
   - charcoal studio
   - controlled rear-three-quarter orbit
   - hook: `PORSCHE NEVER FIXED THIS.`
   - first engine glimpse by ~2 s

2. 2–5 s:
   - continuous move toward side-on
   - rear body cutaway develops
   - faint complete shell preserves silhouette
   - reveal the existing `engine.glb` at `Marker_Engine_Mass`
   - no fixed-image crossfade

3. 5–8 s:
   - settle into a medium technical view
   - show `FRONT AXLE`, `REAR AXLE`, `ENGINE MASS`
   - labels must project from actual model coordinates

## Critical visual failure found

Do NOT approve or reuse the current rendered proof as-is.

Successful review-stills artifact from workflow:
`YUNEX orbit-cutaway review stills`
run id:
`37242433708`

Observed in all three review stills:

- the Porsche is not visibly rendered
- the engine is not visibly rendered
- a large flat grey polygon/plane dominates the upper-left/centre of the frame
- the hook text renders correctly
- technical labels and marker dots render correctly
- therefore coordinate projection is alive, but the actual 3D presentation layer/camera/ground setup is broken

Specific still behaviour:
- hero frame: hook is readable, but no car; huge grey plane covers much of upper-left
- cutaway frame: still no car/engine; same grey plane
- technical frame: marker dots + labels appear, but no car/engine; grey plane remains

This is the blocker to solve first.

## Current implementation files

Main proof component:
`yunex/src/OrbitCutawayProof.tsx`

Registered composition:
`YUNEX-ORBIT-CUTAWAY-PROOF`

Current main render workflow:
`.github/workflows/yunex-orbit-proof.yml`

Additional review/debug workflows were added on this branch during prior attempts. Inspect them before deleting anything:
- orbit proof review/stills/runtime bundle workflows

The original full render was not a code crash. It was progressing but the first run hit its 30-minute timeout at frame 174/225. The timeout was increased to 50 minutes and concurrency raised to 3 at commit `4ef8545...`. However, because the review stills are visually broken, do not wait for or approve a long render until the 3D visibility issue is fixed.

## Fit findings already measured

`yunex/fit_check.py` ran successfully.

Engine marker:
`[0.0, 0.47, -1.78]`

Installed engine bounds:
- min: `[-0.5500000119, 0.2300000054, -2.2387456882]`
- max: `[0.5500000119, 0.8799999964, -1.3887456942]`

Approved body bounds:
- min: `[-1.0141055584, 0.1068408638, -2.2860000134]`
- max: `[1.0141055584, 1.3185553551, 2.2860000134]`

Important:
- body mesh is NOT watertight
- 9,355 rear-body vertices fall inside the engine X/Z footprint
- body Y range inside that footprint: approx `0.1441 → 1.0764 m`
- engine Y range: approx `0.2300 → 0.8800 m`
- sampled surface minimum distance: approx `0.0000187 m`
- 137 sampled engine vertices were under 5 mm from body
- 347 were under 15 mm

Interpretation:
This is a clearance WARNING, not proof of intersection or CAD-valid fit. The body is an open render mesh, so signed-distance containment is unreliable.

No installation adjustment has been applied:
`[0, 0, 0]`

Do not blindly shrink or move the engine.

## Shortest debugging path

Do this in order. Do not continue the full render until the first three stills look correct.

1. Render a simple STILL from the proof component containing ONLY:
   - approved `model.glb`
   - known-good studio/camera
   - no ground plane
   - no clipping
   - no ghost shell
   - no engine
   - no labels

Use a known-good camera basis from `yunex/src/Car.tsx` first. Confirm the real green/white car is visible and framed safely.

2. If the car is visible, add the charcoal studio floor separately.
   - identify whether the current giant grey polygon is the floor
   - if yes, correct/remove it before proceeding
   - the studio floor must never occlude the vehicle

3. Add the reviewed `engine.glb` at exactly `Marker_Engine_Mass`.
   - render one opaque installed still
   - confirm scale/orientation visually
   - do not alter exterior
   - do not claim mechanical clearance

4. Add orbit motion only.
   - real frame-driven Three.js camera movement
   - no flat-image rotation
   - verify wing/nose safe margins at start, middle, end

5. Add the cutaway.
   - reveal rear section progressively
   - preserve a faint complete silhouette shell
   - the cutaway must not remove the whole car
   - avoid a broad clipping plane that accidentally erases/occludes the subject

6. Add projected labels last.
   - FRONT AXLE
   - REAR AXLE
   - ENGINE MASS
   - use actual coordinates
   - check collisions in final vertical framing

## Suspected causes worth checking

Do not assume one cause; isolate them.

- ground `planeGeometry` orientation/size/material may be the large grey polygon
- orthographic camera/frustum + zoom may differ from the known-good `Car.tsx` setup
- local clipping plane semantics may be clipping the wrong side or too much of the car
- cloned material/clipping state may be affecting more groups than intended
- verify the loaded car/engine objects are actually in camera space before styling
- verify floor depth ordering and whether it occludes the car in software ANGLE rendering

Use Context7 for exact current Three.js/Remotion API semantics if needed.

## Quality gate

Before the MP4:
- render 3 stills at approximately 0.8 s, 3.4 s, 6.7 s
- inspect the actual pixels
- reject if:
  - car missing
  - engine missing after reveal
  - floor/plane occludes subject
  - wing or nose clipped
  - labels collide or float nowhere near markers
  - cutaway destroys silhouette
  - motion framing feels cramped

Only then render the full proof.

## Required final return

Return:
- playable `YUNEX_ORBIT_CUTAWAY_PROOF.mp4`
- 3 key PNG frames
- exact branch + commit
- concise fit findings
- concise known limitations

Known limitations to preserve:
- engine is simplified explanatory geometry, not Porsche CAD
- `Marker_Engine_Mass` is approximate
- shell clearance is not CAD-validated
- no full-video implementation yet
- this is only the motion/lookdev gate for Astra/master review

Stop after the proof. Do not expand into the full 27.6 s film.
