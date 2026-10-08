import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Y004AgentCNativeProof,Y004_C_PROOF_DURATION} from './NativeProof';
const Root:React.FC=()=>(
  <Composition id="Y004-C-NATIVE-PROOF"
    component={Y004AgentCNativeProof}
    durationInFrames={Y004_C_PROOF_DURATION}
    fps={30} width={1080} height={1920}/>
);
registerRoot(Root);
