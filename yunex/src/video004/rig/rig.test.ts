/** Run from yunex/: npx --yes tsx src/video004/rig/rig.test.ts
 * Native asset test uses locked Porsche GLB, not a generic wheel fixture.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {SOURCE_WHEEL_CENTRES,motionStateAt,type WheelId,type MotionState}
 from '../../video003/motion/contract';
import {createY004RearSteerRig,Y004_MAX_REAR_STEER_RAD} from './index';
import type {Y004DriveFrame} from '../contracts';

const WHEELS:WheelId[]=['FL','FR','RL','RR'];
const difference=(a:THREE.Matrix4,b:THREE.Matrix4)=>
 Math.max(...a.elements.map((v,i)=>Math.abs(v-b.elements[i])));
const deg=(rad:number)=>rad*180/Math.PI;
const motion=(rearRad:number,frame=234):MotionState=>{
 const s=motionStateAt(frame,{fps:30,durationFrames:735});
 s.wheels.FL.steerRad=.04;s.wheels.FR.steerRad=.041;
 s.wheels.RL.steerRad=rearRad;s.wheels.RR.steerRad=rearRad;
 return s;
};
const drive=(s:MotionState):Y004DriveFrame=>({
 frame:s.frame,timeS:s.timeS,segmentId:'rear-macro',regime:'low',motion:s,
 steerRad:{FL:s.wheels.FL.steerRad,FR:s.wheels.FR.steerRad,
  RL:s.wheels.RL.steerRad,RR:s.wheels.RR.steerRad},
});
const makeFixture=()=>{
 const root=new THREE.Group();root.name='YUNEX_Porsche_911_GT3_RS_992';
 for(const id of WHEELS){
  const steer=new THREE.Group();steer.name='Steer_'+id;
  steer.position.set(...SOURCE_WHEEL_CENTRES[id]);
  const spin=new THREE.Group();spin.name='Spin_'+id;
  steer.add(spin);root.add(steer);
  const caliper=new THREE.Group();caliper.name='Caliper_'+id;
  caliper.position.set(id[1]==='L'?.17:-.17,.08,-.12);
  if(id[0]==='F')steer.add(caliper);
  else{caliper.position.add(steer.position);root.add(caliper);}
 }
 for(const name of ['Body','Glass','Lights','Grilles','Interior','Wing','Wing_Flap']){
  const part=new THREE.Group();part.name=name;root.add(part);
 }
 return root;
};
const fixture=makeFixture();
const original=['RL','RR'].map(id=>{
 const object=fixture.getObjectByName('Caliper_'+id)!;
 fixture.updateMatrixWorld(true);
 return {object,parent:object.parent,position:object.position.clone(),
  quaternion:object.quaternion.clone(),scale:object.scale.clone(),
  matrix:object.matrixWorld.clone()};
});
const rig=createY004RearSteerRig(fixture);
let maxHubDriftM=0,maxRepeatMatrixDelta=0,maxCaliperLocalDeltaM=0;
const frames=[0,1,15,30,45,60,89,120,171,234,361];
const capture=(frame:number)=>{
 const s=motion(.8*Y004_MAX_REAR_STEER_RAD,frame);
 rig.apply(drive(s));
 const result:THREE.Matrix4[]=[];
 for(const id of WHEELS){
  const hub=fixture.getObjectByName('Spin_'+id)!;
  const actual=hub.getWorldPosition(new THREE.Vector3());
  const expected=new THREE.Vector3(...s.wheels[id].centreWorld);
  maxHubDriftM=Math.max(maxHubDriftM,actual.distanceTo(expected));
  result.push(hub.matrixWorld.clone());
  if(id[0]==='R'){
   const steer=fixture.getObjectByName('Steer_'+id)!;
   const caliper=fixture.getObjectByName('Caliper_'+id)!;
   assert.equal(caliper.parent,steer);
   const expectedOffset=new THREE.Vector3(id[1]==='L'?.17:-.17,.08,-.12);
   maxCaliperLocalDeltaM=Math.max(
    maxCaliperLocalDeltaM,caliper.position.distanceTo(expectedOffset));
  }
 }
 return result;
};
const captures=new Map<number,THREE.Matrix4[]>();
for(const f of frames)captures.set(f,capture(f));
for(const f of [...frames].reverse()){
 const next=capture(f);
 next.forEach((m,i)=>maxRepeatMatrixDelta=Math.max(
  maxRepeatMatrixDelta,difference(m,captures.get(f)![i])));
}
assert(maxHubDriftM<1e-6,'fixture hub drift');
assert(maxRepeatMatrixDelta<1e-9,'out-of-order transform drift');
assert(maxCaliperLocalDeltaM<1e-6,'caliper became detached from upright');
assert.equal(rig.audit.rearCalipers.RL.followsSpin,false);
assert.equal(rig.audit.rearCalipers.RR.followsSpin,false);
assert(rig.audit.maxWorldMatrixDeltaOnAttach<1e-5);
assert.throws(()=>rig.apply(motion(1.01*Y004_MAX_REAR_STEER_RAD)),/illustrative/);
const mismatch=drive(motion(0));
assert.throws(()=>rig.apply({...mismatch,steerRad:{...mismatch.steerRad,RL:.01}}),/mismatch/);
const opposite=motion(.5*Y004_MAX_REAR_STEER_RAD);
opposite.wheels.RR.steerRad*=-1;
assert.throws(()=>rig.apply(opposite),/contradictory/);
rig.restore();rig.restore();
for(const v of original){
 assert.equal(v.object.parent,v.parent);
 assert(v.object.position.distanceTo(v.position)<1e-9);
 assert(v.object.quaternion.angleTo(v.quaternion)<1e-7);
 assert(v.object.scale.distanceTo(v.scale)<1e-9);
 assert(difference(v.object.matrixWorld,v.matrix)<1e-8);
}
const first=capture(234);rig.restore();const second=capture(234);
second.forEach((m,i)=>assert(difference(m,first[i])<1e-8));
rig.dispose();
assert.throws(()=>rig.apply(motion(0)),/disposed/);
console.log(JSON.stringify({fixture:'PASS',sampleFrames:frames.length,
 maxHubDriftM,maxRepeatMatrixDelta,maxCaliperLocalDeltaM}));

const bytes=fs.readFileSync('../cars/porsche-911-gt3-rs-992/model.glb');
const jsonLength=bytes.readUInt32LE(12);
const gltf=JSON.parse(bytes.subarray(20,20+jsonLength).toString());
const binaryStart=28+jsonLength;
const nodes:THREE.Object3D[]=gltf.nodes.map((n:any)=>{
 const o=new THREE.Group();o.name=n.name??'';
 if(n.translation)o.position.set(...n.translation);
 if(n.rotation)o.quaternion.fromArray(n.rotation);
 if(n.scale)o.scale.set(...n.scale);
 return o;
});
gltf.nodes.forEach((n:any,i:number)=>n.children?.forEach((c:number)=>nodes[i].add(nodes[c])));
const model=new THREE.Group();
gltf.scenes[gltf.scene].nodes.forEach((n:number)=>model.add(nodes[n]));
const originals=['RL','RR'].map(id=>{
 const object=model.getObjectByName('Caliper_'+id)!;
 assert(object);
 return {object,parent:object.parent,position:object.position.clone(),
  quaternion:object.quaternion.clone(),scale:object.scale.clone()};
});
const normals={} as Record<WheelId,THREE.Vector3>;
for(const id of WHEELS){
 const meshNode=gltf.nodes.find((n:any)=>n.name?.startsWith('Wheel_'+id+'_'));
 assert(meshNode?.mesh!==undefined,'GLB rim missing '+id);
 const prim=gltf.meshes[meshNode.mesh].primitives[0];
 const access=gltf.accessors[prim.attributes.NORMAL],view=gltf.bufferViews[access.bufferView];
 assert.equal(access.componentType,5126);
 const arr=new Float32Array(bytes.buffer,bytes.byteOffset+binaryStart+
  (view.byteOffset??0)+(access.byteOffset??0),access.count*3);
 const candidates:THREE.Vector3[]=[];
 for(let i=0;i<arr.length;i+=3)if(Math.abs(arr[i])>.999){
  const sign=Math.sign(arr[i]);
  candidates.push(new THREE.Vector3(arr[i]*sign,arr[i+1]*sign,arr[i+2]*sign));
 }
 assert(candidates.length>0,'GLB rim normal sampling failed '+id);
 const med=(key:'x'|'y'|'z')=>candidates.map(n=>n[key])
  .sort((a,b)=>a-b)[Math.floor(candidates.length/2)];
 normals[id]=new THREE.Vector3(med('x'),med('y'),med('z')).normalize();
}
const actualRig=createY004RearSteerRig(model);
let maxPrecessionDeg=0,maxHubOffsetM=0,maxCaliperSpinDeg=0,maxTyreContactErrorM=0;
for(const steer of [-Y004_MAX_REAR_STEER_RAD,0,Y004_MAX_REAR_STEER_RAD]){
 for(let turn=0;turn<72;turn++){
  const s=motion(steer);
  for(const id of WHEELS)s.wheels[id].spinRad=turn*Math.PI/36;
  actualRig.apply(s);
  for(const id of WHEELS){
   const spin=model.getObjectByName('Spin_'+id)!;
   const pivot=model.getObjectByName('Steer_'+id)!;
   maxPrecessionDeg=Math.max(maxPrecessionDeg,deg(normals[id].clone()
    .transformDirection(spin.matrixWorld).angleTo(normals[id].clone()
    .transformDirection(pivot.matrixWorld))));
   maxHubOffsetM=Math.max(maxHubOffsetM,spin.getWorldPosition(new THREE.Vector3())
    .distanceTo(pivot.getWorldPosition(new THREE.Vector3())));
   if(id[0]==='R'){
    const caliper=model.getObjectByName('Caliper_'+id)!;
    assert.equal(caliper.parent,pivot);
    const relative=pivot.getWorldQuaternion(new THREE.Quaternion()).invert()
     .multiply(caliper.getWorldQuaternion(new THREE.Quaternion()));
    maxCaliperSpinDeg=Math.max(maxCaliperSpinDeg,deg(relative.angleTo(caliper.quaternion)));
   }
   // Same world-space contact contract as corrected P03; rear yaw is vertical.
   const bottom=s.wheels[id].centreWorld[1]+s.wheels[id].uprightOffsetY-s.wheels[id].tyreRadiusM;
   maxTyreContactErrorM=Math.max(maxTyreContactErrorM,Math.abs(bottom-(-.0384)));
  }
 }
}
assert(maxPrecessionDeg<.001,'actual-GLB rim plane precession');
assert(maxHubOffsetM<1e-5,'real hub not concentric with upright');
assert(maxCaliperSpinDeg<.001,'real caliper is wheel spinning');
assert(maxTyreContactErrorM<.002,'tyre/road world contact regression');
assert(actualRig.audit.maxWorldMatrixDeltaOnAttach<1e-5);
actualRig.restore();
for(const original of originals){
 assert.equal(original.object.parent,original.parent);
 assert(original.object.position.distanceTo(original.position)<1e-8);
 assert(original.object.quaternion.angleTo(original.quaternion)<1e-7);
 assert(original.object.scale.distanceTo(original.scale)<1e-8);
}
console.log(JSON.stringify({actualGlb:'PASS',testedWheelRevolutions:3*72,
 wheels:4,maxPrecessionDeg,maxHubOffsetM,maxCaliperSpinDeg,maxTyreContactErrorM,
 attachMatrixDelta:actualRig.audit.maxWorldMatrixDeltaOnAttach}));
console.log('Y004 Agent B mechanical regression: PASS');
