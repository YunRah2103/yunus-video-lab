import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CarCanvas} from './Car';
import {Base,Heading,Small,Footer,green,ease} from './Common';
export function Grip(){const f=useCurrentFrame();const p=ease(f,8,52);return <Base><Small>03 / THE ADVANTAGE</Small>
 <Heading top={235} size={125}>SAME WEIGHT.<br/><span style={{color:green}}>MORE GRIP.</span></Heading>
 <div style={{position:'absolute',top:565,translate:`0 ${p*14}px`}}><CarCanvas view="side" height={850} zoom={185} ghost={.56} engine grip/></div>
 <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><defs><marker id="load" markerWidth="12" markerHeight="12" refX="7" refY="5" orient="auto"><path d="M0 0 L9 5 L0 10" fill="none" stroke={green} strokeWidth="2"/></marker></defs><path d={`M768 ${850+p*80} V${985+p*14}`} stroke={green} strokeWidth="9" markerEnd="url(#load)" opacity={p}/><ellipse cx="768" cy={1100} rx={70+20*p} ry={11} fill={green} opacity={p*.65}/></svg>
 <Small top={1270} left={610} color={green}>DRIVEN REAR TYRES</Small>
 <div style={{position:'absolute',left:78,top:1460,fontFamily:'Yunex',fontSize:74}}>MASS LOADS THE CONTACT PATCH.</div>
 <Small top={1590} color={green}>TRACTION UNDER ACCELERATION</Small><Footer/>
 </Base>}
