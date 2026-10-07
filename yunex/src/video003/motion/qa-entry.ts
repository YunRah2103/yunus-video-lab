import {
  assertMotionContract,
  validateRuntimeWheelRigKinematics,
} from './qa';

const config = {fps: 30, durationFrames: 735};
const contract = assertMotionContract(config);
const runtimeRig = validateRuntimeWheelRigKinematics(config);

console.log(JSON.stringify({
  phase: 'Y003-POLISH-02',
  role: 'A',
  contract,
  runtimeRig,
}, null, 2));
