import test from 'node:test';
import assert from 'node:assert/strict';
import {auditPreRenderProofs,auditIndependentVisualReview} from './proofGate.mjs';

const SHA='a'.repeat(40),HASH='b'.repeat(64);
const kinds=['low-driving','high-driving','rear-macro','matched-muted','integrated-short'];
const roles=['A','A','B','C','Manager'];
const accepted={A:SHA,B:SHA,C:SHA,Manager:SHA};
const proofs=()=>kinds.map((kind,i)=>({kind,role:roles[i],sourceSha:SHA,
  mediaType:'native-moving-mp4',persistedPath:'/proof/'+kind+'.mp4',fps:30,
  width:1080,height:1920,firstFrame:10,lastFrameExclusive:145,sha256:HASH}));
const codes=r=>r.failures.map(x=>x.code);
const review=()=>({reviewer:'F',watchedMovingVideo:true,watchedMutedMatchedModes:true,
  frameFindings:[{clip:'low-driving',frame:80,observation:'Actual rolling wheel/road parallax visually verified by F'}],
  checks:{groundedDriving:true,rearSpinStability:true,caliperNonSpin:true,
    rearArchClearance:true,lowOpposesFront:true,highMatchesFront:true,
    matchedCamera:true,guideAccuracy:true,mobileTypeSafe:true,activeEnding:true},
  knownOpenBlockers:[]});
test('complete synthetic proof manifest passes schema only',()=>{
 assert.equal(auditPreRenderProofs(proofs(),accepted).pass,true);
});
test('missing real native low mode video blocks',()=>{
 assert.ok(codes(auditPreRenderProofs(proofs().slice(1),accepted)).includes('PROOF_MISSING_OR_DUPLICATED'));
});
test('PNG sheets cannot masquerade as moving video',()=>{
 const p=proofs();p[0].mediaType='png-contacts';
 assert.ok(codes(auditPreRenderProofs(p,accepted)).includes('PROOF_NOT_NATIVE'));
});
test('stale real SHA cannot pass',()=>{
 const p=proofs();p[1].sourceSha='c'.repeat(40);
 assert.ok(codes(auditPreRenderProofs(p,accepted)).includes('PROOF_STALE'));
});
test('unpersisted clip and missing mp4 digest blocks',()=>{
 const p=proofs();p[0].persistedPath=null;p[0].sha256=null;
 const c=codes(auditPreRenderProofs(p,accepted));
 assert.ok(c.includes('PROOF_UNPERSISTED'));assert.ok(c.includes('PROOF_HASH'));
});
test('invalid fps/frame ranges block',()=>{
 const p=proofs();p[2].fps=24;p[2].lastFrameExclusive=11;
 const c=codes(auditPreRenderProofs(p,accepted));
 assert.ok(c.includes('PROOF_VIDEO_METADATA'));assert.ok(c.includes('PROOF_FRAME_RANGE'));
});
test('independent visual review requires playing actual moving clip',()=>{
 const r=review();r.watchedMovingVideo=false;
 assert.ok(codes(auditIndependentVisualReview(r,{pass:true})).includes('NO_MOVING_VIDEO_VIEW'));
});
test('muted matched low/high review is not optional',()=>{
 const r=review();r.watchedMutedMatchedModes=false;
 assert.ok(codes(auditIndependentVisualReview(r,{pass:true})).includes('NO_MUTED_REVIEW'));
});
test('mechanical blocker cannot get automatic visual PASS',()=>{
 const r=review();r.checks.caliperNonSpin=false;r.knownOpenBlockers=['frame 64 rear caliper spinning'];
 const c=codes(auditIndependentVisualReview(r,{pass:true}));
 assert.ok(c.includes('VISUAL_CHECK_MISSING'));assert.ok(c.includes('OPEN_BLOCKERS'));
});
test('automated provenance PASS does not imply independent review',()=>{
 const r=review();r.frameFindings=[];r.reviewer='Manager';
 const c=codes(auditIndependentVisualReview(r,{pass:true}));
 assert.ok(c.includes('INDEPENDENCE'));assert.ok(c.includes('NO_FRAME_EVIDENCE'));
});
test('even perfect review record cannot bypass missing proof provenance',()=>{
 assert.ok(codes(auditIndependentVisualReview(review(),{pass:false})).includes('PROVENANCE_BLOCKED'));
});
test('all review schema fields can pass only with explicit independent F assertions',()=>{
 assert.equal(auditIndependentVisualReview(review(),{pass:true}).pass,true);
});
