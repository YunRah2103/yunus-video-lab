import React,{useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {makeFoliageGeometry,makeFoliageTexture} from './vegetation/foliageGeometry';
type Instance={p:[number,number,number];s:[number,number,number];c:string};
function Layer({geometry,material,items}:{geometry:THREE.BufferGeometry;material:THREE.Material;items:Instance[]}){
 const ref=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{if(!ref.current)return;const o=new THREE.Object3D();const c=new THREE.Color();
 items.forEach((a,i)=>{o.position.set(...a.p);o.scale.set(...a.s);o.rotation.set(0,i*2.39996,0);o.updateMatrix();ref.current!.setMatrixAt(i,o.matrix);ref.current!.setColorAt(i,c.set(a.c));});
 ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;ref.current.computeBoundingSphere();
 },[items]);
 return <instancedMesh ref={ref} args={[geometry,material,items.length]} frustumCulled={false} castShadow={false} receiveShadow={false}/>;
}
export function DistantLandscape({seed=2103}:{seed?:number}){
 const data=useMemo(()=>{let n=seed>>>0;const rnd=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 const trunks:Instance[]=[],crowns:Instance[]=[],shrubs:Instance[]=[];
 // Elliptical tree belts enclose every azimuth without entering any camera station.
 // Coordinates are WORLD space; do not apply the rotated track-local transform.
 for(let band=0;band<2;band++)for(let i=0;i<112;i++){
  const a=(i+rnd()*.55)*Math.PI*2/112;
  const radius=band===0?52+rnd()*7:82+rnd()*13;
  const x=-6+Math.cos(a)*radius,z=3+Math.sin(a)*radius;
  const h=(band===0?5:7)+rnd()*3;
  const w=2.1+rnd()*1.6;
  const color=band===0?['#465848','#526449','#5b6950','#3d5143'][i%4]:['#697a6a','#74816c','#627669'][i%3];
  trunks.push({p:[x,h*.27,z],s:[.22,h*.54,.22],c:band===0?'#665b46':'#798071'});
  for(let j=0;j<4;j++)crowns.push({p:[x+(rnd()-.5)*w*.6,h*(.50+j*.10),z+(rnd()-.5)*w*.5],s:[w*(.85-j*.08),h*(.20-j*.015),w*(.80-j*.06)],c:color});
 }
 // Low verge clusters on the formerly empty side, beyond the wide asphalt.
 for(let i=0;i<68;i++){const x=-18-rnd()*5,z=-37+rnd()*79,h=.5+rnd()*.9;shrubs.push({p:[x,h*.55,z],s:[1.2+rnd()*1.3,h,1+rnd()],c:['#5b694b','#68764f','#54634b'][i%3]});}
 return {trunks,crowns,shrubs};},[seed]);
 const crown=useMemo(()=>makeFoliageGeometry(1,seed,64),[seed]);
 const leafTexture=useMemo(makeFoliageTexture,[]);
 const trunk=useMemo(()=>new THREE.CylinderGeometry(1,1.28,1,5),[]);
 const matte=useMemo(()=>new THREE.MeshLambertMaterial({color:'#ffffff',map:leafTexture,alphaTest:.45,side:THREE.DoubleSide}),[leafTexture]);
 const grass=useMemo(()=>{const size=128,a=new Uint8Array(size*size*4);let n=seed>>>0;for(let i=0;i<size*size;i++){n=(Math.imul(n,1664525)+1013904223)>>>0;const v=(n>>>24)/255;a[i*4]=83+v*20;a[i*4+1]=96+v*21;a[i*4+2]=65+v*13;a[i*4+3]=255;}const t=new THREE.DataTexture(a,size,size);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(24,28);t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;return t;},[seed]);
 useEffect(()=>()=>{crown.dispose();trunk.dispose();matte.dispose();grass.dispose();leafTexture.dispose();},[crown,trunk,matte,grass,leafTexture]);
 return <group name="Y002_WORLD_LANDSCAPE">
  <Layer geometry={trunk} material={matte} items={data.trunks}/>
  <Layer geometry={crown} material={matte} items={data.crowns}/>
  <Layer geometry={crown} material={matte} items={data.shrubs}/>
  {/* Grass beyond both asphalt edges and beyond the small road section. */}
  {[[-65,0,0,98,180],[55,0,0,102,180],[-6,0,-70,28,60],[-6,0,69,28,60]].map((v,i)=><mesh key={i} position={[v[0],-.025,v[2]]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[v[3],v[4]]}/><meshLambertMaterial map={grass} color="#c1c5a9"/></mesh>)}
 </group>;
}
