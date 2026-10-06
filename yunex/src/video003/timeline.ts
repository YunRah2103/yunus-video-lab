import type {EditorialCue} from './edit/editorial';
import type {Y003CameraShotId} from './cameras/cameraContract';

export const Y003_FPS=30 as const;
export const Y003_DURATION_SECONDS=24.5 as const;
export const Y003_DURATION_FRAMES=Math.round(Y003_DURATION_SECONDS*Y003_FPS);
export const Y003_MODEL_SHA256='1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb' as const;

export const sec=(seconds:number)=>Math.round(seconds*Y003_FPS);
export const clamp01=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const t=clamp01(v);return t*t*(3-2*t);};

export type Y003ShotSegment={
  id:Y003CameraShotId;
  start:number;
  end:number;
};

export const Y003_SHOTS:readonly Y003ShotSegment[]=[
  {id:'hook-low-front',start:sec(0),end:sec(2.25)},
  {id:'trackside-pass',start:sec(2.25),end:sec(4.15)},
  {id:'brake-turn-in',start:sec(4.15),end:sec(6.35)},
  {id:'front-corner-reveal',start:sec(6.35),end:sec(9.25)},
  {id:'link-profile',start:sec(9.25),end:sec(11.15)},
  {id:'wheel-tracking',start:sec(11.15),end:sec(14.7)},
  {id:'mechanical-load',start:sec(14.7),end:sec(18.95)},
  {id:'whole-car',start:sec(18.95),end:sec(21.55)},
  {id:'exit-chase',start:sec(21.55),end:Y003_DURATION_FRAMES},
] as const;

export const shotAtFrame=(frame:number)=>{
  const segment=Y003_SHOTS.find(s=>frame>=s.start&&frame<s.end)??Y003_SHOTS[Y003_SHOTS.length-1];
  const progress=clamp01((frame-segment.start)/Math.max(1,segment.end-segment.start-1));
  return {segment,progress:smooth(progress)};
};

export const revealAtFrame=(frame:number)=>{
  const start=sec(6.35),end=sec(10.15);
  if(frame<start||frame>=end)return 0;
  const p=clamp01((frame-start)/Math.max(1,end-start-1));
  const inside=Math.min(smooth(p/0.28),smooth((1-p)/0.22));
  return clamp01(inside);
};

export const suspensionVisibilityAtFrame=(frame:number)=>{
  const enter=smooth((frame-sec(5.95))/sec(0.7));
  const exit=1-smooth((frame-sec(19.1))/sec(0.8));
  return clamp01(enter*exit);
};

export const airflowVisibilityAtFrame=(frame:number)=>{
  const enter=smooth((frame-sec(8.65))/sec(0.7));
  const exit=1-smooth((frame-sec(14.7))/sec(0.9));
  return clamp01(enter*exit);
};

export const mechanicalExposureAtFrame=(frame:number)=>{
  const enter=smooth((frame-sec(13.8))/sec(0.9));
  const exit=1-smooth((frame-sec(19.0))/sec(0.7));
  return clamp01(enter*exit);
};

export const Y003_EDITORIAL_CUES:readonly EditorialCue[]=[
  {id:'hook',phase:'hook',kind:'dominant',startFrame:sec(.08),endFrame:sec(3.24),line1:'EVEN THE SUSPENSION',line2:'HELPS MAKE DOWNFORCE',accent:'green',priority:10},
  {id:'links',phase:'profile',kind:'part-label',startFrame:sec(6.35),endFrame:sec(10.25),line1:'TEARDROP FRONT LINKS',accent:'green',anchorKey:'frontLink',preferredSide:'left',priority:8},
  {id:'airflow',phase:'airflow',kind:'part-label',startFrame:sec(8.1),endFrame:sec(10.45),line1:'CLEANER AIRFLOW',accent:'ivory',anchorKey:'airflow',preferredSide:'right',priority:9},
  {id:'load',phase:'load',kind:'dominant',startFrame:sec(14.75),endFrame:sec(18.55),line1:'CONTROL',line2:'UNDER LOAD',accent:'copper',priority:7},
] as const;

export const Y003_MILESTONE_FRAMES=[
  sec(.9),
  sec(4.8),
  sec(7.8),
  sec(10.2),
  sec(16.4),
  sec(20.1),
  sec(23.7),
] as const;
