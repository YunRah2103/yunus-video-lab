import React from 'react';
import {registerRoot,Still,Composition,useCurrentFrame} from 'remotion';
import {YunexVideo} from './Video';
import {ModelLedVideo} from './ModelLedVideo';
import {FinalFinish} from './FinalFinish';
import {OrbitCutawayProof} from './OrbitCutawayProof';
import {TrackFilmSegment,TrackMotionProof,TrackPortraitPreview,TrackPreview} from './TrackPreview';
import {YunexV4,YunexV4Final} from './YunexV4';
import {YunexV5,YunexV5Final} from './YunexV5';
import {AssetPreview,CarPlate} from './Car';
import {Yunex002Final,Yunex002IntegratedProof} from './video002/Video002Integrated';
import {VIDEO002_DURATION_FRAMES} from './video002/timeline';
const RotationPlate=()=> <CarPlate view="top" width={1080} height={1100} zoom={180} ghost={.78} engine yaw={-useCurrentFrame()/51*.62}/>;
const WheelMotionProof=()=> <ModelLedVideo frameOffset={396} includeAudio={false}/>;
const AeroMotionProof=()=> <ModelLedVideo frameOffset={549} includeAudio={false}/>;
const TrackFilmOpening=()=> <TrackFilmSegment variant="opening"/>;
const TrackFilmFinal=()=> <TrackFilmSegment variant="final"/>;
const Root=()=> <>
 <Composition id="YUNEX-002-INTEGRATED-PROOF" component={Yunex002IntegratedProof} width={1080} height={1920} fps={30} durationInFrames={VIDEO002_DURATION_FRAMES}/>
 <Composition id="YUNEX-002-FINAL" component={Yunex002Final} width={1080} height={1920} fps={30} durationInFrames={VIDEO002_DURATION_FRAMES}/>
 <Composition id="YUNEX-001-V5" component={YunexV5} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-001-V5-FINAL" component={YunexV5Final} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-TRACK-FILM-OPENING" component={TrackFilmOpening} width={1080} height={1920} fps={30} durationInFrames={75}/>
 <Composition id="YUNEX-TRACK-FILM-FINAL" component={TrackFilmFinal} width={1080} height={1920} fps={30} durationInFrames={153}/>
 <Composition id="YUNEX-001-V4" component={YunexV4} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-001-V4-FINAL" component={YunexV4Final} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Still id="YUNEX-TRACK-PREVIEW" component={TrackPreview} width={1600} height={1000}/>
 <Still id="YUNEX-TRACK-PORTRAIT" component={TrackPortraitPreview} width={1080} height={1920}/>
 <Composition id="YUNEX-TRACK-MOTION-PROOF" component={TrackMotionProof} width={1080} height={1920} fps={30} durationInFrames={75}/>
 <Composition id="YUNEX-WHEEL-MOTION-PROOF" component={WheelMotionProof} width={1080} height={1920} fps={30} durationInFrames={90}/>
 <Composition id="YUNEX-AERO-MOTION-PROOF" component={AeroMotionProof} width={1080} height={1920} fps={30} durationInFrames={120}/>
 <Composition id="YUNEX-001-V2-FINAL" component={FinalFinish} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-001-V3-FINAL" component={FinalFinish} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-001" component={YunexVideo} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-001-V2" component={ModelLedVideo} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-001-V3" component={ModelLedVideo} width={1080} height={1920} fps={30} durationInFrames={828}/>
 <Composition id="YUNEX-ORBIT-CUTAWAY-PROOF" component={OrbitCutawayProof} width={1080} height={1920} fps={30} durationInFrames={225}/>
 <Still id="CarPlate" component={CarPlate} width={1080} height={1000} defaultProps={{view:'rear',width:1080,height:1000,zoom:205}} calculateMetadata={({props}:any)=>({width:props.width,height:props.height})}/>
 <Composition id="RotationPlate" component={RotationPlate} width={1080} height={1100} fps={30} durationInFrames={52}/>
 <Composition id="Front" durationInFrames={60} fps={30} component={AssetPreview} width={1600} height={1100} defaultProps={{view:'front'}}/>
 <Still id="Rear" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'rear'}}/>
 <Still id="Side" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'side'}}/>
 <Still id="Top" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'top'}}/>
 <Still id="Turntable" component={AssetPreview} width={1600} height={1100} defaultProps={{view:'turntable'}}/>
 </>;
registerRoot(Root);
