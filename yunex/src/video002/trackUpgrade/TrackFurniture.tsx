import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';

export type TrackFurnitureProps = {
  quality: 'preview' | 'final';
  seed?: number;
};

type BoxInstance = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
};

type CylinderInstance = {
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
};

const RAIL_X = -3.62;
const RAIL_Y = 0.48;
const RAIL_START_Z = -17.2;
const RAIL_END_Z = 20.6;
const PANEL_LENGTH = 2.8;

const makeRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
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
    () => new THREE.InstancedMesh(geometry, material, instances.length),
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

  return <primitive object={mesh} />;
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
    () => new THREE.InstancedMesh(geometry, material, instances.length),
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
      scale.set(...(item.scale ?? [1, 1, 1]));
      euler.set(...(item.rotation ?? [0, 0, Math.PI / 2]));
      quaternion.setFromEuler(euler);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });
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

  return <primitive object={mesh} />;
};

const buildFurnitureLayout = (seed: number, quality: TrackFurnitureProps['quality']) => {
  const random = makeRng(seed);
  const panelCount = Math.ceil((RAIL_END_Z - RAIL_START_Z) / PANEL_LENGTH);
  const panels: BoxInstance[] = [];
  const upperRidges: BoxInstance[] = [];
  const lowerRidges: BoxInstance[] = [];
  const valleys: BoxInstance[] = [];
  const jointPlates: BoxInstance[] = [];

  for (let i = 0; i < panelCount; i++) {
    const panelStart = RAIL_START_Z + PANEL_LENGTH * i;
    const length = Math.min(PANEL_LENGTH - 0.018, RAIL_END_Z - panelStart);
    if (length <= 0) continue;
    const z = panelStart + length / 2;

    panels.push({
      position: [RAIL_X, RAIL_Y, z],
      scale: [0.07, 0.285, length],
    });
    upperRidges.push({
      position: [RAIL_X + 0.046, RAIL_Y + 0.087, z],
      scale: [0.052, 0.058, length],
    });
    lowerRidges.push({
      position: [RAIL_X + 0.046, RAIL_Y - 0.087, z],
      scale: [0.052, 0.058, length],
    });
    valleys.push({
      position: [RAIL_X - 0.018, RAIL_Y, z],
      scale: [0.032, 0.05, length],
    });

    if (i > 0) {
      jointPlates.push({
        position: [RAIL_X + 0.018, RAIL_Y, RAIL_START_Z + PANEL_LENGTH * i],
        scale: [0.095, 0.305, 0.115],
      });
    }
  }

  const postSpacing = quality === 'final' ? 1.4 : 2.1;
  const postCount = Math.floor((RAIL_END_Z - RAIL_START_Z) / postSpacing) + 1;
  const posts: BoxInstance[] = [];
  const postFlanges: BoxInstance[] = [];
  const spacers: BoxInstance[] = [];
  const bolts: CylinderInstance[] = [];

  for (let i = 0; i < postCount; i++) {
    const nominalZ = RAIL_START_Z + i * postSpacing;
    const z = nominalZ + (random() - 0.5) * 0.025;
    if (z > RAIL_END_Z) break;

    posts.push({
      position: [RAIL_X - 0.155, 0.23, z],
      scale: [0.085, 0.9, 0.115],
    });
    postFlanges.push(
      {
        position: [RAIL_X - 0.115, 0.23, z - 0.072],
        scale: [0.07, 0.9, 0.025],
      },
      {
        position: [RAIL_X - 0.115, 0.23, z + 0.072],
        scale: [0.07, 0.9, 0.025],
      },
    );
    spacers.push({
      position: [RAIL_X - 0.085, RAIL_Y, z],
      scale: [0.13, 0.16, 0.15],
    });

    const boltRows = quality === 'final' ? [RAIL_Y - 0.072, RAIL_Y + 0.072] : [RAIL_Y];
    for (const y of boltRows) {
      bolts.push({
        position: [RAIL_X + 0.075, y, z],
        rotation: [0, 0, Math.PI / 2],
      });
    }
  }

  const fenceStart = 6.2 + (random() - 0.5) * 0.3;
  const fenceEnd = 17.1;
  const fenceX = RAIL_X - 0.64;
  const fenceBottom = 0.68;
  const fenceTop = quality === 'final' ? 2.12 : 1.86;
  const fenceBoxes: BoxInstance[] = [];

  for (let z = fenceStart; z <= fenceEnd + 0.001; z += 2.7) {
    fenceBoxes.push({
      position: [fenceX, (fenceBottom + fenceTop) / 2, z],
      scale: [0.045, fenceTop - fenceBottom + 0.18, 0.06],
    });
  }

  const horizontalStep = quality === 'final' ? 0.19 : 0.28;
  for (let y = fenceBottom; y <= fenceTop + 0.001; y += horizontalStep) {
    fenceBoxes.push({
      position: [fenceX + 0.012, y, (fenceStart + fenceEnd) / 2],
      scale: [0.012, 0.012, fenceEnd - fenceStart],
    });
  }

  const verticalStep = quality === 'final' ? 0.42 : 0.62;
  for (let z = fenceStart; z <= fenceEnd + 0.001; z += verticalStep) {
    fenceBoxes.push({
      position: [fenceX + 0.012, (fenceBottom + fenceTop) / 2, z],
      scale: [0.012, fenceTop - fenceBottom, 0.012],
    });
  }

  return {
    panels,
    upperRidges,
    lowerRidges,
    valleys,
    jointPlates,
    posts,
    postFlanges,
    spacers,
    bolts,
    fenceBoxes,
  };
};

export const TrackFurniture: React.FC<TrackFurnitureProps> = ({quality, seed = 2103}) => {
  const layout = useMemo(() => buildFurnitureLayout(seed, quality), [quality, seed]);

  return (
    <group name="YUNEX_002_TRACK_FURNITURE">
      <InstancedBoxes
        instances={layout.panels}
        color="#a8adae"
        metalness={0.84}
        roughness={0.33}
      />
      <InstancedBoxes
        instances={layout.upperRidges}
        color="#c1c5c4"
        metalness={0.88}
        roughness={0.28}
      />
      <InstancedBoxes
        instances={layout.lowerRidges}
        color="#8d9394"
        metalness={0.84}
        roughness={0.36}
      />
      <InstancedBoxes
        instances={layout.valleys}
        color="#747b7c"
        metalness={0.8}
        roughness={0.42}
      />
      <InstancedBoxes
        instances={layout.jointPlates}
        color="#969c9d"
        metalness={0.86}
        roughness={0.31}
      />
      <InstancedBoxes
        instances={layout.posts}
        color="#6f7677"
        metalness={0.78}
        roughness={0.42}
      />
      <InstancedBoxes
        instances={layout.postFlanges}
        color="#7d8485"
        metalness={0.8}
        roughness={0.4}
      />
      <InstancedBoxes
        instances={layout.spacers}
        color="#555b5c"
        metalness={0.72}
        roughness={0.48}
      />
      <InstancedBolts instances={layout.bolts} />
      <InstancedBoxes
        instances={layout.fenceBoxes}
        color="#777e7f"
        metalness={0.76}
        roughness={0.48}
      />
    </group>
  );
};

export const TRACK_FURNITURE_BOUNDS = {
  xMin: RAIL_X - 0.72,
  xMax: RAIL_X + 0.14,
  yMin: -0.22,
  yMax: 2.25,
  zMin: RAIL_START_Z,
  zMax: RAIL_END_Z,
} as const;
