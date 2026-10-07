# YUNEX 003 — POLISH 02 — Agent F Integration Preflight

Phase: Y003-POLISH-02  
Role: F — integration preflight  
Branch: `sol/y003-p02-preflight`  
Published P02 base: `064fc7687ad16e9fc99c32c3c323154b7e4496f1`  
Final decision: **FAIL / BLOCKED AS SUBMITTED**

This is an integration-gate result against the exact remote SHAs below. It does not mean the owned A/B/C implementations are fundamentally incompatible.

## Exact inputs pinned by F

| Role | Branch | Exact SHA | Base ancestry | Owned-code compatibility | Integration readiness |
|---|---|---|---|---|---|
| A — wheel rig | `sol/y003-p02-wheel-rig` | `a674f02cbb236b64015ace69583c43b57b5dd073` | PASS — ahead 10 from P02 base | PASS | **BLOCKED** — shared workflow outside A ownership; proof run still in progress; D unavailable |
| B — suspension detail | `sol/y003-p02-suspension-detail` | `d4b81aacfeeedfb2475c4e4cc59ed8a352164f4d` | PASS — ahead 8 from P02 base | PASS against A | **BLOCKED** — required native installed/articulation proof not yet independently reviewed |
| C — track world | `sol/y003-p02-track-world` | `50783e0b477c5871cd3a2f2f329522bb8f373ef7` | PASS — ahead 7 from P02 base | PASS for owned `track/` implementation | **FAIL** — edits Manager-owned `Video003.tsx` and shared workflow |
| D — wheel/driving QA | `sol/y003-p02-wheel-qa` | `064fc7687ad16e9fc99c32c3c323154b7e4496f1` | base only | n/a | **NOT AVAILABLE** |
| E — suspension/track QA | `sol/y003-p02-visual-qa` | `b5678073fb61cf2ee4095ca8dbdc3238c5ccb143` | PASS — ahead 2 | n/a | **STALE** — reviewed B/C before current outputs existed |

## A — wheel rig

### Owned implementation
A's production implementation is contained under `yunex/src/video003/motion/` and includes:
- steering-curvature conditioning without changing the route/speed curve;
- quaternion local-axis steer/spin composition;
- deterministic wheel-rig QA;
- a native all-wheel proof scene and proof tooling.

A retains the fields consumed by suspension/camera/airflow and adds `steeringCurvaturePerM` additively. `createRuntimeMotionRig(container, options?)` remains backward-compatible because the new options argument is optional.

The runtime implementation pre-allocates steering/spin quaternions and local axes outside the per-frame `apply` loop. The QA source checks hub-centre error, axle-axis error, repeated transform determinism, tyre contact, spin-vs-distance, road clearance and steering-step continuity.

A's own report states the measured worst steering step falls from about 3.755°/frame to about 0.270°/frame while preserving real steering, and that hub/axis repeatability is gated numerically.

### A integration blockers
A also adds:

`.github/workflows/yunex-003-p02-a-wheel-proof.yml`

A's handoff grants production ownership to `src/video003/motion/` and explicitly says not to edit render workflow/shared central areas. Manager rules require shared-file changes to be rejected unless explicitly approved. Therefore the workflow must not be integrated as an A-owned production change.

At F's pin, Agent A proof workflow run `37599316564` on SHA `a674f02cbb236b64015ace69583c43b57b5dd073` was still **in progress**. D has no QA delta yet.

**A owned-code result: PASS. A branch-as-a-whole readiness: BLOCKED.**

## B — suspension detail

B stays within:
- `yunex/src/video003/suspension/`
- `yunex/video003/reports/P02-B/`

It preserves the existing motion adapter and therefore consumes the same A fields:
- `centreLocal`
- `steerRad`
- `uprightOffsetY`
- chassis pitch/roll/heave

A retains all of them. B does not consume rim spin; its hub/upright carrier follows the upright pose, consistent with fixed-caliper ownership.

B adds reference-informed joint housings, clevises, tie-rod treatment, separate damper body/shaft, spring seats, bump-stop cue and richer upright/hub carrier geometry. Reusable primitives are module-scoped and spring geometry is memoized, so F found no obvious new per-frame geometry-buffer regression.

B also ships deterministic detail/connection audits and a 5 s isolated articulation harness. However B's own proof manifest correctly states that installed native before/after and moving visual acceptance still require Manager/E rendering/review.

**B code/API result against current A: PASS. Integration readiness: BLOCKED pending current native/E review.**

## C — track world

C's owned track implementation is structurally compatible:
- it reuses the authoritative Y002 racetrack layout;
- scenery positions are derived from Y002 track samples in world space;
- it does not instantiate a second `TrackWorld`;
- no second vehicle/root transform is applied;
- layout generation is deterministic from a seed;
- scenery uses memoized geometry/material/layout plus instancing.

At exact C SHA `50783e0b477c5871cd3a2f2f329522bb8f373ef7`, Actions run `37598776935` has already shown:
- `compile-coverage` job `112717985154`: **SUCCESS**
- native still 27: **SUCCESS**
- native still 144: **SUCCESS**
- native still 234: **SUCCESS**
- native still 603: **SUCCESS**
- native still 711: **SUCCESS**

The moving 540–689 proof job was still in progress at F's pin.

### C ownership failure
C additionally changes:
- `yunex/src/video003/Video003.tsx` — **Manager-owned**
- `.github/workflows/yunex-003-p02-c-proof.yml` — shared workflow outside C's assigned production/report area

The `Video003.tsx` delta is only the import/mount for `Y003CircuitWorldExtension`, but the ownership rule is explicit: Manager alone edits `Video003.tsx`.

**C owned track code: PASS. C branch as submitted: FAIL.**

## Combined compatibility

### PASS
- A/B/C all descend from the exact published P02 base.
- A/B/C owned production paths do not overlap.
- A's contract addition is additive and preserves B's structural adapter inputs.
- A's optional runtime-rig options preserve the existing Manager call.
- B keeps wheel spin out of the upright/suspension API.
- C's extension is world-space and does not double-apply root transforms.
- No reviewed A/B/C diff changes Porsche model bytes or livery assets.
- No reviewed A/B/C diff changes `timeline.ts`, camera files, narration/audio files or `src/index.tsx`.
- The expected Porsche SHA-256 remains `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.
- A, B and C implementation patterns do not show an obvious new high-cost per-frame geometry regression.
- C's exact-SHA compile/coverage gate passes.

### FAIL / BLOCKED
1. A adds a shared proof workflow outside its assigned production ownership.
2. C edits Manager-owned `Video003.tsx`.
3. C adds a shared proof workflow outside its assigned production/report ownership.
4. A's mandatory moving-proof workflow was not complete at F's pin.
5. D has not reviewed the current A SHA.
6. B's installed native/articulation proof has not been independently accepted.
7. E has not reviewed current B/C SHAs; its existing report is stale.
8. F cannot certify a clean combined Manager staging build until Manager stages only authorized A/B/C production paths and owns the central C mount. F did not merge specialist production into its QA branch.

## Recommended integration order

1. Manager takes A's authorized `yunex/src/video003/motion/` delta from `a674f02cbb236b64015ace69583c43b57b5dd073` and A report; do not treat A's shared workflow as production-owned.
2. Manager takes B's authorized `yunex/src/video003/suspension/` delta from `d4b81aacfeeedfb2475c4e4cc59ed8a352164f4d`.
3. Manager takes only C's authorized `yunex/src/video003/track/` delta from `50783e0b477c5871cd3a2f2f329522bb8f373ef7` (plus report if desired).
4. Manager itself adds the C import/mount to `Video003.tsx`; do not wholesale-integrate C's central-file change.
5. Finish/review A's native proof and run D against the exact accepted A source.
6. Render/review B/C native proof and rerun E against the exact accepted B/C source.
7. Run combined compile/tests from the clean Manager staging tree, then rerun F if any accepted source SHA changes.

## F tooling

F added `yunex/video003/qa/polish02/preflight/p02-preflight.mjs`, a read-only git checker for:
- phase-base ancestry;
- specialist ownership boundaries;
- locked central-file changes;
- pairwise file overlap;
- key A/B/C contract structure;
- machine-readable PASS/BLOCKED/FAIL output.

## Final verdict

**FAIL / BLOCKED AS SUBMITTED.**

The safe implementation path is clear: A and B owned code can coexist; C's owned track code can coexist; Manager must exclude the unauthorized shared/central changes, perform the central mount itself, then complete current D/E proof review and a clean combined build before render release.
