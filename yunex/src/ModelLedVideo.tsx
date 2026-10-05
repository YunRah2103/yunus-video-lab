import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

const W = 1080;
const H = 1920;
const IVORY = '#f1eadc';
const COPPER = '#d58e50';
const GREEN = '#bddb78';
const CHARCOAL = '#0d1011';
const FRONT_AXLE = new THREE.Vector3(0, 0.35, 1.2425);
const REAR_AXLE = new THREE.Vector3(0, 0.37, -1.2114);
const ENGINE = new THREE.Vector3(0, 0.47, -1.78);

const clamp = (v:number) => Math.max(0, Math.min(1, v));
const phase = (frame:number, start:number, end:number) => {
  const t = clamp((frame - start) / Math.max(1, end - start));
  return t * t * (3 - 2 * t);
};
const blend = (a:number,b:number,t:number) => THREE.MathUtils.lerp(a,b,t);

type State = {
  camera:{position:[number,number,number]; target:[number,number,number]; zoom:number};
  ghost:number; engine:number; technical:number; rotation:number; grip:number; aero:number; restore:number;
  carPosition:[number,number,number]; carRotation:[number,number,number]; squat:number;
};

export function stateFor(frame:number):State {
  // Camera path is intentionally continuous. Every beat changes the relationship,
  // rather than cutting between fixed plates.
  const hero = phase(frame,0,105);
  const cut = phase(frame,105,255);
  const rotate = phase(frame,255,345);
  const recover = phase(frame,345,396);
  const grip = phase(frame,396,549);
  const aero = phase(frame,549,675);
  const finish = phase(frame,675,827);

  let angle = blend(-2.26,-3.03,hero);
  let y = blend(5.4,1.72,hero);
  let radius = blend(12.2,12.8,hero);
  let zoom = blend(184,196,hero);
  let targetZ = blend(-0.08,-0.28,hero);
  if (frame >= 105) {
    angle = blend(-3.03,-3.14,cut);
    y = blend(1.72,2.12,cut);
    radius = blend(12.8,13.15,cut);
    zoom = blend(196,183,cut);
    targetZ = blend(-0.28,-0.22,cut);
  }
  if (frame >= 255) {
    angle = blend(-3.14,-Math.PI / 2,rotate);
    y = blend(2.12,9.7,rotate);
    radius = blend(13.15,0.12,rotate);
    zoom = blend(183,171,rotate);
    targetZ = blend(-0.22,0.05,rotate);
  }
  if (frame >= 345) {
    angle = blend(-Math.PI / 2,-2.55,recover);
    y = blend(9.7,2.18,recover);
    radius = blend(0.12,12.4,recover);
    zoom = blend(171,186,recover);
    targetZ = blend(0.05,-0.2,recover);
  }
  if (frame >= 396) {
    angle = blend(-2.55,-2.30,grip);
    y = blend(2.18,1.62,grip);
    radius = blend(12.4,12.0,grip);
    zoom = blend(186,193,grip);
    targetZ = blend(-0.2,-0.35,grip);
  }
  if (frame >= 549) {
    angle = blend(-2.30,-2.08,aero);
    y = blend(1.62,1.50,aero);
    radius = blend(12.0,11.7,aero);
    zoom = blend(193,198,aero);
    targetZ = blend(-0.35,-0.20,aero);
  }
  if (frame >= 675) {
    angle = blend(-2.08,-2.34,finish);
    y = blend(1.50,2.52,finish);
    radius = blend(11.7,12.1,finish);
    zoom = blend(198,190,finish);
    targetZ = blend(-0.20,-0.08,finish);
  }

  const spin = frame >= 255 && frame < 345 ? Math.sin(rotate * Math.PI) * -0.43 : 0;
  const pivot = FRONT_AXLE;
  const carX = -Math.sin(spin) * pivot.z;
  const carZ = pivot.z * (1 - Math.cos(spin));
  const squat = frame >= 396 && frame < 549 ? Math.sin(grip * Math.PI) * 0.035 : 0;
  return {
    camera:{
      position:[Math.cos(angle)*radius,y,Math.sin(angle)*radius],
      target:[0,0.28,targetZ],
      zoom,
    },
    ghost: frame < 55 ? 0 : frame < 150 ? phase(frame,55,150) * 0.73 : frame < 555 ? 0.73 : 0.73 * (1-phase(frame,555,615)),
    engine: frame < 52 ? phase(frame,52,103)*0.58 : frame < 675 ? 1 : 1-finish,
    technical: frame < 105 ? 0 : frame < 255 ? cut : frame < 396 ? 1 : frame < 549 ? 1-recover*0.35 : 1-aero,
    rotation:spin,
    grip: frame < 396 ? 0 : frame < 549 ? Math.sin(grip*Math.PI)*0.92 : 0,
    aero: frame < 549 ? 0 : frame < 675 ? Math.sin(aero*Math.PI)*0.9 : 0,
    restore:finish,
    carPosition:[carX,-squat,carZ],
    carRotation:[-squat*0.9,spin,0],
    squat,
  };
}

function hasAncestor(o:THREE.Object3D,name:string) {
  let n:THREE.Object3D|null=o;
  while (n) { if (n.name===name || n.name.startsWith(name+'_')) return true; n=n.parent; }
  return false;
}

function cloneModel(root:THREE.Object3D) {
  const c=root.clone(true);
  c.traverse((o:any)=>{
    if (!o.isMesh) return;
    o.castShadow=false;
    o.receiveShadow=false;
    o.frustumCulled=false;
    const convert=(m:any)=>new THREE.MeshPhongMaterial({name:m.name,color:m.color?.clone(),map:m.map,normalMap:m.normalMap,normalScale:m.normalScale,alphaMap:m.alphaMap,transparent:m.transparent,opacity:m.opacity,alphaTest:m.alphaTest,side:m.side,shininess:m.metalness>.5?65:38,specular:new THREE.Color(m.metalness>.5?0x999999:0x444444),emissive:m.emissive?.clone(),emissiveMap:m.emissiveMap,vertexColors:m.vertexColors});
    o.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);
  });
  return c as THREE.Group;
}

function Studio({state}:{state:State}) {
  const {gl,scene,camera}=useThree();
  useLayoutEffect(()=>{
    gl.localClippingEnabled=true;
    gl.toneMapping=THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure=1.12;
    gl.shadowMap.enabled=false;
  },[gl]);
  useLayoutEffect(()=>{
    camera.position.set(...state.camera.position);
    camera.lookAt(...state.camera.target);
    (camera as THREE.OrthographicCamera).zoom=state.camera.zoom;
    camera.updateProjectionMatrix();
  },[camera,state.camera.position[0],state.camera.position[1],state.camera.position[2],state.camera.target[0],state.camera.target[1],state.camera.target[2],state.camera.zoom]);
  useLayoutEffect(()=>{
    const pmrem=new THREE.PMREMGenerator(gl);
    const env=pmrem.fromScene(new RoomEnvironment(),0.05);
    scene.environment=env.texture;
    return()=>{env.dispose();pmrem.dispose();};
  },[gl,scene]);
  return <>
    <ambientLight intensity={0.36}/>
    <directionalLight position={[4,7,5]} intensity={4.0} color="#fff4e5"/>
    <directionalLight position={[-5,4,-4]} intensity={2.9} color="#d9e8ff"/>
    <spotLight position={[0,4.6,-4.5]} target-position={[0,.45,-1.65]} intensity={50} distance={9} angle={.48} penumbra={.72} color="#f5bf84"/>
  </>;
}

function Marker({position,color,opacity,radius=.052}:{position:THREE.Vector3;color:string;opacity:number;radius?:number}) {
  return <mesh position={position.toArray() as [number,number,number]}>
    <sphereGeometry args={[radius,18,18]}/><meshBasicMaterial color={color} transparent opacity={opacity}/>
  </mesh>;
}

function ForceArrow({x,opacity}:{x:number;opacity:number}) {
  return <group position={[x,1.1,-1.21]}>
    <mesh position={[0,-.32,0]}><cylinderGeometry args={[.027,.027,.64,12]}/><meshBasicMaterial color={GREEN} transparent opacity={opacity}/></mesh>
    <mesh position={[0,-.69,0]} rotation={[0,0,Math.PI]}><coneGeometry args={[.09,.22,16]}/><meshBasicMaterial color={GREEN} transparent opacity={opacity}/></mesh>
  </group>;
}

function AeroLines({opacity}:{opacity:number}) {
  const curves=useMemo(()=>[-.65,0,.65].map((x,i)=>{
    const y=i===1?1.42:1.12;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(x,y,2.85),new THREE.Vector3(x,y+.08,1.45),new THREE.Vector3(x,y+.35,.0),new THREE.Vector3(x,y+.62,-1.25),new THREE.Vector3(x,y+.74,-2.55),
    ]);
  }),[]);
  return <>{curves.map((curve,i)=><mesh key={i}>
    <tubeGeometry args={[curve,48,.018,7,false]}/><meshBasicMaterial color={i===1?COPPER:GREEN} transparent opacity={opacity}/>
  </mesh>)}
  <ForceArrow x={-.62} opacity={opacity*.8}/><ForceArrow x={.62} opacity={opacity*.8}/></>;
}

function RotationTrail({angle,opacity}:{angle:number;opacity:number}) {
  const curve=useMemo(()=>{
    const points:Array<THREE.Vector3>=[];
    for(let i=0;i<=20;i++){
      const a=angle*(i/20);
      const p=ENGINE.clone().applyEuler(new THREE.Euler(0,a,0));
      p.add(new THREE.Vector3(-Math.sin(a)*FRONT_AXLE.z,0,FRONT_AXLE.z*(1-Math.cos(a))));
      points.push(p);
    }
    return new THREE.CatmullRomCurve3(points);
  },[angle]);
  return <mesh><tubeGeometry args={[curve,36,.022,7,false]}/><meshBasicMaterial color={COPPER} transparent opacity={opacity}/></mesh>;
}

function Scene({frame,state}:{frame:number;state:State}) {
  const [sources,setSources]=useState<{car:THREE.Group;engine:THREE.Group}|null>(null);
  const [handle]=useState(()=>delayRender('Loading YUNEX V2 hero assets'));
  const ready=useRef(false);
  const {advance,camera}=useThree();
  useEffect(()=>{
    let live=true;
    const loader=new GLTFLoader();
    Promise.all([loader.loadAsync(staticFile('model.glb')),loader.loadAsync(staticFile('engine.glb'))])
      .then(([car,engine])=>{if(live)setSources({car:car.scene,engine:engine.scene});})
      .catch(cancelRender);
    return()=>{live=false;};
  },[]);
  const car=useMemo(()=>sources?cloneModel(sources.car):null,[sources]);
  const ghostCar=useMemo(()=>sources?cloneModel(sources.car):null,[sources]);
  const engine=useMemo(()=>sources?cloneModel(sources.engine):null,[sources]);
  const engineDetail=useMemo(()=>sources?cloneModel(sources.engine):null,[sources]);
  const clipPlane=useMemo(()=>new THREE.Plane(new THREE.Vector3(0,0,1),3),[]);

  useLayoutEffect(()=>{
    if(!car||!ghostCar||!engine||!engineDetail)return;
    car.position.set(...state.carPosition); car.rotation.set(...state.carRotation);
    clipPlane.constant=blend(3,.76,state.ghost/.73);
    car.traverse((o:any)=>{
      if(!o.isMesh)return;
      const shell=hasAncestor(o,'Body')||hasAncestor(o,'Glass')||hasAncestor(o,'Grilles')||hasAncestor(o,'Lights');
      const interior=hasAncestor(o,'Interior');
      const materials=Array.isArray(o.material)?o.material:[o.material];
      o.visible=!(interior&&state.ghost>.2);
      for(const m of materials){if(!m)continue;m.clippingPlanes=shell?[clipPlane]:null;}
    });
    ghostCar.position.set(...state.carPosition);ghostCar.rotation.set(...state.carRotation);
    ghostCar.traverse((o:any)=>{if(!o.isMesh)return;const shell=hasAncestor(o,'Body')||hasAncestor(o,'Glass')||hasAncestor(o,'Grilles')||hasAncestor(o,'Lights');o.visible=shell&&state.ghost>.001;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m.transparent=true;m.opacity=.10*(state.ghost/.73);m.depthWrite=false;m.clippingPlanes=null;}});
    const installed=ENGINE.clone().applyEuler(new THREE.Euler(...state.carRotation)).add(new THREE.Vector3(...state.carPosition));
    engine.position.copy(installed); engine.rotation.set(...state.carRotation);
    engine.traverse((o:any)=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];o.visible=state.engine>.002;for(const m of mats){m.transparent=true;m.opacity=state.engine;m.depthWrite=state.engine>.3;}});
    const detail=frame>=125&&frame<246 ? Math.min(phase(frame,125,145),1-phase(frame,232,246)) : 0;
    engineDetail.visible=detail>.001;engineDetail.position.set(0,-1.55,-.36);engineDetail.rotation.set(.08,-.18,0);engineDetail.scale.setScalar(1.42);
    engineDetail.traverse((o:any)=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){m.transparent=true;m.opacity=detail;m.depthWrite=detail>.3;}});
  },[car,ghostCar,engine,engineDetail,clipPlane,frame,state.carPosition[0],state.carPosition[1],state.carPosition[2],state.carRotation[0],state.carRotation[1],state.carRotation[2],state.ghost,state.engine]);

  useEffect(()=>{
    if(!car||!ghostCar||!engine||!engineDetail||ready.current)return;
    ready.current=true;
    camera.position.set(...state.camera.position);camera.lookAt(...state.camera.target);(camera as THREE.OrthographicCamera).zoom=state.camera.zoom;camera.updateProjectionMatrix();
    advance(performance.now());continueRender(handle);
  },[advance,camera,car,ghostCar,engine,engineDetail,handle,state.camera]);

  const markerGroup=<group position={state.carPosition} rotation={state.carRotation}>
    <Marker position={FRONT_AXLE} color={GREEN} opacity={state.technical}/>
    <Marker position={REAR_AXLE} color={GREEN} opacity={state.technical}/>
    <Marker position={ENGINE} color={COPPER} opacity={Math.max(state.technical,state.engine*.55)} radius={.068}/>
    {state.grip>.01&&<><ForceArrow x={-.79} opacity={state.grip}/><ForceArrow x={.79} opacity={state.grip}/></>}
    {state.aero>.01&&<AeroLines opacity={state.aero}/>} 
  </group>;
  return <>
    <Studio state={state}/>
    <mesh position={[0,-.018,-.18]} rotation={[-Math.PI/2,0,0]} scale={[3.1,1.3,1]}><circleGeometry args={[1,64]}/><meshBasicMaterial color="#030404" transparent opacity={.40} depthWrite={false}/></mesh>
    {car&&<primitive object={car}/>} {ghostCar&&<primitive object={ghostCar}/>} {engine&&<primitive object={engine}/>} {engineDetail&&<primitive object={engineDetail}/>} {markerGroup}
    {frame>257&&frame<343&&Math.abs(state.rotation)>.01&&<RotationTrail angle={state.rotation} opacity={Math.sin(phase(frame,255,345)*Math.PI)*.88}/>}
  </>;
}

export function project(point:THREE.Vector3,state:State,followCar=true) {
  const p=point.clone();
  if(followCar){p.applyEuler(new THREE.Euler(...state.carRotation));p.add(new THREE.Vector3(...state.carPosition));}
  const c=new THREE.OrthographicCamera(-W/2,W/2,H/2,-H/2,.1,100);
  c.zoom=state.camera.zoom;c.position.set(...state.camera.position);c.lookAt(...state.camera.target);c.updateProjectionMatrix();c.updateMatrixWorld();
  p.project(c);return{x:(p.x*.5+.5)*W,y:(-p.y*.5+.5)*H};
}

function Label({text,point,state,color,opacity,dx=0,dy=0}:{text:string;point:THREE.Vector3;state:State;color:string;opacity:number;dx?:number;dy?:number}) {
  const p=project(point,state);const estimatedHalf=Math.max(92,text.length*11.5);const x=Math.max(65+estimatedHalf,Math.min(W-65-estimatedHalf,p.x+dx)),y=p.y+dy;
  return <>{opacity>.001&&<>
    <svg width={W} height={H} style={{position:'absolute',inset:0,opacity,pointerEvents:'none'}}><line x1={p.x} y1={p.y} x2={x} y2={y} stroke={color} strokeWidth={2}/><circle cx={p.x} cy={p.y} r={5} fill={color}/></svg>
    <div style={{position:'absolute',left:x,top:y,translate:'-50% -50%',fontFamily:'Yunex',fontSize:38,fontWeight:900,letterSpacing:1.4,color,opacity,textShadow:'0 3px 16px #000',whiteSpace:'nowrap'}}>{text}</div>
  </>}</>;
}

function Title({frame}:{frame:number}) {
  let eyebrow='THE REAR-ENGINE PARADOX',a='PORSCHE NEVER',b='FIXED THIS.',color=COPPER;
  let start=0,end=105,align:'left'|'center'='center';
  if(frame>=105&&frame<255){eyebrow='LAYOUT · 992 GT3 RS';a='ENGINE BEHIND';b='THE AXLE.';start=105;end=255;align='left';}
  else if(frame>=255&&frame<345){eyebrow='WHEN REAR GRIP DISAPPEARS';a='THE MASS WANTS';b='TO ROTATE.';start=255;end=345;}
  else if(frame>=345&&frame<396){eyebrow='THE QUESTION';a='WHY KEEP';b='THE “FLAW”?';start=345;end=396;}
  else if(frame>=396&&frame<549){eyebrow='THE BENEFIT';a='MORE LOAD.';b='MORE REAR GRIP.';start=396;end=549;color=GREEN;align='left';}
  else if(frame>=549&&frame<675){eyebrow='DECADES OF DEVELOPMENT';a='AERO + CHASSIS';b='+ CONTROL.';start=549;end=675;color=GREEN;align='left';}
  else if(frame>=675){eyebrow='THE RESULT';a='UNMISTAKABLY';b='911.';start=675;end=828;}
  const intro=phase(frame,start,start+10);const outro=1-phase(frame,end-12,end);
  return <div style={{position:'absolute',top:frame>=105&&frame<255?292:frame>=396&&frame<675?280:300,left:70,right:70,textAlign:align,opacity:intro*outro,translate:`0 ${18*(1-intro)}px`,textShadow:'0 5px 28px rgba(0,0,0,.72)'}}>
    <div style={{fontFamily:'Arial',fontWeight:700,fontSize:22,letterSpacing:5.4,color:'rgba(241,234,220,.68)',marginBottom:14}}>{eyebrow}</div>
    <div style={{fontFamily:'Yunex',fontWeight:900,fontSize:align==='center'?92:82,lineHeight:.86,letterSpacing:-1.2,color:IVORY}}>{a}</div>
    <div style={{fontFamily:'Yunex',fontWeight:900,fontSize:align==='center'?104:91,lineHeight:.92,letterSpacing:-1.5,color}}>{b}</div>
  </div>;
}

export const ModelLedVideo:React.FC=()=>{
  const frame=useCurrentFrame();const state=stateFor(frame);
  const labels=state.technical*(frame<345?1:frame<396?0:frame<549?.7:0);
  const showEngineDetail=frame>=105&&frame<255;
  const finalMark=phase(frame,770,810);
  return <AbsoluteFill style={{background:CHARCOAL,overflow:'hidden'}}>
    <style>{`@font-face{font-family:Yunex;src:url('${staticFile('Display.ttf')}')}*{box-sizing:border-box}`}</style>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 52% 53%,#292e2f 0%,#15191a 45%,#0b0e0f 84%)'}}/>
    <ThreeCanvas width={W} height={H} orthographic camera={{position:state.camera.position,zoom:state.camera.zoom,near:.1,far:100}} gl={{antialias:false,alpha:true,preserveDrawingBuffer:true}}>
      <Scene frame={frame} state={state}/>
    </ThreeCanvas>
    <Title frame={frame}/>
    <Label text="FRONT AXLE" point={FRONT_AXLE} state={state} color={GREEN} opacity={labels} dx={68} dy={-95}/>
    <Label text="REAR AXLE" point={REAR_AXLE} state={state} color={GREEN} opacity={labels} dx={-22} dy={-105}/>
    <Label text="ENGINE MASS" point={ENGINE} state={state} color={COPPER} opacity={Math.max(showEngineDetail?phase(frame,125,155):0,labels)} dx={-15} dy={105}/>
    {showEngineDetail&&<div style={{position:'absolute',left:540,top:1425,translate:'-50% 0',fontFamily:'Arial',fontSize:20,fontWeight:700,letterSpacing:4,color:'rgba(241,234,220,.58)',opacity:phase(frame,135,150)*(1-phase(frame,232,246))}}>4.0L NATURALLY ASPIRATED FLAT-SIX</div>}
    {frame>=255&&frame<345&&<div style={{position:'absolute',left:72,bottom:164,width:390,fontFamily:'Arial',fontSize:25,lineHeight:1.25,letterSpacing:1.1,color:'rgba(241,234,220,.74)',opacity:phase(frame,266,281)*(1-phase(frame,330,343))}}>REAR MASS AND CAR<br/><b style={{color:COPPER}}>ROTATE TOGETHER</b></div>}
    {frame>=396&&frame<549&&<div style={{position:'absolute',left:74,bottom:156,fontFamily:'Arial',fontSize:24,letterSpacing:2.6,color:'rgba(241,234,220,.70)',opacity:phase(frame,411,430)*(1-phase(frame,530,548))}}>DRIVEN REAR WHEELS · LOAD INTO ROAD</div>}
    {frame>=549&&frame<675&&<div style={{position:'absolute',left:74,bottom:148,right:74,fontFamily:'Arial',fontSize:21,lineHeight:1.35,letterSpacing:2.1,color:'rgba(241,234,220,.64)',opacity:phase(frame,566,585)*(1-phase(frame,658,674))}}>MODERN GT3 RS · AIRFLOW SHOWN ILLUSTRATIVELY AT SPEED</div>}
    <div style={{position:'absolute',right:56,bottom:52,fontFamily:'Yunex',fontSize:25,letterSpacing:5,color:IVORY,opacity:.24+.76*finalMark}}>YUNEX</div>
    <Audio src={staticFile('vo.wav')}/><Audio src={staticFile('sound.wav')} volume={.42}/>
  </AbsoluteFill>;
};
