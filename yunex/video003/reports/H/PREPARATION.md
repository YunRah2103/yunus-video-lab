# YUNEX 003 — Agent H QA preparation report

Phase: `Y003-SUSPENSION-AERO-01`  
Role: `H — Independent driving, mechanical and visual QA`  
Preparation input: `50fd478256bbe12d37410e78678bd7c302d96434`  
Coordination branch read: `sol/y003-suspension-manager`

## Work completed

- Read `START_HERE.md`, `MASTER_HANDOFF.md`, `MANAGER_EXECUTION_HANDOFF.md`, `TASKS.json`, `H_QA_HANDOFF.md` and repository `AGENTS.md`.
- Built standalone QA gate under H-owned files only.
- Encoded provenance, approved model hash, moving-proof, native-frame, driving-mechanics, suspension-connectivity, transform, scientific-claim, visual-review and final-export checks.
- Syntax-checked the script with Node and exercised it against an intentionally incomplete manifest. It correctly returned `BLOCKED` with missing-evidence findings rather than a false pass.

## Current independent verdict

`BLOCKED — dependencies not published yet.`

At the time of this preparation, Manager `TASKS.json` has `input_sha`, contract pins and output SHAs unset for A–H, and no remote A/B/C/D specialist branches were discoverable. Therefore H cannot truthfully inspect the required driving, reveal, airflow or integrated native-frame evidence yet.

This is not a visual failure of the film; it is a dependency/evidence block. Once Manager publishes exact pins and proofs, run the gate against the integrated evidence and perform human review of the real motion proofs. A passing script cannot override visibly fake/sliding driving.

## Human review rubric once proofs arrive

Driving proof must show believable wheel/road motion, steering that agrees with the path, grounded tyres, fixed-trackside car crossing, track/parallax speed agreement, modest purposeful pitch/roll and no wobble or stationary-GLB look. Reveal must remain attached to the moving front corner and preserve road/silhouette context. Suspension links must remain connected through motion, calipers must follow uprights without wheel spin, and the simplified geometry must not be presented as manufacturer CAD. Airflow must stay local to the front axle/wheel-housing mechanism and avoid overstating causal or quantitative claims. Seven native frames must be visually clean, readable and recognizably on the established circuit. Final review must inspect/listen to the full movie, including the first second and moving exit.

## Next exact dependency

Manager must publish the integrated/source pin(s), component pins and proof provenance. H then reviews those exact SHAs and updates `reports/H/` with PASS/FAIL/BLOCKED evidence tied to the reviewed source. G final export is reviewed separately after Manager pins `render_source_sha`.
