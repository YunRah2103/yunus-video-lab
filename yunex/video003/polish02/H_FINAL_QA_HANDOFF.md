# YUNEX 003 — POLISH 02 — AGENT H — FINAL INDEPENDENT QA
Phase: Y003-POLISH-02
Work branch: sol/y003-p02-final-qa
Production source is READ-ONLY.
Owned output: yunex/video003/qa/polish02/final/ and yunex/video003/reports/P02-H/

## Start condition
Wait for Manager-pinned render_source_sha and Agent G's completed native artifact.
You may prepare rubric/tooling before then.

## Mission
Independently review the actual revised movie, not merely source code or static tests.

## Mandatory visual checks
- Porsche still visibly drives naturally
- wheel wobble is gone; all wheels spin/steer plausibly
- no new wheel clipping/contact issues
- suspension is visibly richer and remains connected
- reveal still communicates double-wishbone + aero concept
- established circuit identity persists through hook, turn-in, reveal, whole-car and exit
- track parallax is believable
- no scenery occlusion/repetition regression
- approved car exterior/livery unchanged
- airflow still clears the revised mechanical geometry
- typography/cameras/story/VO remain intact
- active exit remains present

## Delivery checks
- 1080x1920
- 30 fps
- exactly 735 decoded frames
- 24.5 s
- H.264 yuv420p
- AAC audio
- full decoder pass
- no visible chunk seams
- deterministic milestone frame review
- model hash unchanged

Return PASS or FAIL. For failures give exact frame/time and blocker.
Do not silently change production code.
Push final QA/report files and return full remote SHA.
