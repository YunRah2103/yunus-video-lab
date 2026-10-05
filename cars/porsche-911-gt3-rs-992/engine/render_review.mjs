import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const execFileAsync=promisify(execFile);
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.join(here,'renders');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-gpu-sandbox']});
const base='http://127.0.0.1:8000/cars/porsche-911-gt3-rs-992/engine/review.html';

async function renderView(asset,variant,view,file){
  const page=await browser.newPage({viewport:{width:1600,height:1200},deviceScaleFactor:1});
  page.on('console',m=>console.log('[browser:'+m.type()+'] '+m.text()));
  page.on('pageerror',e=>console.error('[browser:error] '+e.message));
  const q='?view='+encodeURIComponent(view)+'&asset='+encodeURIComponent(asset)+'&variant='+encodeURIComponent(variant);
  await page.goto(base+q,{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.__reviewReady===true,{timeout:120000});
  await page.screenshot({path:path.join(out,file),fullPage:true});
  await page.close();
  console.log('rendered '+file);
}
for(const [asset,variant,view,file] of [
  ['./engine_before.glb','BEFORE','isolated','before_rear_three_quarter.png'],
  ['./engine.glb','AFTER','isolated','after_rear_three_quarter.png'],
  ['./engine_before.glb','BEFORE','close','before_close_three_quarter.png'],
  ['./engine.glb','AFTER','close','after_close_three_quarter.png'],
  ['./engine.glb','AFTER','side','after_installed_side.png'],
  ['./engine.glb','AFTER','top','after_installed_top.png'],
  ['./engine.glb','AFTER','exploded','after_exploded.png'],
]) await renderView(asset,variant,view,file);

const frames=path.join(out,'_turntable_frames');
await fs.rm(frames,{recursive:true,force:true});await fs.mkdir(frames,{recursive:true});
const turn=await browser.newPage({viewport:{width:960,height:720},deviceScaleFactor:1});
turn.on('pageerror',e=>console.error('[turntable:error] '+e.message));
await turn.goto(base+'?view=turntable&asset=.%2Fengine.glb&variant=AFTER',{waitUntil:'networkidle',timeout:120000});
await turn.waitForFunction(()=>window.__reviewReady===true,{timeout:120000});
const fps=18,seconds=6,total=fps*seconds;
for(let i=0;i<total;i++){
  const angle=(i/total)*Math.PI*2;
  await turn.evaluate(a=>window.__setTurntableAngle(a),angle);
  const name='frame_'+String(i).padStart(3,'0')+'.png';
  await turn.screenshot({path:path.join(frames,name)});
}
await turn.close();await browser.close();

const mp4=path.join(out,'engine_turntable_after.mp4');
const result=await execFileAsync('ffmpeg',[
  '-y','-framerate',String(fps),'-i',path.join(frames,'frame_%03d.png'),
  '-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart','-crf','19','-preset','medium',
  '-t',String(seconds),mp4
],{maxBuffer:20*1024*1024});
if(result.stderr)console.log(result.stderr.split('\n').slice(-8).join('\n'));
await fs.rm(frames,{recursive:true,force:true});
console.log('rendered engine_turntable_after.mp4');