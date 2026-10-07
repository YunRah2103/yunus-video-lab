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

export type TrackLightingProps={quality:TrackLightingQuality;seed?:number;carPose?:{position:[number,number,number];rotation?:[number,number,number]}};
export {TRACK_LIGHTING_SETUP} from './lighting/profile';

export const TrackLighting:React.FC<TrackLightingProps>=({quality,seed=2103,carPose})=>{
  const frame=useCurrentFrame();
  const {gl,scene}=useThree();
  const keyLight=useRef<THREE.DirectionalLight|null>(null);
  const keyTarget=useRef<THREE.Object3D|null>(null);
  const profile=lightingProfileFor(quality);
  const sky=useMemo(()=>createOutdoorSkyTexture(seed),[seed]);
  const contactTexture=useMemo(()=>createContactShadowTexture(),[]);
  const pose=carPose??rootPoseAt(frame);
  const [carX,carY,carZ]=pose.position;

  useLayoutEffect(()=>{
    const previousBackground=scene.background;
    const previousEnvironment=scene.environment;
    const previousFog=scene.fog;
    const sceneWithIntensity=scene as THREE.Scene&{
      environmentIntensity?:number;
      backgroundIntensity?:number;
    };
    const previousEnvironmentIntensity=sceneWithIntensity.environmentIntensity;
    const previousBackgroundIntensity=sceneWithIntensity.backgroundIntensity;
    const pmrem=new THREE.PMREMGenerator(gl);
    const environment=pmrem.fromEquirectangular(sky);

    scene.background=sky;
    scene.environment=environment.texture;
    scene.fog=new THREE.Fog(
      '#b8c2ba',
      quality==='final'?34:30,
      quality==='final'?128:110,
    );
    if(typeof sceneWithIntensity.environmentIntensity==='number'){
      sceneWithIntensity.environmentIntensity=profile.environmentIntensity;
    }
    if(typeof sceneWithIntensity.backgroundIntensity==='number'){
      sceneWithIntensity.backgroundIntensity=profile.backgroundIntensity;
    }

    return()=>{
      if(scene.background===sky)scene.background=previousBackground;
      if(scene.environment===environment.texture)scene.environment=previousEnvironment;
      if(scene.fog instanceof THREE.Fog&&scene.fog.color.getHexString()==='b8c2ba'){
        scene.fog=previousFog;
      }
      if(typeof previousEnvironmentIntensity==='number'){
        sceneWithIntensity.environmentIntensity=previousEnvironmentIntensity;
      }
      if(typeof previousBackgroundIntensity==='number'){
        sceneWithIntensity.backgroundIntensity=previousBackgroundIntensity;
      }
      environment.dispose();
      pmrem.dispose();
    };
  },[gl,profile.backgroundIntensity,profile.environmentIntensity,quality,scene,sky]);

  useLayoutEffect(()=>{
    const target=keyTarget.current;
    const light=keyLight.current;
    if(!target||!light)return;
    target.position.set(carX,carY+.46,carZ+.12);
    light.position.set(carX-7.2,carY+9.1,carZ+6.3);
    light.target=target;
    target.updateMatrixWorld();
    light.updateMatrixWorld();
  },[carX,carY,carZ]);

  useEffect(()=>()=>{sky.dispose();contactTexture.dispose();},[contactTexture,sky]);

  return <>
    <hemisphereLight args={['#dce7e5','#3f493c',profile.hemisphereIntensity*.92]}/>
    <ambientLight intensity={.08}/>
    <object3D ref={keyTarget}/>
    <directionalLight
      ref={keyLight}
      castShadow
      intensity={profile.keyIntensity*.96}
      color="#fff4df"
      shadow-mapSize-width={profile.shadowMapSize}
      shadow-mapSize-height={profile.shadowMapSize}
      shadow-camera-left={-profile.shadowExtent}
      shadow-camera-right={profile.shadowExtent}
      shadow-camera-top={profile.shadowExtent}
      shadow-camera-bottom={-profile.shadowExtent}
      shadow-camera-near={.2}
      shadow-camera-far={30}
      shadow-bias={-.0001}
      shadow-normalBias={.026}
    />
    <directionalLight
      position={[6.4,3.7,-5.6]}
      intensity={profile.fillIntensity*.82}
      color="#cbdbe2"
    />
    <mesh
      position={[carX,-.036,carZ+.10]}
      rotation={[-Math.PI/2,0,pose.rotation?.[1]??0]}
      renderOrder={-10}
    >
      <planeGeometry args={[2.15,4.95]}/>
      <meshBasicMaterial
        map={contactTexture}
        transparent
        opacity={profile.contactOpacity*.92}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  </>;
};
