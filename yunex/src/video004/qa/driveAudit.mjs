/**
 * YUNEX 004 independent frame-data audit. No coupling to implementation internals.
 * Input: JSON-serialisable Y004DriveFrame samples from the exact accepted source SHA.
 * This is automated/kinematic QA, not native moving-visual acceptance.
 */
export const WHEELS = Object.freeze(['FL', 'FR', 'RL', 'RR']);
export const SEGMENTS = Object.freeze(['low-hook', 'rear-macro', 'low-explain', 'high-explain', 'high-drive', 'trackside-exit']);
const cap = Math.PI / 180;
const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const diff = (a, b) => Math.abs(a - b);
const average = (a, b) => (a + b) / 2;

export function auditDriveFrames(samples, opts = {}) {
  const failures = [];
  const observations = {framesReviewed: Array.isArray(samples) ? samples.length : 0, lowActive: 0, highActive: 0, maximumRearAngleDeg: 0, maxTyreGroundErrorM: 0};
  const fail = (code, message, frame = null) => failures.push({code, frame, message});
  const fps = opts.fps ?? 30;
  const maxRearAngle = (opts.maxRearAngleDeg ?? 1) * cap;
  const steerEpsilon = opts.activeSteerEpsilonRad ?? 0.00004;
  if (!Array.isArray(samples) || !samples.length) {
    fail('NO_SAMPLES', 'Actual Y004 frame samples are required.');
    return {pass: false, failures, observations};
  }
  if (!finite(fps) || fps <= 0) fail('INVALID_FPS', 'FPS must be positive.');
  const seen = new Set();
  const bySegment = new Map();
  for (const sample of samples) {
    const frame = sample?.frame;
    if (!Number.isInteger(frame) || frame < 0) { fail('FRAME', 'Invalid integer frame number.', frame); continue; }
    if (seen.has(frame)) fail('DUPLICATE_FRAME', 'Same frame appears more than once.', frame);
    seen.add(frame);
    if (!SEGMENTS.includes(sample.segmentId)) fail('SEGMENT', 'Unknown segment identifier.', frame);
    if (!['low', 'high', 'hero'].includes(sample.regime)) fail('REGIME', 'Unknown mode.', frame);
    if (!finite(sample.timeS) || diff(sample.timeS, frame / fps) > 1e-5) fail('TIME', 'Frame/time mismatch.', frame);
    if (!sample.motion?.root || !sample.motion?.wheels || !sample.steerRad) {
      fail('MISSING_MOTION', 'Incomplete Y004DriveFrame fields.', frame);
      continue;
    }
    // Separate low/high shots legitimately reuse shot-local motion samples.
    // Require matching motion frame only if integration explicitly declares that policy.
    if (opts.requireMatchingMotionFrame && sample.motion.frame !== frame) fail('MOTION_FRAME', 'Inner MotionState frame mismatch under global-frame policy.', frame);
    const root = sample.motion.root;
    const core = [sample.motion.distanceM, sample.motion.speedMps, sample.motion.accelerationMps2, sample.motion.curvaturePerM, root.trackLocalZ, ...(root.position ?? []), ...(root.rotation ?? [])];
    if (core.length !== 11 || core.some((n) => !finite(n))) fail('NONFINITE_MOTION', 'Missing/nonfinite root or path telemetry.', frame);
    if (finite(sample.motion.speedMps) && sample.motion.speedMps < -1e-6) fail('REVERSE_SPEED', 'Negative forward travel speed.', frame);
    if (opts.trackZMin != null && root.trackLocalZ < opts.trackZMin - 1e-6 || opts.trackZMax != null && root.trackLocalZ > opts.trackZMax + 1e-6) fail('TRACK_DOMAIN', 'Vehicle sampled beyond track domain.', frame);

    for (const id of WHEELS) {
      const w = sample.motion.wheels[id];
      const steer = sample.steerRad[id];
      if (!w || !finite(steer)) { fail('WHEEL_MISSING', 'Missing wheel or steering value: ' + id, frame); continue; }
      if (!finite(w.steerRad) || diff(w.steerRad, steer) > 1e-7) fail('STEER_MISMATCH', id + ' wheel and public steer disagree.', frame);
      if (!finite(w.spinRad) || !finite(w.pathDistanceM) || !finite(w.tyreRadiusM) || w.tyreRadiusM <= 0 || Math.abs(w.spinRad * w.tyreRadiusM - w.pathDistanceM) > 1e-3) fail('SPIN_DISTANCE', id + ' spin must derive from path distance/radius.', frame);
      if (!Array.isArray(w.centreWorld) || w.centreWorld.length !== 3 || w.centreWorld.some(v => !finite(v))) fail('WHEEL_POSITION', id + ' world centre invalid.', frame);
      if (opts.asphaltWorldY != null && Array.isArray(w.centreWorld) && finite(w.uprightOffsetY) && finite(w.tyreRadiusM)) {
        const err = Math.abs(w.centreWorld[1] + w.uprightOffsetY - w.tyreRadiusM - opts.asphaltWorldY);
        observations.maxTyreGroundErrorM = Math.max(observations.maxTyreGroundErrorM, err);
        if (err > (opts.maxRoadGapM ?? 0.004)) fail('TYRE_CONTACT', id + ' road error ' + err.toFixed(4) + 'm.', frame);
      }
    }
    const s = sample.steerRad;
    if (WHEELS.every(id => finite(s[id]))) {
      const front = average(s.FL, s.FR);
      const rear = average(s.RL, s.RR);
      observations.maximumRearAngleDeg = Math.max(observations.maximumRearAngleDeg, Math.abs(s.RL) / cap, Math.abs(s.RR) / cap);
      if (Math.abs(s.RL) > maxRearAngle + 1e-8 || Math.abs(s.RR) > maxRearAngle + 1e-8) fail('REAR_CAP', 'Illustrative 1 degree rear cap exceeded.', frame);
      if (s.RL * s.RR < -steerEpsilon * steerEpsilon) fail('REAR_TOE', 'Opposite rear steering directions are invalid.', frame);
      if (Math.abs(s.RL - s.RR) > (opts.maxRearPairDeltaRad ?? .0025)) fail('REAR_PAIR', 'Unexplained rear-wheel asymmetry.', frame);
      if (Math.abs(front) > steerEpsilon && Math.abs(rear) > steerEpsilon) {
        if (sample.regime === 'low') {
          observations.lowActive++;
          if (front * rear >= 0) fail('LOW_DIRECTION', 'At low speed rear must steer opposite front.', frame);
          if (opts.checkLowBicycle !== false && finite(sample.motion.steeringCurvaturePerM)) {
            // Qualitative simplified bicycle relation; not Porsche controller calibration.
            const wheelbase = opts.wheelbaseM ?? 2.4539;
            const kappa = (Math.tan(front) - Math.tan(rear)) / wheelbase;
            const tolerance = opts.curvatureTolerancePerM ?? .025;
            if (Math.abs(kappa - sample.motion.steeringCurvaturePerM) > tolerance) fail('LOW_KINEMATICS', 'Steer/path bicycle-model inconsistency.', frame);
          }
        }
        if (sample.regime === 'high') {
          observations.highActive++;
          if (front * rear <= 0) fail('HIGH_DIRECTION', 'At high speed rear must steer with front.', frame);
        }
      }
    }
    const seq = bySegment.get(sample.segmentId) ?? [];
    seq.push(sample);
    bySegment.set(sample.segmentId, seq);
  }
  for (const [id, seq] of bySegment) {
    seq.sort((a, b) => a.frame - b.frame);
    const a = seq[0], b = seq[seq.length - 1];
    if (seq.length < 2 || !a.motion?.root || !b.motion?.root) continue;
    const movement = Math.hypot(b.motion.root.position[0] - a.motion.root.position[0], b.motion.root.position[2] - a.motion.root.position[2]);
    const dx = b.motion.distanceM - a.motion.distanceM;
    if (dx < -(opts.distanceToleranceM ?? .02)) fail('PATH_REVERSE', id + ': distance decreases within shot.', b.frame);
    if (b.frame - a.frame >= (opts.minimumTravelFrames ?? fps) && (movement < (opts.minimumWorldTravelM ?? .3) || dx < (opts.minimumDistanceM ?? .3))) fail('STATIC_CAR', id + ': insufficient real world travel.', b.frame);
    for (let i = 1; i < seq.length; i++) {
      if (seq[i].frame - seq[i - 1].frame === 1 && seq[i].motion && seq[i-1].motion && seq[i].motion.distanceM + .02 < seq[i-1].motion.distanceM) fail('DISTANCE_NONMONOTONE', id + ': distance jumps backward.', seq[i].frame);
    }
  }
  if (opts.requireLowHigh) {
    if (!observations.lowActive) fail('NO_LOW_PROOF', 'No actual low-speed opposite steering sample supplied.');
    if (!observations.highActive) fail('NO_HIGH_PROOF', 'No actual high-speed same-direction steering sample supplied.');
  }
  if (opts.expectedFrames != null && (samples.length !== opts.expectedFrames || seen.size !== opts.expectedFrames || Math.min(...seen) !== 0 || Math.max(...seen) !== opts.expectedFrames - 1)) fail('FRAME_COVERAGE', 'Expected contiguous complete frame sample set 0..N-1.');
  return {pass: failures.length === 0, failures, observations};
}

export function auditDeterministicSampler(sampler, frames = [30, 90, 190, 30, 0, 190]) {
  if (typeof sampler !== 'function') throw new TypeError('Need sampler(frame) function.');
  const failures = [];
  const values = new Map();
  for (const frame of frames) {
    let value;
    try { value = JSON.stringify(sampler(frame)); }
    catch (e) { failures.push({code: 'SAMPLER_THREW', frame, message: String(e)}); continue; }
    if (values.has(frame) && values.get(frame) !== value) failures.push({code: 'ORDER_DEPENDENCE', frame, message: 'Same frame changes under out-of-order requests.'});
    values.set(frame, value);
  }
  return {pass: failures.length === 0, failures, observations: {sampleRequests: frames.length, uniqueFrames: values.size}};
}

export function auditWheelGuides(records, opts = {}) {
  const failures = [];
  const fail = (code, message, frame) => failures.push({code, frame, message});
  if (!Array.isArray(records) || !records.length) return {pass:false, failures:[{code:'NO_GUIDES', frame:null, message:'Native-proven guide geometry samples missing.'}]};
  let visibleCount = 0;
  for (const r of records) {
    const frame = r?.state?.frame;
    if (!r?.state?.motion?.wheels || !Array.isArray(r.guides)) { fail('INVALID_GUIDE_RECORD', 'Expected {state,guides}.', frame); continue; }
    if (r.guides.filter(g => g.visible).length > 2) fail('GUIDE_DENSITY', 'More than two simultaneous visible guide groups.', frame);
    for (const g of r.guides) {
      if (!g.visible) continue;
      visibleCount++;
      const wheel = r.state.motion.wheels[g.wheel];
      if (!wheel || ![g.anchorWorld, g.neutralEndWorld, g.steeredEndWorld].every(v => Array.isArray(v) && v.length===3 && v.every(finite))) { fail('GUIDE_GEOMETRY', 'Missing or nonfinite guide points.', frame); continue; }
      const anchor = g.anchorWorld, n = g.neutralEndWorld, s = g.steeredEndWorld;
      if (Math.hypot(anchor[0] - wheel.centreWorld[0], anchor[1] - wheel.centreWorld[1], anchor[2] - wheel.centreWorld[2]) > (opts.maxAnchorOffsetM ?? .5)) fail('GUIDE_ANCHOR', 'Guide not anchored to actual wheel.', frame);
      const dx0 = n[0]-anchor[0], dz0=n[2]-anchor[2], dx1=s[0]-anchor[0], dz1=s[2]-anchor[2];
      if (Math.hypot(dx0,dz0)<.01 || Math.hypot(dx1,dz1)<.01) { fail('GUIDE_ZERO', 'Guide endpoints must have useful length.', frame); continue; }
      const angle = Math.atan2(dx1*dz0 - dz1*dx0, dx1*dx0+dz1*dz0);
      const actual = r.state.steerRad[g.wheel];
      if (!finite(actual) || Math.abs(angle-actual)>(opts.maxYawDeviationRad ?? .004)) fail('GUIDE_ANGLE', 'Projected guide exaggerates or mis-signs actual wheel steer.', frame);
    }
  }
  if (opts.requireVisible && !visibleCount) fail('NO_VISIBLE_CUES', 'All guide samples invisible.', null);
  return {pass:failures.length===0, failures, observations:{records:records.length, visibleGuides:visibleCount}};
}
