import type {Y004MeasuredNarration} from './cues';
import {y004NarrationActivity01} from './cues';

export type Y004AudioMotionInput = Readonly<{
  seconds: number;
  speedMps: number;
  accelerationMps2?: number;
  cornerLoad01?: number;
  cameraDistanceM?: number;
  tracksidePass01?: number;
  narration?: Y004MeasuredNarration;
}>;
export type Y004AudioEnvelope = Readonly<{
  engineDb: number;
  roadDb: number;
  windDb: number;
  passDb: number;
  speechDuckDb: number;
}>;
const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
const lerp=(a:number,b:number,t:number)=>a+(b-a)*clamp01(t);

/** Engine/road/pass cues consume A's motion speed and C's camera distance; no hardcoded speed regimes. */
export function y004AudioEnvelope(input:Y004AudioMotionInput):Y004AudioEnvelope {
  if(!Number.isFinite(input.seconds)||!Number.isFinite(input.speedMps)||input.speedMps<0)
    throw new Error('Y004 sound requires finite time and nonnegative motion speed');
  const speed=clamp01(input.speedMps/58);
  const load=clamp01(Math.max(Math.abs(input.accelerationMps2??0)/6,input.cornerLoad01??0));
  const distance=Math.max(1.5,input.cameraDistanceM??6);
  if(!Number.isFinite(distance)||!Number.isFinite(load))throw new Error('Invalid sound camera/load input');
  const attenuation=clamp01((distance-3)/18)*13;
  const duckDb=-8*y004NarrationActivity01(input.seconds,input.narration);
  return {
    engineDb:lerp(-38,-21,speed)+2.5*load-attenuation+duckDb,
    roadDb:lerp(-47,-29,speed)-attenuation*.55+duckDb,
    windDb:lerp(-53,-34,speed)-attenuation*.33+duckDb,
    passDb:-60+31*clamp01(input.tracksidePass01??0)-attenuation*.25+duckDb,
    speechDuckDb:duckDb,
  };
}
