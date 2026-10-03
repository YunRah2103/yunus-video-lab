import React from 'react';
import {Composition} from 'remotion';
import {VehicleExplainer} from './VehicleExplainer';
import {porscheEpisode} from './data/episode001';

export const Root: React.FC = () => (
  <>
    <Composition
      id="VehicleExplainer-PorscheRearEngine"
      component={VehicleExplainer}
      durationInFrames={Math.ceil(porscheEpisode.duration * 60)}
      fps={60}
      width={1080}
      height={1920}
      defaultProps={{episode: porscheEpisode}}
    />
  </>
);
