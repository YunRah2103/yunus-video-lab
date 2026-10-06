const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'TrackLighting.tsx'),'utf8');
const profile=fs.readFileSync(path.join(__dirname,'profile.ts'),'utf8');
const textures=fs.readFileSync(path.join(__dirname,'textures.ts'),'utf8');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

assert(source.includes("quality:TrackLightingQuality"),'quality prop missing');
assert(source.includes('seed?:number'),'seed prop missing');
assert(source.includes('rootPoseAt(frame)'),'lighting/contact does not follow moving car');
assert(source.includes('castShadow'),'shadow-casting key light missing');
assert(source.includes('PMREMGenerator'),'cached PMREM environment missing');
assert(source.includes("position={[carX,-0.036,carZ+0.10]}"),'moving contact catcher missing');
assert(!source.includes('Math.random'),'per-frame/non-deterministic random is forbidden');
assert(!textures.includes('Math.random'),'texture generation must remain deterministic');
assert(!source.includes('.material='),'Porsche materials must not be mutated');
assert(!source.includes('traverse('),'TrackLighting must not mutate the Porsche scene graph');
assert(profile.includes('toneMappingExposure:0.94'),'manager exposure recommendation changed unexpectedly');
assert(profile.includes("shadowMapType:'PCFSoftShadowMap'"),'shadow map recommendation missing');
assert(profile.includes('shadowMapSize:2048'),'final shadow map must be 2048');

console.log('D lighting contract OK: deterministic sky, moving key/contact, preserved car materials, final 2048 shadow profile');
