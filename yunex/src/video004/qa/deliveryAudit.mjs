/**
 * Independent Y004 metadata QA. This never declares native visual or creative PASS.
 * Run verifyMedia.mjs against an actual MP4 to supply probe/decode/atom evidence.
 */
const failItem = (code, message) => ({code, message});
const isSha = s => typeof s === 'string' && /^[0-9a-f]{40}$/i.test(s);
const num = n => typeof n === 'number' && Number.isFinite(n);
const rational = s => {
  const m=String(s??'').match(/^(\d+)\/(\d+)$/);
  return m ? Number(m[1])/Number(m[2]) : Number(s);
};

export function auditChunkProvenance(chunks, {frameCount, renderSourceSha}={}) {
  const failures=[];
  const fail=(code,message)=>failures.push(failItem(code,message));
  if(!isSha(renderSourceSha)) fail('SOURCE_SHA','Expected immutable full 40-character source SHA.');
  if(!Number.isInteger(frameCount)||frameCount<=0) fail('FRAME_LOCK','Locked positive integer frame count is required.');
  if(!Array.isArray(chunks)||!chunks.length){
    fail('NO_CHUNK_PROVENANCE','Provide ordered exact-source chunk intervals; for a single direct render provide one [0,N) interval.');
    return {pass:false, failures};
  }
  const sorted=[...chunks].sort((a,b)=>a.startFrame-b.startFrame);
  let cursor=0;
  for(const c of sorted){
    if(!Number.isInteger(c.startFrame)||!Number.isInteger(c.endFrameExclusive)||c.endFrameExclusive<=c.startFrame){
      fail('CHUNK_RANGE','Invalid [startFrame,endFrameExclusive) interval.');continue;
    }
    if(c.startFrame!==cursor) fail('CHUNK_GAP_OR_OVERLAP', 'At frame '+cursor+' next interval begins '+c.startFrame+'.');
    if(c.sourceSha!==renderSourceSha) fail('MIXED_SOURCE','Chunk source SHA differs from locked render source.');
    if(!c.artifactId && !c.path && !c.workflowRunId) fail('CHUNK_IDENTITY','Every chunk must have artifact ID, persisted path or workflow run identity.');
    cursor=Math.max(cursor,c.endFrameExclusive);
  }
  if(Number.isInteger(frameCount)&&cursor!==frameCount) fail('CHUNK_COVERAGE','Intervals cover 0..'+cursor+' but expected 0..'+frameCount+'.');
  return {pass:failures.length===0, failures, observations:{chunks:chunks.length,coveredExclusiveFrame:cursor}};
}

export function auditDeliveryMetadata(input) {
  const failures=[];
  const fail=(code,message)=>failures.push(failItem(code,message));
  const {probe, frameCount, sourceSha, expectedSourceSha, moovOffset, mdatOffset, decoded, peakDbFS, chunks, mp4Sha256, artifactId, workflowRunId} = input??{};
  if(!isSha(sourceSha)) fail('SOURCE_SHA','Source SHA missing or malformed.');
  if(!isSha(expectedSourceSha)||sourceSha!==expectedSourceSha) fail('UNLOCKED_SOURCE','Source differs from approved immutable render SHA.');
  if(!Number.isInteger(frameCount)||frameCount<=0) fail('FRAME_LOCK','Final integer frame lock is absent.');
  if(!probe || !Array.isArray(probe.streams)) fail('NO_FFPROBE','Actual ffprobe JSON required.');
  const v=probe?.streams?.filter(s=>s.codec_type==='video')??[];
  const a=probe?.streams?.filter(s=>s.codec_type==='audio')??[];
  if(v.length!==1) fail('VIDEO_STREAMS','Exactly one video stream required.');
  if(a.length!==1) fail('AUDIO_STREAMS','Exactly one audio stream required.');
  const video=v[0], audio=a[0];
  if(video) {
    if(video.codec_name!=='h264') fail('VIDEO_CODEC','Final video must be H.264.');
    if(video.pix_fmt!=='yuv420p') fail('PIXEL_FORMAT','Require true yuv420p (not yuvj420p).');
    if(video.width!==1080||video.height!==1920) fail('RESOLUTION','Expected 1080x1920 portrait.');
    if(Math.abs(rational(video.avg_frame_rate)-30)>1e-7 || Math.abs(rational(video.r_frame_rate)-30)>1e-7) fail('FRAME_RATE','Must be constant 30 fps; inspect packets to exclude variable timestamps.');
    if(Number(video.nb_read_frames)!==frameCount) fail('FRAME_COUNT','Actual counted decoded video frames differ from integer lock.');
  }
  if(audio) {
    if(audio.codec_name!=='aac') fail('AUDIO_CODEC','Final audio must be AAC.');
    if(Number(audio.sample_rate)!==48000) fail('AUDIO_SAMPLE_RATE','Final audio must be 48kHz.');
    if(audio.channels!==2) fail('AUDIO_CHANNELS','Final audio must be stereo.');
  }
  const duration=Number(probe?.format?.duration);
  if(!num(duration)||!Number.isInteger(frameCount)||Math.abs(duration-frameCount/30)>1/30+.01) fail('DURATION','Container duration disagrees with locked video timeline.');
  if(!num(moovOffset)||!num(mdatOffset)||moovOffset>=mdatOffset) fail('FASTSTART','moov atom must be before media data (mdat).');
  if(decoded!==true) fail('FULL_DECODE','Actual full video/audio ffmpeg decode did not pass.');
  if(!num(peakDbFS)) fail('AUDIO_PEAK_UNMEASURED','Measured audio peak required.');
  else if(peakDbFS>=-.01) fail('AUDIO_PEAK','Audio reaches or exceeds 0 dBFS; inspect/remix clipping.');
  if(typeof mp4Sha256!=='string'||! /^[0-9a-f]{64}$/i.test(mp4Sha256)) fail('MP4_HASH','Full MP4 SHA256 required.');
  if(!artifactId && !workflowRunId) fail('ARTIFACT_ID','Record workflow run or final artifact identity.');
  const provenance=auditChunkProvenance(chunks,{frameCount,renderSourceSha:sourceSha});
  failures.push(...provenance.failures);
  return {pass:failures.length===0, failures, observations:{sourceSha, frameCount, fps:30, duration, videoCodec:video?.codec_name??null, pixFmt:video?.pix_fmt??null, audioCodec:audio?.codec_name??null, peakDbFS:peakDbFS??null, mp4Sha256:mp4Sha256??null, chunks:provenance.observations?.chunks??0}};
}
