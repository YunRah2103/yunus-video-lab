import type {Vec3, WheelId} from '../../video003/motion/contract';
import type {Y004DriveFrame, Y004CameraPose, Y004WheelGuide} from '../contracts';
import {projectY004WorldToPortrait, y004RotateLocalVector} from '../camera';

/**
 * These are wheel-anchored, horizontal heading comparisons, not tyre tracks
 * or a synthetic second car trajectory. Both rays have exactly the same
 * length: the difference in their bearing is mathematically the wheel yaw.
 * Illustrative length makes a <=1-degree turn visible WITHOUT scaling angle.
 */
const GUIDE_LENGTH_M = 1.72;
const LATERAL_CLEARANCE_M = 0.30;
const ROAD_LIFT_M = 0.035;
const SIDE_VISIBILITY_MIN = 0.20;
const VIEW_SAFE = 0.98;
const dot2 = (a: Vec3, b: Vec3) => a[0]*b[0]+a[2]*b[2];
const heading = (yaw: number): Vec3 => [Math.sin(yaw), 0, Math.cos(yaw)];
const plus = (a: Vec3, b: Vec3): Vec3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
const scale = (v: Vec3, s: number): Vec3 => [v[0]*s,v[1]*s,v[2]*s];
const diff = (a: Vec3, b: Vec3): Vec3 => [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const visibleInFilm = (v: Vec3, pose: Y004CameraPose): boolean => {
  const p = projectY004WorldToPortrait(v, pose);
  return p.inFront && Number.isFinite(p.x) &&
    Math.abs(p.x) < VIEW_SAFE && Math.abs(p.y) < VIEW_SAFE;
};
const wheelGuide = (
  state: Y004DriveFrame,
  camera: Y004CameraPose,
  id: WheelId,
): Y004WheelGuide => {
  const wheel = state.motion.wheels[id];
  const yaw = state.motion.root.rotation[1];
  const side = id[1] === 'L' ? 1 : -1;
  // Reference/contact markers remain on the approved asphalt plane as the
  // wheel rotates: never use the spinning rim transform to position them.
  const anchorWorld = plus(
    [
      wheel.centreWorld[0],
      wheel.centreWorld[1] - wheel.tyreRadiusM + ROAD_LIFT_M,
      wheel.centreWorld[2],
    ],
    y004RotateLocalVector([side*LATERAL_CLEARANCE_M,0,0],yaw),
  );
  // The wheel axis has no arrowhead: for the tight rear-wheel macro, the
  // short rearward half-axis is optically identical to the wheel's heading
  // line and keeps both true-angle rays inside a 9:16 shot. Matched elevated
  // demos use a 1.2m forward line so BOTH axle references fit the crop.
  const guideExtent = state.segmentId === 'rear-macro' ? -0.40 :
    state.segmentId === 'low-explain' || state.segmentId === 'high-explain'
      ? 1.20 : GUIDE_LENGTH_M;
  const neutralEndWorld = plus(anchorWorld, scale(heading(yaw),guideExtent));
  const steeredEndWorld = plus(
    anchorWorld, scale(heading(yaw + state.steerRad[id]),guideExtent),
  );
  const relative = diff(camera.position, wheel.centreWorld);
  const lateral = dot2(relative,y004RotateLocalVector([1,0,0],yaw));
  const horizontalDistance = Math.hypot(relative[0],relative[2]);
  const nearSide = side*lateral >= SIDE_VISIBILITY_MIN*horizontalDistance;
  const values = [
    ...anchorWorld,...neutralEndWorld,...steeredEndWorld,state.steerRad[id],
  ];
  const correctState = Math.abs(state.steerRad[id]-wheel.steerRad) < 1e-7;
  const allowed =
    state.regime !== 'hero' &&
    ((state.regime === 'low' && (state.segmentId === 'low-hook' ||
      state.segmentId === 'rear-macro' || state.segmentId === 'low-explain')) ||
    (state.regime === 'high' && state.segmentId === 'high-explain'));
  return {
    id: `y004-${state.segmentId}-${id}`, wheel: id,
    anchorWorld,neutralEndWorld,steeredEndWorld,
    visible: allowed && values.every(Number.isFinite) && correctState &&
      nearSide && visibleInFilm(anchorWorld,camera) &&
      visibleInFilm(neutralEndWorld,camera) &&
      visibleInFilm(steeredEndWorld,camera),
    regime: state.regime,
  };
};
/** Always return <=2 simultaneous cues: front and rear on the camera-facing
 * side. Hook/macro isolates the rear axle; hero and exit are graphic-free. */
export const resolveY004Guides = (
  state: Y004DriveFrame, camera: Y004CameraPose,
): ReadonlyArray<Y004WheelGuide> => {
  if (camera.segmentId !== state.segmentId) {
    throw new Error('Y004 camera/guide segment mismatch');
  }
  if (state.segmentId === 'trackside-exit' || state.segmentId === 'high-drive') {
    return [];
  }
  const yaw = state.motion.root.rotation[1];
  const localX = y004RotateLocalVector([1,0,0],yaw);
  const carToCamera = diff(camera.position,state.motion.root.position);
  const cameraOnLeft = dot2(carToCamera,localX) >= 0;
  const front: WheelId = cameraOnLeft ? 'FL' : 'FR';
  const rear: WheelId = cameraOnLeft ? 'RL' : 'RR';
  if (state.segmentId === 'low-hook' || state.segmentId === 'rear-macro') {
    return [wheelGuide(state,camera,rear)];
  }
  return [wheelGuide(state,camera,front),wheelGuide(state,camera,rear)];
};
export const auditY004GuideGeometry = (
  state: Y004DriveFrame,
  guides: ReadonlyArray<Y004WheelGuide>,
) => {
  const issues: string[]=[];
  if (guides.length>2) issues.push('more than two groups');
  for (const guide of guides) {
    const a = diff(guide.neutralEndWorld,guide.anchorWorld);
    const b = diff(guide.steeredEndWorld,guide.anchorWorld);
    const la = Math.hypot(...a), lb = Math.hypot(...b);
    if (Math.abs(la-lb)>1e-8) issues.push(guide.wheel+' unequal ray lengths');
    // atan2(cross-xz, dot-xz) gives exact horizontal yaw in radians.
    const angle = Math.atan2(a[2]*b[0]-a[0]*b[2],dot2(a,b));
    if (Math.abs(angle-state.steerRad[guide.wheel])>1e-8) {
      issues.push(guide.wheel+' bearing exaggerates steering');
    }
    const wheel=state.motion.wheels[guide.wheel];
    if (Math.abs(guide.anchorWorld[1] -
      (wheel.centreWorld[1]-wheel.tyreRadiusM+ROAD_LIFT_M))>1e-8) {
      issues.push(guide.wheel+' detached from contact plane');
    }
  }
  return {ok: issues.length===0,issues,groups: guides.length};
};
