# YUNEX 002 — Completed dual TikTok delivery

Authoritative manager input: 3e44ddf8e4b27341c345a00de7db7ad56533fb71.
Native visual source: fb3cfbe7a171858ef96a12d9443d5e00412371de.
Successful native run: https://github.com/YunRah2103/yunus-video-lab/actions/runs/37507526198.
Status: COMPLETE. Both final MP4s exported and fully decoded successfully.

## Track correction
Corrected downward-facing road triangles and side-dependent runoff, terrain and kerb backfaces. Extended the local course into fog and preserved asphalt world texture scale. Geometry verification passes: 561 samples, 8.6m road width, 3.125m minimum conservative edge clearance, zero straight corridor drift. Approved car, aero mechanics, camera sequence, narrative and audio retained.

## Deliveries
A: established YUNEX finish.
B: subtly warmer grade, slightly tighter opening, different end framing and alternate concise technical labels.
Both: native 1080x1920, 751 frames, exact 30fps, 25.033333s, H264 yuv420p and approved AAC.
A SHA256: 367e544a4cb214d1f5253eef0f433b106b02de28977ec4eeac9600337c112689.
B SHA256: 2f5d51b692c5bdd9d69c494d7f18c64079d7ad794addffd0180a582a151621f5.
Audio SHA256 both: 53179827c21557acf1ebc0e7eae374736889e43c7615c220dc500cbc24021d2a.

## Review evidence
All 38 native chunk ZIP digests and pinned source SHAs verified; contiguous 0–750 frame coverage. Complete export decode passes. Both actual finished exports inspected in chronological half-second frame sequences across full duration, with native key frames and motion proof reviewed separately. No real-time playback/listening capability was available; audio identity and existing -1.1dBFS peak verified instead. Labels remain legible, car remains on asphalt throughout, road continuation and contact corrected. Historical Agent E FAIL applies to earlier source, not this master delivery.

## Reproduce
Render YUNEX-002-INTEGRATED-PROOF at scale1 from pinned native source, assemble fresh chunks. Run export_dual.py --source native-master.mp4 --audio PREVIOUS_APPROVED_MASTER.mp4 --out DELIVERY_DIR --fonts yunex/public. Use original MP4 as audio input to preserve AAC priming/timing, not ADTS AAC. Scripts and ASS are stored beside this README. Large MP4s stay outside Git.
