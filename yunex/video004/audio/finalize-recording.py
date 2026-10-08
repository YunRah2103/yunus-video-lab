#!/usr/bin/env python3
"""Finish Y004 narration ONLY from a genuinely approved NEW topic-specific take.
This tool never synthesizes speech and cannot turn a prior Y003 take into Y004.
"""
import argparse
import hashlib
import json
import pathlib
import re
import subprocess
import sys

SCRIPT = [
    'The rear wheels on this Porsche steer too.',
    'At lower speeds, they can turn slightly against the front wheels, helping the GT3 RS change direction more quickly.',
    'But at higher speeds, they turn with the fronts instead.',
    'That makes the car more stable through fast corners and direction changes.',
    'So even the rear wheels are helping this Porsche turn.',
]
BLOCKED_SOURCE_SHA = '826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb' # old Y003 Cedar


def verify_approval(info, actual_sha, source_duration):
    if actual_sha.lower() == BLOCKED_SOURCE_SHA:
        raise ValueError('Y003 Cedar narration hash forbidden: Y004 requires new spoken script')
    if info.get('source_sha256','').lower() != actual_sha:
        raise ValueError('Actual SHA256 does not equal explicitly approved new voice source SHA256')
    if not info.get('speaker') or not info.get('source_rights') or info.get('human_verified_transcript') is not True:
        raise ValueError('Need named approved speaker, source rights, and reviewed actual transcript')
    stamps=info.get('sentences')
    if not isinstance(stamps,list) or len(stamps)!=5:
        raise ValueError('Need five actual measured sentence start/end timestamps')
    last=0
    for index,(row,expected) in enumerate(zip(stamps,SCRIPT),start=1):
        if row.get('id') != f's{index}' or row.get('text')!=expected:
            raise ValueError(f'Incorrect verified transcript at sentence {index}')
        start,end=row.get('startSeconds'),row.get('endSeconds')
        if not isinstance(start,(float,int)) or not isinstance(end,(float,int)) or not (last <= start < end <= source_duration+.02):
            raise ValueError(f'Unmeasured, overlapping or invalid sentence {index} timestamps')
        last=end
    return stamps


def ffprobe(p):
    v=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','a:0','-show_entries','format=duration,size:stream=codec_name,sample_rate,channels','-of','json',str(p)]))
    if not v.get('streams') or float(v.get('format',{}).get('duration',0))<=0:raise ValueError('Missing decodable audio stream')
    return v


def filehash(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for part in iter(lambda:f.read(1024*1024),b''):h.update(part)
    return h.hexdigest()


def finalize(source,approval,out,locked_frames=None):
    source=pathlib.Path(source);out=pathlib.Path(out)
    if not source.is_file() or source.stat().st_size<1024:
        raise ValueError('BLOCKED: approved new Y004 voice asset not available')
    sha=filehash(source)
    sprobe=ffprobe(source)
    duration=float(sprobe['format']['duration'])
    info=json.loads(pathlib.Path(approval).read_text())
    stamps=verify_approval(info,sha,duration)
    if locked_frames is not None and (locked_frames<120 or locked_frames>1800):raise ValueError('Invalid Manager frame count')
    if locked_frames is not None and duration+.15 >= locked_frames/30:
        raise ValueError('Speech would be truncated: Manager must re-lock frames or approve word trim')
    out.mkdir(parents=True,exist_ok=True)
    cmd=['bash',str(pathlib.Path(__file__).parent/'prepare-vo-mix.sh'),str(source),str(out)]
    if locked_frames is not None:cmd.append(str(locked_frames))
    subprocess.run(cmd,check=True)
    voice=out/'y004_narration_isolated_48k_stereo.wav'
    mix=out/'y004_reference_mix_48k_stereo.wav'
    vprobe,mprobe=ffprobe(voice),ffprobe(mix)
    # All audio channels must be stereo and sample rate must really be 48 kHz.
    for p in (vprobe,mprobe):
        s=p['streams'][0]
        if int(s['sample_rate'])!=48000 or int(s['channels'])!=2:raise ValueError('Wrong output audio format')
    # Full decode and actual peak check, not merely an ffmpeg command return status.
    for f in (voice,mix):subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(f),'-f','null','-'],check=True)
    peak_log=(out/'mix_peak.txt').read_text()
    match=re.search(r'max_volume:\s*(-?[\d.]+)\s*dB',peak_log)
    if not match:raise ValueError('Failed to measure reference mix peak')
    peak_db=float(match.group(1))
    if peak_db > -0.5:raise ValueError(f'Clipping/headroom violation: {peak_db} dBFS')
    result={
        'status':'SOURCE_VERIFIED_REFERENCE_MIX_COMPLETE_NOT_MANAGER_FINAL_UNTIL_FRAME_LOCK',
        'voice_speaker':info['speaker'],'voice_source_rights':info['source_rights'],
        'source_file':source.name,'source_sha256':sha,
        'source_ffprobe':sprobe,'source_duration_seconds':duration,'sentences':stamps,
        'human_verified_transcript':True,
        'locked_frames':locked_frames,'film_duration_seconds':float(mprobe['format']['duration']),
        'narration_isolated':{'file':voice.name,'sha256':filehash(voice),'ffprobe':vprobe},
        'audio_mix':{'file':mix.name,'sha256':filehash(mix),'ffprobe':mprobe,'measured_peak_dbfs':peak_db},
    }
    (out/'y004-vo-mix-manifest.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))
    return result

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--source',required=True)
    parser.add_argument('--approval-json',required=True)
    parser.add_argument('--out',required=True)
    parser.add_argument('--manager-locked-frames',type=int)
    args=parser.parse_args()
    try:finalize(args.source,args.approval_json,args.out,args.manager_locked_frames)
    except (ValueError,subprocess.CalledProcessError,OSError) as ex:
        print(f'Y004 narration gate BLOCKED: {ex}',file=sys.stderr)
        sys.exit(3)
