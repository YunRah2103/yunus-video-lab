# ⚠️ NEXT AGENT

**GPT-6 Codex / next build agent: read `GPT6_CODEX_HANDOFF.md` FIRST.** Then read `docs/V3_FRAMING_REBALANCE.md` for the latest framing pass and `docs/V3_VISUAL_POLISH.md` for the previous visual execution, `docs/PACKET_GUY_REWORK.md` for the presenter, `docs/V3_BUILD_NOTES.md` for the earlier photographic rebuild and `docs/V3_REFERENCE_COMPARISON.md` for the reference diagnostic.

The V3 rebuild is implemented in `src/PorscheV3.tsx`, with shot/caption timing in `src/data/porscheV3.ts`. Its visual authority remains `191652.mp4`; V2 is a historical baseline, not a lock. The new user-supplied Cedar narration is the timing authority.

# Vehicle Explainers

Reusable short-form machine/vehicle explainer system built around Packet Guy.

**Character source of truth:** `projects/stickman-studio/character/CHARACTER_SPEC.md`. This project consumes that identity; it does not redefine it.

## Format contract

- 1080×1920 vertical, authored for 60fps.
- Narration drives every visual beat.
- One meaningful visual event every ~0.5–1.2s; not necessarily a full scene cut.
- Captions are 1–4 words, not sentence subtitles.
- Numbers become visual events.
- V3 uses 25 individually authored shots; legacy six-mode V1 remains for comparison.
- V3 uses a quiet light studio background, photographic foreground, charcoal typography and cyan signature accent.
- Technical graphics only when they explain the narration. No generic cyber-HUD clutter.

## Current proof episode

`episodes/001-porsche-rear-engine/` — **Why Porsche put the engine in the wrong place**.

V3 is 60.267 seconds at 1080×1920 / 60fps. The current framing rebalance adds medium and hero-wide relief around the strongest close-ups, while preserving its 25-shot structure and Cedar timing, replaces the blue cutaway, pushes crop/scale changes and attaches typography to physical objects. Three short, committed footage punches appear before the supplied Porsche ending. Layouts are authored in `src/PorscheV3.tsx`; cue coordinates in the data file are fallback values, not the current layout authority.

Read `docs/V3_BUILD_NOTES.md`, `docs/V3_REFERENCE_COMPARISON.md` and `episodes/001-porsche-rear-engine/v3_asset_manifest.json` before revising. Large reference/source video and rendered MP4s are excluded from Git.

## Presenter pack

V3 now consumes `src/components/PacketGuyRework.tsx` and two committed transparent art atlases under `public/presenter/rework/`. The redesigned eyes, brows, face, hands and hoodie folds preserve the established identity. There are nine waist-up poses and four large reaction close-ups. Read `docs/PACKET_GUY_REWORK.md` before changing their viewports or replacing art. These production assets are retained unchanged; no image generation is required to reproduce the render.

`scripts/generate_presenter.py` and `scripts/prepare_assets.py` still build the legacy V1 pack for the legacy composition. Do not overwrite the current atlases with that generator.

## Run

```bash
python -m pip install -r requirements.txt
npm install
python3 scripts/prepare_v3.py --footage "/absolute/path/to/The Green Hornet source.webm"
npm run typecheck
npm run studio
npm run render:v3
```

The compact pre-ending footage clips are committed. To regenerate them from the supplied source, run `python3 scripts/prepare_polish.py --footage "/absolute/path/to/The Green Hornet source.webm"`. Use `V3_OUTPUT=out/PORSCHE_V3_FONT_FINAL.mp4 npm run render:v3` to choose the current delivery filename.

Current V3 typography uses committed Barlow Condensed ExtraBold (SIL Open Font License, `public/fonts/Barlow-OFL.txt`). Font-specific advance metrics preserve fit; the previous Display.otf remains for historical builds.
