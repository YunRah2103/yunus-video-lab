import {Y004_NARRATION_SCRIPT,Y004_MEASURED_NARRATION,validateY004Narration,y004NarrationActivity01,type Y004MeasuredNarration} from './cues';
import {y004AudioEnvelope} from './envelopes';
const ok=(v:boolean,message:string)=>{if(!v)throw new Error(message);};
const fails=(fn:()=>unknown,label:string)=>{let threw=false;try{fn();}catch{threw=true;}ok(threw,label);};
const measured:Y004MeasuredNarration={
  sourceSha256:'a'.repeat(64),durationSeconds:24.0,sampleRateHz:48000,channels:2,
  sentences:Y004_NARRATION_SCRIPT.map((text,i)=>({id:`s${i+1}` as `s${1|2|3|4|5}`,text,startSeconds:i*4.6+.2,endSeconds:i*4.6+4.05})),
};
// The synthetic metadata above is a unit-test fixture, not a recording or timing publication.
validateY004Narration(measured);
validateY004Narration(Y004_MEASURED_NARRATION);
ok(Y004_MEASURED_NARRATION.durationSeconds===22.704,'actual source duration');
ok(Y004_MEASURED_NARRATION.sourceSha256==='db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b','approved hash');
ok(Y004_MEASURED_NARRATION.sentences[2].startSeconds===11.608,'higher-speed narration onset');
ok(Y004_MEASURED_NARRATION.sentences[4].endSeconds===22.577,'last speech safely ends before 24s');
ok(Y004_NARRATION_SCRIPT[1].includes('rotate into corners'),'corrected sentence two');
ok(Y004_NARRATION_SCRIPT[4].includes('all four wheels'),'corrected sentence five');

ok(y004NarrationActivity01(1,measured)>.99,'activity in speech');
ok(y004NarrationActivity01(0,measured)===0,'silence before first word');
ok(y004NarrationActivity01(4.35,measured)===0,'silence between sentences');
ok(y004NarrationActivity01(22,measured)>.99,'last sentence active');
ok(y004NarrationActivity01(30,measured)===0,'speech gone after source');
ok(y004NarrationActivity01(0)===1,'unknown source fail-safe ducks effects');
ok(y004AudioEnvelope({seconds:0,speedMps:0}).speechDuckDb===-8,'unknown VO protected');
const low=y004AudioEnvelope({seconds:1,speedMps:9,cameraDistanceM:4,tracksidePass01:0,narration:measured});
const high=y004AudioEnvelope({seconds:11,speedMps:36,cameraDistanceM:4,tracksidePass01:1,narration:measured});
ok(high.engineDb>low.engineDb,'engine follows actual speed');
ok(high.roadDb>low.roadDb,'road follows actual speed');
ok(high.passDb>low.passDb,'trackside pass follows camera motion');
ok(low.engineDb<-20,'headroom/speech duck');
for(const s of [15,0,4,1,22,15]){
  const a=y004AudioEnvelope({seconds:s,speedMps:12,cornerLoad01:.5,narration:measured});
  const b=y004AudioEnvelope({seconds:s,speedMps:12,cornerLoad01:.5,narration:measured});
  ok(JSON.stringify(a)===JSON.stringify(b),'out-of-order sampling deterministic');
}
fails(()=>validateY004Narration({...measured,sourceSha256:'NO'}),'no missing provenance');
fails(()=>validateY004Narration({...measured,sentences:[...measured.sentences].reverse()}),'reject wrong order');
fails(()=>validateY004Narration({...measured,durationSeconds:10}),'reject truncated take');
fails(()=>y004AudioEnvelope({seconds:0,speedMps:NaN}),'reject NaN motion');
console.log('YUNEX 004 D audio tests: PASS (19+ checks, fixture metadata only)');
