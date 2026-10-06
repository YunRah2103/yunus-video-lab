# YUNEX 002 — Master dual TikTok finish

Authoritative manager input: 3e44ddf8e4b27341c345a00de7db7ad56533fb71.
Integrated input: 3ee36a708e2a466c0822431af940cf0be47b1c01.
Corrected native visual source: c3f4569a926d61bb7475b0949ae11b59c3765220.
Native run: https://github.com/YunRah2103/yunus-video-lab/actions/runs/37506654258.
Current status: RENDERING — not final delivery yet.

## Correction
E's genuine visual failure was caused by downward-facing asphalt triangles and side-dependent backfaces in runoff/terrain/kerbs. Orienting triangles upward exposes the authored asphalt. The small surface section now continues out beyond visible cameras into fog rather than ending at a flat horizon. Approved car bytes, aero mechanics, cameras, narration, sound and 751-frame timeline remain unchanged.

Geometry verification passes: 561 layout samples, 8.6m width, 3.125m conservative tyre/body edge clearance, 0 straight-corridor drift; road, both runoff sides, both terrain sides and both kerb tops face upward. Native opening, macro, downforce, side, braking, whole-car and payoff frames reviewed; complete moving delivery still pending.

## Two finishes
A: established YUNEX grade, small hero reframing, existing technical cues.
B: subtly warmer grade, slightly tighter opening/different end framing, alternate concise technical cues. Identical narrative/mechanical timing and approved audio.
Both must be true native 1080x1920 source, 751 frames at exact 30fps, H264 yuv420p/AAC MP4.

## Reproduce
Stage approved model.glb at yunex/public/model.glb. Run native workflow or existing Remotion composition YUNEX-002-INTEGRATED-PROOF at scale1. Assemble all fresh chunks from the pinned visual SHA without gaps. Extract approved AAC from the previous approved master; SHA256 53179827c21557acf1ebc0e7eae374736889e43c7615c220dc500cbc24021d2a. AAC max sample peak -1.1dBFS, mean -15.3dBFS.

Run geometry verification from yunex: node video002/master-dual/validate_geometry.cjs.
Run export_dual.py with explicit --source native-master.mp4 --audio approved-audio.aac --out DELIVERY_DIR --fonts yunex/public. Use repo font Display.ttf. The script applies established finishing once, exports both variants, decodes both completely and checks exact frame/rate/duration plus byte-identical approved AAC.

Large MP4s stay outside Git. Final DELIVERY_QA.json and final review findings will be committed after render and inspection. Do not treat historical FAIL on the original integration SHA as a PASS on the corrected source; this master review owns fresh evidence.
