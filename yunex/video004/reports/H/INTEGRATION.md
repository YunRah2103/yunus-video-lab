# YUNEX 004 — Agent H: completed native integration evidence

**H STATUS: COMPLETE — 9/9 exact-source native moving proofs validated; independent Agent F visual approval remains pending.**

## Immutable final integrated film source

- **Film source and all nine MP4 provenance SHAs:** `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`. All nine artifact manifest files contain this exact full SHA, matching the immutable film source checked out in GitHub Actions. New commits on H branch amend only render-proof scripts and evidence, **not** this film source.
- GitHub [source run 37761847924](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37761847924): `source-tests` SUCCESS; original native jobs may show failures caused by their full-range H.264 export, not failed animation source.
- GitHub [final native proof recovery run 37764504658](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658): **SUCCESS; all 9 of 9 recovery jobs PASS**. Exact source lock is enforced on checkout and proof provenance.
- `YUNEX-004` registered as **720 frames at 30 fps, exactly 24.000 seconds, 1080×1920**. Visual composition is silent for external final AAC mux by Agent G; `YUNEX-004-VISUAL-PROVISIONAL` remains compatibility alias.
- Canonical unmodified Porsche model GLB SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- None of the car geometry, wheel mechanism, rear-axle rig, track asset, high-/low-speed choreography or production animation paths were modified to perform the export repair.

## Strict export repair: diagnosed, corrected, retested

The first seven moving-proof jobs rendered actual native frames, but raw Remotion H.264 outputs reported `yuvj420p` (full-range) from FFprobe. The release gate correctly required **`pix_fmt=yuv420p` with `color_range=tv`**. Agent H corrected the *encoded video*, not the validator:

- `yunex/video004/reports/H/normalize-native-proof.sh`, implementation commit `73eff3209959517df569a0a941bbfd74e8f135f0`, applies input-range-aware `scale=...:in_range=pc:out_range=tv,format=yuv420p` when required, and FFmpeg libx264 with `-pix_fmt yuv420p -color_range tv`, bt709 VUI and faststart.
- The new workflow `.github/workflows/yunex-004-h-proof-rescue.yml`, successful run at workflow commit `908a61bd52344f607f7d6a031b7e2b0c9e7e9ab3`, retrieves and normalizes **the seven existing source-locked raw MP4s rather than repeating their native Three.js/Remotion renders**.
- Two additional native renders from the same immutable 720-frame film source cover exact first frames **0–59** and final frames **687–719**. They use the same strict normalization and media gate.
- Every successful artifact includes `source-sha.txt`, `frames-inclusive.txt`, `ffprobe-original.json`, `ffprobe.json`, `normalization.txt`, `decoder-result.txt`, `SHA256SUMS` and the exact MP4. Original seven raw outputs remain recoverable from run 37761847924.

**Validation required and passed for each of 9/9 MP4s:** H.264; 1080×1920; constant 30/1 fps; strict `yuv420p`, range `tv`; exactly the inclusive expected count; duration within frame tolerance; full FFmpeg `-xerror` decode; SHA256 match. Agent H independently downloaded and rechecked every ZIP, confirmed embedded full source SHAs and media digests, independently decoded all nine native MP4s, and sampled moving frames and visual contact sheets; no static-frame substitution was used.

## Final native moving-proof inventory — nine validated artifacts

| Native proof | Frames inclusive | Frames | GitHub Actions artifact ID | Result |
|---|---|---:|---|---|
| Opening actual film first frames | 0–59 | 60 | [11544229629](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11544229629) | **PASS** |
| Hook/rear-wheel demonstration | 60–119 | 60 | [11543722551](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11543722551) | **PASS** |
| Rear-wheel macro | 90–149 | 60 | [11544638033](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11544638033) | **PASS** |
| Low-speed counter-direction steering | 247–306 | 60 | [11544360519](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11544360519) | **PASS** |
| Matched low/high mode transition | 312–371 | 60 | [11543552651](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11543552651) | **PASS** |
| High-speed same-direction steering | 372–431 | 60 | [11543587123](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11543587123) | **PASS** |
| Roadside driving | 432–551 | 120 | [11543912279](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11543912279) | **PASS** |
| Active moving exit | 567–686 | 120 | [11544021689](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11544021689) | **PASS** |
| Final 33 frames | 687–719 | 33 | [11543723429](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658/artifacts/11543723429) | **PASS** |

**Machine-readable authoritative inventory with all nine full MP4 SHA256 values and identical source SHAs:** [native-proof-inventory.json](./native-proof-inventory.json). Each row specifies its artifact ID, name, original frame range, expected count, immutable source SHA, verified MP4 digest, strict format and local decoder test.

The whole-film source audit remains **artifact [11542213067](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37761847924/artifacts/11542213067)** (`Y004-H-AUDIT-720`): `AUTOMATED_PASS_VISUAL_NOT_REVIEWED`; 720/720 frame audit, zero failures, maximum reported rear angle 1°, maximum tyre-ground error 1.033005948836152e-8 m, repeat/out-of-order frame determinism PASS. `source-tests` run job 113259913020: motion tests PASS (720 frames, max speed ~17.991 m/s), editorial D tests PASS (20 assertions), audio D fixture tests PASS (19+ checks), H integration test PASS, F fixture suite PASS **45/45**.

## Editorial and approved narration lock

- Timeline stage ranges: hook [0,84), rear macro [84,150), low steering [150,333), high steering [333,432), high-speed driving [432,567), moving exit [567,720). Switch to same-direction high-speed steering at **frame 333 = 11.100 s**, in Cedar's 10.613–11.608 s spoken gap; transition to higher-speed driving at frame 432 = 14.400 s, in 14.232–14.979 s gap; moving exit starts frame 567 = 18.900 s, only 0.042 s after spoken ending's 18.858 s start.
- Source-approved exact Agent D editorial/audio metadata integrated from D commit `9567f6b2efa901d3667d084eedbbca9c98943c36`. Fixed only a TypeScript quote-escape issue without altering approved spoken text.
- Agent D approved Cedar stereo AAC: Library `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`; exact SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`; 24.000 s, AAC 48 kHz stereo, verified full decode. Audio remains separate from H's nine muted **visual proof** MP4s; Agent G will retrieve checksum-locked bytes for external mux. Never use old script.

## Release control, ownership and remaining blocker

- **Agent H native integration evidence is delivered and complete.** All nine native clips were rendered or reused from the exact locked source and strictly validated. No need for H to rerender any successful shots or start a full 720-frame native render.
- **Independent Agent F visual QA still required:** F must inspect actual source-matched moving clips for correct low-speed opposite and high-speed aligned steering, wheel-spin and caliper nonprecession, tyre-ground contact, believable track movement and parallax, guide/camera coherence, opening and moving final-frame quality. H media validation and visual sampling do **not** imply an independent Agent F creative PASS.
- **Manager render-source release lock still required:** only after Agent F PASS and Manager exact-source approval may Agent G start the full 720-frame render and mux approved D Cedar audio. H has not written `TASKS.json`, modified Agent E/G render pipeline, or performed full render.
