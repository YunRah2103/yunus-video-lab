# Agent C — Y004 CAMERAS / STEERING GUIDES
ROLE: GPT-6 visualisation and cinematography specialist. Phase Y004-REAR-STEERING-01. BRANCH: `sol/y004-c-camera-guides`.
## Mandatory source and workflow
Repository `YunRah2103/yunus-video-lab`; phase `Y004-REAR-STEERING-01`. Read `yunex/video004/START_HERE.md`, `yunex/video004/MANAGER_CONTRACT.md`, `yunex/video004/TASKS.json`, this role handoff and original `yunex/video004/MANAGER_IMPLEMENTATION_HANDOFF.md` in that order. Initial accepted P03 source SHA: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Master handoff publication SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`. Your personal branch was created from a pinned Manager-dispatch commit; verify its exact remote SHA before editing. Never start from `main` or use an old Y003 role handoff.
You are a SEPARATE user-started ChatGPT chat. Do actual implementation; do not spawn, delegate, or only produce another handoff. Fetch current remote ref before every push, never force-push, and keep changes to owned paths. You cannot assume other chats' progress. If dependencies are missing, make independently testable progress and report exact blocker; do not invent completion.
Source is the corrected Y003-P03 Porsche; leave older compositions and car GLB unchanged. Porsche SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`. Reuse P03 actual GLB spin axes, quaternion wheel transforms, world asphalt height, pose-following shadows and track identity. Only Manager edits `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json` or shared Y003 production files.
Every delivered proof needs exact remote source SHA, native moving frames/time range, fps, resolution, actual artifact/run ID or accessible persisted clip. Stills/test logs alone are not moving proof. Report failures truthfully.

## Exclusive owned modules
`yunex/src/video004/camera/**`, `yunex/src/video004/guides/**`, `yunex/video004/reports/C/**`.

## Goal / tasks
Implement `resolveY004CameraPose(state, shotProgress)` and `resolveY004Guides(state,camera)`, importing the shared Manager-owned contract. Cinematic moving compositions: rear low hook (rear wheel readable before 2.8 s); rear wheel macro with kerb and road still visible; matched elevated three-quarter low/high shots facing broadly same direction; fast side/rear tracking; trackside pass and active exit. Use vehicle-follow and genuine fixed-world views so driving is credible, no floating car, dead white background, jarring mirrored mode comparison or random barrier road.
- Read P03 camera and track world conventions. Establish far/near/FOV bounds and framing to show both axles and preserve silhouette/green accents.
- Camera transforms follow world-space Y004 state exactly. Match-cut low/high viewing directions while using genuinely separate runs.
- Sparse two-axle cues follow actual wheel signed yaw, not fabricated giant arrows. Neutral line and small heading guide must be correctly transformed for wheel location; length may enhance visibility, no magnification of angular difference. At most two groups together. Fade when wheel occluded. No full-body translucent overlay unless demonstrated necessary.
- During A construction use typed fixture frames, then revalidate against real A motion SHA. B's actual rear rig proof is required for acceptance.

## REQUIRED PROOF
Native matched low/high moving shots consecutively and muted showing difference, hook rear wheel macro, active trackside exit with parallax. Record source pins, actual proof run/artifact, frame ranges and tests: frustum/contact/safe areas, not under asphalt, guide alignment with real steering, no flipping or jumps.

## Done / return
Actual camera and guide modules + native visual evidence + test results, FULL remote SHA and change list. No central composition edits or handoff-only output.
