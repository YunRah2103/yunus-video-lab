import React from 'react';
import {DistantLandscape} from './DistantLandscape';
import {RoadSurfaces} from './RoadSurfaces';
import {TrackFurniture} from './TrackFurniture';
import {TrackVegetation} from './TrackVegetation';
import {TrackLighting} from './TrackLighting';
import {Runoff} from './racetrack/Runoff';
import {Terrain} from './racetrack/Terrain';

export type TrackWorldProps={
  quality?:'preview'|'final';
  seed?:number;
};

export const TRACK_ROOT_POSITION:[number,number,number]=[-1,-0.028,0];
export const TRACK_ROOT_ROTATION:[number,number,number]=[0,Math.PI,0];

const IntegratedBackingGround:React.FC=()=>(
  <mesh
    name="Y002_CIRCUIT_BACKING_GROUND"
    position={[0,-0.015,0]}
    rotation={[-Math.PI/2,0,0]}
    receiveShadow
  >
    <planeGeometry args={[120,120]}/>
    <meshStandardMaterial color="#48563e" roughness={1} metalness={0}/>
  </mesh>
);

export const TrackWorld:React.FC<TrackWorldProps>=({quality='final',seed=2103})=><>
  <group
    position={TRACK_ROOT_POSITION}
    rotation={TRACK_ROOT_ROTATION}
    name="Y002_TRACK_UPGRADE_ROOT"
    userData={{
      phase:'Y002-RACETRACK-IDENTITY-02',
      integrationRole:'G',
      layoutContractSha:'7ecd296b10f6d1d316544f1eb06a84bf5babedf3',
    }}
  >
    {/* One neutral, lowered ground sheet replaces the old technical-world asphalt/grass bands. */}
    <IntegratedBackingGround/>
    <RoadSurfaces quality={quality} seed={seed}/>
    <Runoff quality={quality} seed={seed}/>
    <Terrain quality={quality} seed={seed}/>
    <TrackFurniture quality={quality} seed={seed}/>
    <TrackVegetation quality={quality} seed={seed}/>
  </group>
  {/* These components intentionally operate in world space. */}
  <DistantLandscape seed={seed}/>
  <TrackLighting quality={quality} seed={seed}/>
</>;
