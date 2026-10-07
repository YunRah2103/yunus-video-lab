# YUNEX 003 — FINAL DELIVERY QA

Phase: `Y003-SUSPENSION-AERO-01`  
Role: H-style independent final delivery QA  
Manager branch: `sol/y003-suspension-manager`  
Approved render source: `805c74fc2f749ed701c95d1aa5809e60e5a02d76`

## Final result

**PASS — implementation and delivery QA are complete. GPT-6 Master creative review remains required.**

This report does not grant Master creative approval.

## Pre-native proof gate

- H evidence QA run: `37545958293` — PASS
- Sampled proof artifact: `11450546449`
- Native still artifact: `11448604207`
- H specialist SHA: `1408f1d1b6a525c182385b8bf302b7fea0ad7cf6`

The pre-native visual gate was already passed and was not repeated from scratch.

## Assembly failure diagnosis

The original native run `37546004860` rendered all 37 chunks successfully, covering frames 0–734.

Representative chunk artifacts were downloaded and probed directly:

- first: `0000-0019`
- middle: `0360-0379`
- last: `0720-0734`

All three are H.264, 1080×1920, 30 fps and report `yuvj420p` (20 / 20 / 15 frames).

**Diagnosis: CASE A.** The individual native chunks themselves are `yuvj420p`. A stream-copy concat therefore preserves `yuvj420p` and cannot satisfy the required `yuv420p` delivery contract. The validator was not weakened.

## Corrected authoritative native delivery

Authoritative corrected workflow:

- Run: `37582160590`
- Workflow: `YUNEX 003 proof-approved native visual`
- Workflow head: `00e456a2367869c1bdedcbe7e691a874adaf9c62`
- Assemble job: `112669838502` — PASS
- Final artifact ID: `11465758048`
- Artifact name: `YUNEX-003-NATIVE-VISUAL-805c74fc2f749ed701c95d1aa5809e60e5a02d76`
- Native visual SHA256: `feb830e8330eb8a0b58360174578fd6287cd5cfeb7824a42361af85355efc8a6`

The assembly path concatenates the 37 native chunks, then performs one deliberate H.264 normalization encode to true `yuv420p`, followed by the strict validator and a complete decoder pass.

Independent rescue confirmation run `37584525565` also completed successfully using the exact successful chunks from the original failed run `37546004860`. It did not rerender the 3D scene and is not the authoritative final run.

## Technical export validation

The corrected native visual validates as:

- width: 1080
- height: 1920
- frame rate: 30 fps
- exact frame count: 735
- duration: 24.500 s
- codec: H.264
- pixel format: `yuv420p`
- color range: TV / limited
- complete FFmpeg decoder pass: PASS
- exact decoded frame count: 735
- no exact consecutive duplicate video frames detected

The Actions artifact contains `validation.json`, `visual-manifest.json`, `visual.sha256`, the seven requested native PNGs and `review/contact-sheet.png`.

## Native visual review

Milestone frames visually inspected:

- 27 — hook
- 144 — turn-in
- 234 — moving suspension reveal
- 306 — aero-link/profile explanation
- 492 — braking/load response
- 603 — whole-car reconnection
- 711 — active exit

A 1 fps chronological progression review was also performed. The film progresses coherently from driving hook through moving suspension/aero explanation and load response to an opaque whole-car moving exit.

Chunk-boundary motion was checked rather than inferred from tests. The largest sampled local change near a chunk boundary was inspected as a short sequence and reads as intentional camera/reveal progression, not a concat seam.

No final-delivery blocker was identified in the reviewed film for:

- dead or stationary outro
- missing/black final section
- obvious concat seam
- exact duplicate frame hold
- broken whole-car reconnection
- giant or detached airflow treatment
- obvious camera clipping in the reviewed milestones
- visible missing Porsche body sections in the reviewed milestones

## Final audio master

Persistent review master:

- Library path: `/Video Projects/YUNEX 003/Manager/YUNEX_003_MASTER_REVIEW.mp4`
- Library ID: `libfile_d017354ae8608191ab5b281b19a65db2`
- SHA256: `69ed819e41c9aff6e813bbbec010c227e13e0665f90780ff83a0f99a2e47872e`

Validated master facts:

- 1080×1920
- 30 fps
- 735 frames
- 24.500 s
- H.264 `yuv420p`
- AAC stereo, 48 kHz
- full decoder pass: PASS
- approximately -21.1 LUFS integrated
- approximately -5.2 dBFS true peak

Authoritative narration provenance:

- source: `openai-fm-cedar-friendly.mp3`
- Library ID: `libfile_6e284ae6e75c819197dd652690e22ae8`
- source SHA256: `826d7863cd4ec135e0352e9800f47b54239f8ba1d4c0d98ff5909a071905cfbb`
- measured source duration: 23.256 s
- recorded wording: “So on a GT3 RS...”
- narration was not trimmed, time-stretched, regenerated or replaced

Agent F's deterministic 24.5 s preflight/reference mix SHA256 is `c1d8d22acd3753c6320ab6ad3f3867f456bcae933157181a06b0ae4836755f13`. It uses the supplied narration plus a restrained procedural engine/road/wind bed and introduces no unprovenanceable third-party engine recording.

## Scope of PASS

This PASS certifies the implementation/delivery package and the final technical/chronological QA gate. It does **not** certify subjective publication-level creative approval, nor does it claim that the conservative Agent F reference sound bed cannot be improved.

The next gate is GPT-6 Master review of the actual finished movie.

**FINAL H DELIVERY QA: PASS**
