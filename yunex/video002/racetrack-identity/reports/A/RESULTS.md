# Agent A — Layout Results

Phase: Y002-RACETRACK-IDENTITY-02  
Role: A — Layout  
Input: 8a02cc405d0f9958301c24cc4ce3add824f28288  
Branch: sol/y002-track-identity-layout

## Implemented
- Added a single shared sampled racetrack-section contract in track-local metres.
- Racing surface is 8.6 m wide and centred on the locked Porsche corridor.
- The car corridor remains exactly straight from local z=-8 m to z=+8 m.
- A restrained distant bend starts at z=10 m and finishes at z=34 m, reaching 2.65 m lateral offset with a maximum heading of about 9.404 degrees.
- Every sample exposes centreline, tangent/normal, left/right road edges, side-specific runoff boundaries, barrier lines, landscape exclusion lines and kerb eligibility.
- Kerb intent is selected rather than continuous: right-side apex zone, then left-side exit zone.
- Added world/track coordinate conversion helpers matching TrackWorld root position [-1,-0.028,0] and yaw PI.
- Added a reusable LayoutDebug Three.js component. It is not mounted into TrackWorld; Manager owns integration.

## Validation
The exported validator checks finite samples, fixed 8.6 m width, runoff outside the racing surface, centreline continuity, restrained bend heading, exact straight corridor and all 751 locked root poses. A conservative Porsche footprint proxy of 2.24 m x 4.90 m is checked at all four corners for every frame.

Computed results:
- samples: 161 at 0.5 m spacing
- minimum conservative footprint clearance to road edge: 3.125 m
- maximum centreline heading from straight: 9.40424235 degrees
- straight-corridor centre error: 0 m
- no requested car/camera/edit/TrackWorld files changed

## Proofs
- proof-current-camera-opening.svg — projection through the existing frame-0 rear-quarter camera
- proof-current-camera-payoff.svg — projection through the existing payoff camera override at frame 750
- proof-high-angle.svg — full contract overview with the locked-car corridor marked
- metrics.json — numeric proof summary

The SVG proofs are 1080x1920 deterministic debug projections, not final/native beauty renders. B/C/D should derive geometry from layout.ts after Manager pins this commit as layout_contract_sha.
