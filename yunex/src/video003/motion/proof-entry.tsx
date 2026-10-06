import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MotionProofScene} from './MotionProofScene';
import {assertMotionContract} from './qa';

// Fail the isolated proof before rendering if arbitrary-frame motion, tyre contact,
// steering sign, track containment or wheel-distance/spin invariants regress.
assertMotionContract();

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
