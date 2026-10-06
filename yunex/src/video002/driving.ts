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

const monotoneSlopes = (keys: DistanceKey[]) => {
  const secants = keys.slice(0, -1).map((key, index) => {
    const next = keys[index + 1];
    return (next.metres - key.metres) / Math.max(1, next.frame - key.frame);
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

const sampleKeyCurve = (frame: number, keys: DistanceKey[]) => {
  if (frame <= keys[0].frame) return keys[0].metres;
  if (frame >= keys[keys.length - 1].frame) return keys[keys.length - 1].metres;
  const slopes = monotoneSlopes(keys);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const span = Math.max(1, b.frame - a.frame);
      const t = clamp01((frame - a.frame) / span);
      const t2 = t * t;
      const t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      return (
        h00 * a.metres +
        h10 * span * slopes[i] +
        h01 * b.metres +
        h11 * span * slopes[i + 1]
      );
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
  return Math.sin(t * Math.PI) * 0.0035;
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
