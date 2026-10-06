export {
  DEFAULT_MOTION_CONFIG,
  FRONT_AXLE_Z,
  REAR_AXLE_Z,
  SOURCE_WHEEL_CENTRES,
  accelerationAtFrame,
  curvatureAtTrackZ,
  distanceAtFrame,
  motionManifest,
  motionStateAt,
  resolveMotionConfig,
  speedAtFrame,
} from './contract';
export type {
  Euler3,
  MotionConfig,
  MotionPhase,
  MotionState,
  Vec3,
  WheelId,
  WheelMotion,
} from './contract';
export {createRuntimeMotionRig} from './runtimeArticulation';
export type {RuntimeMotionRig} from './runtimeArticulation';
export {MotionProofScene} from './MotionProofScene';
export {assertMotionContract, validateMotionContract} from './qa';
export type {MotionQaResult} from './qa';
