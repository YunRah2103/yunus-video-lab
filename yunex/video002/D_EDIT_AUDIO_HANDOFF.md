# SUPERSEDED — HISTORICAL AERO PHASE
Do NOT execute this handoff. Original aero work is integrated. Read [START_HERE.md](START_HERE.md) for current track assignments. Retained below as reference only.

# YUNEX 002 — D — EDIT, TYPOGRAPHY AND AUDIO

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

WORK BRANCH: sol/yunex-002-d-edit. Create from the latest integration handoff commit, work only owned files, return commit for integration. Never force-push integration branch.

GOAL
Build VO-led 002 timing, premium integrated typography and restrained clean audio using approved001 systems.

OWNED FILES
yunex/src/video002/timeline.ts, typography.tsx, composition module, audio utilities, timing/transcript assets, d_* proof/tests and D_EDIT_RESULTS.md. Do not edit central registry/loader or A/B/C files.

EXACT TASKS
1. Obtain actual supplied VO and verify spoken words/phrase timings. Attachment name openai-fm-alloy-audio.mp3,27seconds,432000bytes; this session local upload/openai-fm-alloy-audio.mp3. In a new chat, request that attachment if inaccessible rather than using001VO or inventing transcript. Reference draft in master handoff is NOT a transcript.
2. Aim20–25sec via modest natural pause trimming, preserve words/pitch/voice. If needs26–27sec, retain clear speech and report. No aggressive speed-up or synthesis.
3. Implement elastic beats: hook0–2.4; isolate2.4–5.5; highDownforce5.5–9.5; DRS9.5–13.5; airbrake13.5–18; wholecar18–22; moving payoff22–25. Adjust to actual speech within locked story; flag major mismatch.
4. Export timeline/shot boundaries and mode schedule as data; composition accepts A/B/C scene via interface until integrated. No static image workaround for moving wing/hero.
5. Reuse YUNEX font and palette. Hook THIS WING / ACTUALLY MOVES; DRS LESS DRAG / MORE SPEED; payoff FRONT + REAR / WORK TOGETHER. Sparse labels off car, no captions filling screen.
6. Mix suppliedVO priority plus restrained engine/wind/wing movement/braking accents. Original audio mean-19.7dBFS,max-1.7dBFS: avoid blind gain. Target existing001 mean about-15dBFS peak<=-1dBFS, no clipping; record provenance for added sounds.
7. Create chronological timing/typography/audio review using available scene interface. Explicitly distinguish provisional/missing 3D from integrated native proof.

TESTS
All spoken words preserved; narration/beat sync; no out-of-range interpolation; typography safe portrait margins and no car coverage; full audio decode/peak/loudness/duration checks; deterministic timing.
ESCALATE
VO unavailable, no usable transcription method, inaccurate supplied claims, major narration/story ordering mismatch. No hours spent installing huge ASR stack.
