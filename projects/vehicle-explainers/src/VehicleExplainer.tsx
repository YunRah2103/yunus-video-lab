import React from 'react';
import {AbsoluteFill,Sequence,useVideoConfig} from 'remotion';
import type {porscheEpisode} from './data/episode001';
import {CaptionLayer} from './components/CaptionLayer';
import {ModeFrame} from './components/ModeFrame';

type Episode=typeof porscheEpisode;
export const VehicleExplainer:React.FC<{episode:Episode}> = ({episode}) => {
  const {fps}=useVideoConfig();
  return <AbsoluteFill style={{background:'#070C11'}}>
    {episode.beats.map((beat,i)=>{
      const from=Math.round(beat.start*fps); const duration=Math.max(1,Math.round((beat.end-beat.start)*fps));
      return <Sequence key={i} from={from} durationInFrames={duration}><ModeFrame beat={beat}/></Sequence>;
    })}
    <CaptionLayer events={episode.visualEvents}/>
  </AbsoluteFill>;
};
