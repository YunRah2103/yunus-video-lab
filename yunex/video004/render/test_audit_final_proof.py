#!/usr/bin/env python3
"""Dependency-free metadata/regression tests; real media is checked in CI audit."""
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
import audit_final_proof as a


class CoverageTests(unittest.TestCase):
    def test_exact_720_frame_seams(self):
        self.assertEqual(a.intervals_valid(),720)
        self.assertEqual(sum(b-c+1 for _,c,b,_ in a.SEGMENTS),720)
        self.assertEqual(sum(b-c+1 for _,c,b,r in a.SEGMENTS if r==a.GAP_RUN),156)

    def test_overlap_rejected(self):
        s=list(a.SEGMENTS)
        label,start,end,run=s[2]
        s[2]=(label,start-1,end,run)
        with self.assertRaisesRegex(ValueError,"gap or overlap"):
            a.intervals_valid(s)

    def test_gap_rejected(self):
        s=list(a.SEGMENTS)
        label,start,end,run=s[2]
        s[2]=(label,start+1,end,run)
        with self.assertRaisesRegex(ValueError,"gap or overlap"):
            a.intervals_valid(s)

    def test_missing_prior_proof_rejected_even_pending_mode(self):
        with TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError,"expected artifact unavailable"):
                a.audit(Path(tmp),None,pending_allowed=True)

    def test_no_pending_override_when_unavailable(self):
        with TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError,"expected artifact unavailable"):
                a.audit(Path(tmp),None,pending_allowed=False)


if __name__=="__main__":
    unittest.main(verbosity=2)
