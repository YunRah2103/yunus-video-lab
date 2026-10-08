# YUNEX 004 — Agent A steering/motion implementation

**Phase:** Y004-REAR-STEERING-01  
**Exclusive ownership:** `yunex/src/video004/motion/**` and `yunex/video004/reports/A/**`  
**Baseline:** `bf2f0996f4176791d5ac78d818090e8b429397ad`  
**Canonical Porsche SHA256:** `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

## Actual implementation

- `motion/index.ts` exports the exact Manager contract API `y004MotionAtFrame(frame): Y004DriveFrame`.
- `sampler.ts` drives a world-space track centreline from the P03 layout, always monotonically travelling and without clamping outside the authored film. Each shot is a separate actual covered road run; boundaries are explicit editorial cuts.
- Speed and acceleration come from local route progress, road slope and clip duration. Curvature comes from Y003 P03's approved curvature estimator; front/rear steer from the same curvature sample and selected qualitative low/high visual regime.
- Rear RL/RR use the same capped signed angle, not mirrored toe. Opposite lower-speed / aligned higher-speed axles. Absolute rear cap **1°**, strictly an illustrative YUNEX production limit, not an official Porsche specification.
- Approximate kinematics: `kappa=(tan(front)-tan(rear))/wheelbase` under planar no-slip bicycle assumption, front axle has small left/right geometry correction. This is not a Porsche rear-axle controller law or validated handling simulation.
- Individual wheel source hubs and radii are from the canonical P03 GLB, wheel distances integrate road curvature; spin stays path-distance / source tyre radius. Source wheel spin axes/actual quaternion rig remain B's mechanical responsibility.
- Asphalt road Y uses `TRACK_LAYOUT_CONFIG.rootPosition[1] + TRACK_ASPHALT_LOCAL_Y`. The root output is already world-space and **must not** receive the track root transform a second time.
- Integer frame count is provisional. `buildY004SegmentPlan(totalFrames)` and `y004MotionAtFrame(frame,totalFrames)` accept revised film length without changing the segment speed regime.

## Real tests and evidence

`cd yunex && npx tsx src/video004/motion/motion.test.ts`

Audits every provisional film frame: opposite/aligned steer, illustrative rear cap, no rear toe, deterministic out-of-order state, contact, track road clearance, spin/distance, path monotonicity, velocity, acceleration and simplified low-speed curvature relation.

Native moving proof source **is implemented** at `motion/AProofScene.tsx`, `motion/proof-entry.tsx`, `motion/render-proof.cjs`:

`cd yunex && node src/video004/motion/render-proof.cjs`

The runner requires installed dependencies, source GLB and native render environment. It executes the tests, checks the **actual GLB hash**, renders two separate 120-frame 4-second **1080×1920 / 30 fps** world-trackside moving proof clips with fixed-world stations, validates streams by ffprobe and full-decodes by ffmpeg, then stores `out/y004-a-motion/evidence.json` with exact source SHA and media SHA256. These proof clips are not claimed rendered or passed unless the actual runner exits successfully and evidence is linked.

**Proof sources:** low frames 150–269; high frames 285–404 at 30 fps. Five successive fixed-world camera stations, one per 24 frames, create native travel/parallax evidence without a fake chassis turntable. Text overlay is debug-only, not final YUNEX graphics.

## Dependencies / limitations

Agent B must attach moving rear calipers to the steering uprights and validate actual-GLB rim plane under rear steering. This isolated A scene temporarily uses the P03 rig only to prove motion; **not a caliper acceptance proof**. Agent C owns any final anchored wheel-direction guides. Manager owns final composition, narrative duration, integration, acceptance registry and render pin. No historical Y003 code or model files were edited.

No exact switching speed, GT3 RS steering limit or torque control law is represented. Speeds are qualitative cinematic animation choices. A's tests do not prove visual believability without watching actual native clips.
