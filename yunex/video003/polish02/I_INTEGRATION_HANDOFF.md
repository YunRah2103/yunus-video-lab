# YUNEX 003 — POLISH 02 — AGENT I — FINAL INTEGRATION
Phase: Y003-POLISH-02
Role: I — Integration engineer
Work branch: sol/y003-p02-integration
Repository: YunRah2103/yunus-video-lab

You are the dedicated integration engineer for POLISH-02.

Do not redesign the film.
Do not modify the approved Porsche asset, narration, timeline, cameras, typography or story unless a genuine integration blocker requires a minimal Manager-approved fix.
Do not spawn agents and do not create another handoff.

## Source authority
Manager remains final authority.
Integrate only accepted specialist production paths and exact SHAs.

Current accepted / candidate inputs:
- A wheel rig: b4f6c0e5382683f433b47a0bdd216fea4ff3a5dd
- D wheel QA PASS: 1f186d4c7a63cece55529fe4b0bc3ef839fadd76
- B suspension fixed implementation: 7b2ac51508890563b5c598480d47b2bfd0cfd0d1
- B latest proof/report branch: 737beaa58535b6d2de88b33ad45f8a8921387cc1
- C track: use latest visually accepted production SHA only after its exit proof finishes
- E visual QA: must PASS the final B/C state before render release
- F preflight: use its compatibility findings; rerun/verify if accepted source SHAs changed

## Ownership rules
You may edit central integration files on this branch:
- yunex/src/video003/Video003.tsx
- yunex/src/video003/timeline.ts only if required for compatibility, otherwise leave unchanged
- yunex/src/video003/types.ts only if required for compatibility, otherwise leave unchanged
- yunex/src/index.tsx only if required for registration, otherwise leave unchanged
- yunex/video003/reports/P02-I/

Bring in only authorized specialist production paths:
- A: yunex/src/video003/motion/
- B: yunex/src/video003/suspension/
- C: yunex/src/video003/track/

Do NOT wholesale merge specialist proof workflows or unauthorized central-file edits.
C's own Video003.tsx change is not authoritative; mount the accepted track extension yourself.

## Execution
1. Fetch all current remote heads before writing.
2. Stage A's accepted motion-only delta.
3. Stage B's fixed suspension production delta.
4. Run build/tests and verify the motion/suspension contracts coexist.
5. Inspect C's latest branch and proof status.
6. When C's final exit proof succeeds and E visually accepts C, stage only C's owned track production files and perform the central mount yourself.
7. Run the combined compile/tests and deterministic checks.
8. Render short integrated native proofs at the critical beats, including wheel motion, suspension reveal/load and final exit track identity.
9. Do not publish a render_source_sha unless E's latest report PASSes the exact accepted B/C visual state and the integrated short proof itself is clean.
10. Push the completed integration branch and return the full remote SHA plus the exact A/B/C SHAs integrated.

## Locked output
- 735 frames
- 30 fps
- 24.5 s
- 1080x1920 final target
- approved white/green Porsche unchanged
- supplied VO/mix timing unchanged
- model SHA256 unchanged:
  1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb

## Release gate
If B or C is still visually blocked, keep the integration branch staged/tested but do not release G.
Once E PASSes and your integrated proof PASSes, report the exact integration SHA to Manager for final source pin and G render release.
