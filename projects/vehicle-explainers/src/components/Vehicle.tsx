import React from 'react';
import {Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
export const Vehicle:React.FC<{variant?:'modern'|'classic';scale?:number;rotate?:number}> = ({variant='modern',scale=1,rotate=0}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig(); const pulse=1+Math.sin(f/fps*1.8)*.01;
  return <Img src={staticFile(`vehicles/${variant==='modern'?'911-side.svg':'911-classic-side.svg'}`)} style={{width:850,transform:`scale(${scale*pulse}) rotate(${rotate}deg)`}}/>;
};
