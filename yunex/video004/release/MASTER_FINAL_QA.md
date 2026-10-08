# YUNEX 004 — Master dual release, 2026-10-08

## Delivered immutable source

- Release branch: `sol/y004-master-dual-release`.
- BOTH video source SHA: `add9f7ce275e9b2290d49984cd54c670c219da56`.
- Cinematic composition: `YUNEX-004-CINEMATIC`; Dynamic: `YUNEX-004-DYNAMIC`.
- Approved native visual source: `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`.
- Manager record inspected at `5816754eea79106b22bd2da23a6b1b97dfcf9fad`.
- Exact audio publication commit: `52bdebc520ea227a738a36e93a292fe234453a73`.
- This evidence-only commit does not change or supersede the immutable rendering source.
- Existing Porsche, rig, physics, track, cameras, native teaching sequence retained. The GitHub source-equivalence gate verified original approved visual modules unchanged.

## Actual delivered files

| File | SHA256 | Bytes |
| --- | --- | --- |
| YUNEX_004_CINEMATIC.mp4 | 2f96ca6290ae170e77a395de7716aba0aeefe23c5213cda76bd58797db39e919 | 86176572 |
| YUNEX_004_DYNAMIC.mp4 | 4f6ca7e12abf3cc5a4391afc6e931ba00ce55335dbeab984514eff0c55a800a3 | 92265862 |

Both: 1080 × 1920; 30 fps CFR; exactly 720 video frames and 24.000 seconds; H.264 true limited-range yuv420p; AAC 48 kHz stereo; moov before mdat (faststart). Files were downloaded from the successful GitHub artifact and independently checked locally. These are actual MP4s, not only render reports.

## Workflow and provenance

Successful workflow [37805416011](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37805416011), job 113408279787, source add9f7ce275e9b2290d49984cd54c670c219da56.
Artifact [11562627554](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37805416011/artifacts/11562627554), name YUNEX-004-CINEMATIC-DYNAMIC-FINAL.
Artifact ZIP digest sha256:90e0d81ee3739b38f7761a8c8a86120b5611f1296a78a97e4ee11a9b94d43bc7; expires 2026-11-07. Permanent copies also delivered to the user's ChatGPT files.

Reused E's complete validated 13 native H clips, retaining their individual checksums, source IDs and inclusive ranges. Their 720 frames cover 0–719 exactly once. Cinematic is a video stream-copy assembly; Dynamic is a CRF16 slow H.264 finishing encode. No second Porsche geometry render. Workflow downloads exact artifact IDs and runs the existing E tests and deterministic release finishing script.

Approved Cedar audio was retrieved as exact original binary and published through GitHub's base64 blob API, not regenerated. Canonical path: yunex/video004/audio/y004-approved-cedar-24s.m4a.
Audio SHA256 a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51, 753974 bytes. Actual remote blob was fetched and hashed before finishing. AAC packet data, PTS and duration exactly match approved source in BOTH delivered files. No voice replacement, cuts or speed changes.

## Intentional edit differences

Cinematic retains the approved compositions and typography.

Dynamic uses 10% closer opening framing and approximately 14% closer roadside framing, applied at existing shot boundaries. Rear-wheel macro and both steering demonstrations retain their approved framing. Thin green title accents and a subtle final identity underline provide a second finishing treatment. No invented wheel-angle changes. Substantive opening/roadside image differences were inspected at phone size, not inferred only from reencoding differences.

All 720 decoded A/B frame hashes differ; this includes encoding differences, so that count alone is not the creative evidence. Matched phone-size frames show substantial optical differences at frame 30 and 497 (mean pixel differences approximately 24 and 19 on the local equivalent finish). Recommend Cinematic first: it is closest to the approved balanced teaching edit; Dynamic is the closer alternative.

## Actual verification

- GitHub gates: original visual source equivalence, GLB identity, exact audio hash, native clip source/checksums/ranges/full decoding: PASS.
- Existing E pipeline unit tests: 4/4 PASS; unchanged.
- Both CI files: complete video/audio decoder validation PASS; exactly 720 frames; required codecs, dimensions, durations, fps, pixel format and faststart PASS.
- Independent checks AFTER downloading the final artifact: full video/audio decode PASS, 720 timestamps matching n/30 within 0.00001 seconds, no adjacent duplicated decoded frames, exact approved audio packet preservation, file checksums PASS.
- Approved decoded audio peak -8.035127 dBFS, no NaNs or clipping found.
- Remotion webpack bundle builds successfully. Both release compositions remain editable with cached native plates or the original live Three.js source. Reproduction and plate staging described in release/README.md.
- No source or tests weakened; no new Agent F certification invented. Existing F independent silent PASS and J no-major-blocker report were inspected. This combined finish is authorized directly by the user's final director instruction.

## Director inspection and corrections

Reviewed both chronological contact sheets, key shots at 393 × 699 phone size, every rear-wheel macro frame, and exact shot-seam frames. Reviewed the actual downloaded CI Dynamic sheet as well; Cinematic is byte-identical to the locally inspected file.

Opening, macro, opposing/low-speed demonstration, aligned/high-speed demonstration, roadside motion and active exit are present. No new blocking optical defect found in the reviewed evidence. Wheels remain concentric, tyre contact and shadows stay grounded in inspected frames; macro caliper shows no apparent wheel-following rotation. Straight segments correctly display centred steering rather than false continuous steer. Opposing and aligned labels match their demonstration segments. VO timing retains the approved lower-speed passage through 10.613 s, higher-speed passage at 11.608–14.232 s, stability passage at 14.979–17.866 s and final sentence at 18.858–22.577 s.

Targeted fixes during finishing: corrected resized-segment sample-aspect-ratio mismatch with setsar=1 before concat; completed the exact audio binary publication; improved Dynamic opening/roadside visual emphasis without changing mechanics. No geometry rebuild or replacement footage.

## Honest limitations and future refinements

No uninterrupted normal-speed sound-on or muted playback was available. This is full machine decoding plus frame-based optical/timing review, not a claim to have watched and listened continuously. Chromium download failed through this environment's proxy; it did not block the proven native-plate finishing workflow. Final files passed independent decoder checks regardless.

Caliper review is optical, not a new geometric certification. The existing approved stylized track and original final chase framing are retained. Sound bed remains the approved mix. Further user refinements should start from the immutable source above, preserve the two named compositions, and rerun only finishing when geometry is unaffected.
