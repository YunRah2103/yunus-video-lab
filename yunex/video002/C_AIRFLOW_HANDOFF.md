# YUNEX 002 — C — AIRFLOW AND TECHNICAL VISUALIZATION

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

WORK BRANCH: sol/yunex-002-c-flow. Create from the latest integration handoff commit, work only owned files, return commit for integration. Never force-push integration branch.

GOAL
Create restrained qualitative wind-tunnel visualization integrated around the actual car, with distinct flow, downforce and drag.

OWNED FILES
yunex/src/video002/AeroFlow.tsx, flowPaths.ts, c_* proof/tests and C_FLOW_RESULTS.md. Do not change car/track, mechanical rig, camera/story or VO.

EXACT TASKS
1. Export AeroFlow accepting deterministic frame, mode/progress, car transform and optional actual flap/hinge bounds from A. Keep pure path math separate from JSX.
2. Thin muted paths/tracers travel front +Z to rear -Z. Show front, roof/sides, rear wing and selective underbody where legible. No neon ribbons, HUD, particle storm or numerical CFD.
3. HighDownforce: explain wing/flow relationship with sparse downward load marks at meaningful locations.
4. DRS: visibly reduced qualitative deflection/wake, less drag; preserve flow direction and mechanically relevant wing clearance.
5. Airbrake: max posture relationship plus restrained REARWARD drag indicator, distinct from downward grip marks. No reversal of whole airflow/no suction fantasy.
6. Whole-car payoff: front and rear work together; minimal grouped emphasis, not screenful of arrows.
7. Build short three-state native proof with enough Porsche/track visible. Geometry fixtures allowed in tests, never present them as approved-car proof.

TESTS
Frame determinism; mode transitions do not pop; flow clears moving flap; indicators stay attached to car world coordinates; flow direction correct; opacity readable without hiding livery.
ESCALATE
Mechanics contract unclear, streamlines intersect actual geometry, aesthetic looks cheap despite functional code. Document visualization is illustrative, not computed CFD.
