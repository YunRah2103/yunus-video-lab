export type Vec3 = [number, number, number];
export type Euler3 = [number, number, number];

export type RootPose = {
  position: Vec3;
  rotation: Euler3;
  distance: number;
  speed: number;
};

export type Yunex002CameraTiming = {
  fps: number;
  hookEnd: number;
  wingMacroEnd: number;
  highDownforceEnd: number;
  drsEnd: number;
  brakingEnd: number;
  coordinationEnd: number;
  finalEnd: number;
};

export const DEFAULT_CAMERA_TIMING: Yunex002CameraTiming = {
  fps: 30,
  hookEnd: 72,
  wingMacroEnd: 165,
  highDownforceEnd: 285,
  drsEnd: 405,
  brakingEnd: 540,
  coordinationEnd: 660,
  finalEnd: 750,
};

export const TYRE_RADIUS_METRES = 0.34;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export const resolveCameraTiming = (
  timing: Partial<Yunex002CameraTiming> = {},
): Yunex002CameraTiming => {
  const resolved = {...DEFAULT_CAMERA_TIMING, ...timing};
  const ordered = [
    resolved.hookEnd,
    resolved.wingMacroEnd,
    resolved.highDownforceEnd,
    resolved.drsEnd,
    resolved.brakingEnd,
    resolved.coordinationEnd,
    resolved.finalEnd,
  ];
  if (resolved.fps <= 0 || ordered.some((v) => !Number.isFinite(v)) || ordered.some((v, i) => i > 0 && v <= ordered[i - 1])) {
    throw new Error('Invalid YUNEX 002 camera timing: beat boundaries must be finite and strictly increasing.');
  }
  return resolved;
};

type DistanceKey = {frame: number; metres: number};

const distanceKeysFor = (timing: Yunex002CameraTiming): DistanceKey[] => [
  {frame: 0, metres: 0},
  {frame: timing.hookEnd, metres: 0.22},
  {frame: timing.wingMacroEnd, metres: 0.55},
  {frame: timing.highDownforceEnd, metres: 1.15},
  {frame: timing.drsEnd, metres: 2.15},
  {frame: timing.brakingEnd, metres: 2.85},
  {frame: timing.coordinationEnd, metres: 3.55},
  {frame: timing.finalEnd, metres: 5.15},
];

const sampleKeyCurve = (frame: number, keys: DistanceKey[]) => {
  if (frame <= keys[0].frame) return keys[0].metres;
  if (frame >= keys[keys.length - 1].frame) return keys[keys.length - 1].metres;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = smoothstep((frame - a.frame) / Math.max(1, b.frame - a.frame));
      return a.metres + (b.metres - a.metres) * t;
    }
  }
  return keys[keys.length - 1].metres;
};

export const drivingDistanceAt = (
  frame: number,
  timingInput: Partial<Yunex002CameraTiming> = {},
) => {
  const timing = resolveCameraTiming(timingInput);
  return sampleKeyCurve(Math.max(0, frame), distanceKeysFor(timing));
};

export const speedAt = (
  frame: number,
  timingInput: Partial<Yunex002CameraTiming> = {},
) => {
  const timing = resolveCameraTiming(timingInput);
  const halfFrame = 0.5;
  const before = drivingDistanceAt(Math.max(0, frame - halfFrame), timing);
  const after = drivingDistanceAt(frame + halfFrame, timing);
  return Math.max(0, (after - before) * timing.fps);
};

const brakingPitchAt = (frame: number, timing: Yunex002CameraTiming) => {
  const start = timing.drsEnd;
  const end = timing.brakingEnd;
  if (frame <= start || frame >= end) return 0;
  const t = clamp01((frame - start) / Math.max(1, end - start));
  // Under one degree: enough to suggest load transfer without a dramatic nose-dive.
  return Math.sin(t * Math.PI) * 0.014;
};

export const rootPoseAt = (
  frame: number,
  timingInput: Partial<Yunex002CameraTiming> = {},
): RootPose => {
  const timing = resolveCameraTiming(timingInput);
  const distance = drivingDistanceAt(frame, timing);
  const speed = speedAt(frame, timing);
  const finalProgress = clamp01(
    (frame - timing.coordinationEnd) / Math.max(1, timing.finalEnd - timing.coordinationEnd),
  );
  const x = frame > timing.coordinationEnd ? Math.sin(finalProgress * Math.PI) * 0.055 : 0;
  return {
    position: [x, 0, distance],
    rotation: [brakingPitchAt(frame, timing), 0, 0],
    distance,
    speed,
  };
};

export const wheelAngleAt = (
  frame: number,
  timingInput: Partial<Yunex002CameraTiming> = {},
) => drivingDistanceAt(frame, timingInput) / TYRE_RADIUS_METRES;
