# YUNEX 003 — POLISH 02 — AGENT D — WHEEL / DRIVING QA
Phase: Y003-POLISH-02
Work branch: sol/y003-p02-wheel-qa
Production source is READ-ONLY.
Owned output: yunex/video003/qa/polish02/wheels/ and yunex/video003/reports/P02-D/

## Mission
Independently prove whether Agent A actually fixes wheel wobble without breaking driving realism.

Start immediately by characterising the baseline. After A pushes, compare the exact same times/cameras.

## Inspect
- all four hubs through multiple full rotations
- neutral straight-line roll
- steering under load
- hub/rim/tyre concentricity
- wheel-plane precession
- tyre-road contact
- left/right symmetry
- brake/caliper behaviour
- steering plausibility
- wheel spin vs travelled distance
- body movement vs actual wheel defect
- temporal spoke aliasing versus transform error

Do not rewrite Agent A's code.
If a defect remains, report exact frame/time, wheel, symptom and likely source.

## Required output
- baseline vs A comparison
- fixed-camera native proof review
- quantitative/repeatable stability checks where possible
- PASS/FAIL with blockers
- exact A input/output SHA reviewed

Push QA/report files only and return full remote commit SHA.
