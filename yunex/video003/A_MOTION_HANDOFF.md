# YUNEX 003 — A — Driving and runtime articulation

Phase: Y003-SUSPENSION-AERO-01
Repository: YunRah2103/yunus-video-lab
Canonical coordination: sol/y003-suspension-manager
Your work branch: sol/y003-driving

## Read / start
Read yunex/video003/START_HERE.md, MASTER_HANDOFF.md and TASKS.json on coordination branch. Manager pins your exact input SHA before coding. This is a separate user-started chat. Do not spawn agents or follow old Y002 role handoffs.

## Ownership
yunex/src/video003/motion/
Your report/proof sources: yunex/video003/reports/A/ (E as registry).
No edits to shared timeline/types/registration/integration/registry or another specialist's files. Propose shared interface changes to Manager.

## Actual work
Inspect model pivots and track bounds. Publish a deterministic typed motion API early with measured radii, wheel anchors and coordinate contract. Implement credible path/speed, curvature steering, distance-derived spin, subtle chassis load and independently grounded wheel/upright transforms. Never reuse Y002 5.15m curve. Provide attachment-ready adapter/hooks for B geometry and C cameras. Runtime wrappers only; approved GLB unchanged. Pure arbitrary-frame evaluation, no accumulated playback state. Prove 4–6s tracking + fixed trackside travel, braking and turn-in. Test spin/distance, steering sign, contact and determinism.

## Dependencies
No dependencies for initial implementation; Manager approves API before others bind.

## Verification / completion
Respect Master story, technical limits, approved white/green exterior and model hash. Read-only inspection may start before dependencies; do not guess unpublished interfaces. Manager integrates; do not independently merge others or redesign story. Push implemented code and reproducible proofs to your work branch. Verify remote full SHA. Return phase, role, pinned input SHA, output branch/full remote SHA, changed files, proof URLs, tests, limitations and outstanding dependencies. Native stills 1080x1920 scale1; smaller motion drafts clearly labelled. A report or handoff alone is not completion. No force-push. Escalate scope/architecture/accuracy concerns to Manager.
