export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number];
export type Side = 'FL' | 'FR';

export type RigidPose = {
  position: Vec3;
  quaternion: Quat;
};

/**
 * Upright pose intentionally excludes rim spin. Calipers should consume this same
 * upright pose; Spin_FL/Spin_FR remain a separate wheel-only rotation owned by motion.
 */
export type UprightPose = {
  wheelCenter: Vec3;
  quaternion: Quat;
};

export type FrontSuspensionState = {
  chassis: RigidPose;
  FL: UprightPose;
  FR: UprightPose;
};

export type AnchorKind = 'chassis' | 'upright';

export type SuspensionAnchor = {
  id: string;
  side: Side;
  kind: AnchorKind;
  referencePosition: Vec3;
};

export type LinkKind =
  | 'upper-front'
  | 'upper-rear'
  | 'lower-front'
  | 'lower-rear'
  | 'tie-rod';

export type SuspensionLinkDefinition = {
  id: string;
  side: Side;
  kind: LinkKind;
  inboardAnchor: string;
  outboardAnchor: string;
  chordMetres: number;
  thicknessMetres: number;
};

export type ResolvedSuspensionLink = SuspensionLinkDefinition & {
  start: Vec3;
  end: Vec3;
  lengthMetres: number;
};

export type SuspensionBoundingBox = {
  min: Vec3;
  max: Vec3;
};

export type SuspensionAudit = {
  ok: boolean;
  issues: string[];
  bounds: SuspensionBoundingBox;
  minimumEndpointHeight: number;
  symmetryErrorMetres: number;
};
