# YUNEX 004 — NEW ACTUAL CEDAR RECORDING (MANAGER UPDATE)

The user has supplied the real new Y004 Cedar MP3 and its corrected spoken transcript in the Manager chat. This is **not the earlier 59-word script**. Approved source fingerprint: `db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b`. Decoded duration: **22.704 seconds**; 24 kHz mono MP3, 363264 bytes. Peak about -4.9dBFS on the supplied MP3. This is a true newly supplied audio input, not a test tone or a reused Y003 narration.

Manager locks **720 frames at 30 fps (24.000 s)** as target export duration based on measured MP3, leaving **1.296 s** after MP3 end (spoken ending ~22.577 s). This does NOT assert final mix/native video readiness.

Exact user-supplied spoken lines:
1. The rear wheels on this Porsche steer too.
2. At lower speeds, they turn slightly against the front wheels, helping the GT3 RS rotate into corners more quickly.
3. But at higher speeds, they turn with the fronts instead.
4. That makes the car more stable when changing direction at speed.
5. So while you're driving, all four wheels are helping this Porsche turn.

Initial sentence windows estimated from FFmpeg silence detection and pending human listen:
- s1: 0.000–2.755s
- s2: 3.650–10.613s
- s3: 11.608–14.232s
- s4: 14.979–17.866s
- s5: 18.858–22.577s

## Critical blocking sync issue
Current integrated A shot plan enters `high-explain` at **285f / 9.5s**. Newly supplied Cedar says "But at higher speeds" beginning ~**11.608s**; lower-speed speech ends ~**10.613s**. Do NOT leave same-direction high visual playing during opposing rear-steer explanation. Proposed manager cut alignment: low-end/high-start around **333f / 11.1s**, high-explain to **432f / 14.4s**, high-drive until **552f / 18.4s**, active exit till frame 720. This is a working proposal subject to muted native proof/Agent A physical trajectory review, not permission to skip QA or render from stale chunks.

## To Agent D
Get the original YUNEX_004_Cedar_source.mp3 via direct user attachment or another legitimately accessible shared file. Compare actual SHA with the above hash. Do not fabricate local existence of the audio; the Manager chat attachment is **not automatically shared** with your separate chat. Confirm all 5 transcript sentences by listening, verify cues, update your owned `src/video004/audio/cues.ts` to the NEW text, run `finalize-recording.py`/source processing against the actual MP3, produce isolated voice + reference mix + hashes + decoder checks, and publish accessible artifacts. Your existing effect bed has been produced; preserve it.

## To Agent A / Manager integration
Modify shot-local segment boundaries without rescaling physical source speed incorrectly, so low opposite rear steer remains onscreen through low narration, then editorial-cut to high matched view right before s3. Preserve actual driving realism, camber axes, calipers and road contact. Source change invalidates affected native renders. Re-run moving proof and independent Agent F gate. Agent C re-check matched guide framing.

## To Agent E and F
720 frames is measured-source-locked but **render source is not yet locked**. Full render remains blocked until Manager finishes integration and short native QA. Final 24s audio needs AAC 48k stereo. F confirms spoken transcript, sync and no truncated ending.

Manifest: `VOICEOVER_SOURCE_LOCK.json`. The raw audio file itself is NOT committed to GitHub.
