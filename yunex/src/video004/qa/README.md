# YUNEX 004 — F independent QA tools

**Only Agent F owns this folder.** No Y003/source GLB or shared Manager files are edited here.
This folder does **not** claim independent creative approval; automated checks, moving
visual acceptance, and full audiovisual playback are separate decisions.

## Local fixture regression suites (no project dependencies)
Run from repo root or `yunex` with:
```sh
cd yunex
node --test src/video004/qa/*.test.mjs
```
45 failure-injection tests cover source/sampler states, low/high sign, rear cap and
toe, road-ground contact, wheel-distance spin, out-of-order determinism, guide
anchors and true yaw, per-clip source provenance, full MP4 decoder/codec/frame
constraints, missing chunks, audio peak and faststart. Fixtures are synthetic;
these are NOT production-source or native-film PASS certificates.

## Integration-stage exhaustive source-frame audit
Only after accepted Agent A is integrated and Manager locks duration:
```sh
cd yunex
npx tsx src/video004/qa/auditLive.ts \
  --source FULL_INTEGRATED_REMOTE_SHA --frames LOCKED_FRAME_COUNT \
  --out /tmp/y004-f-drive-qa.json
```
This imports the actual A `y004MotionAtFrame`, checks all global frames and
out-of-order repeated samples, world asphalt height, segment travel, two
steering regimes, illustrated 1-degree rear cap, and spin/contact consistency.
If A is not available the script returns BLOCKED and exits nonzero. This does
not inspect actual P03-GLB rim normal/precession, caliper hierarchy or footage:
B native rig proofs and F human moving review are still mandatory.

## Pre-render native proof manifest
Import `auditPreRenderProofs` and `auditIndependentVisualReview` from
`proofGate.mjs`. The five required types are:
`low-driving` (A), `high-driving` (A), `rear-macro` (B),
`matched-muted` (C), `integrated-short` (Manager).

Each manifest entry includes:
```json
{
  "kind": "low-driving",
  "role": "A",
  "sourceSha": "40-hex-full-accepted-remote-source",
  "mediaType": "native-moving-mp4",
  "artifactId": "actual-persisted-artifact-id",
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "firstFrame": 150,
  "lastFrameExclusive": 270,
  "sha256": "64-hex-real-media-sha256"
}
```
Provide `accepted = {A: fullSha, B: fullSha, C: fullSha,
Manager: fullIntegratedSha}`. Do not substitute role branch names or
unaccepted SHAs. A proof manifest is **only provenance**; independent
F frame-referenced viewing and muted consecutive modes must pass separately.

## E final native media audit
After Manager publishes immutable render source and E a real final master:
```sh
node yunex/src/video004/qa/verifyMedia.mjs \
  --file /path/to/YUNEX004_FINAL.mp4 \
  --frames LOCKED_FRAME_COUNT \
  --render-source FULL_RENDER_SOURCE_SHA \
  --approved-source SAME_MANAGER_LOCKED_SHA \
  --chunks /path/to/chunks.json \
  --artifact-id REAL_ARTIFACT_ID \
  --out /tmp/y004-f-final-metadata.json
```
Run from repo root. The alternate `--direct-render REAL_ARTIFACT_ID`
is allowed for a one-pass master and still creates one full-coverage interval.
`chunks.json` is an array of
`{startFrame,endFrameExclusive,sourceSha,artifactId}`; all ranges are
half-open [start,end), consecutive and exact-source.

Requires local `ffprobe`, `ffmpeg` and Node. Performs actual counted-frame
probe, per-packet 30fps PTS continuity, strict H.264 yuv420p 1080x1920,
AAC 48k stereo, atom-order faststart, complete video/audio decoder pass,
measured audio sample peak, hash and exact chunk coverage. Writes machine-
readable output. Pass means *automated media constraints only*.

## Human review gate — NEVER SKIP
After clips exist, F must play real A/B/C/Manager clips and complete E final with
sound and muted at normal speed; inspect low/high signs, road parallax,
wheel spinning/precession, hub/caliper, local arch clearance, guide accuracy,
focus, typography safe areas, and all moving cuts. Record clip artifact/source
SHA and exact offending frame for every blocker. If playback fails or is not
performed, report **BLOCKED / NOT REVIEWED**, not visual PASS.

Production-side changes must go back to the owning agent or Manager. F modifies
only its own `qa/**` and `reports/F/**` files.
