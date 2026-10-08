# YUNEX 004 — AGENT D AUDIO DELIVERY (APPROVED CEDAR TAKE)

**STATUS: PASS — D audio files and hashes published, pending Manager video integration.**

Locked YUNEX 004 source: `YUNEX_004_Cedar_source.mp3`, actual SHA256 `db75bbbe6aa468062b300004390f23f254679086e2b69d0de6aa1d553c8d404b`, 22.704s, MP3 24k mono, 363264 bytes. The original MP3 is in user's Library at `/YUNEX_004_Cedar_source.mp3` (not GitHub). **This is a new Y004 Cedar recording, not Y003 audio.**

The **user-approved *new* spoken transcript** is in `yunex/src/video004/audio/cues.ts` and `APPROVED_AUDIO_MANIFEST.json` — not the older Master provisional script. Five phrase boundaries were *independently* confirmed acoustically with FFmpeg `silencedetect=noise=-34dB:d=0.12` to within 0.006s of the Manager's proposed windows. User/Manager authenticated the *words*; no ASR or independent human audition has been performed by this Agent D session. This is disclosed rather than claiming semantic listening.

## Finished deliverables (persisted in user's Library)
All files in `/Video Projects/YUNEX 004/Agent D/`:

| File | SHA256 | Duration | Peak |
| --- | --- | --- | --- |
| `YUNEX_004_Cedar_isolated_24s_48k_stereo.wav` | `07ec8e2d14d28e585668b3084c48657329ba4f1e8b9e52c838c46613c0f3334e` | 24.000s | -7.864 dBFS |
| `YUNEX_004_Cedar_final_mix_24s_48k_stereo.wav` | `526e558cdeaf7dbf5bf01dddf68b374ad06b88d19c7122828e426d7e6494621e` | 24.000s | -8.029 dBFS |
| **`YUNEX_004_Cedar_final_mix_24s_48k_stereo.m4a`** | **`a2f5dc284ce923a4d6803b66c2d45a1d3502a2be0024c8e3b1d2658c5bdb1e51`** | **24.000s** | **-8.035 dBFS** |

The M4A is 48k stereo AAC 256 kb/s and is the Manager/E mux-ready audio file. Isolated source preserved intact at native tempo and padded to frame 720; no pitch/stretch, speech replacement or clipping. Stem/source decoded maximum difference < 4e-7. Final mix uses *existing verified* Y004 bed SHA256 `960b4dddecd55051a1df66e0c4e6ffde94feda6f8190cff786160b4281f36ee6`; smooth signal-driven ducking under the five genuine sentence intervals.

## Recorded sentence boundaries (independent acoustic check)
- S1 `0.000–2.755`
- S2 `3.650–10.613`
- S3 `11.608–14.232`
- S4 `14.979–17.866`
- S5 `18.858–22.577`

**Critical Manager note:** The high-speed visuals must NOT start at stale `285f/9.5s`, while narrator is still explaining lower speeds. Agent D editorial windows now propose high-start at `333f/11.1s`, and the Manager must update its owned central motion shot plan and revalidate native visuals.

## Reproduce and verify
Runtime Python 3 + numpy + scipy + soundfile + ffmpeg/ffprobe. Original source and Y004 bed must exist locally.

```bash
python yunex/video004/audio/complete-approved-voice.py \
  --source /path/to/YUNEX_004_Cedar_source.mp3 \
  --bed /path/to/y004-bed-24s-PROVISIONAL.m4a \
  --out /path/to/rendered-audio
```

This script hard-rejects wrong source/bed SHA, wrong durations/channels and acoustically incorrect phrase boundaries; asserts true 720f*30fps 24s outputs, full decoder, output hashes and PCM preserved speech and peak safety. A detailed native evidence manifest is in `APPROVED_AUDIO_MANIFEST.json`.

**Release distinction:** Audio mixing D PASS; Y004 *video* release remains blocked until Manager owns integrated shot alignment, F independent QA passes and E actually muxes a validated native video. No claim of finished MP4.
