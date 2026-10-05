require('./fix-network.cjs');
const path=require('path');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
(async()=>{
 const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});
 const chromiumOptions={gl:'swangle'};
 const browser=await openBrowser('chrome',{chromiumOptions});
 const composition=await selectComposition({serveUrl,id:'YUNEX-TRACK-PREVIEW',chromiumOptions,puppeteerInstance:browser});
 await renderStill({serveUrl,composition,chromiumOptions,puppeteerInstance:browser,timeoutInMilliseconds:120000,output:'out/YUNEX_GT3RS_TRACK_FINAL.png'});
 await browser.close({silent:true});
})().catch(e=>{console.error(e);process.exit(1)});
