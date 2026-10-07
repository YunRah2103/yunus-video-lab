# YUNEX 003 — POLISH 02 — MANAGER
Phase: Y003-POLISH-02
Branch: sol/y003-suspension-manager

You are the sole coordinator/integrator for this polish pass. Do not restart the film and do not perform specialist work merely because an agent is still running.

## Locked outcome
Preserve the successful moving Porsche, supplied VO, 735-frame 30 fps 24.5 s timeline, story, typography, camera intent, approved white/green car and existing aero explanation.

Improve only:
- wheel stability
- suspension mechanical richness
- established circuit presentation

## First actions
1. Fetch the current remote manager branch before every write.
2. Read polish02/START_HERE.md and POLISH_02_TASKS.json.
3. Verify each specialist branch was created from the exact published phase base.
4. Never integrate a role by letter alone; verify phase, handoff path, input SHA and output SHA.
5. Reject local-only work, handoff-only work, stale Y003-SUSPENSION-AERO-01 outputs, and any branch that changes central/shared files without approval.

## Integration discipline
A owns motion only.
B owns suspension only.
C owns track adapter only.
D/E/F are independent QA/preflight and must not silently fix A/B/C production code.
G owns render tooling only after source pin.
H owns final QA only.
Manager alone edits Video003.tsx, timeline.ts, types.ts, src/index.tsx and registry.

Integrate A/B/C changes once after reviewing diffs and their specialist proofs. If a specialist touched another owner's files, bring in only the authorized paths unless the change is explicitly justified.

## Required proof gates
Before full render:
- wheel fixed-camera rolling proof, neutral + steering/load
- all four hubs remain concentric with no unjustified precession
- visible wheel contact and fixed calipers
- installed suspension macro showing richer connected geometry
- 3–5 s suspension articulation proof through existing reveal/load moments
- track identity visible at hook, turn-in, reveal, whole-car and exit
- 4–6 s driving proof with believable track-relative parallax
- compile/test compatibility from F
- native short integrated proof reviewed by Manager

Do not accept stills as proof of wheel stability.

## Final release
After short-proof approval, pin one exact render_source_sha and release G.
Any source change after that invalidates affected render chunks.
H independently checks the finished movie.
Final deliverable: 1080x1920, 30 fps, 735 frames, H.264 yuv420p, AAC, faststart, unchanged approved model hash.
Return revised MP4, seven native milestones, before/after evidence, QA summary and exact remote source/delivery SHAs.
