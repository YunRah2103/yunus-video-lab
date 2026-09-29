# NASA / FAA 1984 Controlled Impact Demonstration — V4.2 Takeover

Status: **IMPROVED / RENDERED / QA PASSED**

This folder is the source + handoff for the improved 26.6 second vertical documentary about NASA / FAA's 1984 Boeing 720 Controlled Impact Demonstration.

## Current master

`NASA_FAA_1984_Controlled_Impact_Demonstration_V4_2.mp4`

- 1080 × 1920
- 9:16
- 30 FPS
- H.264 / yuv420p
- AAC 48 kHz
- duration: 26.600 s container duration (VO remains the original 26.568 s)
- size: 63,299,053 bytes
- SHA-256: `9f04eb71df1107fdeea70a8f7cab972f2dbe3497f3c2fbdef9a089aab449f855`

The render itself remains outside Git. Source footage/audio is stored in ChatGPT Library at:

`/Video Projects/NASA FAA 1984 Controlled Impact/`

## What changed from V4

This is a targeted upgrade, not a rebuild.

- Kept the real fireball as the first frame and hero payoff.
- Removed the weak early black test-site wall from the first five seconds.
- First five seconds now progress: **fireball → clean Boeing profile → low rear approach → real crash-test dummies**.
- Replaced the old `NO CREW ABOARD` aerial shot with actual dummy/cabin footage from CID #2.
- Rebuilt the PS1 cabin as a deeper Boeing-style interior with authored seat rows, instrumented dummy forms, X harnesses, cables, tags, window light, dust and inertia-driven secondary motion.
- Rebuilt the failure insert so the Boeing silhouette is much more readable: long fuselage, swept wings, four nacelles, tailplane, red cheatline/windows, visible yaw, cutter entry, contact flash, fragments and fuel/dust spray.
- Kept camera motion restrained. Energy comes from the world: straps, tags, dummies, dust, cutter vibration, fragments and fire.
- The failure insert hard-cuts back to the real crash.
- Strengthened the ending with real wing-in-fire / burning wreckage / smoke instead of an interior or graphic ending.
- Simplified the cutter sound to one readable transient, then used a separate crash impact transient when reality resumes.
- Fire ambience now continues underneath the real crash/fire/aftermath sequence.

## Exact voiceover — unchanged

> NASA did this on purpose.
>
> In 1984, NASA and the FAA remotely flew an uncrewed Boeing 720 into a prepared crash site.
>
> They were testing a fuel additive designed to suppress post-crash fires.
>
> But seconds before impact, the jet yawed off line.
>
> A steel wing cutter smashed into an engine, fuel erupted, and the aircraft vanished inside a massive fireball.
>
> The additive was never adopted.

Master VO: `openai-fm-alloy-audio.mp3`

## V4.2 timeline

- 00.00–01.25 — CID #1 real fireball hook
- 01.25–02.70 — long NASA archive, clean Boeing side profile
- 02.70–04.15 — long NASA archive, low rear approach
- 04.15–05.75 — CID #2 real instrumented crash-test dummies
- 05.75–07.35 — long NASA archive, technical cabin / instrumentation
- 07.35–10.20 — CID #1 real low approach
- 10.20–12.95 — improved PS1 cabin reconstruction
- 12.95–15.65 — long NASA archive, return to real approach
- 15.65–18.45 — improved PS1 yaw / cutter / engine-contact reconstruction
- 18.45–21.30 — CID #1 real crash angle
- 21.30–22.45 — CID #3 real tail-camera crash/fireball angle
- 22.45–24.25 — long NASA archive, real expanding fireball
- 24.25–25.50 — long NASA archive, wing inside burning wreckage
- 25.50–26.568 — long NASA archive, real burning/smoking consequence

All four supplied archival videos remain used.

## Archive presentation

Low-resolution CID material uses the established treatment:

**original synchronized clip in the foreground** over **a large synchronized blurred copy of the same clip**.

No fake monitors, borders or unrelated decorative backgrounds are added. Strong archive moments remain recognisably authentic.

## Reconstruction direction

The project remains Engine V4, not V5.

Target look:
- low internal resolution + nearest-neighbour upscale
- authored angular geometry
- dirty low-resolution surfaces
- posterised hard light
- crushed shadows
- ordered dithering / colour quantisation
- affine strip instability / texture wobble
- subtle chromatic bleed and analogue softness
- physical secondary motion

Direction rule: **CAMERA CONTROLLED. WORLD ACTIVE.**

## Sound design

Used:
- `openai-fm-alloy-audio.mp3` — master VO
- `tanweraman-big-plane-sound-effect-247601.mp3` — restrained aircraft bed / cabin rumble
- `soumages-iron-smash-with-debris-351841.mp3` — single cutter-contact transient
- `freesound_community-metal-impact-30254.mp3` — separate real-crash impact transient
- `freesound_community-grand-feu-big-fire-gran-incendio-81140.mp3` — hook + sustained fire bed

Not used:
- `freesound_community-180218-airplane-in-flight-cabin-rumble-tone-voices-loop-bahamas-23090.mp3` — contains passenger voices; aircraft was uncrewed.

Final mix QA measured approximately `-15.35 LUFS` integrated with `-0.51 dBTP` peak before any platform loudness adjustment.

## Rebuild

Place all source assets in `/mnt/data/cid_assets/`, then run:

```bash
python make_ps1_sequences.py
bash build_cid_video.sh
```

The scripts create the reconstruction frames, archival cuts, synchronized blurred-background presentation, audio mix and final H.264 master.

## QA completed

Checked:
- first frame / first 5 seconds
- archive-to-PS1 transitions
- cabin depth and secondary motion
- yaw → cutter → contact readability
- hard cut to real crash
- two real crash angles
- fire continuation
- final burning wreckage / smoke consequence
- 1080×1920 / 30 FPS / H.264
- full decode
- audio loudness / peak

Do not build Engine V5 for this project unless explicitly requested.
