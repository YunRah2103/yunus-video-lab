#!/usr/bin/env node
/**
 * Agent F exact-file native delivery audit (read-only input).
 *
 * node yunex/src/video004/qa/verifyMedia.mjs \
 *  --file final.mp4 --frames 720 \
 *  --render-source <40-hex> --approved-source <same-40-hex> \
 *  --chunks /tmp/chunks.json --artifact-id 12345 \
 *  --out /tmp/y004-f-native-qa.json
 *
 * chunks.json: [{startFrame:0,endFrameExclusive:720,sourceSha:"...",artifactId:"..."}]
 * An uninterrupted one-pass render is represented by one full-length interval.
 * Native visual and uninterrupted audiovisual viewing are separate manual gates.
 */
import {readFileSync, writeFileSync, openSync, closeSync, readSync, statSync, createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {auditDeliveryMetadata} from './deliveryAudit.mjs';

const args={};
for(let i=2;i<process.argv.length;i+=2){
  const key=process.argv[i];const val=process.argv[i+1];
  if(!key?.startsWith('--')||val===undefined)throw new Error('Expected --key value arguments.');
  args[key.slice(2)]=val;
}
for(const key of ['file','frames','render-source','approved-source','out']){
  if(!args[key])throw new Error('Missing --'+key);
}
if(!args.chunks&&!args['direct-render'])throw new Error('Need --chunks JSON or --direct-render artifact ID.');
if(!args['artifact-id']&&!args['run-id'])throw new Error('Need final --artifact-id or --run-id.');
const file=resolve(args.file);
const frameCount=Number(args.frames);
if(!Number.isInteger(frameCount)||frameCount<=0)throw new Error('Expected positive integer --frames.');
const run=(bin,argv,maxBuffer=64*1024*1024)=>{
  const r=spawnSync(bin,argv,{encoding:'utf8',maxBuffer});
  if(r.error)throw r.error;
  if(r.status!==0)throw new Error(bin+' failed ('+r.status+'): '+(r.stderr??'').slice(-3500));
  return r;
};
function atomOffsets(path){
  const fd=openSync(path,'r');
  try {
    const size=statSync(path).size;let at=0;const positions={};
    while(at+8<=size){
      const hdr=Buffer.alloc(16);
      readSync(fd,hdr,0,Math.min(16,size-at),at);
      let len=hdr.readUInt32BE(0);const kind=hdr.toString('ascii',4,8);
      let headerSize=8;
      if(len===1){if(at+16>size)throw new Error('Invalid extended MP4 atom.');len=Number(hdr.readBigUInt64BE(8));headerSize=16;}
      if(len===0)len=size-at;
      if(!Number.isSafeInteger(len)||len<headerSize||at+len>size)throw new Error('Malformed atom '+kind+' at '+at);
      if(!(kind in positions))positions[kind]=at;
      at+=len;
    }
    if(at!==size)throw new Error('Trailing bytes outside valid top-level MP4 atoms.');
    return positions;
  }finally {closeSync(fd);}
}
const sha256=()=>new Promise((ok,bad)=>{
  const hash=createHash('sha256');const stream=createReadStream(file);
  stream.on('data',v=>hash.update(v));stream.on('error',bad);stream.on('end',()=>ok(hash.digest('hex')));
});
const probe=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]).stdout);
const packets=JSON.parse(run('ffprobe',['-v','error','-select_streams','v:0','-show_entries','packet=pts_time','-of','json',file]).stdout).packets??[];
let packetCfr=packets.length===frameCount;
for(let i=1;i<packets.length;i++){
  const step=Number(packets[i].pts_time)-Number(packets[i-1].pts_time);
  if(!Number.isFinite(step)||Math.abs(step-1/30)>.0006)packetCfr=false;
}
let decoded=false;let decodeError=null;
try {
  run('ffmpeg',['-hide_banner','-nostdin','-v','error','-xerror','-i',file,'-map','0:v:0','-map','0:a:0','-f','null','-'],1024*1024);
  decoded=true;
} catch(e){decodeError=String(e);}
let peakDbFS=NaN;let peakError=null;
try {
  const r=run('ffmpeg',['-hide_banner','-nostdin','-v','info','-i',file,'-vn','-af','volumedetect','-f','null','-']);
  const match=r.stderr.match(/max_volume:\s*([-+\d.]+)\s*dB/);
  if(match)peakDbFS=Number(match[1]);
  else peakError='No measured max_volume in volumedetect log.';
} catch(e){peakError=String(e);}
const atoms=atomOffsets(file);
const chunks=args.chunks?JSON.parse(readFileSync(args.chunks,'utf8')):[{
  startFrame:0,endFrameExclusive:frameCount,sourceSha:args['render-source'],artifactId:args['direct-render']
}];
const mp4Sha256=await sha256();
const inputs={probe,frameCount,sourceSha:args['render-source'],expectedSourceSha:args['approved-source'],
  moovOffset:atoms.moov,mdatOffset:atoms.mdat,decoded,peakDbFS,chunks,mp4Sha256,
  artifactId:args['artifact-id'],workflowRunId:args['run-id'],videoPacketCfr:packetCfr};
const automated=auditDeliveryMetadata(inputs);
if(!packetCfr)automated.failures.push({code:'NON_CONSTANT_PACKET_TIMING',message:'Video packet pts not contiguous 30 fps / frame count differs.'});
if(!packetCfr)automated.pass=false;
const report={phase:'Y004-REAR-STEERING-01',role:'F',type:'AUTOMATED_NATIVE_MEDIA_QA',
  sourceSha:args['render-source'],artifactId:args['artifact-id']??null,workflowRunId:args['run-id']??null,
  mediaFile:file,mp4Sha256,packetCount:packets.length,packetCfr,mp4Atoms:atoms,
  decodeError,peakError,automated,visualReview:'NOT_PERFORMED_BY_THIS_SCRIPT',
  fullAudiovisualReview:'NOT_PERFORMED_BY_THIS_SCRIPT',creativeApproval:false};
writeFileSync(resolve(args.out),JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify({report:resolve(args.out),passed:automated.pass,failures:automated.failures,mp4Sha256}));
if(!automated.pass)process.exitCode=1;
