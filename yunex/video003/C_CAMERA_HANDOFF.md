# YUNEX 003 — AGENT C — Automotive cameras, moving reveal and track adapter

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-cameras
Owned source: yunex/src/video003/cameras/, yunex/src/video003/reveal/, yunex/src/video003/track/
Reports: yunex/video003/reports/C/

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
Film a driven Porsche, then reveal suspension without jumping into an unrelated CAD screen. Motivate camera changes by movement or explanation.

## Concrete implementation
1. Inspect corrected TrackWorld and root transform, actual section bounds/curve, A proposed path and source camera limitations.
2. Publish prop-driven camera API using motion state/cue progress; no independent competing driving animation. Use perspective cameras with deliberate focal lengths, distance and target.
3. Cover low front tracking hook, braking/turn-in, wheel tracking, installed front-corner reveal, link-profile close view, mechanical load, whole-car and accelerating pass/exit. One camera is genuinely fixed/trackside with car crossing frame.
4. Keep Porsche large enough for vertical mobile viewing; don't crop wheels/wing unintentionally. Avoid near-plane clips, random camera sweeps, excessive zoom and repeated station/orbit composition.
5. Selectively ghost/clip relevant front bodywork using cloned runtime materials and restore them at end. Wheels/installed links remain connected to recognizable car; track still visible.
6. If available track cannot support A's coherent movement, implement a targeted isolated Y003 adapter using existing components/contracts. Maintain road/runoff/barrier/vegetation ordering and grounded shadows. Preserve corrected winding/world texture scale; no full circuit/forest redesign.
7. Document camera-local/world transform ownership and fade/reveal state.

## Dependencies / checks
Read-only baseline inspection and isolated camera/reveal utility work starts immediately. Bind approved A state; B geometry bounds guide macro camera. Cue timing comes from Manager/F. Do not overwrite shared track/Y002 source to force your shot.
Test path containment, camera/vegetation/near-plane clearance, clipping plane space, restored exterior and silhouette readability. Inspect chronological 3–5s moving reveal and native hook/detail/exit frames.
The intro must immediately show speed through road-relative movement, not just camera translation. Slow motion is coherent across all scene motion.
Return camera shot manifest, reveal API, targeted adapter rationale if used, proofs and clearance results.
