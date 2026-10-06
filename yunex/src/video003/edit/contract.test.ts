import {activeEditorialCues,cueOpacity,resolveLabelPlacement,type EditorialCue} from './editorial';

const assert=(condition:boolean,message:string)=>{if(!condition)throw new Error(message);};
const cues:EditorialCue[]=[
  {id:'hook',phase:'hook',kind:'dominant',startFrame:0,endFrame:60,line1:'A',priority:2},
  {id:'lower',phase:'hook',kind:'dominant',startFrame:0,endFrame:60,line1:'B',priority:1},
  {id:'part',phase:'reveal',kind:'part-label',startFrame:30,endFrame:90,line1:'C',anchorKey:'front',priority:1},
];

assert(activeEditorialCues(40,cues).dominant?.id==='hook','highest-priority dominant cue must win');
assert(activeEditorialCues(40,cues).label?.id==='part','one technical label may coexist with dominant cue');
assert(cueOpacity(-1,cues[0])===0,'cue must be hidden before its window');
assert(cueOpacity(61,cues[0])===0,'cue must be hidden after its window');

const placed=resolveLabelPlacement({
  anchor:{x:1010,y:960},labelWidth:336,labelHeight:82,canvasWidth:1080,canvasHeight:1920,preferredSide:'right',
  forbiddenRects:[{x:620,y:820,width:350,height:280}],
});
assert(placed.x>=72&&placed.x+336<=1008,'label must stay inside horizontal mobile safe area');
assert(placed.y>=132&&placed.y+82<=1764,'label must stay inside vertical mobile safe area');

console.log('YUNEX 003 Agent E contract tests: PASS');
