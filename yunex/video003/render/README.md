# YUNEX 003 — POLISH-02 native render / delivery

Owned by Agent G. This branch is source-SHA gated and does not modify the approved film composition.

## Locked delivery contract

- Native visual composition: `YUNEX-003-VISUAL`
- Final delivery: validated native visual + locked approved AAC
- 1080x1920, scale 1, 30 fps
- exactly 735 decoded frames / 24.5 s
- H.264 `yuv420p`
- AAC stereo 48 kHz with narration/mix timing unchanged
- `+faststart`
- Porsche model SHA256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`
- approved audio SHA256: `cd411b0dcc9e733f5b142e59f8340f913816e28bf113a32639c4fd12f7ec04c3`

## Why native rendering is visual-only

The repository intentionally does not contain `public/y003-narration.mp3` or `public/y003-sfx.wav`, so rendering `YUNEX-003-FINAL` on a clean Actions runner fails with 404s. The proven Y003 production path renders `YUNEX-003-VISUAL` natively and muxes the already-approved audio afterward.

POLISH-02 preserves that audio bit-for-bit. `approved-audio-lock.json` records provenance and `mux-approved-audio.sh` refuses any audio whose SHA differs from the approved extract.

The locked AAC was stream-copied from the approved master `/Video Projects/YUNEX 003/Manager/YUNEX_003_MASTER_REVIEW.mp4`; it probes as AAC stereo 48 kHz, exactly 24.500 s. No trim, stretch, regeneration, normalization or remix is allowed.

## Source gate

The expensive final render must not start until Manager publishes one exact approved POLISH-02 `render_source_sha` after integrated moving-proof review. `request.json` remains source-blank outside an explicitly labelled benchmark until that release.

Every chunk is rendered from that exact SHA and has a matching provenance file. A different source SHA invalidates every old chunk.

## Proven chunk behavior

Earlier successful Y003 native rendering established that Chromium may emit intermediate H.264 chunks as `yuvj420p` even when `yuv420p` is requested.

The P02 pipeline therefore:
1. checks exact source provenance, contiguous coverage, 1080x1920, 30 fps, H.264 and decoded frame count;
2. permits only `yuv420p` or `yuvj420p` for intermediate chunks;
3. concatenates all 37 fresh chunks;
4. performs one permitted normalization encode to final `yuv420p`;
5. validates the complete 735-frame native visual and extracts seven milestones;
6. copy-muxes only the locked approved AAC using `mux-approved-audio.sh`;
7. decoder-checks the final MP4 and preserves faststart.

## Triggering

Pushes to `sol/y003-p02-render` run self-tests by default.

After Manager release:
1. set the exact source SHA in `request.json`;
2. push `[p02-native-benchmark]` and verify the 30-frame visual-only benchmark;
3. push `[p02-native-full]` only after benchmark success;
4. download the validated native visual artifact;
5. obtain/extract the locked AAC described by `approved-audio-lock.json`;
6. run `mux-approved-audio.sh native-visual.mp4 approved-audio.m4a final.mp4`;
7. record source SHA, workflow/artifact IDs, final SHA256 and validation in the P02-G report.

Milestones: 27, 144, 234, 306, 492, 603, 711.
