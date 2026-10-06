# F — Native Render / Final Delivery — preflight status

Phase: **Y002-RACETRACK-IDENTITY-02**  
Role: **F_RENDER**  
Branch: **sol/y002-track-identity-render**

## Implemented in this branch

- Phase-specific GitHub Actions render workflow.
- Fresh native chunk render of frames 0–750 only; old YUNEX 002 chunks are never reused.
- Exact Manager-registry source gate for `render_source_sha`.
- Agent E completion/output gate before a full render is allowed.
- Native 1080×1920 scale-1 / 30fps / 751-frame validation.
- Approved Porsche SHA-256 guard.
- Approved `d_mix.wav` SHA-256 guard.
- Audio-only Remotion render from `YUNEX-002-FINAL`, then single final mux.
- H.264/yuv420p/AAC/faststart delivery validation.
- Full decode, temporal motion validation, audio loudness/peak validation and seven-beat review frames.

## Current dependency

At the time this preflight branch was created, Manager's `TASKS.json` still had `render_source_sha: null` and E had not yet published a passing integrated-QA output SHA. Therefore no old/baseline full film was rendered. This is intentional and required by the handoff.

The full render is released only after Manager pins the integrated source and E passes it. Trigger with an owned-file push whose commit message includes `[track-identity-full]`.
