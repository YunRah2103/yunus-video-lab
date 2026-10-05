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

await browser.close();
console.log('matched refinement stills complete');
