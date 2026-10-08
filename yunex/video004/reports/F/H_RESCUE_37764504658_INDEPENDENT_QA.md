# YUNEX 004 — Agent F independent native visual QA, rescue run 37764504658

**Overall: FAIL — pre-render visual release gate NOT APPROVED.**  
**Technical native proof gate: PASS, 9/9 downloaded MP4s.**  
**Exact animation source independently verified in all videos:** `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`.  
**Rescue workflow head:** `908a61bd52344f607f7d6a031b7e2b0c9e7e9ab3` (workflow/normalization changes; NOT a changed film-animation source).  
**Workflow:** https://github.com/YunRah2103/yunus-video-lab/actions/runs/37764504658 — completed **success**.  
**Reviewed:** 2026-10-08, Agent F on `sol/y004-f-qa`.  
**Important:** This is the independent QA decision; Agent H's own nine PASS labels establish encoded-media success, not independent F visual approval.

## Method — actual video inspected, not source-only

I fetched **all nine actual GitHub Actions ZIPs**, extracted their native MP4 streams and metadata, and independently ran FFprobe with `-count_frames`, full `ffmpeg -nostdin -v error -xerror -i <mp4> -f null -` decode, SHA256 against the embedded `SHA256SUMS`, and every-encoded-frame sequential decoding with OpenCV. I examined visual contact sheets sampling start, 20%, 40%, 60%, 80%, and end of each **actual** movie, several full-size native frames for high/low/matched, and enlarged six-frame rear-wheel/spoke/brake details at relative frames 0,10,20,30,40,50. Adjacent decoded frames were compared: all nine clips have nonzero interframe image differences with **zero identical consecutive pairs**. This confirms these are moving videos, not source-only reports or substituted stills.

**Limitation:** I inspected decoded moving-frame sequences and still-frame enlargements; I did not watch all nine at uninterrupted real-time playback speed. H's proof MP4s are muted, so no direct narration/sound quality or real-time audio synchronization can be concluded here. There is no complete 720-frame audio/video film for a continuous director review.

The source audit from earlier exact-source H run `37761847924` (artifact `11542213067`) passes all 720 frame samples, deterministic out-of-order requests, illustrative 1-degree rear-steer cap and world tyre-ground mathematical contact. All 45 independent F fixture regression tests passed in GitHub job `113259913020`. Source-data PASS does not override the native visual findings below.

## Independently verified native artifact inventory

All nine: H.264, strict **yuv420p with color_range=tv**, bt709 metadata, **1080x1920**, **30/1 fps**, exact frame counts, full FFmpeg decode PASS and matching MP4 SHA256. Every artifact's `source-sha.txt` is exactly `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55`.

| Clip | Film frames inclusive | Frames | Artifact ID | Independently calculated MP4 SHA256 |
| --- | --- | ---: | ---: | --- |
| Opening | 0–59 | 60 | 11544229629 | `705571fffd254f82d65756b9251035223cb48ef93398cc51424e594adcf1a536` |
| Hook macro | 60–119 | 60 | 11543722551 | `7628c52e713048672f246ea230ec46fbb01ceea67dac2604701d412dea7e0236` |
| Rear macro | 90–149 | 60 | 11544638033 | `a796eeb1631d7efb8f9e3b27d8fbe20adb7cd9d333eee8fb672833840ff36a42` |
| Low steering | 247–306 | 60 | 11544360519 | `1e1442f6eb8a1076b23d400040d69457879ba2b9cc51ba061a402df4cf9d2832` |
| Matched low/high | 312–371 | 60 | 11543552651 | `d9a57de2ad0bd4ecc801a613259170ca5e5c6fa52a663ae8412e977369f3b82f` |
| High steering | 372–431 | 60 | 11543587123 | `f1df803ec9c9659c7ce4f22f8201a078fbb43edd92e0f3a3eacdf66a0e4068e9` |
| Roadside driving | 432–551 | 120 | 11543912279 | `0cb697fcca28c2dae56aa05202a8f4d957e81c247950c8ef5e321dcf082d8a64` |
| Active exit | 567–686 | 120 | 11544021689 | `d922292e6b7fd3d97b2a2e6dcafb6a2704d6944bcb522aee676fd2c082c550f5` |
| Final end | 687–719 | 33 | 11543723429 | `0b356a2d0b069d1a8abcb3cf2c4e2e394826d278a51b1ca4a47c41350fa9d3de` |

**Coverage:** unique visual footage covers **603/720 frames**. Not covered: **150–246 (97 frames)**, **307–311 (5 frames)**, **552–566 (15 frames)**; the missing 150–246 interval is a substantial part of the lower-speed teaching segment.

## Independent scene-by-scene observations

**Opening, artifact 11544229629, frames 0,12,24,36,48,59:** genuinely moving world with clear hook “THE REAR WHEELS TURN TOO.” Porsche remains grounded with rear wheel visible. **Framing concern:** front of car and far end of rear wing stay outside the portrait crop for almost the entire two-second excerpt. It looks like a tightly cropped side/rear tracking view rather than a clear hero reveal; significant given the engineering-film intent, although not an observed mechanical fault.

**Hook/rear macro, 11543722551, frames 60,72,84,96,108,119:** rear tyre and green rim fill scene, road texture scrolls. Rim spokes visibly rotate; no obvious whole-rim precession or isolated tyre float is visible across sampled frames.

**Rear macro, 11544638033, frames 90,100,110,120,130,140 and 90,102,114,126,138,149:** the tyre remains visually planted, wheel centre/ellipse remains consistent relative to the arch, and rim spokes rotate. Caliper/rotor features are partially visible through green spokes, with no blatant detached brake assembly visible. **Caveat:** caliper's small dark details are partially occluded; this observation cannot unequivocally establish caliper non-spin across every revolution. Geometric/source rig audit supports proper parenting but is distinct from clear mechanical proof.

**Low, 11544360519, source frames 247,259,271–272,283,295,306:** genuine road displacement, readable “OPPOSITE DIRECTION / LOWER SPEED / AGILITY” and stable car/world. Actual rear-wheel physical yaw is intentionally very small. **Issue:** the white neutral guide and green actual-heading guide remain tiny, nearly parallel short streaks at road level, difficult to separate from asphalt markings at normal portrait viewing. Their opposite directions do not read clearly; the explanatory message depends on text rather than shown steering. Example film frame **272**.

**Matched transition, 11543552651, frames 312,324,336,348,360,371:** matched elevated three-quarter framing preserves vehicle-facing direction between low/high. Actual edit correctly changes visible wording from LOWER to HIGHER at frame **333**, a sensible editorial cut; no apparent camera orientation flip. **Issue persists:** physical heading and guides give barely perceptible differentiation; coloured line does not sufficiently communicate opposite vs same wheel direction in these actual frames. No fake enlarged physical angle was observed.

**High, 11543587123, frames 372,384,396–397,408,420,431:** real track motion and stable wheel silhouettes, “SAME DIRECTION / HIGHER SPEED / STABILITY” is visible. Very faint white/green guides remain essentially indistinguishable at ordinary view size; therefore direction match is *source-data-confirmed* but *not independently obvious visually*. Potential lower text contrast when a large track gantry passes behind the top typography around film frame **420–431**; secondary polish concern.

**Roadside, 11543912279, film 432,456,480,497,504,528,551:** background fencing, kerbs and trees move relative to car; wheels roll and contact remains visually credible. **Sustained framing concern:** much of rear bumper/wing remains cut off at right edge for the entire four-second moving-side view; film frame **497** is representative. Could be intentional trackside tightness, but prolonged crop weakens the technical full-car illustration. No obvious static turntable.

**Exit, 11544021689, frames 567,591,615,639,663,686:** convincingly moving trackside approach/pass, then chasing three-quarter view. The car remains the subject and ends in motion; not a frozen title card. During the close pass some portions naturally leave the crop, consistent with the intended active pass; not an isolated failure.

**Final, 11543723429, frames 687,693,700,706,713,719:** continuous rear three-quarter moving car on circuit with understated YUNEX text; no static card or truncated visual. Ground contact appears reasonable.

## Findings, severity, corrective owner

**F-004-01 — BLOCKING VISUAL READABILITY ISSUE — wheel-heading explanation.** Film frames **247–306**, **312–371**, **372–431**, especially **272 / 336 / 397**. In actual videos white/green axle guides visually collapse into hairline streaks against grey asphalt; the viewer cannot clearly distinguish opposing versus aligned *rear-wheel* orientation from the graphic alone. On-screen captions supply the words but the central engineering visual proof is weak. **Owner H / C camera-guides as delegated by Manager.** Keep genuine capped <=1° mechanical steer and do not fake larger physical yaw. Improve legibility by careful guide contrast, visual separation, placement, length, view/lens, or a brief wheel-level insert using the *real* orientation; keep the portrayed angle faithful. Re-render targeted low/high/matched native moving clips from newly pinned changed source and return them for F review.

**F-004-02 — HIGH-PRIORITY COMPOSITION QUALITY ISSUE — prolonged full-car cropping.** Film **0–59** (opening) and **432–551** (roadside), especially **0/36/59 and 497**. The rear wing/body front or rear stays clipped during sustained car-hero shots. This is a compositional concern, not claimed rig/model defect. **Owner H camera/editorial.** A modest camera pull-back or revised target/lens that retains dynamic proximity while showing more complete silhouette is preferred. Preserve the punchy macro (frames 90–149) and intentionally close trackside pass; avoid changing the approved GLB or track.

**F-004-03 — BLOCKING EVIDENCE GAP — incomplete moving sequence.** **117 source frames** have no native proof; `150–246` is over 3 seconds of the lower-speed teaching sequence, plus cut neighborhoods `307–311` and `552–566`. Nine successful proof clips are not the entire 720-frame film. **Owner H.** Publish exact-source 150–246 moving footage and bridge the smaller missing cut spans, or an accessible complete muted review master, and record run/artifact/sha provenance. No need to re-render existing valid clips absent source change.

**F-004-04 — NOT YET EVIDENCED — continuous audiovisual sync and caliper detail.** Native proofs are muted. Caliper appears to follow the wheel assembly without blatant spin or separation but is too occluded for unequivocal visual non-spin validation in this macro sample. **Owner H/Manager and B if needed.** Supply a close-up/native proof which keeps brake upright distinguishable, or cite a verified actual-GLB caliper transform test plus an adequate actual video. Audio phrase boundaries have passed H's source test but actual spoken semantic alignment needs final human playback of approved Cedar mix before completed-film QA. Do not substitute unrelated audio.

## Release decision

- **9/9 genuine exact-source native moving videos:** independently VERIFIED media/data provenance and full decodes **PASS**.
- **Rear tyre contact, wheel rotation/stability, moving racetrack, match cut, active exit:** no obvious severe physical fault in sampled frames; limited visual observations **PASS WITH QUALIFICATIONS**.
- **Independent mechanism demonstrability and full moving-proof coverage:** **FAIL** for release gate as above.
- **F independent pre-render visual gate:** **FAIL — do not approve**.
- **Manager `render_source_sha` / G full render:** remain **BLOCKED** until exact revised source and independent F rescreen; no authority granted by this report.
- **Human full real-time audio/video watch:** not performed; do not represent screenshot inspection as uninterrupted movie viewing.
- **Master creative approval:** never claimed.

This report changes only Agent F-owned `yunex/video004/reports/F/**`. No other agent's production code was edited.


## Independent reconciliation with H's final nine-proof inventory (2026-10-08)

The H `native-proof-inventory.json` published at H report commit `943475571faa53217397404bb9e750359d66cfcd` was fetched independently. Its nine artifact IDs, frame ranges, required counts, full `mp4Sha256` values and `exactFilmSourceSha` match this report, including the opening and final ending clips. A further independent reread of the **actual nine local MP4s** rechecked each video against its ZIP's `SHA256SUMS`, its embedded `source-sha.txt`, and independently counted FFprobe frames: **9/9 match**, each strict H.264/yuv420p, 1080×1920, 30/1. No outdated provisional clip was substituted.

Re-examined full-size decoded **low-steering relative frame 25 (film 272)**, **high-steering relative frame 25 (film 397)**, opening contact at film 0/12/24/36/48/59, rear-macro wheel details at relative 0/10/20/30/40/50 and all nine shot contact sequences. The principal blocking visual finding remains: green and white wheel-direction reference lines are extremely faint, near-coincident in the explanation shots, and the actual low-vs-high rear yaw difference is not independently understandable without text. No clear physical wheel wobble or caliper detachment is visible in these samples; caliper non-spin remains partially occluded. The opening and roadside tracking clips remain repeatedly cropped. The final ending remains active and moving.

**Final independent verdict unchanged: NATIVE MEDIA TECHNICAL PASS; VISUAL RELEASE FAIL.** This is based on genuine reviewed MP4 frames, *not* the older insufficient-evidence report. The H inventory's `NATIVE_EVIDENCE_9_OF_9_PASS` is correctly interpreted as technical export success only. The proof clips are muted and still omit 117 film frames, so there is no claimed whole-film real-time audiovisual viewing. H/C should first make true-angle guide distinction visible at normal 9:16 scale and reshoot affected matched low/high footage; H should improve overlong silhouette crop, supply missing 150–246 coverage and confirm the problematic cut neighborhoods. Only F can reapprove from **new exact-source moving artifacts** after source changes.
