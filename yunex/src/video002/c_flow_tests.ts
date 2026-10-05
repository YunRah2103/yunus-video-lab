import {
  APPROVED_STATIC_FLAP_BOUNDS,
  createFlowPaths,
  tracerT,
  transformPoint,
  visualStateFor,
} from './flowPaths';

const fail = (message: string): never => {
  throw new Error(`C airflow test failed: ${message}`);
};

const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps;

export function runCFlowTests() {
  const modes = ['highDownforce', 'drs', 'airbrake'] as const;

  for (const mode of modes) {
    const a = createFlowPaths({mode, flapBounds: APPROVED_STATIC_FLAP_BOUNDS});
    const b = createFlowPaths({mode, flapBounds: APPROVED_STATIC_FLAP_BOUNDS});
    if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${mode} paths are not deterministic`);

    for (const path of a) {
      if (!(path.points[0][2] > path.points[path.points.length - 1][2])) {
        fail(`${path.id} does not travel front +Z to rear -Z`);
      }
      if (path.opacity > 0.30) fail(`${path.id} opacity exceeds restrained budget`);
    }
  }

  const high = visualStateFor('highDownforce', 1, 'highDownforce');
  const drs = visualStateFor('drs', 1, 'drs');
  const airbrake = visualStateFor('airbrake', 1, 'airbrake');
  const startDrs = visualStateFor('drs', 0, 'highDownforce');
  const endDrs = visualStateFor('drs', 1, 'highDownforce');
  if (JSON.stringify(startDrs) !== JSON.stringify(high)) fail('DRS transition pops at its start');
  if (JSON.stringify(endDrs) !== JSON.stringify(drs)) fail('DRS transition misses its settled endpoint');
  if (!(drs.wakeLift < high.wakeLift && drs.wakeSpread < high.wakeSpread)) {
    fail('DRS does not reduce qualitative wake/deflection');
  }
  if (!(airbrake.dragStrength > high.dragStrength && airbrake.dragStrength > drs.dragStrength)) {
    fail('airbrake drag cue is not distinct');
  }

  const clearanceTop = APPROVED_STATIC_FLAP_BOUNDS.max[1] + (APPROVED_STATIC_FLAP_BOUNDS.clearance ?? 0);
  const minZ = APPROVED_STATIC_FLAP_BOUNDS.min[2] - 0.12;
  const maxZ = APPROVED_STATIC_FLAP_BOUNDS.max[2] + 0.12;
  for (const path of createFlowPaths({mode: 'airbrake', flapBounds: APPROVED_STATIC_FLAP_BOUNDS})) {
    if (path.kind !== 'roof') continue;
    for (const point of path.points) {
      if (point[2] >= minZ && point[2] <= maxZ && point[1] + 1e-9 < clearanceTop) {
        fail(`${path.id} enters the flap clearance envelope`);
      }
    }
  }

  const attached = transformPoint(
    [0, 1, 2],
    {position: [3, 4, 5], rotation: [0, Math.PI / 2, 0]},
  );
  if (!near(attached[0], 5) || !near(attached[1], 5) || !near(attached[2], 5)) {
    fail('car-world transform attachment is incorrect');
  }

  if (!near(tracerT(123, 0.37), tracerT(123, 0.37))) fail('tracer position is not frame-deterministic');

  return {
    modes,
    pathCount: createFlowPaths({mode: 'highDownforce'}).length,
    maxPathOpacity: Math.max(...createFlowPaths({mode: 'highDownforce'}).map((p) => p.opacity)),
    status: 'PASS' as const,
  };
}
