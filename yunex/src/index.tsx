import React from 'react';
import {registerRoot,Still,Composition,useCurrentFrame} from 'remotion';
import {YunexVideo} from './Video';
import {AssetPreview,CarPlate} from './Car';
const RotationPlate=()=> <CarPlate view="top" width={1080} height={1100} zoom={180} ghost={.78} engine yaw={-useCurrentFrame()/51*.62}/>;
const Root=()=> <>
 <Composition id="YUNEX-001" component={YunexVideo} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Still id="CarPlate" component={CarPlate} width={1080} height={1000} defaultProps={{view:'rear',width:1080,height:1000,zoom:205}} calculateMetadata={({props}:any)=>({width:props.width,height:props.height})}/>
 <Composition id="RotationPlate" component={RotationPlate} width={1080} height={1100} fps={30} durationInFrames={52}/>
 <Composition id="Front" durationInFrames={60} fps={30} component={AssetPreview} width={1600} height={1100} defaultProps={{view:'front'}}/>
 <Still id="Rear" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'rear'}}/>
 <Still id="Side" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'side'}}/>
 <Still id="Top" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'top'}}/>
 <Still id="Turntable" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'turntable'}}/>
 </>;
registerRoot(Root);
