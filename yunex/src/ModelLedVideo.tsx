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

const WHEEL_SPIN_NODES=['Spin_FL','Spin_FR','Spin_RL','Spin_RR'] as const;
function wheelSpinAngle(frame:number) {
  if (frame<=396) return 0;
  const end=Math.min(frame,675);
  let angle=0;
  for (let f=397;f<=end;f++) {
    const accelerate=phase(f,396,430);
    const decelerate=1-phase(f,648,675);
    angle+=.48*accelerate*decelerate;
  }
  return angle%(Math.PI*2);
}

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

  type CameraKey={f:number;angle:number;y:number;r:number;zoom:number;ty:number;tz:number};
  const keys:CameraKey[]=[
    {f:0,angle:-1.68,y:9.0,r:9.0,zoom:282,ty:.48,tz:-.10},
    {f:52,angle:-1.82,y:8.5,r:9.0,zoom:286,ty:.48,tz:-.18},
    {f:105,angle:-2.02,y:6.7,r:8.5,zoom:274,ty:.50,tz:-.62},
    // Rear-bay close view: the installed engine becomes the subject.
    {f:145,angle:-2.76,y:1.72,r:4.85,zoom:490,ty:.47,tz:-1.56},
    {f:178,angle:-2.82,y:1.66,r:5.05,zoom:470,ty:.47,tz:-1.50},
    // Pull back briefly so axle-to-engine placement reads as one relationship.
    {f:218,angle:-3.08,y:1.9,r:11.7,zoom:208,ty:.58,tz:-.28},
    {f:255,angle:-3.13,y:2.05,r:12.0,zoom:210,ty:.62,tz:-.16},
    {f:300,angle:-1.55,y:9.1,r:.35,zoom:205,ty:.58,tz:.02},
    {f:345,angle:-1.30,y:9.0,r:.45,zoom:205,ty:.58,tz:.04},
    {f:396,angle:-2.48,y:3.0,r:9.7,zoom:225,ty:.66,tz:-.52},
    // Close rear-wheel/load beat, then breathe back to a medium car view.
    {f:442,angle:-2.72,y:1.72,r:5.45,zoom:350,ty:.45,tz:-1.18},
    {f:490,angle:-2.58,y:2.15,r:6.8,zoom:302,ty:.51,tz:-.96},
    {f:549,angle:-2.34,y:3.0,r:9.8,zoom:226,ty:.70,tz:-.46},
    // High rear three-quarter keeps the wing and airflow relationship visible.
    {f:610,angle:-2.16,y:6.5,r:8.0,zoom:226,ty:.69,tz:-.48},
    {f:674,angle:-2.02,y:6.6,r:8.0,zoom:234,ty:.62,tz:-.40},
    {f:675,angle:1.50,y:8.7,r:9.0,zoom:278,ty:.48,tz:.10},
    // New front-three-quarter payoff avoids simply replaying the opening view.
    {f:748,angle:1.34,y:8.7,r:9.0,zoom:278,ty:.48,tz:.12},
    {f:827,angle:1.14,y:8.9,r:9.0,zoom:282,ty:.48,tz:.18},
  ];
  let ka=keys[0],kb=keys[1];
  for(let i=0;i<keys.length-1;i++){if(frame>=keys[i].f&&frame<=keys[i+1].f){ka=keys[i];kb=keys[i+1];break;} if(frame>keys[keys.length-1].f){ka=keys[keys.length-2];kb=keys[keys.length-1];}}
  const kt=phase(frame,ka.f,kb.f);
  const angle=blend(ka.angle,kb.angle,kt),y=blend(ka.y,kb.y,kt),radius=blend(ka.r,kb.r,kt),zoom=blend(ka.zoom,kb.zoom,kt),targetY=blend(ka.ty,kb.ty,kt),targetZ=blend(ka.tz,kb.tz,kt);

  const spin = frame >= 255 && frame < 345 ? Math.sin(rotate * Math.PI) * -0.43 : 0;
  const pivot = FRONT_AXLE;
  const carX = -Math.sin(spin) * pivot.z;
  const carZ = pivot.z * (1 - Math.cos(spin));
  const squat = frame >= 396 && frame < 549 ? Math.sin(grip * Math.PI) * 0.035 : 0;
  return {
    camera:{
      position:[Math.cos(angle)*radius,y,Math.sin(angle)*radius],
      target:[0,targetY,targetZ],
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

function ForceArrow({x,opacity,y=1.1,z=-1.21,length=.64}:{x:number;opacity:number;y?:number;z?:number;length?:number}) {
  return <group position={[x,y,z]}>
    <mesh position={[0,-length*.5,0]}><cylinderGeometry args={[.022,.022,length,12]}/><meshBasicMaterial color={GREEN} transparent opacity={opacity}/></mesh>
    <mesh position={[0,-length-.11,0]} rotation={[0,0,Math.PI]}><coneGeometry args={[.075,.20,16]}/><meshBasicMaterial color={GREEN} transparent opacity={opacity}/></mesh>
  </group>;
}

type AeroPathSpec={
  points:Array<[number,number,number]>;
  color:string;
  baseOpacity:number;
  pulseOffset:number;
  radius:number;
};

function AeroLines({frame,opacity}:{frame:number;opacity:number}) {
  const paths=useMemo<AeroPathSpec[]>(()=>[
    {color:COPPER,baseOpacity:.32,pulseOffset:.00,radius:.010,points:[[0,.68,2.95],[0,.76,1.72],[0,1.16,.92],[0,1.42,.10],[0,1.43,-.92],[0,1.54,-1.72],[0,1.58,-2.62]]},
    {color:GREEN,baseOpacity:.24,pulseOffset:.14,radius:.008,points:[[-.43,.66,2.90],[-.48,.75,1.72],[-.46,1.10,.88],[-.43,1.34,.05],[-.42,1.35,-1.02],[-.46,1.48,-1.78],[-.50,1.50,-2.58]]},
    {color:GREEN,baseOpacity:.24,pulseOffset:.29,radius:.008,points:[[.43,.66,2.90],[.48,.75,1.72],[.46,1.10,.88],[.43,1.34,.05],[.42,1.35,-1.02],[.46,1.48,-1.78],[.50,1.50,-2.58]]},
    {color:GREEN,baseOpacity:.25,pulseOffset:.42,radius:.009,points:[[-.86,.55,2.82],[-.98,.60,1.60],[-1.00,.66,.42],[-.94,.72,-.78],[-.86,.84,-1.62],[-.74,1.02,-2.48]]},
    {color:GREEN,baseOpacity:.25,pulseOffset:.57,radius:.009,points:[[.86,.55,2.82],[.98,.60,1.60],[1.00,.66,.42],[.94,.72,-.78],[.86,.84,-1.62],[.74,1.02,-2.48]]},
    {color:GREEN,baseOpacity:.18,pulseOffset:.68,radius:.007,points:[[-.34,.16,2.66],[-.36,.15,1.34],[-.36,.14,.06],[-.34,.14,-1.20],[-.30,.19,-2.04],[-.26,.34,-2.72]]},
    {color:GREEN,baseOpacity:.18,pulseOffset:.80,radius:.007,points:[[.34,.16,2.66],[.36,.15,1.34],[.36,.14,.06],[.34,.14,-1.20],[.30,.19,-2.04],[.26,.34,-2.72]]},
  ],[]);
  const curves=useMemo(()=>paths.map((p)=>new THREE.CatmullRomCurve3(p.points.map((v)=>new THREE.Vector3(...v)),false,'catmullrom',.42)),[paths]);
  const flow=(frame-549)/58;
  return <>
    {curves.map((curve,i)=>{
      const spec=paths[i];
      return <React.Fragment key={i}>
        <mesh>
          <tubeGeometry args={[curve,72,spec.radius,7,false]}/>
          <meshBasicMaterial color={spec.color} transparent opacity={opacity*spec.baseOpacity} depthWrite={false}/>
        </mesh>
        {[0,.44].map((extra,j)=>{
          const t=((flow+spec.pulseOffset+extra)%1+1)%1;
          const p=curve.getPoint(t);
          return <mesh key={j} position={p.toArray() as [number,number,number]}>
            <sphereGeometry args={[i===0 ? .036 : .030,12,12]}/>
            <meshBasicMaterial color={spec.color} transparent opacity={opacity*(j===0 ? .90 : .56)} depthWrite={false}/>
          </mesh>;
        })}
      </React.Fragment>;
    })}
    <ForceArrow x={-.62} y={1.78} z={-1.72} length={.72} opacity={opacity*.70}/>
    <ForceArrow x={.62} y={1.78} z={-1.72} length={.72} opacity={opacity*.70}/>
  </>;
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
    const wheelAngle=wheelSpinAngle(frame);
    for (const nodeName of WHEEL_SPIN_NODES) {
      const wheelPivot=car.getObjectByName(nodeName);
      if (wheelPivot) wheelPivot.rotation.x=wheelAngle;
    }
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
    // The refined camera now shows the installed engine directly; keep the duplicate
    // dormant so the viewer never has to reconcile two engine positions.
    const detail=0;
    engineDetail.visible=false;engineDetail.position.set(0,-1.55,-.36);engineDetail.rotation.set(.08,-.18,0);engineDetail.scale.setScalar(1.42);
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
    {state.aero>.01&&<AeroLines frame={frame} opacity={state.aero}/>} 
  </group>;
  return <>
    <Studio state={state}/>
    <mesh position={[0,-.018,-.18]} rotation={[-Math.PI/2,0,0]} scale={[1.05,2.5,1]}><circleGeometry args={[1,64]}/><meshBasicMaterial color="#030404" transparent opacity={frame>=255&&frame<345?0:.22} depthWrite={false}/></mesh>
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
    <div style={{position:'absolute',left:x,top:y,translate:'-50% -50%',fontFamily:'Yunex',fontSize:36,fontWeight:900,letterSpacing:1.3,color,opacity,textShadow:'0 3px 16px #000',whiteSpace:'nowrap',background:'rgba(10,13,14,.76)',padding:'5px 10px 3px',borderRadius:3}}>{text}</div>
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
  const overhead=frame>=255&&frame<396;
  const top=frame>=675?100:overhead?190:frame>=549&&frame<675?430:220;
  return <div style={{position:'absolute',top,left:74,right:74,textAlign:align,opacity:intro*outro,translate:`0 ${14*(1-intro)}px`,textShadow:'0 5px 28px rgba(0,0,0,.72)'}}>
    <div style={{fontFamily:'Arial',fontWeight:700,fontSize:19,letterSpacing:4.8,color:'rgba(241,234,220,.68)',marginBottom:11}}>{eyebrow}</div>
    <div style={{fontFamily:'Yunex',fontWeight:900,fontSize:align==='center'?70:66,lineHeight:.88,letterSpacing:-.8,color:IVORY}}>{a}</div>
    <div style={{fontFamily:'Yunex',fontWeight:900,fontSize:align==='center'?78:72,lineHeight:.94,letterSpacing:-1,color}}>{b}</div>
  </div>;
}

export const ModelLedVideo:React.FC<{frameOffset?:number;includeAudio?:boolean}>=({frameOffset=0,includeAudio=true})=>{
  const frame=useCurrentFrame()+frameOffset;const state=stateFor(frame);
  const labels=state.technical*(frame<255?phase(frame,180,198):frame<345?1:frame<396?0:frame<549?.7:0);
  const showEngineDetail=frame>=105&&frame<255;
  const finalMark=phase(frame,770,810);
  return <AbsoluteFill style={{background:CHARCOAL,overflow:'hidden'}}>
    <style>{`@font-face{font-family:Yunex;src:url('${staticFile('Display.ttf')}')}*{box-sizing:border-box}`}</style>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 52% 53%,#292e2f 0%,#15191a 45%,#0b0e0f 84%)'}}/>
    <ThreeCanvas width={W} height={H} orthographic camera={{position:state.camera.position,zoom:state.camera.zoom,near:.1,far:100}} gl={{antialias:true,alpha:true,preserveDrawingBuffer:true}}>
      <Scene frame={frame} state={state}/>
    </ThreeCanvas>
    <Title frame={frame}/>
    <Label text="FRONT AXLE" point={FRONT_AXLE} state={state} color={GREEN} opacity={labels} dx={68} dy={-95}/>
    <Label text="REAR AXLE" point={REAR_AXLE} state={state} color={GREEN} opacity={labels} dx={-22} dy={-105}/>
    <Label text="ENGINE MASS" point={ENGINE} state={state} color={COPPER} opacity={Math.max(showEngineDetail?phase(frame,125,155):0,labels)} dx={-15} dy={105}/>
    {showEngineDetail&&<div style={{position:'absolute',left:74,bottom:185,fontFamily:'Arial',fontSize:19,fontWeight:700,letterSpacing:3.4,color:'rgba(241,234,220,.60)',opacity:phase(frame,135,150)*(1-phase(frame,232,246))}}>4.0L NATURALLY ASPIRATED FLAT-SIX</div>}
    {frame>=255&&frame<345&&<div style={{position:'absolute',left:72,bottom:164,width:390,fontFamily:'Arial',fontSize:25,lineHeight:1.25,letterSpacing:1.1,color:'rgba(241,234,220,.74)',opacity:phase(frame,266,281)*(1-phase(frame,330,343))}}>REAR MASS AND CAR<br/><b style={{color:COPPER}}>ROTATE TOGETHER</b></div>}
    {frame>=396&&frame<549&&<div style={{position:'absolute',left:74,bottom:156,fontFamily:'Arial',fontSize:24,letterSpacing:2.6,color:'rgba(241,234,220,.70)',opacity:phase(frame,411,430)*(1-phase(frame,530,548))}}>DRIVEN REAR WHEELS · LOAD INTO ROAD</div>}
    {frame>=549&&frame<675&&<div style={{position:'absolute',left:74,bottom:148,right:74,fontFamily:'Arial',fontSize:21,lineHeight:1.35,letterSpacing:2.1,color:'rgba(241,234,220,.64)',opacity:phase(frame,566,585)*(1-phase(frame,658,674))}}>MODERN GT3 RS · AIRFLOW SHOWN ILLUSTRATIVELY AT SPEED</div>}
    <div style={{position:'absolute',right:56,bottom:52,fontFamily:'Yunex',fontSize:25,letterSpacing:5,color:IVORY,opacity:.24+.76*finalMark}}>YUNEX</div>
    {includeAudio&&<><Audio src={staticFile('vo.wav')}/><Audio src={staticFile('sound.wav')} volume={.42}/></>}
  </AbsoluteFill>;
};
