/** Agent B native mechanical proof, real Porsche GLB on approved moving circuit. */
import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill,delayRender,continueRender,cancelRender,staticFile,useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TrackWorld} from '../../video002/trackUpgrade/TrackWorld';
import {motionStateAt,type MotionState,type Vec3} from '../../video003/motion/contract';
import {createY004RearSteerRig,Y004_MAX_REAR_STEER_RAD} from './index';

export const Y004_B_PROOF_FPS=30;
export const Y004_B_PROOF_FRAMES=150;
export type Y004BProofRegime='low'|'high';
const add=(a:Vec3,b:Vec3):Vec3=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const rotate=(v:Vec3,y:number):Vec3=>[
 v[0]*Math.cos(y)+v[2]*Math.sin(y),v[1],-v[0]*Math.sin(y)+v[2]*Math.cos(y),
];
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};

/** FIXTURE until A's motion SHA is accepted. Independent low/high driving runs. */
export const y004BProofMotion=(frame:number,regime:Y004BProofRegime):MotionState=>{
 const sourceFrame=(regime==='low'?182:314)+frame;
 const state=motionStateAt(sourceFrame,{fps:30,durationFrames:735});
 const front=(state.wheels.FL.steerRad+state.wheels.FR.steerRad)/2;
 const direction=Math.sign(front||1);
 const ramp=ease(frame/25)*(1-.12*ease((frame-115)/34));
 const rear=(regime==='low'?-1:1)*direction*.8*Y004_MAX_REAR_STEER_RAD*ramp;
 return {...state,wheels:{...state.wheels,
  RL:{...state.wheels.RL,steerRad:rear},
  RR:{...state.wheels.RR,steerRad:rear},
 }};
};

const ProofThree:React.FC<{frame:number;regime:Y004BProofRegime}>=({frame,regime})=>{
 const {camera,gl,advance}=useThree();
 const [model,setModel]=useState<THREE.Group|null>(null);
 const [handle]=useState(()=>delayRender('Y004 B real GLB rear wheel macro proof'));
 const ready=useRef(false);
 const state=useMemo(()=>y004BProofMotion(frame,regime),[frame,regime]);
 const rig=useMemo(()=>model?createY004RearSteerRig(model):null,[model]);
 useEffect(()=>{
  let active=true;
  new GLTFLoader().load(staticFile('model.glb'),gltf=>{
   if(!active)return;
   gltf.scene.traverse((o:any)=>{
    if(o.isMesh){o.frustumCulled=false;o.castShadow=true;o.receiveShadow=false;}
   });
   setModel(gltf.scene);
  },undefined,cancelRender);
  return ()=>{active=false;};
 },[]);
 useEffect(()=>()=>{rig?.dispose();},[rig]);
 useLayoutEffect(()=>{
  const oldEnabled=gl.shadowMap.enabled,oldType=gl.shadowMap.type;
  const oldTone=gl.toneMapping,oldExposure=gl.toneMappingExposure;
  gl.shadowMap.enabled=true;gl.shadowMap.type=THREE.PCFSoftShadowMap;
  gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=.96;
  return ()=>{
   gl.shadowMap.enabled=oldEnabled;gl.shadowMap.type=oldType;
   gl.toneMapping=oldTone;gl.toneMappingExposure=oldExposure;
  };
 },[gl]);
 useLayoutEffect(()=>{
  const p=camera as THREE.PerspectiveCamera;
  const yaw=state.root.rotation[1];
  // Camera is tied to rolling rear quarter; stationary track provides parallax.
  const target=add(state.root.position,rotate([-.75,.39,-1.15],yaw));
  const pos=add(state.root.position,rotate([-3.15,1.12,-3.7],yaw));
  p.position.set(...pos);p.near=.05;p.far=190;
  p.fov=(2*Math.atan(24/(2*44))*180)/Math.PI;
  p.lookAt(...target);p.updateProjectionMatrix();
  rig?.apply(state);
  advance(frame*1000/Y004_B_PROOF_FPS);
 },[camera,advance,frame,rig,state]);
 useEffect(()=>{
  if(!model||!rig||ready.current)return;
  ready.current=true;continueRender(handle);
 },[model,rig,handle]);
 return <>
  <TrackWorld quality="final" seed={4004}
    carPose={{position:state.root.position,rotation:state.root.rotation}}/>
  {model?<primitive object={model}/>:null}
 </>;
};

export const BRearRigProofScene:React.FC<{regime:Y004BProofRegime}>=({regime})=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{background:'#93a9ac'}}>
  <ThreeCanvas width={1080} height={1920} camera={{
   position:[2,2,8],fov:42,near:.05,far:190
  }} gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}} shadows>
   <ProofThree frame={frame} regime={regime}/>
  </ThreeCanvas>
  <div style={{position:'absolute',top:66,left:54,
   fontFamily:'Arial, sans-serif',fontSize:29,fontWeight:800,color:'#fff',
   textShadow:'0 2px 8px #000',letterSpacing:1.2}}>
   B NATIVE RIG PROOF · {regime.toUpperCase()} · FIXTURE (NOT OEM)
  </div>
  <div style={{position:'absolute',bottom:100,left:54,
   fontFamily:'Arial, sans-serif',fontSize:27,color:'#fff',textShadow:'0 2px 8px #000'}}>
   Rear caliper follows upright · tyre spins independently
  </div>
 </AbsoluteFill>;
};
