export type EditorialPhase='hook'|'turnIn'|'reveal'|'profile'|'airflow'|'load'|'wholeCar'|'exit';
export type EditorialCueKind='dominant'|'part-label';
export type EditorialAccent='ivory'|'green'|'copper';
export type LabelSide='left'|'right'|'above'|'below'|'auto';

export type ScreenPoint={x:number;y:number;visible?:boolean};
export type ScreenRect={x:number;y:number;width:number;height:number};

export type EditorialCue={
  id:string;
  phase:EditorialPhase;
  kind:EditorialCueKind;
  startFrame:number;
  endFrame:number;
  line1:string;
  line2?:string;
  eyebrow?:string;
  accent?:EditorialAccent;
  anchorKey?:string;
  preferredSide?:LabelSide;
  priority?:number;
};

export type EditorialAnchors=Readonly<Record<string,ScreenPoint|undefined>>;

export type EditLayerProps={
  cues:readonly EditorialCue[];
  anchors?:EditorialAnchors;
  forbiddenRects?:readonly ScreenRect[];
  showFinishing?:boolean;
  finishStrength?:number;
  identityStartFrame?:number;
  identityEndFrame?:number;
  debug?:boolean;
};

export const YUNEX003_COPY={
  hook:{line1:'EVEN THE SUSPENSION',line2:'HELPS MAKE DOWNFORCE'},
  frontLinks:'TEARDROP FRONT LINKS',
  airflow:'CLEANER AIRFLOW',
  load:'CONTROL UNDER LOAD',
  identity:'YUNEX',
} as const;

export const YUNEX003_PALETTE={
  ivory:'#f1eadc',
  green:'#bddb78',
  copper:'#d58e50',
  charcoal:'#0d1011',
} as const;

export const YUNEX003_NATIVE={width:1080,height:1920,fps:30} as const;

export const clamp01=(value:number)=>Math.max(0,Math.min(1,value));
export const smoothstep=(value:number)=>{
  const x=clamp01(value);
  return x*x*(3-2*x);
};

export const cueOpacity=(frame:number,cue:Pick<EditorialCue,'startFrame'|'endFrame'>,fadeFrames=7)=>{
  if(frame<cue.startFrame||frame>=cue.endFrame)return 0;
  const span=Math.max(1,cue.endFrame-cue.startFrame);
  const fade=Math.max(1,Math.min(fadeFrames,Math.floor(span/2)));
  const fadeIn=smoothstep((frame-cue.startFrame)/fade);
  const fadeOut=smoothstep((cue.endFrame-frame)/fade);
  return Math.min(fadeIn,fadeOut);
};

export const cueProgress=(frame:number,cue:Pick<EditorialCue,'startFrame'|'endFrame'>)=>{
  const span=Math.max(1,cue.endFrame-cue.startFrame);
  return clamp01((frame-cue.startFrame)/span);
};

export const activeEditorialCues=(frame:number,cues:readonly EditorialCue[])=>{
  const active=cues.filter(cue=>frame>=cue.startFrame&&frame<cue.endFrame);
  const dominant=active.filter(cue=>cue.kind==='dominant').sort((a,b)=>(b.priority??0)-(a.priority??0))[0];
  const label=active.filter(cue=>cue.kind==='part-label').sort((a,b)=>(b.priority??0)-(a.priority??0))[0];
  return {dominant,label};
};

export const DEFAULT_SAFE_AREA={left:72,right:72,top:132,bottom:156} as const;

const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
const intersects=(a:ScreenRect,b:ScreenRect)=>!(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);

export type PlacementInput={
  anchor:ScreenPoint;
  labelWidth:number;
  labelHeight:number;
  canvasWidth:number;
  canvasHeight:number;
  preferredSide?:LabelSide;
  forbiddenRects?:readonly ScreenRect[];
};

export type LabelPlacement={x:number;y:number;leaderX:number;leaderY:number;side:Exclude<LabelSide,'auto'>};

const candidateFor=(side:Exclude<LabelSide,'auto'>,anchor:ScreenPoint,w:number,h:number):LabelPlacement=>{
  const gap=34;
  if(side==='left')return{x:anchor.x-gap-w,y:anchor.y-h/2,leaderX:anchor.x-gap,leaderY:anchor.y,side};
  if(side==='right')return{x:anchor.x+gap,y:anchor.y-h/2,leaderX:anchor.x+gap,leaderY:anchor.y,side};
  if(side==='above')return{x:anchor.x-w/2,y:anchor.y-gap-h,leaderX:anchor.x,leaderY:anchor.y-gap,side};
  return{x:anchor.x-w/2,y:anchor.y+gap,leaderX:anchor.x,leaderY:anchor.y+gap,side};
};

export const resolveLabelPlacement=(input:PlacementInput):LabelPlacement=>{
  const {anchor,labelWidth:w,labelHeight:h,canvasWidth,canvasHeight}=input;
  const safe={
    x:DEFAULT_SAFE_AREA.left,
    y:DEFAULT_SAFE_AREA.top,
    width:canvasWidth-DEFAULT_SAFE_AREA.left-DEFAULT_SAFE_AREA.right,
    height:canvasHeight-DEFAULT_SAFE_AREA.top-DEFAULT_SAFE_AREA.bottom,
  };
  const preferred=input.preferredSide&&input.preferredSide!=='auto'?input.preferredSide:undefined;
  const order:Exclude<LabelSide,'auto'>[]=preferred
    ?[preferred,...(['right','left','above','below'] as const).filter(side=>side!==preferred)]
    :['right','left','above','below'];
  const blocked=input.forbiddenRects??[];

  const scored=order.map((side,index)=>{
    const raw=candidateFor(side,anchor,w,h);
    const x=clamp(raw.x,safe.x,safe.x+safe.width-w);
    const y=clamp(raw.y,safe.y,safe.y+safe.height-h);
    const rect={x,y,width:w,height:h};
    const collisions=blocked.reduce((sum,item)=>sum+(intersects(rect,item)?1:0),0);
    const displacement=Math.abs(x-raw.x)+Math.abs(y-raw.y);
    return {...raw,x,y,score:collisions*100000+displacement*10+index};
  });
  scored.sort((a,b)=>a.score-b.score);
  const {score:_,...best}=scored[0];
  return best;
};
