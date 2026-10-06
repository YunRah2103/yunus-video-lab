import React,{useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {sampleTrackAtLocalZ,trackLocalToWorldXZ} from './racetrack/layout';
import {makeFoliageGeometry,makeFoliageTexture} from './vegetation/foliageGeometry';

type Instance={p:[number,number,number];s:[number,number,number];c:string};

function Layer({
  geometry,
  material,
  items,
}:{
  geometry:THREE.BufferGeometry;
  material:THREE.Material;
  items:Instance[];
}){
  const ref=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const object=new THREE.Object3D();
    const color=new THREE.Color();
    items.forEach((item,index)=>{
      object.position.set(...item.p);
      object.scale.set(...item.s);
      object.rotation.set(0,index*2.39996,0);
      object.updateMatrix();
      ref.current!.setMatrixAt(index,object.matrix);
      ref.current!.setColorAt(index,color.set(item.c));
    });
    ref.current.instanceMatrix.needsUpdate=true;
    if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;
    ref.current.computeBoundingSphere();
  },[items]);
  if(items.length===0)return null;
  return (
    <instancedMesh
      ref={ref}
      args={[geometry,material,items.length]}
      frustumCulled={false}
      castShadow={false}
      receiveShadow={false}
    />
  );
}

const worldFromTrackside=(z:number,side:'left'|'right',extra:number)=>{
  const sample=sampleTrackAtLocalZ(z);
  const anchor=side==='left'?sample.landscapeLeft:sample.landscapeRight;
  const sign=side==='left'?1:-1;
  return trackLocalToWorldXZ([
    anchor[0]+sample.leftNormal[0]*extra*sign,
    sample.z,
  ]);
};

export function DistantLandscape({seed=2103}:{seed?:number}){
  const data=useMemo(()=>{
    let state=seed>>>0;
    const random=()=>{
      state=(Math.imul(state,1664525)+1013904223)>>>0;
      return state/4294967296;
    };
    const trunks:Instance[]=[];
    const crowns:Instance[]=[];
    const shrubs:Instance[]=[];
    const ridges:Instance[]=[];
    const zStations=[-38,-31,-24,-17,-10,-2,7,15,23,31,37];

    (['left','right'] as const).forEach((side,sideIndex)=>{
      zStations.forEach((z,station)=>{
        const count=side==='left'?4:3;
        for(let i=0;i<count;i++){
          const [worldX,worldZ]=worldFromTrackside(z+(random()-.5)*4.2,side,13+random()*20);
          const height=4.2+random()*4.4;
          const width=2+random()*1.9;
          const color=['#425447','#50604d','#5e6a55','#394c41'][(station+i+sideIndex)%4];
          trunks.push({
            p:[worldX,height*.25,worldZ],
            s:[.2+random()*.08,height*.5,.2+random()*.08],
            c:'#625946',
          });
          for(let j=0;j<4;j++){
            crowns.push({
              p:[
                worldX+(random()-.5)*width*.52,
                height*(.48+j*.105),
                worldZ+(random()-.5)*width*.48,
              ],
              s:[
                width*(.82-j*.07),
                height*(.19-j*.014),
                width*(.78-j*.055),
              ],
              c:color,
            });
          }
        }
        const [ridgeX,ridgeZ]=worldFromTrackside(z,side,24+random()*15);
        ridges.push({
          p:[ridgeX,.55+sideIndex*.12,ridgeZ],
          s:[8+random()*8,.9+random()*.55,5+random()*5],
          c:side==='left'?'#7b846d':'#737d69',
        });
      });
    });

    for(let i=0;i<42;i++){
      const side=i%2===0?'left':'right';
      const z=-35+random()*72;
      const [x,worldZ]=worldFromTrackside(z,side,8+random()*7);
      const height=.45+random()*.75;
      shrubs.push({
        p:[x,height*.5,worldZ],
        s:[1+random()*1.25,height,.9+random()*.9],
        c:['#536147','#5f6a4e','#485943'][i%3],
      });
    }
    return {trunks,crowns,shrubs,ridges};
  },[seed]);

  const crown=useMemo(()=>makeFoliageGeometry(1,seed,56),[seed]);
  const leafTexture=useMemo(makeFoliageTexture,[]);
  const trunk=useMemo(()=>new THREE.CylinderGeometry(1,1.2,1,5),[]);
  const ridge=useMemo(()=>new THREE.SphereGeometry(1,12,6),[]);
  const foliageMaterial=useMemo(
    ()=>new THREE.MeshStandardMaterial({
      color:'#ffffff',
      map:leafTexture,
      alphaTest:.5,
      side:THREE.DoubleSide,
      roughness:.95,
      metalness:0,
    }),
    [leafTexture],
  );
  const barkMaterial=useMemo(
    ()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,metalness:0}),
    [],
  );
  const ridgeMaterial=useMemo(
    ()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,metalness:0}),
    [],
  );

  useEffect(
    ()=>()=>{crown.dispose();trunk.dispose();ridge.dispose();foliageMaterial.dispose();barkMaterial.dispose();ridgeMaterial.dispose();leafTexture.dispose();},
    [crown,trunk,ridge,foliageMaterial,barkMaterial,ridgeMaterial,leafTexture],
  );

  return (
    <group name="Y002_WORLD_LANDSCAPE">
      <Layer geometry={ridge} material={ridgeMaterial} items={data.ridges}/>
      <Layer geometry={trunk} material={barkMaterial} items={data.trunks}/>
      <Layer geometry={crown} material={foliageMaterial} items={data.crowns}/>
      <Layer geometry={crown} material={foliageMaterial} items={data.shrubs}/>
    </group>
  );
}
