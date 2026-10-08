#!/usr/bin/env python3
"""Native 1080x1920 smoke fixture plus unit/negative-path tests; no Porsche content rendered."""
from __future__ import annotations
import json
import os
import shutil
from pathlib import Path
import subprocess
import tempfile
import unittest
import pipeline as p

SOURCE = 'a' * 40


class PipelineTests(unittest.TestCase):
    def test_matrix_remainder(self):
        self.assertEqual([(r['start'], r['end']) for r in p.chunks_for(47, 20)],
                         [(0, 19), (20, 39), (40, 46)])
        self.assertEqual(len(p.chunks_for(720, 20)), 36)
        self.assertEqual(len(p.chunks_for(735, 20)), 37)

    def test_invalid_matrix(self):
        for total, size in [(0, 20), (2, 0), (-1, 20)]:
            with self.assertRaises(ValueError):
                p.chunks_for(total, size)

    def test_missing_chunks(self):
        with tempfile.TemporaryDirectory() as td:
            with self.assertRaisesRegex(ValueError, 'coverage/order'):
                p.validate_chunks(Path(td), 4, 2, SOURCE)

    def test_native_mixed_range_end_to_end(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            chunks = root / 'chunks'
            chunks.mkdir()
            for index, part in enumerate(('0000-0001', '0002-0003')):
                output = chunks / f'chunk-{part}.mp4'
                fmt = 'yuvj420p' if index == 0 else 'yuv420p'
                subprocess.run(['ffmpeg', '-hide_banner', '-v', 'error', '-y', '-f', 'lavfi',
                                '-i', f'color=c={"blue" if index == 0 else "red"}:s=1080x1920:r=30',
                                '-frames:v', '2', '-c:v', 'libx264', '-threads', '2',
                                '-pix_fmt', fmt, str(output)], check=True)
                (chunks / f'source-sha-{part}.txt').write_text(SOURCE + '\n')
            audio = root / 'Y004_NEW_VOICE.wav'
            subprocess.run(['ffmpeg', '-hide_banner', '-v', 'error', '-y', '-f', 'lavfi',
                            '-i', 'sine=frequency=440:duration=0.12', '-ar', '48000',
                            '-ac', '2', str(audio)], check=True)
            self.assertEqual(len(p.validate_chunks(chunks, 4, 2, SOURCE)['chunks']), 2)
            with self.assertRaisesRegex(ValueError, 'source SHA mismatch'):
                p.validate_chunks(chunks, 4, 2, 'b' * 40)
            output = root / 'YUNEX-004-FINAL.mp4'
            report = p.assemble(chunks, output, 4, 2, SOURCE, audio, root / 'evidence')
            self.assertEqual(report['status'], 'PASS')
            self.assertEqual(report['frames'], 4)
            self.assertEqual(report['video']['pixel_format'], 'yuv420p')
            self.assertEqual(report['video']['color_range'], 'tv')
            self.assertTrue(report['faststart'])
            self.assertTrue((root / 'evidence' / 'CHUNKS.json').is_file())
            self.assertTrue((root / 'evidence' / 'RELEASE_VALIDATION.json').is_file())
            self.assertEqual(len((root / 'evidence' / 'SHA256SUMS').read_text().strip().split()[0]), 64)
            if os.environ.get('Y004_SMOKE_EVIDENCE_DIR'):
                destination = Path(os.environ['Y004_SMOKE_EVIDENCE_DIR'])
                destination.mkdir(parents=True, exist_ok=True)
                shutil.copy2(output, destination / output.name)
                shutil.copy2(root / 'evidence' / 'RELEASE_VALIDATION.json', destination / 'RELEASE_VALIDATION.json')
                shutil.copy2(root / 'evidence' / 'CHUNKS.json', destination / 'CHUNKS.json')
                shutil.copy2(root / 'evidence' / 'SHA256SUMS', destination / 'SHA256SUMS')
            # Reject provenance cross-contamination even when media itself was valid.
            (chunks / 'source-sha-0000-0001.txt').write_text('b' * 40)
            with self.assertRaisesRegex(ValueError, 'source SHA mismatch'):
                p.validate_chunks(chunks, 4, 2, SOURCE)


if __name__ == '__main__':
    unittest.main(verbosity=2)
