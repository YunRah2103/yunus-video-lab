# AI / ChatGPT Working Instructions

This repository is designed to be edited with ChatGPT, Work, Codex and normal GitHub tooling.

## General rules

- Inspect the current project before changing it.
- Do not rebuild an existing edit from scratch unless explicitly requested.
- Preserve strong footage, timing and sound that the user has already approved.
- Prefer targeted revisions over broad rewrites.
- Commit meaningful changes with clear version-oriented messages.
- Do not add large source footage, rendered MP4 files, ZIP handoffs or cache files to Git.

## Remotion

- Keep reusable components out of individual projects when they are genuinely reusable.
- Put general transitions in `shared/transitions/`.
- Put general effects in `shared/effects/`.
- Put general UI/visual components in `shared/components/`.
- Put audio timing/helper code in `shared/audio-utils/`.

## Tech documentaries

Use `engine-v4/` as the reusable documentary engine.

Creative direction:
- hybrid archival footage + PS1 / Puppet Combo reconstruction
- calm documentary narration
- fast visual progression
- real footage should stay authentic when it is already strong
- use reconstruction only where real footage cannot provide the shot
- prioritize meaningful scene changes over constant camera movement

## Car edits

Car edits should prioritize:
- strong hook immediately
- premium footage selection
- beat-perfect cuts
- technical transitions used intentionally
- clean high-quality footage between heavy edit moments
- sound design that supports rather than overwhelms the visuals

## Versioning

Prefer commits such as:
- `DART V7 - improve impact and orbit motion`
- `McLaren V8 - fix opening hook and SFX timing`
- `Engine V4 - improve GLB normalization`

Avoid vague commits such as `update` or `changes`.
