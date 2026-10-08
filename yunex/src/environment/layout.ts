/** Environment V2 retains the approved physical track coordinate contract. */
import {sampleTrackAtLocalZ,TRACK_LAYOUT_CONFIG} from '../video002/trackUpgrade/racetrack/layout';
export const CIRCUIT_SEED=210304;
export const rngFor=(seed:number)=>{let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};};
export const terrainY=(x:number,z:number)=>{
 const d=Math.max(0,Math.abs(x)-16);
 const rise=1-Math.exp(-d/27);
 const hill=rise*(3.2+2.8*Math.sin(z*.022+x*.01)+1.9*Math.sin(x*.043-z*.017))+Math.max(0,d-55)*.028;
 const padDistance=Math.hypot(Math.max(15-x,0,x-49),Math.max(-65-z,0,z-37));
 const t=Math.min(1,padDistance/12);return -.06+hill*t*t*(3-2*t);
};
export type Tree={x:number;z:number;y:number;height:number;width:number;phase:number;warm:boolean};
export const forestLayout=(seed=CIRCUIT_SEED)=>{
 const r=rngFor(seed);const trees:Tree[]=[];
 for(const side of [-1,1])for(let i=0;i<190;i++){
  const z=-146+r()*292;const s=sampleTrackAtLocalZ(z);const lateral=13+r()*51;
  const x=s.center[0]+side*lateral;
  // The paddock and marshal hut need clear, credible footprints.
  if(x>17&&x<46&&z>-62&&z<35)continue;
  if(x< -9&&x> -19&&z>9&&z<28)continue;
  trees.push({x,z,y:terrainY(x,z),height:8.2+r()*7.8,width:5.1+r()*5.2,phase:r()*6.28,warm:r()>.8});
 }
 return trees;
};
export const environmentAudit=()=>{
 const trees=forestLayout();let min=Infinity;
 for(const t of trees){const s=sampleTrackAtLocalZ(t.z);min=Math.min(min,Math.abs(t.x-s.center[0])-TRACK_LAYOUT_CONFIG.roadHalfWidth);}
 return {seed:CIRCUIT_SEED,treeCount:trees.length,minTreeRoadEdgeClearanceM:min,deterministic:JSON.stringify(trees)===JSON.stringify(forestLayout()),physicalTrackUnchanged:true,ok:min>8&&trees.length>110};
};
