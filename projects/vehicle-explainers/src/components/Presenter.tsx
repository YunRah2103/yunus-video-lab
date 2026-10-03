import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const Presenter:React.FC<{pose:string; scale?:number; x?:number; y?:number}> = ({pose,scale=1,x=0,y=0}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const bob=Math.sin(frame/fps*2.3)*5;
  const breathing=1+Math.sin(frame/fps*1.7)*0.012;
  return <Img src={staticFile(`presenter/${pose}.png`)} style={{position:'absolute',width:620,transform:`translate(${x}px, ${y+bob}px) scale(${scale*breathing})`,transformOrigin:'center bottom'}}/>;
};
