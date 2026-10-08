# YUNEX 004 — Agent G live release gate audit
**Date:** 2026-10-08 (Europe/London)  
**Role:** New Agent G continuing original `sol/y004-g-render` owner, not a parallel renderer  
**State:** **RENDER NOT AUTHORIZED — NO FULL RENDER TRIGGERED, NO FINAL MP4 CLAIMED**

## Exact live branch references at audit
- G inherited HEAD before this report: `f40cd5f083913f3627148d2d0834b7abdf8652a7`. Its prior preflight remains in `reports/G/RENDER_PREFLIGHT.md`.
- Manager: `sol/y004-rear-steering-manager` `b101bb4b53d044d3ab727626ff8d0f7b0a2dfa32`.
- H: `sol/y004-h-integration` `908a61bd52344f607f7d6a031b7e2b0c9e7e9ab3`; original source-tested film SHA `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`. H HEAD updates rescue workflow; it is not itself Manager-approved final merged film source.
- F: `sol/y004-f-qa` `44b8d3913375bf75c33294752d448b103889596a`.
- I: `sol/y004-i-release-prep` `213f2bb06d4720c3ee9a363110158b36b64cfaf1`.
- E native tooling origin: `9d4593308cf660d7824fb5ba013a59c15878e204`.

## Fail-closed Manager release checks
Read actual Manager `yunex/video004/TASKS.json` on above branch:
- `locked_frames = 720`: **PASS**.
- `render_source_sha = null`: **BLOCKED**.
- `pre_render_qa_status = BLOCKED`: **BLOCKED**.
- `pre_render_qa_evidence = null`: **BLOCKED**.
- `i_release_launch_authorized = false`: **BLOCKED**.
- A final combined H/I source SHA was not approved. Do not infer approval from H source unit-test PASS.

## Native moving proof and F independent QA
- Original H source `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55` native proof run [37761847924](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37761847924) had 720-frame source audit PASS (artifact `11542213067`) but failed some strict `yuvj420p` clip validators; incomplete/missing footage is not proof of a visual defect.
- H corrected normalization and expanded proof coverage with [run 37764504658](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658), current HEAD `908a61bd52344f607f7d6a031b7e2b0c9e7e9ab3`.
- Snapshot at audit: 3/9 new proof jobs completed SUCCESS: low steering job `113268713018` artifact `11544360519`; high steering job `113268713058` artifact `11543587123`; matched low-high job `113268713288` artifact `11543552651`. Remaining six were in progress, including new opening frames `0–59` and final `687–719`. Always refresh these IDs and statuses before decision.
- F independent report `reports/F/H_INTEGRATED_NATIVE_VISUAL_QA.md` still states **FAIL/BLOCKED for insufficient moving evidence**, not for an observed defect, and has no independent visual PASS against an exact Manager-combined H/I SHA.

## Approved Cedar AAC delivery check
- Agent D approved **753,974-byte**, **24.000 s**, **AAC 48 kHz stereo** Cedar mix, SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`.
- Agent I validated the actual source in the user's Library; see `reports/I/RELEASE_READY.md`. This **does not** prove the approved audio is in the GitHub source.
- `yunex/video004/audio/y004-approved-cedar-24s.m4a` returned 404 on both I and Manager branches, and `yunex/public/y004-final-mix.m4a` returned 404 on H and G branches. **Repo-local approved AAC currently missing** at the two contracted release paths checked.
- Manager must integrate the actual byte-exact audio on the immutable source and set one accepted `release_audio_path`; never substitute Y003 or narration-only WAV/stem.

## GitHub release infrastructure inspection
- E's native pipeline `yunex/video004/render/pipeline.py` and E workflow are already present. Prior G local synthetic codec test PASS and E native-smoke GitHub [run 37750922383](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37750922383) job `113223639217` SUCCESS; this verifies tooling, NOT finished Porsche frames.
- I's `.github/workflows/yunex-004-i-gated-release.yml` is a tested branch-push route to avoid default-branch `workflow_dispatch` registration. CI [run 37763821232](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37763821232) branch-smoke job `113266457565` SUCCESS; locked-source gate `113266521562`, render `113266521354`, package `113266522102` all correctly SKIPPED.
- I's checked-in `verify_gate.py` fails closed on Manager SHA, structured independent F evidence, 720 frames, authorization, model hash and exact verified audio. G must not duplicate or weaken this verifier or E's existing render implementation.
- For actual full release, Manager first merges H/I, obtains F's native visual PASS against the exact combined source, pins that immutable render SHA and audio path in TASKS, sets `i_release_launch_authorized=true`, and pushes an authorized Manager commit bearing `[Y004-RELEASE-GO]`. No such release was observed/initiated by G.

## Contract after authorization only
Use immutable approved SHA, `YUNEX-004`, exactly 36 contiguous 20-frame Remotion chunks spanning 0–719, 1080×1920 / 30fps, then E's unmodified normalize/assemble/validate path with exact Cedar AAC. Deliver **one** H.264 limited-range `yuv420p` + AAC 48k stereo faststart `YUNEX-004-FINAL.mp4`, 720 decoded video frames, 24 s, full decoder/timestamp checks, exact artifact/run IDs and MP4 SHA256, then independent F **final file QA**. No unchecked artifact or codec-only success is creative approval.

**Current outcome:** Release-preparation verification completed within Agent G reporting scope. Authentic full render correctly withheld; no final MP4 exists in this Agent G delivery. No scene, model, audio, Manager registry, E pipeline or I/H/F code was modified.
