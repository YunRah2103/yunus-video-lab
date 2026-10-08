# YUNEX 004 — AGENT E: FINAL PROOF RECOVERY OWNER
**Assignment update:** Manager offloads the remaining native proof/CI recovery from Agent H to **Agent E**. Agent H is frozen for new work. Full final film rendering remains owned by G and BLOCKED until F/Manager release.

**Branch:** `sol/y004-e-render`
**Pinned corrected film source:** `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`.
**Exact model hash:** `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
**Previous successful 11-clip workflow:** `37769701749`.
**Original H gap workflow:** `37781451513`; jobs `113325287977` (84–149) and `113325287706` (597–686).

## Goal
Close only the two remaining visual-evidence gaps so Agent F can issue independent pre-render approval. No H work required. Work from the exact immutable corrected film source; don't modify Porsche model, timeline, camera, guides, audio, or central composition.

## First: check existing live H workflow, do NOT duplicate renders
1. Inspect run 37781451513 current GitHub jobs/steps/artifacts. It was IN PROGRESS when the Manager reassigned work. If both jobs succeed, **reuse** their exact-source MP4 artifacts; check SHA/ranges/pixel formats and publish a provenance report from E; **do not rerender**.
2. If a job has definitively failed/cancelled/timed-out, diagnose exact logs, and only then rebuild the missing subset. If a job is merely active but slow, diagnose runner/dependency setup; do not launch overlapping expensive jobs. Do not assume rate limits solely from elapsed time.
3. If a H job does finish later while E is rescuing, choose valid exact-SHA evidence and stop redundant work.

## Native proof if required
Use new E-owned `.github/workflows/yunex-004-e-final-proof-rescue.yml`, or an E-scoped equivalent. The workflow must **checkout EXACT `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba` in the actual render job**, and reuse existing verified Remotion/Three.js/FFmpeg render+normalize components. Do not replace source with H's later report-only HEAD. Render ONLY:
- **rear-wheel macro frames 84–149 inclusive, exactly 66 frames**
- **active exit frames 597–686 inclusive, exactly 90 frames**

Enforce source checksum, 1080x1920, 30fps, H264, true *limited-range* yuv420p (reject yuvj420p), exact count, no missing/duplicate frames, final decoder PASS, MP4 SHA256, run and artifact IDs. Validate each clip on the rendered source. No temporary or synthetic results presented as Porsche footage.

## Visual checks
Macro: rear upright turns minimally; tyres/rims spin without wobble; hub concentric; caliper follows steer but does not spin; grounded with no wheel-arch intersection.
Exit: car remains moving on circuit with parallax; pass→chase transitions coherent into frame 687; no floating, cropping defects, white dead space or frozen ending.

## Ownership boundaries
Agent E can write only:
- `yunex/video004/render/**` (if genuinely necessary)
- `yunex/video004/reports/E/**`
- `.github/workflows/yunex-004-e-*.yml`
- Optional E-owned report `yunex/video004/E_FINAL_PROOF_RESCUE_RESULT.md` if Manager explicitly integrates it
No edits to H branch or H reports, F QA verdict, Manager TASKS, G full-render pipeline, I audio, existing Y003 files, or immutable film code.

## Completion / handoff
Push your E evidence report, preserving earlier 11 validated clip IDs. Return full verified remote E SHA; immutable film source SHA; run/job IDs; new clip artifact IDs; exact MP4 SHA256; all tests; precise clip frame ranges; evidence of complete *combined* nonoverlapping 0–719 coverage. Request F's independent review explicitly. **Do not approve F/Manager gates or start full G render.**

If the H jobs are still in progress, do useful diagnostics and checkpoint a script/CI contingency WITHOUT starting overlapping rerenders. Recheck later only upon direct user message; do not promise monitoring asynchronously.
