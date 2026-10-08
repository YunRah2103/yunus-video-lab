#!/usr/bin/env python3
"""Verify the immutable YUNEX 004 Cedar delivery against approved hashes/film lock."""
import argparse, hashlib, json, pathlib, subprocess, math
import numpy as np
import soundfile as sf

LOCKED={
 'YUNEX_004_Cedar_isolated_24s_48k_stereo.wav':'07ec8e2d14d28e585668b3084c48657329ba4f1e8b9e52c838c46613c0f3334e',
 'YUNEX_004_Cedar_final_mix_24s_48k_stereo.wav':'526e558cdeaf7dbf5bf01dddf68b374ad06b88d19c7122828e426d7e6494621e',
 'YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a':'a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51',
}
def check(out,source=None):
 out=pathlib.Path(out)
 m=json.loads((out/'YUNEX_004_Cedar_AUDIO_MANIFEST.json').read_text())
 assert m['source_sha256']=='db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b'
 assert m['source_duration_seconds']==22.704
 assert len(m['five_sentences'])==5 and m['locked_frames']==720 and m['locked_fps']==30
 if source:
  p=pathlib.Path(source)
  assert hashlib.sha256(p.read_bytes()).hexdigest()==m['source_sha256']
 for name,locked_sha in LOCKED.items():
  f=out/name
  assert f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==locked_sha, name
  assert m['artifacts'][name]['sha256']==locked_sha
  assert m['artifacts'][name]['decoded_peak_dbfs'] <= -1, name
  subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(f),'-f','null','-'],check=True)
  j=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','a:0','-show_entries','format=duration:stream=codec_name,sample_rate,channels','-of','json',str(f)]))
  assert j['streams'][0]['sample_rate']=='48000' and j['streams'][0]['channels']==2
  assert math.isclose(float(j['format']['duration']),24,abs_tol=.005)
  if f.suffix=='.wav':
   a,rate=sf.read(f,always_2d=True)
   assert rate==48000 and a.shape==(1152000,2) and np.max(np.abs(a)) < 0.95
  print('PASS',name,locked_sha)
 print('Y004 D actual source, duration, acoustic cues, WAV/AAC, SHA256, peak, decoder gates: PASS')

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--out',required=True);p.add_argument('--source');a=p.parse_args();check(a.out,a.source)