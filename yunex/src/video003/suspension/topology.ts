import {add3, length3, rotateByQuat, sub3, transformPoint} from './math';
import type {
  FrontSuspensionState,
  ResolvedSuspensionLink,
  Side,
  SuspensionAnchor,
  SuspensionAudit,
  SuspensionBoundingBox,
  SuspensionLinkDefinition,
  Vec3,
} from './types';

/** Approved model-manifest wheel centres. The source Porsche GLB remains untouched. */
export const FRONT_WHEEL_CENTRES: Record<Side, Vec3> = {
  FL: [0.8047665688272774, 0.3521761158410333, 1.242510736222192],
  FR: [-0.8047665640219048, 0.35217613650115226, 1.2425106101149082],
};

const sideSign = (side: Side) => side === 'FL' ? 1 : -1;
const anchorId = (side: Side, name: string) => side + '_' + name;

/**
 * Reference-informed illustrative pick-up points, NOT Porsche CAD dimensions.
 * Documented topology is double wishbone. Exact positions below are tuned only to
 * sit plausibly inside the approved 992 GT3 RS front wheel houses.
 */
export const buildReferenceAnchors = (side: Side): SuspensionAnchor[] => {
  const s = sideSign(side);
  return [
    {id: anchorId(side, 'UF_IN'), side, kind: 'chassis', referencePosition: [s * 0.36, 0.545, 1.42]},
    {id: anchorId(side, 'UR_IN'), side, kind: 'chassis', referencePosition: [s * 0.35, 0.54, 1.06]},
    {id: anchorId(side, 'LF_IN'), side, kind: 'chassis', referencePosition: [s * 0.30, 0.22, 1.475]},
    {id: anchorId(side, 'LR_IN'), side, kind: 'chassis', referencePosition: [s * 0.315, 0.235, 0.98]},
    {id: anchorId(side, 'TIE_IN'), side, kind: 'chassis', referencePosition: [s * 0.33, 0.36, 0.995]},
    {id: anchorId(side, 'DAMPER_UP'), side, kind: 'chassis', referencePosition: [s * 0.325, 0.88, 1.105]},
    {id: anchorId(side, 'UP_OUT'), side, kind: 'upright', referencePosition: [s * 0.70, 0.535, 1.225]},
    {id: anchorId(side, 'LF_OUT'), side, kind: 'upright', referencePosition: [s * 0.716, 0.205, 1.345]},
    {id: anchorId(side, 'LR_OUT'), side, kind: 'upright', referencePosition: [s * 0.710, 0.245, 1.125]},
    {id: anchorId(side, 'TIE_OUT'), side, kind: 'upright', referencePosition: [s * 0.720, 0.365, 1.105]},
    {id: anchorId(side, 'DAMPER_LOW'), side, kind: 'upright', referencePosition: [s * 0.660, 0.33, 1.185]},
  ];
};

export const REFERENCE_ANCHORS: SuspensionAnchor[] = [
  ...buildReferenceAnchors('FL'),
  ...buildReferenceAnchors('FR'),
];

const linksFor = (side: Side): SuspensionLinkDefinition[] => [
  {id: side + '_upper_front', side, kind: 'upper-front', inboardAnchor: anchorId(side, 'UF_IN'), outboardAnchor: anchorId(side, 'UP_OUT'), chordMetres: 0.092, thicknessMetres: 0.030},
  {id: side + '_upper_rear', side, kind: 'upper-rear', inboardAnchor: anchorId(side, 'UR_IN'), outboardAnchor: anchorId(side, 'UP_OUT'), chordMetres: 0.090, thicknessMetres: 0.030},
  {id: side + '_lower_front', side, kind: 'lower-front', inboardAnchor: anchorId(side, 'LF_IN'), outboardAnchor: anchorId(side, 'LF_OUT'), chordMetres: 0.112, thicknessMetres: 0.036},
  {id: side + '_lower_rear', side, kind: 'lower-rear', inboardAnchor: anchorId(side, 'LR_IN'), outboardAnchor: anchorId(side, 'LR_OUT'), chordMetres: 0.112, thicknessMetres: 0.036},
  {id: side + '_tie_rod', side, kind: 'tie-rod', inboardAnchor: anchorId(side, 'TIE_IN'), outboardAnchor: anchorId(side, 'TIE_OUT'), chordMetres: 0.070, thicknessMetres: 0.024},
];

export const SUSPENSION_LINKS: SuspensionLinkDefinition[] = [
  ...linksFor('FL'),
  ...linksFor('FR'),
];

export const DAMPER_ANCHORS: Record<Side, {upper: string; lower: string}> = {
  FL: {upper: 'FL_DAMPER_UP', lower: 'FL_DAMPER_LOW'},
  FR: {upper: 'FR_DAMPER_UP', lower: 'FR_DAMPER_LOW'},
};

const byId = new Map(REFERENCE_ANCHORS.map((a) => [a.id, a]));

export const resolveAnchor = (anchor: SuspensionAnchor, state: FrontSuspensionState): Vec3 => {
  if (anchor.kind === 'chassis') return transformPoint(anchor.referencePosition, state.chassis);
  const upright = state[anchor.side];
  const referenceCentre = FRONT_WHEEL_CENTRES[anchor.side];
  const offset = sub3(anchor.referencePosition, referenceCentre);
  return add3(upright.wheelCenter, rotateByQuat(offset, upright.quaternion));
};

export const resolveAnchorById = (id: string, state: FrontSuspensionState): Vec3 => {
  const anchor = byId.get(id);
  if (!anchor) throw new Error('Unknown Y003 suspension anchor: ' + id);
  return resolveAnchor(anchor, state);
};

export const resolveLinks = (state: FrontSuspensionState): ResolvedSuspensionLink[] =>
  SUSPENSION_LINKS.map((link) => {
    const start = resolveAnchorById(link.inboardAnchor, state);
    const end = resolveAnchorById(link.outboardAnchor, state);
    return {...link, start, end, lengthMetres: length3(sub3(end, start))};
  });

export const resolveDamper = (side: Side, state: FrontSuspensionState) => ({
  upper: resolveAnchorById(DAMPER_ANCHORS[side].upper, state),
  lower: resolveAnchorById(DAMPER_ANCHORS[side].lower, state),
});

const boundsForPoints = (points: Vec3[], pad = 0): SuspensionBoundingBox => ({
  min: [
    Math.min(...points.map((p) => p[0])) - pad,
    Math.min(...points.map((p) => p[1])) - pad,
    Math.min(...points.map((p) => p[2])) - pad,
  ],
  max: [
    Math.max(...points.map((p) => p[0])) + pad,
    Math.max(...points.map((p) => p[1])) + pad,
    Math.max(...points.map((p) => p[2])) + pad,
  ],
});

export const boundsForState = (state: FrontSuspensionState): SuspensionBoundingBox =>
  boundsForPoints(REFERENCE_ANCHORS.map((anchor) => resolveAnchor(anchor, state)), 0.07);

export const auditSuspensionState = (state: FrontSuspensionState): SuspensionAudit => {
  const issues: string[] = [];
  const links = resolveLinks(state);
  for (const link of links) {
    if (!Number.isFinite(link.lengthMetres) || link.lengthMetres < 0.20 || link.lengthMetres > 0.80) {
      issues.push(link.id + ' length ' + link.lengthMetres.toFixed(4) + ' m is outside illustrative sanity range.');
    }
    if (Math.min(link.start[1], link.end[1]) < 0.12) {
      issues.push(link.id + ' falls below 0.12 m car-local endpoint clearance.');
    }
  }

  const fl = buildReferenceAnchors('FL');
  const fr = buildReferenceAnchors('FR');
  let symmetryErrorMetres = 0;
  for (let i = 0; i < Math.min(fl.length, fr.length); i++) {
    const a = fl[i].referencePosition;
    const b = fr[i].referencePosition;
    symmetryErrorMetres = Math.max(
      symmetryErrorMetres,
      Math.abs(a[0] + b[0]),
      Math.abs(a[1] - b[1]),
      Math.abs(a[2] - b[2]),
    );
  }
  if (symmetryErrorMetres > 1e-6) issues.push('Reference left/right symmetry error ' + symmetryErrorMetres + ' m.');

  const allEndpoints = links.flatMap((l) => [l.start, l.end]);
  return {
    ok: issues.length === 0,
    issues,
    bounds: boundsForState(state),
    minimumEndpointHeight: Math.min(...allEndpoints.map((p) => p[1])),
    symmetryErrorMetres,
  };
};

export const PROFILE_CAMERA_SUGGESTIONS = {
  leftMacro: {position: [1.85, 0.72, 1.92] as Vec3, target: [0.61, 0.34, 1.22] as Vec3, focalLengthMm: 68},
  rightMacro: {position: [-1.85, 0.72, 1.92] as Vec3, target: [-0.61, 0.34, 1.22] as Vec3, focalLengthMm: 68},
  frontAxleContext: {position: [2.65, 1.18, 3.45] as Vec3, target: [0.34, 0.42, 1.16] as Vec3, focalLengthMm: 48},
} as const;
