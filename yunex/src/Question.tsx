import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Base,Heading,Small,Film,gold,ease} from './Common';
export function Question(){const f=useCurrentFrame();return <Base><Film src="detail.mp4"/><div style={{position:'absolute',inset:0,background:'linear-gradient(#090d0feb,transparent 70%,#090d0fbb)'}}/>
 <Small>THE OBVIOUS QUESTION</Small><Heading top={300} size={160}>WHY KEEP<br/><span style={{color:gold}}>IT THERE?</span></Heading>
 <div style={{position:'absolute',bottom:295,left:80,fontFamily:'Yunex',fontSize:76,opacity:ease(f,25,38)}}>BECAUSE IT ALSO HELPS.</div></Base>}
