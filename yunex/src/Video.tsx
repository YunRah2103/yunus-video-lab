import React from 'react';
import {AbsoluteFill,Sequence,staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {Hook} from './Hook';import {Layout} from './Layout';import {Rotation} from './Rotation';import {Question} from './Question';import {Grip} from './Grip';import {Acceleration} from './Acceleration';import {Evolution} from './Evolution';import {Ending} from './Ending';
export function YunexVideo(){return <AbsoluteFill style={{background:'#090c0e'}}>
 <Sequence name="Immediate engine reveal" from={0} durationInFrames={105}><Hook/></Sequence>
 <Sequence name="Engine behind rear axle and rear bias" from={105} durationInFrames={150}><Layout/></Sequence>
 <Sequence name="Rear mass rotates as grip disappears" from={255} durationInFrames={90}><Rotation/></Sequence>
 <Sequence name="Why retain the layout" from={345} durationInFrames={51}><Question/></Sequence>
 <Sequence name="Load on the driven tyres" from={396} durationInFrames={90}><Grip/></Sequence>
 <Sequence name="Acceleration grip in real footage" from={486} durationInFrames={63}><Acceleration/></Sequence>
 <Sequence name="Decades of engineering" from={549} durationInFrames={126}><Evolution/></Sequence>
 <Sequence name="911 identity and YUNEX signature" from={675} durationInFrames={153}><Ending/></Sequence>
 <Audio src={staticFile('vo.wav')}/><Audio src={staticFile('sound.wav')} volume={.6}/>
 </AbsoluteFill>}
