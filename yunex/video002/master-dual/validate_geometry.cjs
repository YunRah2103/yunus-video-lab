const fs=require('fs'),path=require('path'),esbuild=require('esbuild'),root=process.cwd();
function load(relative,exports){
 const filename=path.join(root,relative);
 const result=esbuild.buildSync({stdin:{contents:fs.readFileSync(filename,'utf8')+'\nexport {'+exports.join(',')+'};',resolveDir:path.dirname(filename),sourcefile:filename,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',external:['react','three'],logLevel:'silent'});
 const output=path.join(root,'node_modules/.cache/geometry-'+path.basename(relative)+'.cjs');
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,result.outputFiles[0].text);return require(output);
}
const layout=load('src/video002/trackUpgrade/racetrack/layout.ts',[]),report=layout.assertTrackLayoutContract();
function upward(g,name){const n=g.getAttribute('normal');for(let i=0;i<n.count;i++)if(n.getY(i)<.999)throw Error(name+' vertex '+i+' downward: '+n.getY(i));g.dispose();}
const surface=load('src/video002/trackUpgrade/racetrack/Surface.tsx',['makeRibbonGeometry']);
upward(surface.makeRibbonGeometry(layout.TRACK_LAYOUT_SAMPLES,s=>[s.roadLeft,s.roadRight],-.0104),'asphalt');
for(const name of ['Runoff','Terrain']){const mod=load('src/video002/trackUpgrade/racetrack/'+name+'.tsx',['buildStripGeometry']);for(const side of ['Left','Right'])upward(name==='Runoff'?mod.buildStripGeometry(s=>s['road'+side],s=>s['runoff'+side],'final',-.0086):mod.buildStripGeometry(s=>s['barrier'+side],s=>s['landscape'+side],'final'),name+side);}
const kerbs=load('src/video002/trackUpgrade/racetrack/Kerbs.tsx',['buildSegments','makeKerbGeometry']),g=kerbs.makeKerbGeometry(kerbs.buildSegments()),idx=g.index,p=g.getAttribute('position');
for(let i=0;i<idx.count;i+=30)for(let t=0;t<6;t+=3){const a=idx.getX(i+t),b=idx.getX(i+t+1),c=idx.getX(i+t+2);const y=(p.getZ(b)-p.getZ(a))*(p.getX(c)-p.getX(a))-(p.getX(b)-p.getX(a))*(p.getZ(c)-p.getZ(a));if(y<=0)throw Error('Kerb top backface at '+i);}
g.dispose();console.log(JSON.stringify({verdict:'PASS',layout:report,upwardSurfaces:['asphalt','left/right runoff','left/right terrain','left/right kerb tops']},null,2));
