# Vehicle Explainer V2 — Build Notes

## Status

A complete Porsche rear-engine V2 video was built and reviewed on 2026-10-03.

Validated output:
- 1080×1920
- 60fps
- 58.23 seconds
- narration + sound design
- exact micro-caption/event timing stored in `episodes/001-porsche-rear-engine/v2_visual_timeline.json`

The rendered MP4 is intentionally not committed to GitHub.

## What changed from V1

V2 stops treating each narration sentence as one infographic slide. The foreground now changes at word/short-phrase level.

Major changes:
- 1–3 word kinetic caption beats instead of sentence-like captions
- larger Packet Guy reaction crops and more frequent pose changes
- car/component/diagram changes tied directly to narration
- much quieter background with almost no persistent interface chrome
- dedicated traction, pendulum, oversteer and rear-suspension visual states
- a full-screen-style `+57 MM` wheelbase statistic event
- final payoff built around `911 CHARACTER` rather than a technical dashboard ending

## Locked retention beats

The most important moments to preserve are:
- 0–3.5s: WRONG / PLACE / ENGINE? hook
- 6–10.7s: flat-six position behind the rear axle
- 10.7–13.6s: TRACTION event
- 18–22s: rear mass shown as a pendulum
- 22–28s: lift-off / rear rotation sequence
- 28–33.8s: 1969 +57 MM wheelbase comparison
- 42.5–49s: 993 multi-link rear-axle sequence
- 49s onward: WEIRD PLACE? → YES. → 911 CHARACTER payoff

## Asset limitation

The original reference and weak-baseline MP4 binaries were not available to the build environment during this pass. The handoff analysis was available, so the rebuild follows its documented hierarchy and timing principles.

The build environment also could not fetch production photographic Porsche cutouts. The reviewed V2 therefore uses authored procedural automotive/component artwork rather than pretending low-quality web assets are final photography.

When suitable licensed/provided Porsche imagery is available, replace the procedural car/component art while preserving the validated V2 timing and foreground rhythm.

## Audio limitation

The review master uses synthetic local narration so the complete timing could be rendered and checked end-to-end. A production voice track can replace it later, but the visible events should be retimed only where the replacement VO genuinely requires it.

## Next implementation step

Port the validated V2 event map into the reusable Remotion system rather than reverting to V1 sentence-level timing. The event map is the source of truth for foreground rhythm.
