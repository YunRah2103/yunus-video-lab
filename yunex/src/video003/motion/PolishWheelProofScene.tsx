import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  motionStateAt,
  resolveMotionConfig,
  steeringForCurvature,
  type MotionState,
  type Vec3,
  type WheelId,
} from './contract';
import {
  createRuntimeMotionRig,
  type RuntimeMotionRigOptions,
} from './runtimeArticulation';
import {Y003_DURATION_FRAMES, Y003_FPS} from '../timeline';

const WIDTH = 1080;
const HEIGHT = 1920;
const HALF_HEIGHT = 960;
const INSPECTION_ORDER: WheelId[] = ['FL', 'FR', 'RL', 'RR'];

export type P02WheelProofVariant = 'neutral' | 'steering' | 'comparison';

const focalLengthToVerticalFov = (focalLength: number, sensorHeight = 24) =>
  (2 * Math.atan(sensorHeight / (2 * Math.max(1, focalLength))) * 180) /
  Math.PI;

const rotateOffset = (offset: Vec3, yaw: number): Vec3 => {
  const cosine = Math.cos(yaw);
  const sine = Math.sin(yaw);
  return [
    offset[0] * cosine + offset[2] * sine,
    offset[1],
    -offset[0] * sine + offset[2] * cosine,
  ];
};

const add3 = (a: Vec3, b: Vec3): Vec3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];

const legacySteeringState = (state: MotionState): MotionState => {
  const config = resolveMotionConfig({
    fps: Y003_FPS,
    durationFrames: Y003_DURATION_FRAMES,
  });
  const steer = steeringForCurvature(state.curvaturePerM, config);
  return {
    ...state,
    steeringCurvaturePerM: state.curvaturePerM,
    wheels: {
      ...state.wheels,
      FL: {...state.wheels.FL, steerRad: steer.left},
      FR: {...state.wheels.FR, steerRad: steer.right},
    },
  };
};

const wheelForProofFrame = (proofFrame: number) =>
  INSPECTION_ORDER[Math.min(
    INSPECTION_ORDER.length - 1,
    Math.floor(proofFrame / 23),
  )];

const ProofThree: React.FC<{
  proofFrame: number;
  sourceFrame: number;
  legacy: boolean;
}> = ({proofFrame, sourceFrame, legacy}) => {
  const {camera, gl, advance} = useThree();
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [handle] = useState(() =>
    delayRender(
      legacy
        ? 'Loading YUNEX 003 P02 legacy wheel proof'
        : 'Loading YUNEX 003 P02 stabilized wheel proof',
    ),
  );
  const ready = useRef(false);

  const baseState = useMemo(
    () =>
      motionStateAt(sourceFrame, {
        fps: Y003_FPS,
        durationFrames: Y003_DURATION_FRAMES,
      }),
    [sourceFrame],
  );
  const state = useMemo(
    () => (legacy ? legacySteeringState(baseState) : baseState),
    [baseState, legacy],
  );
  const diagnosticState = useMemo<MotionState>(
    () => ({
      ...state,
      // A wheel-local diagnostic station removes world translation/yaw only
      // from the proof camera problem. Spin/steer/load remain sampled from the
      // real production frame, so geometry stability can be judged against a
      // truly fixed camera and ground reference.
      root: {
        ...state.root,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    }),
    [state],
  );
  const rigOptions = useMemo<RuntimeMotionRigOptions>(
    () => ({
      rotationComposition: legacy ? 'legacy-euler' : 'quaternion',
    }),
    [legacy],
  );
  const rig = useMemo(
    () => (model ? createRuntimeMotionRig(model, rigOptions) : null),
    [model, rigOptions],
  );
  const wheelId = wheelForProofFrame(proofFrame);

  useEffect(() => {
    let live = true;
    new GLTFLoader().load(
      staticFile('model.glb'),
      (gltf) => {
        if (!live) return;
        gltf.scene.traverse((object: any) => {
          if (object.isMesh) {
            object.frustumCulled = false;
            object.castShadow = false;
            object.receiveShadow = false;
          }
        });

        // Diagnostic proof only: keep the exact approved wheel + caliper geometry
        // while hiding unrelated body/interior meshes. This makes native moving
        // evidence practical without changing production geometry or materials.
        const assetRoot =
          gltf.scene.getObjectByName('YUNEX_Porsche_911_GT3_RS_992') ??
          gltf.scene;
        for (const child of assetRoot.children) {
          child.visible =
            /^Steer_(FL|FR|RL|RR)$/.test(child.name) ||
            /^Caliper_(RL|RR)$/.test(child.name);
        }

        setModel(gltf.scene);
      },
      undefined,
      cancelRender,
    );
    return () => {
      live = false;
    };
  }, []);

  useEffect(
    () => () => {
      rig?.restore();
    },
    [rig],
  );

  useLayoutEffect(() => {
    const previousShadowEnabled = gl.shadowMap.enabled;
    const previousShadowType = gl.shadowMap.type;
    const previousToneMapping = gl.toneMapping;
    const previousExposure = gl.toneMappingExposure;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.98;
    return () => {
      gl.shadowMap.enabled = previousShadowEnabled;
      gl.shadowMap.type = previousShadowType;
      gl.toneMapping = previousToneMapping;
      gl.toneMappingExposure = previousExposure;
    };
  }, [gl]);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const wheel = state.wheels[wheelId];
    const sideSign = wheelId[1] === 'L' ? 1 : -1;
    const cameraTarget: Vec3 = [
      wheel.centreLocal[0],
      wheel.centreLocal[1] + 0.015,
      wheel.centreLocal[2],
    ];
    const cameraPosition: Vec3 = [
      wheel.centreLocal[0] + sideSign * 3.15,
      wheel.centreLocal[1] + 0.22,
      wheel.centreLocal[2] + 0.08,
    ];

    perspective.position.set(...cameraPosition);
    perspective.fov = focalLengthToVerticalFov(54);
    perspective.near = 0.05;
    perspective.far = 80;
    perspective.lookAt(...cameraTarget);
    perspective.updateProjectionMatrix();

    if (rig) rig.apply(diagnosticState);
    advance(proofFrame * (1000 / Y003_FPS));
  }, [advance, camera, diagnosticState, proofFrame, rig, state, wheelId]);

  useEffect(() => {
    if (!model || !rig || ready.current) return;
    ready.current = true;
    continueRender(handle);
  }, [handle, model, rig]);

  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 9, 7]} intensity={2.15} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#676b6d" roughness={0.94} metalness={0.02} />
      </mesh>
      {model ? <primitive object={model} /> : null}
    </>
  );
};

const ProofViewport: React.FC<{
  proofFrame: number;
  sourceFrame: number;
  legacy: boolean;
  height: number;
}> = ({proofFrame, sourceFrame, legacy, height}) => {
  const wheelId = wheelForProofFrame(proofFrame);
  return (
    <AbsoluteFill style={{height, background: '#111416'}}>
      <ThreeCanvas
        width={WIDTH}
        height={height}
        camera={{position: [4, 1, 6], fov: 38, near: 0.05, far: 80}}
        gl={{antialias: false, alpha: false, preserveDrawingBuffer: true}}
      >
        <ProofThree
          proofFrame={proofFrame}
          sourceFrame={sourceFrame}
          legacy={legacy}
        />
      </ThreeCanvas>
      <div
        style={{
          position: 'absolute',
          left: 34,
          bottom: 28,
          fontFamily: 'Arial, sans-serif',
          fontSize: 31,
          fontWeight: 700,
          letterSpacing: 2,
          color: 'white',
          textShadow: '0 2px 8px rgba(0,0,0,.75)',
        }}
      >
        {wheelId}
      </div>
    </AbsoluteFill>
  );
};

const sourceStartFor = (variant: P02WheelProofVariant) => {
  if (variant === 'neutral') return 100;
  if (variant === 'steering') return 190;
  return 290;
};

export const PolishWheelProofScene: React.FC<{
  variant: P02WheelProofVariant;
}> = ({variant}) => {
  const proofFrame = useCurrentFrame();
  const sourceFrame = sourceStartFor(variant) + proofFrame;

  if (variant !== 'comparison') {
    return (
      <AbsoluteFill style={{background: '#111416'}}>
        <ProofViewport
          proofFrame={proofFrame}
          sourceFrame={sourceFrame}
          legacy={false}
          height={HEIGHT}
        />
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 36,
            fontFamily: 'Arial, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,.8)',
          }}
        >
          {variant === 'neutral'
            ? 'P02 · NEUTRAL ROLL · STABILIZED'
            : 'P02 · STEERING / LOAD · STABILIZED'}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{background: '#090b0c'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: WIDTH, height: HALF_HEIGHT}}>
        <ProofViewport
          proofFrame={proofFrame}
          sourceFrame={sourceFrame}
          legacy
          height={HALF_HEIGHT}
        />
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 30,
            fontFamily: 'Arial, sans-serif',
            fontSize: 27,
            fontWeight: 800,
            letterSpacing: 2,
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,.8)',
          }}
        >
          BEFORE · RAW CURVATURE + EULER
        </div>
      </div>
      <div style={{position: 'absolute', top: HALF_HEIGHT, left: 0, width: WIDTH, height: HALF_HEIGHT}}>
        <ProofViewport
          proofFrame={proofFrame}
          sourceFrame={sourceFrame}
          legacy={false}
          height={HALF_HEIGHT}
        />
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 30,
            fontFamily: 'Arial, sans-serif',
            fontSize: 27,
            fontWeight: 800,
            letterSpacing: 2,
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,.8)',
          }}
        >
          AFTER · LOOKAHEAD CURVATURE + QUATERNION
        </div>
      </div>
    </AbsoluteFill>
  );
};
