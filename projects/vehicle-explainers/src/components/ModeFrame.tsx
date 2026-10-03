import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Beat} from '../data/episode001';
import {Presenter} from './Presenter';
import {TechnicalOverlay} from './TechnicalOverlay';
import {Vehicle} from './Vehicle';

const Headline:React.FC<{text:string;accent?:Beat['accent'];top?:number;size?:number}> = ({text,accent,top=700,size=88}) => <div style={{position:'absolute',top,left:55,right:55,textAlign:'center',font:`900 ${size}px/0.95 Arial Narrow, Arial`,color:accent==='red'?'#FF4A4A':accent==='lime'?'#A5C93A':accent==='cyan'?'#00E5FF':'#F1F4F6',textShadow:'0 5px 0 #05080B'}}>{text}</div>;

export const ModeFrame:React.FC<{beat:Beat}> = ({beat}) => {
  const common=<><div style={{position:'absolute',inset:0,opacity:.12,backgroundImage:'linear-gradient(#23313a 1px,transparent 1px),linear-gradient(90deg,#23313a 1px,transparent 1px)',backgroundSize:'135px 135px'}}/><div style={{position:'absolute',left:56,top:42,width:185,height:6,background:'#00E5FF'}}/><div style={{position:'absolute',left:56,top:60,font:'700 26px Arial',color:'#9FB0B8'}}>PACKET GUY // MACHINES</div></>;
  if(beat.mode==='statistic') return <AbsoluteFill style={{background:'#070C11',overflow:'hidden'}}>{common}<div style={{position:'absolute',top:250,left:0,right:0,display:'flex',justifyContent:'center'}}><Vehicle variant={beat.vehicle} scale={.72}/></div><Headline text={beat.caption} accent={beat.accent} top={690} size={168}/><Presenter pose={beat.pose} scale={.58} x={270} y={1190}/><TechnicalOverlay visual={beat.visual}/></AbsoluteFill>;
  if(beat.mode==='reaction') return <AbsoluteFill style={{background:'#070C11',overflow:'hidden'}}>{common}<div style={{position:'absolute',top:260,right:-60}}><Vehicle variant={beat.vehicle} scale={.7}/></div><Presenter pose={beat.pose} scale={1.02} x={-40} y={930}/><Headline text={beat.caption} accent={beat.accent} top={590} size={104}/><TechnicalOverlay visual={beat.visual}/></AbsoluteFill>;
  if(beat.mode==='comparison') return <AbsoluteFill style={{background:'#070C11',overflow:'hidden'}}>{common}<div style={{position:'absolute',top:300,left:-150}}><Vehicle variant="classic" scale={.62}/></div><div style={{position:'absolute',top:300,right:-150}}><Vehicle variant="modern" scale={.62}/></div><Headline text={beat.caption} accent={beat.accent} top={655} size={140}/><Presenter pose={beat.pose} scale={.55} x={280} y={1190}/><TechnicalOverlay visual={beat.visual}/></AbsoluteFill>;
  if(beat.mode==='hero') return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 42%,#1B2429 0,#070C11 60%)',overflow:'hidden'}}>{common}<div style={{position:'absolute',top:360,left:-40,right:-40,display:'flex',justifyContent:'center'}}><Vehicle variant="modern" scale={1.18}/></div><Headline text={beat.caption} accent="cyan" top={900} size={98}/></AbsoluteFill>;
  const technical=beat.mode==='technical';
  return <AbsoluteFill style={{background:'#070C11',overflow:'hidden'}}>{common}<div style={{position:'absolute',top:technical?250:230,left:0,right:0,display:'flex',justifyContent:'center'}}><Vehicle variant={beat.vehicle} scale={technical ? .9 : 1}/></div><Headline text={beat.caption} accent={beat.accent} top={technical?690:720} size={technical?78:90}/><Presenter pose={beat.pose} scale={technical ? .62 : .72} x={technical?100:235} y={technical?1150:1080}/><TechnicalOverlay visual={beat.visual}/></AbsoluteFill>;
};
