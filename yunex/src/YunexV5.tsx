import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill,Img,OffthreadVideo,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {ModelLedVideo,project,stateFor} from './ModelLedVideo';
import * as THREE from 'three';

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};

const TrackTitle:React.FC<{kind:'opening'|'final'}>=({kind})=>{
  const frame=useCurrentFrame();
  const local=kind==='opening'?frame:frame-675;
  const enter=kind==='opening'?1:smooth(local/10);
  const exit=kind==='opening'?1-smooth((frame-48)/10):1-smooth((frame-816)/12);
  return <div style={{position:'absolute',top:kind==='opening'?214:104,left:72,right:72,textAlign:'center',opacity:enter*exit,translate:`0 ${12*(1-enter)}px`,textShadow:'0 2px 6px rgba(0,0,0,.86)'}}>
    <div style={{fontFamily:'Arial',fontWeight:800,fontSize:19,letterSpacing:4.8,color:'rgba(241,234,220,.86)',marginBottom:11}}>{kind==='opening'?'THE REAR-ENGINE PARADOX':'THE RESULT'}</div>
    <div style={{fontFamily:'Yunex',fontWeight:900,fontSize:70,lineHeight:.88,color:'#f1eadc'}}>{kind==='opening'?'PORSCHE NEVER':'UNMISTAKABLY'}</div>
    <div style={{fontFamily:'Yunex',fontWeight:900,fontSize:78,lineHeight:.94,color:'#d58e50'}}>{kind==='opening'?'FIXED THIS.':'911.'}</div>
  </div>;
};

export const YunexV5:React.FC=()=>{
  const frame=useCurrentFrame();
  const openingOpacity=1-smooth((frame-52)/8);
  const finalOpacity=smooth((frame-675)/8);
  const openingMove=smooth(frame/59);
  const finalMove=smooth((frame-675)/152);
  return <AbsoluteFill style={{background:'#aebfc2',overflow:'hidden'}}>
    <style>{`@font-face{font-family:Yunex;src:url('${staticFile('Display.ttf')}')}*{box-sizing:border-box}`}</style>
    {frame>=52&&frame<683&&<ModelLedVideo includeAudio={false} trackMode/>}
    <Sequence from={0} durationInFrames={75} layout="absolute-fill">
      <AbsoluteFill style={{opacity:openingOpacity,overflow:'hidden'}}><Img src={staticFile('v4-track-opening-clean.png')} style={{width:'100%',height:'100%',objectFit:'cover',scale:1.018-.018*openingMove,translate:`${-5+5*openingMove}px ${-8+8*openingMove}px`}}/></AbsoluteFill>
    </Sequence>
    <Sequence from={675} durationInFrames={153} layout="absolute-fill">
      <AbsoluteFill style={{opacity:finalOpacity,overflow:'hidden'}}><Img src={staticFile('v4-track-final-clean.png')} style={{width:'100%',height:'100%',objectFit:'cover',scale:1+.018*finalMove,translate:`${-7*finalMove}px ${-9*finalMove}px`}}/></AbsoluteFill>
    </Sequence>
    {frame<60&&<TrackTitle kind="opening"/>}
    {frame>=675&&<TrackTitle kind="final"/>}
    {frame>=675&&<div style={{position:'absolute',right:56,bottom:52,fontFamily:'Yunex',fontSize:25,letterSpacing:5,color:'#f1eadc',opacity:.24+.76*smooth((frame-770)/40),textShadow:'0 3px 12px rgba(0,0,0,.72)'}}>YUNEX</div>}
    <Audio src={staticFile('vo.wav')}/><Audio src={staticFile('sound.wav')} volume={.42}/>
  </AbsoluteFill>;
};

export const YunexV5Final:React.FC=()=>{
  const frame=useCurrentFrame();
  const state=stateFor(frame);
  const enginePoint=project(new THREE.Vector3(0,.47,-1.78),state);
  const biasOpacity=frame>=165&&frame<255?smooth((frame-165)/13)*(1-smooth((frame-240)/15)):0;
  const openingMove=smooth(frame/59);
  const finalMove=smooth((frame-675)/152);
  return <AbsoluteFill style={{background:'#aebfc2',overflow:'hidden'}}>
    <style>{`@font-face{font-family:Yunex;src:url('${staticFile('Display.ttf')}')}*{box-sizing:border-box}`}</style>
    <OffthreadVideo src={staticFile('v5-review.mp4')} style={{width:'100%',height:'100%'}}/>
    {frame<60&&<AbsoluteFill style={{overflow:'hidden'}}><Img src={staticFile('v4-track-opening-clean.png')} style={{width:'100%',height:'100%',objectFit:'cover',scale:1.018-.018*openingMove,translate:`${-5+5*openingMove}px ${-8+8*openingMove}px`}}/></AbsoluteFill>}
    {frame>=675&&<AbsoluteFill style={{overflow:'hidden'}}><Img src={staticFile('v4-track-final-clean.png')} style={{width:'100%',height:'100%',objectFit:'cover',scale:1+.018*finalMove,translate:`${-7*finalMove}px ${-9*finalMove}px`}}/></AbsoluteFill>}
    {frame<60&&<TrackTitle kind="opening"/>}
    {frame>=675&&<TrackTitle kind="final"/>}
    {biasOpacity>0&&<div style={{position:'absolute',top:Math.min(1600,enginePoint.y+138),left:Math.max(70,Math.min(720,enginePoint.x-170)),width:340,textAlign:'center',fontFamily:'Yunex',fontSize:40,letterSpacing:2,color:'#d58e50',opacity:biasOpacity,textShadow:'0 3px 14px #000'}}>REAR WEIGHT BIAS</div>}
    {frame>=675&&<div style={{position:'absolute',right:56,bottom:52,fontFamily:'Yunex',fontSize:25,letterSpacing:5,color:'#f1eadc',opacity:.24+.76*smooth((frame-770)/40),textShadow:'0 3px 12px rgba(0,0,0,.72)'}}>YUNEX</div>}
  </AbsoluteFill>;
};
