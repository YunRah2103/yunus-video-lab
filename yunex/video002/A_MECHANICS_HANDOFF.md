# SUPERSEDED — HISTORICAL AERO PHASE
Do NOT execute this handoff. Original aero work is integrated. Read [START_HERE.md](START_HERE.md) for current track assignments. Retained below as reference only.

# YUNEX 002 — A — ACTIVE AERO MECHANICS

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

WORK BRANCH: sol/yunex-002-a-mechanics. Create from the latest integration handoff commit, work only owned files, return commit for integration. Never force-push integration branch.

GOAL
Build reusable actual 3D active-aero mechanics, not a graphic approximation.

OWNED FILES
yunex/src/video002/activeAero.ts, frontFlaps.tsx, a_* proof/tests and A_MECHANICS_RESULTS.md. Do not edit B/C/D files or central index.

EXACT TASKS
1. Inspect actual Wing/Wing_Flap geometry. prepare_asset.py selects Wing_Flap by triangle centroid Y>1.22; this may include endplate/support fragments. Node names are not a trustworthy rig.
2. Preserve fixed rear main plane, endplates and swan-neck supports. Animate only correct upper plane about spanwise local X hinge. If needed partition/reparent runtime triangles while retaining original GLB bytes, vertex/material data and neutral appearance.
3. Preserve initial world transform, check non-uniform parent scaling before Object3D.attach; no assumptions about newest pivot API.
4. Implement deterministic highDownforce, drs and airbrake modes and smooth transitions. Angle values are illustrative poses, not published manufacturer degrees.
5. Audit front parts; add ONLY missing small runtime front aero proxies in correct front duct/underbody locations. No moving fixed splitter/canards/bonnet vents. Front actuators are electric, rear upper-plane hydraulic; main rear plane fixed. Low-downforce is default; never call highDownforce default.
6. Export a create/apply rig API accepting {mode, transition, rearAngle, frontAngle}; return moving flap bounds/hinge for C. Avoid camera/timeline dependencies.
7. Native short rear/side close proof through all three modes, showing stable supports and clear movement.

TESTS
Original GLB hash unchanged; neutral world pose unchanged; supports fixed; no detached/intersecting triangles; repeated same frame identical; no cumulative rotation; transition settles predictably.
ESCALATE
Cannot separate upper plane convincingly without exterior redesign; uncertain hinge; wrong geometry. Return audit evidence, not a fake successful proof.
