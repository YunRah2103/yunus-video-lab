# Rally Finland V2 Refinement Notes

This branch is a **surgical refinement** of the approved V1 base. It does not change the concept, shot order, music source, drop point, or final hero jump.

## What changed

- Added `build_rally_v2.sh` rather than overwriting the approved V1 build.
- Preserved the crash → freeze → rewind → calm buildup → ~9.5 s monochrome drop structure.
- Kept every selected rally shot unique and in the same order.
- Added modest 2.5–5% reframing only on action shots where a tighter crop should make the car read larger in 9:16.
- Left jump shots with their original vertical breathing room to avoid clipping air/landing context.
- Refined the monochrome grade from V1's harder contrast to a slightly more detailed curve:
  - contrast 1.26 → 1.20
  - brightness -0.025 → -0.012
  - gamma 1.02 → 1.05
  - lighter grain and slightly gentler sharpening
- Raised encode quality from CRF 17 / veryfast to CRF 16 / slow.
- Kept the reference music dominant.
- Preserved real rally engine audio and added subtle source-derived physical layers for:
  - near-camera pass air/gravel
  - landing/body weight
  - final jump low-end body
- Added short fades on action audio cuts to reduce clicks without softening the visual cuts.
- Added output/loudness QA reporting.

## Deliberately unchanged

- crash length and role as a hook
- shot order
- calm-build durations
- ~9.5 s drop timing
- no text
- no HUD
- no glitch pack
- no constant shake
- no substituted supercar engine audio
- final hero jump composition

## Render

The V2 script expects the same three source files as V1 and outputs:

`/mnt/data/Rally_Finland_Cinematic_TikTok_Edit_V2.mp4`

Run:

```bash
bash build_rally_v2.sh
```

The original media and approved MP4 are intentionally not stored in this Git repository, so this branch preserves V1 and keeps V2 isolated for visual A/B review once the source files are mounted.
