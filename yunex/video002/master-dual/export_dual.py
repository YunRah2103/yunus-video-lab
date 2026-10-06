from pathlib import Path
import subprocess, json, hashlib, argparse
ASSETS=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument('--source',type=Path,required=True)
parser.add_argument('--audio',type=Path,required=True)
parser.add_argument('--out',type=Path,default=ASSETS)
parser.add_argument('--fonts',type=Path,default=ASSETS/'fonts')
args=parser.parse_args()
ROOT=args.out.resolve();ROOT.mkdir(parents=True,exist_ok=True)
SOURCE=args.source.resolve();AUDIO=args.audio.resolve();FONTS=args.fonts.resolve()
DURATION=751/30
REFERENCE_AUDIO=ROOT/'approved-source.aac'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(AUDIO),'-map','0:a:0','-c:a','copy',str(REFERENCE_AUDIO)],check=True)
EXPECTED_AUDIO_HASH=hashlib.sha256(REFERENCE_AUDIO.read_bytes()).hexdigest()
assert EXPECTED_AUDIO_HASH=='53179827c21557acf1ebc0e7eae374736889e43c7615c220dc500cbc24021d2a'

ass=(ASSETS/'finish.ass').read_text()
(ROOT/'finish.ass').write_text(ass)
(ROOT/'finish-B.ass').write_text(ass.replace('FIXED MAIN PLANE','FIXED LOWER PLANE').replace('MOVING UPPER FLAP','ACTIVE UPPER FLAP').replace('MORE DOWNFORCE','LOAD THE TYRES').replace('MORE GRIP','MORE CORNERING GRIP'))
variants={
 'A': {'zoom':"if(lt(t,2.4),1.025+0.012*t/2.4,if(gte(t,22),1.035+0.045*(t-22)/3.033,1))",'grade':'eq=contrast=1.065:brightness=-0.006:saturation=0.94:gamma=1.015','ass':'finish.ass','crop_y':'.46'},
 'B': {'zoom':"if(lt(t,2.4),1.04+0.02*t/2.4,if(gte(t,22),1.02+0.025*(t-22)/3.033,1))",'grade':'eq=contrast=1.075:brightness=-0.008:saturation=0.96:gamma=1.012,colorbalance=rs=0.009:gs=0.002:bs=-0.008','ass':'finish-B.ass','crop_y':'.48'},
}
results=[]
for name,v in variants.items():
 filt=v['grade']+f",scale=w='trunc(1080*({v['zoom']})/2)*2':h='trunc(1920*({v['zoom']})/2)*2':eval=frame,crop=1080:1920:(iw-1080)/2:(ih-1920)*{v['crop_y']},subtitles={ROOT/v['ass']}:fontsdir={FONTS},fps=30"
 fpath=ROOT/f'filter-{name}.txt';fpath.write_text(filt)
 out=ROOT/f'YUNEX_002_TIKTOK_{name}.mp4'
 subprocess.run(['ffmpeg','-y','-v','warning','-i',str(SOURCE),'-i',str(AUDIO),'-filter_script:v',str(fpath),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-c:a','copy','-t',str(DURATION),'-fps_mode','cfr','-movflags','+faststart',str(out)],check=True)
 subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(out),'-f','null','-'],check=True)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(out)]))
 video=next(x for x in probe['streams'] if x['codec_type']=='video')
 assert (video['width'],video['height'],video['nb_read_frames'],video['r_frame_rate'],video['avg_frame_rate'])==(1080,1920,'751','30/1','30/1'),video
 assert abs(float(probe['format']['duration'])-DURATION)<.025
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(out),'-map','0:a:0','-c','copy',str(ROOT/f'audio-{name}.aac')],check=True)
 audio_hash=hashlib.sha256((ROOT/f'audio-{name}.aac').read_bytes()).hexdigest()
 assert audio_hash==EXPECTED_AUDIO_HASH
 (ROOT/f'probe-{name}.json').write_text(json.dumps(probe,indent=2))
 results.append({'variant':name,'file':out.name,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'audio_sha256':audio_hash,'frames':751,'native_source':[1080,1920],'fps':30,'duration':DURATION,'decode':'PASS'})
(ROOT/'DELIVERY_QA.json').write_text(json.dumps({'render_source_sha':'fb3cfbe7a171858ef96a12d9443d5e00412371de','authoritative_manager_sha':'3e44ddf8e4b27341c345a00de7db7ad56533fb71','variants':results},indent=2))
print(json.dumps(results,indent=2))
