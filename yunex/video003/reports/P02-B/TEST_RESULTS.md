# YUNEX 003 — POLISH 02 — Agent B deterministic checks

Input phase-base SHA: 064fc7687ad16e9fc99c32c3c323154b7e4496f1

## Neutral geometry values

Existing canonical neutral link lengths are preserved:
- upper-front: 0.392078 m per side
- upper-rear: 0.386975 m per side
- lower-front: 0.436097 m per side
- lower-rear: 0.420892 m per side
- tie rod: 0.405247 m per side

Neutral damper length:
- FL: 0.648941 m
- FR: 0.648941 m

Neutral outboard/hub packaging radius:
- all existing outboard joints remain within 0.212 m of the approved wheel centre
- detail audit limit is 0.300 m

Connection invariants enforced by auditSuspensionDetailState():
- exactly one upper-front / upper-rear / lower-front / lower-rear / tie-rod per side
- upper wishbone front/rear arms share the same outboard joint within 1e-6 m
- damper length stays inside the 0.35..0.85 m illustrative packaging window
- every resolved endpoint is finite
- minimum car-local endpoint height stays at or above 0.10 m
- upright link envelope stays within 0.30 m of hub centre

## Proof harness

SuspensionDetailProof:
- deterministic fixture
- 5 seconds at 30 fps using frames 0..149
- exercises steering plus asymmetric bump/load
- runs both the legacy topology audit and new detail audit every frame
- optional diagnostic markers distinguish chassis pick-ups from upright pick-ups

## Specialist limitation

No central render workflow was edited or triggered from this branch. Visual acceptance of installed native before/after and the 3–5 s moving proof remains the Manager/E render-review gate, not a source-only claim by Agent B.
