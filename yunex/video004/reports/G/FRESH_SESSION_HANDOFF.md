# YUNEX 004 — Agent G fresh-chat resumption / source-gated native release
**Date:** 2026-10-08
**Author:** Y004 Manager (handoff for a NEW ChatGPT chat taking over the **same** G role)
**New agent branch:** `sol/y004-g-render`; **base prior G SHA:** `0e8ee3b2c0a4aa56c23654685c8518031c87f7f0`.
**Supersedes:** chat context only. Does NOT supersede original `G_RENDER_HANDOFF.md`, E render pipeline, H integration, Manager registry, or F independent QA.

## Key decision
The user is replacing an aging separate Agent G chat with a **new Agent G session** for a clean context. There is ONE G owner, ONE final renderer, and ONE final MP4. The old G session should not be asked to push concurrently. Do NOT create Agent J, branch away from this branch, discard prior G report, start from main, or reimplement the renderer.

## Immediate prerequisites — LIVE status must be rechecked, not copied
- At handoff creation, Manager `sol/y004-rear-steering-manager` at SHA `b101bb4b53d044d3ab727626ff8d0f7b0a2dfa32`. Its `yunex/video004/TASKS.json` has `locked_frames=720` but `render_source_sha=null`, `pre_render_qa_status=BLOCKED`, `i_release_launch_authorized=false`. It is NOT ready to render.
- Agent H branch `sol/y004-h-integration` latest known `dc61fa75382e2a0e8d2d9d8bfebd0a363ea3988d`; exact tested integrated film source `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`. H fixes the low-speed to high-speed cut at frame **333** (11.1s), active exit starts frame **567**. Its native proof run `37761847924` had incomplete matrix and a `high-steering` clip that rendered 60/60 but failed because its H **proof validation** reported `yuvj420p`, not true limited-range `yuv420p`. H must correct this; G must not weaken strict full film validation.
- Agent F `sol/y004-f-qa` at `44b8d3913375bf75c33294752d448b103889596a` delivered `reports/F/H_INTEGRATED_NATIVE_VISUAL_QA.md` with pre-render visual **FAIL/BLOCKED** due missing exact-H moving MP4 evidence. F also requested opening frames 0–59 and ending frames 687–719, plus real visual/audio check. No actual visual defect can be inferred from absence of footage.
- Agent I `sol/y004-i-release-prep` `213f2bb06d4720c3ee9a363110158b36b64cfaf1` produced a gated branch-push workflow, passed CI `37763821232`, and independently validated real approved Cedar AAC. The approved AAC is **not in GitHub source** yet; only user Library and Agent I portable git patch. Do NOT claim successful audio publication until exact bytes are committed and SHA verified.
- Agent D `sol/y004-d-edit-audio` at `9567f6b2efa901d3667d084eedbbca9c98943c36`, approved final AAC: SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`, 753,974 bytes, 24.0s 48k stereo. Library `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`. Raw MP3 original source SHA256 `db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b`. Only the **approved final mix** may be muxed, not Manager narration stem/old Y003/placeholder sound.
- Existing Agent E native render pipeline: `yunex/video004/render/pipeline.py`, `test_pipeline.py`, `.github/workflows/yunex-004-native-release.yml`. Preserve it. Agent I `.github/workflows/yunex-004-i-gated-release.yml` solves branch launch issue without enabling unapproved full render. G earlier report: `yunex/video004/reports/G/RENDER_PREFLIGHT.md`.

## Task of NEW G chat
1. Read `START_HERE.md`, `MANAGER_CONTRACT.md`, `TASKS.json` on live Manager branch, `G_RENDER_HANDOFF.md`, this fresh handoff, the prior G `RENDER_PREFLIGHT.md`, Agent I's `RELEASE_READY.md`, and current H/F reports.
2. Fetch actual live remote branch heads and workflow/artifact statuses; do NOT rely blindly on old status text. Preserve G branch's existing pipeline preflight.
3. While blocked, run only non-full-render preflight and verify a supported release route. Never trigger `[Y004-RELEASE-GO]` without explicit Manager authorization and F proof.
4. Once H/I changes are incorporated, F approves real native moving proofs on the exact MERGED immutable source, and Manager sets `render_source_sha`, `pre_render_qa_status=PASS`, matching evidence and canonical AAC path, commence ONE true Y004 final native render.
5. Final media spec: `YUNEX-004`, 1080 × 1920 portrait, 30 fps, EXACTLY 720 frames, 24.000 seconds, H.264 limited-range yuv420p, AAC 48k stereo, faststart, full decoder PASS, source provenance + SHA256. E pipeline chunks 36 × 20, no mixed-source chunk reuse.
6. Report exact GitHub workflow/run/job/artifact IDs, accessible one actual final `YUNEX-004-FINAL.mp4`, full MP4 SHA256, release source SHA and metadata. Push `reports/G/FINAL_RENDER.md` and update own G branch; return FULL remote SHA.
7. F independently checks delivered actual final film, then Manager delivers to Master for creative approval. G's codec PASS is not F/Master visual PASS.

## Ownership and safety
Write only `yunex/video004/reports/G/**`, small text `yunex/video004/delivery/**` and namespaced new G workflow if Manager authorizes an actual need. Do not edit existing E renderer/workflow, scene/timeline, car GLB, Agent H/F/I source, Manager TASKS, or write a false "approved" verdict. If issue is outside G ownership, surface exact defect and owner to Manager; no extra agent assignments.

Current desired answer from new G: initial source check and succinct blocking status; after release gate, perform real render and final delivery, not another planning-only handoff.
