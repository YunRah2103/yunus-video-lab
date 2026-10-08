#!/usr/bin/env python3
"""Reuse all 13 exact approved native plates; never rerender Porsche geometry."""
import argparse, hashlib, json, subprocess, shutil, struct
from pathlib import Path

SOURCE='1e2ab54e77090ec9c95c119488bc87d7ab7a45ba'
AUDIO_SHA='a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51'
ARTIFACTS=[11547392900,11548180309,11556411461,11549115114,11548522472,11546544603,11548552591,11548576922,11548780809,11548412328,11547945616,11555685474,11547991357]
def run(*args):return subprocess.check_output(list(map(str,args)),text=True)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def probe(p):return json.loads(run('ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',p))
def decode(p):run('ffmpeg','-nostdin','-v','error','-xerror','-i',p,'-f','null','-')
def hashes(p):
 s=run('ffmpeg','-v','error','-i',p,'-map','0:v:0','-an','-f','framemd5','-')
 return [x.split(',')[-1].strip() for x in s.splitlines() if x and not x.startswith('#')]
def packets(p):
 d=json.loads(run('ffprobe','-v','error','-select_streams','a:0','-show_packets','-show_data_hash','sha256','-show_entries','packet=pts_time,duration_time,data_hash','-of','json',p))
 return [(x['pts_time'],x['duration_time'],x['data_hash']) for x in d['packets']]
def faststart(p):
 boxes=[]
 with open(p,'rb') as f:
  while True:
   h=f.read(8)
   if len(h)<8:break
   n,k=struct.unpack('>I4s',h);hsize=8
   if n==1:n=struct.unpack('>Q',f.read(8))[0];hsize=16
   boxes.append(k.decode());
   if n==0:break
   f.seek(n-hsize,1)
 return boxes.index('moov')<boxes.index('mdat')
def main():
 a=argparse.ArgumentParser();a.add_argument('--clips',type=Path,required=True);a.add_argument('--audio',type=Path,required=True);a.add_argument('--out',type=Path,required=True);a.add_argument('--public',type=Path);args=a.parse_args();o=args.out;o.mkdir(parents=True,exist_ok=True)
 assert args.audio.stat().st_size==753974 and sha(args.audio)==AUDIO_SHA
 decode(args.audio);approved_packets=packets(args.audio)
 rows=[]
 for p in args.clips.rglob('*.mp4'):
  d=p.parent;start,end=map(int,(d/'frames-inclusive.txt').read_text().strip().split('-'))
  assert (d/'source-sha.txt').read_text().strip()==SOURCE
  assert sha(p) in (d/'SHA256SUMS').read_text()
  info=probe(p);v=next(s for s in info['streams'] if s['codec_type']=='video')
  assert (v['width'],v['height'],v['pix_fmt'],v['color_range'],v['r_frame_rate'],int(v['nb_read_frames']))==(1080,1920,'yuv420p','tv','30/1',end-start+1)
  decode(p);rows.append((start,end,p,sha(p)))
 rows.sort();assert len(rows)==13;assert [f for x,y,_,_ in rows for f in range(x,y+1)]==list(range(720))
 (o/'concat.txt').write_text(''.join("file '"+str(p.resolve())+"'\n" for _,_,p,_ in rows))
 plate=o/'approved-visual.mp4'
 run('ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',o/'concat.txt','-an','-c:v','copy','-movflags','+faststart',plate)
 A=o/'YUNEX_004_CINEMATIC.mp4';B=o/'YUNEX_004_DYNAMIC.mp4'
 run('ffmpeg','-y','-v','error','-i',plate,'-i',args.audio,'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',A)
 # Match ReleaseEdits.tsx exactly: hard framing changes only at existing shot cuts.
 graph="[0:v]split=3[x][y][z];[x]trim=start_frame=0:end_frame=84,setpts=PTS-STARTPTS,scale=1188:2112:flags=lanczos,crop=1080:1920:0:0,setsar=1[xo];[y]trim=start_frame=84:end_frame=432,setpts=PTS-STARTPTS[yo];[z]trim=start_frame=432:end_frame=567,setpts=PTS-STARTPTS,scale=1232:2190:flags=lanczos,crop=1080:1920:76:135,setsar=1[zo];[0:v]trim=start_frame=567:end_frame=720,setpts=PTS-STARTPTS[tail];[xo][yo][zo][tail]concat=n=4:v=1:a=0,drawbox=x=72:y=320:w=180:h=5:color=0xbddb78:t=fill:enable='between(n,18,76)+between(n,96,140)+between(n,163,318)+between(n,346,416)',drawbox=x=870:y=1840:w=90:h=3:color=0xbddb78:t=fill:enable='between(n,675,714)',format=yuv420p[v]"
 run('ffmpeg','-y','-v','error','-i',plate,'-i',args.audio,'-filter_complex',graph,'-map','[v]','-map','1:a:0','-c:v','libx264','-preset','slow','-crf','16','-threads','4','-pix_fmt','yuv420p','-color_range','tv','-r','30','-fps_mode','cfr','-frames:v','720','-c:a','copy','-movflags','+faststart',B)
 report={'visual_source_sha':SOURCE,'approved_audio_sha256':AUDIO_SHA,'render_method':'Reuse E-validated 13 H native clips; FFmpeg stream-copy Cinematic; deterministic finishing encode Dynamic. No geometry rerender.','artifacts':ARTIFACTS,'clips':[{'first':x,'last':y,'sha256':h} for x,y,p,h in rows],'versions':{}}
 allhash=[]
 for p in [A,B]:
  d=probe(p);v=next(s for s in d['streams'] if s['codec_type']=='video');au=next(s for s in d['streams'] if s['codec_type']=='audio')
  assert (v['codec_name'],v['width'],v['height'],v['pix_fmt'],v['color_range'],v['r_frame_rate'],v['avg_frame_rate'],int(v['nb_read_frames']))==('h264',1080,1920,'yuv420p','tv','30/1','30/1',720)
  assert (au['codec_name'],au['sample_rate'],au['channels'])==('aac','48000',2)
  assert float(v['duration'])==24 and float(au['duration'])==24 and float(d['format']['duration'])==24
  decode(p);h=hashes(p);assert len(h)==720;assert all(x!=y for x,y in zip(h,h[1:]));assert packets(p)==approved_packets;assert faststart(p)
  allhash.append(h);report['versions'][p.name]={'sha256':sha(p),'bytes':p.stat().st_size,'frames':720,'duration':24,'width':1080,'height':1920,'fps':30,'video':'H.264 yuv420p TV','audio':'AAC 48000Hz stereo','decoder':'PASS','adjacent_duplicate_frames':0,'aac_packets':'EXACT_APPROVED_MATCH','faststart':True}
  run('ffmpeg','-y','-v','error','-i',p,'-vf','fps=2,scale=216:384,tile=8x6','-frames:v','1',o/(p.stem+'-review.jpg'))
 report['different_decoded_frames']=sum(x!=y for x,y in zip(*allhash));assert report['different_decoded_frames']>0
 report['continuous_audiovisual_playback']='NOT_PERFORMED; decoded-frame and timing inspection only'
 (o/'FINAL_QA.json').write_text(json.dumps(report,indent=2));(o/'SHA256SUMS').write_text(''.join(sha(p)+'  '+p.name+'\n' for p in [A,B]))
 if args.public:
  args.public.mkdir(parents=True,exist_ok=True);shutil.copyfile(plate,args.public/'approved-visual.mp4');shutil.copyfile(args.audio,args.public/'approved-audio.m4a')
 print(json.dumps(report['versions'],indent=2));print('Different decoded frames:',report['different_decoded_frames'])
if __name__=='__main__':main()
