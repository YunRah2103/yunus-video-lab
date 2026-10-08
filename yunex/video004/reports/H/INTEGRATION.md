# YUNEX 004 — H final integration
Status: SOURCE IMPLEMENTED; NATIVE MOVING CLIPS AND INDEPENDENT F VISUAL REVIEW REQUIRED.
Branch: sol/y004-h-integration. Full source commit SHA is embedded by GitHub Actions in every proof artifact.
Changes: only A staging shot boundary edits 285 -> 333, 405 -> 432, 555 -> 567. Final 720-frame six-part ranges [0,84),[84,150),[150,333),[333,432),[432,567),[567,720).
High cut at 11.100s is after lower-speed Cedar sentence ends at 10.613s and before higher-speed sentence begins at 11.608s.
Moving exit at 18.900s matches fifth sentence start 18.858s.
Exit 567 instead of suggested 552 preserves 80m high-drive route under motion test 19m/s limit; a 120-frame high drive would need 20m/s before any curvature.
Approved Porsche GLB, corrected wheels, grounded track and steering mechanics unchanged.
D updated editorial and audio metadata copied exactly from approved remote 9567f6b2efa901d3667d084eedbbca9c98943c36.
Final YUNEX-004 composition 720 frames, 1080x1920, 30fps, muted. Old provisional alias remains available for older tools.
Approved AAC Library asset: /Video Projects/YUNEX 004/Agent D/YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a.
Expected and locally checked SHA256: a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51. AAC stereo 48k, 24.000s, 753974 bytes. Hash, ffprobe metadata and full ffmpeg decoder all verified using the actual Library file.
The approved AAC bytes are in Library, NOT GitHub. Agent G must materialize them, check their SHA, and mux with E external render pipeline. No old narration, stem or effects-only substitute permitted.
The H CI workflow must source-test all 720 motion frames, check GLB lock, compile TS/Remotion and render actual moving 1080x1920 proof MP4s with exact SHA, frame counts and full FFmpeg decode. CI passing does not substitute for Agent F independent visual approval.
No full 720-frame render or final mux by H. Manager alone pins source in TASKS.json after F PASS.
