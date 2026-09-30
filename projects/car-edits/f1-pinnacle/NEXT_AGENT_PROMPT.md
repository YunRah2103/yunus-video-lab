# GPT-6 ASTRA — F1 Pinnacle Final Build

## JOB
BUILD → POLISH → RENDER → WATCH FULL RENDER → FIX → RETURN PLAYABLE MP4.

Do **not** research, redesign, choose alternate clips, or add shots.  
Use **exactly** the 12 shots in `timeline.lock.json`.

Creative arc:
**SHOCK → CONTROL → PRECISION → TENSION → VIOLENCE → COMPETITION → ENGINEERING RESET → ESCALATION → SPARK PAYOFF**

Critical music event:
**7.192 s = MAIN DROP.** It must feel dramatically larger than everything before it.

## ASSETS
Use the exact filenames in `timeline.lock.json`.

Three screen recordings:
- `Screen_Recording_20260930_154218_YouTube.mp4` = fireball + onboard pack
- `Screen_Recording_20260930_154110_Samsung Browser.mp4` = external pack
- `Screen_Recording_20260930_153941_YouTube.mp4` = night trackside

These are 2340×1080 screen recordings. Remove ~210 px pillarboxing from **each side first**, then make the final 9:16 crop.

Master music:
`TikTok video #7317751406276939054 [7317751406276939054].mp3`

**Important:** the repository currently references this MP3 but does not contain the binary. If it is supplied in the task, use it. If not, use the audio bed from `F1_Pinnacle_Final.mp4` only as an emergency fallback.

## NON-NEGOTIABLE EDIT RULES
- Exactly **12 shots**.
- Mostly hard cuts.
- Only 2 authored hero transitions:
  1. **7.192 s** helmet cam → Monaco blast.
  2. **15.302 s** Monaco foreground occlusion → Bahrain sparks.
- No extra footage.
- No Singapore.
- No Suzuka.
- No crash aftermath.
- No repeated hero shot.
- No text, logo, fake telemetry, generic zoom/spin/glitch/VHS/flash spam.
- No whoosh on every cut.
- Preserve real F1 speed; no routine speed ramps.
- Bahrain finale only: ~0.90×.
- Use authentic source engine / pit / wheel-gun / floor-contact sound where useful.
- Music remains dominant.
- Peak master ≤ about -1 dBTP.
- Keep real F1 colour; protect Bahrain spark highlights.
- Helmet-cam vertical crop must preserve road + halo + steering interaction.
- For pack footage, crop to preserve **multiple cars**, not one isolated car.

## MAIN DROP
At 7.192 s use Monaco source **05.00–05.482**.

Do **not** use the old documented Monaco range around 02.22–02.70. That was a weak/late section and was one reason the previous edit failed.

## EXPORT
- 1080×1920
- 9:16
- 30 FPS CFR
- H.264 High Profile
- Rec.709 SDR
- ~20–30 Mbps video
- AAC 48 kHz high bitrate
- no unnecessary recompression

## FINAL QC
Watch the whole render before returning it.

Confirm:
- fireball is gone by 0.700 s
- calm contrast after hook works
- pit sequence feels precise, not filler
- helmet cam breathes until 7.192
- 7.192 drop feels massive
- post-drop visibly adds multi-car competition
- pack shots end before later incidents
- no screen-recording pillarboxes
- no baked social/driver text visible after crop
- Austria shot clearly shows many cars
- Monaco → Bahrain occlusion is clean
- Bahrain sparks are the strongest final image
- no black frames / optical-flow damage / clipped audio
- no outro

If anything is wrong: **fix and re-render before returning the MP4.**
