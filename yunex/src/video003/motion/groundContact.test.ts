import assert from 'node:assert/strict';
import {motionStateAt} from './contract';
import {TRACK_LAYOUT_CONFIG} from '../../video002/trackUpgrade/racetrack/layout';

// Surface.tsx mounts its asphalt at -0.0104 inside the shared track root.
// The former local-only contact audit overlooked the -0.028 world transform.
const asphaltWorldY=TRACK_LAYOUT_CONFIG.rootPosition[1]-.0104;
let maximum=0;
for(let frame=0;frame<735;frame++){
  const state=motionStateAt(frame,{durationFrames:735});
  for(const wheel of Object.values(state.wheels)){
    const bottom=wheel.centreWorld[1]+wheel.uprightOffsetY-wheel.tyreRadiusM;
    maximum=Math.max(maximum,Math.abs(bottom-asphaltWorldY));
  }
}
console.log(JSON.stringify({maxWorldTyreRoadGapM:maximum}));
assert.ok(maximum<.002,`Tyres float ${maximum.toFixed(4)}m above the world-space circuit`);
