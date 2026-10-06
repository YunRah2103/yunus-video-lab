# YUNEX 003 — AGENT D — Suspension aerodynamic explanation

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-airflow
Owned source: yunex/src/video003/airflow/
Reports: yunex/video003/reports/D/

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
Make the aero-shaped suspension understandable with restrained visuals anchored to installed components. This is qualitative illustration, not CFD.

## Concrete implementation
1. Verify primary Porsche facts from MASTER. Record that front link shaping contributes to front-axle aero and braking geometry is a separate mechanism.
2. Inspect existing AeroFlow/flowPaths techniques; reuse efficient paths/tracers/color language, not old rear-wing routes, force anchors or DRS modes.
3. Consume B geometry anchors/profile bounds and A car/body/wheel transforms. Choose a small number of paths showing incoming air around the front-axle/wheel-housing link profile.
4. Let viewers first see link shape, then add flow. No dense glowing tubes, particle fog, HUD cards, velocity heatmaps or invented pressures. Flow must not visibly penetrate solid components.
5. Provide short local profile view in installed context; do not detach an unrelated oversized link in a studio void. If a cross-section callout is needed, stay spatially connected and restrained.
6. Fade flow during mechanical-control beat; briefly reconnect whole-car then remove before final cinematic exit.
7. Use memoized geometry/materials and deterministic frame-driven tracers. No expensive geometry rebuild every frame.

## Dependencies / checks
Research/render utility scaffolding starts now with explicit dependency injection. Final path binding waits for Manager-pinned A+B anchors. Document local/world coordinate ownership to avoid double-transform.
Check bounds collisions, tracer direction, phase continuity, depth/alpha artifacts, native readability and whether airflow overwhelms profile.
No per-link 40kg claim. If Manager includes figure, all qualifiers remain. Do not use giant downforce arrows to imply a link behaves as an independent main wing.
Return installed 3–5s motion proof, native profile/whole-car frames, API, primary source note, tests and limitations. Airflow alone cannot compensate for weak geometry or driving.
