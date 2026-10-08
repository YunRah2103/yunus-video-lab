/** Agent A — Y004 deterministic four-wheel motion API. */
export {
  Y004_SEGMENT_PLAN,
  Y004_REAR_STEER_CAP_RAD,
  y004MotionAtFrame,
  y004SegmentAtFrame,
  y004MotionAuditAtFrame,
  buildY004SegmentPlan,
} from './sampler';
export type {Y004MotionAudit, Y004SegmentPlan} from './sampler';
