import React from 'react';
import {Composition} from 'remotion';
import {VehicleExplainer} from './VehicleExplainer';
import {PorscheV3} from './PorscheV3';
import {porscheEpisode} from './data/episode001';

export const Root: React.FC = () => (
  <>
    <Composition id="Porsche-V3" component={PorscheV3} durationInFrames={3616} fps={60} width={1080} height={1920}/>
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

