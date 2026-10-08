import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {
  AbsoluteFill,cancelRender,continueRender,delayRender,
  staticFile,useCurrentFrame,
} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TrackWorld} from '../../video002/trackUpgrade/TrackWorld';
import {Y003CircuitWorldExtension} from '../../video003/track/CircuitWorldExtension';
import {y004MotionAtFrame,y004SegmentAtFrame} from '../motion';
import {createY004RearSteerRig} from '../rig';
import {resolveY004CameraPose,y004VerticalFovDegrees} from './index';
import {resolveY004Guides} from '../guides';
import type {Y004SegmentId,Y004WheelGuide} from '../contracts';

/**
 * A/B **integration-dependent** NATIVE proof composition for Agent C.
 * DO NOT claim the moving proof passed until this source actually renders,
 * decodes and has been visually reviewed at normal speed with sound muted.
 * All source ranges use A's provisional 720-frame stage, not final VO timing.
 * The six clips intentionally cut between SEPARATE legitimate drives.
 */
type ProofClip = Readonly<{
  id: Y004SegmentId;
  from: number; to: number;
  label: string;
}>;
export const Y004_C_PROOF_CLIPS: ReadonlyArray<ProofClip> = [
  {id:'low-hook', from:12,to:56, label:'REAR WHEELS TURN TOO'},
  {id:'rear-macro', from:90,to:134, label:'REAR WHEEL MACRO'},
  {id:'low-explain', from:174,to:233, label:'LOWER SPEED • OPPOSITE'},
  {id:'high-explain', from:296,to:355, label:'HIGHER SPEED • SAME DIRECTION'},
  {id:'trackside-exit', from:574,to:633, label:'TRACKSIDE • MOVING PASS'},
  {id:'trackside-exit', from:645,to:704, label:'ACTIVE REAR QUARTER EXIT'},
];
export const Y004_C_PROOF_DURATION=Y004_C_PROOF_CLIPS.reduce(
  (sum,c)=>sum+c.to-c.from+1,0,
);
const previewAt=(frame:number)=>{
  if(!Number.isInteger(frame)||frame<0||frame>=Y004_C_PROOF_DURATION){
    throw Error('Y004 C native proof frame out of bounds');
  }
  let at=0;
  for(const clip of Y004_C_PROOF_CLIPS){
    const length=clip.to-clip.from+1;
    if(frame<at+length){
      const sourceFrame=clip.from+frame-at;
      const segment=y004SegmentAtFrame(sourceFrame);
      if(segment.id!==clip.id){
        throw Error('Y004 C proof requires A staging update for '+clip.id);
      }
      const state=y004MotionAtFrame(sourceFrame);
      const shotProgress=(sourceFrame-segment.frameStart)/
        (segment.frameEndExclusive-segment.frameStart);
      const pose=resolveY004CameraPose(state,shotProgress);
      const guides=resolveY004Guides(state,pose);
      return {state,pose,guides,clip,sourceFrame};
    }
    at+=length;
  }
  throw Error('Y004 C proof clip lookup failed');
};
const guideScene=(guides:ReadonlyArray<Y004WheelGuide>):THREE.Group=>{
  const root=new THREE.Group();
  root.name='Y004_C_WHEEL_ANGLE_GUIDES';
  for(const cue of guides){
    if(!cue.visible)continue;
    // One neutral and one honest yaw ray. Never enlarge delta angle.
    const lines=[
      {end:cue.neutralEndWorld,color:0xc9d5ce,opacity:.75},
      {end:cue.steeredEndWorld,color:0x69edaa,opacity:.98},
    ];
    for(const line of lines){
      const geometry=new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...cue.anchorWorld),new THREE.Vector3(...line.end),
      ]);
      const material=new THREE.LineBasicMaterial({
        color:line.color,transparent:true,opacity:line.opacity,
        depthTest:true,depthWrite:false,
      });
      const obj=new THREE.Line(geometry,material);
      obj.frustumCulled=false;
      root.add(obj);
    }
  }
  return root;
};
const NativeThree:React.FC<{frame:number}>=({frame})=>{
  const {camera,gl,advance}=useThree();
  const [model,setModel]=useState<THREE.Group|null>(null);
  const [handle]=useState(()=>delayRender('Y004 C actual Porsche, track and rear steer proof'));
  const continued=useRef(false);
  const sample=useMemo(()=>previewAt(frame),[frame]);
  const rig=useMemo(()=>model?createY004RearSteerRig(model):null,[model]);
  const cues=useMemo(()=>guideScene(sample.guides),[sample]);
  useEffect(()=>{
    let live=true;
    new GLTFLoader().load(
      staticFile('model.glb'),
      gltf=>{
        if(!live)return;
        gltf.scene.traverse(obj=>{
          if((obj as THREE.Mesh).isMesh){
            obj.frustumCulled=false;
            (obj as THREE.Mesh).castShadow=true;
          }
        });
        setModel(gltf.scene);
      },
      undefined,
      cancelRender,
    );
    return ()=>{live=false;};
  },[]);
  useEffect(()=>()=>{rig?.dispose();},[rig]);
  useEffect(()=>()=>{cues.traverse(obj=>{
    if(obj instanceof THREE.Line){
      obj.geometry.dispose();
      (obj.material as THREE.Material).dispose();
    }
  });},[cues]);
  useLayoutEffect(()=>{
    const oldShadow=gl.shadowMap.enabled,oldType=gl.shadowMap.type;
    const oldTone=gl.toneMapping,oldExposure=gl.toneMappingExposure;
    gl.shadowMap.enabled=true;
    gl.shadowMap.type=THREE.PCFSoftShadowMap;
    gl.toneMapping=THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure=.94;
    return()=>{
      gl.shadowMap.enabled=oldShadow;
      gl.shadowMap.type=oldType;
      gl.toneMapping=oldTone;
      gl.toneMappingExposure=oldExposure;
    };
  },[gl]);
  useLayoutEffect(()=>{
    const p=camera as THREE.PerspectiveCamera;
    p.position.set(...sample.pose.position);
    p.near=sample.pose.near;
    p.far=sample.pose.far;
    p.fov=y004VerticalFovDegrees(sample.pose.focalLengthMm);
    p.lookAt(...sample.pose.target);
    p.updateProjectionMatrix();
    if(rig){
      rig.apply(sample.state);
      model?.updateMatrixWorld(true);
    }
    advance(frame*(1000/30));
  },[advance,camera,frame,rig,model,sample]);
  useEffect(()=>{
    if(!model||!rig||continued.current)return;
    continued.current=true;
    continueRender(handle);
  },[model,rig,handle]);
  return <>
    <TrackWorld quality="final" seed={3003} carPose={sample.state.motion.root}/>
    <Y003CircuitWorldExtension quality="final" seed={3003}/>
    {model&&<primitive object={model}/>}
    <primitive object={cues}/>
  </>;
};
export const Y004AgentCNativeProof:React.FC=()=>{
  const frame=useCurrentFrame();
  const s=useMemo(()=>previewAt(frame),[frame]);
  return <AbsoluteFill style={{background:'#aebfc2'}}>
    <ThreeCanvas
      width={1080} height={1920}
      camera={{position:[4,1.4,6],fov:40,near:.05,far:230}}
      gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}}
      shadows
    ><NativeThree frame={frame}/></ThreeCanvas>
    <div style={{
      position:'absolute',left:65,right:65,top:135,
      color:'#e9f2ee',fontSize:39,fontWeight:700,letterSpacing:2.0,
      fontFamily:'sans-serif',textShadow:'0 2px 10px #162520',
    }}>{s.clip.label}</div>
    <div style={{
      position:'absolute',bottom:112,left:65,
      color:'#c9d5ce',fontSize:20,fontFamily:'monospace',letterSpacing:1.1,
    }}>YUNEX 004 • CAMERA / GUIDES NATIVE PROOF • MUTED</div>
  </AbsoluteFill>;
};
