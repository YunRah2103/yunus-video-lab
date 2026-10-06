import React from 'react';
import {TechnicalTrackWorld} from '../../TrackPreview';
import {RoadSurfaces} from './RoadSurfaces';
import {TrackFurniture} from './TrackFurniture';
import {TrackVegetation} from './TrackVegetation';
import {TrackLighting} from './TrackLighting';

export type TrackWorldProps={
  quality?:'preview'|'final';
  seed?:number;
};

export const TRACK_ROOT_POSITION:[number,number,number]=[-1,-0.028,0];
export const TRACK_ROOT_ROTATION:[number,number,number]=[0,Math.PI,0];

export const TrackWorld:React.FC<TrackWorldProps>=({quality='final',seed=2103})=><>
  {/* Keep only the legacy wide ground as a lowered backing plane. YUNEX 001 defaults remain unchanged. */}
  <TechnicalTrackWorld groundY={-0.034} legacyKerb={false} legacyRail={false} legacyVegetation={false}/>
  <group position={TRACK_ROOT_POSITION} rotation={TRACK_ROOT_ROTATION} name="Y002_TRACK_UPGRADE_ROOT">
    <RoadSurfaces quality={quality} seed={seed}/>
    <TrackFurniture quality={quality} seed={seed}/>
    <TrackVegetation quality={quality} seed={seed}/>
  </group>
  {/* Lighting is deliberately world-space and must not inherit the rotated track-local root. */}
  <TrackLighting quality={quality} seed={seed}/>
</>;
