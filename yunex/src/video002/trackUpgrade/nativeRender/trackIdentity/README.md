# YUNEX 002 Racetrack Identity — F native render tooling

Phase: `Y002-RACETRACK-IDENTITY-02`

This folder is owned by Agent F. It intentionally does **not** change the film, Porsche, camera, track, audio mix, typography, or timing.

The phase render is fresh-only:

- render the Manager-pinned `render_source_sha`
- require E's registry status/output before full render
- render all frames 0–750 at 1080×1920, scale 1, 30 fps
- never reuse native chunks from older YUNEX 002 runs
- render `YUNEX-002-INTEGRATED-PROOF` muted in disjoint chunks
- render approved `YUNEX-002-FINAL` audio separately as AAC
- validate gap-free chunk coverage before concat
- mux video + approved audio once, with H.264/yuv420p/AAC and faststart
- decode the whole delivery, run motion and audio checks, and extract seven chronological native review frames

A normal push to `sol/y002-track-identity-render` runs preflight only. A full render is deliberately gated by the Manager registry. Once `render_source_sha` is pinned and E is PASS/complete with an output SHA, push an owned-file commit whose message contains `[track-identity-full]`. The workflow then reads the exact source SHA from the current Manager registry and renders that commit.

This prevents accidental rendering of the old environment and prevents historical workflow/chunk reuse.
