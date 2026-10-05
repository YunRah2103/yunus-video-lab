import * as THREE from 'three';

export type AeroMode = 'highDownforce' | 'drs' | 'airbrake';

export type AeroStateInput = {
  mode: AeroMode;
  /** 0..1 deployment from the neutral low-downforce pose. */
  transition?: number;
  /** Optional illustrative override in degrees, relative to the neutral GLB pose. */
  rearAngle?: number;
  /** Optional illustrative override in degrees for the runtime front proxies. */
  frontAngle?: number;
};

export type ResolvedAeroState = {
  mode: AeroMode;
  transition: number;
  rearAngle: number;
  frontAngle: number;
};

export type AeroRigAudit = {
  sourceTriangles: number;
  movingTriangles: number;
  fixedTriangles: number;
  movingFraction: number;
  componentCount: number;
  movingComponentCount: number;
  fixedComponentCount: number;
  hingeCar: [number, number, number];
  movingBoundsCar: {min: [number, number, number]; max: [number, number, number]};
  fixedBoundsCar: {min: [number, number, number]; max: [number, number, number]};
  parentWorldScale: [number, number, number];
};

export type ActiveAeroRig = {
  rearFlap: THREE.Object3D;
  fixedFragments: THREE.Group;
  hingeCar: THREE.Vector3;
  movingBoundsCar: THREE.Box3;
  fixedBoundsCar: THREE.Box3;
  audit: AeroRigAudit;
  apply: (state: AeroStateInput) => ResolvedAeroState;
  restoreNeutral: () => void;
};

/**
 * These are deliberately presentation poses, not manufacturer-published angles.
 * Low-downforce remains the zero / neutral GLB pose and is not mislabeled as high-downforce.
 */
export const AERO_MODE_ANGLES: Readonly<Record<AeroMode, {rear: number; front: number}>> = {
  highDownforce: {rear: 8, front: 6},
  drs: {rear: -7, front: -3},
  airbrake: {rear: 22, front: 14},
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
export const smoothAeroTransition = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

export const resolveAeroState = (input: AeroStateInput): ResolvedAeroState => {
  const target = AERO_MODE_ANGLES[input.mode];
  const t = smoothAeroTransition(input.transition ?? 1);
  const rearTarget = input.rearAngle ?? target.rear;
  const frontTarget = input.frontAngle ?? target.front;
  return {
    mode: input.mode,
    transition: t,
    rearAngle: rearTarget * t,
    frontAngle: frontTarget * t,
  };
};

/** Smoothly blend between two named modes without accumulating transform state. */
export const blendAeroModes = (from: AeroMode, to: AeroMode, progress: number): AeroStateInput => {
  const t = smoothAeroTransition(progress);
  const a = AERO_MODE_ANGLES[from];
  const b = AERO_MODE_ANGLES[to];
  return {
    mode: to,
    transition: 1,
    rearAngle: THREE.MathUtils.lerp(a.rear, b.rear, t),
    frontAngle: THREE.MathUtils.lerp(a.front, b.front, t),
  };
};

type Component = {
  triangles: number[];
  bounds: THREE.Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
  movable: boolean;
};

type MeshPartition = {
  mesh: THREE.Mesh;
  components: Component[];
  movingTriangles: number[];
  fixedTriangles: number[];
  relativeToFlap: THREE.Matrix4;
};

const rigCache = new WeakMap<THREE.Object3D, ActiveAeroRig>();

const tuple = (v: THREE.Vector3): [number, number, number] => [v.x, v.y, v.z];
const boxTuple = (b: THREE.Box3) => ({min: tuple(b.min), max: tuple(b.max)});

const getTriangleIndices = (geometry: THREE.BufferGeometry) => {
  const index = geometry.getIndex();
  const position = geometry.getAttribute('position');
  if (!position) throw new Error('Aero rig: Wing_Flap mesh has no position attribute.');
  const values: number[] = [];
  if (index) {
    for (let i = 0; i < index.count; i++) values.push(index.getX(i));
  } else {
    for (let i = 0; i < position.count; i++) values.push(i);
  }
  if (values.length % 3 !== 0) throw new Error('Aero rig: non-triangular Wing_Flap geometry.');
  return values;
};

const buildComponents = (mesh: THREE.Mesh, flap: THREE.Object3D): Component[] => {
  const geometry = mesh.geometry as THREE.BufferGeometry;
  const indices = getTriangleIndices(geometry);
  const triangleCount = indices.length / 3;
  const parent = new Int32Array(triangleCount);
  for (let i = 0; i < triangleCount; i++) parent[i] = i;

  const find = (x: number): number => {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    while (parent[x] !== x) {
      const next = parent[x];
      parent[x] = r;
      x = next;
    }
    return r;
  };
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };

  const owner = new Map<number, number>();
  for (let tri = 0; tri < triangleCount; tri++) {
    for (let k = 0; k < 3; k++) {
      const vertex = indices[tri * 3 + k];
      const previous = owner.get(vertex);
      if (previous === undefined) owner.set(vertex, tri);
      else union(tri, previous);
    }
  }

  const groups = new Map<number, number[]>();
  for (let tri = 0; tri < triangleCount; tri++) {
    const root = find(tri);
    const list = groups.get(root);
    if (list) list.push(tri);
    else groups.set(root, [tri]);
  }

  flap.updateWorldMatrix(true, false);
  mesh.updateWorldMatrix(true, false);
  const relative = new THREE.Matrix4().copy(flap.matrixWorld).invert().multiply(mesh.matrixWorld);
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;
  const p = new THREE.Vector3();

  return [...groups.values()].map((triangles) => {
    const bounds = new THREE.Box3().makeEmpty();
    for (const tri of triangles) {
      for (let k = 0; k < 3; k++) {
        const vertex = indices[tri * 3 + k];
        p.fromBufferAttribute(position, vertex).applyMatrix4(relative);
        bounds.expandByPoint(p);
      }
    }
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    return {triangles, bounds, size, center, movable: false};
  });
};

const subsetGeometry = (source: THREE.BufferGeometry, triangleIds: number[]) => {
  const sourceIndices = getTriangleIndices(source);
  const subset: number[] = [];
  for (const tri of triangleIds) {
    subset.push(sourceIndices[tri * 3], sourceIndices[tri * 3 + 1], sourceIndices[tri * 3 + 2]);
  }
  const geometry = source.clone();
  geometry.setIndex(subset);
  geometry.clearGroups();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
};

const worldScaleIsUniform = (object: THREE.Object3D) => {
  const scale = object.getWorldScale(new THREE.Vector3());
  const max = Math.max(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z), 1e-9);
  const spread = Math.max(Math.abs(scale.x - scale.y), Math.abs(scale.y - scale.z), Math.abs(scale.x - scale.z));
  return {uniform: spread / max < 1e-5, scale};
};

const transformBox = (box: THREE.Box3, matrix: THREE.Matrix4) => {
  const out = new THREE.Box3().makeEmpty();
  for (const x of [box.min.x, box.max.x]) {
    for (const y of [box.min.y, box.max.y]) {
      for (const z of [box.min.z, box.max.z]) {
        out.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(matrix));
      }
    }
  }
  return out;
};

/**
 * Converts the production Wing_Flap runtime node into a mechanically useful rig while keeping
 * the source GLB byte-identical. Wide, thin connected components become the moving upper plane;
 * vertical/narrow fragments (endplates/support pieces accidentally caught by the old Y cutoff)
 * are copied into a fixed sibling group with the same neutral transform.
 */
export const createActiveAeroRig = (car: THREE.Object3D): ActiveAeroRig => {
  const flap = car.getObjectByName('Wing_Flap');
  const mainWing = car.getObjectByName('Wing');
  if (!flap || !mainWing) throw new Error('Aero rig: Wing and Wing_Flap nodes are required.');
  if (!flap.parent) throw new Error('Aero rig: Wing_Flap has no parent.');
  const cached = rigCache.get(flap);
  if (cached) return cached;

  car.updateMatrixWorld(true);
  const scaleCheck = worldScaleIsUniform(flap.parent);
  if (!scaleCheck.uniform) {
    throw new Error(`Aero rig: non-uniform parent world scale (${scaleCheck.scale.toArray().join(', ')}).`);
  }

  const meshes: THREE.Mesh[] = [];
  flap.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) meshes.push(object as THREE.Mesh);
  });
  if (meshes.length === 0) throw new Error('Aero rig: Wing_Flap contains no mesh geometry.');

  const partitions: MeshPartition[] = meshes.map((mesh) => {
    const components = buildComponents(mesh, flap);
    mesh.updateWorldMatrix(true, false);
    const relativeToFlap = new THREE.Matrix4().copy(flap.matrixWorld).invert().multiply(mesh.matrixWorld);
    return {mesh, components, movingTriangles: [], fixedTriangles: [], relativeToFlap};
  });

  const allComponents = partitions.flatMap((partition) => partition.components);
  const maxSpanX = Math.max(...allComponents.map((component) => component.size.x));
  const wideComponents = allComponents.filter(
    (component) => component.size.x >= maxSpanX * 0.55 && component.size.y <= 0.14,
  );
  if (wideComponents.length === 0) {
    throw new Error('Aero rig: could not identify a spanwise upper-plane component; refusing a fake hinge rig.');
  }

  const coreBounds = new THREE.Box3().makeEmpty();
  for (const component of wideComponents) coreBounds.union(component.bounds);
  const expandedCore = coreBounds.clone().expandByVector(new THREE.Vector3(0.07, 0.08, 0.08));

  for (const partition of partitions) {
    for (const component of partition.components) {
      const widePlane = component.size.x >= maxSpanX * 0.55 && component.size.y <= 0.14;
      const thinAttachedDetail =
        component.size.y <= 0.075 && expandedCore.containsPoint(component.center);
      component.movable = widePlane || thinAttachedDetail;
      (component.movable ? partition.movingTriangles : partition.fixedTriangles).push(...component.triangles);
    }
  }

  const sourceTriangles = partitions.reduce(
    (sum, partition) => sum + partition.movingTriangles.length + partition.fixedTriangles.length,
    0,
  );
  const movingTriangles = partitions.reduce((sum, partition) => sum + partition.movingTriangles.length, 0);
  const fixedTriangles = sourceTriangles - movingTriangles;
  const movingFraction = movingTriangles / Math.max(1, sourceTriangles);
  if (movingFraction < 0.35 || movingFraction > 0.85 || fixedTriangles <= 0) {
    throw new Error(
      `Aero rig: unsafe Wing_Flap partition (${movingTriangles}/${sourceTriangles} moving triangles).`,
    );
  }

  const fixedFragments = new THREE.Group();
  fixedFragments.name = 'Wing_Flap_FixedFragments';
  fixedFragments.position.copy(flap.position);
  fixedFragments.quaternion.copy(flap.quaternion);
  fixedFragments.scale.copy(flap.scale);
  fixedFragments.userData.yunexFixedAeroFragments = true;
  flap.parent.add(fixedFragments);

  for (const partition of partitions) {
    const {mesh, movingTriangles: moving, fixedTriangles: fixed, relativeToFlap} = partition;
    const original = mesh.geometry as THREE.BufferGeometry;
    if (fixed.length > 0) {
      const fixedMesh = mesh.clone(false) as THREE.Mesh;
      fixedMesh.name = `${mesh.name}__Fixed`;
      fixedMesh.geometry = subsetGeometry(original, fixed);
      fixedMesh.matrix.copy(relativeToFlap);
      fixedMesh.matrix.decompose(fixedMesh.position, fixedMesh.quaternion, fixedMesh.scale);
      fixedMesh.matrixAutoUpdate = true;
      fixedFragments.add(fixedMesh);
    }
    mesh.geometry = subsetGeometry(original, moving);
  }

  car.updateMatrixWorld(true);
  const neutralRotation = flap.rotation.clone();
  const hingeWorld = flap.getWorldPosition(new THREE.Vector3());
  const hingeCar = car.worldToLocal(hingeWorld.clone());

  const movingBoundsWorld = new THREE.Box3().setFromObject(flap, true);
  const fixedBoundsWorld = new THREE.Box3().setFromObject(fixedFragments, true);
  car.updateMatrixWorld(true);
  const worldToCar = new THREE.Matrix4().copy(car.matrixWorld).invert();
  const movingBoundsCar = transformBox(movingBoundsWorld, worldToCar);
  const fixedBoundsCar = transformBox(fixedBoundsWorld, worldToCar);

  const audit: AeroRigAudit = {
    sourceTriangles,
    movingTriangles,
    fixedTriangles,
    movingFraction,
    componentCount: allComponents.length,
    movingComponentCount: allComponents.filter((component) => component.movable).length,
    fixedComponentCount: allComponents.filter((component) => !component.movable).length,
    hingeCar: tuple(hingeCar),
    movingBoundsCar: boxTuple(movingBoundsCar),
    fixedBoundsCar: boxTuple(fixedBoundsCar),
    parentWorldScale: tuple(scaleCheck.scale),
  };

  const restoreNeutral = () => {
    flap.rotation.copy(neutralRotation);
    flap.updateMatrixWorld(true);
  };

  const rig: ActiveAeroRig = {
    rearFlap: flap,
    fixedFragments,
    hingeCar,
    movingBoundsCar,
    fixedBoundsCar,
    audit,
    apply: (state) => {
      const pose = resolveAeroState(state);
      flap.rotation.set(
        neutralRotation.x + THREE.MathUtils.degToRad(pose.rearAngle),
        neutralRotation.y,
        neutralRotation.z,
        neutralRotation.order,
      );
      flap.updateMatrixWorld(true);
      return pose;
    },
    restoreNeutral,
  };

  flap.userData.yunexActiveAeroRigged = true;
  rigCache.set(flap, rig);
  return rig;
};
