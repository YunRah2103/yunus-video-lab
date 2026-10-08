import assert from 'node:assert/strict';
import {Y004_SHOTS,Y004_FINAL_FRAMES,Y004_EDIT_WINDOWS,y004FrameState,verifyY004FinalEdit} from '../../../src/video004/timeline';
import {Y004_MEASURED_NARRATION} from '../../../src/video004/audio/cues';
import {buildY004EditCues,y004ActiveTextCue} from '../../../src/video004/edit';
import {Y004_REAR_STEER_CAP_RAD} from '../../../src/video004/motion';
assert.equal(Y004_FINAL_FRAMES,720);
verifyY004FinalEdit();
assert.deepEqual(Y004_SHOTS.map(s=>[s.frameStart,s.frameEndExclusive]),[[0,84],[84,150],[150,333],[333,432],[432,567],[567,720]]);
const cues=buildY004EditCues(Y004_EDIT_WINDOWS,720);
assert.equal(y004ActiveTextCue(332,cues)?.segmentId,'low-explain');
assert.equal(y004ActiveTextCue(333,cues)?.segmentId,'high-explain');
assert.equal(y004ActiveTextCue(450,cues),undefined);
assert.equal(Y004_MEASURED_NARRATION.sentences[2].startSeconds,11.608);
let low=0,high=0,minSpeed=Infinity,maxSpeed=0;
for(let frame=0;frame<720;frame++){
 const state=y004FrameState(frame),motion=state.motion;
 assert.equal(motion.frame,frame);
 assert.equal(motion.segmentId,state.segment.id);
 assert.ok(motion.motion.speedMps>3.5&&motion.motion.speedMps<19,'speed '+frame);
 minSpeed=Math.min(minSpeed,motion.motion.speedMps);
 maxSpeed=Math.max(maxSpeed,motion.motion.speedMps);
 const w=motion.steerRad,f=(w.FL+w.FR)/2,r=(w.RL+w.RR)/2;
 assert.ok(Math.abs(w.RL)<=Y004_REAR_STEER_CAP_RAD+1e-12);
 assert.ok(Math.abs(w.RL-w.RR)<1e-12);
 if(Math.abs(motion.motion.steeringCurvaturePerM)>0.003){
  if(frame<333){assert.ok(f*r<0,'low opposite '+frame);low++;}
  else{assert.ok(f*r>0,'high aligned '+frame);high++;}
 }
 for(const wheel of ['FL','FR','RL','RR'] as const){
  const x=motion.motion.wheels[wheel];
  assert.ok(Math.abs(x.spinRad*x.tyreRadiusM-x.pathDistanceM)<1e-8);
 }
}
assert.ok(low>70&&high>65,'both turning regimes');
for(const f of [719,332,333,567,84,0,431,567,333,719,0])assert.deepEqual(y004FrameState(f),y004FrameState(f));
console.log(JSON.stringify({status:'PASS',frames:720,low,high,minSpeed,maxSpeed,cut:333,exit:567}));
