export type Vec3 = [number, number, number];

export type Y003CameraShotId =
  | 'hook-low-front'
  | 'brake-turn-in'
  | 'wheel-tracking'
  | 'front-corner-reveal'
  | 'link-profile'
  | 'mechanical-load'
  | 'whole-car'
  | 'trackside-pass'
  | 'exit-chase';

export type Y003CameraMotionState = {
  position: Vec3;
  headingRad: number;
  speedMps: number;
  distanceM: number;
};

export type Y003CameraShotAnchor = {
  position: Vec3;
  headingRad: number;
};

export type Y003CameraCue = {
  id: Y003CameraShotId;
  progress: number;
  anchor?: Y003CameraShotAnchor;
};

export type Y003CameraPose = {
  shot: Y003CameraShotId;
  position: Vec3;
  target: Vec3;
  focalLengthMm: number;
  near: number;
  far: number;
  fixedWorld: boolean;
};

type ShotSpec = {
  mode: 'vehicle-relative' | 'world-fixed';
  cameraFrom: Vec3;
  cameraTo: Vec3;
  targetFrom: Vec3;
  targetTo: Vec3;
  focalFrom: number;
  focalTo: number;
  near: number;
  far: number;
};

const SPECS: Record<Y003CameraShotId, ShotSpec> = {
  'hook-low-front': {
    mode: 'vehicle-relative',
    cameraFrom: [3.25, 1.08, 6.25],
    cameraTo: [2.85, 1.0, 5.7],
    targetFrom: [0.15, 0.56, 0.7],
    targetTo: [0.05, 0.54, 0.8],
    focalFrom: 31,
    focalTo: 34,
    near: 0.08,
    far: 180,
  },
  'brake-turn-in': {
    mode: 'vehicle-relative',
    cameraFrom: [-4.55, 1.48, 6.0],
    cameraTo: [-4.15, 1.36, 5.25],
    targetFrom: [0, 0.55, 0.65],
    targetTo: [0.1, 0.5, 0.95],
    focalFrom: 34,
    focalTo: 39,
    near: 0.07,
    far: 180,
  },
  'wheel-tracking': {
    mode: 'vehicle-relative',
    cameraFrom: [2.55, 0.72, 2.5],
    cameraTo: [2.35, 0.66, 2.05],
    targetFrom: [0.8, 0.38, 1.25],
    targetTo: [0.78, 0.35, 1.2],
    focalFrom: 52,
    focalTo: 58,
    near: 0.05,
    far: 120,
  },
  'front-corner-reveal': {
    mode: 'vehicle-relative',
    cameraFrom: [3.75, 1.22, 4.15],
    cameraTo: [3.35, 1.10, 3.70],
    targetFrom: [0.56, 0.50, 1.02],
    targetTo: [0.64, 0.42, 1.14],
    focalFrom: 42,
    focalTo: 48,
    near: 0.045,
    far: 120,
  },
  'link-profile': {
    mode: 'vehicle-relative',
    cameraFrom: [3.35, 1.04, 3.20],
    cameraTo: [3.05, 0.96, 2.85],
    targetFrom: [0.58, 0.42, 1.14],
    targetTo: [0.52, 0.38, 1.08],
    focalFrom: 52,
    focalTo: 58,
    near: 0.035,
    far: 90,
  },
  'mechanical-load': {
    mode: 'vehicle-relative',
    cameraFrom: [-3.55, 1.16, 3.55],
    cameraTo: [-3.20, 1.06, 3.15],
    targetFrom: [-0.62, 0.44, 1.10],
    targetTo: [-0.58, 0.40, 1.04],
    focalFrom: 48,
    focalTo: 54,
    near: 0.04,
    far: 100,
  },
  'whole-car': {
    mode: 'vehicle-relative',
    cameraFrom: [-5.8, 1.78, 7.2],
    cameraTo: [-5.35, 1.7, 6.45],
    targetFrom: [0, 0.58, 0.25],
    targetTo: [0, 0.56, 0.55],
    focalFrom: 31,
    focalTo: 35,
    near: 0.08,
    far: 180,
  },
  'trackside-pass': {
    mode: 'world-fixed',
    cameraFrom: [8.3, 1.42, -0.4],
    cameraTo: [8.3, 1.42, -0.4],
    targetFrom: [0, 0.56, 0],
    targetTo: [0, 0.56, 0],
    focalFrom: 38,
    focalTo: 38,
    near: 0.08,
    far: 220,
  },
  'exit-chase': {
    mode: 'vehicle-relative',
    cameraFrom: [4.9, 1.6, -7.8],
    cameraTo: [5.5, 1.75, -9.1],
    targetFrom: [0, 0.58, 0.55],
    targetTo: [0, 0.6, 1.05],
    focalFrom: 31,
    focalTo: 34,
    near: 0.08,
    far: 220,
  },
};

export const Y003_CAMERA_SHOT_MANIFEST = Object.freeze(
  (Object.keys(SPECS) as Y003CameraShotId[]).map((id) => ({
    id,
    mode: SPECS[id].mode,
    focalLengthRangeMm: [SPECS[id].focalFrom, SPECS[id].focalTo] as [number, number],
  })),
);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const add3 = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export const rotateCarLocalToWorld = (v: Vec3, headingRad: number): Vec3 => {
  const c = Math.cos(headingRad);
  const s = Math.sin(headingRad);
  return [
    v[0] * c + v[2] * s,
    v[1],
    -v[0] * s + v[2] * c,
  ];
};

export const makeShotAnchor = (motion: Y003CameraMotionState): Y003CameraShotAnchor => ({
  position: [...motion.position] as Vec3,
  headingRad: motion.headingRad,
});

export const resolveY003CameraPose = (
  motion: Y003CameraMotionState,
  cue: Y003CameraCue,
): Y003CameraPose => {
  const spec = SPECS[cue.id];
  const p = smooth(cue.progress);
  const cameraLocal = lerp3(spec.cameraFrom, spec.cameraTo, p);
  const targetLocal = lerp3(spec.targetFrom, spec.targetTo, p);

  if (spec.mode === 'world-fixed') {
    if (!cue.anchor) {
      throw new Error('Y003 trackside-pass requires the shot-entry anchor from the motion contract.');
    }
    const position = add3(
      cue.anchor.position,
      rotateCarLocalToWorld(cameraLocal, cue.anchor.headingRad),
    );
    const target = add3(
      motion.position,
      rotateCarLocalToWorld(targetLocal, motion.headingRad),
    );
    return {
      shot: cue.id,
      position,
      target,
      focalLengthMm: lerp(spec.focalFrom, spec.focalTo, p),
      near: spec.near,
      far: spec.far,
      fixedWorld: true,
    };
  }

  return {
    shot: cue.id,
    position: add3(motion.position, rotateCarLocalToWorld(cameraLocal, motion.headingRad)),
    target: add3(motion.position, rotateCarLocalToWorld(targetLocal, motion.headingRad)),
    focalLengthMm: lerp(spec.focalFrom, spec.focalTo, p),
    near: spec.near,
    far: spec.far,
    fixedWorld: false,
  };
};

const distance3 = (a: Vec3, b: Vec3) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export type Y003CameraAudit = {
  ok: boolean;
  issues: string[];
  cameraTargetDistance: number;
};

export const auditY003CameraPose = (pose: Y003CameraPose): Y003CameraAudit => {
  const issues: string[] = [];
  const distance = distance3(pose.position, pose.target);
  const finite = [
    ...pose.position,
    ...pose.target,
    pose.focalLengthMm,
    pose.near,
    pose.far,
  ].every(Number.isFinite);
  if (!finite) issues.push('non-finite camera value');
  if (pose.focalLengthMm < 24 || pose.focalLengthMm > 85) {
    issues.push('focal length outside restrained automotive range');
  }
  if (pose.position[1] < 0.12) issues.push('camera approaches road plane');
  if (distance < Math.max(0.65, pose.near * 6)) {
    issues.push('camera/target spacing risks near-plane or macro clipping');
  }
  if (pose.far <= pose.near) issues.push('invalid clipping range');
  return {ok: issues.length === 0, issues, cameraTargetDistance: distance};
};

export const focalLengthToVerticalFov = (focalLengthMm: number, sensorHeightMm = 24) =>
  (2 * Math.atan(sensorHeightMm / (2 * Math.max(1, focalLengthMm))) * 180) / Math.PI;
