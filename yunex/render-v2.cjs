require('./fix-network.cjs');
const fs=require('fs'),path=require('path');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill,renderMedia}=require('@remotion/renderer');
(async()=>{
 const mode=process.argv[2]||'stills';fs.mkdirSync('out/v2',{recursive:true});
 if(mode==='final')fs.copyFileSync('out/YUNEX_001_V2_REVIEW.mp4','public/v2-review.mp4');
 const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});
 const chromiumOptions={gl:'swangle'};
 const browser=await openBrowser('chrome',{chromiumOptions});
 const composition=await selectComposition({serveUrl,id:mode==='final'?'YUNEX-001-V2-FINAL':'YUNEX-001-V2',chromiumOptions,puppeteerInstance:browser});
 const shared={serveUrl,composition,chromiumOptions,puppeteerInstance:browser,timeoutInMilliseconds:120000};
 if(mode==='stills')for(const frame of [24,135,228,297,435,507,609,750]){
  await renderStill({...shared,frame,output:`out/v2/frame-${frame}.png`});console.log('STILL',frame);
 }
 else await renderMedia({...shared,codec:'h264',crf:17,scale:1,concurrency:3,frameRange:mode==='bench'?[120,134]:undefined,outputLocation:mode==='bench'?'out/v2/benchmark.mp4':mode==='final'?'out/YUNEX_001_V2_FINAL.mp4':'out/YUNEX_001_V2_REVIEW.mp4',onProgress:p=>{if(p.renderedFrames%30===0)console.log('PROGRESS',p.renderedFrames,p.encodedFrames)}});
 await browser.close({silent:true});
})().catch(e=>{console.error(e);process.exit(1)});
