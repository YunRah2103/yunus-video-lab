import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill,staticFile,useCurrentFrame} from 'remotion';
import {timingForFrame} from './timeline';
import {Video002Typography} from './typography';
import {VIDEO002_AUDIO} from './audio';

export type Video002SceneProps=ReturnType<typeof timingForFrame>;
export type Video002SceneComponent=React.ComponentType<Video002SceneProps>;

const FallbackScene:Video002SceneComponent=({beat,seconds})=><AbsoluteFill style={{background:'radial-gradient(ellipse at 58% 44%,#252a2b 0%,#111516 56%,#090c0e 100%)'}}>
  <div style={{position:'absolute',left:72,right:72,top:122,height:1,background:'rgba(241,234,220,.16)'}}/>
  <div style={{position:'absolute',left:72,bottom:122,fontFamily:'Arial',fontSize:18,letterSpacing:2.4,color:'rgba(241,234,220,.42)'}}>D CHRONOLOGY PROOF · A/B/C LIVE 3D NOT INTEGRATED · {beat.id.toUpperCase()} · {seconds.toFixed(2)}s</div>
</AbsoluteFill>;

export type EditAudioCompositionProps={
  Scene?:Video002SceneComponent;
  includeAudio?:boolean;
  audioSrc?:string;
  debugTypography?:boolean;
};

export const EditAudioComposition:React.FC<EditAudioCompositionProps>=({Scene=FallbackScene,includeAudio=true,audioSrc=VIDEO002_AUDIO.proofMix,debugTypography=false})=>{
  const frame=useCurrentFrame();
  const timing=timingForFrame(frame);
  return <AbsoluteFill style={{background:'#0d1011',overflow:'hidden'}}>
    <style>{`@font-face{font-family:Yunex;src:url('${staticFile('Display.ttf')}')}*{box-sizing:border-box}`}</style>
    <Scene {...timing}/>
    <Video002Typography debug={debugTypography}/>
    <div style={{position:'absolute',right:56,bottom:50,fontFamily:'Yunex',fontSize:25,letterSpacing:5,color:'#f1eadc',opacity:timing.beat.id==='payoff'?.8:.18}}>YUNEX</div>
    {includeAudio&&<Audio src={staticFile(audioSrc)}/>}
  </AbsoluteFill>;
};
