import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {RoadSurfaceProofFrame} from './RoadSurfaceProof';

const Root = () => (
  <>
    <Composition
      id="YUNEX-002-A-ROAD-CLOSE-BEFORE"
      component={() => <RoadSurfaceProofFrame sourceFrame={225} upgraded={false} label="BEFORE · CLOSE" />}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="YUNEX-002-A-ROAD-CLOSE-AFTER"
      component={() => <RoadSurfaceProofFrame sourceFrame={225} upgraded label="A_ROAD · CLOSE" />}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="YUNEX-002-A-ROAD-WIDE-BEFORE"
      component={() => <RoadSurfaceProofFrame sourceFrame={600} upgraded={false} label="BEFORE · WIDE" />}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="YUNEX-002-A-ROAD-WIDE-AFTER"
      component={() => <RoadSurfaceProofFrame sourceFrame={600} upgraded label="A_ROAD · WIDE" />}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
  </>
);

registerRoot(Root);
