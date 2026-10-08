import type {Vec3} from '../../video003/motion/contract';
import type {Y004CameraPose, Y004DriveFrame, Y004SegmentId} from '../contracts';
import {
  sampleTrackAtLocalZ,
  trackLocalToWorldXZ,
  TRACK_ASPHALT_LOCAL_Y,
  TRACK_LAYOUT_CONFIG,
} from '../../video002/trackUpgrade/racetrack/layout';

/**
 * Y004 optical contract: all coordinates are world-space metres, +Y up.
 * A moving camera uses one sampled state; it must never apply TrackWorld root
 * to the already-world-space state.motion.root a second time.
 * Matches must use the very same spec in both low/high modes.
 */
type CameraSpec = Readonly<{
  from: Vec3; to: Vec3;
  lookFrom: Vec3; lookTo: Vec3;
  lensFrom: number; lensTo: number;
  near: number; far: number;
}>;
const MATCHED: CameraSpec = {
  from: [7.35, 5.15, -8.80], to: [7.10, 5.12, -8.62],
  lookFrom: [0, 0.55, 0.08], lookTo: [0, 0.54, 0.16],
  lensFrom: 34, lensTo: 35, near: 0.07, far: 230,
};
const SPECS: Record<Exclude<Y004SegmentId, 'trackside-exit'>, CameraSpec> = {
  'low-hook': {
    from: [4.45, 1.32, -6.15], to: [4.08, 1.19, -5.58],
    lookFrom: [0.64, 0.49, -1.08], lookTo: [0.70, 0.46, -0.89],
    lensFrom: 32, lensTo: 35, near: 0.07, far: 200,
  },
  'rear-macro': {
    from: [2.70, 0.89, -3.37], to: [2.53, 0.81, -3.01],
    lookFrom: [0.78, 0.38, -1.20], lookTo: [0.78, 0.38, -1.13],
    lensFrom: 40, lensTo: 44, near: 0.045, far: 160,
  },
  'low-explain': MATCHED,
  'high-explain': MATCHED,
  'high-drive': {
    from: [6.25, 1.93, -4.74], to: [5.82, 1.74, -5.75],
    lookFrom: [0.06, 0.59, 0.14], lookTo: [0.02, 0.59, 0.46],
    lensFrom: 30, lensTo: 33, near: 0.07, far: 220,
  },
};
export const Y004_EXIT_EDITORIAL_CUT_PROGRESS = 0.54 as const;
/** Manager should stage the first half of exit close to this track Z. Not a
 * camera-local/car-relative position. Validate the actual A shot-local run. */
export const Y004_FIXED_EXIT_TRACK_Z = 85 as const;
const EXIT_CHASE: CameraSpec = {
  from: [4.90, 1.73, -7.70], to: [4.58, 1.78, -9.05],
  lookFrom: [0, 0.63, 0.16], lookTo: [0, 0.68, 0.65],
  lensFrom: 31, lensTo: 33, near: 0.08, far: 230,
};
const saturate = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (v: number) => {
  const t = saturate(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const lerp3 = (a: Vec3, b: Vec3, p: number): Vec3 => [
  lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p),
];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
export const y004RotateLocalVector = (v: Vec3, yaw: number): Vec3 => {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c];
};
const trackingPose = (
  state: Y004DriveFrame, spec: CameraSpec, progress: number,
): Y004CameraPose => {
  const t = smooth(progress);
  const origin = state.motion.root.position;
  const yaw = state.motion.root.rotation[1];
  return {
    position: add(origin, y004RotateLocalVector(lerp3(spec.from, spec.to, t), yaw)),
    target: add(origin, y004RotateLocalVector(lerp3(spec.lookFrom, spec.lookTo, t), yaw)),
    focalLengthMm: lerp(spec.lensFrom, spec.lensTo, t),
    near: spec.near, far: spec.far, fixedWorld: false,
    segmentId: state.segmentId,
  };
};
const fixedTracksidePosition = (): Vec3 => {
  const sample = sampleTrackAtLocalZ(Y004_FIXED_EXIT_TRACK_Z);
  const [x,z] = trackLocalToWorldXZ(sample.center);
  // The approved root transform is already baked into trackLocalToWorldXZ.
  const yaw = Math.atan2(-sample.tangent[0], -sample.tangent[1]);
  const asphalt = TRACK_LAYOUT_CONFIG.rootPosition[1] + TRACK_ASPHALT_LOCAL_Y;
  return add([x, asphalt, z], y004RotateLocalVector([6.1, 1.44, -0.45], yaw));
};
const FIXED_TRACKSIDE_POSITION = fixedTracksidePosition();
export const resolveY004CameraPose = (
  state: Y004DriveFrame, shotProgress: number,
): Y004CameraPose => {
  if (!Number.isFinite(shotProgress) || shotProgress < 0 || shotProgress > 1) {
    throw new Error('Y004 shotProgress must be finite and within [0, 1].');
  }
  if (state.segmentId !== 'trackside-exit') {
    const spec = SPECS[state.segmentId];
    if (!spec) throw new Error('Unknown Y004 segment: ' + String(state.segmentId));
    return trackingPose(state, spec, shotProgress);
  }
  if (shotProgress >= Y004_EXIT_EDITORIAL_CUT_PROGRESS) {
    // Manager MUST place a real editorial cut at this boundary; not a
    // fictitious floating camera transition from fixed tripod to chase.
    return trackingPose(
      state, EXIT_CHASE,
      (shotProgress - Y004_EXIT_EDITORIAL_CUT_PROGRESS) /
        (1 - Y004_EXIT_EDITORIAL_CUT_PROGRESS),
    );
  }
  const root = state.motion.root;
  return {
    position: [...FIXED_TRACKSIDE_POSITION] as Vec3,
    target: add(root.position, y004RotateLocalVector([0,0.57,0], root.rotation[1])),
    focalLengthMm: 38, near: 0.08, far: 230,
    fixedWorld: true, segmentId: state.segmentId,
  };
};
/** 24 mm virtual sensor HEIGHT. 9:16 composition reduces horizontal coverage. */
export const y004VerticalFovDegrees = (focalMm: number): number =>
  2 * Math.atan(12 / focalMm) * 180 / Math.PI;

const subtract = (a: Vec3, b: Vec3): Vec3 => [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0],
];
const dot = (a: Vec3, b: Vec3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const normalize = (v: Vec3): Vec3 => {
  const d = Math.hypot(...v);
  return d > 1e-10 ? [v[0]/d, v[1]/d, v[2]/d] : [0, 0, 0];
};
/** Normalized film screen coordinates: 0 centre, +/-1 on image edges. */
export const projectY004WorldToPortrait = (point: Vec3, camera: Y004CameraPose) => {
  const forward = normalize(subtract(camera.target, camera.position));
  const right = normalize(cross(forward, [0,1,0]));
  const up = cross(right, forward);
  const rel = subtract(point, camera.position);
  const depth = dot(rel, forward);
  const verticalTan = 12/camera.focalLengthMm;
  const horizontalTan = verticalTan * (1080/1920);
  if (depth <= camera.near) return {x: Infinity,y: Infinity,depth,inFront: false};
  const x = dot(rel,right)/(depth*horizontalTan);
  const y = dot(rel,up)/(depth*verticalTan);
  return {x,y,depth,inFront: depth < camera.far};
};
export const auditY004CameraPose = (pose: Y004CameraPose) => {
  const issues: string[] = [];
  const values = [...pose.position,...pose.target,pose.focalLengthMm,pose.near,pose.far];
  if (!values.every(Number.isFinite)) issues.push('non-finite camera');
  if (pose.position[1] < 0.13) issues.push('camera under or very near asphalt');
  const d = Math.hypot(...subtract(pose.position,pose.target));
  if (d <= Math.max(0.7, pose.near*6)) issues.push('camera too close to target');
  if (pose.focalLengthMm < 24 || pose.focalLengthMm > 70) issues.push('focal length out of bounds');
  if (pose.near < 0.025 || pose.far < 100 || pose.far <= pose.near) {
    issues.push('invalid near/far clipping');
  }
  return {ok: issues.length===0, issues, distanceToTargetM: d};
};
