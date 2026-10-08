# YUNEX 004 — Agent F independent QA / pre-render gate

**Phase:** `Y004-REAR-STEERING-01`  
**Role:** F — independently verify steering, rig, native moving picture and final delivery  
**Branch:** `sol/y004-f-qa`  
**Dispatch source:** `bf2f0996f4176791d5ac78d818090e8b429397ad`  
**P03 production reference:** `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`  
**Date:** 2026-10-08

## Overall finding

**Automated F QA harness: PASS (45/45 fixture tests).**  
**Actual Y004 pre-render native moving visual QA: BLOCKED / NOT REVIEWED.**  
**Final E native master delivery QA: BLOCKED / NO FINAL MASTER REVIEWED.**

The above PASS is for the independently authored F failure-injection QA implementation and is NOT a pass on Y004 production motion, rig, native footage, or creative direction. No Y004 native MP4 was watched in this F review. Do not infer Master approval.

## Implemented in Agent F's exclusive ownership

- `yunex/src/video004/qa/driveAudit.mjs`: full Y004 sample contract/steering signs, coherent rear pair, max 1° illustrative rear steer, source spin-by-distance, tyre/world-asphalt, frame/segment/speed/road data, optional simplified low-speed bicycle consistency, moved-in-world and frame coverage. Deterministic out-of-order sampler audit.
- `yunex/src/video004/qa/driveAudit.test.mjs`: 15 positive and malicious/negative state tests.
- `yunex/src/video004/qa/deliveryAudit.mjs`: immutable exact source, artifact/chunk IDs, gapless half-open frame coverage, mandatory H.264 true yuv420p, 1080×1920, 30fps, AAC 48k stereo, faststart, full decode, audio sample peak and file SHA.
- `yunex/src/video004/qa/deliveryAudit.test.mjs`: 18 adversarial delivery metadata tests including yuvj420p rejection, mixed-source chunk and clipping.
- `yunex/src/video004/qa/verifyMedia.mjs`: native ffprobe and FFmpeg read-only MP4 validator, per-packet CFR timestamp verification, stream/frame count, full audiovisual decoder pass, MP4 atom scanner, sampled peak measurement, SHA256, machine-readable report; cannot claim visual PASS.
- `yunex/src/video004/qa/auditLive.ts`: executable actual integrated Agent A sampler audit on every global frame after the Manager merge/frame lock; missing producer yields BLOCKED.
- `yunex/src/video004/qa/proofGate.mjs`: native moving clip manifest gates for A low/high driving, B rear macro, C matched muted, Manager integrated clip; exact accepted SHAs, 1080×1920/30fps, accessible artifacts, minimum moving frame duration. Independent F frame-referenced viewing gate distinct from metadata.
- `yunex/src/video004/qa/proofGate.test.mjs`: 12 adversarial native-proof/reviewer assertion tests.
- `yunex/src/video004/qa/README.md`: execution and source-proof schemas.

**Execution evidence:** All 45 repository test bodies were executed with their actual current source in a JavaScript test runtime, 45 PASS / 0 FAIL. Native media CLI top-level JavaScript syntax also compiled. This was *not* a `node --test` run on the user's local repo and *not* an actual native render/GLB run: no A/B/C integrated production files or playable native Y004 master were available in this F workspace. A production-grade PASS requires executing the committed Node tests, live sampler audit, actual native footage, and final media checks in the fully integrated environment.

## Latest remote dependencies inspected (not acceptance pins)

| Owner | Last inspected branch HEAD | QA implication |
| --- | --- | --- |
| A steering/motion | `8ba8678a9a98d5abd5b1b61bd800c5e90b95dc83` | Implemented low/high moving-proof renderer + report; **not proof of successful executed clip or visual PASS** |
| B rig/caliper | `4febfd0e1a4bae8d55823f1ffa2171acf94cbc4b` | Rig plus native-proof runner code; no accepted F-viewed rear macro |
| C camera/guides | `3dff36327bf04a7bee7b5927b0185a43eba68673` | Camera/guide work exists; no accepted F-viewed matched muted clip |
| D editorial/audio | `d96b5731a3584d294d54465034c70a3928e7271a` | Isolated edit proof/report, new measured VO not accepted |
| E delivery | `c2fe1a31b6b55ea6bb68d9b697ad7ddf1540efd8` | Export tooling under development; final immutable full master absent |
| Manager | `3fb63792f1b085be79a4fdb7103762bc65d1266c` | No F-reviewed integrated short proof or render-source lock |

Branch snapshots can move. None of the above are approved QA acceptance pins merely because they exist; the Manager must publish exact accepted input commits and working proof artifact identities.

## Unresolved mandatory evidence

1. Successful, playable **A low and high moving clips** at actual source SHA, 120+ frames, fixed-world camera, real wheel/road travel. Verify mode signs in footage as well as numbers.
2. **B actual GLB moving rear-wheel macro**, rim-plane stability through rotation, tyre contact/arch, steer-following non-spinning caliper, world orientation after pivot attach. Machine-only/fixture rig evidence does not replace it.
3. **C matched low/high muted moving pair**, anchored honest direction cues, readable rim and agreed screen travel orientation.
4. **Manager integrated short native review** including rolling hook under 3 seconds, both demonstrated modes, road/trackside parallax, typography safe area and active exit.
5. Lock narration and integer frame count, Manager immutable `render_source_sha`, then **E actual final film** with artifact/run IDs and exact-source chunk manifest.
6. **Independent F watching of actual moving native clips** and the complete final MP4 with and without sound. Frame-referenced observed PASS/FAIL notes mandatory; no guessing from PNGs or static reports.
7. Full real MP4 `verifyMedia.mjs` pass (true yuv420p and AAC, constant fps frame packets, 48k stereo, full decode, faststart, no clipping, frame lock, hash and gapless same-source coverage).

## Re-review directions

1. Once A/B/C and Manager provide actual native moving clips plus accepted full remote SHAs, run `node --test src/video004/qa/*.test.mjs` from `yunex` and run `npx tsx src/video004/qa/auditLive.ts --frames <LOCKED_N> --source <INTEGRATED_SHA> --out /tmp/y004-f-drive.json` on the Manager integration branch.
2. Review native moving clips side by side, muted and with sound where relevant. Record **clip SHA/artifact and exact frame** for failures. Correct through original owning specialist, never edit their paths from F.
3. After E exports the immutable final master, run `node yunex/src/video004/qa/verifyMedia.mjs` with approved render SHA, actual MP4, locked frame count, chunk manifest and artifact ID; then visually review the entire final video with sound and muted.

**Decision: BLOCKED pending genuine native moving evidence.** F source implementation is pushed separately; do not promote this report to a Y004 final-film PASS.
