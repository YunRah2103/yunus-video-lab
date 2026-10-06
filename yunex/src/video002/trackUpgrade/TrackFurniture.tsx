import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {
  sampleTrackAtLocalZ,
  TRACK_LAYOUT_CONFIG,
  TRACK_LAYOUT_SAMPLES,
} from './racetrack/layout';
import type {TrackLayoutSample, TrackVec2} from './racetrack/types';

export type TrackFurnitureProps = {
  quality: 'preview' | 'final';
  seed?: number;
};

type TrackSide = 'left' | 'right';

type BoxInstance = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
};

type CylinderInstance = {
  position: [number, number, number];
  rotation?: [number, number, number];
};

const RAIL_Y = 0.47;
const RAIL_PANEL_HEIGHT = 0.29;
const RAIL_PANEL_THICKNESS = 0.072;
const RAIL_START_Z = -25;
const RAIL_END_Z = 35.5;
const LEFT_FENCE_START_Z = 12.5;
const LEFT_FENCE_END_Z = 34.2;

const makeRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const barrierPoint = (sample: TrackLayoutSample, side: TrackSide): TrackVec2 =>
  side === 'left' ? sample.barrierLeft : sample.barrierRight;

const lerpPoint = (a: TrackVec2, b: TrackVec2, t: number): TrackVec2 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

const segmentPose = (a: TrackVec2, b: TrackVec2, y: number) => {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  return {
    position: [(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2] as [number, number, number],
    length: Math.hypot(dx, dz),
    yaw: Math.atan2(dx, dz),
  };
};

const InstancedBoxes: React.FC<{
  instances: readonly BoxInstance[];
  color: string;
  metalness?: number;
  roughness?: number;
}> = ({instances, color, metalness = 0, roughness = 0.8}) => {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness,
        roughness,
      }),
    [color, metalness, roughness],
  );
  const mesh = useMemo(
    () => new THREE.InstancedMesh(geometry, material, Math.max(1, instances.length)),
    [geometry, material, instances.length],
  );

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();

    instances.forEach((item, index) => {
      position.set(...item.position);
      scale.set(...item.scale);
      euler.set(...(item.rotation ?? [0, 0, 0]));
      quaternion.setFromEuler(euler);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.count = instances.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [instances, mesh]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      mesh.dispose();
    },
    [geometry, material, mesh],
  );

  return <primitive object={mesh} castShadow receiveShadow />;
};

const InstancedBolts: React.FC<{instances: readonly CylinderInstance[]}> = ({instances}) => {
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.024, 0.024, 0.045, 10), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#747b7b',
        metalness: 0.9,
        roughness: 0.24,
      }),
    [],
  );
  const mesh = useMemo(
    () => new THREE.InstancedMesh(geometry, material, Math.max(1, instances.length)),
    [geometry, material, instances.length],
  );

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3(1, 1, 1);
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();

    instances.forEach((item, index) => {
      position.set(...item.position);
      euler.set(...(item.rotation ?? [0, 0, Math.PI / 2]));
      quaternion.setFromEuler(euler);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.count = instances.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [instances, mesh]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      mesh.dispose();
    },
    [geometry, material, mesh],
  );

  return <primitive object={mesh} castShadow receiveShadow />;
};

const buildBarrierSide = (
  side: TrackSide,
  quality: TrackFurnitureProps['quality'],
  seed: number,
) => {
  const random = makeRng(seed + (side === 'left' ? 17 : 71));
  const panelStep = quality === 'final' ? 1.35 : 2.1;
  const postStep = quality === 'final' ? 1.35 : 2.1;
  const panels: BoxInstance[] = [];
  const upperRidges: BoxInstance[] = [];
  const lowerRidges: BoxInstance[] = [];
  const posts: BoxInstance[] = [];
  const spacers: BoxInstance[] = [];
  const bolts: CylinderInstance[] = [];

  for (let z = RAIL_START_Z; z < RAIL_END_Z - 1e-6; z += panelStep) {
    const nextZ = Math.min(RAIL_END_Z, z + panelStep);
    const a = barrierPoint(sampleTrackAtLocalZ(z), side);
    const b = barrierPoint(sampleTrackAtLocalZ(nextZ), side);
    const pose = segmentPose(a, b, RAIL_Y);

    panels.push({
      position: pose.position,
      scale: [RAIL_PANEL_THICKNESS, RAIL_PANEL_HEIGHT, Math.max(0.08, pose.length - 0.018)],
      rotation: [0, pose.yaw, 0],
    });
    upperRidges.push({
      position: [pose.position[0], RAIL_Y + 0.086, pose.position[2]],
      scale: [0.052, 0.058, Math.max(0.08, pose.length - 0.018)],
      rotation: [0, pose.yaw, 0],
    });
    lowerRidges.push({
      position: [pose.position[0], RAIL_Y - 0.086, pose.position[2]],
      scale: [0.052, 0.058, Math.max(0.08, pose.length - 0.018)],
      rotation: [0, pose.yaw, 0],
    });
  }

  for (let z = RAIL_START_Z; z <= RAIL_END_Z + 1e-6; z += postStep) {
    const sample = sampleTrackAtLocalZ(z);
    const point = barrierPoint(sample, side);
    const outwardSign = side === 'left' ? 1 : -1;
    const jitter = (random() - 0.5) * 0.018;
    const postX = point[0] + sample.leftNormal[0] * outwardSign * 0.16;
    const postZ = point[1] + sample.leftNormal[1] * outwardSign * 0.16 + jitter;
    const yaw = Math.atan2(sample.tangent[0], sample.tangent[1]);

    posts.push({
      position: [postX, 0.23, postZ],
      scale: [0.09, 0.9, 0.12],
      rotation: [0, yaw, 0],
    });
    spacers.push({
      position: [
        point[0] + sample.leftNormal[0] * outwardSign * 0.075,
        RAIL_Y,
        point[1] + sample.leftNormal[1] * outwardSign * 0.075,
      ],
      scale: [0.14, 0.16, 0.15],
      rotation: [0, yaw, 0],
    });
    const boltRows = quality === 'final' ? [RAIL_Y - 0.072, RAIL_Y + 0.072] : [RAIL_Y];
    for (const y of boltRows) {
      bolts.push({
        position: [point[0], y, point[1]],
        rotation: [0, yaw, Math.PI / 2],
      });
    }
  }

  return {panels, upperRidges, lowerRidges, posts, spacers, bolts};
};

const buildCatchFence = (quality: TrackFurnitureProps['quality']) => {
  const verticalSpacing = quality === 'final' ? 1.35 : 2.25;
  const horizontalSpacing = quality === 'final' ? 0.24 : 0.38;
  const bottom = 0.66;
  const top = quality === 'final' ? 2.12 : 1.86;
  const posts: BoxInstance[] = [];
  const horizontals: BoxInstance[] = [];

  for (let z = LEFT_FENCE_START_Z; z <= LEFT_FENCE_END_Z + 1e-6; z += verticalSpacing) {
    const sample = sampleTrackAtLocalZ(z);
    const point = lerpPoint(sample.barrierLeft, sample.landscapeLeft, 0.58);
    const yaw = Math.atan2(sample.tangent[0], sample.tangent[1]);
    posts.push({
      position: [point[0], (bottom + top) / 2, point[1]],
      scale: [0.045, top - bottom + 0.18, 0.06],
      rotation: [0, yaw, 0],
    });
  }

  for (let z = LEFT_FENCE_START_Z; z < LEFT_FENCE_END_Z - 1e-6; z += verticalSpacing) {
    const nextZ = Math.min(LEFT_FENCE_END_Z, z + verticalSpacing);
    const aSample = sampleTrackAtLocalZ(z);
    const bSample = sampleTrackAtLocalZ(nextZ);
    const a = lerpPoint(aSample.barrierLeft, aSample.landscapeLeft, 0.58);
    const b = lerpPoint(bSample.barrierLeft, bSample.landscapeLeft, 0.58);

    for (let y = bottom; y <= top + 1e-6; y += horizontalSpacing) {
      const pose = segmentPose(a, b, y);
      horizontals.push({
        position: pose.position,
        scale: [0.014, 0.014, pose.length],
        rotation: [0, pose.yaw, 0],
      });
    }
  }

  return {posts, horizontals};
};

const buildFurnitureLayout = (quality: TrackFurnitureProps['quality'], seed: number) => ({
  left: buildBarrierSide('left', quality, seed),
  right: buildBarrierSide('right', quality, seed),
  fence: buildCatchFence(quality),
});

export const TrackFurniture: React.FC<TrackFurnitureProps> = ({quality, seed = 2103}) => {
  const layout = useMemo(() => buildFurnitureLayout(quality, seed), [quality, seed]);

  return (
    <group
      name="YUNEX_002_TRACK_FURNITURE"
      userData={{
        yunexTrackIdentity: 'circuit-furniture',
        deterministicSeed: seed,
        quality,
        source: 'racetrack layout barrier and landscape lines',
      }}
    >
      <InstancedBoxes
        instances={[...layout.left.panels, ...layout.right.panels]}
        color="#a8adae"
        metalness={0.84}
        roughness={0.33}
      />
      <InstancedBoxes
        instances={[...layout.left.upperRidges, ...layout.right.upperRidges]}
        color="#c1c5c4"
        metalness={0.88}
        roughness={0.28}
      />
      <InstancedBoxes
        instances={[...layout.left.lowerRidges, ...layout.right.lowerRidges]}
        color="#8d9394"
        metalness={0.84}
        roughness={0.36}
      />
      <InstancedBoxes
        instances={[...layout.left.posts, ...layout.right.posts]}
        color="#6f7677"
        metalness={0.78}
        roughness={0.42}
      />
      <InstancedBoxes
        instances={[...layout.left.spacers, ...layout.right.spacers]}
        color="#555b5c"
        metalness={0.72}
        roughness={0.48}
      />
      <InstancedBolts instances={[...layout.left.bolts, ...layout.right.bolts]} />
      <InstancedBoxes
        instances={layout.fence.posts}
        color="#676e6f"
        metalness={0.76}
        roughness={0.48}
      />
      <InstancedBoxes
        instances={layout.fence.horizontals}
        color="#777e7f"
        metalness={0.72}
        roughness={0.52}
      />
    </group>
  );
};

const furnitureXs = TRACK_LAYOUT_SAMPLES.flatMap((sample) => [
  sample.barrierLeft[0],
  sample.barrierRight[0],
  sample.landscapeLeft[0],
]);
const furnitureZs = TRACK_LAYOUT_SAMPLES.flatMap((sample) => [
  sample.barrierLeft[1],
  sample.barrierRight[1],
  sample.landscapeLeft[1],
]);

export const TRACK_FURNITURE_BOUNDS = {
  xMin: Math.min(...furnitureXs) - 0.3,
  xMax: Math.max(...furnitureXs) + 0.3,
  yMin: -0.22,
  yMax: 2.25,
  zMin: Math.min(...furnitureZs),
  zMax: Math.max(...furnitureZs),
} as const;

export const TRACK_FURNITURE_INTEGRATION = {
  coordinateSpace: TRACK_LAYOUT_CONFIG.coordinateSpace,
  barrierRangeZ: [RAIL_START_Z, RAIL_END_Z] as const,
  tallFenceRangeZ: [LEFT_FENCE_START_Z, LEFT_FENCE_END_Z] as const,
  openingCameraFenceExclusionZ: [4.1, 10.6] as const,
  note:
    'Both guardrail runs derive from the pinned barrier lines. Tall catch fencing is confined to the outside of the distant bend and stays clear of the known opening camera corridor.',
} as const;
