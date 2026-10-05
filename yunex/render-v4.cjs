require('./fix-network.cjs');
const fs=require('fs'),path=require('path');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill,renderMedia}=require('@remotion/renderer');
(async()=>{
 const mode=process.argv[2]||'stills';fs.mkdirSync('out/v4',{recursive:true});
 let serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});
 const chromiumOptions={gl:'swangle'};
 const browser=await openBrowser('chrome',{chromiumOptions});
 const cleanPlates=[
  ['public/v4-track-opening-clean.png','YUNEX-TRACK-FILM-OPENING',24],
  ['public/v4-track-final-clean.png','YUNEX-TRACK-FILM-FINAL',720],
 ];
 for(const [output,id,frame] of cleanPlates){
  if(!fs.existsSync(output)){
   const plateComposition=await selectComposition({serveUrl,id,chromiumOptions,puppeteerInstance:browser});
   await renderStill({serveUrl,composition:plateComposition,chromiumOptions,puppeteerInstance:browser,timeoutInMilliseconds:120000,frame,output});
   console.log('PLATE',id,output);
  }
 }
 if(mode==='final'){
  if(!fs.existsSync('out/YUNEX_001_V4_REVIEW.mp4'))throw new Error('Render review first: node render-v4.cjs review');
  fs.copyFileSync('out/YUNEX_001_V4_REVIEW.mp4','public/v4-review.mp4');
 }
 // Remotion's bundle snapshots public/. Rebundle after generating plates and
 // copying the newest review so fresh checkouts never render stale/missing media.
 await browser.close({silent:true});
 serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});
 const renderBrowser=await openBrowser('chrome',{chromiumOptions});
 const composition=await selectComposition({serveUrl,id:mode==='final'?'YUNEX-001-V4-FINAL':'YUNEX-001-V4',chromiumOptions,puppeteerInstance:renderBrowser});
 const shared={serveUrl,composition,chromiumOptions,puppeteerInstance:renderBrowser,timeoutInMilliseconds:120000};
 if(mode==='stills'){
  for(const frame of [24,65,145,297,450,610,720,800]){
   await renderStill({...shared,frame,output:`out/v4/frame-${frame}.png`});console.log('STILL',frame);
  }
 }else{
  await renderMedia({...shared,codec:'h264',crf:17,scale:1,concurrency:3,outputLocation:mode==='final'?'out/YUNEX_001_V4_FINAL.mp4':'out/YUNEX_001_V4_REVIEW.mp4',onProgress:p=>{if(p.renderedFrames%30===0)console.log('PROGRESS',p.renderedFrames,p.encodedFrames)}});
 }
 await renderBrowser.close({silent:true});
})().catch(e=>{console.error(e);process.exit(1)});
