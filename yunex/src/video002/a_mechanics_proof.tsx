import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
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
import {TrackEnvironment} from '../TrackPreview';
import {AeroStateInput, blendAeroModes, createActiveAeroRig} from './activeAero';
import {FrontFlaps} from './frontFlaps';

const W = 1080;
const H = 1920;

const solidTexture = (rgb: [number, number, number]) => {
  const data = new Uint8Array([...rgb, 255]);
  const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
};

const stateAt = (frame: number): AeroStateInput => {
  if (frame < 18) return {mode: 'highDownforce', transition: interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})};
  if (frame < 42) return blendAeroModes('highDownforce', 'drs', interpolate(frame, [20, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return blendAeroModes('drs', 'airbrake', interpolate(frame, [46, 62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
};

const labelAt = (frame: number) => (frame < 20 ? 'HIGH DOWNFORCE' : frame < 46 ? 'DRS' : 'AIRBRAKE');

const Scene: React.FC<{frame: number; state: AeroStateInput}> = ({frame, state}) => {
  const [source, setSource] = useState<THREE.Object3D | null>(null);
  const [handle] = useState(() => delayRender('Loading YUNEX 002 Agent A mechanics proof'));
  const ready = useRef(false);
  const {camera, advance} = useThree();
  const asphalt = useMemo(() => solidTexture([82, 86, 87]), []);
  const grass = useMemo(() => solidTexture([104, 112, 91]), []);

  useEffect(() => {
    let live = true;
    new GLTFLoader()
      .loadAsync(staticFile('model.glb'))
      .then((gltf) => {
        if (live) setSource(gltf.scene);
      })
      .catch(cancelRender);
    return () => {
      live = false;
    };
  }, []);

  const car = useMemo(() => (source ? source.clone(true) : null), [source]);
  const rig = useMemo(() => (car ? createActiveAeroRig(car) : null), [car]);

  useLayoutEffect(() => {
    if (!car || !rig) return;
    car.position.set(0, 0, -0.05);
    car.rotation.set(0, -0.09, 0);
    rig.apply(state);
    car.updateMatrixWorld(true);
  }, [car, rig, state.mode, state.transition, state.rearAngle, state.frontAngle]);

  useLayoutEffect(() => {
    const t = interpolate(frame, [0, 83], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    camera.position.set(3.0 - t * 0.28, 2.15 + t * 0.08, -4.15 + t * 0.18);
    camera.lookAt(0, 1.12, -1.54);
    camera.updateProjectionMatrix();
  }, [camera, frame]);

  useEffect(() => {
    if (!car || !rig || ready.current) return;
    ready.current = true;
    advance(performance.now());
    continueRender(handle);
  }, [advance, car, handle, rig]);

  return (
    <>
      <color attach="background" args={['#b7c4c4']}/>
      <ambientLight intensity={1.05}/>
      <directionalLight position={[4, 7, -2]} intensity={2.2}/>
      <directionalLight position={[-4, 3, 5]} intensity={0.8}/>
      <TrackEnvironment asphalt={asphalt} grass={grass} mode="technical"/>
      {car && <primitive object={car}/>} 
      {car && <group position={car.position} rotation={car.rotation}><FrontFlaps state={state} opacity={0.98}/></group>}
    </>
  );
};

export const AgentAMechanicsProof: React.FC = () => {
  const frame = useCurrentFrame();
  const state = stateAt(frame);
  const label = labelAt(frame);
  return (
    <AbsoluteFill style={{background: '#aebfc2', overflow: 'hidden'}}>
      <ThreeCanvas
        width={W}
        height={H}
        camera={{position: [3, 2.15, -4.15], fov: 31, near: 0.1, far: 100}}
        gl={{antialias: true, alpha: false, preserveDrawingBuffer: true}}
      >
        <Scene frame={frame} state={state}/>
      </ThreeCanvas>
      <div style={{position: 'absolute', top: 112, left: 70, right: 70, color: '#f2ede3', textShadow: '0 4px 24px #000', fontFamily: 'Arial, sans-serif'}}>
        <div style={{fontSize: 19, fontWeight: 700, letterSpacing: 4.2, opacity: 0.72}}>YUNEX 002 · AGENT A MECHANICS PROOF</div>
        <div style={{fontSize: 58, fontWeight: 900, letterSpacing: -1.2, marginTop: 8}}>{label}</div>
        <div style={{fontSize: 20, fontWeight: 700, letterSpacing: 2.3, marginTop: 8, opacity: 0.74}}>UPPER PLANE MOVES · MAIN PLANE / SUPPORTS STAY FIXED</div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 72, color: '#f2ede3', fontFamily: 'Arial, sans-serif', fontSize: 16, letterSpacing: 2.2, opacity: 0.66, textShadow: '0 3px 16px #000'}}>
        ILLUSTRATIVE POSE ANGLES · APPROVED EXTERIOR GLB UNCHANGED
      </div>
    </AbsoluteFill>
  );
};
