# Yunus Video Lab

Private workspace for Remotion video editing, reusable effects, TikTok projects, and the Tech Documentary Engine V4.

## Workflow

Use this repository as the source of truth instead of passing repeated ZIP handoffs between ChatGPT sessions.

1. Keep reusable systems in `engine-v4/` and `shared/`.
2. Put each individual edit in its own folder under `projects/`.
3. Keep large source footage, renders, cache files, and temporary media out of Git.
4. Use clear commits for meaningful versions such as `McLaren V8 - fix intro and sound timing`.
5. Preserve working versions before major experiments.

## Structure

```text
yunus-video-lab/
├── engine-v4/
├── projects/
│   ├── car-edits/
│   └── tech-documentaries/
├── shared/
│   ├── components/
│   ├── transitions/
│   ├── effects/
│   └── audio-utils/
├── references/
├── AGENTS.md
└── .gitignore
```

## Recommended project folder

```text
projects/<category>/<project-name>/
├── src/
├── public/
├── notes/
├── README.md
└── package.json
```

Large videos, audio files and final renders should normally stay outside Git unless they are small and genuinely useful as permanent references.
