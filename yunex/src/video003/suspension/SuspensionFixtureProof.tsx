import React from 'react';
import {FrontSuspension} from './FrontSuspension';
import {fixtureStateAtFrame} from './referenceFixture';
import {auditSuspensionState} from './topology';

export type SuspensionFixtureProofProps = {
  frame: number;
  fps?: number;
  side?: 'FL' | 'FR' | 'both';
};

/**
 * Isolated reference-fixture proof only. Not a substitute for Manager-pinned A motion.
 */
export const SuspensionFixtureProof: React.FC<SuspensionFixtureProofProps> = ({
  frame,
  fps = 30,
  side = 'both',
}) => {
  const state = fixtureStateAtFrame(frame, fps);
  const audit = auditSuspensionState(state);
  if (!audit.ok) throw new Error('Y003 suspension fixture failed audit: ' + audit.issues.join(' | '));
  return <FrontSuspension state={state} side={side}/>;
};
