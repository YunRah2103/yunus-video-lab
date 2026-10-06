import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {RoadSurfaceProofFrame} from './RoadSurfaceProof';

const CloseBefore = () => (
  <RoadSurfaceProofFrame sourceFrame={225} upgraded={false} label="BEFORE · CLOSE" />
);
const CloseAfter = () => (
  <RoadSurfaceProofFrame sourceFrame={225} upgraded label="A_ROAD · CLOSE" />
);
const WideBefore = () => (
  <RoadSurfaceProofFrame sourceFrame={600} upgraded={false} label="BEFORE · WIDE" />
);
const WideAfter = () => (
  <RoadSurfaceProofFrame sourceFrame={600} upgraded label="A_ROAD · WIDE" />
);

const Root = () => (
  <>
    <Composition
      id="YUNEX-002-A-ROAD-CLOSE-BEFORE"
      component={CloseBefore}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="YUNEX-002-A-ROAD-CLOSE-AFTER"
      component={CloseAfter}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="YUNEX-002-A-ROAD-WIDE-BEFORE"
      component={WideBefore}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="YUNEX-002-A-ROAD-WIDE-AFTER"
      component={WideAfter}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
  </>
);

registerRoot(Root);
