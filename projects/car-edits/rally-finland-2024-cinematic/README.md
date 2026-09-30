# Rally Finland 2024 — Cinematic TikTok Edit

Status: **approved base — no unrelated music**

This is the current base for future improvement.

## Current base

- **Render:** `Rally_Finland_Cinematic_TikTok_Edit_BASE_NO_ISLE_OF_MAN.mp4`
- **Runtime:** ~19.3 s
- **Output:** 1080x1920, ~60 fps, H.264/AAC
- **Main footage:** `WRC Rally Finland 2024 | Flat Out & Big Jumps | 4K`
- **Crash hook:** `WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! | Secto Rally Finland 2021`
- **Pacing/style reference:** user-supplied `190804.mp4`

## Critical audio decision

The Isle of Man / superbike reference audio has been **removed completely**.

It did not match the rally footage.

The base soundtrack now uses only:
- real Solberg crash audio for the hook
- a short physical impact tail during the freeze
- reversed crash audio during the rewind
- exact Rally Finland source engine / gravel / pass audio from the corresponding visual shot

Do **not** restore the Isle of Man audio.

Do **not** substitute supercar, superbike or unrelated engine audio.

The current source-only mix is already around -13.5 LUFS and is intended as a clean foundation for better sound design.

## Visual structure

1. **0.00–0.90:** exterior Solberg crash hook
2. **0.90–0.98:** impact freeze
3. **0.98–1.50:** physical rewind
4. **1.50–9.50:** restrained cinematic buildup
5. **~9.50:** hard monochrome transformation
6. **9.50–17.14:** rapid motion-led B&W rally montage
7. **~17.14–19.28:** longer final hero jump payoff

## What is already working

- crash is only the hook, not the subject
- calm → aggressive pacing contrast
- post-drop cuts are mostly ~0.3–0.6 s, matching the editing language of `190804.mp4`
- no constant shake
- no text / HUD / glitch spam
- no deliberate repeated shots
- premium monochrome identity
- final jump is allowed to breathe
- authentic rally sound now follows the visuals

## Files to read before editing

1. `ASTRA_HANDOFF.md`
2. `ASSET_OPTIONS.md`
3. `build_rally.sh`
4. `NEXT_AGENT_PROMPT.md`

## Build

```bash
bash build_rally.sh
```

Optional environment overrides:
- `MAIN`
- `CRASH`
- `WORK`
- `FINAL`

There is intentionally **no REF/music input** anymore.
