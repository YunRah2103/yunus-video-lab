# Rally Finland 2024 — Cinematic TikTok Edit

Status: **V3 reference-informed refinement complete**

This project is a premium 9:16 rally TikTok edit built from:

- **Main footage:** `WRC Rally Finland 2024 | Flat Out & Big Jumps | 4K`
- **Crash hook:** `WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! | Secto Rally Finland 2021`
- **Music:** `Pure Speed junky’s ... #isleofmantt ...`
- **Pacing/style reference:** user-supplied `190804.mp4` (~19.3 s)
- **Current render:** `Rally_Finland_Cinematic_TikTok_Edit_V3.mp4`
- **Runtime:** ~19.3 s
- **Output:** 1080x1920, ~60 fps, H.264/AAC

## Creative structure

1. **0.00–0.90:** exterior Solberg crash hook
2. **0.90–0.98:** impact freeze
3. **0.98–1.50:** physical rewind using the crash itself
4. **1.50–9.50:** restrained cinematic Rally Finland buildup
5. **~9.50:** hard monochrome transformation with one very short reference-style exposure flash
6. **9.50–17.14:** rapid motion-led B&W rally montage
7. **~17.14–19.28:** longer final hero jump payoff

## What V3 changes

The previous approved base was already strong, so the opening and calm buildup are intentionally preserved.

The main change comes directly from the supplied `190804.mp4` reference: after its monochrome switch, the reference cuts extremely quickly, usually around 0.3–0.6 seconds, while keeping the subject in active motion. V3 applies that editing language to the rally footage rather than adding transition-pack effects.

V3 therefore:
- replaces the slower ~0.8–1.1 s post-drop rhythm with many shorter motion-led hits
- uses 17 distinct post-drop rally shots with no deliberate shot reuse
- uses hard cuts rather than shakes/glitch spam
- adds gentle shot-specific horizontal reframing instead of artificial camera shake
- preserves the long final jump as the payoff
- softens the monochrome grade slightly so tyre, gravel, dust and road detail survive
- syncs real rally engine/gravel audio to the exact new visual source moments while keeping the supplied reference music dominant

## Rules for future refinement

**Do not rebuild from scratch.**

Preserve:
- crash → freeze → rewind concept
- ~9.5 s drop timing
- calm buildup
- monochrome post-drop identity
- fast post-drop cadence inspired by `190804.mp4`
- final hero jump
- no text / HUD / transition-pack effects / glitch spam / constant shake
- no deliberate repeated shots
- realistic rally engine character

Only change something if the full rendered result is clearly stronger.

## Build

Run:

```bash
bash build_rally.sh
```

The script accepts optional `MAIN`, `CRASH`, `REF`, `WORK` and `FINAL` environment overrides; otherwise it uses the default `/mnt/data` paths.
