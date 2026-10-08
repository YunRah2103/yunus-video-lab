"""Unit checks for fail-closed branch-release Manager/F registry gates."""
import json
import tempfile
import unittest
from pathlib import Path
from verify_gate import GateError, read_registry, file_sha

SHA = "0" * 40


class GateTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name) / "TASKS.json"
        self.reg = {
            "phase": "Y004-REAR-STEERING-01",
            "render_source_sha": SHA,
            "locked_frames": 720,
            "pre_render_qa_status": "PASS",
            "pre_render_qa_evidence": {
                "agent": "F", "verdict": "PASS", "source_sha": SHA,
                "report": "yunex/video004/reports/F/NATIVE_MOVING_QA.md",
                "artifact_id": 12345},
            "i_release_launch_authorized": True,
            "release_audio_path": "yunex/video004/audio/y004-approved-cedar-24s.m4a"}
    def call(self):
        self.path.write_text(json.dumps(self.reg))
        return read_registry(self.path)
    def test_locked_candidate_passes_metadata(self):
        self.assertEqual(self.call()["source_sha"], SHA)
    def test_missing_immutable_source_rejected(self):
        self.reg["render_source_sha"] = None
        with self.assertRaises(GateError):
            self.call()
    def test_wrong_or_missing_f_qa_rejected(self):
        self.reg["pre_render_qa_status"] = "PENDING"
        with self.assertRaises(GateError):
            self.call()
        self.reg["pre_render_qa_status"] = "PASS"
        self.reg["pre_render_qa_evidence"]["source_sha"] = "1" * 40
        with self.assertRaises(GateError):
            self.call()
    def test_no_explicit_manager_launch_rejected(self):
        self.reg.pop("i_release_launch_authorized")
        with self.assertRaises(GateError):
            self.call()
    def test_wrong_audio_path_rejected(self):
        self.reg["release_audio_path"] = "yunex/public/other.m4a"
        with self.assertRaises(GateError):
            self.call()
    def test_bad_frame_count_rejected(self):
        self.reg["locked_frames"] = 735
        with self.assertRaises(GateError):
            self.call()
    def test_wrong_qa_author_rejected(self):
        self.reg["pre_render_qa_evidence"]["agent"] = "H"
        with self.assertRaises(GateError):
            self.call()
    def test_file_hash_calculator(self):
        p = Path(self.tmp.name) / "sample"
        p.write_bytes(b"small-test-fixture")
        self.assertEqual(len(file_sha(p)), 64)


if __name__ == "__main__":
    unittest.main()
