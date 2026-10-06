import React, {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {
  ROAD_LOCAL,
  buildRoadDecor,
  estimateRoadSurfaceCost,
  type FlatPatch,
  type KerbChip,
  type RoadQuality,
} from './road/layout';
import {createRoadTextures} from './road/proceduralRoadTexture';

export type RoadSurfacesProps = {
  quality: RoadQuality;
  seed?: number;
};

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const _object = new THREE.Object3D();
const _qFlat = new THREE.Quaternion().setFromAxisAngle(X_AXIS, -Math.PI / 2);
const _qYaw = new THREE.Quaternion();
const _q = new THREE.Quaternion();

const setFlatInstance = (
  mesh: THREE.InstancedMesh,
  index: number,
  patch: FlatPatch,
  y: number,
) => {
  _qYaw.setFromAxisAngle(Y_AXIS, patch.yaw);
  _q.copy(_qYaw).multiply(_qFlat);
  _object.position.set(patch.x, y, patch.z);
  _object.quaternion.copy(_q);
  _object.scale.set(patch.scaleX, patch.scaleZ, 1);
  _object.updateMatrix();
  mesh.setMatrixAt(index, _object.matrix);
};

const setChipInstance = (mesh: THREE.InstancedMesh, index: number, chip: KerbChip) => {
  _object.position.set(chip.x, chip.y, chip.z);
  _object.rotation.set(0, chip.yaw, 0);
  _object.scale.set(chip.scaleX, 1, chip.scaleZ);
  _object.updateMatrix();
  mesh.setMatrixAt(index, _object.matrix);
};

const finishInstances = (mesh: THREE.InstancedMesh) => {
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingBox();
  mesh.computeBoundingSphere();
};

const makeKerbGeometry = (quality: RoadQuality) => {
  const shape = new THREE.Shape();
  const half = ROAD_LOCAL.kerbWidth / 2;
  shape.moveTo(-half, 0);
  shape.lineTo(half, 0);
  shape.lineTo(half - 0.018, ROAD_LOCAL.kerbHeight);
  shape.lineTo(-half + 0.018, ROAD_LOCAL.kerbHeight);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: ROAD_LOCAL.kerbDepth,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.009,
    bevelSize: 0.013,
    bevelSegments: quality === 'final' ? 2 : 1,
    curveSegments: 2,
  });
  geometry.translate(0, 0, -ROAD_LOCAL.kerbDepth / 2);
  geometry.computeVertexNormals();
  return geometry;
};

export const ROAD_SURFACE_INTEGRATION = {
  coordinateSpace: 'TechnicalTrackWorld local coordinates',
  managerRootTransform: {
    position: [-1, -0.028, 0] as [number, number, number],
    rotationY: Math.PI,
  },
  note: 'RoadSurfaces intentionally does not apply the manager root transform; mount it inside the shared YUNEX 002 track root.',
} as const;

export const RoadSurfaces: React.FC<RoadSurfacesProps> = ({quality, seed = 2103}) => {
  const textures = useMemo(() => createRoadTextures(quality, seed), [quality, seed]);
  const decor = useMemo(() => buildRoadDecor(seed, quality), [quality, seed]);
  const kerbGeometry = useMemo(() => makeKerbGeometry(quality), [quality]);
  const circleGeometry = useMemo(
    () => new THREE.CircleGeometry(1, quality === 'final' ? 40 : 24),
    [quality],
  );
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const chipGeometry = useMemo(() => new THREE.BoxGeometry(1, 0.005, 1), []);

  const macroRef = useRef<THREE.InstancedMesh>(null);
  const rubberRef = useRef<THREE.InstancedMesh>(null);
  const gravelRef = useRef<THREE.InstancedMesh>(null);
  const kerbRef = useRef<THREE.InstancedMesh>(null);
  const chipRef = useRef<THREE.InstancedMesh>(null);

  const asphaltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: textures.asphalt,
        color: '#ffffff',
        roughness: 0.91,
        metalness: 0.015,
      }),
    [textures.asphalt],
  );
  const vergeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: textures.verge,
        color: '#ffffff',
        roughness: 1,
        metalness: 0,
      }),
    [textures.verge],
  );
  const macroMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#303435',
        roughness: 0.99,
        metalness: 0,
        transparent: true,
        opacity: 0.055,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      }),
    [],
  );
  const rubberMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111313',
        roughness: 0.82,
        metalness: 0,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    [],
  );
  const gravelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5c5847',
        roughness: 1,
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    [],
  );
  const kerbMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.82,
        metalness: 0,
        vertexColors: true,
      }),
    [],
  );
  const chipMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3c3a35',
        roughness: 0.96,
        metalness: 0,
      }),
    [],
  );

  useLayoutEffect(() => {
    if (macroRef.current) {
      decor.macroPatches.forEach((patch, i) =>
        setFlatInstance(macroRef.current!, i, patch, ROAD_LOCAL.macroPatchY),
      );
      finishInstances(macroRef.current);
    }
    if (rubberRef.current) {
      decor.rubberStreaks.forEach((patch, i) =>
        setFlatInstance(rubberRef.current!, i, patch, ROAD_LOCAL.rubberY),
      );
      finishInstances(rubberRef.current);
    }
    if (gravelRef.current) {
      decor.gravelPatches.forEach((patch, i) =>
        setFlatInstance(gravelRef.current!, i, patch, ROAD_LOCAL.gravelY),
      );
      finishInstances(gravelRef.current);
    }
    if (chipRef.current) {
      decor.kerbChips.forEach((chip, i) => setChipInstance(chipRef.current!, i, chip));
      finishInstances(chipRef.current);
    }
    if (kerbRef.current) {
      const ivory = new THREE.Color('#d8d3c8');
      const red = new THREE.Color('#8f2724');
      const warm = new THREE.Color('#b6aa97');
      for (let i = 0; i < ROAD_LOCAL.kerbCount; i++) {
        _object.position.set(
          ROAD_LOCAL.kerbCenterX,
          ROAD_LOCAL.kerbBaseY,
          ROAD_LOCAL.kerbStartZ + i * ROAD_LOCAL.kerbStep,
        );
        _object.rotation.set(0, 0, 0);
        _object.scale.set(1, 1, 1);
        _object.updateMatrix();
        kerbRef.current.setMatrixAt(i, _object.matrix);
        const base = i % 2 === 0 ? ivory : red;
        const wear = 0.04 + ((i * 17 + seed) % 7) * 0.006;
        const color = base.clone().lerp(warm, wear);
        kerbRef.current.setColorAt(i, color);
      }
      if (kerbRef.current.instanceColor) kerbRef.current.instanceColor.needsUpdate = true;
      finishInstances(kerbRef.current);
    }
  }, [decor, seed]);

  useEffect(
    () => () => {
      textures.asphalt.dispose();
      textures.verge.dispose();
      kerbGeometry.dispose();
      circleGeometry.dispose();
      planeGeometry.dispose();
      chipGeometry.dispose();
      asphaltMaterial.dispose();
      vergeMaterial.dispose();
      macroMaterial.dispose();
      rubberMaterial.dispose();
      gravelMaterial.dispose();
      kerbMaterial.dispose();
      chipMaterial.dispose();
    },
    [
      asphaltMaterial,
      chipGeometry,
      chipMaterial,
      circleGeometry,
      gravelMaterial,
      kerbGeometry,
      kerbMaterial,
      macroMaterial,
      planeGeometry,
      rubberMaterial,
      textures.asphalt,
      textures.verge,
      vergeMaterial,
    ],
  );

  const roadWidth = ROAD_LOCAL.roadMaxX - ROAD_LOCAL.roadMinX;
  const roadCenterX = (ROAD_LOCAL.roadMinX + ROAD_LOCAL.roadMaxX) / 2;
  const roadLength = ROAD_LOCAL.roadMaxZ - ROAD_LOCAL.roadMinZ;
  const roadCenterZ = (ROAD_LOCAL.roadMinZ + ROAD_LOCAL.roadMaxZ) / 2;
  const vergeWidth = ROAD_LOCAL.vergeMaxX - ROAD_LOCAL.vergeMinX;
  const vergeCenterX = (ROAD_LOCAL.vergeMinX + ROAD_LOCAL.vergeMaxX) / 2;

  return (
    <group
      name="YUNEX002_RoadSurfaces"
      userData={{
        yunexTrackUpgrade: 'road',
        deterministicSeed: seed,
        quality,
        cost: estimateRoadSurfaceCost(quality),
      }}
    >
      <mesh
        name="Road_Asphalt_Authored"
        receiveShadow
        position={[roadCenterX, ROAD_LOCAL.asphaltY, roadCenterZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={new THREE.PlaneGeometry(roadWidth, roadLength)}
        material={asphaltMaterial}
      />

      <mesh
        name="Road_Verge_Authored"
        receiveShadow
        position={[vergeCenterX, ROAD_LOCAL.vergeY, roadCenterZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={new THREE.PlaneGeometry(vergeWidth, roadLength)}
        material={vergeMaterial}
      />

      <instancedMesh
        ref={macroRef}
        name="Road_Macro_Roughness"
        args={[circleGeometry, macroMaterial, decor.macroPatches.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={rubberRef}
        name="Road_Rubber_Wear"
        args={[planeGeometry, rubberMaterial, decor.rubberStreaks.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={gravelRef}
        name="Road_Edge_Gravel"
        args={[circleGeometry, gravelMaterial, decor.gravelPatches.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={kerbRef}
        name="Road_Kerb_Bevelled"
        args={[kerbGeometry, kerbMaterial, ROAD_LOCAL.kerbCount]}
        frustumCulled={false}
        receiveShadow
      />
      <instancedMesh
        ref={chipRef}
        name="Road_Kerb_Wear"
        args={[chipGeometry, chipMaterial, decor.kerbChips.length]}
        frustumCulled={false}
      />
    </group>
  );
};
