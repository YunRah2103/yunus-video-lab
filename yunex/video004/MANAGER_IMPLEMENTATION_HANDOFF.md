# YUNEX 004 — MANAGER IMPLEMENTATION HANDOFF

Topic: Porsche 911 GT3 RS (992) — Rear-axle steering
Repository: YunRah2103/yunus-video-lab
Phase: Y004-REAR-STEERING-01
Manager branch: sol/y004-rear-steering-manager
Initial production base: 451728dcbc8e36cc9f54fb94e00bdefbdf068f51

## Workflow and authority

Master → separate Manager chat → user-started specialist chats → Manager integration/render → Master creative review.

You are Manager and central integrator. Read this handoff, inspect current remote state, and choose the smallest useful specialist split. Specialists are separate normal ChatGPT chats manually opened by the user. Do not assume shared conversation state or directly controlled sub-agents. The Master’s scope here is this handoff, not routine implementation.

## GOAL

Create a premium approximately 20–24-second vertical automotive engineering film whose immediate revelation is:

THE REAR WHEELS TURN TOO.

The viewer must understand, even muted:
- Lower-speed rear steering opposes front steering and supports agility.
- Higher-speed rear steering follows front steering and supports stability.
- Steering inputs are small.
- The Porsche genuinely drives throughout.

Keep the white/green Porsche beautiful and central. Graphics explain its movement.

## CURRENT CANONICAL STATE

Remote inspected 8 October 2026; fetch again before implementation.

| Item | Verified state |
|---|---|
| Latest inspected Y003 correction branch | sol/y003-p03-master-fixes |
| Branch HEAD | 451728dcbc8e36cc9f54fb94e00bdefbdf068f51 |
| P03 rendered production source | e09f9565d9f5aa70d11375a16b1da6477293e935 |
| P03 visual render run | 37662728071 |
| P03 packaging run | 37667577612 |
| P03 final artifact | 11503543207 |
| Artifact name | YUNEX-003-P03-FINAL-DUAL-TIKTOK |
| Approved Porsche GLB SHA256 | 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb |

Use P03 as the initial Y004 production base. Inspect newer changes before adopting them; newer timestamps do not establish acceptance.
Do not start from main: inspected HEAD eba29eb10d58519800484aaa6c5fa4614150bcfd was an older full-film handoff.

Read:
- AGENTS.md
- yunex/video003/reports/P03/REVISION.md
- yunex/video003/reports/P03/FINAL_QA.md
- yunex/video003/reports/P03/RELEASE_METADATA.json
- yunex/video003/polish02/MANAGER_HANDOFF.md
- yunex/video003/MASTER_FINAL_REVIEW_HANDOFF.md

The last two contain useful workflow history; their older production pins do not override P03.

### Inspection limits

Master inspected source, release documentation, approved vehicle contact sheets and earlier visual evidence. Downloading the latest final artifact returned HTTP 403. Latest P03 movie has NOT been watched or creatively approved in this Master chat. P03’s report also leaves continuous audiovisual director review pending. Retrieve and watch it during initial Manager inspection.

P03 A/B contain identical video/audio streams; their difference is metadata. Y004 requires one genuine master, not duplicate exports.

## LOCKED MASTER DECISIONS

1. Real, restrained wheel articulation; readability comes from framing and guides, not exaggerated physical steering.
2. Matched elevated compositions for low/high modes. Keep the Porsche facing broadly the same screen direction.
3. Separate low/high demonstrations with an editorial cut; do not pretend the whole film is one continuous acceleration run.
4. Keep the Porsche moving during explanation. No detached chassis diagram or stationary overhead turntable.
5. Exterior bodywork opaque by default. Brief local wheel-arch transparency only if native proof establishes necessity.
6. No new suspension teardown or airflow sequence: those were Y003’s subject.
7. No numerical speedometer, exact switching threshold or steering-angle claim.
8. End with an active pass and moving rear-quarter exit.
9. Aim for 24 seconds at 30 fps: 720 frames. Measure narration, then publish final integer frame count before specialist implementation. Never inherit Y003’s 735 frames automatically.

## VOICEOVER

Supplied base with one minor ending correction:

“The rear wheels on this Porsche steer too.

At lower speeds, they can turn slightly against the front wheels, helping the GT3 RS change direction more quickly.

But at higher speeds, they turn with the fronts instead.

That makes the car more stable through fast corners and direction changes.

So even the rear wheels are helping this Porsche turn.”

The ending avoids implying continuous steering movement or guaranteed increased cornering speed.

Calm, confident, conversational delivery. Reuse established voice if available. Create topic-specific narration; do not reuse Y003 spoken audio.
Measure the take and align shot changes to phrases. Preserve intelligibility and natural pauses. If it cannot fit naturally within 24 seconds, return measured duration and proposed small wording trim before locking timing.

## STORY / SHOT INTENT

24-second editorial envelope; final boundaries follow measured VO.

| Time | Shot/action | Explanation/text |
|---|---|---|
| 0–2.8 s | Low rear three-quarter rolling shot entering a lower-speed bend. Rear wheel prominent; markings and grounded shadows establish travel immediately. | THE REAR WHEELS / TURN TOO. Rear steering begins visibly in the hook. |
| 2.8–5.0 s | Rear wheel-level tracking macro. Enough bodywork, road and passing kerb remain visible for context. | Fine neutral reference and actual wheel-direction guide reveal small yaw change. |
| 5.0–9.5 s | Elevated three-quarter tracking through lower-speed direction change; both axles readable. | Opposing front/rear guides. LOWER SPEED then AGILITY. |
| 9.5–13.5 s | Match cut to a separate higher-speed sweep with the same explanatory viewing direction. | Guides point in same general direction. HIGHER SPEED then STABILITY. |
| 13.5–18.5 s | Cinematic side/rear tracking through fast gentle direction change; graphics fade. | Planted motion supports stability sentence. |
| 18.5–24.0 s | Low trackside pass, followed by moving rear three-quarter exit. | Subtle YUNEX identity; no static end card. |

Meaningful steering, framing or vehicle-action changes approximately every 1–3 seconds. Do not hold an unchanging composition for an entire sentence.

### Technical visualisation

Two compact axle-direction cues anchored to actual front/rear wheel orientations:
- Thin neutral reference establishes straight ahead.
- Short coloured heading guide follows actual steering yaw.
- Reference geometry follows moving car.
- Preserve tyre, rim and silhouette visibility.
- Same visual convention for both modes.
- No invented alternate-car trajectory or quantified turning-radius comparison.
- At most two explanatory cues together.

Guides may extend visible heading direction but must not imply a larger physical angle than the actual wheel.

## DRIVING REQUIREMENTS

One deterministic state per frame drives:
- World position/chassis heading.
- Speed/acceleration.
- Front/rear steering.
- Each wheel’s distance/spin.
- Restrained pitch, roll, heave.
- Camera tracking and technical anchors.
- Contact/key-shadow placement.
- Audio speed/load cues.

Do not animate these independently.

### Source findings

P03 provides world-space track-relative movement, per-wheel distance, shared asphalt grounding, restrained load, quaternion rig and actual-GLB axle regressions.
But motionStateAt() assigns ZERO rear steering.

The existing route is a short smooth lateral bend with approximately 10-degree heading limit, NOT a ready-made hairpin or sweeping circuit.

Therefore:
- Reuse existing track.
- Lower-speed demonstration is a compact direction change within actual road geometry.
- Higher-speed movement uses sufficiently gentle curvature.
- Separate shot-local runs and editorial cuts reuse covered sections.
- Do not claim high speed while travelling slowly.
- Stay within track sample domain.
- Do not rebuild circuit just to satisfy the initial “tighter corner” suggestion.
- Escalate with proof if geometry cannot support readable plausible demonstrations.

## REAR-STEERING REQUIREMENTS

Extend current rig; do not replace it.

### Preserve P03 fixes

GLB contains baked camber. P03 fixed wheel precession by using measured source axle axes.
Keep SOURCE_WHEEL_SPIN_AXES, quaternion composition, actual-GLB rim-plane tests, asphalt world height, pose-following shadows and corrected foliage/trunk materials.
Do not revert to generic local-X spin.

### Rear wheel assembly

Rear steering rotates wheel assembly around steering pivot:
- Rim/tyre spin.
- Caliper follows steering/upright motion.
- Caliper does NOT spin with wheel.
- Hub stays concentric.
- No wheel-arch intersections.
- No suspension/brake assembly left behind.

Current rear-caliper path assumes non-steering rear upright. Correct that assumption for Y004; preserve world transforms during runtime reparenting.

### Motion credibility

Derive steering from speed regime, path geometry and motion, not merely VO timestamps.
For lower-speed proof use four-wheel kinematic consistency checks. Relationship involving tan(front angle) minus tan(rear angle) and wheelbase is useful; document reference frame and simplified assumptions.
Higher-speed staging is a restrained illustrative animation, NOT a validated Porsche handling simulation. Do not fabricate proprietary controller calibration.

Initial conservative rear animation cap: 1 degree. This is an internal illustrative choice, NOT a claimed Porsche specification. Escalate before increasing it; improve camera/guides first.
Do not mirror rear wheels into opposing toe-in/toe-out poses. Verify signs using actual asset axes.

## TECHNICAL ACCURACY REQUIREMENTS

Porsche GT3 RS material confirms opposite-direction rear steering at low speeds for agility and same-direction steering at high speeds for stability. Its 992 GT3 RS press kit confirms retuned rear-axle steering.

Primary references:
- https://www.porsche.com/stories/innovation/eight-things-you-need-to-know-about-the-911-gt3/
- https://newsroom.porsche.com/dam/jcr:46a23375-e7ee-4507-a577-d9761b784d33/992%20911%20GT3%20RS%20Press%20Kit%201.pdf

Requirements:
- Do not import exact thresholds/angles from another GT3, Carrera or older RS.
- No sudden binary switch presented as Porsche’s exact control law.
- Do not say physical wheelbase changes.
- Do not equate rear steering with drifting.
- No guaranteed grip or lap-time improvement.
- Record sources; distinguish verified facts from illustrative parameters.

## REUSE REQUIREMENTS

| System | Relevant paths |
|---|---|
| Approved vehicle | cars/porsche-911-gt3-rs-992/model.glb |
| Motion and rig | yunex/src/video003/motion/ |
| Actual-asset regressions | assetAxle.test.ts, groundContact.test.ts within motion/ |
| Track/lighting | yunex/src/video002/trackUpgrade/ |
| Circuit context | yunex/src/video003/track/ |
| Cameras | yunex/src/video003/cameras/cameraContract.ts |
| Suspension | yunex/src/video003/suspension/ |
| Typography | yunex/src/video002/typography.tsx and yunex/src/video003/edit/ |
| Audio utilities | yunex/src/video003/audio/ |
| Export validation | yunex/video003/render/ |
| Latest packaging | .github/workflows/yunex-003-p03-package.yml |

Episode-specific work: yunex/src/video004/ and yunex/video004/.
Reuse stable modules through adapters. Shared fixes require explicit ownership and Y003 regressions. Keep Y003 reproducible.

## MUST NOT CHANGE

- Porsche geometry/proportions/livery or GLB bytes.
- Accepted camber and P03 axle correction.
- Track identity, surface ordering and grounding fixes.
- Established typography and restrained branding.
- Previous timelines, narration and release records.

No broad refactors, dependency upgrades, hosting projects or competing rigs.

## IMPLEMENTATION WORKSTREAMS

Choose actual chat count after inspection; do not force five.

| Responsibility | Model guidance |
|---|---|
| Four-wheel steering, motion contract, rig/calipers | GPT-6 |
| Cameras and anchored explanation | GPT-6 for judgement; Sol after decisions proven |
| Assembly, typography, narration timing, audio | Sol with locked contracts |
| Native render/export tooling | Sol |
| Independent moving visual QA | GPT-6 |

Combine compatible responsibilities. Manager alone owns central registration, shared timing contracts, task registry, accepted-source pins and integration.

## DEPENDENCIES AND PARALLEL SAFETY

1. Fetch/pin accepted P03 base.
2. Measure VO; publish Y004 timing/motion interfaces.
3. Publish standalone specialist handoffs on GitHub.
4. Release steering/motion work.
5. Cameras/visualisation use exact accepted contract SHA.
6. Assembly uses accepted motion/camera/narration pins.
7. Review short integrated native proof.
8. Pin one final render_source_sha.
9. Render, mux, validate.
10. Return actual film to Master.

Each specialist handoff contains:
ROLE, GOAL, CANONICAL SOURCE, BRANCH, INPUT SHA, OWNED FILES / MODULES, LOCKED DECISIONS, TASKS, MUST KEEP, DO NOT TOUCH, REQUIRED PROOF, TESTS, DONE CONDITION, RETURN FORMAT.

Publish one Y004 START_HERE.md and task registry: phase, exact handoff path, input/output SHA, ownership, evidence, acceptance.
Specialists push actual implementation and return branch + FULL REMOTE SHA. Reject stale-phase, local-only and handoff-only submissions. “Done” is not evidence.

## REQUIRED PROOFS

Before full render:
1. Low-speed native moving clip: both axles steer oppositely.
2. High-speed matched moving clip: same-direction inputs.
3. Rear macro: steering while spinning, grounded tyre, non-spinning caliper.
4. Actual-GLB regression: stable rim plane through revolutions and rear steering.
5. Driving proof: 4–6 seconds, fixed-world/trackside reference, parallax, shadows.
6. Matched low/high explanation reviewed consecutively muted.
7. Native integrated opening, both modes and active ending.

Each proof records source SHA, frame range, fps, dimensions and artifact identity.
Stills supplement moving proof; they cannot establish wheel stability/driving quality.

## SUCCESS CRITERIA

- Rear steering revealed within three seconds.
- Both modes visually distinguishable muted.
- Physical rear angles subtle.
- Convincing travel relative to road.
- Correct spin without wobble.
- Credible calipers/hubs/contact.
- Anchored sparse graphics.
- Coherent track.
- Purposeful camera variety.
- Narration matches demonstrated mode.
- Active ending.
- Worth presenting for creative approval.

## QA

### Automated and geometry

Verify deterministic/out-of-order sampling, model hash, hierarchy/pivots/spin axes, both steering directions, caliper non-spin, world tyre contact while steering, road containment, arch clearance, steering/path consistency, plausible acceleration/load, domain limits, typography safety and complete chunk coverage.
No source-domain clamping or frozen final movement.

### Final delivery

1080×1920; constant 30 fps; locked integer frame count/duration; H.264 true yuv420p; AAC 48 kHz stereo; faststart; full decoder pass; no clipping/missing speech/truncated ending; MP4 SHA256; exact render source; workflow/run/artifact identities; accessible playable MP4.

Follow P03 strict validation. Do not weaken checks to accept yuvj420p. Reuse completed valid chunks for assembly-only rescue.

### Human review

Watch complete integrated film with sound and muted, normal playback plus targeted slow motion.
Machine checks/contact sheets do not establish creative approval.
State explicitly if continuous audiovisual playback is unavailable.

## ESCALATION CONDITIONS

Return to Master when:
- Steering unreadable after framing/guides.
- Larger physical angles appear necessary.
- Track cannot support credible staging.
- Asset geometry needs modification.
- Existing rig cannot support mechanical correction.
- VO requires substantial rewrite/exceeds target.
- Substantial track/camera-language/brand redesign proposed.

Provide native proof, exact SHA, diagnosis and recommended option.
Routine coding, mechanical corrections, export failures and targeted QA fixes remain Manager/specialist work.

## MANAGER RETURN FORMAT

1. Playable integrated review MP4.
2. Manager branch + FULL REMOTE COMMIT SHA.
3. Exact render_source_sha.
4. Duration/frame count/resolution/fps/codecs.
5. MP4 SHA256 and artifact/run identities.
6. Accepted specialist branches/full SHAs.
7. Low/high steering and driving proofs.
8. Technical sources/accuracy note.
9. QA result and limitations.
10. Whether continuous audiovisual playback occurred.
11. READY FOR MASTER CREATIVE REVIEW or BLOCKED with concrete reason.

Do not claim Master approval. Master must watch actual Y004 film.

## Completion boundary

This document completes the Master handoff. No Y004 video implementation was started by the Master. Manager now creates specialist handoffs and coordinates implementation.
