import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
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
import {TechnicalTrackWorld} from '../../../TrackPreview';
import {focalLengthToVerticalFov, poseFor} from '../../cameras';
import {timingForFrame, VIDEO002_FPS} from '../../timeline';
import {TrackFurniture} from '../TrackFurniture';

const W = 1080;
const H = 1920;
const WHEEL_NODES = ['Spin_FL', 'Spin_FR', 'Spin_RL', 'Spin_RR'] as const;

type ReviewMode = 'before' | 'after';

const managerPoseFor = (frame: number) => {
  const timing = timingForFrame(frame);
  const next = poseFor(frame);
  const [rootX, , rootZ] = next.rootPose.position;

  if (timing.beat.id === 'drs') {
    next.camera = {
      position: [rootX - 8.6, 1.72, rootZ + 0.18],
      target: [rootX, 0.65, rootZ + 0.08],
      focalLength: 28,
    };
  } else if (timing.beat.id === 'airbrake') {
    next.camera = {
      position: [rootX - 5.8, 2.18, rootZ - 7.2],
      target: [rootX, 0.72, rootZ - 0.72],
      focalLength: 31,
    };
  } else if (timing.beat.id === 'payoff') {
    next.camera = {
      position: [rootX - 5.6, 1.68, rootZ + 7.5],
      target: [rootX, 0.58, rootZ + 0.55],
      focalLength: 30,
    };
  }

  return next;
};

const ReviewThreeScene: React.FC<{sourceFrame: number; mode: ReviewMode}> = ({
  sourceFrame,
  mode,
}) => {
  const {camera, gl, scene, advance} = useThree();
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender('Loading approved Porsche for furniture review'));
  const ready = useRef(false);
  const wheelBase = useRef<Record<string, number>>({});
  const pose = useMemo(() => managerPoseFor(sourceFrame), [sourceFrame]);

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
        for (const name of WHEEL_NODES) {
          const node = gltf.scene.getObjectByName(name);
          if (node) wheelBase.current[name] = node.rotation.x;
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
    for (const name of WHEEL_NODES) {
      const node = model.getObjectByName(name);
      if (node) node.rotation.x = (wheelBase.current[name] ?? 0) + pose.wheelAngle;
    }
    model.updateMatrixWorld(true);
    advance(sourceFrame * (1000 / VIDEO002_FPS));
  }, [advance, camera, model, pose, sourceFrame]);

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
      {mode === 'after' ? (
        <group position={[-1, -0.028, 0]} rotation={[0, Math.PI, 0]}>
          <TrackFurniture quality="final" seed={2103} />
        </group>
      ) : null}
      {model ? <primitive object={model} /> : null}
    </>
  );
};

const ReviewFrame: React.FC<{sourceFrame: number; mode: ReviewMode}> = ({
  sourceFrame,
  mode,
}) => (
  <AbsoluteFill style={{background: '#aebfc2'}}>
    <ThreeCanvas
      width={W}
      height={H}
      camera={{position: [4.4, 1.7, -7.4], fov: 42, near: 0.05, far: 160}}
      gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}
    >
      <ReviewThreeScene sourceFrame={sourceFrame} mode={mode} />
    </ThreeCanvas>
  </AbsoluteFill>
);

export const TrackFurnitureQuarterBefore: React.FC = () => (
  <ReviewFrame sourceFrame={250} mode="before" />
);

export const TrackFurnitureQuarterAfter: React.FC = () => (
  <ReviewFrame sourceFrame={250} mode="after" />
);

export const TrackFurnitureSideBefore: React.FC = () => (
  <ReviewFrame sourceFrame={360} mode="before" />
);

export const TrackFurnitureSideAfter: React.FC = () => (
  <ReviewFrame sourceFrame={360} mode="after" />
);

export const TrackFurnitureParallaxProof: React.FC = () => {
  const frame = useCurrentFrame();
  const sourceFrame = Math.min(430, 250 + frame * 2);
  return <ReviewFrame sourceFrame={sourceFrame} mode="after" />;
};
