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
    'At lower speeds, they turn slightly against the front wheels, helping the GT3 RS rotate into corners more quickly.',
    'But at higher speeds, they turn with the fronts instead.',
    'That makes the car more stable when changing direction at speed.',
    'So while you're driving, all four wheels are helping this Porsche turn.',
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
    if locked_frames != 720:
        raise ValueError('Y004 Manager requires locked 720 frames; do not use a provisional length')
    bed = out.parent / 'y004-bed-24s-PROVISIONAL.m4a'
    if not bed.is_file():
        raise ValueError('Verified Y004 procedural bed is required beside output directory')
    # New deterministic production path: uses ACTUAL Agent D bed, never creates replacement tones.
    from importlib.machinery import SourceFileLoader
    module = SourceFileLoader('y004_mix', str(pathlib.Path(__file__).with_name('complete-approved-voice.py'))).load_module()
    result = module.process(source, bed, out)
    if result['source_sha256'] != sha or result['source_duration_seconds'] != duration:
        raise ValueError('Approved source/actual render manifest mismatch')
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
