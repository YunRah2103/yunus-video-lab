/** Final Agent H 24.000s/720f muted visual editorial aligned to approved Cedar. */
import {buildY004SegmentPlan,y004MotionAtFrame,y004SegmentAtFrame} from './motion';
import type {Y004SegmentPlan} from './motion';
import {Y004_DURATION_FRAMES,Y004_FPS} from './contracts';
import {Y004_MEASURED_NARRATION,validateY004Narration} from './audio/cues';
import {validateY004Windows} from './edit';
import type {Y004EditWindow} from './edit';

export const Y004_FINAL_FRAMES = Y004_DURATION_FRAMES;
export const Y004_PROVISIONAL_FRAMES = Y004_FINAL_FRAMES; // compatibility alias
export const Y004_TIMING_LOCK = 'APPROVED_CEDAR_22_704S_720F_30FPS' as const;
export const Y004_SHOTS:ReadonlyArray<Y004SegmentPlan> = buildY004SegmentPlan(Y004_FINAL_FRAMES);
export const Y004_EDIT_WINDOWS:readonly Y004EditWindow[] = Y004_SHOTS.map(s=>({
 segmentId:s.id,startFrame:s.frameStart,endFrame:s.frameEndExclusive,
}));
export const verifyY004FinalEdit=():void=>{
 if(Y004_FINAL_FRAMES!==720||Y004_FPS!==30)throw new Error('Wrong locked Y004 duration');
 validateY004Narration(Y004_MEASURED_NARRATION);
 validateY004Windows(Y004_EDIT_WINDOWS,Y004_FINAL_FRAMES);
 const bounds=[0,84,150,333,432,567,720];
 for(let i=0;i<Y004_EDIT_WINDOWS.length;i++)
  if(Y004_EDIT_WINDOWS[i].startFrame!==bounds[i]||Y004_EDIT_WINDOWS[i].endFrame!==bounds[i+1])
   throw new Error('Shot edit out of lock at '+i);
 const [s1,s2,s3,s4,s5]=Y004_MEASURED_NARRATION.sentences;
 const high=333/Y004_FPS,driving=432/Y004_FPS,exit=567/Y004_FPS;
 if(!(s1.endSeconds<84/Y004_FPS &&
   s2.endSeconds<high && high<s3.startSeconds &&
   s3.endSeconds<driving && driving<s4.startSeconds &&
   s4.endSeconds<exit && Math.abs(exit-s5.startSeconds)<0.1))
   throw new Error('Y004 steering/edit cut overlaps the real Cedar sentence');
};
verifyY004FinalEdit();
export const y004FrameState=(frame:number,frames=Y004_FINAL_FRAMES)=>{
 const segment=y004SegmentAtFrame(frame,frames);
 return {motion:y004MotionAtFrame(frame,frames),
  segment,progress:(frame-segment.frameStart)/(segment.frameEndExclusive-segment.frameStart)};
};
