import React from 'react';
import {Img, staticFile} from 'remotion';
import {LiveCarCanvas} from './Car';

export type CachedCarProps = {
  view?: string;
  width?: number;
  height?: number;
  ghost?: number;
  yaw?: number;
  engine?: boolean;
  grip?: boolean;
  zoom?: number;
};

const plate = (src: string, width: number, height: number, opacity = 1) => (
  <Img
    src={staticFile(`plates/${src}`)}
    style={{position: 'absolute', inset: 0, width, height, opacity}}
  />
);

export function CachedCar({
  view = 'front',
  width = 1080,
  height = 1000,
  ghost = 0,
  yaw = 0,
  engine = false,
  grip = false,
  zoom = 170,
}: CachedCarProps) {
  let layers: React.ReactNode = null;

  if (view === 'rear') {
    const t = Math.max(0, Math.min(1, ghost / 0.92));
    layers = (
      <>
        {plate('rear-solid.png', width, height, 1 - t)}
        {plate('rear-cutaway.png', width, height, t)}
      </>
    );
  } else if (view === 'side' && grip) {
    layers = plate('side-grip.png', width, height);
  } else if (view === 'side' && engine) {
    layers = plate('side-cutaway.png', width, height);
  } else if (view === 'front') {
    layers = plate('front.png', width, height);
  } else if (view === 'top') {
    const index = Math.max(0, Math.min(51, Math.round((-yaw / 0.62) * 51)));
    layers = plate(`top-${String(index).padStart(3, '0')}.png`, width, height);
  } else {
    return (
      <LiveCarCanvas
        view={view}
        width={width}
        height={height}
        ghost={ghost}
        yaw={yaw}
        engine={engine}
        grip={grip}
        zoom={zoom}
      />
    );
  }

  return <div style={{position: 'relative', width, height}}>{layers}</div>;
}
