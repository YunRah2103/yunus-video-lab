# YUNEX 003 — POLISH 02 — START HERE
Phase: Y003-POLISH-02
Repository: YunRah2103/yunus-video-lab
Canonical manager branch: sol/y003-suspension-manager
Historical production phase: Y003-SUSPENSION-AERO-01

## Objective
Polish the already-successful YUNEX 003 Porsche 911 GT3 RS film without restarting or redesigning it.

User-approved qualities to preserve:
- the Porsche is visibly driving and moving
- approved white/green Porsche
- supplied narration and existing mix timing
- 735 frames at 30 fps / 24.5 s
- existing story, typography and camera intent
- established suspension/aero educational concept

Only three visual weaknesses are in scope:
1. wheels look too wobbly
2. suspension needs richer credible mechanical detail
3. background needs to read as an established race circuit rather than sparse asphalt

## Parallel execution model
Nine separate user-started chats: Manager + A–H. No nested agents.
Every specialist must do actual work, push a real branch, provide proof, and return a full remote SHA.
Writing another handoff is not completion.

| Role | Handoff | Branch | Production write ownership |
|---|---|---|---|
| Manager | MANAGER_HANDOFF.md | sol/y003-suspension-manager | central integration only |
| A | A_WHEEL_RIG_HANDOFF.md | sol/y003-p02-wheel-rig | src/video003/motion/ |
| B | B_SUSPENSION_DETAIL_HANDOFF.md | sol/y003-p02-suspension-detail | src/video003/suspension/ |
| C | C_TRACK_WORLD_HANDOFF.md | sol/y003-p02-track-world | src/video003/track/ |
| D | D_WHEEL_DRIVING_QA_HANDOFF.md | sol/y003-p02-wheel-qa | QA/proof files only |
| E | E_SUSPENSION_TRACK_QA_HANDOFF.md | sol/y003-p02-visual-qa | QA/proof files only |
| F | F_INTEGRATION_PREFLIGHT_HANDOFF.md | sol/y003-p02-preflight | compatibility/QA files only |
| G | G_RENDER_DELIVERY_HANDOFF.md | sol/y003-p02-render | render tooling/workflow only |
| H | H_FINAL_QA_HANDOFF.md | sol/y003-p02-final-qa | final QA/report files only |

Manager alone edits Video003.tsx, shared timeline/types, root registration and the phase registry.
No force pushes. Do not modify the approved GLB. Do not change narration. Do not hide defects by stopping the car or wheels.

## Dependency flow
A/B/C work in parallel.
D can inspect baseline immediately and then validates A.
E can inspect baseline immediately and then validates B+C.
F performs compatibility/preflight after A/B/C outputs exist.
Manager integrates accepted A/B/C once, guided by D/E/F.
Manager reviews short native moving proofs before releasing G.
G renders exact pinned source.
H independently reviews the final movie.
Manager packages final delivery only after H PASS.

## Completion gate
Final revised master remains 1080x1920, 30 fps, 735 frames, H.264 yuv420p + AAC, faststart.
The Porsche model hash must remain unchanged:
1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb

No role may claim Master approval. Only actual visual review of the revised movie can close the phase.
