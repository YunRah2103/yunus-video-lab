import {add3, axisAngleQuat, multiplyQuat} from './math';
import type {FrontSuspensionState, Vec3} from './types';

export type MotionFrontWheelLike = {
  centreLocal: Vec3;
  steerRad: number;
  uprightOffsetY: number;
};

export type MotionContractLike = {
  chassis: {
    pitchRad: number;
    rollRad: number;
    heaveM: number;
  };
  wheels: {
    FL: MotionFrontWheelLike;
    FR: MotionFrontWheelLike;
  };
};

/**
 * Structural adapter for Agent A's published MotionState shape.
 * Output stays in Porsche car-local coordinates. Manager applies the A root/world
 * transform exactly once around the car + B suspension group.
 */
export const frontSuspensionStateFromMotion = (
  motion: MotionContractLike,
): FrontSuspensionState => {
  const pitch = axisAngleQuat([1, 0, 0], motion.chassis.pitchRad);
  const roll = axisAngleQuat([0, 0, 1], motion.chassis.rollRad);
  const wheelPose = (wheel: MotionFrontWheelLike) => ({
    wheelCenter: add3(wheel.centreLocal, [0, wheel.uprightOffsetY, 0]),
    quaternion: axisAngleQuat([0, 1, 0], wheel.steerRad),
  });
  return {
    chassis: {
      position: [0, motion.chassis.heaveM, 0],
      quaternion: multiplyQuat(pitch, roll),
    },
    FL: wheelPose(motion.wheels.FL),
    FR: wheelPose(motion.wheels.FR),
  };
};
