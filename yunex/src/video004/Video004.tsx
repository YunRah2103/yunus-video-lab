/**
 * YUNEX 004 — manager central integration, VISUAL-ONLY PROVISIONAL.
 * NOT a release composition. Actual topic-specific VO, frame lock, native
 * proofs and independent F review are required before final release.
 */
import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {TrackWorld} from '../video002/trackUpgrade/TrackWorld';
import {Y003CircuitWorldExtension} from '../video003/track/CircuitWorldExtension';
import {createY004RearSteerRig} from './rig';
import {resolveY004CameraPose,y004VerticalFovDegrees} from './camera';
import {resolveY004Guides} from './guides';
import {Yunex004EditLayer} from './edit';
import {Y004_FPS} from './contracts';
import {Y004_EDIT_WINDOWS,y004FrameState} from './timeline';

const W=1080,H=1920;
const v=(p: readonly number[])=>new THREE.Vector3(p[0],p[1],p[2]);
const line=(from:readonly number[],to:readonly number[],color:number,opacity:number)=>{
 const geometry=new THREE.BufferGeometry().setFromPoints([v(from),v(to)]);
 const material=new THREE.LineBasicMaterial({color,transparent:true,opacity,depthTest:true,depthWrite:false});
 return new THREE.Line(geometry,material);
};
const ThreeScene:React.FC<{frame:number}>=({frame})=>{
 const {camera,gl,advance}=useThree();
 const [model,setModel]=useState<THREE.Group|null>(null);
 const [handle]=useState(()=>delayRender('Loading canonical YUNEX 004 Porsche'));
 const continued=useRef(false);
 const state=useMemo(()=>y004FrameState(frame),[frame]);
 const cam=useMemo(()=>resolveY004CameraPose(state.motion,state.progress),[state]);
 const guides=useMemo(()=>resolveY004Guides(state.motion,cam).filter(g=>g.visible),[state,cam]);
 const rig=useMemo(()=>model?createY004RearSteerRig(model):null,[model]);
 const art=useMemo(()=>{
  const output:THREE.Line[]=[];
  for(const guide of guides){
   output.push(line(guide.anchorWorld,guide.neutralEndWorld,0xf1eadc,.68));
   output.push(line(guide.anchorWorld,guide.steeredEndWorld,0xbddb78,.97));
  }
  return output;
 },[guides]);
 useEffect(()=>()=>{
  for(const item of art){
   item.geometry.dispose();
   (item.material as THREE.Material).dispose();
  }
 },[art]);
 useEffect(()=>{
  let live=true;
  new GLTFLoader().load(staticFile('model.glb'),gltf=>{
   if(!live)return;
   gltf.scene.traverse(obj=>{
    const mesh=obj as THREE.Mesh;
    if(mesh.isMesh){mesh.frustumCulled=false;mesh.castShadow=true;}
   });
   setModel(gltf.scene);
  },undefined,cancelRender);
  return()=>{live=false;};
 },[]);
 useLayoutEffect(()=>{
  const oldEnabled=gl.shadowMap.enabled;
  const oldType=gl.shadowMap.type;
  const oldTone=gl.toneMapping;
  const oldExposure=gl.toneMappingExposure;
  gl.shadowMap.enabled=true;
  gl.shadowMap.type=THREE.PCFSoftShadowMap;
  gl.toneMapping=THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure=.94;
  return()=>{
   gl.shadowMap.enabled=oldEnabled;
   gl.shadowMap.type=oldType;
   gl.toneMapping=oldTone;
   gl.toneMappingExposure=oldExposure;
  };
 },[gl]);
 useLayoutEffect(()=>{
  const p=camera as THREE.PerspectiveCamera;
  p.position.copy(v(cam.position));
  p.near=cam.near;
  p.far=cam.far;
  p.fov=y004VerticalFovDegrees(cam.focalLengthMm);
  p.lookAt(v(cam.target));
  p.updateProjectionMatrix();
  if(!rig||!model)return;
  rig.apply(state.motion);
  model.updateMatrixWorld(true);
  advance(frame*1000/Y004_FPS);
 },[advance,camera,frame,rig,model,cam,state]);
 useEffect(()=>{
  if(!model||!rig||continued.current)return;
  continued.current=true;
  continueRender(handle);
 },[handle,model,rig]);
 useEffect(()=>()=>rig?.dispose(),[rig]);
 return <>
  <TrackWorld quality="final" seed={3003} carPose={state.motion.motion.root}/>
  <Y003CircuitWorldExtension quality="final" seed={3003}/>
  {model&&<primitive object={model}/>}
  {art.map((item,i)=><primitive key={i} object={item}/>)}
 </>;
};
export const Yunex004Visual:React.FC=()=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{background:'#aebfc2'}}>
  <ThreeCanvas width={W} height={H}
   camera={{position:[4,1.4,6],fov:42,near:0.04,far:230}}
   gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}} shadows>
   <ThreeScene frame={frame}/>
  </ThreeCanvas>
  <Yunex004EditLayer windows={Y004_EDIT_WINDOWS}/>
 </AbsoluteFill>;
};
