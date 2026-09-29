# NASA / FAA 1984 Controlled Impact Demonstration

Status: FINISHED V4 HYBRID DOCUMENTARY

This folder is the takeover handoff for the 26.6 second vertical documentary about NASA / FAA's 1984 Boeing 720 Controlled Impact Demonstration.

## Final render

Filename: NASA_FAA_1984_Controlled_Impact_Demonstration_V4.mp4

Specs:
- 1080x1920
- 9:16
- 30 FPS
- H.264 / yuv420p
- AAC 48 kHz
- duration: 26.602 s
- size: 53,294,838 bytes
- SHA-256: 18df956ad7c523f9b99417a4df5e3defafec12dfe01ff253900ad9e6884d0af2

The ChatGPT GitHub connector cannot upload the 51 MB local binary directly. The exact final MP4 has therefore also been persisted in the user's ChatGPT Library at:

/Video Projects/NASA FAA 1984 Controlled Impact/NASA_FAA_1984_Controlled_Impact_Demonstration_V4.mp4

A future ChatGPT agent on this account should search the Library for that exact filename instead of rebuilding unless edits are requested.

## Creative north star

REAL EVENT -> REAL PROOF -> STEP INSIDE IT WITH PS1 -> BACK TO REALITY -> VIOLENT REAL PAYOFF.

Real archival footage remains the majority. V4-style reconstruction is used only where the real cameras cannot clearly show the event: the uncrewed cabin and the yaw / wing-cutter failure. The real fireball is never replaced by CGI.

## Exact voiceover

NASA did this on purpose.

In 1984, NASA and the FAA remotely flew an uncrewed Boeing 720 into a prepared crash site.

They were testing a fuel additive designed to suppress post-crash fires.

But seconds before impact, the jet yawed off line.

A steel wing cutter smashed into an engine, fuel erupted, and the aircraft vanished inside a massive fireball.

The additive was never adopted.

Master VO file: openai-fm-alloy-audio.mp3
VO duration: 26.568 s

## Final edit structure

00_hook.mp4
- Controlled_Impact_Demonstration clip
- source 10.0s for 1.25s
- real fireball cold open

01_intact.mp4
- long NASA archive
- source 26.5s for 2.90s
- intact Boeing 720

02_dummy.mp4
- Controlled_Impact_Demonstration_2
- source 8.0s for 1.60s
- unique dummy / test imagery
- minimal text: NO CREW ABOARD

03_engineer.mp4
- long NASA archive
- source 68.0s for 1.60s
- engineer / technical context

04_approach.mp4
- long NASA archive
- source 90.5s for 2.85s
- real approach

05_cabin.mp4
- generated V4-style PS1 cabin
- 2.75s
- instrumented crash-test dummies, no real people
- secondary motion: harnesses, cables, sunlight, vibration, roll

06_realapproach.mp4
- Controlled_Impact_Demonstration
- source 4.5s for 2.70s
- return to reality

07_failure.mp4
- generated V4-style PS1 failure reconstruction
- 2.80s
- wing drop / yaw / dust / cutter / right inboard engine contact
- no CGI final explosion

08_impact1.mp4
- Controlled_Impact_Demonstration
- source 7.1s for 2.85s
- main real impact angle

09_impact2.mp4
- Controlled_Impact_Demonstration_3
- source 8.0s for 1.15s
- brief second real impact angle

10_fire.mp4
- long NASA archive
- source 102.2s for 1.80s
- real expanding fire

11_aftermath.mp4
- long NASA archive
- source 133.5s for 2.318s
- real aftermath / consequence

## Mandatory source use

All four supplied videos are used:
- From the NASA Archives: The Crash in the Desert [HcRyVEFDgGM].webm
- Controlled_Impact_Demonstration.ogv.240p.vp9.webm
- Controlled_Impact_Demonstration_2.ogv.240p.vp9.webm
- Controlled_Impact_Demonstration_3.ogv.240p.vp9.webm

CID #2 is NOT treated as an exterior crash angle. It is used for its unique dummy/test imagery.

## Archival presentation

The 320x240 CID clips use the user's preferred low-resolution presentation:
- original clip in the foreground
- enlarged synchronized copy of the exact same clip behind it
- soft blur on background
- no fake monitor frame
- no decorative unrelated background

Where a shot survives a vertical crop, full-frame presentation is preferred.

## V4 / PS1 direction

The actual repository engine-v4 folder currently contains the engine design README rather than a complete runnable package, so this project preserves the exact reconstruction generator used for this render in make_ps1_sequences.py.

Target look:
- low internal resolution
- nearest upscale
- authored angular geometry
- low-res textures
- affine / scan-strip instability
- subtle vertex / image wobble
- dithering
- posterisation
- color quantisation
- hard desert light
- deep cabin shadows
- dirty surfaces
- analogue softness
- subtle chromatic bleed
- no clean generic Three.js look

Important direction rule:
MORE WORLD EVENTS, NOT MORE CAMERA MOVEMENT.

## Sound decisions

Used:
- tanweraman-big-plane-sound-effect-247601.mp3
- freesound_community-metal-impact-30254.mp3
- soumages-iron-smash-with-debris-351841.mp3
- freesound_community-grand-feu-big-fire-gran-incendio-81140.mp3

Intentionally excluded:
- freesound_community-180218-airplane-in-flight-cabin-rumble-tone-voices-loop-bahamas-23090.mp3
Reason: contains intelligible modern passenger voices; the 1984 aircraft was uncrewed.

Not available in mounted inputs:
- u_xg7ssi08yr-jet-plane-fly-by-369631.mp3
No substitute was downloaded or fabricated.

## Rebuild

Place all named source media in /mnt/data, then run:

python /mnt/data/make_ps1_sequences.py
bash /mnt/data/build_cid_video.sh

For another workspace, update the absolute /mnt/data paths in the scripts or mirror the same filenames.

## QA already passed

Checked representative frames for:
- real cold-open fireball
- intact aircraft
- real dummy / technical context
- PS1 cabin
- real final approach
- PS1 failure / cutter contact
- first real crash angle
- second real crash angle
- real aftermath

The final MP4 fully decoded without frame errors.

## Files in this folder

- README.md — this takeover handoff
- build_cid_video.sh — exact archival cut, concat and audio mix
- make_ps1_sequences.py — exact PS1/V4-style reconstruction generator
- asset-manifest.json — filenames, hashes, durations and final-render verification

Do not make V5 for this project unless the user explicitly changes direction.
