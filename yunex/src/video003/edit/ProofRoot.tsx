import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame} from 'remotion';
import {YUNEX003EditLayer} from './EditLayer';
import {YUNEX003_COPY,YUNEX003_NATIVE,type EditorialCue} from './editorial';

const PROOF_CUES:readonly EditorialCue[]=[
  {id:'hook',phase:'hook',kind:'dominant',startFrame:0,endFrame:48,line1:YUNEX003_COPY.hook.line1,line2:YUNEX003_COPY.hook.line2,accent:'green',priority:10},
  {id:'links',phase:'reveal',kind:'part-label',startFrame:42,endFrame:82,line1:YUNEX003_COPY.frontLinks,accent:'copper',anchorKey:'front-link',preferredSide:'left',priority:10},
  {id:'load',phase:'load',kind:'dominant',startFrame:78,endFrame:108,line1:YUNEX003_COPY.load,accent:'green',priority:10},
] as const;

const ProofScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const frontX=740+Math.sin(frame/20)*36;
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 62% 43%,#31383a 0%,#151a1b 48%,#090c0e 100%)',overflow:'hidden'}}>
    <div style={{position:'absolute',left:164,top:690,width:760,height:350,borderRadius:'52% 48% 24% 20%',background:'linear-gradient(160deg,#e9ebe5,#98a09b)',boxShadow:'0 36px 70px rgba(0,0,0,.58)',transform:`translateX(${Math.sin(frame/22)*24}px)`}}/>
    <div style={{position:'absolute',left:676,top:840,width:180,height:180,borderRadius:'50%',border:'34px solid #121617',boxShadow:'0 0 0 8px #bddb78 inset'}}/>
    <div style={{position:'absolute',left:692,top:925,width:190,height:16,transform:'rotate(-9deg)',transformOrigin:'left center',background:'#d58e50',borderRadius:12,boxShadow:'0 0 18px rgba(213,142,80,.3)'}}/>
    <YUNEX003EditLayer
      cues={PROOF_CUES}
      anchors={{'front-link':{x:frontX,y:932,visible:true}}}
      forbiddenRects={[{x:160,y:660,width:780,height:410}]}
      identityStartFrame={104}
      identityEndFrame={120}
      finishStrength={.5}
    />
  </AbsoluteFill>;
};

export const RemotionRoot:React.FC=()=> <Composition
  id="YUNEX003-E-PROOF"
  component={ProofScene}
  durationInFrames={120}
  fps={YUNEX003_NATIVE.fps}
  width={YUNEX003_NATIVE.width}
  height={YUNEX003_NATIVE.height}
/>;

registerRoot(RemotionRoot);
