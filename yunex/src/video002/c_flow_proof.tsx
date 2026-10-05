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
import {AeroFlow} from './AeroFlow';
import type {AeroMode} from './flowPaths';

const W = 1080;
const H = 1920;

const proofState = (frame: number): {
  mode: AeroMode;
  fromMode: AeroMode;
  progress: number;
  title: string;
  detail: string;
} => {
  if (frame < 40) {
    return {
      mode: 'highDownforce',
      fromMode: 'highDownforce',
      progress: 1,
      title: 'HIGH DOWNFORCE',
      detail: 'LOAD · FRONT + REAR',
    };
  }
  if (frame < 80) {
    return {
      mode: 'drs',
      fromMode: 'highDownforce',
      progress: interpolate(frame, [40, 50], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
      title: 'DRS',
      detail: 'REDUCED DEFLECTION · LESS WAKE',
    };
  }
  return {
    mode: 'airbrake',
    fromMode: 'drs',
    progress: interpolate(frame, [80, 90], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    title: 'AIRBRAKE',
    detail: 'DOWNFORCE + REARWARD DRAG',
  };
};

const CFlowScene: React.FC<{frame: number; mode: AeroMode; fromMode: AeroMode; progress: number}> = ({
  frame,
  mode,
  fromMode,
  progress,
}) => {
  const {camera, scene, advance} = useThree();
  const [car, setCar] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender('Loading approved Porsche for C airflow proof'));
  const ready = useRef(false);

  useLayoutEffect(() => {
    scene.background = new THREE.Color('#9aa9aa');
    camera.position.set(4.7, 2.55, 6.65);
    camera.lookAt(0, 0.82, -0.30);
    camera.updateProjectionMatrix();
    if (car) advance(frame * (1000 / 30));
    return () => {
      scene.background = null;
    };
  }, [advance, camera, car, frame, scene]);

  useEffect(() => {
    let live = true;
    new GLTFLoader().load(
      staticFile('model.glb'),
      (gltf) => {
        if (!live) return;
        gltf.scene.traverse((object: any) => {
          if (object.isMesh) {
            object.frustumCulled = false;
          }
        });
        setCar(gltf.scene);
      },
      undefined,
      cancelRender,
    );
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!car || ready.current) return;
    ready.current = true;
    advance(frame * (1000 / 30));
    continueRender(handle);
  }, [advance, car, frame, handle]);

  return <>
    <hemisphereLight args={['#e5ece9', '#303a31', 1.65]}/>
    <directionalLight position={[-4.5, 7.5, 5.5]} intensity={3.25} color="#ffe8ca"/>
    <directionalLight position={[4.5, 3, -4]} intensity={0.85} color="#c8dceb"/>
    <TechnicalTrackWorld groundY={-0.028}/>
    {car && <primitive object={car}/>}
    <AeroFlow
      frame={frame}
      mode={mode}
      fromMode={fromMode}
      progress={progress}
      opacity={0.95}
    />
  </>;
};

export const CFlowProof: React.FC = () => {
  const frame = useCurrentFrame();
  const state = proofState(frame);
  const accent = state.mode === 'airbrake' ? '#c39469' : '#bddb78';

  return <AbsoluteFill style={{background: '#9aa9aa', overflow: 'hidden'}}>
    <ThreeCanvas
      width={W}
      height={H}
      camera={{position: [4.7, 2.55, 6.65], fov: 44, near: 0.1, far: 100}}
      gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}
    >
      <CFlowScene frame={frame} mode={state.mode} fromMode={state.fromMode} progress={state.progress}/>
    </ThreeCanvas>

    <div style={{
      position: 'absolute',
      left: 68,
      top: 104,
      fontFamily: 'Arial, sans-serif',
      color: '#f1eadc',
      textShadow: '0 4px 20px rgba(0,0,0,.55)',
    }}>
      <div style={{fontSize: 22, letterSpacing: 5.2, fontWeight: 700, opacity: 0.72}}>YUNEX 002 · FLOW PROOF</div>
      <div style={{fontSize: 62, lineHeight: 0.95, fontWeight: 900, marginTop: 12}}>{state.title}</div>
      <div style={{fontSize: 22, letterSpacing: 2.6, fontWeight: 800, color: accent, marginTop: 14}}>{state.detail}</div>
    </div>

    <div style={{
      position: 'absolute',
      left: 68,
      bottom: 78,
      fontFamily: 'Arial, sans-serif',
      fontSize: 17,
      letterSpacing: 2.1,
      fontWeight: 700,
      color: 'rgba(241,234,220,.62)',
      textShadow: '0 3px 16px rgba(0,0,0,.55)',
    }}>
      ILLUSTRATIVE AIRFLOW · NOT COMPUTED CFD
    </div>
  </AbsoluteFill>;
};
