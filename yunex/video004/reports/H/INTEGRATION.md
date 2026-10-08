# YUNEX 004 — Agent H final integration and evidence

**Status:** SOURCE/720-FRAME AUDIT PASS; STRICT LIMITED-RANGE RECOVERY IN PROGRESS; THREE RECOVERED NATIVE PROOFS PASSED; INDEPENDENT F VISUAL PASS PENDING. Do not release Agent G yet.

## Immutable film source
- Tested source commit: `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`.
- GitHub workflow: [H native proof run 37761847924](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37761847924).
- Branch: `sol/y004-h-integration`. This report-only commit is NOT a new approved render source; the native jobs checkout the exact tested source commit above.
- Full 720 frames at 30 fps, 1080×1920; registered `YUNEX-004`, visual-only. Provisional alias retained. Agent G muxes real D AAC externally.
- Low hook [0,84), rear macro [84,150), low steering [150,333), high steering explanation [333,432), high driving [432,567), active moving exit [567,720).
- Opposite → aligned rear steering mode match-cut frame 333 (11.100s), in actual Cedar speech silence 10.613–11.608s. High driving transition frame 432 (14.400s), in 14.232–14.979s silence; exit frame 567 (18.900s), within 0.042s of final sentence onset 18.858s.
- Deliberate 567 exit rather than proposed 552: 80m high-drive path over 135 frames stays within existing A speed limit; no track/motion path geometry rewrite.

## Approved dependencies
- Exact agent D updated editorial/audio source and manifest integrated from `9567f6b2efa901d3667d084eedbbca9c98943c36`. Only one quotation-mark syntax correction made in D's `audio/cues.ts` to safely represent the approved final spoken sentence containing `you're`; text unchanged.
- D's approved final AAC: Library `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`; SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`; 753,974 bytes, 48k stereo AAC, 24.000s, local SHA+FFprobe+full decode verified.
- Audio *bytes* remain in Library, not source repository. Agent G must fetch exact file, revalidate checksum, and external-mux once. No double narration from Remotion.
- Canonical unmodified Porsche GLB SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`; CI SHA guard PASS. P03 wheel/rim axes, B rear-axle/caliper rig, track, grounded tyres, guides, and car paint geometry were NOT edited by H.

## CI source tests — verified PASS on immutable source
Source-test job `113259913020` SUCCESS; 720-frame motion test PASS; D editorial tests PASS (20 assertions), D audio fixture tests PASS (19+ checks), H timing/source test PASS; F fixture suite PASS 45/45.
H test: 720 frames, active nonzero rear-steering frames low=273, high=131, speed 3.935–17.991m/s. Strict low opposite/high aligned signs and per-wheel spin distance checked across all frames.
F live full-frame audit PASS; artifact **11542213067** (`Y004-H-AUDIT-720`); live audit `AUTOMATED_PASS_VISUAL_NOT_REVIEWED`, 720/720 frames, lowActive 328, highActive 101, max rear angle 1°, max tyre-ground numerical error 1.033005948836152e-8m, 10 repeat/out-of-order requests deterministic, zero failures. This is NOT F moving footage approval.

## Fresh native moving proof render — run 37761847924
This is the same tested source `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`; each job renders a real native 1080×1920 30fps Porsche MP4 and checks counted frames, codec, pixel format, duration, full FFmpeg decoder, exact source SHA and media SHA256 before proof acceptance.

| Scene | Frames inclusive | Expected frames | Job ID | Native artifact ID at report publication |
|---|---|---:|---:|---|
| Hook/rear macro transition | 60–119 | 60 | 113260048058 | PENDING |
| Rear wheel macro | 90–149 | 60 | 113260048024 | PENDING |
| Low opposite steering | 247–306 | 60 | 113260048143 | PENDING |
| Matched low→high cut | 312–371 | 60 | 113260047954 | PENDING |
| High aligned steering | 372–431 | 60 | 113260048019 | PENDING |
| Roadside drive | 432–551 | 120 | 113260047942 | PENDING |
| Active moving exit | 567–686 | 120 | 113260047987 | PENDING |

**Run state when written:** all seven native render steps IN_PROGRESS; no native clip artifact IDs yet. Never count a running native job as passed.

## Release gate (do not bypass)
Agent F independently downloads, views and frame-references native proof MP4s, validates wheel articulation, restrained guides, low/high semantic sign, tyres grounded on track, wheel-spin/caliper nonprecession, roadside parallax, frame pacing and moving exit, then records its own PASS or issue report. Manager must review F verdict and pin immutable integrated SHA in its own `TASKS.json`. Only then Agent G may execute full 720-frame render/mux. H does not write Manager registry, F report, car GLB, Agent E/G renderer or a final film.

## 2026-10-08: actual root-cause repair and missing-frame proof

Run [37761847924](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37761847924) encoded all 60/60 high-steering frames, but FFprobe truthfully reported `yuvj420p` (full-range) rather than release-contract `yuv420p` (TV limited-range); low-steering and matched transition had the same failure. Old original RAW MP4s remain preserved as run artifacts, not falsely approved.

A dedicated **video export** correction is pushed:
- Limited-range FFmpeg normalizer `yunex/video004/reports/H/normalize-native-proof.sh`, helper commit `73eff3209959517df569a0a941bbfd74e8f135f0`. Convert full-range to limited-range via `scale=in_range=pc:out_range=tv,format=yuv420p`, H.264 libx264, `-pix_fmt yuv420p -color_range tv`, and correct bt709 VUI.
- The verifier remains strict; it checks exactly H.264, **`pix_fmt=yuv420p`, `color_range=tv`**, 1080×1920, 30/1, exact inclusive frame counts and matched runtime. FFmpeg `-xerror` full-decode and SHA256 also required. Before correction, decoder could work but pixel-format release gate correctly failed.
- New 9-job [recovery run 37764504658](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658), workflow commit `908a61bd52344f607f7d6a031b7e2b0c9e7e9ab3`. Seven existing RAW clips are retrieved from the immutable run above and **transcoded only; not rerendered**. Two new source-pinned native jobs render **opening 0–59** (60 frames) and **ending 687–719** (33 frames) and normalize/validate those clips.
- Every proof checks out the *same* approved film-source SHA `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`. Source animation/car/track/editorial unchanged; H's new commits are solely independent proof infrastructure and documentation.
- The three successful native recovered MP4s were also downloaded locally, inspected as actual videos or contact sheets, and independent FFprobe/full decoder checks passed (no inference from source-only audit).

| Shot | Inclusive frames | Original raw proof artifact (run 37761847924) | Final limited-range evidence (run 37764504658) | State |
|---|---|---|---|---|
| Hook macro | 60–119 | Waiting | PENDING | Original native job still rendering |
| Rear macro | 90–149 | Waiting | PENDING | Original native job still rendering |
| Low-speed opposite direction | 247–306 | 11543358681 | **11544360519** | Strict MP4/decoder PASS |
| Matched opposing-to-aligned | 312–371 | 11543447999 | **11543552651** | Strict MP4/decoder PASS |
| High-speed same direction | 372–431 | 11543208304 | **11543587123** | Strict MP4/decoder PASS |
| Roadside drive | 432–551 | Waiting | PENDING | Original native job still rendering |
| Active drive ending | 567–686 | Waiting | PENDING | Original native job still rendering |
| **Opening coverage** | **0–59** | New exact-source native rendering | PENDING | 60-frame range rendering |
| **Final-frame coverage** | **687–719** | New exact-source native rendering | PENDING | 33-frame range rendering |

Full source audit retained: **11542213067**, 720/720 automated PASS (not equivalent to native moving visual approval).

**Do not mark H final evidence complete until all nine limited-range artifact IDs exist and have passing native media validators. Do not permit Agent G full render until independent Agent F moving-footage QA PASS and Manager source gate.**
