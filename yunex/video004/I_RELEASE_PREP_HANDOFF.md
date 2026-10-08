# YUNEX 004 — AGENT I / RELEASE PREPARATION AND AUDIO SOURCE BRIDGE

**Role:** Release engineer, independent parallel workstream. **NOT** animation integration, final rendering or QA.
**Repository:** `YunRah2103/yunus-video-lab`
**Phase:** `Y004-REAR-STEERING-01`
**Dedicated branch:** `sol/y004-i-release-prep`, created from the full Manager dispatch commit that contains this file. Confirm remote SHA before work.

Read `yunex/video004/START_HERE.md`, `MANAGER_CONTRACT.md` (especially Agent I amendment), `TASKS.json`, `VOICEOVER_SOURCE_LOCK.json`, `VOICEOVER_INTEGRATION_UPDATE.md`, this handoff, E's `yunex/video004/render/README.md`, E's `.github/workflows/yunex-004-native-release.yml`, and G's latest `sol/y004-g-render/yunex/video004/reports/G/RENDER_PREFLIGHT.md`.

## Situation
- Agent H is exclusively completing Y004 final visual integration/VO timing. Its current initial dispatch baseline is `5914ddcabaeec4b14ff5e3ca6bcbaf4e6e71a1bb`; check current SHAs rather than trusting this snapshot. **DO NOT TOUCH H'S FILES**.
- Agent G has working FFmpeg/Remotion pipeline from Agent E but cannot start the real 720f render until Manager exact source lock and F independent native proof PASS.
- D finished new Cedar narration and 24s AAC 48k stereo final approved mix. D branch SHA `9567f6b2efa901d3667d084eedbbca9c98943c36`. Approved AAC SHA256 **`a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`**, size **753,974 bytes**. User Library `/Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`.
- Current E workflow is on project branches, **not registered on default `main`**, so manual `workflow_dispatch` may be unavailable. G has identified this problem. You must investigate/solve this *without* disabling release gates or colliding with G's/E's source. The GitHub connector may not expose a dispatch action; do not assert launches you did not perform.

## Your two deliverables

### 1. Make real Cedar AAC accessible from final immutable source
Fetch the exact approved original **M4A** from the connected user's Library or supplied attachment (NOT just its JSON manifest). Verify 753974-byte original and SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`; `ffprobe` should confirm 24.000s AAC 48k stereo; full decoder pass. Add exactly this existing small audio file to YOUR branch at `yunex/video004/audio/y004-approved-cedar-24s.m4a`. Do not modify or regenerate its content. Do not overwrite D's source MP3 or WAV. Document source Library ID if accessible and hash. If Library file access is unavailable, report **BLOCKED: bytes unavailable** clearly and still work on #2, rather than committing silent placeholders or creating a different mix.

### 2. Clear workflow launch blocker ahead of Agent G
Investigate actual GitHub Actions workflow registration and capabilities in this repository. Current `.github/workflows/yunex-004-native-release.yml` is a manual dispatch workflow not on default `main`; GitHub typically requires default branch registration. Choose least invasive supported approach and prepare demonstrable *gated* execution path that starts only after Manager publishes `render_source_sha`, `locked_frames=720`, `pre_render_qa_status="PASS"` and `pre_render_qa_evidence` for the exact source. You can create a separately named `.github/workflows/yunex-004-i-*.yml` if needed, but do NOT reimplement rendering or silently edit the original E workflow. Reuse existing E `render/pipeline.py` and native-release workflow logic. No changes to default `main` without explicit Manager approval; no full 720-frame render now. Validate preflight via dry-run/synthetic test on your branch with explicit run ID, if possible. If an authorized manual run is not possible with connected tools, provide exact tested reproduction commands and a supported alternative to G (branch push launch or local runner), with real limits.

## Strict file ownership
ALLOWED:
- `yunex/video004/release-prep/**` (scripts/runbooks/preflight);
- `yunex/video004/reports/I/**`;
- `yunex/video004/audio/y004-approved-cedar-24s.m4a` (exact approved bytes and SHA only);
- `.github/workflows/yunex-004-i-*.yml` (namespaced new workflow, *no release until gates*).

NOT ALLOWED:
- `yunex/src/**`, `yunex/src/index.tsx`;
- `yunex/video004/TASKS.json` (Manager only);
- H's scene/timeline/rig/VO/cameras;
- existing E workflow or render pipeline, or Agent G's release reports;
- A/B/C/D/F's previously approved source, Porsche GLB, Y003 legacy assets;
- push to `main`, force push, use unapproved master audio, or start 720f native film.

## Acceptance and exit
Deliver concrete implementations, tests, an actually byte-verified approved M4A if available, working launch path or accurate blocker, and `reports/I/RELEASE_READY.md` with evidence. Push to `sol/y004-i-release-prep`; return FULL remote SHA, changed files, test/run/artifact IDs and residual blockers. Manager will merge your approved narrow changes with H into final candidate; F must inspect moving proof at exact merged source SHA before Manager releases G. Do NOT claim final film done.
