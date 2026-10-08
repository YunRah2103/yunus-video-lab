import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  buildY004EditCues, y004ActiveTextCue, y004CueOpacity,
  Y004_EDIT_PALETTE, Y004_SAFE_MARGIN_PX,
  type Y004EditWindow, type Y004TextCue,
} from './editorial';

export type Yunex004EditLayerProps = Readonly<{
  /** Manager-supplied final shot windows, after VO is measured and timeline locked. */
  windows: readonly Y004EditWindow[];
  /** Visual-only debug marker, never part of the master export. */
  debug?: boolean;
}>;

const TextCue: React.FC<{cue: Y004TextCue; frame: number}> = ({cue, frame}) => {
  const opacity = y004CueOpacity(frame, cue);
  const isSignature = cue.treatment === 'signature';
  const base: React.CSSProperties = {
    position: 'absolute', pointerEvents: 'none', opacity,
    left: isSignature ? undefined : Y004_SAFE_MARGIN_PX.x,
    right: isSignature ? Y004_SAFE_MARGIN_PX.x : Y004_SAFE_MARGIN_PX.x,
    top: isSignature ? undefined : Y004_SAFE_MARGIN_PX.top,
    bottom: isSignature ? 104 : undefined,
    textAlign: isSignature ? 'right' : 'left',
    transform: `translate3d(0, ${(1 - opacity) * (isSignature ? 7 : 13)}px,0)`,
    textShadow: '0 4px 25px rgba(0,0,0,.85)',
  };
  if (isSignature) return <div style={{...base, fontFamily:'Yunex004, Arial, sans-serif',fontSize:25,letterSpacing:5.3,fontWeight:900,color:Y004_EDIT_PALETTE.ivory}}>YUNEX</div>;
  return <div style={base}>
    {cue.eyebrow && <div style={{fontFamily:'Arial, sans-serif',fontWeight:700,fontSize:19,letterSpacing:4.3,marginBottom:13,color:'rgba(241,234,220,.82)'}}>{cue.eyebrow}</div>}
    <div style={{fontFamily:'Yunex004, Arial, sans-serif',fontSize:cue.segmentId==='rear-macro'?59:69,fontWeight:900,lineHeight:.98,letterSpacing:-1.1,color:Y004_EDIT_PALETTE.ivory,maxWidth:936,overflowWrap:'normal'}}>{cue.line1}</div>
    {cue.line2 && <div style={{fontFamily:'Yunex004, Arial, sans-serif',fontSize:81,fontWeight:900,lineHeight:.97,letterSpacing:-.9,color:Y004_EDIT_PALETTE.green,maxWidth:936}}>{cue.line2}</div>}
  </div>;
};

/** Pure overlay, no car/camera ownership. Must be layered above the Manager's native 3D scene. */
export const Yunex004EditLayer: React.FC<Yunex004EditLayerProps> = ({windows,debug=false}) => {
  const frame = useCurrentFrame();
  const {width,height,durationInFrames} = useVideoConfig();
  const cues = buildY004EditCues(windows, durationInFrames);
  const cue = y004ActiveTextCue(frame, cues);
  const scaleX = width / 1080, scaleY = height / 1920;
  return <AbsoluteFill style={{pointerEvents:'none',overflow:'hidden'}}>
    <style>{`@font-face{font-family:Yunex004;src:url('${staticFile('Display.ttf')}')}`}</style>
    <div style={{position:'absolute',left:0,top:0,width:1080,height:1920,transform:`scale(${scaleX},${scaleY})`,transformOrigin:'top left',pointerEvents:'none'}}>
      {cue && <TextCue cue={cue} frame={frame}/>}
      {debug && <div style={{position:'absolute',left:72,bottom:165,color:'#bddb78',fontFamily:'monospace',fontSize:20}}>{`D / ${frame} / ${cue?.segmentId ?? 'clean'}`}</div>}
    </div>
  </AbsoluteFill>;
};
