import * as THREE from 'three';
import {type RoadQuality} from './layout';

const clampByte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

const hash01 = (x: number, y: number, seed: number) => {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  n = (n ^ (n >>> 13)) >>> 0;
  n = Math.imul(n, 1274126177) >>> 0;
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
};

const smooth = (t: number) => t * t * (3 - 2 * t);

const valueNoise = (x: number, y: number, cell: number, seed: number) => {
  const gx = Math.floor(x / cell);
  const gy = Math.floor(y / cell);
  const tx = smooth((x - gx * cell) / cell);
  const ty = smooth((y - gy * cell) / cell);
  const a = hash01(gx, gy, seed);
  const b = hash01(gx + 1, gy, seed);
  const c = hash01(gx, gy + 1, seed);
  const d = hash01(gx + 1, gy + 1, seed);
  const ab = THREE.MathUtils.lerp(a, b, tx);
  const cd = THREE.MathUtils.lerp(c, d, tx);
  return THREE.MathUtils.lerp(ab, cd, ty);
};

const makeTexture = (
  quality: RoadQuality,
  seed: number,
  kind: 'asphalt' | 'verge',
) => {
  const size = quality === 'final' ? 1024 : 512;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const micro = hash01(x, y, seed + (kind === 'asphalt' ? 7 : 71)) - 0.5;
      const medium = valueNoise(x, y, Math.max(12, size / 36), seed + 113) - 0.5;
      const macro = valueNoise(x, y, Math.max(64, size / 5.5), seed + 211) - 0.5;
      const fleck = hash01(x, y, seed + 991);

      let r: number;
      let g: number;
      let b: number;
      if (kind === 'asphalt') {
        const base = 91 + micro * 18 + medium * 13 + macro * 22;
        const aggregate = fleck > 0.989 ? 24 : fleck < 0.006 ? -17 : 0;
        r = base + aggregate;
        g = base + aggregate + 1.8;
        b = base + aggregate + 2.8;
      } else {
        const dry = fleck > 0.96 ? 13 : 0;
        r = 83 + micro * 16 + medium * 16 + macro * 19 + dry;
        g = 80 + micro * 13 + medium * 17 + macro * 14 + dry * 0.45;
        b = 61 + micro * 10 + medium * 13 + macro * 10;
      }

      const i = (y * size + x) * 4;
      data[i] = clampByte(r);
      data[i + 1] = clampByte(g);
      data[i + 2] = clampByte(b);
      data[i + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  texture.name = `YUNEX002_${kind}_${quality}_${seed}`;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = quality === 'final' ? 8 : 4;
  if (kind === 'asphalt') texture.repeat.set(1.35, 4.65);
  else texture.repeat.set(2.1, 8.4);
  texture.needsUpdate = true;
  return texture;
};

export const createAsphaltTexture = (quality: RoadQuality, seed: number) =>
  makeTexture(quality, seed, 'asphalt');

export const createVergeTexture = (quality: RoadQuality, seed: number) =>
  makeTexture(quality, seed + 1709, 'verge');

export const createRoadTextures = (quality: RoadQuality, seed: number) => ({
  asphalt: createAsphaltTexture(quality, seed),
  verge: createVergeTexture(quality, seed),
});
