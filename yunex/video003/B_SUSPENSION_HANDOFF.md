# YUNEX 003 — AGENT B — Front suspension mechanical geometry

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-suspension
Owned source: yunex/src/video003/suspension/
Reports: yunex/video003/reports/B/

## Required operating rules
Read START_HERE.md, MASTER_HANDOFF.md, MANAGER_EXECUTION_HANDOFF.md and TASKS.json on sol/y003-suspension-manager. This is Y003, not historical Y002. Separate user-started chat; do not spawn agents.
Inspect current remote state/AGENTS instructions before edits. Manager owns registry and central integration. Use isolated work branch from Manager-pinned input. Initial preparation baseline is 50fd478256bbe12d37410e78678bd7c302d96434; contract release pins supersede it for dependent work.
Only edit listed source directory and reports/<role>/. Never casually edit types.ts, timeline.ts, Video003.tsx, index.tsx or another role. Send interface proposal in your report/commit; Manager installs it. Keep original Y001/Y002 reproducible.
Approved Porsche bytes/livery/source materials are locked. Model SHA256 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb. Metres, +Y up, +Z forward, +X left. Source asset has Steer_FL/FR, Spin_FL/FR/RL/RR and independent calipers; no detailed suspension CAD.
User may be offline. Execute reversible authorized work without optional approval loops. At real dependency blockage, complete independent work and report precise blocker. Do not silently guess unavailable interfaces or claim integration. No force-push, no full film render except G, no alternate creative direction.

## Proof and remote completion
Push actual implementation, tests, reproduction commands and proof evidence. Large media uses artifacts/persistent file delivery, not git history; commit paths/URLs/provenance. Native stills 1080x1920 scale1; smaller motion proofs explicitly labelled. Inspect your real renders. Verify remote head after push.
Return phase/role, exact input SHA, output branch/full remote SHA, changed files, proof links, tests and known limitations/dependencies. If blocked, return BLOCKED with completed work and exact next requirement. Hand-off/report-only output is not completion.
Escalate model redesign, major environment/story/VO changes, unsure reference mechanics, false scientific claims or persistent fake driving to Manager. Routine errors stay with implementer.

## Goal
Show plausible installed 992 GT3 RS front suspension with a readable teardrop aerodynamic profile. Add only missing geometry; approved exterior stays untouched.

## Concrete implementation
1. Inspect current approved hierarchy and axle anchors. Use Porsche's primary reference in MASTER plus credible manufacturer diagrams/images if additional topology is needed. Record source and distinguish documented features from approximate dimensions.
2. Build restrained double-wishbone link topology, upright connections and enough spring/damper context to explain wheel/body relation. No generic MacPherson strut substituted for double wishbones, no decorative hydraulics.
3. Make the aerodynamic section legible at macro scale: rounded leading region and tapering trailing region oriented to intended flow, reference-informed rather than fake racing wing.
4. Export anchors, part identifiers, bounding volumes, profile inspection camera suggestions and a prop-driven articulation interface.
5. Bind link ends to A's approved chassis/upright state after contract release. Connected parts must stay connected through steering/load; stationary calipers follow upright, not rim spin.
6. Geometry/material buffers created once/cached; frame updates transform parts. Do not rebuild the Porsche or duplicate tyres.
7. Install geometry in actual front-corner coordinates. Use isolated and installed proof harnesses only within your ownership.

## Dependencies / checks
Begin reference/model inspection and static geometry now. Use injectable approximate local fixtures until A's anchors are approved; label fixture proofs. Final proof must use actual Manager-pinned contract.
Inspect left/right symmetry, front-wheel sweep, link/body intersections, ground clearance and disconnected endpoints at full steering/load extrema. Verify reveal can expose geometry without losing car context.
Anti-dive illustration must not promise exact GT3 RS kinematics without reference data. No quantitative simulation claim. Do not invent ball-joint dimensions to imply factory accuracy.
Return installed native frame, 3–5s articulation proof, topology/reference note, anchor API, tests and model-hash confirmation.
