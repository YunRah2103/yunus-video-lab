# YUNEX 004 / Agent D audio

**Current gate: VO SOURCE BLOCKED.** No new spoken YUNEX 004 take was published in the dispatch repository. The 720-frame storyboard and all edit windows are provisional; none is a sample-accurate transcript.

## Use after the actual Cedar/user-approved Y004 voice file is supplied

`bash yunex/video004/audio/prepare-vo-mix.sh /path/to/new-y004-voice.mp3 /tmp/y004-audio [manager-locked-frames]`

Creates lossless 48 kHz stereo narration, a restrained procedural reference mix, `ffprobe` metadata, decoded-file checks, peak inspection, and input/output SHA-256 records. Never time-stretches or silently cuts a voice to fit: with manager-locked frames, exits if speech will not fit, otherwise proposes a **reference-only** headroom length. The music/SFX bed is procedural for repeatability; any real engine or pass recording needs its own licensing/provenance. FFmpeg reference mix uses actual narration activity via sidechain, while TypeScript `y004AudioEnvelope` provides Manager's per-frame sound gains from A motion and C camera, and applies fail-safe speech ducking until true sentence timestamps exist.

Next: human-listen to the complete new recording; mark five sentence start/end times against actual samples and validate with `validateY004Narration`. Publish source SHA, rights, `ffprobe`, isolated narration, reference mix and peak results. Manager then locks integer frame duration and adjusts six shot windows to these real sentence boundaries. Do not publish `Y004_TIMING_STATUS` as measured, overwrite central timeline, or call this audio finished until those gates pass.

The raw narration source file must be made accessible to Agent D by the user or Manager. The previous Y003 spoken Cedar MP3 has entirely different words and must not be reused.
