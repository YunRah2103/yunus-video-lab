# YUNEX 003 — POLISH 02 — Agent F Integration Preflight

Phase: Y003-POLISH-02  
Role: F — integration preflight  
Branch: `sol/y003-p02-preflight`  
Published P02 base: `064fc7687ad16e9fc99c32c3c323154b7e4496f1`  
Final decision: **FAIL / BLOCKED AS SUBMITTED**

This is an integration-gate failure, not a finding that the A/B/C owned implementation ideas are mutually incompatible.

## Exact inputs reviewed

| Role | Branch | Exact remote SHA | Base ancestry | Ownership | Code/API result |
|---|---|---|---|---|---|
| A — wheel rig | `sol/y003-p02-wheel-rig` | `f4622994c497b599217b0d7b6902dcf7345e1f9b` | PASS — ahead 4, merge-base is P02 base | PASS — motion + proof scene only | PASS |
| B — suspension detail | `sol/y003-p02-suspension-detail` | `d4b81aacfeeedfb2475c4e4cc59ed8a352164f4d` | PASS — ahead 8, merge-base is P02 base | PASS — suspension + P02-B reports only | PASS |
| C — track world | `sol/y003-p02-track-world` | `50783e0b477c5871cd3a2f2f329522bb8f373ef7` | PASS — ahead 7, merge-base is P02 base | **FAIL** — edits Manager-owned `Video003.tsx` and shared workflow | CONDITIONAL PASS for owned track code; branch FAIL |
| D — wheel/driving QA | `sol/y003-p02-wheel-qa` | `064fc7687ad16e9fc99c32c3c323154b7e4496f1` | base only | no QA delta | NOT AVAILABLE |
| E — suspension/track QA | `sol/y003-p02-visual-qa` | `b5678073fb61cf2ee4095ca8dbdc3238c5ccb143` | PASS — ahead 2 | QA-only | STALE: reviewed B/C when both were still base |

## A — wheel-rig compatibility

A changes only:
- `yunex/src/video003/motion/contract.ts`
- `yunex/src/video003/motion/qa.ts`
- `yunex/src/video003/motion/runtimeArticulation.ts`
- `yunex/src/video003/motion/PolishWheelProofScene.tsx`

A's contract change is additive: `MotionState` gains `steeringCurvaturePerM` while retaining `centreLocal`, `steerRad`, `uprightOffsetY`, root pose, distance and spin fields consumed elsewhere.

`createRuntimeMotionRig(container, options?)` keeps the existing one-argument call valid because the options parameter is optional and defaults to quaternion composition. The runtime rig pre-allocates its steering/spin quaternions and local axes outside the per-frame `apply` loop.

A's QA source adds repeatable checks for:
- hub-centre stability
- axle-axis precession
- repeat transform determinism
- tyre contact
- distance-derived wheel spin
- road-edge clearance
- steering step continuity
- arbitrary-frame deterministic evaluation

**F code/API result for A: PASS.** Independent D visual/moving-proof review is not yet available.

## B — suspension-detail compatibility

B changes only its owned suspension module and P02-B reports. It does not change motion, track, central composition, timeline, registry, model, audio or cameras.

The existing motion adapter still consumes the same structural fields from A:
- `centreLocal`
- `steerRad`
- `uprightOffsetY`
- chassis pitch/roll/heave

A retains all of those fields. B does not consume rim spin; its upright/hub carrier remains on the upright pose, consistent with fixed-caliper ownership.

B moves reusable primitive geometry to module scope and uses memoized spring geometry, avoiding a new high-cost per-frame buffer-generation pattern. Its deterministic detail audit/proof harness remains inside the suspension-owned area.

**F code/API result for B against A SHA `f4622994...`: PASS.** E has not yet re-reviewed this B SHA visually.

## C — track-world compatibility and ownership failure

C's owned track implementation is structurally compatible:
- it reuses the authoritative Y002 racetrack layout;
- extension placement is computed in world space from Y002 samples;
- it does not create a second `TrackWorld`;
- coverage uses deterministic seeded placement;
- static geometry/materials/layout are memoized and scenery is instanced;
- there is no second car/root transform in the extension.

At exact C SHA `50783e0b477c5871cd3a2f2f329522bb8f373ef7`, GitHub Actions run `37598776935` has already completed its `compile-coverage` job successfully, including dependency install, coverage audit and Remotion composition discovery. Native still jobs for frames 27, 144, 234, 603 and 711 also completed successfully at the time of this preflight. The moving proof job was still in progress when F pinned the report.

However C also changes:
- `yunex/src/video003/Video003.tsx` — **Manager-owned / forbidden to C**
- `.github/workflows/yunex-003-p02-c-proof.yml` — shared workflow outside C's assigned production/report area

The `Video003.tsx` change is the two-line import/mount needed to expose the extension, but ownership rules explicitly reserve this file for Manager. F must therefore reject the C branch **as a clean integration unit** even though the track module itself is compatible.

**F result for C as submitted: FAIL.**

## Combined coexistence

### PASS findings
- A/B/C all descend from the exact P02 base.
- A and B have no unauthorized central/shared edits.
- A/B/C owned production paths do not overlap.
- A's new motion field is additive and does not invalidate B's structural adapter.
- A's optional rig options do not invalidate the existing Manager call.
- B still separates upright/caliper motion from rim spin.
- C's extension is world-space and does not double-apply the Y003 car/root transform.
- No A/B/C diff touches the approved GLB bytes.
- No A/B/C diff changes timeline, narration/audio, camera files or livery assets.
- No obvious new per-frame geometry-allocation regression was found in the owned implementation paths.
- C's exact-SHA compile/coverage gate passed on GitHub Actions.

### BLOCKERS
1. C modifies Manager-owned `yunex/src/video003/Video003.tsx`.
2. C adds a shared workflow outside its authorized production/report area.
3. D has not published independent QA for the current A SHA.
4. E's current report is stale: it reviewed B/C at the phase-base SHA, not the current B/C SHAs.
5. A clean **combined** A+B+C Manager staging build cannot be certified by F until the unauthorized C central change is separated and the accepted source SHAs are staged by Manager. F did not merge specialist production into its QA branch.

## Locked invariants

Expected approved Porsche SHA-256 remains:

`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

No reviewed A/B/C specialist diff changes the model bytes. C's compile workflow independently checks that same hash.

The reviewed diffs do not change:
- `yunex/src/video003/timeline.ts`
- narration/audio paths
- camera files
- livery/model assets
- `yunex/src/index.tsx`

C is the only specialist that changes a locked central composition file, and that is why the branch fails the integration gate.

## Recommended Manager integration order

1. Integrate A's authorized `yunex/src/video003/motion/` delta from `f4622994c497b599217b0d7b6902dcf7345e1f9b`.
2. Integrate B's authorized `yunex/src/video003/suspension/` delta from `d4b81aacfeeedfb2475c4e4cc59ed8a352164f4d`.
3. For C, take only the authorized `yunex/src/video003/track/` implementation from `50783e0b477c5871cd3a2f2f329522bb8f373ef7` (plus its report if desired). Do **not** take C's `Video003.tsx` or shared workflow as specialist-owned integration.
4. Manager applies the required track-extension import/mount in `Video003.tsx` itself, because Manager owns that file.
5. Run D against the exact accepted A SHA and rerun E against the exact accepted B/C source SHAs.
6. Rerun F/combined compile against the clean Manager staging tree before render release.

## F tooling

`yunex/video003/qa/polish02/preflight/p02-preflight.mjs` is a read-only git preflight checker. It verifies base ancestry, specialist path ownership, locked central files, pairwise path overlap and key A/B/C contract structure, and emits PASS/BLOCKED/FAIL JSON semantics.

## Final verdict

**FAIL / BLOCKED AS SUBMITTED.**

A and B are code-level compatible and cleanly scoped. C's owned track code is compatible, but C's branch cannot be accepted wholesale because it crosses the Manager ownership boundary. The clean path is to integrate only C's authorized track files and let Manager perform the central mount, then rerun D/E/F on the exact staged SHAs.
