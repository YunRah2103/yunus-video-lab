# Optional creative software testbed for YUNEX

This directory holds portable, independent **technical smoke fixtures only** from Remotion-gpt-chat commit `25a83c4e58e60c909624494745158385b7f962d9`: Blender CPU rendering, OpenSCAD CAD, Godot headless scene, PyBullet physics, Manim mathematical motion and Playwright Chromium checks. None imports or modifies a YUNEX Porsche asset or composition. Run via the opt-in `yunex-toolkit-creative-smoke.yml` workflow or with locally installed tools. Output goes to `toolkit/out/` (ignored by normal production).

Remotion, React Three Fiber, Three.js and FFmpeg were **already present** in YUNEX. This adds QA/integration pathways, not a second Remotion installation. All installations occur on ephemeral Actions runners. Smoke scene geometry is purely a technical fixture, not an example film migrated into YUNEX.
