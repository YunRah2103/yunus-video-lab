# Agent F — Y004 INDEPENDENT MECHANICAL / VISUAL / DELIVERY QA
ROLE: GPT-6 independent reviewer. Phase Y004-REAR-STEERING-01. BRANCH: `sol/y004-f-qa`.
## Mandatory source and workflow
Repository `YunRah2103/yunus-video-lab`; phase `Y004-REAR-STEERING-01`. Read `yunex/video004/START_HERE.md`, `yunex/video004/MANAGER_CONTRACT.md`, `yunex/video004/TASKS.json`, this role handoff and original `yunex/video004/MANAGER_IMPLEMENTATION_HANDOFF.md` in that order. Initial accepted P03 source SHA: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Master handoff publication SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`. Your personal branch was created from a pinned Manager-dispatch commit; verify its exact remote SHA before editing. Never start from `main` or use an old Y003 role handoff.
You are a SEPARATE user-started ChatGPT chat. Do actual implementation; do not spawn, delegate, or only produce another handoff. Fetch current remote ref before every push, never force-push, and keep changes to owned paths. You cannot assume other chats' progress. If dependencies are missing, make independently testable progress and report exact blocker; do not invent completion.
Source is the corrected Y003-P03 Porsche; leave older compositions and car GLB unchanged. Porsche SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`. Reuse P03 actual GLB spin axes, quaternion wheel transforms, world asphalt height, pose-following shadows and track identity. Only Manager edits `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json` or shared Y003 production files.
Every delivered proof needs exact remote source SHA, native moving frames/time range, fps, resolution, actual artifact/run ID or accessible persisted clip. Stills/test logs alone are not moving proof. Report failures truthfully.

## Exclusive owned modules
`yunex/src/video004/qa/**`, `yunex/video004/reports/F/**`. You may read all other branches and source; do not modify another role's production code or silently waive tests.

## Goal / tasks
Create independent Y004 checks while A–E build. Inspect exact contemporary FULL REMOTE SHAs, not older passing Y003 snapshots. Review motion vs actual path at low/high, yaw sign, 1° rear cap, non-toe rear pair, tyre contact + arch, corrected source GLB spinning without rim precession, caliper follows rear yaw not spin, chassis/camera/shadow motion, world-parallax, all shots correctly track-bound, caption legibility/mobile safe areas.
- Review actual short native moving clips, not only unit tests or PNGs. Show matched low/high muted evidence; hook within 3 s and continuous driving; avoid false Porsche threshold/lap-time claims.
- For actual audio, check narration matches text, phrase-aligned low/high, no missing words, peaks not clipping. Final MP4 review: 1080×1920 @30fps, final integer frames, H264 true yuv420p, AAC 48k stereo, faststart, full decode, gapless chunk coverage, source hash and artifact provenance.
- Distinguish algorithmic PASS from visual PASS, and visual inspection from full real-time audiovisual playback. If playback unavailable, state it explicitly; no creative approval claim.
- Escalate significant visual/mechanical failures to Manager with native frame references, clear owner and corrective requirements. Re-review latest correction not old baseline.

## REQUIRED PROOF
Independent test suite plus PASS/FAIL report for: A/B/C native short proof and E final delivery. Reports must specify reviewed SHA and artifacts. Report BLOCKED if film/proofs not yet available. Do NOT mark Y004 approved or finish without actual native moving evidence.

## Done / return
Pushed independent checks, evidence-linked QA report, branch FULL remote SHA and exact acceptance/blockers. No handoff-only response.
