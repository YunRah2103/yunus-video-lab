export const VIDEO002_FPS = 30;
export const VIDEO002_DURATION_SECONDS = 25.02;
export const VIDEO002_DURATION_FRAMES = Math.round(VIDEO002_DURATION_SECONDS * VIDEO002_FPS);

export type AeroMode = 'highDownforce' | 'drs' | 'airbrake';
export type BeatId = 'hook' | 'isolate' | 'highDownforce' | 'drs' | 'airbrake' | 'wholeCar' | 'payoff';

export type Video002Beat = {
  id: BeatId;
  start: number;
  end: number;
  mode: AeroMode;
  transitionSeconds: number;
  purpose: string;
};

export const VIDEO002_BEATS: readonly Video002Beat[] = [
  {id:'hook',start:0,end:2.4,mode:'highDownforce',transitionSeconds:.8,purpose:'Immediate rear-flap motion on the track hero.'},
  {id:'isolate',start:2.4,end:5.5,mode:'highDownforce',transitionSeconds:.55,purpose:'Fixed main plane versus moving upper flap.'},
  {id:'highDownforce',start:5.5,end:9.5,mode:'highDownforce',transitionSeconds:.7,purpose:'Grip/load state with qualitative airflow.'},
  {id:'drs',start:9.5,end:13.5,mode:'drs',transitionSeconds:.8,purpose:'Continuous DRS transition, then readable settled state.'},
  {id:'airbrake',start:13.5,end:18,mode:'airbrake',transitionSeconds:.75,purpose:'High-speed braking; front and rear move to maximum aero.'},
  {id:'wholeCar',start:18,end:22,mode:'highDownforce',transitionSeconds:.8,purpose:'Front and rear coordination shown together.'},
  {id:'payoff',start:22,end:VIDEO002_DURATION_SECONDS,mode:'drs',transitionSeconds:.8,purpose:'Moving accelerating payoff; effects fade to subtle YUNEX.'},
] as const;

const clamp01=(v:number)=>Math.max(0,Math.min(1,v));

export const secondsToFrame=(seconds:number)=>Math.round(seconds*VIDEO002_FPS);
export const frameToSeconds=(frame:number)=>frame/VIDEO002_FPS;

export function beatForSeconds(seconds:number):Video002Beat {
  const safe=Math.max(0,Math.min(VIDEO002_DURATION_SECONDS-1/VIDEO002_FPS,seconds));
  return VIDEO002_BEATS.find((beat)=>safe>=beat.start&&safe<beat.end) ?? VIDEO002_BEATS[VIDEO002_BEATS.length-1];
}

export function timingForFrame(frame:number) {
  const safeFrame=Math.max(0,Math.min(VIDEO002_DURATION_FRAMES-1,Math.floor(frame)));
  const seconds=frameToSeconds(safeFrame);
  const beat=beatForSeconds(seconds);
  const duration=Math.max(1/VIDEO002_FPS,beat.end-beat.start);
  const progress=clamp01((seconds-beat.start)/duration);
  const transition=clamp01((seconds-beat.start)/Math.max(1/VIDEO002_FPS,beat.transitionSeconds));
  return {frame:safeFrame,seconds,beat,progress,transition,mode:beat.mode};
}
