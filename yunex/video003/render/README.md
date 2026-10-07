# YUNEX 003 — POLISH-02 native render pipeline

Owned by Agent G. This branch is the render/delivery implementation for `Y003-POLISH-02` and is intentionally source-SHA gated.

## Locked delivery contract

- Composition: `YUNEX-003-FINAL`
- 1080x1920, scale 1
- 30 fps
- exactly 735 decoded frames / 24.5 s
- H.264 delivery video
- final pixel format `yuv420p`
- AAC audio with the supplied narration/mix timing unchanged
- `+faststart`
- locked Porsche SHA256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

## Source gate

The expensive benchmark/full jobs must not run until the Manager publishes one exact approved POLISH-02 `render_source_sha` after integrated moving-proof review. The request remains blank until that release.

Every render chunk is checked out from the exact pinned source SHA and carries a matching provenance file. A source change invalidates all chunks for the old SHA.

## Proven chunk behavior

The earlier successful Y003 native run established that Remotion/Chromium can emit intermediate H.264 chunks as `yuvj420p` even when `yuv420p` is requested. That is accepted only as an intermediate format.

The POLISH-02 workflow:
1. validates every chunk for exact source, contiguous frame coverage, H.264, 1080x1920, 30 fps and decoded frame count;
2. permits intermediate `yuv420p` or `yuvj420p`;
3. concatenates the exact fresh chunks;
4. performs one deterministic final visual normalization encode to H.264 `yuv420p`;
5. muxes the composition AAC audio once with `+faststart`;
6. performs a full decoder pass and exact 735-frame final validation.

No stale chunk from the previous Y003 source may be reused.

## Triggering

`.github/workflows/yunex-003-p02-render.yml` runs lightweight self-tests on changes to this branch.

After Manager release:
1. set the exact 40-character source SHA in `request.json`;
2. push a commit containing `[p02-native-benchmark]`;
3. inspect the benchmark decode/probe;
4. push a commit containing `[p02-native-full]`;
5. retain the GitHub Actions artifact/run IDs, final SHA256, validation JSON, source provenance and seven milestone frames.

The seven comparison milestones are frames 27, 144, 234, 306, 492, 603 and 711.
