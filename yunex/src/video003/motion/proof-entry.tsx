import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MotionProofScene} from './MotionProofScene';

const Root: React.FC = () => (
  <Composition
    id="YUNEX-003-A-MOTION-PROOF"
    component={MotionProofScene}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={180}
  />
);

registerRoot(Root);
