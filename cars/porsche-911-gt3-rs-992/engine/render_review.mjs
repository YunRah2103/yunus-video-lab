import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.join(here,'renders');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-gpu-sandbox']});
const page=await browser.newPage({viewport:{width:1600,height:1200},deviceScaleFactor:1});
page.on('console',m=>console.log('[browser:'+m.type()+'] '+m.text()));page.on('pageerror',e=>console.error('[browser:error] '+e.message));
const base='http://127.0.0.1:8000/cars/porsche-911-gt3-rs-992/engine/review.html';
for(const [v,f] of [['isolated','review_isolated_rear_three_quarter.png'],['side','review_installed_side.png'],['top','review_installed_top.png']]){
  await page.goto(base+'?view='+v,{waitUntil:'networkidle',timeout:120000});
  await page.waitForFunction(()=>window.__reviewReady===true,{timeout:120000});
  await page.screenshot({path:path.join(out,f),fullPage:true});console.log('rendered '+f);
}
await browser.close();
