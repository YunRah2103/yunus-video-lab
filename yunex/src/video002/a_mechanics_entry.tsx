import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AgentAMechanicsProof} from './a_mechanics_proof';

const Root = () => (
  <Composition
    id="YUNEX-002-A-MECHANICS"
    component={AgentAMechanicsProof}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={84}
  />
);

registerRoot(Root);
