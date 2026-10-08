/** D-owned standalone editorial typography proof; never register in the production index. */
import React from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
import {Yunex004EditLayer} from './EditLayer';
import type {Y004EditWindow} from './editorial';

export const Y004_D_PROOF_WINDOWS: readonly Y004EditWindow[] = [
  {segmentId:'low-hook',startFrame:0,endFrame:35},
  {segmentId:'rear-macro',startFrame:35,endFrame:60},
  {segmentId:'low-explain',startFrame:60,endFrame:85},
  {segmentId:'high-explain',startFrame:85,endFrame:100},
  {segmentId:'high-drive',startFrame:100,endFrame:110},
  {segmentId:'trackside-exit',startFrame:110,endFrame:120},
];
/** Deliberately an abstract moving reference with no fabricated Porsche or wheel steering proof. */
const MovingReference:React.FC=()=>{
  const frame=useCurrentFrame();
  const travel=(frame*18)%330;
  return <AbsoluteFill style={{background:'linear-gradient(135deg,#242c2b,#0d1111)',overflow:'hidden'}}>
    <div style={{position:'absolute',left:62,right:62,top:430,bottom:250,borderLeft:'8px solid #a8ae9e',borderRight:'8px solid #a8ae9e',transform:'rotate(-6deg)',opacity:.38}}/>
    {Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:535,top:400+i*330+travel-330,width:10,height:180,background:'#b4c0ad',opacity:.25,transform:'rotate(-6deg)'}}/>)}
    <div style={{position:'absolute',left:290+Math.sin(frame/28)*75,top:890+Math.sin(frame/19)*19,width:510,height:280,border:'5px solid #b5c5bb',borderRadius:'46% 48% 18% 19%',background:'linear-gradient(130deg,#bfc8c1,#657068)',transform:'rotate(-6deg)',boxShadow:'0 42px 30px rgba(0,0,0,.6)'}}/>
    <div style={{position:'absolute',left:76,bottom:90,fontFamily:'monospace',fontSize:22,letterSpacing:1.2,color:'#afbaaa'}}>D EDIT PROOF · MOVING PLACEHOLDER · NOT ACTUAL CAR</div>
    <Yunex004EditLayer windows={Y004_D_PROOF_WINDOWS}/>
  </AbsoluteFill>;
};

const Root:React.FC=()=> <Composition id="YUNEX004-D-EDIT-PROOF" component={MovingReference} durationInFrames={120} fps={30} width={1080} height={1920}/>;
registerRoot(Root);
