/**
 * F-only provenance/readiness gate for native moving visual evidence.
 * It validates declarations and QA traceability, not the pixels; human visual
 * acceptance remains a separate independent F review.
 */
const KINDS=['low-driving','high-driving','rear-macro','matched-muted','integrated-short'];
const ROLES={'low-driving':'A','high-driving':'A','rear-macro':'B','matched-muted':'C','integrated-short':'Manager'};
const sha = s=>typeof s==='string'&&/^[a-f0-9]{40}$/i.test(s);
export function auditPreRenderProofs(proofs, accepted) {
 const failures=[], fail=(code,message)=>failures.push({code,message});
 if(!Array.isArray(proofs))return {pass:false,failures:[{code:'NO_PROOFS',message:'Real native moving proof manifest missing.'}]};
 for(const kind of KINDS){
  const xs=proofs.filter(p=>p?.kind===kind);
  if(xs.length!==1){fail('PROOF_MISSING_OR_DUPLICATED',kind+': expected one independent native clip.');continue;}
  const p=xs[0],role=ROLES[kind];
  if(p.role!==role)fail('PROOF_OWNER',kind+': wrong owner.');
  if(!sha(p.sourceSha))fail('PROOF_SOURCE',kind+': source SHA missing or malformed.');
  if(accepted?.[role] && p.sourceSha!==accepted[role])fail('PROOF_STALE',kind+': not accepted current '+role+' remote SHA.');
  if(p.mediaType!=='native-moving-mp4')fail('PROOF_NOT_NATIVE',kind+': still/contact sheet/text cannot substitute moving proof.');
  if(!p.artifactId&&!p.persistedPath&&!p.workflowRunId)fail('PROOF_UNPERSISTED',kind+': no accessible persisted clip or artifact.');
  if(p.fps!==30||!Number.isInteger(p.width)||!Number.isInteger(p.height)||p.width<=0||p.height<=0)fail('PROOF_VIDEO_METADATA',kind+': invalid dimensions or frame rate.');
  if(!Number.isInteger(p.firstFrame)||!Number.isInteger(p.lastFrameExclusive)||p.lastFrameExclusive<=p.firstFrame+1)fail('PROOF_FRAME_RANGE',kind+': source frame range invalid/not moving.');
  if(!p.sha256||!/^[a-f0-9]{64}$/i.test(p.sha256))fail('PROOF_HASH',kind+': MP4 SHA256 missing.');
 }
 return {pass:failures.length===0,failures,observations:{manifestCount:proofs.length,requiredKinds:KINDS}};
}
export function auditIndependentVisualReview(review, proofsStatus) {
 const failures=[], fail=(code,message)=>failures.push({code,message});
 if(!proofsStatus?.pass)fail('PROVENANCE_BLOCKED','Native proof provenance gate has not passed.');
 if(review?.reviewer!=='F')fail('INDEPENDENCE','F must independently review the actual moving clips.');
 if(review?.watchedMovingVideo!==true)fail('NO_MOVING_VIDEO_VIEW','Reviewer did not watch native moving footage.');
 if(review?.watchedMutedMatchedModes!==true)fail('NO_MUTED_REVIEW','No real muted matched low/high consecutive review.');
 if(!Array.isArray(review?.frameFindings)||!review.frameFindings.length)fail('NO_FRAME_EVIDENCE','Supply frame-referenced observed findings (including clean observations).');
 const required=['groundedDriving','rearSpinStability','caliperNonSpin','rearArchClearance','lowOpposesFront','highMatchesFront','matchedCamera','guideAccuracy','mobileTypeSafe','activeEnding'];
 for(const key of required){
  if(review?.checks?.[key]!==true)fail('VISUAL_CHECK_MISSING','Unverified/failed: '+key);
 }
 if(review?.knownOpenBlockers?.length)fail('OPEN_BLOCKERS','Unresolved moving-visual blockers: '+review.knownOpenBlockers.join(', '));
 return {pass:failures.length===0,failures,observations:{checked:required.length}};
}
