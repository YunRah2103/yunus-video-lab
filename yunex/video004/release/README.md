# YUNEX 004 two-version release

Approved geometry/animation/camera/teaching source remains `1e2ab54e77090ec9c95c119488bc87d7ab7a45ba`. F final visual PASS and E full 13-clip audit apply to these exact unmodified source frames. The Master, explicitly authorized by the user to finish directly, verifies combined-source equivalence and exact approved AAC publication; this does not impersonate a new Agent F review.

Audio is committed byte-exact at `yunex/video004/audio/y004-approved-cedar-24s.m4a`: 753974 bytes, SHA256 `a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`.

## Editable versions

Remotion registrations: `YUNEX-004-CINEMATIC`, `YUNEX-004-DYNAMIC`. `ReleaseEdits.tsx` keeps finishing choices frame-driven and editable. Default cached mode uses the native approved visual plate; set `cached:false` to regenerate live Three.js source through the preserved rig and cameras. Stage the approved audio under `public/y004-release/approved-audio.m4a` in either mode. The finishing script stages both cache and audio when `--public yunex/public/y004-release` is provided.

Cinematic preserves original native visual streams and approved audio packets. Dynamic adds a 10% top-left anchored opening crop, a 14% centred roadside crop, short green accent reveals below the titles and a final identity underline. Rear macro and teaching geometry/framing remain unchanged. Narration timing is identical; no speed changes.

`finish_dual.py` verifies every input artifact SHA and source pin, exact coverage 0–719, native format, decoder integrity, and approved audio hash. It assembles Cinematic without reencoding its native H.264. Dynamic uses a single CRF16 finishing encode. Both outputs undergo full decoder/count/format checks, decoded per-frame hashes, adjacent-duplicate detection, exact approved AAC packet/timing comparison and faststart checks. Decoded A/B frames must actually differ.

## Reproduce without 3D rerender

Download the 13 artifact IDs listed in `finish_dual.py`, extracting each into a separate directory. Run:

```bash
python3 yunex/video004/release/finish_dual.py --clips release-clips --audio yunex/video004/audio/y004-approved-cedar-24s.m4a --out release-final --public yunex/public/y004-release
```

The dedicated branch workflow runs the same checks and publishes both actual MP4s. It never triggers the Manager/I/G full geometry render. New release commits require `[Y004-DUAL-RELEASE]` and a workflow-path change, preventing report-only pushes from rendering again.

Keep MP4s/cache out of Git. Actual binaries are published as release artifacts and delivered to the user. All prior episode modules remain unmodified.
