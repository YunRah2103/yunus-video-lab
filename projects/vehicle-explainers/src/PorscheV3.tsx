import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {cues, shots} from './data/porscheV3';

const ink='#131b20', cyan='#008d9f', red='#e93243';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const Picture:React.FC<{name:string,x:number,y:number,w:number,rotate?:number,scale?:number,opacity?:number}>=({name,x,y,w,rotate=0,scale=1,opacity=1})=><Img src={staticFile(`photo/${name}`)} style={{position:'absolute',left:x,top:y,width:w,rotate:`${rotate}deg`,scale,opacity,filter:'drop-shadow(0px 22px 18px #00000022)'}}/>;
const Guy:React.FC<{pose:string,x:number,y:number,w:number,head?:boolean,rotate?:number,flip?:boolean}>=({pose,x,y,w,head=false,rotate=0,flip=false})=>{
 const f=useCurrentFrame();const talking=pose==='talk'?(Math.floor(f/9)%2?'02-talking-a':'03-talking-b'):pose;
 return <Img src={staticFile(`presenter/${head?'head':'upper'}-${talking}.png`)} style={{position:'absolute',left:x,top:y,width:w,rotate:`${rotate}deg`,transform:flip?'scaleX(-1)':undefined,translate:`0px ${Math.sin(f/17)*3}px`,filter:'drop-shadow(3px 8px 0px #ffffff90)'}}/>;
};
const Type:React.FC<{text:string,x:number,y:number,size?:number,color?:string,angle?:number,scale?:number,width?:number}>=({text,x,y,size=145,color=ink,angle=0,scale=1,width})=><div style={{position:'absolute',left:x,top:y,fontFamily:'Display',fontWeight:900,fontSize:size,lineHeight:.92,letterSpacing:-2,color,rotate:`${angle}deg`,scale,width,whiteSpace:'pre-line',WebkitTextStroke:'2px #f5f5ef',paintOrder:'stroke fill',textShadow:'4px 5px 0px #ffffff',transformOrigin:'left center'}}>{text}</div>;
const Arrow:React.FC<{x1:number,y1:number,x2:number,y2:number,color?:string}>=({x1,y1,x2,y2,color=cyan})=><svg style={{position:'absolute',inset:0,width:1080,height:1920}}><defs><marker id={`a${x1}${y1}`} markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke={color} strokeWidth="2"/></marker></defs><path d={`M${x1},${y1} Q${(x1+x2)/2+25},${(y1+y2)/2-20} ${x2},${y2}`} stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" markerEnd={`url(#a${x1}${y1})`}/></svg>;
const Arc:React.FC<{angle:number}>=({angle})=><svg style={{position:'absolute',inset:0,width:1080,height:1920}}><path d="M150 750 Q420 260 900 690" fill="none" stroke="#e9324355" strokeWidth="16" strokeDasharray="22 18"/><path d="M670 720 Q880 900 950 600" fill="none" stroke={red} strokeWidth="14"/><path d="M918 650 L950 598 L980 650" fill="none" stroke={red} strokeWidth="14"/></svg>;

export const PorscheV3:React.FC=()=>{
 const frame=useCurrentFrame(),t=frame/60;
 const shot=shots.find(s=>t>=s.start&&t<s.end)??shots[shots.length-1];
 const q=t-shot.start;
 const enter=spring({frame:Math.round(q*60),fps:60,config:{damping:18,stiffness:260}});
 const drift=Math.sin(frame/29)*5;
 const cue=[...cues].reverse().find(c=>t>=c.start);
 const cp=cue?spring({frame:frame-Math.round(cue.start*60),fps:60,config:{damping:20,stiffness:400}}):1;
 let content:React.ReactNode;
 switch(shot.id){
 case 'hook': content=<>
  <Type text="PORSCHE" x={65} y={110} size={190} color="#aebdc0"/>
  <Picture name="modern-user.webp" x={-130+(1-enter)*170} y={340} w={1380} scale={t>.88?1.055:1}/>
  <Guy pose={t<1.24?'05-confused':'talk'} head x={-120} y={1060} w={800} rotate={-14}/>
  <Type text="NORMAL?" x={540} y={1360} size={100} color={cyan} angle={9}/>
 </>;break;
 case 'wrong': content=<>
  <Picture name="classic0.webp" x={-75} y={175} w={1140} scale={1+q*.009}/>
  <svg style={{position:'absolute',inset:0}} width="1080" height="1920"><ellipse cx="780" cy="670" rx="150" ry="80" fill="#e932431b" stroke={red} strokeWidth="12" rotate="-15"/></svg>
  <Arrow x1={880} y1={910} x2={790} y2={670} color={red}/>
  <Guy pose={t<3.72?'08-thinking':'05-confused'} head x={600} y={1100} w={650} rotate={12}/>
  {t>=3.94&&<Type text="HERE?" x={90} y={1240} size={210} color={red} angle={-9}/>}
 </>;break;
 case 'layout':content=<>
  <Type text="PORSCHE" x={50} y={120} size={190} color="#c4cdce"/>
  <Picture name="swb.webp" x={-40} y={480} w={1180}/>
  <Guy pose="04-pointing" x={-115} y={1150} w={840} rotate={-5}/>
  <Arrow x1={780} y1={1070} x2={945} y2={775}/>
 </>;break;
 case 'engine': content=<>
  <Type text="6" x={20} y={160} size={680} color="#cfdadb"/>
  <Picture name="engine0.webp" x={130} y={430} w={1010} scale={.93+.07*enter}/>
  <Guy pose="11-looking-up" x={570} y={1130} w={780} rotate={8}/>
 </>;break;
 case 'behind':content=<>
  <Picture name="swb.webp" x={-120} y={450} w={1250}/>
  <Picture name="engine0.webp" x={850} y={690} w={280}/>
  <svg style={{position:'absolute',inset:0}} width="1080" height="1920"><path d="M809 650 V980" stroke={ink} strokeWidth="6" strokeDasharray="14 12"/><path d="M820 920 H1040" stroke={cyan} strokeWidth="13"/></svg>
  <Type text="AXLE" x={620} y={1010} size={80}/>
  <Guy pose="04-pointing" x={-65} y={1175} w={850} rotate={-6}/>
  <Arrow x1={560} y1={1150} x2={1000} y2={900}/>
 </>;break;
 case 'advantage':content=<>
  <Type text="SOMEHOW." x={40} y={120} size={190} color={cyan}/>
  <Picture name="modern-user.webp" x={-50} y={420} w={1260} scale={1+.025*Math.sin(q*2)}/>
  <Guy pose={q<1?'05-confused':'10-explaining'} x={250} y={1120} w={810} rotate={q<1?-6:3}/>
 </>;break;
 case 'load':content=<>
  <Picture name="swb.webp" x={-330} y={410+enter*22} w={1600}/>
  <Picture name="engine1.webp" x={680} y={185} w={430}/>
  <Arrow x1={865} y1={570} x2={865} y2={910}/>
  <Guy pose="04-pointing" x={-40} y={1130} w={790}/>
 </>;break;
 case 'traction':content=<>
  <Type text="TRACTION" x={30} y={190} size={224} color="#b8cccf"/>
  <Picture name="tyre.webp" x={275} y={430} w={740} rotate={q*6}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M125 1220 H1060" stroke={ink} strokeWidth="14"/><path d="M310 1245 H900" stroke={cyan} strokeWidth="25"/></svg>
  <Guy pose="10-explaining" x={-150} y={1210} w={800} rotate={-7}/>
  <Arrow x1={970} y1={475} x2={970} y2={1080}/>
 </>;break;
 case 'problem':content=<>
  <Guy pose={q<.65?'07-annoyed':'06-surprised'} head x={40} y={520} w={1000} rotate={q<.65?-5:5}/>
  <Type text="BUT…" x={45} y={150} size={245} color={red}/>
 </>;break;
 case 'mass':{
  const angle=Math.sin(q*2.8)*24;
  content=<>
   <Picture name="swb.webp" x={-40} y={185} w={1160} opacity={.25}/>
   <div style={{position:'absolute',left:650,top:515,width:500,height:620,rotate:`${angle}deg`,transformOrigin:'50% 0%'}}><div style={{position:'absolute',left:245,top:0,width:8,height:360,background:ink}}/><Img src={staticFile('photo/engine1.webp')} style={{position:'absolute',left:-50,top:300,width:600}}/></div>
   <Guy pose="11-looking-up" x={-155} y={1100} w={860} rotate={-6}/>
   <Type text="REAR MASS" x={30} y={1015} size={135} color={red} angle={angle*.12}/>
  </>;break;}
 case 'early':content=<>
  <Type text="EARLY 911" x={65} y={140} size={195} color="#b7c3c6"/>
  <Picture name="classic1.webp" x={-100+q*70} y={425} w={1200} rotate={-4+q*4}/>
  <Guy pose="12-looking-side" x={480} y={1135} w={810} flip rotate={8}/>
  <Arrow x1={200} y1={910} x2={805} y2={990} color={red}/>
 </>;break;
 case 'lift':content=<>
  <Picture name="swb.webp" x={-140} y={270} w={1280}/>
  <Type text="LIFT" x={45} y={830} size={350} color={red} angle={-8}/>
  <Guy pose="06-surprised" head x={600} y={1050} w={740} rotate={14}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M240 1340 L285 1640 L400 1620 L355 1320 Z" fill={ink}/><path d="M235 1270 L510 1250" stroke={cyan} strokeWidth="24"/><path d="M330 1270 V1080 M290 1130 L330 1080 L370 1130" fill="none" stroke={red} strokeWidth="18"/></svg>
 </>;break;
 case 'rotate':{
  const yaw=interpolate(q,[0,1.8,2.1,3.5],[0,5,36,49],clamp);
  content=<>
   <Arc angle={yaw}/>
   <Picture name="classic1.webp" x={-120+Math.sin(q)*55} y={370} w={1280} rotate={yaw}/>
   <Guy pose="06-surprised" head x={-180} y={1210} w={760} rotate={-18}/>
   <Type text="REAR →" x={605} y={1100} size={110} color={red} angle={yaw*.3}/>
  </>;break;}
 case 'kept':content=<>
  <Picture name="classic0.webp" x={-160} y={240} w={1100}/>
  <Guy pose="07-annoyed" x={500} y={1100} w={840} rotate={7}/>
  <Picture name="engine0.webp" x={80} y={1160} w={440}/>
  <Type text="STAYS." x={60} y={1560} size={150} color={red} angle={-6}/>
 </>;break;
 case 'engineered':content=<>
  <Type text={"SAME\nLAYOUT."} x={35} y={140} size={240} color="#b4c5c8"/>
  <Picture name="swb.webp" x={-50} y={680} w={1230}/>
  <Guy pose="10-explaining" x={-120} y={1220} w={840}/>
  <Type text={"BETTER\nENGINEERING."} x={550} y={1360} size={82} color={cyan} angle={6}/>
 </>;break;
 case 'wheelbase':{
  const ext=interpolate(q,[1.44,2.7],[0,65],clamp);
  content=<>
   <Type text="1968" x={50} y={145} size={160} color="#9ca8ac"/>
   <Picture name="swb.webp" x={40} y={370} w={1000} opacity={.55}/>
   <Type text="1969" x={50} y={760} size={180} color={cyan}/>
   <Picture name="lwb.webp" x={40} y={970} w={1000}/>
   <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M218 695 H790 M218 665 V720 M790 665 V720" fill="none" stroke="#859295" strokeWidth="8"/><path d={`M218 1300 H${790+ext} M218 1265 V1335 M${790+ext} 1265 V1335`} fill="none" stroke={cyan} strokeWidth="12"/></svg>
   <Type text="2,211 mm" x={280} y={716} size={70} color="#6b797d"/>
   <Type text="2,268 mm" x={335} y={1350} size={92} color={cyan}/>
   <Guy pose="04-pointing" x={350} y={1450} w={660} rotate={-5}/>
  </>;break;}
 case '57':content=<>
  <Type text="+57" x={40} y={140} size={620} color={cyan} scale={.88+.12*enter}/>
  <Type text="MM" x={485} y={680} size={335}/>
  <Picture name="swb.webp" x={-80} y={1100} w={1240}/>
  <Guy pose="04-pointing" x={-240} y={950} w={800} rotate={-14}/>
  <Type text="LONGER WHEELBASE" x={160} y={1630} size={86} color={cyan}/>
 </>;break;
 case 'tyres':content=<>
  <Picture name="tyre.webp" x={-90} y={370} w={660} rotate={q*9}/>
  <Picture name="tyre.webp" x={535} y={405} w={700} rotate={-q*6}/>
  <Guy pose="10-explaining" x={220} y={1250} w={820}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M175 1220 H920 M175 1180 V1260 M920 1180 V1260" stroke={cyan} strokeWidth="12" fill="none"/></svg>
 </>;break;
 case 'suspension':content=<>
  <Picture name="axle.webp" x={-100} y={330} w={1250} rotate={-4+q*3}/>
  <Type text="LINKS" x={40} y={160} size={200} color="#b7c7ca"/>
  <Guy pose="04-pointing" x={520} y={1170} w={780} rotate={8} flip/>
  <Arrow x1={420} y1={1180} x2={390} y2={845}/>
 </>;break;
 case 'evolve':{
  const pic=q<.75?'swb.webp':q<1.5?'993tech0.webp':'modern-user.webp';
  content=<>
   <Type text="DECADES" x={30} y={170} size={225} color={cyan}/>
   <Picture name={pic} x={-90} y={490} w={1280} scale={.97+.03*Math.sin(q*6)}/>
   <Guy pose="talk" x={50} y={1140} w={850} rotate={-5}/>
   <Type text={"REFINE.\nREPEAT."} x={620} y={1390} size={120} color={ink} angle={7}/>
  </>;break;}
 case '993':content=<>
  <Type text="993" x={50} y={120} size={420} color={cyan}/>
  <Picture name="993tech0.webp" x={-130} y={565} w={1380}/>
  <Guy pose="11-looking-up" x={-120} y={1260} w={820} rotate={-10}/>
 </>;break;
 case 'axle':content=<>
  <Type text="REDESIGNED" x={50} y={160} size={170} color={cyan}/>
  <Picture name="axle.webp" x={-100} y={440} w={1290} rotate={-8+q*3}/>
  <Guy pose="04-pointing" x={-120} y={1130} w={880} rotate={-6}/>
  <Arrow x1={870} y1={1170} x2={790} y2={850}/>
 </>;break;
 case 'multilink':content=<>
  <Img src={staticFile('photo/undercarriage.jpg')} style={{position:'absolute',left:-100,top:260,width:1350,rotate:'-4deg'}}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M210 820 L660 705 L840 780 M270 860 L680 840 L830 710" stroke={cyan} strokeWidth="15" fill="none" strokeDasharray={`${1200*enter} 1200`}/><circle cx="250" cy="825" r="36" fill="none" stroke="white" strokeWidth="10"/></svg>
  <Guy pose="04-pointing" x={520} y={1230} w={780} flip rotate={5}/>
  
 </>;break;
 case 'yes':content=<>
  <Type text="YES." x={35} y={140} size={510} color={cyan}/>
  <Guy pose="07-annoyed" head x={580} y={700} w={740} rotate={14}/>
  <Picture name="classic0.webp" x={-245} y={1050} w={1030}/>
  <Arrow x1={185} y1={1110} x2={285} y2={1420} color={red}/>
 </>;break;
 default:content=<>
  <Sequence from={Math.round(53.9*60)} durationInFrames={Math.ceil(6.364*60)}><OffthreadVideo src={staticFile('media/hero.mp4')} muted style={{width:1080,height:1920,objectFit:'cover',objectPosition:'56% center'}}/></Sequence>
  <AbsoluteFill style={{background:'linear-gradient(0deg,#071014cc,transparent 55%,#07101422)'}}/>
  {t<56.34&&<Guy pose="09-arms-crossed" x={-100} y={1340} w={630} rotate={-5}/>}
  {t>=58.08&&<><Type text="911" x={65} y={1340} size={280} color="#f3f5f4"/><Type text="CHARACTER" x={80} y={1620} size={177} color="#38d5dc"/></>}
 </>;
 }
 const hero=t>=53.9;
 return <AbsoluteFill style={{background:shot.id==='problem'?'#eadbdd':'#e7e9e6',overflow:'hidden'}}>
  <style>{`@font-face {font-family:Display;src:url('${staticFile('fonts/Display.otf')}')} `}</style>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 40% 28%,#ffffff 0%,#f0f1ed 38%,#d2d7d4 100%)',opacity:shot.id==='problem'?.45:1}}/>
  {content}
  {cue&&!(hero&&t>=58.08)&&<Type text={cue.text} x={cue.x} y={cue.y} size={cue.size} color={hero?'#ffffff':cue.color==='red'?red:cue.color==='cyan'?cyan:ink} angle={cue.angle??0} scale={.94+.06*cp}/ >}
  <Audio src={staticFile('media/cedar.mp3')}/>
  <Audio src={staticFile('media/accents.mp3')} volume={.55}/>
 </AbsoluteFill>;
};
