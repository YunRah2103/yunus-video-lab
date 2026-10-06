# Agent B — Racing Surface / Kerbs

Phase: Y002-RACETRACK-IDENTITY-02  
Role: B — Racing Surface / Kerbs  
Input layout contract: 7ecd296b10f6d1d316544f1eb06a84bf5babedf3  
Branch: sol/y002-track-identity-surface

## Implementation
- Replaced the old disconnected rectangular asphalt/apron presentation with a continuous ribbon built directly from A's 161-sample racetrack contract.
- Added restrained white edge paint on both sides with no centre divider.
- Added a subtle deterministic racing-line wear ribbon through the bend.
- Added selected red/ivory kerbs only where A marks the right-side apex and left-side exit as eligible.
- Removed B-rendered rectangular verge/gravel ownership so C can build runoff and barriers from the same road edges without overlap.
- Preserved the existing RoadSurfaces quality/seed API and TrackWorld root-transform contract.
- Added runtime layout-contract validation before the B surface renders.

## Geometry / clearance
A's pinned contract reports 8.6 m road width and 3.125 m minimum locked-Porsche footprint edge clearance. B does not alter the centreline, camera, car trajectory or root transform. Kerbs sit outside the racing edge, rise 34 mm above asphalt and therefore remain far outside the locked tyre corridor.

## Validation status
The implementation is structurally deterministic and constrained to B-owned files. Native beauty stills and the camera-motion aliasing proof still require the coordinated render queue; no full-film render was started from this specialist branch. Do not label debug/layout projections as native beauty renders.

## Integration notes
Manager should integrate B after verifying the exact remote SHA. C should use A's roadLeft/roadRight boundaries as the inner runoff boundary, so no separate rectangular verge is required from B.
