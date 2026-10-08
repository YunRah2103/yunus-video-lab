import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {Yunex004Visual} from './Video004';

/** Deterministic finishing edits. Cache mode reuses the exact approved H plates;
 * live mode preserves the fully editable Three.js/Remotion source. */
export const Yunex004Release: React.FC<{variant:'cinematic'|'dynamic';cached:boolean}> = ({variant,cached}) => {
 const frame=useCurrentFrame();
 const dynamic=variant==='dynamic';
 const opening=dynamic&&frame<84;
 const roadside=dynamic&&frame>=432&&frame<567;
 const width=opening?1188:roadside?1232:1080;
 const height=opening?2112:roadside?2190:1920;
 const left=roadside?-76:0,top=roadside?-135:0;
 const accent=dynamic&&((frame>=18&&frame<=76)||(frame>=96&&frame<=140)||(frame>=163&&frame<=318)||(frame>=346&&frame<=416));
 return <AbsoluteFill style={{background:'#0d1011',overflow:'hidden'}}>
  <div style={{position:'absolute',width,height,left,top}}>
   <div style={{width:1080,height:1920,transform:`scale(${width/1080},${height/1920})`,transformOrigin:'top left'}}>
    {cached?<OffthreadVideo src={staticFile('y004-release/approved-visual.mp4')} muted/>:<Yunex004Visual/>}
   </div>
  </div>
  {accent&&<div style={{position:'absolute',left:72,top:320,width:180,height:5,background:'#bddb78'}}/>}
  {dynamic&&frame>=675&&frame<=714&&<div style={{position:'absolute',left:870,top:1840,width:90,height:3,background:'#bddb78'}}/>}
  <Audio src={staticFile('y004-release/approved-audio.m4a')}/>
 </AbsoluteFill>;
};
