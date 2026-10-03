# Porsche V3 — photographic reference rebuild

## Result

60.267 seconds, 1080×1920, 60fps, H.264/yuv420p with AAC audio. Composition: `Porsche-V3`. The user-supplied Cedar recording replaces synthetic timing narration and remains the narration source. Final mix raises the recording and restrained editorial accents by 5.5 dB.

## Main changes

- Quiet light studio backdrop grounded in the supplied reference rather than the old dark dashboard aesthetic.
- Real 1968 and 1969 profiles, classic 911/Targa imagery, modern GT3 RS footage/cutout, flat-six photographs, Michelin tyre visual and actual 993 undercarriage.
- 25 authored shots in `src/PorscheV3.tsx`; no generic six-mode layout governs V3.
- Giant skeptical/shocked Packet Guy head crops, edge intrusions, pointing gestures, side gaze, mouth swaps and intentional presenter-free component/stat beats.
- Typography has separate authored placement, scale, angle and layering for each phrase. Words interact with tyre, axle location, rotating classic, engine mass, number and hero car.
- Real objects replace one another: modern car → classic rear compartment → profile → flat-six → tyre → reaction → swinging engine → classic rotation → wheelbase comparison → stat → tyre → suspension → 993 → undercarriage → reaction → driving footage.
- +57 MM becomes a full-screen event at 38.14s; the 993 multi-link event occurs at 49.14s, matching the new narration.
- Final sequence uses the supplied Green Hornet source's 58–64.7s portion, with original source audio muted.

## Validation and fixes

- TypeScript check passed.
- Rendered full 3,616-frame MP4; decoded the full output and inspected the chronological 0.5-second frame sequence across the entire runtime, together with narration word timing and audio measurements.
- Re-rendered after correcting oversized/clipped captions, literal newline escapes, engine callout location, tyre asset loading and a reversed 1969 comparison profile.
- Final audio mix measured −17.21 LUFS integrated and −1.23 dBTP, with 3.2 LU loudness range; MP4 metadata checked after export. Audio gain is applied in the render wrapper, not baked into the supplied MP3.
- The final renderer and source are aligned; generated presenter crops can be recreated from the canonical generator.

## Review limitations

The V2 rendered master could not be located in GitHub or the current Library inventory. Its build notes and event map were read, and the supplied reference plus saved V1 were inspected directly. V2 was not falsely represented as an observed video. Review used the full chronological rendered frame sequence and audio analysis; real-time audiovisual playback was not available in this execution environment.

## Remaining asset limitations

Some historic profile/component photographs have limited resolution. The modern tyre is an illustrative tyre visual, not a claim about historic factory fitment. The oversteer rotation is an explanatory animation, not real footage of a 911 losing grip. The general suspension assembly accompanies the geometry beat; the 993-specific multi-link beat uses a documented 993 undercarriage photo. Masks retain minor edge softness in places. Packet Guy retains the established simple authored art and expression vocabulary rather than introducing an unrelated presenter.

## Reproduce

```bash
npm ci
python3 -m pip install -r requirements.txt
python3 scripts/prepare_v3.py --footage "/absolute/path/to/The Green Hornet source.webm"
npm run typecheck
npm run render:v3
```

If a Chromium executable is already installed:

```bash
npm run render:v3 -- --browser-executable=/absolute/path/to/chrome-headless-shell --concurrency=4
```

The provided narration, compact masked photographic assets, timing, source provenance and font license are committed. Large video source, generated poses, rendered MP4s, lookdev outputs and caches are intentionally excluded. Read `v3_asset_manifest.json` before replacing images. Do not revert to the V1 car SVGs or its ModeFrame path.
