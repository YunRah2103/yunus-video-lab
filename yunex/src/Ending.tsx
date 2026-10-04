import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Base,Heading,Small,Film,gold,ease} from './Common';
import {CarCanvas} from './Car';
export function Ending(){const f=useCurrentFrame();const hero=ease(f,87,102);return <Base>
 {f<102&&<Film src="hero.mp4" top={630} height={950} fit="contain" trimBefore={60} opacity={1-hero}/>}
 <div style={{position:'absolute',inset:0,background:'linear-gradient(#090d0f 8%,#090d0f11 45%,transparent 65%,#090d0f 100%)'}}/>
 <div style={{position:'absolute',left:78,top:660,fontFamily:'Yunex',fontSize:440,color:gold,opacity:hero*.07}}>911</div>
 <div style={{position:'absolute',top:600,opacity:hero}}><CarCanvas view="rear" width={1080} height={1000} zoom={205}/></div>
 <Small>THE COMPROMISE BECAME THE CHARACTER</Small>
 <Heading top={265} size={157}>{f<48?<>FROM FLAW<br/>TO FEEL.</>:<>UNMISTAKABLY<br/><span style={{color:gold}}>911.</span></>}</Heading>
 <div style={{position:'absolute',left:78,top:1590,fontSize:35,letterSpacing:1,opacity:ease(f,62,78)}}>ITS LAYOUT BECAME ITS IDENTITY.</div>
 <div style={{position:'absolute',left:78,bottom:135,fontFamily:'Yunex',fontSize:62,letterSpacing:9,opacity:ease(f,112,125)}}>YUNEX</div>
 </Base>}
