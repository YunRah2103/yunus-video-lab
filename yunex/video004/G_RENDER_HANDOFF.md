# YUNEX 004 — AGENT G / FINAL RENDER AND ONE PLAYABLE MASTER
Phase `Y004-REAR-STEERING-01`; repository `YunRah2103/yunus-video-lab`.
**ASSIGNED BRANCH:** `sol/y004-g-render`. You are the separate normal ChatGPT render/release specialist. Finish the actual native film when H/F/Manager release gates pass. Do not create a redundant render engine, do not render the old 9.5s narration-mismatched source, and do not claim completion from synthetic smoke.

## Read and initial pins
1. `yunex/video004/START_HERE.md`, `MANAGER_CONTRACT.md`, `TASKS.json` and this handoff.
2. `yunex/video004/VOICEOVER_SOURCE_LOCK.json`.
3. H’s latest `sol/y004-h-integration` branch + integration report and FULL SHA (when pushed).
4. F's independent native visual pre-render PASS report against EXACT H SHA.
5. Agent D's `sol/y004-d-edit-audio` SHA `9567f6b2efa901d3667d084eedbbca9c98943c36` and release report.
6. Agent E's existing fully implemented strict renderer `yunex/video004/render/pipeline.py`, `README.md`, `.github/workflows/yunex-004-native-release.yml`. E SHA `9d4593308cf660d7824fb5ba013a59c15878e204` is tooling origin, already staged on Manager branch. Preserve its rendering contract.

## Initial source / role ownership
Your branch starts from Manager G/H dispatch source (not the final render source). The actual immutable `render_source_sha` MUST be selected later by Manager from accepted H integration. Do not render from your branch HEAD just because it is newer.

You may write `yunex/video004/reports/G/**` and small text `yunex/video004/delivery/**` only; if an additional workflow truly needed, own `.github/workflows/yunex-004-g-*.yml` after checking no duplication of E workflow. No edit of `yunex/src/video004/**` or `yunex/src/index.tsx`, Y003 source, track/GLB, other agents, E render scripts/workflow or Manager `TASKS.json`. Report any critical workflow deficiency and request exact scoped Manager/E fix; source SHA will require reapproval if changed.

## DO NOT start full render until all are visibly TRUE on remote
- H published an integrated native visual with final low-to-high VO-synced edit (s3 starts ~11.608s; high scene around 11.1s) and F reviewed real moving low/high/macro/road/exit proof.
- **Manager current `TASKS.json`: `locked_frames=720`; `render_source_sha` = full immutable H-accepted commit; `pre_render_qa_status="PASS"`; `pre_render_qa_evidence` = proof/report matching SAME accepted SHA.** No self-authorization, no fake PASS.
- At that exact source, composition `YUNEX-004` is registered 1080×1920, 30 fps, 720 frames; rendering is visual-only and silent.
- Exact D final AAC audio is available AT AN ACCEPTED IMMUTABLE REPO PATH beginning `yunex/video004/audio/` or `yunex/public/y004-`; source AAC SHA256 is `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`. WAV and Manager narration-only stem are NOT substitutes. If Library-accessible only, tell Manager/H and do not bypass E gate.

## Rendering mission after release
1. Use E native workflow manual dispatch `.github/workflows/yunex-004-native-release.yml` with `source_sha=<pinned SHA>`, `frame_count=720`, `composition_id=YUNEX-004`, `audio_path=<verified path>`. If GitHub does not register workflow unless it is on default branch, report exact failure and use supported local/GitHub execution workaround without bypassing controls.
2. Render all **36 x 20-frame** chunks using SAME pinned SHA (720 frames = 36 chunks). Verify complete consecutive coverage, no missing/unowned frames, exact original model SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
3. Assemble one **24.000s** true native MP4: 1080×1920, constant 30 fps, exactly 720 frames, H.264 true **limited-range yuv420p** (never yuvj420p), AAC 48 kHz stereo, faststart. Preserve full uncut narration and YUNEX motion through frame 719. Use strict E pipeline, full decoder pass and video+audio stream verification.
4. If assembly failure only, rescue from existing validated source-matching chunks; NEVER re-render completed verified chunks or weaken QA to save time. If a source change is needed, use new render SHA and retest.
5. Persist actual playable MP4 somewhere accessible to Manager/Master (GitHub run artifact with exact id is minimum; preferably persist accessible user Library MP4), deliver SHA256, all GitHub workflow/run/job/artifact IDs, exact render source and QA metadata. Do not commit huge MP4 bytes to git.
6. Push `yunex/video004/reports/G/FINAL_RENDER.md` and release metadata to YOUR G branch. Return FULL remote SHA, playable file/artifact and provenance. Request Agent F to perform independent FINAL file QA. G technical delivery PASS does NOT mean Master creative approval.

## Before H+F gate
You MAY check E tooling, GitHub workflow/manual permissions, run non-Porsche synthetic smoke/tests, verify that D audio SHA is known, and identify issues. Do not report final film ready, do not spend expensive 720-frame render until released, do not substitute Y003 or a test tone.

## Strict success criteria
One authentic new Y004 rear-steering film with Porsche moving on track throughout, narrated low/high visuals correctly synced to new Cedar; exact 720 frames/24s, strict codec and stream compliance, fully decoded and accessible, traceable pinned source, independent F final QA pending at delivery.
