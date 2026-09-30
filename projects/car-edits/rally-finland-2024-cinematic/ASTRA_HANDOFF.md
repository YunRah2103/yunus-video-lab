# GPT-6 Astra — Rally Finland takeover

## Mission

Improve the existing approved base. Do not redesign or rebuild it.

Start from:
`Rally_Finland_Cinematic_TikTok_Edit_BASE_NO_ISLE_OF_MAN.mp4`

Matching source:
`build_rally.sh`

Only read this file + `build_rally.sh` before working. README is optional background.

## Assets already available — do not ask for re-uploads

ChatGPT Library:

- Base render:
  `/Video Projects/Rally Finland 2024/Rally_Finland_Cinematic_TikTok_Edit_BASE_NO_ISLE_OF_MAN.mp4`
- Style/pacing reference:
  `/Video Projects/Rally Finland 2024/190804_REFERENCE.mp4`
- Main footage:
  `/WRC Rally Finland 2024 ｜ Flat Out & Big Jumps ｜ 4K [QyOQq-rZxP4].webm`
- Crash footage:
  `/WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! ： Secto Rally Finland 2021 [pHKZQEAZ37k].webm`

Search the Library for these exact names before asking the user for anything.

## Locked creative decisions

KEEP:
- ~19.3 s runtime
- 0.00–0.90 Solberg exterior crash hook
- 0.90–0.98 freeze
- 0.98–1.50 physical rewind
- calm cinematic buildup until ~9.5 s
- hard monochrome switch at ~9.5 s
- rapid ~0.3–0.6 s post-drop motion-led cuts
- long final hero jump payoff
- no text / HUD
- no constant shake
- no glitch / transition-pack spam
- no deliberate shot reuse
- real rally engine/gravel audio as the backbone

DO NOT restore:
- Isle of Man / superbike audio
- generic replacement music
- supercar engine sounds
- extra crash footage
- random clips just to increase shot count

History: a previous V2 was rejected. The current base is the version to preserve.

## What to improve

Spend effort on sound design + micro-polish.

Highest-value improvements:
1. Strengthen real pass-bys, gravel spray and jump landings.
2. Keep added SFX quieter than authentic rally source audio.
3. Refine only genuinely weak crops/cut points.
4. Optionally add 1–2 very short genuine Rally Finland onboard inserts (~0.2–0.4 s) if they materially improve shot variety.
5. Preserve the reference-inspired fast second-half rhythm.

Current clean mix is about -13.5 LUFS. Do not crush transients.

## Pre-researched optional assets — do not search unless these fail

Audio:
- Rally rev/backfire texture:
  https://pixabay.com/sound-effects/rally-car-idle-loop-14-32339/
- Gravel-road car pass:
  https://pixabay.com/sound-effects/film-special-effects-car-pass-gravel-road-far-blyth-21-6-12-62008/
- Short near-camera pass:
  https://pixabay.com/sound-effects/film-special-effects-racecar-rushing-by-386164/
- Subtle landing thud:
  https://pixabay.com/sound-effects/film-special-effects-ground-impact-352053/
- Alternate field-recorded pass:
  https://pixabay.com/sound-effects/car-passing-sound-soundque-field-recording-442774/

Footage — only if an onboard insert is genuinely useful:
- Official WRC Rovanperä / Halttunen Ouninpohja onboard:
  https://www.youtube.com/watch?v=ZRA6ySltVI0
- Official WRC Neuville / Wydaeghe Ouninpohja onboard:
  https://www.youtube.com/watch?v=aqc-DyJR4qQ
- Extra exterior footage, lower priority:
  https://www.youtube.com/watch?v=8JMFB204THc

Do not spend tokens finding alternatives unless a listed asset is unavailable or clearly unsuitable.

## Efficient execution order

1. Read this file.
2. Read `build_rally.sh` — it contains exact source timestamps, durations, crops and audio trims.
3. Load/watch the current base and `190804_REFERENCE.mp4`.
4. Identify only concrete weak points.
5. Use existing source footage first.
6. Use the pre-researched optional assets only where they solve a specific weakness.
7. Render and judge the full video.
8. Keep a change only if the finished edit is visibly/audibly better.

## Deliverable

Render one finished 1080x1920 H.264 MP4.

Do not stop at analysis, source code, or a handoff.
