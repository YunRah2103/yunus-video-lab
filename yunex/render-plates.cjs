require('./fix-network.cjs');
const path=require('path'),fs=require('fs');
const {bundle}=require('@remotion/bundler');
const {selectComposition,renderStill,renderFrames}=require('@remotion/renderer');
(async()=>{
fs.mkdirSync('public/plates',{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});const chromiumOptions={gl:'swangle'};
for(const [name,inputProps] of [
 ['rear-solid',{view:'rear',width:1080,height:1000,zoom:205}],
 ['rear-cutaway',{view:'rear',width:1080,height:1000,zoom:205,ghost:.92,engine:true}],
 ['side-cutaway',{view:'side',width:1080,height:850,zoom:185,ghost:.93,engine:true}],
 ['side-grip',{view:'side',width:1080,height:850,zoom:185,ghost:.56,engine:true,grip:true}],
 ['front',{view:'front',width:1080,height:950,zoom:198}],
]){const composition=await selectComposition({serveUrl,id:'CarPlate',inputProps,chromiumOptions});await renderStill({serveUrl,composition,inputProps,output:`public/plates/${name}.png`,imageFormat:'png',chromiumOptions});console.log('Plate',name)}
const composition=await selectComposition({serveUrl,id:'RotationPlate',chromiumOptions});
await renderFrames({serveUrl,composition,outputDir:null,inputProps:{},imageFormat:'png',chromiumOptions,concurrency:1,onStart:()=>{},onFrameUpdate:(n)=>console.log('Rotation',n),onFrameBuffer:(buffer,frame)=>fs.writeFileSync(`public/plates/top-${String(frame).padStart(3,'0')}.png`,buffer)});
})().catch(e=>{console.error(e);process.exit(1)});
