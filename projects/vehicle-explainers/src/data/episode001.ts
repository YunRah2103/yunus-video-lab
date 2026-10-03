export type Mode = 'standard'|'statistic'|'technical'|'reaction'|'comparison'|'hero';
export type Beat = {
  start:number; end:number; mode:Mode; caption:string; pose:string;
  vehicle?:'modern'|'classic'; accent?:'cyan'|'lime'|'red'; visual?:string;
};

export const porscheEpisode = {
  slug:'porsche-rear-engine',
  duration:58.225,
  title:'Why Porsche put the engine in the wrong place',
  phrases:[
    {start:0.000,end:3.455,text:'On paper, this is the wrong place for an engine.'},
    {start:3.575,end:5.875,text:'Porsche built an icon around it.'},
    {start:5.995,end:10.610,text:'The 911 puts its flat six behind the rear axle.'},
    {start:10.730,end:13.555,text:'That gives it a huge advantage: traction.'},
    {start:13.675,end:18.055,text:'With more weight over the driven wheels, it can put power down hard.'},
    {start:18.175,end:21.950,text:'But that weight also acts like a pendulum at the back.'},
    {start:22.070,end:27.950,text:'Lift suddenly in a corner, and early 911s could rotate very quickly.'},
    {start:28.070,end:33.675,text:'So in 1969, Porsche stretched the wheelbase by 57 millimetres.'},
    {start:33.795,end:36.350,text:'Specifically to calm the handling.'},
    {start:36.470,end:42.415,text:'Then came wider tyres, better suspension geometry, and smarter chassis control.'},
    {start:42.535,end:48.930,text:'By the 993, a new multi link rear axle helped make the car much more stable.'},
    {start:49.050,end:52.450,text:'So yes, the engine really is in the weird place.'},
    {start:52.570,end:58.225,text:"Porsche just spent decades turning the weakness into the 911's character."}
  ],
  narration:[
    'On paper, this is the wrong place for an engine.',
    'Porsche built an icon around it.',
    'The 911 puts its flat six behind the rear axle.',
    'That gives it a huge advantage: traction.',
    'With more weight over the driven wheels, it can put power down hard.',
    'But that weight also acts like a pendulum at the back.',
    'Lift suddenly in a corner, and early 911s could rotate very quickly.',
    'So in 1969, Porsche stretched the wheelbase by 57 millimetres.',
    'Specifically to calm the handling.',
    'Then came wider tyres, better suspension geometry, and smarter chassis control.',
    'By the 993, a new multi link rear axle helped make the car much more stable.',
    'So yes, the engine really is in the weird place.',
    "Porsche just spent decades turning the weakness into the 911's character."
  ],
  beats:[
    {start:0,end:3.575,mode:'reaction',caption:'THE WRONG PLACE?',pose:'05-confused',vehicle:'modern',accent:'cyan',visual:'rear-engine-callout'},
    {start:3.575,end:5.995,mode:'standard',caption:'BUILT AN ICON',pose:'10-explaining',vehicle:'modern'},
    {start:5.995,end:10.73,mode:'technical',caption:'BEHIND THE REAR AXLE',pose:'04-pointing',vehicle:'modern',accent:'cyan',visual:'axle-engine-diagram'},
    {start:10.73,end:13.675,mode:'statistic',caption:'TRACTION',pose:'06-surprised',vehicle:'modern',accent:'cyan',visual:'rear-load-arrows'},
    {start:13.675,end:18.175,mode:'technical',caption:'PUT POWER DOWN HARD',pose:'04-pointing',vehicle:'modern',accent:'lime',visual:'driven-wheel-load'},
    {start:18.175,end:22.07,mode:'technical',caption:'A PENDULUM',pose:'08-thinking',vehicle:'modern',accent:'cyan',visual:'rear-mass-arc'},
    {start:22.07,end:28.07,mode:'reaction',caption:'LIFT → ROTATE',pose:'06-surprised',vehicle:'classic',accent:'red',visual:'oversteer-path'},
    {start:28.07,end:33.795,mode:'comparison',caption:'+57 MM',pose:'04-pointing',vehicle:'classic',accent:'cyan',visual:'wheelbase-before-after'},
    {start:33.795,end:36.47,mode:'standard',caption:'CALMER HANDLING',pose:'09-arms-crossed',vehicle:'classic'},
    {start:36.47,end:42.535,mode:'comparison',caption:'WIDER • BETTER • SMARTER',pose:'10-explaining',vehicle:'modern',accent:'cyan',visual:'evolution-cards'},
    {start:42.535,end:49.05,mode:'technical',caption:'MULTI-LINK REAR AXLE',pose:'04-pointing',vehicle:'modern',accent:'cyan',visual:'993-multilink'},
    {start:49.05,end:52.57,mode:'reaction',caption:'WEIRD PLACE',pose:'07-annoyed',vehicle:'modern',accent:'cyan',visual:'rear-engine-callout'},
    {start:52.57,end:58.225,mode:'hero',caption:"INTO THE 911'S CHARACTER",pose:'01-neutral',accent:'cyan',visual:'hero-footage'}
  ] satisfies Beat[]
} as const;
