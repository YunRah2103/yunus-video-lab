# YUNEX 004 — START HERE
**Active phase:** Y004-REAR-STEERING-01 — PRODUCE, NOT APPROVED.

This page is the only active entry point for Y004. Older Y003/y002 directions are historical. The authoritative creative brief is [MANAGER_IMPLEMENTATION_HANDOFF.md](MANAGER_IMPLEMENTATION_HANDOFF.md), published on remote `sol/y004-rear-steering-manager` at `2522f1379712f7ccbeca68d350dfa592a1f6ff97`.

## Source pins
- Accepted production base: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51` (Y003 P03 corrected-release branch).
- Initial Master handoff SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`.
- Porsche GLB SHA256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- Y004 Manager/integration branch: `sol/y004-rear-steering-manager`.
- Manager has created dispatch docs and separate specialist branches, but **no Y004 implementation/visual/native render has passed QA yet**.

## Read in order
1. This START_HERE.
2. MANAGER_IMPLEMENTATION_HANDOFF.md (Master locks).
3. MANAGER_CONTRACT.md (API, semantics and dependencies).
4. TASKS.json (canonical owners, branches, live status and accepted remote SHAs).
5. Your exact A/B/C/D/E/F role handoff in this folder.

## Operating discipline
Every specialist is a separate normal ChatGPT chat manually opened by the user, **not** a spawned sub-agent. Do not treat agent-start or acceptance as automatic. Each agent works in an isolated branch from the same dispatch commit (inspect current branch HEAD); reports actual implementation, proof, tests and **full verified remote SHA**. Manager alone integrates approved changes and edits central composition, timing, registry and existing shared production modules. No cross-owner writes without prior Manager scope.

The 24 s / 720-frame envelope is **provisional** until newly recorded VO is measured. The supplied script is 59 words (~23.6 s at 150 spoken words/min excluding pause variation). D measures real audio before Manager locks final integer frame count; other agents implement portable frame-driven APIs, not hard-code final export length.

## Gates
1. A motion/low-high driving kinematics and B rear upright/caliper mechanical proof.
2. C matched mode framing plus wheel-anchored restrained direction guides; D measured VO, cue/edit/audio proof.
3. Manager composes and runs low/high/rear macro/driving native short proofs; F independent QA must accept.
4. Manager publishes immutable `render_source_sha`; E full 1080×1920 30 fps native render/mux/validate. Never mix chunks from different source SHAs.
5. F final independent QA; Manager delivers actual playable MP4 to Master. No claim of Master creative approval before viewing.

No external numerical threshold/steering-angle claim, no larger-than-1° illustrative rear steering without Master escalation, no stationary chassis turntable, no ungrounded drifting, no duplicate A/B MP4 uploads.
