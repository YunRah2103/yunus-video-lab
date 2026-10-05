require('./fix-network.cjs');
const fs=require('fs');
const path=require('path');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill,renderMedia}=require('@remotion/renderer');

(async()=>{
  const outDir=path.resolve('track-refinement');
  fs.mkdirSync(outDir,{recursive:true});
  const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});
  const chromiumOptions={gl:'swangle'};
  const browser=await openBrowser('chrome',{chromiumOptions});

  const landscape=await selectComposition({
    serveUrl,id:'YUNEX-TRACK-PREVIEW',chromiumOptions,puppeteerInstance:browser
  });
  await renderStill({
    serveUrl,composition:landscape,chromiumOptions,puppeteerInstance:browser,
    timeoutInMilliseconds:120000,output:path.join(outDir,'after_landscape.png')
  });

  const portrait=await selectComposition({
    serveUrl,id:'YUNEX-TRACK-PORTRAIT',chromiumOptions,puppeteerInstance:browser
  });
  await renderStill({
    serveUrl,composition:portrait,chromiumOptions,puppeteerInstance:browser,
    timeoutInMilliseconds:120000,output:path.join(outDir,'portrait_hero.png')
  });

  const motion=await selectComposition({
    serveUrl,id:'YUNEX-TRACK-MOTION-PROOF',chromiumOptions,puppeteerInstance:browser
  });
  await renderMedia({
    serveUrl,composition:motion,codec:'h264',crf:17,concurrency:2,
    chromiumOptions,puppeteerInstance:browser,
    outputLocation:path.join(outDir,'portrait_motion_proof.mp4')
  });

  await browser.close({silent:true});
})().catch(e=>{console.error(e);process.exit(1)});
