import {axisAngleQuat, multiplyQuat} from './math';
import {FRONT_WHEEL_CENTRES} from './topology';
import type {FrontSuspensionState, Quat, Side, Vec3} from './types';

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const neutralSuspensionState = (): FrontSuspensionState => ({
  chassis: {position: [0, 0, 0], quaternion: [0, 0, 0, 1]},
  FL: {wheelCenter: [...FRONT_WHEEL_CENTRES.FL] as Vec3, quaternion: [0, 0, 0, 1]},
  FR: {wheelCenter: [...FRONT_WHEEL_CENTRES.FR] as Vec3, quaternion: [0, 0, 0, 1]},
});

const uprightQuat = (side: Side, steer: number, bump: number): Quat => {
  const steerQ = axisAngleQuat([0, 1, 0], steer);
  const camberSign = side === 'FL' ? -1 : 1;
  const camberQ = axisAngleQuat([0, 0, 1], camberSign * bump * 0.18);
  return multiplyQuat(steerQ, camberQ);
};

/**
 * Isolated proof fixture only. Manager/A contract supersedes these values.
 */
export const fixtureStateAtFrame = (frame: number, fps = 30): FrontSuspensionState => {
  const t = frame / Math.max(1, fps);
  const phase = Math.sin(t * Math.PI * 0.72);
  const steer = clamp(Math.sin(t * Math.PI * 0.55) * 0.18, -0.20, 0.20);
  const bumpLeft = 0.028 * Math.max(0, phase);
  const bumpRight = 0.012 * Math.max(0, -phase);
  const base = neutralSuspensionState();
  return {
    chassis: {
      position: [0, -0.004 * Math.max(0, phase), 0],
      quaternion: axisAngleQuat([1, 0, 0], -0.006 * Math.max(0, phase)),
    },
    FL: {
      wheelCenter: add(base.FL.wheelCenter, [0, bumpLeft, 0]),
      quaternion: uprightQuat('FL', steer, bumpLeft),
    },
    FR: {
      wheelCenter: add(base.FR.wheelCenter, [0, bumpRight, 0]),
      quaternion: uprightQuat('FR', steer, bumpRight),
    },
  };
};
