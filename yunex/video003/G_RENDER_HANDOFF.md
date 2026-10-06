# YUNEX 003 — AGENT G — Native render pipeline and final export

Phase: Y003-SUSPENSION-AERO-01
Work branch: sol/y003-render
Owned source: yunex/video003/render/, .github/workflows/yunex-003-render.yml
Reports: yunex/video003/reports/G/

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
Produce one genuine native full film from accepted integrated source, efficiently and reproducibly. You own rendering; no specialist competing full-film renders.

## Concrete implementation
1. Inspect existing Y002 native workflows/chunk tooling and successful native source provenance. Preflight installed FFmpeg/browser/assets/runtime before costly jobs.
2. Prepare Y003-specific workflow/tools that cannot accidentally trigger old films. Keep source staging/model hash checks and explicit composition/size/scale/fps.
3. Use deterministic disjoint chunks; choose measured safe chunk size/concurrency. Run small render smoke/benchmark early. No per-frame rebuild/redundant asset restaging if avoidable.
4. Wait for Manager render_source_sha after H integrated proof checks. Render all frames at native 1080x1920 scale1 30fps. No upscale draft passed as final.
5. Record exact source SHA/asset hashes/frame intervals/digests for every chunk. Reuse successful chunks only from exact matching source/config. New source invalidates affected provenance.
6. Assemble gap-free contiguous frames; attach F-approved audio/mix without shifting cues. Apply E finishing once. Export H264 yuv420p AAC faststart.
7. Fully decode export; probe exact dimensions/fps/count/duration and audio. Diagnose timestamp rounding separately from missing frames; never weaken validators.
8. Produce seven native milestones, preview contact sheet and final playable MP4. Deliver artifacts through available persistent workflow and record URLs in GitHub; no large movie in git.

## Dependencies / recovery
Pipeline preparation and small native benchmark start now, independently. Full render requires pinned integrated source and Manager release. Do not render stale Y002 or unfinished fake-driving scene merely to show progress.
If failed chunk, inspect logs and rerender scoped interval. If integration bug, notify Manager with frame/source evidence. Stop duplicate expensive workflows where safe; preserve successful exact-source data. No open-ended wait without current-state report.
Return source/export manifest, full decoder/probe/audio results, actual MP4 + seven frames, workflow/artifact IDs, reproduction commands and verified branch SHA. H independently reviews final film. You cannot grant Master creative approval.
