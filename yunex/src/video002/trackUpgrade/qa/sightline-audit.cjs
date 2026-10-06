'use strict';

const ROOT = {position: [-1, -0.028, 0], rotationY: Math.PI};
const ROAD = {
  coverageLocal: {xMin: -16, xMax: 14.2, zMin: -42, zMax: 38},
  asphaltLocal: {xMin: -3.22, xMax: 14.2, zMin: -42, zMax: 38},
  vergeLocal: {xMin: -16, xMax: -3.18, zMin: -42, zMax: 38},
  kerbLocal: {xMin: -3.22, xMax: -2.66, zMin: -22.2275, zMax: 16.1475},
};
const FURNITURE = {
  boundsLocal: {xMin: -4.34, xMax: -3.48, yMin: -0.22, yMax: 2.25, zMin: -17.2, zMax: 20.6},
  railLocalX: -3.62,
  railWorldTop: 0.652,
  railWorldBottom: -0.248,
  railWorldZMin: -20.6,
  railWorldZMax: 17.2,
  fenceLocalX: -4.248,
  fenceLocalZStart: 6.222206083731726,
  fenceLocalZEnd: 17.1,
  fenceWorldBottom: 0.652,
  fenceWorldTop: 2.092,
};

const CAMERA_KEYS = [
  [0, [4.4, 1.7, -7.4], [0.05, 0.63, -0.55], 29],
  [72, [4.8, 1.7, -8.0], [0.02, 0.72, -0.75], 28],
  [165, [1.9, 1.4, -4.0], [0.0, 1.06, -2.02], 58],
  [285, [4.9, 2.5, -8.4], [0.0, 0.72, -0.62], 30],
  [405, [9.5, 1.25, -0.1], [0.0, 0.61, 0.08], 25],
  [540, [-5.8, 1.8, 7.6], [0.0, 0.56, 0.76], 30],
  [660, [5.4, 2.4, 8.4], [0.0, 0.58, 0.18], 26],
  [750, [5.2, 1.5, 7.8], [0.0, 0.52, 0.72], 30],
];
const DISTANCE_KEYS = [
  [0, 0], [72, 0.22], [165, 0.55], [285, 1.15],
  [405, 2.15], [540, 2.85], [660, 3.55], [750, 5.15],
];

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const ease = (v) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

const monotoneSlopes = (keys) => {
  const secants = keys.slice(0, -1).map((key, i) => {
    const next = keys[i + 1];
    return (next[1] - key[1]) / Math.max(1, next[0] - key[0]);
  });
  return keys.map((_, i) => {
    if (i === 0) return secants[0];
    if (i === keys.length - 1) return secants[secants.length - 1];
    const a = secants[i - 1];
    const b = secants[i];
    if (a === 0 || b === 0 || Math.sign(a) !== Math.sign(b)) return 0;
    return (2 * a * b) / (a + b);
  });
};
const DISTANCE_SLOPES = monotoneSlopes(DISTANCE_KEYS);

const distanceAt = (frame) => {
  if (frame <= DISTANCE_KEYS[0][0]) return DISTANCE_KEYS[0][1];
  if (frame >= DISTANCE_KEYS[DISTANCE_KEYS.length - 1][0]) return DISTANCE_KEYS[DISTANCE_KEYS.length - 1][1];
  for (let i = 0; i < DISTANCE_KEYS.length - 1; i++) {
    const a = DISTANCE_KEYS[i];
    const b = DISTANCE_KEYS[i + 1];
    if (frame >= a[0] && frame <= b[0]) {
      const span = Math.max(1, b[0] - a[0]);
      const t = clamp01((frame - a[0]) / span);
      const t2 = t * t;
      const t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      return h00 * a[1] + h10 * span * DISTANCE_SLOPES[i] + h01 * b[1] + h11 * span * DISTANCE_SLOPES[i + 1];
    }
  }
  return DISTANCE_KEYS[DISTANCE_KEYS.length - 1][1];
};

const rootPoseAt = (frame) => {
  const distance = distanceAt(frame);
  const finalProgress = clamp01((frame - 660) / 90);
  const x = frame > 660 ? Math.sin(finalProgress * Math.PI) * 0.055 : 0;
  return [x, 0, distance];
};

const baseCameraAt = (frame) => {
  const root = rootPoseAt(frame);
  const f = Math.max(0, Math.min(frame, 750));
  let a = CAMERA_KEYS[0];
  let b = CAMERA_KEYS[1];
  for (let i = 0; i < CAMERA_KEYS.length - 1; i++) {
    if (f >= CAMERA_KEYS[i][0] && f <= CAMERA_KEYS[i + 1][0]) {
      a = CAMERA_KEYS[i];
      b = CAMERA_KEYS[i + 1];
      break;
    }
  }
  const p = ease((f - a[0]) / Math.max(1, b[0] - a[0]));
  const po = lerp3(a[1], b[1], p);
  const to = lerp3(a[2], b[2], p);
  return {
    position: [root[0] + po[0], root[1] + po[1], root[2] + po[2]],
    target: [root[0] + to[0], root[1] + to[1], root[2] + to[2]],
  };
};

const beatAt = (frame) => {
  const seconds = frame / 30;
  if (seconds < 2.4) return 'hook';
  if (seconds < 5.5) return 'isolate';
  if (seconds < 9.5) return 'highDownforce';
  if (seconds < 13.5) return 'drs';
  if (seconds < 18) return 'airbrake';
  if (seconds < 22) return 'wholeCar';
  return 'payoff';
};

const integratedCameraAt = (frame) => {
  const root = rootPoseAt(frame);
  const beat = beatAt(frame);
  const base = baseCameraAt(frame);
  if (beat === 'drs') {
    return {beat, position: [root[0] - 8.6, 1.72, root[2] + 0.18], target: [root[0], 0.65, root[2] + 0.08]};
  }
  if (beat === 'airbrake') {
    return {beat, position: [root[0] - 5.8, 2.18, root[2] - 7.2], target: [root[0], 0.72, root[2] - 0.72]};
  }
  if (beat === 'payoff') {
    return {beat, position: [root[0] - 5.6, 1.68, root[2] + 7.5], target: [root[0], 0.58, root[2] + 0.55]};
  }
  return {beat, ...base};
};

const localXToWorld = (x) => ROOT.position[0] - x;
const localZToWorld = (z) => ROOT.position[2] - z;
const intervalDistance = (v, min, max) => v < min ? min - v : v > max ? v - max : 0;

const lineAtX = (position, target, x) => {
  const dx = target[0] - position[0];
  if (Math.abs(dx) < 1e-12) return null;
  const t = (x - position[0]) / dx;
  if (t < 0 || t > 1) return null;
  return {
    t,
    y: lerp(position[1], target[1], t),
    z: lerp(position[2], target[2], t),
  };
};

const worldBounds = () => {
  const xA = localXToWorld(ROAD.coverageLocal.xMin);
  const xB = localXToWorld(ROAD.coverageLocal.xMax);
  const zA = localZToWorld(ROAD.coverageLocal.zMin);
  const zB = localZToWorld(ROAD.coverageLocal.zMax);
  return {xMin: Math.min(xA, xB), xMax: Math.max(xA, xB), zMin: Math.min(zA, zB), zMax: Math.max(zA, zB)};
};

const runSightlineAudit = () => {
  const coverage = worldBounds();
  const railX = localXToWorld(FURNITURE.railLocalX);
  const fenceX = localXToWorld(FURNITURE.fenceLocalX);
  const fenceWorldZMin = Math.min(localZToWorld(FURNITURE.fenceLocalZStart), localZToWorld(FURNITURE.fenceLocalZEnd));
  const fenceWorldZMax = Math.max(localZToWorld(FURNITURE.fenceLocalZStart), localZToWorld(FURNITURE.fenceLocalZEnd));

  let railCrossings = 0;
  let railHits = 0;
  let minimumRailClearance = Infinity;
  let minimumRailFrame = null;
  let fenceCrossings = 0;
  let fenceHits = 0;
  let minimumFenceLongitudinalGap = Infinity;
  let minimumFenceGapFrame = null;
  let minimumCoverageMargin = Infinity;
  let minimumCoverageFrame = null;
  let belowRoadRayFrames = 0;

  for (let frame = 0; frame <= 750; frame++) {
    const camera = integratedCameraAt(frame);
    const points = [camera.position, camera.target];
    for (const point of points) {
      const margin = Math.min(
        point[0] - coverage.xMin,
        coverage.xMax - point[0],
        point[2] - coverage.zMin,
        coverage.zMax - point[2],
      );
      if (margin < minimumCoverageMargin) {
        minimumCoverageMargin = margin;
        minimumCoverageFrame = frame;
      }
    }
    if (camera.position[1] <= -0.04 || camera.target[1] <= -0.04) belowRoadRayFrames++;

    const rail = lineAtX(camera.position, camera.target, railX);
    if (rail && rail.z >= FURNITURE.railWorldZMin && rail.z <= FURNITURE.railWorldZMax) {
      railCrossings++;
      if (rail.y >= FURNITURE.railWorldBottom && rail.y <= FURNITURE.railWorldTop) railHits++;
      const clearance = rail.y - FURNITURE.railWorldTop;
      if (clearance < minimumRailClearance) {
        minimumRailClearance = clearance;
        minimumRailFrame = frame;
      }
    }

    const fence = lineAtX(camera.position, camera.target, fenceX);
    if (fence) {
      fenceCrossings++;
      const longitudinalGap = intervalDistance(fence.z, fenceWorldZMin, fenceWorldZMax);
      if (longitudinalGap < minimumFenceLongitudinalGap) {
        minimumFenceLongitudinalGap = longitudinalGap;
        minimumFenceGapFrame = frame;
      }
      if (
        longitudinalGap === 0 &&
        fence.y >= FURNITURE.fenceWorldBottom &&
        fence.y <= FURNITURE.fenceWorldTop
      ) fenceHits++;
    }
  }

  const kerbToFurnitureGapLocal = FURNITURE.boundsLocal.xMax < ROAD.kerbLocal.xMin
    ? ROAD.kerbLocal.xMin - FURNITURE.boundsLocal.xMax
    : 0;

  return {
    framesChecked: 751,
    rootTransform: ROOT,
    roadCoverageWorld: coverage,
    roadCoveragePass: minimumCoverageMargin >= 0,
    minimumCoverageMarginMetres: minimumCoverageMargin,
    minimumCoverageFrame,
    belowRoadRayFrames,
    rail: {
      worldX: railX,
      crossings: railCrossings,
      hits: railHits,
      minimumClearanceMetres: minimumRailClearance,
      minimumClearanceFrame: minimumRailFrame,
    },
    fence: {
      worldX: fenceX,
      worldZ: [fenceWorldZMin, fenceWorldZMax],
      crossings: fenceCrossings,
      hits: fenceHits,
      minimumLongitudinalGapMetres: minimumFenceLongitudinalGap,
      minimumGapFrame: minimumFenceGapFrame,
    },
    aToBKerbFurnitureGapLocalMetres: kerbToFurnitureGapLocal,
    pass: minimumCoverageMargin >= 0 && belowRoadRayFrames === 0 && railHits === 0 && fenceHits === 0 && kerbToFurnitureGapLocal >= 0.2,
  };
};

module.exports = {runSightlineAudit, integratedCameraAt, rootPoseAt, ROOT, ROAD, FURNITURE};

if (require.main === module) {
  const result = runSightlineAudit();
  console.log(JSON.stringify(result, null, 2));
  if (!result.pass) process.exitCode = 1;
}
