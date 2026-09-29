# Rally Finland 2024 — Cinematic TikTok Edit

Status: **approved strong base / ready for refinement**

This project is a premium 9:16 rally TikTok edit built from:

- **Main footage:** `WRC Rally Finland 2024 | Flat Out & Big Jumps | 4K`
- **Crash hook:** `WRC2 Rally Highlights Day 2 with Oliver Solberg CRASH! | Secto Rally Finland 2021`
- **Music / pacing reference:** `Pure Speed junky’s ... #isleofmantt ...`
- **Current approved render:** `Rally_Finland_Cinematic_TikTok_Edit.mp4`
- **Runtime:** ~19.278 s
- **Output:** 1080x1920, 60 fps, H.264/AAC

## Creative structure

1. **0.00–0.90:** exterior Solberg crash hook
2. **0.90–0.98:** impact freeze
3. **0.98–1.50:** physical rewind using the crash itself
4. **1.50–9.50:** restrained cinematic Rally Finland buildup
5. **~9.50:** hard visual transformation into high-contrast monochrome
6. **9.50–19.28:** varied aggressive rally montage, saving a major jump for the end

## What already works

- The crash is a hook, not the subject.
- The rewind clearly turns the crash into a story setup.
- Calm-to-brutal pacing contrast is strong.
- Main drop commits to a premium monochrome motorsport identity.
- Action types vary instead of repeating the same corner/jump.
- Real source engine audio is layered under the reference music.
- The final jump is held longer as the hero payoff.

## Rules for the next agent

**Do not rebuild from scratch.**
Treat the current render and `build_rally.sh` as the base.

Preserve:
- crash → freeze → rewind concept
- ~9.5 s drop timing
- calm buildup
- black-and-white drop identity
- final hero jump
- no text / HUD / glitch spam / constant shake
- no repeated rally shots

Improve surgically:
- better vertical reframing where the car can be larger without clipping
- stronger natural occlusion/dust transitions where available
- more precise impact/landing sound accents
- slightly more premium B&W grade while retaining road, tyre and dust detail
- micro-adjust shot lengths against the music if a cut can land harder
- maintain realistic rally engine character

The base is already good. Changes should have a clear visual or rhythmic reason.

## Build

Run:

```bash
bash build_rally.sh
```

The script expects the three source files at the paths defined at its top. Update those paths if needed.

