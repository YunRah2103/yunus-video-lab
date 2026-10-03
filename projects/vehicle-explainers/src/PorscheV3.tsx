import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {cues, shots} from './data/porscheV3';
import {displayAdvance} from './data/displayAdvance';
import {PacketGuyRework as Guy} from './components/PacketGuyRework';
const ink='#131b20',cyan='#008d9f',red='#e93243';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const Picture:React.FC<{name:string,x:number,y:number,w:number,rotate?:number,scale?:number,opacity?:number}>=({name,x,y,w,rotate=0,scale=1,opacity=1})=><Img src={staticFile(`photo/${name}`)} style={{position:'absolute',left:x,top:y,width:w,rotate:`${rotate}deg`,scale,opacity,filter:'drop-shadow(0px 22px 18px #00000022)'}}/>;
const Type:React.FC<{text:string,x:number,y:number,size?:number,color?:string,angle?:number,scale?:number,fit?:number}>=({text,x,y,size=145,color=ink,angle=0,scale=1,fit})=>{
 const advance=Math.max(...text.split('\n').map(line=>[...line].reduce((v,c)=>v+(displayAdvance[c]??.5),0)),1);
 const fontSize=Math.min(size,(fit??(1080-Math.max(0,x)-30))/advance);
 return <div style={{position:'absolute',left:x,top:y,fontFamily:'Display',fontWeight:900,fontSize,lineHeight:.92,letterSpacing:-2,color,rotate:`${angle}deg`,scale,whiteSpace:'pre',WebkitTextStroke:'2px #f5f5ef',paintOrder:'stroke fill',textShadow:'3px 4px 0px #fff',transformOrigin:'left center'}}>{text}</div>;
};
const Arrow:React.FC<{x1:number,y1:number,x2:number,y2:number,color?:string}>=({x1,y1,x2,y2,color=cyan})=><svg style={{position:'absolute',inset:0,width:1080,height:1920}}><defs><marker id={`a${x1}${y1}`} markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke={color} strokeWidth="2"/></marker></defs><path d={`M${x1},${y1} Q${(x1+x2)/2+25},${(y1+y2)/2-20} ${x2},${y2}`} stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" markerEnd={`url(#a${x1}${y1})`}/></svg>;
const Arc=()=> <svg style={{position:'absolute',inset:0,width:1080,height:1920}}><path d="M150 750 Q420 260 900 690" fill="none" stroke="#e9324355" strokeWidth="16" strokeDasharray="22 18"/><path d="M670 720 Q880 900 950 600 M918 650 L950 598 L980 650" fill="none" stroke={red} strokeWidth="14"/></svg>;
export const PorscheV3:React.FC=()=>{
 const frame=useCurrentFrame(),t=frame/60,shot=shots.find(s=>t>=s.start&&t<s.end)??shots[shots.length-1],q=t-shot.start;
 const enter=spring({frame:Math.round(q*60),fps:60,config:{damping:18,stiffness:260}});
 const cue=[...cues].reverse().find(c=>t>=c.start), cp=cue?spring({frame:frame-Math.round(cue.start*60),fps:60,config:{damping:20,stiffness:400}}):1;
 const color=cue?.color==='red'?red:cue?.color==='cyan'?cyan:ink;
 // Each caption is authored against its physical subject; source word timings stay fixed.
 let caption:React.ReactNode=cue&&<Type text={cue.text} x={cue.x} y={cue.y} size={cue.size} color={t>=53.9?'#fff':color} angle={cue.angle??0} scale={.94+.06*cp}/>;
 let content:React.ReactNode;
 switch(shot.id){
 case 'hook': content=<>
  <Type text="PORSCHE" x={-12} y={60} size={255} color="#afbec0"/>
  <Picture name="modern-user.webp" x={-340+(1-enter)*100} y={230} w={1630} rotate={t>.88?-8:-5}/>
  <Guy pose={t<1.24?'05-confused':'08-thinking'} head x={t<1.24?-330:20} y={t<1.24?1020:1120} w={t<1.24?1160:810} rotate={t<1.24?-14:-6}/>
  <Type text="NORMAL?" x={650} y={1650} size={120} color={cyan} angle={-10}/>
 </>;caption=cue&&<Type text={cue.text} x={t<.88?265:430} y={1060} size={t<.88?150:210} angle={-8} scale={.92+.08*cp}/>;break;
 case 'wrong':content=<>
  <Type text="REAR" x={385} y={85} size={340} color="#b4c5c8"/>
  <Picture name="swb.webp" x={-250} y={450} w={1530} opacity={.65} rotate={-5}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><ellipse cx="866" cy="720" rx="200" ry="105" fill="#e9324322" stroke={red} strokeWidth="12"/></svg>
  <Picture name="engine1.webp" x={675+(1-enter)*120} y={555} w={535} rotate={-13}/>
  <Arrow x1={535} y1={1010} x2={880} y2={760} color={red}/>
  <Guy pose={t<3.72?'08-thinking':'05-confused'} head x={-75} y={1140} w={810} rotate={-9}/>
  {t>=3.94&&<Type text="HERE?" x={590} y={1120} size={210} color={red} angle={-13}/>}
 </>;caption=cue&&<Type text={cue.text} x={q<1.5?25:440} y={q<1.5?250:905} size={q<1.5?183:260} color={color} angle={-10} scale={.9+.1*cp}/>;break;
 case 'layout':content=<>
  <Type text="911" x={-20} y={70} size={640} color="#b5c8cb"/>
  <Picture name="swb.webp" x={45} y={520} w={990} rotate={5}/>
  <Guy pose="04-pointing" x={25} y={1170} w={780} rotate={-7}/>
  <Arrow x1={425} y1={1290} x2={845} y2={790}/>
 </>;caption=cue&&<Type text={cue.text} x={155} y={880} size={175} color={cyan} angle={5}/>;break;
 case 'engine':content=<>
  <Type text="6" x={-70} y={-30} size={1150} color="#c2d1d0"/>
  <Picture name="engine0.webp" x={35} y={530} w={1060} rotate={-8} scale={.93+.07*enter}/>
  <Type text="FLAT SIX" x={85} y={1050} size={240} color={cyan} angle={-8} scale={.95+.05*cp}/>
  <Guy pose="08-thinking" head x={440} y={1270} w={640} rotate={9}/>
 </>;caption=null;break;
 case 'behind':content=<>
  <Type text="BEHIND" x={-8} y={155} size={275} color={red}/>
  <Picture name="swb.webp" x={-620} y={680} w={1820}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M880 650 V1080" stroke={ink} strokeWidth="7" strokeDasharray="14 12"/></svg>
  <Picture name="engine0.webp" x={912} y={835} w={350}/>
  <Type text="AXLE" x={730} y={1030} size={110}/>
  <Guy pose="04-pointing" x={-420} y={1120} w={1320} rotate={-9}/>
  <Arrow x1={510} y1={1180} x2={1050} y2={1000}/>
 </>;caption=cue&&cue.start>=8.5?<Type text="REAR AXLE" x={-6} y={425} size={220} angle={-6}/>:null;break;
 case 'advantage':content=<>
  <Type text="SOMEHOW." x={-10} y={70} size={240} color={cyan}/>
  <Picture name="modern-user.webp" x={-310} y={350} w={1550} rotate={-9}/>
  {q<1?<Guy pose="05-confused" head x={250} y={1070} w={1050} rotate={14}/>:<Guy pose="10-explaining" x={-60} y={1450} w={700} rotate={-4}/>}
 </>;caption=cue&&q>=1&&<Type text={cue.text} x={q<1?30:370} y={q<1?1400:1210} size={q<1?195:172} angle={-9}/>;break;
 case 'load':content=<>
  <Type text="WEIGHT" x={-30} y={155} size={325} color="#aec2c5"/>
  <Picture name="engine1.webp" x={300} y={360} w={1010} rotate={8}/>
  <Picture name="swb.webp" x={-480} y={850+enter*32} w={1830} rotate={4}/>
  <Arrow x1={950} y1={725} x2={950} y2={1180}/>
  <Guy pose="05-confused" head x={-440} y={1290} w={1060} rotate={-16}/>
 </>;caption=cue&&cue.start>=14.24?<Type text="DRIVEN WHEELS" x={315} y={1390} size={118} color={cyan} angle={4}/>:null;break;
 case 'traction':content=<>
  <Type text="TRACTION" x={-45} y={170} size={280} color="#b1c9cc" angle={-7}/>
  <Picture name="tyre.webp" x={-290} y={410} w={1270} rotate={q*7}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M-100 1710 H1200" stroke={ink} strokeWidth="18"/><path d="M-80 1735 H810" stroke={cyan} strokeWidth="28"/></svg>
  <Guy pose="08-thinking" head x={690} y={1190} w={730} rotate={15}/>
  <Arrow x1={950} y1={500} x2={950} y2={1470}/>
 </>;caption=cue&&<Type text={cue.text} x={cue.start<15.84?70:30} y={cue.start<15.84?1490:180} size={cue.start<15.84?125:235} angle={-7}/>;break;
 case 'problem':content=<>
  <Type text="BUT…" x={-20} y={90} size={380} color={red}/>
  <Guy pose={q<.65?'07-annoyed':'06-surprised'} head x={q<.65?-130:-290} y={q<.65?550:380} w={q<.65?1260:1620} rotate={q<.65?-8:8}/>
 </>;caption=cue&&<Type text={cue.text} x={45} y={1530} size={226} angle={-8} color={red}/>;break;
 case 'mass':{
  const angle=Math.sin(q*2.8)*24;
  content=<>
   <Picture name="swb.webp" x={-380} y={150} w={1620} opacity={.22} rotate={-9}/>
   <div style={{position:'absolute',left:400,top:530,width:700,height:1000,rotate:`${angle}deg`,transformOrigin:'65% 0%'}}>
    <div style={{position:'absolute',left:440,top:0,width:9,height:420,background:ink}}/>
    <Type text={cue?.text??''} x={-330} y={160} size={cue?.start===19.62?180:164} color={color} angle={-8}/>
    <Type text="REAR MASS" x={-5} y={825} size={175} fit={640} color={red}/>
    <Picture name="engine1.webp" x={0} y={360} w={840}/>
   </div>
   <Guy pose="05-confused" head x={-65} y={1260} w={690} rotate={-10}/>
  </>;caption=null;break;}
 case 'early':content=<>
  <Type text="EARLY 911" x={-20} y={80} size={235} color="#afc1c5"/>
  <Picture name="classic1.webp" x={35+q*12} y={460} w={1010} rotate={-7+q*3}/>
  <Guy pose="12-looking-side" x={655} y={1410} w={410} flip rotate={8}/>
  <Arrow x1={105} y1={1120} x2={780} y2={1210} color={red}/>
 </>;caption=cue&&<Type text={cue.text} x={80+q*12} y={1040} size={185} color={red} angle={-7+q*3}/>;break;
 case 'lift':content=<>
  <Picture name="swb.webp" x={-280} y={330} w={1480} rotate={-5}/>
  <Type text="LIFT" x={-10} y={845} size={450} color={red} angle={-8}/>
  <Guy pose="06-surprised" head x={640} y={970} w={940} rotate={17}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M140 1330 L200 1730 L375 1700 L315 1300 Z" fill={ink}/><path d="M110 1260 L475 1220" stroke={cyan} strokeWidth="28"/><path d="M270 1240 V1080 M225 1135 L270 1080 L310 1135" fill="none" stroke={red} strokeWidth="18"/></svg>
 </>;caption=cue&&<Type text={cue.text} x={cue.start<26.58?20:425} y={cue.start<26.58?90:1270} size={cue.start<26.58?200:140} color={color} angle={-8}/>;break;
 case 'rotate':{
  const yaw=interpolate(q,[0,1.8,2.1,3.5],[0,5,36,49],clamp);
  content=<>
   <Arc/><Picture name="classic1.webp" x={-120+Math.sin(q)*55} y={370} w={1280} rotate={yaw}/>
   <Guy pose="06-surprised" head x={q>2.74?-390:-180} y={q>2.74?1080:1210} w={q>2.74?1090:760} rotate={-18}/>
   <Type text="REAR →" x={605} y={1100} size={110} color={red} angle={yaw*.3}/>
  </>;caption=cue&&<Type text={cue.text} x={cue.start<29.56?65:530} y={cue.start<29.56?120:cue.start<30.22?1270:1500} size={cue.start<29.56?167:cue.start<30.22?150:220} color={color} angle={cue.start<29.56?0:yaw*.37}/>;break;}
 case 'kept':content=<>
  <Picture name="swb.webp" x={-330} y={190} w={1650} opacity={.2}/>
  <Picture name="engine1.webp" x={65} y={575} w={970} rotate={-8}/>
  <Type text="STAYS." x={80} y={1220} size={260} color={red} angle={-8}/>
  <Guy pose="07-annoyed" x={570} y={1390} w={550} rotate={7}/>
 </>;caption=cue&&<Type text={cue.text} x={15} y={175} size={230} angle={-7}/>;break;
 case 'engineered':content=<>
  <Type text={'SAME\nLAYOUT.'} x={-25} y={30} size={310} color="#b1c8cc" angle={5}/>
  <Picture name="swb.webp" x={-35} y={660} w={1150} rotate={5}/>
  <Guy pose="08-thinking" head x={-80} y={1320} w={680} rotate={-10}/>
  <Type text={'BETTER\nENGINEERING.'} x={635} y={1470} size={84} color={cyan} angle={5}/>
 </>;caption=cue&&<Type text={cue.text} x={70} y={1010} size={185} color={cyan} angle={5}/>;break;
 case 'wheelbase':{
  const ext=interpolate(q,[1.44,2.7],[0,77],clamp);
  content=<>
   <Type text="1968" x={-8} y={25} size={230} color="#99acb1"/>
   <Picture name="swb.webp" x={-180} y={280} w={1350} opacity={.6}/>
   <Type text="1969" x={-8} y={845} size={245} color={cyan}/>
   <Picture name="lwb.webp" x={-180} y={1060} w={1350}/>
   <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M60 710 H832 M60 675 V735 M832 675 V735" fill="none" stroke="#859295" strokeWidth="9"/><path d={`M60 1520 H${832+ext} M60 1485 V1555 M${832+ext} 1485 V1555`} fill="none" stroke={cyan} strokeWidth="13"/></svg>
   <Type text="2,211 mm" x={250} y={740} size={88} color="#6b797d"/>
   <Type text="2,268 mm" x={350} y={1570} size={108} color={cyan}/>
   <Guy pose="04-pointing" x={720} y={1660} w={430} rotate={-8}/>
  </>;caption=cue&&<Type text={cue.text} x={430} y={1000} size={115} color={cyan} angle={-5}/>;break;}
 case '57':content=<>
  <Type text="+57" x={-50} y={40} size={810} color={cyan} scale={.88+.12*enter}/>
  <Type text="MM" x={620} y={790} size={295}/>
  <Type text="LONGER WHEELBASE" x={90} y={1480} size={110} color={cyan} angle={-8}/>
  <Picture name="swb.webp" x={-5} y={1110} w={1080} rotate={-5}/>
  <Guy pose="06-surprised" head x={-80} y={1410} w={650} rotate={-10}/>
 </>;caption=null;break;
 case 'tyres':content=<>
  <Type text="THEN…" x={-10} y={50} size={300}/>
  <Picture name="tyre.webp" x={-505} y={460} w={1310} rotate={q*9}/>
  <Picture name="tyre.webp" x={625} y={530} w={1040} rotate={-q*6}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d={`M160 1070 H${850+q*35} M160 1030 V1110 M${850+q*35} 1030 V1110`} stroke={cyan} strokeWidth="16" fill="none"/></svg>
  {q>=.8&&<Type text="WIDER TYRES" x={45} y={1050} size={203} color={cyan} angle={-5}/>}
  <Guy pose="10-explaining" x={660} y={1600} w={440} rotate={7}/>
 </>;caption=null;break;
 case 'suspension':content=<>
  <Type text="LINKS" x={-40} y={80} size={480} color="#b1c6cb" angle={-8}/>
  <Picture name="axle.webp" x={-360} y={450} w={1760} rotate={-14+q*5}/>
  <Guy pose="04-pointing" x={245} y={1250} w={830} rotate={8} flip/>
  <Arrow x1={510} y1={1380} x2={430} y2={940}/>
 </>;caption=cue&&<Type text={cue.text} x={15} y={1220} size={197} color={color} angle={-14+q*5}/>;break;
 case 'evolve':{
  const pic=q<.65?'swb.webp':q<1.1?'993tech0.webp':'modern-user.webp';
  content=<>
   <Type text="DECADES" x={-20} y={65} size={262} color={cyan}/>
   <Type text={'REFINE.\nREPEAT.'} x={625} y={1230} size={136} angle={10}/>
   <Picture name={pic} x={-270} y={430} w={1550} rotate={-7}/>
   <Guy pose="08-thinking" head x={-500} y={1100} w={1160} rotate={-15}/>
  </>;caption=cue&&<Type text={cue.text} x={30} y={995} size={210} angle={-7}/>;break;}
 case '993':content=<>
  <Type text="993" x={-45} y={-65} size={845} color={cyan}/>
  <Picture name="993tech0.webp" x={45} y={650} w={995} rotate={-6}/>
  <Guy pose="11-looking-up" x={660} y={1440} w={390} rotate={8} flip/>
 </>;caption=cue&&<Type text={cue.text} x={80} y={1190} size={180} angle={-6}/>;break;
 case 'axle':content=<>
  <Type text="REDESIGNED" x={-5} y={30} size={190} color={cyan} angle={-5}/>
  <Picture name="axle.webp" x={-30} y={490} w={1190} rotate={-10+q*5}/>
  <Guy pose="05-confused" head x={425} y={1240} w={660} rotate={9}/>
  <Arrow x1={355} y1={1300} x2={575} y2={900}/>
 </>;caption=cue&&<Type text={cue.text} x={45} y={1130} size={165} angle={-10+q*5}/>;break;
 case 'multilink':content=<>
  <Img src={staticFile('photo/undercarriage.jpg')} style={{position:'absolute',left:-340,top:170,width:1800,rotate:'-8deg'}}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M150 930 L700 760 L980 880 M240 970 L740 920 L950 750" stroke={cyan} strokeWidth="18" fill="none" strokeDasharray={`${1500*enter} 1500`}/><circle cx="200" cy="920" r="48" fill="none" stroke="white" strokeWidth="12"/></svg>
  <Guy pose="06-surprised" head x={-490} y={1270} w={1100} rotate={-18}/>
 </>;caption=cue&&<Type text={cue.text} x={35} y={1190} size={215} color={color} angle={-8}/>;break;
 case 'yes':content=<>
  <Type text="YES." x={-35} y={70} size={735} color={cyan}/>
  <Guy pose="07-annoyed" head x={245} y={810} w={760} rotate={7}/>
  <Picture name="classic1.webp" x={-65} y={1390} w={1010} rotate={-7}/>
  <Arrow x1={170} y1={1270} x2={800} y2={1630} color={red}/>
 </>;caption=cue&&<Type text={cue.text} x={35} y={cue.start<53.18?910:1090} size={cue.start<53.18?240:295} color={color} angle={-10}/>;break;
 default:content=<>
  <Sequence from={Math.round(53.9*60)} durationInFrames={Math.ceil(6.364*60)}><OffthreadVideo src={staticFile('media/hero.mp4')} muted style={{width:1080,height:1920,objectFit:'cover',objectPosition:'56% center'}}/></Sequence>
  <AbsoluteFill style={{background:'linear-gradient(0deg,#071014cc,transparent 55%,#07101422)'}}/>
  {t<56.34&&<Guy pose="09-arms-crossed" x={-100} y={1340} w={630} rotate={-5}/>}
  {t>=58.08&&<><Type text="911" x={65} y={1340} size={280} color="#f3f5f4"/><Type text="CHARACTER" x={80} y={1620} size={177} color="#38d5dc"/></>}
 </>;if(t>=58.08)caption=null;
 }
 const punch=t>=12.02&&t<13.1?{name:'advantage',start:12.02,end:13.1}:t>=16.42&&t<17.72?{name:'traction',start:16.42,end:17.72}:t>=44.3&&t<45.7?{name:'chassis',start:44.3,end:45.7}:null;
 if(punch){content=<>
  <Sequence from={Math.round(punch.start*60)} durationInFrames={Math.ceil(punch.end*60)-Math.round(punch.start*60)}><OffthreadVideo src={staticFile(`media/punches/${punch.name}.mp4`)} muted style={{width:1080,height:1920,objectFit:'cover'}}/></Sequence>
  <AbsoluteFill style={{background:'linear-gradient(0deg,#071014aa,transparent 60%,#07101415)'}}/>
 </>;caption=cue&&<Type text={cue.text} x={35} y={punch.name==='traction'?1390:1450} size={punch.name==='chassis'?175:245} color="#f3f5f4" angle={punch.name==='traction'?-9:-4} scale={.94+.06*cp}/>;}
 return <AbsoluteFill style={{background:shot.id==='problem'?'#eadbdd':'#e7e9e6',overflow:'hidden'}}>
  <style>{`@font-face {font-family:Display;src:url('${staticFile('fonts/Display.otf')}')} `}</style>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 40% 28%,#ffffff 0%,#f0f1ed 38%,#d2d7d4 100%)',opacity:shot.id==='problem'?.45:1}}/>
  {content}{caption}
  <Audio src={staticFile('media/cedar.mp3')}/><Audio src={staticFile('media/accents.mp3')} volume={.55}/>
 </AbsoluteFill>;
};
