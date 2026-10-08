import type {Vec3} from '../../video003/motion/contract';
import type {Y004CameraPose,Y004DriveFrame} from '../contracts';
import {projectY004WorldToPortrait} from '../camera';
import {resolveY004Guides,auditY004GuideGeometry} from './index';

/**
 * C-only categorical readout. Words state turning SIDE, never an artificially
 * enlarged wheel yaw. The projected two rays are the actual source angles.
 * With zero live steering, explicitly show CENTRED rather than pretend that
 * the car is steering during a straight section of the high-speed pass.
 */
export type Y004SteerSide = 'CAR LEFT'|'CAR RIGHT'|'CENTRED';
export type Y004OverlayRay = Readonly<{
  id:string;
  wheel:string;
  ax:'front'|'rear';
  anchor:[number,number];
  neutral:[number,number];
  actual:[number,number];
}>;
export type Y004OverlayReadout = Readonly<{
  relation: 'OPPOSING RESPONSE'|'ALIGNED RESPONSE';
  front:Y004SteerSide;
  rear:Y004SteerSide;
  liveTurning:boolean;
  rays:readonly Y004OverlayRay[];
}>;
const EPSILON=0.0001;
export const y004SteerSide=(angleRad:number):Y004SteerSide=>
  angleRad>EPSILON?'CAR LEFT':angleRad<-EPSILON?'CAR RIGHT':'CENTRED';
const toPixel=(world:Vec3,camera:Y004CameraPose):[number,number]=>{
  const p=projectY004WorldToPortrait(world,camera);
  return [540*(1+p.x),960*(1-p.y)];
};
export const resolveY004SteeringReadout=(
  state:Y004DriveFrame,camera:Y004CameraPose,
):Y004OverlayReadout|null=>{
  if(state.segmentId!=='low-explain'&&state.segmentId!=='high-explain')return null;
  if(camera.segmentId!==state.segmentId)throw Error('Y004 C overlay camera/shot mismatch');
  const guides=resolveY004Guides(state,camera);
  const audit=auditY004GuideGeometry(state,guides);
  if(!audit.ok)throw Error('Y004 C overlay invalid source wheel yaw: '+audit.issues.join(','));
  const front=guides.find(g=>g.wheel.startsWith('F'));
  const rear=guides.find(g=>g.wheel.startsWith('R'));
  if(!front||!rear)throw Error('Y004 C overlay requires exactly front and rear axes');
  const rays=guides.filter(g=>g.visible).map(g=>({
    id:g.id,wheel:g.wheel,
    ax:(g.wheel.startsWith('F')?'front':'rear') as 'front'|'rear',
    anchor:toPixel(g.anchorWorld,camera),
    neutral:toPixel(g.neutralEndWorld,camera),
    actual:toPixel(g.steeredEndWorld,camera),
  }));
  const frontDir=y004SteerSide(state.steerRad[front.wheel]);
  const rearDir=y004SteerSide(state.steerRad[rear.wheel]);
  return {
    relation:state.regime==='low'?'OPPOSING RESPONSE':'ALIGNED RESPONSE',
    front:frontDir,rear:rearDir,
    liveTurning:frontDir!=='CENTRED'&&rearDir!=='CENTRED',
    rays,
  };
};
