require('./fix-network.cjs');
const path=require('path'),fs=require('fs');
const {bundle}=require('@remotion/bundler');
const {selectComposition,renderStill}=require('@remotion/renderer');
(async()=>{fs.mkdirSync('out/qa',{recursive:true});const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});const composition=await selectComposition({serveUrl,id:'YUNEX-001',chromiumOptions:{gl:'swangle'}});for(const frame of [12,45,120,200,290,325,360,440,510,570,620,700,780]){await renderStill({serveUrl,composition,frame,output:`out/qa/${frame}.png`,chromiumOptions:{gl:'swangle'}});console.log('QA',frame)}})().catch(e=>{console.error(e);process.exit(1)});
