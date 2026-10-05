import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TechnicalTrackWorld} from '../TrackPreview';
import {focalLengthToVerticalFov, poseFor} from './cameras';
import {DEFAULT_CAMERA_TIMING} from './driving';

const W = 1080;
const H = 1920;
const PROOF_FRAMES = 225;
const WHEEL_NODES = ['Spin_FL', 'Spin_FR', 'Spin_RL', 'Spin_RR'] as const;

const Scene: React.FC = () => {
  const proofFrame = useCurrentFrame();
  const filmFrame = interpolate(
    proofFrame,
    [0, PROOF_FRAMES - 1],
    [0, DEFAULT_CAMERA_TIMING.finalEnd],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const pose = poseFor(filmFrame, DEFAULT_CAMERA_TIMING);
  const {camera, gl, advance} = useThree();
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender('Loading approved YUNEX Porsche for B camera proof'));
  const ready = useRef(false);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.position.set(...pose.camera.position);
    perspective.fov = focalLengthToVerticalFov(pose.camera.focalLength);
    perspective.lookAt(...pose.camera.target);
    perspective.updateProjectionMatrix();
    if (model) {
      model.position.set(...pose.rootPose.position);
      model.rotation.set(...pose.rootPose.rotation);
      for (const name of WHEEL_NODES) {
        const node = model.getObjectByName(name);
        if (node) node.rotation.x = pose.wheelAngle;
      }
      advance(proofFrame * (1000 / 30));
    }
  }, [advance, camera, model, pose, proofFrame]);

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

  useEffect(() => {
    if (!model || ready.current) return;
    ready.current = true;
    model.position.set(...pose.rootPose.position);
    model.rotation.set(...pose.rootPose.rotation);
    continueRender(handle);
  }, [handle, model, pose.rootPose.position, pose.rootPose.rotation]);

  return (
    <>
      <hemisphereLight args={['#e8f0ef', '#30362f', 1.55]} />
      <directionalLight position={[-4, 7, 5]} intensity={3.3} color="#ffe5c2" />
      <directionalLight position={[5, 3, -4]} intensity={0.85} color="#c8d9e8" />
      <TechnicalTrackWorld groundY={-0.028} />
      {model && <primitive object={model} />}
    </>
  );
};

export const BCameraTrackProof: React.FC = () => {
  const proofFrame = useCurrentFrame();
  const filmFrame = interpolate(
    proofFrame,
    [0, PROOF_FRAMES - 1],
    [0, DEFAULT_CAMERA_TIMING.finalEnd],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const pose = poseFor(filmFrame, DEFAULT_CAMERA_TIMING);
  return (
    <AbsoluteFill style={{background: '#aebfc2', overflow: 'hidden'}}>
      <ThreeCanvas
        width={W}
        height={H}
        camera={{position: [3.35, 1.64, -5.55], fov: 43, near: 0.05, far: 140}}
        gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}
      >
        <Scene />
      </ThreeCanvas>
      <div
        style={{
          position: 'absolute',
          left: 46,
          bottom: 50,
          padding: '8px 12px',
          borderRadius: 4,
          background: 'rgba(8,12,12,.58)',
          color: '#f1eadc',
          fontFamily: 'Arial, sans-serif',
          fontSize: 18,
          letterSpacing: 1.8,
        }}
      >
        B CAMERA PROOF · {pose.shot.replaceAll('-', ' ').toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};

export const B_CAMERA_PROOF_FRAMES = PROOF_FRAMES;
