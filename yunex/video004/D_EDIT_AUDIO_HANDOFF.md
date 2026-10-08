# Agent D — Y004 EDIT / NARRATION / SOUND
ROLE: Sol editorial and audio specialist. Phase Y004-REAR-STEERING-01. BRANCH: `sol/y004-d-edit-audio`.
## Mandatory source and workflow
Repository `YunRah2103/yunus-video-lab`; phase `Y004-REAR-STEERING-01`. Read `yunex/video004/START_HERE.md`, `yunex/video004/MANAGER_CONTRACT.md`, `yunex/video004/TASKS.json`, this role handoff and original `yunex/video004/MANAGER_IMPLEMENTATION_HANDOFF.md` in that order. Initial accepted P03 source SHA: `451728dcbc8e36cc9f54fb94e00bdefbdf068f51`. Master handoff publication SHA: `2522f1379712f7ccbeca68d350dfa592a1f6ff97`. Your personal branch was created from a pinned Manager-dispatch commit; verify its exact remote SHA before editing. Never start from `main` or use an old Y003 role handoff.
You are a SEPARATE user-started ChatGPT chat. Do actual implementation; do not spawn, delegate, or only produce another handoff. Fetch current remote ref before every push, never force-push, and keep changes to owned paths. You cannot assume other chats' progress. If dependencies are missing, make independently testable progress and report exact blocker; do not invent completion.
Source is the corrected Y003-P03 Porsche; leave older compositions and car GLB unchanged. Porsche SHA256 `1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb`. Reuse P03 actual GLB spin axes, quaternion wheel transforms, world asphalt height, pose-following shadows and track identity. Only Manager edits `yunex/src/video004/contracts.ts`, `yunex/src/video004/timeline.ts`, `yunex/src/video004/Video004.tsx`, `yunex/src/index.tsx`, `yunex/video004/TASKS.json` or shared Y003 production files.
Every delivered proof needs exact remote source SHA, native moving frames/time range, fps, resolution, actual artifact/run ID or accessible persisted clip. Stills/test logs alone are not moving proof. Report failures truthfully.

## Exclusive owned modules
`yunex/src/video004/edit/**`, `yunex/src/video004/audio/**`, `yunex/video004/audio/**`, `yunex/video004/reports/D/**`. New `yunex/public/y004-*` narration/sfx assets are permitted when size and license allow; large audio needs persistent artifact ID and manifest instead of git. NEVER change Y003 audio, old timelines or Manager's central timeline and registration.

## Script — text authoritative; create NEW spoken recording, not Y003 voice
"The rear wheels on this Porsche steer too.

At lower speeds, they can turn slightly against the front wheels, helping the GT3 RS change direction more quickly.

But at higher speeds, they turn with the fronts instead.

That makes the car more stable through fast corners and direction changes.

So even the rear wheels are helping this Porsche turn."

59 words. ~24-second film (720 frames) is PROVISIONAL until actual audio length measured. Calm voice with natural pauses. Use established Cedar voice or approved equivalent only when actually accessible; do not claim synthesis or recording if source unavailable. If recording cannot be sourced, record precise blocker and still implement caption/layout/cues, not silent placeholder treated as finished. Timing of low/high cuts must follow actual phrase boundaries. Avoid speech cuts, pitch/time stretching and excessive reverb. If duration exceeds envelope, report exact measured seconds and minimal trim proposal to Manager; only Manager locks final integer frames.

## Goal / tasks
- Deliver real Y004 narrated take or actionable audio-source blocker; measure sample duration / sentence timestamps, document source hash/rights and spoken transcript.
- Implement YUNEX004 edit typography layer in own dir with hook within 0–2.8s: 'THE REAR WHEELS / TURN TOO'; low 'LOWER SPEED / AGILITY'; high 'HIGHER SPEED / STABILITY'; YUNEX subtle exit. Retain premium green typography, readable 9:16 mobile margins, movement every 1–3 s and at most two cue groups.
- Reuse existing P03 audio utility techniques without modifying them; deterministic automotive bed + subtle roadside pass, SFX ducking under narration, no third-party recording without provenance.
- Export cue metadata consumable by Manager timeline and test against provisional then locked frame count. Provide clean reference mix, narration isolated, detailed mix and asset manifest.

## REQUIRED PROOF
Measured VO duration and timestamps, audio waveform/decoder metadata and no-clipping tests, 3–5 s proof of typography over moving composited reference if access allows. Do not synthesize fake 'speech complete' claims. Ensure readable with sound muted.

## Done / return
Actual audio/caption code, recording or explicit blockage, manifest/audio checks, remote branch and FULL SHA. No competing 004 composition.
