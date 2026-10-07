import {length3, sub3} from './math';
import {resolveDamper, resolveLinks} from './topology';
import type {FrontSuspensionState, Side} from './types';

export type SuspensionDetailMetrics = {
  damperLengthBySide: Record<Side, number>;
  hubConnectionRadiusBySide: Record<Side, number>;
  maxUpperPairSeparation: number;
  minimumEndpointHeight: number;
};

export type SuspensionDetailAudit = {
  ok: boolean;
  issues: string[];
  metrics: SuspensionDetailMetrics;
};

const sides: Side[] = ['FL', 'FR'];
const expectedKinds = ['upper-front', 'upper-rear', 'lower-front', 'lower-rear', 'tie-rod'] as const;

export const auditSuspensionDetailState = (state: FrontSuspensionState): SuspensionDetailAudit => {
  const links = resolveLinks(state);
  const issues: string[] = [];
  const damperLengthBySide = {} as Record<Side, number>;
  const hubConnectionRadiusBySide = {} as Record<Side, number>;
  let maxUpperPairSeparation = 0;
  let minimumEndpointHeight = Infinity;

  for (const side of sides) {
    const sideLinks = links.filter((link) => link.side === side);
    for (const kind of expectedKinds) {
      if (sideLinks.filter((link) => link.kind === kind).length !== 1) {
        issues.push(side + ' must contain exactly one ' + kind + ' link.');
      }
    }

    const upperFront = sideLinks.find((link) => link.kind === 'upper-front');
    const upperRear = sideLinks.find((link) => link.kind === 'upper-rear');
    if (upperFront && upperRear) {
      const separation = length3(sub3(upperFront.end, upperRear.end));
      maxUpperPairSeparation = Math.max(maxUpperPairSeparation, separation);
      if (separation > 1e-6) issues.push(side + ' upper wishbone outboard links do not share a joint.');
    }

    const hub = state[side].wheelCenter;
    const outboard = sideLinks.map((link) => link.end);
    hubConnectionRadiusBySide[side] = Math.max(...outboard.map((point) => length3(sub3(point, hub))));
    if (hubConnectionRadiusBySide[side] > 0.30) {
      issues.push(side + ' upright link envelope exceeds 0.30 m from hub centre.');
    }

    const damper = resolveDamper(side, state);
    damperLengthBySide[side] = length3(sub3(damper.upper, damper.lower));
    if (!Number.isFinite(damperLengthBySide[side]) || damperLengthBySide[side] < 0.35 || damperLengthBySide[side] > 0.85) {
      issues.push(side + ' damper length is outside illustrative packaging range.');
    }

    for (const link of sideLinks) {
      for (const point of [link.start, link.end]) {
        minimumEndpointHeight = Math.min(minimumEndpointHeight, point[1]);
        if (!point.every(Number.isFinite)) issues.push(link.id + ' contains a non-finite endpoint.');
      }
    }
  }

  if (minimumEndpointHeight < 0.10) issues.push('Suspension endpoint falls below 0.10 m car-local clearance.');

  return {
    ok: issues.length === 0,
    issues,
    metrics: {
      damperLengthBySide,
      hubConnectionRadiusBySide,
      maxUpperPairSeparation,
      minimumEndpointHeight,
    },
  };
};
