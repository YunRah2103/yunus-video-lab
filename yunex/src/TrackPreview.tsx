import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill,cancelRender,continueRender,delayRender,interpolate,staticFile,useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

type TrackMode='landscape'|'portrait'|'motion';

const makeNoiseTexture=(kind:'asphalt'|'grass')=>{
  const size=384,data=new Uint8Array(size*size*4);
  let seed=kind==='asphalt'?911:992;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<size*size;i++){
    if(kind==='asphalt'){
      const grain=(random()-.5)*24;
      const fleck=random()>.989?18:0;
      const v=Math.max(31,Math.min(69,49+grain+fleck));
      data[i*4]=v;data[i*4+1]=v+1;data[i*4+2]=v+2;data[i*4+3]=255;
    }else{
      const grain=(random()-.5)*18;
      const dry=random()>.93?10:0;
      data[i*4]=Math.max(55,Math.min(92,68+grain+dry));
      data[i*4+1]=Math.max(63,Math.min(101,79+grain));
      data[i*4+2]=Math.max(48,Math.min(78,57+grain*.55));
      data[i*4+3]=255;
    }
  }
  const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(kind==='asphalt'?9:7,kind==='asphalt'?12:18);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.needsUpdate=true;
  return texture;
};

const makeSky=()=>{
  const w=256,h=128,data=new Uint8Array(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const t=y/(h-1),warm=Math.exp(-Math.pow((t-.61)/.13,2));
    const r=THREE.MathUtils.lerp(160,230,t)+warm*12;
    const g=THREE.MathUtils.lerp(191,218,t)+warm*7;
    const b=THREE.MathUtils.lerp(224,199,t)-warm*7;
    const i=(y*w+x)*4;data[i]=r;data[i+1]=g;data[i+2]=b;data[i+3]=255;
  }
  const tex=new THREE.DataTexture(data,w,h,THREE.RGBAFormat);
  tex.mapping=THREE.EquirectangularReflectionMapping;
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.needsUpdate=true;
  return tex;
};

const makeLayout=()=>{
  let seed=2103;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const treeColors=['#34483a','#405142','#495846','#2f4438'];
  const shrubColors=['#42513d','#4b5943','#384a39','#526048'];
  const trees=Array.from({length:10},(_,i)=>({
    x:-6.3-random()*5.5,
    z:-10.5+i*2.35+(random()-.5)*1.15,
    scale:.78+random()*.58,
    yaw:(random()-.5)*.8,
    color:treeColors[Math.floor(random()*treeColors.length)],
    crownWidth:.86+random()*.30,
    crownHeight:.88+random()*.26,
    asymmetry:(random()-.5)*.34,
    lean:(random()-.5)*.08,
    crownVariant:i%3,
  }));
  const shrubs=Array.from({length:24},()=>({
    x:-4.55-random()*4.4,
    z:-11+random()*22,
    scale:.55+random()*.75,
    yaw:(random()-.5)*1.4,
    color:shrubColors[Math.floor(random()*shrubColors.length)],
  }));
  return {trees,shrubs};
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
      <boxGeometry args={[.48,.05,.46]}/><meshStandardMaterial color={i%2===0?'#e8e3d8':'#a92a25'} roughness={.78}/>
    </mesh>)}
  </group>;
}

const Shrub:React.FC<{item:ReturnType<typeof makeLayout>['shrubs'][number];motionLite:boolean}> = ({item,motionLite}) =>
  <group position={[item.x,.05,item.z]} rotation={[0,item.yaw,0]} scale={item.scale}>
    {[
      [-.38,.34,.02,.72,.55,.62],
      [.24,.38,-.08,.78,.64,.68],
      [.02,.52,.24,.62,.66,.58],
    ].map((v,i)=><mesh key={i} castShadow={!motionLite} receiveShadow={!motionLite} position={[v[0],v[1],v[2]]} scale={[v[3],v[4],v[5]]}>
      <sphereGeometry args={[.72,motionLite?8:10,motionLite?6:7]}/>
      <meshStandardMaterial color={item.color} roughness={.97} metalness={0} flatShading/>
    </mesh>)}
  </group>;

const Tree:React.FC<{item:ReturnType<typeof makeLayout>['trees'][number];motionLite:boolean}> = ({item,motionLite}) => {
  const crownVariants=[
    [
      [-.18,1.48,.04,.92,.78,.76],
      [.38,1.60,-.12,.66,.76,.62],
      [-.52,1.72,.10,.58,.67,.58],
      [.08,1.98,.01,.72,.64,.69],
      [-.10,2.22,-.03,.44,.48,.43],
    ],
    [
      [-.08,1.46,-.02,.78,.84,.72],
      [.48,1.70,.06,.62,.68,.60],
      [-.42,1.62,-.12,.72,.70,.67],
      [.02,2.00,.10,.64,.74,.60],
      [.28,2.22,-.05,.42,.45,.40],
    ],
    [
      [-.22,1.58,.08,.74,.74,.70],
      [.34,1.48,-.08,.78,.70,.72],
      [-.50,1.86,-.02,.55,.60,.52],
      [.12,1.94,.08,.76,.66,.70],
      [.04,2.25,-.05,.48,.50,.44],
    ],
  ] as const;
  const crown=crownVariants[item.crownVariant];
  return <group position={[item.x,.02,item.z]} rotation={[0,item.yaw,0]} scale={item.scale}>
    <mesh castShadow={!motionLite} position={[item.lean*.24,.72,0]} rotation={[0,0,item.lean]}>
      <cylinderGeometry args={[.085,.14,1.45,8]}/>
      <meshStandardMaterial color="#554a38" roughness={.92}/>
    </mesh>
    <group position={[item.asymmetry*.15,0,0]}>
      {crown.map((v,i)=><mesh key={i} castShadow={!motionLite} receiveShadow={!motionLite}
        position={[v[0]+item.asymmetry*(i%2===0?.18:-.10),v[1],v[2]]}
        scale={[v[3]*item.crownWidth,v[4]*item.crownHeight,v[5]*(.94+item.crownWidth*.08)]}>
        <icosahedronGeometry args={[.82,motionLite?1:2]}/>
        <meshStandardMaterial color={item.color} roughness={.98} metalness={0} flatShading/>
      </mesh>)}
    </group>
  </group>;
};

function TrackEnvironment({asphalt,grass,mode}:{asphalt:THREE.Texture;grass:THREE.Texture;mode:TrackMode}){
  const layout=useMemo(makeLayout,[]);
  const motionLite=mode==='motion';
  return <>
    <mesh receiveShadow position={[0,-.012,0]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[24,26]}/><meshStandardMaterial map={asphalt} color="#565a5b" roughness={.94} metalness={.01}/>
    </mesh>
    <mesh receiveShadow position={[-7.15,-.001,0]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[7.05,26]}/><meshStandardMaterial map={grass} color="#69705b" roughness={1}/>
    </mesh>
    <mesh receiveShadow position={[-3.63,.005,0]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[.42,26]}/><meshStandardMaterial color="#6b654f" roughness={1}/>
    </mesh>
    <mesh receiveShadow position={[-10.8,-.03,-1.0]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[9.5,34]}/><meshStandardMaterial map={grass} color="#59634f" roughness={1}/>
    </mesh>
    <Kerb/><Rail/>
    <group>
      {layout.shrubs.map((item,i)=><Shrub key={'s-'+i} item={item} motionLite={motionLite}/>)}
      {layout.trees.map((item,i)=><Tree key={'t-'+i} item={item} motionLite={motionLite}/>)}
    </group>
  </>;
}

const cameraFor=(mode:TrackMode,frame:number)=>{
  if(mode==='landscape'){
    return {position:new THREE.Vector3(3.35,1.50,4.25),target:new THREE.Vector3(-.10,.58,.15)};
  }
  if(mode==='portrait'){
    return {position:new THREE.Vector3(2.20,1.45,5.85),target:new THREE.Vector3(-.10,.68,.18)};
  }
  const target=new THREE.Vector3(-.05,.60,.18);
  const position=new THREE.Vector3(7.25,2.05,8.55);
  if(mode==='motion'){
    const orbit=interpolate(frame,[0,74],[-.065,.065],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
    const offset=position.clone().sub(target).applyAxisAngle(new THREE.Vector3(0,1,0),orbit);
    position.copy(target).add(offset);
    position.y+=interpolate(frame,[0,37,74],[.02,.11,.03],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  }
  return {position,target};
};

function TrackScene({mode}:{mode:TrackMode}){
  const frame=useCurrentFrame();
  const {gl,scene,camera,advance}=useThree();
  const [model,setModel]=useState<THREE.Group|null>(null);
  const [groundY,setGroundY]=useState(0);
  const [handle]=useState(()=>delayRender('Loading approved Porsche track refinement'));
  const ready=useRef(false);
  const asphalt=useMemo(()=>makeNoiseTexture('asphalt'),[]);
  const grass=useMemo(()=>makeNoiseTexture('grass'),[]);
  const sky=useMemo(makeSky,[]);

  useLayoutEffect(()=>{
    gl.shadowMap.enabled=true;
    gl.shadowMap.type=THREE.PCFSoftShadowMap;
    gl.shadowMap.autoUpdate=mode!=='motion';
    gl.shadowMap.needsUpdate=true;
    gl.toneMapping=THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure=.90;
    scene.background=sky;
    scene.fog=new THREE.Fog('#b9c7c2',12,34);
    const pmrem=new THREE.PMREMGenerator(gl);
    const env=pmrem.fromEquirectangular(sky);
    scene.environment=env.texture;
    return()=>{gl.shadowMap.autoUpdate=true;scene.environment=null;scene.fog=null;env.dispose();pmrem.dispose();};
  },[gl,scene,sky,mode]);

  useLayoutEffect(()=>{
    const c=cameraFor(mode,frame);
    camera.position.copy(c.position);
    camera.lookAt(c.target);
    camera.updateProjectionMatrix();
    if(model)advance(frame*(1000/30));
  },[mode,frame,camera,advance,model]);

  useEffect(()=>{
    let live=true;
    new GLTFLoader().load(staticFile('model.glb'),g=>{
      if(!live)return;
      g.scene.traverse((o:any)=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
      setGroundY(new THREE.Box3().setFromObject(g.scene).min.y);
      setModel(g.scene);
      gl.shadowMap.needsUpdate=true;
    },undefined,cancelRender);
    return()=>{live=false;};
  },[gl]);

  useEffect(()=>{
    if(!model||ready.current)return;
    ready.current=true;
    const c=cameraFor(mode,frame);
    camera.position.copy(c.position);
    camera.lookAt(c.target);
    camera.updateProjectionMatrix();
    advance(frame*(1000/30));
    continueRender(handle);
  },[model,mode,frame,advance,camera,handle]);

  useEffect(()=>()=>{asphalt.dispose();grass.dispose();sky.dispose();},[asphalt,grass,sky]);

  return <>
    <hemisphereLight args={['#dce8ed','#303a2e',1.42]}/>
    <directionalLight castShadow position={[-4.5,7.5,5.5]} intensity={3.65} color="#ffe8ca"
      shadow-mapSize-width={mode==='motion'?1024:2048} shadow-mapSize-height={mode==='motion'?1024:2048}
      shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9}
      shadow-bias={-.00016} shadow-normalBias={.025}/>
    <directionalLight position={[5,3,-4]} intensity={1.05} color="#bfd4e8"/>
    <group position={[0,groundY,0]}><TrackEnvironment asphalt={asphalt} grass={grass} mode={mode}/></group>
    {model&&<primitive object={model}/>}
  </>;
}

const TrackCanvas:React.FC<{mode:TrackMode;width:number;height:number}> = ({mode,width,height}) =>
  <AbsoluteFill style={{background:'#aec4cf'}}>
    <ThreeCanvas
      width={width}
      height={height}
      camera={{
        position:mode==='landscape'?[3.35,1.50,4.25]:mode==='portrait'?[2.20,1.45,5.85]:[7.25,2.05,8.55],
        fov:mode==='landscape'?36:mode==='portrait'?50:40,
        near:.1,
        far:100,
      }}
      gl={{antialias:true,alpha:false,preserveDrawingBuffer:true}}
      shadows
    >
      <TrackScene mode={mode}/>
    </ThreeCanvas>
  </AbsoluteFill>;

export const TrackPreview:React.FC=()=> <TrackCanvas mode="landscape" width={1600} height={1000}/>;
export const TrackPortraitPreview:React.FC=()=> <TrackCanvas mode="portrait" width={1080} height={1920}/>;
export const TrackMotionProof:React.FC=()=> <TrackCanvas mode="motion" width={1080} height={1920}/>;
