import React from 'react';
import {Img,staticFile,useCurrentFrame} from 'remotion';
import {CarCanvas} from './Car';
import {Base,Heading,Small,Footer,gold,ease} from './Common';
export function Evolution(){const f=useCurrentFrame();const modern=ease(f,38,46);return <Base><Small>04 / ENGINEER THE COMPROMISE</Small>
 <Heading top={235} size={125}>DECADES OF<br/><span style={{color:gold}}>REFINEMENT.</span></Heading>
 <div style={{position:'absolute',left:76,top:610,width:928,height:650,overflow:'hidden',opacity:1-modern}}><Img src={staticFile('classic.jpg')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
 <div style={{position:'absolute',top:545,opacity:modern}}><CarCanvas view="front" height={950} zoom={198}/></div>
 <div style={{position:'absolute',top:1420,left:78,fontFamily:'Yunex',fontSize:72,color:gold}}>{f<42?'ORIGINAL 911':'MODERN 911'}</div>
 <div style={{position:'absolute',top:1530,left:78,right:78,fontSize:35,letterSpacing:2,opacity:ease(f,52,65)}}>TYRES / SUSPENSION / CONTROL</div>
 <div style={{position:'absolute',left:78,top:1620,fontFamily:'Yunex',fontSize:62,opacity:ease(f,87,100)}}>THE ENGINE STAYED.</div><Footer text="THE LAYOUT EVOLVED. ITS IDENTITY SURVIVED."/>
 </Base>}
