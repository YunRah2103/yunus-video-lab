# YUNEX 004 — Agent E final proof recovery: independent native audit

**Agent:** E only. **Immutable corrected film SHA:** `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`. **E branch:** `sol/y004-e-render`.

## Status at audit run 37785037133, 8 October 2026

**Native evidence: VERIFIED PARTIAL (564/720), not complete.** Independent native-media audit job **113337483550: SUCCESS** for all **11 existing Porsche MP4 proofs**, including full decoder, source SHA, file SHA256, strict H.264 limited-range `yuv420p` + `color_range=tv`, dimensions **1080×1920**, **30 fps**, exact frame counts, clip-local zero-based presentation timestamps without frame gaps/overlaps. Coverage union has no overlaps; the two unrendered gaps are **156 frames**. **Five E negative/coverage unit tests passed.**

Evidence: [GitHub workflow run 37785037133](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37785037133), [artifact **11554735418**](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37785037133/artifacts/11554735418) (`Y004-E-EXACT-SOURCE-13-INTERVAL-NATIVE-AUDIT`). Artifact contains the actual-MP4 independent audit `E_ACTUAL_MP4_AUDIT.json` and checksums. This is **not** a 720-frame proof PASS.

### Reused actual native MP4 proof artifacts — 11/11 PASS

All from prior workflow [37769701749](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37769701749), exact corrected film SHA. Following MP4 SHA256 values originally reported by H and independently checked against downloaded actual MP4s by E audit:

| Label | Inclusive source frames | Artifact ID | MP4 SHA256 |
|---|---|---:|---|
| opening-0-59 | 0-59 | 11547392900 | `3c6e61fdad18b478a2cf0cd232a6cd0fd2a40576f864994bf2b02656f55abfce` |
| opening-tail-60-83 | 60-83 | 11548180309 | `3b35f8c16c577bf9048db038bd17983704ce8c8d43be880d0cf434ec1f3e54d6` |
| low-full-150-246 | 150-246 | 11549115114 | `4f7d4afdbc9928290b95f76ec8e72ba9b0b1f1fc4947d4437d5282f3e66d34fd` |
| low-247-306 | 247-306 | 11548522472 | `e28296c45485177fd02c8f2c338653f8450ff14c3fd7e8670f481f3ae1b833cb` |
| low-gap-307-311 | 307-311 | 11546544603 | `442de4943a49d76dd5f22771cdba61dd5b93e6de8ce19a85e563783187dcb9fc` |
| match-312-371 | 312-371 | 11548552591 | `588c834db8f098861358eb47c141de443fba7a656350e2d176dcbb999ff12467` |
| high-372-431 | 372-431 | 11548576922 | `3784fa26ef1d3829df7003cfdac4918bd3ae1aeb81caa53f3d87f615cb0fd56a` |
| roadside-432-551 | 432-551 | 11548780809 | `9aab859a39dd916890f5a5acdd7e8b7d9ea5cb21a1a905df2eb80b59462b0953` |
| roadside-gap-552-566 | 552-566 | 11548412328 | `9bd321e4a5d8997a2463ad5fea2efd63cbcdc164337035fa67f266e7ca7b7836` |
| exit-567-596 | 567-596 | 11547945616 | `db467b8d7d0352c619c5e03934c9f0bffe70fb7e893a72d1a346084e179fea84` |
| ending-687-719 | 687-719 | 11547991357 | `17f3b228f9577d9960f8dc89821dbdc57d65e15385858616afe05614181d5e0c` |

### Pending new native proof (NO MP4 hashes or artifact IDs yet)

| Sequence | Exact source frames | Required count | Original H job | State during E audit |
|---|---|---:|---:|---|
| rear-wheel-macro | 84–149 | 66 | 113325287977 | IN_PROGRESS — no artifact uploaded |
| active-exit continuation | 597–686 | 90 | 113325287706 | IN_PROGRESS — no artifact uploaded |

Original run [37781451513](https://github.com/YunRah2103/yunus-video-lab/actions/runs/37781451513) was still active; its 2 native jobs must be reused if successful, not duplicated. When those source-pinned MP4s arrive, E can run the **non-rendering** [artifact audit workflow](https://github.com/YunRah2103/yunus-video-lab/actions/workflows/yunex-004-e-proof-audit.yml) again, which checks both plus the previous eleven: exactly **13 disjoint clips covering frames 0–719 inclusive**. Absence of either segment forces `PENDING_UNRENDERED_GAPS`, never PASS.

### Agent E changes / scope

- `yunex/video004/render/audit_final_proof.py`: independent native MP4 decoder/provenance/SHA/range/fps/pixel-format/PTS auditing; explicitly reports verified and pending frame counts.
- `yunex/video004/render/test_audit_final_proof.py`: 5 metadata/negative cases to reject missing proof, overlap, missing range and invalid provenance.
- `.github/workflows/yunex-004-e-proof-audit.yml`: actually downloaded eleven previous real MP4s from GitHub Actions, ran strict independent audit and uploaded result artifact; **does not invoke Remotion**.
- `.github/workflows/yunex-004-e-final-proof-rescue.yml`: prepared **manual-only**, exact-film-source fallback for one failed original H segment. It requires selected original H job be **terminal failure/cancelled/timed_out**; it refuses rerenders for live/successful H jobs. No fallback job dispatched while H active.
- `yunex/video004/reports/E/FINAL_PROOF_RESCUE_STATUS.md`: this status report.

**Unchanged:** car GLB, steering motion, Remotion central composition, camera/guide and editorial, timeline, audio, Agent H work, F independent verdict, G final render.

### Next role gates

**Agent F** independently inspects the actual rear macro, active-exit continuation, neighbouring cut frames 83→84, 149→150, 596→597, 686→687, steering/wobble/caliper/contact/cropping and issues a genuine visual PASS/FAIL. **Manager** authorizes film source only after F PASS. **Agent G** exclusively owns full 720-frame film render and audio mux. Agent E does **not** grant these approvals.

**E verdict:** All available old MP4 evidence verified and reusable. **156-frame coverage gap is pending original H run; full evidence and G release cannot be claimed.** No duplicate expensive render was started.
