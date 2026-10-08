import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {useThree} from '@react-three/fiber';
import {staticFile,delayRender,continueRender,cancelRender} from 'remotion';
import * as THREE from 'three';
import {Surface} from '../video002/trackUpgrade/racetrack/Surface';
import {Kerbs} from '../video002/trackUpgrade/racetrack/Kerbs';
import {Runoff} from '../video002/trackUpgrade/racetrack/Runoff';
import {TRACK_LAYOUT_CONFIG,sampleTrackAtLocalZ} from '../video002/trackUpgrade/racetrack/layout';
import {createContactShadowTexture} from '../video002/trackUpgrade/lighting/textures';
import {CIRCUIT_SEED,forestLayout,rngFor,terrainY} from './layout';

type V=[number,number,number];
type Item={p:V;s:V;r?:V;c?:string};
const mat=(color:string,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const box=(g:THREE.Group,p:V,s:V,m:THREE.Material,r:V=[0,0,0])=>{const o=new THREE.Mesh(new THREE.BoxGeometry(...s),m);o.position.set(...p);o.rotation.set(...r);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
const instances=(g:THREE.Group,geo:THREE.BufferGeometry,m:THREE.Material,items:Item[],shadow=false)=>{
 const o=new THREE.InstancedMesh(geo,m,items.length),dummy=new THREE.Object3D(),c=new THREE.Color();
 items.forEach((t,i)=>{dummy.position.set(...t.p);dummy.rotation.set(...(t.r??[0,0,0]));dummy.scale.set(...t.s);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);if(t.c)o.setColorAt(i,c.set(t.c));});o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;o.castShadow=shadow;o.receiveShadow=true;o.computeBoundingSphere();g.add(o);return o;
};
const canvasTexture=(width:number,height:number,draw:(c:CanvasRenderingContext2D)=>void)=>{const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;draw(canvas.getContext('2d')!);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;};
const groundTexture=(seed:number)=>canvasTexture(1024,1024,c=>{
 const r=rngFor(seed);c.fillStyle='#7c8650';c.fillRect(0,0,1024,1024);
 // Broad dry patches plus individual blades break the uniform lawn appearance.
 for(let i=0;i<260;i++){const x=r()*1024,y=r()*1024,rad=12+r()*90;const grad=c.createRadialGradient(x,y,0,x,y,rad);grad.addColorStop(0,i%3?'#9a925444':'#3b552944');grad.addColorStop(1,'#77814400');c.fillStyle=grad;c.fillRect(x-rad,y-rad,rad*2,rad*2);}
 for(let i=0;i<78000;i++){const x=r()*1024,y=r()*1024;c.strokeStyle=['#adac70','#496b35','#859644','#c5b987','#657c3b'][i%5];c.globalAlpha=.20+r()*.55;c.lineWidth=.5+r();c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*4,y-2-r()*8);c.stroke();}c.globalAlpha=1;
});
const gravelTexture=()=>canvasTexture(512,512,c=>{const r=rngFor(72031);c.fillStyle='#adab99';c.fillRect(0,0,512,512);for(let i=0;i<40000;i++){c.fillStyle=['#bdb5a0','#7a8073','#dad4c0','#96947e'][i%4];c.globalAlpha=.35+r()*.6;c.fillRect(r()*512,r()*512,1+r()*3,1+r()*2);}c.globalAlpha=1;});
const pavingTexture=()=>canvasTexture(512,512,c=>{const r=rngFor(58131);c.fillStyle='#535b56';c.fillRect(0,0,512,512);for(let i=0;i<47000;i++){c.fillStyle=i%2?'#81847a':'#323d32';c.globalAlpha=.08+r()*.2;c.fillRect(r()*512,r()*512,1+r()*3,1+r()*3);}c.globalAlpha=.4;c.strokeStyle='#abb5a1';c.lineWidth=1;for(let i=0;i<512;i+=128){c.beginPath();c.moveTo(i,0);c.lineTo(i,512);c.moveTo(0,i);c.lineTo(512,i);c.stroke();}c.globalAlpha=1;});
const wireTexture=()=>canvasTexture(128,128,c=>{c.clearRect(0,0,128,128);c.strokeStyle='rgba(130,142,145,.75)';c.lineWidth=1.3;for(let i=-128;i<256;i+=16){c.beginPath();c.moveTo(i,0);c.lineTo(i+128,128);c.moveTo(i,0);c.lineTo(i-128,128);c.stroke();}});
const signTexture=(label:string,small:string)=>canvasTexture(1024,256,c=>{c.fillStyle='#182925';c.fillRect(0,0,1024,256);c.fillStyle='#b9d975';c.fillRect(0,225,1024,8);c.font='bold 110px Arial';c.textAlign='center';c.fillStyle='#f2f0e9';c.fillText(label,512,136);c.font='29px Arial';c.fillStyle='#b9d975';c.fillText(small,512,195);});
const board=(g:THREE.Group,p:V,size:V,label:string,small:string,yaw=0)=>{const t=signTexture(label,small);const m=new THREE.MeshStandardMaterial({map:t,roughness:.6});const o=new THREE.Mesh(new THREE.BoxGeometry(...size),[mat('#1c2826'),mat('#1c2826'),mat('#1c2826'),mat('#1c2826'),m,m]);o.position.set(...p);o.rotation.y=yaw;o.castShadow=true;g.add(o);};
const buildTerrain=(g:THREE.Group,seed:number)=>{
 const geo=new THREE.PlaneGeometry(430,430,96,96);geo.rotateX(-Math.PI/2);const a=geo.attributes.position,colors:number[]=[];const color=new THREE.Color();
 for(let i=0;i<a.count;i++){const x=a.getX(i),z=a.getZ(i);a.setY(i,terrainY(x,z));const n=.5+.23*Math.sin(x*.039+z*.026)+.12*Math.sin(z*.13-x*.16);color.set('#c7bd8d').lerp(new THREE.Color('#718552'),n);colors.push(color.r,color.g,color.b);}
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const t=groundTexture(seed);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(100,100);const m=new THREE.MeshStandardMaterial({map:t,vertexColors:true,color:'#ffffff',roughness:1});const o=new THREE.Mesh(geo,m);o.receiveShadow=true;g.add(o);
};
const buildForest=(g:THREE.Group,seed:number,foliage:THREE.Texture)=>{
 const r=rngFor(seed+1),trunks:Item[]=[],branches:Item[]=[],leaves:Item[]=[],shadowLeaves:Item[]=[];
 for(const t of forestLayout(seed)){
  const th=t.height*.50;trunks.push({p:[t.x,t.y+th/2,t.z],s:[.18,th,.18],c:'#57483a'});
  for(const side of [-1,1])branches.push({p:[t.x+side*.38,t.y+th*.92,t.z],s:[.07,t.width*.28,.07],r:[.1,t.phase,side*.6],c:'#504331'});
  // 9 crossed leaf clusters per tree; variation in silhouette, height and autumn tint.
  for(let k=0;k<9;k++){
   const a=k*2.4+t.phase,rad=k<7?t.width*.23:0,py=t.y+t.height*(.54+(k%3)*.15);
   const p:V=[t.x+Math.cos(a)*rad,py,t.z+Math.sin(a)*rad];const width=t.width*(.55+r()*.28),height=t.height*(.27+r()*.09);
   for(let axis=0;axis<3;axis++)(Math.abs(t.x-sampleTrackAtLocalZ(t.z).center[0])<23?shadowLeaves:leaves).push({p,s:[width,height,1],r:axis===2?[Math.PI/2,0,a]:[0,a+axis*Math.PI/2,0],c:t.warm?'#d5cb9f':['#e3e7c7','#bdcdb1','#d2e2b4'][k%3]});
  }
 }
 instances(g,new THREE.CylinderGeometry(.8,1,1,6),mat('#ffffff'),trunks,true);
 instances(g,new THREE.CylinderGeometry(.5,.8,1,5),mat('#ffffff'),branches);
 const t=foliage,m=new THREE.MeshStandardMaterial({map:t,alphaTest:.42,side:THREE.DoubleSide,roughness:1,color:'#ffffff'});
 instances(g,new THREE.PlaneGeometry(1,1),m,leaves,false);
 instances(g,new THREE.PlaneGeometry(1,1),m,shadowLeaves,true);
 // Near verges get bushes and grass rather than only regularly spaced trunks.
 const shrubs:Item[]=[];for(let i=0;i<470;i++){const z=-132+r()*264,side=i%2?-1:1,x=sampleTrackAtLocalZ(z).center[0]+side*(9+r()*3);if(x< -9&&z>9&&z<28)continue;for(let k=0;k<2;k++)shrubs.push({p:[x,terrainY(x,z)+.38,z],s:[.8+r()*1.3,.7+r()*.65,1],r:[0,k*Math.PI/2+r(),0],c:'#d4e3aa'});}
 instances(g,new THREE.PlaneGeometry(1,1),m,shrubs);
 const blades=new THREE.BufferGeometry();blades.setAttribute('position',new THREE.Float32BufferAttribute([-.04,0,0,.04,0,0,0,.34,.05,0,0,-.04,0,0,.04,.05,.28,0],3));blades.computeVertexNormals();
 const grass:Item[]=[];for(let i=0;i<4200;i++){const z=-135+r()*270,side=i%2?-1:1,x=sampleTrackAtLocalZ(z).center[0]+side*(8.7+r()*5);if(x< -9&&z>9&&z<28)continue;grass.push({p:[x,terrainY(x,z)+.01,z],s:[.8+r(),.45+r()*.9,.8+r()],r:[0,r()*6.28,0],c:i%5?'#7c9351':'#b8aa70'});}
 instances(g,blades,new THREE.MeshStandardMaterial({color:'#ffffff',side:THREE.DoubleSide,roughness:1}),grass);

};
const buildFurniture=(g:THREE.Group)=>{
 const rails:Item[]=[],posts:Item[]=[],fences:Item[]=[];const wire=wireTexture();wire.wrapS=wire.wrapT=THREE.RepeatWrapping;wire.repeat.set(9,7);
 for(const side of [-1,1])for(let z=-139;z<139;z+=3){
  const a=sampleTrackAtLocalZ(z),b=sampleTrackAtLocalZ(z+3);const q=side<0?a.barrierLeft:a.barrierRight;const w=side<0?b.barrierLeft:b.barrierRight;const yaw=Math.atan2(w[0]-q[0],w[1]-q[1]),len=Math.hypot(w[0]-q[0],w[1]-q[1]);
  posts.push({p:[q[0]+side*.12,.36,q[1]],s:[.1,.9,.12]});
  for(const y of [.39,.65])rails.push({p:[(q[0]+w[0])/2,y,(q[1]+w[1])/2],s:[.09,.22,len],r:[0,yaw,0]});
  // Catch fencing outside guardrail; no unsafe objects encroach on the racing surface.
  if(z<65&&z>-72){posts.push({p:[q[0]+side*.5,1.4,q[1]],s:[.065,2.8,.065]});fences.push({p:[(q[0]+w[0])/2+side*.5,1.72,(q[1]+w[1])/2],s:[len,1.7,1],r:[0,yaw+Math.PI/2,0]});}
 }
 instances(g,new THREE.BoxGeometry(1,1,1),mat('#939d9c',.52,.55),rails,true);
 instances(g,new THREE.BoxGeometry(1,1,1),mat('#596b66',.7,.25),posts,true);
 instances(g,new THREE.PlaneGeometry(1,1),new THREE.MeshStandardMaterial({map:wire,alphaTest:.3,side:THREE.DoubleSide,roughness:.7,color:'#b5bcb7'}),fences);
 const stone=mat('#c0bcb0'),steel=mat('#293c36',.5,.4),roof=mat('#314942',.66,.25),glass=mat('#6e9296',.25,.25);
 // Low marshal station on the approach to the bend.
 box(g,[-13,.22,20],[5,.45,5],stone);box(g,[-13,1.45,20],[3.8,2.1,3.2],mat('#cec7ad'));
 box(g,[-13,2.72,20],[4.6,.18,4],roof);box(g,[-10.99,1.75,20],[.04,.8,2.3],glass);box(g,[-13,1.75,18.36],[2.7,.8,.04],glass);
 board(g,[-13,2.2,18.3],[2.5,.43,.05],'02','MARSHAL POST');
 // Small paddock garage, glazed race-control tower and roofed grandstand.
 const paving=pavingTexture();paving.wrapS=paving.wrapT=THREE.RepeatWrapping;paving.repeat.set(5,4);const paved=new THREE.MeshStandardMaterial({map:paving,roughness:.97});box(g,[30,.12,-10],[28,.25,23],paved);
 box(g,[33,2.0,-10],[15,4,17],mat('#b9b6a5'));box(g,[33,4.12,-10],[16,.24,18],roof);
 for(let z=-16;z<=-4;z+=6){box(g,[25.45,1.55,z],[.09,2.8,4.4],mat('#3f534c'));box(g,[25.38,2.3,z],[.08,.9,3.5],glass);}
 board(g,[25.35,3.6,-10],[13,.75,.12],'YUNEX','PADDOCK / EAST LOOP',Math.PI/2);
 // Metal cladding, framed glazing and sectional garage-door ribs.
 const cladding=mat('#8d9b92',.55,.45),trim=mat('#273d34',.5,.3);
 for(let z=-18.2;z<-1.8;z+=.72)box(g,[25.48,2,z],[.028,3.85,.025],cladding);
 for(const z of [-16,-10,-4]){
  for(let j=0;j<10;j++)box(g,[25.35,.25+j*.28,z],[.08,.025,4.3],cladding);
  for(const dz of [-2.3,2.3])box(g,[25.3,1.55,z+dz],[.16,2.9,.11],trim);
  box(g,[25.3,3.04,z],[.16,.11,4.7],trim);
 }
 box(g,[25.3,.16,-10],[1.8,.11,18],stone);

 box(g,[26,3.0,25],[5,6,5],stone);box(g,[26,6.4,25],[6,1.9,6],glass);box(g,[26,7.5,25],[6.8,.22,6.8],roof);
 for(const dx of [-3,-1,1,3])for(const dz of [-3,3])box(g,[26+dx,6.4,25+dz],[.08,1.95,.09],steel);
 for(const dz of [-1,1])for(const dx of [-3,3])box(g,[26+dx,6.4,25+dz],[.09,1.95,.08],steel);
 box(g,[26,5.42,25],[6.15,.12,6.15],steel);

 for(let k=0;k<5;k++){box(g,[27+k*.8,.5+k*.45,-42],[1.1,.45,18],mat(k%2?'#64766b':'#889480'));for(let j=0;j<9;j++)box(g,[27+k*.8,.84+k*.45,-49+j*1.7],[.4,.1,.55],mat(j%3?'#a4c565':'#d9ddd0'));}
 box(g,[29,4.5,-42],[8,.18,21],roof);
 for(let z=-51;z<=-33;z+=3)box(g,[29,4.3,z],[8,.12,.12],steel);
 box(g,[25,2.75,-42],[.09,.08,18],steel);
for(const z of [-51,-33])for(const x of [25,33])box(g,[x,2.3,z],[.15,4.6,.15],steel);
 // Track bridge creates a recognisable landmark and foreground parallax.
 const z=-27,center=sampleTrackAtLocalZ(z).center[0];
 for(const x of [center-8.6,center+8.6]){box(g,[x,2.7,z],[.4,5.4,.5],steel);box(g,[x,.2,z],[1,.4,1],stone);}
 box(g,[center,5.5,z],[17.6,.45,.45],steel);board(g,[center,5.04,z],[15.5,.9,.18],'YUNEX','CIRCUIT / WOODLAND SECTOR');
 for(const z of [-62,-46,42,65]){const x=sampleTrackAtLocalZ(z).barrierLeft[0]-.7;box(g,[x,.65,z],[.16,1.3,.2],steel);board(g,[x,.9,z],[1.7,1,.09],String(z===42?50:z===65?100:z===-46?150:200),'BRAKING',Math.PI/2);}
 // Lived-in safety equipment and spectator-area objects.
 for(let i=0;i<10;i++)box(g,[-10.8,.32,24+i*.6],[.7,.64,.56],mat(i%2?'#434e42':'#a4bb70'));
 for(const z of [-34,-18]){box(g,[17,.4,z],[1.4,.8,.8],mat('#40544a'));box(g,[17,.84,z],[1.5,.1,.95],roof);}
};
const buildCharacter=(g:THREE.Group,seed:number)=>{
 const r=rngFor(seed+84),stone=mat('#afa894'),steel=mat('#334c40',.62,.25),rubber=mat('#28302a',.97),white=mat('#e2ddca');
 // Garage side glazing, vertical timber ribs and roof seams remove blank walls.
 for(let z=-17.5;z< -2;z+=1.4){box(g,[40.55,2.1,z],[.08,3.6,.045],mat('#938e77'));}
 for(const z of [-18.57,-1.43])for(let x=27;x<40;x+=2.1){box(g,[x,2.55,z],[1.5,1.1,.06],mat('#4f7778',.26,.18));box(g,[x,2.55,z],[.06,1.18,.08],steel);}
 for(const z of [-18.58,-1.42]){box(g,[33,.48,z],[15,.42,.045],mat('#6e7c66'));box(g,[33,3.72,z],[15,.16,.06],steel);for(let x=26;x<40;x+=.6)box(g,[x,1.15,z],[.025,.88,.025],mat('#a3a18b'));}
 for(let z=-18;z<=-2;z+=1.1)box(g,[33,4.26,z],[15.4,.035,.045],steel);
 // Pit apron markings, a sheltered terrace and furniture outside the catch fence.
 for(const z of [-16,-10,-4]){box(g,[20,.259,z],[5,.006,.09],white);box(g,[17.5,.259,z],[.09,.006,3.5],white);}
 for(const x of [18,22])box(g,[x,.258,-20],[.09,.006,18],white);
 box(g,[35,.13,7],[12,.26,9],stone);
 for(const x of [31,37])for(const z of [4,10]){box(g,[x,1.75,z],[.1,3.5,.1],steel);}
 box(g,[34,3.55,7],[9,.13,8],mat('#637262',.8));
 for(const z of [4.5,8.5]){box(g,[33,.76,z],[5,.15,.85],mat('#81755c'));for(const x of [31,35])box(g,[x,.38,z],[.11,.76,.65],steel);}
 // Tire bundles at the marshal post use actual cylinders, rather than box props.
 const tires:Item[]=[];for(let i=0;i<12;i++)for(let k=0;k<3;k++)tires.push({p:[-11.7,.13+k*.24,27+i*.52],s:[.49,.24,.49],r:[0,r()*6.28,0]});
 instances(g,new THREE.CylinderGeometry(.5,.5,1,16),rubber,tires,true);
 for(const z of [-22,-19,-16,-13]){const cone=new THREE.Mesh(new THREE.ConeGeometry(.18,.55,12),mat('#ce6639'));cone.position.set(17,.52,z);cone.castShadow=true;g.add(cone);box(g,[17,.26,z],[.42,.07,.42],rubber);}
 // Granular shoulder varies subtly along each verge and stays beyond the kerbs.
 const gravel=gravelTexture();gravel.wrapS=gravel.wrapT=THREE.RepeatWrapping;gravel.repeat.set(2,18);const gm=new THREE.MeshStandardMaterial({map:gravel,roughness:1});
 const shoulders:Item[]=[];for(const side of [-1,1])for(let z=-135;z<135;z+=3){const a=sampleTrackAtLocalZ(z),b=sampleTrackAtLocalZ(z+3),x=(a.center[0]+b.center[0])/2+side*7.7;shoulders.push({p:[x,-.025,z+1.5],s:[.8,.018,3.05],r:[0,Math.atan2(b.center[0]-a.center[0],3),0]});}instances(g,new THREE.BoxGeometry(1,1,1),gm,shoulders);
 // Rubber traces are restrained, road-relative and broken rather than graphic arrows.
 const marks:Item[]=[];for(let z=-110;z<105;z+=1.4){const a=sampleTrackAtLocalZ(z),b=sampleTrackAtLocalZ(z+1.4),yaw=Math.atan2(b.center[0]-a.center[0],1.4);for(const side of [-1,1])if(r()>.15)marks.push({p:[a.center[0]+Math.sin(z*.021)*1.1+side*.7,.004,z],s:[.14+r()*.13,.002,.8+r()*.5],r:[0,yaw,0]});}
 instances(g,new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:'#202722',transparent:true,opacity:.075,depthWrite:false,roughness:1}),marks);
 // Natural stones and sparse pale flowers add scale to the verge.
 const rocks:Item[]=[];for(let i=0;i<90;i++){const z=-134+r()*268,x=sampleTrackAtLocalZ(z).center[0]+(i%2?-1:1)*(11+r()*9);if(x>17&&z>-62&&z<35)continue;const h=.15+r()*.35;rocks.push({p:[x,terrainY(x,z)+h*.25,z],s:[h*2,h,h*1.4],r:[r(),r()*6,r()],c:i%3?'#a19b83':'#727b65'});}instances(g,new THREE.IcosahedronGeometry(1,0),mat('#ffffff'),rocks,true);
};
const buildSkyDome=(g:THREE.Group)=>{
 const material=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 vDir;void main(){vDir=(modelMatrix*vec4(position,0.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`varying vec3 vDir;void main(){vec3 d=normalize(vDir);float h=pow(max(d.y,0.0),0.45);vec3 col=mix(vec3(0.82,0.85,0.81),vec3(0.31,0.56,0.77),h);float cloud=max(0.0,sin(d.x*29.0+d.z*14.0)+sin(d.z*46.0-d.x*21.0)-0.9)*smoothstep(0.06,0.4,d.y)*(1.0-smoothstep(0.55,0.9,d.y));col=mix(col,vec3(0.9,0.9,0.85),cloud*0.16);gl_FragColor=vec4(col,1.0);}`});
 material.toneMapped=false;const dome=new THREE.Mesh(new THREE.SphereGeometry(350,32,16),material);dome.renderOrder=-100;g.add(dome);
};
const buildWorld=(seed:number,foliage:THREE.Texture)=>{const g=new THREE.Group();g.name='YUNEX_CIRCUIT_ENVIRONMENT_V2';buildSkyDome(g);buildTerrain(g,seed);buildForest(g,seed,foliage);buildFurniture(g);buildCharacter(g,seed);return g;};
const skyTexture=()=>{
 const w=512,h=256,data=new Uint8Array(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const v=y/(h-1),u=x/w,up=Math.max(0,(v-.48)/.52),haze=Math.exp(-Math.pow((v-.5)/.13,2));
  const cloud=Math.max(0,Math.sin(u*24+v*13)+Math.sin(u*51-v*7)-.8)*Math.exp(-Math.pow((v-.72)/.17,2))*.23;
  const sun=Math.exp(-Math.pow((u-.18)/.035,2)-Math.pow((v-.6)/.035,2));
  const rgb=[184-91*up+45*haze+70*sun,202-43*up+28*haze+42*sun,208+7*up+9*haze+12*sun];
  const i=(y*w+x)*4;for(let k=0;k<3;k++)data[i+k]=Math.min(255,rgb[k]+cloud*75);data[i+3]=255;
 }
 const t=new THREE.DataTexture(data,w,h);t.colorSpace=THREE.SRGBColorSpace;t.mapping=THREE.EquirectangularReflectionMapping;t.needsUpdate=true;return t;
};
export const CircuitWorldV2:React.FC<{carPose:{position:V;rotation?:V};seed?:number}>=({carPose,seed=CIRCUIT_SEED})=>{
 const {gl,scene}=useThree();const [foliage,setFoliage]=useState<THREE.Texture|null>(null);const [leafHandle]=useState(()=>delayRender('Loading natural oak alpha asset'));const leafContinued=useRef(false);
 const world=useMemo(()=>foliage?buildWorld(seed,foliage):null,[seed,foliage]),sky=useMemo(skyTexture,[]),contact=useMemo(createContactShadowTexture,[]);
 useEffect(()=>{let live=true;new THREE.TextureLoader().load(staticFile('circuit-v2-oak-cluster.webp'),t=>{if(!live){t.dispose();return;}t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;setFoliage(t);},undefined,cancelRender);return()=>{live=false;};},[]);
 useEffect(()=>{if(world&&!leafContinued.current){leafContinued.current=true;continueRender(leafHandle);}},[world,leafHandle]);
 useEffect(()=>()=>{foliage?.dispose();},[foliage]);useEffect(()=>()=>{sky.dispose();contact.dispose();},[sky,contact]);const key=useRef<THREE.DirectionalLight>(null),target=useRef<THREE.Object3D>(null);
 useLayoutEffect(()=>{
  const bg=scene.background,env=scene.environment,fog=scene.fog,exposure=gl.toneMappingExposure,tone=gl.toneMapping,oldEnvIntensity=scene.environmentIntensity,oldShadow=gl.shadowMap.enabled,oldShadowType=gl.shadowMap.type;const p=new THREE.PMREMGenerator(gl),e=p.fromEquirectangular(sky);
  const asphalt=scene.getObjectByName('RacingSurface_Asphalt') as THREE.Mesh|undefined;
  if(asphalt){const road=asphalt.material as THREE.MeshStandardMaterial;road.color.set('#e0e2de');road.bumpMap=road.map;road.bumpScale=.007;road.roughness=.95;road.needsUpdate=true;}
  scene.background=sky;scene.environment=e.texture;scene.environmentIntensity=.64;scene.fog=new THREE.Fog('#bac6b4',85,340);gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.02;gl.shadowMap.enabled=true;gl.shadowMap.type=THREE.PCFSoftShadowMap;
  return()=>{scene.background=bg;scene.environment=env;scene.fog=fog;scene.environmentIntensity=oldEnvIntensity;gl.shadowMap.enabled=oldShadow;gl.shadowMap.type=oldShadowType;gl.toneMappingExposure=exposure;gl.toneMapping=tone;e.dispose();p.dispose();};
 },[gl,scene,sky]);
 useLayoutEffect(()=>{if(key.current&&target.current){const [x,y,z]=carPose.position;target.current.position.set(x,y+.2,z);key.current.position.set(x-22,y+32,z-14);key.current.target=target.current;target.current.updateMatrixWorld();key.current.updateMatrixWorld();}},[carPose]);
 useEffect(()=>()=>{const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();world?.traverse(o=>{const m=o as THREE.Mesh;if(m.isMesh){geometries.add(m.geometry);for(const a of Array.isArray(m.material)?m.material:[m.material]){materials.add(a);const b=a as THREE.MeshStandardMaterial;if(b.map&&b.map!==foliage)textures.add(b.map);}}});for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const g of geometries)g.dispose();},[world,foliage]);
 return <>
  <group position={TRACK_LAYOUT_CONFIG.rootPosition} rotation={[0,Math.PI,0]}>
   <Surface quality="final" seed={seed}/><Kerbs quality="final" seed={seed}/><Runoff quality="final" seed={seed}/>{world&&<primitive object={world}/>}
  </group>
  <hemisphereLight args={['#c6deed','#494d2d',.95]}/><object3D ref={target}/>
  <directionalLight ref={key} color="#fff0cb" intensity={3.35} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-24} shadow-camera-right={24} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-camera-near={.2} shadow-camera-far={95} shadow-bias={-.00012} shadow-normalBias={.018}/>
  <mesh position={[carPose.position[0],carPose.position[1]+.0024,carPose.position[2]]} rotation={[-Math.PI/2,0,carPose.rotation?.[1]??0]}><planeGeometry args={[2.2,4.9]}/><meshBasicMaterial map={contact} transparent opacity={.25} depthWrite={false} toneMapped={false}/></mesh>
 </>;
};
