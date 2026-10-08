# YUNEX 004 — F independent native visual QA (H integration)

**Verdict: FAIL / RELEASE GATE BLOCKED — not a diagnosed moving-image defect.**  
**Reviewed exact H integrated source:** `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`  
**H branch:** `sol/y004-h-integration`  
**F branch:** `sol/y004-f-qa`  
**Assessment date:** 2026-10-08  
**Disposition:** DO NOT authorize Agent G's full master render or Manager's immutable render-source approval.

## What was actually inspected

1. Live H branch/commit and `yunex/video004/reports/H/INTEGRATION.md`, `H_INTEGRATION_HANDOFF.md`, `TASKS.json`, final `timeline.ts`, `Video004.tsx`, camera and guide source, and H native workflow.
2. The actual `Y004-H-AUDIT-720` GitHub artifact **11542213067**, downloaded and opened. It contains `y004-h-drive-audit.json`, with exact `sourceSha=f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`; the artifact is **JSON only, not a movie**.
3. The exact-source GitHub run **37761847924** (`YUNEX 004 H native moving integration proof`), and source job **113259913020**. That job reports PASS for GLB SHA256 check, TypeScript/Remotion compilation, A motion test, D editorial/audio tests, H integration test, all 45 F fixture regression tests and F's 720-frame live motion-data audit. Full logs examined. The native moving matrix jobs were still `in_progress` and **no exact-source moving MP4 artifacts** had been uploaded at the last check.
4. Independently executed the committed F `auditPreRenderProofs` and `auditIndependentVisualReview` functions on the real presently available H proof manifest (empty MP4 proof set): **both returned FAIL**, with missing moving media/provenance and unperformed visual review. This is a required rejection of inadequate evidence, not a claim that a rendered car was seen to fail.
5. Independently audited the H workflow shot-range matrix and compared against the final 720-frame timeline.

**Media review disclosure:** I did not watch an exact-source H moving MP4, because none was available in the current run. I did not audition the completed film with Cedar narration; H's proof design renders **muted** visuals and the final AAC is stored separately. This report cannot attest optical quality, rear caliper movement, guide legibility, audio-video synchronization by listening, or creative polish.

## Verified automated source/geometry findings (not moving visual approval)

| Gate | Result | Exact evidence |
| --- | --- | --- |
| Source and model integrity | PASS at H CI | `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb` canonical GLB SHA256 check |
| Frame-driven motion | PASS source data | 720/720 frames; `frameAudit.pass=true`, no failures |
| Low-speed opposite steer | PASS source data | 328 actively steered low frames reported by F audit |
| High-speed aligned steer | PASS source data | 101 actively steered high frames reported by F audit |
| Illustrative rear angle | PASS source data | Maximum 1.000° |
| Tyre-world road contact | PASS calculated positions | Max gap/error `1.033005948836152e-8 m` |
| Determinism | PASS source data | 10 requests with five distinct frames sampled out of order |
| A/H kinematics and track bounds | PASS H source job | Source test reported maximum bicycle curvature error `8.83584513489133e-6 /m`, minimum road clearance `3.18 m`, max per-frame in-shot translation `0.600 m`, max acceleration `0.745 m/s²` |
| Quantitative speed staging | PASS source data | Low 3.935–5.573 m/s; high 14.376–17.991 m/s |
| H editorial registration | PASS source test | `YUNEX-004`, 720 frames / 30 fps / 1080×1920, cut at frame 333 (11.100s), moving exit starts frame 567 (18.900s) |
| Independent F unit regression suite | PASS H CI runner | 45/45 tests |
| Actual GLB rim-plane precession under steer | **NOT VISUALLY VERIFIED** | Spin-by-distance is not proof of zero wobble |
| Upright-attached caliper non-spin / arch clearance | **NOT VISUALLY VERIFIED** | Code/fixture assertion cannot prove rendered geometry |
| Grounded shadows / world parallax | **NOT VISUALLY VERIFIED** | Need moving trackside video |
| Matched camera, visible guide bearings and mobile-safe typography | **NOT VISUALLY VERIFIED** | Need native low/high clips viewed muted |
| Narration semantics, sound mix, real-time synchronization | **NOT AUDITIONED** | H clips are muted; cue test is not playback |
| Active ending and full continuous film | **NOT VISUALLY VERIFIED** | Opening/tail footage not covered by planned clips |

## H native proof artifacts: exact-source inventory

**Run:** [37761847924](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37761847924)  
**Exact run source:** `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`

| Requested proof | Frames (inclusive) | Planned count | Latest artifact ID at assessment | Visual verdict |
| --- | --- | ---: | --- | --- |
| Hook and early macro | 60–119 | 60 | **Not uploaded** | NOT REVIEWED |
| Rear wheel / caliper macro | 90–149 | 60 | **Not uploaded** | NOT REVIEWED |
| Low-speed steering | 247–306 | 60 | **Not uploaded** | NOT REVIEWED |
| Matched low-to-high cut | 312–371 | 60 | **Not uploaded** | NOT REVIEWED |
| High-speed steering | 372–431 | 60 | **Not uploaded** | NOT REVIEWED |
| Roadside driving and track parallax | 432–551 | 120 | **Not uploaded** | NOT REVIEWED |
| Moving exit | 567–686 | 120 | **Not uploaded** | NOT REVIEWED |
| Source data audit (not video) | 0–719, data | 720 | **11542213067** | AUTOMATED PASS only |

The native jobs were still running; there was no complete native H proof ZIP to extract or play. No fake/old artifact ID has been attributed to the new H SHA.

**Rejected for release proof:** prior Manager/provisional render run `37755997906`, artifacts **11541125305**, **11540133822**, **11540927524**, are 24-frame clips from the older pre-retime source. They are not evidence of H's final frame-333 editorial timing, and were not accepted or substituted.

## Specific remaining release defects / evidence gaps

**F-QA-01 — BLOCKER: missing actual native moving MP4s.** No exact-H-SHA moving footage was accessible at assessment, so directional cues, rear articulation, wheel stability, caliper following, tyres, road parallax and camera fit cannot receive independent visual PASS. **Owner:** H / GitHub proof render workflow. **Required:** successful artifacts with real MP4, full SHA, frame ranges, codec metadata, decoder PASS, movie hash and accessible ZIP.

**F-QA-02 — BLOCKER: planned native proof coverage leaves critical story sections unseen.** The seven planned ranges cover **510 unique frames** and omit **210 frames**: `0–59`, `150–246`, `307–311`, `552–566`, `687–719`. Notably, the actual opening 0–59 and last 687–719 are absent. This is a coverage deficiency, not evidence of specific bad frames. **Owner:** H. **Required:** an exact-source opening clip from frame 0 and a final-exit clip through frame 719 (or a complete integrated 720-frame viewing artifact), with shots/cuts viewed at normal speed. Inspect omitted transitions as necessary.

**F-QA-03 — BLOCKER: no independent muted matched-mode review.** The source defines cut 333 and low/high guides, but human moving-footage confirmation of subtle opposite/same rear steer, consistent camera orientation and true-angle guides has not occurred. **Owner:** H supplies proof; F independently watches and records frame-level observations.

**F-QA-04 — BLOCKER: final audio/film playback unverified.** The source metadata puts high narration at 11.608s after the 11.1s cut and maps exit to 18.9s, but no complete approved Cedar-AAC-muxed Y004 preview was auditioned. H clips are intentionally muted. **Owner:** H/Manager supply approved audio-aligned preview or Manager-controlled full playback; F verifies. Do not declare actual sound sync from numerical timestamps alone.

**F-QA-05 — BLOCKER: no approved G render source.** Manager registry has `render_source_sha: null`. Native pre-render F PASS is missing. **Owner:** Manager after the above evidence is accepted. Agent G must not full-render from an unapproved commit.

## Final independent decision

- **Algorithmic/source QA:** PASS on source H SHA `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`, grounded in real GitHub runner output and downloaded data artifact.
- **Actual integrated native moving visual QA:** **FAIL TO SATISFY RELEASE GATE / BLOCKED (insufficient playable evidence)**. No observed render defect is invented or implied.
- **Audio and final audiovisual QA:** **NOT REVIEWED**.
- **Approval for 720-frame full render:** **DENIED until independent native visual evidence PASS**.
- **Master creative approval:** NOT CLAIMED.

Re-review against the exact H SHA and newly published native proof IDs, not against older provisional assets. Agent F owns this report only; no production changes were made.
