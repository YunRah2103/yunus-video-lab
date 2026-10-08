import assert from 'node:assert/strict';
import {environmentAudit} from './layout';
import {y004MotionAtFrame} from '../video004/motion/sampler';
import {auditY003TrackContainment} from '../video003/track/trackAdapter';
const env=environmentAudit();assert(env.ok&&env.deterministic);let min=Infinity;
for(let f=0;f<360;f++){
 const shot=Math.floor(f/90),s=y004MotionAtFrame([432,210,477,630][shot]+f%90);const c=auditY003TrackContainment({position:s.motion.root.position,headingRad:s.motion.root.rotation[1]});assert(c.ok);min=Math.min(min,c.minRoadEdgeClearance);
 for(const w of Object.values(s.motion.wheels)){assert(Number.isFinite(w.spinRad));assert(w.tyreRadiusM>.3&&w.tyreRadiusM<.4);}
 if(f%90){const last=y004MotionAtFrame([432,210,477,630][shot]+f%90-1);assert(s.motion.distanceM>last.motion.distanceM);for(const id of ['FL','FR','RL','RR'] as const)assert(s.motion.wheels[id].spinRad>last.motion.wheels[id].spinRad);}
}
console.log(JSON.stringify({environment:env,frames:360,drivingContainment:'PASS',monotoneWheelSpin:'PASS',minCarRoadEdgeClearanceM:min},null,2));
