export type Vec3 = [number, number, number];

export type FrontSide = 'left' | 'right';

export type Bounds3 = {
  min: Vec3;
  max: Vec3;
};

export type SuspensionFlowAnchor = {
  id: string;
  side: FrontSide;
  /**
   * Installed teardrop-link bounds in CAR-LOCAL metres.
   * +Y up, +Z forward, +X left.
   * Do not pass world-transformed bounds.
   */
  profileBoundsCar: Bounds3;
  /** Installed front wheel centre in CAR-LOCAL metres. */
  wheelCenterCar: Vec3;
  /** Visual clearance around the link profile; illustrative, not CFD. */
  clearance?: number;
};

export type SuspensionFlowPath = {
  id: string;
  anchorId: string;
  side: FrontSide;
  kind: 'upper' | 'outboard';
  points: Vec3[];
  radius: number;
  opacity: number;
  tracerPhase: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const fract = (value: number) => value - Math.floor(value);

const finiteVec3 = (v: Vec3) => v.every(Number.isFinite);

export const validateSuspensionFlowAnchor = (anchor: SuspensionFlowAnchor) => {
  const {min, max} = anchor.profileBoundsCar;
  if (!anchor.id) throw new Error('Y003 airflow anchor requires an id.');
  if (!finiteVec3(min) || !finiteVec3(max) || !finiteVec3(anchor.wheelCenterCar)) {
    throw new Error(`Y003 airflow anchor ${anchor.id} contains non-finite coordinates.`);
  }
  if (min[0] >= max[0] || min[1] >= max[1] || min[2] >= max[2]) {
    throw new Error(`Y003 airflow anchor ${anchor.id} has invalid profile bounds.`);
  }
  const clearance = anchor.clearance ?? 0.055;
  if (!Number.isFinite(clearance) || clearance < 0.02 || clearance > 0.18) {
    throw new Error(`Y003 airflow anchor ${anchor.id} clearance must be 0.02..0.18 m.`);
  }
  return anchor;
};

export const expandedBounds = (bounds: Bounds3, clearance: number): Bounds3 => ({
  min: [bounds.min[0] - clearance, bounds.min[1] - clearance, bounds.min[2] - clearance],
  max: [bounds.max[0] + clearance, bounds.max[1] + clearance, bounds.max[2] + clearance],
});

export const pointInsideBounds = (point: Vec3, bounds: Bounds3) =>
  point[0] >= bounds.min[0] && point[0] <= bounds.max[0] &&
  point[1] >= bounds.min[1] && point[1] <= bounds.max[1] &&
  point[2] >= bounds.min[2] && point[2] <= bounds.max[2];

/**
 * Build two restrained streamlines per visible front corner.
 * Incoming relative airflow runs from +Z to -Z in car-local space.
 * The paths stay outside an inflated link AABB so the illustrative tubes do not
 * visibly pass through the installed suspension profile.
 */
export const createSuspensionFlowPaths = (
  anchors: SuspensionFlowAnchor[],
): SuspensionFlowPath[] => anchors.flatMap((rawAnchor, index) => {
  const anchor = validateSuspensionFlowAnchor(rawAnchor);
  const {min, max} = anchor.profileBoundsCar;
  const clearance = anchor.clearance ?? 0.055;
  const safe = expandedBounds(anchor.profileBoundsCar, clearance);
  const sideSign = anchor.side === 'left' ? 1 : -1; // +X is vehicle-left.

  const centreX = (min[0] + max[0]) * 0.5;
  const centreY = (min[1] + max[1]) * 0.5;
  const frontZ = Math.max(max[2] + 0.58, anchor.wheelCenterCar[2] + 0.40);
  const rearZ = Math.min(min[2] - 0.58, anchor.wheelCenterCar[2] - 0.48);
  const frontShoulderZ = max[2] + 0.18;
  const rearShoulderZ = min[2] - 0.18;

  // Upper route: y remains above the inflated profile through the collision zone.
  const upperY = safe.max[1] + 0.025;
  const upper: SuspensionFlowPath = {
    id: `${anchor.id}-upper`,
    anchorId: anchor.id,
    side: anchor.side,
    kind: 'upper',
    points: [
      [centreX - sideSign * 0.025, upperY + 0.035, frontZ],
      [centreX, upperY + 0.012, frontShoulderZ],
      [centreX + sideSign * 0.012, upperY, (max[2] + min[2]) * 0.5],
      [centreX, upperY + 0.008, rearShoulderZ],
      [centreX - sideSign * 0.030, upperY + 0.030, rearZ],
    ],
    radius: 0.0072,
    opacity: 0.34,
    tracerPhase: fract(0.17 + index * 0.31),
  };

  // Outboard route: x remains outside the inflated profile through the collision zone.
  const outboardX = anchor.side === 'left'
    ? safe.max[0] + 0.030
    : safe.min[0] - 0.030;
  const outboard: SuspensionFlowPath = {
    id: `${anchor.id}-outboard`,
    anchorId: anchor.id,
    side: anchor.side,
    kind: 'outboard',
    points: [
      [outboardX + sideSign * 0.035, centreY + 0.030, frontZ],
      [outboardX + sideSign * 0.012, centreY + 0.012, frontShoulderZ],
      [outboardX, centreY, (max[2] + min[2]) * 0.5],
      [outboardX + sideSign * 0.010, centreY - 0.004, rearShoulderZ],
      [outboardX + sideSign * 0.040, centreY + 0.020, rearZ],
    ],
    radius: 0.0064,
    opacity: 0.28,
    tracerPhase: fract(0.53 + index * 0.29),
  };

  return [upper, outboard];
});

/**
 * Position is tied to A's cumulative travelled distance rather than wall-clock
 * randomness, so arbitrary-frame and chunked renders remain deterministic.
 */
export const suspensionTracerT = (
  travelDistanceMetres: number,
  phase: number,
  cyclesPerMetre = 0.060,
) => fract(Math.max(0, travelDistanceMetres) * cyclesPerMetre + phase);

/**
 * Cheap source-level invariant check used by D and Manager integration.
 * Catmull-Rom rendering uses the same safe-side construction, so every control
 * point remains outside the inflated profile and z progresses front-to-rear.
 */
export const auditSuspensionFlowPaths = (
  anchors: SuspensionFlowAnchor[],
  paths = createSuspensionFlowPaths(anchors),
) => {
  const byId = new Map(anchors.map((a) => [a.id, validateSuspensionFlowAnchor(a)]));
  const issues: string[] = [];

  for (const path of paths) {
    const anchor = byId.get(path.anchorId);
    if (!anchor) {
      issues.push(`${path.id}: missing anchor`);
      continue;
    }
    const safe = expandedBounds(anchor.profileBoundsCar, anchor.clearance ?? 0.055);
    for (const point of path.points) {
      if (pointInsideBounds(point, safe)) issues.push(`${path.id}: control point enters inflated profile bounds`);
    }
    for (let i = 1; i < path.points.length; i++) {
      if (path.points[i][2] >= path.points[i - 1][2]) {
        issues.push(`${path.id}: airflow must progress from +Z toward -Z`);
        break;
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    pathCount: paths.length,
  };
};

export const airflowVisibility = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
