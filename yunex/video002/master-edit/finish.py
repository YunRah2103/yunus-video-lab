from pathlib import Path
import subprocess, json, hashlib
ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/'YUNEX_002_FINAL_MASTER.mp4'
OUT=ROOT/'YUNEX_002_EDIT_FINAL.mp4'
HEADER='''[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hero,Barlow Condensed ExtraBold,108,&H00ECEFEF,&H00ECEFEF,&H00171D1A,&H70171D1A,-1,0,0,0,100,100,0,0,1,0,1,7,0,0,0,1
Style: Small,Barlow Condensed ExtraBold,29,&H00ECEFEF,&H00ECEFEF,&H00171D1A,&H70171D1A,-1,0,0,0,100,100,4,0,1,0,0,7,0,0,0,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
def tc(v):
    return f'0:{int(v)//60:02}:{int(v)%60:02}.{round((v-int(v))*100):02}'
events=[]
def cue(start,end,line1,line2,accent='&H0078DBBD&',eyebrow=None):
    tags=r'{\pos(88,255)\fad(100,130)}'
    text=tags+line1+r'\N{\c'+accent+r'}'+line2
    events.append(f'Dialogue: 1,{tc(start)},{tc(end)},Hero,,0,0,0,,{text}')
    if eyebrow:
        events.append(f'Dialogue: 1,{tc(start)},{tc(end)},Small,,0,0,0,,'+r'{\pos(92,207)\fad(100,130)}'+eyebrow)
# Existing hook/DRS/whole-car titles are baked into the native render.
# Preserve those rather than erase scene geometry behind them.
cue(2.75,4.15,'FIXED MAIN PLANE','MOVING UPPER FLAP',eyebrow='ACTIVE AERODYNAMICS')
cue(6.15,8.70,'MORE DOWNFORCE','MORE GRIP',eyebrow='CORNERING')
cue(14.05,16.85,'HIGH-SPEED BRAKING','AIRBRAKE','&H00508ED5&')
events.append('Dialogue: 1,0:00:23.10,0:00:25.03,Small,,0,0,0,,'+r'{\pos(88,290)\fs58\fsp9\fad(240,0)}YUNEX')
(ROOT/'finish.ass').write_text(HEADER+chr(10).join(events)+chr(10))
# Existing native moving render is preserved; small editorial reframing only.
# Dynamic crop deliberately disabled in side/macro shots to preserve flap/car width.
zoom="if(lt(t,2.4),1.025+0.012*t/2.4,if(gte(t,22),1.035+0.045*(t-22)/3.033,1))"
filters=("eq=contrast=1.065:brightness=-0.006:saturation=0.94:gamma=1.015,"
         f"scale=w='trunc(1080*({zoom})/2)*2':h='trunc(1920*({zoom})/2)*2':eval=frame,"
         "crop=1080:1920:(iw-1080)/2:(ih-1920)*0.46,"
         f"subtitles={ROOT/'finish.ass'}:fontsdir={ROOT/'fonts'}")
(ROOT/'filter.txt').write_text(filters)
subprocess.run(['ffmpeg','-y','-v','warning','-i',str(SOURCE),'-filter_script:v',str(ROOT/'filter.txt'),'-map','0:v:0','-map','0:a:0','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(OUT)],check=True)
data={'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'output_sha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'render':'Editorial finish of native master; restrained digital reframing; no new 3D render','audio':'Original approved AAC copied unchanged','changes':['Stronger YUNEX typography','Grip/airbrake state emphasis','Restrained contrast/color finish','Subtle opening/final reframing'],'limitations':['Track and camera architecture preserved','No claim of new native 3D render']}
(ROOT/'EDIT_QA.json').write_text(json.dumps(data,indent=2))
