# Agent B — Y004 REAR-STEERING RIG / CALIPERS
ROLE: GPT-6 mechanical articulation specialist. Phase Y004-REAR-STEERING-01. BRANCH: `sol/y004-b-rig`.
## Mandatory source and workflow
Repository `YunRah2103/yunus-video-lab`; phase `Y004-REAR-STEERING-01`. Read `yunex/video004/START_HERE.md`, `yunex/video004/MANAGER_CONTRACT.md`, `yunex/video004/TASKS.json`, this role handoff and original `yunex/video004/MANAGER_IMPLEMENTATION_HANDOFF.md` in that order. Initial accepted P03 source SHA: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Master handoff publication SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`. Your personal branch was created from a pinned Manager-dispatch commit; verify its exact remote SHA before editing. Never start from `main` or use an old Y003 role handoff.
You are a SEPARATE user-started ChatGPT chat. Do actual implementation; do not spawn, delegate, or only produce another handoff. Fetch current remote ref before every push, never force-push, and keep changes to owned paths. You cannot assume other chats' progress. If dependencies are missing, make independently testable progress and report exact blocker; do not invent completion.
Source is the corrected Y003-P03 Porsche; leave older compositions and car GLB unchanged. Porsche SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`. Reuse P03 actual GLB spin axes, quaternion wheel transforms, world asphalt height, pose-following shadows and track identity. Only Manager edits `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json` or shared Y003 production files.
Every delivered proof needs exact remote source SHA, native moving frames/time range, fps, resolution, actual artifact/run ID or accessible persisted clip. Stills/test logs alone are not moving proof. Report failures truthfully.

## Exclusive owned modules
`yunex/src/video004/rig/**`; `yunex/video004/reports/B/**`. No changes to `yunex/src/video003/motion/runtimeArticulation.ts`, geometry or GLB.

## Goal / tasks
Create `createY004RearSteerRig(model)` (document full signature) wrapping/reusing corrected P03 `createRuntimeMotionRig` so rear calipers and hubs steer with uprights while wheels roll independently. Detect real asset hierarchy and parent/steer axes, not generic assumptions. P03 rear calipers remain under a non-steering parent; safe runtime `attach()` or equivalent must preserve world pose when moving rear caliper under Steer_RL/RR (NEVER under Spin). Keep caliper fixed relative to upright as wheel spins; retain steering and suspension offset. Both rear wheels turn with proper same-sign conventions and respect source baked camber axes.
- Snapshot original parents, transforms, mesh materials and restore on dispose; do not modify source GLB bytes.
- Prove no part detached, no clipped arch, no incorrect caliper rotation, hubs concentric while steering and spin.
- Use test fixture MotionState with clear signed small rear values while A still works; then test against accepted A SHA and pin it in report. Coordinate interface only through Manager typed contract.
- Explicitly test all four wheels and actual GLB rim plane over many rotations at neutral and ±1° rear steer; P03 precession correction MUST remain intact. No unapproved steers >1°.
- Do not reintroduce Y003 suspension teardown or alter track.

## REQUIRED PROOF
Native rear wheel macro with road movement and tyre spinning while small real rear steer changes; visible caliper stationary relative to steered upright, not spinning. Actual asset test reports max rim-plane wobble/precession and tyre contact; restore/reapply idempotence. Provide source SHA, frame range, evidence artifact/run and tests.

## Done / return
Verified code and physical/visual proof, branch FULL remote SHA, changed paths and any Manager integration notes. No handoff-only submission.
