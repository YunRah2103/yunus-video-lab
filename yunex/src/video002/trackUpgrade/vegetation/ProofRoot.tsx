import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {
  AbsoluteFill,
  Composition,
  Still,
  cancelRender,
  continueRender,
  delayRender,
  registerRoot,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TrackVegetation} from '../TrackVegetation';
import {
  buildVegetationLayout,
  estimateVegetationBudget,
  validateVegetationLayout,
  vegetationLayoutSignature,
} from './layout';
import {focalLengthToVerticalFov, poseFor} from '../../cameras';

type Variant = 'old' | 'new';

const managerCameraPoseFor = (frame: number) => {
  const next = poseFor(frame);
  const [rootX,,rootZ] = next.rootPose.position;
  if (frame >= 285 && frame < 405) {
    next.camera = {
      position: [rootX - 8.6, 1.72, rootZ + 0.18],
      target: [rootX, 0.65, rootZ + 0.08],
      focalLength: 28,
    };
  } else if (frame >= 405 && frame < 540) {
    next.camera = {
      position: [rootX - 5.8, 2.18, rootZ - 7.2],
      target: [rootX, 0.72, rootZ - 0.72],
      focalLength: 31,
    };
  } else if (frame >= 660) {
    next.camera = {
      position: [rootX - 5.6, 1.68, rootZ + 7.5],
      target: [rootX, 0.58, rootZ + 0.55],
      focalLength: 30,
    };
  }
  return next;
};

const validateContract = () => {
  const messages: string[] = [];
  for (const quality of ['preview', 'final'] as const) {
    const a = buildVegetationLayout(2103, quality);
    const b = buildVegetationLayout(2103, quality);
    if (vegetationLayoutSignature(a) !== vegetationLayoutSignature(b)) {
      messages.push(`${quality}: deterministic layout mismatch`);
    }
    messages.push(...validateVegetationLayout(a).map((message) => `${quality}: ${message}`));
    const budget = estimateVegetationBudget(a, quality);
    if (budget.approximateDrawCalls > 8) messages.push(`${quality}: draw call estimate too high`);
    if (budget.transparentObjectCount !== 0) messages.push(`${quality}: transparent foliage detected`);
  }

  const layout = buildVegetationLayout(2103, 'final');
  for (let frame = 0; frame <= 750; frame += 5) {
    const pose = managerCameraPoseFor(frame);
    const localCameraX = -(pose.camera.position[0] + 1);
    const localCameraZ = -pose.camera.position[2];
    for (const tree of layout.trees) {
      const distance = Math.hypot(tree.x - localCameraX, tree.z - localCameraZ);
      if (distance < 1.55) messages.push(`camera/tree clearance <1.55m at frame ${frame}`);
    }
    for (const shrub of layout.shrubs) {
      const distance = Math.hypot(shrub.x - localCameraX, shrub.z - localCameraZ);
      if (distance < 1.0) messages.push(`camera/shrub clearance <1.0m at frame ${frame}`);
    }
  }
  if (messages.length) throw new Error(`Y002 Agent C vegetation contract failed:\n${messages.join('\n')}`);
};

validateContract();

const makeLegacyLayout = () => {
  let seed = 2103;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const treeColors = ['#34483a','#405142','#495846','#2f4438'];
  const shrubColors = ['#42513d','#4b5943','#384a39','#526048'];
  const trees = Array.from({length: 10}, (_, i) => ({
    x: -6.3 - random() * 5.5,
    z: -10.5 + i * 2.35 + (random() - 0.5) * 1.15,
    scale: 0.78 + random() * 0.58,
    yaw: (random() - 0.5) * 0.8,
    color: treeColors[Math.floor(random() * treeColors.length)],
    crownWidth: 0.86 + random() * 0.30,
    crownHeight: 0.88 + random() * 0.26,
    asymmetry: (random() - 0.5) * 0.34,
    lean: (random() - 0.5) * 0.08,
    crownVariant: i % 3,
  }));
  const shrubs = Array.from({length: 24}, () => ({
    x: -4.55 - random() * 4.4,
    z: -11 + random() * 22,
    scale: 0.55 + random() * 0.75,
    yaw: (random() - 0.5) * 1.4,
    color: shrubColors[Math.floor(random() * shrubColors.length)],
  }));
  return {trees, shrubs};
};

const LegacyVegetation: React.FC = () => {
  const layout = useMemo(makeLegacyLayout, []);
  const crownVariants = [
    [[-0.18,1.48,0.04,0.92,0.78,0.76],[0.38,1.60,-0.12,0.66,0.76,0.62],[-0.52,1.72,0.10,0.58,0.67,0.58],[0.08,1.98,0.01,0.72,0.64,0.69],[-0.10,2.22,-0.03,0.44,0.48,0.43]],
    [[-0.08,1.46,-0.02,0.78,0.84,0.72],[0.48,1.70,0.06,0.62,0.68,0.60],[-0.42,1.62,-0.12,0.72,0.70,0.67],[0.02,2.00,0.10,0.64,0.74,0.60],[0.28,2.22,-0.05,0.42,0.45,0.40]],
    [[-0.22,1.58,0.08,0.74,0.74,0.70],[0.34,1.48,-0.08,0.78,0.70,0.72],[-0.50,1.86,-0.02,0.55,0.60,0.52],[0.12,1.94,0.08,0.76,0.66,0.70],[0.04,2.25,-0.05,0.48,0.50,0.44]],
  ] as const;
  return (
    <group>
      {layout.shrubs.map((item, index) => (
        <group key={`s-${index}`} position={[item.x, 0.05, item.z]} rotation={[0, item.yaw, 0]} scale={item.scale}>
          {[
            [-0.38,0.34,0.02,0.72,0.55,0.62],
            [0.24,0.38,-0.08,0.78,0.64,0.68],
            [0.02,0.52,0.24,0.62,0.66,0.58],
          ].map((v, i) => (
            <mesh key={i} position={[v[0],v[1],v[2]]} scale={[v[3],v[4],v[5]]}>
              <sphereGeometry args={[0.72, 8, 6]}/>
              <meshStandardMaterial color={item.color} roughness={0.97} flatShading/>
            </mesh>
          ))}
        </group>
      ))}
      {layout.trees.map((item, index) => (
        <group key={`t-${index}`} position={[item.x, 0.02, item.z]} rotation={[0, item.yaw, 0]} scale={item.scale}>
          <mesh position={[item.lean * 0.24, 0.72, 0]} rotation={[0, 0, item.lean]}>
            <cylinderGeometry args={[0.085, 0.14, 1.45, 8]}/>
            <meshStandardMaterial color="#554a38" roughness={0.92}/>
          </mesh>
          <group position={[item.asymmetry * 0.15, 0, 0]}>
            {crownVariants[item.crownVariant].map((v, i) => (
              <mesh
                key={i}
                position={[v[0] + item.asymmetry * (i % 2 === 0 ? 0.18 : -0.10), v[1], v[2]]}
                scale={[v[3] * item.crownWidth, v[4] * item.crownHeight, v[5] * (0.94 + item.crownWidth * 0.08)]}
              >
                <icosahedronGeometry args={[0.82, 1]}/>
                <meshStandardMaterial color={item.color} roughness={0.98} flatShading/>
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
};

const ProofTrackBase: React.FC = () => (
  <>
    <mesh position={[0, -0.018, 4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8.0, 76]}/>
      <meshStandardMaterial color="#555a5a" roughness={0.95}/>
    </mesh>
    <mesh position={[-8.7, -0.025, 4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10.0, 76]}/>
      <meshStandardMaterial color="#59634f" roughness={1}/>
    </mesh>
    <mesh position={[-3.63, 0.49, 4]} rotation={[0, Math.PI / 2, 0]}>
      <boxGeometry args={[76, 0.27, 0.11]}/>
      <meshStandardMaterial color="#aeb2b2" metalness={0.82} roughness={0.28}/>
    </mesh>
  </>
);

const ProofScene: React.FC<{variant: Variant; proofFrame: number}> = ({variant, proofFrame}) => {
  const {camera, gl, scene, advance} = useThree();
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender('Loading approved Porsche for Agent C vegetation proof'));
  const ready = useRef(false);
  const pose = useMemo(() => managerCameraPoseFor(proofFrame), [proofFrame]);

  useEffect(() => {
    let live = true;
    new GLTFLoader().load(
      staticFile('model.glb'),
      (gltf) => {
        if (!live) return;
        gltf.scene.traverse((object: any) => {
          if (object.isMesh) {
            object.castShadow = false;
            object.receiveShadow = false;
            object.frustumCulled = false;
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
    gl.toneMappingExposure = 1.0;
    scene.background = new THREE.Color('#aebfc2');
    scene.fog = new THREE.Fog('#aebfc2', 23, 52);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [gl, scene]);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.position.set(...pose.camera.position);
    perspective.fov = focalLengthToVerticalFov(pose.camera.focalLength);
    perspective.lookAt(...pose.camera.target);
    perspective.updateProjectionMatrix();
    if (model) {
      model.position.set(...pose.rootPose.position);
      model.rotation.set(...pose.rootPose.rotation);
      model.updateMatrixWorld(true);
      advance(proofFrame * (1000 / 30));
    }
  }, [advance, camera, model, pose, proofFrame]);

  useEffect(() => {
    if (!model || ready.current) return;
    ready.current = true;
    continueRender(handle);
  }, [handle, model]);

  return (
    <>
      <hemisphereLight args={['#e8efec', '#30362f', 1.45]}/>
      <directionalLight position={[-4.5, 7.5, 5.5]} intensity={3.25} color="#ffe8ca"/>
      <directionalLight position={[5, 3, -4]} intensity={0.85} color="#c8d9e8"/>
      <group position={[-1, -0.028, 0]} rotation={[0, Math.PI, 0]}>
        <ProofTrackBase/>
        {variant === 'old' ? <LegacyVegetation/> : <TrackVegetation quality="final" seed={2103}/>}
      </group>
      {model && <primitive object={model}/>}
    </>
  );
};

const ProofCanvas: React.FC<{variant: Variant; proofFrame: number}> = ({variant, proofFrame}) => (
  <AbsoluteFill style={{background: '#aebfc2'}}>
    <ThreeCanvas
      width={1080}
      height={1920}
      camera={{position: [4.4, 1.7, -7.4], fov: 42, near: 0.05, far: 180}}
      gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}
    >
      <ProofScene variant={variant} proofFrame={proofFrame}/>
    </ThreeCanvas>
  </AbsoluteFill>
);

const ParallaxProof: React.FC = () => {
  const frame = useCurrentFrame();
  const proofFrame = Math.round(555 + (frame / 71) * 150);
  return <ProofCanvas variant="new" proofFrame={proofFrame}/>;
};

const Root: React.FC = () => (
  <>
    <Still id="Y002-C-OLD-F40" component={() => <ProofCanvas variant="old" proofFrame={40}/>} width={1080} height={1920}/>
    <Still id="Y002-C-NEW-F40" component={() => <ProofCanvas variant="new" proofFrame={40}/>} width={1080} height={1920}/>
    <Still id="Y002-C-OLD-F260" component={() => <ProofCanvas variant="old" proofFrame={260}/>} width={1080} height={1920}/>
    <Still id="Y002-C-NEW-F260" component={() => <ProofCanvas variant="new" proofFrame={260}/>} width={1080} height={1920}/>
    <Still id="Y002-C-OLD-F700" component={() => <ProofCanvas variant="old" proofFrame={700}/>} width={1080} height={1920}/>
    <Still id="Y002-C-NEW-F700" component={() => <ProofCanvas variant="new" proofFrame={700}/>} width={1080} height={1920}/>
    <Composition id="Y002-C-NEW-PARALLAX" component={ParallaxProof} width={1080} height={1920} fps={30} durationInFrames={72}/>
  </>
);

registerRoot(Root);
