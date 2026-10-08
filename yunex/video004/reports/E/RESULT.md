# Agent E — Y004 Native Renderer: implementation and proof report

**Phase:** Y004-REAR-STEERING-01  
**Assigned branch:** `sol/y004-e-render`  
**Scope:** `yunex/video004/render/**`, `.github/workflows/yunex-004-*.yml`, `yunex/video004/reports/E/**` only.

## Result

**TOOLING IMPLEMENTED / SMOKE-PASS. FULL Y004 FILM RENDER BLOCKED BY MANAGER/F QA GATES.** This is the prescribed dependency boundary, not a rendered car movie.

### Delivered code

- `yunex/video004/render/pipeline.py`: integer-frame chunk matrix; 40-digit immutable source SHA + full chunk coverage validation; native 1080x1920 30 fps H.264 chunk checks; complete final normalisation to limited-range `yuv420p` (reject `yuvj420p` in master), AAC 48 kHz stereo mux, explicit PTS, faststart, duration, exact decoded frame count, complete decoder pass, file SHA256 and machine-readable evidence.
- `yunex/video004/render/test_pipeline.py`: synthetic **native moving-image** test fixture, including *mixed-full/limited-range* input chunks, full video+audio export, negative source/gap tests, frame-matrix boundary tests. Four tests.
- `.github/workflows/yunex-004-render-ci.yml`: validates runner tools and approved original GLB SHA; executes the native smoke fixture; uploads runnable proof.
- `.github/workflows/yunex-004-native-release.yml`: manual, Manager-gated immutable-source chunk render, exact-source aggregation, fresh Y004 audio mux and one final master artifact, plus assembly-only replay of valid chunks.
- `yunex/video004/render/README.md`: documented command line and strict Manager dependency gate.

### Native smoke proof — verified on remote GitHub Actions

| Field | Verified |
|---|---|
| CI run | [37750922383](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37750922383) |
| Remote source (all proof code) | `91be80ea3d9ee51b2e58dfbf50230aeba7a5374d` |
| CI job | `113223639217` |
| CI job status | **SUCCESS** |
| Synthetic native proof artifact | `11538520721` — `Y004-E-NATIVE-TOOLING-SMOKE` |
| Native proof frames / rate | 4 frames / constant 30 fps |
| Native proof resolution | 1080 × 1920 |
| Final proof stream | H.264 limited-range yuv420p + AAC stereo 48 kHz |
| Test suite | 4/4 passed |
| Model check | Original Porsche GLB SHA256 verified by runner |
| Proof identity | GitHub workflow/run/job/artifact above; archived fixture MP4 and machine-readable JSON/SHA256 |

The fixture is synthetic (colour-changing driving analogue, not Porsche geometry). It demonstrates functioning native encoding, source-lock rejection, export timing/format QA, audio mux, decode and artifact delivery. It does **not** establish a moving actual-car proof, low/high steering or creative quality. Earlier initial workflow attempts failed due to missing runner FFmpeg and an invalid YAML flow-expression syntax; these faults were corrected before this **PASS** run.

### Full render dependencies and required Manager follow-up

The Manager must integrate A/B/C/D plus E tooling into a pinned source commit and receive **F pre-render native moving QA PASS**. After D measures approved new Y004 voiceover, publish `locked_frames`, exact `render_source_sha`, `pre_render_qa_status: "PASS"` and `pre_render_qa_evidence` in Manager-owned `TASKS.json` in a later registry commit. The film workflow rejects any missing gate or source mismatch. Use one genuine film master; do not dispatch against this Agent E branch, do not assume 720 frames, and do not reuse older Y003 audio.

**Full native Y004 MP4, release run/artifact, total frame count and final SHA256: NOT YET AVAILABLE.** No claim of real-car moving proof or final delivery is made.
