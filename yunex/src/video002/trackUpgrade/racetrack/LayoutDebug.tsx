import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {TRACK_LAYOUT_CONFIG, TRACK_LAYOUT_SAMPLES} from './layout';
import type {TrackLayoutSample, TrackVec2} from './types';

export type LayoutDebugProps = {
  y?: number;
  opacity?: number;
  showSamples?: boolean;
  showCarCorridor?: boolean;
};

const toV3 = (point: TrackVec2, y: number) => new THREE.Vector3(point[0], y, point[1]);

const lineGeometry = (
  samples: TrackLayoutSample[],
  pick: (sample: TrackLayoutSample) => TrackVec2,
  y: number,
) => new THREE.BufferGeometry().setFromPoints(samples.map((sample) => toV3(pick(sample), y)));

const ribbonGeometry = (
  samples: TrackLayoutSample[],
  left: (sample: TrackLayoutSample) => TrackVec2,
  right: (sample: TrackLayoutSample) => TrackVec2,
  y: number,
) => {
  const positions: number[] = [];
  const indices: number[] = [];
  samples.forEach((sample, index) => {
    const a = left(sample);
    const b = right(sample);
    positions.push(a[0], y, a[1], b[0], y, b[1]);
    if (index < samples.length - 1) {
      const i = index * 2;
      indices.push(i, i + 1, i + 2, i + 1, i + 3, i + 2);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

export const LayoutDebug: React.FC<LayoutDebugProps> = ({
  y = 0.025,
  opacity = 0.92,
  showSamples = false,
  showCarCorridor = true,
}) => {
  const geometry = useMemo(() => {
    const samples = TRACK_LAYOUT_SAMPLES;
    return {
      road: ribbonGeometry(samples, (s) => s.roadLeft, (s) => s.roadRight, y),
      runoffLeft: ribbonGeometry(samples, (s) => s.runoffLeft, (s) => s.roadLeft, y + 0.001),
      runoffRight: ribbonGeometry(samples, (s) => s.roadRight, (s) => s.runoffRight, y + 0.001),
      center: lineGeometry(samples, (s) => s.center, y + 0.012),
      roadLeft: lineGeometry(samples, (s) => s.roadLeft, y + 0.014),
      roadRight: lineGeometry(samples, (s) => s.roadRight, y + 0.014),
      barrierLeft: lineGeometry(samples, (s) => s.barrierLeft, y + 0.02),
      barrierRight: lineGeometry(samples, (s) => s.barrierRight, y + 0.02),
      landscapeLeft: lineGeometry(samples, (s) => s.landscapeLeft, y + 0.018),
      landscapeRight: lineGeometry(samples, (s) => s.landscapeRight, y + 0.018),
    };
  }, [y]);

  useEffect(
    () => () => {
      Object.values(geometry).forEach((item) => item.dispose());
    },
    [geometry],
  );

  const samplePoints = useMemo(
    () =>
      TRACK_LAYOUT_SAMPLES.filter((_, i) => i % 8 === 0).map((sample) => (
        <mesh key={sample.z} position={[sample.center[0], y + 0.035, sample.center[1]]}>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshBasicMaterial color="#f4d35e" />
        </mesh>
      )),
    [y],
  );

  return (
    <group
      name="Y002_RACETRACK_LAYOUT_DEBUG"
      userData={{
        phase: 'Y002-RACETRACK-IDENTITY-02',
        coordinateSpace: TRACK_LAYOUT_CONFIG.coordinateSpace,
        roadWidthMetres: TRACK_LAYOUT_CONFIG.roadWidth,
      }}
    >
      <mesh geometry={geometry.road}>
        <meshBasicMaterial color="#303638" transparent opacity={0.24 * opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry.runoffLeft}>
        <meshBasicMaterial color="#b3a47f" transparent opacity={0.18 * opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry.runoffRight}>
        <meshBasicMaterial color="#b3a47f" transparent opacity={0.18 * opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <line geometry={geometry.center}>
        <lineBasicMaterial color="#f4d35e" transparent opacity={opacity} />
      </line>
      <line geometry={geometry.roadLeft}>
        <lineBasicMaterial color="#f3f4f4" transparent opacity={opacity} />
      </line>
      <line geometry={geometry.roadRight}>
        <lineBasicMaterial color="#f3f4f4" transparent opacity={opacity} />
      </line>
      <line geometry={geometry.barrierLeft}>
        <lineBasicMaterial color="#ef8354" transparent opacity={0.9 * opacity} />
      </line>
      <line geometry={geometry.barrierRight}>
        <lineBasicMaterial color="#ef8354" transparent opacity={0.9 * opacity} />
      </line>
      <line geometry={geometry.landscapeLeft}>
        <lineBasicMaterial color="#72a276" transparent opacity={0.72 * opacity} />
      </line>
      <line geometry={geometry.landscapeRight}>
        <lineBasicMaterial color="#72a276" transparent opacity={0.72 * opacity} />
      </line>

      {showCarCorridor && (
        <mesh
          position={[
            TRACK_LAYOUT_CONFIG.straightCenterX,
            y + 0.008,
            (TRACK_LAYOUT_CONFIG.straightCorridorMinZ + TRACK_LAYOUT_CONFIG.straightCorridorMaxZ) / 2,
          ]}
        >
          <boxGeometry
            args={[
              TRACK_LAYOUT_CONFIG.lockedCarFootprintHalfWidth * 2,
              0.012,
              TRACK_LAYOUT_CONFIG.straightCorridorMaxZ - TRACK_LAYOUT_CONFIG.straightCorridorMinZ,
            ]}
          />
          <meshBasicMaterial color="#4cc9f0" transparent opacity={0.18 * opacity} depthWrite={false} />
        </mesh>
      )}

      {showSamples ? samplePoints : null}
    </group>
  );
};
