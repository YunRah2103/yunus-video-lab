# YUNEX 003 — Agent F implementation report

Phase: `Y003-SUSPENSION-AERO-01`
Role: F — supplied narration, automotive sound and timing
Input/preparation SHA: `50fd478256bbe12d37410e78678bd7c302d96434`
Coordination reviewed at: `sol/y003-suspension-manager` (`7cff23f91ec3669e9354c18b1fd78790d2f427e0`)

## Supplied narration verified

- Library ID: `libfile_6e284ae6e75c819197dd652690e22ae8`
- Name: `openai-fm-cedar-friendly.mp3`
- SHA256: `826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb`
- Probe: MP3, 24 kHz, mono, 23.256 s, 128 kb/s, 372096 bytes
- Source loudness measurement: about -22.6 LUFS integrated, -3.6 dBTP

Verified transcript from the supplied file:

> Even the suspension on this Porsche helps make downforce. On the 911 GT3 RS, Porsche shaped the front suspension so air can move more cleanly underneath the car. That means the suspension is doing more than just controlling the wheels. Under braking and cornering, it also helps keep the car stable and controlled. So on a GT3 RS, even the suspension is part of the aero system.

The recording differs from the Master expected text only in the last sentence: recorded audio says `So on a GT3 RS`, not `So on the GT3 RS`. Per the handoff, the recording is preserved unchanged.

## Timing

Five sentence cues and ten phrase cues are committed in `yunex/video003/audio/cue-sheet.json` and mirrored in `src/video003/audio/cues.ts`.

Measured sentence speech regions:

1. 0.050–3.310 s
2. 4.150–10.300 s
3. 11.020–13.940 s
4. 14.710–18.570 s
5. 19.320–23.150 s

Recommended film duration is 24.5 s, leaving a short active exit after the final line without changing narration speed.

## Automotive sound interface

`y003AudioMixState()` is a pure deterministic adapter. It consumes only serializable facts so F does not guess/import unpublished A/C contracts:

- seconds
- speedMps
- longitudinalLoad01 / cornerLoad01
- cameraDistanceM
- tracksidePass01
- slowMotionScale
- mechanicalExposure01

It returns engine/road/wind/pass/mechanical dB gains plus the narration-driven duck amount. Speech activity is derived from the measured phrase cues with short fades, so effects are automatically restrained under narration.

## SFX/provenance audit

The Y002 production base contains a documented procedural engine/wind/mechanical reference bed but no provenance-complete real Porsche engine/pass recording suitable for direct reuse. F therefore introduced no unknown-license third-party SFX. The preflight bed is deterministic procedural engine harmonics + filtered road/wind noise; the final integrated gains should be motion/camera-driven through the F API. If Manager later adds a real pass or engine recording, provenance must be added before use.

## Reproduction / measurements

Command:

```bash
bash yunex/video003/audio/build-f-audio.sh /path/to/openai-fm-cedar-friendly.mp3 /tmp/y003-audio
```

Validated local outputs from the exact supplied MP3:

- `narration_48k_stereo.wav`: SHA256 `ab98de75380b4ea4c102ae18728d50bbf8e2820c255397b2b7ebb04b73d7b0bf`
- `f_preflight_mix.wav`: 48 kHz stereo PCM24, 24.500 s, SHA256 `c1d8d22acd3753c6320ab6ad3f3867f456bcae933157181a06b0ae4836755f13`
- preflight mix: about -21.1 LUFS integrated, -5.1 dBTP
- persistent processed narration: Library `libfile_0da66445a57c8191943370a478dc8c2f` (`/Video Projects/YUNEX 003/Agent F/narration_48k_stereo.wav`)
- persistent preflight mix: Library `libfile_1b289484438c819197c8e488f7cb83ac` (`/Video Projects/YUNEX 003/Agent F/f_preflight_mix.wav`)

The preflight mix is deliberately conservative and is not claimed as the final motion-locked mix. It proves source preservation, sample-rate/channel conversion, deterministic bed generation, ducking, duration and headroom.

## Dependencies / integration note

Manager registry still had `audio_cue_sha: null`, `motion_contract_sha: null`, and no final C camera contract when F began. F therefore completed all independent work and exposed a dependency-injected API rather than guessing shared types. Manager should pin this branch as the audio cue source, adapt A/C state into `Y003AudioMotionInput`, and use the exact supplied narration. Final pass/engine emphasis must be checked against the integrated driving proof before G renders the native master.
