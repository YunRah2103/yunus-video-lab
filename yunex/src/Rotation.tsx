import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CarCanvas} from './Car';
import {Base,Heading,Small,Footer,gold,ease} from './Common';
export function Rotation(){const f=useCurrentFrame();const yaw=-ease(f,14,65)*.62;const trail=Array.from({length:25},(_,i)=>{const a=i/24*-yaw;return `${i?'L':'M'}${540+544*Math.sin(a)} ${1020+180*(1.2425-3.0225*Math.cos(a))}`}).join(' ');return <Base>
 <Small>02 / WHEN REAR GRIP GOES</Small><Heading top={235} size={120}>THE REAR<br/><span style={{color:gold}}>CAN SWING.</span></Heading>
 <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M540 1530 V600" fill="none" stroke="#91998f44" strokeWidth="90"/><path d="M540 1530 V600" fill="none" stroke="#bbc3b560" strokeWidth="3" strokeDasharray="20 22"/><path d={trail} fill="none" stroke={gold} opacity={ease(f,22,50)} strokeWidth="5" strokeDasharray="12 12"/><circle cx="540" cy="700" r="14" stroke={gold} strokeWidth="3" fill="none" opacity={ease(f,22,50)}/></svg>
 <div style={{position:'absolute',top:470}}><CarCanvas view="top" width={1080} height={1100} zoom={180} yaw={yaw} ghost={.78} engine/></div>
 <div style={{position:'absolute',left:84,top:1510,fontFamily:'Yunex',fontSize:67,color:gold}}>REAR MASS + LOST GRIP</div>
 <Small top={1600}>OVERSTEER</Small><Footer text="ILLUSTRATIVE ROTATION / NOT A PHYSICS SIMULATION"/>
 </Base>}
