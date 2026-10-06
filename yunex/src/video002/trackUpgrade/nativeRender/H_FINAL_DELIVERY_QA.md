# YUNEX 002 — Agent H final native delivery QA

Phase: `Y002-TRACK-UPGRADE-01`  
Role: `H — Final Render / Delivery`  
Branch: `sol/yunex-002-final-render`

## Canonical source
- Agent G source commit: `7e169ae7ac1555493c47ab4152e38c998b608374`
- G integrated native proof run: `37449536228` — PASS.
- H native render runs reused without rerendering valid frames:
  - `37450752136`: native frames 0–119.
  - `37453727041`: native frames 120–750.
- Native chunk coverage: 36 chunks, frames `0–750` inclusive exactly once, total 751 frames.

## Final master
- File: `YUNEX_002_FINAL_MASTER.mp4`
- MP4 SHA-256: `63f8186e9d178cdd6892b2662473ddf823c3e9388655627a299a532141ef20a5`
- File size: 83,248,541 bytes.
- Video: H.264, 1080×1920, yuv420p, BT.709 limited range.
- Source scale: 1. No upscale used.
- FPS: `30/1` nominal and `30/1` average.
- Frames: exactly `751`.
- Duration: `25.033333 s`.
- Full video/audio decode: PASS.

## Audio
- Approved source VO SHA-256: `899514c1a72080d87b76a5155841cb727b43644d6c636aa16f8eb28c83f60171`.
- Deterministic approved D mix SHA-256 reproduced exactly: `217e5efe0619d922a215c7572c4cc205731b79e57b65267bfdf39daf6280a8b9`.
- Final codec: AAC, 48 kHz, mono, 192 kb/s target.
- Final measured integrated loudness: `-15.76 LUFS`.
- Final measured true peak: `-1.09 dBTP`.
- Final AAC stays slightly below the -15.4 LUFS proof mix to keep true peak safely at/below -1 dBTP.

## Motion / stitch QA
- Full grayscale temporal decode checked all 751 frames.
- Exact duplicate frame pairs: `0`.
- Low-motion pairs below 0.05 MAD: `0`.
- Median consecutive-frame delta: `0.7186`.
- Minimum consecutive-frame delta: `0.2425`.
- Large changes at frame 540 (18.0 s) and frame 660 (22.0 s) were visually inspected and are intentional beat/camera cuts.
- Worst non-cut chunk-boundary delta ratio versus local motion: approximately `1.17×`; no accidental chunk seam detected.
- Representative final frames were inspected across hook, isolation, high-downforce, DRS, airbrake, whole-car and payoff beats.
- No frozen timeline portion detected.

## Scene retention
PASS by final-frame inspection / G integration proof:
- moving Porsche
- wheel motion
- camera motion
- active aero
- airflow
- integrated road
- barriers/furniture
- vegetation
- lighting/shadows

## Porsche lock
Approved Porsche SHA-256 remains:
`1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`

G integration QA verified the same hash and each native render job staged the locked Porsche with the expected SHA check before rendering.

## Delivery note
The large final MP4 is intentionally not committed to Git. H delivery metadata and QA are committed here. The final delivery encode performs no resizing; it normalizes CFR timestamp metadata and converts the native H.264 chunk master from full-range yuvj420p into standard BT.709 yuv420p delivery while preserving the native 1080×1920 raster.
