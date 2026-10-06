# YUNEX 003 — SOL MANAGER IMPLEMENTATION HANDOFF
Phase: Y003-SUSPENSION-AERO-01
Creative authority: GPT-6 Master. Implementation integrator: Sol Manager.
Separate user-started chats only; no automatic subagent spawning.

## GOAL
Premium 992 GT3 RS front-suspension/aero film. The approved white/green Porsche must visibly drive, brake, turn and exit. Believable driving is the primary gate.

## CURRENT CANONICAL STATE / SOURCE
Base sol/y002-master-dual-finish @ 50fd478256bbe12d37410e78678bd7c302d96434. Latest inspected completed Y002 delivery is documented in yunex/video002/master-dual/README.md; native visual source fb3cfbe7a171858ef96a12d9443d5e00412371de. Old START_HERE/CURRENT_TASK/TASKS entries can be stale. Corrected track surface winding/course continuation are retained. Y001 V5 remains preserved in yunex/V5_DELIVERY.md.
Inspection was source/document/manifest review; Master has not newly watched previous full exports.

## LOCKED DECISIONS / VOICEOVER
Use the supplied openai-fm-cedar-friendly.mp3 unchanged. Measured duration 23.256s; 24kHz mono MP3. Library ID libfile_6e284ae6e75c819197dd652690e22ae8. Obtain the supplied attachment through available file access, not a presumed shared scratch path. Do not regenerate narration. Record sentence cue timings by listening/transcription. Target around 24–25s including moving exit; actual cue timing supersedes the earlier estimated 27–31s brief.
Expected narration: “Even the suspension on this Porsche helps make downforce. On the 911 GT3 RS, Porsche shaped the front suspension so air can move more cleanly underneath the car. That means the suspension is doing more than just controlling the wheels. Under braking and cornering, it also helps keep the car stable and controlled. So on the GT3 RS, even the suspension is part of the aero system.”
If recorded wording differs, report it. Keep the supplied recording unless material factual error requires Master escalation. Locate explanatory graphics at the front axle/wheel housings rather than implying a generic diffuser mechanism.

## TECHNICAL ACCURACY
Primary reference: https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html
Porsche describes teardrop-profile double-wishbone front-axle links; around 40kg added front-axle downforce at top speed. Geometry changes reduce pitch under braking to maintain aero balance; a lower front ball joint of the lower trailing arm is described. Aero shaping and mechanical geometry are distinct mechanisms. Anti-dive does not eliminate weight transfer. Cornering stability is not solely caused by link aero.
Do not show each link as a miniature wing generating the whole claimed force. No CFD/quantitative dynamics claims. Omit 40kg unless needed; if used retain all qualifiers. Geometry is reference-informed simplified illustration, not manufacturer CAD.

## STORY / SHOTS
Map these intents to supplied VO, not arbitrary timestamps:
1. Immediate low front-three-quarter driving hook, visible wheel/road motion. Text: EVEN THE SUSPENSION / HELPS MAKE DOWNFORCE.
2. Braking/turn-in and wheel tracking establish controlled load.
3. Selective front-corner reveal from that same moving car into installed suspension; retain road/silhouette context.
4. Readable teardrop link profile and a few restrained airflow paths around the front-axle region.
5. Airflow recedes; connected wheel/upright/link response shows modest braking pitch and corner load.
6. Pull out to the moving whole car; briefly reconnect aero and chassis.
7. Opaque Porsche accelerates past/away. Graphics disappear; subtle YUNEX.
Meaning/composition changes every 1–3s. No orbiting parked model, logo intro, HUD cards, oversized labels, dead outro or constant zooming.

## DRIVING REALISM / ARCHITECTURE
Y002 driving.ts moves only 5.15m over ~25s; cameras largely follow root. Do not reuse that travel/shot curve.
A owns a pure deterministic frame->motion-state contract: path distance, speed, root transform, body pitch/roll/heave, four wheel/upright transforms, steering and spin. Other components consume it.
Spin derives from travelled wheel distance/measured radius; steering follows path curvature; tyre contact remains grounded while chassis responds. Calipers follow uprights, not spin. Small purposeful load response, no continuous wobble or arcade travel. Include a real fixed/trackside car-crossing shot. Road/barrier/kerb parallax, shadow and sound agree with speed.
Use segmented coherent shots and explicit slow-motion only where needed, all motion slowed consistently. Existing finite track section cannot support blindly multiplied travel. Targeted Y003 path/track adaptation is allowed, not a whole environment rebuild. Preserve surface winding, texture scale and circuit identity.

## REUSE / EXTEND / DO NOT CHANGE
Reuse approved loader/materials/livery/steering-spin nodes, corrected track, lighting, typography/font/colors, frame-driven Remotion, native chunk pipeline, FFmpeg.
Add only required front links, upright connections and spring/damper representation. Runtime wrappers may articulate nodes; retain GLB bytes/base transforms. Keep original Y001/Y002 reproducible.
Model SHA256: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.
Coordinates metres, +Y up, +Z forward, +X left. Front wheel centers approx [+/-0.80477,0.35218,1.24251]. Track root [-1,-0.028,0], yaw PI. Do not double-transform.
Do not alter Porsche proportions, exterior, source materials or white/green tribute livery.

## RELEVANT FILES
cars/porsche-911-gt3-rs-992/{README.md,asset-manifest.json}
yunex/src/video002/{Video002Integrated.tsx,driving.ts,cameras.ts,AeroFlow.tsx}
yunex/src/video002/trackUpgrade/{TrackWorld.tsx,racetrack/layout.ts}
yunex/src/{index.tsx,ModelLedVideo.tsx}
yunex/{V5_DELIVERY.md,VISUAL_LANGUAGE.md}
yunex/video002/master-dual/README.md
Reuse airflow construction techniques, not old rear-wing paths/force placement.

## WORKSTREAMS / SAFETY
A motion/runtime articulation; B suspension geometry; C cameras/reveal/track adapter; D suspension airflow; E edit/audio/render/tooling. Manager owns central integration and independent acceptance.
A publishes contract early; B can inspect/model in parallel but binds approved anchors; C consumes A; D consumes A+B; E preflights audio/render early and integrates only pinned Manager source.
Specialists work only assigned branches/files. Manager alone changes central registration, unified timeline, registry and integrated scene. No story changes by specialists. No full-film renders by competing agents.
Manager pins role input SHA before releasing dependencies. Work shared through GitHub, not shared local files. No force-push. Every completion includes phase/role/input/output full SHAs, changed files, tests, actual proof links, limitations; verify remote head.

## REQUIRED PROOFS / TESTING
Before full render: 4–6s driving proof (tracking + trackside); 3–5s moving reveal; 3–5s installed link/airflow proof. Native 1080x1920 stills: hook, turn-in, reveal, profile, braking/load, whole-car, exit. Reduced drafts clearly labelled.
Tests: arbitrary-frame/chunk determinism, distance-spin, steering sign, tyre contact, connected links/clearance, track containment, transform correctness, unchanged model hash, no stale assets/gaps/duplicated frames.
Manager must inspect moving proofs before authorizing full render. Tests alone cannot pass visual gate.

## RENDER / SUCCESS / ESCALATION
Native 1080x1920 scale1, 30fps H264 yuv420p/AAC faststart. Pin integrated source SHA; native disjoint chunks, gap-free assembly, finishing once, full decode and frame/duration checks, intelligible VO and no audio clipping.
Return playable MP4, seven native frames, concise QA, exact source/remote SHAs and reproduction commands. Watch/listen actual film where supported; disclose playback limitations.
Success: convincing driving, beautiful recognizable Porsche, readable aero shape, connected mechanical explanation, premium restrained graphics, active ending; understandable muted.
Escalate required car redesign, uncertain reference topology, major environment/story/VO change, misleading mechanism or persistent artificial driving to Master. Routine fixes remain Sol.
