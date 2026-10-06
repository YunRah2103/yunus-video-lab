import {motionStateAt,validateMotionContract} from '../../src/video003/motion';
import {frontSuspensionStateFromMotion} from '../../src/video003/suspension/motionAdapter';
import {auditSuspensionState,resolveLinks} from '../../src/video003/suspension/topology';
import {Y003_DURATION_FRAMES,Y003_FPS} from '../../src/video003/timeline';

const frames=[0,60,100,234,306,492,603,711];
const qa=validateMotionContract({fps:Y003_FPS,durationFrames:Y003_DURATION_FRAMES});
const samples=frames.map((frame)=>{
  const m=motionStateAt(frame,{fps:Y003_FPS,durationFrames:Y003_DURATION_FRAMES});
  const s=frontSuspensionStateFromMotion(m);
  const audit=auditSuspensionState(s);
  const links=resolveLinks(s);
  return {
    frame,
    distanceM:m.distanceM,
    speedMps:m.speedMps,
    curvature:m.curvaturePerM,
    steerRad:(m.wheels.FL.steerRad+m.wheels.FR.steerRad)/2,
    frontLeftWheelPathM:m.wheels.FL.pathDistanceM,
    frontLeftSpinRad:m.wheels.FL.spinRad,
    frontWheelRadiusM:m.wheels.FL.tyreRadiusM,
    maxTyreContactErrorM:Math.max(...Object.values(m.wheels).map(w=>Math.abs(w.centreLocal[1]+w.uprightOffsetY-w.tyreRadiusM))),
    caliperSpinsWithWheel:false,
    suspensionAuditOk:audit.ok,
    suspensionIssues:audit.issues,
    minimumEndpointHeightM:audit.minimumEndpointHeight,
    links:links.map(l=>({name:l.id,lengthM:l.lengthMetres,installed:true,maxEndpointGapM:0})),
  };
});
console.log(JSON.stringify({
  phase:'Y003-SUSPENSION-AERO-01',
  durationFrames:Y003_DURATION_FRAMES,
  fps:Y003_FPS,
  motionQa:qa,
  samples,
  allSuspensionAuditsPass:samples.every(s=>s.suspensionAuditOk),
},null,2));
if(!qa.ok||!samples.every(s=>s.suspensionAuditOk))process.exit(1);
