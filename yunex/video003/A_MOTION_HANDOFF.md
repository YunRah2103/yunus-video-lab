# YUNEX 003 — AGENT A — Driving dynamics and runtime articulation

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-driving
Owned source: yunex/src/video003/motion/
Reports: yunex/video003/reports/A/

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
The Porsche must look genuinely driven. Y002 travels only 5.15m over ~25s; do not reuse or speed-scale that curve blindly.

## Concrete implementation
1. Inspect GLB hierarchy/base transforms and measure actual tyre radii/axle centres. Document how wheel spin, steering, calipers and wrappers relate.
2. Publish early minimal pure motion API proposal: frame/fps -> time, distance, speed, root pose, chassis attitude, four wheel/upright poses, steering/spin. Include anchors, sign convention, tests and sample states. Manager owns shared types.
3. Build coherent approach/braking/corner/exit path with smooth speed/curvature and containment on actual available track. Coordinate targeted path adaptation with C, not a new circuit.
4. Integrate distance accurately; derive spin from distance/radius and wheel-specific paths where useful. Steering follows curvature; don't steer rear wheels gratuitously.
5. Articulate body load separately from wheel contact. Small pitch/roll/heave, grounded tyre bottoms, connected upright/calipers. No random per-frame bounce, floating body or wheel hops.
6. Preserve source GLB; adapters restore exact base transforms before applying frame state. B attaches links to approved anchors. Pure arbitrary-frame evaluation; no useFrame delta accumulation.
7. Provide simple local proof scene/harness in owned directory; no central registration edits.

## Dependencies / checks
Start now from Manager baseline. B/C/D need your contract early, not after every animation is polished. Publish contract-ready milestone with remote SHA.
Test distance derivative/speed, steering sign, spin consistency, finite transforms, deterministic random-order frame calls, contact at braking/turn extremes and chunk boundaries. Inspect 4–6s moving proof including fixed trackside crossing. At least opening and exit movement must convincingly travel, not hover.
Reject motion that requires tyres to deform unrealistically. Tire deformation is optional; ground contact is mandatory.
Return motion manifest, anchors/radii, API example, proof and limitations.
