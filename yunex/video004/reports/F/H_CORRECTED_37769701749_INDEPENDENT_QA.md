# YUNEX 004 — Agent F independent QA of C/H corrected native film
**Assessment date:** 2026-10-08  
**Exact corrected animation source:** `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`  
**Proof run:** [37769701749](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749) — completed SUCCESS, 11/11 native proof jobs SUCCESS.  
**H authoritative evidence:** `yunex/video004/reports/H/INTEGRATION.md` and `yunex/video004/reports/H/native-proof-inventory.json` (schema v2).  
**Independent F verdict for the 11 actual corrected clips:** **PASS — prior principal visual defects corrected**.  
**Whole-film PRE-RENDER RELEASE GATE verdict:** **FAIL / HOLD — exact-new-source native evidence still missing for the rear-wheel macro and the middle 90 frames of the active exit; no complete audiovisual review.**  
**No Agent G final render approval is conferred.**

## Actual independent media inspection and QA

Agent F retrieved all **eleven actual GitHub Actions artifact ZIPs**, extracted the **eleven MP4 binaries**, validated their `source-sha.txt`, `frames-inclusive.txt` and `SHA256SUMS`; independently ran **FFprobe -count_frames**, full `ffmpeg -nostdin -v error -xerror -i MP4 -f null -` decodes, and sequentially decoded **every frame of each native video** with OpenCV. Consecutive grayscale images at 54×96 were compared, yielding a nonzero mean image difference in every clip and **zero identical successive decoded frames** in each. Source provenance matched the exact `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba` in all 11 proof ZIPs. All clips have H.264 video, 1080×1920 portrait, fixed 30/1 fps, `yuv420p`, TV limited range, exactly the declared frame count and fully decoded without errors.

**Visual method disclosure:** I reviewed multi-frame moving-sequence contact sheets covering opening, opening tail, 150–246 teaching, 247–306 lower speed, 307–311 bridge, 312–371 match, 372–431 higher speed, 432–551 roadside, 552–566 bridge, 567–596 active exit, and 687–719 ending; I also inspected full-resolution source frames 272, 332/333/336, 397, 497, 35, 200, 560, 578 and 719. Every native video was genuinely decoded and sampled in sequence; this is **not** a claim of uninterrupted real-time playback of a full 24-second film. All eleven provided clips are muted, so audible sync and sound mixing were **not** assessed.

The updated `Y004-H-C-SOURCE-AUDIT` artifact **11547123669** reports source-driven 720/720 frame motion audit PASS, max rear steering 1°, computed tyre-ground error 1.033×10⁻⁸ m, and 45/45 F fixture regression tests. Those checks support, but do not substitute for, visual observations.

## Independently verified corrected-source video inventory

| Clip | Film frames (inclusive) | Native frames | Artifact ID | Exact MP4 SHA256 |
|---|---|---:|---|---|
| opening-0-59 | 0-59 | 60 | [11547392900](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547392900) | `3c6e61fdad18b478a2cf0cd232a6cd0fd2a40576f864994bf2b02656f55abfce` |
| opening-tail-60-83 | 60-83 | 24 | [11548180309](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548180309) | `3b35f8c16c577bf9048db038bd17983704ce8c8d43be880d0cf434ec1f3e54d6` |
| low-full-150-246 | 150-246 | 97 | [11549115114](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11549115114) | `4f7d4afdbc9928290b95f76ec8e72ba9b0b1f1fc4947d4437d5282f3e66d34fd` |
| low-247-306 | 247-306 | 60 | [11548522472](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548522472) | `e28296c45485177fd02c8f2c338653f8450ff14c3fd7e8670f481f3ae1b833cb` |
| low-gap-307-311 | 307-311 | 5 | [11546544603](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11546544603) | `442de4943a49d76dd5f22771cdba61dd5b93e6de8ce19a85e563783187dcb9fc` |
| match-312-371 | 312-371 | 60 | [11548552591](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548552591) | `588c834db8f098861358eb47c141de443fba7a656350e2d176dcbb999ff12467` |
| high-372-431 | 372-431 | 60 | [11548576922](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548576922) | `3784fa26ef1d3829df7003cfdac4918bd3ae1aeb81caa53f3d87f615cb0fd56a` |
| roadside-432-551 | 432-551 | 120 | [11548780809](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548780809) | `9aab859a39dd916890f5a5acdd7e8b7d9ea5cb21a1a905df2eb80b59462b0953` |
| roadside-gap-552-566 | 552-566 | 15 | [11548412328](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11548412328) | `9bd321e4a5d8997a2463ad5fea2efd63cbcdc164337035fa67f266e7ca7b7836` |
| exit-567-596 | 567-596 | 30 | [11547945616](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547945616) | `db467b8d7d0352c619c5e03934c9f0bffe70fb7e893a72d1a346084e179fea84` |
| ending-687-719 | 687-719 | 33 | [11547991357](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749/artifacts/11547991357) | `17f3b228f9577d9960f8dc89821dbdc57d65e15385858616afe05614181d5e0c` |

**Coverage:** the 11 corrected-source clips include **564 unique film frames of 720 (78.33%)**. Exact-source gaps: **84–149 (66 frames)** and **597–686 (90 frames)**. Old source `f5cbdf2f6c96aa5ac2e5c184a048f49700037f55` has historical native proofs for those intervals, but they are **not accepted as same-SHA proof** of the new corrected film. The H source diff preserves the underlying Porsche model, track, four-wheel motion/rig and timeline; it changes camera, guides, and mounted explanatory overlay. This increases confidence in mechanical continuity, but does not replace the missing exact-source close-up video.

## Scene-by-scene independent visual findings

**Opening camera (0–59, proof 11547392900) and tail (60–83, proof 11548180309): VISUAL PASS, prior crop defect fixed.** Film frames **0/11/23/35/47/59** and **60/69/78/83** show the complete white/green Porsche including wing, wheels and nose staying inside the 9:16 frame. Track and trees shift naturally as car moves. The hero has substantially more surrounding road and sky than previously, so the car is less dominant. This is **optional composition polish**, not a material failure.

**Rear wheel macro (84–149): NOT EXACT-NEW-SOURCE VISUALLY VERIFIED.** None of the 11 ZIPs contains frames 84–149. Historic film proofs establish a precedent for reasonable rear-wheel motion, and the diff contains no rig/wheel asset change, but precise caliper non-spin, rear-upright attachment, wheel-arch clearance and absence of precession **cannot be certified in a new-source frame-accurate close-up** from these eleven clips. **Blocking evidence gap F-NEW-01.** Owner H: render/publish exact-new-source native MP4 frames 84–149 with SHA and decoder check, then F inspects.

**Lower-speed teaching (150–246, proof 11549115114): VISUAL PASS, previous 97-frame gap closed.** Frames **150/169/188/200/207/226/246** show actual moving car, changing background and readable “LOWER SPEED / AGILITY.” The “OPPOSING RESPONSE” panel correctly identifies **FRONT CAR LEFT** vs **REAR CAR RIGHT** during sampled left-steering frames and both **CENTRED** when steering reaches zero. World tyres remain plausibly planted, wheels look stable, no camera cut problems seen.

**Lower-speed steering (247–306, proof 11548522472): VISUAL PASS, major steering-readability issue corrected.** Source frame **272**: clear green-accent **OPPOSING RESPONSE** with **FRONT CAR RIGHT / REAR CAR LEFT**. Direction comparison is explicit and readable at mobile portrait scale, with guide indicators aligned alongside actual front/rear wheels. Physical yaw is intentionally subtle; there is no obviously fake large wheel angle. The secondary microtext at the very bottom of the panel will be too small on many phones, but it is nonessential; the principal response/direction labels remain legible. **Nonblocking polish F-NEW-P01**: increase microtext or remove it.

**307–311, proof 11546544603: VISUAL PASS**, five sequential frame images connect the low-speed driving beat to the matched 312–371 footage without a clear jump in car pose, visible frame corruption or accidental change in response label.

**Matched lower→higher switch (312–371, proof 11548552591): VISUAL PASS.** Actual source frame **332** still shows opposing front/right–rear/left. At the exact editorial mode boundary **333 (11.100 s)** the panel correctly changes to **ALIGNED RESPONSE**, with both FRONT/REAR **CENTRED** in an actual near-straight state. Source **336** shows **FRONT CAR LEFT / REAR CAR LEFT**. Geometry, on-screen labels and retained camera angle give the viewer a truthful opposite-versus-aligned comparison without faking amplified rear wheel yaw. Captions crossfade around the cut and do not suggest wrong-mode footage.

**Higher-speed steering (372–431, proof 11548576922): VISUAL PASS.** The panel shows **ALIGNED RESPONSE**, both directions same during visible turn and **CENTRED / CENTRED at frame 397** when steering is straight, rather than manufacturing a false bend. The text “HIGHER SPEED / STABILITY” is legible with good contrast. Road/trees move, tyre centres stay reasonably steady. No obvious wheel wobble or wheel/body separation observed.

**Roadside driving (432–551, proof 11548780809): VISUAL PASS, prior 4-second car crop fixed.** At **432/455/479/497/503/527/551**, the entire Porsche and wing remain inside the view while asphalt kerbs, guardrail, trees and gantry shift in perspective; vehicle reads as driving on track instead of a static turntable. More empty track surrounds the car and the vehicle is smaller on-screen; optional tighter-but-complete framing could improve urgency, but returning to old wing clipping is not recommended.

**Roadside→exit bridge (552–566, proof 11548412328): VISUAL PASS**, now covers the former missing 15 frames, car and road moving without an obvious freeze or boundary glitch.

**Active exit first section (567–596, proof 11547945616): VISUAL PASS.** Source **567/572/578/584/590/596** shows the Porsche approaching an actual trackside camera, increasing in apparent scale and moving decisively; this is not a frozen hero card. Tyre contact looks credible. A partial cinematic crop at the end of the close pass is intentional, unlike the earlier full-shot sustained crop.

**Unreviewed exit middle (597–686): NOT EXACT-NEW-SOURCE VISUALLY VERIFIED.** 90-frame gap spanning the close-pass/chase transition may hide a camera change or motion defect. Previous nine-clip run had footage of this region from a **different** immutable film SHA. **Blocking evidence gap F-NEW-02**. Owner H: publish exact-new-source 597–686 native video, or a complete 720f approved-source muted film preview, so F can inspect actual mid-exit continuity. Do not use old clips as full proof.

**Final ending (687–719, proof 11547991357): VISUAL PASS.** Film frames **687/693/699/706/712/719** show Porsche continuing to move along racetrack in three-quarter view with unobtrusive YUNEX branding, no freeze and no abruptly terminated static title. Trajectory and contact appear plausible.

## Quality gate matrix

| Independent criterion | Decision |
|---|---|
| All 11 exact-new-source native videos valid/played as decoded sequences | **PASS** |
| Correct lower-vs-higher steering explanation / main overlay labels | **PASS** |
| Specific old problem frames 272, 336, 397 | **PASS** |
| Matched editorial transition at 333 | **PASS** |
| Opening framing and car hero on track | **PASS** |
| Full-car roadside composition + parallax | **PASS** |
| Visible wheel stability and grounding in provided proof clips | **PASS with normal visual limits** |
| Rear brake caliper non-spin / rim wobble during the macro 84–149 | **NOT PROVEN at corrected source** |
| All 720 frames covered by exact corrected native movie evidence | **FAIL** (156 missing) |
| Complete active-exit handover through frame 686 | **NOT PROVEN at corrected source** |
| Real-time Cedar audio synchronization / final mux | **NOT AUDITIONED** — full AV master is a later G/F gate |
| Approval for Agent G's 720-frame final master render | **HOLD — NOT APPROVED** |

## Honest final decision and specific unblock actions

The **newly corrected frames themselves PASS** visual inspection and fix both prior blocking visual-quality issues (indecipherable low/high explanation and awkward sustained car crop). I found **no new confirmed blocking *visual defect*** in the 11 actual corrected MP4s. Their strict codec, hashes, complete decodes and source provenance all PASS.

**However, overall independent F pre-render RELEASE GATE remains FAIL/HOLD due materially incomplete exact-source moving proof,** specifically rear-wheel macro **84–149** where upright-mounted calipers need demonstration, and active exit **597–686** where pass/chase continuity matters. Those 156 frames cannot be certified from clips of another source SHA. H should publish **two** additional exact-SHA clips with full artifacts and metadata. F then reviews those clips only and, if clean, issues an additional PASS for the fully proved corrected source. The muted clips do not establish real-time voice sync; final audio technical/creative QA remains a separate release-stage check.

**Manager must not set final `render_source_sha` or authorize G on the strength of this scoped visual PASS alone.** No code, Porsche model, animation, renderer, or another agent's owned file was changed by Agent F.
