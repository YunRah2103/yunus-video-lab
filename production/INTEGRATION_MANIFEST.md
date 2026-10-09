# Remotion production toolkit → YUNEX migration manifest

- **Source:** `YunRah2103/Remotion-gpt-chat` commit `25a83c4e58e60c909624494745158385b7f962d9` (read-only)
- **Destination:** `YunRah2103/yunus-video-lab` on `tooling/remotion-production-suite-20261009`
- **Merge base:** YUNEX `main` at `eba29eb10d58519800484aaa6c5fa4614150bcfd`
- **Type:** tools, tests, opt-in workflows and agent instruction profiles only; not creative source footage.
- **New tooling dependencies:** `production/requirements-qa.txt` and `production/studio/requirements-voice.txt` for opt-in Python tools; pre-existing `yunex/package.json` and lockfile unchanged.

## Files migrated and adapted

| Category | Installed paths | Main capability |
|---|---|---|
| Reusable QA/utilities | `production/tools/{audio,benchmark,catalog,gltf_guard,handoff,optimize_model,quality,render,scaffold,shot_validator,visual_regression}.py` | Audio/frame validation, safe GLB integrity, shot plans, proof renders, performance measurement, catalogue and cross-agent handoffs |
| 3D art utilities | `production/advanced/{asset_contract,blender_bake,blender_clearance,blender_export,blender_smoke_scene,clearance,recovery}.py` | Blender source assets, preserving pivot hierarchies, clearance tests, AO/normal bakes, partial render recovery |
| Media ingest | `production/media-bridge/bridge.py` | Public licensed media download/preview with provenance and SSRF/host restrictions |
| Model/audio inspectors | `production/studio/{studio,voice_sync,blender_turntable}.py` and requirements | GLB hierarchies, real narrations, CSV telemetry, gallery and inspectable turntable |
| Creative/audio/shorts | `production/sound/sound.py`, `production/phoneqa/phone_qa.py`, `production/phoneqa/layouts/default.json` | Frame-timed mechanical effects, mux, 9:16 safe-zone warnings |
| Web UI | `production/portal/{viewer,compare}/` | Read-only GLB viewer and side-by-side image comparison. Public Pages deployment deliberately not added |
| YUNEX React toolbox | `yunex/src/toolkit/{ImportedMechanism,LightingPresets}.tsx` | Opt-in GLB named-pivot drive and PBR material/lighting presets. Not imported into approved compositions |
| Tool fixture software | `toolkit/smoke/` | Blender, Godot 4, Manim, OpenSCAD, PyBullet and Playwright independent technical tests |
| Automated checks | `production/tests/` | Migrated and YUNEX-specific real Python unittest suites for GLB, media, audio, QA, handoffs and contracts |
| Agent guidance | `.github/agents/*.agent.md`, `.github/skills/*/SKILL.md`, `.github/prompts/*.prompt.md`, `.github/copilot-instructions.md` | Film director, 3D specialist, engineering reviewer, licensed research, agent handoffs and release checks |
| GitHub Actions | `.github/workflows/yunex-toolkit-*.yml` | Scoped integration CI, optional software smokes, Blender imports, model optimisation/inspection, voice sync, phone QA, media bridge, studio gallery, sound, visual diffs, benchmarks and native render QA |

## Adaptations made

1. Remotion render and benchmark Python wrappers now run the existing YUNEX application in `yunex/` using `src/index.tsx` rather than the source repository's top-level `src/index.ts`. Output paths are absolute; no source assets are changed.
2. The creative smoke workflow uses the existing `YUNEX-001` composition for native browser/render proof rather than the source GPU or Turbo Documentary compositions.
3. New opt-in workflows are scoped under `yunex-toolkit-*` and use read-only permissions. Source-repository branch filters are not copied. Third-party reference ingestion is **manual and requires declared rights**.
4. Source agent instructions that explicitly banned YUNEX have been rewritten for YUNEX. This is a source-code migration requested by the owner, not cross-repository access by runtime agents.
5. The GLB optimisation workflow defaults to **not** enforcing GPU-only anchors and never directly overwrites approved Porsche model assets.
6. Existing YUNEX package manifests, Porsche GLB/textures, environmental files, completed films, approved compositions, native delivery checks and workflows are unchanged.

## Already in YUNEX (not duplicated)

- Remotion, Three.js, React Three Fiber and FFmpeg-native film rendering.
- Car model/engine/track code and shared component directories.
- Project-specific multi-agent branches and native preview/frame, chunk-coverage, decoder/QA and final mux checks, notably on `sol/y003-*` and `sol/y004-*` development branches.
- Existing car-focused workflows on the advanced episode branches. No existing workflows are renamed or replaced.

## Deliberately excluded

- Source `src/GpuDriveFilm.tsx`, `src/TurboDocumentary.tsx`, `src/VectorFilm.tsx`, `src/turbo/`, `src/mechanics/`, `src/Root.tsx`, source package manifests and example content.
- `production/videos/{abs-001,turbo-001}/`, ABS/GPU demo contracts and the source-specific default `production/phoneqa/layouts/abs-001-example.json`.
- Source wrappers `production/tools/production_pipeline.py`, `visual_plan.py` and `run_visual_review.py`: hardcode `src/Root.tsx`, GPU/Turbo composition IDs, so their direct migration would give false passes or fail in YUNEX. Replacement YUNEX-safe render and QA workflows supplied.
- Source demo-oriented render, chunk pipeline, caption and recovery/release workflows that reference GPU/Turbo/ABS compositions; duplicate or conflict with existing YUNEX episode pipelines. Reusable `advanced/recovery.py` is available independently.
- Source Pages/public website automation, public release workflows and auto-publishing mechanisms; not authorised by a tools-only migration.
- Always-on media scraping, unrestricted downloads, GPU-only validation as default, automatic asset replacement, and paid AI services.
- No GLB, example MP4, music, voiceover or scene footage is transferred.

## Verification policy

The integration CI runs Python unit tests, Python compile checks, browser JS syntax checks, builds an empty media catalogue, and renders/decode-checks two native frames of the **unchanged existing** YUNEX composition. Optional heavyweight creative software tests require manual dispatch. No CI passing should be claimed as visual or engineering certification without reviewing its actual artifacts.

For future feature branches use the imported tools by cherry-picking/merging this PR after the owner has reviewed it. Do not automatically merge into `main`.
