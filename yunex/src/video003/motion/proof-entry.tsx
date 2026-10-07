import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MotionProofScene} from './MotionProofScene';
import {PolishWheelProofScene} from './PolishWheelProofScene';
import {assertMotionContract} from './qa';

// Fail every isolated proof before rendering if steering-rate, hub/axle stability,
// tyre contact, deterministic transforms or wheel-distance/spin invariants regress.
assertMotionContract({fps: 30, durationFrames: 735});

const NeutralProof: React.FC = () => (
  <PolishWheelProofScene variant="neutral" />
);
const SteeringProof: React.FC = () => (
  <PolishWheelProofScene variant="steering" />
);
const ComparisonProof: React.FC = () => (
  <PolishWheelProofScene variant="comparison" />
);

const Root: React.FC = () => (
  <>
    <Composition
      id="YUNEX-003-A-MOTION-PROOF"
      component={MotionProofScene}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={180}
    />
    <Composition
      id="YUNEX-003-A-P02-NEUTRAL"
      component={NeutralProof}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
    />
    <Composition
      id="YUNEX-003-A-P02-STEERING"
      component={SteeringProof}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
    />
    <Composition
      id="YUNEX-003-A-P02-COMPARISON"
      component={ComparisonProof}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
    />
  </>
);

registerRoot(Root);
