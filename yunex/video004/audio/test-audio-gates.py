#!/usr/bin/env python3
"""Unconditional tests that do not pretend synthesized fixtures are approved VO."""
from importlib.machinery import SourceFileLoader
from pathlib import Path
import tempfile

module = SourceFileLoader('finalize',str(Path(__file__).with_name('finalize-recording.py'))).load_module()
s = module.SCRIPT
approved = {
 'source_sha256':'a'*64, 'speaker':'Cedar (verified take)', 'source_rights':'user supplied, explicit approval',
 'human_verified_transcript':True,
 'sentences':[{'id':f's{i+1}','text':text,'startSeconds':i*4.6,'endSeconds':i*4.6+4.25} for i,text in enumerate(s)]
}
def must_fail(f):
 try:f()
 except ValueError:return
 raise AssertionError('Expected invalid audio source/cue gate to reject')
assert len(module.verify_approval(approved,'a'*64,24.0))==5
must_fail(lambda: module.verify_approval(approved,'b'*64,24.0))
must_fail(lambda: module.verify_approval({**approved,'human_verified_transcript':False},'a'*64,24.0))
must_fail(lambda: module.verify_approval({**approved,'sentences':approved['sentences'][:4]},'a'*64,24.0))
must_fail(lambda: module.verify_approval({**approved,'sentences':[*approved['sentences'][:4],{'id':'s5','text':'wrong','startSeconds':19,'endSeconds':23}]},'a'*64,24.0))
must_fail(lambda: module.verify_approval(approved,'a'*64,21))
must_fail(lambda: module.verify_approval({**approved,'source_sha256':module.BLOCKED_SOURCE_SHA},module.BLOCKED_SOURCE_SHA,24))
with tempfile.TemporaryDirectory() as d:
 must_fail(lambda:module.finalize(Path(d)/'missing-approved-voice.mp3',Path(d)/'missing.json',Path(d)/'out'))
print('Y004 D provenance + cue gates: 8 PASS; synthetic timestamps are UNIT TEST DATA ONLY')
