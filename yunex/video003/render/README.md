# YUNEX 003 — native render pipeline

Owned by Agent G. This pipeline is intentionally source-SHA gated.

## Safety
- Final composition: `YUNEX-003-FINAL`.
- Native output: 1080x1920, scale 1, 30fps, H264 yuv420p + AAC, faststart.
- Locked Porsche SHA256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- Full rendering must not start until Manager publishes `render_source_sha` after H accepts integrated moving proofs.
- Every chunk is rendered from one exact source SHA and carries an individual provenance file.
- Chunk validator rejects gaps, overlaps, source mismatches, wrong frame counts, wrong size/fps/codec/pixel format.
- Final validator performs a full decoder pass and exact decoded-frame validation.

## Trigger
The branch workflow always runs lightweight self-tests when this pipeline changes.

After Manager release, update `request.json` with the exact full source SHA and actual composition frame count.
Push a commit containing `[native-benchmark]` to run a short native source benchmark.
After that passes, push a commit containing `[native-full]` to render all native chunks, render the composition audio once, assemble/mux once, decode the complete export, extract seven native milestone frames and produce the delivery artifact.

Do not reuse a chunk from another source/config. A new Manager source SHA requires a fresh provenance set.
