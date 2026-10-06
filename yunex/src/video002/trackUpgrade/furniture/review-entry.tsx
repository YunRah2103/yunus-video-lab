import React from 'react';
import {Composition, registerRoot, Still} from 'remotion';
import {
  TrackFurnitureParallaxProof,
  TrackFurnitureQuarterAfter,
  TrackFurnitureQuarterBefore,
  TrackFurnitureSideAfter,
  TrackFurnitureSideBefore,
} from './TrackFurnitureReview';

const Root: React.FC = () => (
  <>
    <Still id="YUNEX-002-FURNITURE-QUARTER-BEFORE" component={TrackFurnitureQuarterBefore} width={1080} height={1920} />
    <Still id="YUNEX-002-FURNITURE-QUARTER-AFTER" component={TrackFurnitureQuarterAfter} width={1080} height={1920} />
    <Still id="YUNEX-002-FURNITURE-SIDE-BEFORE" component={TrackFurnitureSideBefore} width={1080} height={1920} />
    <Still id="YUNEX-002-FURNITURE-SIDE-AFTER" component={TrackFurnitureSideAfter} width={1080} height={1920} />
    <Composition
      id="YUNEX-002-FURNITURE-PARALLAX"
      component={TrackFurnitureParallaxProof}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={91}
    />
  </>
);

registerRoot(Root);
