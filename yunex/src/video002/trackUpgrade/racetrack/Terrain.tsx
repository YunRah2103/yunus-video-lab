import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {sampleTrackRange, TRACK_LAYOUT_CONFIG} from './layout';
import type {TrackLayoutSample, TrackVec2} from './types';

export type TerrainProps = {
  quality: 'preview' | 'final';
  seed?: number;
};

type TrackSide = 'left' | 'right';

const TERRAIN_Y = -0.0102;
const OUTER_TERRAIN_WIDTH = 6.5;

const barrierEdge = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 =>
  side === 'left' ? sample.barrierLeft : sample.barrierRight;

const landscapeEdge = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 =>
  side === 'left' ? sample.landscapeLeft : sample.landscapeRight;

const outerTerrainEdge = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 => {
  const base = landscapeEdge(sample, side);
  const direction = side === 'left' ? 1 : -1;
  return [
    base[0] + sample.leftNormal[0] * OUTER_TERRAIN_WIDTH * direction,
    base[1] + sample.leftNormal[1] * OUTER_TERRAIN_WIDTH * direction,
  ];
};

const buildStripGeometry = (
  inner: (sample: TrackLayoutSample) => TrackVec2,
  outer: (sample: TrackLayoutSample) => TrackVec2,
  quality: TerrainProps['quality'],
) => {
  const samples = sampleTrackRange(
    TRACK_LAYOUT_CONFIG.sampleMinZ,
    TRACK_LAYOUT_CONFIG.sampleMaxZ,
    quality === 'final' ? 0.75 : 1.5,
  );
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < samples.length; i++) {
    const a = inner(samples[i]);
    const b = outer(samples[i]);
    positions.push(a[0], TERRAIN_Y, a[1], b[0], TERRAIN_Y, b[1]);

    if (i < samples.length - 1) {
      const base = i * 2;
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
};

export const Terrain: React.FC<TerrainProps> = ({quality, seed = 2103}) => {
  const geometry = useMemo(
    () => ({
      leftNear: buildStripGeometry(
        (sample) => barrierEdge(sample, 'left'),
        (sample) => landscapeEdge(sample, 'left'),
        quality,
      ),
      rightNear: buildStripGeometry(
        (sample) => barrierEdge(sample, 'right'),
        (sample) => landscapeEdge(sample, 'right'),
        quality,
      ),
      leftOuter: buildStripGeometry(
        (sample) => landscapeEdge(sample, 'left'),
        (sample) => outerTerrainEdge(sample, 'left'),
        quality,
      ),
      rightOuter: buildStripGeometry(
        (sample) => landscapeEdge(sample, 'right'),
        (sample) => outerTerrainEdge(sample, 'right'),
        quality,
      ),
    }),
    [quality],
  );

  const materials = useMemo(
    () => ({
      near: new THREE.MeshStandardMaterial({
        color: '#5d684d',
        roughness: 1,
        metalness: 0,
      }),
      outer: new THREE.MeshStandardMaterial({
        color: '#48563e',
        roughness: 1,
        metalness: 0,
      }),
    }),
    [],
  );

  useEffect(
    () => () => {
      geometry.leftNear.dispose();
      geometry.rightNear.dispose();
      geometry.leftOuter.dispose();
      geometry.rightOuter.dispose();
      materials.near.dispose();
      materials.outer.dispose();
    },
    [geometry, materials],
  );

  return (
    <group
      name="YUNEX002_Racetrack_Terrain"
      userData={{
        yunexTrackIdentity: 'terrain',
        deterministicSeed: seed,
        quality,
        outerTerrainWidth: OUTER_TERRAIN_WIDTH,
      }}
    >
      <mesh
        name="Terrain_Left_Near"
        geometry={geometry.leftNear}
        material={materials.near}
        receiveShadow
        frustumCulled={false}
      />
      <mesh
        name="Terrain_Right_Near"
        geometry={geometry.rightNear}
        material={materials.near}
        receiveShadow
        frustumCulled={false}
      />
      <mesh
        name="Terrain_Left_Outer"
        geometry={geometry.leftOuter}
        material={materials.outer}
        receiveShadow
        frustumCulled={false}
      />
      <mesh
        name="Terrain_Right_Outer"
        geometry={geometry.rightOuter}
        material={materials.outer}
        receiveShadow
        frustumCulled={false}
      />
    </group>
  );
};

export const TERRAIN_INTEGRATION = {
  coordinateSpace: TRACK_LAYOUT_CONFIG.coordinateSpace,
  terrainY: TERRAIN_Y,
  outerWidth: OUTER_TERRAIN_WIDTH,
  derivesFrom: 'barrier lines -> landscape exclusion lines -> outer terrain',
  note:
    'Terrain keeps the circuit cross-section readable while leaving D-owned vegetation and distant landscape free to populate only beyond the exclusion line.',
} as const;
