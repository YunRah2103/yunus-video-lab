const fs=require('fs');
const path=require('path');
const root=__dirname;
const data=JSON.parse(fs.readFileSync(path.join(root,'timeline-manifest.json'),'utf8'));
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
assert(data.fps===30,'fps must be 30');
assert(data.duration_seconds>=20&&data.duration_seconds<=25.05,'duration outside approved window');
assert(data.duration_frames===Math.round(data.duration_seconds*data.fps),'frame count mismatch');
let cursor=0;
for(const beat of data.beats){
  assert(beat.start===cursor,`gap/overlap before ${beat.id}`);
  assert(beat.end>beat.start,`empty beat ${beat.id}`);
  assert(['highDownforce','drs','airbrake'].includes(beat.mode),`bad mode ${beat.mode}`);
  cursor=beat.end;
}
assert(Math.abs(cursor-data.duration_seconds)<1e-9,'timeline does not end at duration');
for(const cue of data.type_cues)assert(data.beats.some((b)=>b.id===cue.beat),`cue beat missing ${cue.beat}`);
console.log(`D timeline OK: ${data.beats.length} beats, ${data.duration_frames} frames, deterministic boundaries`);
