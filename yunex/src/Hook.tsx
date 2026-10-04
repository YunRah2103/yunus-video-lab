import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CarCanvas} from './Car';
import {Base,Heading,Small,Film,Footer,gold,ease} from './Common';
export function Hook(){const f=useCurrentFrame();return <Base>
 <Small>001 / THE 911 PARADOX</Small>
 <Heading top={265} size={144}>PORSCHE NEVER<br/><span style={{color:gold}}>FIXED THIS.</span></Heading>
 <Film src="opening.mp4" top={670} height={660} fit="cover" opacity={1-ease(f,15,26)}/>
 <div style={{position:'absolute',top:600,opacity:ease(f,15,26)}}><CarCanvas width={1080} height={1000} view="rear" zoom={205} ghost={ease(f,22,42)*.92} engine/></div>
 <div style={{position:'absolute',left:78,top:1480,fontFamily:'Yunex',fontSize:60,letterSpacing:1,opacity:ease(f,26,38)}}>THE ENGINE IS STILL AT THE BACK.</div>
 <Footer text="ONE LAYOUT. SIX DECADES OF ENGINEERING."/>
 </Base>}
