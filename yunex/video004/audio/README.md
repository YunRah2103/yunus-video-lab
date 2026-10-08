# YUNEX 004 — Agent D audio production

**Gate: SFX BED COMPLETE; NEW APPROVED CEDAR NARRATION NOT AVAILABLE.** Do not mistake the asset below for narration or a final master mix. Y004's 720 frames/24 seconds remain provisional until a real recorded take has been measured.

## Published and verified effect
- Deterministic bed generator: `python yunex/video004/audio/build-bed.py --output /mnt/data/y004-bed-24s-PROVISIONAL.m4a --frames 720`
- Runtime dependencies: Python 3, NumPy, SciPy, FFmpeg/ffprobe.
- The output `y004-bed-24s-PROVISIONAL.m4a` was actually built twice from code; both binary SHA256 values match: `960b4dddecd55051a1df66e0c4e6ffde94feda6f8190cff786160b4281f36ee6`.
- 24.000 seconds, AAC 48 kHz stereo, 582089 bytes, FFmpeg full decoder PASS, peak -34.4 dBFS. User-accessible chat artifact: `sandbox:/mnt/data/y004-bed-24s-PROVISIONAL.m4a`.
- Entirely procedural engine/road/wind/roadside pass effect with restrained levels; no real Porsche performance or speed specification and no third-party recordings. For Manager integrated release replace provisional shaping with per-frame `y004AudioEnvelope` driven by the accepted A motion and C camera.

## Strict finalization of *new* recorded Y004 voice
The real approved new Cedar take (or user-approved equivalent) must be externally supplied as an audio file. The older Y003 Cedar source with SHA256 `826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb` is explicitly rejected and has different narration.

Before final processing, listen to new take, measure five actual sentence starts/ends, hash the source, document name/rights, and create `new-recording-approval.json` with fields:

```json
{
  "speaker": "Cedar",
  "source_rights": "user-generated OpenAI FM source, explicitly approved for Y004",
  "source_sha256": "ACTUAL_64_CHARACTER_SHA256",
  "human_verified_transcript": true,
  "sentences": [
    {"id":"s1","text":"The rear wheels on this Porsche steer too.","startSeconds":0,"endSeconds":0}
  ]
}
```
The example illustrates the schema **only**: replace all five rows with the exact authoritative sentence strings in `src/video004/audio/cues.ts` and actual sample-measured timestamps. It is NOT an approved cue sheet.

Run after actual recording is available:

```bash
python yunex/video004/audio/finalize-recording.py \
  --source /path/to/y004-new-cedar.mp3 \
  --approval-json /path/to/new-recording-approval.json \
  --out /path/to/y004-audio-out
```

Use `--manager-locked-frames N` only after Manager sets the final timeline; the finalizer refuses to truncate speech. Output includes the isolated 48 kHz stereo voice WAV, reference voice/SFX mix WAV, actual ffprobe metadata and SHA256 manifests, decoder passes and measured peak validation. Do not pass its reference mix as the final production master before Manager approval.

## Tests
```bash
TS_NODE_COMPILER_OPTIONS='{"module":"CommonJS"}' ts-node --transpile-only yunex/src/video004/audio/audio.test.ts
python yunex/video004/audio/test-audio-gates.py
bash -n yunex/video004/audio/prepare-vo-mix.sh
```
Unit tests use synthetic cue objects only to assert that the gate rejects bad source/timestamps. The tests do NOT create, authorize or measure a real narration take.

## Exact remaining user action
Export **one new recording speaking the five Y004 rear-axle-steering sentences** using the established OpenAI FM Cedar voice, then attach the MP3 here or save it in a Library location accessible to Agent D. No text-to-speech service connected to this session can generate the approved Cedar take automatically. Once the source exists, source verification, time measurement, actual mix and persistent publication become possible.
