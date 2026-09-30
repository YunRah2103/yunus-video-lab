# NEXT_AGENT_PROMPT — F1 Pinnacle TikTok

## Mission

BUILD, POLISH, RENDER, WATCH, FIX IF NEEDED, AND RETURN THE FINISHED PLAYABLE MP4.

Do **not** repeat pre-edit research. The supplied footage has already been inspected and the useful source ranges are locked below. Spend effort on execution, timing, reframing, sound mix, colour matching and final QC.

Target feeling: **the pinnacle of motorsport** — precise, expensive, mechanical, dangerous, extremely fast, cinematic. Not a generic shake/zoom/glitch F1 montage.

Story: **anticipation → pit precision → driver immersion → main drop → racing speed → brief technical contrast → final attack.**

Final master duration: **~16.76 s**.

---

## Asset aliases

Use the exact user-supplied files:

- **AUS** — `POV： You're Trackside For The Race Start In Austria 🤩 [Z_WlHvUtGUc].webm`
- **MON** — `Formula 1 - Nothing beats going trackside at Monaco! 😍👀  #F1 #MonacoGP [2062872040952979456].mp4`
- **PIT** — `Pure Pit Stop Perfection 👌 [4qQp-P5PpFM].webm`
- **RBP** — `POV： You're doing a pitstop for #RedBullRacing 😏 #F1 [_qFb2g8rmFI].webm`
- **HEL** — `Charles Leclerc ｜ Helmet Cam Lap ｜ 2023 Monaco Grand Prix [aQaAaMaFxBE].webm`
- **SUZ** — `Special track 🏎 #suzukacircuit [WExeVs0GFnQ].webm`
- **BHR** — `Sparks were flying in Bahrain! 🎆 #Shorts [tpx0_uFf0qc].webm`
- **REF** — `the pinnacle of motorsport everybody ｜｜ #f1 #formula1 #f1edit #aesthe... [7542213093112188215].mp4`
- **MUSIC** — `TikTok video #7317751406276939054 [7317751406276939054].mp3`

Do **not** use `Singapore GP ｜ Pure F1 Night Fever [weTa39p1gDo].mkv`. It is 640×360 and visibly lowers quality.

The SUZ file is mostly Ferrari/Leclerc paddock material. Use **only ~01.38–02.22**, the useful on-track section.

REF is style-only. Never use its video as source material.

---

## Locked edit timeline

Use these cuts as the primary edit. Fine-adjust only by a few frames if needed to land cleanly on a real source action or transient; do not redesign the sequence unless a technical problem makes a range unusable.

| Final | Asset | Source | Action / purpose |
|---|---|---|---|
| **0.000–1.498** | AUS | **01.85–03.35** | Recognisable F1 car approaches and passes trackside. Controlled opening. Car visible immediately. |
| **1.498–2.444** | PIT | **05.35–06.30** | Overhead car enters box; mechanics converge. |
| **2.444–3.402** | RBP | **14.30–15.26** | Close wheel-gun / tyre operation. Primary mechanical hit. |
| **3.402–4.325** | PIT | **07.56–08.48** | Crew clears; car releases from pit box. |
| **4.325–7.192** | HEL | **33.20–36.07** | Long pre-drop driver immersion; darker Monaco section develops into brighter street running. |
| **7.192–7.674** | MON | **02.22–02.70** | **MAIN DROP:** car explodes past the very close Monaco camera. |
| **7.674–8.510** | SUZ | **01.38–02.22** | Ferrari on-track cornering/lateral movement. |
| **8.510–9.102** | AUS | **05.78–06.37** | Extreme close trackside pass + natural pan. |
| **9.102–10.019** | HEL | **50.42–51.34** | Fast steering corrections, Monaco walls, driver-machine intensity. |
| **10.019–11.000** | BHR | **04.70–05.68** | Clean Mercedes side-tracking race shot. Do **not** spend the hero sparks yet. |
| **11.000–11.906** | RBP | **16.62–17.53** | Car releases directly away from pit-crew POV. Brief technical contrast. |
| **11.906–12.922** | HEL | **51.45–52.47** | Tight onboard steering/wall interaction. Let it breathe. |
| **12.922–14.350** | AUS | **18.75–20.18** | Wider pack/race-start atmosphere; scale back up to full race environment. |
| **14.350–15.302** | MON | **09.55–10.50** | Best complete Monaco approach → foreground pass → exit. Natural occlusion into finale. |
| **15.302–16.758** | BHR | **12.72–14.03**, ~**0.90×** | **FINAL HERO:** Mercedes compresses/bottoms out → huge spark shower → glowing trail. Hold to music end. |

### Music anchors

MUSIC is the master. Useful detected anchors, in final-timeline seconds:

`0.000, 1.498, 2.444, 3.402, 4.325, 5.254, 5.759, 6.264, 6.734, 7.192, 7.674, 8.150, 8.510, 9.102, 9.578, 10.019, 10.524, 11.000, 11.906, 12.458, 12.922, 13.398, 13.874, 14.350, 14.826, 15.302, 15.778, 16.144, 16.498, 16.736`

**7.192 s is the critical main energy transition.** The cockpit → Monaco pass cut must land there.

Do not force a cut on every listed anchor. The 4.325–7.192 helmet shot intentionally spans several beats to create contrast before the drop.

---

## Edit rules

### Pacing / transitions

- Opening half = controlled and premium; second half = substantially faster.
- Mostly **hard cuts**.
- Use real movement/occlusion as transition language:
  - cockpit → close Monaco blast at 7.192
  - car crossing lens → hidden cut
  - wheel/mechanic occlusion where naturally available
  - Monaco foreground pass → Bahrain finale
- Do **not** build around transition presets.
- No generic zoom/spin transitions, RGB spam, glitch spam, VHS, random white flashes, constant shake, fake camera motion, fake HUD/telemetry, giant typography or F1-logo intro.
- No repeated footage.
- No AI-generated F1 imagery.

### Speed

- Preserve real speed.
- No routine speed ramps.
- Finale BHR range: about **0.90×** only; source is 50 FPS, so keep motion clean.
- Tiny timing adjustments are allowed only to resolve frame boundaries.
- Reject optical-flow artefacts on tyres, wings, barriers or sparks.

### 9:16 crop

Output is **1080×1920**.

Vertical sources: preserve natively where possible.

**AUS/BHR:** social-source text appears near upper areas. Remove it by tasteful reframing/crop only, roughly **108–112% scale** if needed, with a lower vertical anchor. Never cover text with blur bars or graphics.

**HEL:** source is 1920×1080 landscape. A natural 9:16 crop uses roughly **607 px of source width** before scaling. Keep:
- road
- halo
- meaningful steering interaction

Allow modest horizontal crop tracking. Do not stretch. Do not zoom into a blurry steering wheel. Do not crop away all track context.

### Colour

Keep real F1 colour:
- deep but detailed blacks
- clean whites
- rich reds/blues
- metallic reflections
- controlled highlights
- vivid but not clipped Bahrain sparks

Normalise exposure/contrast enough for continuity, but preserve location identity. Do not slap one LUT over every source. Do not make the whole edit monochrome. REF's monochrome-heavy treatment is **not** to be copied.

### Sound

MUSIC always remains the master.

Layer authentic source sound only where it adds physicality:
- AUS: engine / pass ambience
- PIT/RBP: pit ambience, wheel gun, mechanical contact, launch
- HEL: real engine/transmission texture
- MON: aggressive real pass-by
- BHR: engine + floor/spark-strike texture if clean

At **7.192**, let the MON pass-by momentarily punch through enough to make the drop physical.

At the final BHR spark sequence, retain genuine engine/floor texture under MUSIC.

Do not use fake supercar audio. Do not put a generic whoosh on every cut. Do not stack unnecessary bass impacts on already-strong music hits.

If source audio contains conflicting baked-in music, mute or isolate only usable physical audio.

No clipping.

---

## Reference style distilled

Do not spend tokens re-analysing REF unless needed for a quick visual check.

Borrow only:
- prestige-heavy restraint at the start
- purposeful perspective changes
- meaningful escalation
- confident hard cuts
- motorsport atmosphere
- shorter shots after the energy transition

Do not copy:
- its exact timeline
- its footage
- its near-monochrome overall look
- flash-heavy/micro-cut behaviour

---

## Export

Return the finished playable MP4.

- **1080×1920**
- **9:16**
- **30 FPS CFR**
- H.264 High Profile
- high-quality TikTok master, roughly **20–35 Mbps**
- AAC, **48 kHz**, high bitrate
- Rec.709 SDR
- audio peak at or below about **-1 dBTP**
- no unnecessary 60 FPS interpolation

Do not stop at project/source code. Render the final file.

---

## Final QC — mandatory

Watch the complete render before returning it and fix any issue you notice.

Confirm:

1. F1 car appears immediately in the opening.
2. No visible creator/social captions remain.
3. No Singapore footage.
4. No repeated source moment.
5. HEL crops preserve road + halo + readable driver context.
6. No ugly landscape enlargement.
7. Main transformation lands at **~7.192 s**.
8. The Monaco blast at 7.192 feels dramatically larger than the cockpit shot before it.
9. No gratuitous transition preset, shake, glitch or fake telemetry.
10. No accidental black frame.
11. No optical-flow distortion.
12. Bahrain hero sparks retain orange detail and controlled highlights.
13. Strongest sparks are saved until **15.302 s onward**.
14. Finale holds until MUSIC ends; no logo/end card.
15. SFX reinforce MUSIC rather than overpower it.
16. Intensity clearly escalates across the 16.76 seconds.
17. The edit is coherent muted and substantially stronger with sound.
18. Final output is a playable MP4, not only code.

If the render has a visible mistake, fix and re-render before returning it.
