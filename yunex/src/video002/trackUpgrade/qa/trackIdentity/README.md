# YUNEX 002 — Track Identity QA

Phase: `Y002-RACETRACK-IDENTITY-02`  
Owner: Agent E — Independent Track / Visual QA

This directory contains E-owned QA only. It does not alter A–D environment implementation, the Porsche, cameras, edit, audio or F's render pipeline.

## Baseline / static preflight

Run from a full repository checkout:

```bash
python yunex/src/video002/trackUpgrade/qa/trackIdentity/preflight.py \
  --mode baseline \
  --json-out yunex/video002/racetrack-identity/reports/E/baseline_preflight.json
```

After Manager integrates A–D and publishes an exact `render_source_sha`, run the same checker against that pinned checkout:

```bash
python /path/to/E-tooling/preflight.py \
  --repo-root /path/to/pinned-manager-checkout \
  --mode integrated \
  --expected-source-sha <render_source_sha> \
  --json-out /path/to/reports/E/integrated_preflight.json
```

Integrated mode verifies the locked Porsche hash, 30 fps / 751-frame chronology, TrackWorld root transform, layout geometry invariants, conservative car clearance, cross-section ordering, selected kerbs, quality/seed APIs, deterministic source patterns, course-derived barriers and vegetation exclusion validation.

Static QA is necessary but not sufficient. It cannot prove beauty, visibility, wheel contact or occlusion.

## Native visual evidence

Copy `proof_manifest.template.json` next to the seven native PNGs, fill in the Manager-pinned `source_sha`, and preserve the specified frame numbers.

Then run:

```bash
python yunex/src/video002/trackUpgrade/qa/trackIdentity/validate_visual_proofs.py \
  --manifest yunex/video002/racetrack-identity/reports/E/proof_manifest.json \
  --moving-proof /path/to/short-moving-proof.mp4 \
  --expected-source-sha <render_source_sha> \
  --json-out yunex/video002/racetrack-identity/reports/E/visual_evidence_validation.json
```

Every still must be a true native 1080×1920 frame. The moving proof may be reduced resolution only if `moving_proof_label` explicitly says so. The validator decodes the moving proof and enforces 30 fps.

## Manual visual gate

Agent E must inspect the seven chronological frames and moving proof for:

- connected course direction and distant bend continuity;
- selected apex/exit kerbs rather than continuous decoration;
- runoff separating racing surface from barriers on both sides;
- barriers following the course rather than reading as one roadside rail;
- no broad backing-plane/apron seam or grass intrusion;
- no furniture/foliage occlusion of the Porsche or aero beats;
- convincing wheel contact / grounded shadow;
- unchanged Porsche, typography and camera chronology.

Automated evidence validation does not grant final creative approval. E returns PASS/BLOCKED with specific frame/file findings; Astra retains final creative approval.
