import * as THREE from 'three';
import {
  SOURCE_WHEEL_CENTRES,
  motionManifest,
  motionStateAt,
  resolveMotionConfig,
  speedAtFrame,
  type MotionConfig,
  type MotionState,
  type WheelId,
} from './contract';
import {createRuntimeMotionRig} from './runtimeArticulation';
import {
  sampleTrackAtLocalZ,
  worldXZToTrackLocal,
  TRACK_LAYOUT_CONFIG,
} from '../../video002/trackUpgrade/racetrack/layout';

export type MotionQaResult = {
  ok: boolean;
  issues: string[];
  metrics: {
    checkedFrames: number;
    routeDistanceM: number;
    minSpeedMps: number;
    maxSpeedMps: number;
    maxBrakeMps2: number;
    maxAccelerationMps2: number;
    maxAbsSteerDeg: number;
    maxAbsPitchDeg: number;
    maxAbsRollDeg: number;
    maxSteerStepDeg: number;
    maxHubCenterErrorM: number;
    maxAxleAxisErrorDeg: number;
    maxRepeatTransformError: number;
    minTyreContactClearanceM: number;
    maxTyreContactErrorM: number;
    minRoadEdgeClearanceM: number;
    maxSpinDistanceErrorM: number;
    deterministicProbeCount: number;
  };
};

const WHEELS: WheelId[] = ['FL', 'FR', 'RL', 'RR'];

const finiteState = (state: MotionState) => {
  const values = [
    state.frame,
    state.timeS,
    state.progress,
    state.distanceM,
    state.speedMps,
    state.accelerationMps2,
    state.curvaturePerM,
    state.steeringCurvaturePerM,
    state.lateralAccelerationMps2,
    ...state.root.position,
    ...state.root.rotation,
    state.root.trackLocalZ,
    state.chassis.pitchRad,
    state.chassis.rollRad,
    state.chassis.heaveM,
    state.chassis.brakeLoad01,
    state.chassis.cornerLoadSigned,
  ];
  for (const id of WHEELS) {
    const wheel = state.wheels[id];
    values.push(
      ...wheel.centreLocal,
      ...wheel.centreWorld,
      wheel.pathDistanceM,
      wheel.tyreRadiusM,
      wheel.steerRad,
      wheel.spinRad,
      wheel.uprightOffsetY,
    );
  }
  return values.every(Number.isFinite);
};

const stateFingerprint = (state: MotionState) =>
  JSON.stringify({
    f: state.frame,
    d: state.distanceM,
    v: state.speedMps,
    a: state.accelerationMps2,
    k: state.curvaturePerM,
    ks: state.steeringCurvaturePerM,
    p: state.root.position,
    r: state.root.rotation,
    c: state.chassis,
    w: WHEELS.map((id) => {
      const wheel = state.wheels[id];
      return [
        id,
        wheel.centreWorld,
        wheel.pathDistanceM,
        wheel.steerRad,
        wheel.spinRad,
        wheel.uprightOffsetY,
      ];
    }),
  });


export type RuntimeWheelRigQa = {
  maxHubCenterErrorM: number;
  maxAxleAxisErrorDeg: number;
  maxRepeatTransformError: number;
  checkedFrames: number;
};

export const validateRuntimeWheelRigKinematics = (
  input: Partial<MotionConfig> = {},
): RuntimeWheelRigQa => {
  const config = resolveMotionConfig(input);
  const container = new THREE.Group();
  container.name = 'YUNEX_Porsche_911_GT3_RS_992';

  for (const id of WHEELS) {
    const steer = new THREE.Group();
    steer.name = `Steer_${id}`;
    steer.position.set(...SOURCE_WHEEL_CENTRES[id]);
    const spin = new THREE.Group();
    spin.name = `Spin_${id}`;
    steer.add(spin);

    const caliper = new THREE.Group();
    caliper.name = `Caliper_${id}`;
    if (id[0] === 'F') {
      steer.add(caliper);
    } else {
      caliper.position.set(...SOURCE_WHEEL_CENTRES[id]);
      container.add(caliper);
    }
    container.add(steer);
  }

  const rig = createRuntimeMotionRig(container);
  const last = config.durationFrames - 1;
  const probes = [...new Set([
    0,
    Math.min(last, 90),
    Math.min(last, 190),
    Math.min(last, 207),
    Math.min(last, 240),
    Math.min(last, 300),
    Math.min(last, 331),
    Math.min(last, 400),
    last,
  ])];

  let maxHubCenterErrorM = 0;
  let maxAxleAxisErrorRad = 0;
  let maxRepeatTransformError = 0;
  const firstPass = new Map<number, Record<WheelId, number[]>>();

  const capture = (frame: number) => {
    const state = motionStateAt(frame, config);
    rig.apply(state);
    const snapshot = {} as Record<WheelId, number[]>;

    for (const id of WHEELS) {
      const spin = container.getObjectByName(`Spin_${id}`);
      if (!spin) throw new Error(`synthetic wheel rig lost Spin_${id}`);

      const hub = new THREE.Vector3();
      spin.getWorldPosition(hub);
      const expectedHub = new THREE.Vector3(...state.wheels[id].centreWorld);
      expectedHub.y += state.wheels[id].uprightOffsetY;
      maxHubCenterErrorM = Math.max(
        maxHubCenterErrorM,
        hub.distanceTo(expectedHub),
      );

      const worldQuaternion = new THREE.Quaternion();
      spin.getWorldQuaternion(worldQuaternion);
      const actualAxle = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(worldQuaternion)
        .normalize();

      const expectedQuaternion = new THREE.Quaternion()
        .setFromAxisAngle(new THREE.Vector3(0, 1, 0), state.root.rotation[1])
        .multiply(
          new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            state.wheels[id].steerRad,
          ),
        );
      const expectedAxle = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(expectedQuaternion)
        .normalize();
      maxAxleAxisErrorRad = Math.max(
        maxAxleAxisErrorRad,
        actualAxle.angleTo(expectedAxle),
      );

      snapshot[id] = spin.matrixWorld.elements.slice();
    }

    return snapshot;
  };

  for (const frame of probes) {
    firstPass.set(frame, capture(frame));
  }
  for (const frame of [...probes].reverse()) {
    const next = capture(frame);
    const first = firstPass.get(frame);
    if (!first) continue;
    for (const id of WHEELS) {
      for (let i = 0; i < first[id].length; i++) {
        maxRepeatTransformError = Math.max(
          maxRepeatTransformError,
          Math.abs(first[id][i] - next[id][i]),
        );
      }
    }
  }

  rig.restore();

  return {
    maxHubCenterErrorM,
    maxAxleAxisErrorDeg: maxAxleAxisErrorRad * 180 / Math.PI,
    maxRepeatTransformError,
    checkedFrames: probes.length,
  };
};

export const validateMotionContract = (
  input: Partial<MotionConfig> = {},
): MotionQaResult => {
  const config = resolveMotionConfig(input);
  const manifest = motionManifest(config);
  const issues: string[] = [];
  let previousDistance = -Infinity;
  let minSpeedMps = Infinity;
  let maxSpeedMps = 0;
  let maxBrakeMps2 = 0;
  let maxAccelerationMps2 = 0;
  let maxAbsSteerRad = 0;
  let maxAbsPitchRad = 0;
  let maxAbsRollRad = 0;
  let maxSteerStepRad = 0;
  let previousSteer: Partial<Record<WheelId, number>> = {};
  let minTyreContactClearanceM = Infinity;
  let maxTyreContactErrorM = 0;
  let minRoadEdgeClearanceM = Infinity;
  let maxSpinDistanceErrorM = 0;

  for (let frame = 0; frame < config.durationFrames; frame++) {
    const state = motionStateAt(frame, config);
    if (!finiteState(state)) issues.push(`non-finite state at frame ${frame}`);

    if (state.distanceM + 1e-8 < previousDistance) {
      issues.push(`distance reverses at frame ${frame}`);
    }
    previousDistance = state.distanceM;

    const derivativeSpeed = speedAtFrame(frame, config);
    if (Math.abs(derivativeSpeed - state.speedMps) > 1e-9) {
      issues.push(`speed contract mismatch at frame ${frame}`);
    }

    minSpeedMps = Math.min(minSpeedMps, state.speedMps);
    maxSpeedMps = Math.max(maxSpeedMps, state.speedMps);
    maxBrakeMps2 = Math.max(maxBrakeMps2, -state.accelerationMps2);
    maxAccelerationMps2 = Math.max(maxAccelerationMps2, state.accelerationMps2);
    maxAbsPitchRad = Math.max(maxAbsPitchRad, Math.abs(state.chassis.pitchRad));
    maxAbsRollRad = Math.max(maxAbsRollRad, Math.abs(state.chassis.rollRad));

    const [localX, localZ] = worldXZToTrackLocal([
      state.root.position[0],
      state.root.position[2],
    ]);
    const track = sampleTrackAtLocalZ(localZ);
    const lateralOffset =
      (localX - track.center[0]) * track.leftNormal[0] +
      (localZ - track.center[1]) * track.leftNormal[1];
    const edgeClearance =
      TRACK_LAYOUT_CONFIG.roadHalfWidth -
      Math.abs(lateralOffset) -
      TRACK_LAYOUT_CONFIG.lockedCarFootprintHalfWidth;
    minRoadEdgeClearanceM = Math.min(minRoadEdgeClearanceM, edgeClearance);

    for (const id of WHEELS) {
      const wheel = state.wheels[id];
      maxAbsSteerRad = Math.max(maxAbsSteerRad, Math.abs(wheel.steerRad));
      const priorSteer = previousSteer[id];
      if (priorSteer !== undefined) {
        maxSteerStepRad = Math.max(
          maxSteerStepRad,
          Math.abs(wheel.steerRad - priorSteer),
        );
      }
      previousSteer[id] = wheel.steerRad;
      const contactClearance =
        wheel.centreLocal[1] + wheel.uprightOffsetY - wheel.tyreRadiusM;
      minTyreContactClearanceM = Math.min(
        minTyreContactClearanceM,
        contactClearance,
      );
      maxTyreContactErrorM = Math.max(
        maxTyreContactErrorM,
        Math.abs(contactClearance),
      );
      maxSpinDistanceErrorM = Math.max(
        maxSpinDistanceErrorM,
        Math.abs(wheel.spinRad * wheel.tyreRadiusM - wheel.pathDistanceM),
      );
    }

    if (Math.abs(state.curvaturePerM) > 0.001) {
      const averageFrontSteer =
        (state.wheels.FL.steerRad + state.wheels.FR.steerRad) / 2;
      if (
        Math.sign(averageFrontSteer) !== Math.sign(state.curvaturePerM)
      ) {
        issues.push(`front steering sign disagrees with path at frame ${frame}`);
      }
    }
    if (Math.abs(state.wheels.RL.steerRad) > 1e-12 || Math.abs(state.wheels.RR.steerRad) > 1e-12) {
      issues.push(`rear-wheel steering introduced at frame ${frame}`);
    }
  }

  if (minRoadEdgeClearanceM < 0.6) {
    issues.push(
      `car footprint road-edge clearance fell below 0.6m (${minRoadEdgeClearanceM.toFixed(3)}m)`,
    );
  }
  if (maxTyreContactErrorM > 1e-6) {
    issues.push(
      `tyre contact error exceeded tolerance (${maxTyreContactErrorM.toExponential(3)}m)`,
    );
  }
  if (maxSpinDistanceErrorM > 1e-8) {
    issues.push(
      `wheel spin/distance mismatch exceeded tolerance (${maxSpinDistanceErrorM.toExponential(3)}m)`,
    );
  }
  const maxSteerStepDeg = maxSteerStepRad * 180 / Math.PI;
  if (maxSteerStepDeg > 0.35) {
    issues.push(
      `front steering changes too abruptly between frames (${maxSteerStepDeg.toFixed(3)}deg/frame)`,
    );
  }

  const rigMetrics = validateRuntimeWheelRigKinematics(config);
  if (rigMetrics.maxHubCenterErrorM > 1e-8) {
    issues.push(
      `wheel hub origin drift exceeded tolerance (${rigMetrics.maxHubCenterErrorM.toExponential(3)}m)`,
    );
  }
  if (rigMetrics.maxAxleAxisErrorDeg > 1e-6) {
    issues.push(
      `wheel axle precession exceeded tolerance (${rigMetrics.maxAxleAxisErrorDeg.toExponential(3)}deg)`,
    );
  }
  if (rigMetrics.maxRepeatTransformError > 1e-10) {
    issues.push(
      `runtime wheel transform repeatability exceeded tolerance (${rigMetrics.maxRepeatTransformError.toExponential(3)})`,
    );
  }

  // Probe frames in deliberately non-sequential order, including likely render
  // chunk boundaries. Pure frame evaluation must return byte-for-byte identical
  // numeric fingerprints regardless of call order.
  const last = config.durationFrames - 1;
  const probes = [
    last,
    0,
    Math.min(last, 1),
    Math.min(last, 179),
    Math.min(last, 90),
    Math.min(last, 180),
    Math.min(last, 359),
    Math.min(last, 360),
    Math.floor(last / 2),
    Math.min(last, 539),
    Math.min(last, 540),
    Math.max(0, last - 1),
  ];
  const firstPass = new Map<number, string>();
  for (const frame of probes) {
    firstPass.set(frame, stateFingerprint(motionStateAt(frame, config)));
  }
  for (const frame of [...probes].reverse()) {
    const fingerprint = stateFingerprint(motionStateAt(frame, config));
    if (firstPass.get(frame) !== fingerprint) {
      issues.push(`non-deterministic arbitrary-frame evaluation at frame ${frame}`);
    }
  }

  return {
    ok: issues.length === 0,
    issues: [...new Set(issues)],
    metrics: {
      checkedFrames: config.durationFrames,
      routeDistanceM: manifest.routeDistanceM,
      minSpeedMps,
      maxSpeedMps,
      maxBrakeMps2,
      maxAccelerationMps2,
      maxAbsSteerDeg: maxAbsSteerRad * 180 / Math.PI,
      maxAbsPitchDeg: maxAbsPitchRad * 180 / Math.PI,
      maxAbsRollDeg: maxAbsRollRad * 180 / Math.PI,
      maxSteerStepDeg,
      maxHubCenterErrorM: rigMetrics.maxHubCenterErrorM,
      maxAxleAxisErrorDeg: rigMetrics.maxAxleAxisErrorDeg,
      maxRepeatTransformError: rigMetrics.maxRepeatTransformError,
      minTyreContactClearanceM,
      maxTyreContactErrorM,
      minRoadEdgeClearanceM,
      maxSpinDistanceErrorM,
      deterministicProbeCount: new Set(probes).size,
    },
  };
};

export const assertMotionContract = (input: Partial<MotionConfig> = {}) => {
  const result = validateMotionContract(input);
  if (!result.ok) {
    throw new Error(`YUNEX 003 motion QA failed: ${result.issues.join('; ')}`);
  }
  return result;
};
