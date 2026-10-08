import {motionStateAt, type WheelId} from '../../video003/motion/contract';
import type {Y004DriveFrame, Y004Regime, Y004SegmentId} from '../contracts';
import {resolveY004CameraPose, auditY004CameraPose,
  projectY004WorldToPortrait, Y004_EXIT_EDITORIAL_CUT_PROGRESS} from './index';
import {resolveY004Guides, auditY004GuideGeometry} from '../guides';

const IDS: WheelId[] = ['FL','FR','RL','RR'];
const SEGMENTS: Y004SegmentId[] = [
  'low-hook','rear-macro','low-explain','high-explain','high-drive','trackside-exit',
];
const PROGRESS = [0, .25, .5, .75, 1];
const epsilon = 1e-8;
const assert = (condition: boolean, message: string): void => {
  if (!condition) throw new Error('Y004 Agent C camera/guides fixture: ' + message);
};
const vecDifference = (a: number[],b: number[]) =>
  Math.hypot(...a.map((v,i)=>v-b[i]));
/** Typed P03 source fixture. The front/rear yaw inputs here are deliberately
 * illustrative and NOT measured Porsche steering calibration. */
export const makeY004CameraFixture = (
  segmentId: Y004SegmentId, regime: Y004Regime, frame = 234,
): Y004DriveFrame => {
  const motion = motionStateAt(frame,{fps:30,durationFrames:735});
  const sign = regime === 'low' ? -1 : 1;
  const steerRad: Record<WheelId,number> = {
    FL: .042, FR: .042, RL: sign*.014, RR: sign*.014,
  };
  const wheels = {...motion.wheels};
  for (const id of IDS) wheels[id] = {...motion.wheels[id],steerRad:steerRad[id]};
  return {frame,timeS:frame/30,segmentId,regime,
    motion:{...motion,wheels},steerRad};
};
const key=(state:Y004DriveFrame,p:number)=>JSON.stringify({
  camera:resolveY004CameraPose(state,p),
  guides:resolveY004Guides(state,resolveY004CameraPose(state,p)),
});
/** Run after npm ci:
 * npx esbuild src/video004/camera/testEntry.ts --bundle --platform=node
 *   --format=cjs --outfile=/tmp/y004-c-tests.cjs && node /tmp/y004-c-tests.cjs
 */
export const runY004AgentCFixtureChecks = () => {
  let poses = 0, guideGroups = 0, visibleGroups = 0;
  for(const segmentId of SEGMENTS){
    const regime:Y004Regime = segmentId==='low-hook' ||
      segmentId==='rear-macro' || segmentId==='low-explain' ? 'low' :
      segmentId==='trackside-exit' ? 'hero' : 'high';
    for(const progress of PROGRESS){
      const state=makeY004CameraFixture(segmentId,regime);
      const pose=resolveY004CameraPose(state,progress);
      const report=auditY004CameraPose(pose);
      assert(report.ok,`${segmentId} @${progress} camera: ${report.issues.join(';')}`);
      const guides=resolveY004Guides(state,pose);
      const guideReport=auditY004GuideGeometry(state,guides);
      assert(guideReport.ok,`${segmentId} @${progress} guides: ${guideReport.issues.join(';')}`);
      assert(guides.length<=2,'max two cue groups');
      assert(guides.every(g=>g.id.includes(segmentId)),'correct segment');
      if(segmentId==='low-explain'||segmentId==='high-explain'){
        assert(guides.length===2 && guides.every(g=>g.visible),
          `${segmentId} @${progress} MUST visibly show both axles`);
      }
      if(segmentId==='rear-macro'||segmentId==='low-hook'){
        assert(guides.length===1 && guides[0].wheel.startsWith('R') &&
          guides[0].visible,`${segmentId} rear guide must be visible`);
      }
      if(segmentId==='high-drive'||segmentId==='trackside-exit'){
        assert(guides.length===0, `${segmentId} must be graphic-free`);
      }
      for(const guide of guides){
        const projection=projectY004WorldToPortrait(guide.anchorWorld,pose);
        if(guide.visible) assert(projection.inFront && Math.abs(projection.x)<.98 &&
          Math.abs(projection.y)<.98,'visible guide is inside film');
      }
      poses++; guideGroups+=guides.length;
      visibleGroups+=guides.filter(g=>g.visible).length;
    }
  }
  for(const progress of PROGRESS){
    // Same source pose, separate narrative regimes: exact optical match.
    const low=makeY004CameraFixture('low-explain','low');
    const high=makeY004CameraFixture('high-explain','high');
    const c0=resolveY004CameraPose(low,progress);
    const c1=resolveY004CameraPose(high,progress);
    assert(vecDifference(c0.position,c1.position)<epsilon,'matched low/high position');
    assert(vecDifference(c0.target,c1.target)<epsilon,'matched low/high target');
    assert(c0.focalLengthMm===c1.focalLengthMm,'matched low/high focal length');
    const l=resolveY004Guides(low,c0);
    const h=resolveY004Guides(high,c1);
    assert(l[1].wheel===h[1].wheel && l[1].visible && h[1].visible,'same rear axle');
    assert(low.steerRad.RL*high.steerRad.RL<0,'low/high rear yaw reverses sign');
  }
  const outside0=makeY004CameraFixture('trackside-exit','hero',568);
  const outside1=makeY004CameraFixture('trackside-exit','hero',604);
  const fixed0=resolveY004CameraPose(outside0,.20);
  const fixed1=resolveY004CameraPose(outside1,.20);
  assert(fixed0.fixedWorld&&fixed1.fixedWorld,'trackside camera must be world fixed');
  assert(vecDifference(fixed0.position,fixed1.position)<epsilon,'trackside camera physically stationary');
  assert(vecDifference(fixed0.target,fixed1.target)>0.01,'car moves through trackside frame');
  const chase=resolveY004CameraPose(outside1,Y004_EXIT_EDITORIAL_CUT_PROGRESS+.05);
  assert(!chase.fixedWorld,'explicit exit match cut to moving rear chase');
  for(const segmentId of SEGMENTS){
    const s=makeY004CameraFixture(segmentId,'low');
    assert(key(s,.77)===key(s,.77),'out-of-order deterministic sampling');
    assert(key(s,.2)===key(s,.2),'frame repeat deterministic');
  }
  const mismatch=makeY004CameraFixture('low-explain','low');
  const camera=resolveY004CameraPose(mismatch,.5);
  const altered={...mismatch,steerRad:{...mismatch.steerRad,RL:.13}};
  assert(resolveY004Guides(altered,camera).some(g=>!g.visible),
    'incoherent camera/A steering state must suppress guide');
  let threw=false;
  try{resolveY004CameraPose(mismatch,Number.NaN);}catch{threw=true;}
  assert(threw,'non-finite progress must throw');
  return {ok:true,poses,guideGroups,visibleGroups,matchedModeSamples:5,
    independentTracksideSamples:2,signedAngleAudit:true,
    testKind:'typed fixture with P03 motion state; NOT native moving visual QA'};
};
