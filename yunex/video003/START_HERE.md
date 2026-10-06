# YUNEX 003 — CURRENT START HERE
Phase: Y003-SUSPENSION-AERO-01
Routing revision: EXPANDED-A-H
Canonical coordination/integration: sol/y003-suspension-manager
Production base: 50fd478256bbe12d37410e78678bd7c302d96434

## Nine SEPARATE user-started chats
No internal agent spawning. Handoffs do not automatically start execution.
Read MASTER_HANDOFF.md for creative/technical decisions, MANAGER_EXECUTION_HANDOFF.md for execution, TASKS.json for pins/ownership, then exact role file.

| Chat | Current handoff | Work branch |
|---|---|---|
| Manager | MANAGER_EXECUTION_HANDOFF.md (also MASTER_HANDOFF.md) | sol/y003-suspension-manager |
| A — Driving dynamics and runtime articulation | A_MOTION_HANDOFF.md | sol/y003-driving |
| B — Front suspension mechanical geometry | B_SUSPENSION_HANDOFF.md | sol/y003-suspension |
| C — Automotive cameras, moving reveal and track adapter | C_CAMERA_HANDOFF.md | sol/y003-cameras |
| D — Suspension aerodynamic explanation | D_AIRFLOW_HANDOFF.md | sol/y003-airflow |
| E — Edit timing, typography and finishing | E_EDIT_HANDOFF.md | sol/y003-edit |
| F — Supplied narration, automotive sound and timing | F_AUDIO_HANDOFF.md | sol/y003-audio |
| G — Native render pipeline and final export | G_RENDER_HANDOFF.md | sol/y003-render |
| H — Independent driving, mechanical and visual QA | H_QA_HANDOFF.md | sol/y003-qa |

E_DELIVERY_HANDOFF.md is SUPERSEDED. E edits/typography only; F audio; G render; H independent QA. Historical Y002 letters/tasks do not apply.

## Start order / avoid idle agents
Start Manager first, then A–H. All roles can inspect/preflight their domains immediately. Manager publishes exact input pins and minimal shared contract.
A publishes motion contract early. B static reference geometry can progress concurrently, binding A after approval. C cameras/reveal can be dependency-injected while A matures. D prepares flow utilities/reference then binds A+B. E typography prototypes, F audio cues, G pipeline benchmark and H independent rubric start independently.
Only Manager integrates shared composition/types/timeline/root registration and updates TASKS.
H reviews integrated moving proofs. Manager then pins render_source_sha and releases G full native rendering. H independently reviews final export. Master creative approval remains pending actual movie review.

## Narration
Use supplied openai-fm-cedar-friendly.mp3 unchanged.
Library ID: libfile_6e284ae6e75c819197dd652690e22ae8.
Measured: 23.256s, MP3, 24kHz mono. Separate chats retrieve through attachment/Library capabilities, not presumed shared local path. F maps actual sentence cues early. Film around 24–25s including active exit; source recording governs timing.

## Completion truth
Actual implementation + real proofs + verified remote full SHA required. Do not report done after writing instructions. Source QA and static frames do not establish driving realism. Native final is 1080x1920 scale1 30fps; reduced drafts labelled.
User may be offline; proceed with routine reversible authorized decisions. At true blockers checkpoint exact state and dependencies honestly. Do not assume chats/workflows remain running after a turn ends.
