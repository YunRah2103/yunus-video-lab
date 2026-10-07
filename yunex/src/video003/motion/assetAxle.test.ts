import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createRuntimeMotionRig} from './runtimeArticulation';
import {motionStateAt, type WheelId} from './contract';

// Use actual GLB rim normals, not the synthetic X-axis fixture that missed camber.
const bytes=fs.readFileSync('../cars/porsche-911-gt3-rs-992/model.glb');
const jsonLength=bytes.readUInt32LE(12);
const gltf=JSON.parse(bytes.subarray(20,20+jsonLength).toString());
const binaryStart=28+jsonLength;
const nodes:THREE.Object3D[]=gltf.nodes.map((n:any)=>{
  const o=new THREE.Group();o.name=n.name??'';
  if(n.translation)o.position.set(...n.translation as [number,number,number]);
  if(n.rotation)o.quaternion.fromArray(n.rotation);
  if(n.scale)o.scale.set(...n.scale as [number,number,number]);
  return o;
});
gltf.nodes.forEach((n:any,i:number)=>n.children?.forEach((c:number)=>nodes[i].add(nodes[c])));
const container=new THREE.Group();gltf.scenes[gltf.scene].nodes.forEach((n:number)=>container.add(nodes[n]));
const rig=createRuntimeMotionRig(container);
let maximum=0;
for(const id of ['FL','FR','RL','RR'] as WheelId[]){
  const meshNode=gltf.nodes.find((n:any)=>n.name?.startsWith(`Wheel_${id}_`));
  const p=gltf.meshes[meshNode.mesh].primitives[0];
  const a=gltf.accessors[p.attributes.NORMAL];const v=gltf.bufferViews[a.bufferView];
  const values=new Float32Array(bytes.buffer,bytes.byteOffset+binaryStart+(v.byteOffset??0)+(a.byteOffset??0),a.count*3);
  const candidates:THREE.Vector3[]=[];
  for(let i=0;i<values.length;i+=3){
    if(Math.abs(values[i])>.999){const sign=Math.sign(values[i]);candidates.push(new THREE.Vector3(values[i]*sign,values[i+1]*sign,values[i+2]*sign));}
  }
  const median=(k:'x'|'y'|'z')=>candidates.map(n=>n[k]).sort((a,b)=>a-b)[Math.floor(candidates.length/2)];
  const authoredAxis=new THREE.Vector3(median('x'),median('y'),median('z')).normalize();
  const spin=container.getObjectByName(`Spin_${id}`)!;
  const steer=container.getObjectByName(`Steer_${id}`)!;
  for(let sample=0;sample<72;sample++){
    const state=motionStateAt(234,{durationFrames:735});state.wheels[id].spinRad=sample*Math.PI/36;
    rig.apply(state);
    const actual=authoredAxis.clone().transformDirection(spin.matrixWorld);
    const expected=authoredAxis.clone().transformDirection(steer.matrixWorld);
    maximum=Math.max(maximum,actual.angleTo(expected)*180/Math.PI);
  }
}
rig.restore();
console.log(JSON.stringify({maxActualRimAxlePrecessionDeg:maximum}));
assert.ok(maximum<.001,`Actual GLB rim axle precesses ${maximum.toFixed(6)} degrees across a revolution`);
