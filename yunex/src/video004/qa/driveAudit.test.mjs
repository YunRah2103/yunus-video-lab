import test from 'node:test';
import assert from 'node:assert/strict';
import {auditDriveFrames, auditDeterministicSampler, auditWheelGuides} from './driveAudit.mjs';

const sample = (frame, regime='low') => {
  const s={FL:.035, FR:.034, RL:regime==='high'?.009:-.009, RR:regime==='high'?.009:-.009};
  const wheels={};
  for(const id of ['FL','FR','RL','RR']){
    const radius=id[0]==='F'?.35:.37;
    const distance=2+frame*.25;
    wheels[id]={id,steerRad:s[id],tyreRadiusM:radius,pathDistanceM:distance,spinRad:distance/radius,centreWorld:[id[1]==='L'?.8:-.8,radius,frame*.25],uprightOffsetY:0};
  }
  return {frame,timeS:frame/30,regime,segmentId:regime==='high'?'high-explain':'low-explain',steerRad:s,
    motion:{frame,speedMps:7.5,accelerationMps2:0,curvaturePerM:.015,steeringCurvaturePerM:.018,distanceM:2+frame*.25,
      root:{position:[0,0,frame*.25],rotation:[0,0,0],trackLocalZ:frame*.25},wheels}};
};
const options={asphaltWorldY:0,requireLowHigh:true};
const correct=()=>[sample(0,'low'),sample(1,'low'),sample(2,'high')];
const codes = result=>result.failures.map(f=>f.code);

test('correct opposite/aligned steering and actual spin path PASS',()=>{
 const r=auditDriveFrames(correct(),options);
 assert.equal(r.pass,true,JSON.stringify(r.failures));
 assert.equal(r.observations.lowActive,2);
 assert.equal(r.observations.highActive,1);
});
test('no real samples cannot PASS',()=>{
 assert.ok(codes(auditDriveFrames([],options)).includes('NO_SAMPLES'));
});
test('low rear aligned steering fails',()=>{
 const frames=correct(); frames[0].steerRad.RL=.009;frames[0].steerRad.RR=.009;
 frames[0].motion.wheels.RL.steerRad=.009;frames[0].motion.wheels.RR.steerRad=.009;
 assert.ok(codes(auditDriveFrames(frames,options)).includes('LOW_DIRECTION'));
});
test('high rear countersteer fails',()=>{
 const frames=correct(); frames[2]=sample(2,'low');frames[2].regime='high';frames[2].segmentId='high-explain';
 assert.ok(codes(auditDriveFrames(frames,options)).includes('HIGH_DIRECTION'));
});
test('exaggerated rear yaw exceeds cap',()=>{
 const frames=correct();frames[1].steerRad.RL=-.025;frames[1].motion.wheels.RL.steerRad=-.025;
 assert.ok(codes(auditDriveFrames(frames,options)).includes('REAR_CAP'));
});
test('rear wheels must not oppose as artificial toe',()=>{
 const frames=correct();frames[1].steerRad.RR=.009;frames[1].motion.wheels.RR.steerRad=.009;
 assert.ok(codes(auditDriveFrames(frames,options)).includes('REAR_TOE'));
});
test('public steering must equal actual wheel steering',()=>{
 const frames=correct();frames[0].motion.wheels.RL.steerRad=.023;
 assert.ok(codes(auditDriveFrames(frames,options)).includes('STEER_MISMATCH'));
});
test('wheel spin must correlate with per-wheel travel',()=>{
 const frames=correct();frames[0].motion.wheels.RL.spinRad=0;
 assert.ok(codes(auditDriveFrames(frames,options)).includes('SPIN_DISTANCE'));
});
test('tyres must contact true asphalt',()=>{
 const frames=correct();frames[0].motion.wheels.FR.centreWorld[1]+=.03;
 assert.ok(codes(auditDriveFrames(frames,options)).includes('TYRE_CONTACT'));
});
test('world driving and road domain cannot be frozen or clamped',()=>{
 const frames=Array.from({length:35},(_,i)=>sample(i,'low'));
 for(const f of frames){f.motion.root.position[2]=0;f.motion.distanceM=0;}
 assert.ok(codes(auditDriveFrames(frames,{asphaltWorldY:0})).includes('STATIC_CAR'));
 frames[2].motion.root.trackLocalZ=999;
 assert.ok(codes(auditDriveFrames(frames,{trackZMin:-100,trackZMax:100})).includes('TRACK_DOMAIN'));
});
test('duplicate and incomplete frame coverage fail',()=>{
 const f=[sample(0),sample(0),sample(2,'high')];
 const r=auditDriveFrames(f,{...options,expectedFrames:3});
 assert.ok(codes(r).includes('DUPLICATE_FRAME'));
 assert.ok(codes(r).includes('FRAME_COVERAGE'));
});
test('out-of-order sampler must return exact same frame state',()=>{
 assert.equal(auditDeterministicSampler(i=>sample(i)).pass,true);
 let t=0;
 const r=auditDeterministicSampler(i=>({...sample(i),n:++t}),[2,6,2]);
 assert.ok(codes(r).includes('ORDER_DEPENDENCE'));
});
test('actual wheel-anchored cues may extend but not fake yaw',()=>{
 const state=sample(5);
 const w=state.motion.wheels.RL;
 const anchor=[...w.centreWorld];const L=1.4;const a=state.steerRad.RL;
 const guides=[{wheel:'RL',visible:true,anchorWorld:anchor,neutralEndWorld:[anchor[0],anchor[1],anchor[2]+L],steeredEndWorld:[anchor[0]+L*Math.sin(a),anchor[1],anchor[2]+L*Math.cos(a)]}];
 assert.equal(auditWheelGuides([{state,guides}],{requireVisible:true}).pass,true);
 guides[0].steeredEndWorld=[anchor[0]+L*Math.sin(a*6),anchor[1],anchor[2]+L*Math.cos(a*6)];
 assert.ok(codes(auditWheelGuides([{state,guides}])).includes('GUIDE_ANGLE'));
});
test('two technical cue groups maximum and guides anchored',()=>{
 const state=sample(5);
 const w=state.motion.wheels.RL;const anchor=[...w.centreWorld];
 const good={wheel:'RL',visible:true,anchorWorld:anchor,neutralEndWorld:[anchor[0],anchor[1],anchor[2]+1],steeredEndWorld:[anchor[0]+Math.sin(state.steerRad.RL),anchor[1],anchor[2]+Math.cos(state.steerRad.RL)]};
 const result=auditWheelGuides([{state,guides:[good,good,good]}]);
 assert.ok(codes(result).includes('GUIDE_DENSITY'));
});
test('low/high directional evidence cannot be substituted by hero stills',()=>{
 const r=auditDriveFrames([sample(0,'low'),sample(1,'low')],options);
 assert.ok(codes(r).includes('NO_HIGH_PROOF'));
});
