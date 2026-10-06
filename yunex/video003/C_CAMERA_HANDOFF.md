# YUNEX 003 — C — Cameras, moving reveal and track adapter

Phase: Y003-SUSPENSION-AERO-01
Repository: YunRah2103/yunus-video-lab
Canonical coordination: sol/y003-suspension-manager
Your work branch: sol/y003-cameras

## Read / start
Read yunex/video003/START_HERE.md, MASTER_HANDOFF.md and TASKS.json on coordination branch. Manager pins your exact input SHA before coding. This is a separate user-started chat. Do not spawn agents or follow old Y002 role handoffs.

## Ownership
yunex/src/video003/cameras/, yunex/src/video003/reveal/, yunex/src/video003/track/
Your report/proof sources: yunex/video003/reports/C/ (E as registry).
No edits to shared timeline/types/registration/integration/registry or another specialist's files. Propose shared interface changes to Manager.

## Actual work
Build motivated automotive cameras consuming A state: low front tracking hook, wheel-level move, front suspension reveal, detail, whole-car and fixed trackside/exit. Preserve scene connection through selective body ghosting with cloned runtime materials; no mutation of source assets. Use corrected TrackWorld. Implement isolated targeted path/track adapter only if current finite section blocks movement; preserve Y002. Validate containment and camera near-plane/vegetation clearance. Present composition and moving 3–5s reveal proof. Do not create generic CAD void or endless interpolated orbit.

## Dependencies
Inspect baseline now; implementation uses Manager-pinned A motion API. Reveal binds B bounds when available.

## Verification / completion
Respect Master story, technical limits, approved white/green exterior and model hash. Read-only inspection may start before dependencies; do not guess unpublished interfaces. Manager integrates; do not independently merge others or redesign story. Push implemented code and reproducible proofs to your work branch. Verify remote full SHA. Return phase, role, pinned input SHA, output branch/full remote SHA, changed files, proof URLs, tests, limitations and outstanding dependencies. Native stills 1080x1920 scale1; smaller motion drafts clearly labelled. A report or handoff alone is not completion. No force-push. Escalate scope/architecture/accuracy concerns to Manager.
