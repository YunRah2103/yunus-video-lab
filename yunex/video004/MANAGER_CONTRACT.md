# YUNEX 004 — MANAGER INTERFACE AND ACCEPTANCE CONTRACT
Phase: Y004-REAR-STEERING-01. Source base `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Manager owns the central TypeScript contract in `yunex/src/video004/contracts.ts`. Individual specialists MUST import this; do not edit its definition.

## Coordinate and motion convention
- Three.js: +Y up, +Z forward, +X vehicle left. Units meters, radians, seconds.
- Y003 `motionStateAt` returns a world-space track pose; NEVER reapply TrackWorld root transform.
- Root yaw is yaw about +Y; actual GLB rear pivot names `Steer_RL`, `Steer_RR`; spin under `Spin_RL`, `Spin_RR`; calipers `Caliper_RL`, `Caliper_RR` may not inherit rear steer.
- Rotations of the wheel spin use measured `SOURCE_WHEEL_SPIN_AXES` (not local X), quaternion composition. GLB geometry/material bytes stay fixed.
- Source model approximate centre wheelbase 2.4539 m (derived from existing source centre Z coordinates). Treat the source coordinates as animation geometry, not certified Porsche wheelbase specification.
- One `Y004DriveFrame` sampled deterministically by frame, containing inherited `MotionState`, `segmentId`, `regime` and actual per-wheel signed steering values. A is the producer; B/C/D are consumers.
- At low speed rear steering sign opposes front. At higher speed same direction. Both rear wheels steer coherently, not artificial opposite toe. The max absolute displayed rear steer is 1° illustrative, never presented as Porsche spec.
- Track proof: two **separate shot-local runs** on covered road sections, separated by explicit match cut; do not use a fake constant acceleration from slow to high regime.
- Low-speed kinematic validation documents simplified bicycle relation `kappa ≈ (tan(delta_front) - tan(delta_rear))/L` with consistent wheel/vehicle axes; at high speed show qualitative aligned mode and declare it is not an OEM simulation.
- Camera guides must derive projected endpoints from actual wheel orientation and car frame per sample. The line may lengthen for visibility but must NOT inflate the portrayed physical angle; heading guide and neutral reference together follow car transform.
- At most two technical cue groups simultaneously; subtle thin line art; preserve wheel and rim; muted comprehension.
- Preserve world road contact, effective spin-by-distance, per-wheel geometry and moving/trackside parallax.
- Do not claim exact speed threshold, controller switch law, lap time, grip delta, turning circle or proprietary Porsche steering calibration.

## Public interface
`yunex/src/video004/contracts.ts` contains `Y004DriveFrame`, `Y004Regime`, `Y004SegmentId`, `Y004CameraPose`, `Y004WheelGuide`, `Y004_FPS` and provisional frame ceiling. A exports `y004MotionAtFrame(frame): Y004DriveFrame` from `motion/index.ts`; B exports `createY004RearSteerRig(model)` from `rig/index.ts`; C exports `resolveY004CameraPose(state,shotProgress)` and `resolveY004Guides(state,camera)` from camera/ and guides/. D exports `Yunex004EditLayer` and audio cue metadata (or documented equivalent). Manager integration binds these in Video004.tsx; E must NOT author a competing composition.

## Ownership
Manager: `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json`, integration/review manifests.
A: `yunex/src/video004/motion/**`, `yunex/video004/reports/A/**`.
B: `yunex/src/video004/rig/**`, `yunex/video004/reports/B/**`.
C: `yunex/src/video004/camera/**`, `yunex/src/video004/guides/**`, `yunex/video004/reports/C/**`.
D: `yunex/src/video004/edit/**`, `yunex/src/video004/audio/**`, `yunex/video004/audio/**`, `yunex/video004/reports/D/**`, and new `yunex/public/y004-*` audio assets if small/licensed.
E: `yunex/video004/render/**`, new `.github/workflows/yunex-004-*.yml`, `yunex/video004/reports/E/**`.
F: `yunex/src/video004/qa/**`, `yunex/video004/reports/F/**`.
No specialist may change Y003 source or existing GLB. Any shared fix must be requested to Manager with exact diagnosis/proof, not slipped into a cherry-pick.

## Work release / acceptance
A+B can start in parallel. A publishes contract-compatible state sampler and driving proof; B proves axle/spin/caliper mechanics with fixture state first, then real A pin. C builds matching camera/guide helpers against typed dummy frames first and binds accepted A/B before QA. D records/obtains new Y004 VO and measures exact length; creates cue plan but cannot lock frame count alone. E validates tools independently but cannot render full video until Manager publishes exact render source SHA and F short-proof gate. F prepares automated independent checks immediately, then executes actual visual QA after native moving clips exist.

Requirements: out-of-order deterministic sampling; actual-GLB rim-plane and no precession under rear steer; brake calipers follow steer but do not wheel-spin; world-ground/arch clearance; sampled path domain; actual moving perspective; understandable low/high sequence muted; full native decode/audio/faststart and single genuine export. QA PASS is evidence-backed only.

## Locked film intent
Premium ~20–24 s 1080x1920 30 fps 9:16. Hook rear wheel within 0–2.8 s; short rear macro, matched elevated opposing low regime, match cut aligned higher regime, fast gentle motion, active drive-off. Moving Porsche all the way; no static logo card, no suspension teardown, no airflow lesson. White/green approved Porsche livery; restrained YUNEX identity. At most 1–3 s without meaningful action/framing change.

## Suggested source references (verified in Master brief)
- Porsche eight things 911 GT3: https://www.porsche.com/stories/innovation/eight-things-you-need-to-know-about-the-911-gt3/
- 992 GT3 RS press kit: https://newsroom.porsche.com/dam/jcr:46a23375-e7ee-4507-a577-d9761b784d33/992%20911%20GT3%20RS%20Press%20Kit%201.pdf

Everything beyond the directional low/high principle, including exactly 1° cap, local path staging, and cinematic speeds, is an illustrative YUNEX production choice.


## Explicit final-delivery H/G delegation (8 October 2026)
The original contract said Manager alone changes central Y004 files. For this narrowly defined final stage, **Manager grants Agent H exclusive write ownership of**:
- `yunex/src/video004/Video004.tsx`, `timeline.ts`, `contracts.ts`, and `yunex/src/index.tsx`;
- ONLY the Y004 `STAGING` shot-boundary constants of `yunex/src/video004/motion/sampler.ts` (not four-wheel kinematics);
- `yunex/video004/reports/H/**` and its own `.github/workflows/yunex-004-h-*.yml`;
- one new EXACT Agent D-approved audio file `yunex/public/y004-final-mix.m4a` if the current release mechanism requires repo-local bytes. Confirm SHA; do not modify D's authoritative source/report.
Manager stays sole registry owner (`yunex/video004/TASKS.json`) and single authority to pin render source and pre-render PASS. Avoid concurrent Manager central edits until H completes; H pushes ONLY `sol/y004-h-integration`, NOT Manager directly.

**Agent G** owns full native render orchestration/delivery and only `yunex/video004/reports/G/**`, `yunex/video004/delivery/**` for small text manifests, and optionally newly named `.github/workflows/yunex-004-g-*.yml` if indispensable. G MUST reuse Agent E’s working render modules/workflow unchanged, using H/Manager-approved immutable source. No rendering of Y003, no substitute 4-frame fixture, no output claimed without one complete playable MP4.

Sequence: **H integration → F independent moving visual approval → Manager immutable render source / release gate → G full native render+mux/validation → F finished MP4 QA → Master creative decision**.

Audio: approved D branch `9567f6b2efa901d3667d084eedbbca9c98943c36`, source MP3 SHA256 `db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b`, final AAC 24s SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`; available via Library `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`, per D report. No WAV or M4A file should be assumed to live in GitHub until actual bytes+hash confirmed.

Recent corrected native smoke run `37755997906` SUCCESS at older source `51bef69dcde7323dd56f6120b1bc6551e8d5efd3`, showing LOW, HIGH, REAR MACRO 24-frame clips; those do NOT prove correct retimed narration, nor replace complete running visual QA. Earlier manager high shot starts 285f (9.5s), but actual s3 voice starts ~11.608s. H changes high start to about 333f (11.1s) and reproofs. 720 @30 frames is already Manager-locked from actual recorded 22.704 s Cedar.

## Parallel Agent I — narrowly scoped release preparation (8 October 2026)
Agent I may run alongside H and G, but is NOT a second integrator, renderer or QA approver. The Manager grants I sole ownership of `yunex/video004/release-prep/**`, `yunex/video004/reports/I/**`, and namespaced `.github/workflows/yunex-004-i-*.yml` for preflight or a documented gated launch route; I may add exactly ONE approved binary file at `yunex/video004/audio/y004-approved-cedar-24s.m4a` although D historically owned the audio directory. I must not alter D's other files. SHA256 expected `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`. Source is Agent D's actual approved Library file; never approximate/regenerate it, copy Manager's narration-only stem or claim bytes fetched when inaccessible.
Agent I does not edit existing `.github/workflows/yunex-004-native-release.yml`, E's render pipeline, any `yunex/src/**` code, G/H reports, or Manager `TASKS.json`.
I must independently verify an actually executable GitHub Actions orchestration path. If `workflow_dispatch` is impossible because the workflow is not on `main`, prepare and test a **gate-preserving** alternative based on an authorized branch workflow/push trigger or other supported run. Do not push to default branch or trigger full native render without Manager authorization. Document exact testing scope and real blockers.
H retains its independent visual integration authority and avoids `yunex/video004/audio/y004-approved-cedar-24s.m4a`. If H also sources the mix at `yunex/public/y004-final-mix.m4a`, Manager selects ONE canonical approved audio path for release after hash verification, rather than shipping unnecessary duplicate master assets.
Merge order: Manager reviews and combines H+I accepted work, produces a single source SHA with the exact audio bytes and final composition; **F runs native proof QA on that exact merged candidate SHA**, not a prior H-only SHA. Manager alone locks source and approves G launch. G does the only full render.
