# YUNEX 002 — ASTRA LOCKED SOL MANAGER HANDOFF
Date: 2026-10-05. User authorizes immediate substantial parallel implementation by FOUR specialists, coordinated by Sol Manager. Astra owns creative/technical decisions and final approval. Do actual implementation/proofs, not another chain of planning handoffs.

## Canonical state / asset lock
Repo YunRah2103/yunus-video-lab. Integration branch sol/yunex-002-active-aero, forked from Video001 final c014c722fdbbabc35ecea0b2f213cd7b9271ff81 on sol/yunex-full-film-v2.
Read yunex/CURRENT_TASK.md, V5_DELIVERY.md, src/TrackPreview.tsx, ModelLedVideo.tsx, index.tsx, render-v5.cjs and car README/manifest.
Video001 is complete. Older 001 handoffs are historical, never rerun. Preserve all 001 compositions/source and locked assets.
Exterior SHA256 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.
Engine SHA256 aa05a760bcc778483c7684653f7200399d3eb540a36b1e7b0e4ec9248bc0841d.
Metres,+Yup,+Zforward,+Xleft. Wing11552tris/Wing_Flap9588tris. README explicitly says wing split/pivot APPROXIMATE, not mechanically exact. Validate actual triangles and hinge before motion; node names alone do not prove fidelity.
Track must remain present ALL TIMES, including wing close-up and airflow. Approved white/green car, materials and geometry remain unchanged. No new whole car/circuit. New video namespace yunex/src/video002; manager alone modifies shared index/track exports. Scratch was pruned: recover source/assets via canonical GitHub, not rebuild. Upload audio already locally available.

## Verified engineering — locked truth
Official Porsche 992 GT3 RS press kit:
https://newsroom.porsche.com/dam/jcr:46a23375-e7ee-4507-a577-d9761b784d33/992%20911%20GT3%20RS%20Press%20Kit%201.pdf
Deep Dive Aerodynamics pages7–8:
- Rear main plane fixed; upper plane hydraulically actuated.
- Front side aero comprises main flap angled toward underbody and smaller upper flap by brake air duct; electric motors actuate these.
- PAA continuously coordinates front/rear for driving situation.
- Low-downforce is default: do NOT call high-downforce "normal/default".
- DRS flattens elements to reduce drag, subject to operating conditions; manual and automatic functionality exist. Do not claim unrestricted button use or that it is only manual.
- Heavy/emergency braking FROM HIGH SPEED sets front/rear aero to maximum, supplementing wheel brakes. Do not imply every brake tap deploys it.
- Chassis limits braking pitch; no dramatic nose dive.
Press release backup https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html
No unsupported numeric flap angle, CFD pressure, speed gain or force statistic.

## Master concept / visual direction
One coherent Porsche film: wing movement → grip → drag reduction → airbrake → whole-car coordination.
Hook THIS WING / ACTUALLY MOVES. Actual flap motion visible within first second; begin rear3/4, no logo/establishing delay.
Premium green/white Porsche on the existing local track throughout. Contrast rear3/4 medium, rear wing close, side mechanical comparison, larger whole-car flow, moving final hero. Meaningful information/state changes every1–3sec, not constant zoom/orbit. No generic HUD, cards, neon ribbons or huge captions.
Actual moving wing is central, no 2D fake. No still plate used where wing/driving should move. Video001's plate drift fallback is NOT sufficient for 002 hero mechanics or accelerating ending.
Flow = thin muted trajectories/tracers moving vehicle-front(+Z) to rear(-Z). Force = separate restrained downward load marks; drag = sparse rearward cue. No particle storm, no wholesale streamlines reversing, no "sucked to road". DRS less deflection/wake is illustrative qualitative comparison, not invented quantitative CFD.
High downforce vs airbrake must be visibly different mechanical states; maximum braking posture plus rearward drag cue, modest wheel speed decrease, minimal body pitch.
Front elements: audit what's genuinely missing. If necessary add ONLY small separately addressable runtime front-flap explanatory proxies in correct front underbody/duct location; label simplified demonstration in QA. Fixed splitter, bonnet vents, roof fins/canards are not actuators. Do not reshape exterior or edit original GLB bytes.

## VO and timing contract
Supplied file /workspace/scratch/53b30ee2aa1f/upload/openai-fm-alloy-audio.mp3; Library reference libfile_3331ec0e32d48191aa0d9d6fd8f96f4c (already local; don't reread Library). File duration27.000s,432000bytes. USE SUPPLIED VO; don't silently synthesize replacement.
Astra has not verified transcript. D owns obtaining actual transcript/phrase timing, not hallucinating it. If no ASR available report limitation and create provisional phrase timing; don't spend hours installing enormous speech stack. Manager escalate transcript/technical discrepancy to Astra.
Desired20–25s. First try modest silence shortening only, preserve words/voice/pitch and breathing; no aggressive speed-up. If actual speech needs26–27s, retain supplied clarity and report runtime deviation rather than truncate words. Suggested below is elastic pending D's actual timing; keep state order matched actual narration if it differs, escalation for major story changes.
Astra factual VO draft (reference only; not a claim of attachment transcript):
"This wing actually moves. The GT3 RS changes its aero to suit the job. More downforce helps the tyres grip. On a straight, DRS flattens the flaps to cut drag. Brake hard from high speed, and front and rear turn into an airbrake. It isn't just a wing. It's the whole car adapting."
No rerecord requirement if supplied VO communicates same accurate ideas.

## Directed beat sheet (~25 seconds, VO-led)
0–2.4: large rear3/4 track hero; visible flap move immediately, car alive.
2.4–5.5: wing push-in/side close; show fixed main plane vs moving upper. Enough rear body remains visible. No empty exploded void.
5.5–9.5: high-downforce configuration, qualitative flow and downward load; medium whole rear.
9.5–13.5: DRS hero mechanism transition shown continuously for>=0.7s plus >=0.8s readable settled state; move to straight tracking. Text LESS DRAG / MORE SPEED.
13.5–18: high-speed braking; maximum front/rear posture distinct from grip state; rearward drag cue and modest deceleration.
18–22: larger entire car reveal front+rear synchronized, front inset/cutaway ONLY if useful and car stays hero. Text FRONT + REAR / WORK TOGETHER.
22–25: moving accelerating hero/pass, suitable aero posture; effects fade, subtle YUNEX. No dead static outro.
Camera boundaries exact fps30,1080x1920. Manager owns final durationInFrames after VO timing; retain story order where actual VO permits. Typography reuse BarlowCondensed/Yunex Display.ttf, ivory/green/copper palette; keep labels off car and readable against track.

## Four workstreams / file ownership
Manager creates branches from THIS same locked starting point and assigns self-contained tasks containing GOAL,CURRENT STATE,DECISIONS,OWNED FILES,EXACT TASKS,MUST KEEP,DO NOT TOUCH,OUTPUTS,TESTS,ESCALATION. Shared workspace: disjoint files; manager integrates central registry/source. No concurrent heavy renderers: one render queue coordinated by manager.
A MECHANICS — owns video002/activeAero.ts and frontFlaps.tsx + local tests/proof entry. Audit Wing_Flap triangle extent, mounts/endplates, current pivot. Runtime hinge grouping must preserve initial world transform and all original vertex/material data. Rotate correct spanwise hinge (+/-X in this car); do not swing swan-neck supports/main wing. Provide reusable AeroState {mode:'highDownforce'|'drs'|'airbrake', rearAngle, frontAngle, transition} or equivalent. Return native 1–2sec close motion proof all3states; max/min bounds/pivot report, tests repeated-frame determinism/originalposeunchanged, limitations.
B CAMERA/TRACK MOTION — owns video002/cameras.ts, driving.ts, camera proof. Car-large rear3/4 opening, wingmacro framing, side tracking, whole car, moving final. Reuse track/wheel pivots, frame-derived distance with no resets, tyre contact and no rail/tree occlusion. Export poseFor(frame,timing) contract with camera/target/rootPose/wheelAngle. Does not own aero/timeline/registry. Return short native motion proof, safe-frame bounding checks and camera notes.
C FLOW — owns video002/AeroFlow.tsx, flowPaths.ts and flow proof. Parameterized by shared mode/progress; front-to-rear thin contextual paths, wing interaction, qualitative wake and separate force/drag marks. Respect moving flap clearance. Return native proof comparing3states, written simplifications, deterministic/no popping checks. No changes to car/track/VO.
D EDIT+AUDIO — owns video002/timeline.ts, typography.tsx, audio utilities, VO transcript/timing assets and composition module. Map suppliedVO to locked beat progression, reuse font/sound pipeline, restrained wing tick/wind/engine/brake load. If original SFX doesn't fit, new small licensed/procedural layers with provenance. No trailer booms. Target audio original001 mean~ -15dBFS peak<=-1dBFS, true-peakcheckifavailable. Build timing/typography using interfaces/stubs until A–C available, then chronology proof. Return actual transcript or explicit ASRlimitation, original/edited VO hashes, timing JSON, mix/probe/decode results.
MANAGER — recover canonical workspace/deps once; provide sharedcontracts/types before agents diverge; central scene integration, model loading/materials/canvas/track exports/index/render driver, branch merges/source commits/final QA. Don't give four agents whole project or four dependency installs. No additional E; manager handles render optimization/QA.

## Architecture / performance decisions
Reuse Remotion4.0.532,Three0.186.1,R3F9.8.1 as existingpackage confirms. Frame-based deterministic functions; no wall-clock updates/random perframe. Actual GLTF transforms cloned at runtime. Shared loader once, rig API independent of cameras and effects. Avoid four edits to ModelLedVideo.tsx; new002 modules consume sharedexports under managerintegration.
Context7 verified Three.Object3D.attach preserves world transforms; unsupported with non-uniform scaled parents. Call updateMatrixWorld before pivot setup; inspect parent scale, do not blindly use newest Object3D.pivot absent installedversion.
Existing runtime uses fix-network.cjs. Software SwiftShader limited. No PMREM/shadow/foliage rebuild perframe. One native 3D base render then efficient flattened finish if needed; live moving wing/base required. Cache/staticenvironment acceptable, camera+wing+car stay live. Native1080x1920 no upscaling. Benchmark20–30nativeframes BEFORE fullrender; fix bottleneck not endless fullretry. Bundle AFTER media prep/copy or rebundle—Remotion snapshots public. Never stale reviewed MP4.
No Replit/Floot project unless useful. Context7 for unfamiliar API, Superpowers debug/testing. Don't force tools.

## Review gates and delivery
Mechanics close-motion proof must pass BEFORE final lookdev/full rendering. Manager reviews actual proofs, rejects broken hinge/cheap flow/weak framing; escalate creative/technical uncertainties to Astra.
Then ONE integrated native short proof covering highDownforce→DRS→airbrake plus opening/final key frames for Astra.
After approval, full chronological MP4; complete decode, dimensions/fps/framecount/audio/hash validation. Return full playable review, chronological frames/transition strips, direct importantproofs and QA. Astra must evaluate actual full temporal render, not approve from stills alone. If runtime can't play/listen, disclose limitation rather than claim watched/listened.
Manager return compact: IMPLEMENTED / FILES+COMMITS / TESTS / FULL RENDER / IMPORTANT PROOFS / KNOWN ISSUES / ASTRA DECISIONS.
Persist source GitHub; finalMP4 persistentdeliverable; renderintermediates scratchunlesscostlycheckpoint. User goingbed: proceed routine authorized work without confirmation loops. Do not message thirdparties or publishsocially.
