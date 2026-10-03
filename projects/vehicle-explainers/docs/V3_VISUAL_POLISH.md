# Porsche V3 — visual execution polish

The user accepted the new presenter and existing story structure, then requested more aggressive visual execution with the oversteer sequence as the quality bar. This revision preserves every main shot boundary, narration word time and audio mix.

## Current visual authority

Re-inspected the entire supplied `191652.mp4` as a chronological half-second sequence. Its foreground replacements, component scale, small/large presenter changes and object-attached annotations inform this revision. This is an authored polish of our Porsche story, not a frame-for-frame copy.

Actual scene geometry and caption placement live in `src/PorscheV3.tsx`. `src/data/porscheV3.ts` still holds the original cue word timings, with old coordinate defaults used only where no scene override is authored. The JSON event map explicitly records this distinction.

## Changes

- Removed the blue Targa/cutaway from every active shot. Rear-engine explanation now uses a ghosted classic profile plus real flat-six photography. This is an explanatory external overlay, not a claimed exact cutaway view.
- Enlarged photographic subjects and cut through edges: rear profile, tyre, suspension assembly, 993 and actual 993 underside. Kept the light background and used denser, varied compositions rather than adding decoration.
- Packet Guy alternates between roughly 410–450px gesture poses and 1,000–1,620px reaction crops, with sudden jumps and opposite edge entries. The redesigned identity and art atlases remain unchanged.
- Type follows the pendulum with the engine, rotates with the oversteer event, touches/overlaps tyre surfaces and dimension lines, sits against the photographed underside, and is occluded by component silhouettes. Stat/digit treatments occupy the frame; individual positions/angles follow the subject.
- Display-font advance metrics prevent unintended word wrapping and accidental loss of the end of a phrase. Explicit line breaks remain; authored subject/portrait edge crops remain intentional.
- The established lift/rotation choreography remains and gets a larger last reaction plus type that follows car rotation.

## Three real-footage punches

All from the supplied Green Hornet Porsche 992 GT3 RS source. Source audio is muted; the approved narration continues. These are modern illustrative shots, not historic test footage or proof of oversteer.

| Timeline | Source in | Purpose | File |
|---|---:|---|---|
| 12.02–13.10s | 110.30s | Moving rear-quarter view at ADVANTAGE | `public/media/punches/advantage.mp4` |
| 16.42–17.72s | 26.20s | Real rear-wheel macro at TRACTION | `public/media/punches/traction.mp4` |
| 44.30–45.70s | 114.10s | Moving side view at chassis DEVELOPMENT | `public/media/punches/chassis.mp4` |

Each clip has an authored 9:16 crop. Compact derivatives are committed; the large source remains excluded. `scripts/prepare_polish.py` regenerates them with decoded output seeking and checks that each derivative contains usable video. Direct short input seeking in this source produced empty files at some timestamps, which was caught and corrected during lookdev.

## Reproduce

Follow the main README to prepare the existing ending footage, then use `npm run typecheck` and `V3_OUTPUT=out/PORSCHE_V3_VISUAL_POLISH.mp4 npm run render:v3`. The three pre-ending clips need no download/regeneration for a normal build. Their regeneration script is optional.

## Review

Lookdev inspected across the 25-shot structure and all three punches. Corrected unwanted wrapping, an occluded FLAT SIX caption, oversized text losing word endings, insufficiently visible reaction faces and the empty footage derivatives before full render. The first full export revealed a one-frame background flash at frame 1063 (17.7167s): rounded clip duration ended before the time-based footage selection. Changed footage coverage to end on the ceiling of the timeline end frame, then rendered the full video again. Inspected frames 1062–1064 in the corrected export: wheel footage continues until the direct cut to the reaction, with no intervening flash.

Reviewed the corrected full export chronologically at half-second intervals, including the last frame sequence and all three footage punches. Export is H.264/AAC, 1080×1920, 60 fps, 3,616 frames, 60.266667 seconds and 31,718,296 bytes. `npm run typecheck` passes. Decoded audio SHA-256 is `943deed49bd113f646b400b78b788b583ec0f6c6212e70dc292426fe3da3cb7d`, matching the previous approved V3 audio exactly.

Real-time audiovisual playback remains unavailable in this execution environment. Review uses complete chronological decoded frame sequences, narration timing and audio verification. Some historic profile imagery remains resolution-limited; the engine overlay and oversteer rotation are explanatory compositions. Presenter mouth shapes are not phoneme-synchronized.
