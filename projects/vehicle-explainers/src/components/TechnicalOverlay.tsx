import React from 'react';
import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';

export const TechnicalOverlay:React.FC<{visual?:string}> = ({visual}) => {
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const p=interpolate(f,[0,.5*fps],[0,1],{extrapolateRight:'clamp'});
  const line={position:'absolute' as const,height:6,background:'#00E5FF',borderRadius:6,transformOrigin:'left center',opacity:p};
  if(visual==='rear-engine-callout') return <><div style={{...line,left:650,top:560,width:250,transform:`scaleX(${p}) rotate(-18deg)`}}/><div style={{position:'absolute',left:770,top:490,font:'900 34px Arial',color:'#00E5FF'}}>ENGINE</div></>;
  if(visual==='axle-engine-diagram') return <><div style={{...line,left:190,top:610,width:700,transform:`scaleX(${p})`}}/><div style={{position:'absolute',left:190,top:625,font:'700 28px Arial',color:'#9FB0B8'}}>FRONT AXLE</div><div style={{position:'absolute',right:145,top:625,font:'700 28px Arial',color:'#9FB0B8'}}>REAR AXLE</div><div style={{position:'absolute',right:145,top:505,border:'4px solid #00E5FF',padding:'14px 20px',font:'900 32px Arial'}}>FLAT-SIX</div></>;
  if(visual==='rear-load-arrows'||visual==='driven-wheel-load') return <div style={{position:'absolute',right:165,top:500,font:'900 86px Arial',color:'#00E5FF',transform:`translateY(${18-18*p}px)`}}>↓↓↓</div>;
  if(visual==='rear-mass-arc') return <div style={{position:'absolute',right:120,top:455,width:330,height:250,borderTop:'7px solid #00E5FF',borderRight:'7px solid #00E5FF',borderRadius:'50%',transform:`rotate(${20*p}deg)`}}/>;
  if(visual==='oversteer-path') return <div style={{position:'absolute',left:520,top:465,width:380,height:260,borderBottom:'8px dashed #FF4A4A',borderRadius:'50%',transform:`rotate(${14*p}deg)`}}/>;
  if(visual==='wheelbase-before-after') return <><div style={{position:'absolute',left:120,top:530,font:'900 42px Arial',color:'#9FB0B8'}}>1968</div><div style={{position:'absolute',right:120,top:530,font:'900 42px Arial',color:'#00E5FF'}}>1969</div></>;
  if(visual==='993-multilink') return <div style={{position:'absolute',right:125,top:470,width:330,height:220}}>{[0,1,2,3].map(i=><div key={i} style={{...line,left:20+i*18,top:45+i*35,width:260,transform:`scaleX(${p}) rotate(${i%2?16:-16}deg)`}}/>)}</div>;
  return null;
};
