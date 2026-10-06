# YUNEX 003 Agent F audio package

This directory is owned by Agent F for `Y003-SUSPENSION-AERO-01`.

- `cue-sheet.json`: verified supplied narration transcript and measured sentence/phrase cues.
- `audio-provenance.json`: source/treatment provenance and SFX audit.
- `build-f-audio.sh`: deterministic 48 kHz stereo narration conversion plus a restrained procedural preflight bed.

The exact supplied narration remains in ChatGPT Library as `libfile_6e284ae6e75c819197dd652690e22ae8` with SHA256 `826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb`.

The script refuses any other input SHA. It does not trim, time-stretch or replace narration. Final integrated automotive sound should use `yunex/src/video003/audio/y003AudioMixState` so engine/road/wind/pass/mechanical levels follow Manager-provided A motion and C camera state.

Recommended final duration: 24.5 seconds. The recording ends at about 23.15 seconds of speech, leaving roughly 1.35 seconds for the moving exit.
