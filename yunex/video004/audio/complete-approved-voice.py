#!/usr/bin/env python3
"""YUNEX 004: verify new Cedar source and lock 24s audio against existing Y004 SFX bed.
Uses the Manager's user-approved spoken transcript. Acoustic cue boundaries are independently
verified by ffmpeg silencedetect; this is NOT an ASR or human semantic listen.
"""
import argparse, hashlib, json, pathlib, subprocess, math, re
import numpy as np
import soundfile as sf
from scipy.special import expit

SOURCE_SHA = 'db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b'
BED_SHA = '960b4dddecd55051a1df66e0c4e6ffde94feda6f8190cff786160b4281f36ee6'
FPS, FRAMES, RATE, SECONDS = 30, 720, 48000, 24
SCRIPT = [
 'The rear wheels on this Porsche steer too.',
 'At lower speeds, they turn slightly against the front wheels, helping the GT3 RS rotate into corners more quickly.',
 'But at higher speeds, they turn with the fronts instead.',
 'That makes the car more stable when changing direction at speed.',
 "So while you're driving, all four wheels are helping this Porsche turn.",
]
CUES = [(0.000,2.755),(3.650,10.613),(11.608,14.232),(14.979,17.866),(18.858,22.577)]

def run(*args):return subprocess.run(args, check=True, capture_output=True, text=True)
def sha(p):return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()
def ffprobe(p):
 return json.loads(run('ffprobe','-v','error','-select_streams','a:0','-show_entries','stream=codec_name,sample_rate,channels:format=duration,size','-of','json',str(p)).stdout)

def pcm48(p):
 # FFmpeg handles both MP3 and AAC delay/padding. Float32 conversion at target 48k.
 buf=subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(p),'-map','0:a:0','-ar',str(RATE),'-ac','2','-f','f32le','pipe:1'],check=True,capture_output=True).stdout
 return np.frombuffer(buf,dtype='<f4').reshape(-1,2).copy().astype(np.float64)

def verify_windows(source):
 p= subprocess.run(['ffmpeg','-hide_banner','-i',str(source),'-af','silencedetect=noise=-34dB:d=0.12','-f','null','-'],capture_output=True,text=True,check=True)
 begins=[float(x) for x in re.findall(r'silence_start:\s*([\d.]+)',p.stderr)]
 ends=[float(x) for x in re.findall(r'silence_end:\s*([\d.]+)',p.stderr)]
 # For initial sentence, start 0; all others after four long intersentence gaps.
 gaps=[(round(a,6),round(b,6)) for a,b in zip(begins,ends) if b-a>=0.7]
 if len(gaps)!=4:raise ValueError(f'Expected 4 phrase gaps, found {gaps}')
 measured=[(0,gaps[0][0])]+[(gaps[i-1][1],gaps[i][0]) for i in range(1,4)]+[(gaps[3][1],22.576583)]
 for i,(a,b) in enumerate(measured):
  e0,e1=CUES[i]
  if abs(a-e0)>.006 or abs(b-e1)>.006:raise ValueError(f'Sentence {i+1} silence-boundary mismatch {(a,b)} expected {(e0,e1)}')
 return [{'id':f's{i+1}','text':text,'startSeconds':CUES[i][0],'endSeconds':CUES[i][1],'acousticStartSeconds':x[0],'acousticEndSeconds':x[1]} for i,(text,x) in enumerate(zip(SCRIPT,measured))],gaps

def process(source,bed,out):
 source=pathlib.Path(source);bed=pathlib.Path(bed);out=pathlib.Path(out);out.mkdir(parents=True,exist_ok=True)
 if sha(source)!=SOURCE_SHA:raise ValueError('MP3 does not match Manager-approved Y004 SHA256')
 if sha(bed)!=BED_SHA:raise ValueError('Bed does not match Agent D locked procedural bed SHA256')
 sp=ffprobe(source);bp=ffprobe(bed)
 if sp['streams'][0]['codec_name']!='mp3' or int(sp['streams'][0]['sample_rate'])!=24000 or sp['streams'][0]['channels']!=1 or abs(float(sp['format']['duration'])-22.704)>.001:raise ValueError('Incorrect approved MP3 properties')
 if bp['streams'][0]['codec_name']!='aac' or int(bp['streams'][0]['sample_rate'])!=48000 or bp['streams'][0]['channels']!=2 or abs(float(bp['format']['duration'])-24)>.001:raise ValueError('Incorrect procedural bed')
 cues,gaps=verify_windows(source)
 voice=pcm48(source);effects=pcm48(bed)
 samples=SECONDS*RATE
 if voice.shape!=(round(22.704*RATE),2) or abs(len(effects)-samples)>1024:raise ValueError(f'Unexpected decoded sample counts voice={voice.shape}, bed={effects.shape}')
 voice_padded=np.zeros((samples,2),dtype=np.float64);voice_padded[:len(voice)]=voice
 # Preserve source intact; no time stretching, trim, source speech removal or automatic peak normalization.
 stem=out/'YUNEX_004_Cedar_isolated_24s_48k_stereo.wav'
 sf.write(stem,voice_padded,RATE,subtype='PCM_24')
 # Use source five measured utterance ranges to duck existing Y004 bed gently.
 # Slew via logistic edges prevents pump/click artifacts in silence transitions.
 t=np.arange(samples,dtype=np.float64)/RATE
 activity=np.zeros(samples)
 for start,end in CUES:
  env=expit(np.clip((t-(start-.06))/.034,-35,35))*expit(np.clip(((end+.05)-t)/.080,-35,35))
  activity=np.maximum(activity,env)
 gain_bed=2.0*(1.0-0.63*activity) # SFX -6.1dB relative to pause level under voice
 mixed=voice_padded*.96 + effects[:samples]*gain_bed[:,None]
 peak=max(float(np.max(np.abs(mixed))),float(np.max(np.abs(voice_padded))))
 if not np.isfinite(peak) or peak >=0.90:raise ValueError(f'Unsafe peak {peak}')
 mixed_pcm=out/'YUNEX_004_Cedar_final_mix_24s_48k_stereo.wav'
 sf.write(mixed_pcm,mixed,RATE,subtype='PCM_24')
 mixed_m4a=out/'YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a'
 run('ffmpeg','-y','-v','error','-i',str(mixed_pcm),'-map','0:a:0','-ar','48000','-ac','2','-c:a','aac','-b:a','256k','-movflags','+faststart',str(mixed_m4a))
 tests={}
 for file in (stem,mixed_pcm,mixed_m4a):
  run('ffmpeg','-v','error','-xerror','-i',str(file),'-f','null','-')
  meta=ffprobe(file)
  if int(meta['streams'][0]['sample_rate'])!=RATE or meta['streams'][0]['channels']!=2 or abs(float(meta['format']['duration'])-SECONDS)>.005:raise ValueError('Invalid 24s 48k stereo asset: '+file.name)
  if file.suffix=='.wav':
   signal,sample_rate=sf.read(file,dtype='float64',always_2d=True)
   if signal.shape != (samples,2) or sample_rate !=RATE:raise ValueError('Wrong WAV sample count')
  tests[file.name]={'sha256':sha(file),'bytes':file.stat().st_size,'ffprobe':meta,'full_decode':'PASS'}
 # AAC encoder can raise peak slightly, so assess decoded AAC as well.
 for f in (stem,mixed_pcm,mixed_m4a):
  a=pcm48(f);p=float(np.max(np.abs(a)));tests[f.name]['decoded_peak_dbfs']=round(20*math.log10(max(p,1.e-12)),3)
  if p>=.95:raise ValueError('Decoded clipping risk: '+f.name)
 # Require narrator intact between source and isolated stem in 24s (except PCM-24 dither/quantization).
 stem_read,sr=sf.read(stem,dtype='float64',always_2d=True)
 source_preservation_error=float(np.max(np.abs(stem_read[:len(voice)]-voice)))
 if source_preservation_error>4e-7:raise ValueError('Narration was modified: '+str(source_preservation_error))
 m={
  'episode':'YUNEX-004', 'status':'APPROVED_RECORDING_SHA_VERIFIED_24S_ISOLATED_AND_REFERENCE_MIX_COMPLETE',
  'source_name':source.name,'source_sha256':SOURCE_SHA,'source_bytes':source.stat().st_size,'source_audio':sp,
  'voice':'Cedar','source_rights':'user-provided OpenAI FM Cedar generated narration, user approved for Y004',
  'transcript_verification':'exact NEW user-provided spoken transcript from Manager source lock; NOT independently ASR-transcribed or human-listened in Agent D session',
  'sentence_boundary_method':'independent FFmpeg silencedetect -34dB duration 0.12 s; 4 long gaps, onset/end tolerance 0.006 s; last end 22.576583 from source waveform',
  'five_sentences':cues,'silence_gaps':gaps,
  'source_duration_seconds':float(sp['format']['duration']),'locked_fps':FPS,'locked_frames':FRAMES,'locked_duration_seconds':SECONDS,
  'unused_tail_seconds':SECONDS-float(sp['format']['duration']),
  'procedural_bed_name':bed.name,'procedural_bed_sha256':BED_SHA,
  'mix_design':'voice 0.96x + existing Y004 procedural bed at 2.0x gain, ducked 63% via smooth acoustic sentence windows; no stretch, no speech cuts; 48k stereo',
  'source_to_stem_max_error':source_preservation_error,
  'artifacts':tests,
  'checks':'SOURCE_SHA PASS; BED_SHA PASS; NEW SCRIPT USER-APPROVED; ACOUSTIC CUES PASS; VOICE UNMODIFIED PASS; 720f/24s PASS; 48K STEREO PASS; FULL DECODERS PASS; NO CLIPPING PASS'
 }
 (out/'YUNEX_004_Cedar_AUDIO_MANIFEST.json').write_text(json.dumps(m,indent=2)+'\n')
 print(json.dumps({'status':m['status'],'samples':samples,'cues':cues,'source_to_stem_max_error':source_preservation_error,'artifacts':tests},indent=2))
 return m

if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--source',required=True);ap.add_argument('--bed',required=True);ap.add_argument('--out',required=True);args=ap.parse_args()
 process(args.source,args.bed,args.out)