#!/usr/bin/env node
/**
 * Executable only after Manager integrates Agent A's implementation.
 * Run from repository with a TypeScript-capable runner, e.g.
 * npx tsx yunex/src/video004/qa/auditLive.ts --frames <LOCKED_N> --source <FULL_SHA> --out /tmp/y004-drive-qa.json
 *
 * Samples actual producer for EVERY global frame in and out of order.
 * No native film acceptance is inferred from a passing data audit.
 */
import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {auditDriveFrames, auditDeterministicSampler} from './driveAudit.mjs';
import {TRACK_LAYOUT_CONFIG, TRACK_ASPHALT_LOCAL_Y} from '../../video002/trackUpgrade/racetrack/layout';
import {DEFAULT_MOTION_CONFIG} from '../../video003/motion/contract';

const args: Record<string,string>={};
for(let i=2;i<process.argv.length;i+=2){
  const key=process.argv[i], value=process.argv[i+1];
  if(!key?.startsWith('--')||value===undefined)throw new Error('Expected --key value pairs.');
  args[key.slice(2)]=value;
}
if(!args.frames||!args.source||!args.out)throw new Error('Require --frames, --source, --out.');
if(!/^[a-f0-9]{40}$/i.test(args.source))throw new Error('Need full source commit SHA.');
const frameCount=Number(args.frames);
if(!Number.isInteger(frameCount)||frameCount<60)throw new Error('Missing locked positive integer film length.');
let producer: (frame: number) => unknown;
try {
  // Import only from the integration branch where Agent A has been accepted.
  // A missing module is a dependency BLOCKED result, never a guessed PASS.
  const module=await import('../motion/index');
  if(typeof module.y004MotionAtFrame!=='function')throw new Error('y004MotionAtFrame export missing.');
  producer=module.y004MotionAtFrame;
}catch(e){
  const result={phase:'Y004-REAR-STEERING-01',status:'BLOCKED',sourceSha:args.source,
    blocker:'Accepted Agent A motion module unavailable: '+String(e),automatedPass:false,visualPass:false};
  writeFileSync(resolve(args.out),JSON.stringify(result,null,2)+'\n');
  console.error(JSON.stringify(result));
  process.exit(2);
}
const samples=Array.from({length:frameCount},(_,i)=>producer(i));
const frameAudit=auditDriveFrames(samples,{
  expectedFrames:frameCount,
  fps:30,requireLowHigh:true,
  trackZMin:TRACK_LAYOUT_CONFIG.sampleMinZ,
  trackZMax:TRACK_LAYOUT_CONFIG.sampleMaxZ,
  asphaltWorldY:TRACK_LAYOUT_CONFIG.rootPosition[1]+TRACK_ASPHALT_LOCAL_Y,
  wheelbaseM:DEFAULT_MOTION_CONFIG.wheelbaseM,
});
const last=frameCount-1;
const order=[0,last,31,Math.floor(last/2),31,last,0,Math.floor(last/2),Math.max(0,last-17),0];
const deterministic=auditDeterministicSampler(producer,order);
const pass=frameAudit.pass&&deterministic.pass;
const result={phase:'Y004-REAR-STEERING-01',role:'F',status:pass?'AUTOMATED_PASS_VISUAL_NOT_REVIEWED':'AUTOMATED_FAIL',
  sourceSha:args.source,frameCount,frameAudit,deterministic,automatedPass:pass,
  visualPass:null,nativeMovingVideoReviewed:false,creativeApproval:false};
writeFileSync(resolve(args.out),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,sourceSha:result.sourceSha,failures:[...frameAudit.failures,...deterministic.failures]}));
if(!pass)process.exitCode=1;
