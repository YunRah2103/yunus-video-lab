import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TrackWorld} from './trackUpgrade/TrackWorld';
import {AeroFlow} from './AeroFlow';
import {blendAeroModes, createActiveAeroRig, type AeroStateInput} from './activeAero';
import {focalLengthToVerticalFov, poseFor} from './cameras';
import {EditAudioComposition, type Video002SceneProps} from './EditAudioComposition';
import {FrontFlaps} from './frontFlaps';
import {
  VIDEO002_DURATION_FRAMES,
  VIDEO002_FPS,
  secondsToFrame,
} from './timeline';

const W=1080;
const H=1920;
const WHEEL_NODES=['Spin_FL','Spin_FR','Spin_RL','Spin_RR'] as const;

const CAMERA_TIMING={
  fps:VIDEO002_FPS,
  hookEnd:secondsToFrame(2.4),
  wingMacroEnd:secondsToFrame(5.5),
  highDownforceEnd:secondsToFrame(9.5),
  drsEnd:secondsToFrame(13.5),
  brakingEnd:secondsToFrame(18),
  coordinationEnd:secondsToFrame(22),
  finalEnd:VIDEO002_DURATION_FRAMES-1,
} as const;

const aeroStateFor=(timing:Video002SceneProps):AeroStateInput=>{
  switch(timing.beat.id){
    case 'hook':
      return {mode:'highDownforce',transition:timing.transition};
    case 'isolate':
    case 'highDownforce':
      return {mode:'highDownforce',transition:1};
    case 'drs':
      return blendAeroModes('highDownforce','drs',timing.transition);
    case 'airbrake':
      return blendAeroModes('drs','airbrake',timing.transition);
    case 'wholeCar':
      return blendAeroModes('airbrake','highDownforce',timing.transition);
    case 'payoff':
      return blendAeroModes('highDownforce','drs',timing.transition);
  }
};

const flowFromModeFor=(timing:Video002SceneProps)=>{
  switch(timing.beat.id){
    case 'drs': return 'highDownforce' as const;
    case 'airbrake': return 'drs' as const;
    case 'wholeCar': return 'airbrake' as const;
    case 'payoff': return 'highDownforce' as const;
    default: return 'highDownforce' as const;
  }
};

const flowOpacityFor=(timing:Video002SceneProps)=>{
  switch(timing.beat.id){
    case 'hook': return 0.18+timing.transition*0.22;
    case 'isolate': return 0.10;
    case 'highDownforce': return 0.90;
    case 'drs': return 0.92;
    case 'airbrake': return 0.96;
    case 'wholeCar': return 0.86;
    case 'payoff': return 0.48;
  }
};

const IntegratedThreeScene:React.FC<{timing:Video002SceneProps}>=({timing})=>{
  const {camera,gl,advance}=useThree();
  const [model,setModel]=useState<THREE.Group|null>(null);
  const [handle]=useState(()=>delayRender('Loading YUNEX 002 integrated Porsche scene'));
  const ready=useRef(false);
  const wheelBase=useRef<Record<string,number>>({});

  const rig=useMemo(()=>model?createActiveAeroRig(model):null,[model]);
  const pose=useMemo(()=>{
    const next=poseFor(timing.frame,CAMERA_TIMING);
    const [rootX,,rootZ]=next.rootPose.position;

    // Manager integration corrections after native portrait-frame review:
    // keep B's deterministic travel/shot progression, but move three camera stations
    // to the vegetation-free side of the approved technical track.
    if(timing.beat.id==='drs'){
      next.camera={
        position:[rootX-8.6,1.72,rootZ+0.18],
        target:[rootX,0.65,rootZ+0.08],
        focalLength:28,
      };
    }else if(timing.beat.id==='airbrake'){
      next.camera={
        position:[rootX-5.8,2.18,rootZ-7.2],
        target:[rootX,0.72,rootZ-0.72],
        focalLength:31,
      };
    }else if(timing.beat.id==='payoff'){
      next.camera={
        position:[rootX-5.6,1.68,rootZ+7.5],
        target:[rootX,0.58,rootZ+0.55],
        focalLength:30,
      };
    }
    return next;
  },[timing.frame,timing.beat.id]);
  const aeroState=useMemo(()=>aeroStateFor(timing),[
    timing.beat.id,
    timing.transition,
  ]);
  const fromMode=flowFromModeFor(timing);

  useEffect(()=>{
    let live=true;
    new GLTFLoader().load(
      staticFile('model.glb'),
      (gltf)=>{
        if(!live)return;
        gltf.scene.traverse((object:any)=>{
          if(object.isMesh){
            object.frustumCulled=false;
            object.castShadow=true;
            object.receiveShadow=false;
          }
        });
        for(const name of WHEEL_NODES){
          const node=gltf.scene.getObjectByName(name);
          if(node)wheelBase.current[name]=node.rotation.x;
        }
        setModel(gltf.scene);
      },
      undefined,
      cancelRender,
    );
    return()=>{live=false;};
  },[]);

  useLayoutEffect(()=>{
    const previousShadowEnabled=gl.shadowMap.enabled;
    const previousShadowType=gl.shadowMap.type;
    const previousShadowAutoUpdate=gl.shadowMap.autoUpdate;
    const previousToneMapping=gl.toneMapping;
    const previousExposure=gl.toneMappingExposure;
    gl.shadowMap.enabled=true;
    gl.shadowMap.type=THREE.PCFSoftShadowMap;
    gl.shadowMap.autoUpdate=true;
    gl.toneMapping=THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure=0.94;
    return()=>{
      gl.shadowMap.enabled=previousShadowEnabled;
      gl.shadowMap.type=previousShadowType;
      gl.shadowMap.autoUpdate=previousShadowAutoUpdate;
      gl.toneMapping=previousToneMapping;
      gl.toneMappingExposure=previousExposure;
    };
  },[gl]);

  useLayoutEffect(()=>{
    const perspective=camera as THREE.PerspectiveCamera;
    perspective.position.set(...pose.camera.position);
    perspective.fov=focalLengthToVerticalFov(pose.camera.focalLength);
    perspective.lookAt(...pose.camera.target);
    perspective.updateProjectionMatrix();

    if(!model||!rig)return;
    model.position.set(...pose.rootPose.position);
    model.rotation.set(...pose.rootPose.rotation);
    rig.apply(aeroState);
    for(const name of WHEEL_NODES){
      const node=model.getObjectByName(name);
      if(node)node.rotation.x=(wheelBase.current[name]??0)+pose.wheelAngle;
    }
    model.updateMatrixWorld(true);
    advance(timing.frame*(1000/VIDEO002_FPS));
  },[
    advance,
    aeroState.frontAngle,
    aeroState.mode,
    aeroState.rearAngle,
    aeroState.transition,
    camera,
    model,
    pose.camera.focalLength,
    pose.camera.position,
    pose.camera.target,
    pose.rootPose.position,
    pose.rootPose.rotation,
    pose.wheelAngle,
    rig,
    timing.frame,
  ]);

  useEffect(()=>{
    if(!model||!rig||ready.current)return;
    ready.current=true;
    continueRender(handle);
  },[handle,model,rig]);

  const flapBounds=rig?{
    min:rig.audit.movingBoundsCar.min,
    max:rig.audit.movingBoundsCar.max,
    clearance:0.10,
  }:undefined;

  return <>
    <TrackWorld quality="final" seed={2103}/>
    {model&&<primitive object={model}/>}
    {model&&<group position={pose.rootPose.position} rotation={pose.rootPose.rotation}>
      <FrontFlaps state={aeroState} opacity={0.98}/>
    </group>}
    <AeroFlow
      frame={timing.frame}
      mode={timing.mode}
      fromMode={fromMode}
      progress={timing.transition}
      carTransform={{position:pose.rootPose.position,rotation:pose.rootPose.rotation}}
      flapBounds={flapBounds}
      opacity={flowOpacityFor(timing)}
      showUnderbody={pose.shot!=='wing-macro'}
    />
  </>;
};

export const Video002IntegratedScene:React.FC<Video002SceneProps>=(timing)=><AbsoluteFill style={{background:'#aebfc2'}}>
  <ThreeCanvas
    width={W}
    height={H}
    camera={{position:[4.4,1.7,-7.4],fov:42,near:0.05,far:160}}
    gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}}
    shadows
  >
    <IntegratedThreeScene timing={timing}/>
  </ThreeCanvas>
</AbsoluteFill>;

export const Yunex002IntegratedProof:React.FC=()=>(
  <EditAudioComposition Scene={Video002IntegratedScene} includeAudio={false}/>
);

export const Yunex002Final:React.FC=()=>(
  <EditAudioComposition Scene={Video002IntegratedScene} includeAudio/>
);
