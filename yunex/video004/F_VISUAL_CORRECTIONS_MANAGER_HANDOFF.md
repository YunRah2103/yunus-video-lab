# YUNEX 004 — F visual corrections, Manager assignment

**Manager status:** Visual release FAIL; film must not be sent to G yet.
**Independent F report:** `sol/y004-f-qa` `yunex/video004/reports/F/H_RESCUE_37764504658_INDEPENDENT_QA.md`, F full SHA `d7896e5eeef802587b95e61784558b30a794af4a`.
**Previous film source:** `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`; all nine strict source-pinned native proofs passed media checks in run `37764504658` BUT independent visual QA failed. No re-use of these as approval after changes.

## Corrective assignments, disjoint file ownership

### Agent C — specialist camera/guide corrections
Work only in your existing `sol/y004-c-camera-guides` branch and owner modules `yunex/src/video004/camera/**`, `yunex/src/video004/guides/**`, `yunex/video004/reports/C/**`. Read current integrated H film source first, not only your older branch; selectively port changed modules to Manager/H (avoid accidentally undoing the latest film).
1. F-004-01 **blocking**: At 272, 336, 397 and across low/high, neutral white and true-angle green guides are hairline streaks against asphalt. Retain physically **true capped ≤1°** rear steering and real wheel endpoints; legibility through camera positioning, deliberate projection-aware length, contrast/occlusion, subtle label/pointer/neutral+actual graphic placement and limited technical group count. Do not alter geometry to fake direction or claim a real Porsche steering controller calibration. Demonstrate low opposing vs high aligned in muted portrait at normal view size.
2. F-004-02 high: Open 0–59 and roadside 432–551 are sustained cropped wing/front/rear; adjust camera lens/target/off-axis framing so full Porsche silhouette can read while staying cinematic, moving and grounded. Retain tight rear macro and dynamic active exit.
3. Run owner tests; arrange lightweight actual native proof using H's existing workflow only AFTER H integrates your code. Provide patch/owner full remote SHA, exact files, any integration notes. Do not modify Manager registry, H central timeline or H workflow, GLB, or F report.

### Agent H — final corrective integration and new proofs
Wait for C's NEW code SHA, merge or copy ONLY C-owned camera+guides patches into a new H source commit, preserving real film timing, unchanged model/motion and Cedar cues. Then run production code tests and create fresh source-pinned 1080×1920 native moving proof for modified:
- opening 0–59 and roadside 432–551;
- low 247–306, matched 312–371, high 372–431;
- uncovered 150–246 and cut spans 307–311, 552–566;
- caliper distinguishability if still ambiguous.
Use source-specific manifests, strict limited-range yuv420p/tv + FFmpeg full decoder, full frame provenance. Reuse proofs of unchanged shots only if they match the NEW source AND coverage is valid; do not combine source SHAs in final acceptance.
Publish full updated H SHA and actual proof artifacts. No 720-frame full render by H.

### Agent F — independent release reassessment
Review new actual footage from the NEW immutable H SHA; independently confirm central guide legibility and full-car framing, and inspect complete necessary shot/transitions with actual moving frames. If PASS, publish SHA+artifact specific report, not opinion from old proof. If FAIL, give precise frame issue and owner. Do not self-approve before viewing.

### Agent I — release audio bridge
The D approved AAC mix (SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`) is locally verified, but still has no remote audio file on I branch. Agent I documented Windows Git patch publication instructions in `reports/I/RELEASE_READY.md`. Use an authorized Git checkout to push exactly those bytes. No placeholder or alternative mix.

## Manager / G gates
Manager still must combine corrected H and verified I audio in one candidate, get F independently approved visual evidence on source-exact candidate, and only then set `pre_render_qa_status=PASS`, immutable `render_source_sha`, chosen `release_audio_path`, explicit launch authorization. G full 720-frame render stays blocked.
