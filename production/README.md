# YUNEX — portable production toolkit

Source (read-only): `YunRah2103/Remotion-gpt-chat@25a83c4e58e60c909624494745158385b7f962d9`. Additive migration branch: `tooling/remotion-production-suite-20261009`. The live car-film code, Porsche assets, track worlds and episode-specific Actions workflows remain unchanged. Python tools live separately under `production/`; Remotion remains at `yunex/` with its **existing** package-lock and versions.

## Newly available reusable systems

- `production/media-bridge/bridge.py`: provenance-checked public media acquisition with allowed-host security, preview frames, contact sheets and artifact manifests (manually dispatched only).
- `production/studio/studio.py`: GLB hierarchy and material inspection, media gallery, scene-change frames, CSV telemetry and provenance-locked model registration.
- `production/studio/voice_sync.py`: reviewed word timing, SRT/VTT export and optional CPU faster-whisper; does not generate speech.
- `production/sound/sound.py`: synthetic timeline-based mechanical SFX and FFmpeg audio mux.
- `production/phoneqa/phone_qa.py`: 9:16 layout safe-zone overlays, warnings and native still previews.
- `production/advanced/`: Blender GLB export, documented moving-pivot contracts, AO/normal bake, collision/clearance sampling and artifact recovery primitives. No demo project is imported.
- `production/tools/`: integrity-preserving GLB optimisation, shot gap checks, verified agent handoffs, catalogue/static gallery, deterministic Python render wrapper, render benchmark, audio tools, MP4 FFprobe/full-decode QA and PNG visual diffs.
- `production/portal/viewer/` and `compare/`: browser-based, local model inspection and visual compare; NOT auto-deployed public Pages.
- `yunex/src/toolkit/`: optional self-contained GLB named-pivot loader and original material/lighting presets, not registered to or imported into any approved composition.
- `toolkit/smoke/`: optional Blender, OpenSCAD, Godot, PyBullet, Manim and Playwright fixture tests.
- `.github/agents/`, `.github/skills/`, `.github/prompts/`: GitHub coding-agent guidance, not autonomous AI execution.

## Examples of opt-in commands

```bash
python -m pip install -r production/requirements-qa.txt
python -m unittest discover -s production/tests -v
python production/tools/render.py --composition YUNEX-001 --mode preview --output out/tool-preview.mp4 --start 0 --end 2 --scale 0.25
python production/tools/quality.py --help
python production/studio/studio.py --help
python production/phoneqa/phone_qa.py --help
python production/media-bridge/bridge.py --help
python production/tools/handoff.py path/to/reviewed-handoff.json
```

Use a **real registered YUNEX composition ID**; `YUNEX-001` is only an example of the currently registered existing main composition. Python render and benchmark wrappers run npm commands with working directory `yunex/`. Optional workflow_dispatch tools are available after their workflow YAML is present on the default branch; PR CI can run on this branch.

## Explicit exclusions and coexistence

Already present: Remotion, Three.js, React Three Fiber, FFmpeg-based renders, approved YUNEX film compositions, Porsche model pipeline, and episode-specific native QA/workflows in active feature branches. No npm lockfile, car geometry, music, environment or episode workflow was replaced. Excluded source `src/Root.tsx`, GPU film/composition, ABS and turbo example plans, `src/mechanics/parts.tsx`, GPU-specific QA defaults, source-repo-only production pipeline and visual selection logic, demo JSON/contracts, public publishing/release workflows and redundant scene-specific render workflows. The imported tools **do not** automatically certify visual quality or install software persistently.
