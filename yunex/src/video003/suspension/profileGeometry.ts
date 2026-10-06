import * as THREE from 'three';

export type TeardropGeometryOptions = {
  chordMetres: number;
  thicknessMetres: number;
  profileSegments?: number;
};

/**
 * Unit-length prism along local +X. Cross-section is a symmetric NACA-style
 * teardrop: rounded leading region at local +Z, tapered trailing region at local -Z.
 * This is explanatory geometry, not a measured Porsche section.
 */
export const createTeardropLinkGeometry = ({
  chordMetres,
  thicknessMetres,
  profileSegments = 16,
}: TeardropGeometryOptions) => {
  const n = Math.max(8, Math.floor(profileSegments));
  const samples: Array<{x: number; y: number}> = [];
  let maxRaw = 0;
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    const y = 5 * 0.12 * (
      0.2969 * Math.sqrt(Math.max(0, x))
      - 0.1260 * x
      - 0.3516 * x * x
      + 0.2843 * x * x * x
      - 0.1015 * x * x * x * x
    );
    maxRaw = Math.max(maxRaw, y);
    samples.push({x, y});
  }
  const scale = (thicknessMetres * 0.5) / Math.max(1e-9, maxRaw);
  const profile: Array<[number, number]> = [];
  for (const {x, y} of samples) profile.push([y * scale, chordMetres * (0.5 - x)]);
  for (let i = samples.length - 2; i > 0; i--) {
    const {x, y} = samples[i];
    profile.push([-y * scale, chordMetres * (0.5 - x)]);
  }

  const vertices: number[] = [];
  const indices: number[] = [];
  const count = profile.length;
  for (const x of [-0.5, 0.5]) {
    for (const [y, z] of profile) vertices.push(x, y, z);
  }
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    indices.push(i, j, count + j, i, count + j, count + i);
  }
  for (let i = 1; i < count - 1; i++) {
    indices.push(0, i + 1, i);
    indices.push(count, count + i, count + i + 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
};

export const profileInspection = (chordMetres = 0.112, thicknessMetres = 0.036) => ({
  leadingZ: chordMetres * 0.5,
  trailingZ: -chordMetres * 0.5,
  maxThicknessMetres: thicknessMetres,
  intendedRelativeAirflow: '+Z to -Z in car-local coordinates',
});
