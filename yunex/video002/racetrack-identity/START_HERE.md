# START HERE — YUNEX 002 RACETRACK IDENTITY

**CURRENT PHASE: Y002-RACETRACK-IDENTITY-02**

This branch contains handoffs, not an implemented environment upgrade. Source film/environment: sol/yunex-002-landscape-fix @ 8a02cc405d0f9958301c24cc4ce3add824f28288. The film and approved Porsche remain intact.

## Start order
1. Start Manager with MANAGER_HANDOFF.md and A with A_LAYOUT_HANDOFF.md.
2. E can begin baseline QA; F can begin render-pipeline preflight immediately.
3. B/C/D inspect their files now, but implement only after Manager publishes layout_contract_sha in TASKS.json.
4. Manager integrates A–D; E audits the integrated native proofs; F renders the complete first reviewable candidate from pinned render_source_sha. Astra reviews and approves the actual movie.

There are **seven chats total: Manager + A–F**. Do not spawn more agents. Specialists do actual work on their owned branch. Manager coordinates via GitHub registry and reports; user-opened separate chats cannot assume a shared filesystem or direct inter-agent messaging.

## Exact role routing
- **Manager**: [MANAGER_HANDOFF.md](MANAGER_HANDOFF.md) — `sol/y002-track-identity-manager`
- **A — Layout**: [A_LAYOUT_HANDOFF.md](A_LAYOUT_HANDOFF.md) — `sol/y002-track-identity-layout`
- **B — Racing Surface / Kerbs**: [B_SURFACES_HANDOFF.md](B_SURFACES_HANDOFF.md) — `sol/y002-track-identity-surface`
- **C — Runoff / Barriers / Circuit Furniture**: [C_RUNOFF_HANDOFF.md](C_RUNOFF_HANDOFF.md) — `sol/y002-track-identity-runoff`
- **D — Landscape / Outdoor Look Development**: [D_LOOKDEV_HANDOFF.md](D_LOOKDEV_HANDOFF.md) — `sol/y002-track-identity-lookdev`
- **E — Independent Track / Visual QA**: [E_QA_HANDOFF.md](E_QA_HANDOFF.md) — `sol/y002-track-identity-qa`
- **F — Native Render / Final Delivery**: [F_RENDER_HANDOFF.md](F_RENDER_HANDOFF.md) — `sol/y002-track-identity-render`

Read [COMMON_BRIEF.md](COMMON_BRIEF.md) then [TASKS.json](TASKS.json) and your exact role file. Ignore historical track-upgrade/airflow/vegetation handoffs. Agent C in THIS phase owns runoff/barriers, not airflow or foliage.

## Creative acceptance
The environment must visibly read as a connected racetrack: coherent racing surface and bend, aligned kerbs, runoff then barriers, intentional infield/outside greenery. Adding more trees is not the solution. All existing car/camera beats stay grounded and beautiful; technical shots retain track context. Preserve 1080x1920, 751 frames at 30fps, VO/audio/edit and the approved car. Reusable quality/seed setup; no whole circuit project.

## Completion safety
The registry is authoritative for active input/output SHAs and dependencies. Manager alone updates it and TrackWorld. Specialists must push implementation, actual proof evidence and tests, verify remote heads, then report full SHAs. Do not say complete after editing a handoff. Render provenance must identify the exact integrated source commit. Astra owns final creative approval.
