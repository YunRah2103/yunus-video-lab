import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {TRACK_LAYOUT_CONFIG, TRACK_LAYOUT_SAMPLES, TRACK_ASPHALT_LOCAL_Y} from './layout';
import type {TrackLayoutSample, TrackVec2} from './types';
import {createAsphaltTexture} from '../road/proceduralRoadTexture';
import type {RoadQuality} from '../road/layout';

export type SurfaceProps = {
  quality: RoadQuality;
  seed?: number;
};

const ASPHALT_Y = TRACK_ASPHALT_LOCAL_Y;
const PAINT_Y = ASPHALT_Y + 0.0016;
const WEAR_Y = ASPHALT_Y + 0.0019;
const EDGE_PAINT_WIDTH = 0.075;
const RACING_LINE_WIDTH = 1.45;

const add = (a: TrackVec2, b: TrackVec2, scale = 1): TrackVec2 => [
  a[0] + b[0] * scale,
  a[1] + b[1] * scale,
];

const distance = (a: TrackVec2, b: TrackVec2) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const cumulativeDistances = (samples: TrackLayoutSample[]) => {
  const result = [0];
  for (let i = 1; i < samples.length; i++) {
    result.push(result[i - 1] + distance(samples[i - 1].center, samples[i].center));
  }
  return result;
};

const makeRibbonGeometry = (
  samples: TrackLayoutSample[],
  pairAt: (sample: TrackLayoutSample) => [TrackVec2, TrackVec2],
  y: number,
) => {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const travelled = cumulativeDistances(samples);
  // Preserve world-space asphalt grain when the visible course is extended.
  const textureSpanMetres = 80;

  samples.forEach((sample, index) => {
    const [left, right] = pairAt(sample);
    positions.push(left[0], y, left[1], right[0], y, right[1]);
    const v = travelled[index] / textureSpanMetres;
    uvs.push(0, v, 1, v);
    if (index < samples.length - 1) {
      const i = index * 2;
      indices.push(i, i + 2, i + 1, i + 1, i + 2, i + 3);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
};

const smooth01 = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

const blend = (a: number, b: number, t: number) => a + (b - a) * smooth01(t);

const racingOffsetAtZ = (z: number) => {
  if (z <= 10) return 0.12;
  if (z <= 18) return blend(0.12, 0.65, (z - 10) / 8);
  if (z <= 24) return blend(0.65, -0.72, (z - 18) / 6);
  if (z <= 32) return blend(-0.72, 0.48, (z - 24) / 8);
  if (z <= 36) return blend(0.48, 0.12, (z - 32) / 4);
  return 0.12;
};

const roadPair = (sample: TrackLayoutSample): [TrackVec2, TrackVec2] => [
  sample.roadLeft,
  sample.roadRight,
];

const leftEdgePair = (sample: TrackLayoutSample): [TrackVec2, TrackVec2] => [
  sample.roadLeft,
  add(sample.roadLeft, sample.leftNormal, -EDGE_PAINT_WIDTH),
];

const rightEdgePair = (sample: TrackLayoutSample): [TrackVec2, TrackVec2] => [
  add(sample.roadRight, sample.leftNormal, EDGE_PAINT_WIDTH),
  sample.roadRight,
];

const racingPair = (sample: TrackLayoutSample): [TrackVec2, TrackVec2] => {
  const center = add(sample.center, sample.leftNormal, racingOffsetAtZ(sample.z));
  return [
    add(center, sample.leftNormal, RACING_LINE_WIDTH / 2),
    add(center, sample.leftNormal, -RACING_LINE_WIDTH / 2),
  ];
};

export const Surface: React.FC<SurfaceProps> = ({quality, seed = 2103}) => {
  const asphaltTexture = useMemo(() => createAsphaltTexture(quality, seed), [quality, seed]);
  const asphaltGeometry = useMemo(
    () => makeRibbonGeometry(TRACK_LAYOUT_SAMPLES, roadPair, ASPHALT_Y),
    [],
  );
  const leftPaintGeometry = useMemo(
    () => makeRibbonGeometry(TRACK_LAYOUT_SAMPLES, leftEdgePair, PAINT_Y),
    [],
  );
  const rightPaintGeometry = useMemo(
    () => makeRibbonGeometry(TRACK_LAYOUT_SAMPLES, rightEdgePair, PAINT_Y),
    [],
  );
  const racingGeometry = useMemo(
    () => makeRibbonGeometry(TRACK_LAYOUT_SAMPLES, racingPair, WEAR_Y),
    [],
  );

  const asphaltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: asphaltTexture,
        color: '#f2f2ef',
        roughness: 0.92,
        metalness: 0.012,
      }),
    [asphaltTexture],
  );
  const paintMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d9d9d2',
        roughness: 0.86,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    [],
  );
  const racingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#151819',
        roughness: 0.84,
        metalness: 0,
        transparent: true,
        opacity: quality === 'final' ? 0.09 : 0.07,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -3,
        polygonOffsetUnits: -3,
      }),
    [quality],
  );

  useEffect(
    () => () => {
      asphaltGeometry.dispose();
      leftPaintGeometry.dispose();
      rightPaintGeometry.dispose();
      racingGeometry.dispose();
      asphaltMaterial.dispose();
      paintMaterial.dispose();
      racingMaterial.dispose();
      asphaltTexture.dispose();
    },
    [
      asphaltGeometry,
      asphaltMaterial,
      leftPaintGeometry,
      paintMaterial,
      racingGeometry,
      racingMaterial,
      rightPaintGeometry,
      asphaltTexture,
    ],
  );

  return (
    <group
      name="Y002_Racetrack_Surface"
      userData={{
        phase: 'Y002-RACETRACK-IDENTITY-02',
        roadWidthMetres: TRACK_LAYOUT_CONFIG.roadWidth,
        sampleCount: TRACK_LAYOUT_SAMPLES.length,
        deterministicSeed: seed,
        quality,
      }}
    >
      <mesh
        name="RacingSurface_Asphalt"
        receiveShadow
        geometry={asphaltGeometry}
        material={asphaltMaterial}
      />
      <mesh name="RacingSurface_LeftEdgePaint" geometry={leftPaintGeometry} material={paintMaterial} />
      <mesh name="RacingSurface_RightEdgePaint" geometry={rightPaintGeometry} material={paintMaterial} />
      <mesh name="RacingSurface_SubtleRacingLine" geometry={racingGeometry} material={racingMaterial} />
    </group>
  );
};
