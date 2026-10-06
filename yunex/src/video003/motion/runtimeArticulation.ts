import * as THREE from 'three';
import type {MotionState, WheelId} from './contract';

const ASSET_ROOT_NAME = 'YUNEX_Porsche_911_GT3_RS_992';
const CHASSIS_PART_NAMES = [
  'Body',
  'Glass',
  'Lights',
  'Grilles',
  'Interior',
  'Wing',
  'Wing_Flap',
] as const;
const WHEELS: WheelId[] = ['FL', 'FR', 'RL', 'RR'];

type TransformSnapshot = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
};

const snapshot = (object: THREE.Object3D): TransformSnapshot => ({
  position: object.position.clone(),
  quaternion: object.quaternion.clone(),
  scale: object.scale.clone(),
});

const restoreTransform = (object: THREE.Object3D, base: TransformSnapshot) => {
  object.position.copy(base.position);
  object.quaternion.copy(base.quaternion);
  object.scale.copy(base.scale);
};

export type RuntimeMotionRig = {
  apply: (state: MotionState) => void;
  restore: () => void;
  audit: {
    assetRootName: string;
    reparentedChassisParts: string[];
    missingChassisParts: string[];
    missingCriticalNodes: string[];
    wheelHierarchy: Record<WheelId, {
      steer: string;
      spin: string;
      caliper: string | null;
      caliperFollowsSteer: boolean;
    }>;
  };
};

export const createRuntimeMotionRig = (
  container: THREE.Object3D,
): RuntimeMotionRig => {
  const assetRoot =
    container.getObjectByName(ASSET_ROOT_NAME) ?? container;
  const containerBase = snapshot(container);

  const missingCriticalNodes: string[] = [];
  const steerNodes = {} as Record<WheelId, THREE.Object3D>;
  const spinNodes = {} as Record<WheelId, THREE.Object3D>;
  const steerBase = {} as Record<WheelId, TransformSnapshot>;
  const spinBase = {} as Record<WheelId, TransformSnapshot>;
  const caliperNodes = {} as Partial<Record<WheelId, THREE.Object3D>>;
  const caliperBase = {} as Partial<Record<WheelId, TransformSnapshot>>;

  for (const id of WHEELS) {
    const steerName = `Steer_${id}`;
    const spinName = `Spin_${id}`;
    const steer = assetRoot.getObjectByName(steerName);
    const spin = assetRoot.getObjectByName(spinName);
    if (!steer) missingCriticalNodes.push(steerName);
    if (!spin) missingCriticalNodes.push(spinName);
    if (steer) {
      steerNodes[id] = steer;
      steerBase[id] = snapshot(steer);
    }
    if (spin) {
      spinNodes[id] = spin;
      spinBase[id] = snapshot(spin);
    }
    const caliper = assetRoot.getObjectByName(`Caliper_${id}`);
    if (caliper) {
      caliperNodes[id] = caliper;
      caliperBase[id] = snapshot(caliper);
    }
  }

  if (missingCriticalNodes.length) {
    throw new Error(
      `Y003 motion rig missing wheel articulation nodes: ${missingCriticalNodes.join(', ')}`,
    );
  }

  const chassis = new THREE.Group();
  chassis.name = 'Y003_Runtime_Chassis';
  assetRoot.add(chassis);
  const chassisBase = snapshot(chassis);
  const reparented: THREE.Object3D[] = [];
  const reparentedChassisParts: string[] = [];
  const missingChassisParts: string[] = [];

  for (const name of CHASSIS_PART_NAMES) {
    const node = assetRoot.getObjectByName(name);
    if (!node) {
      missingChassisParts.push(name);
      continue;
    }
    if (node.parent !== assetRoot) {
      missingChassisParts.push(`${name}(unexpected-parent)`);
      continue;
    }
    chassis.add(node);
    reparented.push(node);
    reparentedChassisParts.push(name);
  }

  const yawQuaternion = new THREE.Quaternion();

  const apply = (state: MotionState) => {
    restoreTransform(container, containerBase);
    container.position.add(
      new THREE.Vector3(
        state.root.position[0],
        state.root.position[1],
        state.root.position[2],
      ),
    );
    yawQuaternion.setFromEuler(
      new THREE.Euler(
        state.root.rotation[0],
        state.root.rotation[1],
        state.root.rotation[2],
        'XYZ',
      ),
    );
    container.quaternion.copy(containerBase.quaternion).multiply(yawQuaternion);

    restoreTransform(chassis, chassisBase);
    chassis.position.y += state.chassis.heaveM;
    chassis.rotation.set(
      state.chassis.pitchRad,
      0,
      state.chassis.rollRad,
      'XYZ',
    );

    for (const id of WHEELS) {
      const steer = steerNodes[id];
      const spin = spinNodes[id];
      const wheel = state.wheels[id];

      restoreTransform(steer, steerBase[id]);
      steer.position.y += wheel.uprightOffsetY;
      steer.rotation.y += wheel.steerRad;

      restoreTransform(spin, spinBase[id]);
      spin.rotation.x += wheel.spinRad;

      // Front calipers were prepared under Steer_FL/FR and inherit steering/upright
      // motion automatically. Rear calipers remain stationary relative to their
      // non-steering uprights; only vertical travel would be applied here.
      const caliper = caliperNodes[id];
      const base = caliperBase[id];
      if (caliper && base && caliper.parent !== steer) {
        restoreTransform(caliper, base);
        caliper.position.y += wheel.uprightOffsetY;
      }
    }

    container.updateMatrixWorld(true);
  };

  const restore = () => {
    restoreTransform(container, containerBase);
    restoreTransform(chassis, chassisBase);
    for (const id of WHEELS) {
      restoreTransform(steerNodes[id], steerBase[id]);
      restoreTransform(spinNodes[id], spinBase[id]);
      const caliper = caliperNodes[id];
      const base = caliperBase[id];
      if (caliper && base) restoreTransform(caliper, base);
    }

    // The prepared Porsche has these chassis groups directly under the asset root.
    // Resetting the runtime wrapper before reparenting therefore restores the exact
    // source-local transforms without touching the GLB bytes.
    for (const node of reparented) assetRoot.add(node);
    assetRoot.remove(chassis);
    container.updateMatrixWorld(true);
  };

  const wheelHierarchy = WHEELS.reduce((acc, id) => {
    const caliper = caliperNodes[id];
    acc[id] = {
      steer: steerNodes[id].name,
      spin: spinNodes[id].name,
      caliper: caliper?.name ?? null,
      caliperFollowsSteer: Boolean(caliper && caliper.parent === steerNodes[id]),
    };
    return acc;
  }, {} as RuntimeMotionRig['audit']['wheelHierarchy']);

  return {
    apply,
    restore,
    audit: {
      assetRootName: assetRoot.name || '(scene-root)',
      reparentedChassisParts,
      missingChassisParts,
      missingCriticalNodes,
      wheelHierarchy,
    },
  };
};
