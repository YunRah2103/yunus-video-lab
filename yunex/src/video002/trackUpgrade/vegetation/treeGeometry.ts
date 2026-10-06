import * as THREE from 'three';
import type {VegetationQuality} from './layout';

export const makeCanopyGeometry = (
  quality: VegetationQuality,
  variant: 0 | 1 | 2,
) => {
  const widthSegments = quality === 'final' ? 10 : 8;
  const heightSegments = quality === 'final' ? 7 : 5;
  const geometry = new THREE.SphereGeometry(0.5, widthSegments, heightSegments);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const azimuth = Math.atan2(z, x);
    const vertical = y * 3.7;
    const breakup =
      1 +
      Math.sin(azimuth * (3 + variant) + vertical * 1.35 + variant * 0.8) * 0.085 +
      Math.sin(azimuth * 5.0 - vertical * 2.2 + variant * 1.9) * 0.04;
    const shoulder = 1 + Math.max(0, 0.22 - Math.abs(y)) * (0.16 + variant * 0.025);
    const taper = y > 0.28 ? 1 - (y - 0.28) * (0.18 + variant * 0.03) : 1;
    position.setXYZ(
      i,
      x * breakup * shoulder * taper,
      y * (1 + Math.sin(azimuth * 2 + variant) * 0.045),
      z * breakup * shoulder * taper,
    );
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
};

export const makeGrassClumpGeometry = () => {
  const positions: number[] = [];
  const blades = [
    {angle: 0.0, x: 0.00, z: 0.00, h: 0.34, w: 0.065},
    {angle: 0.72, x: 0.10, z: -0.04, h: 0.27, w: 0.055},
    {angle: 1.48, x: -0.09, z: 0.03, h: 0.31, w: 0.058},
    {angle: 2.24, x: 0.05, z: 0.10, h: 0.24, w: 0.05},
    {angle: 2.92, x: -0.05, z: -0.10, h: 0.29, w: 0.052},
  ];
  for (const blade of blades) {
    const dx = Math.cos(blade.angle) * blade.w;
    const dz = Math.sin(blade.angle) * blade.w;
    positions.push(
      blade.x - dx, 0, blade.z - dz,
      blade.x + dx, 0, blade.z + dz,
      blade.x + dx * 0.12, blade.h, blade.z + dz * 0.12,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
};
