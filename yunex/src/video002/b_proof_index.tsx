import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {BCameraTrackProof, B_CAMERA_PROOF_FRAMES} from './b_camera_proof';
import {assertBCameraContract} from './b_camera_tests';

assertBCameraContract();

const Root = () => (
  <Composition
    id="YUNEX-002-B-CAMERA-PROOF"
    component={BCameraTrackProof}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={B_CAMERA_PROOF_FRAMES}
  />
);

registerRoot(Root);
