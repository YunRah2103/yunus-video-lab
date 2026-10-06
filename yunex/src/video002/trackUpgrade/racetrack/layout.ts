import {DEFAULT_CAMERA_TIMING, rootPoseAt} from '../../driving';
import type {
  KerbEligibility,
  TrackLayoutSample,
  TrackLayoutValidation,
  TrackVec2,
} from './types';

export const TRACK_LAYOUT_CONFIG = {
  units: 'metres',
  coordinateSpace: 'YUNEX 002 track-local coordinates before TrackWorld root transform',
  rootPosition: [-1, -0.028, 0] as [number, number, number],
  rootYaw: Math.PI,
  sampleMinZ: -140,
  sampleMaxZ: 140,
  sampleStep: 0.5,
  straightCenterX: -1,
  straightCorridorMinZ: -8,
  straightCorridorMaxZ: 8,
  bendStartZ: 10,
  bendEndZ: 34,
  bendOffsetX: 2.65,
  roadWidth: 8.6,
  roadHalfWidth: 4.3,
  baseRunoffWidth: 2.15,
  outsideBendRunoffExtra: 0.8,
  insideBendRunoffExtra: 0.25,
  barrierSetback: 0.7,
  landscapeSetback: 1.35,
  lockedCarFootprintHalfWidth: 1.12,
  lockedCarFootprintHalfLength: 2.45,
} as const;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const smoothStep = (start: number, end: number, value: number) => {
  const t = clamp01((value - start) / Math.max(1e-9, end - start));
  return t * t * (3 - 2 * t);
};

const smoothStepDerivative = (start: number, end: number, value: number) => {
  if (value <= start || value >= end) return 0;
  const span = end - start;
  const t = (value - start) / span;
  return (6 * t * (1 - t)) / span;
};

export const centerlineXAtZ = (z: number) =>
  TRACK_LAYOUT_CONFIG.straightCenterX +
  TRACK_LAYOUT_CONFIG.bendOffsetX *
    smoothStep(TRACK_LAYOUT_CONFIG.bendStartZ, TRACK_LAYOUT_CONFIG.bendEndZ, z);

export const centerlineSlopeAtZ = (z: number) =>
  TRACK_LAYOUT_CONFIG.bendOffsetX *
  smoothStepDerivative(TRACK_LAYOUT_CONFIG.bendStartZ, TRACK_LAYOUT_CONFIG.bendEndZ, z);

export const kerbEligibilityAtZ = (z: number): KerbEligibility => ({
  right: z >= 17.5 && z <= 26.5 ? 'apex' : 'none',
  left: z >= 28 && z <= 34.5 ? 'exit' : 'none',
});

const offsetPoint = (
  center: TrackVec2,
  normal: TrackVec2,
  offset: number,
): TrackVec2 => [center[0] + normal[0] * offset, center[1] + normal[1] * offset];

export const sampleTrackAtLocalZ = (zInput: number): TrackLayoutSample => {
  const z = Math.max(TRACK_LAYOUT_CONFIG.sampleMinZ, Math.min(TRACK_LAYOUT_CONFIG.sampleMaxZ, zInput));
  const slope = centerlineSlopeAtZ(z);
  const tangentLength = Math.hypot(slope, 1);
  const tangent: TrackVec2 = [slope / tangentLength, 1 / tangentLength];
  const leftNormal: TrackVec2 = [-tangent[1], tangent[0]];
  const center: TrackVec2 = [centerlineXAtZ(z), z];

  const bendLoad =
    smoothStep(10, 18, z) *
    (1 - smoothStep(30, 36, z));
  const leftRunoffWidth =
    TRACK_LAYOUT_CONFIG.baseRunoffWidth +
    TRACK_LAYOUT_CONFIG.outsideBendRunoffExtra * bendLoad;
  const rightRunoffWidth =
    TRACK_LAYOUT_CONFIG.baseRunoffWidth +
    TRACK_LAYOUT_CONFIG.insideBendRunoffExtra * bendLoad;

  const roadLeft = offsetPoint(center, leftNormal, TRACK_LAYOUT_CONFIG.roadHalfWidth);
  const roadRight = offsetPoint(center, leftNormal, -TRACK_LAYOUT_CONFIG.roadHalfWidth);
  const runoffLeft = offsetPoint(
    center,
    leftNormal,
    TRACK_LAYOUT_CONFIG.roadHalfWidth + leftRunoffWidth,
  );
  const runoffRight = offsetPoint(
    center,
    leftNormal,
    -(TRACK_LAYOUT_CONFIG.roadHalfWidth + rightRunoffWidth),
  );
  const barrierLeft = offsetPoint(
    center,
    leftNormal,
    TRACK_LAYOUT_CONFIG.roadHalfWidth + leftRunoffWidth + TRACK_LAYOUT_CONFIG.barrierSetback,
  );
  const barrierRight = offsetPoint(
    center,
    leftNormal,
    -(TRACK_LAYOUT_CONFIG.roadHalfWidth + rightRunoffWidth + TRACK_LAYOUT_CONFIG.barrierSetback),
  );
  const landscapeLeft = offsetPoint(
    center,
    leftNormal,
    TRACK_LAYOUT_CONFIG.roadHalfWidth +
      leftRunoffWidth +
      TRACK_LAYOUT_CONFIG.barrierSetback +
      TRACK_LAYOUT_CONFIG.landscapeSetback,
  );
  const landscapeRight = offsetPoint(
    center,
    leftNormal,
    -(TRACK_LAYOUT_CONFIG.roadHalfWidth +
      rightRunoffWidth +
      TRACK_LAYOUT_CONFIG.barrierSetback +
      TRACK_LAYOUT_CONFIG.landscapeSetback),
  );

  return {
    z,
    center,
    tangent,
    leftNormal,
    roadLeft,
    roadRight,
    runoffLeft,
    runoffRight,
    barrierLeft,
    barrierRight,
    landscapeLeft,
    landscapeRight,
    leftRunoffWidth,
    rightRunoffWidth,
    kerb: kerbEligibilityAtZ(z),
  };
};

export const sampleTrackRange = (
  minZ = TRACK_LAYOUT_CONFIG.sampleMinZ,
  maxZ = TRACK_LAYOUT_CONFIG.sampleMaxZ,
  step = TRACK_LAYOUT_CONFIG.sampleStep,
) => {
  const safeStep = Math.max(0.1, step);
  const count = Math.floor((maxZ - minZ) / safeStep);
  const samples = Array.from({length: count + 1}, (_, index) =>
    sampleTrackAtLocalZ(minZ + index * safeStep),
  );
  if (samples[samples.length - 1].z < maxZ - 1e-6) {
    samples.push(sampleTrackAtLocalZ(maxZ));
  }
  return samples;
};

export const TRACK_LAYOUT_SAMPLES = sampleTrackRange();

export const trackLocalToWorldXZ = ([x, z]: TrackVec2): TrackVec2 => [
  TRACK_LAYOUT_CONFIG.rootPosition[0] - x,
  -z,
];

export const worldXZToTrackLocal = ([worldX, worldZ]: TrackVec2): TrackVec2 => [
  -worldX - 1,
  -worldZ,
];

const distance2 = (a: TrackVec2, b: TrackVec2) =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

const signedLateralOffset = (point: TrackVec2, sample: TrackLayoutSample) =>
  (point[0] - sample.center[0]) * sample.leftNormal[0] +
  (point[1] - sample.center[1]) * sample.leftNormal[1];

export const validateTrackLayoutContract = (): TrackLayoutValidation => {
  const issues: string[] = [];
  const samples = TRACK_LAYOUT_SAMPLES;
  let maxHeadingDegrees = 0;
  let maxCenterStep = 0;
  let straightCorridorMaxCenterError = 0;

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    const values = [
      ...sample.center,
      ...sample.tangent,
      ...sample.leftNormal,
      ...sample.roadLeft,
      ...sample.roadRight,
      ...sample.runoffLeft,
      ...sample.runoffRight,
      ...sample.barrierLeft,
      ...sample.barrierRight,
      ...sample.landscapeLeft,
      ...sample.landscapeRight,
    ];
    if (!values.every(Number.isFinite)) {
      issues.push('non-finite layout sample at z=' + sample.z.toFixed(2));
    }

    const roadWidth = distance2(sample.roadLeft, sample.roadRight);
    if (Math.abs(roadWidth - TRACK_LAYOUT_CONFIG.roadWidth) > 1e-5) {
      issues.push('road width drift at z=' + sample.z.toFixed(2));
    }
    if (
      distance2(sample.center, sample.runoffLeft) <= distance2(sample.center, sample.roadLeft) ||
      distance2(sample.center, sample.runoffRight) <= distance2(sample.center, sample.roadRight)
    ) {
      issues.push('runoff intersects racing surface at z=' + sample.z.toFixed(2));
    }

    const heading = Math.abs(Math.atan2(sample.tangent[0], sample.tangent[1])) * 180 / Math.PI;
    maxHeadingDegrees = Math.max(maxHeadingDegrees, heading);

    if (
      sample.z >= TRACK_LAYOUT_CONFIG.straightCorridorMinZ &&
      sample.z <= TRACK_LAYOUT_CONFIG.straightCorridorMaxZ
    ) {
      straightCorridorMaxCenterError = Math.max(
        straightCorridorMaxCenterError,
        Math.abs(sample.center[0] - TRACK_LAYOUT_CONFIG.straightCenterX),
      );
    }
    if (i > 0) {
      maxCenterStep = Math.max(maxCenterStep, distance2(samples[i - 1].center, sample.center));
    }
  }

  if (maxHeadingDegrees > 10) {
    issues.push('distant bend exceeds restrained 10 degree heading limit');
  }
  if (straightCorridorMaxCenterError > 1e-9) {
    issues.push('locked car corridor is no longer straight');
  }

  let minCarFootprintEdgeClearance = Infinity;
  const carHalfWidth = TRACK_LAYOUT_CONFIG.lockedCarFootprintHalfWidth;
  const carHalfLength = TRACK_LAYOUT_CONFIG.lockedCarFootprintHalfLength;
  for (let frame = 0; frame <= DEFAULT_CAMERA_TIMING.finalEnd; frame++) {
    const worldPose = rootPoseAt(frame, DEFAULT_CAMERA_TIMING);
    const localCenter = worldXZToTrackLocal([worldPose.position[0], worldPose.position[2]]);
    for (const xOffset of [-carHalfWidth, carHalfWidth]) {
      for (const zOffset of [-carHalfLength, carHalfLength]) {
        const corner: TrackVec2 = [localCenter[0] + xOffset, localCenter[1] + zOffset];
        const layout = sampleTrackAtLocalZ(corner[1]);
        const clearance =
          TRACK_LAYOUT_CONFIG.roadHalfWidth -
          Math.abs(signedLateralOffset(corner, layout));
        minCarFootprintEdgeClearance = Math.min(minCarFootprintEdgeClearance, clearance);
      }
    }
  }
  if (minCarFootprintEdgeClearance < 0.6) {
    issues.push('locked Porsche footprint approaches a road edge too closely');
  }

  return {
    ok: issues.length === 0,
    issues,
    metrics: {
      sampleCount: samples.length,
      roadWidth: TRACK_LAYOUT_CONFIG.roadWidth,
      minCarFootprintEdgeClearance,
      maxHeadingDegrees,
      maxCenterStep,
      straightCorridorMaxCenterError,
    },
  };
};

export const assertTrackLayoutContract = () => {
  const report = validateTrackLayoutContract();
  if (!report.ok) {
    throw new Error('YUNEX 002 track layout contract failed: ' + report.issues.join('; '));
  }
  return report;
};
