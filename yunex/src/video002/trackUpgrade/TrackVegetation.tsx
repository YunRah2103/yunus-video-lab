import React,{useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {makeFoliageTexture} from './vegetation/foliageGeometry';
import {
  buildVegetationLayout,
  estimateVegetationBudget,
  type ShrubSpec,
  type TreeSpec,
  type VegetationQuality,
} from './vegetation/layout';
import {makeCanopyGeometry,makeGrassClumpGeometry} from './vegetation/treeGeometry';

export type TrackVegetationProps={quality:'preview'|'final';seed?:number};
type InstanceTransform={
  position:[number,number,number];
  rotation:[number,number,number];
  scale:[number,number,number];
  color:string;
};

const InstancedLayer:React.FC<{
  geometry:THREE.BufferGeometry;
  material:THREE.Material;
  instances:InstanceTransform[];
  castShadow?:boolean;
}>=({geometry,material,instances,castShadow=false})=>{
  const ref=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const object=new THREE.Object3D();
    const color=new THREE.Color();
    instances.forEach((item,index)=>{
      object.position.set(...item.position);
      object.rotation.set(...item.rotation);
      object.scale.set(...item.scale);
      object.updateMatrix();
      ref.current!.setMatrixAt(index,object.matrix);
      ref.current!.setColorAt(index,color.set(item.color));
    });
    ref.current.instanceMatrix.needsUpdate=true;
    if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;
    ref.current.computeBoundingSphere();
  },[instances]);
  if(instances.length===0)return null;
  return <instancedMesh ref={ref} args={[geometry,material,instances.length]} castShadow={castShadow} receiveShadow={false} frustumCulled={false}/>;
};

const canopyPatterns=[
  [[-.34,.18,.03,.62,.50,.57],[.31,.20,-.10,.60,.52,.55],[-.05,.37,.16,.66,.56,.62],[-.47,.44,-.07,.48,.44,.47],[.40,.48,.08,.50,.45,.49],[-.14,.64,-.10,.52,.46,.50],[.19,.80,.03,.39,.35,.38]],
  [[-.22,.16,-.06,.58,.55,.54],[.35,.24,.05,.55,.50,.51],[-.42,.37,.12,.52,.48,.49],[.08,.40,-.12,.64,.58,.60],[.43,.51,-.05,.46,.43,.44],[-.12,.62,.09,.50,.46,.48],[.18,.79,.03,.37,.34,.36]],
  [[-.37,.21,.09,.57,.49,.54],[.29,.17,-.09,.64,.49,.59],[-.04,.36,.02,.69,.56,.64],[-.49,.49,-.05,.45,.41,.44],[.42,.46,.10,.48,.41,.47],[-.16,.64,-.09,.48,.43,.46],[.21,.78,.05,.38,.34,.37]],
] as const;

const treeCanopyInstances=(tree:TreeSpec):InstanceTransform[]=>{
  const trunkTop=tree.height*.34;
  const pattern=canopyPatterns[tree.variant];
  return pattern.map((v,index)=>({
    position:[
      tree.x+v[0]*tree.crownWidth+tree.asymmetry*(index%2===0?.22:-.12),
      trunkTop+v[1]*tree.crownHeight,
      tree.z+v[2]*tree.crownWidth,
    ],
    rotation:[0,tree.yaw+index*.73,0],
    scale:[
      v[3]*tree.crownWidth*tree.density*1.08,
      v[4]*tree.crownHeight*tree.density*1.04,
      v[5]*tree.crownWidth*tree.density*1.08,
    ],
    color:tree.crownColor,
  }));
};

const shrubCanopyInstances=(shrub:ShrubSpec):InstanceTransform[]=>{
  const lobes=[
    [-.27,.34,.02,.58,.54,.56],
    [.26,.39,-.05,.64,.62,.60],
    [.02,.57,.10,.54,.58,.52],
  ] as const;
  return lobes.map((v,index)=>({
    position:[
      shrub.x+v[0]*shrub.width,
      v[1]*shrub.height,
      shrub.z+v[2]*shrub.width,
    ],
    rotation:[0,shrub.yaw+index*.91,0],
    scale:[v[3]*shrub.width,v[4]*shrub.height,v[5]*shrub.width],
    color:shrub.color,
  }));
};

const buildRenderInstances=(quality:VegetationQuality,seed:number)=>{
  const layout=buildVegetationLayout(seed,quality);
  const trunks:InstanceTransform[]=[];
  const branches:InstanceTransform[]=[];
  const canopy:[InstanceTransform[],InstanceTransform[],InstanceTransform[]]=[[],[],[]];

  layout.trees.forEach((tree,treeIndex)=>{
    const trunkHeight=tree.height*.52;
    const trunkRadius=Math.max(.07,tree.height*.038);
    trunks.push({
      position:[tree.x,trunkHeight*.5,tree.z],
      rotation:[0,tree.yaw,tree.lean],
      scale:[trunkRadius,trunkHeight,trunkRadius],
      color:tree.trunkColor,
    });
    const branchY=trunkHeight*.78;
    const branchLength=tree.height*.19;
    branches.push(
      {
        position:[tree.x-tree.crownWidth*.11,branchY,tree.z],
        rotation:[.08,tree.yaw+.45,.88+tree.lean],
        scale:[trunkRadius*.55,branchLength,trunkRadius*.55],
        color:tree.trunkColor,
      },
      {
        position:[tree.x+tree.crownWidth*.10,branchY+tree.height*.04,tree.z-.04],
        rotation:[-.12,tree.yaw-.8,-.82+tree.lean],
        scale:[trunkRadius*.48,branchLength*.86,trunkRadius*.48],
        color:tree.trunkColor,
      },
    );
    treeCanopyInstances(tree).forEach((item,lobeIndex)=>{
      canopy[(tree.variant+lobeIndex+treeIndex)%3].push(item);
    });
  });

  layout.shrubs.forEach((shrub,shrubIndex)=>{
    shrubCanopyInstances(shrub).forEach((item,lobeIndex)=>{
      canopy[(shrub.variant+lobeIndex+shrubIndex)%3].push(item);
    });
  });

  const grass:InstanceTransform[]=layout.grass.map((clump)=>({
    position:[clump.x,.015,clump.z],
    rotation:[0,clump.yaw,0],
    scale:[clump.scale,clump.scale,clump.scale],
    color:clump.color,
  }));

  return {
    layout,
    budget:estimateVegetationBudget(layout,quality),
    trunks,
    branches,
    canopy,
    grass,
  };
};

export const TrackVegetation:React.FC<TrackVegetationProps>=({quality,seed=2103})=>{
  const render=useMemo(()=>buildRenderInstances(quality,seed),[quality,seed]);
  const canopy0=useMemo(()=>makeCanopyGeometry(quality,0),[quality]);
  const canopy1=useMemo(()=>makeCanopyGeometry(quality,1),[quality]);
  const canopy2=useMemo(()=>makeCanopyGeometry(quality,2),[quality]);
  const trunkGeometry=useMemo(()=>new THREE.CylinderGeometry(.5,.68,1,7,1),[]);
  const branchGeometry=useMemo(()=>new THREE.CylinderGeometry(.35,.48,1,6,1),[]);
  const grassGeometry=useMemo(makeGrassClumpGeometry,[]);
  const leafTexture=useMemo(makeFoliageTexture,[]);

  const foliageMaterial=useMemo(
    ()=>new THREE.MeshStandardMaterial({
      color:'#ffffff',
      map:leafTexture,
      alphaTest:.5,
      side:THREE.DoubleSide,
      roughness:.94,
      metalness:0,
    }),
    [leafTexture],
  );
  const trunkMaterial=useMemo(
    ()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.98,metalness:0}),
    [],
  );
  const grassMaterial=useMemo(
    ()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,metalness:0,side:THREE.DoubleSide}),
    [],
  );

  useEffect(
    ()=>()=>{
      leafTexture.dispose();
      canopy0.dispose();
      canopy1.dispose();
      canopy2.dispose();
      trunkGeometry.dispose();
      branchGeometry.dispose();
      grassGeometry.dispose();
      foliageMaterial.dispose();
      trunkMaterial.dispose();
      grassMaterial.dispose();
    },
    [leafTexture,canopy0,canopy1,canopy2,trunkGeometry,branchGeometry,grassGeometry,foliageMaterial,trunkMaterial,grassMaterial],
  );

  return (
    <group
      name="Y002_TrackVegetation"
      userData={{trackIdentity:'layout-derived',seed,quality,budget:render.budget}}
    >
      <InstancedLayer geometry={trunkGeometry} material={trunkMaterial} instances={render.trunks} castShadow={quality==='final'}/>
      <InstancedLayer geometry={branchGeometry} material={trunkMaterial} instances={render.branches} castShadow={quality==='final'}/>
      <InstancedLayer geometry={canopy0} material={foliageMaterial} instances={render.canopy[0]}/>
      <InstancedLayer geometry={canopy1} material={foliageMaterial} instances={render.canopy[1]}/>
      <InstancedLayer geometry={canopy2} material={foliageMaterial} instances={render.canopy[2]}/>
      <InstancedLayer geometry={grassGeometry} material={grassMaterial} instances={render.grass}/>
    </group>
  );
};
