# ⚠️ NEXT AGENT

**Read `NEXT_AGENT_PROMPT.md` before modifying or rendering this project.** The current V1 proof video is a weak baseline; the handoff defines the required V2 rebuild against reference `191652.mp4`.

# Vehicle Explainers

Reusable short-form machine/vehicle explainer system built around Packet Guy V1.

**Character source of truth:** `projects/stickman-studio/character/CHARACTER_SPEC.md`. This project consumes that identity; it does not redefine it.

## Format contract

- 1080×1920 vertical, authored for 60fps.
- Narration drives every visual beat.
- One meaningful visual event every ~0.5–1.2s; not necessarily a full scene cut.
- Captions are 1–4 words, not sentence subtitles.
- Numbers become visual events.
- Six modes: standard, statistic, technical, reaction, comparison, hero.
- Dark charcoal background, off-white typography, cyan signature accent; vehicle-specific secondary colour is allowed.
- Technical graphics only when they explain the narration. No generic cyber-HUD clutter.

## First proof of concept

`episodes/001-porsche-rear-engine/` — **Why Porsche put the engine in the wrong place**.

The episode uses the rear-engine layout to prove the full system: kinetic captions, Packet Guy pose swaps, technical callouts, 57 mm wheelbase statistic, handling explanation, multi-link rear-axle diagram and a real-footage hero payoff.

## Presenter pack

`scripts/generate_presenter.py` deterministically builds 12 transparent Packet Guy V1 poses plus master/turnaround references into `assets/presenter/`. `scripts/prepare_assets.py` creates any missing files and copies the pack into `public/presenter/` before Studio or render. The generated binaries stay out of Git; the authored character generator is the canonical asset source.

## Run

```bash
python -m pip install -r requirements.txt
npm install
npm run prepare:assets
npm run studio
npm run render:porsche
```
