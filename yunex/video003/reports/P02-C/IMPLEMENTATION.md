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

Workflow result and artifact provenance will be appended after the branch run completes.
