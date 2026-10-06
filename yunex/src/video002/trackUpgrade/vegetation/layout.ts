import {sampleTrackAtLocalZ, TRACK_LAYOUT_CONFIG} from '../racetrack/layout';
import {GRASS_COLORS, SHRUB_COLORS, TREE_COLORS, TRUNK_COLORS} from './materials';
import {createSeededRandom, randomIndex, randomRange, randomSigned} from './rng';

export type VegetationQuality = 'preview' | 'final';
export type TreeSpec = {x:number;z:number;height:number;crownWidth:number;crownHeight:number;yaw:number;lean:number;asymmetry:number;variant:0|1|2;crownColor:string;trunkColor:string;density:number};
export type ShrubSpec = {x:number;z:number;width:number;height:number;yaw:number;variant:0|1|2;color:string};
export type GrassSpec = {x:number;z:number;scale:number;yaw:number;color:string};
export type VegetationLayout = {trees:TreeSpec[];shrubs:ShrubSpec[];grass:GrassSpec[]};
type Side='left'|'right';

const CAMERA_CORRIDORS=[
  {zMin:4.1,zMax:10.6,xMin:-10.4},
  {zMin:-14.8,zMax:-8.2,xMin:-8.8},
] as const;

const inCameraCorridor=(x:number,z:number)=>
  CAMERA_CORRIDORS.some((corridor)=>z>=corridor.zMin&&z<=corridor.zMax&&x>corridor.xMin);

const tracksidePoint=(z:number,side:Side,distance:number)=>{
  const safeZ=Math.max(TRACK_LAYOUT_CONFIG.sampleMinZ+.5,Math.min(TRACK_LAYOUT_CONFIG.sampleMaxZ-.5,z));
  const sample=sampleTrackAtLocalZ(safeZ);
  const anchor=side==='left'?sample.landscapeLeft:sample.landscapeRight;
  const direction=side==='left'?1:-1;
  return {x:anchor[0]+sample.leftNormal[0]*distance*direction,z:safeZ};
};

const retryPoint=(
  random:ReturnType<typeof createSeededRandom>,
  z:number,
  side:Side,
  minDistance:number,
  maxDistance:number,
)=>{
  for(let attempt=0;attempt<8;attempt++){
    const offset=(attempt%2===0?-1:1)*attempt*1.55;
    const point=tracksidePoint(z+randomSigned(random,.7)+offset,side,randomRange(random,minDistance,maxDistance));
    if(!inCameraCorridor(point.x,point.z))return point;
  }
  return tracksidePoint(z+(side==='right'?12:-12),side,maxDistance+4.5);
};

const pushTreeCluster=(
  trees:TreeSpec[],
  random:ReturnType<typeof createSeededRandom>,
  centerZ:number,
  count:number,
  side:Side,
)=>{
  for(let i=0;i<count;i++){
    const far=random()<.34;
    const z=centerZ+randomSigned(random,3.6)+randomSigned(random,1.1);
    const point=retryPoint(random,z,side,far?6.8:1.25,far?13.5:6.2);
    const height=far?randomRange(random,4.2,6.8):randomRange(random,2.8,5.1);
    trees.push({
      x:point.x,z:point.z,height,
      crownWidth:randomRange(random,1.55,2.75)*(far?1.12:1),
      crownHeight:randomRange(random,1.55,2.8),
      yaw:randomRange(random,-Math.PI,Math.PI),
      lean:randomSigned(random,.045),
      asymmetry:randomSigned(random,.28),
      variant:randomIndex(random,3) as 0|1|2,
      crownColor:TREE_COLORS[randomIndex(random,TREE_COLORS.length)],
      trunkColor:TRUNK_COLORS[randomIndex(random,TRUNK_COLORS.length)],
      density:randomRange(random,.8,1.08),
    });
  }
};

const pushShrubCluster=(
  shrubs:ShrubSpec[],
  random:ReturnType<typeof createSeededRandom>,
  centerZ:number,
  count:number,
  side:Side,
)=>{
  for(let i=0;i<count;i++){
    const z=centerZ+randomSigned(random,4.1);
    const point=retryPoint(random,z,side,.6,3.4);
    shrubs.push({
      x:point.x,z:point.z,
      width:randomRange(random,.65,1.5),
      height:randomRange(random,.45,1.18),
      yaw:randomRange(random,-Math.PI,Math.PI),
      variant:randomIndex(random,3) as 0|1|2,
      color:SHRUB_COLORS[randomIndex(random,SHRUB_COLORS.length)],
    });
  }
};

const pushGrass=(
  grass:GrassSpec[],
  random:ReturnType<typeof createSeededRandom>,
  count:number,
  zMin:number,
  zMax:number,
)=>{
  let attempts=0;
  while(grass.length<count&&attempts<count*14){
    attempts++;
    const z=randomRange(random,zMin,zMax);
    const side:Side=random()<.54?'left':'right';
    const point=tracksidePoint(z,side,randomRange(random,.35,2.45));
    if(inCameraCorridor(point.x,point.z))continue;
    const rhythm=Math.sin(z*.41)+(side==='left'?Math.sin(z*.13+1.2):Math.cos(z*.17-.6));
    if(random()>.58+rhythm*.1)continue;
    grass.push({
      x:point.x,z:point.z,
      scale:randomRange(random,.52,1.12),
      yaw:randomRange(random,-Math.PI,Math.PI),
      color:GRASS_COLORS[randomIndex(random,GRASS_COLORS.length)],
    });
  }
};

export const buildVegetationLayout=(seed=2103,quality:VegetationQuality='final'):VegetationLayout=>{
  const random=createSeededRandom(seed);
  const trees:TreeSpec[]=[];
  const shrubs:ShrubSpec[]=[];
  const grass:GrassSpec[]=[];
  const centers=quality==='final'?[-31,-21,-11,1,14,26,35]:[-28,-14,1,16,31];

  centers.forEach((center,index)=>{
    pushTreeCluster(trees,random,center,quality==='final'?(index===3?3:4):3,'left');
    pushTreeCluster(trees,random,center+1.1,quality==='final'?(index===3?2:3):2,'right');
    pushShrubCluster(shrubs,random,center-.8,quality==='final'?7:5,'left');
    pushShrubCluster(shrubs,random,center+1.4,quality==='final'?5:4,'right');
  });
  pushGrass(grass,random,quality==='final'?300:150,-34,37);
  return {trees,shrubs,grass};
};

export type VegetationBudget={
  treeCount:number;shrubCount:number;grassCount:number;
  approximateTriangles:number;approximateDrawCalls:number;transparentObjectCount:number;
};

export const estimateVegetationBudget=(layout:VegetationLayout,quality:VegetationQuality):VegetationBudget=>{
  const canopyTriangles=quality==='final'?108:70;
  const treeLobes=layout.trees.length*7;
  const shrubLobes=layout.shrubs.length*3;
  const trunkTriangles=layout.trees.length*28;
  const branchTriangles=layout.trees.length*2*24;
  const grassTriangles=layout.grass.length*5;
  return {
    treeCount:layout.trees.length,
    shrubCount:layout.shrubs.length,
    grassCount:layout.grass.length,
    approximateTriangles:(treeLobes+shrubLobes)*canopyTriangles+trunkTriangles+branchTriangles+grassTriangles,
    approximateDrawCalls:6,
    transparentObjectCount:0,
  };
};

export const vegetationLayoutSignature=(layout:VegetationLayout)=>JSON.stringify(layout);

const signedLateral=(x:number,z:number)=>{
  const sample=sampleTrackAtLocalZ(z);
  return (x-sample.center[0])*sample.leftNormal[0]+(z-sample.center[1])*sample.leftNormal[1];
};

const landscapeOffset=(side:Side,z:number)=>{
  const sample=sampleTrackAtLocalZ(z);
  const edge=side==='left'?sample.landscapeLeft:sample.landscapeRight;
  return Math.hypot(edge[0]-sample.center[0],edge[1]-sample.center[1]);
};

export const validateVegetationLayout=(layout:VegetationLayout)=>{
  const violations:string[]=[];
  const check=(label:string,x:number,z:number)=>{
    const lateral=signedLateral(x,z);
    const side:Side=lateral>=0?'left':'right';
    if(Math.abs(lateral)<landscapeOffset(side,z)-.08){
      violations.push(`${label} intrudes inside landscape exclusion at z=${z.toFixed(2)}`);
    }
    if(inCameraCorridor(x,z))violations.push(`${label} inside protected camera corridor`);
  };
  layout.trees.forEach((item)=>check('tree',item.x,item.z));
  layout.shrubs.forEach((item)=>check('shrub',item.x,item.z));
  layout.grass.forEach((item)=>check('grass',item.x,item.z));
  if(layout.trees.some((item)=>item.z<TRACK_LAYOUT_CONFIG.sampleMinZ||item.z>TRACK_LAYOUT_CONFIG.sampleMaxZ)){
    violations.push('tree outside layout sample range');
  }
  return violations;
};
