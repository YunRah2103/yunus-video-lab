import React, {useEffect,useLayoutEffect,useMemo,useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {staticFile,delayRender,continueRender,cancelRender,useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

function Studio({position,target}:{position:number[],target:number[]}){
 const {gl,scene,camera}=useThree();
 useLayoutEffect(()=>{camera.position.set(...position as [number,number,number]);camera.lookAt(...target as [number,number,number]);camera.updateProjectionMatrix();},[camera,...position,...target]);
 useLayoutEffect(()=>{const p=new THREE.PMREMGenerator(gl);const env=p.fromScene(new RoomEnvironment(),.05);scene.environment=env.texture;return()=>{env.dispose();p.dispose()};},[gl,scene]);
 return <><ambientLight intensity={.45}/><directionalLight position={[3,6,4]} intensity={3.3} color="#fff7eb"/><directionalLight position={[-4,3,-4]} intensity={2.8} color="#d4e6ff"/><directionalLight position={[0,5,-2]} intensity={2.4}/></>;
}

function Vehicle({ghost=0,yaw=0,roll=0,engine=false,grip=false}:{ghost?:number,yaw?:number,roll?:number,engine?:boolean,grip?:boolean}){
 const {gl,scene,camera,advance}=useThree();
 const [model,setModel]=useState<THREE.Group|null>(null);const [handle]=useState(()=>delayRender('Loading YUNEX GT3 RS'));
 useEffect(()=>{new GLTFLoader().load(staticFile('model.glb'),g=>{setModel(g.scene);},undefined,e=>cancelRender(e));},[handle]);
 const car=useMemo(()=>{if(!model)return null;const c=model.clone(true);c.traverse((o:any)=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.material=o.material.clone();}});return c;},[model]);
 useLayoutEffect(()=>{if(!car)return;car.traverse((o:any)=>{if(o.isMesh){const wheel=o.name.startsWith('Wheel');o.visible=!(ghost>.3&&o.name.startsWith('Interior'));o.material.transparent=ghost>0||o.material.transparent;o.material.opacity=wheel?1:1-ghost*.91;o.material.depthWrite=ghost<.3||wheel;}});gl.setClearColor(0x101213,0);gl.render(scene,camera);continueRender(handle);},[car,ghost,yaw,grip,engine,handle,gl,scene,camera]);
 return <group position={[-Math.sin(yaw)*1.2425,0,1.2425*(1-Math.cos(yaw))]} rotation={[roll,yaw,0]}>
 {car&&<primitive object={car}/>}
 {engine&&<Engine/>}
 {grip&&[-.79,.79].map((x,i)=><mesh key={i} position={[x,.007,-1.21]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.3,48]}/><meshBasicMaterial color="#bddb78" transparent opacity={.6}/></mesh>)}
 </group>;
}
export function Engine(){return <group position={[0,.47,-1.78]}>
 <mesh><boxGeometry args={[.55,.23,.64]}/><meshStandardMaterial color="#d49a55" metalness={.65} roughness={.35} emissive="#c7792b" emissiveIntensity={.35}/></mesh>
 {[-1,1].map(side=>[-.2,0,.2].map((z,i)=><group key={side+':'+i} position={[side*.39,0,z]}><mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.12,.12,.36,20]}/><meshStandardMaterial color="#e6ae64" metalness={.65} roughness={.3} emissive="#9a5427" emissiveIntensity={.2}/></mesh>{[0,1,2].map(k=><mesh key={k} position={[side*(.06+k*.045),0,0]} rotation={[0,0,Math.PI/2]}><torusGeometry args={[.125,.011,8,24]}/><meshStandardMaterial color="#85562d" metalness={.75}/></mesh>)}</group>))}
 <mesh position={[0,.19,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.18,.18,.1,32]}/><meshStandardMaterial color="#d9b98b" metalness={.7} roughness={.25}/></mesh>
 </group>}

export function LiveCarCanvas({view='front',width=1080,height=1000,ghost=0,yaw=0,engine=false,grip=false,zoom=170}:{view?:string,width?:number,height?:number,ghost?:number,yaw?:number,engine?:boolean,grip?:boolean,zoom?:number}){
 const positions:any={front:[5,2.8,6],rear:[-5,2.7,-6],side:[7,.7,0],top:[0,8,.001],turntable:[5,2.5,5],tech:[7,1.55,0]};
 return <ThreeCanvas width={width} height={height} orthographic camera={{position:positions[view],zoom,near:.1,far:100}} gl={{antialias:true,alpha:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.1}}>
 <Studio position={positions[view]} target={[0,.55,0]}/><Vehicle ghost={ghost} yaw={yaw} engine={engine} grip={grip}/>

 </ThreeCanvas>
}

export {CachedCar as CarCanvas} from './CachedCar';

export function AssetPreview({view='front'}:{view?:string}){return <div style={{width:1600,height:1100,background:'radial-gradient(ellipse at 50% 50%,#292d2d,#101213 75%)'}}><LiveCarCanvas width={1600} height={1100} view={view} zoom={view==='top'?195:225}/></div>}

export function CarPlate(props:any){return <LiveCarCanvas {...props}/>}
