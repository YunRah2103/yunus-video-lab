# YUNEX 003 — POLISH-02 — Agent G preparation report

Phase: Y003-POLISH-02  
Role: G — Native render / delivery  
Work branch: sol/y003-p02-render  
Specialist base: 064fc7687ad16e9fc99c32c3c323154b7e4496f1

## Status

PREPARATION COMPLETE / FINAL NATIVE RENDER BLOCKED BY MANAGER SOURCE GATE.

The authoritative Manager registry at `sol/y003-suspension-manager:yunex/video003/polish02/POLISH_02_TASKS.json` still has `render_source_sha: null`. The G handoff explicitly forbids launching the expensive final render until Manager publishes the exact approved POLISH-02 source SHA after integrated moving-proof review.

No stale Y003 visual chunks have been reused and no unauthorized production/composition file has been edited.

## Implemented on the POLISH-02 render branch

- Reset `yunex/video003/render/request.json` to phase `Y003-POLISH-02`.
- Locked the request to 735 frames, 30 fps, 24.5 s delivery intent and the seven established comparison milestones: 27, 144, 234, 306, 492, 603, 711.
- Cleared the old Y003 render source SHA so benchmark/full mode cannot accidentally render the pre-polish film.
- Added `.github/workflows/yunex-003-p02-render.yml`, scoped to `sol/y003-p02-render`.
- Added exact 40-character manager source-SHA gating for benchmark/full modes.
- Added exact source checkout verification and locked Porsche model SHA256 verification before render.
- Added deterministic 735-frame chunk matrix coverage with 20-frame default chunks and a final 720–734 chunk.
- Preserved source provenance per chunk and rejects source mismatches, gaps, overlaps, wrong dimensions, wrong FPS, wrong codec and wrong decoded frame count.
- Corrected the inherited chunk validation assumption: proven native Y003 chunks may be `yuvj420p` even when `yuv420p` is requested.
- The P02 workflow accepts `yuv420p`/`yuvj420p` only for intermediate chunks, then performs exactly one final H.264 normalization encode to delivery `yuv420p`.
- Renders composition audio once from the same exact source SHA, then muxes it without retiming.
- Enforces full final decoder pass, exact 735 decoded frames, 1080x1920, 30 fps, H.264 `yuv420p`, AAC and faststart.
- Produces final SHA256, source/model provenance, validation JSON, seven native milestone frames and a contact sheet in the delivery artifact.

## Why the normalization encode is deliberate

The previous successful Y003 native rescue established that representative source chunks were H.264 `yuvj420p`; a stream-copy-only final could not satisfy the required `yuv420p` delivery contract. POLISH-02 therefore performs one controlled normalization encode after concatenating the exact fresh source chunks and before the final audio mux.

This is the single normalization encode permitted by the G handoff.

## Release commands / workflow behavior

Pushes to this branch run the lightweight P02 self-test path by default.

After Manager publishes the exact `render_source_sha`:

1. Put that SHA into `yunex/video003/render/request.json`.
2. Commit with `[p02-native-benchmark]` to run the exact-source 30-frame benchmark.
3. Review benchmark decode/probe output.
4. Commit with `[p02-native-full]` to render all 735 fresh frames from that same SHA.
5. Record workflow run ID, artifact ID/name, final SHA256, validation, milestone frames and the exact render source SHA here.

A workflow-dispatch path also accepts `selftest`, `benchmark` or `full`, but benchmark/full still require the exact 40-character source pin.

## Current dependency state

At the latest check, Manager has not integrated/released POLISH-02 and has not published a render source SHA. Some specialist branches have already moved, while other upstream roles remain in progress. Agent G must not invent or infer the final render source.

## Final render result

Pending Manager release. This section must not be marked PASS until an exact-source native artifact has actually completed and validated.
