# YUNEX 003 — AGENT E — Edit timing, typography and finishing

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-edit
Owned source: yunex/src/video003/edit/
Reports: yunex/video003/reports/E/

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
Turn Manager's scene into a clear premium automotive story, using actual supplied narration timing. You no longer own audio or render workflow; F/G do.

## Concrete implementation
1. Inspect existing EditAudioComposition and branding/font/finishing utilities. Use established restrained ivory/green/copper typography, not a complete template rebuild.
2. Read F sentence cue report and Manager-approved timeline. Propose edits to Manager; never independently change narration/story/duration or write shared timeline.ts.
3. Implement timing-driven title/label components. Short initial hook appears immediately without covering Porsche; technical labels point to relevant installed parts.
4. Distinguish aero-shape vs mechanical-control beats using visual emphasis, not paragraphs of text. At most one dominant idea plus necessary part label in a frame.
5. Provide projection/placement API consuming camera/anchors from Manager. Maintain mobile safe area, avoid car/component occlusion and subtitle/HUD clutter.
6. Create meaningful state changes every 1–3s with restrained transitions. No repeated dramatic zooms, floating cards or effects inserted solely to fill time.
7. Restore clean opaque Porsche at exit; subtle YUNEX identity, no static logo hold. Finishing applied exactly once, coordinated with G.

## Dependencies / checks
Branding/overlay prototypes can start now. Final cues depend on F/Manager; projection depends on C/Manager. Isolated overlay mocks may use actual frames when available, clearly labelled.
Check native portrait typography readability, label leader attachment, collision/cropping throughout transitions, muted-story clarity and consistent grade.
Do not use cached Y002 opening/final plates as Y003 driving footage. No destructive changes to older font/compositions.
Return overlay/edit API, cue manifest proposal, native hook/reveal/load/exit examples, type-safe component checks and known placement constraints.
