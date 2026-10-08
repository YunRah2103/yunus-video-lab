import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {BRearRigProofScene,Y004_B_PROOF_FPS,Y004_B_PROOF_FRAMES} from './BRearRigProofScene';
const Low:React.FC=()=> <BRearRigProofScene regime="low"/>;
const High:React.FC=()=> <BRearRigProofScene regime="high"/>;
const Root:React.FC=()=> <>
 <Composition id="YUNEX-004-B-LOW-MACRO" component={Low} width={1080} height={1920}
  fps={Y004_B_PROOF_FPS} durationInFrames={Y004_B_PROOF_FRAMES}/>
 <Composition id="YUNEX-004-B-HIGH-MACRO" component={High} width={1080} height={1920}
  fps={Y004_B_PROOF_FPS} durationInFrames={Y004_B_PROOF_FRAMES}/>
</>;
registerRoot(Root);
