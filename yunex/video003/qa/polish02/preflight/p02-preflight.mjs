#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opts = new Map();
for (let i = 0; i < args.length; i += 2) opts.set(args[i], args[i + 1]);
for (const key of ['--base', '--a', '--b', '--c']) {
  if (!opts.get(key)) {
    console.error('Usage: node p02-preflight.mjs --base <ref> --a <ref> --b <ref> --c <ref> [--d <ref>] [--e <ref>] [--json <path>]');
    process.exit(2);
  }
}

const run = (...cmd) => execFileSync(cmd[0], cmd.slice(1), {encoding: 'utf8'}).trim();
const git = (...cmd) => run('git', ...cmd);
const resolve = (ref) => git('rev-parse', '--verify', \`\${ref}^{commit}\`);
const baseRef = opts.get('--base');
const roles = {
  A: {ref: opts.get('--a'), allowed: ['yunex/src/video003/motion/', 'yunex/video003/reports/P02-A/']},
  B: {ref: opts.get('--b'), allowed: ['yunex/src/video003/suspension/', 'yunex/video003/reports/P02-B/']},
  C: {ref: opts.get('--c'), allowed: ['yunex/src/video003/track/', 'yunex/video003/reports/P02-C/']},
};
const optional = {D: opts.get('--d'), E: opts.get('--e')};
const locked = [
  'yunex/src/video003/Video003.tsx',
  'yunex/src/video003/timeline.ts',
  'yunex/src/video003/types.ts',
  'yunex/src/index.tsx',
];
const expectedModelHash = '1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb';

const result = {
  phase: 'Y003-POLISH-02',
  generatedAt: new Date().toISOString(),
  base: {ref: baseRef, sha: resolve(baseRef)},
  roles: {},
  optionalQa: {},
  coexistence: {},
  lockedFiles: {},
  verdict: 'PASS',
  blockers: [],
  warnings: [],
};
const setBlocked = (msg) => { if (result.verdict === 'PASS') result.verdict = 'BLOCKED'; result.blockers.push(msg); };
const setFail = (msg) => { result.verdict = 'FAIL'; result.blockers.push(msg); };

for (const [id, spec] of Object.entries(roles)) {
  const sha = resolve(spec.ref);
  let descends = true;
  try { git('merge-base', '--is-ancestor', result.base.sha, sha); } catch { descends = false; }
  const changed = git('diff', '--name-only', \`\${result.base.sha}...\${sha}\`).split('\n').filter(Boolean);
  const unauthorized = changed.filter((p) => !spec.allowed.some((prefix) => p.startsWith(prefix)));
  const lockViolations = changed.filter((p) => locked.includes(p));
  const noDelta = sha === result.base.sha || changed.length === 0;
  result.roles[id] = {ref: spec.ref, sha, descendsFromBase: descends, changedFiles: changed, unauthorized, lockViolations, noDelta};
  if (!descends) setFail(\`\${id}: branch does not descend from published P02 base.\`);
  if (unauthorized.length) setFail(\`\${id}: unauthorized paths changed: \${unauthorized.join(', ')}\`);
  if (lockViolations.length) setFail(\`\${id}: locked files changed: \${lockViolations.join(', ')}\`);
  if (noDelta) setBlocked(\`\${id}: branch has no implementation delta from P02 base.\`);
}

for (const [id, ref] of Object.entries(optional)) {
  if (!ref) continue;
  const sha = resolve(ref);
  result.optionalQa[id] = {ref, sha, differsFromBase: sha !== result.base.sha};
  if (sha === result.base.sha) result.warnings.push(\`\${id}: no independent QA delta is available.\`);
}

const changedSets = Object.fromEntries(Object.entries(result.roles).map(([id, v]) => [id, new Set(v.changedFiles)]));
const pairwise = {};
for (const [x, y] of [['A', 'B'], ['A', 'C'], ['B', 'C']]) {
  const overlap = [...changedSets[x]].filter((p) => changedSets[y].has(p));
  pairwise[\`\${x}+\${y}\`] = {overlap};
  if (overlap.length) setFail(\`\${x}/\${y}: overlapping specialist writes: \${overlap.join(', ')}\`);
}
result.coexistence.pairwisePathOverlap = pairwise;

const show = (ref, file) => {
  try { return git('show', \`\${ref}:\${file}\`); } catch { return null; }
};
for (const file of locked) {
  const baseline = show(result.base.sha, file);
  result.lockedFiles[file] = {};
  for (const id of Object.keys(roles)) {
    const current = show(result.roles[id].sha, file);
    const same = current === baseline;
    result.lockedFiles[file][id] = same;
    if (!same) setFail(\`\${id}: locked file differs from base: \${file}\`);
  }
}

const motionText = (show(result.roles.A.sha, 'yunex/src/video003/motion/index.ts') ?? '') +
  (show(result.roles.A.sha, 'yunex/src/video003/motion/contract.ts') ?? '');
const suspensionAdapter = show(result.roles.B.sha, 'yunex/src/video003/suspension/motionAdapter.ts') ?? '';
const suspensionTypes = show(result.roles.B.sha, 'yunex/src/video003/suspension/types.ts') ?? '';
const trackAdapter = show(result.roles.C.sha, 'yunex/src/video003/track/trackAdapter.ts') ?? '';

const contractChecks = {
  motionExportsMotionState: /MotionState/.test(motionText),
  suspensionConsumesCentreSteerUpright: ['centreLocal', 'steerRad', 'uprightOffsetY'].every((k) => suspensionAdapter.includes(k)),
  suspensionUprightExcludesSpin: /excludes rim spin/i.test(suspensionTypes) && /wheelCenter/.test(suspensionTypes),
  trackStatesSingleRoot: /does not add a second root transform/i.test(trackAdapter),
  trackUsesY002Layout: /video002\/trackUpgrade\/racetrack\/layout/.test(trackAdapter),
};
result.coexistence.contractChecks = contractChecks;
for (const [name, ok] of Object.entries(contractChecks)) if (!ok) setFail(\`Contract check failed: \${name}\`);

result.modelHash = {
  expectedSha256: expectedModelHash,
  status: 'REQUIRES_ASSET_BYTE_CHECK',
};

const out = JSON.stringify(result, null, 2) + '\n';
if (opts.get('--json')) {
  const dest = path.resolve(opts.get('--json'));
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, out);
}
process.stdout.write(out);
process.exit(result.verdict === 'PASS' ? 0 : result.verdict === 'BLOCKED' ? 3 : 1);
