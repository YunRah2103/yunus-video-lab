import React from 'react';
import {AbsoluteFill,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {YUNEX003_PALETTE,activeEditorialCues,cueOpacity,resolveLabelPlacement,clamp01,smoothstep,type EditorialCue,type EditLayerProps} from './editorial';

const accentColor=(cue:EditorialCue)=>cue.accent==='green'?YUNEX003_PALETTE.green:cue.accent==='copper'?YUNEX003_PALETTE.copper:YUNEX003_PALETTE.ivory;

const DominantCue:React.FC<{cue:EditorialCue;frame:number}>=({cue,frame})=>{
  const opacity=cueOpacity(frame,cue,8);
  return <div style={{position:'absolute',left:72,right:72,top:176,opacity,transform:`translateY(${14*(1-opacity)}px)`,textShadow:'0 4px 24px rgba(0,0,0,.72)',pointerEvents:'none'}}>
    {cue.eyebrow&&<div style={{fontFamily:'Arial, sans-serif',fontWeight:700,fontSize:18,letterSpacing:4.6,color:'rgba(241,234,220,.68)',marginBottom:11}}>{cue.eyebrow}</div>}
    <div style={{fontFamily:'Yunex, Arial, sans-serif',fontWeight:900,fontSize:72,lineHeight:.91,letterSpacing:-.4,color:YUNEX003_PALETTE.ivory,maxWidth:850}}>{cue.line1}</div>
    {cue.line2&&<div style={{fontFamily:'Yunex, Arial, sans-serif',fontWeight:900,fontSize:82,lineHeight:.92,letterSpacing:-.7,color:accentColor(cue),maxWidth:880}}>{cue.line2}</div>}
  </div>;
};

const PartLabel:React.FC<{cue:EditorialCue;frame:number;anchors:NonNullable<EditLayerProps['anchors']>;forbiddenRects:NonNullable<EditLayerProps['forbiddenRects']>;width:number;height:number}>=({cue,frame,anchors,forbiddenRects,width,height})=>{
  if(!cue.anchorKey)return null;
  const anchor=anchors[cue.anchorKey];
  if(!anchor||anchor.visible===false)return null;
  const opacity=cueOpacity(frame,cue,6);
  const boxW=336,boxH=82;
  const p=resolveLabelPlacement({anchor,labelWidth:boxW,labelHeight:boxH,canvasWidth:width,canvasHeight:height,preferredSide:cue.preferredSide,forbiddenRects});
  const lineEndX=p.side==='left'?p.x+boxW:p.side==='right'?p.x:p.x+boxW/2;
  const lineEndY=p.side==='above'?p.y+boxH:p.side==='below'?p.y:p.y+boxH/2;
  return <>
    <svg width={width} height={height} style={{position:'absolute',inset:0,pointerEvents:'none',opacity}}>
      <path d={`M ${anchor.x} ${anchor.y} L ${p.leaderX} ${p.leaderY} L ${lineEndX} ${lineEndY}`} fill="none" stroke={accentColor(cue)} strokeWidth={2.25}/>
      <circle cx={anchor.x} cy={anchor.y} r={4.5} fill={accentColor(cue)}/>
    </svg>
    <div style={{position:'absolute',left:p.x,top:p.y,width:boxW,height:boxH,display:'flex',alignItems:'center',padding:'0 18px',borderLeft:`3px solid ${accentColor(cue)}`,background:'linear-gradient(90deg,rgba(11,15,15,.82),rgba(11,15,15,.18))',fontFamily:'Yunex, Arial, sans-serif',fontSize:31,lineHeight:1,letterSpacing:1.4,color:YUNEX003_PALETTE.ivory,textShadow:'0 3px 12px rgba(0,0,0,.72)',opacity,pointerEvents:'none'}}>{cue.line1}</div>
  </>;
};

export const EditorialOverlay:React.FC<Pick<EditLayerProps,'cues'|'anchors'|'forbiddenRects'|'debug'>>=({cues,anchors={},forbiddenRects=[],debug=false})=>{
  const frame=useCurrentFrame();
  const {width,height}=useVideoConfig();
  const {dominant,label}=activeEditorialCues(frame,cues);
  return <AbsoluteFill style={{pointerEvents:'none'}}>
    <style>{`@font-face{font-family:Yunex;src:url('${staticFile('Display.ttf')}')}*{box-sizing:border-box}`}</style>
    {dominant&&<DominantCue cue={dominant} frame={frame}/>}
    {label&&<PartLabel cue={label} frame={frame} anchors={anchors} forbiddenRects={forbiddenRects} width={width} height={height}/>}
    {debug&&<div style={{position:'absolute',left:72,bottom:88,fontFamily:'Arial, sans-serif',fontSize:17,letterSpacing:2.2,color:'rgba(241,234,220,.58)'}}>E · {frame} · {dominant?.phase??label?.phase??'clean'}</div>}
  </AbsoluteFill>;
};

export type FinishingLayerProps={strength?:number;identityStartFrame?:number;identityEndFrame?:number};

export const FinishingLayer:React.FC<FinishingLayerProps>=({strength=.52,identityStartFrame,identityEndFrame})=>{
  const frame=useCurrentFrame();
  const s=clamp01(strength);
  const identity=identityStartFrame===undefined?0:(()=>{
    const fadeIn=smoothstep((frame-identityStartFrame)/8);
    const fadeOut=identityEndFrame===undefined?1:1-smoothstep((frame-(identityEndFrame-8))/8);
    return clamp01(fadeIn*fadeOut);
  })();
  return <AbsoluteFill style={{pointerEvents:'none'}}>
    <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 52% 45%,rgba(0,0,0,0) 48%,rgba(0,0,0,${.22*s}) 100%)`}}/>
    <div style={{position:'absolute',left:0,right:0,top:0,height:180,background:`linear-gradient(180deg,rgba(6,9,10,${.18*s}),transparent)`}}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:230,background:`linear-gradient(0deg,rgba(6,9,10,${.22*s}),transparent)`}}/>
    {identity>0&&<div style={{position:'absolute',right:54,bottom:48,fontFamily:'Yunex, Arial, sans-serif',fontSize:24,letterSpacing:5.2,color:YUNEX003_PALETTE.ivory,opacity:.78*identity,textShadow:'0 3px 12px rgba(0,0,0,.55)'}}>YUNEX</div>}
  </AbsoluteFill>;
};

export const YUNEX003EditLayer:React.FC<EditLayerProps>=({
  cues,
  anchors={},
  forbiddenRects=[],
  showFinishing=true,
  finishStrength=.52,
  identityStartFrame,
  identityEndFrame,
  debug=false,
})=><AbsoluteFill style={{pointerEvents:'none'}}>
  <EditorialOverlay cues={cues} anchors={anchors} forbiddenRects={forbiddenRects} debug={debug}/>
  {showFinishing&&<FinishingLayer strength={finishStrength} identityStartFrame={identityStartFrame} identityEndFrame={identityEndFrame}/>}
</AbsoluteFill>;
