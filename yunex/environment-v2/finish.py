import sys,json,subprocess,hashlib,struct
from pathlib import Path
clips,sound,out,source=sys.argv[1:];o=Path(out);o.mkdir(exist_ok=True)
def run(*a):return subprocess.check_output(list(map(str,a)),text=True)
files=[]
for i in range(6):
 p=Path(clips)/('YUNEX-CIRCUIT-V2-CHUNK-'+str(i));f=p/('chunk-'+str(i)+'.mp4');assert (p/'source-sha.txt').read_text().strip()==source;assert (p/'frames-inclusive.txt').read_text().strip()==str(i*60)+'-'+str(i*60+59)
 d=json.loads(run('ffprobe','-v','error','-count_frames','-show_streams','-of','json',f));assert int(d['streams'][0]['nb_read_frames'])==60;files.append(f.resolve())
(o/'concat.txt').write_text(''.join("file '"+str(p)+"'\n" for p in files));f=o/'YUNEX_CIRCUIT_ENVIRONMENT_V2.mp4'
run('ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',o/'concat.txt','-i',sound,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-movflags','+faststart',f)
d=json.loads(run('ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',f));v,a=d['streams'];assert (v['width'],v['height'],v['pix_fmt'],v['r_frame_rate'],int(v['nb_read_frames']))==(1080,1920,'yuv420p','30/1',360);assert v['codec_name']=='h264';assert a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==2;assert float(d['format']['duration'])==12
run('ffmpeg','-v','error','-xerror','-i',f,'-f','null','-');h=run('ffmpeg','-v','error','-i',f,'-an','-f','framemd5','-');hs=[x.split(',')[-1].strip() for x in h.splitlines() if x and not x.startswith('#')];assert len(hs)==360 and all(x!=y for x,y in zip(hs,hs[1:]));sha=hashlib.sha256(f.read_bytes()).hexdigest();r={'source_sha':source,'sha256':sha,'frames':360,'duration':12,'width':1080,'height':1920,'fps':30,'video':'H264 yuv420p TV','audio':'AAC 48k stereo','decode':'PASS','adjacent_duplicate_frames':0,'environment':'Reusable CircuitWorldV2; approved physical road, original Porsche and rear-steer rig retained','audio_note':'Synthetic demonstration driving bed, no narration, not real Porsche recording'};(o/'FINAL_QA.json').write_text(json.dumps(r,indent=2));(o/'SHA256SUMS').write_text(sha+'  '+f.name+'\n');(o/'source-sha.txt').write_text(source+'\n');run('ffmpeg','-y','-v','error','-i',f,'-vf','fps=2,scale=270:480,tile=6x4','-frames:v','1',o/'review.jpg');print(json.dumps(r,indent=2))
