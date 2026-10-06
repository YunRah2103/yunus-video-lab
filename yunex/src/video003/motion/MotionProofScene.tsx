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
import {TrackWorld} from '../../video002/trackUpgrade/TrackWorld';
import {
  DEFAULT_MOTION_CONFIG,
  motionStateAt,
  type Vec3,
} from './contract';
import {createRuntimeMotionRig} from './runtimeArticulation';

const WIDTH = 1080;
const HEIGHT = 1920;
const PROOF_SOURCE_DURATION = DEFAULT_MOTION_CONFIG.durationFrames;

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

const MotionProofThree: React.FC<{frame: number}> = ({frame}) => {
  const {camera, gl, advance} = useThree();
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [handle] = useState(() =>
    delayRender('Loading YUNEX 003 Agent A driving proof'),
  );
  const ready = useRef(false);

  const state = useMemo(
    () =>
      motionStateAt(frame, {
        fps: 30,
        durationFrames: PROOF_SOURCE_DURATION,
      }),
    [frame],
  );
  const fixedStation = useMemo(
    () =>
      motionStateAt(128, {
        fps: 30,
        durationFrames: PROOF_SOURCE_DURATION,
      }),
    [],
  );
  const rig = useMemo(
    () => (model ? createRuntimeMotionRig(model) : null),
    [model],
  );

  useEffect(() => {
    let live = true;
    new GLTFLoader().load(
      staticFile('model.glb'),
      (gltf) => {
        if (!live) return;
        gltf.scene.traverse((object: any) => {
          if (object.isMesh) {
            object.frustumCulled = false;
            object.castShadow = true;
            object.receiveShadow = false;
          }
        });
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
    gl.toneMappingExposure = 0.94;
    return () => {
      gl.shadowMap.enabled = previousShadowEnabled;
      gl.shadowMap.type = previousShadowType;
      gl.toneMapping = previousToneMapping;
      gl.toneMappingExposure = previousExposure;
    };
  }, [gl]);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const yaw = state.root.rotation[1];
    const tracking = frame < 90;

    let cameraPosition: Vec3;
    let cameraTarget: Vec3;
    let focalLength: number;

    if (tracking) {
      cameraPosition = add3(
        state.root.position,
        rotateOffset([-3.7, 1.28, 6.4], yaw),
      );
      cameraTarget = add3(
        state.root.position,
        rotateOffset([0, 0.58, 0.8], yaw),
      );
      focalLength = 31;
    } else {
      const stationYaw = fixedStation.root.rotation[1];
      cameraPosition = add3(
        fixedStation.root.position,
        rotateOffset([-6.2, 1.48, 0.8], stationYaw),
      );
      cameraTarget = add3(
        fixedStation.root.position,
        rotateOffset([0, 0.55, 0.15], stationYaw),
      );
      focalLength = 46;
    }

    perspective.position.set(...cameraPosition);
    perspective.fov = focalLengthToVerticalFov(focalLength);
    perspective.lookAt(...cameraTarget);
    perspective.updateProjectionMatrix();

    if (rig) rig.apply(state);
    advance(frame * (1000 / 30));
  }, [advance, camera, fixedStation, frame, rig, state]);

  useEffect(() => {
    if (!model || !rig || ready.current) return;
    ready.current = true;
    continueRender(handle);
  }, [handle, model, rig]);

  return (
    <>
      <TrackWorld quality="final" seed={3003} />
      {model ? <primitive object={model} /> : null}
    </>
  );
};

export const MotionProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#aebfc2'}}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        camera={{position: [4, 1.5, 7], fov: 42, near: 0.05, far: 180}}
        gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}
        shadows
      >
        <MotionProofThree frame={frame} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
