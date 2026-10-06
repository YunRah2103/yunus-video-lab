import {
  TRACK_LAYOUT_CONFIG,
  sampleTrackAtLocalZ,
  trackLocalToWorldXZ,
  worldXZToTrackLocal,
} from '../../video002/trackUpgrade/racetrack/layout';

export type Vec3 = [number, number, number];

export type Y003TrackPose = {
  position: Vec3;
  headingRad: number;
};

const signedLateralOffset = (
  point: [number, number],
  sample: ReturnType<typeof sampleTrackAtLocalZ>,
) =>
  (point[0] - sample.center[0]) * sample.leftNormal[0] +
  (point[1] - sample.center[1]) * sample.leftNormal[1];

const rotateXZ = (x: number, z: number, headingRad: number): [number, number] => {
  const c = Math.cos(headingRad);
  const s = Math.sin(headingRad);
  return [x * c + z * s, -x * s + z * c];
};

export const Y003_TRACK_CONTRACT = {
  source: 'YUNEX 002 corrected TrackWorld/racetrack layout',
  units: 'metres',
  rootPosition: TRACK_LAYOUT_CONFIG.rootPosition,
  rootYaw: TRACK_LAYOUT_CONFIG.rootYaw,
  roadHalfWidth: TRACK_LAYOUT_CONFIG.roadHalfWidth,
  sampleMinZ: TRACK_LAYOUT_CONFIG.sampleMinZ,
  sampleMaxZ: TRACK_LAYOUT_CONFIG.sampleMaxZ,
  note: 'C does not add a second root transform. Existing surface/runoff/terrain/barrier/vegetation ordering remains authoritative.',
} as const;

export const auditY003TrackContainment = (
  pose: Y003TrackPose,
  halfWidth = TRACK_LAYOUT_CONFIG.lockedCarFootprintHalfWidth,
  halfLength = TRACK_LAYOUT_CONFIG.lockedCarFootprintHalfLength,
) => {
  let minRoadEdgeClearance = Infinity;
  const samples: Array<{
    world: [number, number];
    local: [number, number];
    clearance: number;
  }> = [];

  for (const x of [-halfWidth, halfWidth]) {
    for (const z of [-halfLength, halfLength]) {
      const rotated = rotateXZ(x, z, pose.headingRad);
      const world: [number, number] = [
        pose.position[0] + rotated[0],
        pose.position[2] + rotated[1],
      ];
      const local = worldXZToTrackLocal(world);
      const layout = sampleTrackAtLocalZ(local[1]);
      const clearance =
        TRACK_LAYOUT_CONFIG.roadHalfWidth - Math.abs(signedLateralOffset(local, layout));
      minRoadEdgeClearance = Math.min(minRoadEdgeClearance, clearance);
      samples.push({world, local, clearance});
    }
  }

  const localCenter = worldXZToTrackLocal([pose.position[0], pose.position[2]]);
  const insideSampleDomain =
    localCenter[1] >= TRACK_LAYOUT_CONFIG.sampleMinZ &&
    localCenter[1] <= TRACK_LAYOUT_CONFIG.sampleMaxZ;

  return {
    ok: insideSampleDomain && minRoadEdgeClearance >= 0.35,
    insideSampleDomain,
    minRoadEdgeClearance,
    samples,
  };
};

export const tracksideWorldPoint = (
  pose: Y003TrackPose,
  side: 'left' | 'right' = 'left',
  height = 1.42,
  extraSetback = 0.9,
): Vec3 => {
  const localCenter = worldXZToTrackLocal([pose.position[0], pose.position[2]]);
  const layout = sampleTrackAtLocalZ(localCenter[1]);
  const barrier = side === 'left' ? layout.barrierLeft : layout.barrierRight;
  const outwardSign = side === 'left' ? 1 : -1;
  const localPoint: [number, number] = [
    barrier[0] + layout.leftNormal[0] * extraSetback * outwardSign,
    barrier[1] + layout.leftNormal[1] * extraSetback * outwardSign,
  ];
  const world = trackLocalToWorldXZ(localPoint);
  return [world[0], height, world[1]];
};

export const auditY003TrackAdapterBaseline = () => {
  const straightLocal = sampleTrackAtLocalZ(0).center;
  const straightWorld = trackLocalToWorldXZ(straightLocal);
  const pose: Y003TrackPose = {
    position: [straightWorld[0], 0, straightWorld[1]],
    headingRad: Math.PI,
  };
  const containment = auditY003TrackContainment(pose);
  return {
    ok: containment.ok,
    containment,
    contract: Y003_TRACK_CONTRACT,
  };
};
