import * as THREE from 'three';
import {AERO_MODE_ANGLES, blendAeroModes, createActiveAeroRig, resolveAeroState, smoothAeroTransition} from './activeAero';

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`Agent A mechanics test failed: ${message}`);
};

const approx = (a: number, b: number, epsilon = 1e-9) => Math.abs(a - b) <= epsilon;

const makeSyntheticCar = () => {
  const car = new THREE.Group();
  car.name = 'SyntheticCar';
  const wing = new THREE.Group();
  wing.name = 'Wing';
  wing.position.set(0, 1.24, -1.8);
  car.add(wing);

  const flap = new THREE.Group();
  flap.name = 'Wing_Flap';
  flap.position.set(0, 1.24, -1.8);
  car.add(flap);

  const upperPlane = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.05, 0.32), new THREE.MeshBasicMaterial());
  upperPlane.name = 'SyntheticUpperPlane';
  upperPlane.position.set(0, 0.04, -0.18);
  flap.add(upperPlane);

  const fixedSupport = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.19, 0.34), new THREE.MeshBasicMaterial());
  fixedSupport.name = 'SyntheticSupport';
  fixedSupport.position.set(0.78, 0.025, -0.16);
  flap.add(fixedSupport);
  car.updateMatrixWorld(true);
  return car;
};

export const runAgentAMechanicsContractTests = () => {
  assert(approx(smoothAeroTransition(-1), 0), 'transition clamps below zero');
  assert(approx(smoothAeroTransition(2), 1), 'transition clamps above one');
  assert(approx(resolveAeroState({mode: 'drs', transition: 0}).rearAngle, 0), 'transition zero is neutral');
  assert(approx(resolveAeroState({mode: 'airbrake'}).rearAngle, AERO_MODE_ANGLES.airbrake.rear), 'default state resolves deterministically');

  const midpoint = blendAeroModes('highDownforce', 'drs', 0.5);
  assert(midpoint.rearAngle !== undefined && midpoint.frontAngle !== undefined, 'mode blend emits explicit angles');

  const car = makeSyntheticCar();
  const rig = createActiveAeroRig(car);
  assert(rig.audit.sourceTriangles > 0, 'synthetic rig has source triangles');
  assert(rig.audit.movingTriangles > 0, 'wide upper plane is movable');
  assert(rig.audit.fixedTriangles > 0, 'vertical support remains fixed');

  const neutral = rig.rearFlap.rotation.x;
  const first = rig.apply({mode: 'drs'});
  const rotationA = rig.rearFlap.rotation.x;
  rig.apply({mode: 'highDownforce'});
  rig.apply({mode: 'drs'});
  const rotationB = rig.rearFlap.rotation.x;
  assert(approx(rotationA, rotationB), 'repeated state is identical and non-cumulative');
  assert(approx(rotationA, neutral + THREE.MathUtils.degToRad(first.rearAngle)), 'angle is relative to neutral pose');

  rig.restoreNeutral();
  assert(approx(rig.rearFlap.rotation.x, neutral), 'restoreNeutral restores exact initial angle');

  return {
    passed: true,
    sourceTriangles: rig.audit.sourceTriangles,
    movingTriangles: rig.audit.movingTriangles,
    fixedTriangles: rig.audit.fixedTriangles,
  };
};
