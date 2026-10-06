import {GRASS_COLORS, SHRUB_COLORS, TREE_COLORS, TRUNK_COLORS} from './materials';
import {createSeededRandom, randomIndex, randomRange, randomSigned} from './rng';

export type VegetationQuality = 'preview' | 'final';

export type TreeSpec = {
  x: number;
  z: number;
  height: number;
  crownWidth: number;
  crownHeight: number;
  yaw: number;
  lean: number;
  asymmetry: number;
  variant: 0 | 1 | 2;
  crownColor: string;
  trunkColor: string;
  density: number;
};

export type ShrubSpec = {
  x: number;
  z: number;
  width: number;
  height: number;
  yaw: number;
  variant: 0 | 1 | 2;
  color: string;
};

export type GrassSpec = {
  x: number;
  z: number;
  scale: number;
  yaw: number;
  color: string;
};

export type VegetationLayout = {
  trees: TreeSpec[];
  shrubs: ShrubSpec[];
  grass: GrassSpec[];
};

const CAMERA_CORRIDOR_Z_MIN = 4.1;
const CAMERA_CORRIDOR_Z_MAX = 10.6;

const inOpeningCameraCorridor = (x: number, z: number) =>
  z >= CAMERA_CORRIDOR_Z_MIN && z <= CAMERA_CORRIDOR_Z_MAX && x > -10.4;

const pushTreeCluster = (
  trees: TreeSpec[],
  random: ReturnType<typeof createSeededRandom>,
  centerZ: number,
  count: number,
  farBias: number,
) => {
  for (let i = 0; i < count; i++) {
    const isFar = random() < farBias;
    let x = isFar
      ? randomRange(random, -15.8, -10.7)
      : randomRange(random, -10.8, -6.2);
    let z = centerZ + randomSigned(random, 3.2) + randomSigned(random, 1.4);
    if (inOpeningCameraCorridor(x, z)) {
      x = randomRange(random, -15.8, -11.1);
      z += randomSigned(random, 0.7);
    }
    const height = isFar
      ? randomRange(random, 3.2, 5.3)
      : randomRange(random, 2.5, 4.5);
    trees.push({
      x,
      z,
      height,
      crownWidth: randomRange(random, 1.55, 2.6) * (isFar ? 1.08 : 1),
      crownHeight: randomRange(random, 1.5, 2.65),
      yaw: randomRange(random, -Math.PI, Math.PI),
      lean: randomSigned(random, 0.055),
      asymmetry: randomSigned(random, 0.34),
      variant: randomIndex(random, 3) as 0 | 1 | 2,
      crownColor: TREE_COLORS[randomIndex(random, TREE_COLORS.length)],
      trunkColor: TRUNK_COLORS[randomIndex(random, TRUNK_COLORS.length)],
      density: randomRange(random, 0.82, 1.16),
    });
  }
};

const pushShrubCluster = (
  shrubs: ShrubSpec[],
  random: ReturnType<typeof createSeededRandom>,
  centerZ: number,
  count: number,
) => {
  for (let i = 0; i < count; i++) {
    let x = randomRange(random, -9.4, -4.45);
    let z = centerZ + randomSigned(random, 4.0) + randomSigned(random, 1.25);
    if (inOpeningCameraCorridor(x, z)) {
      x = randomRange(random, -11.2, -9.4);
    }
    shrubs.push({
      x,
      z,
      width: randomRange(random, 0.7, 1.65),
      height: randomRange(random, 0.52, 1.35),
      yaw: randomRange(random, -Math.PI, Math.PI),
      variant: randomIndex(random, 3) as 0 | 1 | 2,
      color: SHRUB_COLORS[randomIndex(random, SHRUB_COLORS.length)],
    });
  }
};

const pushGrass = (
  grass: GrassSpec[],
  random: ReturnType<typeof createSeededRandom>,
  count: number,
  zMin: number,
  zMax: number,
) => {
  let attempts = 0;
  while (grass.length < count && attempts < count * 8) {
    attempts++;
    const x = randomRange(random, -5.45, -3.98);
    const z = randomRange(random, zMin, zMax);
    if (inOpeningCameraCorridor(x, z)) continue;
    const clusterWave = Math.sin(z * 0.52) + Math.sin(z * 0.17 + 1.7);
    if (random() > 0.66 + clusterWave * 0.11) continue;
    grass.push({
      x,
      z,
      scale: randomRange(random, 0.58, 1.28),
      yaw: randomRange(random, -Math.PI, Math.PI),
      color: GRASS_COLORS[randomIndex(random, GRASS_COLORS.length)],
    });
  }
};

export const buildVegetationLayout = (
  seed = 2103,
  quality: VegetationQuality = 'final',
): VegetationLayout => {
  const random = createSeededRandom(seed);
  const trees: TreeSpec[] = [];
  const shrubs: ShrubSpec[] = [];
  const grass: GrassSpec[] = [];

  const centers =
    quality === 'final'
      ? [-24, -16, -8, 1, 13, 23, 34]
      : [-21, -10, 1, 14, 28];
  const treeTargets = quality === 'final' ? [7, 6, 6, 7, 6, 6, 6] : [6, 5, 5, 6, 6];
  const shrubTargets = quality === 'final' ? [11, 10, 9, 10, 10, 10, 10] : [8, 8, 8, 8, 8];

  centers.forEach((center, index) => {
    pushTreeCluster(trees, random, center, treeTargets[index], 0.34 + (index % 3) * 0.08);
    pushShrubCluster(shrubs, random, center + randomSigned(random, 1.6), shrubTargets[index]);
  });

  pushGrass(grass, random, quality === 'final' ? 380 : 180, -29, 39);

  return {trees, shrubs, grass};
};

export type VegetationBudget = {
  treeCount: number;
  shrubCount: number;
  grassCount: number;
  approximateTriangles: number;
  approximateDrawCalls: number;
  transparentObjectCount: number;
};

export const estimateVegetationBudget = (layout: VegetationLayout, quality: VegetationQuality): VegetationBudget => {
  const canopyTriangles = quality === 'final' ? 108 : 70;
  const treeLobes = layout.trees.length * 5;
  const shrubLobes = layout.shrubs.length * 3;
  const trunkTriangles = layout.trees.length * 28;
  const branchTriangles = layout.trees.length * 2 * 24;
  const grassTriangles = layout.grass.length * 5;
  return {
    treeCount: layout.trees.length,
    shrubCount: layout.shrubs.length,
    grassCount: layout.grass.length,
    approximateTriangles:
      (treeLobes + shrubLobes) * canopyTriangles +
      trunkTriangles +
      branchTriangles +
      grassTriangles,
    approximateDrawCalls: 6,
    transparentObjectCount: 0,
  };
};

export const vegetationLayoutSignature = (layout: VegetationLayout) =>
  JSON.stringify(layout);

export const validateVegetationLayout = (layout: VegetationLayout) => {
  const violations: string[] = [];
  for (const tree of layout.trees) {
    if (tree.x > -6.15) violations.push(`tree inside protected trackside region at x=${tree.x.toFixed(2)}`);
    if (inOpeningCameraCorridor(tree.x, tree.z)) violations.push('tree inside opening camera corridor');
  }
  for (const shrub of layout.shrubs) {
    if (shrub.x > -4.4) violations.push(`shrub inside protected trackside region at x=${shrub.x.toFixed(2)}`);
    if (inOpeningCameraCorridor(shrub.x, shrub.z)) violations.push('shrub inside opening camera corridor');
  }
  for (const clump of layout.grass) {
    if (clump.x > -3.95) violations.push(`grass inside protected trackside region at x=${clump.x.toFixed(2)}`);
    if (inOpeningCameraCorridor(clump.x, clump.z)) violations.push('grass inside opening camera corridor');
  }
  return violations;
};
