import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {AgentAProofScene} from './AProofScene';
const Low:React.FC=()=> <AgentAProofScene mode="low"/>;
const High:React.FC=()=> <AgentAProofScene mode="high"/>;
const Root:React.FC=()=> <>
  <Composition id="Y004-A-LOW-DRIVE" component={Low} width={1080} height={1920}
    fps={30} durationInFrames={120}/>
  <Composition id="Y004-A-HIGH-DRIVE" component={High} width={1080} height={1920}
    fps={30} durationInFrames={120}/>
</>;
registerRoot(Root);
