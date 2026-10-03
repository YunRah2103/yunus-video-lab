import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';

// Production art is retained unchanged. Explicit viewports isolate each pose
// without regenerating identity or resampling the raster in the build pipeline.
type Rect = readonly [number, number, number, number];
const poses: Record<string, Rect> = {
  '01-neutral': [65, 5, 305, 408],
  '02-talking-a': [443, 5, 354, 408],
  '03-talking-b': [443, 5, 354, 408],
  '04-pointing': [852, 5, 402, 408],
  '05-confused': [0, 421, 450, 395],
  '06-surprised': [445, 421, 374, 395],
  '07-annoyed': [855, 421, 395, 395],
  '08-thinking': [62, 827, 310, 414],
  '09-arms-crossed': [855, 421, 395, 395],
  '10-explaining': [432, 827, 466, 414],
  '11-looking-up': [876, 827, 378, 414],
  '12-looking-side': [432, 827, 466, 414],
  talk: [443, 5, 354, 408],
};
const heads: Record<string, Rect> = {
  '05-confused': [627, 0, 627, 627],
  '06-surprised': [0, 627, 627, 627],
  '07-annoyed': [627, 627, 627, 627],
  '08-thinking': [0, 0, 627, 627],
  talk: [0, 0, 627, 627],
};

export const PacketGuyRework: React.FC<{
  pose: string; x: number; y: number; w: number;
  head?: boolean; rotate?: number; flip?: boolean; anchorBottom?: boolean;
}> = ({pose, x, y, w, head = false, rotate = 0, flip = false, anchorBottom = true}) => {
  const frame = useCurrentFrame();
  const rect = head ? (heads[pose] ?? heads['08-thinking']) : (poses[pose] ?? poses['01-neutral']);
  const [sx, sy, sw, sh] = rect;
  const width = head ? w : w * .92;
  const height = head ? width * sh / sw : width * 1.06;
  const top = head || !anchorBottom ? y : Math.max(y, 1920-height+75);
  const explaining = !head && (pose === '10-explaining' || pose === '12-looking-side');
  const lookingUp = !head && pose === '11-looking-up';
  const motion = pose === 'talk' || pose === '10-explaining';
  // Tiny speech emphasis and body settling, rather than a metronomic bob.
  const emphasis = motion ? Math.sin(frame * .11) * Math.sin(frame * .037) : 0;
  return <div style={{position:'absolute',left:x + (head ? 0 : w*.045),top,
    width,height,rotate:`${rotate + emphasis*.5}deg`,
    scale:flip ? '-1 1' : undefined,translate:`0px ${emphasis*2}px`,
    transformOrigin:'50% 72%',filter:'drop-shadow(2px 6px 0px #ffffff70)'}}>
    <div style={{position:'absolute',inset:0,overflow:'hidden',
      clipPath:explaining?'polygon(0 0,100% 0,100% 62%,82% 74%,75% 100%,0 100%)':
        lookingUp?'polygon(8% 0,100% 0,100% 100%,0 100%,0 74%,8% 66%)':undefined}}>
      <Img src={staticFile(`presenter/rework/${head?'heads':'poses'}.png`)}
        style={{position:'absolute',maxWidth:'none',width:1254*width/sw,height:1254*height/sh,
          left:-sx*width/sw,top:-sy*height/sh}}/>
    </div>
  </div>;
};
