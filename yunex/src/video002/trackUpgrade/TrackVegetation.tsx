import React, {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {
  buildVegetationLayout,
  type ShrubSpec,
  type TreeSpec,
  type VegetationQuality,
} from './vegetation/layout';
import {makeCanopyGeometry, makeGrassClumpGeometry} from './vegetation/treeGeometry';

export type TrackVegetationProps = {
  quality: 'preview' | 'final';
  seed?: number;
};

type InstanceTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
};

const InstancedLayer: React.FC<{
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  instances: InstanceTransform[];
}> = ({geometry, material, instances}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const object = new THREE.Object3D();
    const color = new THREE.Color();
    instances.forEach((item, index) => {
      object.position.set(...item.position);
      object.rotation.set(...item.rotation);
      object.scale.set(...item.scale);
      object.updateMatrix();
      ref.current!.setMatrixAt(index, object.matrix);
      ref.current!.setColorAt(index, color.set(item.color));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [instances]);
  if (instances.length === 0) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, instances.length]}
      castShadow={false}
      receiveShadow={false}
      frustumCulled={false}
    />
  );
};

const canopyPatterns = [
  [
    [-0.28, 0.67, 0.02, 0.56, 0.44, 0.50],
    [0.30, 0.72, -0.09, 0.51, 0.48, 0.46],
    [-0.06, 0.92, 0.13, 0.58, 0.50, 0.54],
    [-0.39, 0.93, -0.06, 0.43, 0.40, 0.42],
    [0.22, 1.13, 0.02, 0.42, 0.37, 0.40],
  ],
  [
    [-0.14, 0.65, -0.05, 0.48, 0.50, 0.46],
    [0.34, 0.83, 0.04, 0.44, 0.45, 0.42],
    [-0.36, 0.84, 0.09, 0.47, 0.43, 0.44],
    [0.06, 1.02, -0.10, 0.52, 0.47, 0.49],
    [0.16, 1.24, 0.04, 0.36, 0.34, 0.35],
  ],
  [
    [-0.31, 0.71, 0.08, 0.50, 0.42, 0.47],
    [0.29, 0.66, -0.08, 0.55, 0.42, 0.50],
    [-0.02, 0.91, 0.01, 0.61, 0.46, 0.56],
    [-0.43, 1.02, -0.04, 0.38, 0.36, 0.39],
    [0.31, 1.12, 0.07, 0.40, 0.34, 0.38],
  ],
] as const;

const treeCanopyInstances = (tree: TreeSpec): InstanceTransform[] => {
  const trunkTop = tree.height * 0.47;
  const pattern = canopyPatterns[tree.variant];
  return pattern.map((v, index) => ({
    position: [
      tree.x + v[0] * tree.crownWidth + tree.asymmetry * (index % 2 === 0 ? 0.22 : -0.12),
      trunkTop + v[1] * tree.crownHeight,
      tree.z + v[2] * tree.crownWidth,
    ],
    rotation: [0, tree.yaw + index * 0.73, 0],
    scale: [
      v[3] * tree.crownWidth * tree.density,
      v[4] * tree.crownHeight * tree.density,
      v[5] * tree.crownWidth * tree.density,
    ],
    color: tree.crownColor,
  }));
};

const shrubCanopyInstances = (shrub: ShrubSpec): InstanceTransform[] => {
  const lobes = [
    [-0.27, 0.34, 0.02, 0.58, 0.54, 0.56],
    [0.26, 0.39, -0.05, 0.64, 0.62, 0.60],
    [0.02, 0.57, 0.10, 0.54, 0.58, 0.52],
  ] as const;
  return lobes.map((v, index) => ({
    position: [
      shrub.x + v[0] * shrub.width,
      v[1] * shrub.height,
      shrub.z + v[2] * shrub.width,
    ],
    rotation: [0, shrub.yaw + index * 0.91, 0],
    scale: [
      v[3] * shrub.width,
      v[4] * shrub.height,
      v[5] * shrub.width,
    ],
    color: shrub.color,
  }));
};

const buildRenderInstances = (quality: VegetationQuality, seed: number) => {
  const layout = buildVegetationLayout(seed, quality);
  const trunks: InstanceTransform[] = [];
  const branches: InstanceTransform[] = [];
  const canopy: [InstanceTransform[], InstanceTransform[], InstanceTransform[]] = [[], [], []];

  layout.trees.forEach((tree, treeIndex) => {
    const trunkHeight = tree.height * 0.58;
    const trunkRadius = Math.max(0.07, tree.height * 0.038);
    trunks.push({
      position: [tree.x, trunkHeight * 0.5, tree.z],
      rotation: [0, tree.yaw, tree.lean],
      scale: [trunkRadius, trunkHeight, trunkRadius],
      color: tree.trunkColor,
    });

    const branchY = trunkHeight * 0.72;
    const branchLength = tree.height * 0.34;
    branches.push(
      {
        position: [tree.x - tree.crownWidth * 0.11, branchY, tree.z],
        rotation: [0.08, tree.yaw + 0.45, 0.72 + tree.lean],
        scale: [trunkRadius * 0.55, branchLength, trunkRadius * 0.55],
        color: tree.trunkColor,
      },
      {
        position: [tree.x + tree.crownWidth * 0.10, branchY + tree.height * 0.04, tree.z - 0.04],
        rotation: [-0.12, tree.yaw - 0.8, -0.66 + tree.lean],
        scale: [trunkRadius * 0.48, branchLength * 0.86, trunkRadius * 0.48],
        color: tree.trunkColor,
      },
    );

    treeCanopyInstances(tree).forEach((item, lobeIndex) => {
      canopy[(tree.variant + lobeIndex + treeIndex) % 3].push(item);
    });
  });

  layout.shrubs.forEach((shrub, shrubIndex) => {
    shrubCanopyInstances(shrub).forEach((item, lobeIndex) => {
      canopy[(shrub.variant + lobeIndex + shrubIndex) % 3].push(item);
    });
  });

  const grass: InstanceTransform[] = layout.grass.map((clump) => ({
    position: [clump.x, 0.015, clump.z],
    rotation: [0, clump.yaw, 0],
    scale: [clump.scale, clump.scale, clump.scale],
    color: clump.color,
  }));

  return {layout, trunks, branches, canopy, grass};
};

export const TrackVegetation: React.FC<TrackVegetationProps> = ({
  quality,
  seed = 2103,
}) => {
  const render = useMemo(() => buildRenderInstances(quality, seed), [quality, seed]);
  const canopy0 = useMemo(() => makeCanopyGeometry(quality, 0), [quality]);
  const canopy1 = useMemo(() => makeCanopyGeometry(quality, 1), [quality]);
  const canopy2 = useMemo(() => makeCanopyGeometry(quality, 2), [quality]);
  const trunkGeometry = useMemo(() => new THREE.CylinderGeometry(0.5, 0.68, 1, 7, 1), []);
  const branchGeometry = useMemo(() => new THREE.CylinderGeometry(0.35, 0.48, 1, 6, 1), []);
  const grassGeometry = useMemo(makeGrassClumpGeometry, []);

  const foliageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.97,
        metalness: 0,
        vertexColors: true,
      }),
    [],
  );
  const trunkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.94,
        metalness: 0,
        vertexColors: true,
      }),
    [],
  );
  const grassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
        vertexColors: true,
      }),
    [],
  );

  useEffect(
    () => () => {
      canopy0.dispose();
      canopy1.dispose();
      canopy2.dispose();
      trunkGeometry.dispose();
      branchGeometry.dispose();
      grassGeometry.dispose();
      foliageMaterial.dispose();
      trunkMaterial.dispose();
      grassMaterial.dispose();
    },
    [
      branchGeometry,
      canopy0,
      canopy1,
      canopy2,
      foliageMaterial,
      grassGeometry,
      grassMaterial,
      trunkGeometry,
      trunkMaterial,
    ],
  );

  return (
    <group name="Y002_TrackVegetation">
      <InstancedLayer geometry={trunkGeometry} material={trunkMaterial} instances={render.trunks}/>
      <InstancedLayer geometry={branchGeometry} material={trunkMaterial} instances={render.branches}/>
      <InstancedLayer geometry={canopy0} material={foliageMaterial} instances={render.canopy[0]}/>
      <InstancedLayer geometry={canopy1} material={foliageMaterial} instances={render.canopy[1]}/>
      <InstancedLayer geometry={canopy2} material={foliageMaterial} instances={render.canopy[2]}/>
      <InstancedLayer geometry={grassGeometry} material={grassMaterial} instances={render.grass}/>
    </group>
  );
};
