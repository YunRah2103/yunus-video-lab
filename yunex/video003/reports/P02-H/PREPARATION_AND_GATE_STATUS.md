# YUNEX 003 — POLISH 02 — Agent H independent final QA

Phase: Y003-POLISH-02  
Role: H — final independent QA  
Branch: sol/y003-p02-final-qa  
Production source: READ-ONLY

## Current gate status

**BLOCKED ON RELEASE DEPENDENCIES — no final PASS/FAIL has been fabricated.**

The H handoff requires both a Manager-pinned `render_source_sha` and Agent G's completed native artifact before the final movie can be independently reviewed.

At the last remote check performed during this Agent H run:

- Manager branch `sol/y003-suspension-manager` head: `9de96ceb9f78f7660a50d136a303fc90d2e5099e`
- Manager head message: `YUNEX 003 P02: expand execution to Manager plus A-H`
- Agent G branch `sol/y003-p02-render` head: `4213a2518035d92413f4917b2c368427bd41888f`
- Agent G head message: `YUNEX 003 P02: document exact native delivery contract`
- GitHub Actions workflow runs associated with that G commit: none returned.
- Therefore there is no completed native final artifact tied to a Manager-pinned render source available for H to inspect yet.

This is a start-condition blocker, not a visual PASS and not a production defect diagnosis.

## Work completed by H before release

H prepared executable independent final-delivery verification in:

- `yunex/video003/qa/polish02/final/verify_final.py`
- `yunex/video003/qa/polish02/final/README.md`

The verifier is deliberately production-read-only and checks:

- full ffmpeg decoder pass
- 1080x1920 native dimensions
- 30 fps
- exactly 735 decoded frames
- approximately 24.5 s
- H.264 video
- yuv420p pixel format
- exactly one AAC audio stream
- MP4 faststart ordering
- optional independent hash verification of the locked Porsche GLB
- deterministic extraction of seven milestone frames: 27, 144, 234, 306, 492, 603 and 711

The executable intentionally cannot auto-PASS visual quality. Human review of the actual native movie remains mandatory.

## Final visual rubric once G artifact is released

H will inspect the exact revised movie for:

1. natural visible Porsche travel throughout the film;
2. wheel wobble removed without stopping or disguising wheel motion;
3. plausible wheel spin/steer and no new clipping/contact/caliper-spin issue;
4. richer suspension that remains connected during load/steer;
5. readable double-wishbone plus aero educational reveal;
6. established circuit identity at hook, turn-in, reveal, whole-car and exit;
7. believable track-relative parallax;
8. no scenery occlusion or obvious repetition regression;
9. unchanged approved white/green Porsche exterior/livery;
10. airflow clearing revised mechanical geometry;
11. intact typography, cameras, story and supplied VO;
12. active moving exit;
13. no visible chunk seams.

Any failure in the final report must identify the exact frame/time and blocker.

## Next executable step

After Manager publishes a full 40-character `render_source_sha` and G publishes the corresponding native MP4/artifact, run the verifier against that exact movie and approved Porsche asset, inspect the seven extracted native milestones plus the full moving film, then replace this BLOCKED gate with the real final PASS/FAIL report.

No production source was modified by Agent H.
