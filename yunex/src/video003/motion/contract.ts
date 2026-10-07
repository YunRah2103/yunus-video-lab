import {
  sampleTrackAtLocalZ,
  trackLocalToWorldXZ,
  TRACK_LAYOUT_CONFIG,
} from '../../video002/trackUpgrade/racetrack/layout';

export type Vec3 = [number, number, number];
export type Euler3 = [number, number, number];
export type WheelId = 'FL' | 'FR' | 'RL' | 'RR';

export type MotionPhase =
  | 'approach'
  | 'braking'
  | 'turn-in'
  | 'installed-detail'
  | 'release'
  | 'acceleration'
  | 'exit';

export type MotionConfig = {
  fps: number;
  durationFrames: number;
  startTrackZ: number;
  endTrackZ: number;
  routeStepM: number;
  wheelbaseM: number;
  frontTrackM: number;
  rearTrackM: number;
  frontTyreRadiusM: number;
  rearTyreRadiusM: number;
  maxSteerRad: number;
};

export type WheelMotion = {
  id: WheelId;
  centreLocal: Vec3;
  centreWorld: Vec3;
  pathDistanceM: number;
  tyreRadiusM: number;
  steerRad: number;
  spinRad: number;
  uprightOffsetY: number;
};

export type MotionState = {
  frame: number;
  timeS: number;
  progress: number;
  phase: MotionPhase;
  distanceM: number;
  speedMps: number;
  accelerationMps2: number;
  curvaturePerM: number;
  steeringCurvaturePerM: number;
  lateralAccelerationMps2: number;
  root: {
    position: Vec3;
    rotation: Euler3;
    trackLocalZ: number;
  };
  chassis: {
    pitchRad: number;
    rollRad: number;
    heaveM: number;
    brakeLoad01: number;
    cornerLoadSigned: number;
  };
  wheels: Record<WheelId, WheelMotion>;
};

export const SOURCE_WHEEL_CENTRES: Record<WheelId, Vec3> = {
  FL: [0.8047665688272774, 0.3521761158410333, 1.242510736222192],
  FR: [-0.8047665640219048, 0.35217613650115226, 1.2425106101149082],
  RL: [0.7878194082865579, 0.3713972648801439, -1.212009833228744],
  RR: [-0.7878194081323107, 0.37139726488197466, -1.210821210107691],
};

export const FRONT_AXLE_Z =
  (SOURCE_WHEEL_CENTRES.FL[2] + SOURCE_WHEEL_CENTRES.FR[2]) / 2;

// The approved GLB bakes 1° front / 2° rear camber into its vertices.
// These are rim-plane normals measured from that asset, not new wheel geometry.
export const SOURCE_WHEEL_SPIN_AXES: Record<WheelId, Vec3> = {
  FL: [Math.cos(Math.PI/180), Math.sin(Math.PI/180), 0],
  FR: [Math.cos(Math.PI/180), -Math.sin(Math.PI/180), 0],
  RL: [Math.cos(2*Math.PI/180), Math.sin(2*Math.PI/180), 0],
  RR: [Math.cos(2*Math.PI/180), -Math.sin(2*Math.PI/180), 0],
};
export const REAR_AXLE_Z =
  (SOURCE_WHEEL_CENTRES.RL[2] + SOURCE_WHEEL_CENTRES.RR[2]) / 2;

export const DEFAULT_MOTION_CONFIG: MotionConfig = {
  fps: 30,
  durationFrames: 750,
  startTrackZ: -60,
  endTrackZ: 136,
  routeStepM: 0.25,
  wheelbaseM: FRONT_AXLE_Z - REAR_AXLE_Z,
  frontTrackM: SOURCE_WHEEL_CENTRES.FL[0] - SOURCE_WHEEL_CENTRES.FR[0],
  rearTrackM: SOURCE_WHEEL_CENTRES.RL[0] - SOURCE_WHEEL_CENTRES.RR[0],
  // The prepared asset origin is on the ground plane. The wheel pivot Y values
  // therefore provide source-specific rolling radii without inventing a generic tyre.
  frontTyreRadiusM:
    (SOURCE_WHEEL_CENTRES.FL[1] + SOURCE_WHEEL_CENTRES.FR[1]) / 2,
  rearTyreRadiusM:
    (SOURCE_WHEEL_CENTRES.RL[1] + SOURCE_WHEEL_CENTRES.RR[1]) / 2,
  maxSteerRad: 0.12,
};

type RouteEntry = {
  z: number;
  worldX: number;
  worldZ: number;
  distanceM: number;
  frontLeftDistanceM: number;
  frontRightDistanceM: number;
  rearLeftDistanceM: number;
  rearRightDistanceM: number;
};

type RouteLut = {
  entries: RouteEntry[];
  totalDistanceM: number;
};

type DistanceKey = {
  progress: number;
  distanceM: number;
};

const PROFILE_KEYS = [
  {progress: 0, trackZ: -60},
  {progress: 0.17, trackZ: -10},
  {progress: 0.29, trackZ: 10},
  {progress: 0.43, trackZ: 31},
  {progress: 0.56, trackZ: 50},
  {progress: 0.75, trackZ: 80},
  {progress: 1, trackZ: 136},
] as const;

const routeCache = new Map<string, RouteLut>();

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const clamp01 = (value: number) => clamp(value, 0, 1);

const finite = (value: number, fallback = 0) =>
  Number.isFinite(value) ? value : fallback;

export const resolveMotionConfig = (
  input: Partial<MotionConfig> = {},
): MotionConfig => {
  const config = {...DEFAULT_MOTION_CONFIG, ...input};
  if (!Number.isFinite(config.fps) || config.fps <= 0) {
    throw new Error('Y003 motion fps must be finite and positive.');
  }
  if (!Number.isFinite(config.durationFrames) || config.durationFrames < 2) {
    throw new Error('Y003 motion durationFrames must be at least 2.');
  }
  if (
    config.startTrackZ < TRACK_LAYOUT_CONFIG.sampleMinZ ||
    config.endTrackZ > TRACK_LAYOUT_CONFIG.sampleMaxZ ||
    config.endTrackZ <= config.startTrackZ
  ) {
    throw new Error('Y003 route must stay inside the approved track sample range.');
  }
  if (!Number.isFinite(config.routeStepM) || config.routeStepM <= 0) {
    throw new Error('Y003 routeStepM must be finite and positive.');
  }
  return config;
};

const worldYawAtTrackZ = (z: number) => {
  const sample = sampleTrackAtLocalZ(z);
  const worldTangentX = -sample.tangent[0];
  const worldTangentZ = -sample.tangent[1];
  return Math.atan2(worldTangentX, worldTangentZ);
};

const unwrapNear = (reference: number, angle: number) => {
  let result = angle;
  while (result - reference > Math.PI) result -= Math.PI * 2;
  while (result - reference < -Math.PI) result += Math.PI * 2;
  return result;
};

const averageCurvatureAcrossWindow = (z: number, halfWindowM: number) => {
  const z0 = clamp(
    z - halfWindowM,
    TRACK_LAYOUT_CONFIG.sampleMinZ,
    TRACK_LAYOUT_CONFIG.sampleMaxZ,
  );
  const z1 = clamp(
    z + halfWindowM,
    TRACK_LAYOUT_CONFIG.sampleMinZ,
    TRACK_LAYOUT_CONFIG.sampleMaxZ,
  );
  if (Math.abs(z1 - z0) < 1e-9) return 0;
  const p0 = sampleTrackAtLocalZ(z0).center;
  const p1 = sampleTrackAtLocalZ(z1).center;
  const distance = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  if (distance < 1e-9) return 0;
  const yaw0 = worldYawAtTrackZ(z0);
  const yaw1 = unwrapNear(yaw0, worldYawAtTrackZ(z1));
  return (yaw1 - yaw0) / distance;
};

export const curvatureAtTrackZ = (z: number) =>
  averageCurvatureAcrossWindow(z, 0.08);

// Steering should respond to the road over roughly a wheelbase-scale window,
// not to the C2 discontinuity at the exact endpoints of the authored smoothstep
// bend. This preserves the route while removing one-frame front-wheel snaps.
export const STEERING_CURVATURE_HALF_WINDOW_M = 1.5;

export const steeringCurvatureAtTrackZ = (z: number) =>
  averageCurvatureAcrossWindow(z, STEERING_CURVATURE_HALF_WINDOW_M);

const routeCacheKey = (config: MotionConfig) =>
  [
    config.startTrackZ,
    config.endTrackZ,
    config.routeStepM,
    config.frontTrackM,
    config.rearTrackM,
  ]
    .map((value) => value.toFixed(6))
    .join(':');

const buildRouteLut = (config: MotionConfig): RouteLut => {
  const entries: RouteEntry[] = [];
  let distanceM = 0;
  let frontLeftDistanceM = 0;
  let frontRightDistanceM = 0;
  let rearLeftDistanceM = 0;
  let rearRightDistanceM = 0;

  const push = (z: number) => {
    const sample = sampleTrackAtLocalZ(z);
    const [worldX, worldZ] = trackLocalToWorldXZ(sample.center);
    const previous = entries[entries.length - 1];
    if (previous) {
      const ds = Math.hypot(worldX - previous.worldX, worldZ - previous.worldZ);
      const midpointZ = (previous.z + z) / 2;
      const curvature = curvatureAtTrackZ(midpointZ);
      distanceM += ds;
      frontLeftDistanceM += ds * Math.max(0.5, 1 - curvature * config.frontTrackM / 2);
      frontRightDistanceM += ds * Math.max(0.5, 1 + curvature * config.frontTrackM / 2);
      rearLeftDistanceM += ds * Math.max(0.5, 1 - curvature * config.rearTrackM / 2);
      rearRightDistanceM += ds * Math.max(0.5, 1 + curvature * config.rearTrackM / 2);
    }
    entries.push({
      z,
      worldX,
      worldZ,
      distanceM,
      frontLeftDistanceM,
      frontRightDistanceM,
      rearLeftDistanceM,
      rearRightDistanceM,
    });
  };

  for (
    let z = config.startTrackZ;
    z < config.endTrackZ - 1e-9;
    z += config.routeStepM
  ) {
    push(Math.min(config.endTrackZ, z));
  }
  if (!entries.length || entries[entries.length - 1].z < config.endTrackZ - 1e-9) {
    push(config.endTrackZ);
  }

  return {entries, totalDistanceM: entries[entries.length - 1]?.distanceM ?? 0};
};

const routeFor = (config: MotionConfig) => {
  const key = routeCacheKey(config);
  const cached = routeCache.get(key);
  if (cached) return cached;
  const route = buildRouteLut(config);
  routeCache.set(key, route);
  return route;
};

const entryAtDistance = (distanceInput: number, route: RouteLut): RouteEntry => {
  const distanceM = clamp(distanceInput, 0, route.totalDistanceM);
  const entries = route.entries;
  if (distanceM <= 0) return entries[0];
  if (distanceM >= route.totalDistanceM) return entries[entries.length - 1];

  let lo = 0;
  let hi = entries.length - 1;
  while (lo + 1 < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (entries[mid].distanceM <= distanceM) lo = mid;
    else hi = mid;
  }

  const a = entries[lo];
  const b = entries[hi];
  const span = Math.max(1e-9, b.distanceM - a.distanceM);
  const t = clamp01((distanceM - a.distanceM) / span);
  const lerp = (av: number, bv: number) => av + (bv - av) * t;
  return {
    z: lerp(a.z, b.z),
    worldX: lerp(a.worldX, b.worldX),
    worldZ: lerp(a.worldZ, b.worldZ),
    distanceM,
    frontLeftDistanceM: lerp(a.frontLeftDistanceM, b.frontLeftDistanceM),
    frontRightDistanceM: lerp(a.frontRightDistanceM, b.frontRightDistanceM),
    rearLeftDistanceM: lerp(a.rearLeftDistanceM, b.rearLeftDistanceM),
    rearRightDistanceM: lerp(a.rearRightDistanceM, b.rearRightDistanceM),
  };
};

const distanceAtTrackZ = (zInput: number, route: RouteLut) => {
  const z = clamp(zInput, route.entries[0].z, route.entries[route.entries.length - 1].z);
  const entries = route.entries;
  let lo = 0;
  let hi = entries.length - 1;
  while (lo + 1 < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (entries[mid].z <= z) lo = mid;
    else hi = mid;
  }
  const a = entries[lo];
  const b = entries[hi];
  const span = Math.max(1e-9, b.z - a.z);
  const t = clamp01((z - a.z) / span);
  return a.distanceM + (b.distanceM - a.distanceM) * t;
};

const profileKeysFor = (config: MotionConfig, route: RouteLut): DistanceKey[] => {
  const mapped = PROFILE_KEYS.map((key) => ({
    progress: key.progress,
    distanceM: distanceAtTrackZ(
      clamp(key.trackZ, config.startTrackZ, config.endTrackZ),
      route,
    ),
  }));
  mapped[0] = {progress: 0, distanceM: 0};
  mapped[mapped.length - 1] = {
    progress: 1,
    distanceM: route.totalDistanceM,
  };
  return mapped;
};

const monotoneSlopes = (keys: DistanceKey[]) => {
  const secants = keys.slice(0, -1).map((key, index) => {
    const next = keys[index + 1];
    return (next.distanceM - key.distanceM) /
      Math.max(1e-9, next.progress - key.progress);
  });
  return keys.map((_, index) => {
    if (index === 0) return secants[0];
    if (index === keys.length - 1) return secants[secants.length - 1];
    const a = secants[index - 1];
    const b = secants[index];
    if (a === 0 || b === 0 || Math.sign(a) !== Math.sign(b)) return 0;
    return (2 * a * b) / (a + b);
  });
};

const sampleDistanceCurve = (progressInput: number, keys: DistanceKey[]) => {
  const progress = clamp01(progressInput);
  if (progress <= keys[0].progress) return keys[0].distanceM;
  if (progress >= keys[keys.length - 1].progress) {
    return keys[keys.length - 1].distanceM;
  }
  const slopes = monotoneSlopes(keys);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (progress < a.progress || progress > b.progress) continue;
    const span = Math.max(1e-9, b.progress - a.progress);
    const t = clamp01((progress - a.progress) / span);
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return (
      h00 * a.distanceM +
      h10 * span * slopes[i] +
      h01 * b.distanceM +
      h11 * span * slopes[i + 1]
    );
  }
  return keys[keys.length - 1].distanceM;
};

export const distanceAtFrame = (
  frameInput: number,
  input: Partial<MotionConfig> = {},
) => {
  const config = resolveMotionConfig(input);
  const route = routeFor(config);
  const frame = clamp(finite(frameInput), 0, config.durationFrames - 1);
  const progress = frame / Math.max(1, config.durationFrames - 1);
  return sampleDistanceCurve(progress, profileKeysFor(config, route));
};

export const speedAtFrame = (
  frameInput: number,
  input: Partial<MotionConfig> = {},
) => {
  const config = resolveMotionConfig(input);
  const frame = clamp(finite(frameInput), 0, config.durationFrames - 1);
  const beforeFrame = Math.max(0, frame - 0.5);
  const afterFrame = Math.min(config.durationFrames - 1, frame + 0.5);
  const dt = (afterFrame - beforeFrame) / config.fps;
  if (dt <= 0) return 0;
  return Math.max(
    0,
    (distanceAtFrame(afterFrame, config) - distanceAtFrame(beforeFrame, config)) / dt,
  );
};

export const accelerationAtFrame = (
  frameInput: number,
  input: Partial<MotionConfig> = {},
) => {
  const config = resolveMotionConfig(input);
  const frame = clamp(finite(frameInput), 0, config.durationFrames - 1);
  const beforeFrame = Math.max(0, frame - 0.5);
  const afterFrame = Math.min(config.durationFrames - 1, frame + 0.5);
  const dt = (afterFrame - beforeFrame) / config.fps;
  if (dt <= 0) return 0;
  return (
    speedAtFrame(afterFrame, config) - speedAtFrame(beforeFrame, config)
  ) / dt;
};

export const steeringForCurvature = (
  curvature: number,
  config: MotionConfig,
): {left: number; right: number} => {
  if (Math.abs(curvature) < 1e-7) return {left: 0, right: 0};
  const radius = 1 / curvature;
  const halfTrack = config.frontTrackM / 2;
  const left = Math.atan(config.wheelbaseM / (radius - halfTrack));
  const right = Math.atan(config.wheelbaseM / (radius + halfTrack));
  return {
    left: clamp(left, -config.maxSteerRad, config.maxSteerRad),
    right: clamp(right, -config.maxSteerRad, config.maxSteerRad),
  };
};

const rotateLocalToWorld = (local: Vec3, rootPosition: Vec3, yaw: number): Vec3 => {
  const cosine = Math.cos(yaw);
  const sine = Math.sin(yaw);
  return [
    rootPosition[0] + local[0] * cosine + local[2] * sine,
    rootPosition[1] + local[1],
    rootPosition[2] - local[0] * sine + local[2] * cosine,
  ];
};

const phaseAt = (progress: number): MotionPhase => {
  if (progress < 0.17) return 'approach';
  if (progress < 0.29) return 'braking';
  if (progress < 0.43) return 'turn-in';
  if (progress < 0.56) return 'installed-detail';
  if (progress < 0.68) return 'release';
  if (progress < 0.86) return 'acceleration';
  return 'exit';
};

export const motionStateAt = (
  frameInput: number,
  input: Partial<MotionConfig> = {},
): MotionState => {
  const config = resolveMotionConfig(input);
  const frame = clamp(finite(frameInput), 0, config.durationFrames - 1);
  const progress = frame / Math.max(1, config.durationFrames - 1);
  const route = routeFor(config);
  const distanceM = distanceAtFrame(frame, config);
  const path = entryAtDistance(distanceM, route);
  const yaw = worldYawAtTrackZ(path.z);
  const rootPosition: Vec3 = [path.worldX, 0, path.worldZ];
  const speedMps = speedAtFrame(frame, config);
  const accelerationMps2 = accelerationAtFrame(frame, config);
  const curvaturePerM = curvatureAtTrackZ(path.z);
  const steeringCurvaturePerM = steeringCurvatureAtTrackZ(path.z);
  const lateralAccelerationMps2 = speedMps * speedMps * curvaturePerM;
  const steer = steeringForCurvature(steeringCurvaturePerM, config);

  const brakeLoad01 = clamp01(-accelerationMps2 / 4.5);
  const cornerLoadSigned = clamp(lateralAccelerationMps2 / 3.5, -1, 1);
  const pitchRad = clamp(-accelerationMps2 * 0.006, -0.009, 0.021);
  const rollRad = clamp(lateralAccelerationMps2 * 0.01, -0.018, 0.018);
  const heaveM = -0.006 * brakeLoad01 - 0.0025 * Math.abs(cornerLoadSigned);

  const wheelPathDistance: Record<WheelId, number> = {
    FL: path.frontLeftDistanceM,
    FR: path.frontRightDistanceM,
    RL: path.rearLeftDistanceM,
    RR: path.rearRightDistanceM,
  };
  const radiusFor = (id: WheelId) =>
    id[0] === 'F' ? config.frontTyreRadiusM : config.rearTyreRadiusM;
  const steerFor = (id: WheelId) =>
    id === 'FL' ? steer.left : id === 'FR' ? steer.right : 0;

  const wheels = (Object.keys(SOURCE_WHEEL_CENTRES) as WheelId[]).reduce(
    (acc, id) => {
      const centreLocal = SOURCE_WHEEL_CENTRES[id];
      const tyreRadiusM = radiusFor(id);
      const pathDistanceM = wheelPathDistance[id];
      acc[id] = {
        id,
        centreLocal,
        centreWorld: rotateLocalToWorld(centreLocal, rootPosition, yaw),
        pathDistanceM,
        tyreRadiusM,
        steerRad: steerFor(id),
        spinRad: pathDistanceM / tyreRadiusM,
        uprightOffsetY: 0,
      };
      return acc;
    },
    {} as Record<WheelId, WheelMotion>,
  );

  return {
    frame,
    timeS: frame / config.fps,
    progress,
    phase: phaseAt(progress),
    distanceM,
    speedMps,
    accelerationMps2,
    curvaturePerM,
    steeringCurvaturePerM,
    lateralAccelerationMps2,
    root: {
      position: rootPosition,
      rotation: [0, yaw, 0],
      trackLocalZ: path.z,
    },
    chassis: {
      pitchRad,
      rollRad,
      heaveM,
      brakeLoad01,
      cornerLoadSigned,
    },
    wheels,
  };
};

export const motionManifest = (input: Partial<MotionConfig> = {}) => {
  const config = resolveMotionConfig(input);
  const route = routeFor(config);
  return {
    units: 'metres',
    axes: {up: '+Y', forward: '+Z', left: '+X'},
    trackSpace: 'YUNEX 002 approved world transform; route sampled from corrected centreline',
    rootOwnership: 'motion state is already world-space; do not apply TrackWorld root again',
    wheelbaseM: config.wheelbaseM,
    frontTrackM: config.frontTrackM,
    rearTrackM: config.rearTrackM,
    frontTyreRadiusM: config.frontTyreRadiusM,
    rearTyreRadiusM: config.rearTyreRadiusM,
    routeStartTrackZ: config.startTrackZ,
    routeEndTrackZ: config.endTrackZ,
    routeDistanceM: route.totalDistanceM,
    durationFrames: config.durationFrames,
    fps: config.fps,
  };
};
