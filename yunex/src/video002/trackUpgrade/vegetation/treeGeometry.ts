import * as THREE from 'three';
import type {VegetationQuality} from './layout';

import {makeFoliageGeometry} from './foliageGeometry';
export const makeCanopyGeometry=(quality:VegetationQuality,variant:0|1|2)=>makeFoliageGeometry(.5,2103+variant,quality==='final'?64:40);

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
