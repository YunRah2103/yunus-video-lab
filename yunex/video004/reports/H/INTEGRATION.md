# YUNEX 004 — H integrates Agent C visual corrections

**Integration status:** CAMERA/GUIDE/OVERLAY INTEGRATED; C + H + D + F SOURCE TESTS **PASS**; exact-new-source moving MP4 validation **IN PROGRESS**. **No independent Agent F visual PASS or Manager render unlock.**

## Immutable source lock

- **Exact corrected film source:** `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`, H branch `sol/y004-h-integration`.
- Prior source **`f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`** is historically validated but failed F's creative checks at opening, roadway and guide legibility. Old artifacts must not be used to approve the new film; legacy inventory archived as `native-proof-inventory-previous-f5cb.json`.
- Ingested both C commits: `8039e03db2d2a774c4a4f3ff9639b8148eb69707` (actual corrected camera/guide code and regression tests) and `f891e3b991c73c4c62305dddcd45cea9eeea5090` (honest numeric QA results), using their exact committed content. Camera module only widened `low-hook` and `high-drive`; C guide projection uses actual scene yaw.
- H `Video004.tsx` explicitly mounts `<Y004SteeringGuidesOverlay/>` directly **after** `</ThreeCanvas>` and **before** `<Yunex004EditLayer/>`. Duplicate 3D guide primitives suppressed only during `low-explain` and `high-explain`; hook/rear-macro 3D proof retained.
- Overlay labels front/rear as CAR LEFT, CAR RIGHT or CENTRED from real per-wheel yaw. It shows OPPOSING/ALIGNED *response category*, not enlarged physical wheel yaw, and hides on hero trackside shots. True projected guide angle never multiplied. `CENTRED` must remain truthful when physical steering is zero near frame 397.
- Porsche GLB stays at SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`. A/B motion/rig, steering cap, wheels/caliper, track, D Cedar audio, timeline and exact shot boundaries **unchanged**.

## Verified real CI source test results

- [New source and native QA workflow 37769701749](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749), source **`1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`**.
- **Source tests: SUCCESS**, audit [artifact 11547123669](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547123669).
- Actual React/Three `Video004.tsx` and full Remotion `src/index.tsx` esbuild browser bundles **PASS**.
- C original fixture + F visual regression **PASS**: 14 silhouette-proxy camera samples, 10 guide/readout samples, centred-zero integrity and no overt angle exaggeration. Proxy framing checks are *not* evidence of actual uncropped Porsche images.
- Existing A motion test PASS all 720 frames, max speed 17.9911111111 m/s; D editorial timing guardrails **PASS 20**, D audio fixtures **PASS 19+**, H source integration **PASS**; independent F QA schema fixtures **45/45 PASS**.
- Full corrected-source live audit **720/720 frames PASS** with zero automated failures; status `AUTOMATED_PASS_VISUAL_NOT_REVIEWED` is not independent F creative approval.

## Strict **new exact-source** native moving proof

Workflow `37769701749` has 11 independent actual Remotion MP4 jobs with ranges:
`0–59`, `60–83` (remaining widened-hook frames), `150–246` (all former missing teaching frames), `247–306`, `307–311` (missing cut), `312–371`, `372–431`, `432–551`, `552–566` (missing cut), `567–596` (sample moving exit) and `687–719` (complete final endpoint).

Every job renders at native 1080x1920/30fps and normalizes any full-range render to strictly **H.264 yuv420p, TV/limited range**, using H's previously verified FFmpeg helper without modifying its strict validator. Source must equal `GITHUB_SHA` for its run; raw Remotion native frames counted before normalization; final MP4 must pass expected exact frame count, 1080x1920, 30/1 fps, yuv420p color_range=tv, full `ffmpeg -xerror` decoder and MP4 SHA256 manifest. Jobs do **not** render the full 720-frame film.

**Native results/IDs** are recorded live in `native-proof-inventory.json`; until CI jobs genuinely succeed no new MP4 IDs may be claimed. Old-source media evidence archived for diagnostic historical reference only; it is source-incompatible with the new corrected film.

## Narrration and final delivery lock

720f @30fps = 24.000s, original stage changes at **frame 333 (11.100s)** and **frame 567 (18.900s)** remain. Approved Cedar final AAC checksum `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`, 24.000s, 48kHz stereo, separate approved Agent D Library binary for external Agent G mux. No soundtrack is baked into H's visual proof MP4s.

**Outstanding:** required native videos must complete and be independently evaluated; Agent F's creative/visual gate remains explicitly **FAIL/PENDING RECHECK** after old source rejection. Agent J's advice does not override F. Manager must approve and set new exact render-source SHA before Agent G starts complete film. H has not begun any full 720-frame render or edited `TASKS.json`.
