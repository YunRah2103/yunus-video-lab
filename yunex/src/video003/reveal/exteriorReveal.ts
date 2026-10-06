import * as THREE from 'three';
import {resolveY003RevealVisualState} from './revealState';

export type Y003RevealTarget =
  | 'Body'
  | 'Glass'
  | 'Grilles'
  | 'Interior';

type CapturedMesh = {
  mesh: THREE.Mesh;
  target: Y003RevealTarget;
  original: THREE.Material | THREE.Material[];
  clones: THREE.Material[];
};

const TARGETS: Y003RevealTarget[] = ['Body', 'Glass', 'Grilles', 'Interior'];

const opacityFor = (
  target: Y003RevealTarget,
  state: ReturnType<typeof resolveY003RevealVisualState>,
) => {
  switch (target) {
    case 'Body': return state.bodyOpacity;
    case 'Glass': return state.glassOpacity;
    case 'Grilles': return state.grillesOpacity;
    case 'Interior': return state.interiorOpacity;
  }
};

export type Y003ExteriorRevealController = {
  apply: (cueProgress: number, worldClipPlane?: THREE.Plane) => void;
  restore: () => void;
  dispose: () => void;
  capturedMeshCount: number;
  missingTargets: Y003RevealTarget[];
};

export const createY003ExteriorRevealController = (
  root: THREE.Object3D,
): Y003ExteriorRevealController => {
  const captured: CapturedMesh[] = [];
  const seen = new Set<THREE.Mesh>();
  const missingTargets: Y003RevealTarget[] = [];

  for (const target of TARGETS) {
    const group = root.getObjectByName(target);
    if (!group) {
      missingTargets.push(target);
      continue;
    }
    group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || seen.has(mesh)) return;
      seen.add(mesh);
      const original = mesh.material;
      const materials = Array.isArray(original) ? original : [original];
      const clones = materials.map((material) => material.clone());
      mesh.material = Array.isArray(original) ? clones : clones[0];
      captured.push({mesh, target, original, clones});
    });
  }

  const apply = (cueProgress: number, worldClipPlane?: THREE.Plane) => {
    const state = resolveY003RevealVisualState(cueProgress);
    for (const item of captured) {
      const opacity = opacityFor(item.target, state);
      for (const material of item.clones) {
        material.transparent = opacity < 0.999;
        material.opacity = opacity;
        material.depthWrite = opacity > 0.55;
        material.clippingPlanes =
          state.clipEnabled && worldClipPlane ? [worldClipPlane] : null;
        material.clipShadows = Boolean(state.clipEnabled && worldClipPlane);
        material.needsUpdate = true;
      }
    }
  };

  const restore = () => {
    for (const item of captured) {
      item.mesh.material = item.original;
    }
  };

  const dispose = () => {
    restore();
    for (const item of captured) {
      for (const material of item.clones) material.dispose();
    }
  };

  return {
    apply,
    restore,
    dispose,
    capturedMeshCount: captured.length,
    missingTargets,
  };
};
