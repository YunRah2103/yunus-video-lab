import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {TRACK_LAYOUT_SAMPLES} from './layout';
import type {KerbPurpose, TrackLayoutSample, TrackSide, TrackVec2} from './types';
import type {RoadQuality} from '../road/layout';

export type KerbsProps = {
  quality: RoadQuality;
  seed?: number;
};

type KerbSegment = {
  a: TrackLayoutSample;
  b: TrackLayoutSample;
  side: TrackSide;
  purpose: Exclude<KerbPurpose, 'none'>;
  stripeIndex: number;
};

const ASPHALT_Y = -0.0104;
const KERB_BASE_Y = ASPHALT_Y - 0.001;
const KERB_TOP_Y = ASPHALT_Y + 0.034;
const KERB_WIDTH = 0.46;

const add = (a: TrackVec2, b: TrackVec2, scale = 1): TrackVec2 => [
  a[0] + b[0] * scale,
  a[1] + b[1] * scale,
];

const eligible = (
  a: TrackLayoutSample,
  b: TrackLayoutSample,
  side: TrackSide,
): Exclude<KerbPurpose, 'none'> | null => {
  const pa = a.kerb[side];
  const pb = b.kerb[side];
  return pa !== 'none' && pa === pb ? pa : null;
};

const buildSegments = () => {
  const result: KerbSegment[] = [];
  let stripeIndex = 0;
  for (let i = 0; i < TRACK_LAYOUT_SAMPLES.length - 1; i++) {
    const a = TRACK_LAYOUT_SAMPLES[i];
    const b = TRACK_LAYOUT_SAMPLES[i + 1];
    for (const side of ['left', 'right'] as const) {
      const purpose = eligible(a, b, side);
      if (!purpose) continue;
      result.push({a, b, side, purpose, stripeIndex});
      stripeIndex++;
    }
  }
  return result;
};

const edgeAt = (sample: TrackLayoutSample, side: TrackSide) =>
  side === 'left' ? sample.roadLeft : sample.roadRight;

const outwardNormal = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 =>
  side === 'left'
    ? sample.leftNormal
    : [-sample.leftNormal[0], -sample.leftNormal[1]];

const pushVertex = (
  positions: number[],
  colors: number[],
  point: TrackVec2,
  y: number,
  color: THREE.Color,
) => {
  positions.push(point[0], y, point[1]);
  colors.push(color.r, color.g, color.b);
};

const makeKerbGeometry = (segments: KerbSegment[]) => {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const red = new THREE.Color('#9c2624');
  const ivory = new THREE.Color('#ddd8cc');

  segments.forEach((segment) => {
    const baseIndex = positions.length / 3;
    const innerA = edgeAt(segment.a, segment.side);
    const innerB = edgeAt(segment.b, segment.side);
    const outerA = add(innerA, outwardNormal(segment.a, segment.side), KERB_WIDTH);
    const outerB = add(innerB, outwardNormal(segment.b, segment.side), KERB_WIDTH);
    const color = segment.stripeIndex % 2 === 0 ? ivory : red;

    pushVertex(positions, colors, innerA, KERB_BASE_Y, color);
    pushVertex(positions, colors, outerA, KERB_BASE_Y, color);
    pushVertex(positions, colors, innerB, KERB_BASE_Y, color);
    pushVertex(positions, colors, outerB, KERB_BASE_Y, color);
    pushVertex(positions, colors, innerA, KERB_TOP_Y, color);
    pushVertex(positions, colors, outerA, KERB_TOP_Y, color);
    pushVertex(positions, colors, innerB, KERB_TOP_Y, color);
    pushVertex(positions, colors, outerB, KERB_TOP_Y, color);

    indices.push(
      baseIndex + 4, baseIndex + 5, baseIndex + 6,
      baseIndex + 5, baseIndex + 7, baseIndex + 6,
      baseIndex + 1, baseIndex + 3, baseIndex + 5,
      baseIndex + 3, baseIndex + 7, baseIndex + 5,
      baseIndex + 0, baseIndex + 4, baseIndex + 2,
      baseIndex + 4, baseIndex + 6, baseIndex + 2,
      baseIndex + 0, baseIndex + 1, baseIndex + 4,
      baseIndex + 1, baseIndex + 5, baseIndex + 4,
      baseIndex + 2, baseIndex + 6, baseIndex + 3,
      baseIndex + 3, baseIndex + 6, baseIndex + 7,
    );
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  // Each segment is authored in opposite winding on the two sides.
  segments.forEach((segment, index) => {
    if (segment.side === 'right') {
      const start = index * 30;
      for (let i = start; i < start + 30; i += 3)
        [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
    }
  });
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
};

export const Kerbs: React.FC<KerbsProps> = ({quality, seed = 2103}) => {
  const segments = useMemo(() => buildSegments(), []);
  const geometry = useMemo(() => makeKerbGeometry(segments), [segments]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: quality === 'final' ? 0.8 : 0.84,
        metalness: 0,
        vertexColors: true,
      }),
    [quality],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const apexSegments = segments.filter((segment) => segment.purpose === 'apex').length;
  const exitSegments = segments.filter((segment) => segment.purpose === 'exit').length;

  return (
    <group
      name="Y002_Racetrack_Kerbs"
      userData={{
        phase: 'Y002-RACETRACK-IDENTITY-02',
        deterministicSeed: seed,
        quality,
        kerbWidthMetres: KERB_WIDTH,
        kerbRiseMetres: KERB_TOP_Y - ASPHALT_Y,
        apexSegments,
        exitSegments,
      }}
    >
      <mesh name="RacingSurface_SelectedKerbs" geometry={geometry} material={material} receiveShadow />
    </group>
  );
};
