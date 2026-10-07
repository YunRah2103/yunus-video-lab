# YUNEX 003 — POLISH 02 — Agent F Integration Preflight

Phase: Y003-POLISH-02  
Role: F — Integration preflight  
Branch: `sol/y003-p02-preflight`  
Published P02 base: `064fc7687ad16e9fc99c32c3c323154b7e4496f1`  
Decision: **FAIL / BLOCKED — DO NOT INTEGRATE A/B/C YET**

## Compatibility matrix

| Role | Remote SHA reviewed | Base ancestry | Owned-path audit | Compatibility status | Result |
|---|---|---|---|---|---|
| A — wheel rig | `064fc7687ad16e9fc99c32c3c323154b7e4496f1` | identical to published base | 0 changed files; therefore no unauthorized edits, but no implementation exists | intended wheel-rig delta absent; cannot test new wheel transforms | **FAIL / BLOCKED** |
| B — suspension detail | `064fc7687ad16e9fc99c32c3c323154b7e4496f1` | identical to published base | 0 changed files; therefore no unauthorized edits, but no implementation exists | intended detail delta absent; cannot prove it consumes A without stale wheel assumptions | **FAIL / BLOCKED** |
| C — track world | `064fc7687ad16e9fc99c32c3c323154b7e4496f1` | identical to published base | 0 changed files; therefore no unauthorized edits, but no implementation exists | intended circuit-world delta absent; cannot test new coexistence/imports | **FAIL / BLOCKED** |
| D — wheel/driving QA | `064fc7687ad16e9fc99c32c3c323154b7e4496f1` | identical to published base | no QA delta | no independent A review yet | **NOT AVAILABLE** |
| E — suspension/track QA | `b5678073fb61cf2ee4095ca8dbdc3238c5ccb143` | descends from published base | QA/report files only | independently reports B/C baseline-only and missing revised proof | **BLOCKED / FAIL** |

## Baseline contract checks

The published base is internally structured for the intended integration:
- motion publishes a `MotionState` contract;
- suspension's motion adapter consumes `centreLocal`, `steerRad`, and `uprightOffsetY`;
- the suspension upright contract explicitly excludes rim spin, preserving fixed caliper/upright ownership;
- the Y003 track adapter imports the established Y002 racetrack layout and explicitly states that it does not add a second root transform.

These checks are **baseline-only**. They must not be mistaken for acceptance of A/B/C because all three production branches are still exactly the phase base.

## Locked invariants

Because A/B/C have zero diff from the phase base, no change is currently present to:
- `yunex/src/video003/Video003.tsx`;
- `yunex/src/video003/timeline.ts`;
- `yunex/src/video003/types.ts`;
- `yunex/src/index.tsx`;
- narration/camera/story timing;
- the approved Porsche asset manifest/hash.

Expected approved model SHA-256 remains:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`.

## Conflicts and risks

1. **Hard blocker:** A, B and C have no remote implementation commits beyond P02 base. There is nothing for Manager to integrate.
2. **B-after-A risk:** B is required not to assume stale wheel transforms. Until A publishes the actual wheel-rig contract/implementation, B cannot be compatibility-approved against it.
3. **Visual evidence blocker:** E already reports B/C revised native proofs missing. D has no remote QA delta yet, so A lacks independent wheel/driving review.
4. **Combined build blocker:** a meaningful A+B+C coexistence build/test cannot be run when all three heads are the base tree. Claiming build PASS here would be false.
5. **Performance/determinism blocker:** no new production geometry or frame transforms exist yet, so per-frame allocation and deterministic-evaluation regressions cannot be assessed for the intended polish.

## Recommended integration order

1. **A first** — publish wheel-rig implementation + deterministic/moving proof.
2. **D reviews A** at that exact SHA.
3. **B second** — publish suspension detail and verify it against A's final motion/wheel transform contract; then E reviews B.
4. **C third** — publish track-world adapter/coverage work; E reviews C.
5. **F reruns this preflight** against exact accepted A/B/C SHAs and validates ownership, locked files, contract coexistence, deterministic checks, and combined compile/test.
6. Only after F PASS should Manager perform the central integration.

## Tooling added by F

`yunex/video003/qa/polish02/preflight/p02-preflight.mjs` is a read-only git preflight checker. It verifies base ancestry, specialist ownership boundaries, locked central files, pairwise path overlap, key motion/suspension/track contract structure, and emits machine-readable JSON with PASS/BLOCKED/FAIL exit semantics.

The checker itself was syntax-validated and exercised in an isolated temporary git repository. A no-delta A/B/C fixture correctly returns **BLOCKED**.

## Final verdict

**FAIL / BLOCKED. Do not integrate A/B/C from the reviewed SHAs.**

This is not a claim that the existing YUNEX 003 baseline is broken. It means the required POLISH-02 specialist implementations are not present on their remote branches, so F cannot truthfully certify integration compatibility yet.
