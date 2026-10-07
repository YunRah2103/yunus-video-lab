import React from 'react';
import * as THREE from 'three';
import {FrontSuspension} from './FrontSuspension';
import {auditSuspensionDetailState} from './detailAudit';
import {fixtureStateAtFrame} from './referenceFixture';
import {REFERENCE_ANCHORS, auditSuspensionState, resolveAnchorById} from './topology';

const MARKER = new THREE.SphereGeometry(1, 12, 8);

export type SuspensionDetailProofProps = {
  frame: number;
  fps?: number;
  side?: 'FL' | 'FR' | 'both';
  diagnostic?: boolean;
};

/**
 * Five-second isolated proof harness. Feed frames 0..149 at 30 fps for the full
 * articulation cycle. Diagnostic markers distinguish chassis pick-ups (amber)
 * from upright pick-ups (cyan) without changing production topology.
 */
export const SuspensionDetailProof: React.FC<SuspensionDetailProofProps> = ({
  frame,
  fps = 30,
  side = 'both',
  diagnostic = false,
}) => {
  const state = fixtureStateAtFrame(frame % Math.max(1, Math.round(fps * 5)), fps);
  const baseAudit = auditSuspensionState(state);
  const detailAudit = auditSuspensionDetailState(state);
  if (!baseAudit.ok || !detailAudit.ok) {
    throw new Error('Y003 P02-B suspension proof audit failed: ' + [...baseAudit.issues, ...detailAudit.issues].join(' | '));
  }

  return <group name="Y003_P02_B_SuspensionDetailProof">
    <FrontSuspension state={state} side={side}/>
    {diagnostic && REFERENCE_ANCHORS
      .filter((anchor) => side === 'both' || anchor.side === side)
      .map((anchor) => {
        const p = resolveAnchorById(anchor.id, state);
        return <mesh key={anchor.id} geometry={MARKER} position={p} scale={[0.017, 0.017, 0.017]}>
          <meshBasicMaterial color={anchor.kind === 'chassis' ? '#ffb347' : '#67e8f9'} toneMapped={false}/>
        </mesh>;
      })}
  </group>;
};
