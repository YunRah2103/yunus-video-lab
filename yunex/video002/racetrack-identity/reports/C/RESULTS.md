# Agent C — Runoff / Barriers / Circuit Furniture Results

Phase: Y002-RACETRACK-IDENTITY-02  
Role: C — Runoff / Barriers / Circuit Furniture  
Input: 7ecd296b10f6d1d316544f1eb06a84bf5babedf3  
Branch: sol/y002-track-identity-runoff

## Implemented

- Replaced the legacy fixed-X straight guardrail layout with two guardrail runs sampled directly from A's pinned barrierLeft / barrierRight contract.
- Added standalone Runoff.tsx with paved runoff from road edges to runoff boundaries and gravel shoulders from runoff boundaries to the barrier line.
- Added standalone Terrain.tsx with grass/terrain from barrier lines through the landscape exclusion boundary plus restrained outer terrain extension.
- Added bend-following catch fencing only on the left/outside of the distant bend.
- Kept all tall fencing outside the known opening-camera obstruction corridor (local z 4.1–10.6).
- Preserved quality/seed interfaces and deterministic placement.
- Did not edit TrackWorld; Manager owns mounting/integration of Runoff and Terrain.
- Did not touch the approved Porsche, cameras, edit/audio, RoadSurfaces, kerbs, vegetation or lighting.

## Geometry / contract checks

- Racing surface width inherited from A: 8.6 m.
- Paved runoff starts exactly at A's roadLeft / roadRight boundaries.
- Gravel shoulder terminates exactly at A's barrierLeft / barrierRight boundaries.
- Guardrail panels and posts are generated from the same barrier lines, including the distant bend.
- Near terrain occupies barrier -> landscape exclusion bands, leaving D a clean vegetation/landscape boundary.
- Tall fence begins at local z 12.5, after the opening obstruction corridor ends at z 10.6.
- Final-quality furniture count is bounded and instanced: 90 guardrail panels, 90 posts and 180 bolt instances across both sides, plus restrained outside-bend catch fencing.

## Proof evidence

- proof-cross-section.svg — deterministic cross-section showing surface -> runoff -> shoulder -> barrier -> terrain hierarchy.
- proof-bend-context.svg — deterministic plan-view proof showing barriers/runoff following the distant bend instead of staying as a straight roadside rail.
- proof-opening-clearance.svg — deterministic corridor proof showing tall fencing begins beyond the opening-camera exclusion zone.
- metrics.json — numeric contract and placement evidence.

These SVGs are deterministic geometry/contract proofs, not native beauty renders. Native rear-quarter / side-motion / wide camera stills require Manager to mount Runoff and Terrain in TrackWorld, which is outside C's owned files. C does not claim those native stills were rendered independently.

## Integration notes

Manager should mount Runoff and Terrain inside the existing YUNEX 002 track root alongside RoadSurfaces and TrackFurniture. Do not apply an additional root transform. D should keep authored vegetation beyond the landscape exclusion line rather than re-entering the runoff/barrier band.
