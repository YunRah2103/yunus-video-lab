# ⚠️ NEXT AGENT

**GPT-6 Codex / next build agent: read `GPT6_CODEX_HANDOFF.md` FIRST.** Then read `docs/V3_BUILD_NOTES.md` for the completed rebuild and `docs/V3_REFERENCE_COMPARISON.md` for the reference diagnostic.

The V3 rebuild is implemented in `src/PorscheV3.tsx`, with shot/caption timing in `src/data/porscheV3.ts`. Its visual authority remains `191652.mp4`; V2 is a historical baseline, not a lock. The new user-supplied Cedar narration is the timing authority.

# Vehicle Explainers

Reusable short-form machine/vehicle explainer system built around Packet Guy V1.

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

V3 is 60.267 seconds at 1080×1920 / 60fps. It uses real Porsche/engine/tyre/suspension imagery, oversized and edge-cropped Packet Guy reactions, frame-specific typography, a +57 MM takeover and supplied Porsche footage for the final payoff.

Read `docs/V3_BUILD_NOTES.md`, `docs/V3_REFERENCE_COMPARISON.md` and `episodes/001-porsche-rear-engine/v3_asset_manifest.json` before revising. Large reference/source video and rendered MP4s are excluded from Git.

## Presenter pack

`scripts/generate_presenter.py` deterministically builds 12 transparent Packet Guy V1 poses plus master/turnaround references into `assets/presenter/`. `scripts/prepare_assets.py` creates any missing files and copies the pack into `public/presenter/` before Studio or render. The generated binaries stay out of Git; the authored character generator is the canonical asset source.

## Run

```bash
python -m pip install -r requirements.txt
npm install
python3 scripts/prepare_v3.py --footage "/absolute/path/to/The Green Hornet source.webm"
npm run typecheck
npm run studio
npm run render:v3
```

