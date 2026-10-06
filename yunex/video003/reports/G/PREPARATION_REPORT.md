# YUNEX 003 — Agent G preparation report

Phase: Y003-SUSPENSION-AERO-01  
Role: G — Native render pipeline and final export  
Initial preparation input: 50fd478256bbe12d37410e78678bd7c302d96434  
Work branch: sol/y003-render

## Status

PREPARATION COMPLETE / FINAL NATIVE RENDER BLOCKED BY MANAGER GATE.

At the time of this report, `sol/y003-suspension-manager:yunex/video003/TASKS.json` still has `render_source_sha: null`. Per the Manager and G handoffs, a full native Y003 render must not start until H has accepted the integrated moving proofs and Manager has pinned the exact render source SHA.

## Implemented

- Dedicated Y003-only GitHub Actions native render workflow.
- Exact 40-character source-SHA guard for benchmark/full modes.
- Locked Porsche SHA256 verification before every render.
- Deterministic inclusive chunk matrix generation.
- Fresh native 1080x1920 scale1 30fps H264 yuv420p chunk rendering.
- Per-chunk source SHA, frame range, config and SHA256 provenance.
- Gap/overlap/source/dimensions/FPS/codec/pixel-format/frame-count chunk validator.
- Composition audio rendered once as AAC, avoiding AAC seams across visual chunks.
- Copy-only visual concatenation and one final audio mux with faststart.
- Complete ffmpeg decoder pass plus exact decoded-frame final validation.
- Seven native milestone-frame extraction and contact-sheet generation.
- Immutable export manifest with source, pipeline, workflow, model, audio and final digests.
- Final playable MP4 and proof bundle uploaded as GitHub Actions artifacts rather than committed to Git.

## Validation

Workflow: `YUNEX 003 native render and delivery`  
Self-test run: https://github.com/YunRah2103/yunus-video-lab/actions/runs/37537253683  
Result: PASS.

Jobs:
- config: PASS
- selftest: PASS
- benchmark/full jobs: correctly SKIPPED because no native render request was authorized

The self-test validates Python syntax, deterministic chunk coverage generation and the Y003 composition/request guard.

## Full-render release procedure

Once Manager publishes `render_source_sha`:
1. Set that exact full SHA and the Manager's actual composition frame count in `yunex/video003/render/request.json`.
2. Push `[native-benchmark]` to validate a short native source render.
3. If benchmark passes, push `[native-full]`.
4. The workflow renders all chunks from the exact same source, renders audio once, assembles, fully decodes/validates and publishes the final artifact plus seven native frames.

No chunk from a different source SHA may be reused.

## Current blocker

Exact next requirement: Manager must publish a non-null `render_source_sha` after H integrated moving-proof acceptance. Until then, generating a full film would violate the authoritative handoff and risk rendering stale/incomplete Y003 content.
