# GPT-6 Astra — Rally Finland takeover

## Mission

Improve the existing approved base. Do not redesign or rebuild it.

Start from:
`Rally_Finland_Cinematic_TikTok_Edit_CLEAN_RICK_OWENS.mp4`

Matching source:
`build_rally.sh`

Read only this file + `build_rally.sh` before working.

## Assets already available — do not ask for re-uploads

ChatGPT Library:

- Current base:
  `/Video Projects/Rally Finland 2024/Rally_Finland_Cinematic_TikTok_Edit_CLEAN_RICK_OWENS.mp4`
- Clean music clip:
  `/Video Projects/Rally Finland 2024/RICK_OWENS_CLEAN_REFERENCE_AUDIO.mp3`
- Style/pacing reference:
  `/Video Projects/Rally Finland 2024/190804_REFERENCE.mp4`
- Main footage:
  `/WRC Rally Finland 2024 ｜ Flat Out & Big Jumps ｜ 4K [QyOQq-rZxP4].webm`
- Crash footage:
  `/WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! ： Secto Rally Finland 2021 [pHKZQEAZ37k].webm`

Search the Library for these exact names before asking the user for anything.

## Music is solved

The clean track is:
**Ufo361 — RICK OWENS (feat. Ken Carson)**

The user wanted this music, but NOT the Isle of Man man speaking over it.

The supplied clean TikTok audio has its strongest energy/drop transition at ~7.323 s.

The edit's monochrome/action drop is at ~9.500 s.

Therefore the clean song starts at:
**2.177 s**

This is already locked in `build_rally.sh`.

Current mix values:
- `MUSIC_DELAY=2.177`
- `MUSIC_GAIN=0.86`
- `RALLY_GAIN=0.58`
- finished mix ≈ **-13.2 LUFS / -1.0 dBTP**

Do not spend tokens re-identifying or re-aligning the song unless you find a concrete sync problem in the rendered base.

## Locked creative decisions

KEEP:
- ~19.3 s runtime
- 0.00–0.90 Solberg exterior crash hook
- 0.90–0.98 freeze
- 0.98–1.50 physical rewind
- crash/engine audio exposed before music enters
- calm cinematic buildup until ~9.5 s
- music drop + hard monochrome switch at ~9.5 s
- rapid ~0.3–0.6 s post-drop motion-led cuts
- long final hero jump payoff
- real rally engine/gravel underneath the song
- no text / HUD
- no constant shake
- no glitch / transition-pack spam
- no deliberate shot reuse

DO NOT use:
- Isle of Man spoken narration
- superbike engine audio
- generic replacement music
- supercar engine sounds
- extra crash footage
- random clips merely to increase shot count

A previous V2 was rejected. Preserve this base.

## What to improve

Spend effort on **sound design + micro-polish**, not reconstruction.

Highest-value opportunities:
1. Strengthen real pass-bys, gravel spray and genuine jump landings.
2. Keep any added SFX below the real rally source and music.
3. Refine only genuinely weak crops/cut points.
4. Optionally add 1–2 very short genuine Rally Finland onboard inserts (~0.2–0.4 s) if they clearly improve shot variety.
5. Preserve the fast reference-inspired second-half rhythm.

## Pre-researched optional assets — use before searching for alternatives

Audio:
- Rally rev/backfire:
  https://pixabay.com/sound-effects/rally-car-idle-loop-14-32339/
- Gravel-road pass:
  https://pixabay.com/sound-effects/film-special-effects-car-pass-gravel-road-far-blyth-21-6-12-62008/
- Near-camera pass:
  https://pixabay.com/sound-effects/film-special-effects-racecar-rushing-by-386164/
- Subtle landing thud:
  https://pixabay.com/sound-effects/film-special-effects-ground-impact-352053/

Optional onboard footage:
- Official WRC Rovanperä / Halttunen Ouninpohja:
  https://www.youtube.com/watch?v=ZRA6ySltVI0
- Official WRC Neuville / Wydaeghe Ouninpohja:
  https://www.youtube.com/watch?v=aqc-DyJR4qQ

Do not research more assets unless these are unavailable or a specific weakness genuinely requires something else.

## Efficient execution order

1. Read this file.
2. Read `build_rally.sh`.
3. Watch the full current base once.
4. Watch `190804_REFERENCE.mp4` only for pacing/style comparison.
5. Identify concrete weaknesses.
6. Make only justified changes.
7. Render the complete video.
8. Compare against the current base and keep changes only if clearly better.

## Deliverable

Render one finished **1080x1920 H.264 MP4**.

Do not stop at analysis, source code, or another handoff.
