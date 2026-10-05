import {
  type RootPose,
  type Vec3,
  type Yunex002CameraTiming,
  resolveCameraTiming,
  rootPoseAt,
  wheelAngleAt,
} from './driving';

export type CameraShot =
  | 'rear-quarter-hook'
  | 'wing-macro'
  | 'high-downforce-rear'
  | 'drs-side-track'
  | 'braking-quarter'
  | 'whole-car-coordination'
  | 'final-hero-pass';

export type CameraPose = {
  position: Vec3;
  target: Vec3;
  focalLength: number;
};

export type Yunex002Pose = {
  camera: CameraPose;
  rootPose: RootPose;
  wheelAngle: number;
  shot: CameraShot;
};

type CameraKey = {
  frame: number;
  positionOffset: Vec3;
  targetOffset: Vec3;
  focalLength: number;
  shot: CameraShot;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

const keysFor = (t: Yunex002CameraTiming): CameraKey[] => [
  {
    frame: 0,
    positionOffset: [3.8, 1.7, -6.5],
    targetOffset: [0.05, 0.63, -0.72],
    focalLength: 32,
    shot: 'rear-quarter-hook',
  },
  {
    frame: t.hookEnd,
    positionOffset: [3.8, 1.6, -6.2],
    targetOffset: [0.02, 0.78, -1.25],
    focalLength: 34,
    shot: 'rear-quarter-hook',
  },
  {
    frame: t.wingMacroEnd,
    positionOffset: [1.9, 1.4, -4.0],
    targetOffset: [0.0, 1.06, -2.02],
    focalLength: 25,
    shot: 'wing-macro',
  },
  {
    frame: t.highDownforceEnd,
    positionOffset: [4.6, 2.4, -7.8],
    targetOffset: [0.0, 0.72, -0.62],
    focalLength: 32,
    shot: 'high-downforce-rear',
  },
  {
    frame: t.drsEnd,
    positionOffset: [9.5, 1.25, -0.1],
    targetOffset: [0.0, 0.61, 0.08],
    focalLength: 58,
    shot: 'drs-side-track',
  },
  {
    frame: t.brakingEnd,
    positionOffset: [-5.8, 1.8, 7.6],
    targetOffset: [0.0, 0.56, 0.76],
    focalLength: 30,
    shot: 'braking-quarter',
  },
  {
    frame: t.coordinationEnd,
    positionOffset: [5.4, 2.4, 8.4],
    targetOffset: [0.0, 0.58, 0.18],
    focalLength: 26,
    shot: 'whole-car-coordination',
  },
  {
    frame: t.finalEnd,
    positionOffset: [5.2, 1.5, 7.8],
    targetOffset: [0.0, 0.52, 0.72],
    focalLength: 30,
    shot: 'final-hero-pass',
  },
];

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const cameraAt = (frame: number, timing: Yunex002CameraTiming, rootPose: RootPose) => {
  const keys = keysFor(timing);
  const f = Math.max(0, Math.min(frame, timing.finalEnd));
  let a = keys[0];
  let b = keys[1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (f >= keys[i].frame && f <= keys[i + 1].frame) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  const p = ease((f - a.frame) / Math.max(1, b.frame - a.frame));
  const positionOffset = lerp3(a.positionOffset, b.positionOffset, p);
  const targetOffset = lerp3(a.targetOffset, b.targetOffset, p);
  return {
    camera: {
      position: add(rootPose.position, positionOffset),
      target: add(rootPose.position, targetOffset),
      focalLength: lerp(a.focalLength, b.focalLength, p),
    },
    shot: p < 0.5 ? a.shot : b.shot,
  };
};

export const poseFor = (
  frame: number,
  timingInput: Partial<Yunex002CameraTiming> = {},
): Yunex002Pose => {
  const timing = resolveCameraTiming(timingInput);
  const rootPose = rootPoseAt(frame, timing);
  const {camera, shot} = cameraAt(frame, timing, rootPose);
  return {
    camera,
    rootPose,
    wheelAngle: wheelAngleAt(frame, timing),
    shot,
  };
};

export const focalLengthToVerticalFov = (focalLength: number, sensorHeight = 24) =>
  (2 * Math.atan(sensorHeight / (2 * Math.max(1, focalLength))) * 180) / Math.PI;
