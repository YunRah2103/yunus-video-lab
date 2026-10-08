# Agent E — Y004 NATIVE RENDER / DELIVERY
ROLE: Sol rendering pipeline specialist. Phase Y004-REAR-STEERING-01. BRANCH: `sol/y004-e-render`.
## Mandatory source and workflow
Repository `YunRah2103/yunus-video-lab`; phase `Y004-REAR-STEERING-01`. Read `yunex/video004/START_HERE.md`, `yunex/video004/MANAGER_CONTRACT.md`, `yunex/video004/TASKS.json`, this role handoff and original `yunex/video004/MANAGER_IMPLEMENTATION_HANDOFF.md` in that order. Initial accepted P03 source SHA: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Master handoff publication SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`. Your personal branch was created from a pinned Manager-dispatch commit; verify its exact remote SHA before editing. Never start from `main` or use an old Y003 role handoff.
You are a SEPARATE user-started ChatGPT chat. Do actual implementation; do not spawn, delegate, or only produce another handoff. Fetch current remote ref before every push, never force-push, and keep changes to owned paths. You cannot assume other chats' progress. If dependencies are missing, make independently testable progress and report exact blocker; do not invent completion.
Source is the corrected Y003-P03 Porsche; leave older compositions and car GLB unchanged. Porsche SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`. Reuse P03 actual GLB spin axes, quaternion wheel transforms, world asphalt height, pose-following shadows and track identity. Only Manager edits `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json` or shared Y003 production files.
Every delivered proof needs exact remote source SHA, native moving frames/time range, fps, resolution, actual artifact/run ID or accessible persisted clip. Stills/test logs alone are not moving proof. Report failures truthfully.

## Exclusive owned modules
`yunex/video004/render/**`, `yunex/video004/reports/E/**`, newly named `.github/workflows/yunex-004-*.yml`. Never edit main Y004 composition or another owner's code. Can prepare tooling immediately but FULL RENDER IS BLOCKED until Manager's native short-proof QA and immutable `render_source_sha` pin.

## Goal / tasks
Adapt existing strict Y003 P03 render workflow and validation to Y004 composition IDs after Manager defines them; no reuse of Y003 735 frame number! Final locked integer frame count to be supplied after D audio measurement. Render 1080×1920 at constant 30 fps, exact locked frames, H.264 **true limited-range yuv420p** (not yuvj420p), AAC stereo 48k, faststart, full decode, no frame gaps/duplication, clear beginning/end, speech complete. Use one genuine export (no metadata-only duplicate variants).
- Preserve single exact source SHA across all native render chunks; source edit invalidates affected chunks.
- Preflight tools independently now, including GitHub Actions workflow, access to prepared model, FFmpeg ffprobe codecs and actual source pipelines. Don't claim P03 artifact watched if remote artifact access fails.
- Proven rescue: validate ordered exact-source chunks, use one explicit final yuv420p normalization encode rather than weakening tests, mux new approved Y004 audio, replay same chunks for assembly-only rescue where valid.
- Export workflow records run/job IDs, artifacts, per-piece and final SHA256, frame count, video/audio codecs, decoder output, timestamps and filesize, exact render source SHA.

## REQUIRED PROOF
Before release: runnable dry-run / smoke validation on a minimal local fixture or documented workflow dispatch. After Manager release: actual exported file + full decoder, ffprobe and SHA256 evidence + playable artifact; fail loudly if unavailable.

## Done / return
Native production pipeline code, test results, final artifact/run identity if released, FULL remote SHA, any reproducibility blocker. Never substitute 735 frames or claim completed export before Manager pin.
