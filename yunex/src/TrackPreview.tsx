import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill,cancelRender,continueRender,delayRender,staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const makeAsphalt=()=>{
  const size=384,data=new Uint8Array(size*size*4);
  let seed=911;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<size*size;i++){
    const grain=(random()-.5)*28;
    const fleck=random()>.986?24:0;
    const v=Math.max(28,Math.min(72,47+grain+fleck));
    data[i*4]=v;data[i*4+1]=v+1;data[i*4+2]=v+2;data[i*4+3]=255;
  }
  const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(9,12);t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;
  return t;
};

const makeSky=()=>{
  const w=256,h=128,data=new Uint8Array(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const t=y/(h-1),warm=Math.exp(-Math.pow((t-.61)/.13,2));
    const r=THREE.MathUtils.lerp(160,230,t)+warm*14;
    const g=THREE.MathUtils.lerp(191,218,t)+warm*8;
    const b=THREE.MathUtils.lerp(224,199,t)-warm*8;
    const i=(y*w+x)*4;data[i]=r;data[i+1]=g;data[i+2]=b;data[i+3]=255;
  }
  const tex=new THREE.DataTexture(data,w,h,THREE.RGBAFormat);tex.mapping=THREE.EquirectangularReflectionMapping;tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex;
};

function Rail(){
  return <group position={[-3.62,.48,0]} rotation={[0,Math.PI/2,0]}>
    {[-5.8,-2.9,0,2.9,5.8].map(x=><group key={x} position={[x,0,0]}>
      <mesh castShadow position={[0,-.28,0]}><boxGeometry args={[.07,.75,.08]}/><meshStandardMaterial color="#777b7d" metalness={.78} roughness={.35}/></mesh>
      <mesh castShadow position={[0,-.56,.18]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.05,.05,.42,10]}/><meshStandardMaterial color="#56595a" metalness={.7} roughness={.45}/></mesh>
    </group>)}
    <mesh castShadow><boxGeometry args={[13,.27,.11]}/><meshStandardMaterial color="#aeb2b2" metalness={.82} roughness={.28}/></mesh>
    <mesh castShadow position={[0,.115,-.065]}><boxGeometry args={[13,.045,.08]}/><meshStandardMaterial color="#d0d3d2" metalness={.86} roughness={.24}/></mesh>
    <mesh castShadow position={[0,-.115,-.065]}><boxGeometry args={[13,.045,.08]}/><meshStandardMaterial color="#8e9292" metalness={.84} roughness={.30}/></mesh>
    <mesh castShadow position={[0,.25,.02]}><boxGeometry args={[13,.08,.08]}/><meshStandardMaterial color="#747879" metalness={.8} roughness={.32}/></mesh>
  </group>;
}

function Kerb(){
  return <group position={[-2.95,.025,.15]} rotation={[0,-.05,0]}>
    {Array.from({length:12},(_,i)=><mesh key={i} receiveShadow position={[0,0,(i-5.5)*.47]}>
      <boxGeometry args={[.48,.05,.46]}/><meshStandardMaterial color={i%2===0?'#e8e3d8':'#b52220'} roughness={.76}/>
    </mesh>)}
  </group>;
}

function TrackScene(){
  const {gl,scene,camera,advance}=useThree();
  const [model,setModel]=useState<THREE.Group|null>(null);
  const [groundY,setGroundY]=useState(0);
  const [handle]=useState(()=>delayRender('Loading approved Porsche track still'));
  const ready=useRef(false);
  const asphalt=useMemo(makeAsphalt,[]),sky=useMemo(makeSky,[]);
  useLayoutEffect(()=>{
    gl.shadowMap.enabled=true;gl.shadowMap.type=THREE.PCFShadowMap;gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=.92;
    scene.background=sky;
    const pmrem=new THREE.PMREMGenerator(gl);const env=pmrem.fromEquirectangular(sky);scene.environment=env.texture;
    camera.position.set(3.35,1.50,4.25);camera.lookAt(-.10,.58,.15);camera.updateProjectionMatrix();
    return()=>{env.dispose();pmrem.dispose();sky.dispose();};
  },[gl,scene,camera,sky]);
  useEffect(()=>{
    let live=true;
    new GLTFLoader().load(staticFile('model.glb'),g=>{
      if(!live)return;
      g.scene.traverse((o:any)=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
      setGroundY(new THREE.Box3().setFromObject(g.scene).min.y);
      setModel(g.scene);
    },undefined,cancelRender);
    return()=>{live=false;};
  },[]);
  useEffect(()=>{
    if(!model||ready.current)return;ready.current=true;
    camera.position.set(3.35,1.50,4.25);camera.lookAt(-.10,.58,.15);camera.updateProjectionMatrix();advance(performance.now());continueRender(handle);
  },[model,advance,camera,handle]);
  return <>
    <hemisphereLight args={['#dcecff','#273126',1.55]}/>
    <directionalLight castShadow position={[-4.5,7.5,5.5]} intensity={4.0} color="#ffe7c5" shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-.00018} shadow-normalBias={.02}/>
    <directionalLight position={[5,3,-4]} intensity={1.25} color="#bad4ed"/>
    <group position={[0,groundY,0]}>
      <mesh receiveShadow position={[0,-.012,0]} rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[22,24]}/><meshStandardMaterial map={asphalt} color="#575b5d" roughness={.93} metalness={.02}/>
      </mesh>
      <Kerb/><Rail/>
    </group>
    {model&&<primitive object={model}/>} 
  </>;
}

export const TrackPreview:React.FC=()=> <AbsoluteFill style={{background:'#abc6d8'}}>
  <ThreeCanvas width={1600} height={1000} camera={{position:[3.35,1.50,4.25],fov:36,near:.1,far:100}} gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}} shadows>
    <TrackScene/>
  </ThreeCanvas>
</AbsoluteFill>;
