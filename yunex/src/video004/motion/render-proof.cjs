/**
 * Render isolated 2x4s TRUE NATIVE MP4s. Doesn't register permanent Y004 comp.
 * Run in yunex/ after npm ci:
 *   node src/video004/motion/render-proof.cjs
 *
 * Keeps deliverable media and logs in yunex/out (do not commit rendered MP4).
 * Writes evidence with actual git SHA, ffprobe stream info and decode checks.
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const cp=require('node:child_process');
const output=path.resolve(__dirname,'../../../out/y004-a-motion');
const root=path.resolve(__dirname,'../../../..');
const car=path.join(root,'cars/porsche-911-gt3-rs-992/model.glb');
const publicCar=path.resolve(__dirname,'../../../public/model.glb');
const expected='1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb';
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const command=(tool,args,opt={})=>{
  const v=cp.spawnSync(tool,args,{encoding:'utf8',stdio:'pipe',
    cwd:path.resolve(__dirname,'../../..'),maxBuffer:8*1024*1024,...opt});
  if (v.status!==0) throw new Error(tool+' '+args.join(' ')+'\n'+v.stdout+'\n'+v.stderr);
  return (v.stdout||'').trim();
};
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  if(!fs.existsSync(car)) throw new Error('Canonical Porsche model.glb unavailable');
  if(sha256(fs.readFileSync(car))!==expected) throw new Error('Approved P03 Porsche asset hash mismatch');
  fs.mkdirSync(path.dirname(publicCar),{recursive:true});
  if(!fs.existsSync(publicCar) || sha256(fs.readFileSync(publicCar))!==expected) {
    fs.copyFileSync(car,publicCar);
  }
  const sourceSHA=command('git',['rev-parse','HEAD']);
  command('npx',['tsx','src/video004/motion/motion.test.ts']);
  const entries=[
    {id:'Y004-A-LOW-DRIVE',file:'Y004_A_LOW_4s_NATIVE.mp4',range:[150,269]},
    {id:'Y004-A-HIGH-DRIVE',file:'Y004_A_HIGH_4s_NATIVE.mp4',range:[285,404]},
  ];
  const proofs=[];
  for(const v of entries) {
    const filepath=path.join(output,v.file);
    command('npx',['remotion','render','src/video004/motion/proof-entry.tsx',
      v.id,filepath,'--gl=swangle','--concurrency=2','--codec=h264',
      '--pixel-format=yuv420p','--crf=17','--timeout=300000','--muted'],
      {env:{...process.env,NODE_OPTIONS:'--require=./fix-network.cjs'}});
    const probe=JSON.parse(command('ffprobe',['-v','error','-show_streams',
      '-show_format','-of','json',filepath]));
    const video=probe.streams.find(s=>s.codec_type==='video');
    if(!video || video.width!==1080 || video.height!==1920 ||
       video.codec_name!=='h264' || video.pix_fmt!=='yuv420p' ||
       video.nb_frames!=='120' || video.r_frame_rate!=='30/1') {
      throw new Error('Native proof stream mismatch: '+JSON.stringify(video));
    }
    command('ffmpeg',['-v','error','-xerror','-i',filepath,'-f','null','-']);
    proofs.push({composition:v.id,path:filepath,sourceSHA,sourceFrames:v.range,
      fps:30,width:1080,height:1920,frames:120,durationSeconds:4,
      sha256:sha256(fs.readFileSync(filepath)),video});
  }
  const manifest={kind:'Y004_A_NATIVE_MOVING_PROOF',sourceSHA,
    sourceModelSHA256:expected,runner:'src/video004/motion/render-proof.cjs',
    status:'NATIVE_RENDERED_AND_FULL_DECODED',proofs};
  fs.writeFileSync(path.join(output,'evidence.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({sourceSHA,proofs:proofs.map(p=>({
    composition:p.composition,path:p.path,sha256:p.sha256}))},null,2));
})().catch(err=>{console.error(err);process.exitCode=1;});
