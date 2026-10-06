import {
  auditY003CameraPose,
  makeShotAnchor,
  resolveY003CameraPose,
  type Y003CameraMotionState,
  type Y003CameraShotId,
} from './cameraContract';

const SHOTS: Y003CameraShotId[] = [
  'hook-low-front',
  'brake-turn-in',
  'wheel-tracking',
  'front-corner-reveal',
  'link-profile',
  'mechanical-load',
  'whole-car',
  'trackside-pass',
  'exit-chase',
];

const state = (z: number, headingRad = 0): Y003CameraMotionState => ({
  position: [0, 0, z],
  headingRad,
  speedMps: 28,
  distanceM: z,
});

export const runY003CameraContractChecks = () => {
  const issues: string[] = [];
  const anchor = makeShotAnchor(state(20, 0.06));

  for (const id of SHOTS) {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const pose = resolveY003CameraPose(state(22 + progress * 8, 0.08), {
        id,
        progress,
        anchor: id === 'trackside-pass' ? anchor : undefined,
      });
      const audit = auditY003CameraPose(pose);
      if (!audit.ok) {
        issues.push(`${id}@${progress.toFixed(2)}: ${audit.issues.join(', ')}`);
      }
    }
  }

  const fixedA = resolveY003CameraPose(state(22), {
    id: 'trackside-pass',
    progress: 0,
    anchor,
  });
  const fixedB = resolveY003CameraPose(state(31), {
    id: 'trackside-pass',
    progress: 1,
    anchor,
  });
  const fixedDelta = Math.hypot(
    fixedA.position[0] - fixedB.position[0],
    fixedA.position[1] - fixedB.position[1],
    fixedA.position[2] - fixedB.position[2],
  );
  if (fixedDelta > 1e-9) {
    issues.push('trackside-pass camera moved in world space');
  }
  if (Math.abs(fixedA.target[2] - fixedB.target[2]) < 1) {
    issues.push('trackside-pass target did not follow the moving Porsche');
  }

  return {
    ok: issues.length === 0,
    issues,
    checkedShots: SHOTS.length,
    samplesPerShot: 5,
    fixedTracksideDeltaMetres: fixedDelta,
  };
};
