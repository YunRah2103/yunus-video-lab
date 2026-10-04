import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CarCanvas} from './Car';
import {Base,Heading,Small,Footer,gold,ease} from './Common';
export function Layout(){const f=useCurrentFrame();const p=ease(f,58,89);return <Base>
 <Small>01 / THE COMPROMISE</Small>
 <Heading top={250} size={118}>ENGINE BEHIND<br/><span style={{color:gold}}>THE AXLE.</span></Heading>
 <div style={{position:'absolute',top:600}}><CarCanvas view="side" height={850} zoom={185} ghost={.93} engine/></div>
 <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
  <path d="M310 925 V1220 M765 920 V1280" stroke="#b5bcb2" strokeWidth="2" strokeDasharray="7 9"/>
  <path d="M871 980 V785 H810" stroke={gold} strokeWidth="3" fill="none"/>
  <circle cx="871" cy="980" r="8" fill={gold}/>
  <path d="M765 1160 H930 M765 1148 V1172 M930 1148 V1172" stroke={gold} strokeWidth="3"/>
 </svg>
 <Small top={746} left={760} color={gold}>ENGINE MASS</Small>
 <div style={{position:'absolute',top:1255,left:220,fontSize:31,letterSpacing:2}}>FRONT AXLE</div>
 <div style={{position:'absolute',top:1310,left:677,fontSize:31,letterSpacing:2}}>REAR AXLE</div>
 <div style={{position:'absolute',top:1455,left:115+510*p,fontFamily:'Yunex',fontSize:100,color:gold}}>WEIGHT</div>
 <div style={{position:'absolute',top:1590,left:115,width:850,height:12,background:'#4a5050'}}><div style={{height:'100%',width:260+590*p,background:`linear-gradient(90deg,#707b72,${gold})`}}/></div>
 <Small top={1630} left={115}>REAR-BIASED MASS</Small>
 <Footer text="SIMPLIFIED ENGINE LOCATION / NOT TO SCALE"/>
 </Base>}
