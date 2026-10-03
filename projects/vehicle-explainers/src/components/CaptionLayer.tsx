import React from 'react';
import {spring,useCurrentFrame,useVideoConfig} from 'remotion';

export type VisualEvent={
  start:number;
  text:string;
  accent:'white'|'cyan'|'red'|'lime';
};

const colors={
  white:'#F1F4F6',
  cyan:'#00E5FF',
  red:'#FF4C4C',
  lime:'#B8DD41',
} as const;

export const CaptionLayer:React.FC<{events:readonly VisualEvent[]}> = ({events}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  let index=0;
  for(let i=0;i<events.length;i++){
    if(events[i].start<=t) index=i;
    else break;
  }
  const event=events[index];
  if(!event) return null;
  const localFrame=Math.max(0,Math.round((t-event.start)*fps));
  const punch=spring({frame:localFrame,fps,config:{damping:17,stiffness:250,mass:.52}});
  const huge=event.text==='+57 MM'||event.text==='TRACTION'||event.text==='YES.';
  const final=event.text==='911 CHARACTER';
  const size=huge?160:final?112:104;
  return <div style={{
    position:'absolute',left:55,right:55,top:825,zIndex:30,textAlign:'center',
    fontFamily:'Arial Narrow, Arial, sans-serif',fontWeight:900,fontSize:size,lineHeight:.92,
    color:colors[event.accent],textShadow:'0 5px 0 #05080B',
    transform:`scale(${.88+.12*punch})`,transformOrigin:'center center'
  }}>{event.text}</div>;
};
