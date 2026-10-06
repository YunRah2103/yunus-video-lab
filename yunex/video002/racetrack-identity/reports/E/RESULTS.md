# Agent E — Independent Track / Visual QA Results

Phase: **Y002-RACETRACK-IDENTITY-02**  
Role: **E — Independent Track / Visual QA**  
Branch: **sol/y002-track-identity-qa**

## Current verdict

**BASELINE / PREFLIGHT: READY**  
**FINAL INTEGRATED VISUAL QA: BLOCKED ON MANAGER PIN**

The QA implementation is complete for the current registry state. `TASKS.json` still has `render_source_sha: null`, so a final PASS would be false until Manager integrates A–D, pins the exact source SHA, and F/E receive the native proof package.

## Implemented QA

- Added a repeatable baseline/integrated preflight that validates:
  - locked Porsche SHA256;
  - 30 fps / 751-frame / 25.02 s chronology;
  - locked camera timing;
  - TrackWorld root transform;
  - racetrack layout sampling, width, straight corridor and bend restraint;
  - conservative Porsche footprint edge clearance;
  - road → runoff → barrier → landscape ordering;
  - selected apex/exit kerb intent;
  - quality/seed component APIs;
  - no direct `Math.random()` in integrated track identity components;
  - course-derived runoff/barrier geometry;
  - opening-camera catch-fence exclusion;
  - seeded vegetation landscape/camera exclusion validation.
- Added a seven-beat native proof validator.
- Added an explicit manual visual gate for continuity, occlusion, seams, wheel contact and premium track readability.
- Added a proof manifest template with fixed chronological frames:
  - 18 hook
  - 114 isolate
  - 210 high-downforce
  - 336 DRS
  - 456 airbrake
  - 600 whole-car
  - 705 payoff

## Baseline audit

The old environment contains the exact identity problems this phase is meant to replace:

1. **HIGH — all frames / RoadSurfaces.tsx**  
   Baseline racing surface is a single rectangular `PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH)`, so it cannot establish connected circuit direction or a bend.

2. **HIGH — all frames / TrackFurniture.tsx**  
   Baseline guardrail is fixed at `RAIL_X=-3.62` rather than following course-relative barrier lines. This reads as a roadside rail.

3. **MEDIUM — inspect all native beats / TrackWorld.tsx**  
   Legacy wide TechnicalTrackWorld backing plane is intentionally retained below the authored track. Integrated visual QA must reject any visible broad apron/backing seam.

4. **MEDIUM — wide/hero views / DistantLandscape.tsx**  
   Baseline large world-space grass planes and enclosing foliage are not driven by the new course-relative landscape exclusion contract.

## Independent layout-contract verification

The pinned A layout contract at `7ecd296b10f6d1d316544f1eb06a84bf5babedf3` was independently recomputed from its published geometry:

- road width: **8.6 m**
- samples: **161**
- minimum conservative locked-car road-edge clearance: **3.125 m**
- maximum distant-bend heading: **9.404242°**
- straight-corridor centre drift: **0 m**

These pass the static geometric acceptance thresholds.

## Remaining gate

Final Agent E PASS requires all of the following from one Manager-pinned `render_source_sha`:

- integrated static preflight PASS;
- seven true native 1080×1920 beat frames;
- short 30 fps moving proof that fully decodes and is correctly labelled if reduced resolution;
- human inspection showing connected racetrack identity, correctly ordered runoff/barriers, no broad apron seam, no grass intrusion, no Porsche/aero occlusion and convincing grounded contact.

Astra retains final creative approval.
