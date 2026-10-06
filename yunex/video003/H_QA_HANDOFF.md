# YUNEX 003 — AGENT H — Independent driving, mechanical and visual QA

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-qa
Owned source: yunex/video003/qa/, yunex/video003/reports/H/
Reports: yunex/video003/reports/H/

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
Catch convincing-looking code that produces an unconvincing film. You are independent QA, not another director or integrator.

## Concrete implementation
1. Read Master constraints and source/asset contracts. Prepare standalone check scripts/report rubric in your owned directory. No silent source fixes outside ownership.
2. Inspect A/B/C/D outputs at exact Manager pins: path/speed/spin agreement, steering direction, grounded tyres, connected links, caliper behavior, local/world transforms, silhouette, reference-informed topology and scientific limits.
3. Review actual 4–6s driving proof and 3–5s reveal/airflow proofs before full render. Include fixed trackside proof, not merely follow-camera view. FAIL if stationary/sliding GLB, false ground contact, mismatch speed/parallax, disconnected links or unreadable mechanism.
4. Review seven native milestone frames for beauty, circuit identity, label collision, clipping, alpha artifacts and profile clarity.
5. Report PASS/FAIL/BLOCKED against exact SHA with specific frame/time evidence, severity, owner and recommended scoped correction. Static checks passing cannot compensate for absent moving evidence.
6. After G exports, watch/listen actual complete film where supported. Assess first second, speed, mechanical clarity, camera variety, pacing, sound, muted comprehension and active ending. If unable to play/listen, disclose and do not invent observation.
7. Independently verify G provenance/decoder/frame/gap/audio results and approved model hash. Ensure reduced proof was not substituted for native final.

## Dependencies / release
Prepare baseline rubric/checks now. Component review can occur as each output arrives; integrated verdict uses Manager-pinned integration SHA. A failed old SHA does not automatically fail corrected source; recheck affected evidence. Conversely, report updates don't erase visual failure.
Manager performs routine fixes and pins corrected source. Escalate major story/model/reference uncertainty to Master through Manager. No redesign or force-push.
Final report distinguishes technical checks, visual review coverage, playback/listening limitations and outstanding Master creative approval. Return concise review package with evidence links, full input/output remote SHAs and actual blockers; no inflated claims.
