import {poseFor} from '../../cameras';
import {
  ROAD_LOCAL,
  buildRoadDecor,
  estimateRoadSurfaceCost,
  worldXZToTrackLocal,
} from './layout';

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`A_ROAD test failed: ${message}`);
};

const stable = (value: unknown) => JSON.stringify(value);

export const runRoadSurfaceContractTests = () => {
  const a = buildRoadDecor(2103, 'final');
  const b = buildRoadDecor(2103, 'final');
  assert(stable(a) === stable(b), 'seeded layout must be deterministic');

  assert(ROAD_LOCAL.macroPatchY > ROAD_LOCAL.asphaltY, 'macro patches must sit above asphalt');
  assert(ROAD_LOCAL.rubberY > ROAD_LOCAL.macroPatchY, 'rubber must sit above macro patches');
  assert(ROAD_LOCAL.gravelY > ROAD_LOCAL.vergeY, 'edge gravel must sit above verge');
  assert(ROAD_LOCAL.kerbTopY > ROAD_LOCAL.asphaltY + 0.045, 'kerb must have visible physical height');
  assert(ROAD_LOCAL.nominalCarTrackLocalX > ROAD_LOCAL.roadMinX + 1.4, 'car lane must clear inner kerb');
  assert(ROAD_LOCAL.nominalCarTrackLocalX < ROAD_LOCAL.roadMaxX - 2.0, 'car lane must remain inside asphalt');

  const representativeFrames = [36, 119, 225, 345, 472, 600, 705];
  for (const frame of representativeFrames) {
    const pose = poseFor(frame);
    const [carX, carZ] = worldXZToTrackLocal(pose.rootPose.position[0], pose.rootPose.position[2]);
    assert(carX >= ROAD_LOCAL.roadMinX && carX <= ROAD_LOCAL.roadMaxX, `frame ${frame} car leaves authored asphalt in X`);
    assert(carZ >= ROAD_LOCAL.roadMinZ && carZ <= ROAD_LOCAL.roadMaxZ, `frame ${frame} car leaves authored asphalt in Z`);

    const [cameraX, cameraZ] = worldXZToTrackLocal(pose.camera.position[0], pose.camera.position[2]);
    const [targetX, targetZ] = worldXZToTrackLocal(pose.camera.target[0], pose.camera.target[2]);
    for (const [label, x, z] of [
      ['camera', cameraX, cameraZ],
      ['target', targetX, targetZ],
    ] as const) {
      assert(x >= ROAD_LOCAL.coverageMinX && x <= ROAD_LOCAL.coverageMaxX, `frame ${frame} ${label} exceeds authored ground X coverage`);
      assert(z >= ROAD_LOCAL.coverageMinZ && z <= ROAD_LOCAL.coverageMaxZ, `frame ${frame} ${label} exceeds authored ground Z coverage`);
    }
  }

  const preview = estimateRoadSurfaceCost('preview');
  const final = estimateRoadSurfaceCost('final');
  assert(final.approximateTextureBytesWithMipmaps <= 12 * 1024 * 1024, 'final procedural textures exceed 12 MiB budget');
  assert(final.instancedDrawCalls <= 5, 'decor draw-call budget regressed');
  assert(final.instances < 220, 'instance budget regressed');
  assert(preview.approximateTextureBytesWithMipmaps < final.approximateTextureBytesWithMipmaps, 'preview must be cheaper than final');

  const kerbEnd = ROAD_LOCAL.kerbStartZ + (ROAD_LOCAL.kerbCount - 1) * ROAD_LOCAL.kerbStep;
  assert(ROAD_LOCAL.kerbStartZ <= -18 && kerbEnd >= 12, 'kerb does not cover the active travel/camera region');

  return {
    passed: true,
    representativeFrames,
    previewCost: preview,
    finalCost: final,
    kerbEnd,
  };
};
