# YUNEX 004 — AGENT H / ACTUAL FINAL INTEGRATION
Phase `Y004-REAR-STEERING-01`; repository `YunRah2103/yunus-video-lab`.
**ASSIGNED BRANCH:** `sol/y004-h-integration`. You are a separately opened normal ChatGPT chat, not an automatically spawned subagent. This document gives you explicit Manager-delegated ownership of central visual integration; you must implement and PUSH actual changes, not hand off again.

## Read
1. `yunex/video004/START_HERE.md`.
2. `yunex/video004/MANAGER_IMPLEMENTATION_HANDOFF.md` (Master original creative locks).
3. `yunex/video004/MANAGER_CONTRACT.md`, including final-delivery H/G delegation.
4. `yunex/video004/TASKS.json` (note Manager branch is the live registry; specialist branch copy can be older).
5. `yunex/video004/VOICEOVER_SOURCE_LOCK.json`, `VOICEOVER_INTEGRATION_UPDATE.md`.
6. D current completed delivery `sol/y004-d-edit-audio` SHA `9567f6b2efa901d3667d084eedbbca9c98943c36`, report `yunex/video004/reports/D/CEDAR_AUDIO_RELEASE.md`, `yunex/video004/audio/APPROVED_AUDIO_MANIFEST.json`, and current A/B/C/F reports.

## Input source
Initial base is latest Manager integration `06198558c2efba8a7a58242ee80021336066d917` plus this G/H handoff dispatch commit indicated by your branch HEAD. This branch ALREADY contains integrated provisional A/B/C/D/E/F code; DO NOT re-cherry-pick A/B/C whole branches, revert P03 corrections, copy over the Manager registry, or start fresh from main. Read current remote HEAD and `git diff` before every push.

## Mission
Finish final **24.000 s / 720 frames @30fps** Y004 integrated *visual* for G to render. The white/green Porsche 992 GT3 RS physically drives on its existing covered racetrack at ALL times; rear wheels very subtly steer opposite to front during low-speed explanation, same direction in high-speed explanation, rotating/spinning with grounded tyres and fixed-to-upright (nonspinning) calipers. Retain corrected real GLB spin/camber axes, shadows and track surfaces, premium varied cinematography, tasteful GREEN guides typography; no static cutaway, no exaggerated turning angle, no unrelated airflow/suspension content.

**Critical proven narrative mismatch:** In current `yunex/src/video004/motion/sampler.ts` STAGING shot plan, high mode starts at **frame 285 / 9.5 s**, while newly supplied lower-speed VO continues to ~**10.613 s** and new high-speed VO starts at **11.608 s**. Change the actual frame plan to roughly:
- low-hook: 0–83; rear-macro: 84–149;
- low-explain: 150–332; high-explain: 333–431;
- high-drive: 432–551; moving exit: 552–719.
These are suggested inclusive windows for production validation, NOT a guarantee. Ensure a cut inside natural silence between sentences and high mode is NOT shown during low VO. Revalidate true four-wheel path/velocity/contact consistency after timing change. Bring D's updated cues/edit modules into integrated source **by path**, and verify shot pacing/typography. Use actual spoken text, not obsolete original Master 59-word VO.

## Manager-authorized owned files (no conflicts)
- `yunex/src/video004/Video004.tsx`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/contracts.ts`, `yunex/src/index.tsx`;
- **only** STAGING timing literals in `yunex/src/video004/motion/sampler.ts` and associated local timing-specific tests if necessary. No mechanical rewrite, no new car or route.
- `yunex/video004/reports/H/**` and optionally a NEW namespaced `.github/workflows/yunex-004-h-*.yml` for proof (do not alter Agent E's existing release workflow);
- `yunex/public/y004-final-mix.m4a` if the exact approved D AAC is retrievable from Library and needed as an immutable repo-local asset for G. Original file path: `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`, expected SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`. DO NOT silently use Manager's narration-only stem in place of D's FINAL MIX. If inaccessible, truthfully flag it as remaining blocker and deliver visual work anyway.
- Agent H has **NO AUTHORITY** to edit `yunex/video004/TASKS.json` (Manager alone), Agent G/E render modules, earlier Y003 source, car GLB bytes or Agent F QA reports.

## Implementation obligations
1. Inspect current manager/proof compositions. Register final visual composition id **`YUNEX-004`** (720 frames, 1080×1920, 30 fps), and keep an optional visual-only review alias. Existing E release pipeline RENDERS MUTED and muxes approved 24s AAC externally; never double-play narration in Remotion.
2. Integrate current D transcript/cues without replacing D-owned files with obsolete copies; ensure timed graphics and low/high steering relation agree at every shot cut.
3. Preserve moving trackside parallax and active moving exit. Guide anchors follow actual steered wheel geometry, not fake large arrow angles.
4. Execute actual code tests, existing `yunex-004-integration-preflight.yml`, source GLB QA, F harness if possible; record commands/results and exact hashes.
5. Produce **new native 1080×1920 moving clips**, minimum hook/rear macro, low speed, high speed, matched low→high in correct order, 4–6 second roadside driving and active exit. A few stills alone do not prove motion. The previous smoke run `37755997906` passed 3 separate 24-frame proofs but was captured on PRE-RETIME source and is not final approval. CI artifacts must include source SHA, frame ranges and valid full decoder evidence.
6. Inspect clips or honestly state human continuous review not performed. H writes a comprehensive report under `reports/H` with integrated source full SHA, provenance and native artifacts. Do not declare F PASS on F's behalf.
7. Push the complete branch to `sol/y004-h-integration` and return FULL verified remote commit SHA and native clip artifact/run IDs. Notify Manager/F that integration is READY FOR REAL NATIVE PRE-RENDER QA. Do NOT attempt the final 720-frame render—that is Agent G's job.

## Exit conditions
Successful Y004 source compilation, lock-aligned 720-frame shot/story, true existing Porsche/track rig, moving native proof, exact source SHA, cue/transcript provenance, optional byte-verified D mix, no ownership conflicts; otherwise explicit BLOCKED and evidence. Manager must integrate/accept your SHA to release G.
