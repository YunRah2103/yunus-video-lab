/** Manager-owned YUNEX 004 shared API. Preserve exact P03 driving/rig semantics. */
import type {MotionState, WheelId, Vec3} from '../video003/motion/contract';

export const Y004_FPS = 30 as const;
export const Y004_DURATION_FRAMES = 720 as const;
export const Y004_PROVISIONAL_DURATION_FRAMES = Y004_DURATION_FRAMES; // backward-compatible A-F API
export const Y004_TIMING_STATUS = 'APPROVED_CEDAR_720F_30FPS' as const;
export type Y004Regime = 'low'|'high'|'hero';
export type Y004SegmentId = 'low-hook'|'rear-macro'|'low-explain'|'high-explain'|'high-drive'|'trackside-exit';

export type Y004DriveFrame = Readonly<{
  frame: number;
  timeS: number;
  segmentId: Y004SegmentId;
  /** Qualitative episode visual regime, NOT an OEM control mode or speed threshold. */
  regime: Y004Regime;
  /** One P03-compatible world-space deterministic frame containing all four steer/spin poses. */
  motion: MotionState;
  /** wheel.steerRad MUST agree with motion.wheels[id].steerRad for all four wheels. */
  steerRad: Readonly<Record<WheelId, number>>;
}>;

export type Y004CameraPose = Readonly<{
  position: Vec3;
  target: Vec3;
  focalLengthMm: number;
  near: number;
  far: number;
  /** Trackside shots must remain anchored in world space while the car moves. */
  fixedWorld: boolean;
  segmentId: Y004SegmentId;
}>;

export type Y004WheelGuide = Readonly<{
  id: string;
  wheel: WheelId;
  /** Wheel-based neutral point and actual-heading endpoints, world coordinates. */
  anchorWorld: Vec3;
  neutralEndWorld: Vec3;
  steeredEndWorld: Vec3;
  /** true if visibility/frustum/tyre silhouette permit this cue. */
  visible: boolean;
  regime: Y004Regime;
}>;
