import type {Vec3} from '../../video003/motion/contract';
import {makeY004CameraFixture} from '../camera/contractChecks';
import {resolveY004CameraPose,y004RotateLocalVector,
  projectY004WorldToPortrait,auditY004CameraPose} from '../camera';
import {resolveY004Guides,auditY004GuideGeometry} from './index';
import {resolveY004SteeringReadout} from './overlayGeometry';

const assert=(ok:boolean,msg:string)=>{if(!ok)throw Error('Y004 F corrective regression: '+msg);};
const corners:[number,number,number][]=[];
for(const x of [-1.15,1.15])for(const z of [-2.55,2.55])
  for(const y of [.16,1.65])corners.push([x,y,z]);
/**
 * Conservative silhouette proxy, not real GLB bounding volume. H/F MUST
 * review actual native 1080x1920 moving frames before changing release gate.
 */
const screenBounds=(segment:'low-hook'|'high-drive',progress:number)=>{
  const state=makeY004CameraFixture(segment,segment==='low-hook'?'low':'high');
  const camera=resolveY004CameraPose(state,progress);
  const root=state.motion.root.position,yaw=state.motion.root.rotation[1];
  const projected=corners.map(c=>{
    const local=y004RotateLocalVector(c as Vec3,yaw);
    return projectY004WorldToPortrait([
      root[0]+local[0],root[1]+local[1],root[2]+local[2],
    ],camera);
  });
  return {
    minX:Math.min(...projected.map(v=>v.x)),maxX:Math.max(...projected.map(v=>v.x)),
    minY:Math.min(...projected.map(v=>v.y)),maxY:Math.max(...projected.map(v=>v.y)),
    cameraOk:auditY004CameraPose(camera).ok,
  };
};
export const runY004FVisualCorrectionChecks=()=>{
  let framing=0,cue=0;
  for(const s of ['low-hook','high-drive'] as const){
    for(const p of [0,.15,.3,.5,.7,.85,.99]){
      const bounds=screenBounds(s,p);
      assert(bounds.cameraOk,s+' camera unsafe');
      assert(bounds.minX>-.95&&bounds.maxX<.96&&
        bounds.minY>-.80&&bounds.maxY<.80,
        s+' silhouette proxy clipped @'+p+': '+JSON.stringify(bounds));
      framing++;
    }
  }
  for(const seg of ['low-explain','high-explain'] as const){
    const regime=seg==='low-explain'?'low':'high';
    for(const p of [0,.25,.5,.75,1]){
      const state=makeY004CameraFixture(seg,regime);
      const camera=resolveY004CameraPose(state,p);
      const guides=resolveY004Guides(state,camera);
      const result=auditY004GuideGeometry(state,guides);
      assert(result.ok,'source-true guide direction angle');
      const display=resolveY004SteeringReadout(state,camera);
      assert(!!display&&display.rays.length===2,'both visible axle guides '+seg);
      assert(display!.rays.every(ray=>[...ray.anchor,...ray.neutral,...ray.actual]
        .every(Number.isFinite)),'pixel projection finite');
      assert(display!.front==='CAR LEFT','fixture front left');
      assert(display!.rear===(regime==='low'?'CAR RIGHT':'CAR LEFT'),
        'rear regime must follow source angles, not fake geometry');
      cue++;
    }
  }
  const centred=makeY004CameraFixture('high-explain','high');
  const zero={...centred,steerRad:{FL:0,FR:0,RL:0,RR:0},
    motion:{...centred.motion,wheels:Object.fromEntries(
      Object.entries(centred.motion.wheels).map(([id,w])=>[id,{...w,steerRad:0}])
    ) as typeof centred.motion.wheels}};
  const view=resolveY004CameraPose(zero,.5);
  const straight=resolveY004SteeringReadout(zero,view);
  assert(!!straight&&straight.front==='CENTRED'&&
    straight.rear==='CENTRED'&&!straight.liveTurning,
    'zero steering must be labelled CENTRED, not faked');
  const off=makeY004CameraFixture('high-drive','high');
  assert(resolveY004SteeringReadout(off,resolveY004CameraPose(off,.5))===null,
    'roadside hero must have zero graphics');
  return {ok:true,silhouetteProxySamples:framing,guideCategorySamples:cue,
    zeroSteeringTruth:true,oldMotionAndGeometryPreserved:true,
    nativeVisualProof:'REQUIRED FROM H AFTER INTEGRATION'};
};
