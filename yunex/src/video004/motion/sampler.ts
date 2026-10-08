/**
 * YUNEX 004 — four-wheel steering motion sampler (Agent A).
 *
 * Illustrative animation, NOT an OEM Porsche controller model.
 * Exactly one world-space deterministic sample provides chassis, both steering
 * axles, distance-based rim rotations, velocity, load and wheel contact.
 *
 * Source: Y003 P03 approved geometry, sampled circuit and measured GLB hubs.
 * NO modification of Y003, original rig, or Porsche GLB.
 */
import type {Y004DriveFrame, Y004Regime, Y004SegmentId} from '../contracts';
import {Y004_FPS, Y004_PROVISIONAL_DURATION_FRAMES} from '../contracts';
import type {MotionState, Vec3, WheelId, WheelMotion} from '../../video003/motion/contract';
import {
  DEFAULT_MOTION_CONFIG,
  SOURCE_WHEEL_CENTRES,
  curvatureAtTrackZ,
  steeringCurvatureAtTrackZ,
} from '../../video003/motion/contract';
import {
  TRACK_ASPHALT_LOCAL_Y,
  TRACK_LAYOUT_CONFIG,
  sampleTrackAtLocalZ,
  trackLocalToWorldXZ,
} from '../../video002/trackUpgrade/racetrack/layout';

export const Y004_REAR_STEER_CAP_RAD = Math.PI / 180;
const TWOPI = 2 * Math.PI;
const WHEELS = ['FL', 'FR', 'RL', 'RR'] as const satisfies readonly WheelId[];
const WHEELBASE_M = DEFAULT_MOTION_CONFIG.wheelbaseM;
const FRONT_HALF_TRACK_M = DEFAULT_MOTION_CONFIG.frontTrackM / 2;
const REAR_HALF_TRACK_M = DEFAULT_MOTION_CONFIG.rearTrackM / 2;
const ASPHALT_WORLD_Y = TRACK_LAYOUT_CONFIG.rootPosition[1] + TRACK_ASPHALT_LOCAL_Y;
const CURVATURE_EPS = 1e-7;

/**
 * Runs are individually real track-centreline drives; a film shot cut is an
 * explicit discontinuity. z is the author's existing track-local z in metres.
 *
 * Hero/exit uses high-regime steering behaviour without inventing an OEM switch.
 * Film timing is PROVISIONAL until D measures actual Y004 voiceover.
 */
type Staging = 'low' | 'high';
export type Y004SegmentPlan = Readonly<{
  id: Y004SegmentId;
  regime: Y004Regime;
  staging: Staging;
  frameStart: number;
  frameEndExclusive: number;
  trackStartZ: number;
  trackEndZ: number;
}>;
const STAGING: ReadonlyArray<Readonly<{
  id: Y004SegmentId;
  regime: Y004Regime;
  staging: Staging;
  cutoff01: number;
  trackStartZ: number;
  trackEndZ: number;
}>> = [
  {id: 'low-hook',       regime: 'low',  staging: 'low',  cutoff01: 84 / 720,  trackStartZ: 12,  trackEndZ: 26},
  {id: 'rear-macro',     regime: 'low',  staging: 'low',  cutoff01: 150 / 720, trackStartZ: 17,  trackEndZ: 29},
  {id: 'low-explain',    regime: 'low',  staging: 'low',  cutoff01: 285 / 720, trackStartZ: 8,   trackEndZ: 32},
  {id: 'high-explain',   regime: 'high', staging: 'high', cutoff01: 405 / 720, trackStartZ: 8,   trackEndZ: 56},
  {id: 'high-drive',     regime: 'high', staging: 'high', cutoff01: 555 / 720, trackStartZ: -18, trackEndZ: 62},
  {id: 'trackside-exit', regime: 'hero', staging: 'high', cutoff01: 1,         trackStartZ: -48, trackEndZ: 38},
];
export const buildY004SegmentPlan = (
  frames: number = Y004_PROVISIONAL_DURATION_FRAMES,
): ReadonlyArray<Y004SegmentPlan> => {
  if (!Number.isInteger(frames) || frames < 240) {
    throw new RangeError('Y004 requires an integer film frame count >= 240.');
  }
  let frameStart = 0;
  return STAGING.map((s, i) => {
    const frameEndExclusive = i === STAGING.length - 1
      ? frames : Math.round(s.cutoff01 * frames);
    const run: Y004SegmentPlan = {...s, frameStart, frameEndExclusive};
    if (frameEndExclusive <= frameStart + 1) {
      throw new RangeError('Y004 shot has fewer than two frames.');
    }
    frameStart = frameEndExclusive;
    return run;
  });
};
export const Y004_SEGMENT_PLAN = buildY004SegmentPlan();

export const y004SegmentAtFrame = (
  frame: number,
  frames: number = Y004_PROVISIONAL_DURATION_FRAMES,
): Y004SegmentPlan => {
  if (!Number.isInteger(frame) || frame < 0 || frame >= frames) {
    throw new RangeError('Y004 frame outside the authored film; never clamp the drive.');
  }
  const segment = (frames === Y004_PROVISIONAL_DURATION_FRAMES
    ? Y004_SEGMENT_PLAN : buildY004SegmentPlan(frames))
    .find((s) => frame < s.frameEndExclusive);
  if (!segment) throw new Error('Y004 shot selection failed.');
  return segment;
};

type RouteNode = Readonly<{
  z: number;
  distanceM: number;
  flM: number;
  frM: number;
  rlM: number;
  rrM: number;
}>;
const routeCache = new Map<string, ReadonlyArray<RouteNode>>();
const routeFor = (run: Y004SegmentPlan): ReadonlyArray<RouteNode> => {
  const key = run.id + ':' + run.trackStartZ + ':' + run.trackEndZ;
  const existing = routeCache.get(key);
  if (existing) return existing;
  const start = run.trackStartZ;
  const end = run.trackEndZ;
  const stepCount = Math.ceil((end - start) / 0.1);
  const route: RouteNode[] = [];
  let distanceM = 0, flM = 0, frM = 0, rlM = 0, rrM = 0;
  let prev = sampleTrackAtLocalZ(start).center;
  for (let i = 0; i <= stepCount; i++) {
    const z = start + (end - start) * i / stepCount;
    const next = sampleTrackAtLocalZ(z).center;
    if (i) {
      const ds = Math.hypot(next[0] - prev[0], next[1] - prev[1]);
      const midpointZ = start + (end - start) * (i - 0.5) / stepCount;
      const kappa = curvatureAtTrackZ(midpointZ);
      distanceM += ds;
      flM += ds * (1 - kappa * FRONT_HALF_TRACK_M);
      frM += ds * (1 + kappa * FRONT_HALF_TRACK_M);
      rlM += ds * (1 - kappa * REAR_HALF_TRACK_M);
      rrM += ds * (1 + kappa * REAR_HALF_TRACK_M);
    }
    route.push({z, distanceM, flM, frM, rlM, rrM});
    prev = next;
  }
  routeCache.set(key, route);
  return route;
};
const sampleRoute = (run: Y004SegmentPlan, z: number): RouteNode => {
  // No clamping: an out-of-domain bug should fail QA rather than freeze.
  if (z < run.trackStartZ - 1e-8 || z > run.trackEndZ + 1e-8) {
    throw new RangeError('Y004 route exceeded its covered local-Z interval.');
  }
  const route = routeFor(run);
  const fraction = (z - run.trackStartZ) / (run.trackEndZ - run.trackStartZ);
  const raw = Math.max(0, Math.min(route.length - 1, fraction * (route.length - 1)));
  const index = Math.min(route.length - 2, Math.floor(raw));
  const t = raw - index;
  const a = route[index], b = route[index + 1];
  const lerp = (field: keyof RouteNode): number => a[field] + (b[field] - a[field]) * t;
  return {z, distanceM: lerp('distanceM'), flM: lerp('flM'),
    frM: lerp('frM'), rlM: lerp('rlM'), rrM: lerp('rrM')};
};

/** Distance has a monotone, gentle +/- 1.2% speed modulation and never eases to zero. */
const progressMap = (p: number) => p + 0.012 * Math.sin(TWOPI * p) / TWOPI;
const progressRate = (p: number) => 1 + 0.012 * Math.cos(TWOPI * p);
const zFor = (run: Y004SegmentPlan, frame: number) => {
  const p = (frame - run.frameStart) / (run.frameEndExclusive - run.frameStart);
  return run.trackStartZ + (run.trackEndZ - run.trackStartZ) * progressMap(p);
};
const speedAt = (run: Y004SegmentPlan, frame: number): number => {
  const span = run.frameEndExclusive - run.frameStart;
  const p = (frame - run.frameStart) / span;
  const z = zFor(run, frame);
  const dsDz = Math.hypot(1, (
    sampleTrackAtLocalZ(z + 0.02).center[0] -
    sampleTrackAtLocalZ(z - 0.02).center[0]
  ) / 0.04);
  return (run.trackEndZ - run.trackStartZ) * Y004_FPS / span * progressRate(p) * dsDz;
};
const velocityAndAcceleration = (run: Y004SegmentPlan, frame: number) => {
  const speedMps = speedAt(run, frame);
  const before = Math.max(run.frameStart, frame - 0.5);
  const after = Math.min(run.frameEndExclusive, frame + 0.5);
  const accelerationMps2 = (speedAt(run, after) - speedAt(run, before))
    * Y004_FPS / Math.max(1e-9, after - before);
  return {speedMps, accelerationMps2};
};
const rotateHub = (hub: Vec3, pos: Vec3, yaw: number): Vec3 => [
  pos[0] + hub[0] * Math.cos(yaw) + hub[2] * Math.sin(yaw),
  pos[1] + hub[1],
  pos[2] - hub[0] * Math.sin(yaw) + hub[2] * Math.cos(yaw),
];
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * For the low-speed illustration, use the bicycle approximation:
 * kappa = (tan(front) - tan(rear)) / L.
 * Front left/right differ by geometric curvature radius; rear wheels are
 * coherent left/right, not a fake toe-in/toe-out animation.
 * High-speed alignment remains illustrative, NOT Porsche controller tuning.
 */
const steeringAt = (kappa: number, staging: Staging) => {
  if (Math.abs(kappa) <= CURVATURE_EPS) return {FL: 0, FR: 0, RL: 0, RR: 0};
  const idealSingleAxle = Math.atan(WHEELBASE_M * kappa);
  const rearFactor = staging === 'low' ? -0.34 : 0.27;
  const rear = clamp(rearFactor * idealSingleAxle,
    -Y004_REAR_STEER_CAP_RAD, Y004_REAR_STEER_CAP_RAD);
  const leftRadiusCurvature = kappa / (1 - kappa * FRONT_HALF_TRACK_M);
  const rightRadiusCurvature = kappa / (1 + kappa * FRONT_HALF_TRACK_M);
  return {
    FL: Math.atan(WHEELBASE_M * leftRadiusCurvature + Math.tan(rear)),
    FR: Math.atan(WHEELBASE_M * rightRadiusCurvature + Math.tan(rear)),
    RL: rear, RR: rear,
  };
};

export const y004MotionAtFrame = (
  frame: number,
  frames: number = Y004_PROVISIONAL_DURATION_FRAMES,
): Y004DriveFrame => {
  const run = y004SegmentAtFrame(frame, frames);
  const z = zFor(run, frame);
  if (z < TRACK_LAYOUT_CONFIG.sampleMinZ || z > TRACK_LAYOUT_CONFIG.sampleMaxZ) {
    throw new RangeError('Y004 drove outside the existing physical track mesh.');
  }
  const sample = sampleTrackAtLocalZ(z);
  const [x, worldZ] = trackLocalToWorldXZ(sample.center);
  const rootPosition: Vec3 = [x, ASPHALT_WORLD_Y, worldZ];
  const yaw = Math.atan2(-sample.tangent[0], -sample.tangent[1]);
  const curvaturePerM = curvatureAtTrackZ(z);
  const steeringCurvaturePerM = steeringCurvatureAtTrackZ(z);
  const steerRad = steeringAt(steeringCurvaturePerM, run.staging);
  const {speedMps, accelerationMps2} = velocityAndAcceleration(run, frame);
  const distance = sampleRoute(run, z);
  const lateralAccelerationMps2 = speedMps * speedMps * curvaturePerM;
  const brakeLoad01 = clamp(-accelerationMps2 / 4.5, 0, 1);
  const cornerLoadSigned = clamp(lateralAccelerationMps2 / 3.5, -1, 1);
  const localFrame = frame - run.frameStart;
  const progress = localFrame / (run.frameEndExclusive - run.frameStart);
  const pathDistances: Record<WheelId, number> = {
    FL: distance.flM, FR: distance.frM, RL: distance.rlM, RR: distance.rrM,
  };
  const wheels = {} as Record<WheelId, WheelMotion>;
  for (const id of WHEELS) {
    const centreLocal: Vec3 = [...SOURCE_WHEEL_CENTRES[id]];
    // Source GLB wheel-pivot Y is the measured tyre radius; no generic wheel hack.
    const tyreRadiusM = id[0] === 'F'
      ? DEFAULT_MOTION_CONFIG.frontTyreRadiusM
      : DEFAULT_MOTION_CONFIG.rearTyreRadiusM;
    const pathDistanceM = pathDistances[id];
    wheels[id] = {
      id, centreLocal,
      centreWorld: rotateHub(centreLocal, rootPosition, yaw),
      pathDistanceM, tyreRadiusM, steerRad: steerRad[id],
      spinRad: pathDistanceM / tyreRadiusM,
      uprightOffsetY: 0,
    };
  }
  const motion: MotionState = {
    frame, timeS: frame / Y004_FPS, progress,
    phase: run.staging === 'low' ? 'turn-in' : 'release',
    distanceM: distance.distanceM, speedMps, accelerationMps2,
    curvaturePerM, steeringCurvaturePerM, lateralAccelerationMps2,
    root: {position: rootPosition, rotation: [0, yaw, 0], trackLocalZ: z},
    chassis: {
      pitchRad: clamp(-accelerationMps2 * 0.006, -0.009, 0.021),
      rollRad: clamp(lateralAccelerationMps2 * 0.01, -0.018, 0.018),
      heaveM: -0.006 * brakeLoad01 - 0.0025 * Math.abs(cornerLoadSigned),
      brakeLoad01, cornerLoadSigned,
    },
    wheels,
  };
  return {frame, timeS: frame / Y004_FPS, segmentId: run.id,
    regime: run.regime, motion, steerRad};
};
export type Y004MotionAudit = Readonly<{
  frontAverageRad: number;
  rearAverageRad: number;
  /** Kinematic bicycle curvature approximation from both steering axles. */
  inferredCurvaturePerM: number;
  pathSteeringCurvaturePerM: number;
  curvatureErrorPerM: number;
  trackZ: number;
  speedMps: number;
}>;
export const y004MotionAuditAtFrame = (frame: number): Y004MotionAudit => {
  const s = y004MotionAtFrame(frame);
  const f = (s.steerRad.FL + s.steerRad.FR) / 2;
  const r = (s.steerRad.RL + s.steerRad.RR) / 2;
  const k = (Math.tan(f) - Math.tan(r)) / WHEELBASE_M;
  return {frontAverageRad: f, rearAverageRad: r,
    inferredCurvaturePerM: k,
    pathSteeringCurvaturePerM: s.motion.steeringCurvaturePerM,
    curvatureErrorPerM: Math.abs(k - s.motion.steeringCurvaturePerM),
    trackZ: s.motion.root.trackLocalZ,
    speedMps: s.motion.speedMps};
};
