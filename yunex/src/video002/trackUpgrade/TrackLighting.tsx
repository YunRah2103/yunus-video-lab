import React,{useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {rootPoseAt} from '../driving';
import {
  lightingProfileFor,
  TRACK_LIGHTING_SETUP,
  type TrackLightingQuality,
} from './lighting/profile';
import {createContactShadowTexture,createOutdoorSkyTexture} from './lighting/textures';

export type TrackLightingProps={
  quality:TrackLightingQuality;
  seed?:number;
};

export {TRACK_LIGHTING_SETUP} from './lighting/profile';

export const TrackLighting:React.FC<TrackLightingProps>=({quality,seed=2103})=>{
  const frame=useCurrentFrame();
  const {gl,scene}=useThree();
  const keyLight=useRef<THREE.DirectionalLight|null>(null);
  const keyTarget=useRef<THREE.Object3D|null>(null);
  const profile=lightingProfileFor(quality);
  const sky=useMemo(()=>createOutdoorSkyTexture(seed),[seed]);
  const contactTexture=useMemo(()=>createContactShadowTexture(),[]);
  const pose=rootPoseAt(frame);
  const [carX,carY,carZ]=pose.position;

  useLayoutEffect(()=>{
    const previousBackground=scene.background;
    const previousEnvironment=scene.environment;
    const sceneWithIntensity=scene as THREE.Scene&{environmentIntensity?:number;backgroundIntensity?:number};
    const previousEnvironmentIntensity=sceneWithIntensity.environmentIntensity;
    const previousBackgroundIntensity=sceneWithIntensity.backgroundIntensity;
    const pmrem=new THREE.PMREMGenerator(gl);
    const environment=pmrem.fromEquirectangular(sky);

    scene.background=sky;
    scene.environment=environment.texture;
    if(typeof sceneWithIntensity.environmentIntensity==='number')sceneWithIntensity.environmentIntensity=profile.environmentIntensity;
    if(typeof sceneWithIntensity.backgroundIntensity==='number')sceneWithIntensity.backgroundIntensity=profile.backgroundIntensity;

    return()=>{
      if(scene.background===sky)scene.background=previousBackground;
      if(scene.environment===environment.texture)scene.environment=previousEnvironment;
      if(typeof previousEnvironmentIntensity==='number')sceneWithIntensity.environmentIntensity=previousEnvironmentIntensity;
      if(typeof previousBackgroundIntensity==='number')sceneWithIntensity.backgroundIntensity=previousBackgroundIntensity;
      environment.dispose();
      pmrem.dispose();
    };
  },[gl,profile.backgroundIntensity,profile.environmentIntensity,scene,sky]);

  useLayoutEffect(()=>{
    const target=keyTarget.current;
    const light=keyLight.current;
    if(!target||!light)return;

    target.position.set(carX,carY+0.50,carZ+0.18);
    light.position.set(carX-6.4,carY+8.4,carZ+5.8);
    light.target=target;
    target.updateMatrixWorld();
    light.updateMatrixWorld();
  },[carX,carY,carZ]);

  useEffect(()=>()=>{
    sky.dispose();
    contactTexture.dispose();
  },[contactTexture,sky]);

  return <>
    <hemisphereLight args={['#dce8e8','#384035',profile.hemisphereIntensity]}/>
    <object3D ref={keyTarget}/>
    <directionalLight
      ref={keyLight}
      castShadow
      intensity={profile.keyIntensity}
      color="#fff1d8"
      shadow-mapSize-width={profile.shadowMapSize}
      shadow-mapSize-height={profile.shadowMapSize}
      shadow-camera-left={-profile.shadowExtent}
      shadow-camera-right={profile.shadowExtent}
      shadow-camera-top={profile.shadowExtent}
      shadow-camera-bottom={-profile.shadowExtent}
      shadow-camera-near={0.2}
      shadow-camera-far={28}
      shadow-bias={-0.00012}
      shadow-normalBias={0.022}
    />
    <directionalLight
      position={[5.6,3.4,-4.8]}
      intensity={profile.fillIntensity}
      color="#c8d9e5"
    />
    <mesh
      position={[carX,-0.036,carZ+0.10]}
      rotation={[-Math.PI/2,0,0]}
      renderOrder={-10}
    >
      <planeGeometry args={[2.15,4.95]}/>
      <meshBasicMaterial
        map={contactTexture}
        transparent
        opacity={profile.contactOpacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  </>;
};
