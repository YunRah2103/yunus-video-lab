import React from 'react';
import {spring,useCurrentFrame,useVideoConfig} from 'remotion';

export type Phrase={start:number;end:number;text:string};

const chunk=(words:string[],index:number) => {
  const sizes=[1,2,1,3,2];
  let cursor=0; let n=0;
  while(cursor<words.length){
    const size=Math.min(sizes[n%sizes.length],words.length-cursor);
    if(index>=cursor && index<cursor+size) return words.slice(cursor,cursor+size).join(' ');
    cursor+=size; n++;
  }
  return words.slice(-2).join(' ');
};

export const CaptionLayer:React.FC<{phrases:readonly Phrase[]}> = ({phrases}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const t=frame/fps;
  const phrase=phrases.find((p)=>t>=p.start && t<p.end) ?? phrases[phrases.length-1];
  if(!phrase) return null;
  const words=phrase.text.replace(/[.,:]/g,'').split(/\s+/).filter(Boolean);
  const progress=Math.max(0,Math.min(.999,(t-phrase.start)/(phrase.end-phrase.start)));
  const wordIndex=Math.floor(progress*words.length);
  const text=chunk(words,wordIndex).toUpperCase();
  const localFrame=Math.max(0,Math.round((t-phrase.start)*fps));
  const punch=spring({frame:localFrame%Math.max(1,Math.round(.85*fps)),fps,config:{damping:17,stiffness:240,mass:.55}});
  const emphasis=/57|TRACTION|REAR|AXLE|PENDULUM|MULTI|STABLE|CHARACTER/.test(text);
  return <div style={{position:'absolute',left:55,right:55,top:825,zIndex:30,textAlign:'center',fontFamily:'Arial Narrow, Arial, sans-serif',fontWeight:900,fontSize:104,lineHeight:.94,color:emphasis?'#00E5FF':'#F1F4F6',textShadow:'0 5px 0 #05080B',transform:`scale(${.95+.05*punch})`}}>{text}</div>;
};
