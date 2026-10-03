import React from 'react';
import {spring,useCurrentFrame,useVideoConfig} from 'remotion';

const palette={cyan:'#00E5FF',lime:'#A5C93A',red:'#FF4A4A',white:'#F1F4F6'} as const;
export const KineticCaption:React.FC<{text:string; accent?:keyof typeof palette; size?:number}> = ({text,accent='white',size=126}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const s=spring({frame,fps,config:{damping:18,stiffness:220,mass:.6}});
  return <div style={{fontFamily:'Arial Narrow, sans-serif',fontWeight:900,fontSize:size,lineHeight:.92,textAlign:'center',color:palette[accent],transform:`scale(${0.92+0.08*s})`,textShadow:'0 5px 0 #071014'}}>{text}</div>;
};
