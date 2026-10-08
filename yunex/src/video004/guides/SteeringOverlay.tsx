import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {y004FrameState} from '../timeline';
import {resolveY004CameraPose} from '../camera';
import {resolveY004SteeringReadout,type Y004SteerSide} from './overlayGeometry';

const palette={
  ivory:'#fff9ed',green:'#c7f98e',
  ink:'rgba(11,20,19,.88)',muted:'#baccc1',
};
const sideText=(side:Y004SteerSide)=>side;
const chipStyle:React.CSSProperties={
  width:435,minHeight:78,display:'flex',alignItems:'center',
  justifyContent:'space-between',boxSizing:'border-box',gap:20,
  padding:'13px 21px',borderRadius:12,
  background:'rgba(28,43,38,.96)',border:'1px solid rgba(220,255,219,.23)',
};
/**
 * Added ABOVE ThreeCanvas in H's existing visual component; never modifies
 * Porsche wheel geometry, wheel animation, scene hierarchy or edit timing.
 *
 * Two axle callouts represent categories of steering direction, not degrees.
 * Source-true projected world rays may overlap at <=1 degree; an alternate
 * enlarged angular diagram is specifically forbidden.
 */
export const Y004SteeringGuidesOverlay:React.FC=()=>{
  const frame=useCurrentFrame();
  const {width,height}=useVideoConfig();
  const state=y004FrameState(frame);
  const pose=resolveY004CameraPose(state.motion,state.progress);
  const data=resolveY004SteeringReadout(state.motion,pose);
  if(!data)return null;
  return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
    <div style={{
      width:1080,height:1920,position:'absolute',top:0,left:0,
      transform:`scale(${width/1080},${height/1920})`,transformOrigin:'top left',
      fontFamily:'Arial, sans-serif',pointerEvents:'none',
    }}>
      <svg width={1080} height={1920}
        style={{position:'absolute',top:0,left:0}}>
        {data.rays.map(ray=><g key={ray.id}>
          <line x1={ray.anchor[0]} y1={ray.anchor[1]}
            x2={ray.neutral[0]} y2={ray.neutral[1]}
            stroke="rgba(0,0,0,.9)" strokeWidth={11} strokeLinecap="round"/>
          <line x1={ray.anchor[0]} y1={ray.anchor[1]}
            x2={ray.neutral[0]} y2={ray.neutral[1]}
            stroke={palette.ivory} strokeWidth={6} strokeDasharray="11 8"
            strokeLinecap="round"/>
          <line x1={ray.anchor[0]} y1={ray.anchor[1]}
            x2={ray.actual[0]} y2={ray.actual[1]}
            stroke="rgba(0,0,0,.9)" strokeWidth={9} strokeLinecap="round"/>
          <line x1={ray.anchor[0]} y1={ray.anchor[1]}
            x2={ray.actual[0]} y2={ray.actual[1]}
            stroke={palette.green} strokeWidth={4.5} strokeLinecap="round"/>
          <circle cx={ray.anchor[0]} cy={ray.anchor[1]}
            r={8} fill={palette.ink} stroke={palette.ivory} strokeWidth={2.8}/>
        </g>)}
      </svg>
      <div style={{
        position:'absolute',left:60,top:1485,width:960,boxSizing:'border-box',
        borderRadius:17,padding:'20px 20px 17px',
        background:palette.ink,border:'1px solid rgba(210,250,218,.32)',
        boxShadow:'0 8px 32px rgba(0,0,0,.28)',
      }}>
        <div style={{
          display:'flex',justifyContent:'space-between',alignItems:'center',
          fontWeight:800,fontSize:26,letterSpacing:2.3,color:palette.green,
          padding:'0 5px 13px',
        }}>
          <span>{data.relation}</span>
          <span style={{fontSize:16,letterSpacing:1.3,color:palette.muted}}>FRONT / REAR AXLE</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',gap:18}}>
          <div style={chipStyle}>
            <span style={{fontSize:20,letterSpacing:2,color:palette.ivory}}>FRONT</span>
            <span style={{fontSize:30,fontWeight:800,color:palette.ivory}}>{sideText(data.front)}</span>
          </div>
          <div style={chipStyle}>
            <span style={{fontSize:20,letterSpacing:2,color:palette.green}}>REAR</span>
            <span style={{fontSize:30,fontWeight:800,color:palette.green}}>{sideText(data.rear)}</span>
          </div>
        </div>
        <div style={{
          margin:'12px 4px 0',fontSize:15,letterSpacing:1.6,color:palette.muted,
        }}>
          {data.liveTurning
            ? 'DIRECTION RELATIVE TO CAR • ACTUAL WHEEL ANGLES NOT TO SCALE IN LABELS'
            : 'WHEELS CENTRED HERE • MODE DESCRIBES STEERING RESPONSE WHILE TURNING'}
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};
