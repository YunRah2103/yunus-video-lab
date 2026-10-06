import type {Quat, RigidPose, Vec3} from './types';

export const add3 = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const length3 = (v: Vec3) => Math.hypot(v[0], v[1], v[2]);

export const IDENTITY_QUAT: Quat = [0, 0, 0, 1];
export const IDENTITY_POSE: RigidPose = {position: [0, 0, 0], quaternion: IDENTITY_QUAT};

export const normalizeQuat = (q: Quat): Quat => {
  const n = Math.hypot(q[0], q[1], q[2], q[3]);
  if (n < 1e-9) return IDENTITY_QUAT;
  return [q[0] / n, q[1] / n, q[2] / n, q[3] / n];
};

export const rotateByQuat = (v: Vec3, input: Quat): Vec3 => {
  const [x, y, z, w] = normalizeQuat(input);
  const vx = v[0], vy = v[1], vz = v[2];
  const tx = 2 * (y * vz - z * vy);
  const ty = 2 * (z * vx - x * vz);
  const tz = 2 * (x * vy - y * vx);
  return [
    vx + w * tx + (y * tz - z * ty),
    vy + w * ty + (z * tx - x * tz),
    vz + w * tz + (x * ty - y * tx),
  ];
};

export const transformPoint = (point: Vec3, pose: RigidPose): Vec3 =>
  add3(rotateByQuat(point, pose.quaternion), pose.position);

export const axisAngleQuat = (axis: Vec3, radians: number): Quat => {
  const n = Math.max(1e-9, length3(axis));
  const s = Math.sin(radians / 2) / n;
  return normalizeQuat([axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(radians / 2)]);
};

export const multiplyQuat = (a: Quat, b: Quat): Quat => normalizeQuat([
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
]);
