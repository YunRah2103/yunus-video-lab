# YUNEX 003 POLISH-02 G — Final packaging report

The earlier preparation/source gate is superseded by validated exact-source visual rescue run 37625560242 / artifact 11483379220.

# YUNEX 003 POLISH-02 final release QA
Reviewed directly by the release operator; no new agent or production edits.

## Result
Delivery-spec and frame-based visual QA: PASS.
Complete real-time audiovisual/creative approval: PENDING (not performed in this environment). Do not represent this as full H final approval or mark the whole project complete until that gate passes.

## Evidence and scope
Both actual final MP4s were fully decoded. 735 frames, 1080x1920, 30/1 fps, 24.500 s, H.264 yuv420p, AAC 48000 Hz stereo and moov-before-mdat faststart all pass.
Seven milestones 27, 144, 234, 306, 492, 603, 711 reviewed; chronological samples every fifth frame across the complete duration and -1/0/+1 around all 36 original 20-frame chunk boundaries reviewed.
No boundary discontinuity, new exterior/livery change, lost technical reveal or dead static outro found in these samples.
Front wheel rim stays coherent; rotating spokes change around a stable hub in reviewed sequences. No obvious wobble, clipping or tyre-contact regression observed in samples; this does not substitute for full-rate motion playback.
Connected spring/damper, links, pivots and chassis attachments remain visible through the transparent reveal. Restrained airflow and explanatory labels remain intact.
Established circuit vegetation, fencing, barriers, asphalt and gantry persist through driving/reveal/exit. Parallax and pass/exit progression are visible in chronological frames. Existing scenery remains stylized; no environment redesign was introduced.
Peak decoded audio -5.196783 dBFS, no NaNs/Infs. Approved narration/SFX are preserved packet-for-packet; no new auditory mix evaluation claimed.

## Integrity
Native visual and final A/B video elementary stream SHA256:
e11d6eca00238756879acc35ff3f96bafec62b14d6fc1d88b19e4ee545e00d08
Approved source master and final A/B AAC elementary stream SHA256:
8182da3f2e106540e805501ac6eeff496e149aaf3f2cefd73fab6c41d49c720e
Locked approved-audio M4A SHA256 remains cd411b0dcc9e733f5b142e59f8340f913816e28bf113a32639c4fd12f7ec04c3.
FFmpeg 6 extraction produced different container metadata. FFmpeg 7.0.2 copy extraction with the original Lavf61.7.103 encoder-tag atom recovered the exact locked file hash; AAC bytes were untouched. G hash guard was not relaxed.
Porsche provenance remains model SHA256 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb from exact source 0db1a6509c54b6df1df0422152aa90d7c02b5de1. Source/model/3D scene were not edited or rerendered.
A/B are visually and audibly identical; B only adds container title metadata. No crop, grading, visual re-encode, narration change or timing change.

Exact delivery hashes, run/artifact identifiers and evidence hashes accompany RELEASE_METADATA.json.

## Published delivery
Packaging workflow/run: [37659623261](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37659623261), successful packaging commit `0ede48a4aeefc0a854a07df927bce45a05456a47`.
Final artifact: `11499343998` — YUNEX-003-P02-FINAL-DUAL-TIKTOK (90-day retention, expires 2027-01-05).
A SHA256: `cc8a898298fc6c543f5475aac85bafb0cca635f1d1de1f663e97b21453116118`
B SHA256: `cd99beb0d7a004266857d508066050d5824aa0a6c30ad8d92b2d887f4660acd9`
ZIP SHA256: `05d42153b822b1cd00b5abb9ac05813e2f269f8b6c81d2aee4b41f97f9744cd6`
Packaging source is G pipeline commit, distinct from the unchanged integration/render source.
