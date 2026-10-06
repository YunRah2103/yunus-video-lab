# YUNEX 003 — AGENT F — Supplied narration, automotive sound and timing

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-audio
Owned source: yunex/src/video003/audio/, yunex/video003/audio/
Reports: yunex/video003/reports/F/

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
Preserve the uploaded narration and make movement audible without competing with speech.

## Supplied file
openai-fm-cedar-friendly.mp3
Library ID libfile_6e284ae6e75c819197dd652690e22ae8
Measured 23.256s, MP3, 24000Hz mono.
Obtain through available attachment/Library access. The master's scratch path is not a shared-chat dependency. No regeneration, replacement or silent omission.

## Concrete implementation
1. Materialize supplied file; hash/probe it. Listen/transcribe actual wording and mark sentence/phrase timings. Report any mismatch with expected brief. Do not assume text matches without checking.
2. Send cue JSON/report early for Manager/E. Manager owns final shared timeline. Aim ~24–25s with short active exit; preserve natural VO speed.
3. Prepare narration gain/cleanup only where necessary, preserving voice and timing. Document processing/source hash; keep source file.
4. Inspect existing suitable engine/road/wind/pass sounds and their provenance. Reuse relevant sources; no futuristic UI/trailer noise.
5. Build sound envelope API matched to A speed/load and C camera distance: restrained engine, road, wind, braking/exit/pass. Sound must agree with actual motion and slow-motion treatment.
6. Duck effects under speech. Subtle mechanical emphasis when exposed; no fake clanks with every suspension movement or constant whooshes.
7. Deliver reusable stems/mix manifest and export instructions to G. Convert to appropriate final 48kHz stereo mix if needed; preserve VO intelligibility.

## Dependencies / checks
Source retrieval, cue timing and source preparation start immediately. Dynamic sound alignment waits for A/C/Manager final cue state. If retrieval fails, document exact blocker and continue independent sound/source planning; do not synthesize substitute.
Listen entire mix where supported; check clipping/true peak, channel balance, silence boundaries, MP3 decoder delay and export alignment. No zero-padding that shifts narration; compare cues after conversion.
Return supplied source hash/probe, timed transcript, processed/stem links, mix API, meter results and truthful listening limitations. Do not touch edit or workflow files.
