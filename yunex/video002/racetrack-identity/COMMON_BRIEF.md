# YUNEX 002 — RACETRACK IDENTITY

Phase: Y002-RACETRACK-IDENTITY-02
Repository: YunRah2103/yunus-video-lab
Handoff/integration branch: sol/y002-track-identity-manager
Verified starting source: sol/yunex-002-landscape-fix @ 8a02cc405d0f9958301c24cc4ce3add824f28288

## Current state and locked direction
The finished film is good; the environment reads as a random road beside a barrier and foliage. Fix its TRACK IDENTITY. Build one coherent fictional racetrack SECTION, not an entire circuit. Keep the approved white/green Porsche geometry, materials, livery, rig and active aero byte-identical. Preserve VO, sound, 751-frame / 30fps edit, typography and camera system. The car stays on track in every shot.

Create a connected racing surface with believable width, continuous edges, selected red/white apex/exit kerbs, restrained painted runoff and gravel/grass zones. Barriers sit beyond runoff and follow the course; greenery belongs in the infield/outside terrain. Show a gentle bend beyond the existing straight hero/driving corridor to establish circuit context. Do not bend the road beneath the locked car trajectory. No motorway markings, scattered props, giant grandstands, random forest rings or scenery expansion. Car remains the visual hero. This environment must be reusable through the existing quality/seed interface.

## Routing and safety
Read START_HERE.md and TASKS.json in this directory, then your role handoff. Older track-upgrade/airflow prompts are historical, even if they reuse your agent letter. Do actual implementation; do not merely update instructions. No additional agents. Work only on your assigned branch/files. Manager alone owns central integration and registry changes. Never force-push or replace another agent's work. Re-fetch the manager registry before coding and before push; report phase/role/input SHA/output branch/full output SHA. Verify the remote head after pushing. If the registry and handoff disagree, ask Manager to resolve it.

Manager pins a layout-contract commit after A. B/C/D start from that exact commit. E/F may perform read-only baseline/pipeline inspection immediately, but must use a pinned integrated SHA for final QA/render. New branches are created by their owners, not guessed to already exist.

## Technical constraints
Use existing Three.js/Remotion/FFmpeg infrastructure. Context7 for current API questions; Superpowers for planning/debugging/verification when useful. No forced Floot/Replit adoption. Existing track root position [-1,-0.028,0], yaw PI; +Y up. Inspect actual car/camera transforms before changing layout. Preserve wheel contact, grounded shadows and camera clearance. Eliminate legacy rectangular road/backing-plane seams if visible; Manager owns composition changes. Avoid per-frame geometry/textures and excessive alpha foliage/shadow cost. Approved car SHA256: 1c73fcb138c31e2b1d5ed126a2412074bb17f8e960b355436f28139bf518e1eb.

## Every specialist's completion package
Push implemented files and reproducible proof/QA sources. Return phase, role, exact input/output SHAs, changed files, actual proof links, tests, limitations and remaining dependencies. Native stills must be 1080x1920, scale 1; reduced-resolution motion proofs are allowed only when labelled. Do not render the full film independently: F owns that. Escalate changes to car/camera/story/architecture, uncertainty about coordinates, cheap-looking output or scope outside ownership. Manager handles routine integration bugs. Astra retains final creative approval.
