# YUNEX 004 — Agent F FINAL independent visual QA
**Final result: PRE-RENDER VISUAL PASS — no remaining significant visual blockers.**  
**Exact immutable animation/film source:** `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`  
**Assessment:** 2026-10-08 · Independent Agent F · `sol/y004-f-qa`  
**Manager registry read:** `yunex/video004/TASKS.json`, Manager commit `469b77420547ddcb9fef2fbb46c619afb94cae4b`.  
**Technical audit:** Agent E run [37793698852](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37793698852), audit artifact [11557582041](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37793698852/artifacts/11557582041), job `113367482800`.  
**New F-reviewed native clips:** Agent H run [37781451513](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37781451513).  
**Previous F-reviewed 11 original corrected clips:** run [37769701749](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749); earlier scoped F report `H_CORRECTED_37769701749_INDEPENDENT_QA.md`, branch SHA `a09bbc8ffa1a186a2040fd8c8bbf35bd1690b33b`.

## 1. Independent review method and objective evidence

Agent F independently downloaded and extracted **both actual new GitHub Actions ZIP/MP4 artifacts**, not only their logs or Agent E's summary. For each:
- Recomputed the MP4 **SHA256**, checked the archive's `SHA256SUMS`, verified `source-sha.txt` matched exactly `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba` and `frames-inclusive.txt` matched the assigned frames.
- Ran independent `ffprobe -count_frames`: H.264, **1080×1920**, **30/1 fps**, `yuv420p`, TV color range, exact 66 or 90 decoded frames.
- Ran complete `ffmpeg -nostdin -v error -xerror -i <mp4> -f null -` decoding: **PASS**, no error. Independently decoded **every frame** with OpenCV; no identical consecutive frames in either clip (rear interframe 96×54 greyscale mean absolute difference 5.896, exit 16.165).
- Visually inspected all source-time sequences by multiple contact sheets at ~5-frame intervals and full-resolution details of the spokes, hub, asphalt, tyre, brakes, track, camera and the four exact cut-boundary frame pairs. This is a review of **actual decoded MP4s**; it does not claim an uninterrupted sound-on 24-second master playback.

Additional independently downloaded source-exact neighbour MP4s were checked and decoded: opening-tail 60–83 artifact `11548180309`, low teaching 150–246 artifact `11549115114`, early exit 567–596 artifact `11547945616`, final 687–719 artifact `11547991357`. Each matched its source lock, SHA256, intended frames and full decoder; no repeated adjacent frames. This enables truthful direct cross-artifact source-boundary comparisons.

Agent E's **actual audit ZIP** artifact `11557582041` was independently downloaded and its `E_ACTUAL_MP4_AUDIT.json` SHA256 was checked: `02840a492a2f53953879c74878b635d19b370c68cd242c1c35ded9f90983bacb`. Independently rebuilding the range set from the 13 per-clip audit records produced **720 distinct entries, ordered 0–719 exactly, zero missing, zero overlap**. The E audit confirms 13/13 native MP4s H.264 limited-range yuv420p, frame count, complete decode, media SHA256, source SHA and 0 adjacent duplicate decoded frames.

## 2. Newly reviewed rear-wheel macro — VISUAL PASS

**Exact corrected film frames 84–149 inclusive (66 frames, 2.2 s)**  
**Artifact:** [11556411461](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37781451513/artifacts/11556411461)  
**Native MP4 SHA256:** `11e8f97a9b7c6ba219812bd8682089b67140305231a0698588beb3bd14c67f1d`

- **Frames 84/94/104/114/124/134/149:** green spokes change orientation smoothly while the wheel's black central hub stays visually concentric with the rim; no obvious axle-centre orbit, lateral wheel flutter, sudden camber flip or detached part. The apparent rim size/position gradually varies with the travelling camera as expected, not an oscillating wheel.
- **Same frames:** tyre bottom remains close to, and visually supported by, the asphalt. Tyre-to-wheel-arch clearance stays credible; no conspicuous clipping through the arch or rising/falling tyre relative to the body. The black mudguard/body silhouette stays attached.
- **Frames 94–149:** grey perforated brake rotor and adjacent brighter caliper/bracket region remain within the expected brake area while green spokes rotate past. No observed rotating caliper sweeping around the hub or caliper detachment. **Qualification:** exact fixed-to-upright attachment and subtle relative steering yaw cannot be metrologically measured to subdegree precision from this 2D shot; this is a positive **visual** absence-of-defect finding supported by unchanged rig/geometry and source motion audits, not a claim of new mechanical CAD measurement.
- **Frames 84–149:** `A SMALL CHANGE.` caption is visible while the rear wheel remains the dominant image. Small captions/microtype are editorial polish, not a release blocker.
- **Mechanical overall:** no genuine blocking wobble, wheel-centre concentricity, brake, arch-clearance, grounding or steering-render defect found.

## 3. Newly reviewed active exit — VISUAL PASS

**Exact corrected film frames 597–686 inclusive (90 frames, 3.0 s)**  
**Artifact:** [11555685474](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37781451513/artifacts/11555685474)  
**Native MP4 SHA256:** `e95a2cf3c092703334e2bedffc7a8628be02357c1a8619b2432eeb14c4637b97`

- **Frames 597–622:** real moving Porsche crosses the fixed trackside view, transitioning from front three-quarter to side/rear three-quarter; apparent scale and vehicle position evolve, wheels roll and remain aligned over road, not a spinning turntable or static cutout. Road, fencing, barriers and trees provide believable spatial movement.
- **Frames 627–649:** vehicle moves away as the roadside view holds; track markings, barrier posts, and tree line supply perspective and parallax. No floating tyre, jumpy wheel or blank frames.
- **Frames 649→650:** **deliberate editorial cut** from a distant rear view to a closer moving rear-quarter chase. The subject suddenly grows larger due to a camera cut, not an unmotivated single-camera physical teleport; motion/track orientation before and after remain coherent. This is acceptable cinematic shot grammar, not a blocking animation defect.
- **Frames 650–686:** moving chase continues with car grounded on asphalt, rear wing and bumper intact, wheel silhouettes stable, road and trees advancing. The car remains visually dominant enough to follow; no fade-to-static or disappearing subject.
- **Last frame 686:** same rear-quarter view carries to next final frame 687 with continuous orientation and vehicle position.

## 4. Exact-source neighbour boundaries — all PASS

| Source-frame boundary | Actual adjacent MP4s inspected | Finding |
|---|---|---|
| **83→84** | Opening-tail artifact **11548180309** → new rear macro **11556411461** | Intentional whole-car rear chase **CUT** to rear-wheel mechanical close-up; car remains same livery/track, no corrupt/missing frame |
| **149→150** | New rear macro **11556411461** → low-teaching artifact **11549115114** | Intentional wheel close-up **CUT** to moving elevated car/steering explanation, no unintended black frame or visual glitch |
| **596→597** | Early exit artifact **11547945616** → new exit **11555685474** | Near-continuous front three-quarter car/track pose across one film frame, tyre contact maintained, no subject jump |
| **686→687** | New exit **11555685474** → final artifact **11547991357** | Near-continuous rear-three-quarter chase/car placement with compatible barriers/track, no frozen discontinuity |

## 5. Full 13-clip native evidence — exact corrected source

**13 native proof MP4s, 720 film frames exactly once, no dropped/overlapping ranges**, as independently cross-checked against downloaded Agent E audit and confirmed actual MP4 decoder/source evidence.

| Source frames inclusive | Frames | GitHub artifact | Source-exact MP4 SHA256 |
|---|---:|---|---|
| 0-59 | 60 | [11547392900](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547392900) | `3c6e61fdad18b478a2cf0cd232a6cd0fd2a40576f864994bf2b02656f55abfce` |
| 60-83 | 24 | [11548180309](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548180309) | `3b35f8c16c577bf9048db038bd17983704ce8c8d43be880d0cf434ec1f3e54d6` |
| 84-149 | 66 | [11556411461](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37781451513/artifacts/11556411461) | `11e8f97a9b7c6ba219812bd8682089b67140305231a0698588beb3bd14c67f1d` |
| 150-246 | 97 | [11549115114](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11549115114) | `4f7d4afdbc9928290b95f76ec8e72ba9b0b1f1fc4947d4437d5282f3e66d34fd` |
| 247-306 | 60 | [11548522472](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548522472) | `e28296c45485177fd02c8f2c338653f8450ff14c3fd7e8670f481f3ae1b833cb` |
| 307-311 | 5 | [11546544603](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11546544603) | `442de4943a49d76dd5f22771cdba61dd5b93e6de8ce19a85e563783187dcb9fc` |
| 312-371 | 60 | [11548552591](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548552591) | `588c834db8f098861358eb47c141de443fba7a656350e2d176dcbb999ff12467` |
| 372-431 | 60 | [11548576922](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548576922) | `3784fa26ef1d3829df7003cfdac4918bd3ae1aeb81caa53f3d87f615cb0fd56a` |
| 432-551 | 120 | [11548780809](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548780809) | `9aab859a39dd916890f5a5acdd7e8b7d9ea5cb21a1a905df2eb80b59462b0953` |
| 552-566 | 15 | [11548412328](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548412328) | `9bd321e4a5d8997a2463ad5fea2efd63cbcdc164337035fa67f266e7ca7b7836` |
| 567-596 | 30 | [11547945616](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547945616) | `db467b8d7d0352c619c5e03934c9f0bffe70fb7e893a72d1a346084e179fea84` |
| 597-686 | 90 | [11555685474](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37781451513/artifacts/11555685474) | `e95a2cf3c092703334e2bedffc7a8628be02357c1a8619b2432eeb14c4637b97` |
| 687-719 | 33 | [11547991357](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547991357) | `17f3b228f9577d9960f8dc89821dbdc57d65e15385858616afe05614181d5e0c` |

The previous 11 corrected-source clips already received independent F visual review: **steering overlays at frames 272/336/397 readable and true**, lower/high matched cut at 333 truthful (including `CENTRED` on straight sections), opening and roadside silhouette composition improved, low-speed teaching 150–246 and bridges 307–311/552–566 actual moving evidence accepted, exit beginning 567–596 and ending 687–719 active. This F release assessment does not withdraw or re-render those validated shots.

## 6. Honest PASS/FAIL and what it means for release

| Requirement | Final F decision |
|---|---|
| Low-speed opposite and high-speed aligned rear steering, visually explained | **PASS** (prior 11 proof review) |
| Readable true-angle direction overlays at 272, 336, 397 | **PASS** |
| Rear-wheel spinning without conspicuous wobble or eccentric hub | **PASS** |
| Caliper/rotor visually plausible without observed caliper co-spin | **PASS** (2D evidence qualification above) |
| Tyres grounded, credible wheel arch clearance | **PASS** |
| Roadside track movement, parallax and background | **PASS** |
| Opening/roadside composition; rear exit continuity | **PASS** |
| Source-exact real moving proof evidence for previously missing 84–149 and 597–686 | **PASS** |
| All 720 frames covered by strict source-matching proof MP4s | **PASS** |
| Independent complete *pre-render visual QA* | **PASS** |
| Approved Cedar AAC mux, audio-video synchronization, final 720f playable master technical QA | **NOT ASSESSED / PENDING AGENT G FINAL MP4** |
| Manager immutable source release lock / permission to start G | **MANAGER-OWNED; NOT GRANTED BY AGENT F** |

**Defects requiring film rebuild or new H clips: NONE.** Optional polish (tiny macro captions, stylistic camera cut) is not a reason to postpone a technically and visually sound corrected-source final film.

**Final independent Agent F verdict: VISUAL PASS for the complete corrected 720-frame source** `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`. This is only the **pre-render visual QA gate**. It does not certify a yet-uncreated full MP4, does not verify narration or audio mix, does not claim complete real-time human viewing of an assembled film, and **does not itself authorize Agent G**. Manager controls integration/pinned source and release; Agent F must independently inspect Agent G's *real audio-muxed MP4* once delivered.
