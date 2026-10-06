# YUNEX 003 — SOL MANAGER EXECUTION HANDOFF
Phase: Y003-SUSPENSION-AERO-01
Repository: YunRah2103/yunus-video-lab
Coordination/integration: sol/y003-suspension-manager
Production base: 50fd478256bbe12d37410e78678bd7c302d96434
Read MASTER_HANDOFF.md for all locked creative and technical decisions.

## Role and authorized outcome
You are the one implementation integrator, not a competing director. Nine separate user-started chats: Manager and A–H. Do not spawn nested agents or write another generation of delegation. User is going to bed; progress independently through preparation, integration, short proofs, fixes, native render and review package. Do not wait for optional preferences. Do not promise work continues after your execution stops.
No actual implementation existed when this expanded handoff was written. The branches in TASKS are intended work branches, not verified finished outputs.

## First actions
1. Fetch current remote coordination head. Read START_HERE, MASTER_HANDOFF, TASKS and role handoffs. Inspect repository AGENTS instructions.
2. Establish clean isolated checkout/worktree; never overwrite other work or force-push. Pin your exact base. Create new Y003 composition and shared timeline/types only as integrator.
3. Obtain the supplied VO via Library ID in MASTER; audio is 23.256s. Ask F to independently transcribe/listen and return sentence cues. Preserve recording.
4. Publish registry input pins: initial read-only/preparation baseline is production base above. Release A and B baseline implementation and E/F/G/H independent preparation. C/D can investigate and build dependency-injected isolated components without claiming final binding.
5. Publish common frame/fps/coordinate/cue interface immediately. Manager owns types.ts; A supplies motion API proposal early. Accept a minimal interface before deeper dependent work.
6. Push exact pins/registry and verify remote head. Return a concise active-state report, not a claim of completion.

## Specialist responsibilities
A driving and runtime articulation; B front suspension geometry; C cameras, reveal and targeted track adapter; D local illustrative airflow; E edit/typography; F supplied narration and automotive sound; G native render/pipeline/delivery validation; H independent mechanical/driving/visual QA.
Each has exclusive directory ownership in TASKS. H does not silently rewrite other roles. G does not redesign shots. E/F no longer own G workflow. You alone own central composition, types, timeline, root registration, registry and integration report.

## Integration architecture
Use new source under src/video003. Import proven Y002 track/loader utilities where safe; preserve old compositions. Do not import Y002 motion timeline as Y003 movement.
Require frame-driven state with time, path distance, speed, car/world transform, chassis attitude, wheel/upright poses, steering/spin and reveal state. Cameras receive state; geometry receives anchors and wheel/chassis poses; airflow receives geometry anchors/transforms. Edit receives timing/camera projection; audio receives sentence/speed cues.
Interfaces must be serializable/documented. Define metric units, Euler/quaternion conventions, baseline transforms, signs and local/world ownership. External positions must not receive the track root transform twice.
Approve B simplified-reference status explicitly. Mechanics should remain visually connected with shell hidden.
The existing track is a section, not a complete circuit. A/C coordinate a usable path contained on it, or a targeted isolated Y003 adaptation. Do not multiply speed until car leaves the track.

## Dependency release
A early contract -> B articulation binding and C cameras.
A+B approved anchors -> D airflow.
F measured cues -> Manager timeline -> E typography/cue binding.
All scene components -> Manager integration -> H short-proof review.
H review accepted or routine corrections verified -> Manager pins render_source_sha -> G full native render.
G export -> H final independent review -> Manager review package for Master.
A specialist can implement testable local components before integration; no fake dependency assumptions. Avoid forcing C/D to remain idle while A/B finish everything.

## Proof gates before expensive rendering
First produce a 4–6s driving proof with tracking and fixed trackside views. Wheel spin, steering, road contact, parallax and speed must agree. This is the primary blocker: no full render if it still looks like sliding GLB.
Then moving front-corner reveal and installed aero-link/airflow proofs, 3–5s each. H checks them. Native stills show seven story milestones.
Use reduced motion drafts honestly labelled; native keyframes remain required. Review chronological movement, not only static frames. Routine corrections belong with owner or Manager scoped integration.

## Branch/integration discipline
Fetch specialist remote branches; require full remote SHA and actual files/proofs. Confirm registry phase and pinned input. Review diff before cherry-pick/merge; never use an older same-letter task.
Record source SHA for each integrated role and merge resolution. If commits mix owned/unowned files, bring in only approved changes and notify role.
No completion based on local-only code, tests without proofs, or a fresh handoff. No stale opening plates.
Only Manager changes TASKS. Keep input/output pins distinct; render commit and final report commit may differ. Record hashes/provenance.

## Unattended decisions / recovery
Proceed with reversible choices consistent with the Master brief: exact camera coordinates, interpolation, small load amplitude, caption placement, SFX ducking, chunk sizes, render optimization. Do not request user approval for each routine choice.
On failed tests/render, diagnose logs and fix within ownership. G reuses successful exact-source chunks; never mix commits. If a rerender changes source, invalidate affected chunks and provenance.
No open-ended polling. At a genuine dependency stop, save current work/proof sources, publish exact blocker and next dependency, and return honestly. Separate chats may need user continuation; you cannot assume their execution remains live.
If supplied audio cannot be obtained, complete visual preflight and report precise file-access blocker; do not synthesize replacement or silently omit VO.
Major asset/story/reference uncertainty: record escalation and continue unaffected work. Preserve approved car.

## Final delivery
One native 1080x1920, 30fps H264 yuv420p/AAC MP4, scale1, faststart. Duration follows actual voice recording plus active exit. G validates full decode/gap-free exact frames/audio; H independently evaluates driving, mechanics, visuals and full chronological film.
Save playable deliverable through available persistent artifact workflow, keep canonical code on GitHub. Do not put large MP4 into git history.
Return final MP4, seven native frames, brief source/asset/audio/export manifest, tests, limitations, verified full remote SHA and reproduction instructions. Master creative approval remains pending actual Master review; never label it approved merely because code compiles.
