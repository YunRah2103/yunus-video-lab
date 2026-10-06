import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {CFlowProof} from './c_flow_proof';
import {runCFlowTests} from './c_flow_tests';

runCFlowTests();

const Root: React.FC = () => <Composition
  id="YUNEX-002-C-FLOW-PROOF"
  component={CFlowProof}
  width={1080}
  height={1920}
  fps={30}
  durationInFrames={45}
/>;

registerRoot(Root);
