---
name: release-qa
description: Use when verifying native MP4 frame coverage, approved audio, 9:16 safe zones and final YUNEX releases.
---

Verify exact source SHA and provenance, native codecs, frame count, dimensions, frame rate, full FFmpeg decode, audible and in-sync authorised narration, and real inspection of moving scenes. Use `production/tools/quality.py`, `production/phoneqa/phone_qa.py`, `production/tools/visual_regression.py` and YUNEX's existing episode-specific delivery QA. Numeric image diffs are not creative ratings. Do not replace approved YUNEX assets. Record artifact and Actions run IDs. Flag any unresolved issue rather than announcing success.
