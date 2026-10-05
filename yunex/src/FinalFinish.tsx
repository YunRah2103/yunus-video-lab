import React from 'react';
import {AbsoluteFill,OffthreadVideo,staticFile,useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import * as THREE from 'three';
import {stateFor,project} from './ModelLedVideo';
const green='#bddb78',copper='#d58e50';
const fade=(f:number,a:number,b:number)=>Math.max(0,Math.min(1,(f-a)/(b-a)));
export const FinalFinish:React.FC=()=>{
 const f=useCurrentFrame(),s=stateFor(f);
 const enginePoint=project(new THREE.Vector3(0,.47,-1.78),s);
 const grip=f>=396&&f<549?Math.sin((f-396)/153*Math.PI):0;
 const aero=f>=549&&f<675?Math.sin((f-549)/126*Math.PI):0;
 const curves=[-.65,0,.65].map((x,i)=>{const y=i===1?1.42:1.12;return new THREE.CatmullRomCurve3([new THREE.Vector3(x,y,2.85),new THREE.Vector3(x,y+.08,1.45),new THREE.Vector3(x,y+.35,0),new THREE.Vector3(x,y+.62,-1.25),new THREE.Vector3(x,y+.74,-2.55)]);});
 return <AbsoluteFill>
  <style>{`@font-face{font-family:Yunex;src:url('${staticFile('Display.ttf')}')}`}</style>
  <OffthreadVideo src={staticFile('v3-review.mp4')} muted style={{width:1080,height:1920}}/>
  <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
   {[-.79,.79].map(x=>{const p=project(new THREE.Vector3(x,.02,-1.2114),s);return <ellipse key={x} cx={p.x} cy={p.y+8} rx={56+10*grip} ry={15+5*grip} fill={green} fillOpacity={grip*.12} stroke={green} strokeWidth={4} opacity={grip*.95}/>;})}
   {curves.map((c,i)=>[0,.33,.66].map((offset,j)=>{const p=project(c.getPoint((((f-549)/72+offset)%1+1)%1),s);return <circle key={`${i}-${j}`} cx={p.x} cy={p.y} r={4} fill={i===1?copper:green} opacity={aero*.9}/>;}))}
   {[-.62,.62].map(x=>{const a=project(new THREE.Vector3(x,2.05,-1.65),s),b=project(new THREE.Vector3(x,1.45,-1.65),s);const dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy)),ux=dx/len,uy=dy/len;return <g key={x} opacity={aero*.8} stroke={green} strokeWidth={4} fill="none"><path d={`M${a.x},${a.y}L${b.x},${b.y}`}/><path d={`M${b.x-ux*18-uy*10},${b.y-uy*18+ux*10}L${b.x},${b.y}L${b.x-ux*18+uy*10},${b.y-uy*18-ux*10}`}/></g>;})}
  </svg>
  {f>=165&&f<255&&<div style={{position:'absolute',top:Math.min(1600,enginePoint.y+138),left:Math.max(70,Math.min(720,enginePoint.x-170)),width:340,textAlign:'center',fontFamily:'Yunex',fontSize:40,letterSpacing:2,color:copper,opacity:fade(f,165,178)*(1-fade(f,240,255)),textShadow:'0 3px 14px #000'}}>REAR WEIGHT BIAS</div>}
  <Audio src={staticFile('vo.wav')}/><Audio src={staticFile('sound.wav')} volume={.42}/>
 </AbsoluteFill>;
};
