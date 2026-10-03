# Current production version: V3

Use `Porsche-V3`, `v3_visual_timeline.json`, `cedar_word_timing.json`, `v3_asset_manifest.json` and `../../docs/V3_VISUAL_POLISH.md`. The user-provided Cedar audio is the timing authority. Scene layouts and current object-attached caption positions are authored in `src/PorscheV3.tsx`; JSON cue coordinates are legacy fallback values. Earlier build files remain for comparison.

# Episode 001 — Why Porsche put the engine in the wrong place

## Research-backed claims used

- The first 911 retained Porsche's proven rear-engine layout, and the layout remains a defining 911 feature.
- Porsche itself cites improved traction as a benefit of putting engine mass over the driven rear wheels.
- Contemporary/retrospective road testing documents abrupt lift-throttle oversteer in early 911s.
- From model year 1969 the original 911 wheelbase grew by **57 mm**, primarily for calmer handling.
- The 993 introduced the LSA multi-link rear axle; Porsche describes it as improving stability and agility.

## Visual arc

Wrong place? → engine behind rear axle → traction benefit → rear-mass compromise → lift/rotation → +57 mm wheelbase → chassis evolution → 993 multi-link → modern 911 hero payoff.

## Source notes

Primary: Porsche Newsroom / Porsche official history pages. Handling context cross-checked against period/retrospective Car and Driver testing. Large source/ending footage remains excluded from Git. Three compact pre-ending footage derivatives are committed and can be regenerated with `scripts/prepare_polish.py` from the supplied Green Hornet source. No footage is presented as proof of historic loss of grip.
