# YUNEX 003 — MASTER REVISION: WHEELS / SUSPENSION / TRACK
Phase: Y003-POLISH-02
Repository: YunRah2103/yunus-video-lab
Current inspected manager head: 70bc02b7f390da106f750b5a5d17c6db3848a350
Existing visual source: 805c74fc2f749ed701c95d1aa5809e60e5a02d76
Canonical manager branch: sol/y003-suspension-manager

## User review is authoritative
User likes the result and specifically likes that the Porsche moves. Requested: wheels less wobbly, suspension more detailed, established track background. Preserve successful driving, story, supplied VO, 735-frame/30fps/24.5s timeline, typography, camera intent and approved white/green Porsche. No project restart or general redesign.
Reviewed supplied 192166.mp4 (Library libfile_e7289183af388191b5e395f689f7e448) through chronological sampled frames and a short wheel sequence. This is not a claim of real-time playback or a diagnosed wobble root cause.

## Execution
Separate user-started chats only. Use Manager plus three focused specialists; existing render tooling can be handled by Manager or existing G after source pin.
Manager must fetch current remote before writes. Create a Y003-POLISH-02 registry with current baseline, ownership, exact role input/output SHAs and proof gates. Do not send agents to original A–H production tasks.
Specialist 1: wheel rig correction, branch sol/y003-polish-wheels, owned src/video003/motion/.
Specialist 2: mechanical detail, branch sol/y003-polish-suspension, owned src/video003/suspension/.
Specialist 3: circuit presentation, branch sol/y003-polish-track, owned src/video003/track/ plus proposed integration patch. Manager alone edits Video003.tsx/shared timeline/registry/registration.
No nested agents, force-push, competing full renders or casual shared-file edits. Each pushes actual implementation, tests/proofs and verified full remote SHA.

## 1 — Wheels: diagnose before changing
Relevant src/video003/motion/{runtimeArticulation.ts,contract.ts}; asset manifest and actual GLB.
Current rig restores base transforms, then adds Euler rotation.y for steering and rotation.x for spin. This is an inspection lead, NOT a proven defect.
Audit real mesh hub centres, pivot position, local axle direction, inherited transforms, nonuniform scale and left/right symmetry. Capture fixed-camera wheel close-ups through full rotations at neutral steer, then steering/load combinations. Separate spin eccentricity/axis precession from intentional steering, body movement and temporal spoke aliasing.
Correct runtime pivot/axis composition if needed. Prefer stable axle quaternion composition on source base transforms. Do not rewrite approved GLB or remodel wheels. Verify hub/rim stays concentric and wheel plane does not precess.
Keep root travel/distance/speed/route and distance-derived spin. Keep necessary corner steering. Reduce only unjustified oscillation; never stop wheels or car to hide defects. Avoid removing all load response unless evidence requires it.
Required: native 2–3s neutral rolling proof, 2–3s steering/load proof, before/after comparison at same camera/time. Measure hub lateral/radial variation and contact; establish suitable tolerance based on mesh geometry. Inspect all four wheels, visible tyre edge and fixed calipers. High-speed aliasing may need sampling/blur treatment only after geometry audit, never as camouflage.

## 2 — Suspension: credible richer geometry
Relevant src/video003/suspension/{FrontSuspension.tsx,topology.ts,profileGeometry.ts,motionAdapter.ts}.
Current rendering uses simple profile bars, a basic rod upright and spring/damper; increase purposeful mechanical detail.
Add plausible joints/bush housings, clevis/bracket connections, spring seats, damper body versus piston shaft, bump-stop/dust-boot where reference supports it, better upright/hub structure and clear link-end connections. Steering tie rod only with defensible topology. Improve material separation/edge highlights and geometry resolution where macro needs it.
Keep correct double-wishbone arrangement and aerodynamic teardrop profile readable. No random bolts/hoses, sci-fi hardware or generic MacPherson replacement. Reference-informed illustration, not manufacturer CAD; document approximate details.
Use existing anchors and shared A motion state. Parts remain connected through load/steering; no spinning calipers, floating spring, detached links or body/tyre intersections. Preserve car exterior bytes/materials/livery.
Detail should be visible in existing reveal, not necessitate new story/camera sequence. Manager may adjust selective opacity lightly to expose detail while retaining car context.
Required: native installed macro before/after, isolated diagnostic geometry view, 3–5s articulation proof at existing reveal/load moments and endpoint/clearance checks. Cache buffers; no per-frame high-cost geometry generation.

## 3 — Established track background
Relevant src/video003/Video003.tsx imports ../video002/trackUpgrade/TrackWorld, quality final seed 3003. Existing corrected Y002 TrackWorld/racetrack/layout and current motion route.
Do not merely add a second TrackWorld: it is already mounted. Diagnose why visible result becomes open asphalt/empty horizon: course length, route positions, furniture/vegetation coverage, camera sides/frusta, fog and clipping. Preserve corrected Y002 road winding/root transform and texture scale.
Adapt established corrected circuit presentation to the FULL Y003 route: readable continuous edges, selected apex/exit kerbs, appropriate runoff/gravel/grass, barriers beyond runoff and intentional vegetation/background. Same coherent section throughout, no random roadside forest, giant grandstands or whole circuit rebuild.
Trackside features must remain correctly placed and move with believable road-relative parallax. Ground/shadows/contact preserved. Prefer isolated Y003 adapter/parameter extension; Manager approves changes to shared Y002 components and preserves reproducibility.
Reuse approved circuit assets/materials/lighting. Do not bend track under an incompatible locked route or change driving speed to make furniture fit. No fake 2D track image that breaks parallax.
Required: native hook, turn-in, technical/reveal, whole-car and exit frames; 4–6s existing driving proof showing track identity and parallax. Ensure track improvements do not occlude Porsche/mechanics or look repetitive.

## Manager integration / render
Pin specialist baseline and accept API compatibility. Integrate wheel+detail+track changes once, preserving successful moving film. Update airflow bounds if richer geometry changes relevant clearance; avoid rerouting story.
Review short integrated native proofs FIRST, particularly wheel stability, detailed suspension and circuit context. Static tests cannot accept wobble.
Then pin new source SHA and use existing successful native workflow/chunk pipeline. No reuse of old visual chunks for changed scenes. Keep supplied narration/mix timing unchanged. Produce one revised 1080x1920 scale1, 735 frames, 30fps, H264 yuv420p/AAC faststart MP4. Apply grade/finishing once.
Verify unchanged model hash 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb; full decode/count/duration/audio checks, chunk seams, deterministic frame evaluation and all-four-wheel contact.
Return playable revised MP4, side-by-side same-time before/after proofs, seven native milestones, concise QA and full remote source/delivery SHAs.
No claim of Master approval until actual revised film is reviewed. Routine fixes proceed; escalate only required story/VO/car redesign, uncertain mechanics or persistent visual failure.
