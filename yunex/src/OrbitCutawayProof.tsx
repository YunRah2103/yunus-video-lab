import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

const IVORY = '#f1eadc';
const COPPER = '#d58e50';
const GREEN = '#bddb78';
const CHARCOAL = '#101314';

const FRONT_AXLE = new THREE.Vector3(0, 0.352176, 1.242511);
const REAR_AXLE = new THREE.Vector3(0, 0.371397, -1.211416);
const ENGINE_MARKER = new THREE.Vector3(0, 0.47, -1.78);

const clamp01 = (v:number) => Math.max(0, Math.min(1, v));
const smooth = (v:number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

type CameraState = {
  position:[number, number, number];
  target:[number, number, number];
  zoom:number;
};

const cameraStateForFrame = (frame:number, duration:number):CameraState => {
  const t = clamp01(frame / Math.max(1, duration - 1));
  const orbit = smooth(t / 0.72);
  const angle = THREE.MathUtils.lerp(-0.88, -0.035, orbit);
  const radius = THREE.MathUtils.lerp(13.2, 13.0, orbit);
  const position:[number,number,number] = [
    Math.cos(angle) * radius,
    THREE.MathUtils.lerp(3.25, 2.55, orbit),
    Math.sin(angle) * radius,
  ];
  return {
    position,
    target:[0, 0.60, THREE.MathUtils.lerp(-0.18, -0.34, orbit)],
    zoom:THREE.MathUtils.lerp(184, 196, smooth(t / 0.88)),
  };
};

const hasAncestor = (o:THREE.Object3D, name:string) => {
  let n:THREE.Object3D|null = o;
  while (n) {
    if (n.name === name || n.name.startsWith(name + '_')) return true;
    n = n.parent;
  }
  return false;
};

const cloneWithMaterials = (root:THREE.Object3D) => {
  const c = root.clone(true);
  c.traverse((o:any) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      if (Array.isArray(o.material)) o.material = o.material.map((m:any) => m.clone());
      else if (o.material) o.material = o.material.clone();
    }
  });
  return c as THREE.Group;
};

function StudioRig({cameraState}:{cameraState:CameraState}) {
  const {gl, scene, camera} = useThree();

  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.08;
  }, [gl]);

  useLayoutEffect(() => {
    camera.position.set(...cameraState.position);
    camera.lookAt(...cameraState.target);
    if ('zoom' in camera) (camera as THREE.OrthographicCamera).zoom = cameraState.zoom;
    camera.updateProjectionMatrix();
  }, [camera, cameraState.position[0], cameraState.position[1], cameraState.position[2], cameraState.target[0], cameraState.target[1], cameraState.target[2], cameraState.zoom]);

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return <>
    <ambientLight intensity={0.35}/>
    <directionalLight position={[3.5, 7.5, 4]} intensity={4.0} color="#fff5e8" castShadow/>
    <directionalLight position={[-4.5, 4.2, -3.5]} intensity={2.6} color="#dbe9ff"/>
    <spotLight position={[0.2, 4.2, -4.0]} target-position={[0,0.45,-1.72]} intensity={55} distance={8} angle={0.52} penumbra={0.7} color="#f7c58f"/>
    <spotLight position={[3.2, 2.3, -2.8]} target-position={[0,0.45,-1.75]} intensity={38} distance={8} angle={0.42} penumbra={0.72} color="#d5e89e"/>
  </>;
}

function TechnicalMarkers({reveal}:{reveal:number}) {
  if (reveal <= 0.001) return null;
  const opacity = reveal;
  return <>
    <mesh position={FRONT_AXLE.toArray() as [number,number,number]}>
      <sphereGeometry args={[0.045, 18, 18]}/>
      <meshBasicMaterial color={GREEN} transparent opacity={opacity}/>
    </mesh>
    <mesh position={REAR_AXLE.toArray() as [number,number,number]}>
      <sphereGeometry args={[0.045, 18, 18]}/>
      <meshBasicMaterial color={GREEN} transparent opacity={opacity}/>
    </mesh>
    <mesh position={ENGINE_MARKER.toArray() as [number,number,number]}>
      <sphereGeometry args={[0.06, 20, 20]}/>
      <meshBasicMaterial color={COPPER} transparent opacity={opacity}/>
    </mesh>
  </>;
}

function ProofScene({frame,duration}:{frame:number; duration:number}) {
  const [sources, setSources] = useState<{car:THREE.Group; engine:THREE.Group}|null>(null);
  const [handle] = useState(() => delayRender('Loading approved Porsche and finished engine'));
  const cameraState = cameraStateForFrame(frame, duration);
  const t = frame / Math.max(1, duration - 1);
  const cutaway = smooth((t - 0.22) / 0.46);
  const engineReveal = smooth((t - 0.16) / 0.38);
  const markerReveal = smooth((t - 0.63) / 0.18);
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,0,1), 3), []);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    Promise.all([
      loader.loadAsync(staticFile('model.glb')),
      loader.loadAsync(staticFile('engine.glb')),
    ]).then(([car,engine]) => {
      if (cancelled) return;
      setSources({car:car.scene, engine:engine.scene});
      continueRender(handle);
    }).catch((err) => cancelRender(err));
    return () => {cancelled = true;};
  }, [handle]);

  const solidCar = useMemo(() => sources ? cloneWithMaterials(sources.car) : null, [sources]);
  const ghostCar = useMemo(() => sources ? cloneWithMaterials(sources.car) : null, [sources]);
  const engine = useMemo(() => sources ? cloneWithMaterials(sources.engine) : null, [sources]);

  useLayoutEffect(() => {
    if (!solidCar || !ghostCar || !engine) return;

    clipPlane.constant = THREE.MathUtils.lerp(3.0, 0.72, cutaway);

    solidCar.traverse((o:any) => {
      if (!o.isMesh) return;
      const cutGroup = hasAncestor(o, 'Body') || hasAncestor(o, 'Glass') || hasAncestor(o, 'Grilles') || hasAncestor(o, 'Interior');
      const materials = Array.isArray(o.material) ? o.material : [o.material];
      for (const mat of materials) {
        if (!mat) continue;
        mat.clippingPlanes = cutGroup ? [clipPlane] : null;
        mat.clipShadows = true;
        mat.needsUpdate = true;
      }
    });

    ghostCar.traverse((o:any) => {
      if (!o.isMesh) return;
      const shell = hasAncestor(o,'Body') || hasAncestor(o,'Glass') || hasAncestor(o,'Grilles') || hasAncestor(o,'Lights');
      o.visible = shell && cutaway > 0.01;
      const materials = Array.isArray(o.material) ? o.material : [o.material];
      for (const mat of materials) {
        if (!mat) continue;
        mat.transparent = true;
        mat.depthWrite = false;
        mat.opacity = shell ? 0.10 * cutaway : 0;
        mat.clippingPlanes = null;
        mat.needsUpdate = true;
      }
    });

    engine.position.copy(ENGINE_MARKER);
    engine.traverse((o:any) => {
      if (!o.isMesh) return;
      const materials = Array.isArray(o.material) ? o.material : [o.material];
      for (const mat of materials) {
        if (!mat) continue;
        mat.transparent = engineReveal < 0.999;
        mat.opacity = engineReveal;
        mat.depthWrite = engineReveal > 0.35;
        mat.needsUpdate = true;
      }
      o.visible = engineReveal > 0.001;
    });
  }, [solidCar, ghostCar, engine, clipPlane, cutaway, engineReveal]);

  return <>
    <StudioRig cameraState={cameraState}/>
    <mesh position={[0,-0.025,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[30,30]}/>
      <meshStandardMaterial color="#141718" roughness={0.96} metalness={0.04}/>
    </mesh>
    {solidCar && <primitive object={solidCar}/>}
    {ghostCar && <primitive object={ghostCar}/>}
    {engine && <primitive object={engine}/>}
    <TechnicalMarkers reveal={markerReveal}/>
  </>;
}

function projectPoint(point:THREE.Vector3, cameraState:CameraState) {
  const cam = new THREE.OrthographicCamera(-540, 540, 960, -960, 0.1, 100);
  cam.zoom = cameraState.zoom;
  cam.position.set(...cameraState.position);
  cam.lookAt(...cameraState.target);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
  const p = point.clone().project(cam);
  return {x:(p.x * 0.5 + 0.5) * 1080, y:(-p.y * 0.5 + 0.5) * 1920};
}

function Label({label,point,color,offset,cameraState,opacity}:{label:string;point:THREE.Vector3;color:string;offset:[number,number];cameraState:CameraState;opacity:number}) {
  const p = projectPoint(point,cameraState);
  const x = p.x + offset[0];
  const y = p.y + offset[1];
  const lineStartX = p.x;
  const lineStartY = p.y;
  return <>
    <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity,pointerEvents:'none'}}>
      <line x1={lineStartX} y1={lineStartY} x2={x} y2={y} stroke={color} strokeWidth="2" opacity="0.72"/>
      <circle cx={lineStartX} cy={lineStartY} r="5" fill={color}/>
    </svg>
    <div style={{position:'absolute',left:x,top:y,transform:'translate(-50%,-50%)',opacity,color,fontFamily:'Display, sans-serif',fontSize:31,fontWeight:800,letterSpacing:1.6,textShadow:'0 2px 12px #000'}}>
      {label}
    </div>
  </>;
}

export const OrbitCutawayProof:React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / Math.max(1,durationInFrames - 1);
  const cameraState = cameraStateForFrame(frame,durationInFrames);
  const hookOpacity = 1 - smooth((t - 0.24) / 0.18);
  const labelsOpacity = smooth((t - 0.63) / 0.16);
  const technicalOpacity = smooth((t - 0.48) / 0.22);

  return <AbsoluteFill style={{background:CHARCOAL,overflow:'hidden'}}>
    <style>{`@font-face{font-family:Display;src:url('${staticFile('Display.ttf')}') format('truetype');font-display:block;} *{box-sizing:border-box;}`}</style>
    <AbsoluteFill style={{background:'radial-gradient(circle at 52% 55%, #24292a 0%, #151819 42%, #0d0f10 84%)'}}/>
    <ThreeCanvas width={1080} height={1920} orthographic camera={{position:cameraState.position,zoom:cameraState.zoom,near:0.1,far:100}} gl={{antialias:true,alpha:true,preserveDrawingBuffer:true}}>
      <ProofScene frame={frame} duration={durationInFrames}/>
    </ThreeCanvas>

    <div style={{position:'absolute',top:154,left:82,right:82,opacity:hookOpacity,fontFamily:'Display, sans-serif',textTransform:'uppercase',lineHeight:0.88,letterSpacing:-2.2,textAlign:'center',textShadow:'0 5px 28px rgba(0,0,0,.65)'}}>
      <div style={{fontSize:94,fontWeight:900,color:IVORY}}>PORSCHE NEVER</div>
      <div style={{fontSize:108,fontWeight:900,color:COPPER}}>FIXED THIS.</div>
    </div>

    <div style={{position:'absolute',top:116,left:64,opacity:technicalOpacity,fontFamily:'Display, sans-serif',fontSize:24,fontWeight:800,letterSpacing:3.6,color:IVORY}}>
      992 GT3 RS · ENGINE PLACEMENT
    </div>

    <Label label="FRONT AXLE" point={FRONT_AXLE} color={GREEN} offset={[-38,-78]} cameraState={cameraState} opacity={labelsOpacity}/>
    <Label label="REAR AXLE" point={REAR_AXLE} color={GREEN} offset={[12,-88]} cameraState={cameraState} opacity={labelsOpacity}/>
    <Label label="ENGINE MASS" point={ENGINE_MARKER} color={COPPER} offset={[32,94]} cameraState={cameraState} opacity={labelsOpacity}/>

    <div style={{position:'absolute',left:66,bottom:86,opacity:technicalOpacity,fontFamily:'Display, sans-serif',fontSize:21,letterSpacing:2.4,color:'rgba(241,234,220,.72)'}}>
      CUTAWAY PROOF · ILLUSTRATIVE PLACEMENT
    </div>
  </AbsoluteFill>;
};
