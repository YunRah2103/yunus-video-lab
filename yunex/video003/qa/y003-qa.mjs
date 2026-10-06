#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const EXPECTED_PHASE = 'Y003-SUSPENSION-AERO-01';
const EXPECTED_MODEL_SHA256 = '1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb';
const REQUIRED_MILESTONES = ['hook','turn-in','reveal','profile','braking-load','whole-car','exit'];
const REQUIRED_PROOFS = {
  drivingTracking: [4, 6],
  drivingTrackside: [4, 6],
  reveal: [3, 5],
  airflow: [3, 5],
};

const args = process.argv.slice(2);
const strictFinal = args.includes('--final');
const manifestArg = args.find((a) => !a.startsWith('--'));
if (!manifestArg) {
  console.error('Usage: node y003-qa.mjs <evidence.json> [--final]');
  process.exit(2);
}

const manifestPath = path.resolve(manifestArg);
const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const findings = [];
const add = (severity, code, message, owner = 'Manager') => findings.push({severity, code, owner, message});
const fail = (code, msg, owner) => add('FAIL', code, msg, owner);
const block = (code, msg, owner) => add('BLOCKED', code, msg, owner);
const warn = (code, msg, owner) => add('WARN', code, msg, owner);

function isSha40(v) { return typeof v === 'string' && /^[0-9a-f]{40}$/i.test(v); }
function finite(v) { return Number.isFinite(v); }
function durationOf(p) {
  if (!p) return NaN;
  if (finite(p.durationSec)) return p.durationSec;
  if (finite(p.startSec) && finite(p.endSec)) return p.endSec - p.startSec;
  return NaN;
}

if (data.phase !== EXPECTED_PHASE) fail('phase', `Expected phase ${EXPECTED_PHASE}, got ${String(data.phase)}`, 'Manager');
if (!isSha40(data.sourceSha)) block('source-sha', 'Evidence must name the exact 40-character integrated source SHA.', 'Manager');
if (data.modelSha256 !== EXPECTED_MODEL_SHA256) fail('model-hash', 'Approved Porsche model SHA256 changed or was not verified.', 'Manager');

const proofs = data.proofs ?? {};
for (const [name, range] of Object.entries(REQUIRED_PROOFS)) {
  const p = proofs[name];
  if (!p?.uri) {
    block(`proof-${name}`, `Missing ${name} motion proof URI/provenance.`, name.startsWith('driving') ? 'A/C/Manager' : name === 'reveal' ? 'C/Manager' : 'D/Manager');
    continue;
  }
  const d = durationOf(p);
  if (!finite(d) || d < range[0] || d > range[1]) {
    fail(`proof-${name}-duration`, `${name} proof must be ${range[0]}–${range[1]}s; got ${finite(d) ? d.toFixed(3) : 'unknown'}s.`, 'Manager');
  }
  if (p.reduced === true && p.labelledReduced !== true) fail(`proof-${name}-label`, `${name} reduced proof is not explicitly labelled reduced.`, 'Manager');
}

const frames = Array.isArray(data.nativeFrames) ? data.nativeFrames : [];
for (const milestone of REQUIRED_MILESTONES) {
  const f = frames.find((x) => x?.milestone === milestone);
  if (!f) { block(`frame-${milestone}`, `Missing native milestone frame: ${milestone}.`, 'Manager/G'); continue; }
  if (f.width !== 1080 || f.height !== 1920 || f.scale !== 1) fail(`frame-${milestone}-native`, `${milestone} must be native 1080x1920 scale1.`, 'G');
  if (!f.uri) block(`frame-${milestone}-uri`, `${milestone} has no evidence URI/provenance.`, 'G');
}

const motion = data.motion ?? {};
const samples = Array.isArray(motion.samples) ? motion.samples : [];
if (samples.length < 3) {
  block('motion-samples', 'Need >=3 chronological motion samples for distance/spin/contact checks.', 'A/Manager');
} else {
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i];
    if (finite(a.frame) && finite(b.frame) && b.frame <= a.frame) fail('motion-frame-order', `Motion sample frames are not strictly increasing at ${a.frame} -> ${b.frame}.`, 'A');
    if (finite(a.distanceM) && finite(b.distanceM) && b.distanceM < a.distanceM - 1e-6) fail('distance-monotonic', `Path distance reversed at frame ${b.frame}.`, 'A');
  }
}

if (finite(motion.wheelRadiusM) && motion.wheelRadiusM > 0 && samples.length >= 2) {
  const tol = finite(motion.spinToleranceRad) ? motion.spinToleranceRad : 0.12;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i];
    if (![a.distanceM,b.distanceM,a.spinRad,b.spinRad].every(finite)) continue;
    const expected = (b.distanceM - a.distanceM) / motion.wheelRadiusM;
    const actual = Math.abs(b.spinRad - a.spinRad);
    if (Math.abs(actual - Math.abs(expected)) > tol) fail('distance-spin', `Frame ${b.frame}: wheel spin delta ${actual.toFixed(3)} rad disagrees with distance-derived ${Math.abs(expected).toFixed(3)} rad.`, 'A');
  }
} else if (samples.length) {
  block('wheel-radius', 'wheelRadiusM is required to verify distance-derived wheel spin.', 'A');
}

for (const s of samples) {
  if (finite(s.curvature) && finite(s.steerRad) && Math.abs(s.curvature) > 1e-5 && Math.abs(s.steerRad) > 1e-5) {
    if (Math.sign(s.curvature) !== Math.sign(s.steerRad)) fail('steering-sign', `Frame ${s.frame}: steering sign disagrees with path curvature.`, 'A');
  }
  if (finite(s.maxTyreContactErrorM) && s.maxTyreContactErrorM > 0.025) fail('tyre-contact', `Frame ${s.frame}: tyre contact error ${s.maxTyreContactErrorM.toFixed(4)}m exceeds 0.025m QA tolerance.`, 'A');
  if (s.caliperSpinsWithWheel === true) fail('caliper-spin', `Frame ${s.frame}: brake caliper is rotating with wheel spin.`, 'A/B');
}

const mech = data.mechanics ?? {};
if (Array.isArray(mech.links)) {
  for (const link of mech.links) {
    if (!finite(link.maxEndpointGapM)) { block('link-gap-data', `Link ${link.name ?? '(unnamed)'} lacks endpoint-gap measurement.`, 'B'); continue; }
    if (link.maxEndpointGapM > 0.02) fail('disconnected-link', `Link ${link.name ?? '(unnamed)'} endpoint gap ${link.maxEndpointGapM.toFixed(4)}m exceeds 0.02m.`, 'B');
    if (link.installed !== true) fail('link-installed', `Link ${link.name ?? '(unnamed)'} is not verified installed/connected in the moving assembly.`, 'B');
  }
} else {
  block('mechanical-links', 'No installed front-suspension link measurements supplied.', 'B/Manager');
}
if (mech.referenceInformedSimplification !== true) fail('mechanical-claim', 'Suspension must be explicitly identified as a reference-informed simplified illustration, not manufacturer CAD.', 'B/Manager');
if (mech.trackRootAppliedExactlyOnce !== true) fail('transform-root', 'Track/root transform was not verified as applied exactly once.', 'Manager');

const science = data.science ?? {};
if (science.claims40kg === true && science.qualifierRetained !== true) fail('40kg-qualifier', 'Any 40kg front-axle downforce claim must retain Porsche/top-speed qualification.', 'D/E');
if (science.impliesAntiDiveEliminatesWeightTransfer === true) fail('anti-dive-claim', 'Film implies anti-dive eliminates weight transfer.', 'D/E');
if (science.impliesLinksGenerateAllDownforce === true) fail('link-aero-claim', 'Film implies suspension links generate the whole aero/downforce effect.', 'D/E');
if (science.airflowLocalizedFrontAxle !== true) fail('airflow-placement', 'Airflow explanation is not verified as localized to the front axle/wheel-housing region.', 'D/Manager');

const visual = data.visualReview ?? {};
for (const key of ['drivingLooksPhysical','tracksideCrossingPresent','roadParallaxMatchesSpeed','revealReadable','profileReadable','circuitIdentityPresent','graphicsNoClipping','activeMovingExit']) {
  if (visual[key] === false) fail(`visual-${key}`, `Visual review failed: ${key}.`, 'Manager/owner');
  else if (visual[key] !== true) block(`visual-${key}`, `Independent reviewer has not confirmed: ${key}.`, 'H');
}
if (visual.stationaryOrSlidingGLB === true) fail('visual-sliding', 'Driving proof reads as a stationary/sliding GLB.', 'A/C/Manager');

if (strictFinal || data.finalExport) {
  const f = data.finalExport;
  if (!f) {
    block('final-export', 'Final mode requested but no finalExport evidence supplied.', 'G');
  } else {
    if (f.width !== 1080 || f.height !== 1920 || f.scale !== 1) fail('final-native', 'Final export is not native 1080x1920 scale1.', 'G');
    if (f.fps !== 30) fail('final-fps', `Final fps must be 30; got ${String(f.fps)}.`, 'G');
    if (String(f.videoCodec).toLowerCase() !== 'h264') fail('final-codec', 'Final video codec must be H264.', 'G');
    if (String(f.pixelFormat).toLowerCase() !== 'yuv420p') fail('final-pixfmt', 'Final pixel format must be yuv420p.', 'G');
    if (String(f.audioCodec).toLowerCase() !== 'aac') fail('final-audio-codec', 'Final audio codec must be AAC.', 'G');
    if (f.faststart !== true) fail('final-faststart', 'Final MP4 faststart not verified.', 'G');
    if (f.fullDecode !== true) fail('final-decode', 'Final full decode not verified.', 'G');
    if (f.gapFree !== true) fail('final-gaps', 'Final frame continuity/gap-free assembly not verified.', 'G');
    if (f.audioPresent !== true) fail('final-audio', 'Supplied narration/audio track not verified in final export.', 'F/G');
    if (finite(f.expectedFrames) && finite(f.decodedFrames) && f.expectedFrames !== f.decodedFrames) fail('final-frame-count', `Decoded ${f.decodedFrames} frames; expected ${f.expectedFrames}.`, 'G');
  }
}

const failures = findings.filter((x) => x.severity === 'FAIL');
const blockers = findings.filter((x) => x.severity === 'BLOCKED');
const status = failures.length ? 'FAIL' : blockers.length ? 'BLOCKED' : 'PASS';
console.log(JSON.stringify({status, sourceSha: data.sourceSha ?? null, findings}, null, 2));
process.exit(status === 'PASS' ? 0 : status === 'FAIL' ? 1 : 3);
