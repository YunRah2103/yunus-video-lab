import test from 'node:test';
import assert from 'node:assert/strict';
import {auditDeliveryMetadata, auditChunkProvenance} from './deliveryAudit.mjs';

const SHA='a'.repeat(40);
const valid=()=>({sourceSha:SHA, expectedSourceSha:SHA, frameCount:720,
  moovOffset:32,mdatOffset:100000,decoded:true,peakDbFS:-2.9,
  mp4Sha256:'b'.repeat(64),artifactId:'mock-artifact-NOT_REAL',
  chunks:[{startFrame:0,endFrameExclusive:360,sourceSha:SHA,artifactId:'mock-chunk1'},
          {startFrame:360,endFrameExclusive:720,sourceSha:SHA,artifactId:'mock-chunk2'}],
  probe:{streams:[
    {codec_type:'video',codec_name:'h264',pix_fmt:'yuv420p',width:1080,height:1920,avg_frame_rate:'30/1',r_frame_rate:'30/1',nb_read_frames:'720'},
    {codec_type:'audio',codec_name:'aac',sample_rate:'48000',channels:2}],
    format:{duration:'24.0'}}});
const codes = r=>r.failures.map(x=>x.code);
test('strict metadata and gapless mock PASS',()=>{assert.equal(auditDeliveryMetadata(valid()).pass,true)});
test('unlocked source always blocks',()=>{
 const f=valid();f.expectedSourceSha='c'.repeat(40);
 assert.ok(codes(auditDeliveryMetadata(f)).includes('UNLOCKED_SOURCE'));
});
test('yuvj420p is not yuv420p and must fail',()=>{
 const f=valid();f.probe.streams[0].pix_fmt='yuvj420p';
 assert.ok(codes(auditDeliveryMetadata(f)).includes('PIXEL_FORMAT'));
});
test('H265 is not deliverable H264',()=>{
 const f=valid();f.probe.streams[0].codec_name='hevc';
 assert.ok(codes(auditDeliveryMetadata(f)).includes('VIDEO_CODEC'));
});
test('resize or variable average frame rate fails',()=>{
 const f=valid();f.probe.streams[0].width=720;
 f.probe.streams[0].avg_frame_rate='30000/1001';
 const e=codes(auditDeliveryMetadata(f));
 assert.ok(e.includes('RESOLUTION'));assert.ok(e.includes('FRAME_RATE'));
});
test('actual counted frames must match lock',()=>{
 const f=valid();f.probe.streams[0].nb_read_frames='719';
 assert.ok(codes(auditDeliveryMetadata(f)).includes('FRAME_COUNT'));
});
test('audio codec, rate and channels are strict',()=>{
 const f=valid();f.probe.streams[1].codec_name='mp3';
 f.probe.streams[1].sample_rate='44100'; f.probe.streams[1].channels=1;
 const e=codes(auditDeliveryMetadata(f));
 assert.ok(e.includes('AUDIO_CODEC'));assert.ok(e.includes('AUDIO_SAMPLE_RATE'));assert.ok(e.includes('AUDIO_CHANNELS'));
});
test('full decoder pass is essential',()=>{
 const f=valid();f.decoded=false;
 assert.ok(codes(auditDeliveryMetadata(f)).includes('FULL_DECODE'));
});
test('moov AFTER mdat is not faststart',()=>{
 const f=valid();f.moovOffset=200000;
 assert.ok(codes(auditDeliveryMetadata(f)).includes('FASTSTART'));
});
test('audio sample peak at 0 dBFS requires remediation',()=>{
 const f=valid();f.peakDbFS=0;
 assert.ok(codes(auditDeliveryMetadata(f)).includes('AUDIO_PEAK'));
});
test('audio sample peak measurement missing blocks',()=>{
 const f=valid();f.peakDbFS=NaN;
 assert.ok(codes(auditDeliveryMetadata(f)).includes('AUDIO_PEAK_UNMEASURED'));
});
test('one missing chunk results in real gap failure',()=>{
 const f=valid();f.chunks[1].startFrame=361;
 assert.ok(codes(auditDeliveryMetadata(f)).includes('CHUNK_GAP_OR_OVERLAP'));
});
test('overlap and wrong end frame must fail',()=>{
 const f=valid();f.chunks[1].startFrame=359;f.chunks[1].endFrameExclusive=719;
 const e=codes(auditDeliveryMetadata(f));
 assert.ok(e.includes('CHUNK_GAP_OR_OVERLAP'));assert.ok(e.includes('CHUNK_COVERAGE'));
});
test('never accept mixed source chunk',()=>{
 const f=valid();f.chunks[1].sourceSha='c'.repeat(40);
 assert.ok(codes(auditDeliveryMetadata(f)).includes('MIXED_SOURCE'));
});
test('no chunk identity or no chunks fails',()=>{
 const f=valid();f.chunks[1].artifactId=undefined;
 assert.ok(codes(auditDeliveryMetadata(f)).includes('CHUNK_IDENTITY'));
 f.chunks=[];
 assert.ok(codes(auditDeliveryMetadata(f)).includes('NO_CHUNK_PROVENANCE'));
});
test('duration beyond one frame tolerance fails',()=>{
 const f=valid();f.probe.format.duration='24.2';
 assert.ok(codes(auditDeliveryMetadata(f)).includes('DURATION'));
});
test('require final file hash and persisted artifact identity',()=>{
 const f=valid();f.mp4Sha256=null; f.artifactId=undefined;
 const e=codes(auditDeliveryMetadata(f));
 assert.ok(e.includes('MP4_HASH'));assert.ok(e.includes('ARTIFACT_ID'));
});
test('a genuine one-piece render still needs explicit whole-film interval',()=>{
 const f=valid();f.chunks=[{startFrame:0,endFrameExclusive:720,sourceSha:SHA,path:'/artifact/master.mp4'}];
 assert.equal(auditChunkProvenance(f.chunks,{frameCount:720,renderSourceSha:SHA}).pass,true);
});
