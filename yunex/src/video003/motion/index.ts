export {
  DEFAULT_MOTION_CONFIG,
  FRONT_AXLE_Z,
  REAR_AXLE_Z,
  SOURCE_WHEEL_CENTRES,
  STEERING_CURVATURE_HALF_WINDOW_M,
  accelerationAtFrame,
  curvatureAtTrackZ,
  distanceAtFrame,
  motionManifest,
  motionStateAt,
  resolveMotionConfig,
  speedAtFrame,
  steeringCurvatureAtTrackZ,
  steeringForCurvature,
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
export type {
  RuntimeMotionRig,
  RuntimeMotionRigOptions,
} from './runtimeArticulation';
export {MotionProofScene} from './MotionProofScene';
export {PolishWheelProofScene} from './PolishWheelProofScene';
export type {P02WheelProofVariant} from './PolishWheelProofScene';
export {
  assertMotionContract,
  validateMotionContract,
  validateRuntimeWheelRigKinematics,
} from './qa';
export type {MotionQaResult, RuntimeWheelRigQa} from './qa';
