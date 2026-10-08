# YUNEX 004 — Agent J / INDEPENDENT DEEP CREATIVE REVIEW

**Repository:** `YunRah2103/yunus-video-lab`
**Assigned branch:** `sol/y004-j-creative-review`
**Role:** Independent cinematic director/editorial critic — NOT a renderer, integrator, technical source owner or substitute for F's mechanical QA.
**Manager project:** Y004-REAR-STEERING-01, Porsche 911 GT3 RS 992 rear-axle steering, 24.000s (720f at 30 fps, 1080×1920), white/green YUNEX car, real motion on existing race circuit.
**Existing film source for baseline review:** `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`. Exact source MUST be updated when H later merges C's correction: review both versions by exact SHA, never present baseline verdict as revised-source verdict.

## Read before work
- `yunex/video004/START_HERE.md`, `MANAGER_IMPLEMENTATION_HANDOFF.md`, `MANAGER_CONTRACT.md`, latest Manager `TASKS.json`.
- `yunex/video004/F_VISUAL_CORRECTIONS_MANAGER_HANDOFF.md` on Manager branch (F's current blocking observations and frame references).
- F source report `yunex/video004/reports/F/H_RESCUE_37764504658_INDEPENDENT_QA.md` from `sol/y004-f-qa`, full SHA `d7896e5eeef802587b95e61784558b30a794af4a`.
- H's delivery `yunex/video004/reports/H/INTEGRATION.md` and `native-proof-inventory.json` on `sol/y004-h-integration`, report SHA `943475571faa53217397404bb9e750359d66cfcd`. Native evidence run `37764504658`: 9/9 technically passed, **independent F visual release FAIL**.

## Your unique purpose (avoid duplicating F)
F validates steering mechanism, geometry, source/proof integrity, wheel wobble, grounding, codec compliance and release gates. **You judge the viewer experience** as a separate director: hook, visual explanation of opposite vs aligned steering, scientific communication without fake enlarged angles, readability at actual phone size, car as hero, frame-to-frame pacing, dynamic but calm visuals, crop discipline, typography, track atmosphere, voiceover/visual logic and payoff.

## Workflow — parallel without slowing C/H
1. **Baseline critique now:** Open the nine real MP4 clips from H run `37764504658` (IDs in H inventory). Inspect actual video frames and, if available, real-time playback. No inference from source-only logs. Focus on F's frames 272/336/397 guide ambiguity, opening 0–59 and roadside 432–551 crop, narrative clarity and story rhythm. Identify any *additional* significant visual problems, not just repeat F verbatim. Deliver one prioritized baseline report to Manager **quickly**, while C is editing: BLOCKING vs POLISH, exact frame/time, objective visual evidence, fix owner, smallest worthwhile change. Keep it under ~10 actionable points.
2. **Do not ask H to redo already passing proof videos** before C changes land. When C pushes correction and H incorporates it into a *new film source SHA* and native moving proofs, separately inspect those new artifacts against original concerns. Update final J report with exact new source SHA; sample or play the actual new sequences rather than approving merely from textual change logs.
3. Be commercially/editorially rigorous: does a viewer grasp rear steering without pausing? Does high/low relation read with *truthful ≤1° mechanical angle*? Does the camera cut show enough Porsche to maintain sense of scale, yet retain strong close-ups? Are words easy to read and no dead screen time? Does entire film finish with moving driving? Are the correct shot cuts placed around the approved 22.704s Cedar narration (high-mode cut 333f/11.1s)? If no sound-attached preview exists, label audio/video audition **NOT REVIEWED**, do not invent it.
4. Prevent churn: don't request cosmetic changes that postpone the deliverable unnecessarily. Identify only high-impact changes now. A reviewer PASS is never automatic; write your own `READY_FOR_F_RECHECK` or `REVISION_RECOMMENDED` opinion. Agent F is the authoritative technical visual gate, Manager the release gate, Master/user the final creative approval.

## Strict ownership and deliverables
Allowed writes ONLY:
- `yunex/video004/reports/J/BASELINE_DEEP_REVIEW.md`;
- `yunex/video004/reports/J/FINAL_CREATIVE_REVIEW.md` when revised source exists;
- optional `yunex/video004/reports/J/FRAME_INVENTORY.json` referencing genuine MP4s and frame IDs.

NO edits to `yunex/src/**`, `yunex/video004/TASKS.json`, H/C/F/G/I files, `.github/workflows/**`, model, audio or render pipeline. No rendering or authorizing G, no self-spawned agents, no claims of playback that hasn't happened.

Push evidence-based work to `sol/y004-j-creative-review`. Return FULL verified remote SHA, exact evidence inspected and top corrective findings. It is acceptable to mark full creative review PENDING until H's revised visuals exist; baseline review should be independently useful now.
