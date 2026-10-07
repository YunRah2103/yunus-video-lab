# YUNEX 003 — POLISH 02 — AGENT F — INTEGRATION PREFLIGHT
Phase: Y003-POLISH-02
Work branch: sol/y003-p02-preflight
Production source is READ-ONLY.
Owned output: yunex/video003/qa/polish02/preflight/ and yunex/video003/reports/P02-F/

## Mission
Make A/B/C safe for one clean Manager integration. Do not integrate the film yourself.

## Inputs
Exact remote outputs from:
A — wheel rig
B — suspension detail
C — track world

Also read D/E QA when available.

## Check
- each branch descends from the published P02 base
- no unauthorized central/shared edits
- A/B/C changed only owned production areas unless explicitly documented
- TypeScript/API compatibility
- motion contract still satisfies suspension/camera/airflow consumers
- B does not assume stale wheel transforms
- C does not double-apply track/root transforms
- imports resolve when the three owned changes coexist
- deterministic frame evaluation
- model hash/livery untouched
- timeline/VO/cameras remain unchanged
- no high-cost per-frame geometry regression
- tests/build pass in a combined preflight context

You may create test harnesses and compatibility patches only under your QA/preflight-owned directories.
Do not edit Video003.tsx or merge specialist code into the manager branch.

## Required output
A compatibility matrix with exact SHAs, conflicts/risks, recommended integration order and PASS/FAIL.
Push and return full remote commit SHA.
