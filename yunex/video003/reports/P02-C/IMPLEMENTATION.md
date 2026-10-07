# YUNEX 003 — POLISH-02 — Agent C Implementation

## Scope
Agent C owns the established-circuit-world polish on `sol/y003-p02-track-world`.

## Diagnosis
The Y003 car route runs from track-local Z -60 m to +136 m. The corrected Y002 road, runoff and terrain already span the full approved -140 m to +140 m layout domain, so duplicating or bending the road would be wrong.

The identity loss came from scene dressing coverage instead:
- inherited Y002 guardrails are concentrated around Z -25 m to +35.5 m;
- inherited vegetation/background stations are concentrated around roughly Z -38 m to +37 m;
- therefore much of Y003's 196 m drive retained asphalt/runoff but lost recognizable circuit furniture and depth.

## Production change
Implemented an isolated Y003 world-space extension under `src/video003/track/` and mounted it once beside the existing `TrackWorld`.

The extension adds only outside the established Y002 core:
- continuous guardrail coverage on the approach and long exit;
- restrained catch-fence sections;
- irregular braking/track marker boards;
- deterministic trackside trees, shrubs and distant groundforms;
- world-space placement derived from the authoritative Y002 centerline/barrier/landscape samples;
- deliberate irregular station spacing to avoid cloned repetition.

No second `TrackWorld` is mounted. No shared Y002 production file is modified. Vehicle motion, speed, cameras, Porsche asset, reveal, suspension and airflow are untouched.

## Coverage contract
`coverage.ts` verifies:
- Y003 route: -60 m to +136 m;
- extension envelope: -64 m to +140 m;
- overlap with inherited furniture at both handoff boundaries;
- extension stays inside the approved Y002 sample domain;
- circuit identity station gaps remain <= 18 m;
- station rhythm has multiple distinct spacings rather than one repeated cadence.

## Files
- `yunex/src/video003/track/CircuitWorldExtension.tsx`
- `yunex/src/video003/track/coverage.ts`
- `yunex/src/video003/track/coverage-audit-entry.ts`
- `yunex/src/video003/Video003.tsx`
- `.github/workflows/yunex-003-p02-c-proof.yml`

## Proof gate
The branch proof workflow compiles the Y003 composition, runs the coverage audit, renders native 1080x1920 frames at:
- 27 — hook
- 144 — turn-in
- 234 — technical/reveal
- 603 — whole-car
- 711 — exit

It also renders frames 540-689 as a 5-second moving circuit/parallax proof.


## Moving-proof assembly recovery — PASS

The four rendered proof chunks from source commit `8f9766661482d8e591bd3976a68598873a85906f` were already successful:
- frames 570–599
- frames 600–629
- frames 630–659
- frames 660–689

The original stitch failed only because the stitch runner did not contain `ffmpeg`. No production scene, track geometry, car motion, cameras, suspension, airflow or visuals were changed during recovery.

Assembly was fixed in `.github/workflows/yunex-003-p02-c-moving-chunked.yml` by:
- installing FFmpeg/ffprobe in the assembly job;
- downloading the four successful chunk artifacts from run `37601668282`;
- resetting each chunk's PTS before concat;
- concatenating/re-encoding the proof to H.264 yuv420p;
- requiring a full decoder pass;
- validating exact dimensions, frame rate, frame count and duration.

Validated recovery run:
- workflow run: `37611336398`
- proofed workflow commit: `b779ca131c0c5a92edd051cdc571f7c3e83f07c2`
- artifact ID: `11477632631`
- artifact: `Y003-P02-C-MOVING-VALIDATED-b779ca131c0c5a92edd051cdc571f7c3e83f07c2`
- output: `circuit-parallax-proof-4s-chunked.mp4`
- 270×480 reduced proof
- 30 fps
- exactly 120 decoded frames
- exactly 4.000000 s
- H.264
- yuv420p
- full decoder pass: PASS
- artifact ZIP digest: `sha256:94568077a184e7130b155994328a0ce2b01c207993464a3a86d20d72e49358ba`

Result: required 4–6 second moving circuit/parallax proof is now assembled and validated successfully.
