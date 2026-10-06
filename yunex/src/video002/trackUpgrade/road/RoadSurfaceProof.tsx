import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TechnicalTrackWorld} from '../../../TrackPreview';
import {focalLengthToVerticalFov, poseFor} from '../../cameras';
import {RoadSurfaces} from '../RoadSurfaces';
import {runRoadSurfaceContractTests} from './roadSurfaceTests';

export const ROAD_PROOF_CONTRACT = runRoadSurfaceContractTests();

export type RoadSurfaceProofFrameProps = {
  sourceFrame: number;
  upgraded: boolean;
  label: string;
};

const W = 1080;
const H = 1920;

const Scene: React.FC<RoadSurfaceProofFrameProps> = ({sourceFrame, upgraded}) => {
  const {camera, gl, scene, advance} = useThree();
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender('Loading YUNEX 002 A_ROAD native proof'));
  const ready = useRef(false);
  const pose = poseFor(sourceFrame);

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
        setModel(gltf.scene);
      },
      undefined,
      cancelRender,
    );
    return () => {
      live = false;
    };
  }, []);

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.02;
    scene.background = new THREE.Color('#aebfc2');
    return () => {
      scene.background = null;
    };
  }, [gl, scene]);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.position.set(...pose.camera.position);
    perspective.fov = focalLengthToVerticalFov(pose.camera.focalLength);
    perspective.lookAt(...pose.camera.target);
    perspective.updateProjectionMatrix();

    if (!model) return;
    model.position.set(...pose.rootPose.position);
    model.rotation.set(...pose.rootPose.rotation);
    model.updateMatrixWorld(true);
    advance(sourceFrame * (1000 / 30));
  }, [
    advance,
    camera,
    model,
    pose.camera.focalLength,
    pose.camera.position,
    pose.camera.target,
    pose.rootPose.position,
    pose.rootPose.rotation,
    sourceFrame,
  ]);

  useEffect(() => {
    if (!model || ready.current) return;
    ready.current = true;
    continueRender(handle);
  }, [handle, model]);

  return (
    <>
      <hemisphereLight args={['#e8efec', '#30362f', 1.48]} />
      <directionalLight position={[-4.5, 7.5, 5.5]} intensity={3.35} color="#ffe8ca" />
      <directionalLight position={[5, 3, -4]} intensity={0.92} color="#c8d9e8" />
      <TechnicalTrackWorld groundY={-0.028} />
      {upgraded && (
        <group position={[-1, -0.028, 0]} rotation={[0, Math.PI, 0]}>
          <RoadSurfaces quality="final" seed={2103} />
        </group>
      )}
      {model && <primitive object={model} />}
    </>
  );
};

export const RoadSurfaceProofFrame: React.FC<RoadSurfaceProofFrameProps> = (props) => (
  <AbsoluteFill style={{background: '#aebfc2'}}>
    <ThreeCanvas
      width={W}
      height={H}
      camera={{position: [4.4, 1.7, -7.4], fov: 42, near: 0.05, far: 160}}
      gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}
    >
      <Scene {...props} />
    </ThreeCanvas>
    <div
      style={{
        position: 'absolute',
        left: 54,
        top: 70,
        padding: '12px 18px',
        background: 'rgba(15,18,17,.62)',
        color: '#f3efe6',
        fontFamily: 'Arial, sans-serif',
        fontSize: 25,
        fontWeight: 800,
        letterSpacing: 2.1,
      }}
    >
      {props.label}
    </div>
    <div
      style={{
        position: 'absolute',
        left: 54,
        bottom: 54,
        color: '#f3efe6',
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: 1.7,
        textShadow: '0 2px 12px rgba(0,0,0,.7)',
      }}
    >
      SOURCE FRAME {props.sourceFrame} · TRUE 1080×1920 · SAME CAMERA / CAR POSE
    </div>
  </AbsoluteFill>
);
