---
name: engineering-production
description: Use for YUNEX 3D automotive film production, non-destructive proof renders, QA and release handoffs.
---

Work only in `YunRah2103/yunus-video-lab` on an explicitly assigned branch. Existing Porsche geometry, livery, environments, compositions, videos and approved narration are immutable unless the user separately authorises changes.

Use the opt-in toolkit tools in `production/` with the live YUNEX application in `yunex/`. New films must start with real source assets and a reviewed storyboard, not an assumed composition name. For proof runs, use `python production/tools/render.py --composition <ACTUAL_ID> --mode preview` from repository root, then `quality.py` for real FFmpeg decoder and FFprobe checks. Explicitly evaluate motion, proportions, wheels and suspension in actual frames before release. Use `production/tools/handoff.py` to validate cross-agent evidence. Do not silently modify existing YUNEX compositions or use the Remotion-gpt-chat demo subjects.
