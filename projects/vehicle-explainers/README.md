# ⚠️ NEXT AGENT

**GPT-6 Codex / next build agent: read `GPT6_CODEX_HANDOFF.md` FIRST.** Then read `NEXT_AGENT_PROMPT.md` and `docs/V2_BUILD_NOTES.md`.

The user reviewed V2: it is an improvement, but it still does **not** look close enough to the reference. `GPT6_CODEX_HANDOFF.md` is the current authority for the V3 rebuild. The V2 event timeline is a baseline, **not a lock**.

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

## Current proof episode

`episodes/001-porsche-rear-engine/` — **Why Porsche put the engine in the wrong place**.

V2 now has a reviewed 58.23-second vertical master and a locked micro-event timeline. It uses kinetic 1–3 word captions, larger presenter reactions, dedicated traction/pendulum/oversteer/component states, a prominent +57 mm statistic event, and a 911 CHARACTER payoff.

See `docs/V2_BUILD_NOTES.md` for what changed, known asset/audio limitations, and the next implementation step.

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
