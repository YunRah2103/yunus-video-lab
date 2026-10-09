import json
import pathlib
import sys
import tempfile
import unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"advanced"))
sys.path.insert(0,str(ROOT/"tools"))
sys.path.insert(0,str(ROOT/"studio"))
sys.path.insert(0,str(ROOT/"phoneqa"))
from asset_contract import validate as validate_asset
from clearance import audit as clearance_audit
from handoff import validate as validate_handoff
from benchmark import job_plan
from voice_sync import validate_words, subtitle_cues
from phone_qa import audit as phone_audit

class YunexPortableTests(unittest.TestCase):
    def test_asset_contract_without_demo_model(self):
        data={"schemaVersion":1,"id":"gt3rs-candidate","units":"metres","source":"Approved original hypothetical fixture, no file copied",
              "movingParts":[{"name":"Hinge","mode":"rotation","axis":[0,1,0],"start":0,
                              "end":0.3,"frameStart":0,"frameEnd":60}]}
        self.assertEqual(validate_asset(data)["movingParts"][0]["name"],"Hinge")
        data["movingParts"][0]["axis"]=[2,0,0]
        with self.assertRaises(ValueError):validate_asset(data)
    def test_handoff_evidence_is_required(self):
        handoff={"schemaVersion":1,"task":"candidate-model","branch":"work/model-v1",
          "sourceSha":"f"*40,"owner":"hardware","summary":"Inspect material and geometry",
          "status":"ready","files":["production/README.md"],"evidence":[],
          "blockers":[]}
        with self.assertRaises(ValueError):validate_handoff(handoff)
        handoff["evidence"]=["native render artifact 123"]
        self.assertEqual(validate_handoff(handoff)["status"],"ready")
    def test_caption_timing_and_frame_plan(self):
        words=[{"word":"A","start":0,"end":.2},{"word":"B","start":.25,"end":.5}]
        self.assertEqual(len(subtitle_cues(validate_words(words))),1)
        self.assertEqual(job_plan("YUNEX-001",12,.2,"1,2",1)[0]["composition"],"YUNEX-001")
    def test_phone_masks_are_warnings_only(self):
        layout={"schemaVersion":1,"subjects":[],"captions":[{"name":"title","bounds":[.81,.64,.14,.07],"fontSizePx":19}]}
        self.assertTrue(phone_audit(layout)["warnings"])
    def test_clearance_detects_intersections(self):
        data={"schemaVersion":1,"frames":[{"frame":0,"parts":{"a":[0,0,0,1,1,1],"b":[.5,.5,.5,1.5,1.5,1.5]}}],
              "allowedContactPairs":[],"tolerance":0.001}
        self.assertEqual(len(clearance_audit(data)["potentialIntersections"]),1)

if __name__ == "__main__":unittest.main()
