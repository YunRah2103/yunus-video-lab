# YUNEX 003 — POLISH-02 — Agent G render/delivery report

Phase: Y003-POLISH-02  
Role: G — Native render / delivery  
Work branch: sol/y003-p02-render  
Specialist base used only for pre-release benchmark: 064fc7687ad16e9fc99c32c3c323154b7e4496f1

## Current gate

PREPARATION COMPLETE. FINAL 735-FRAME RENDER IS CORRECTLY BLOCKED BY THE MANAGER SOURCE GATE.

At the latest verification, `sol/y003-suspension-manager:yunex/video003/polish02/POLISH_02_TASKS.json` still has:

- `render_source_sha: null`
- `final_delivery_sha: null`
- G status `prepare_only_until_source_pin`

The G handoff explicitly forbids the expensive final render before Manager publishes the exact approved POLISH-02 source SHA after integrated moving-proof review. No final source has been guessed or inferred and no stale pre-polish chunk has been reused.

## Implemented

- Added a dedicated `YUNEX 003 P02 native visual` GitHub Actions workflow on `sol/y003-p02-render`.
- Locked phase, 1080x1920, scale 1, 30 fps, 735 frames / 24.5 s and the Porsche model SHA256.
- Full/benchmark modes require an exact 40-character source SHA.
- Default branch state deliberately has a blank source pin so a stale full render cannot be started accidentally.
- Uses the proven `YUNEX-003-VISUAL` composition for clean-runner native rendering.
- Generates deterministic 20-frame chunks with exact 0–734 coverage (37 chunks; final chunk 720–734).
- Checks per-chunk source provenance, frame range, decoded count, dimensions, FPS and H.264 codec.
- Accepts only `yuv420p` / `yuvj420p` intermediate chunks because the earlier approved native Y003 run proved Chromium can output `yuvj420p`.
- Concatenates fresh exact-source chunks, then performs one permitted normalization encode to delivery `yuv420p`.
- Performs a full decoder pass and exact 735-frame validation.
- Extracts deterministic milestones 27, 144, 234, 306, 492, 603 and 711 plus a contact sheet.
- Emits source/model/visual SHA provenance in the native visual artifact.
- Hardened `validate_export.py` so final-audio validation also requires AAC, 48 kHz and stereo.
- Added `approved-audio-lock.json` and `mux-approved-audio.sh` to preserve the already-approved audio without regeneration or retiming.

## Approved audio lock

The already-approved master in ChatGPT Library was inspected directly:

`/Video Projects/YUNEX 003/Manager/YUNEX_003_MASTER_REVIEW.mp4`  
Library ID: `libfile_d017354ae8608191ab5b281b19a65db2`

Its audio stream was copy-extracted locally and verified as:

- AAC
- 48,000 Hz
- stereo
- exactly 24.500 s
- extracted AAC SHA256: `cd411b0dcc9e733f5b142e59f8340f913816e28bf113a32639c4fd12f7ec04c3`

The mux helper refuses any different audio SHA and copy-muxes this locked stream onto the validated revised native visual with `+faststart`. The narration is therefore not trimmed, stretched, regenerated, normalized or remixed.

## Benchmark findings

Initial benchmark run: `37598721617`

- config: PASS
- selftest: PASS
- exact source checkout/model hash: PASS
- benchmark: FAIL for a diagnosed pipeline reason
- full render jobs: correctly SKIPPED

Failure cause: the initial P02 workflow attempted `YUNEX-003-FINAL` on a clean runner. That composition references `public/y003-narration.mp3` and `public/y003-sfx.wav`, but those binaries are intentionally not committed to the repository. Remotion failed on a 404 for `y003-narration.mp3`.

Fix: the native pipeline now renders `YUNEX-003-VISUAL` exactly as the proven previous Y003 native workflow did, then locks/muxes the approved AAC separately.

Corrected visual-only benchmark run: `37600199512`  
Trigger source: `064fc7687ad16e9fc99c32c3c323154b7e4496f1`  
Scope: pre-release smoke only; never treated as the final POLISH-02 source.  
The source pin was immediately cleared from the branch after triggering.

A separate source-cleared self-test run `37600009621` completed PASS after the corrected visual/audio-lock architecture was installed.

## Final release procedure

Only after Manager publishes the exact approved `render_source_sha`:

1. Set that exact SHA in `yunex/video003/render/request.json`.
2. Run `[p02-native-benchmark]` against that same SHA.
3. If the benchmark passes, run `[p02-native-full]`.
4. Download `YUNEX-003-P02-NATIVE-VISUAL-<source-sha>`.
5. Obtain/copy-extract the locked AAC specified by `approved-audio-lock.json`.
6. Run:
   `bash yunex/video003/render/mux-approved-audio.sh YUNEX_003_P02_NATIVE_VISUAL.mp4 YUNEX_003_APPROVED_AUDIO.m4a YUNEX_003_P02_FINAL.mp4`
7. Validate final 735 frames, H.264 yuv420p, AAC 48 kHz stereo, 24.5 s, decoder integrity, model hash, source provenance and milestone frames.
8. Record final workflow/artifact IDs and SHA256 here for H independent QA.

## Final native result

Not launched because Manager has not released an exact POLISH-02 `render_source_sha`. Launching it now would violate the authoritative dependency gate.
