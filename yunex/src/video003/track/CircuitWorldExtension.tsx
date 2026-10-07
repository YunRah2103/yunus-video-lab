import React,{useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {
  sampleTrackAtLocalZ,
  trackLocalToWorldXZ,
  TRACK_LAYOUT_CONFIG,
} from '../../video002/trackUpgrade/racetrack/layout';
import {makeFoliageGeometry,makeFoliageTexture} from '../../video002/trackUpgrade/vegetation/foliageGeometry';
import {
  auditY003CircuitCoverage,
  Y003_CIRCUIT_EXTENSION_RANGES,
} from './coverage';

export type Y003CircuitWorldExtensionProps={
  quality?:'preview'|'final';
  seed?:number;
};

type Side='left'|'right';
type Instance={
  position:[number,number,number];
  rotation:[number,number,number];
  scale:[number,number,number];
  color:string;
};

const ROOT_Y=TRACK_LAYOUT_CONFIG.rootPosition[1];

const makeRng=(seed:number)=>{
  let state=seed>>>0;
  return ()=>{
    state=(Math.imul(state,1664525)+1013904223)>>>0;
    return state/4294967296;
  };
};

const worldPointAt=(
  z:number,
  side:Side,
  source:'barrier'|'landscape',
  outward:number,
  y:number,
):[number,number,number]=>{
  const sample=sampleTrackAtLocalZ(z);
  const anchor=
    source==='barrier'
      ?(side==='left'?sample.barrierLeft:sample.barrierRight)
      :(side==='left'?sample.landscapeLeft:sample.landscapeRight);
  const sign=side==='left'?1:-1;
  const local:[number,number]=[
    anchor[0]+sample.leftNormal[0]*outward*sign,
    anchor[1]+sample.leftNormal[1]*outward*sign,
  ];
  const world=trackLocalToWorldXZ(local);
  return [world[0],ROOT_Y+y,world[1]];
};

const worldPointBeyondExit=(
  z:number,
  lateralFromCenter:number,
  y:number,
):[number,number,number]=>{
  const end=sampleTrackAtLocalZ(TRACK_LAYOUT_CONFIG.sampleMaxZ);
  const beyond=Math.max(0,z-end.z);
  const center:[number,number]=[
    end.center[0]+end.tangent[0]*beyond,
    end.center[1]+end.tangent[1]*beyond,
  ];
  const local:[number,number]=[
    center[0]+end.leftNormal[0]*lateralFromCenter,
    center[1]+end.leftNormal[1]*lateralFromCenter,
  ];
  const world=trackLocalToWorldXZ(local);
  return [world[0],ROOT_Y+y,world[1]];
};

const segmentPose=(
  a:[number,number,number],
  b:[number,number,number],
  y:number,
)=>{
  const dx=b[0]-a[0];
  const dz=b[2]-a[2];
  return {
    position:[(a[0]+b[0])/2,ROOT_Y+y,(a[2]+b[2])/2] as [number,number,number],
    yaw:Math.atan2(dx,dz),
    length:Math.hypot(dx,dz),
  };
};

const pushRailRange=(
  target:{
    panels:Instance[];
    rails:Instance[];
    posts:Instance[];
  },
  side:Side,
  from:number,
  to:number,
  step:number,
)=>{
  for(let z=from;z<to-1e-6;z+=step){
    const next=Math.min(to,z+step);
    const a=worldPointAt(z,side,'barrier',0,.44);
    const b=worldPointAt(next,side,'barrier',0,.44);
    const pose=segmentPose(a,b,.44);
    target.panels.push({
      position:pose.position,
      rotation:[0,pose.yaw,0],
      scale:[.075,.30,Math.max(.16,pose.length-.025)],
      color:'#aeb4b4',
    });
    target.rails.push(
      {
        position:[pose.position[0],ROOT_Y+.525,pose.position[2]],
        rotation:[0,pose.yaw,0],
        scale:[.052,.052,Math.max(.16,pose.length-.03)],
        color:'#d0d3d2',
      },
      {
        position:[pose.position[0],ROOT_Y+.355,pose.position[2]],
        rotation:[0,pose.yaw,0],
        scale:[.052,.052,Math.max(.16,pose.length-.03)],
        color:'#858c8d',
      },
    );
  }

  for(let z=from;z<=to+1e-6;z+=step){
    const p=worldPointAt(z,side,'barrier',.12,.23);
    const tangent=sampleTrackAtLocalZ(z).tangent;
    const worldYaw=Math.atan2(-tangent[0],-tangent[1]);
    target.posts.push({
      position:p,
      rotation:[0,worldYaw,0],
      scale:[.09,.82,.12],
      color:'#666d6f',
    });
  }
};

const pushFenceSection=(
  target:{posts:Instance[];rails:Instance[]},
  side:Side,
  from:number,
  to:number,
  step:number,
)=>{
  for(let z=from;z<=to+1e-6;z+=step){
    const p=worldPointAt(z,side,'barrier',.42,1.25);
    const tangent=sampleTrackAtLocalZ(z).tangent;
    const worldYaw=Math.atan2(-tangent[0],-tangent[1]);
    target.posts.push({
      position:p,
      rotation:[0,worldYaw,0],
      scale:[.045,1.72,.055],
      color:'#6d7575',
    });
  }
  for(let z=from;z<to-1e-6;z+=step){
    const next=Math.min(to,z+step);
    const a=worldPointAt(z,side,'barrier',.42,0);
    const b=worldPointAt(next,side,'barrier',.42,0);
    for(const y of [.76,1.22,1.68]){
      const pose=segmentPose(a,b,y);
      target.rails.push({
        position:pose.position,
        rotation:[0,pose.yaw,0],
        scale:[.022,.022,pose.length],
        color:'#7d8585',
      });
    }
  }
};

const buildLayout=(quality:'preview'|'final',seed:number)=>{
  const rng=makeRng(seed);
  const rail={panels:[] as Instance[],rails:[] as Instance[],posts:[] as Instance[]};
  const fence={posts:[] as Instance[],rails:[] as Instance[]};
  const boards:Instance[]=[];
  const boardAccents:Instance[]=[];
  const trunks:Instance[]=[];
  const crowns:Instance[]=[];
  const shrubs:Instance[]=[];
  const ridges:Instance[]=[];
  const gantryMetal:Instance[]=[];
  const gantryPanels:Instance[]=[];
  const gantryAccents:Instance[]=[];

  const railStep=quality==='final'?2.45:3.7;
  Y003_CIRCUIT_EXTENSION_RANGES.forEach((range)=>{
    pushRailRange(rail,'left',range.minZ,range.maxZ,railStep);
    pushRailRange(rail,'right',range.minZ,range.maxZ,railStep);
  });

  const fenceSections=[
    {side:'left' as const,from:-58,to:-43},
    {side:'right' as const,from:68,to:92},
    {side:'left' as const,from:110,to:139},
  ];
  fenceSections.forEach((section)=>
    pushFenceSection(fence,section.side,section.from,section.to,quality==='final'?3.7:5.5)
  );

  const markerStations=[
    {z:-54,side:'right' as const},
    {z:-42,side:'left' as const},
    {z:48,side:'right' as const},
    {z:62,side:'left' as const},
    {z:79,side:'right' as const},
    {z:97,side:'left' as const},
    {z:118,side:'right' as const},
    {z:133,side:'left' as const},
  ];
  markerStations.forEach((marker,index)=>{
    const p=worldPointAt(marker.z,marker.side,'barrier',.62,.80);
    const sample=sampleTrackAtLocalZ(marker.z);
    const yaw=Math.atan2(-sample.tangent[0],-sample.tangent[1]);
    boards.push({
      position:p,
      rotation:[0,yaw,0],
      scale:[.82,1.06,.055],
      color:index%3===0?'#e5e2d8':'#d2d7d4',
    });
    boardAccents.push({
      position:[p[0],p[1]+.18,p[2]],
      rotation:[0,yaw,0],
      scale:[.58,.15,.064],
      color:index%2===0?'#a12b26':'#30383a',
    });
  });

  const gantryStations=[52,101,139];
  gantryStations.forEach((z,index)=>{
    const left=worldPointAt(z,'left','barrier',.34,0);
    const right=worldPointAt(z,'right','barrier',.34,0);
    const beam=segmentPose(left,right,4.18);
    const tangent=sampleTrackAtLocalZ(z).tangent;
    const postYaw=Math.atan2(-tangent[0],-tangent[1]);
    gantryMetal.push(
      {
        position:[left[0],ROOT_Y+2.08,left[2]],
        rotation:[0,postYaw,0],
        scale:[.14,4.16,.18],
        color:'#555d5e',
      },
      {
        position:[right[0],ROOT_Y+2.08,right[2]],
        rotation:[0,postYaw,0],
        scale:[.14,4.16,.18],
        color:'#555d5e',
      },
      {
        position:beam.position,
        rotation:[0,beam.yaw,0],
        scale:[.15,.18,beam.length+.35],
        color:'#697173',
      },
    );
    gantryPanels.push({
      position:[beam.position[0],ROOT_Y+3.72,beam.position[2]],
      rotation:[0,beam.yaw,0],
      scale:[.10,.68,3.1],
      color:'#252b2c',
    });
    gantryAccents.push({
      position:[beam.position[0],ROOT_Y+3.93,beam.position[2]],
      rotation:[0,beam.yaw,0],
      scale:[.11,.10,index===2?2.35:1.9],
      color:'#2e8f58',
    });
  });

  const vegetationStations=[
    -59,-51,-44,-35,-27,
    43,51,60,70,81,93,106,119,131,138,
  ];
  vegetationStations.forEach((z,stationIndex)=>{
    (['left','right'] as const).forEach((side,sideIndex)=>{
      const treeCount=quality==='final'?(stationIndex%3===0?2:1):1;
      for(let i=0;i<treeCount;i++){
        const jitterZ=(rng()-.5)*5.2;
        const extra=4.1+rng()*7.6+(i?3.2:0);
        const height=3.6+rng()*3.1;
        const p=worldPointAt(
          Math.max(TRACK_LAYOUT_CONFIG.sampleMinZ+.3,Math.min(TRACK_LAYOUT_CONFIG.sampleMaxZ-.3,z+jitterZ)),
          side,
          'landscape',
          extra,
          0,
        );
        trunks.push({
          position:[p[0],ROOT_Y+height*.27,p[2]],
          rotation:[0,rng()*Math.PI,0],
          scale:[.18+rng()*.08,height*.54,.18+rng()*.08],
          color:sideIndex===0?'#675f4c':'#5d5748',
        });
        crowns.push({
          position:[
            p[0]+(rng()-.5)*.45,
            ROOT_Y+height*.72,
            p[2]+(rng()-.5)*.45,
          ],
          rotation:[0,rng()*Math.PI,0],
          scale:[1.45+rng()*.9,height*.42,1.35+rng()*.85],
          color:['#425447','#53614c','#394d41','#5a674f'][(stationIndex+sideIndex+i)%4],
        });
      }

      const shrubP=worldPointAt(
        Math.max(TRACK_LAYOUT_CONFIG.sampleMinZ+.3,Math.min(TRACK_LAYOUT_CONFIG.sampleMaxZ-.3,z+(rng()-.5)*3.2)),
        side,
        'landscape',
        1.7+rng()*2.8,
        .34,
      );
      shrubs.push({
        position:shrubP,
        rotation:[0,rng()*Math.PI,0],
        scale:[.75+rng()*.65,.62+rng()*.42,.72+rng()*.65],
        color:['#4e6048','#5d684f','#455940'][(stationIndex+sideIndex)%3],
      });
    });

    if(stationIndex%2===0){
      const ridgeSide=stationIndex%4===0?'left':'right';
      const ridgeP=worldPointAt(z,ridgeSide,'landscape',21+rng()*10,.42);
      ridges.push({
        position:ridgeP,
        rotation:[0,rng()*Math.PI,0],
        scale:[6.2+rng()*4.8,.95+rng()*.7,4.7+rng()*3.2],
        color:ridgeSide==='left'?'#6f7a66':'#65715f',
      });
    }
  });

  // POLISH-02 exit-only depth: frame 711 looks down the final straight, where the
  // original sparse stations exposed too much open horizon. Keep this layer well
  // outside the landscape exclusion so it reads as distant circuit backdrop,
  // never as foreground clutter or a change to the road/runoff envelope.
  const exitDepthStations=[118,123.5,128.5,133.5,138.5];
  exitDepthStations.forEach((z,stationIndex)=>{
    (['left','right'] as const).forEach((side,sideIndex)=>{
      const treeCount=quality==='final'?3:2;
      for(let i=0;i<treeCount;i++){
        const safeZ=Math.min(139.4,z+(rng()-.5)*1.9+i*.22);
        // The portrait exit-chase sightline converges toward the left-side
        // landscape boundary near the final gantry. Keep that side close enough
        // to read at frame 711 while remaining beyond the exclusion line.
        const outward=side==='left'
          ?1.65+i*1.55+rng()*.75
          :9.5+i*3.2+rng()*2.2;
        const height=4.1+rng()*2.5+(stationIndex%2)*.35;
        const p=worldPointAt(safeZ,side,'landscape',outward,0);
        trunks.push({
          position:[p[0],ROOT_Y+height*.27,p[2]],
          rotation:[0,rng()*Math.PI,0],
          scale:[.17+rng()*.07,height*.54,.17+rng()*.07],
          color:sideIndex===0?'#625b49':'#5a5547',
        });
        crowns.push({
          position:[
            p[0]+(rng()-.5)*.38,
            ROOT_Y+height*.72,
            p[2]+(rng()-.5)*.38,
          ],
          rotation:[0,rng()*Math.PI,0],
          scale:[1.35+rng()*.75,height*.40,1.28+rng()*.72],
          color:['#405244','#4a5a47','#546149','#394b40'][(stationIndex+sideIndex+i)%4],
        });
      }
    });
  });

  // Low, broad groundforms sit farther back than the exit treeline to close the
  // horizon without creating a wall or interfering with the chase-camera sightline.
  [121,129.5,137.5].forEach((z,index)=>{
    (['left','right'] as const).forEach((side,sideIndex)=>{
      const nearExitSightline=side==='left'&&index===2;
      const p=worldPointAt(
        z,
        side,
        'landscape',
        nearExitSightline?4.8:30+index*3.8+sideIndex*2.4,
        .34,
      );
      ridges.push({
        position:p,
        rotation:[0,rng()*Math.PI,0],
        scale:nearExitSightline
          ?[3.5,1.18,5.4]
          :[8.5+index*1.6,1.05+index*.16,6.4+sideIndex*1.2],
        color:side==='left'?'#687461':'#616d5c',
      });
    });
  });

  // The portrait exit-chase can see beyond the authored road sample endpoint.
  // Extrapolate only distant dressing along the final straight tangent; road,
  // runoff, barriers and vehicle motion remain capped to the authoritative layout.
  const beyondExitStations=[151,158.5,166.5,175.5];
  beyondExitStations.forEach((z,stationIndex)=>{
    ([-1,1] as const).forEach((sideSign,sideIndex)=>{
      const treeCount=quality==='final'?3:2;
      for(let i=0;i<treeCount;i++){
        const lateral=sideSign*(10.8+i*3.1+rng()*2.2);
        const height=4.8+rng()*2.8+(stationIndex%2)*.45;
        const p=worldPointBeyondExit(z+(rng()-.5)*2.2,lateral,0);
        trunks.push({
          position:[p[0],ROOT_Y+height*.27,p[2]],
          rotation:[0,rng()*Math.PI,0],
          scale:[.18+rng()*.07,height*.54,.18+rng()*.07],
          color:sideIndex===0?'#625b49':'#5a5547',
        });
        crowns.push({
          position:[p[0]+(rng()-.5)*.5,ROOT_Y+height*.72,p[2]+(rng()-.5)*.5],
          rotation:[0,rng()*Math.PI,0],
          scale:[1.55+rng()*.85,height*.42,1.45+rng()*.8],
          color:['#3d5042','#495a47','#536149','#35483d'][(stationIndex+sideIndex+i)%4],
        });
      }
    });
  });

  [158,171.5].forEach((z,index)=>{
    ([-1,1] as const).forEach((sideSign,sideIndex)=>{
      const p=worldPointBeyondExit(z,sideSign*(15.5+index*3+sideIndex*1.7),.28);
      ridges.push({
        position:p,
        rotation:[0,rng()*Math.PI,0],
        scale:[11.5+index*2.2,1.45+index*.25,8.2+sideIndex*1.4],
        color:sideSign<0?'#65715f':'#6c7764',
      });
    });
  });

  // One distant timing/service pylon gives the open horizon an unmistakable
  // circuit cue while remaining >10m lateral from the extrapolated centreline.
  const exitPylon=worldPointBeyondExit(166,-10.9,3.2);
  boards.push({
    position:exitPylon,
    rotation:[0,Math.PI,0],
    scale:[1.8,6.4,.9],
    color:'#343b3d',
  });
  boardAccents.push({
    position:[exitPylon[0],exitPylon[1]+.72,exitPylon[2]-.01],
    rotation:[0,Math.PI,0],
    scale:[1.28,.22,.94],
    color:'#2e8f58',
  });

  return {rail,fence,boards,boardAccents,trunks,crowns,shrubs,ridges,gantryMetal,gantryPanels,gantryAccents};
};

const InstancedLayer:React.FC<{
  geometry:THREE.BufferGeometry;
  material:THREE.Material;
  items:Instance[];
  castShadow?:boolean;
  receiveShadow?:boolean;
}>=({geometry,material,items,castShadow=false,receiveShadow=false})=>{
  const ref=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const object=new THREE.Object3D();
    const color=new THREE.Color();
    items.forEach((item,index)=>{
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
  },[items]);
  if(!items.length)return null;
  return <instancedMesh
    ref={ref}
    args={[geometry,material,items.length]}
    castShadow={castShadow}
    receiveShadow={receiveShadow}
    frustumCulled={false}
  />;
};

export const Y003CircuitWorldExtension:React.FC<Y003CircuitWorldExtensionProps>=({
  quality='final',
  seed=3003,
})=>{
  const audit=useMemo(auditY003CircuitCoverage,[]);
  if(!audit.ok){
    throw new Error('Y003 circuit extension coverage failed: '+audit.issues.join('; '));
  }

  const layout=useMemo(()=>buildLayout(quality,seed),[quality,seed]);
  const box=useMemo(()=>new THREE.BoxGeometry(1,1,1),[]);
  const trunk=useMemo(()=>new THREE.CylinderGeometry(1,1.16,1,6,1),[]);
  const crown=useMemo(()=>makeFoliageGeometry(1,seed+19,56),[seed]);
  const shrub=useMemo(()=>makeFoliageGeometry(.8,seed+73,36),[seed]);
  const ridge=useMemo(()=>new THREE.SphereGeometry(1,12,6),[]);
  const leafTexture=useMemo(makeFoliageTexture,[]);

  const metal=useMemo(()=>new THREE.MeshStandardMaterial({
    color:'#ffffff',roughness:.38,metalness:.78,
  }),[]);
  const marker=useMemo(()=>new THREE.MeshStandardMaterial({
    color:'#ffffff',roughness:.72,metalness:.02,
  }),[]);
  const foliage=useMemo(()=>new THREE.MeshStandardMaterial({
    color:'#ffffff',map:leafTexture,alphaTest:.5,side:THREE.DoubleSide,roughness:.96,metalness:0,
  }),[leafTexture]);
  const groundform=useMemo(()=>new THREE.MeshStandardMaterial({
    color:'#ffffff',roughness:1,metalness:0,
  }),[]);

  useEffect(()=>()=>{box.dispose();trunk.dispose();crown.dispose();shrub.dispose();ridge.dispose();leafTexture.dispose();metal.dispose();marker.dispose();foliage.dispose();groundform.dispose();},
    [box,trunk,crown,shrub,ridge,leafTexture,metal,marker,foliage,groundform]);

  return <group
    name="Y003_CIRCUIT_WORLD_EXTENSION"
    userData={{
      phase:'Y003-POLISH-02',
      owner:'C',
      coordinateSpace:'world',
      deterministicSeed:seed,
      coverage:audit.metrics,
      note:'Extends established Y002 circuit identity along the Y003 route without changing road geometry or vehicle motion.',
    }}
  >
    <InstancedLayer geometry={box} material={metal} items={layout.rail.panels} castShadow receiveShadow/>
    <InstancedLayer geometry={box} material={metal} items={layout.rail.rails} castShadow/>
    <InstancedLayer geometry={box} material={metal} items={layout.rail.posts} castShadow/>
    <InstancedLayer geometry={box} material={metal} items={layout.fence.posts}/>
    <InstancedLayer geometry={box} material={metal} items={layout.fence.rails}/>
    <InstancedLayer geometry={box} material={marker} items={layout.boards} castShadow/>
    <InstancedLayer geometry={box} material={marker} items={layout.boardAccents}/>
    <InstancedLayer geometry={box} material={metal} items={layout.gantryMetal} castShadow/>
    <InstancedLayer geometry={box} material={marker} items={layout.gantryPanels}/>
    <InstancedLayer geometry={box} material={marker} items={layout.gantryAccents}/>
    <InstancedLayer geometry={trunk} material={foliage} items={layout.trunks} castShadow={quality==='final'}/>
    <InstancedLayer geometry={crown} material={foliage} items={layout.crowns}/>
    <InstancedLayer geometry={shrub} material={foliage} items={layout.shrubs}/>
    <InstancedLayer geometry={ridge} material={groundform} items={layout.ridges}/>
  </group>;
};
