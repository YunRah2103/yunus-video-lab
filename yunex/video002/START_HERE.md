# YUNEX 002 — START HERE
Current phase ID: Y002-TRACK-UPGRADE-01
Repository: YunRah2103/yunus-video-lab
Canonical integration branch: sol/yunex-002-active-aero
Routing revision: 2026-10-06. This file is authoritative for task selection; read it on the canonical integration branch even when your work branch is older.

## Current mission
Upgrade the existing small racetrack and produce a true native 1080×1920 final with audio. Original active-aero implementation A–D is already integrated. Do NOT repeat it. Preserve Porsche, edit/timing/cameras and aero mechanics. Separate user-opened chats, no internal agents.

## Exact assignments
All handoff paths below are relative to yunex/video002/.
| Role | Current task | Handoff | Work branch |
|---|---|---|---|
| Manager | Track integration and final delivery | track-upgrade/MANAGER_HANDOFF.md | sol/yunex-002-active-aero |
| A | Road surfaces and kerbs | track-upgrade/A_ROAD_HANDOFF.md | sol/yunex-002-track-road |
| B | Barriers and fencing | track-upgrade/B_BARRIERS_HANDOFF.md | sol/yunex-002-track-furniture |
| C | Foliage and background depth | track-upgrade/C_FOLIAGE_HANDOFF.md | sol/yunex-002-track-vegetation |
| D | Lighting, reflections and contact | track-upgrade/D_LIGHTING_HANDOFF.md | sol/yunex-002-track-lighting |
| E | Native render pipeline and audio delivery | track-upgrade/E_NATIVE_RENDER_HANDOFF.md | sol/yunex-002-native-final |

Agent letters alone are ambiguous. Always identify yourself with phase ID + role + task, e.g. "Y002-TRACK-UPGRADE-01 / C / foliage". C is NOT airflow; D is NOT edit/audio. Old aero handoffs are reference-only.

## Before starting
1. Read this routing file on the integration branch.
2. Open ONLY your assigned handoff. Inspect actual current work branch/code/results before changing anything.
3. Print phase, role, task, work branch and owned file paths in a short status note.
4. If an existing valid implementation is already on your branch, continue/verify it; do not restart from an old base or overwrite it.
5. Other assignments, creative changes or central-file changes belong to Manager.

## Git and completion contract
- Specialists commit/push ONLY their assigned work branch. Manager alone writes integration branch and merges/cherry-picks source.
- New branch starts from current manager-approved integration head. Existing work branches keep their history: do NOT reset/rebase just because routing docs changed.
- A local commit or attached ZIP is NOT a pushed implementation.
- After pushing, verify the remote branch resolves to your exact reported commit, inspect changed paths, and verify expected implementation files exist at that ref. CLI git ls-remote or GitHub connector fetch_commit/fetch_file can verify. If remote cannot be checked, say "REMOTE UNVERIFIED", not "pushed".
- Use no force-push. On lease/conflict rejection, re-read remote head and integrate conservatively.
- Return PHASE / ROLE / TASK / BRANCH / VERIFIED REMOTE SHA / IMPLEMENTATION FILES / TESTS / PROOFS / LIMITATIONS / READY FOR INTEGRATION yes/no.
- Manager marks integrated only when actual source commits are incorporated and tested, not because an agent says done. A head existing does not prove quality, tests or completeness.
- One coordinated render queue. Full native final only after track lookdev review. No upscaled proof called native; current visual-only continuity proof is not upload-ready.

## Initial remote audit (2026-10-06)
| Role | Remote evidence | Meaning |
|---|---|---|
| A | 3893c35596943f8fd1eeec5017f8a4c2d6f47b34 | Branch exists; Manager must review implementation/proof |
| B | adc17d6539bead1fae8d67283f565429a83de1d8 | Branch exists; Manager must review implementation/proof |
| C | Expected branch not found | Do not confuse old airflow proof with foliage delivery; locate/finish correct foliage work |
| D | 7f95c2000eef6635b395fcc275e069f5dea3350b | Branch exists; Manager must review implementation/proof |
| E | d9b9dd90a8147dc83acbe7a6463cab7a0cf19cea | Branch exists; benchmark/pipeline is not final film |
This is an audit snapshot, not a live status tracker. Manager updates current receipt/status with exact newer SHAs as work arrives.

## Historical material
SOL_MANAGER_HANDOFF.md, A_MECHANICS_HANDOFF.md, B_CAMERA_TRACK_HANDOFF.md, C_AIRFLOW_HANDOFF.md, D_EDIT_AUDIO_HANDOFF.md and SEPARATE_CHATS_START_HERE.md are superseded as execution instructions. Read only when current handoff explicitly cites them as engineering/creative reference. Do not search for a handoff by agent letter and choose the first match.
