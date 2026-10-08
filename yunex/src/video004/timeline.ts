/** Manager-owned. PROVISIONAL 720 frames until the actual Y004 voice take is measured. */
import {buildY004SegmentPlan, y004MotionAtFrame, y004SegmentAtFrame} from './motion';
import type {Y004SegmentPlan} from './motion';
import {Y004_PROVISIONAL_DURATION_FRAMES} from './contracts';
import type {Y004EditWindow} from './edit';
export const Y004_PROVISIONAL_FRAMES = Y004_PROVISIONAL_DURATION_FRAMES;
export const Y004_TIMING_LOCK = 'UNLOCKED_NARRATION_REQUIRED' as const;
export const Y004_SHOTS: ReadonlyArray<Y004SegmentPlan> = buildY004SegmentPlan(Y004_PROVISIONAL_FRAMES);
export const Y004_EDIT_WINDOWS: readonly Y004EditWindow[] = Y004_SHOTS.map(s=>({
 segmentId:s.id,startFrame:s.frameStart,endFrame:s.frameEndExclusive,
}));
export const y004FrameState=(frame:number,frames=Y004_PROVISIONAL_FRAMES)=>{
 const segment=y004SegmentAtFrame(frame,frames);
 const duration=segment.frameEndExclusive-segment.frameStart;
 return {
  motion:y004MotionAtFrame(frame,frames),
  segment,
  progress:(frame-segment.frameStart)/duration,
 };
};
