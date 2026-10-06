import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {sampleTrackRange, TRACK_LAYOUT_CONFIG} from './layout';
import type {TrackLayoutSample, TrackVec2} from './types';

export type RunoffProps = {
  quality: 'preview' | 'final';
  seed?: number;
};

type TrackSide = 'left' | 'right';

const RUNOFF_Y = -0.0086;
const SHOULDER_Y = -0.0091;

const roadEdge = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 =>
  side === 'left' ? sample.roadLeft : sample.roadRight;

const runoffEdge = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 =>
  side === 'left' ? sample.runoffLeft : sample.runoffRight;

const barrierEdge = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 =>
  side === 'left' ? sample.barrierLeft : sample.barrierRight;

const buildStripGeometry = (
  inner: (sample: TrackLayoutSample) => TrackVec2,
  outer: (sample: TrackLayoutSample) => TrackVec2,
  quality: RunoffProps['quality'],
  y: number,
) => {
  const samples = sampleTrackRange(
    TRACK_LAYOUT_CONFIG.sampleMinZ,
    TRACK_LAYOUT_CONFIG.sampleMaxZ,
    quality === 'final' ? 0.5 : 1,
  );
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  let distance = 0;

  for (let i = 0; i < samples.length; i++) {
    if (i > 0) {
      const previous = samples[i - 1].center;
      const current = samples[i].center;
      distance += Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    }

    const a = inner(samples[i]);
    const b = outer(samples[i]);
    positions.push(a[0], y, a[1], b[0], y, b[1]);
    uvs.push(0, distance * 0.12, 1, distance * 0.12);

    if (i < samples.length - 1) {
      const base = i * 2;
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  // Left and right strips have opposite pair ordering: orient every face upward.
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
    const normalY = (positions[b + 2] - positions[a + 2]) * (positions[c] - positions[a])
      - (positions[b] - positions[a]) * (positions[c + 2] - positions[a + 2]);
    if (normalY < 0) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
  }
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
};

const TrackStrip: React.FC<{
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  name: string;
}> = ({geometry, material, name}) => (
  <mesh
    name={name}
    geometry={geometry}
    material={material}
    receiveShadow
    frustumCulled={false}
  />
);

export const Runoff: React.FC<RunoffProps> = ({quality, seed = 2103}) => {
  const geometry = useMemo(
    () => ({
      leftRunoff: buildStripGeometry(
        (sample) => roadEdge(sample, 'left'),
        (sample) => runoffEdge(sample, 'left'),
        quality,
        RUNOFF_Y,
      ),
      rightRunoff: buildStripGeometry(
        (sample) => roadEdge(sample, 'right'),
        (sample) => runoffEdge(sample, 'right'),
        quality,
        RUNOFF_Y,
      ),
      leftShoulder: buildStripGeometry(
        (sample) => runoffEdge(sample, 'left'),
        (sample) => barrierEdge(sample, 'left'),
        quality,
        SHOULDER_Y,
      ),
      rightShoulder: buildStripGeometry(
        (sample) => runoffEdge(sample, 'right'),
        (sample) => barrierEdge(sample, 'right'),
        quality,
        SHOULDER_Y,
      ),
    }),
    [quality],
  );

  const materials = useMemo(
    () => ({
      runoff: new THREE.MeshStandardMaterial({
        color: '#555953',
        roughness: 0.94,
        metalness: 0,
      }),
      shoulder: new THREE.MeshStandardMaterial({
        color: '#746f5e',
        roughness: 1,
        metalness: 0,
      }),
    }),
    [],
  );

  useEffect(
    () => () => {
      geometry.leftRunoff.dispose();
      geometry.rightRunoff.dispose();
      geometry.leftShoulder.dispose();
      geometry.rightShoulder.dispose();
      materials.runoff.dispose();
      materials.shoulder.dispose();
    },
    [geometry, materials],
  );

  return (
    <group
      name="YUNEX002_Racetrack_Runoff"
      userData={{
        yunexTrackIdentity: 'runoff',
        deterministicSeed: seed,
        quality,
        layoutUnits: TRACK_LAYOUT_CONFIG.units,
      }}
    >
      <TrackStrip
        name="Runoff_Left_Paved"
        geometry={geometry.leftRunoff}
        material={materials.runoff}
      />
      <TrackStrip
        name="Runoff_Right_Paved"
        geometry={geometry.rightRunoff}
        material={materials.runoff}
      />
      <TrackStrip
        name="Runoff_Left_GravelShoulder"
        geometry={geometry.leftShoulder}
        material={materials.shoulder}
      />
      <TrackStrip
        name="Runoff_Right_GravelShoulder"
        geometry={geometry.rightShoulder}
        material={materials.shoulder}
      />
    </group>
  );
};

export const RUNOFF_INTEGRATION = {
  coordinateSpace: TRACK_LAYOUT_CONFIG.coordinateSpace,
  surfaceY: RUNOFF_Y,
  shoulderY: SHOULDER_Y,
  derivesFrom: 'road edges -> runoff boundaries -> barrier lines',
  note:
    'Mount inside the shared YUNEX 002 track root. Geometry is derived exclusively from the pinned racetrack layout contract.',
} as const;
