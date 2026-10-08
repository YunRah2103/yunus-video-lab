/**
 * Agent A proof-only native Remotion scene, not Y004 central composition.
 * Deliberate fixed-world trackside stations: camera is static between cuts.
 * Separate low/high editorial drives, existing car/track, no recreated assets.
 *
 * Uses the P03 runtime rig pending Agent B's rear-caliper steering correction.
 * The isolated A proof verifies travel/pose, NOT caliper correctness.
 */
import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TrackWorld} from '../../video002/trackUpgrade/TrackWorld';
import {createRuntimeMotionRig} from '../../video003/motion/runtimeArticulation';
import type {Vec3} from '../../video003/motion/contract';
import {y004MotionAtFrame} from './index';

export type AgentAProofMode = 'low' | 'high';
const SOURCE_START = {low: 150, high: 285} as const;
const PROOF_FRAMES = 120;
const FRAMES_PER_STATION = 24;

const rotate = (offset: Vec3, yaw: number): Vec3 => [
  offset[0] * Math.cos(yaw) + offset[2] * Math.sin(yaw),
  offset[1],
  -offset[0] * Math.sin(yaw) + offset[2] * Math.cos(yaw),
];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];

const MotionProof3D: React.FC<{frame: number; mode: AgentAProofMode}> = ({frame,mode}) => {
  const {gl,camera,advance} = useThree();
  const sourceFrame = SOURCE_START[mode] + frame;
  const state = useMemo(() => y004MotionAtFrame(sourceFrame), [sourceFrame]);
  // The station is anchored to the track at a specific immutable source frame.
  // Re-aim ONLY on an explicit editorial cut, never chase the moving Porsche.
  const stationIndex = Math.floor(frame / FRAMES_PER_STATION);
  const stationFrame = SOURCE_START[mode] +
    stationIndex * FRAMES_PER_STATION + Math.floor(FRAMES_PER_STATION / 2);
  const station = useMemo(() => y004MotionAtFrame(stationFrame),[stationFrame]);
  const [model,setModel] = useState<THREE.Group|null>(null);
  const [handle] = useState(() => delayRender('Loading Y004 Agent A world-driving native proof'));
  const ready = useRef(false);
  const rig = useMemo(() => model ? createRuntimeMotionRig(model) : null,[model]);

  useEffect(() => {
    let alive = true;
    new GLTFLoader().load(staticFile('model.glb'), gltf => {
      if (!alive) return;
      gltf.scene.traverse((o:any) => {
        if (o.isMesh) {o.frustumCulled=false; o.castShadow=true; o.receiveShadow=false;}
      });
      setModel(gltf.scene);
    },undefined,cancelRender);
    return ()=>{alive=false;};
  },[]);
  useEffect(() => () => {rig?.restore();},[rig]);
  useEffect(() => {
    if (!model || !rig || ready.current) return;
    ready.current=true;
    continueRender(handle);
  },[model,rig,handle]);
  useLayoutEffect(() => {
    const oldShadow = gl.shadowMap.enabled;
    const oldType = gl.shadowMap.type;
    const oldTone = gl.toneMapping;
    const oldExp = gl.toneMappingExposure;
    gl.shadowMap.enabled=true;
    gl.shadowMap.type=THREE.PCFSoftShadowMap;
    gl.toneMapping=THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure=0.94;
    return () => {
      gl.shadowMap.enabled=oldShadow;
      gl.shadowMap.type=oldType;
      gl.toneMapping=oldTone;
      gl.toneMappingExposure=oldExp;
    };
  },[gl]);
  useLayoutEffect(() => {
    const p = camera as THREE.PerspectiveCamera;
    const origin = station.motion.root.position;
    const yaw = station.motion.root.rotation[1];
    const cameraPosition = add(origin,rotate([-19,2.7,7.5],yaw));
    const target = add(origin,rotate([0,0.55,0],yaw));
    p.position.set(...cameraPosition);
    p.fov=(2*Math.atan(24/(2*22))*180)/Math.PI;
    p.near=0.05;
    p.far=190;
    p.lookAt(...target);
    p.updateProjectionMatrix();
    rig?.apply(state.motion);
    advance(frame*(1000/30));
  },[advance,camera,frame,rig,state,station]);
  return <>
    <TrackWorld quality="final" seed={3003}/>
    {model ? <primitive object={model}/> : null}
  </>;
};

export const AgentAProofScene: React.FC<{mode: AgentAProofMode}> = ({mode}) => {
  const frame = useCurrentFrame();
  const s = y004MotionAtFrame(SOURCE_START[mode]+frame);
  const frontDeg=(s.steerRad.FL+s.steerRad.FR)*90/Math.PI;
  const rearDeg=(s.steerRad.RL+s.steerRad.RR)*90/Math.PI;
  return <AbsoluteFill style={{background:'#b7c5ca'}}>
    <ThreeCanvas width={1080} height={1920}
      camera={{position:[0,2,8],fov:50,near:0.05,far:190}}
      gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}} shadows>
      <MotionProof3D frame={frame} mode={mode}/>
    </ThreeCanvas>
    <div style={{position:'absolute',top:90,left:70,color:'#e8fff4',
      background:'rgba(0,24,22,.72)',padding:'18px 22px',borderRadius:7,
      fontFamily:'Arial,sans-serif',fontSize:30,lineHeight:1.35}}>
      <strong>AGENT A NATIVE DRIVING PROOF — {mode.toUpperCase()}</strong>
      <div>Front: {frontDeg.toFixed(2)}° / Rear: {rearDeg.toFixed(2)}°</div>
      <div>Fixed trackside camera between explicit 24-frame cuts</div>
      <div>Not final film graphics or caliper QA</div>
    </div>
  </AbsoluteFill>;
};
