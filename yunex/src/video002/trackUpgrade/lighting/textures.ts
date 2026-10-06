import * as THREE from 'three';

const clampByte=(value:number)=>Math.max(0,Math.min(255,Math.round(value)));
const hash01=(seed:number)=>(((seed>>>0)*1664525+1013904223)>>>0)/4294967296;

export const createOutdoorSkyTexture=(seed:number)=>{
  const width=256;
  const height=128;
  const data=new Uint8Array(width*height*4);
  const sunU=0.70+(hash01(seed)-0.5)*0.035;
  const sunV=0.57;

  for(let y=0;y<height;y++){
    const v=y/(height-1);
    const horizon=Math.exp(-Math.pow((v-0.58)/0.16,2));
    const topMix=Math.max(0,Math.min(1,v/0.72));
    for(let x=0;x<width;x++){
      const u=x/(width-1);
      const wrappedDx=Math.min(Math.abs(u-sunU),1-Math.abs(u-sunU));
      const sun=Math.exp(-(wrappedDx*wrappedDx/0.0036+Math.pow(v-sunV,2)/0.0026));
      const subtleBand=Math.sin((u*2.0+hash01(seed+17))*Math.PI*2)*1.2*horizon;
      const r=THREE.MathUtils.lerp(118,205,topMix)+horizon*20+sun*26+subtleBand;
      const g=THREE.MathUtils.lerp(154,211,topMix)+horizon*17+sun*20+subtleBand*0.7;
      const b=THREE.MathUtils.lerp(190,209,topMix)+horizon*9+sun*9;
      const i=(y*width+x)*4;
      data[i]=clampByte(r);
      data[i+1]=clampByte(g);
      data[i+2]=clampByte(b);
      data[i+3]=255;
    }
  }

  const texture=new THREE.DataTexture(data,width,height,THREE.RGBAFormat);
  texture.mapping=THREE.EquirectangularReflectionMapping;
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=false;
  texture.needsUpdate=true;
  return texture;
};

export const createContactShadowTexture=()=>{
  const size=160;
  const data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const nx=(x/(size-1)-0.5)*2;
    const ny=(y/(size-1)-0.5)*2;
    const radial=nx*nx*1.18+ny*ny*0.84;
    const core=Math.exp(-radial*3.15);
    const edge=Math.max(0,1-Math.pow(Math.max(0,radial-0.35),1.45));
    const alpha=Math.max(0,Math.min(1,core*0.78+edge*0.06));
    const i=(y*size+x)*4;
    data[i]=22;
    data[i+1]=26;
    data[i+2]=24;
    data[i+3]=clampByte(alpha*255);
  }
  const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=false;
  texture.needsUpdate=true;
  return texture;
};
