import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill,Audio,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TrackWorld} from '../video002/trackUpgrade/TrackWorld';
import {motionStateAt,createRuntimeMotionRig,type MotionState} from './motion';
import {FrontSuspension,frontSuspensionStateFromMotion,resolveLinks,type FrontSuspensionState} from './suspension';
import {SuspensionAirflow,type SuspensionFlowAnchor} from './airflow';
import {makeShotAnchor,resolveY003CameraPose,focalLengthToVerticalFov,type Y003CameraMotionState} from './cameras/cameraContract';
import {createY003ExteriorRevealController} from './reveal/exteriorReveal';
import {YUNEX003EditLayer} from './edit/EditLayer';
import {y003AudioMixState} from './audio';
import {
  Y003_DURATION_FRAMES,
  Y003_EDITORIAL_CUES,
  Y003_FPS,
  airflowVisibilityAtFrame,
  mechanicalExposureAtFrame,
  sec,
  shotAtFrame,
  suspensionVisibilityAtFrame,
} from './timeline';

const W=1080;
const H=1920;

const cameraMotion=(motion:MotionState):Y003CameraMotionState=>({
  position:motion.root.position,
  headingRad:motion.root.rotation[1],
  speedMps:motion.speedMps,
  distanceM:motion.distanceM,
});

const distance3=(a:[number,number,number],b:[number,number,number])=>
  Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);

const revealCueProgress=(frame:number)=>{
  const start=sec(6.35),end=sec(10.15);
  if(frame<=start)return 0;
  if(frame>=end)return 1;
  return (frame-start)/Math.max(1,end-start);
};

const boundsFromLinks=(state:FrontSuspensionState,side:'FL'|'FR')=>{
  const links=resolveLinks(state).filter((l)=>l.side===side&&(l.kind==='upper-front'||l.kind==='lower-front'));
  if(!links.length)throw new Error('Y003 airflow requires installed front suspension link bounds.');
  const points=links.flatMap((l)=>[l.start,l.end]);
  const pad=0.055;
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),zs=points.map(p=>p[2]);
  return {
    min:[Math.min(...xs)-pad,Math.min(...ys)-pad,Math.min(...zs)-pad] as [number,number,number],
    max:[Math.max(...xs)+pad,Math.max(...ys)+pad,Math.max(...zs)+pad] as [number,number,number],
  };
};

const airflowReferenceMotion=motionStateAt(sec(10.0),{fps:Y003_FPS,durationFrames:Y003_DURATION_FRAMES});
const airflowReferenceSuspension=frontSuspensionStateFromMotion(airflowReferenceMotion);
const STABLE_AIRFLOW_ANCHORS:SuspensionFlowAnchor[]=[
  {
    id:'FL-front-links',
    side:'left',
    profileBoundsCar:boundsFromLinks(airflowReferenceSuspension,'FL'),
    wheelCenterCar:airflowReferenceMotion.wheels.FL.centreLocal,
    clearance:.065,
  },
  {
    id:'FR-front-links',
    side:'right',
    profileBoundsCar:boundsFromLinks(airflowReferenceSuspension,'FR'),
    wheelCenterCar:airflowReferenceMotion.wheels.FR.centreLocal,
    clearance:.065,
  },
];

const frameState=(frame:number)=>{
  const motion=motionStateAt(frame,{fps:Y003_FPS,durationFrames:Y003_DURATION_FRAMES});
  const shot=shotAtFrame(frame);
  const motionForCamera=cameraMotion(motion);
  const anchorMotion=motionStateAt(shot.segment.start,{fps:Y003_FPS,durationFrames:Y003_DURATION_FRAMES});
  const camera=resolveY003CameraPose(motionForCamera,{
    id:shot.segment.id,
    progress:shot.progress,
    anchor:shot.segment.id==='trackside-pass'?makeShotAnchor(cameraMotion(anchorMotion)):undefined,
  });
  return {
    motion,
    shot,
    camera,
    suspension:frontSuspensionStateFromMotion(motion),
    suspensionVisibility:suspensionVisibilityAtFrame(frame),
    airflowVisibility:airflowVisibilityAtFrame(frame),
    mechanicalExposure:mechanicalExposureAtFrame(frame),
  };
};

const IntegratedThree:React.FC<{frame:number}>=({frame})=>{
  const {camera,gl,advance}=useThree();
  const [model,setModel]=useState<THREE.Group|null>(null);
  const [handle]=useState(()=>delayRender('Loading YUNEX 003 Porsche'));
  const continued=useRef(false);

  const state=useMemo(()=>frameState(frame),[frame]);
  const rig=useMemo(()=>model?createRuntimeMotionRig(model):null,[model]);
  const reveal=useMemo(()=>model&&rig?createY003ExteriorRevealController(model):null,[model,rig]);

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
          }
        });
        setModel(gltf.scene);
      },
      undefined,
      cancelRender,
    );
    return()=>{live=false;};
  },[]);

  useLayoutEffect(()=>{
    const previousShadow=gl.shadowMap.enabled;
    const previousType=gl.shadowMap.type;
    const previousTone=gl.toneMapping;
    const previousExposure=gl.toneMappingExposure;
    gl.shadowMap.enabled=true;
    gl.shadowMap.type=THREE.PCFSoftShadowMap;
    gl.toneMapping=THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure=.94;
    gl.localClippingEnabled=true;
    return()=>{
      gl.shadowMap.enabled=previousShadow;
      gl.shadowMap.type=previousType;
      gl.toneMapping=previousTone;
      gl.toneMappingExposure=previousExposure;
    };
  },[gl]);

  useLayoutEffect(()=>{
    const p=camera as THREE.PerspectiveCamera;
    p.position.set(...state.camera.position);
    p.near=state.camera.near;
    p.far=state.camera.far;
    p.fov=focalLengthToVerticalFov(state.camera.focalLengthMm);
    p.lookAt(...state.camera.target);
    p.updateProjectionMatrix();

    if(!model||!rig||!reveal)return;
    if(rig.audit.missingChassisParts.length){
      throw new Error('Y003 runtime chassis incomplete: '+rig.audit.missingChassisParts.join(', '));
    }
    rig.apply(state.motion);
    reveal.apply(revealCueProgress(frame));
    model.updateMatrixWorld(true);
    advance(frame*(1000/Y003_FPS));
  },[advance,camera,frame,model,reveal,rig,state]);

  useEffect(()=>{
    if(!model||!rig||!reveal||continued.current)return;
    continued.current=true;
    continueRender(handle);
  },[handle,model,reveal,rig]);

  useEffect(()=>()=>{reveal?.dispose();rig?.restore();},[reveal,rig]);

  const rootPosition=state.motion.root.position;
  const rootRotation=state.motion.root.rotation;

  return <>
    <TrackWorld quality="final" seed={3003}/>
    {model&&<primitive object={model}/>}
    <group position={rootPosition} rotation={rootRotation}>
      <FrontSuspension
        state={state.suspension}
        opacity={state.suspensionVisibility*.96}
        side="both"
        showSpringDamper
        showUprightContext
      />
      <SuspensionAirflow
        frame={frame}
        fps={Y003_FPS}
        travelDistanceMetres={state.motion.distanceM}
        anchors={STABLE_AIRFLOW_ANCHORS}
        visibility={state.airflowVisibility}
        focusSide={state.shot.segment.id==='link-profile'?'left':'both'}
        opacity={.96}
        showTracers
      />
    </group>
  </>;
};

export const Yunex003Visual:React.FC=()=>{
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{background:'#aebfc2'}}>
    <ThreeCanvas
      width={W}
      height={H}
      camera={{position:[4,1.4,6],fov:42,near:.04,far:220}}
      gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}}
      shadows
    >
      <IntegratedThree frame={frame}/>
    </ThreeCanvas>
    <YUNEX003EditLayer
      cues={Y003_EDITORIAL_CUES}
      anchors={{
        frontLink:{x:645,y:1070,visible:frame>=sec(6.35)&&frame<sec(10.3)},
        airflow:{x:430,y:1180,visible:frame>=sec(8.1)&&frame<sec(10.5)},
      }}
      forbiddenRects={[{x:56,y:142,width:900,height:280}]}
      identityStartFrame={sec(22.65)}
      identityEndFrame={Y003_DURATION_FRAMES}
      finishStrength={.54}
    />
  </AbsoluteFill>;
};

const dbToLinear=(db:number)=>Math.pow(10,db/20);

const sfxVolumeAt=(frame:number)=>{
  const s=frameState(frame);
  const cameraDistance=distance3(s.camera.position,s.motion.root.position);
  const pass=s.shot.segment.id==='trackside-pass'
    ?Math.max(0,1-cameraDistance/14)
    :0;
  const mix=y003AudioMixState({
    seconds:frame/Y003_FPS,
    speedMps:s.motion.speedMps,
    longitudinalLoad01:s.motion.chassis.brakeLoad01,
    cornerLoad01:Math.abs(s.motion.chassis.cornerLoadSigned),
    cameraDistanceM:cameraDistance,
    tracksidePass01:pass,
    mechanicalExposure01:s.mechanicalExposure,
  });
  return Math.min(.82,dbToLinear(Math.max(mix.engineDb,mix.passDb,mix.mechanicalDb)));
};

export const Yunex003Final:React.FC=()=> <AbsoluteFill>
  <Yunex003Visual/>
  <Audio src={staticFile('y003-narration.mp3')} volume={1}/>
  <Audio src={staticFile('y003-sfx.wav')} volume={(f)=>sfxVolumeAt(f)}/>
</AbsoluteFill>;
