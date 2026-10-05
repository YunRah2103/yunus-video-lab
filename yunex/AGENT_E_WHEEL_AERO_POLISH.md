# AGENT E — YUNEX wheel motion + aerodynamic airflow polish

## Mission

Add one tightly scoped motion-detail pass to the existing YUNEX Porsche film system:

1. make the approved Porsche wheels genuinely rotate using the wheel pivots already built into the GLB;
2. improve the short 18.3–22.5 s aerodynamic airflow/downforce visualization so it feels premium, dimensional and clearly attached to the car rather than like generic lines floating over it.

This is a proof/polish task, not permission to rebuild the film.

Do not modify or re-export the approved Porsche GLB.

Do not interfere with Agent D's track visual-polish branch.

## Repository / branch

Repository:
`YunRah2103/yunus-video-lab`

Canonical source branch:
`sol/yunex-full-film-v2`

Create/use:
`sol/yunex-wheel-aero-polish`

Do not push directly to:
- `sol/yunex-full-film-v2`
- `sol/yunex-track-visual-polish`
- `sol/yunex-track-motion-final`

## Read first

- `yunex/CURRENT_TASK.md`
- `yunex/src/ModelLedVideo.tsx`
- `yunex/src/FinalFinish.tsx`
- `yunex/src/Car.tsx`
- `cars/porsche-911-gt3-rs-992/README.md`
- `cars/porsche-911-gt3-rs-992/asset-manifest.json`
- `yunex/SOL_HANDOFF_MODEL_LED_V2.md`

Inspect the current 13.2–22.5 s motion before changing it.

## Locked assets — absolute rule

Approved Porsche exterior SHA-256:

`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Approved engine SHA-256:

`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Do not:
- rebuild/re-export the Porsche
- modify Porsche geometry/materials/livery
- change car scale or proportions
- modify the engine asset
- modify VO/audio
- overwrite `v3-review.mp4`
- render/replace the full 27.6-second final film
- touch track foliage work

Animation may use the existing named pivots already inside the approved model.

## Existing wheel rig

The approved GLB intentionally exposes:

- `Spin_FL`
- `Spin_FR`
- `Spin_RL`
- `Spin_RR`

These rotate on local X for wheel spin.

It also exposes:
- `Steer_FL`
- `Steer_FR`

Brake calipers are independent and should remain visually stationary relative to the upright rather than spinning with the rims.

Do not alter this hierarchy.

## Part A — real wheel rotation

The current creative specification says the wheels begin rolling during the 13.2–18.3 s traction/acceleration beat, but the live `ModelLedVideo` does not currently animate the `Spin_*` pivots.

Implement deterministic frame-driven wheel rotation.

### Required behavior

- wheel spin begins smoothly during the grip/acceleration section around frame 396 / 13.2 s
- all four tyres/rims visibly rotate
- rotation continues naturally into the aero section if the shot still visually implies speed
- no wheel rotation during static/cutaway beats where it would look physically wrong
- no sudden phase reset between beats
- no visible wheel wobble
- calipers must not spin
- do not add steering unless the existing shot clearly requires it

Use the named `Spin_*` nodes rather than searching individual wheel meshes.

Determine the correct rotation sign from an actual rendered proof. Mirrored wheel geometry can make assumptions unreliable; visually verify forward roll.

Keep motion restrained enough that the wheel detail does not alias into distracting flicker.

## Part B — aerodynamic airflow polish

Current implementation:

`ModelLedVideo.tsx` has `AeroLines` with only three static Catmull-Rom tube paths plus two downforce arrows.

`FinalFinish.tsx` adds moving projected dots over similar curves.

The result communicates the idea, but it still feels schematic and generic.

Improve the live 3D aero visualization first. Do not fake a CFD simulation.

### Creative goal

For roughly 18.3–22.5 s, make airflow visibly travel:

**front of car → over/around body → rear wing / diffuser wake**

The viewer should understand the airflow path in less than a second.

The effect should feel like a premium engineering visualization, not neon game particles.

### Recommended airflow structure

Use approximately 5–8 carefully placed streamlines, not dozens.

Suggested families:

1. **Roof / centre flow**
   - begins ahead of the nose
   - rises over bonnet/windscreen
   - hugs the roof arc
   - descends toward rear deck
   - interacts visually with the rear-wing region

2. **Left/right shoulder flow**
   - two or four lines pass around the front corners
   - stay close to the body sides
   - converge visually toward the rear quarter

3. **Underbody / diffuser cue**
   - one or two very subtle lower lines close to road level
   - accelerate visually beneath the car and rise gently at the rear
   - illustrative only; do not claim exact GT3 RS CFD

4. **Rear-wing relationship**
   - at least one visible airflow path should clearly pass through/around the wing region
   - preserve two restrained downward force arrows connected spatially to the rear aero package / road
   - arrows should read as an explanatory downforce cue, not literal measured forces

### Motion

Do not merely fade complete tubes in and out.

Make flow visibly travel nose-to-tail.

Use one of these deterministic approaches:
- moving tracer beads/pulses along the 3D curves;
- short moving luminous segments along each curve;
- a restrained continuous faint streamline plus 1–3 brighter pulses travelling along it.

Preferred:
- faint full line at low opacity
- brighter moving pulse/tracer shows flow direction
- stagger paths slightly so the effect has depth rather than firing simultaneously

The tracer should move from +Z front to -Z rear in the car's local frame.

Use frame-based motion only.

### Shape quality

Improve the actual curves so they feel attached to the car's silhouette.

Avoid:
- huge arcs floating metres above the roof
- perfectly parallel generic lines
- repeated identical curves
- lines cutting through bodywork
- streamlines that ignore the wing
- random turbulence everywhere

Use existing car dimensions/markers and the actual rendered silhouette as reference.

### Styling

Keep the current YUNEX palette:
- restrained green
- optional copper accent for one central/technical line

Suggested visual treatment:
- thinner base tubes/lines than the current effect
- soft transparency
- small moving pulses
- no heavy bloom
- no thick neon ribbons
- no particle storm

The Porsche remains the hero.

### Accuracy language

This remains an **illustrative airflow visualization**, not CFD.

Retain or improve the existing disclaimer:
`MODERN GT3 RS · AIRFLOW SHOWN ILLUSTRATIVELY AT SPEED`

Do not make quantitative downforce claims.

## Important FinalFinish architecture note

`FinalFinish.tsx` currently plays the flattened `v3-review.mp4` as its base and adds overlays.

Therefore:

- do NOT overwrite `v3-review.mp4`
- do NOT pretend editing `ModelLedVideo.tsx` automatically updates the current final flattened film
- build and review the improved live motion as a proof first
- document exactly what must be regenerated later if the master approves the change

If you also improve the `FinalFinish.tsx` overlay tracers to match the new live 3D paths, keep that change isolated and do not render a replacement final film.

## Proof outputs

Create:

`yunex/motion-polish/`

Required:
- `wheel_motion_proof.mp4`
- `aero_motion_proof.mp4`
- `wheel_frame_start.png`
- `wheel_frame_mid.png`
- `aero_frame_start.png`
- `aero_frame_mid.png`
- `aero_frame_end.png`
- `MOTION_POLISH_QA.md`

Suggested frame windows:
- wheel proof: a representative ~2–3 s section inside frames 396–549
- aero proof: a representative ~3–4 s section inside frames 549–675

Native 1080 × 1920, 30 fps.

Do not render the entire 828-frame film merely to inspect these changes.

## Visual inspection

Actually inspect the generated MP4s and stills.

Wheel checks:
- correct forward rotation direction
- all four wheels rotate
- rims/tyres rotate around true hubs
- no caliper spin
- no wobble
- no abrupt start/reset
- wheel motion suits the apparent vehicle speed

Aero checks:
- airflow direction instantly reads front → rear
- streamlines do not pass through the body
- roof/side/underbody paths have distinct jobs
- rear wing is visibly part of the airflow story
- downforce arrows remain attached to a believable rear-aero location
- flow does not obscure the Porsche
- lines remain readable against bright/green bodywork
- effect feels premium and restrained
- no frame-to-frame popping
- no obvious path discontinuity

Perform one bounded corrective pass after visual inspection if needed.

## Validation

Before and after:
- verify Porsche exterior SHA-256 exactly
- verify engine SHA-256 exactly

Expected exterior:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

Expected engine:
`aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d`

Run full FFmpeg decode on both proof MP4s.

Record dimensions, fps, frame counts and hashes.

## Do not do

- do not modify the GLB
- do not change livery/materials
- do not move/rescale Porsche
- do not redesign the track
- do not edit Agent D's branch
- do not create a full CFD solver
- do not fill the screen with particles
- do not change VO or soundtrack
- do not replace the 27.6 s film
- do not overwrite `v3-review.mp4`
- do not create another handoff

## Definition of done

Agent E is complete only when:

- real `Spin_*` wheel rotation is implemented and visually verified
- improved 3D aero flow is implemented
- wheel proof exists and is inspected
- aero proof exists and is inspected
- required stills exist
- both proof videos fully decode
- Porsche/engine hashes remain exact
- `MOTION_POLISH_QA.md` explains changes and any limitation
- source + proofs are committed and pushed to `sol/yunex-wheel-aero-polish`

Return:
- branch
- final commit SHA
- source files changed
- proof paths
- wheel rotation behavior
- aero flow design summary
- locked asset hashes
- technical validation
- visual inspection result
- exact regeneration/integration note for the master agent

Then stop.
