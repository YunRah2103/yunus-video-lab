#!/usr/bin/env node
/**
 * Native 1080x1920 mechanical B moving proof. Run from yunex/ after npm ci.
 * Requires a checked-out locked Porsche GLB and ffmpeg/ffprobe on the runner.
 * Does NOT commit generated MP4s or alter global Remotion registration.
 */
'use strict';
const cp=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const source=path.resolve('../cars/porsche-911-gt3-rs-992/model.glb');
const destination=path.resolve('public/model.glb');
const output=path.resolve('out/y004-b-rig');
const expectedModelHash='1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb';
const sha256=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const run=(cmd,args)=>{
 console.log('$ '+cmd+' '+args.join(' '));
 try{
  return cp.execFileSync(cmd,args,{encoding:'utf8',
   env:{...process.env,NODE_OPTIONS:'--require=./fix-network.cjs'},
   maxBuffer:8*1024*1024});
 }catch(error){
  console.error(error.stdout?.toString(),error.stderr?.toString());
  throw error;
 }
};
if(!fs.existsSync(source))throw Error('Y004 B: locked actual Porsche GLB absent');
if(sha256(source)!==expectedModelHash)throw Error('Y004 B: Porsche GLB SHA256 mismatch');
fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.copyFileSync(source,destination);
fs.mkdirSync(output,{recursive:true});
const sourceSha=run('git',['rev-parse','HEAD']).trim();
run('npx',['--yes','tsx','src/video004/rig/rig.test.ts']);
const proofs=[];
for(const [regime,comp] of [
 ['low','YUNEX-004-B-LOW-MACRO'],['high','YUNEX-004-B-HIGH-MACRO']
]){
 const video=path.join(output,'y004-b-'+regime+'-macro.mp4');
 run('npx',['remotion','render','src/video004/rig/proof-entry.tsx',comp,video,
  '--frames=0-149','--gl=swangle','--concurrency=2','--codec=h264',
  '--pixel-format=yuv420p','--crf=17','--muted','--timeout=120000']);
 run('ffmpeg',['-v','error','-xerror','-i',video,'-f','null','-']);
 const data=JSON.parse(run('ffprobe',['-v','error','-count_frames',
  '-show_entries',
  'stream=codec_name,pix_fmt,width,height,r_frame_rate,nb_read_frames:format=duration',
  '-of','json',video]));
 const stream=data.streams.find(s=>s.codec_name==='h264');
 if(!stream||stream.width!==1080||stream.height!==1920||
    stream.pix_fmt!=='yuv420p'||stream.r_frame_rate!=='30/1'||
    Number(stream.nb_read_frames)!==150||
    Math.abs(Number(data.format.duration)-5)>1/30){
  throw Error('Y004 B: native '+regime+' proof validation failed '+JSON.stringify(data));
 }
 proofs.push({regime,composition:comp,file:path.relative(process.cwd(),video),
  sha256:sha256(video),range:[0,149],frames:150,width:1080,
  height:1920,fps:30,durationS:Number(data.format.duration),
  codec:'h264',pixelFormat:'yuv420p'});
}
const manifest={phase:'Y004-REAR-STEERING-01',owner:'B',
 sourceSha,modelSha256:expectedModelHash,fixtureOnly:true,
 agentAMotionSha:null,proofs};
fs.writeFileSync(path.join(output,'proof-manifest.json'),
 JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest,null,2));
