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


## Review-evidence release

Manager has now pinned integrated source `3ee36a708e2a466c0822431af940cf0be47b1c01` and E has published static PASS / visual-evidence BLOCK at `4e9e70ab9343e9d7c9f23d9a21e06492da45a71a`.

The workflow therefore has a separate **review** path which is allowed before final E visual approval. It must render only from the exact Manager-pinned source and produce:
- seven native 1080x1920 beat PNGs at frames 18 / 114 / 210 / 336 / 456 / 600 / 705;
- a labelled reduced-resolution 30 fps moving continuity proof;
- E-validator output for that evidence package.

This review path does **not** mean E has passed and does **not** release the final full/master path. Final full rendering remains gated on E final visual PASS.
