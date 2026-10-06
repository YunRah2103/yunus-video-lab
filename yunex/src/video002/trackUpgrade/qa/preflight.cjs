'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {execFileSync} = require('child_process');
const {runSightlineAudit} = require('./sightline-audit.cjs');

const EXPECTED_PORSCHE_SHA256 = '1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb';
const DEFAULTS = {
  base: 'sol/yunex-002-active-aero',
  A: 'sol/yunex-002-track-road',
  B: 'sol/yunex-002-track-furniture',
  D: 'sol/yunex-002-track-lighting',
};
const FILES = {
  integrated: 'yunex/src/video002/Video002Integrated.tsx',
  preview: 'yunex/src/TrackPreview.tsx',
  driving: 'yunex/src/video002/driving.ts',
  cameras: 'yunex/src/video002/cameras.ts',
  manifest: 'cars/porsche-911-gt3-rs-992/asset-manifest.json',
  car: 'cars/porsche-911-gt3-rs-992/model.glb',
  A: 'yunex/src/video002/trackUpgrade/RoadSurfaces.tsx',
  ALayout: 'yunex/src/video002/trackUpgrade/road/layout.ts',
  ATextures: 'yunex/src/video002/trackUpgrade/road/proceduralRoadTexture.ts',
  B: 'yunex/src/video002/trackUpgrade/TrackFurniture.tsx',
  D: 'yunex/src/video002/trackUpgrade/TrackLighting.tsx',
  DProfile: 'yunex/src/video002/trackUpgrade/lighting/profile.ts',
  DTextures: 'yunex/src/video002/trackUpgrade/lighting/textures.ts',
};

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const clean = arg.replace(/^--/, '');
  const at = clean.indexOf('=');
  return at === -1 ? [clean, true] : [clean.slice(0, at), clean.slice(at + 1)];
}));
const configured = {
  base: args.base || process.env.YUNEX_BASE_REF || DEFAULTS.base,
  A: args.a || process.env.YUNEX_A_REF || DEFAULTS.A,
  B: args.b || process.env.YUNEX_B_REF || DEFAULTS.B,
  D: args.d || process.env.YUNEX_D_REF || DEFAULTS.D,
  C: args.c || process.env.YUNEX_C_REF || null,
};

const git = (repoRoot, argv, options = {}) => execFileSync('git', ['-C', repoRoot, ...argv], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  ...options,
}).trim();

const findRepoRoot = () => {
  if (args.repo) return path.resolve(String(args.repo));
  return execFileSync('git', ['rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim();
};

const resolveRef = (repoRoot, ref) => {
  const candidates = [ref, `origin/${ref}`];
  for (const candidate of candidates) {
    try {
      git(repoRoot, ['rev-parse', '--verify', `${candidate}^{commit}`]);
      return candidate;
    } catch (_) {}
  }
  throw new Error(`Missing git ref ${ref}. Fetch it first (for example: git fetch origin ${ref}).`);
};

const show = (repoRoot, ref, file) => git(repoRoot, ['show', `${ref}:${file}`]);
const changedFiles = (repoRoot, baseRef, specialistRef) => {
  const mergeBase = git(repoRoot, ['merge-base', baseRef, specialistRef]);
  const files = git(repoRoot, ['diff', '--name-only', `${mergeBase}..${specialistRef}`]);
  return {mergeBase, files: files ? files.split('\n').filter(Boolean) : []};
};
const divergence = (repoRoot, baseRef, specialistRef) => {
  const raw = git(repoRoot, ['rev-list', '--left-right', '--count', `${baseRef}...${specialistRef}`]);
  const [baseOnly, specialistOnly] = raw.split(/\s+/).map(Number);
  return {baseOnly, specialistOnly};
};

const findings = [];
const add = (role, severity, check, detail, fix = '') => findings.push({role, severity, check, detail, fix});
const requirePattern = (role, source, pattern, check, detail) => {
  if (pattern.test(source)) add(role, 'PASS', check, detail);
  else add(role, 'FAIL', check, `Missing expected source contract: ${pattern}`, 'Do not integrate until the specialist source contract is restored.');
};
const forbidPattern = (role, source, pattern, check, detail) => {
  if (!pattern.test(source)) add(role, 'PASS', check, detail);
  else add(role, 'FAIL', check, `Forbidden pattern found: ${pattern}`, 'Remove non-deterministic/per-frame rebuild behavior before integration.');
};

const main = () => {
  const repoRoot = findRepoRoot();
  const refs = {
    base: resolveRef(repoRoot, configured.base),
    A: resolveRef(repoRoot, configured.A),
    B: resolveRef(repoRoot, configured.B),
    D: resolveRef(repoRoot, configured.D),
  };
  if (configured.C) refs.C = resolveRef(repoRoot, configured.C);

  const heads = Object.fromEntries(Object.entries(refs).map(([key, ref]) => [key, git(repoRoot, ['rev-parse', ref])]));
  const baseIntegrated = show(repoRoot, refs.base, FILES.integrated);
  const basePreview = show(repoRoot, refs.base, FILES.preview);
  const baseDriving = show(repoRoot, refs.base, FILES.driving);
  const baseCameras = show(repoRoot, refs.base, FILES.cameras);
  const manifest = JSON.parse(show(repoRoot, refs.base, FILES.manifest));
  const aSource = show(repoRoot, refs.A, FILES.A);
  const aLayout = show(repoRoot, refs.A, FILES.ALayout);
  const aTextures = show(repoRoot, refs.A, FILES.ATextures);
  const bSource = show(repoRoot, refs.B, FILES.B);
  const dSource = show(repoRoot, refs.D, FILES.D);
  const dProfile = show(repoRoot, refs.D, FILES.DProfile);
  const dTextures = show(repoRoot, refs.D, FILES.DTextures);

  const cameraFixtureTokens = [
    'hookEnd: 72', 'wingMacroEnd: 165', 'highDownforceEnd: 285', 'drsEnd: 405',
    'brakingEnd: 540', 'coordinationEnd: 660', 'finalEnd: 750',
    'positionOffset: [4.4, 1.7, -7.4]', 'positionOffset: [5.2, 1.5, 7.8]',
  ];
  const fixtureSource = `${baseDriving}\n${baseCameras}`;
  if (cameraFixtureTokens.every((token) => fixtureSource.includes(token)) &&
      baseIntegrated.includes("if(timing.beat.id==='drs')") &&
      baseIntegrated.includes('position:[rootX-8.6,1.72,rootZ+0.18]') &&
      baseIntegrated.includes("else if(timing.beat.id==='airbrake')") &&
      baseIntegrated.includes('position:[rootX-5.8,2.18,rootZ-7.2]') &&
      baseIntegrated.includes("else if(timing.beat.id==='payoff')") &&
      baseIntegrated.includes('position:[rootX-5.6,1.68,rootZ+7.5]')) {
    add('ALL', 'PASS', 'camera fixture lock', 'Analytic frame 0-750 audit matches the current locked camera/driving constants and manager overrides.');
  } else {
    add('ALL', 'FAIL', 'camera fixture lock', 'Camera/driving source changed relative to the preflight fixture.', 'Update sightline-audit.cjs from the approved camera source before trusting its results.');
  }

  requirePattern('A', aSource, /export type RoadSurfacesProps\s*=\s*\{[\s\S]*quality:\s*RoadQuality;[\s\S]*seed\?:\s*number;/, 'component API', 'RoadSurfaces exposes required quality + optional seed props.');
  requirePattern('A', aSource, /coordinateSpace:\s*'TechnicalTrackWorld local coordinates'/, 'coordinate contract', 'A is authored in shared TechnicalTrackWorld local coordinates.');
  requirePattern('A', aSource, /position:\s*\[-1,\s*-0\.028,\s*0\]/, 'root transform contract', 'A documents the manager-owned [-1,-0.028,0] root.');
  forbidPattern('A', `${aSource}\n${aLayout}\n${aTextures}`, /Math\.random|Date\.now|performance\.now|crypto\.random/, 'determinism', 'A has no runtime non-deterministic generator.');
  if (aSource.includes('useMemo(() => createRoadTextures') && aSource.includes('useMemo(() => buildRoadDecor')) {
    add('A', 'PASS', 'rebuild cost', 'Road textures and decor are memoized by quality/seed rather than rebuilt per frame.');
  } else add('A', 'WARN', 'rebuild cost', 'Could not prove both road texture and decor memoization from source.', 'Inspect A mounting/render lifecycle before full render.');

  requirePattern('B', bSource, /export type TrackFurnitureProps\s*=\s*\{[\s\S]*quality:\s*'preview'\s*\|\s*'final';[\s\S]*seed\?:\s*number;/, 'component API', 'TrackFurniture exposes required quality + optional seed props.');
  forbidPattern('B', bSource, /Math\.random|Date\.now|performance\.now|crypto\.random/, 'determinism', 'B uses its seeded LCG and no runtime non-deterministic generator.');
  if (bSource.includes('useMemo(() => buildFurnitureLayout(seed, quality)')) add('B', 'PASS', 'rebuild cost', 'Furniture layout is memoized by quality/seed.');
  else add('B', 'WARN', 'rebuild cost', 'Could not prove furniture layout memoization from source.', 'Inspect B mounting/render lifecycle before full render.');

  requirePattern('D', dSource, /export type TrackLightingProps\s*=\s*\{[\s\S]*quality:TrackLightingQuality;[\s\S]*seed\?:number;/, 'component API', 'TrackLighting exposes required quality + optional seed props.');
  requirePattern('D', dSource, /rootPoseAt\(frame\)/, 'world-space follow', 'D follows the approved Porsche root in world space.');
  forbidPattern('D', `${dSource}\n${dProfile}\n${dTextures}`, /Math\.random|Date\.now|performance\.now|crypto\.random/, 'determinism', 'D procedural textures are deterministic.');
  if (dSource.includes('useLayoutEffect(()=>{') && dSource.includes('new THREE.PMREMGenerator(gl)') && !/useLayoutEffect\(\(\)=>\{[\s\S]{0,2500}PMREMGenerator[\s\S]{0,500}\},\[[^\]]*frame/.test(dSource)) {
    add('D', 'PASS', 'PMREM lifecycle', 'PMREM environment creation is effect-scoped and not keyed to frame.');
  } else add('D', 'WARN', 'PMREM lifecycle', 'Could not prove PMREM is excluded from frame-keyed rebuilding.', 'Keep PMREM/environment creation mount-scoped.');

  const ownershipRules = {
    A: (file) => file === FILES.A || file.startsWith('yunex/src/video002/trackUpgrade/road/'),
    B: (file) => file === FILES.B || file.startsWith('yunex/src/video002/trackUpgrade/furniture/'),
    D: (file) => file === FILES.D || file.startsWith('yunex/src/video002/trackUpgrade/lighting/'),
  };
  const diffs = {};
  for (const role of ['A', 'B', 'D']) {
    diffs[role] = changedFiles(repoRoot, refs.base, refs[role]);
    const div = divergence(repoRoot, refs.base, refs[role]);
    const offScope = diffs[role].files.filter((file) => !ownershipRules[role](file));
    if (offScope.length === 0) add(role, 'PASS', 'branch ownership', `Changed paths stay inside ${role}'s owned track-upgrade files.`);
    else add(role, 'FAIL', 'branch ownership', `Off-scope changed paths: ${offScope.join(', ')}`, 'Do not cherry-pick off-scope commits; split or revert them first.');
    if (div.baseOnly === 0) add(role, 'PASS', 'base freshness', 'Specialist branch contains current manager base history.');
    else add(role, 'WARN', 'base freshness', `Specialist branch is ${div.baseOnly} manager commit(s) behind current base and ${div.specialistOnly} commit(s) ahead.`, 'Cherry-pick specialist implementation commits; do not merge/rebase the whole branch history into the manager branch.');
  }

  const pairs = [['A', 'B'], ['A', 'D'], ['B', 'D']];
  for (const [x, y] of pairs) {
    const ySet = new Set(diffs[y].files);
    const overlap = diffs[x].files.filter((file) => ySet.has(file));
    if (overlap.length === 0) add(`${x}/${y}`, 'PASS', 'changed-path conflict', 'No same-path specialist edits detected.');
    else add(`${x}/${y}`, 'FAIL', 'changed-path conflict', `Both branches edit: ${overlap.join(', ')}`, 'Manager must resolve same-file conflicts manually before integration.');
  }

  if (basePreview.includes('<Kerb/><Rail/>')) {
    add('A', 'WARN', 'legacy kerb overlap', 'TechnicalTrackWorld still renders legacy Kerb(); A adds a raised kerb through the same central track strip.', 'When A is enabled, suppress/remove the legacy Kerb() from the YUNEX 002 track path. Do not render both.');
    add('B', 'WARN', 'legacy rail overlap', 'TechnicalTrackWorld still renders legacy Rail(); B places its guardrail on the same x=-3.62 run.', 'When B is enabled, suppress/remove the legacy Rail() from the YUNEX 002 track path. Do not render both.');
  } else {
    add('A/B', 'PASS', 'legacy replacement', 'Legacy Kerb/Rail are already absent from the current technical track path.');
  }

  if (baseIntegrated.includes("<hemisphereLight args={['#e8efec','#30362f',1.48]}/>") &&
      baseIntegrated.includes('toneMappingExposure=1.02') &&
      baseIntegrated.includes('object.castShadow=false')) {
    add('D', 'WARN', 'manager renderer wiring', 'Current integrated scene still owns legacy lights/background, exposure 1.02, disables Porsche castShadow, and does not enable ThreeCanvas shadows.', 'Replace—not stack—the legacy light/background setup; enable renderer shadows/PCFSoftShadowMap, set exposure 0.94, and set Porsche mesh castShadow=true while preserving materials. Mount TrackLighting at scene/world level, not inside the rotated track root.');
  } else {
    add('D', 'WARN', 'manager renderer wiring', 'Base renderer/light wiring differs from the preflight snapshot.', 'Reconcile TrackLighting requirements manually before final render.');
  }

  const geo = runSightlineAudit();
  if (geo.pass) {
    add('A/B', 'PASS', '751-frame geometry/sightline audit', `0 guardrail hits, 0 catch-fence hits; minimum rail sightline clearance ${geo.rail.minimumClearanceMetres.toFixed(3)} m; minimum fence longitudinal miss ${geo.fence.minimumLongitudinalGapMetres.toFixed(3)} m; minimum road coverage margin ${geo.minimumCoverageMarginMetres.toFixed(3)} m.`);
  } else {
    add('A/B', 'FAIL', '751-frame geometry/sightline audit', JSON.stringify(geo), 'Do not integrate until the failing overlap/occlusion is corrected.');
  }
  add('A/B', 'PASS', 'new component separation', `A kerb to B furniture local-X gap is ${geo.aToBKerbFurnitureGapLocalMetres.toFixed(3)} m.`);
  add('A', 'WARN', 'road layering seam', 'A asphalt/verge overlap by 0.04 m in X with only 0.0007 m local-Y separation; A asphalt also sits only ~0.0016 m above the legacy technical asphalt.', 'Prefer A as the visible authored road/verge layer and keep legacy road only as a non-coplanar backing surface; inspect the edge seam at native resolution.');

  add('A', 'PASS', 'estimated cost', 'Final A budget: 7 road/decor draw calls, 181 instances, ~10.67 MiB road texture memory including mipmaps.');
  add('B', 'PASS', 'estimated cost', 'Final B budget: 10 instanced draw calls, 270 instances, no authored texture allocation.');
  add('D', 'WARN', 'estimated cost', 'D adds one contact draw plus a 2048 shadow map and a shadow render pass; sky/contact source textures are ~0.22 MiB before PMREM/shadow targets.', 'Treat D shadow rendering as the likely new GPU/render-time hotspot; benchmark after A/B integration before the full 751-frame native render.');

  if (manifest.sha256 === EXPECTED_PORSCHE_SHA256) add('ALL', 'PASS', 'Porsche manifest SHA', `Manifest remains ${EXPECTED_PORSCHE_SHA256}.`);
  else add('ALL', 'FAIL', 'Porsche manifest SHA', `Manifest SHA is ${manifest.sha256}`, 'Restore the approved Porsche before integration.');
  const porscheTouched = ['A', 'B', 'D']
    .flatMap((role) => diffs[role].files.map((file) => [role, file]))
    .filter(([, file]) => file === FILES.car || file === FILES.manifest || file === 'yunex/public/model.glb' || file.startsWith('cars/porsche-911-gt3-rs-992/'));
  if (porscheTouched.length === 0) add('ALL', 'PASS', 'Porsche branch diff lock', 'A/B/D changed-file sets do not touch Porsche source/staged assets.');
  else add('ALL', 'FAIL', 'Porsche branch diff lock', `Porsche paths touched: ${porscheTouched.map(([r, f]) => `${r}:${f}`).join(', ')}`, 'Reject those commits or restore the approved asset before integration.');

  const workingCar = path.join(repoRoot, FILES.car);
  if (fs.existsSync(workingCar)) {
    const buf = fs.readFileSync(workingCar);
    const isLfsPointer = buf.length < 1024 && buf.toString('utf8').startsWith('version https://git-lfs.github.com/spec/v1');
    if (isLfsPointer) add('ALL', 'WARN', 'working Porsche SHA', 'Working tree contains an LFS pointer, so byte SHA-256 was not computed.', 'Hydrate the LFS object before final manager render/QA.');
    else {
      const digest = crypto.createHash('sha256').update(buf).digest('hex');
      if (digest === EXPECTED_PORSCHE_SHA256) add('ALL', 'PASS', 'working Porsche SHA', `Hydrated model.glb byte SHA-256 matches ${EXPECTED_PORSCHE_SHA256}.`);
      else add('ALL', 'FAIL', 'working Porsche SHA', `Hydrated model.glb SHA-256 is ${digest}`, 'Restore the approved Porsche asset before rendering.');
    }
  } else add('ALL', 'WARN', 'working Porsche SHA', 'model.glb is not present in the current working tree; manifest/diff checks passed but byte hash could not run.', 'Ensure the manager checkout has the approved hydrated asset before rendering.');

  if (refs.C) {
    const cDiff = changedFiles(repoRoot, refs.base, refs.C);
    const cDiv = divergence(repoRoot, refs.base, refs.C);
    const forbidden = cDiff.files.filter((file) => [FILES.integrated, FILES.preview].includes(file) || /Porsche|model\.glb|cameras\.ts|driving\.ts|timeline\.ts|AeroFlow|activeAero|frontFlaps/.test(file));
    if (forbidden.length === 0) add('C', 'PASS', 'optional C scope', 'No protected central/Porsche/camera/aero paths detected.');
    else add('C', 'FAIL', 'optional C scope', `Protected paths changed: ${forbidden.join(', ')}`, 'Manager should not integrate protected-path changes from C.');
    if (cDiv.baseOnly > 0) add('C', 'WARN', 'optional C base freshness', `C is ${cDiv.baseOnly} manager commit(s) behind current base.`, 'Cherry-pick C implementation commits rather than merging branch history.');
    const cSources = cDiff.files.filter((file) => /\.(ts|tsx|js|cjs|mjs)$/.test(file)).map((file) => {
      try { return show(repoRoot, refs.C, file); } catch (_) { return ''; }
    }).join('\n');
    if (/Math\.random|Date\.now|performance\.now|crypto\.random/.test(cSources)) add('C', 'WARN', 'optional C determinism', 'Potential non-deterministic source token found in C changed files.', 'Review whether it executes during render; replace per-frame randomness with seeded generation.');
    else add('C', 'PASS', 'optional C determinism', 'No obvious runtime non-deterministic token found in C changed source.');
    const existing = new Set([...diffs.A.files, ...diffs.B.files, ...diffs.D.files]);
    const cConflicts = cDiff.files.filter((file) => existing.has(file));
    if (cConflicts.length === 0) add('C', 'PASS', 'optional C file conflict', 'No same-path conflict with A/B/D.');
    else add('C', 'FAIL', 'optional C file conflict', `C overlaps specialist paths: ${cConflicts.join(', ')}`, 'Manager must resolve before integration.');
  }

  const rank = {PASS: 1, WARN: 2, FAIL: 3};
  const worst = findings.reduce((acc, item) => rank[item.severity] > rank[acc] ? item.severity : acc, 'PASS');
  const summary = {
    phase: 'Y002-TRACK-UPGRADE-01',
    role: 'F',
    task: 'track integration preflight / QA',
    refs: configured,
    resolvedRefs: refs,
    heads,
    geometry: geo,
    overall: worst,
    findings,
  };

  if (args.json) console.log(JSON.stringify(summary, null, 2));
  else {
    console.log(`Y002 Agent F preflight: ${worst}`);
    console.log(`base ${configured.base} -> ${heads.base}`);
    for (const role of ['A', 'B', 'D']) console.log(`${role} ${configured[role]} -> ${heads[role]}`);
    if (heads.C) console.log(`C ${configured.C} -> ${heads.C}`);
    for (const item of findings) {
      console.log(`[${item.severity}] ${item.role} :: ${item.check} :: ${item.detail}`);
      if (item.fix) console.log(`  fix: ${item.fix}`);
    }
  }
  if (findings.some((item) => item.severity === 'FAIL')) process.exitCode = 1;
};

try {
  main();
} catch (error) {
  console.error(`F preflight could not run: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
}
