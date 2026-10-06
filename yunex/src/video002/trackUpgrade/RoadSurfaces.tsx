import React, {useMemo} from 'react';
import {assertTrackLayoutContract, TRACK_LAYOUT_CONFIG} from './racetrack/layout';
import {Surface} from './racetrack/Surface';
import {Kerbs} from './racetrack/Kerbs';
import type {RoadQuality} from './road/layout';

export type RoadSurfacesProps = {
  quality: RoadQuality;
  seed?: number;
};

export const ROAD_SURFACE_INTEGRATION = {
  phase: 'Y002-RACETRACK-IDENTITY-02',
  layoutContractSha: '7ecd296b10f6d1d316544f1eb06a84bf5babedf3',
  coordinateSpace: TRACK_LAYOUT_CONFIG.coordinateSpace,
  managerRootTransform: {
    position: TRACK_LAYOUT_CONFIG.rootPosition,
    rotationY: TRACK_LAYOUT_CONFIG.rootYaw,
  },
  ownership:
    'B owns connected racing asphalt, white edge paint, racing-line wear and selected kerbs only. Runoff, barriers, terrain and landscape belong to C/D.',
  note: 'Mount inside the shared YUNEX 002 TrackWorld root; this component does not apply the manager root transform.',
} as const;

export const RoadSurfaces: React.FC<RoadSurfacesProps> = ({quality, seed = 2103}) => {
  const validation = useMemo(() => assertTrackLayoutContract(), []);

  return (
    <group
      name="YUNEX002_RoadSurfaces"
      userData={{
        yunexTrackUpgrade: 'racetrack-surface',
        phase: ROAD_SURFACE_INTEGRATION.phase,
        layoutContractSha: ROAD_SURFACE_INTEGRATION.layoutContractSha,
        deterministicSeed: seed,
        quality,
        validation: validation.metrics,
      }}
    >
      <Surface quality={quality} seed={seed} />
      <Kerbs quality={quality} seed={seed} />
    </group>
  );
};
