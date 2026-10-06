# YUNEX 003 — Independent QA Gate

Agent H owns this directory. This QA is intentionally independent of the implementation branches and does not modify the shared Y003 composition.

## What this catches

`y003-qa.mjs` consumes a small evidence manifest tied to an exact integrated source SHA and returns `PASS`, `FAIL`, or `BLOCKED`.

The gate checks:

- exact Y003 phase and 40-character source provenance;
- approved Porsche model hash;
- required moving proofs: 4–6 s tracking drive, 4–6 s fixed/trackside drive, 3–5 s moving reveal and 3–5 s front-axle airflow proof;
- seven native 1080×1920 scale-1 milestone frames: hook, turn-in, reveal, profile, braking/load, whole-car and exit;
- chronological path distance, distance-derived wheel spin, steering sign versus curvature, tyre contact tolerance and non-spinning calipers;
- installed/connected suspension links and single application of the track/root transform;
- scientific guardrails: no unqualified 40 kg claim, no claim that anti-dive removes weight transfer, no implication that the links generate the entire aero effect, and front-axle-localized airflow;
- independent visual confirmations for physical driving, fixed trackside crossing, speed/parallax agreement, reveal/profile readability, circuit identity, clipping and active moving exit;
- optional final-export checks for native size, 30 fps, H264/yuv420p/AAC, faststart, full decode, gap-free assembly, audio presence and decoded frame count.

Static/code checks do not substitute for moving proof review. Missing evidence is `BLOCKED`, not a pass.

## Run

```bash
node yunex/video003/qa/y003-qa.mjs /path/to/y003-evidence.json
node yunex/video003/qa/y003-qa.mjs /path/to/y003-final-evidence.json --final
```

Exit codes: `0` PASS, `1` FAIL, `3` BLOCKED, `2` usage error.

## Evidence manifest notes

Evidence should be produced by the Manager/G pipeline from one exact source SHA. Proof entries need a URI/provenance field and measured duration. Reduced proofs must set `reduced: true` and `labelledReduced: true`. Native-frame entries must include milestone, width, height, scale and URI.

Motion samples should contain frame, distanceM, spinRad, curvature, steerRad, maxTyreContactErrorM and `caliperSpinsWithWheel`. `wheelRadiusM` is required for the distance/spin check. Mechanical links need a name, `installed: true`, and measured `maxEndpointGapM`.

The numerical tolerances in this script are QA alarms, not Porsche engineering claims: tyre-contact error is 0.025 m and installed-link endpoint gap is 0.02 m. Any flagged result still requires human inspection of the corresponding proof.
