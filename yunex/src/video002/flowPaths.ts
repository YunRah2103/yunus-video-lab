export type AeroMode = 'highDownforce' | 'drs' | 'airbrake';
export type Vec3Tuple = [number, number, number];

export type CarTransform = {
  position: Vec3Tuple;
  rotation: Vec3Tuple;
};

export type FlapBounds = {
  min: Vec3Tuple;
  max: Vec3Tuple;
  clearance?: number;
};

export type FlowPathKind = 'roof' | 'side' | 'underbody';

export type FlowPathSpec = {
  id: string;
  kind: FlowPathKind;
  points: Vec3Tuple[];
  opacity: number;
  radius: number;
  tracerPhase: number;
};

export type FlowVisualState = {
  wakeLift: number;
  wakeSpread: number;
  pathOpacity: number;
  forceStrength: number;
  dragStrength: number;
};

export const DEFAULT_CAR_TRANSFORM: CarTransform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
};

// Measured from the approved exterior GLB in the production pack. This is only
// a static fallback for C's proof. Agent A can pass current moving-flap bounds.
export const APPROVED_STATIC_FLAP_BOUNDS: FlapBounds = {
  min: [-0.872, 1.169, -2.213],
  max: [0.872, 1.367, -1.732],
  clearance: 0.10,
};

export const FLOW_FRONT_Z = 2.95;
export const FLOW_REAR_Z = -3.05;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const smooth01 = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3Tuple, b: Vec3Tuple, t: number): Vec3Tuple => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

const MODE_STATE: Record<AeroMode, FlowVisualState> = {
  // Values are art-direction controls, not measured CFD coefficients.
  highDownforce: {
    wakeLift: 0.30,
    wakeSpread: 0.22,
    pathOpacity: 0.27,
    forceStrength: 1.0,
    dragStrength: 0.16,
  },
  drs: {
    wakeLift: 0.09,
    wakeSpread: 0.08,
    pathOpacity: 0.23,
    forceStrength: 0.42,
    dragStrength: 0.08,
  },
  airbrake: {
    wakeLift: 0.44,
    wakeSpread: 0.34,
    pathOpacity: 0.26,
    forceStrength: 0.72,
    dragStrength: 1.0,
  },
};

export function visualStateFor(
  mode: AeroMode,
  transition = 1,
  fromMode: AeroMode = mode,
): FlowVisualState {
  const t = smooth01(transition);
  const from = MODE_STATE[fromMode];
  const to = MODE_STATE[mode];
  if (t <= 0) return {...from};
  if (t >= 1) return {...to};
  return {
    wakeLift: lerp(from.wakeLift, to.wakeLift, t),
    wakeSpread: lerp(from.wakeSpread, to.wakeSpread, t),
    pathOpacity: lerp(from.pathOpacity, to.pathOpacity, t),
    forceStrength: lerp(from.forceStrength, to.forceStrength, t),
    dragStrength: lerp(from.dragStrength, to.dragStrength, t),
  };
}

function enforceFlapClearance(points: Vec3Tuple[], bounds?: FlapBounds): Vec3Tuple[] {
  if (!bounds) return points.map((p) => [...p] as Vec3Tuple);
  const clearance = bounds.clearance ?? 0.10;
  const zPad = 0.12;
  const minZ = Math.min(bounds.min[2], bounds.max[2]) - zPad;
  const maxZ = Math.max(bounds.min[2], bounds.max[2]) + zPad;
  const top = Math.max(bounds.min[1], bounds.max[1]) + clearance;
  return points.map(([x, y, z]) => [x, z >= minZ && z <= maxZ ? Math.max(y, top) : y, z]);
}

function roofPath(
  id: string,
  x: number,
  state: FlowVisualState,
  phase: number,
  flapBounds?: FlapBounds,
): FlowPathSpec {
  const side = x === 0 ? 0 : Math.sign(x);
  const spread = state.wakeSpread * side;
  const points: Vec3Tuple[] = [
    [x * 0.64, 0.76, FLOW_FRONT_Z],
    [x * 0.78, 1.03, 2.10],
    [x * 0.92, 1.38, 1.05],
    [x, 1.54, 0.05],
    [x * 1.02, 1.49, -1.08],
    [x * 1.03, 1.49 + state.wakeLift * 0.12, -1.58],
    [x + spread * 0.12, 1.50 + state.wakeLift * 0.25, -1.88],
    [x + spread * 0.48, 1.39 + state.wakeLift * 0.72, -2.36],
    [x + spread, 1.27 + state.wakeLift, FLOW_REAR_Z],
  ];
  return {
    id,
    kind: 'roof',
    points: enforceFlapClearance(points, flapBounds),
    opacity: state.pathOpacity,
    radius: x === 0 ? 0.011 : 0.009,
    tracerPhase: phase,
  };
}

function sidePath(id: string, x: number, state: FlowVisualState, phase: number): FlowPathSpec {
  const side = Math.sign(x);
  const points: Vec3Tuple[] = [
    [x * 0.83, 0.47, FLOW_FRONT_Z],
    [x * 0.98, 0.53, 1.85],
    [x, 0.63, 0.62],
    [x * 0.98, 0.67, -0.72],
    [x * 0.92, 0.75, -1.63],
    [x + side * state.wakeSpread * 0.42, 0.78 + state.wakeLift * 0.10, -2.28],
    [x + side * state.wakeSpread, 0.74 + state.wakeLift * 0.20, FLOW_REAR_Z],
  ];
  return {
    id,
    kind: 'side',
    points,
    opacity: state.pathOpacity * 0.82,
    radius: 0.008,
    tracerPhase: phase,
  };
}

function underbodyPath(id: string, x: number, state: FlowVisualState, phase: number): FlowPathSpec {
  const points: Vec3Tuple[] = [
    [x, 0.145, 2.70],
    [x * 1.02, 0.125, 1.55],
    [x * 1.05, 0.112, 0.32],
    [x * 1.03, 0.112, -0.95],
    [x * 0.94, 0.145, -1.86],
    [x * 0.82, 0.24 + state.wakeLift * 0.10, -2.58],
  ];
  return {
    id,
    kind: 'underbody',
    points,
    opacity: state.pathOpacity * 0.58,
    radius: 0.006,
    tracerPhase: phase,
  };
}

export function createFlowPaths(args: {
  mode: AeroMode;
  transition?: number;
  fromMode?: AeroMode;
  flapBounds?: FlapBounds;
}): FlowPathSpec[] {
  const state = visualStateFor(args.mode, args.transition ?? 1, args.fromMode ?? args.mode);
  return [
    roofPath('roof-center', 0, state, 0.06, args.flapBounds),
    roofPath('roof-left', -0.54, state, 0.23, args.flapBounds),
    roofPath('roof-right', 0.54, state, 0.39, args.flapBounds),
    sidePath('side-left', -1.10, state, 0.51),
    sidePath('side-right', 1.10, state, 0.68),
    underbodyPath('under-left', -0.36, state, 0.79),
    underbodyPath('under-right', 0.36, state, 0.91),
  ];
}

export function samplePolyline(points: Vec3Tuple[], t: number): Vec3Tuple {
  if (points.length < 2) throw new Error('samplePolyline needs at least two points');
  const target = clamp01(t);
  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    const len = Math.hypot(dx, dy, dz);
    lengths.push(len);
    total += len;
  }
  if (total === 0) return [...points[0]] as Vec3Tuple;
  let remaining = target * total;
  for (let i = 0; i < lengths.length; i++) {
    const len = lengths[i];
    if (remaining <= len || i === lengths.length - 1) {
      return lerp3(points[i], points[i + 1], len === 0 ? 0 : remaining / len);
    }
    remaining -= len;
  }
  return [...points[points.length - 1]] as Vec3Tuple;
}

export function tracerT(frame: number, phaseOffset: number, speed = 0.0105): number {
  const t = frame * speed + phaseOffset;
  return ((t % 1) + 1) % 1;
}

export function transformPoint(point: Vec3Tuple, transform: CarTransform): Vec3Tuple {
  // XYZ Euler rotation, matching THREE.Euler's default order for group transforms.
  let [x, y, z] = point;
  const [rx, ry, rz] = transform.rotation;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);

  let y1 = y * cx - z * sx;
  let z1 = y * sx + z * cx;
  y = y1; z = z1;

  let x1 = x * cy + z * sy;
  let z2 = -x * sy + z * cy;
  x = x1; z = z2;

  const x2 = x * cz - y * sz;
  const y2 = x * sz + y * cz;
  x = x2; y = y2;

  return [x + transform.position[0], y + transform.position[1], z + transform.position[2]];
}

export const FORCE_ANCHORS: Vec3Tuple[] = [
  [-0.58, 1.08, 1.22],
  [0.58, 1.08, 1.22],
  [-0.62, 1.62, -1.82],
  [0.62, 1.62, -1.82],
];

export const DRAG_ANCHOR: Vec3Tuple = [0, 1.16, -2.20];
