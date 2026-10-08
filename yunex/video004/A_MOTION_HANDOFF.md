# Agent A — Y004 FOUR-WHEEL MOTION AND KINEMATICS
ROLE: GPT-6 motion specialist. Phase Y004-REAR-STEERING-01. BRANCH: `sol/y004-a-motion`.
## Mandatory source and workflow
Repository `YunRah2103/yunus-video-lab`; phase `Y004-REAR-STEERING-01`. Read `yunex/video004/START_HERE.md`, `yunex/video004/MANAGER_CONTRACT.md`, `yunex/video004/TASKS.json`, this role handoff and original `yunex/video004/MANAGER_IMPLEMENTATION_HANDOFF.md` in that order. Initial accepted P03 source SHA: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Master handoff publication SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`. Your personal branch was created from a pinned Manager-dispatch commit; verify its exact remote SHA before editing. Never start from `main` or use an old Y003 role handoff.
You are a SEPARATE user-started ChatGPT chat. Do actual implementation; do not spawn, delegate, or only produce another handoff. Fetch current remote ref before every push, never force-push, and keep changes to owned paths. You cannot assume other chats' progress. If dependencies are missing, make independently testable progress and report exact blocker; do not invent completion.
Source is the corrected Y003-P03 Porsche; leave older compositions and car GLB unchanged. Porsche SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`. Reuse P03 actual GLB spin axes, quaternion wheel transforms, world asphalt height, pose-following shadows and track identity. Only Manager edits `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json` or shared Y003 production files.
Every delivered proof needs exact remote source SHA, native moving frames/time range, fps, resolution, actual artifact/run ID or accessible persisted clip. Stills/test logs alone are not moving proof. Report failures truthfully.

## Exclusive owned modules
`yunex/src/video004/motion/**`; `yunex/video004/reports/A/**`. Do not edit source P03 motion/rig, Manager contracts, ROOT, timeline, camera or presentation.

## Goal / tasks
Implement `y004MotionAtFrame(frame): Y004DriveFrame` with deterministic shot-local moving low/high runs on the existing track. For rear steering, use curve/path curvature and qualitative speed regime (not a VO-triggered arbitrary sign flip or exact Porsche controller); initial |rear| cap ≤ 1° and front/rear coherent signed relationships. Low: opposite sign; high: same sign; no false wheel toe. Keep naturally varying spin/path distance, heading, speed, load and all four wheel contact poses tied to one frame. In hero sections choose a defensible steering regime for path motion rather than faking a switch. Preserve corrected Y003 asphalt Y and non-wobbling spin axis.
- Import Manager-owned types from `yunex/src/video004/contracts.ts`.
- Read Y003 `motion/contract.ts`, `groundContact.test.ts`, P03 source corrections. Work only through local adapter/immutable copy of Y003 MotionState, not edits to historical Y003.
- Choose two covered route intervals in the existing `trackUpgrade/racetrack/layout` sample domain; stage realistic slow-versus-fast qualitative travel. Explicit shot jump allowed at editorial cut. Validate no clamping/freezing/out-of-track.
- Document actual path curvature and front/rear kinematics; low-speed approximates tan-front minus tan-rear / wheelbase and cite simplified assumptions.
- Support run transitions/matched shots with stable screen heading; expose same output for forward and out-of-order frame calls.
- Publish early API implementation contract and tests so B and C can consume exact SHA.

## REQUIRED PROOF
A native 4–6s low moving driving proof (fixed-world roadside camera) with opposite signs front/rear, matched higher-speed same-direction proof with realistic parallax. Can use isolated Y004 local proof comp/workflow inside own paths only; Manager owns permanent shared composition registration. Record native artifact ID/source SHA/frame ranges. Automated: deterministic sampling, source model unchanged, wheel-centre alignment, sign, rear cap, road domain, grounding, speed/accel, no hard stop/no sliding.

## Done / return
Actual code + running tests + moving proof + named known limitations, remote branch and FULL SHA, paths changed. No 'done' based only on documentation. No Master-approved claim.
