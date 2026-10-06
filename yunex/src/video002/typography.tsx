import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {BeatId,timingForFrame,VIDEO002_FPS} from './timeline';

const IVORY='#f1eadc';
const COPPER='#d58e50';
const GREEN='#bddb78';

export type TypeCue={
  beat:BeatId;
  eyebrow?:string;
  line1:string;
  line2?:string;
  accent?:string;
};

export const VIDEO002_TYPE_CUES:readonly TypeCue[]=[
  {beat:'hook',line1:'THIS WING',line2:'ACTUALLY MOVES',accent:COPPER},
  {beat:'drs',line1:'LESS DRAG',line2:'MORE SPEED',accent:GREEN},
  {beat:'wholeCar',line1:'FRONT + REAR',line2:'WORK TOGETHER',accent:GREEN},
] as const;

const fade=(frame:number,start:number,end:number)=>interpolate(frame,[start,end],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

export const Video002Typography:React.FC<{debug?:boolean}>=({debug=false})=>{
  const frame=useCurrentFrame();
  const timing=timingForFrame(frame);
  const cue=VIDEO002_TYPE_CUES.find((item)=>item.beat===timing.beat.id);
  const beatStart=Math.round(timing.beat.start*VIDEO002_FPS);
  const beatEnd=Math.round(timing.beat.end*VIDEO002_FPS);
  const opacity=fade(frame,beatStart,beatStart+6)*(1-fade(frame,beatEnd-7,beatEnd));
  return <>
    {cue&&<div style={{position:'absolute',left:72,right:72,top:214,opacity,translate:`0 ${12*(1-opacity)}px`,textShadow:'0 4px 22px rgba(0,0,0,.76)',pointerEvents:'none'}}>
      {cue.eyebrow&&<div style={{fontFamily:'Arial',fontWeight:700,fontSize:19,letterSpacing:4.5,color:'rgba(241,234,220,.68)',marginBottom:10}}>{cue.eyebrow}</div>}
      <div style={{fontFamily:'Yunex',fontWeight:900,fontSize:78,lineHeight:.9,letterSpacing:-.6,color:IVORY}}>{cue.line1}</div>
      {cue.line2&&<div style={{fontFamily:'Yunex',fontWeight:900,fontSize:88,lineHeight:.92,letterSpacing:-.8,color:cue.accent??IVORY}}>{cue.line2}</div>}
    </div>}
    {debug&&<div style={{position:'absolute',left:72,bottom:96,fontFamily:'Arial',fontWeight:700,fontSize:19,letterSpacing:2.2,color:'rgba(241,234,220,.58)'}}>{timing.beat.id.toUpperCase()} · {timing.seconds.toFixed(2)}s</div>}
  </>;
};
