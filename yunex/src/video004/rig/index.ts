/** Y004 rear-upright adapter: preserve corrected Y003 quaternion wheel-spin rig. */
import * as THREE from 'three';
import type {MotionState,WheelId} from '../../video003/motion/contract';
import {createRuntimeMotionRig,type RuntimeMotionRig} from '../../video003/motion/runtimeArticulation';
import type {Y004DriveFrame} from '../contracts';

const REARS=['RL','RR'] as const;
const WHEELS:WheelId[]=['FL','FR','RL','RR'];
export const Y004_MAX_REAR_STEER_RAD=Math.PI/180; // Illustrative, NOT a Porsche spec.
type Pose={position:THREE.Vector3;quaternion:THREE.Quaternion;scale:THREE.Vector3};
type Caliper={
 id:'RL'|'RR'; node:THREE.Object3D; parent:THREE.Object3D;
 steer:THREE.Object3D; spin:THREE.Object3D; base:Pose;
};
export type Y004RearRigAudit={
 active:boolean;
 rearCalipers:Record<'RL'|'RR',{caliper:string;originalParent:string;currentParent:string;followsSteer:boolean;followsSpin:boolean}>;
 maxWorldMatrixDeltaOnAttach:number;
 measuredWorldPoseDeltaM:number;
 sourceSpinAxesPreserved:true;
 p03RigAudit:RuntimeMotionRig['audit']|null;
};
export type Y004RearSteerRig={
 apply:(sample:Y004DriveFrame|MotionState)=>void;
 /** Idempotent; a subsequent apply reactivates the source rig. */
 restore:()=>void;
 dispose:()=>void;
 readonly audit:Y004RearRigAudit;
};
const snapshot=(o:THREE.Object3D):Pose=>({
 position:o.position.clone(),quaternion:o.quaternion.clone(),scale:o.scale.clone(),
});
const restorePose=(o:THREE.Object3D,p:Pose)=>{
 o.position.copy(p.position);o.quaternion.copy(p.quaternion);o.scale.copy(p.scale);
};
const under=(o:THREE.Object3D,a:THREE.Object3D):boolean=>{
 for(let p:THREE.Object3D|null=o.parent;p;p=p.parent)if(p===a)return true;
 return false;
};
const matrixDelta=(a:THREE.Matrix4,b:THREE.Matrix4)=>
 Math.max(...a.elements.map((n,i)=>Math.abs(n-b.elements[i])));

const motionOf=(sample:Y004DriveFrame|MotionState):MotionState=>{
 const state='motion' in sample?sample.motion:sample;
 if(!state||!Number.isFinite(state.frame))throw Error('Y004 B: invalid motion frame');
 for(const id of WHEELS){
  const w=state.wheels[id];
  if(!w||![w.steerRad,w.spinRad,w.uprightOffsetY].every(Number.isFinite)){
   throw Error('Y004 B: invalid wheel state '+id);
  }
  if('motion' in sample&&(!Number.isFinite(sample.steerRad[id])||
      Math.abs(sample.steerRad[id]-w.steerRad)>1e-9)){
   throw Error('Y004 B: shared steer contract mismatch '+id);
  }
 }
 for(const id of REARS){
  if(Math.abs(state.wheels[id].steerRad)>Y004_MAX_REAR_STEER_RAD+1e-10){
   throw Error('Y004 B: '+id+' exceeds illustrative 1 degree cap');
  }
 }
 const l=state.wheels.RL.steerRad,r=state.wheels.RR.steerRad;
 if(Math.abs(l)>1e-7&&Math.abs(r)>1e-7&&Math.sign(l)!==Math.sign(r)){
  throw Error('Y004 B: contradictory rear toe / rear wheels not coherent');
 }
 return state;
};

/**
 * Wraps P03, never replaces the axle axes. Attach the rear calipers directly
 * to real GLB Steer_RL/RR before P03 captures its baseline; NEVER under Spin.
 * Original caliper parents/poses are restored without changing GLB bytes.
 */
export const createY004RearSteerRig=(model:THREE.Object3D):Y004RearSteerRig=>{
 const root=model.getObjectByName('YUNEX_Porsche_911_GT3_RS_992')??model;
 const calipers=REARS.map((id):Caliper=>{
  const steer=root.getObjectByName('Steer_'+id);
  const spin=root.getObjectByName('Spin_'+id);
  const node=root.getObjectByName('Caliper_'+id);
  if(!steer||!spin||!node||!node.parent){
   throw Error('Y004 B: missing GLB rear caliper/steer/spin '+id);
  }
  if(!under(spin,steer)||under(steer,node)||steer===node){
   throw Error('Y004 B: invalid rear upright hierarchy '+id);
  }
  return {id,node,parent:node.parent,steer,spin,base:snapshot(node)};
 });
 // Snapshot mesh material REFERENCES; B must not edit the accepted GLB look.
 const materialSnapshots:Array<{mesh:THREE.Mesh;material:THREE.Material|THREE.Material[]}>= [];
 for(const caliper of calipers){
  caliper.node.traverse(object=>{
   if(object instanceof THREE.Mesh){
    materialSnapshots.push({mesh:object,material:object.material});
   }
  });
 }
 let runtime:RuntimeMotionRig|null=null;
 let disposed=false,maxWorldMatrixDeltaOnAttach=0,measuredWorldPoseDeltaM=0;

 const restoreCalipers=()=>{
  for(const c of calipers){
   if(c.node.parent!==c.parent)c.parent.add(c.node);
   restorePose(c.node,c.base);
  }
  for(const saved of materialSnapshots)saved.mesh.material=saved.material;
  model.updateMatrixWorld(true);
 };
 const deactivate=()=>{
  if(runtime){runtime.restore();runtime=null;}
  restoreCalipers();
 };
 const activate=()=>{
  if(runtime)return;
  if(disposed)throw Error('Y004 B: disposed rig');
  model.updateMatrixWorld(true);
  try{
   for(const c of calipers){
    const before=c.node.matrixWorld.clone();
    const oldPosition=new THREE.Vector3().setFromMatrixPosition(before);
    if(c.node.parent!==c.steer)c.steer.attach(c.node);
    c.node.updateMatrixWorld(true);
    maxWorldMatrixDeltaOnAttach=Math.max(
      maxWorldMatrixDeltaOnAttach,matrixDelta(before,c.node.matrixWorld));
    measuredWorldPoseDeltaM=Math.max(
      measuredWorldPoseDeltaM,
      oldPosition.distanceTo(new THREE.Vector3().setFromMatrixPosition(c.node.matrixWorld)));
   }
   if(maxWorldMatrixDeltaOnAttach>1e-5){
    throw Error('Y004 B: world pose lost on caliper attach '+maxWorldMatrixDeltaOnAttach);
   }
   runtime=createRuntimeMotionRig(model,{rotationComposition:'quaternion'});
   for(const c of calipers){
    if(c.node.parent!==c.steer||under(c.node,c.spin)){
     throw Error('Y004 B: rear caliper moved under wheel spin '+c.id);
    }
   }
  }catch(e){deactivate();throw e;}
 };
 const apply=(sample:Y004DriveFrame|MotionState)=>{
  if(disposed)throw Error('Y004 B: disposed rig');
  const state=motionOf(sample);
  activate();
  runtime!.apply(state);
 };
 const restore=()=>{if(!disposed)deactivate();};
 const dispose=()=>{if(disposed)return;deactivate();disposed=true;};
 return {apply,restore,dispose,
  get audit():Y004RearRigAudit{
   const rearCalipers={} as Y004RearRigAudit['rearCalipers'];
   for(const c of calipers)rearCalipers[c.id]={
    caliper:c.node.name,originalParent:c.parent.name||'(unnamed)',
    currentParent:c.node.parent?.name||'(detached)',
    followsSteer:c.node.parent===c.steer,
    followsSpin:c.node.parent===c.spin||under(c.node,c.spin),
   };
   return {active:runtime!==null,rearCalipers,
    maxWorldMatrixDeltaOnAttach,measuredWorldPoseDeltaM,
    sourceSpinAxesPreserved:true,p03RigAudit:runtime?.audit??null};
  },
 };
};
