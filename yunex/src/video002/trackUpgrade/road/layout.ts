export type RoadQuality = 'preview' | 'final';

export type FlatPatch = {
  x: number;
  z: number;
  scaleX: number;
  scaleZ: number;
  yaw: number;
  opacity: number;
};

export type KerbChip = {
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleZ: number;
  yaw: number;
};

export const ROAD_LOCAL = {
  asphaltY: -0.0104,
  macroPatchY: -0.00915,
  rubberY: -0.00825,
  vergeY: -0.0097,
  gravelY: -0.0087,
  kerbBaseY: -0.006,
  kerbTopY: 0.059,
  roadMinX: -3.22,
  roadMaxX: 14.2,
  roadMinZ: -42,
  roadMaxZ: 38,
  vergeMinX: -16,
  vergeMaxX: -3.18,
  coverageMinX: -16,
  coverageMaxX: 14.2,
  coverageMinZ: -42,
  coverageMaxZ: 38,
  kerbCenterX: -2.94,
  kerbStartZ: -22,
  kerbStep: 0.48,
  kerbCount: 80,
  kerbWidth: 0.56,
  kerbHeight: 0.065,
  kerbDepth: 0.455,
  nominalCarTrackLocalX: -1,
} as const;

const u32 = (value: number) => value >>> 0;
const hashU32 = (value: number) => {
  let x = u32(value);
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return u32(x);
};

export const seededUnit = (seed: number, index: number, salt = 0) =>
  hashU32(Math.imul(seed | 0, 0x9e3779b1) ^ Math.imul(index + 1, 0x85ebca77) ^ salt) / 4294967296;

const range = (seed: number, index: number, salt: number, min: number, max: number) =>
  min + (max - min) * seededUnit(seed, index, salt);

export const buildRoadDecor = (seed: number, quality: RoadQuality) => {
  const macroCount = quality === 'final' ? 17 : 10;
  const rubberCount = quality === 'final' ? 28 : 16;
  const gravelCount = quality === 'final' ? 22 : 12;
  const chipCount = quality === 'final' ? 34 : 18;

  const macroPatches: FlatPatch[] = Array.from({length: macroCount}, (_, i) => ({
    x: range(seed, i, 11, -1.8, 11.8),
    z: range(seed, i, 17, -30, 25),
    scaleX: range(seed, i, 23, 1.7, 5.2),
    scaleZ: range(seed, i, 29, 2.2, 7.8),
    yaw: range(seed, i, 31, -0.75, 0.75),
    opacity: range(seed, i, 37, 0.025, 0.075),
  }));

  const rubberStreaks: FlatPatch[] = Array.from({length: rubberCount}, (_, i) => {
    const lane = i % 2 === 0 ? -1.58 : -0.38;
    return {
      x: lane + range(seed, i, 41, -0.16, 0.16),
      z: range(seed, i, 43, -16, 12),
      scaleX: range(seed, i, 47, 0.055, 0.13),
      scaleZ: range(seed, i, 53, 0.9, 3.8),
      yaw: range(seed, i, 59, -0.055, 0.055),
      opacity: range(seed, i, 61, 0.07, 0.17),
    };
  });

  const gravelPatches: FlatPatch[] = Array.from({length: gravelCount}, (_, i) => ({
    x: range(seed, i, 67, -5.3, -3.25),
    z: range(seed, i, 71, -29, 26),
    scaleX: range(seed, i, 73, 0.18, 0.65),
    scaleZ: range(seed, i, 79, 0.35, 1.5),
    yaw: range(seed, i, 83, -1.2, 1.2),
    opacity: range(seed, i, 89, 0.045, 0.13),
  }));

  const kerbChips: KerbChip[] = Array.from({length: chipCount}, (_, i) => {
    const segment = Math.floor(range(seed, i, 97, 1, ROAD_LOCAL.kerbCount - 2));
    const segmentZ = ROAD_LOCAL.kerbStartZ + segment * ROAD_LOCAL.kerbStep;
    return {
      x: ROAD_LOCAL.kerbCenterX + range(seed, i, 101, -0.20, 0.20),
      y: ROAD_LOCAL.kerbTopY + 0.0015,
      z: segmentZ + range(seed, i, 103, -0.16, 0.16),
      scaleX: range(seed, i, 107, 0.045, 0.17),
      scaleZ: range(seed, i, 109, 0.025, 0.09),
      yaw: range(seed, i, 113, -0.55, 0.55),
    };
  });

  return {macroPatches, rubberStreaks, gravelPatches, kerbChips};
};

export const estimateRoadSurfaceCost = (quality: RoadQuality) => {
  const textureSize = quality === 'final' ? 1024 : 512;
  const textureBytes = textureSize * textureSize * 4 * 2;
  const mipFactor = 4 / 3;
  const decor = buildRoadDecor(2103, quality);
  return {
    textureSize,
    approximateTextureBytesWithMipmaps: Math.ceil(textureBytes * mipFactor),
    instancedDrawCalls: 5,
    instances:
      ROAD_LOCAL.kerbCount +
      decor.macroPatches.length +
      decor.rubberStreaks.length +
      decor.gravelPatches.length +
      decor.kerbChips.length,
  };
};

export const worldXZToTrackLocal = (worldX: number, worldZ: number): [number, number] => [
  -worldX - 1,
  -worldZ,
];
