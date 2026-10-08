/** 12-second moving look-development film; no Y004 edit or mechanics replaced. */
import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill,Audio,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame,interpolate} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {createY004RearSteerRig} from '../video004/rig';
import {y004MotionAtFrame} from '../video004/motion/sampler';
import {y004RotateLocalVector,y004VerticalFovDegrees} from '../video004/camera';
import {CircuitWorldV2} from './CircuitWorldV2';
export const SHOWCASE_FRAMES=360;
export const showcaseFrameState=(frame:number)=>{
 const shot=Math.floor(frame/90),n=frame%90;const source=[432,210,477,630][shot]+n;
 return {shot,n,progress:n/90,source,sample:y004MotionAtFrame(source)};
};
const Scene:React.FC<{frame:number}>=({frame})=>{
 const {camera,advance}=useThree();const [model,setModel]=useState<THREE.Group|null>(null);const [handle]=useState(()=>delayRender('Loading approved Porsche for circuit V2'));const completed=useRef(false);
 const state=useMemo(()=>showcaseFrameState(frame),[frame]),rig=useMemo(()=>model?createY004RearSteerRig(model):null,[model]);
 useEffect(()=>{let live=true;new GLTFLoader().load(staticFile('model.glb'),g=>{if(!live)return;g.scene.traverse(o=>{const m=o as THREE.Mesh;if(m.isMesh){m.castShadow=true;m.frustumCulled=false;}});setModel(g.scene);},undefined,cancelRender);return()=>{live=false;};},[]);
 useLayoutEffect(()=>{
  const {shot,progress:p,sample}=state;const pos=sample.motion.root.position,yaw=sample.motion.root.rotation[1];
  const specs=[{offset:[5.4-p*.25,1.75,-9.8] as [number,number,number],look:[0,.62,0],lens:27},{offset:[6.5,5.6,9.5] as [number,number,number],look:[0,.6,0],lens:29},{offset:[10.5,1.5,3.8-p*.5] as [number,number,number],look:[0,.6,.15],lens:27},{offset:[4.7,1.5,-10.1-p*.6] as [number,number,number],look:[0,.64,.2],lens:28}];
  const spec=specs[shot],off=y004RotateLocalVector(spec.offset,yaw),aim=y004RotateLocalVector(spec.look as [number,number,number],yaw);const c=camera as THREE.PerspectiveCamera;
  c.position.set(pos[0]+off[0],pos[1]+off[1],pos[2]+off[2]);c.lookAt(pos[0]+aim[0],pos[1]+aim[1],pos[2]+aim[2]);c.fov=y004VerticalFovDegrees(spec.lens);c.near=.06;c.far=460;c.updateProjectionMatrix();
  if(rig&&model){rig.apply(sample);model.updateMatrixWorld(true);advance(frame*1000/30);}
 },[camera,rig,model,frame,state,advance]);
 useEffect(()=>{if(model&&rig&&!completed.current){completed.current=true;continueRender(handle);}},[model,rig,handle]);useEffect(()=>()=>rig?.dispose(),[rig]);
 return <><CircuitWorldV2 carPose={state.sample.motion.root}/>{model&&<primitive object={model}/>}</>;
};
export const CircuitShowcase:React.FC=()=>{
 const f=useCurrentFrame();const opacity=interpolate(f,[0,12,60,78],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const end=interpolate(f,[298,315],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:'#89aac1'}}>
  <ThreeCanvas width={1080} height={1920} camera={{fov:45,near:.06,far:460}} gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}} shadows><Scene frame={f}/></ThreeCanvas>
  <AbsoluteFill style={{pointerEvents:'none',background:'linear-gradient(180deg,rgba(10,23,18,.18),transparent 27%,transparent 80%,rgba(9,19,13,.12))'}}/>
  <div style={{position:'absolute',top:120,left:72,opacity,color:'#f3f0e8',fontFamily:'Arial',textShadow:'0 2px 8px #17251a55'}}><div style={{fontSize:24,letterSpacing:7,color:'#d1dfb0'}}>YUNEX / ENVIRONMENT 02</div><div style={{fontSize:56,fontWeight:700,lineHeight:1.08,marginTop:15}}>THE WOODLAND<br/>CIRCUIT.</div><div style={{height:3,width:100,background:'#bfd780',marginTop:20}}/></div>
  <div style={{position:'absolute',bottom:130,left:72,opacity:end,color:'#f5f1e7',fontFamily:'Arial',fontWeight:700,fontSize:32,letterSpacing:9}}>YUNEX</div>
  <Audio src={staticFile('circuit-v2-sound.wav')}/>
 </AbsoluteFill>;
};
