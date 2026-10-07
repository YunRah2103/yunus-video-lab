# YUNEX 003 — POLISH 02 — AGENT A — WHEEL RIG STABILITY
Phase: Y003-POLISH-02
Work branch: sol/y003-p02-wheel-rig
Exclusive production ownership: yunex/src/video003/motion/
Do not edit central composition, suspension, track, render workflow or shared registry.

## Mission
Remove the visually incorrect wheel wobble while preserving real driving, distance-derived spin, corner steering, body motion and tyre contact.

## Diagnose before changing
Inspect runtimeArticulation.ts, contract.ts, approved GLB hierarchy and real wheel/hub transforms.
The current implementation restores source transforms and layers Euler steering/spin; treat this only as a lead, not a proven cause.

Audit:
- actual hub centres/pivots
- local axle direction
- parent/inherited rotations
- non-uniform scale
- left/right symmetry
- steering + spin composition order
- rim/tyre/hub grouping
- brake/caliper ownership
- aliasing versus true geometric precession

Prefer stable quaternion/axis composition from the source base transform if correction is needed.
Do not remodel the approved Porsche and do not zero wheel motion to hide a defect.

## Locked behaviour
Do not change route, speed curve, root travel, story timing or camera.
Keep wheel spin distance-derived.
Keep necessary front steering.
Keep justified load response but remove unjustified oscillation.

## Required deliverables
- actual code fix under motion/
- concise diagnosis report under yunex/video003/reports/P02-A/
- native 2–3 s fixed-camera neutral rolling proof
- native 2–3 s steering/load proof
- same-time before/after comparison
- all-four-wheel inspection
- measurements or repeatable checks for hub radial/lateral stability and contact
- tests proving deterministic transforms

Push branch and return full remote commit SHA.
Do not claim completion from code/tests alone; moving proof is mandatory.
