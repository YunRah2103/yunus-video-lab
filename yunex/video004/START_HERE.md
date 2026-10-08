# YUNEX 004 — START HERE
**Active phase:** Y004-REAR-STEERING-01 — H integration and G final rendering, NOT APPROVED.

This page is the only active entry point for Y004. Older Y003/y002 directions are historical. The authoritative creative brief is [MANAGER_IMPLEMENTATION_HANDOFF.md](MANAGER_IMPLEMENTATION_HANDOFF.md), published on remote `sol/y004-rear-steering-manager` at `2522f1379712f7ccbeca68d350dfa592a1f6ff97`.

## Source pins
- Accepted production base: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51` (Y003 P03 corrected-release branch).
- Initial Master handoff SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`.
- Porsche GLB SHA256: `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- Y004 Manager/integration branch: `sol/y004-rear-steering-manager`.
- A–F code has progressed; native THREE moving smoke tests passed run 37755997906 (technical render only). Agent D approved Cedar mix is ready. F independent real moving QA and full native movie are NOT approved.

## Read in order
1. This START_HERE.
2. MANAGER_IMPLEMENTATION_HANDOFF.md (Master locks).
3. MANAGER_CONTRACT.md (API, semantics and dependencies).
4. TASKS.json (canonical owners, branches, live status and accepted remote SHAs).
5. Your exact A/B/C/D/E/F role handoff in this folder.

## Operating discipline
Every specialist is a separate normal ChatGPT chat manually opened by the user, **not** a spawned sub-agent. Do not treat agent-start or acceptance as automatic. Each agent works in an isolated branch from the same dispatch commit (inspect current branch HEAD); reports actual implementation, proof, tests and **full verified remote SHA**. Manager alone integrates approved changes and edits central composition, timing, registry and existing shared production modules. No cross-owner writes without prior Manager scope.

The user-supplied actual Y004 Cedar file has been measured at **22.704 s**; Manager has locked **720 frames at 30fps (24.000s)**, with D's approved new transcript, timing and audio. See VOICEOVER_SOURCE_LOCK.json, VOICEOVER_INTEGRATION_UPDATE.md and Agent D branch report. The old 59-word script is superseded.

## Gates
1. A motion/low-high driving kinematics and B rear upright/caliper mechanical proof.
2. C matched mode framing plus wheel-anchored restrained direction guides; D measured VO, cue/edit/audio proof.
3. Manager composes and runs low/high/rear macro/driving native short proofs; F independent QA must accept.
4. **Agent H** (central integration delegate) fixes current audio/motion edit mismatch, registers final composition and submits new native short moving proof. **Agent F** checks it.
5. Manager publishes immutable H render source + pre-render F PASS in registry; **Agent G** reuses E's strict tooling to run full 720-frame 1080×1920 render/mux/validate.
6. Agent F independently checks finished movie; Manager returns playable one-master MP4 to Master for creative review, not automatic approval.

No external numerical threshold/steering-angle claim, no larger-than-1° illustrative rear steering without Master escalation, no stationary chassis turntable, no ungrounded drifting, no duplicate A/B MP4 uploads.

## Late-stage separate agents
- H — integrate and retime: `H_INTEGRATION_HANDOFF.md`, branch `sol/y004-h-integration`.
- G — locked native render and delivery: `G_RENDER_HANDOFF.md`, branch `sol/y004-g-render`.
- Existing F stays independent proof/final QA; Agent E's rendering tooling stays reusable, no role replacement or duplicated renderer.

## Parallel release helper
Agent I is a release-only specialist on `sol/y004-i-release-prep`; read `I_RELEASE_PREP_HANDOFF.md`. I sources the exact D-approved AAC file and investigates a safe render-workflow launch route in parallel with H. I must not edit H integration or G renderer. Manager merges H+I, F approves the exact combined source, G does the full render.
