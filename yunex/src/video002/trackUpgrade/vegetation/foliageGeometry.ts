import * as THREE from 'three';

// A small reusable cluster of alpha-tested leaf cards: no transparent sorting,
// no external images, and no view-dependent billboards.
export function makeFoliageGeometry(radius=.5, seed=2103, cards=64){
 let n=seed>>>0;const rnd=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 const positions:number[]=[],uvs:number[]=[],normals:number[]=[];
 for(let i=0;i<cards;i++){
  const y=rnd()*2-1,a=rnd()*Math.PI*2,r=radius*Math.cbrt(.35+rnd()*.65);
  const p=new THREE.Vector3(Math.sqrt(1-y*y)*Math.cos(a),y,Math.sqrt(1-y*y)*Math.sin(a)).multiplyScalar(r);
  const normal=new THREE.Vector3(rnd()-.5,rnd()*.9+.1,rnd()-.5).normalize();
  const tangent=new THREE.Vector3().crossVectors(normal,new THREE.Vector3(0,0,1)).normalize();
  const bitangent=new THREE.Vector3().crossVectors(normal,tangent);
  const size=radius*(.42+rnd()*.18);
  const corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
  for(const j of [0,1,2,0,2,3]){
   const q=corners[j];const v=p.clone().addScaledVector(tangent,q[0]*size).addScaledVector(bitangent,q[1]*size*.72);
   positions.push(v.x,v.y,v.z);normals.push(normal.x,normal.y,normal.z);uvs.push((q[0]+1)/2,(q[1]+1)/2);
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));return g;
}
export function makeFoliageTexture(){
 const size=128,data=new Uint8Array(size*size*4);let n=9273;
 const rnd=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 for(let j=0;j<34;j++){
  const cx=16+rnd()*96,cy=14+rnd()*100,angle=rnd()*Math.PI;
  const rx=7+rnd()*8,ry=3+rnd()*4,shade=155+rnd()*100;
  for(let y=Math.max(0,Math.floor(cy-rx));y<Math.min(size,cy+rx);y++)for(let x=Math.max(0,Math.floor(cx-rx));x<Math.min(size,cx+rx);x++){
   const dx=x-cx,dy=y-cy,u=(dx*Math.cos(angle)+dy*Math.sin(angle))/rx,v=(-dx*Math.sin(angle)+dy*Math.cos(angle))/ry;
   if(u*u+v*v>1)continue;const k=(y*size+x)*4;
   const s=shade*(.82+.18*(1-Math.abs(v)));
   data[k]=s;data[k+1]=s;data[k+2]=s*.9;data[k+3]=255;
  }
 }
 const t=new THREE.DataTexture(data,size,size);t.colorSpace=THREE.SRGBColorSpace;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t;
}
