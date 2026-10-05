# YUNEX 002 — B — CAMERA AND TRACK MOTION

# Shared instructions — separate user-opened chats
Repo: YunRah2103/yunus-video-lab.
Base branch: sol/yunex-002-active-aero. Creative handoff commit: 24a454ada160b52fc2456298f4b22d9bb232af3c.
Read yunex/video002/SOL_MANAGER_HANDOFF.md for locked creative direction, verified Porsche facts, assets, timeline and QA.
User corrected execution mode: FOUR SEPARATE CHATS, no internal agent spawning, no Manager/subagent tree. Do your assigned implementation yourself. Keep usage focused: inspect relevant files once, implement, test, render a short proof, commit, return concise results. Do not create another handoff instead of doing your task.
Video001 is complete. Preserve its code and compositions. Approved white/green Porsche, geometry, materials and GLB bytes stay unchanged. Track remains visible throughout. No full film rendering until the four chunks are integrated and mechanics reviewed.
Existing source: yunex/CURRENT_TASK.md, V5_DELIVERY.md, src/index.tsx, TrackPreview.tsx, ModelLedVideo.tsx, render-v5.cjs. Inspect current repo first; don't assume the partial local recovery is a usable checkout.
Approved exterior SHA256: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.
Scale metres, +Y up, +Z front, +X left. Native output1080x1920,30fps. Reuse installed library versions; Context7 for unfamiliar current APIs; existing Superpowers workflows where useful.
Private repo terminal clone failed in this session; GitHub connector reads text but large binary fetch returns empty/UTF-8 failure. Existing Library YUNEX_Production_Pack.zip may recover assets; verify exact hash. Do not repeatedly chase failed endpoints, rebuild car or fabricate a proof. Report specific access blocker after a bounded recovery attempt.
Current implementation status: internal sessions were stopped after user clarified handoffs. Only handoff/source-recovery work was confirmed; no validated 002 implementation or proof exists. Check branch for any newer commits before starting.
No shared central registry/loader/track export edits in parallel chats. Add isolated modules/proof entries. Final integration happens after four outputs return.
Return: IMPLEMENTED, branch+commit, owned changed files, exact integration API, tests, playable proof/stills, known limitations. Commit source to GitHub; keep MP4/ZIP/cache out of Git.

WORK BRANCH: sol/yunex-002-b-camera. Create from the latest integration handoff commit, work only owned files, return commit for integration. Never force-push integration branch.

GOAL
Make the approved Porsche large, alive and beautiful on the existing track, with varied physically directed camera moves.

OWNED FILES
yunex/src/video002/cameras.ts, driving.ts, b_* proof/tests and B_CAMERA_RESULTS.md. Do not edit mechanics, airflow, VO/timing, shared registry or approved track/car.

EXACT TASKS
1. Inspect/reuse existing track presentation and wheel pivots; no new circuit.
2. Export poseFor(frame,timing) returning camera position/target/focalLength, rootPose and wheelAngle. All motion frame-derived, deterministic, no accumulated deltas.
3. Key distinct segments: rear-quarter hook; wing push-in/side macro; medium rear highDownforce; side-tracking DRS; controlled braking quarter; larger whole-car reveal; moving final hero/pass. Avoid endless orbit or zoom.
4. Keep car large with deliberate headroom for typography, wing visible when needed, full silhouette in wide beats. Track visible in every shot. No empty void/dead outro.
5. Use smooth directed transitions, appropriate focal lengths, credible tyre contact. Wheels spin local X with driving distance, calipers stay fixed. Limit braking pitch; no dramatic nosedive.
6. Supply a small native moving proof and important opening/macro/final frames. Aero can remain neutral in B-only proof; do not fake motion to imply mechanics are finished.

TESTS
Deterministic poses; continuous travel/no resets; no buried/floating tyres; rail/foliage does not obscure hero; no clipped wing in technical views; safe portrait crop; no unintended camera through road.
ESCALATE
Track dimensions cannot support driving sequence; required shared world architecture changes; weaker presentation than001.
