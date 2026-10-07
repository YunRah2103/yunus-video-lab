# YUNEX 003 — POLISH 02 — Agent H final QA

This directory is owned by Agent H and is intentionally independent of production source.

## Gate

Agent H may prepare tooling before release, but may not issue a final PASS until both exist:

1. Manager-pinned `render_source_sha`.
2. Agent G's completed native final artifact rendered from that exact SHA.

A missing dependency is `BLOCKED`, not PASS and not a reason to modify production code.

## Technical verifier

Run:

```bash
python3 yunex/video003/qa/polish02/final/verify_final.py \
  /path/to/YUNEX-003-POLISH-02.mp4 \
  --source-sha <40-char-manager-render-source-sha> \
  --model /path/to/approved-porsche.glb \
  --json-out yunex/video003/qa/polish02/final/final-technical-result.json
```

The verifier performs a full ffmpeg decode, checks 1080x1920 / 30 fps / exactly 735 decoded frames / H.264 / yuv420p / AAC / approximately 24.5 s / MP4 faststart, optionally verifies the locked Porsche SHA-256, and extracts the seven deterministic milestone frames.

The seven milestones remain tied to the established YUNEX 003 timeline:

- hook — frame 27
- turn-in — frame 144
- reveal — frame 234
- profile — frame 306
- braking/load — frame 492
- whole-car — frame 603
- exit — frame 711

The script intentionally never returns an automatic visual PASS. Exit code 1 means technical FAIL; exit code 3 means technically reviewable but still BLOCKED on human visual review. Agent H must inspect the actual native movie and milestones.

## Mandatory visual review

The final verdict must explicitly cover all of the following against the exact rendered movie:

- Porsche visibly drives naturally.
- Wheel wobble is gone and all four wheels spin/steer plausibly.
- No wheel clipping, false contact or caliper-spin regression.
- Suspension is visibly richer, connected and credible as a reference-informed illustration.
- Double-wishbone and aero explanation still read clearly.
- Circuit identity persists through hook, turn-in, reveal, whole-car and exit.
- Track-relative parallax is believable.
- No scenery occlusion or obvious repetition regression.
- Approved white/green Porsche exterior and livery remain unchanged.
- Airflow clears the revised mechanical geometry.
- Typography, cameras, story and supplied VO remain intact.
- Active moving exit remains present.
- No visible chunk seams.

Technical metadata can fail the delivery, but technical metadata alone cannot pass the visual film.
