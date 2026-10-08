# YUNEX 004 — Agent H corrected-source native integration: COMPLETE

**H delivery status: ALL 11/11 NATIVE PROOFS PASS; no H rendering/export blockers.** **Independent Agent F visual approval remains outstanding**; H's own scene review does not authorize Manager/Agent G final rendering.

## Exact source, scope and ownership

- Corrected, **immutable film source SHA** for all eleven native MP4s: `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`.
- Native source, tests and video [workflow **37769701749**](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749): **COMPLETED SUCCESS**; 12/12 jobs passing (1 source-test job, 11 native proof jobs).
- Agent C corrected camera/overlay code from commits `8039e03db2d2a774c4a4f3ff9639b8148eb69707` and `f891e3b991c73c4c62305dddcd45cea9eeea5090` integrated into H branch.
- H `Video004.tsx`: `<Y004SteeringGuidesOverlay/>` mounted **after** `</ThreeCanvas>`, **before** `<Yunex004EditLayer/>`. Duplicate 3D reference rays hidden only in educational low/high shots; macro and hook 3D guides retained. C's true-angle readout labels front/rear left/right/centred categorically, with no artificial increase in wheel yaw.
- C widened **opening 0–59** and **roadside 432–551** optical camera framing. No change to model, steering motion, rig, wheel cap, track geometry, approved D narration, timeline, A/B systems or final render pipeline.
- GLB SHA256 remains `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- Native Remotion `YUNEX-004` composition remains **720 frames, 1080×1920, 30 fps, exactly 24.0 seconds**, muted visuals only. D approved Cedar stereo AAC remains separate at SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`, for Agent G to retrieve and mux only after clearance.

## Completed source and numeric tests

- Source-test job `113285951624` **SUCCESS**, GitHub [audit artifact **11547123669**](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547123669), same corrected film SHA.
- C camera/guide fixture: baseline PASS, framing proxy **14 samples PASS**, steering categorical/projection **10 samples PASS**, zero steering centred accurately, yaw angle not exaggerated; framing proxy does not substitute for actual-video review.
- Integrated `Video004.tsx` and Remotion root browser bundles PASS; existing A 720-frame motion tests PASS (maximum velocity approximately 17.991 m/s), D editorial 20 assertions PASS, D audio 19+ fixture checks PASS, H full timeline source tests PASS, F independent automated QA fixture suite **45/45 PASS**.
- Full corrected-source 720-frame live audit PASS with zero automated failures; formally `AUTOMATED_PASS_VISUAL_NOT_REVIEWED`.

## Final updated exact-source moving MP4 inventory

All eleven clips were rendered from exactly `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`, and all eleven CI jobs **passed** after FFmpeg strict limited-range normalization, no validator relaxation. Every artifact contains its own `source-sha.txt`, `frames-inclusive.txt`, `SHA256SUMS`, `ffprobe-original.json`, `ffprobe.json`, `decoder-result.txt`, native MP4 and provenance metadata.

| Visual proof | Inclusive frames | Frame count | Artifact ID (run 37769701749) | Format and decode |
|---|---|---:|---|---|
| Opening camera | 0–59 | 60 | [11547392900](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547392900) | **PASS** |
| Opening tail | 60–83 | 24 | [11548180309](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548180309) | **PASS** |
| Low-speed teaching / previous major proof gap | 150–246 | 97 | [11549115114](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11549115114) | **PASS** |
| Low-speed steering | 247–306 | 60 | [11548522472](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548522472) | **PASS** |
| Low-speed match-cut bridge | 307–311 | 5 | [11546544603](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11546544603) | **PASS** |
| Opposing→aligned cut | 312–371 | 60 | [11548552591](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548552591) | **PASS** |
| High-speed steering | 372–431 | 60 | [11548576922](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548576922) | **PASS** |
| Roadside driving | 432–551 | 120 | [11548780809](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548780809) | **PASS** |
| Roadside exit-cut bridge | 552–566 | 15 | [11548412328](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548412328) | **PASS** |
| Active moving exit sample | 567–596 | 30 | [11547945616](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547945616) | **PASS** |
| Final moving frames | 687–719 | 33 | [11547991357](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547991357) | **PASS** |

**Verified format for every clip:** H.264; 1080×1920; 30/1 fps; exact count; `pix_fmt=yuv420p`; `color_range=tv`; bt709 metadata; matching ZIP-embedded MP4 SHA256; full `ffmpeg -xerror` decoder PASS in GitHub workflow. H independently downloaded all eleven ZIP archives, checked source and range metadata and MP4 SHA256, independently used FFprobe to confirm exact stream/frame metadata, and additionally full-decoded the final two newly completed clips. The 11 exact MP4 hashes are in the machine-readable [**native-proof-inventory.json**](./native-proof-inventory.json).

## Actual visual sample observations (not an F verdict)

- **Opening 0–59:** new camera places the complete white/green Porsche and wing within 9:16 frame, improving previous clipping; more track margin remains for F's director review.
- **Opening 60–83:** car and rear wing visible in the moving proof.
- **Low teaching 150–246:** moving Porsche on track, clear editorial title and `OPPOSING RESPONSE` card with FRONT/CAR LEFT vs REAR/CAR RIGHT during a genuine turn; fixes F's previous 97-frame proof gap.
- **Low/match 247–371:** truthful opposing readouts, frame-333 change to high-speed `ALIGNED RESPONSE`, without changing wheel angles; the formerly missing 307–311 bridge is present.
- **High 372–431:** front and rear display aligned direction on real bends; around frame 397 they properly read `CENTRED` while actual wheels are straight rather than faking a turn.
- **Roadside 432–551:** complete Porsche, rear wing and tyres visible in independently sampled video frames at ~0.3 s, 2 s and 3.5 s; grounded on asphalt with moving background/furniture. Car is relatively small within the portrait compared with old crop: F to judge artistic framing. The former 552–566 transition gap is now covered.
- **Exit/end:** real moving car/track in 567–596 and 687–719; final frames end in motion, not a title-card freeze.

**Scope caveat:** these are eleven **short native visual proofs**, *not* a complete 720-frame film or continuous soundtrack check. Unchanged rear macro (84–149) and middle exit stretch (597–686) were not re-rendered on corrected source in this 11-job workflow; previous source MP4s for these ranges are historic only and must not be presented as exact-new-SHA evidence. If Agent F requires additional exact-source moving footage there, it is a further approval request, not a failure of the eleven specified jobs.

## Remaining release gates / prohibited work

1. **Independent Agent F creative and mechanical moving-video review** must issue an actual PASS for the corrected source. Prior F verdict on old source was FAIL; passing native codec and source tests cannot substitute for F visual QA.
2. **Manager** must publish approved exact `render_source_sha` and authorize Agent G after F passes.
3. **Agent G**, not H, may execute the **full 720-frame master render and approved Cedar AAC mux** after clearance.

**Agent H implementation, compilation, 11 native proofs, strict format validation, source provenance and committed evidence inventory: COMPLETE.** No car/model/rig, audio, timeline or final-film render changes made for this delivery.

## Addendum — Agent F review and two final exact-source evidence gaps (8 October 2026)

Agent F's independently published review `yunex/video004/reports/F/H_CORRECTED_37769701749_INDEPENDENT_QA.md` on `sol/y004-f-qa` confirms **visual PASS for all eleven corrected-source MP4s**, particularly the previous opening/roadside framing issues and opposing/aligned steering overlays, while retaining **whole-film PRE-RENDER HOLD** solely pending exact-source native footage for film frames `84–149` and `597–686` (156 unique frames).

Dedicated [H two-job completion workflow 37781451513](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37781451513) started from H workflow commit `6fc0cc329dfb9cebf056f384b5731cf9a9b01756`. Both native jobs are explicitly `actions/checkout` pinned to the immutable film source `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`, not the H report or workflow commit. Render `rear-wheel-macro-84-149` (66 frames) and `active-exit-597-686` (90 frames) **only**, reusing H's approved Remotion renderer, original Porsche asset checksum and strict FFmpeg full-range-to-limited yuv420p TV normalizer. Every job also runs exact-frame validation, full decoder and frame-hash no-duplicates test.

Prior 11/11 source-locked proof artifacts from run 37769701749 remain unchanged and preserved in `native-proof-inventory.json`. The 13 inclusive proposed frame ranges form a complete nonoverlapping coverage of `0–719` (720 frames) **provided both new clips successfully validate**. The inventory records precise new job IDs `113325287977` and `113325287706` and explicitly marks the new clip evidence PENDING until actual MP4 SHA256 and artifacts exist. **No new Agent F PASS, Manager final render approval or completed 720-frame master is claimed by this addendum.**
