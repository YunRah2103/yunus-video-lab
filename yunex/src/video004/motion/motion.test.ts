/**
 * Run with: cd yunex && npx tsx src/video004/motion/motion.test.ts
 * Tests source sampler semantics only. Native footage and GLB rig require
 * independent moving render / B specialist proof; these tests cannot replace it.
 */
import assert from 'node:assert/strict';
import {
  buildY004SegmentPlan, y004MotionAtFrame, y004MotionAuditAtFrame,
  Y004_REAR_STEER_CAP_RAD, Y004_SEGMENT_PLAN,
} from './sampler';
import {
  TRACK_ASPHALT_LOCAL_Y, TRACK_LAYOUT_CONFIG, sampleTrackAtLocalZ,
  worldXZToTrackLocal,
} from '../../video002/trackUpgrade/racetrack/layout';
const frames = 720;
const wheels = ['FL','FR','RL','RR'] as const;
const asphaltY = TRACK_LAYOUT_CONFIG.rootPosition[1] + TRACK_ASPHALT_LOCAL_Y;
let positiveLow = 0, positiveHigh = 0;
let maxKinematicError = 0, maxContactError = 0, minRoadClearance = Infinity;
let minSpeedLow = Infinity, maxSpeedLow = 0, minSpeedHigh = Infinity, maxSpeedHigh = 0;
let maxJumpInShot = 0;
let maxAcceleration = 0;
let count = 0;
for (const segment of Y004_SEGMENT_PLAN) {
  let previous: ReturnType<typeof y004MotionAtFrame> | undefined;
  let leftDistance = -1;
  for (let frame = segment.frameStart; frame < segment.frameEndExclusive; frame++) {
    const s = y004MotionAtFrame(frame);
    assert.equal(s.frame, frame);
    assert.equal(s.segmentId, segment.id);
    assert.equal(s.regime, segment.regime);
    const m = s.motion;
    assert.ok(m.speedMps > 3.5 && m.speedMps < 19, 'real moving travel at frame ' + frame);
    maxAcceleration = Math.max(maxAcceleration, Math.abs(m.accelerationMps2));
    assert.ok(Number.isFinite(m.accelerationMps2));
    assert.ok(m.distanceM > leftDistance + 1e-7 || frame === segment.frameStart);
    leftDistance = m.distanceM;
    assert.ok(m.root.trackLocalZ >= segment.trackStartZ - 1e-8);
    assert.ok(m.root.trackLocalZ < segment.trackEndZ + 1e-8);
    const [localX, localZ] = worldXZToTrackLocal([m.root.position[0], m.root.position[2]]);
    const track = sampleTrackAtLocalZ(localZ);
    const cross = (localX-track.center[0])*track.leftNormal[0] +
      (localZ-track.center[1])*track.leftNormal[1];
    minRoadClearance = Math.min(minRoadClearance,
      TRACK_LAYOUT_CONFIG.roadHalfWidth - Math.abs(cross) -
      TRACK_LAYOUT_CONFIG.lockedCarFootprintHalfWidth);
    for (const id of wheels) {
      assert.equal(s.steerRad[id], m.wheels[id].steerRad);
      assert.ok(Number.isFinite(m.wheels[id].spinRad));
      assert.ok(Math.abs(m.wheels[id].spinRad * m.wheels[id].tyreRadiusM -
        m.wheels[id].pathDistanceM) < 1e-8);
      maxContactError = Math.max(maxContactError,
        Math.abs(m.wheels[id].centreWorld[1] +
          m.wheels[id].uprightOffsetY - m.wheels[id].tyreRadiusM - asphaltY));
    }
    assert.ok(Math.abs(s.steerRad.RL) <= Y004_REAR_STEER_CAP_RAD + 1e-12);
    assert.ok(Math.abs(s.steerRad.RR) <= Y004_REAR_STEER_CAP_RAD + 1e-12);
    assert.ok(Math.abs(s.steerRad.RL - s.steerRad.RR) < 1e-12, 'no fake rear toe');
    const front = (s.steerRad.FL+s.steerRad.FR)/2;
    const rear = (s.steerRad.RL+s.steerRad.RR)/2;
    if (Math.abs(m.steeringCurvaturePerM) > 0.003) {
      if (segment.staging === 'low') {
        assert.ok(front * rear < 0, 'low speed needs opposing axles at frame ' + frame);
        positiveLow++;
      } else {
        assert.ok(front * rear > 0, 'high speed needs aligned axles at frame ' + frame);
        positiveHigh++;
      }
      const error = y004MotionAuditAtFrame(frame).curvatureErrorPerM;
      maxKinematicError = Math.max(maxKinematicError, error);
      assert.ok(error < 0.0002, 'bicycle steering/path mismatch frame ' + frame);
    }
    if (segment.staging === 'low') {
      minSpeedLow = Math.min(minSpeedLow,m.speedMps);
      maxSpeedLow = Math.max(maxSpeedLow,m.speedMps);
    } else {
      minSpeedHigh = Math.min(minSpeedHigh,m.speedMps);
      maxSpeedHigh = Math.max(maxSpeedHigh,m.speedMps);
    }
    if (previous) {
      const dx = m.root.position[0] - previous.motion.root.position[0];
      const dz = m.root.position[2] - previous.motion.root.position[2];
      const delta = Math.hypot(dx,dz);
      maxJumpInShot = Math.max(maxJumpInShot,delta);
      assert.ok(delta > 0.1 && delta < 1, 'no jump/stop inside shot at ' + frame);
      for (const id of wheels) {
        assert.ok(m.wheels[id].pathDistanceM > previous.motion.wheels[id].pathDistanceM,
          'wheel spin distance must grow in each shot');
      }
    }
    previous = s;
    count++;
  }
}
assert.equal(Y004_SEGMENT_PLAN[0].frameStart,0);
assert.equal(Y004_SEGMENT_PLAN.at(-1)?.frameEndExclusive,720);
assert.ok(positiveLow > 70 && positiveHigh > 65,'both turning modes have non-zero proof');
assert.ok(maxContactError < 1e-6,'P03 asphalt world contact');
assert.ok(minRoadClearance >= 0.6,'track containment');
assert.ok(maxAcceleration < 5,'restrained acceleration');
assert.ok(maxSpeedLow < minSpeedHigh,'distinct qualitative regimes');
assert.deepEqual(buildY004SegmentPlan(750).at(-1)?.frameEndExclusive,750);
assert.throws(()=>y004MotionAtFrame(-1),RangeError);
assert.throws(()=>y004MotionAtFrame(720),RangeError);
assert.throws(()=>y004MotionAtFrame(1.5),RangeError);
const probes = [719,0,150,284,285,404,405,554,555,718,1,719,0];
const fingerprints = new Map<number,string>();
for (const frame of probes) {
  const fingerprint = JSON.stringify(y004MotionAtFrame(frame));
  if (fingerprints.has(frame)) assert.equal(fingerprint,fingerprints.get(frame));
  fingerprints.set(frame,fingerprint);
}
console.log(JSON.stringify({result:'PASS', checkedFrames:count, positiveLow, positiveHigh,
  maxKinematicError, maxContactError, minRoadClearance, minSpeedLow, maxSpeedLow,
  minSpeedHigh, maxSpeedHigh, maxJumpInShot, maxAcceleration,
  outOfOrderProbes:probes.length},null,2));
