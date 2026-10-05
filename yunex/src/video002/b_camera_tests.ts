import {poseFor} from './cameras';
import {
  DEFAULT_CAMERA_TIMING,
  drivingDistanceAt,
  resolveCameraTiming,
  rootPoseAt,
  wheelAngleAt,
  type Yunex002CameraTiming,
} from './driving';

// This module is also imported by the isolated proof root so a render is a contract test.
const finite = (values: number[]) => values.every(Number.isFinite);

export type BCameraCheckReport = {
  ok: boolean;
  checks: string[];
  issues: string[];
};

export const runBCameraChecks = (
  timingInput: Partial<Yunex002CameraTiming> = DEFAULT_CAMERA_TIMING,
): BCameraCheckReport => {
  const timing = resolveCameraTiming(timingInput);
  const checks: string[] = [];
  const issues: string[] = [];

  const sampleFrames = [
    0,
    timing.hookEnd,
    timing.wingMacroEnd,
    timing.highDownforceEnd,
    timing.drsEnd,
    timing.brakingEnd,
    timing.coordinationEnd,
    timing.finalEnd,
  ];

  for (const frame of sampleFrames) {
    const a = poseFor(frame, timing);
    const b = poseFor(frame, timing);
    if (JSON.stringify(a) !== JSON.stringify(b)) issues.push(`non-deterministic pose at frame ${frame}`);
    if (!finite([...a.camera.position, ...a.camera.target, a.camera.focalLength, ...a.rootPose.position, ...a.rootPose.rotation, a.wheelAngle])) {
      issues.push(`non-finite pose value at frame ${frame}`);
    }
    if (a.camera.position[1] < 0.72) issues.push(`camera too close to/below road at frame ${frame}`);
    if (a.camera.focalLength < 24 || a.camera.focalLength > 78) issues.push(`unsafe focal length at frame ${frame}`);
    if (Math.abs(a.rootPose.rotation[0]) > 0.004) issues.push(`braking pitch exceeds restrained limit at frame ${frame}`);
  }
  checks.push('sampled poses are deterministic and finite');
  checks.push('camera height and focal-length guardrails are enforced');
  checks.push('whole-car braking pitch stays below 0.25 degrees');

  let previousDistance = drivingDistanceAt(0, timing);
  let previousWheel = wheelAngleAt(0, timing);
  for (let frame = 1; frame <= timing.finalEnd; frame++) {
    const distance = drivingDistanceAt(frame, timing);
    const wheel = wheelAngleAt(frame, timing);
    if (distance + 1e-9 < previousDistance) issues.push(`driving distance reset at frame ${frame}`);
    if (wheel + 1e-9 < previousWheel) issues.push(`wheel phase reset at frame ${frame}`);
    previousDistance = distance;
    previousWheel = wheel;
  }
  checks.push('travel is continuous and monotonic with no distance reset');
  checks.push('wheel phase is derived from cumulative distance with no reset');

  const brakeMid = Math.round((timing.drsEnd + timing.brakingEnd) / 2);
  const brakePose = rootPoseAt(brakeMid, timing);
  if (!(brakePose.rotation[0] > 0 && brakePose.rotation[0] < 0.004)) {
    issues.push('braking beat does not contain restrained forward pitch');
  }

  const finalPose = poseFor(timing.finalEnd, timing);
  if (finalPose.rootPose.position[2] <= 4.5) issues.push('final beat lacks enough forward travel to read as a moving pass');
  const axleSamples = [
    {y: 0.3521761, z: 1.2425107},
    {y: 0.3713973, z: -1.2120098},
  ];
  for (let frame = timing.drsEnd; frame <= timing.brakingEnd; frame += 5) {
    const pose = rootPoseAt(frame, timing);
    const pitch = pose.rotation[0];
    for (const axle of axleSamples) {
      const centreY = axle.y * Math.cos(pitch) - axle.z * Math.sin(pitch) + pose.position[1];
      const contactY = centreY - 0.34;
      if (contactY < -0.005 || contactY > 0.055) {
        issues.push(`tyre contact proxy out of tolerance at frame ${frame}: ${contactY.toFixed(4)}m`);
      }
    }
  }
  checks.push('front/rear tyre-contact proxy remains within road-contact tolerance during braking');
  checks.push('final hero remains a moving beat rather than a dead outro');

  return {ok: issues.length === 0, checks, issues};
};

export const assertBCameraContract = (
  timingInput: Partial<Yunex002CameraTiming> = DEFAULT_CAMERA_TIMING,
) => {
  const report = runBCameraChecks(timingInput);
  if (!report.ok) throw new Error(`YUNEX 002 B camera checks failed:\n${report.issues.join('\n')}`);
  return report;
};
