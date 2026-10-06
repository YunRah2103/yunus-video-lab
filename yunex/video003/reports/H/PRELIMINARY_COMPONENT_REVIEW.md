# YUNEX 003 — Agent H preliminary component review

Phase: Y003-SUSPENSION-AERO-01  
Role: H — Independent driving, mechanical and visual QA  
Review type: source-level readiness only; not integrated visual approval  
Preparation base: 50fd478256bbe12d37410e78678bd7c302d96434

## Exact remote heads inspected

- A / driving: 31f01b94948ff35e8fc93788e3722c38de1ed371
- B / suspension: e4e6ee3538d5fc993d945629a941e3ece0814e5c
- C / cameras/reveal/track: c98e8662b21633a678caf0a6b44d63131dcd28d9
- D / airflow: baeb419249ddebc327d746f43fa50b9c1db2edd2

These heads are NOT Manager pins. At review time Manager TASKS.json still had motion_contract_sha, suspension_contract_sha, render_source_sha, every specialist input/output SHA and proof list unset. Therefore the findings below are preliminary source-readiness observations only.

## Verdict

BLOCKED for integrated H approval.

Reason: required Manager-pinned integration SHA and actual motion evidence do not exist in the registry yet. Source review cannot substitute for the mandatory 4–6 s tracking proof, 4–6 s fixed-trackside proof, 3–5 s moving reveal, 3–5 s installed airflow proof, seven native 1080x1920 milestone frames, or the final G export.

## A — driving / runtime articulation

Preliminary source result: READY FOR MANAGER PIN + MOVING PROOF, with visual verification required.

Positive findings:
- Pure frame-driven state with distance, speed, acceleration, curvature, world root pose, chassis pitch/roll/heave, per-wheel path distance, steering and spin.
- Route uses corrected Y002 track centreline rather than the old 5.15 m Y002 motion curve.
- Wheel spin derives from travelled wheel distance / source-derived rolling radius.
- Front steering follows curvature; rear steering remains zero.
- State manifest explicitly says root is already world-space and must not receive TrackWorld root a second time.
- A QA code checks arbitrary-frame determinism, distance monotonicity, speed contract, road clearance, steering sign and spin-distance consistency.

H findings / required proof checks:
1. TYRE CONTACT IS NOT YET INDEPENDENTLY PROVEN. A sets each tyre radius from the wheel pivot Y and keeps uprightOffsetY at zero, then checks contact as centreLocalY + uprightOffsetY - tyreRadius. This is internally self-consistent and evaluates to zero by construction; it does not independently prove the rendered tyre mesh touches the rendered road. Owner: A/Manager. Required evidence: moving tracking + fixed-trackside proof and native turn/braking frames with no visible float, sink or hop.
2. Runtime chassis articulation only reparents named chassis groups when they are direct children of the discovered asset root. Missing or unexpectedly parented groups are recorded in the audit but do not throw. Owner: A/Manager. Required evidence: inspect runtime audit plus moving proof to confirm the complete visible shell receives pitch/roll coherently and no body sections are left behind.
3. A branch currently has source files but no reports/A output directory or proof provenance visible. This is a handoff-completion gap, not a source-code failure. Owner: A.

## B — front suspension

Preliminary source result: SOURCE ACCEPTABLE / VISUAL BINDING BLOCKED.

Positive findings:
- Explicitly reference-informed simplified double-wishbone illustration, not manufacturer CAD.
- Exact approved front wheel centres carried into the contract.
- Five link members per front corner plus upright and spring/damper context.
- Teardrop section is documented as illustrative, with rounded +Z leading region and tapered -Z trailing region.
- B adapter consumes chassis load + front upright steering without rim spin; this is directionally correct for keeping calipers/uprights separate from wheel spin.
- Local strict TypeScript/fixture checks are documented as passing.
- Around-40 kg figure is retained only with Porsche/top-speed context in the accuracy note.

H findings / required proof checks:
1. B is still explicitly dependent on the Manager-pinned A contract. Its current adapter was checked against an observed A shape, but the Manager registry has not made that contract authoritative. Owner: Manager/B.
2. No installed native frame or 3–5 s moving articulation proof exists in the published B evidence. Endpoint connectivity through steering/braking extremes therefore remains visually unverified. Owner: B/Manager.
3. Some simple rod geometry is instantiated by JSX geometry components rather than a single cached shared buffer. This is a performance/readiness note only; it is not a visual failure. Owner: B if render profiling shows cost.

## C — cameras / reveal / track adapter

Preliminary source result: SOURCE ACCEPTABLE / INTEGRATED CLEARANCE AND COMPOSITION BLOCKED.

Positive findings:
- Cameras consume external A motion; C does not invent a second drive animation.
- The trackside-pass mode freezes camera position from a shot-entry anchor while target follows the moving Porsche, satisfying the required fixed/trackside concept at source level.
- Reveal clones runtime materials and restores original material references; approved GLB bytes are not changed.
- Track adapter reuses corrected Y002 layout/root and explicitly avoids a second root transform.
- Footprint containment helper exists.

H findings / required proof checks:
1. The trackside camera contract uses a fixed vehicle-relative shot-entry offset. A separate barrier-aware tracksideWorldPoint helper exists, but the main camera contract does not use it. Actual barrier/vegetation/near-plane clearance must therefore be inspected after A path binding. Owner: C/Manager.
2. Source camera audit checks numeric/focal/target-spacing invariants, but it cannot prove wheels/wing are not cropped, the Porsche is large enough on a vertical phone frame, or vegetation/barriers do not intersect the lens. Owner: C/Manager. Required evidence: native hook/detail/exit frames plus the fixed-trackside moving proof.
3. Reveal alpha/depth/clipping behavior still needs the real installed suspension and moving silhouette context. Owner: C/Manager.

## D — suspension airflow

Preliminary source result: SOURCE INTENT ACCURATE / INTEGRATION RISK REQUIRES RESOLUTION BEFORE PASS.

Positive findings:
- Flow is qualitative and localized to front suspension/wheel-house geometry.
- No CFD scale, pressure map, giant force arrows, DRS/rear-wing routes or unqualified 40 kg force label.
- Airflow direction is +Z to -Z in car-local space, matching the stated vehicle convention.
- The code rejects control points inside a clearance-expanded profile AABB and enforces front-to-rear control-point ordering.
- Tracer phase is deterministic and linked to travelled distance.

H findings / required proof checks:
1. INTERPOLATED CURVE CLEARANCE IS NOT PROVEN. The D audit checks Catmull-Rom control points against the inflated link AABB, but the rendered Catmull-Rom spline can curve between those points. Owner: D. Recommended scoped correction: sample the actual curve densely and audit every sample against the protected profile volume before Manager accepts the airflow proof.
2. MOVING-ANCHOR PERFORMANCE / ATTACHMENT RISK. SuspensionAirflow memoizes TubeGeometry by an anchor tuple built from profileBoundsCar. If Manager recomputes articulated B profile bounds each frame so flow stays attached to moving links, the anchor tuple can change each frame and trigger TubeGeometry rebuild/disposal each frame. If Manager instead keeps bounds static, flow can drift from articulated links. Owner: D/Manager. Recommended scoped correction: keep stable link-local flow geometry and move it with a link/anchor transform, or otherwise prove geometry does not rebuild each ordinary frame while remaining attached through load/steer motion.
3. Required installed 3–5 s airflow proof is absent and Manager A+B pins are still null. No visual PASS is possible yet.

## Cross-component release gate

H will not authorize the expensive full render until all of the following are tied to one exact Manager integration SHA:

- approved A motion contract SHA and source head;
- approved B suspension contract SHA / installed anchors;
- integrated C cameras/reveal/track path;
- integrated D airflow bound to moving suspension without penetration/detachment;
- 4–6 s tracking driving proof;
- 4–6 s fixed-trackside car-crossing proof;
- 3–5 s moving reveal proof;
- 3–5 s installed airflow proof;
- seven native 1080x1920 scale-1 milestone frames;
- approved model SHA256 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb verified on the integrated source.

Any proof that visibly reads as a stationary/sliding GLB, has tyre float/sink, speed/parallax mismatch, disconnected links, spinning calipers, airflow crossing solid link geometry, unreadable profile, broken circuit identity, clipping/alpha artifacts or a dead exit is a FAIL regardless of static test results.

## Final-export gate

After Manager accepts short-proof corrections and pins render_source_sha, G may render the native master. H then independently checks exact source provenance, 1080x1920 scale1, 30 fps, H264 yuv420p/AAC/faststart, full decode, gap-free frame continuity, audio present, seven milestone frames and the complete chronological film. Master creative approval remains separate.
