require('./fix-network.cjs');
const fs=require('fs'),path=require('path');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderMedia}=require('@remotion/renderer');
(async()=>{
 const mode=process.argv[2]||'review';
 if(mode==='final')fs.copyFileSync('out/YUNEX_001_V3_REVIEW.mp4','public/v3-review.mp4');
 const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});
 const chromiumOptions={gl:'swangle'};
 const browser=await openBrowser('chrome',{chromiumOptions});
 const composition=await selectComposition({serveUrl,id:mode==='final'?'YUNEX-001-V3-FINAL':'YUNEX-001-V3',chromiumOptions,puppeteerInstance:browser});
 await renderMedia({serveUrl,composition,chromiumOptions,puppeteerInstance:browser,timeoutInMilliseconds:120000,codec:'h264',crf:17,scale:1,concurrency:3,outputLocation:mode==='final'?'out/YUNEX_001_V3_FINAL.mp4':'out/YUNEX_001_V3_REVIEW.mp4',onProgress:p=>{if(p.renderedFrames%30===0)console.log('PROGRESS',p.renderedFrames,p.encodedFrames)}});
 await browser.close({silent:true});
})().catch(e=>{console.error(e);process.exit(1)});
